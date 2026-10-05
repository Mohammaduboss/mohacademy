/* ==========================================================================
   MOBILE TOUCH-TO-MOUSE POLYFILL
   ========================================================================== */
function enableMobileLabTouch() {
    // Target the lab workspace
    const labWorkspace = document.querySelector('.lab-workbench') || document.querySelector('#lab-canvas') || document.body;

    function touch2Mouse(e) {
        const theTouch = e.changedTouches[0];
        let mouseEv;

        switch(e.type) {
            case "touchstart": mouseEv = "mousedown"; break;  
            case "touchend":   mouseEv = "mouseup"; break;
            case "touchmove":  mouseEv = "mousemove"; break;
            default: return;
        }

        const mouseEvent = new MouseEvent(mouseEv, {
            bubbles: true,
            cancelable: true,
            view: window,
            clientX: theTouch.clientX,
            clientY: theTouch.clientY,
            screenX: theTouch.screenX,
            screenY: theTouch.screenY
        });

        theTouch.target.dispatchEvent(mouseEvent);
        
        // Prevent default browser scrolling only inside the lab area
        if (e.cancelable) {
            e.preventDefault();
        }
    }

    // Attach listeners
    labWorkspace.addEventListener("touchstart", touch2Mouse, { passive: false });
    labWorkspace.addEventListener("touchmove", touch2Mouse, { passive: false });
    labWorkspace.addEventListener("touchend", touch2Mouse, { passive: false });
}

// Run the polyfill when the page loads
document.addEventListener('DOMContentLoaded', enableMobileLabTouch);

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
        const response = await fetch('/api/labs/catalog');
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