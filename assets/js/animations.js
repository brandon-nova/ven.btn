/* ========================================
   ANIMATIONS.JS - IntersectionObserver, Parallax
   ======================================== */

(function() {
  'use strict';

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Fade-up animation on scroll
  function initFadeUpAnimation() {
    if (prefersReducedMotion) {
      // Still show elements, just without animation
      const elements = document.querySelectorAll('.fade-up, .tile');
      elements.forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      });
      return;
    }

    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -50px 0px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          // Add staggered delay based on index
          const delay = Math.min(index * 0.1, 0.6);
          
          setTimeout(() => {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }, delay * 1000);
          
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observe tiles and fade-up elements
    const elements = document.querySelectorAll('.tile, .fade-up');
    elements.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(el);
    });
  }

  // Minimal parallax effect (capped for performance)
  function initParallax() {
    if (prefersReducedMotion) {
      return;
    }

    let ticking = false;
    const parallaxElements = document.querySelectorAll('.hero__accent, .section__divider');

    function updateParallax() {
      const scrolled = window.pageYOffset;
      const rate = scrolled * 0.1; // Capped parallax rate

      parallaxElements.forEach(el => {
        // Only apply subtle parallax
        const transform = `translateY(${rate * 0.2}px)`;
        el.style.transform = transform;
      });

      ticking = false;
    }

    function requestTick() {
      if (!ticking) {
        window.requestAnimationFrame(updateParallax);
        ticking = true;
      }
    }

    // Throttle scroll events
    let lastScrollTop = 0;
    window.addEventListener('scroll', () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      // Only update if scroll difference is significant
      if (Math.abs(scrollTop - lastScrollTop) > 5) {
        requestTick();
        lastScrollTop = scrollTop;
      }
    }, { passive: true });
  }

  // Initialize on DOM ready
  function init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
      return;
    }

    initFadeUpAnimation();
    initParallax();
  }

  // Start initialization
  init();
})();

