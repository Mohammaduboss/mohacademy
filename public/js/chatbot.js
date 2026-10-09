/**
 * MohAcademy Global Interactive Science Chatbot Engine
 */

document.addEventListener('DOMContentLoaded', () => {
    const chatToggle = document.getElementById('chatToggle');
    const chatWindow = document.getElementById('chatWindow');
    const closeChatBtn = document.getElementById('moh-close-panel-btn');
    const chatInputField = document.getElementById('moh-chat-input-field');
    const sendChatBtn = document.getElementById('moh-chat-send-btn');
    const chatMessagesContainer = document.getElementById('chatMessages');
    const fabContainer = document.querySelector('.moh-fab-container');

    const hiddenFileInput = document.getElementById('moh-hidden-file-input');
    const attachmentTriggerBtn = document.getElementById('moh-attachment-trigger-btn');
    const attachmentPreviewZone = document.getElementById('attachmentPreviewZone');
    const filePreviewRenderer = document.getElementById('filePreviewRenderer');
    const attachmentFileNameDisplay = document.getElementById('attachmentFileNameDisplay');
    const clearAttachmentBtn = document.getElementById('clearAttachmentBtn');

    let memoryTrackedFile = null;
    let isDragging = false;
    let dragHappened = false;
    const dragThreshold = 6;
    let startX, startY, initialX = 0, initialY = 0, xOffset = 0, yOffset = 0;

    // --- 1. UI Toggle Logic ---
    if (chatToggle && chatWindow) {
        chatToggle.addEventListener('click', (e) => {
            if (dragHappened) { e.preventDefault(); return; }
            chatWindow.classList.toggle('active');
        });
    }

    if (closeChatBtn) {
        closeChatBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            chatWindow.classList.remove('active');
        });
    }

    // --- 2. File Attachment Processing ---
    if (attachmentTriggerBtn && hiddenFileInput) {
        attachmentTriggerBtn.addEventListener('click', () => hiddenFileInput.click());
    }

    if (hiddenFileInput) {
        hiddenFileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                if (!file.type.startsWith('image/')) {
                    alert('Please select a valid diagram or solution image file.');
                    return;
                }
                memoryTrackedFile = file;
                if(attachmentFileNameDisplay) attachmentFileNameDisplay.textContent = file.name;
                
                const fileReader = new FileReader();
                fileReader.onload = (event) => {
                    if(filePreviewRenderer) filePreviewRenderer.src = event.target.result;
                    if(attachmentPreviewZone) attachmentPreviewZone.style.display = 'flex';
                };
                fileReader.readAsDataURL(file);
            }
        });
    }

    if (clearAttachmentBtn) {
        clearAttachmentBtn.addEventListener('click', resetFileAttachmentBuffer);
    }

    function resetFileAttachmentBuffer() {
        memoryTrackedFile = null;
        if(hiddenFileInput) hiddenFileInput.value = '';
        if(attachmentPreviewZone) attachmentPreviewZone.style.display = 'none';
        if(filePreviewRenderer) filePreviewRenderer.src = '#';
    }

    // --- 3. Message Rendering Engine ---
    // --- 3. Message Rendering Engine ---
    function appendChatMessage(text, owner, optionalImageSrc = null) {
        const bubble = document.createElement('div');
        bubble.style.padding = '12px 16px';
        bubble.style.fontSize = '0.92rem';
        bubble.style.lineHeight = '1.5';
        bubble.style.maxWidth = '85%';
        bubble.style.boxShadow = '0 2px 8px rgba(0,0,0,0.02)';
        bubble.style.fontFamily = "'Lato', sans-serif";
        bubble.style.transition = 'all 0.2s ease';
        
        if (owner === 'user') {
            bubble.style.background = 'linear-gradient(135deg, #8a2be2 0%, #4a00e0 100%)';
            bubble.style.color = '#ffffff';
            bubble.style.borderRadius = '16px 16px 4px 16px';
            bubble.style.alignSelf = 'flex-end';
        } else {
            if (text.includes('fa-spinner')) {
                bubble.id = 'bot-loading-indicator';
                bubble.style.color = '#7f8c8d';
            }
            bubble.style.backgroundColor = '#ffffff';
            bubble.style.color = '#2c3e50';
            bubble.style.borderRadius = '4px 16px 16px 16px';
            bubble.style.border = '1px solid #e2e8f0';
            bubble.style.alignSelf = 'flex-start';
        }

        if (optionalImageSrc) {
            const imgEl = document.createElement('img');
            imgEl.src = optionalImageSrc;
            imgEl.style.maxWidth = '100%';
            imgEl.style.borderRadius = '8px';
            imgEl.style.marginBottom = '8px';
            bubble.appendChild(imgEl);
        }
        
        const textWrapper = document.createElement('div');
        textWrapper.style.maxWidth = '100%';
        textWrapper.style.overflowX = 'hidden';

        if (owner === 'user') {
            textWrapper.innerText = text;
        } else {
            let processedText = text;

            // 1. Strip markdown backticks wrapping SVGs
            processedText = processedText.replace(/```[a-zA-Z]*\s*(<svg[\s\S]*?<\/svg>)\s*```/gi, '$1');

            // 2. Extract SVGs and leave alphanumeric placeholders safe from marked.js
            const extractedSVGs = [];
            processedText = processedText.replace(/<svg[\s\S]*?<\/svg>/gi, (match) => {
                extractedSVGs.push(match);
                return `MOHSVGPLACEHOLDER${extractedSVGs.length - 1}END`;
            });

            // 3. Parse Markdown
            if (typeof marked !== 'undefined') {
                textWrapper.innerHTML = marked.parse(processedText);
            } else {
                textWrapper.innerText = processedText; 
            }

            // 4. Inject SVGs back into the HTML using the safe placeholder
            extractedSVGs.forEach((svgCode, index) => {
                const styledContainer = `
                    <div style="margin-top: 12px; margin-bottom: 12px; background: #f8fafc; border-radius: 8px; padding: 10px; border: 1px solid #e2e8f0; display: flex; justify-content: center; overflow-x: auto; width: 100%;">
                        ${svgCode}
                    </div>
                `;
                textWrapper.innerHTML = textWrapper.innerHTML.replace(`MOHSVGPLACEHOLDER${index}END`, styledContainer);
            });
        }

        bubble.appendChild(textWrapper);
        chatMessagesContainer.appendChild(bubble);
        
        if (owner === 'bot' && typeof renderMathInElement !== 'undefined') {
            renderMathInElement(bubble, {
                delimiters: [
                    {left: '$$', right: '$$', display: true},
                    {left: '$', right: '$', display: false}
                ],
                throwOnError: false
            });
        }

        chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
    }

    function removeLoadingIndicator() {
        const loader = document.getElementById('bot-loading-indicator');
        if (loader) loader.remove();
    }

    // --- 4. Daily Limit & Premium Gating Engine ---
    function triggerUpgradeLockdown() {
        const chatInput = document.getElementById('moh-chat-input-field');
        const chatSendBtn = document.getElementById('moh-chat-send-btn');
        const fileBtn = document.getElementById('moh-attachment-trigger-btn');
        
        // Disable typing and attachments
        if (chatInput) {
            chatInput.disabled = true;
            chatInput.value = "";
            chatInput.placeholder = "Daily limit reached. 🌟 Upgrade to PRO";
        }
        if (fileBtn) fileBtn.disabled = true;
        
        // Transform the Send Button into an Upgrade Button
        if (chatSendBtn) {
            chatSendBtn.disabled = false; // Ensure it remains clickable
            chatSendBtn.innerHTML = "Upgrade"; 
            chatSendBtn.style.backgroundColor = "#FFD700";
            chatSendBtn.style.color = "#000";
            chatSendBtn.style.width = "auto";
            chatSendBtn.style.padding = "0 15px";
            chatSendBtn.style.borderRadius = "20px";
            chatSendBtn.style.fontWeight = "bold";
            
            // Redirect to the pricing page
            chatSendBtn.onclick = function(e) {
                e.preventDefault();
                window.location.href = 'pricing.html'; 
            };
        }

        appendChatMessage("You've reached your daily limit of 5 free messages! Upgrade to Premium for unlimited AI tutoring and instant step-by-step solutions.", 'bot');
    }

    function checkAndIncrementChatLimit() {
        // 1. Get current user status
        const storedUser = localStorage.getItem('mohacademy_user') || localStorage.getItem('user');
        const currentUser = storedUser ? JSON.parse(storedUser) : { isPremium: false };
        
        // Unlimited access for PRO users
        if (currentUser.isPremium) return true;

        // 2. Establish today's date string
        const today = new Date().toDateString();
        
        // 3. Fetch current chat stats from the browser
        let chatStats = JSON.parse(localStorage.getItem('moh_chat_stats')) || { date: today, count: 0 };
        
        // 4. Reset the count if the date has rolled over to a new day
        if (chatStats.date !== today) {
            chatStats = { date: today, count: 0 };
        }
        
        // 5. Enforce the limit
        if (chatStats.count >= 5) {
            triggerUpgradeLockdown();
            return false; // Block the message from sending
        }
        
        // 6. Increment and save the new count
        chatStats.count += 1;
        localStorage.setItem('moh_chat_stats', JSON.stringify(chatStats));
        
        // Sales Tactic: Warn them when they have 1 message left to build urgency
        if (chatStats.count === 4) {
            setTimeout(() => {
                appendChatMessage("⚠️ *Notice: You have 1 free AI message remaining for today.*", 'bot');
            }, 1000);
        }
        
        return true; // Allow the message to send
    }

    // --- 5. The Backend AI Connection ---
    async function triggerBotReply(userMsg, attachedFileFile) {
        appendChatMessage('<i class="fas fa-spinner fa-spin"></i> Processing data arrays...', 'bot');

        try {
            const token = localStorage.getItem('token');
            const dataPayload = new FormData();
            
            if (userMsg) dataPayload.append('message', userMsg);
            if (attachedFileFile) dataPayload.append('image', attachedFileFile);

            const requestHeaders = {};
            if (token) requestHeaders['Authorization'] = `Bearer ${token}`;

            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: requestHeaders,
                body: dataPayload
            });

            removeLoadingIndicator();

            if (response.ok) {
                const data = await response.json();
                appendChatMessage(data.reply, 'bot');
            } else {
                const errorData = await response.json();
                // If backend flags a limit reach (secondary fallback), trigger the UI lockdown
                if (errorData.limitReached) {
                    triggerUpgradeLockdown();
                } else {
                    appendChatMessage(errorData.reply || "I am experiencing a core validation variance. Please re-upload.", 'bot');
                }
            }
        } catch (error) {
            removeLoadingIndicator();
            appendChatMessage("Network error. Unable to sync data with MohAcademy servers.", 'bot');
        }
    }

    // --- 6. Input Handling ---
    function handleChatSend() {
        const msg = chatInputField.value.trim();
        if (msg !== "" || memoryTrackedFile !== null) {
            
            // GATEKEEPER: Run the limit check before doing anything else
            if (!checkAndIncrementChatLimit()) return;

            const imageBlobSrc = memoryTrackedFile ? filePreviewRenderer.src : null;
            appendChatMessage(msg || "[File Submission Attached]", 'user', imageBlobSrc);
            
            chatInputField.value = "";
            const fileToSend = memoryTrackedFile;
            
            resetFileAttachmentBuffer();
            triggerBotReply(msg, fileToSend);
        }
    }

    if (sendChatBtn) sendChatBtn.addEventListener('click', handleChatSend);
    if (chatInputField) {
        chatInputField.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleChatSend();
        });
    }

    window.triggerPreset = function(presetText) {
        // GATEKEEPER: Check limit for preset buttons too
        if (!checkAndIncrementChatLimit()) return;

        appendChatMessage(presetText, 'user');
        triggerBotReply(presetText, null);
    };

    if (sendChatBtn) sendChatBtn.addEventListener('click', handleChatSend);
    if (chatInputField) {
        chatInputField.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleChatSend();
        });
    }

    window.triggerPreset = function(presetText) {
        appendChatMessage(presetText, 'user');
        triggerBotReply(presetText, null);
    };

    // --- 6. Mobile Chatbot Drag Engine ---
    if(chatToggle) {
        chatToggle.addEventListener('mousedown', dragStart);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', dragEnd);
        chatToggle.addEventListener('touchstart', dragStart, { passive: true });
        document.addEventListener('touchmove', drag, { passive: false });
        document.addEventListener('touchend', dragEnd);
    }

    function dragStart(e) {
        if (window.innerWidth <= 576) return;
        let clientX = e.type === "touchstart" ? e.touches[0].clientX : e.clientX;
        let clientY = e.type === "touchstart" ? e.touches[0].clientY : e.clientY;
        startX = clientX; startY = clientY;
        initialX = clientX - xOffset; initialY = clientY - yOffset;
        dragHappened = false;
        if (e.target === chatToggle || chatToggle.contains(e.target)) { isDragging = true; }
    }

    function drag(e) {
        if (!isDragging || window.innerWidth <= 576) return;
        let clientX = e.type === "touchmove" ? e.touches[0].clientX : e.clientX;
        let clientY = e.type === "touchmove" ? e.touches[0].clientY : e.clientY;
        let deltaX = Math.abs(clientX - startX); let deltaY = Math.abs(clientY - startY);
        
        if (deltaX > dragThreshold || deltaY > dragThreshold) { dragHappened = true; }
        if (e.cancelable) e.preventDefault();
        
        let currentX = clientX - initialX; let currentY = clientY - initialY;
        xOffset = currentX; yOffset = currentY;
        fabContainer.style.transform = `translate(${currentX}px, ${currentY}px)`;
    }

    function dragEnd() {
        isDragging = false;
        setTimeout(() => { dragHappened = false; }, 50);
    }
});