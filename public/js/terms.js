/**
 * Terms Page JavaScript
 * Banking University Event Management System
 * 
 * This file implements the interactive features for the terms page
 * using a functional programming approach.
 */

// Wait for DOM to fully load before initializing
document.addEventListener("DOMContentLoaded", () => {
  // Initialize all components
  initMobileMenu();
  initBackToTopButton();
  initSmoothScrolling();
  initSectionHighlight();
  initAnimations();
  initTableOfContentsHighlight();
  initAcceptTerms();
  initPrintButton();
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
 * Initialize "back to top" button
 */
const initBackToTopButton = () => {
  try {
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
  button.className = 'fixed bottom-6 right-6 bg-primary text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg z-40 opacity-0 invisible transition-all duration-300 hover:bg-primary/90';
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
 * Initialize smooth scrolling for anchor links
 */
const initSmoothScrolling = () => {
  try {
    const anchors = document.querySelectorAll('a[href^="#"]');
    if (!anchors.length) return;
    
    anchors.forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        
        const targetId = anchor.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (!targetElement) return;
        
        // Offset for header
        const headerOffset = 80;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - headerOffset;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
        
        // Update URL without page reload
        history.pushState(null, null, targetId);
        
        // Highlight target element briefly
        targetElement.classList.add('bg-primary/5');
        setTimeout(() => {
          targetElement.classList.remove('bg-primary/5');
        }, 1500);
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

/**
 * Highlight important sections in the terms
 */
const initSectionHighlight = () => {
  try {
    // Add IDs to all section headings for navigation
    const headings = document.querySelectorAll('.prose h2');
    headings.forEach((heading, index) => {
      if (!heading.id) {
        const headingText = heading.textContent.trim().toLowerCase();
        const headingId = `section-${headingText.replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')}`;
        heading.id = headingId;
      }
      
      // Add visual emphasis to important sections
      if (
        heading.textContent.includes('Điều khoản sử dụng') || 
        heading.textContent.includes('Tài khoản người dùng') || 
        heading.textContent.includes('Quyền riêng tư') ||
        heading.textContent.includes('Giới hạn trách nhiệm')
      ) {
        const section = heading.closest('div');
        if (section) {
          section.classList.add('border-l-4', 'border-primary', 'pl-4', '-ml-4');
          
          // Add "Important" label
          const importantBadge = document.createElement('span');
          importantBadge.className = 'inline-block bg-primary text-white text-xs px-2 py-1 rounded ml-2 align-middle';
          importantBadge.textContent = 'Quan trọng';
          heading.appendChild(importantBadge);
        }
      }
    });
  } catch (error) {
    console.error("Error initializing section highlight:", error);
  }
};

/**
 * Initialize animations for page elements
 */
const initAnimations = () => {
  try {
    // Add fade-in animation to sections
    const sections = document.querySelectorAll('.prose > div');
    sections.forEach((section, index) => {
      section.style.opacity = '0';
      section.style.transform = 'translateY(20px)';
      section.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      section.style.transitionDelay = `${index * 0.1}s`;
      
      setTimeout(() => {
        section.style.opacity = '1';
        section.style.transform = 'translateY(0)';
      }, 100);
    });
  } catch (error) {
    console.error("Error initializing animations:", error);
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
      link.classList.remove('text-white', 'font-medium');
      link.classList.add('text-red-100');
    } else {
      link.classList.remove('text-white', 'border-b-2', 'border-white');
      link.classList.add('text-red-100', 'hover:text-white', 'transition-colors');
    }
    link.removeAttribute('aria-current');
    
    // Check if link matches current page
    const linkHref = link.getAttribute('href');
    const isActive = linkHref === currentPage || 
                    (currentPage === 'terms.html' && linkHref === 'terms.html');
    
    if (isActive) {
      if (isMobile) {
        link.classList.add('text-white', 'font-medium');
        link.classList.remove('text-red-100');
      } else {
        link.classList.add('text-white', 'border-b-2', 'border-white');
        link.classList.remove('text-red-100', 'hover:text-white');
      }
      link.setAttribute('aria-current', 'page');
    }
  });
};

/**
 * Highlight active section in the table of contents
 * based on scroll position
 */
const initTableOfContentsHighlight = () => {
  try {
    const tocLinks = document.querySelectorAll('.my-8.p-4.bg-gray-50 a[href^="#"]');
    if (!tocLinks.length) return;
    
    // Get all section headings
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
        link.classList.add('hover:underline');
      });
      
      // Add highlight to current section link
      const activeLink = currentSection.section.link;
      activeLink.classList.add('font-bold');
      activeLink.classList.remove('hover:underline');
    };
    
    // Listen for scroll events with debounce for performance
    window.addEventListener('scroll', debounce(highlightActiveSection, 100));
    
    // Run once on page load
    highlightActiveSection();
  } catch (error) {
    console.error("Error initializing table of contents highlight:", error);
  }
};

/**
 * Debounce function to limit how often a function is called
 * @param {Function} func - The function to debounce
 * @param {number} wait - The time to wait in milliseconds
 * @returns {Function} - The debounced function
 */
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Initialize accept terms button functionality
 */
const initAcceptTerms = () => {
  try {
    const acceptButton = document.getElementById('accept-terms-button');
    if (!acceptButton) return;
    
    // Check if user has already accepted terms
    const hasAcceptedTerms = localStorage.getItem('termsAccepted');
    const acceptDate = localStorage.getItem('termsAcceptedDate');
    
    if (hasAcceptedTerms === 'true' && acceptDate) {
      // Show already accepted message
      const acceptSection = acceptButton.closest('div');
      const acceptDate = new Date(localStorage.getItem('termsAcceptedDate'));
      const formattedDate = new Intl.DateTimeFormat('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(acceptDate);
      
      if (acceptSection) {
        acceptSection.innerHTML = `
          <div class="p-4 bg-green-50 text-green-800 rounded-lg">
            <p class="flex items-center">
              <i class="ri-checkbox-circle-line text-green-600 text-xl mr-2"></i>
              Bạn đã đồng ý với điều khoản sử dụng vào ngày ${formattedDate}
            </p>
            <p class="mt-2 text-sm">
              <a href="index.html" class="text-primary hover:underline">Quay lại trang chủ</a>
            </p>
          </div>
        `;
      }
    } else {
      // Add click handler for accept button
      acceptButton.addEventListener('click', () => {
        // Save acceptance to localStorage
        localStorage.setItem('termsAccepted', 'true');
        localStorage.setItem('termsAcceptedDate', new Date().toISOString());
        
        // Show success message
        const acceptSection = acceptButton.closest('div');
        if (acceptSection) {
          acceptSection.innerHTML = `
            <div class="p-4 bg-green-50 text-green-800 rounded-lg">
              <p class="flex items-center">
                <i class="ri-checkbox-circle-line text-green-600 text-xl mr-2"></i>
                Cảm ơn bạn đã đồng ý với điều khoản sử dụng!
              </p>
              <p class="mt-3">
                Bạn có thể tiếp tục sử dụng hệ thống.
              </p>
              <p class="mt-2">
                <a href="index.html" class="bg-primary text-white px-6 py-2 rounded-button hover:bg-primary/90 transition-colors inline-block mt-3">
                  Quay lại trang chủ
                </a>
              </p>
            </div>
          `;
        }
        
        // If there's a parent form, trigger success event
        const form = acceptButton.closest('form');
        if (form) {
          const event = new CustomEvent('termsAccepted', {
            detail: { accepted: true, date: new Date() }
          });
          form.dispatchEvent(event);
        }
      });
      
      // Add highlight effect to the button
      setTimeout(() => {
        acceptButton.classList.add('animate-pulse');
        setTimeout(() => {
          acceptButton.classList.remove('animate-pulse');
        }, 1000);
      }, 2000);
    }
  } catch (error) {
    console.error("Error initializing accept terms functionality:", error);
  }
};

/**
 * Initialize a print button for the terms page
 */
const initPrintButton = () => {
  try {
    // Only add print button if we have terms content
    const termsContent = document.querySelector('.prose');
    if (!termsContent) return;
    
    // Create print button
    const printButton = document.createElement('button');
    printButton.innerHTML = '<i class="ri-printer-line mr-2"></i>In điều khoản';
    printButton.className = 'fixed left-6 bottom-6 bg-white text-primary border border-primary px-4 py-2 rounded-button shadow-lg flex items-center hover:bg-primary hover:text-white transition-colors z-40';
    printButton.setAttribute('aria-label', 'In điều khoản');
    document.body.appendChild(printButton);
    
    // Add click handler
    printButton.addEventListener('click', () => {
      // Show print dialog
      window.print();
    });
    
    // Add print styles dynamically
    const style = document.createElement('style');
    style.textContent = `
      @media print {
        header, footer, button, .back-to-top, #mobile-menu, .my-8.p-4.bg-gray-50, .mt-12.p-6.bg-gray-50 {
          display: none !important;
        }
        body, .bg-gray-50, .bg-white {
          background-color: white !important;
        }
        .prose {
          max-width: 100% !important;
          padding: 0 !important;
        }
        h1 {
          font-size: 24pt !important;
          margin-top: 0 !important;
        }
        h2 {
          font-size: 18pt !important;
        }
        .container {
          max-width: 100% !important;
          margin: 0 !important;
          padding: 0 !important;
        }
        a {
          text-decoration: underline !important;
          color: #000 !important;
        }
        a::after {
          content: " (" attr(href) ")";
          font-size: 0.8em;
          color: #555;
        }
        @page {
          margin: 2cm;
        }
      }
    `;
    document.head.appendChild(style);
  } catch (error) {
    console.error("Error initializing print button:", error);
  }
}; 