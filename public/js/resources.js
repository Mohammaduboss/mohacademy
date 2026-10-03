/**
 * MohAcademy Platform Module Engine - resources.js
 * Handles responsive node rendering, contextual filtering, and chatbot automation.
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Client-Side Subject Sorting Mechanism ---
    const filterButtons = document.querySelectorAll('.filter-btn');
    const resourceCards = document.querySelectorAll('.resource-node-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all filters and append to target
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const targetFilter = button.getAttribute('data-filter');

            resourceCards.forEach(card => {
                const embeddedSubjects = card.getAttribute('data-subjects').split(' ');
                
                if (targetFilter === 'all' || embeddedSubjects.includes(targetFilter)) {
                    // Smooth reveal animation mapping
                    card.style.display = 'flex';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0) scale(1)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px) scale(0.95)';
                    // Delay hide to allow opacity fade transformation
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 250);
                }
            });
        });
    });

    

    // --- 3. Scroll Reveal Trigger Map ---
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => revealObserver.observe(el));
});