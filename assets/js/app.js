/* ========================================
   APP.JS - Smooth Scroll, Navigation
   ======================================== */

(function() {
  'use strict';

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Smooth scroll for anchor links
  function initSmoothScroll() {
    if (prefersReducedMotion) {
      return; // Skip smooth scroll if user prefers reduced motion
    }

    const anchors = document.querySelectorAll('a[href^="#"]');
    
    anchors.forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        
        // Only handle internal anchor links
        if (href !== '#' && href.length > 1) {
          const target = document.querySelector(href);
          
          if (target) {
            e.preventDefault();
            const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
            const targetPosition = target.offsetTop - headerHeight;
            
            window.scrollTo({
              top: targetPosition,
              behavior: 'smooth'
            });
          }
        }
      });
    });
  }

  // Handle external links (open in new tab)
  function initExternalLinks() {
    const externalLinks = document.querySelectorAll('a[href^="http"]');
    
    externalLinks.forEach(link => {
      // Only add target="_blank" if not already set
      if (!link.hasAttribute('target')) {
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
      }
    });
  }

  // Initialize navigation active state
  function initNavigation() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.header__nav-link, .footer__nav-link');
    
    navLinks.forEach(link => {
      try {
        // Handle both absolute and relative URLs
        let linkPath;
        if (link.href.startsWith('http://') || link.href.startsWith('https://')) {
          linkPath = new URL(link.href).pathname;
        } else {
          // For relative URLs, resolve against current location
          const baseUrl = window.location.origin + window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/') + 1);
          linkPath = new URL(link.getAttribute('href'), baseUrl).pathname;
        }
        
        // Remove trailing slash for comparison
        const normalizedCurrent = currentPath.replace(/\/$/, '') || '/';
        const normalizedLink = linkPath.replace(/\/$/, '') || '/';
        
        // Check if current path matches link path
        if (normalizedCurrent === normalizedLink || 
            (normalizedCurrent !== '/' && normalizedCurrent.endsWith(normalizedLink)) ||
            (normalizedLink !== '/' && normalizedLink.endsWith(normalizedCurrent))) {
          link.classList.add('header__nav-link--active');
        }
      } catch (e) {
        // If URL parsing fails, use simple href comparison
        const href = link.getAttribute('href');
        if (currentPath.includes(href) || (href === 'index.html' && currentPath.endsWith('/') || currentPath.endsWith('/index.html'))) {
          link.classList.add('header__nav-link--active');
        }
      }
    });
  }

  // Ensure logo link always goes to root
  function initLogoLink() {
    const logoLink = document.querySelector('.header__logo');
    
    if (logoLink) {
      // Always set href to root explicitly using window.location.origin for absolute path
      const rootUrl = window.location.origin + '/';
      logoLink.setAttribute('href', rootUrl);
      
      // Add click handler to ensure consistent navigation to root
      logoLink.addEventListener('click', function(e) {
        e.preventDefault();
        // Always navigate to root, clearing any path
        window.location.href = rootUrl;
      });
    }
  }

  // Initialize mobile menu toggle
  function initMobileMenu() {
    const toggle = document.querySelector('.header__nav-toggle');
    const menu = document.querySelector('.header__nav-menu');
    
    if (toggle && menu) {
      toggle.addEventListener('click', function() {
        const isActive = toggle.classList.contains('active');
        
        if (isActive) {
          toggle.classList.remove('active');
          menu.classList.remove('active');
          toggle.setAttribute('aria-expanded', 'false');
        } else {
          toggle.classList.add('active');
          menu.classList.add('active');
          toggle.setAttribute('aria-expanded', 'true');
        }
      });
      
      // Close menu when clicking outside
      document.addEventListener('click', function(e) {
        if (!toggle.contains(e.target) && !menu.contains(e.target)) {
          toggle.classList.remove('active');
          menu.classList.remove('active');
          toggle.setAttribute('aria-expanded', 'false');
        }
      });
      
      // Close menu when clicking a link
      const menuLinks = menu.querySelectorAll('.header__nav-link');
      menuLinks.forEach(link => {
        link.addEventListener('click', function() {
          toggle.classList.remove('active');
          menu.classList.remove('active');
          toggle.setAttribute('aria-expanded', 'false');
        });
      });
    }
  }

  // Initialize on DOM ready
  function init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
      return;
    }

    initSmoothScroll();
    initExternalLinks();
    initNavigation();
    initLogoLink();
    initMobileMenu();
  }

  // Start initialization
  init();
})();

