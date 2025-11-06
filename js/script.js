// Share functionality - Class-based approach
window.toggleShare = function(e) {
    e.preventDefault();
    e.stopPropagation();
    
    const btn = e.target.closest('.btn_share');
    const dropdown = btn.nextElementSibling; // Get the dropdown next to the button
    const allDropdowns = document.querySelectorAll('.share-dropdown');
    
    // Close all other dropdowns
    allDropdowns.forEach(function(d) {
        if (d !== dropdown) {
            d.classList.remove('active');
            const shareBtn = d.previousElementSibling;
            if (shareBtn) {
                shareBtn.setAttribute('aria-expanded', 'false');
            }
        }
    });
    
    // Toggle current dropdown
    dropdown.classList.toggle('active');
    btn.setAttribute('aria-expanded', dropdown.classList.contains('active'));
};

// Copy link functionality - Class-based approach
window.copyLink = function(e, url) {
    e.preventDefault();
    e.stopPropagation();
    
    const copyBtn = e.target.closest('.share-option');
    const dropdown = copyBtn.closest('.share-dropdown');
    const originalText = copyBtn.querySelector('span').textContent;
    
    navigator.clipboard.writeText(url).then(function() {
        copyBtn.querySelector('span').textContent = 'Copied!';
        copyBtn.style.background = '#10b981';
        copyBtn.style.color = 'white';
        
        setTimeout(function() {
            copyBtn.querySelector('span').textContent = originalText;
            copyBtn.style.background = '';
            copyBtn.style.color = '';
        }, 2000);
    }).catch(function() {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = url;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        
        copyBtn.querySelector('span').textContent = 'Copied!';
        copyBtn.style.background = '#10b981';
        copyBtn.style.color = 'white';
        
        setTimeout(function() {
            copyBtn.querySelector('span').textContent = originalText;
            copyBtn.style.background = '';
            copyBtn.style.color = '';
        }, 2000);
    });
};

// Close dropdowns when clicking outside
document.addEventListener('click', function(e) {
    if (!e.target.closest('.btn_share') && !e.target.closest('.share-dropdown')) {
        document.querySelectorAll('.share-dropdown').forEach(function(d) {
            d.classList.remove('active');
            const shareBtn = d.previousElementSibling;
            if (shareBtn) {
                shareBtn.setAttribute('aria-expanded', 'false');
            }
        });
    }
});

// Close dropdowns on escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        document.querySelectorAll('.share-dropdown').forEach(function(d) {
            d.classList.remove('active');
            const shareBtn = d.previousElementSibling;
            if (shareBtn) {
                shareBtn.setAttribute('aria-expanded', 'false');
            }
        });
    }
});

// Tours Swiper Configuration
document.addEventListener('DOMContentLoaded', function() {
    const toursSwiper = new Swiper('.tours-swiper', {
        slidesPerView: 3,
        spaceBetween: 30,
        loop: true,
        autoplay: {
            delay: 2000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
        },
        speed: 400,
 
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
 
        breakpoints: {
            // Mobile (up to 767px): 1 slide
            320: {
                slidesPerView: 1,
                spaceBetween: 15,
                speed: 300,
            },
            // Tablet (768px and up): 2 slides
            768: {
                slidesPerView: 2,
                spaceBetween: 20,
            },
            // Desktop (1024px and up): 3 slides
            1024: {
                slidesPerView: 3,
                spaceBetween: 30,
            },
            // Large screens (1200px and up): 3 slides with more space
            1200: {
                slidesPerView: 3,
                spaceBetween: 30,
            }
        },

    });

    const categoriesSwiper = new Swiper('.categories-swiper', {
        slidesPerView: 3,
        spaceBetween: 30,
        loop: true,
        autoplay: {
            delay: 200000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
        },
        speed: 400,
 
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
 
        breakpoints: {
            // Mobile (up to 767px): 1 slide
            320: {
                slidesPerView: 1,
                spaceBetween: 10,
                
            },
            // Tablet (768px and up): 2 slides
            768: {
                slidesPerView: 2,
                spaceBetween: 20,
            },
            // Desktop (1024px and up): 3 slides
            1024: {
                slidesPerView: 3,
                spaceBetween: 30,
            },
            // Large screens (1200px and up): 3 slides with more space
            1200: {
                slidesPerView: 3,
                spaceBetween: 30,
            }
        },

    });

    // Testimonial Swiper Configuration
    const testimonialSwiper = new Swiper('.testimonial-swiper', {
        slidesPerView: 3,
        spaceBetween: 30,
        loop: true,
        autoplay: {
            delay: 3000,
            disableOnInteraction: false,
        },
        speed: 600,
        // Navigation arrows
        navigation: {
            nextEl: '.testimonial-swiper .swiper-button-next',
            prevEl: '.testimonial-swiper .swiper-button-prev',
        },
        
        // Pagination
        pagination: {
            el: '.testimonial-swiper .swiper-pagination',
            clickable: true,
        },

        breakpoints: {
            // Mobile (up to 767px): 1 slide
            320: {
                slidesPerView: 1,
                spaceBetween: 10,
                  speed: 400,
            },
            // Tablet (768px and up): 2 slides
            768: {
                slidesPerView: 2,
                spaceBetween: 20,
            },
            // Desktop (1024px and up): 3 slides
            1024: {
                slidesPerView: 3,
                spaceBetween: 30,
            }
        },

    });

    // ===== Destinations Tabs Functionality =====
    const tabs = document.querySelectorAll('.dest-tab');
    const panels = document.querySelectorAll('.dest-panel');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // remove active
            tabs.forEach(t => t.classList.remove('active'));
            panels.forEach(p => p.classList.remove('active'));

            // add active
            tab.classList.add('active');
            const targetPanel = document.getElementById(tab.dataset.target);
            if (targetPanel) {
                targetPanel.classList.add('active');
            }
        });
    });

    // ===== Product Page Tabs (About/Gallery/Review) =====
    const productTabBtns = document.querySelectorAll('.product-card-section .tab-btn');
    const productPanels = document.querySelectorAll('.product-card-section .tab-panel');

    productTabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            productTabBtns.forEach(b => b.classList.remove('active'));
            productPanels.forEach(p => p.classList.remove('active'));
            btn.classList.add('active');
            const targetId = `tab-${btn.dataset.tab}`;
            const targetPanel = document.getElementById(targetId);
            if (targetPanel) targetPanel.classList.add('active');
        });
    });

    // ===== Product Hero Swiper =====
    const heroSwiperContainer = document.querySelector('.product-hero-swiper');
    if (heroSwiperContainer && window.Swiper) {
        const heroSwiper = new Swiper('.product-hero-swiper', {
            slidesPerView: 1,
            spaceBetween: 0,
            loop: true,
            speed: 400,
            pagination: {
                el: '.product-hero-swiper .swiper-pagination',
                clickable: true,
            },
        });

        // Thumbnails click to navigate + active highlighting
        const thumbs = document.querySelectorAll('.thumbs-strip img[data-index]');

        const setActiveThumb = (idx) => {
            thumbs.forEach((t, i) => {
                if (i === idx) t.classList.add('active');
                else t.classList.remove('active');
            });
        };

        // init active state
        setActiveThumb(heroSwiper.realIndex || 0);

        // sync on swiper slide change
        heroSwiper.on('slideChange', () => {
            setActiveThumb(heroSwiper.realIndex);
        });

        // click to navigate and set active
        thumbs.forEach(thumb => {
            thumb.addEventListener('click', () => {
                const idx = parseInt(thumb.getAttribute('data-index'), 10);
                if (!Number.isNaN(idx)) {
                    heroSwiper.slideTo(idx);
                    setActiveThumb(idx);
                }
            });
        });
    }

    // ===== Trust Swiper (Vertical Badges) =====
    const trustSwiperEl = document.querySelector('.trust-swiper');
    if (trustSwiperEl && window.Swiper) {
        const trustSwiper = new Swiper('.trust-swiper', {
            direction: 'vertical',
            slidesPerView: 1,
            loop: true,
            // حركة صعود مع تلاشي باستخدام Creative Effect
            effect: 'creative',
            creativeEffect: {
                prev: {
                    translate: [0, -60, -60],
                    scale: 0.98,
                    opacity: 0,
                    shadow: false,
                },
                next: {
                    translate: [0, 60, -60],
                    scale: 0.98,
                    opacity: 0,
                    shadow: false,
                },
            },
            autoplay: { delay: 3000, disableOnInteraction: false },
            speed: 500,
            observeParents: true,
            observer: true,
        });
    }

    // ===== Counter Animation Function =====
    function animateCounter(element) {
        const target = parseInt(element.textContent);
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16); // 60fps
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current);
            }
        }, 16);
    }

    // ===== Scroll Animations with Intersection Observer =====
    
    // Create intersection observer
    const observerOptions = {
        threshold: 0.1, // Trigger when 10% of element is visible
        rootMargin: '0px 0px -50px 0px' // Trigger 50px before element enters viewport
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add animation class when element enters viewport
                entry.target.classList.add('animate-visible');
                
                // Handle counter animation specifically
                if (entry.target.classList.contains('counter-animate')) {
                    const counterSpan = entry.target.querySelector('span');
                    if (counterSpan && !counterSpan.classList.contains('counted')) {
                        counterSpan.classList.add('counted');
                        animateCounter(counterSpan);
                    }
                }
                
                // Optional: Stop observing after animation (for performance)
                // observer.unobserve(entry.target);
            } else {
                // Optional: Remove animation class when element leaves viewport
                // This allows re-animation when scrolling back up
                // entry.target.classList.remove('animate-visible');
            }
        });
    }, observerOptions);

    // Function to initialize scroll animations
    function initScrollAnimations() {
        // Select all elements with animation classes
        const animatedElements = document.querySelectorAll(
            '.animate-on-scroll, .fade-in, .slide-up, .slide-left, .slide-right, .scale-in, .animate-stagger, .bounce-in, .rotate-fade, .flip-in, .zoom-blur, .text-reveal, .counter-animate'
        );

        // Observe each animated element
        animatedElements.forEach(element => {
            observer.observe(element);
        });
    }

    // Initialize animations when DOM is loaded
    initScrollAnimations();

    // Performance optimization: Pause animations when page is not visible
    document.addEventListener('visibilitychange', () => {
        const animatedElements = document.querySelectorAll('.animate-on-scroll, .fade-in, .slide-up, .slide-left, .slide-right, .scale-in, .bounce-in, .rotate-fade, .flip-in, .zoom-blur, .text-reveal, .counter-animate');
        
        if (document.hidden) {
            // Pause animations when tab is not active
            animatedElements.forEach(el => {
                el.style.animationPlayState = 'paused';
            });
        } else {
            // Resume animations when tab becomes active
            animatedElements.forEach(el => {
                el.style.animationPlayState = 'running';
            });
        }
    });

    // Smooth scroll performance optimization
    let ticking = false;
    
    function updateAnimations() {
        // This function can be used for additional scroll-based animations
        // Currently handled by Intersection Observer for better performance
        ticking = false;
    }

    // Optional: Add scroll listener for additional effects (use sparingly)
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateAnimations);
            ticking = true;
        }
    });

    // ===== Description Expand/Collapse =====
    function initDescriptionToggle() {
        const sections = document.querySelectorAll('.description-section');
        sections.forEach(section => {
            const box = section.querySelector('.desc-box');
            const content = section.querySelector('.desc-content');
            const btn = section.querySelector('.desc-toggle');
            if (!box || !content || !btn) return;

            const collapsed = parseInt(box.getAttribute('data-collapsed-height') || '160', 10);
            box.style.height = collapsed + 'px';
            btn.setAttribute('aria-expanded', 'false');

            btn.addEventListener('click', () => {
                const expanded = section.classList.contains('expanded');
                const start = box.offsetHeight;
                const end = expanded ? collapsed : content.scrollHeight;

                box.style.height = start + 'px';
                // Force reflow
                void box.offsetHeight;
                box.style.transition = 'height 400ms ease';
                box.style.height = end + 'px';

                section.classList.toggle('expanded', !expanded);
                btn.setAttribute('aria-expanded', String(!expanded));
                const txt = btn.querySelector('.toggle-text');
                if (txt) txt.textContent = expanded ? 'Show More' : 'Show Less';

                const onEnd = (e) => {
                    if (e.propertyName !== 'height') return;
                    box.removeEventListener('transitionend', onEnd);
                    if (!expanded) {
                        // After expanding, set to auto so content can grow with layout
                        box.style.height = 'auto';
                    }
                };
                box.addEventListener('transitionend', onEnd);
            });
        });
    }

    initDescriptionToggle();

    // ===== FAQ Accordion =====
    function initFAQAccordion() {
        const faqSections = document.querySelectorAll('.faq-section');
        faqSections.forEach(section => {
            const items = section.querySelectorAll('.faq-item');
            items.forEach(item => {
                const btn = item.querySelector('.faq-question');
                const answer = item.querySelector('.faq-answer');
                if (!btn || !answer) return;

                // Initialize collapsed state
                btn.setAttribute('aria-expanded', 'false');
                // Ensure answers are not display:none
                answer.removeAttribute('hidden');
                answer.style.maxHeight = '0px';

                btn.addEventListener('click', () => {
                    const isOpen = item.classList.contains('open');

                    // Close others (accordion behavior)
                    items.forEach(other => {
                        if (other !== item && other.classList.contains('open')) {
                            other.classList.remove('open');
                            const otherBtn = other.querySelector('.faq-question');
                            const otherAnswer = other.querySelector('.faq-answer');
                            if (otherBtn && otherAnswer) {
                                otherBtn.setAttribute('aria-expanded', 'false');
                                otherAnswer.style.maxHeight = otherAnswer.scrollHeight + 'px';
                                void otherAnswer.offsetHeight;
                                otherAnswer.style.maxHeight = '0px';
                            }
                        }
                    });

                    // Toggle current item
                    item.classList.toggle('open', !isOpen);
                    btn.setAttribute('aria-expanded', String(!isOpen));
                    if (!isOpen) {
                        answer.style.maxHeight = answer.scrollHeight + 'px';
                    } else {
                        answer.style.maxHeight = '0px';
                    }
                });
            });
        });
    }

    initFAQAccordion();
});