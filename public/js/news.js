/**
 * News Page JavaScript
 * Banking University Event Management System
 * 
 * This file implements the interactive features for the news page
 * using a functional programming approach.
 */

// Wait for DOM to fully load before initializing
document.addEventListener("DOMContentLoaded", () => {
  // Initialize all components
  initMobileMenu();
  initScrollAnimations();
  initSectionAnimations();
  initBackToTopButton();
  setActiveMenuItems();
  initSmoothScrolling();
});

/**
 * Mobile menu functionality
 * Handles mobile menu opening/closing and related transitions
 */
const initMobileMenu = () => {
  try {
    const menuButton = document.querySelector("button#mobile-menu-button");
    const mobileMenu = document.getElementById("mobile-menu");
    const closeButton = document.getElementById("mobile-menu-close");
    
    if (!menuButton || !mobileMenu || !closeButton) return;
    
    // Open menu
    menuButton.addEventListener("click", () => {
      mobileMenu.classList.remove("translate-x-full");
      document.body.classList.add("overflow-hidden");
      menuButton.setAttribute("aria-expanded", "true");
      
      // Toggle icon
      const icon = menuButton.querySelector("i");
      if (icon) {
        icon.className = "ri-close-line ri-lg";
      }
    });
    
    // Close menu
    closeButton.addEventListener("click", () => {
      mobileMenu.classList.add("translate-x-full");
      document.body.classList.remove("overflow-hidden");
      menuButton.setAttribute("aria-expanded", "false");
      
      const icon = menuButton.querySelector("i");
      if (icon) {
        icon.className = "ri-menu-line ri-lg";
      }
    });
    
    // Close when clicking outside
    document.addEventListener("click", (e) => {
      if (!mobileMenu.contains(e.target) && 
          !menuButton.contains(e.target) && 
          !mobileMenu.classList.contains("translate-x-full")) {
        mobileMenu.classList.add("translate-x-full");
        document.body.classList.remove("overflow-hidden");
        menuButton.setAttribute("aria-expanded", "false");
        
        const icon = menuButton.querySelector("i");
        if (icon) {
          icon.className = "ri-menu-line ri-lg";
        }
      }
    });
    
    // Close menu on escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !mobileMenu.classList.contains("translate-x-full")) {
        mobileMenu.classList.add("translate-x-full");
        document.body.classList.remove("overflow-hidden");
        menuButton.setAttribute("aria-expanded", "false");
        
        const icon = menuButton.querySelector("i");
        if (icon) {
          icon.className = "ri-menu-line ri-lg";
        }
      }
    });
    
    // Animate menu items with staggered entrance
    const menuItems = mobileMenu.querySelectorAll('nav ul li a');
    menuItems.forEach((item, index) => {
      item.style.setProperty('--index', index);
      item.classList.add('animate-fade-in-up-delayed');
    });
  } catch (error) {
    console.error("Error initializing mobile menu:", error);
  }
};

/**
 * Initialize scroll-triggered animations for page sections
 */
const initScrollAnimations = () => {
  try {
    const scrollRevealElements = document.querySelectorAll('.scroll-reveal');
    
    if (!scrollRevealElements.length) return;
    
    // Function to check if element is in viewport
    const isElementInViewport = (el) => {
      const rect = el.getBoundingClientRect();
      return (
        rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8
      );
    };
    
    // Function to handle scroll event
    const handleScroll = () => {
      scrollRevealElements.forEach(element => {
        if (isElementInViewport(element)) {
          element.classList.add('active');
        }
      });
    };
    
    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);
    
    // Trigger once on page load
    handleScroll();
  } catch (error) {
    console.error("Error initializing scroll animations:", error);
  }
};

/**
 * Initialize animations for page sections and elements
 */
const initSectionAnimations = () => {
  try {
    // Add entrance animations to section headings
    const sectionHeadings = document.querySelectorAll('section h2');
    sectionHeadings.forEach((heading, index) => {
      if (heading.classList.contains('animated')) return;
      
      heading.classList.add('animated');
      heading.style.opacity = '0';
      heading.style.transform = 'translateY(20px)';
      
      setTimeout(() => {
        heading.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        heading.style.opacity = '1';
        heading.style.transform = 'translateY(0)';
      }, 100 + (index * 150));
    });
    
    // Add bounce animation to achievement numbers
    const achievementNumbers = document.querySelectorAll('.animate-bounce-sm');
    achievementNumbers.forEach((element, index) => {
      if (element.classList.contains('animated')) return;
      
      element.classList.add('animated');
      
      // Add custom animation with delay
      element.style.animation = `bounceSm 2s ease-in-out ${index * 0.2}s infinite`;
    });
    
    // Add hover effect to section cards
    const sectionCards = document.querySelectorAll('.section-card');
    sectionCards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px)';
        card.style.boxShadow = '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
        card.style.boxShadow = '';
      });
    });
  } catch (error) {
    console.error("Error initializing section animations:", error);
  }
};

/**
 * Initialize "back to top" button
 */
const initBackToTopButton = () => {
  try {
    // Check if button already exists
    if (document.querySelector('.back-to-top-btn')) return;
    
    const backToTopBtn = createBackToTopButton();
    document.body.appendChild(backToTopBtn);
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', () => {
      toggleBackToTopButton(backToTopBtn);
    });
    
    // Scroll to top when button is clicked
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  } catch (error) {
    console.error("Error initializing back to top button:", error);
  }
};

/**
 * Creates the back to top button element
 * @returns {HTMLElement} The created button
 */
const createBackToTopButton = () => {
  const button = document.createElement('button');
  button.innerHTML = '<i class="ri-arrow-up-line"></i>';
  button.className = 'back-to-top-btn fixed bottom-6 right-6 bg-primary text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg z-40 opacity-0 invisible transition-all duration-300 hover:bg-primary/90';
  button.setAttribute('aria-label', 'Lên đầu trang');
  return button;
};

/**
 * Toggle back to top button visibility based on scroll position
 * @param {HTMLElement} button - The back to top button
 */
const toggleBackToTopButton = (button) => {
  if (window.pageYOffset > 300) {
    button.classList.add('opacity-100', 'visible');
  } else {
    button.classList.remove('opacity-100', 'visible');
  }
};

/**
 * Set active menu items based on current page
 */
const setActiveMenuItems = () => {
  try {
    const currentPath = window.location.pathname;
    const desktopLinks = document.querySelectorAll('header nav.hidden.md\\:flex a');
    const mobileLinks = document.querySelectorAll('#mobile-menu nav ul li a');
    
    // Get current page name from path
    const pageName = currentPath.split('/').pop() || 'index.html';
    
    // Update desktop menu
    updateActiveLinks(desktopLinks, pageName);
    
    // Update mobile menu
    updateActiveLinks(mobileLinks, pageName, true);
  } catch (error) {
    console.error("Error setting active menu items:", error);
  }
};

/**
 * Update active state of navigation links
 * @param {NodeList} links - The navigation links
 * @param {string} currentPage - The current page name
 * @param {boolean} isMobile - Whether these are mobile menu links
 */
const updateActiveLinks = (links, currentPage, isMobile = false) => {
  links.forEach(link => {
    // Reset all links
    if (isMobile) {
      link.classList.remove('border-l-4', 'border-white', 'pl-2', 'text-white');
      link.classList.add('text-white/80');
    } else {
      link.classList.remove('border-b-2', 'border-white', 'text-white');
      link.classList.add('text-white/80');
    }
    link.removeAttribute('aria-current');
    
    // Check if link matches current page
    const linkHref = link.getAttribute('href');
    const isActive = linkHref === currentPage || 
                    (currentPage === 'news.html' && linkHref === './news.html') ||
                    (currentPage === '' && linkHref === 'index.html');
    
    if (isActive) {
      if (isMobile) {
        link.classList.add('border-l-4', 'border-white', 'pl-2', 'text-white');
      } else {
        link.classList.add('border-b-2', 'border-white', 'text-white');
      }
      link.classList.remove('text-white/80');
      link.setAttribute('aria-current', 'page');
    }
  });
};

/**
 * Initialize smooth scrolling for anchor links
 */
const initSmoothScrolling = () => {
  try {
    // Get all anchor links that point to IDs on the same page
    const anchorLinks = document.querySelectorAll('a[href^="#"]:not([href="#"])');
    
    if (!anchorLinks.length) return;
    
    // Add click event to each anchor link
    anchorLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        
        const targetId = link.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (!targetElement) return;
        
        // Scroll to target with offset for header
        window.scrollTo({
          top: targetElement.offsetTop - 80, // Adjusted for header height
          behavior: 'smooth'
        });
        
        // Update URL without page reload
        history.pushState(null, null, targetId);
      });
    });
    
    // Handle initial hash in URL
    if (window.location.hash) {
      setTimeout(() => {
        const targetElement = document.querySelector(window.location.hash);
        if (targetElement) {
          window.scrollTo({
            top: targetElement.offsetTop - 80,
            behavior: 'smooth'
          });
        }
      }, 300);
    }
  } catch (error) {
    console.error("Error initializing smooth scrolling:", error);
  }
};

// Add keyframe animation for bounce effect
const addStyleSheet = () => {
  try {
    const styleSheet = document.createElement('style');
    styleSheet.type = 'text/css';
    styleSheet.innerHTML = `
      @keyframes bounceSm {
        0%, 100% {
          transform: translateY(0);
        }
        50% {
          transform: translateY(-8px);
        }
      }
      
      .scroll-reveal {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.6s ease, transform 0.6s ease;
      }
      
      .scroll-reveal.active {
        opacity: 1;
        transform: translateY(0);
      }
      
      .animate-fade-in-up-delayed {
        opacity: 0;
        animation: fadeInUpDelayed 0.5s forwards;
        animation-delay: calc(var(--index) * 0.1s);
      }
      
      @keyframes fadeInUpDelayed {
        from {
          opacity: 0;
          transform: translateY(10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      .hover-scale {
        transition: transform 0.3s ease;
      }
      
      .hover-scale:hover {
        transform: scale(1.05);
      }
    `;
    document.head.appendChild(styleSheet);
  } catch (error) {
    console.error("Error adding style sheet:", error);
  }
};

// Call the style sheet function
addStyleSheet(); 