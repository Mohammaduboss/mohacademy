document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Dynamic Table of Contents (Scroll Spy) ---
    const tocList = document.getElementById('notes-toc');
    const notesSections = document.querySelectorAll('.notes-main-content h2[id], .notes-main-content h3[id]');
    // --- Mobile TOC Toggle Logic ---
    const tocToggleBtn = document.getElementById('toc-toggle-btn');
    const mobileSidebar = document.getElementById('mobile-toc-sidebar');
    const tocLinks = document.querySelectorAll('#notes-toc a');

    if (tocToggleBtn && mobileSidebar) {
        // Toggle menu when clicking the header
        tocToggleBtn.addEventListener('click', () => {
            if (window.innerWidth <= 992) {
                mobileSidebar.classList.toggle('expanded');
            }
        });

        // Auto-close menu when a topic is clicked
        tocLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 992) {
                    mobileSidebar.classList.remove('expanded');
                }
            });
        });
    }
    if (tocList && notesSections.length > 0) {
        function updateActiveTocLink() {
            let currentActiveSectionId = '';
            let headerOffset = document.getElementById('main-header').offsetHeight; 

            for (let i = notesSections.length - 1; i >= 0; i--) {
                const section = notesSections[i];
                if (window.scrollY + headerOffset + 80 >= section.offsetTop) { 
                    currentActiveSectionId = section.id;
                    break;
                }
            }

            tocList.querySelectorAll('a').forEach(link => link.classList.remove('active'));

            if (currentActiveSectionId) {
                const activeLink = tocList.querySelector(`a[href="#${currentActiveSectionId}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                    const parentListItem = activeLink.closest('ul')?.closest('li');
                    if (parentListItem) {
                        const parentLink = parentListItem.querySelector('a');
                        if (parentLink) parentLink.classList.add('active');
                    }
                }
            }
        }

        tocList.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const targetElement = document.querySelector(this.getAttribute('href'));

                if (targetElement) {
                    const headerOffset = document.getElementById('main-header').offsetHeight;
                    const offsetPosition = targetElement.getBoundingClientRect().top + window.scrollY - headerOffset - 20;

                    window.scrollTo({ top: offsetPosition, behavior: 'smooth' });

                    tocList.querySelectorAll('a').forEach(link => link.classList.remove('active'));
                    this.classList.add('active');
                }
            });
        });

        window.addEventListener('scroll', updateActiveTocLink);
        updateActiveTocLink();
    }


});