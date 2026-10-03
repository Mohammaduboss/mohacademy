// Function to handle switching between Analytical Tabs
function switchTab(tabId) {
    // Hide all contents and remove active class from buttons
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    
    // Show targeted content and activate clicked button
    document.getElementById(tabId).classList.add('active');
    event.currentTarget.classList.add('active');
}

// AI Grading submission with PRO verification
function submitLabForGrading() {
    // 1. Enforce Premium Tier Access by checking the correct storage key
    const currentUser = JSON.parse(localStorage.getItem('mohacademy_user')) || { isPremium: false };
    
    if (!currentUser.isPremium) {
        alert("AI Lab Grading is a PRO feature. Upgrade to unlock full A-Level derivations and AI evaluation.");
        window.location.href = 'pricing.html';
        return;
    }

    // 2. Proceed to Engine Integration
    alert("Report finalized. Ready to transmit table data, graph coordinates, and derivations to the Gemini AI grading engine!");
}

// --- SECURE GATEKEEPER ---
// Runs automatically when any lab page loads to prevent direct URL access
document.addEventListener('DOMContentLoaded', async () => {
    // 1. Get the current user
    const currentUser = JSON.parse(localStorage.getItem('mohacademy_user')) || { isPremium: false };
    
    // 2. Get the lab ID from the URL (e.g., ?id=ABT:10)
    const urlParams = new URLSearchParams(window.location.search);
    const labId = urlParams.get('id');

    if (!labId) return; 

    try {
        // 3. Fetch the catalog to check this specific lab's status
        const response = await fetch('http://localhost:5000/api/labs/catalog');
        const labs = await response.json();
        const currentLab = labs.find(lab => lab.experimentCode === labId);

        // 4. The Lock Logic: If the lab is premium AND the user is not, kick them out
        if (currentLab && currentLab.isPremium && !currentUser.isPremium) {
            alert("Access Denied: This is a Premium Virtual Lab. Redirecting to the laboratory hub.");
            window.location.href = 'labs.html';
        }
    } catch (error) {
        console.error("Security check failed to connect to database:", error);
    }
});