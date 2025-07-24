// DOM Elements
const sidebar = document.getElementById('sidebar');
const leftMenuButton = document.getElementById('leftMenuButton');
const navLinks = document.querySelectorAll('.nav-link, .sidebar-link, .footer-link, .cta-button');
const pages = document.querySelectorAll('.page');
const backToTop = document.getElementById('backToTop');
const contactForm = document.getElementById('contactForm');
const mainContent = document.querySelector('.main-content');

// Left-side Menu Toggle
leftMenuButton.addEventListener('click', () => {
    leftMenuButton.classList.toggle('active');
    sidebar.classList.toggle('active');
    document.body.classList.toggle('sidebar-open');
});

// Close sidebar when clicking outside or on close button
document.addEventListener('click', (e) => {
    // Check if clicked on close button (::before pseudo-element)
    if (sidebar.classList.contains('active')) {
        const rect = sidebar.getBoundingClientRect();
        const closeButtonX = rect.right - 50; // Approximate position of close button
        const closeButtonY = rect.top + 30;
        
        if (e.clientX >= closeButtonX && e.clientX <= rect.right && 
            e.clientY >= closeButtonY - 15 && e.clientY <= closeButtonY + 15) {
            // Clicked on close button
            leftMenuButton.classList.remove('active');
            sidebar.classList.remove('active');
            document.body.classList.remove('sidebar-open');
            return;
        }
    }
    
    // Close sidebar when clicking outside
    if (!sidebar.contains(e.target) && !leftMenuButton.contains(e.target) && sidebar.classList.contains('active')) {
        leftMenuButton.classList.remove('active');
        sidebar.classList.remove('active');
        document.body.classList.remove('sidebar-open');
    }
});

// Navigation functionality
function showPage(targetId) {
    // Hide all pages
    pages.forEach(page => page.classList.remove('active'));
    
    // Show target page
    const targetPage = document.getElementById(targetId);
    if (targetPage) {
        targetPage.classList.add('active');
    }
    
    // Update active nav links (for all nav types)
    navLinks.forEach(link => link.classList.remove('active'));
    document.querySelectorAll(`[href="#${targetId}"]`).forEach(link => {
        link.classList.add('active');
    });
    
    // Close sidebar
    leftMenuButton.classList.remove('active');
    sidebar.classList.remove('active');
    document.body.classList.remove('sidebar-open');
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Handle navigation clicks
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        showPage(targetId);
    });
});

// Back to top button functionality
window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }
});

backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Contact Form Submission
contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(contactForm);
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    
    // Show loading state
    submitButton.textContent = 'Submitting...';
    submitButton.disabled = true;
    
    try {
        // Submit to Google Script (as per HTML)
        const response = await fetch('https://script.google.com/macros/s/AKfycbwgV_hZ8Vy-fHVPWyLEmZR-Klzw2zuvK-t5LsM4q7ulwVWWYUQuI6hErhfNkSOdqs-adA/exec', {
            method: 'POST',
            body: formData
        });
        
        if (response.ok) {
            alert('Thank you! Your message has been submitted successfully.');
            contactForm.reset();
        } else {
            throw new Error('Failed to submit form');
        }
    } catch (error) {
        console.error('Form submission error:', error);
        
        // Fallback: Save to localStorage
        const formDataObj = {
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            message: formData.get('message'),
            timestamp: new Date().toISOString()
        };
        
        const existingSubmissions = JSON.parse(localStorage.getItem('contactSubmissions') || '[]');
        existingSubmissions.push(formDataObj);
        localStorage.setItem('contactSubmissions', JSON.stringify(existingSubmissions));
        
        alert('Thank you! Your message has been saved locally.');
        contactForm.reset();
    } finally {
        // Reset button state
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    }
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sidebar.classList.contains('active')) {
        leftMenuButton.classList.remove('active');
        sidebar.classList.remove('active');
        document.body.classList.remove('sidebar-open');
    }
});

// Touch gestures for mobile
// let touchStartX = 0;
// let touchEndX = 0;

// document.addEventListener('touchstart', (e) => {
//     touchStartX = e.changedTouches[0].screenX;
// });

// document.addEventListener('touchend', (e) => {
//     touchEndX = e.changedTouches[0].screenX;
//     handleSwipe();
// });

// function handleSwipe() {
//     const swipeThreshold = 50;
//     const swipeDistance = touchEndX - touchStartX;
    
//     if (Math.abs(swipeDistance) > swipeThreshold) {
//         if (swipeDistance > 0 && !sidebar.classList.contains('active')) {
//             // Swipe right - open sidebar
//             leftMenuButton.classList.add('active');
//             sidebar.classList.add('active');
//             document.body.classList.add('sidebar-open');
//         } else if (swipeDistance < 0 && sidebar.classList.contains('active')) {
//             // Swipe left - close sidebar
//             leftMenuButton.classList.remove('active');
//             sidebar.classList.remove('active');
//             document.body.classList.remove('sidebar-open');
//         }
//     }
// }

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    // Show home page by default
    showPage('home');
});

console.log('SHIV Fasteners website loaded successfully!');