/**
 * Minimal Terminal Portfolio Script
 * Handles typewriter effects, scroll animations, and dynamic nav.
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Intersection Observer for Fade-In Elements
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Add fade-in classes to elements
    const fadeElements = document.querySelectorAll('.project-card, .about-terminal, .contact-card, .section-title, .section-intro');
    fadeElements.forEach(el => {
        el.classList.add('fade-in');
        sectionObserver.observe(el);
    });

    // 3. Navbar scroll effect
    const navbar = document.getElementById('navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        // Add subtle shadow when scrolling down
        if (currentScroll > 50) {
            navbar.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';
        } else {
            navbar.style.boxShadow = 'none';
        }

        // Hide nav on scroll down, show on scroll up (optional UX touch)
        if (currentScroll > lastScroll && currentScroll > 100) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScroll = currentScroll;
    });
});
