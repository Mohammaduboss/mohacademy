/**
 * MohAcademy - subjects.js
 * Specialized interactive script engine for the GCE A-Level Science Subjects page.
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Hero Science Typewriter System ---
    function initializeScienceTypewriter() {
        const targetSubText = document.querySelector('.science-typewriter');
        if (!targetSubText) return;

        const scienceTracks = [
            "Physics & Mechanics",
            "Advanced Chemistry",
            "Pure Mathematics",
            "Cellular Biology",
            "Computer Science"
        ];

        let trackIndex = 0;
        let stringIndex = 0;
        let isDeletingMode = false;
        let processingVelocity = 100;

        function executionLoop() {
            const currentFullString = scienceTracks[trackIndex];

            if (isDeletingMode) {
                targetSubText.textContent = currentFullString.substring(0, stringIndex - 1);
                stringIndex--;
                processingVelocity = 40; 
            } else {
                targetSubText.textContent = currentFullString.substring(0, stringIndex + 1);
                stringIndex++;
                processingVelocity = 120; 
            }

            if (!isDeletingMode && stringIndex === currentFullString.length) {
                processingVelocity = 2200; 
                isDeletingMode = true;
            } else if (isDeletingMode && stringIndex === 0) {
                isDeletingMode = false;
                trackIndex = (trackIndex + 1) % scienceTracks.length; 
                processingVelocity = 400; 
            }

            setTimeout(executionLoop, processingVelocity);
        }

        setTimeout(executionLoop, 800);
    }
    initializeScienceTypewriter();

});