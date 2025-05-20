/**
 * Timeline Animation Script
 * This script initializes the AOS (Animate On Scroll) library
 * specifically for the timeline section on the about page.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize AOS library with specific settings for timeline animations
    AOS.init({
        // Animation duration in milliseconds
        duration: 800,
        
        // Easing for AOS animations
        easing: 'ease-in-out',
        
        // Only animate elements once
        once: true,
        
        // Offset (in px) from the original trigger point
        offset: 120,
        
        // Delay animation (ms)
        delay: 100
    });
});
