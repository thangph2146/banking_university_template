/**
 * Privacy Page JavaScript
 * Banking University Event Management System
 * 
 * This file implements the interactive features for the privacy page
 * using a functional programming approach.
 */

// Wait for DOM to fully load before initializing
document.addEventListener("DOMContentLoaded", () => {
  // Initialize all components
  initMobileMenu();
  initScrollToSection();
  initTableOfContentsHighlight();
  initBackToTopButton();
  initAnimations();
  setActiveMenuItems();
});

/**
 * Mobile menu functionality
 * Handles mobile menu opening/closing and related transitions
 */
const initMobileMenu = () => {
  const menuButton = document.querySelector("#mobile-menu-button");
  const mobileMenu = document.querySelector("#mobile-menu");
  const closeButton = document.querySelector("#mobile-menu-close");
  
  if (!menuButton || !mobileMenu || !closeButton) return;
  
  // Open menu
  menuButton.addEventListener("click", () => {
    mobileMenu.classList.remove("translate-x-full");
    document.body.classList.add("overflow-hidden");
    menuButton.setAttribute("aria-expanded", "true");
    
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
};

/**
 * Smooth scroll to sections when clicking on table of contents links
 */
const initScrollToSection = () => {
  try {
    const tocLinks = document.querySelectorAll('a[href^="#"]');
    
    if (!tocLinks.length) return;
    
    tocLinks.forEach(link => {
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
    console.error("Error initializing scroll to section:", error);
  }
};

/**
 * Highlight active section in the table of contents
 * based on scroll position
 */
const initTableOfContentsHighlight = () => {
  try {
    const tocLinks = document.querySelectorAll('a[href^="#"]');
    const sections = Array.from(tocLinks).map(link => {
      const targetId = link.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      return { id: targetId, element: targetElement, link };
    }).filter(section => section.element !== null);
    
    if (!sections.length) return;
    
    // Function to determine which section is in view
    const highlightActiveSection = () => {
      // Find the section that is currently in view
      const currentSection = sections.reduce((nearest, section) => {
        const rect = section.element.getBoundingClientRect();
        const offset = rect.top + window.scrollY - 100; // Adjust offset
        const distanceFromTop = Math.abs(window.scrollY - offset);
        
        if (!nearest || distanceFromTop < nearest.distanceFromTop) {
          return { 
            section, 
            distanceFromTop 
          };
        }
        return nearest;
      }, null);
      
      if (!currentSection) return;
      
      // Remove highlight from all links
      tocLinks.forEach(link => {
        link.classList.remove('font-bold');
        link.classList.remove('text-primary');
        link.classList.add('text-primary', 'hover:underline');
      });
      
      // Add highlight to current section link
      const activeLink = currentSection.section.link;
      activeLink.classList.add('font-bold');
      activeLink.classList.remove('hover:underline');
    };
    
    // Listen for scroll events
    window.addEventListener('scroll', debounce(highlightActiveSection, 100));
    
    // Run once on page load
    highlightActiveSection();
  } catch (error) {
    console.error("Error initializing table of contents highlight:", error);
  }
};

/**
 * Initialize animations for page elements
 */
const initAnimations = () => {
  try {
    // Animate section titles with fade-in and slide-up
    const sectionTitles = document.querySelectorAll('h2');
    sectionTitles.forEach((title, index) => {
      title.style.opacity = "0";
      title.style.transform = "translateY(20px)";
      
      setTimeout(() => {
        title.style.transition = "opacity 0.5s ease, transform 0.5s ease";
        title.style.opacity = "1";
        title.style.transform = "translateY(0)";
      }, 100 + (index * 150));
    });
    
    // Add fade-in animation to policy sections
    const policySections = document.querySelectorAll('div[id^="information-"], div[id^="data-"], div[id^="your-"], div[id^="cookies"], div[id^="changes"], div[id^="contact"]');
    policySections.forEach(section => {
      // Add initial styles
      section.style.opacity = "0";
      section.style.transform = "translateY(20px)";
      
      // Create intersection observer
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            section.style.transition = "opacity 0.6s ease, transform 0.6s ease";
            section.style.opacity = "1";
            section.style.transform = "translateY(0)";
            observer.unobserve(section);
          }
        });
      }, { threshold: 0.1 });
      
      observer.observe(section);
    });
    
    // Add hover effects to contact cards
    const contactCards = document.querySelectorAll('#contact .bg-white.border');
    contactCards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px)';
        card.style.boxShadow = '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
        card.style.borderColor = '#d1d5db';
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
        card.style.boxShadow = '';
        card.style.borderColor = '#e5e7eb';
      });
    });
  } catch (error) {
    console.error("Error initializing animations:", error);
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
    const desktopLinks = document.querySelectorAll('header nav a');
    const mobileLinks = document.querySelectorAll('.fixed.inset-0.bg-primary.z-50 nav ul li a');
    
    // Get current page name from path
    const pageName = currentPath.split('/').pop() || 'index.html';
    
    // Update desktop menu
    updateActiveLinks(desktopLinks, pageName, false);
    
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
const updateActiveLinks = (links, currentPage, isMobile) => {
  links.forEach(link => {
    // Reset all links to default state
    if (isMobile) {
      link.className = 'text-red-100 block py-2 hover:text-white';
    } else {
      link.className = 'text-red-100 hover:text-white transition-colors';
    }
    
    // Check if link matches current page
    const linkHref = link.getAttribute('href');
    const isActive = linkHref === currentPage || 
                    (currentPage === 'privacy.html' && linkHref === './privacy.html');
    
    if (isActive) {
      if (isMobile) {
        link.className = 'text-white block py-2 hover:text-white font-medium';
      } else {
        link.className = 'text-white hover:text-white transition-colors';
      }
      link.setAttribute('aria-current', 'page');
    }
  });
};

/**
 * Debounce function to limit how often a function is called
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
const debounce = (func, wait) => {
  let timeout;
  return function() {
    const context = this;
    const args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func.apply(context, args);
    }, wait);
  };
};

// Add animations styles
const addStyleSheet = () => {
  try {
    const styleSheet = document.createElement('style');
    styleSheet.type = 'text/css';
    styleSheet.innerHTML = `
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
      
      .smooth-transition {
        transition: all 0.3s ease;
      }
    `;
    document.head.appendChild(styleSheet);
  } catch (error) {
    console.error("Error adding style sheet:", error);
  }
};

// Call the style sheet function
addStyleSheet(); 