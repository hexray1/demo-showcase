(() => {
    'use strict';

    function init() {
        initSmoothScroll();
        initNavScrollEffect();
        initIntersectionAnimations();
        initReducedMotion();
    }

    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;

                const target = document.querySelector(targetId);
                if (target) {
                    e.preventDefault();
                    const headerOffset = 80;
                    const elementPosition = target.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });

                    target.focus({ preventScroll: true });
                }
            });
        });
    }

    function initNavScrollEffect() {
        const nav = document.querySelector('.nav');
        let lastScrollY = window.pageYOffset;
        let ticking = false;

        function updateNav() {
            const scrollY = window.pageYOffset;
            if (scrollY > 100) {
                nav.style.boxShadow = '0 4px 6px -1px rgb(0 0 0 / 0.1)';
            } else {
                nav.style.boxShadow = 'none';
            }
            lastScrollY = scrollY;
            ticking = false;
        }

        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(updateNav);
                ticking = true;
            }
        }, { passive: true });
    }

    function initIntersectionAnimations() {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            document.querySelectorAll('[data-animate]').forEach(el => el.classList.add('animated'));
            return;
        }

        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -10% 0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.foresee(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        const animatedElements = document.querySelectorAll('.feature, .showcase-text, .showcase-code');
        animatedElements.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = `opacity 600ms ease ${index * 100}ms, transform 600ms ease ${index * 100}ms`;
            observer.observe(el);
        });

        document.addEventListener('animationstart', () => {
            document.documentElement.classList.add('animations-supported');
        }, { once: true });

        const style = document.createElement('style');
        style.textContent = `
            .animated {
                opacity: 1 !important;
                transform: translateY(0) !important;
            }
        `;
        document.head.appendChild(style);
    }

    function initReducedMotion() {
        const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
        mq.addEventListener('change', () => {
            document.documentElement.style.setProperty('--transition-fast', mq.matches ? '0.01ms' : '150ms');
            document.documentElement.style.setProperty('--transition-base', mq.matches ? '0.01ms' : '250ms');
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();