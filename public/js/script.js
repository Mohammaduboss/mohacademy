document.addEventListener('DOMContentLoaded', () => {

    // ==========================================================================
    // GLOBAL AUTHENTICATION SYNC ENGINE (Fixes the "Amnesia" bug & Cleans UI)
    // ==========================================================================
    // Only look for the standardized token key
    const token = localStorage.getItem('token');
    const navMenuUl = document.querySelector('.nav-list');

    if (token) {
        // 1. Hide "Log In" or "Sign Up" links in the navbar globally
        document.querySelectorAll('.nav-link').forEach(link => {
            const href = link.getAttribute('href');
            if (href === 'login.html' || href === 'signup.html' || href === 'register.html') {
                link.parentElement.style.display = 'none';
            }
        });

        // 2. Inject "Profile" Dropdown (containing Dashboard & Logout) into the navbar
        if (navMenuUl && !document.getElementById('global-nav-dashboard')) {
            const profileDropdownLi = document.createElement('li');
            profileDropdownLi.className = 'dropdown'; 
            profileDropdownLi.id = 'global-nav-dashboard';

            profileDropdownLi.innerHTML = `
            <a href="profile" class="nav-link dropdown-toggle" style="color: var(--primary-color); font-weight: 700;">
                <i class="fas fa-user-circle"></i> Profile <i class="fas fa-chevron-down dropdown-arrow"></i>
            </a>
            <ul class="dropdown-menu">
                <li><a href="profile" style="font-weight: 500;"><i class="fas fa-chart-line"></i> Dashboard</a></li>
                <li><a href="#" id="global-logout-btn" style="color: #e74c3c; font-weight: 600;"><i class="fas fa-sign-out-alt"></i> Logout</a></li>
            </ul>
        `;
            navMenuUl.appendChild(profileDropdownLi);

            // Handle Logout Click securely with a nuclear wipe
            document.getElementById('global-logout-btn').addEventListener('click', (e) => {
                e.preventDefault();
                // 1. Completely wipe the browser's memory of the user
                localStorage.removeItem('mohacademy_token');
                localStorage.removeItem('mohacademy_user');
                localStorage.removeItem('token');
                localStorage.removeItem('student');
                localStorage.removeItem('user');    

                // 2. Redirect back to the home page, not the login page
                window.location.href = 'index.html'; 
            });
        }

        // 3. TRANSFORM ALL SIGNUP BUTTONS INTO PROFILE BUTTONS
        // This targets the Hero button and the CTA button on every page
        const signupLinks = document.querySelectorAll('a[href="signup"], a[href="signup.html"]');
        signupLinks.forEach(link => {
            link.style.display = 'inline-block'; // Restores the button if it was hidden
            link.setAttribute('href', 'profile'); // Routes them to their dashboard
            link.innerHTML = 'Go to Profile <i class="fas fa-arrow-right"></i>'; // Changes the button text
            link.classList.remove('btn-outline'); // Removes transparent styling
            link.classList.add('btn-primary');    // Makes the button solid
        });

        // 4. UPDATE THE CTA SECTION TEXT GLOBALLY
        // This fixes the awkward "Register an account" text above the footer
        const ctaSections = document.querySelectorAll('.cta-content');
        ctaSections.forEach(cta => {
            const title = cta.querySelector('h2');
            const desc = cta.querySelector('p');

            if (title) {
                title.innerText = "Continue Building Your Success Trajectory!";
            }
            
            if (desc) {
                desc.innerText = "Head over to your profile to access your premium resources, virtual labs, and past papers.";
            }
        });
    }
    // 4. THE PRO SWEEPER: If the user is Premium, destroy all upgrade prompts!
    const rawData = localStorage.getItem('mohacademy_user') || localStorage.getItem('student') || localStorage.getItem('user');
    const userData = JSON.parse(rawData || '{}');
    const actualUser = userData.student || userData.user || userData;

    // Handle both true boolean and 'true' string safely
    if (actualUser && (actualUser.isPremium === true || actualUser.isPremium === 'true')) {

        // Hide all upgrade buttons on the page (Homepage, Modals, Pricing links)
        document.querySelectorAll('a[href="pricing"], a[href="pricing.html"], .btn-upgrade-now, .upgrade-badge').forEach(btn => {
            btn.style.display = 'none';
        });

        // Specific fix for the homepage "JOIN FOR FREE" / "CREATE YOUR PROFILE FREE" buttons
        document.querySelectorAll('.btn-primary').forEach(btn => {
            if (btn.innerText.toUpperCase().includes('FREE')) {
                btn.style.display = 'none';
            }
        });

        // Specific fix for Chatbot limits
        if (typeof window.userMessageCount !== 'undefined') {
            window.userMessageCount = -9999; // Unlimited AI queries
        }
    }
    // 5. RANDOM PRO UPGRADE POPUP FOR FREE USERS
    if (!actualUser || (actualUser.isPremium !== true && actualUser.isPremium !== 'true')) {
        // 30% chance to show the popup on any page load
        if (Math.random() < 0.3) {
            setTimeout(() => {
                // Prevent duplicate popups
                if (document.getElementById('pro-upgrade-popup')) return;

                // Create the popup overlay
                const popupOverlay = document.createElement('div');
                popupOverlay.id = 'pro-upgrade-popup';
                popupOverlay.style.cssText = 'position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.8); z-index:9999; display:flex; justify-content:center; align-items:center; backdrop-filter:blur(5px); opacity:0; transition:opacity 0.4s ease;';
                
                // Create the popup content box
                const popupContent = document.createElement('div');
                popupContent.style.cssText = 'background:#0f172a; border:2px solid var(--sim-accent); padding:30px; border-radius:12px; max-width:450px; width:90%; text-align:center; box-shadow:0 10px 40px rgba(56,189,248,0.2); transform:translateY(20px); transition:transform 0.4s ease; position:relative;';
                
                // Close button
                const closeBtn = document.createElement('button');
                closeBtn.innerHTML = '<i class="fas fa-times"></i>';
                closeBtn.style.cssText = 'position:absolute; top:10px; right:15px; background:none; border:none; color:#94a3b8; font-size:1.2rem; cursor:pointer;';
                closeBtn.onclick = () => {
                    popupOverlay.style.opacity = '0';
                    popupContent.style.transform = 'translateY(20px)';
                    setTimeout(() => popupOverlay.remove(), 400);
                };

                popupContent.innerHTML = `
                    <div style="font-size:3rem; color:var(--sim-accent); margin-bottom:15px;"><i class="fas fa-crown"></i></div>
                    <h3 style="color:#fff; font-family:'Poppins'; margin-bottom:10px;">Unlock Perfect Grades with PRO</h3>
                    <p style="color:#cbd5e1; font-size:0.95rem; margin-bottom:20px; line-height:1.5;">Get unlimited access to AI grading, 60+ interactive virtual labs, and complete marking guides.</p>
                    <div style="background:#1e293b; padding:15px; border-radius:8px; margin-bottom:20px; border:1px solid #334155;">
                        <div style="color:#facc15; font-size:1.5rem; font-weight:800; font-family:'Orbitron';">2,000 FCFA <span style="font-size:0.8rem; color:#94a3b8; font-family:'Poppins';">/ month</span></div>
                    </div>
                    <a href="pricing" class="btn btn-primary" style="display:block; width:100%; padding:12px; border-radius:6px; font-weight:bold; font-size:1.1rem; margin-bottom:10px;">Upgrade Now</a>
                    <button id="maybe-later-btn" style="background:none; border:none; color:#94a3b8; text-decoration:underline; cursor:pointer; font-family:'Poppins'; font-size:0.85rem;">Maybe Later</button>
                `;

                popupContent.appendChild(closeBtn);
                popupOverlay.appendChild(popupContent);
                document.body.appendChild(popupOverlay);

                // Add event listener to the "Maybe Later" button after it's in the DOM
                document.getElementById('maybe-later-btn').onclick = closeBtn.onclick;

                // Trigger animation
                requestAnimationFrame(() => {
                    popupOverlay.style.opacity = '1';
                    popupContent.style.transform = 'translateY(0)';
                });

            }, 2500); // Wait 2.5 seconds before popping up so they read the page first
        }
    }

    // --- Global Elements ---
    const header = document.getElementById('main-header');
    const heroSection = document.getElementById('hero-section');
    const hamburgerMenu = document.getElementById('hamburger-menu');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    const backToTopBtn = document.getElementById('back-to-top');

    // --- Smooth Scroll for anchor links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = header.offsetHeight;
                const elementPosition = targetElement.getBoundingClientRect().top + window.scrollY;
                const offsetPosition = elementPosition - headerHeight - 20;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- Sticky Header with Shrink Effect & Dynamic Hero Section Padding ---
    function adjustHeaderAndHeroPadding() {
        const headerHeight = header.offsetHeight;
        document.documentElement.style.setProperty('--header-height', `${headerHeight}px`);

        if (window.scrollY > 50) {
            header.classList.add('shrink');
        } else {
            header.classList.remove('shrink');
        }

        if (heroSection) {
            heroSection.style.paddingTop = `${headerHeight}px`;
        }
    }

    window.addEventListener('scroll', adjustHeaderAndHeroPadding);
    window.addEventListener('resize', adjustHeaderAndHeroPadding);
    adjustHeaderAndHeroPadding();

    // --- Animated Hamburger Menu & Mobile Dropdowns ---
    if (hamburgerMenu && navMenu) {
        hamburgerMenu.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            hamburgerMenu.classList.toggle('active');
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';

            dropdownToggles.forEach(toggle => {
                toggle.parentElement.classList.remove('active');
            });
        });

        dropdownToggles.forEach(toggle => {
            toggle.addEventListener('click', (e) => {
                if (window.innerWidth <= 767) {
                    e.preventDefault();
                    const parentLi = toggle.parentElement;

                    dropdownToggles.forEach(otherToggle => {
                        if (otherToggle !== toggle && otherToggle.parentElement.classList.contains('active')) {
                            otherToggle.parentElement.classList.remove('active');
                        }
                    });

                    parentLi.classList.toggle('active');
                }
            });
        });

        navMenu.querySelectorAll('.nav-link:not(.dropdown-toggle)').forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 767) {
                    navMenu.classList.remove('active');
                    hamburgerMenu.classList.remove('active');
                    dropdownToggles.forEach(toggle => {
                        toggle.parentElement.classList.remove('active');
                    });
                }
            });
        });
    }

    // --- Hero Slider Functionality ---
    const heroSlides = document.querySelectorAll('.hero-slide');
    let currentHeroSlide = 0;
    const heroSlideInterval = 7000;
    let heroSliderTimer;

    function showHeroSlide(index) {
        // 1. Handle Slides
        heroSlides.forEach(slide => {
            slide.classList.remove('active');
            slide.querySelectorAll('.animate-fade-in-up').forEach(el => {
                el.style.opacity = '0';
                el.style.transform = 'translateY(20px)';
            });
        });

        // 2. Handle Dots Syncing
        const dots = document.querySelectorAll('.slider-dot');
        dots.forEach(dot => dot.classList.remove('active'));
        if (dots[index]) {
            dots[index].classList.add('active');
        }

        const activeSlide = heroSlides[index];
        if (activeSlide) {
            activeSlide.classList.add('active');
            const animatedElements = activeSlide.querySelectorAll('.animate-fade-in-up');
            animatedElements.forEach(el => {
                setTimeout(() => {
                    el.style.opacity = '1';
                    el.style.transform = 'translateY(0)';
                }, 50);
            });
        }
    }

    function startHeroSlider() {
        clearInterval(heroSliderTimer);
        heroSliderTimer = setInterval(() => {
            currentHeroSlide = (currentHeroSlide + 1) % heroSlides.length;
            showHeroSlide(currentHeroSlide);
        }, heroSlideInterval);
    }

    if (heroSlides.length > 0) {
        showHeroSlide(currentHeroSlide);
        startHeroSlider();
    }

    // Make dots clickable globally
    window.jumpToSlide = function (index) {
        currentHeroSlide = index;
        showHeroSlide(currentHeroSlide);

        // Reset the timer so it doesn't instantly jump to the next slide
        clearInterval(heroSliderTimer);
        startHeroSlider();
    };

    // --- Testimonial Carousel Functionality ---
    const carouselTrack = document.querySelector('.testimonial-carousel .carousel-track');
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const prevBtn = document.querySelector('.carousel-nav.prev');
    const nextBtn = document.querySelector('.carousel-nav.next');

    if (carouselTrack && testimonialCards.length > 0) {
        let currentIndex = 0;
        let cardWidth = 0;
        let visibleCards = 3;
        let autoSlideInterval;

        const getCardWidth = () => {
            if (testimonialCards.length > 0) {
                const cardStyle = getComputedStyle(testimonialCards[0]);
                const cardMarginRight = parseFloat(cardStyle.marginRight) || 0;
                const cardMarginLeft = parseFloat(cardStyle.marginLeft) || 0;
                return testimonialCards[0].offsetWidth + cardMarginLeft + cardMarginRight;
            }
            return 0;
        };

        const updateCarouselVisibility = () => {
            if (window.innerWidth <= 767) {
                visibleCards = 1;
            } else if (window.innerWidth <= 991) {
                visibleCards = 2;
            } else {
                visibleCards = 3;
            }
            cardWidth = getCardWidth();
            showTestimonial(currentIndex);
        };

        const showTestimonial = (index) => {
            if (index < 0) {
                currentIndex = testimonialCards.length - visibleCards;
                if (currentIndex < 0) currentIndex = 0;
            } else if (index >= testimonialCards.length) {
                currentIndex = 0;
            } else {
                currentIndex = index;
            }

            const translateXValue = -currentIndex * cardWidth;
            carouselTrack.style.transform = `translateX(${translateXValue}px)`;
        };

        const startAutoSlide = () => {
            clearInterval(autoSlideInterval);
            autoSlideInterval = setInterval(() => {
                let nextIndex = currentIndex + 1;
                if (nextIndex > testimonialCards.length - visibleCards) {
                    nextIndex = 0;
                }
                showTestimonial(nextIndex);
            }, 8000);
        };

        prevBtn.addEventListener('click', () => {
            clearInterval(autoSlideInterval);
            showTestimonial(currentIndex - 1);
            startAutoSlide();
        });

        nextBtn.addEventListener('click', () => {
            clearInterval(autoSlideInterval);
            showTestimonial(currentIndex + 1);
            startAutoSlide();
        });

        window.addEventListener('resize', updateCarouselVisibility);
        updateCarouselVisibility();
        startAutoSlide();
    }

    // --- Reveal on Scroll Animations ---
    const revealElements = document.querySelectorAll('.reveal');

    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        revealElements.forEach(el => {
            const elementTop = el.getBoundingClientRect().top;
            const revealPoint = 150;

            if (elementTop < windowHeight - revealPoint) {
                el.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll();

    // --- Active Nav Link Highlight ---
    const highlightActiveLink = () => {
        const path = window.location.pathname.split('/').pop();
        const currentFileName = path === '' ? 'index.html' : path;

        navLinks.forEach(link => {
            const linkHref = link.getAttribute('href')?.split('/').pop();
            if (linkHref === currentFileName) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    };

    highlightActiveLink();

    // --- Back to Top Button functionality ---
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});

document.addEventListener('DOMContentLoaded', () => {
    // --- FAQ Accordion Functionality ---
    const accordionHeaders = document.querySelectorAll('.subjects-faq-section .accordion-header');

    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const accordionContent = header.nextElementSibling;
            const isActive = header.classList.contains('active');

            accordionHeaders.forEach(otherHeader => {
                if (otherHeader !== header) {
                    otherHeader.classList.remove('active');
                    const otherContent = otherHeader.nextElementSibling;
                    otherContent.style.maxHeight = '0';
                    otherContent.classList.remove('open');
                }
            });

            header.classList.toggle('active', !isActive);
            accordionContent.classList.toggle('open', !isActive);

            if (!isActive) {
                accordionContent.style.maxHeight = accordionContent.scrollHeight + "px";
            } else {
                accordionContent.style.maxHeight = "0";
            }
        });
    });

    window.addEventListener('resize', () => {
        document.querySelectorAll('.subjects-faq-section .accordion-content.open').forEach(content => {
            content.style.maxHeight = content.scrollHeight + "px";
        });
    });
    // --- Number Counter Animation ---
    const statNumbers = document.querySelectorAll('.stat-number');

    if (statNumbers.length > 0) {
        const animateStats = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = entry.target;
                    const endValue = parseInt(target.getAttribute('data-target'));
                    const duration = 2000; // 2 seconds total animation

                    // Calculate step time to make it smooth
                    let currentValue = 0;
                    const increment = Math.ceil(endValue / 50);

                    const timer = setInterval(() => {
                        currentValue += increment;
                        if (currentValue >= endValue) {
                            target.innerText = endValue + (endValue > 100 ? "+" : "");
                            clearInterval(timer);
                        } else {
                            target.innerText = currentValue;
                        }
                    }, 30); // 30ms step speed

                    observer.unobserve(target); // Stop observing once animated
                }
            });
        };

        const statsObserver = new IntersectionObserver(animateStats, {
            threshold: 0.5 // Start animation when element is 50% visible on screen
        });

        statNumbers.forEach(stat => statsObserver.observe(stat));
    }
});

// ==========================================================================
// GLOBAL FIX: REMOVE STICKY HOVER/FOCUS COLORS ON BUTTONS AFTER CLICKING
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
    // 1. Instantly remove focus when any button or link is clicked
    document.querySelectorAll('.btn, button, .nav-link, a').forEach(element => {
        element.addEventListener('click', function() {
            this.blur(); // Forces the element to drop its active/hover color state
        });
    });
});

// 2. Clear stuck colors if the user clicks the browser's "Back" arrow
window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
        document.querySelectorAll('.btn, button, .nav-link, a').forEach(el => el.blur());
    }
});