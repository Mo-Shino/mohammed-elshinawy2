// Enhanced Responsive JavaScript with Improved Mobile Support
(function() {
    'use strict';
    
    // Configuration object for easy customization
    const config = {
        scrollThreshold: 50,
        typewriterSpeed: 80,
        typewriterDelay: 500,
        parallaxSensitivity: {
            desktop: { content: 0.5, visual: 0.3 },
            tablet: { content: 0.3, visual: 0.2 },
            mobile: { content: 0.1, visual: 0.1 }
        },
        animationDelays: {
            skills: 0.1,
            portfolio: 0.15
        }
    };
    
    // Device detection utility
    const deviceDetection = {
        isMobile: () => window.innerWidth <= 768,
        isTablet: () => window.innerWidth > 768 && window.innerWidth <= 1024,
        isDesktop: () => window.innerWidth > 1024,
        
        getDeviceType: () => {
            if (deviceDetection.isMobile()) return 'mobile';
            if (deviceDetection.isTablet()) return 'tablet';
            return 'desktop';
        }
    };
    
    // Debounce utility for performance optimization
    const debounce = (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    };
    
    // Throttle utility for scroll events
    const throttle = (func, limit) => {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    };
    
    // Smooth scrolling for navigation links with responsive offset
    const initSmoothScrolling = () => {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    const offset = deviceDetection.isMobile() ? 70 : 80;
                    const targetPosition = target.offsetTop - offset;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    };
    
    // Enhanced intersection observer with responsive options
    const initScrollAnimations = () => {
        const observerOptions = {
            threshold: deviceDetection.isMobile() ? 0.05 : 0.1,
            rootMargin: deviceDetection.isMobile() ? '0px 0px -30px 0px' : '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    // Remove observer after animation to improve performance
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        document.querySelectorAll('.fade-in').forEach(el => {
            observer.observe(el);
        });
    };
    
    // Responsive navigation background with performance optimization
    const initNavigationEffects = () => {
        const nav = document.querySelector('.nav');
        if (!nav) return;
        
        const handleScroll = throttle(() => {
            const scrollY = window.scrollY;
            const threshold = deviceDetection.isMobile() ? 30 : config.scrollThreshold;
            
            if (scrollY > threshold) {
                nav.style.background = 'rgba(255, 255, 255, 0.98)';
                nav.style.backdropFilter = 'blur(10px)';
            } else {
                nav.style.background = 'rgba(255, 255, 255, 0.95)';
                nav.style.backdropFilter = 'blur(5px)';
            }
        }, 16); // ~60fps
        
        window.addEventListener('scroll', handleScroll);
    };
    
    // Responsive parallax effect with device-specific sensitivity
    const initParallaxEffects = () => {
        if (deviceDetection.isMobile()) {
            // Disable parallax on mobile for better performance
            return;
        }
        
        const heroContent = document.querySelector('.hero-content');
        const heroVisual = document.querySelector('.hero-visual');
        
        if (!heroContent || !heroVisual) return;
        
        const handleParallax = throttle(() => {
            const scrolled = window.pageYOffset;
            const deviceType = deviceDetection.getDeviceType();
            const sensitivity = config.parallaxSensitivity[deviceType];
            
            // Only apply parallax when elements are in viewport
            const heroRect = heroContent.getBoundingClientRect();
            if (heroRect.bottom > 0 && heroRect.top < window.innerHeight) {
                heroContent.style.transform = `translateY(${scrolled * sensitivity.content}px)`;
                heroVisual.style.transform = `translateY(${scrolled * sensitivity.visual}px)`;
            }
        }, 16);
        
        window.addEventListener('scroll', handleParallax);
    };
    
    // Enhanced typewriter effect with responsive speed
    const typeWriter = (element, text, speed = config.typewriterSpeed) => {
        if (!element || !text) return;
        
        let i = 0;
        element.innerHTML = '';
        
        // Adjust speed based on device
        const adjustedSpeed = deviceDetection.isMobile() ? speed * 0.7 : speed;
        
        const type = () => {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, adjustedSpeed);
            }
        };
        
        type();
    };
    
    // Initialize typewriter effect with intersection observer
    const initTypewriterEffect = () => {
        const heroTitle = document.querySelector('.hero-content h1');
        if (!heroTitle) return;
        
        const originalText = heroTitle.textContent;
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        typeWriter(heroTitle, originalText);
                    }, config.typewriterDelay);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(heroTitle);
    };
    
    // Enhanced portfolio interactions with touch support
    const initPortfolioEffects = () => {
        document.querySelectorAll('.portfolio-item').forEach(item => {
            // Mouse events for desktop
            item.addEventListener('mouseenter', function() {
                if (!deviceDetection.isMobile()) {
                    this.style.transform = 'translateY(-10px) scale(1.02)';
                    this.style.transition = 'transform 0.3s ease';
                }
            });
            
            item.addEventListener('mouseleave', function() {
                if (!deviceDetection.isMobile()) {
                    this.style.transform = 'translateY(0) scale(1)';
                }
            });
            
            // Touch events for mobile
            item.addEventListener('touchstart', function() {
                if (deviceDetection.isMobile()) {
                    this.style.transform = 'scale(0.98)';
                    this.style.transition = 'transform 0.15s ease';
                }
            });
            
            item.addEventListener('touchend', function() {
                if (deviceDetection.isMobile()) {
                    this.style.transform = 'scale(1)';
                }
            });
        });
    };
    
    // Responsive skill animations
    const initSkillAnimations = () => {
        document.querySelectorAll('.skill-item').forEach((item, index) => {
            const delay = index * config.animationDelays.skills;
            item.style.animationDelay = `${delay}s`;
            item.classList.add('skill-animate');
        });
    };
    
    // Enhanced mobile menu with better accessibility
    const initMobileMenu = () => {
        const navContainer = document.querySelector('.nav-container');
        if (!navContainer) return;
        
        // Create mobile menu toggle
        const mobileMenuToggle = document.createElement('button');
        mobileMenuToggle.innerHTML = '<span class="hamburger-line"></span><span class="hamburger-line"></span><span class="hamburger-line"></span>';
        mobileMenuToggle.className = 'mobile-menu-toggle';
        mobileMenuToggle.setAttribute('aria-label', 'Toggle mobile menu');
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
        
        // Enhanced mobile styles
        const mobileStyles = `
            .mobile-menu-toggle {
                display: none;
                background: none;
                border: none;
                cursor: pointer;
                padding: 0.5rem;
                flex-direction: column;
                gap: 4px;
                z-index: 1001;
            }
            
            .hamburger-line {
                width: 25px;
                height: 3px;
                background: var(--primary, #333);
                transition: all 0.3s ease;
                border-radius: 2px;
            }
            
            .mobile-menu-toggle.active .hamburger-line:nth-child(1) {
                transform: rotate(45deg) translate(6px, 6px);
            }
            
            .mobile-menu-toggle.active .hamburger-line:nth-child(2) {
                opacity: 0;
            }
            
            .mobile-menu-toggle.active .hamburger-line:nth-child(3) {
                transform: rotate(-45deg) translate(6px, -6px);
            }
            
            @media (max-width: 768px) {
                .mobile-menu-toggle {
                    display: flex !important;
                }
                
                .nav-links {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(255, 255, 255, 0.98);
                    backdrop-filter: blur(15px);
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    padding: 2rem;
                    transform: translateX(100%);
                    transition: transform 0.3s ease;
                    z-index: 1000;
                }
                
                .nav-links.active {
                    transform: translateX(0);
                }
                
                .nav-links li {
                    margin: 1rem 0;
                    opacity: 0;
                    transform: translateY(20px);
                    transition: all 0.3s ease;
                }
                
                .nav-links.active li {
                    opacity: 1;
                    transform: translateY(0);
                }
                
                .nav-links.active li:nth-child(1) { transition-delay: 0.1s; }
                .nav-links.active li:nth-child(2) { transition-delay: 0.2s; }
                .nav-links.active li:nth-child(3) { transition-delay: 0.3s; }
                .nav-links.active li:nth-child(4) { transition-delay: 0.4s; }
                .nav-links.active li:nth-child(5) { transition-delay: 0.5s; }
                
                .nav-links a {
                    font-size: 1.5rem;
                    padding: 1rem 2rem;
                    display: block;
                    text-align: center;
                    border-radius: 15px;
                    transition: all 0.3s ease;
                    text-decoration: none;
                }
                
                .nav-links a:hover,
                .nav-links a:focus {
                    background: var(--light-gray, #f8f9fa);
                    transform: scale(1.05);
                }
            }
            
            @media (max-width: 480px) {
                .nav-links a {
                    font-size: 1.3rem;
                    padding: 0.8rem 1.5rem;
                }
            }
        `;
        
        // Add styles to head
        const styleSheet = document.createElement('style');
        styleSheet.textContent = mobileStyles;
        document.head.appendChild(styleSheet);
        
        // Add mobile menu to navigation
        navContainer.appendChild(mobileMenuToggle);
        
        // Mobile menu functionality
        mobileMenuToggle.addEventListener('click', () => {
            const navLinks = document.querySelector('.nav-links');
            const isActive = navLinks.classList.contains('active');
            
            navLinks.classList.toggle('active');
            mobileMenuToggle.classList.toggle('active');
            mobileMenuToggle.setAttribute('aria-expanded', !isActive);
            
            // Prevent body scroll when menu is open
            document.body.style.overflow = isActive ? 'auto' : 'hidden';
        });
        
        // Close mobile menu when clicking on a link
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                const navLinks = document.querySelector('.nav-links');
                navLinks.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = 'auto';
            });
        });
        
        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const navLinks = document.querySelector('.nav-links');
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    mobileMenuToggle.classList.remove('active');
                    mobileMenuToggle.setAttribute('aria-expanded', 'false');
                    document.body.style.overflow = 'auto';
                }
            }
        });
    };
    
    // Enhanced loading animation
    const initLoadingAnimation = () => {
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.5s ease';
        
        window.addEventListener('load', () => {
            setTimeout(() => {
                document.body.style.opacity = '1';
            }, 100);
        });
    };
    
    // Responsive scroll progress indicator
    const initScrollProgress = () => {
        const scrollProgress = document.createElement('div');
        scrollProgress.className = 'scroll-progress';
        scrollProgress.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: ${deviceDetection.isMobile() ? '3px' : '4px'};
            background: linear-gradient(90deg, var(--secondary-brown, #8B4513), var(--secondary-red, #DC143C));
            z-index: 10000;
            transition: width 0.1s ease;
        `;
        document.body.appendChild(scrollProgress);
        
        const updateProgress = throttle(() => {
            const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
            scrollProgress.style.width = Math.min(scrollPercent, 100) + '%';
        }, 16);
        
        window.addEventListener('scroll', updateProgress);
    };
    
    // Enhanced visual effects with responsive considerations
    // Add this to your existing JavaScript code in the initVisualEffects function
// Enhanced floating elements with continuous animation after fade-in

const initEnhancedFloatingElements = () => {
    const floatingElements = document.querySelectorAll('.floating-element');
    
    // Add additional floating elements dynamically
    const heroVisual = document.querySelector('.hero-visual');
    const floatingContainer = document.querySelector('.floating-elements');
    
    if (floatingContainer && floatingElements.length < 5) {
        // Add the 4th and 5th floating elements if they don't exist
        for (let i = floatingElements.length; i < 5; i++) {
            const newElement = document.createElement('div');
            newElement.className = 'floating-element';
            floatingContainer.appendChild(newElement);
        }
    }
    
    // Apply continuous animation after initial fade-in completes
    document.querySelectorAll('.floating-element').forEach((element, index) => {
        const delay = 5500 + (index * 200); // Wait for all initial animations to complete
        
        setTimeout(() => {
            element.classList.add('animate-continuous');
            // Add different animation delays for each element
            element.style.animationDelay = `${index * 0.5}s`;
        }, delay);
    });
    
    // Add hover effects for desktop
    if (!deviceDetection.isMobile()) {
        document.querySelectorAll('.floating-element').forEach(element => {
            element.addEventListener('mouseenter', () => {
                element.style.animationPlayState = 'paused';
                element.style.transform = 'scale(1.2) rotate(45deg)';
                element.style.transition = 'transform 0.3s ease';
            });
            
            element.addEventListener('mouseleave', () => {
                element.style.animationPlayState = 'running';
                element.style.transform = '';
                element.style.transition = '';
            });
        });
    }
};

// Add this call to your existing initVisualEffects function
// or call it separately after the DOM is loaded
const enhancedInitVisualEffects = () => {
    // Your existing visual effects code...
    
    // Gradient text effect for main title
    const heroTitle = document.querySelector('.hero-content h1');
    if (heroTitle) {
        heroTitle.style.background = 'linear-gradient(45deg, var(--primary, #333), var(--secondary-brown, #8B4513))';
        heroTitle.style.webkitBackgroundClip = 'text';
        heroTitle.style.webkitTextFillColor = 'transparent';
        heroTitle.style.backgroundClip = 'text';
        heroTitle.style.backgroundSize = '200% 200%';
        heroTitle.style.animation = 'gradientShift 3s ease infinite';
    }
    
    // Initialize enhanced floating elements
    initEnhancedFloatingElements();
    
    // Add gradient animation keyframes (your existing code)
    const gradientKeyframes = `
        @keyframes gradientShift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }
    `;
    
    const keyframeSheet = document.createElement('style');
    keyframeSheet.textContent = gradientKeyframes;
    document.head.appendChild(keyframeSheet);
};
    
    // Responsive resize handler
    const handleResize = debounce(() => {
        // Close mobile menu if resizing to desktop
        if (deviceDetection.isDesktop()) {
            const navLinks = document.querySelector('.nav-links');
            const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
            
            if (navLinks && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                if (mobileMenuToggle) {
                    mobileMenuToggle.classList.remove('active');
                    mobileMenuToggle.setAttribute('aria-expanded', 'false');
                }
                document.body.style.overflow = 'auto';
            }
        }
        
        // Update scroll progress bar height
        const scrollProgress = document.querySelector('.scroll-progress');
        if (scrollProgress) {
            scrollProgress.style.height = deviceDetection.isMobile() ? '3px' : '4px';
        }
    }, 250);
    
    // Initialize all functionality
    const init = () => {
        // Initialize loading animation first
        initLoadingAnimation();
        
        // Initialize core functionality
        initSmoothScrolling();
        initScrollAnimations();
        initNavigationEffects();
        initParallaxEffects();
        initTypewriterEffect();
        initPortfolioEffects();
        initSkillAnimations();
        initMobileMenu();
        initScrollProgress();
        
        
        // Add resize handler
        window.addEventListener('resize', handleResize);
        
        // Add touch event support for better mobile experience
        document.addEventListener('touchstart', () => {}, { passive: true });
    };
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
})();