/* =========================================================
   LUXURY WEDDING DIGITAL PROGRAM
   Sibongile & Lukhanyo
   Premium JavaScript Animations & Interactions
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =========================================================
       1. PRELOADER (Smooth & Elegant Exit)
    ========================================================= */
    const preloader = document.getElementById("preloader");
    
    // Ensure a minimum display time so the animation is appreciated, 
    // even on fast connections, then fade out smoothly.
    const minLoadTime = 1500; 
    const startTime = Date.now();

    window.addEventListener("load", () => {
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, minLoadTime - elapsedTime);

        setTimeout(() => {
            preloader.classList.add("hide");
            
            // Remove from DOM after transition to free up memory
            setTimeout(() => {
                preloader.style.display = "none";
                
                // Trigger hero entrance animation after preloader is gone
                // Works for both index.html (.hero-content) and day1/2.html (.compact-hero-content)
                const heroContent = document.querySelector(".hero-content, .compact-hero-content");
                if (heroContent) {
                    heroContent.style.animation = "fadeInUp 1.2s cubic-bezier(0.22, 1, 0.36, 1) forwards";
                }
            }, 800);
        }, remainingTime);
    });


    /* =========================================================
       2. NAVIGATION (Smooth Scroll & Blur Effect)
    ========================================================= */
    const navbar = document.getElementById("navbar");
    let lastScrollY = window.scrollY;

    window.addEventListener("scroll", () => {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 50) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }
        lastScrollY = currentScrollY;
    }, { passive: true });


    /* =========================================================
       3. MOBILE MENU (Staggered Link Animation)
    ========================================================= */
    const menuToggle = document.getElementById("menuToggle");
    const navLinks = document.getElementById("navLinks");
    const navItems = navLinks.querySelectorAll("a");

    if (menuToggle && navLinks) {
        menuToggle.addEventListener("click", () => {
            const isOpen = navLinks.classList.toggle("open");
            menuToggle.classList.toggle("active");

            // Staggered animation for menu items
            navItems.forEach((item, index) => {
                if (isOpen) {
                    item.style.animation = `fadeInUp 0.4s cubic-bezier(0.22, 1, 0.36, 1) forwards ${index * 0.1}s`;
                    item.style.opacity = "0"; // Reset for animation
                } else {
                    item.style.animation = "none";
                    item.style.opacity = "1";
                }
            });
        });

        // Close menu when a link is clicked
        navItems.forEach(link => {
            link.addEventListener("click", () => {
                navLinks.classList.remove("open");
                menuToggle.classList.remove("active");
                navItems.forEach(item => {
                    item.style.animation = "none";
                    item.style.opacity = "1";
                });
            });
        });
    }


    /* =========================================================
       4. HERO PARALLAX (Subtle Luxury Depth)
    ========================================================= */
    const heroImage = document.querySelector(".main-bg");
    
    if (heroImage) {
        window.addEventListener("scroll", () => {
            if (window.innerWidth > 768) {
                const scrolled = window.scrollY;
                // Subtle parallax effect (moves slower than scroll)
                heroImage.style.transform = `scale(1.05) translateY(${scrolled * 0.15}px)`;
            }
        }, { passive: true });
    }


    /* =========================================================
       5. LOVE STORY GALLERY (Smooth Scroll & Progress)
    ========================================================= */
    const gallery = document.getElementById("journeyTrack");
    const nextButton = document.getElementById("galleryNext");
    const prevButton = document.getElementById("galleryPrev");
    const progress = document.getElementById("galleryProgress");

    let autoGalleryInterval;

    function getSlideDistance() {
        const card = gallery ? gallery.querySelector(".journey-card") : null;
        if (!card) return 400;
        // Get exact width + gap for pixel-perfect scrolling
        const style = window.getComputedStyle(gallery);
        const gap = parseInt(style.gap) || 25;
        return card.offsetWidth + gap;
    }

    function updateGalleryProgress() {
        if (!gallery || !progress) return;
        const maxScroll = gallery.scrollWidth - gallery.clientWidth;
        if (maxScroll <= 0) return;
        const percentage = (gallery.scrollLeft / maxScroll) * 100;
        progress.style.width = `${Math.max(5, percentage)}%`;
    }

    if (nextButton && prevButton && gallery) {
        nextButton.addEventListener("click", () => {
            gallery.scrollBy({ left: getSlideDistance(), behavior: "smooth" });
        });

        prevButton.addEventListener("click", () => {
            gallery.scrollBy({ left: -getSlideDistance(), behavior: "smooth" });
        });

        gallery.addEventListener("scroll", updateGalleryProgress, { passive: true });
    }

    // Auto-gallery with pause on interaction
    function startAutoGallery() {
        stopAutoGallery(); // Prevent multiple intervals
        if (!gallery) return;
        
        autoGalleryInterval = setInterval(() => {
            const maxScroll = gallery.scrollWidth - gallery.clientWidth;
            if (gallery.scrollLeft >= maxScroll - 10) {
                gallery.scrollTo({ left: 0, behavior: "smooth" });
            } else {
                gallery.scrollBy({ left: getSlideDistance(), behavior: "smooth" });
            }
        }, 5000); // 5 seconds per slide
    }

    function stopAutoGallery() {
        clearInterval(autoGalleryInterval);
    }

    if (gallery) {
        startAutoGallery();
        gallery.addEventListener("mouseenter", stopAutoGallery);
        gallery.addEventListener("mouseleave", startAutoGallery);
        gallery.addEventListener("touchstart", stopAutoGallery, { passive: true });
        gallery.addEventListener("touchend", startAutoGallery, { passive: true });
    }


    /* =========================================================
       6. ADVANCED SCROLL REVEAL (Staggered & Performant)
       *** FIXED: Added .program-container and .detail-card ***
    ========================================================= */
    const revealElements = document.querySelectorAll(
        ".intro-section, .story-heading, .program-card, .program-container, .detail-card, .venue-content, .information-card, .journey-card"
    );

    // Ensure all elements start with the reveal class
    revealElements.forEach(el => el.classList.add("reveal"));

    const revealObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Apply staggered delay if data-delay exists
                    const delay = entry.target.dataset.delay || 0;
                    setTimeout(() => {
                        entry.target.classList.add("visible");
                    }, delay);
                    
                    // Unobserve after revealing for better performance
                    revealObserver.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.15,
            rootMargin: "0px 0px -50px 0px"
        }
    );

    revealElements.forEach((el, index) => {
        // Auto-stagger program cards, info cards, and detail cards
        if (el.classList.contains("program-card") || 
            el.classList.contains("information-card") || 
            el.classList.contains("detail-card")) {
            el.dataset.delay = (index % 3) * 150; // 0ms, 150ms, 300ms stagger
        }
        revealObserver.observe(el);
    });


    /* =========================================================
       7. WEDDING COUNTDOWN TIMER (Elegant & Live)
    ========================================================= */
    // Target Date: December 12, 2026
    const weddingDate = new Date("December 12, 2026 00:00:00").getTime();
    const countdownContainer = document.getElementById("countdown-timer");
    
    if (countdownContainer) {
        function updateCountdown() {
            const now = new Date().getTime();
            const distance = weddingDate - now;

            if (distance < 0) {
                countdownContainer.innerHTML = "<span style='font-family: var(--script); font-size: 32px; color: var(--blush);'>We are married! ♡</span>";
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            const dEl = document.getElementById("count-days");
            const hEl = document.getElementById("count-hours");
            const mEl = document.getElementById("count-minutes");
            const sEl = document.getElementById("count-seconds");

            if (dEl) dEl.textContent = String(days).padStart(2, '0');
            if (hEl) hEl.textContent = String(hours).padStart(2, '0');
            if (mEl) mEl.textContent = String(minutes).padStart(2, '0');
            if (sEl) sEl.textContent = String(seconds).padStart(2, '0');
        }

        updateCountdown();
        setInterval(updateCountdown, 1000);
    }


    /* =========================================================
       8. ELEGANT TOAST NOTIFICATION (Replaces ugly alerts)
    ========================================================= */
    window.showToast = function(message, duration = 4000) {
        // Remove existing toast if any
        const existingToast = document.querySelector(".wedding-toast");
        if (existingToast) existingToast.remove();

        // Create toast element
        const toast = document.createElement("div");
        toast.className = "wedding-toast";
        toast.innerHTML = `
            <div class="toast-icon">✦</div>
            <div class="toast-message">${message}</div>
        `;

        // Inject styles dynamically for a self-contained solution
        if (!document.getElementById("toast-styles")) {
            const style = document.createElement("style");
            style.id = "toast-styles";
            style.textContent = `
                .wedding-toast {
                    position: fixed;
                    bottom: 30px;
                    left: 50%;
                    transform: translateX(-50%) translateY(20px);
                    background: rgba(10, 10, 14, 0.95);
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(201, 139, 154, 0.3);
                    color: #fdfbfa;
                    padding: 16px 28px;
                    border-radius: 4px;
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    z-index: 10000;
                    opacity: 0;
                    transition: all 0.5s cubic-bezier(0.22, 1, 0.36, 1);
                    box-shadow: 0 10px 40px rgba(0,0,0,0.3);
                    max-width: 90vw;
                    text-align: center;
                }
                .wedding-toast.show {
                    opacity: 1;
                    transform: translateX(-50%) translateY(0);
                }
                .toast-icon {
                    color: #c98b9a;
                    font-size: 18px;
                }
                .toast-message {
                    font-family: 'Montserrat', sans-serif;
                    font-size: 11px;
                    letter-spacing: 1px;
                    line-height: 1.5;
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(toast);

        // Trigger animation
        requestAnimationFrame(() => {
            toast.classList.add("show");
        });

        // Remove after duration
        setTimeout(() => {
            toast.classList.remove("show");
            setTimeout(() => toast.remove(), 500);
        }, duration);
    };


    /* =========================================================
       9. PHOTO SHARING INTERACTION
    ========================================================= */
    window.photoMessage = function(event) {
        if (event) event.preventDefault();
        
        showToast(
            "Photo sharing will be available soon! <br> We can't wait to see your beautiful moments.",
            5000
        );
    };


    /* =========================================================
       10. CONSOLE EASTER EGG
    ========================================================= */
    console.log(
        "%c ✦ Sibongile & Lukhanyo ✦ ",
        "background: #c98b9a; color: #0a0a0e; font-size: 14px; font-weight: bold; padding: 8px 12px; border-radius: 4px;"
    );
    console.log(
        "%c Wedding Program loaded perfectly. ",
        "color: #8a9db0; font-size: 11px; letter-spacing: 1px;"
    );

});