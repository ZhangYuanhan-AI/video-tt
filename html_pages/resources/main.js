// Debounce function to limit the rate of function execution
// Original debounce function
// Remove this redundant definition
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout); // This is redundant
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Keep this improved definition
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            func(...args);
        }, wait);
    };
}

// Optimized font size update function
const updateFontSize = debounce(function() {
    const elements = document.getElementsByClassName('responsive-text');
    const screenWidth = window.innerWidth;
    let fontSize = '15px'; // Default size

    if (screenWidth < 600) fontSize = '9px';
    else if (screenWidth < 800) fontSize = '11px';
    else if (screenWidth < 1000) fontSize = '13px';

    Array.from(elements).forEach(element => {
        element.style.fontSize = fontSize;
    });
}, 250); // Debounce with 250ms delay

// Add event listeners
window.addEventListener('load', updateFontSize);
window.addEventListener('resize', updateFontSize);

// Add video pause on hover functionality
document.addEventListener('DOMContentLoaded', function () {
    // Select all video elements on the page
    const videos = document.querySelectorAll('video');

    // Add event listeners to each video
    videos.forEach(video => {
        // Pause the video when the mouse hovers over it
        video.addEventListener('mouseover', function () {
            this.pause();
        });

        // Play the video when the mouse moves out
        video.addEventListener('mouseout', function () {
            this.play();
        });
    });
});

// Remove mobile navigation related code
document.addEventListener('DOMContentLoaded', function() {
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const nav = document.querySelector('nav');
    
    if (mobileNavToggle && nav) {
        mobileNavToggle.addEventListener('click', function() {
            nav.classList.toggle('active');
        });
        
        // Close mobile nav when clicking outside
        document.addEventListener('click', function(e) {
            if (!nav.contains(e.target) && !mobileNavToggle.contains(e.target)) {
                nav.classList.remove('active');
            }
        });
        
        // Close mobile nav when clicking a link
        nav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function() {
                nav.classList.remove('active');
            });
        });
    }
});

// Smooth scroll for navigation links
document.addEventListener('DOMContentLoaded', function() {
    const links = document.querySelectorAll('a[href^="#"]');
    const header = document.querySelector('header'); // Select the header element

    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const href = this.getAttribute('href');

            if (href === '#') {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
                return;
            }

            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                // Calculate the header height dynamically
                const headerOffset = header.offsetHeight; 
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
});

// Image Modal Logic
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const images = document.querySelectorAll('.zoomable-image');
    const closeBtn = document.querySelector('.modal .close');

    images.forEach(image => {
        image.onclick = function(){
            if (modal) {
                modal.classList.add('show');
                modalImg.src = this.src;
            }
        }
    });

    const closeModal = () => {
        if (modal) {
            modal.classList.remove('show');
            modalImg.classList.remove('zoomed'); // Reset zoom class
        }
    }

    if(closeBtn) {
        closeBtn.onclick = closeModal;
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            closeModal();
        }
    }

    modalImg.onclick = function() {
        modalImg.classList.toggle('zoomed');
    }
});
