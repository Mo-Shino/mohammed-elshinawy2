// Loading screen
        window.addEventListener('load', () => {
            const loading = document.getElementById('loading');
            setTimeout(() => {
                loading.classList.add('hidden');
            }, 500);
        });
        
        // Fade in animation on scroll
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);
        
        document.querySelectorAll('.fade-in').forEach(el => {
            observer.observe(el);
        });
        
        // Smooth scrolling
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            });
        });
        
        // Enhanced visual effects
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const nav = document.querySelector('.nav');
            
            if (scrolled > 50) {
                nav.style.background = 'rgba(255, 255, 255, 0.98)';
                nav.style.boxShadow = '0 5px 30px rgba(0, 0, 0, 0.1)';
            } else {
                nav.style.background = 'rgba(255, 255, 255, 0.95)';
                nav.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
            }
        });
        
        // PDF iframe error fallback
        const pdfIframes = document.querySelectorAll('.project-pdf iframe');
        pdfIframes.forEach(iframe => {
          iframe.addEventListener('error', () => {
            iframe.style.display = 'none';
            iframe.nextElementSibling.style.display = 'block';
          });
        });

        
        // Image lazy loading enhancement
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            img.addEventListener('load', () => {
                img.style.opacity = '1';
            });
            
            img.addEventListener('error', () => {
                img.style.opacity = '0.5';
                img.alt = 'لا يمكن تحميل الصورة';
            });
        });
        
        // Add entrance animation delay
        document.querySelectorAll('.fade-in').forEach((el, index) => {
            el.style.transitionDelay = `${index * 0.1}s`;
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                window.location.href = 'index.html#portfolio';
            }
        });