const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); 
const Student = require('../models/student'); 

// =========================================================
// 1. FAPSHI DIRECT PAY (LIVE)
// =========================================================
router.post('/initialize', auth, async (req, res) => {
    try {
        const { plan, amount, phone } = req.body;
        const studentId = req.student?.id || req.student?._id || req.user?.id || req.user?._id || req.userId;

        if (!studentId) return res.status(401).json({ message: "Invalid session identity." });
        if (!phone || !amount || !plan) return res.status(400).json({ message: "Missing details." });

        console.log(`[FAPSHI LIVE] Pushing ${amount} XAF to phone ${phone}...`);
        
        // 1. Fire the USSD Prompt via Fapshi Direct Pay (Live Mode)
        const directResponse = await fetch('https://live.fapshi.com/direct-pay', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apiuser': process.env.FAPSHI_API_USER, 
                'apikey': process.env.FAPSHI_API_KEY
            },
            body: JSON.stringify({
                amount: Number(amount), 
                phone: phone, // Sending the number directly from your UI
                externalId: studentId.toString()
            })
        });

        const directData = await directResponse.json();

        if (!directResponse.ok || !directData.transId) {
            console.error("Fapshi Direct Error:", directData);
            return res.status(400).json({ message: "Gateway rejected the request. Please verify the number." });
        }

        const transId = directData.transId;
        console.log(`[FAPSHI] Prompt sent! Ref: ${transId}. Waiting for PIN...`);

        // 2. The Polling Engine (Max 6 checks, 10 seconds apart)
        let transactionStatus = 'CREATED';
        let attempts = 0;
        const maxAttempts = 6; // 60 seconds maximum

        while ((transactionStatus === 'CREATED' || transactionStatus === 'PENDING') && attempts < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, 10000)); // Wait exactly 10 seconds
            attempts++;

            const statusResponse = await fetch(`https://live.fapshi.com/payment-status/${transId}`, {
                method: 'GET',
                headers: {
                    'apiuser': process.env.FAPSHI_API_USER,
                    'apikey': process.env.FAPSHI_API_KEY
                }
            });

            const statusData = await statusResponse.json();
            if (statusData.status) {
                transactionStatus = statusData.status; 
            }
            console.log(`[FAPSHI Check ${attempts}] Status: ${transactionStatus}`);
        }

        // 3. Handle the final outcome
        if (transactionStatus === 'FAILED' || transactionStatus === 'EXPIRED') {
            return res.status(400).json({ message: "Transaction failed or was cancelled." });
        }
        
        if (transactionStatus !== 'SUCCESSFUL') {
            return res.status(400).json({ message: "Transaction timed out waiting for PIN. Please try again." });
        }

        // 4. PAYMENT SUCCESS: UPDATE DATABASE 
        const daysToAdd = plan === 'yearly' ? 365 : 30;
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + daysToAdd);

        const updatedStudent = await Student.findByIdAndUpdate(
            studentId, { isPremium: true, subscriptionExpiry: expiryDate }, { returnDocument: 'after' }
        );

        console.log(`[PAYMENT SUCCESS] Student is now PRO!`);
        res.status(200).json({ success: true, message: "Payment approved! Account upgraded to PRO." });

    } catch (error) {
        console.error("Payment API Error:", error);
        res.status(500).json({ message: "Server error during payment processing." });
    }
});

module.exports = router;