/**
 * User Guide Page JavaScript
 * Banking University Event Management System
 * 
 * This file implements interactive features for the user guide page
 * following functional programming principles.
 */

// Wait for DOM to fully load before initializing
document.addEventListener("DOMContentLoaded", () => {
  // Initialize all components
  initMobileMenu();
  initTableOfContents();
  initScrollToSection();
  initAnimations();
  initNewsletterForm();
  setActiveMenuItems();
});

/**
 * Mobile menu functionality
 * Handles mobile menu opening/closing and related transitions
 */
const initMobileMenu = () => {
  try {
    const menuButton = document.querySelector("button.md\\:hidden");
    const mobileMenu = document.querySelector(".fixed.inset-0.bg-primary.z-50");
    
    // Create mobile menu if it doesn't exist
    if (!mobileMenu) {
      createMobileMenu();
      return;
    }
    
    const closeButton = mobileMenu.querySelector("button");
    
    if (!menuButton || !closeButton) {
      console.error("Mobile menu elements not found");
      return;
    }
    
    // Open menu
    menuButton.addEventListener("click", () => {
      mobileMenu.classList.remove("translate-x-full");
      document.body.classList.add("overflow-hidden");
    });
    
    // Close menu
    closeButton.addEventListener("click", () => {
      mobileMenu.classList.add("translate-x-full");
      document.body.classList.remove("overflow-hidden");
    });
    
    // Close when clicking outside
    document.addEventListener("click", (e) => {
      if (mobileMenu && 
          !mobileMenu.classList.contains("translate-x-full") && 
          !mobileMenu.contains(e.target) && 
          !menuButton.contains(e.target)) {
        mobileMenu.classList.add("translate-x-full");
        document.body.classList.remove("overflow-hidden");
      }
    });
    
    // Close menu on escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && mobileMenu && !mobileMenu.classList.contains("translate-x-full")) {
        mobileMenu.classList.add("translate-x-full");
        document.body.classList.remove("overflow-hidden");
      }
    });
  } catch (error) {
    console.error("Error initializing mobile menu:", error);
  }
};

/**
 * Creates a mobile menu element and appends it to the body
 */
const createMobileMenu = () => {
  try {
    const mobileMenu = document.createElement("div");
    mobileMenu.className = "fixed inset-0 bg-primary z-50 transform translate-x-full transition-transform duration-300 ease-in-out";
    mobileMenu.innerHTML = `
      <div class="p-4 flex justify-between items-center border-b border-red-900/30">
        <a href="index.html" class="text-2xl font-['Pacifico'] text-white">
          <img src="../images/logo/logo-white.png" alt="logo" class="w-16 h-16">
        </a>
        <button class="w-10 h-10 flex items-center justify-center text-white">
          <i class="ri-close-line ri-lg"></i>
        </button>
      </div>
      <nav class="p-4">
        <ul class="space-y-4">
          <li><a href="index.html" class="text-red-100 block py-2 hover:text-white">Trang chủ</a></li>
          <li><a href="events.html" class="text-red-100 block py-2 hover:text-white">Sự kiện</a></li>
          <li><a href="blog.html" class="text-red-100 block py-2 hover:text-white">Blog</a></li>
          <li><a href="news.html" class="text-red-100 block py-2 hover:text-white">Giới thiệu</a></li>
          <li><a href="contact.html" class="text-red-100 block py-2 hover:text-white">Liên hệ</a></li>
          <li class="pt-4 border-t border-red-900/30">
            <a href="login.html" class="text-white font-medium block py-2">Đăng nhập</a>
          </li>
          <li>
            <a href="register.html" class="bg-white text-primary px-4 py-2 !rounded-button whitespace-nowrap block text-center mt-2">Đăng ký</a>
          </li>
        </ul>
      </nav>
    `;
    
    document.body.appendChild(mobileMenu);
    
    // Add event listeners after creating the menu
    const menuButton = document.querySelector("button.md\\:hidden");
    const closeButton = mobileMenu.querySelector("button");
    
    // Open menu
    menuButton.addEventListener("click", () => {
      mobileMenu.classList.remove("translate-x-full");
      document.body.classList.add("overflow-hidden");
    });
    
    // Close menu
    closeButton.addEventListener("click", () => {
      mobileMenu.classList.add("translate-x-full");
      document.body.classList.remove("overflow-hidden");
    });
    
    // Set active menu item
    const currentPath = window.location.pathname;
    const pageName = currentPath.split('/').pop() || 'index.html';
    
    const mobileLinks = mobileMenu.querySelectorAll('nav ul li a');
    mobileLinks.forEach(link => {
      const linkHref = link.getAttribute('href');
      if (linkHref === pageName || (pageName === 'user-guide.html' && linkHref === './user-guide.html')) {
        link.classList.remove('text-red-100');
        link.classList.add('text-white', 'font-medium', 'border-l-4', 'border-white', 'pl-2');
      }
    });
  } catch (error) {
    console.error("Error creating mobile menu:", error);
  }
};

/**
 * Initialize table of contents for easy navigation
 */
const initTableOfContents = () => {
  try {
    // First add IDs to all heading elements
    addHeadingIds();
    
    // Create and insert the table of contents
    createTableOfContents();
  } catch (error) {
    console.error("Error initializing table of contents:", error);
  }
};

/**
 * Adds unique IDs to heading elements for navigation
 */
const addHeadingIds = () => {
  try {
    const headings = document.querySelectorAll('h2, h3');
    
    headings.forEach(heading => {
      if (!heading.id) {
        // Create ID from heading text
        const id = heading.textContent
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
          
        heading.id = id;
      }
    });
  } catch (error) {
    console.error("Error adding heading IDs:", error);
  }
};

/**
 * Creates and inserts table of contents
 */
const createTableOfContents = () => {
  try {
    // Create TOC container
    const tocContainer = document.createElement('div');
    tocContainer.className = 'bg-white border border-gray-200 rounded-lg p-6 shadow-sm mb-8';
    tocContainer.innerHTML = '<h3 class="text-xl font-semibold text-gray-900 mb-4">Mục lục</h3>';
    
    // Create TOC list
    const tocList = document.createElement('ul');
    tocList.className = 'space-y-2';
    
    // Get all h2 elements with IDs
    const mainSections = document.querySelectorAll('h2[id]');
    
    // If no main sections found, don't create TOC
    if (mainSections.length === 0) {
      return;
    }
    
    // Add each main section to TOC
    mainSections.forEach(section => {
      const listItem = document.createElement('li');
      const link = document.createElement('a');
      
      link.href = '#' + section.id;
      link.className = 'text-primary hover:underline flex items-center';
      link.innerHTML = `<i class="ri-arrow-right-s-line mr-2"></i>${section.textContent}`;
      
      // Add click handler
      link.addEventListener('click', (e) => {
        e.preventDefault();
        scrollToElement(section);
      });
      
      listItem.appendChild(link);
      tocList.appendChild(listItem);
      
      // Find subsections (h3) that follow this section
      let nextElement = section.nextElementSibling;
      const subSections = [];
      
      while (nextElement && nextElement.tagName !== 'H2') {
        if (nextElement.tagName === 'H3' && nextElement.id) {
          subSections.push(nextElement);
        }
        nextElement = nextElement.nextElementSibling;
      }
      
      // If subsections found, add them as nested list
      if (subSections.length > 0) {
        const subList = document.createElement('ul');
        subList.className = 'pl-6 mt-2 space-y-2';
        
        subSections.forEach(subSection => {
          const subItem = document.createElement('li');
          const subLink = document.createElement('a');
          
          subLink.href = '#' + subSection.id;
          subLink.className = 'text-gray-700 hover:text-primary hover:underline flex items-center';
          subLink.innerHTML = `<i class="ri-arrow-right-s-line mr-2"></i>${subSection.textContent}`;
          
          // Add click handler
          subLink.addEventListener('click', (e) => {
            e.preventDefault();
            scrollToElement(subSection);
          });
          
          subItem.appendChild(subLink);
          subList.appendChild(subItem);
        });
        
        listItem.appendChild(subList);
      }
    });
    
    // Add the list to the container
    tocContainer.appendChild(tocList);
    
    // Insert after the introduction section
    const introSection = document.querySelector('.bg-blue-50');
    if (introSection && introSection.parentNode) {
      introSection.parentNode.insertBefore(tocContainer, introSection.nextSibling);
    }
  } catch (error) {
    console.error("Error creating table of contents:", error);
  }
};

/**
 * Initialize smooth scrolling to page sections
 */
const initScrollToSection = () => {
  try {
    // Handle any existing hash in the URL on page load
    if (window.location.hash) {
      const targetId = window.location.hash.substring(1);
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        // Use setTimeout to ensure DOM is fully loaded
        setTimeout(() => {
          scrollToElement(targetElement);
        }, 300);
      }
    }
    
    // Add click handlers to any anchor links pointing to IDs on the page
    const inPageLinks = document.querySelectorAll('a[href^="#"]:not([href="#"])');
    
    inPageLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        
        const targetId = link.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
          scrollToElement(targetElement);
          
          // Update URL hash without scrolling
          history.pushState(null, null, `#${targetId}`);
        }
      });
    });
  } catch (error) {
    console.error("Error initializing scroll to section:", error);
  }
};

/**
 * Scroll to a target element with smooth animation
 * @param {HTMLElement} element - The target element to scroll to
 */
const scrollToElement = (element) => {
  try {
    const headerOffset = 100; // Account for sticky header
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
    
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
    
    // Highlight the element briefly
    element.classList.add('highlight-section');
    setTimeout(() => {
      element.classList.remove('highlight-section');
    }, 2000);
  } catch (error) {
    console.error("Error scrolling to element:", error);
  }
};

/**
 * Initialize animations for page elements
 */
const initAnimations = () => {
  try {
    // Add entrance animations to section headings
    const sectionHeadings = document.querySelectorAll('h2');
    sectionHeadings.forEach((heading, index) => {
      heading.style.opacity = '0';
      heading.style.transform = 'translateY(20px)';
      
      // Create observer to trigger animation when element is in view
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              heading.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
              heading.style.opacity = '1';
              heading.style.transform = 'translateY(0)';
            }, 100);
            observer.unobserve(heading);
          }
        });
      }, { threshold: 0.1 });
      
      observer.observe(heading);
    });
    
    // Add subtle hover effects to guide sections
    const guideSections = document.querySelectorAll('.bg-white.border.border-gray-200.rounded-lg');
    guideSections.forEach(section => {
      section.addEventListener('mouseenter', () => {
        section.classList.add('shadow-md');
        section.style.transition = 'box-shadow 0.3s ease';
      });
      
      section.addEventListener('mouseleave', () => {
        section.classList.remove('shadow-md');
      });
    });
    
    // Add CSS for section highlight effect
    const style = document.createElement('style');
    style.textContent = `
      @keyframes highlight-pulse {
        0% { background-color: rgba(239, 68, 68, 0.05); }
        50% { background-color: rgba(239, 68, 68, 0.1); }
        100% { background-color: rgba(239, 68, 68, 0); }
      }
      .highlight-section {
        animation: highlight-pulse 2s ease-in-out;
      }
    `;
    document.head.appendChild(style);
  } catch (error) {
    console.error("Error initializing animations:", error);
  }
};

/**
 * Initialize newsletter form handling
 */
const initNewsletterForm = () => {
  try {
    const newsletterForm = document.querySelector('footer form');
    if (!newsletterForm) return;
    
    newsletterForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const emailInput = this.querySelector('input[type="email"]');
      if (!emailInput) return;
      
      // Basic email validation
      const email = emailInput.value.trim();
      if (!email) {
        showNotification('Vui lòng nhập địa chỉ email của bạn.', 'yellow');
        return;
      }
      
      // Simple email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        showNotification('Vui lòng nhập một địa chỉ email hợp lệ.', 'red');
        return;
      }
      
      // Simulate API call to subscribe
      emailInput.disabled = true;
      const submitButton = this.querySelector('button[type="submit"]');
      if (submitButton) {
        const originalContent = submitButton.innerHTML;
        submitButton.innerHTML = '<i class="ri-loader-2-line animate-spin"></i>';
        submitButton.disabled = true;
        
        // Simulate API delay
        setTimeout(() => {
          // Success notification
          showNotification('Cảm ơn bạn đã đăng ký nhận tin!', 'green');
          
          // Reset form
          emailInput.value = '';
          emailInput.disabled = false;
          submitButton.innerHTML = originalContent;
          submitButton.disabled = false;
        }, 1500);
      }
    });
  } catch (error) {
    console.error("Error initializing newsletter form:", error);
  }
};

/**
 * Set active menu items based on current page
 */
const setActiveMenuItems = () => {
  try {
    const currentPath = window.location.pathname;
    const desktopLinks = document.querySelectorAll('header nav.hidden.md\\:flex a');
    
    // Get current page name from path
    const pageName = currentPath.split('/').pop() || 'index.html';
    
    // Update desktop menu
    updateActiveLinks(desktopLinks, pageName);
  } catch (error) {
    console.error("Error setting active menu items:", error);
  }
};

/**
 * Update active state of navigation links
 * @param {NodeList} links - The navigation links 
 * @param {string} currentPage - The current page name
 */
const updateActiveLinks = (links, currentPage) => {
  links.forEach(link => {
    // Skip if link doesn't have href attribute
    if (!link.hasAttribute('href')) return;
    
    // Check if link matches current page
    const linkHref = link.getAttribute('href');
    const isActive = linkHref === currentPage || 
                   (currentPage === 'user-guide.html' && linkHref === './user-guide.html');
    
    if (isActive) {
      link.classList.add('text-white');
      link.classList.remove('text-red-100');
      link.setAttribute('aria-current', 'page');
    } else {
      link.classList.add('text-red-100');
      link.classList.remove('text-white');
      link.removeAttribute('aria-current');
    }
  });
};

/**
 * Shows a notification message
 * @param {string} message - The message to display
 * @param {string} color - The color theme (green, blue, red, yellow)
 */
const showNotification = (message, color = 'green') => {
  try {
    // Remove any existing notifications first
    const existingNotifications = document.querySelectorAll('.notification-toast');
    existingNotifications.forEach(notification => {
      notification.remove();
    });
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification-toast fixed top-4 right-4 bg-${color}-100 text-${color}-800 rounded-lg px-4 py-3 shadow-lg z-50 transform transition-all duration-300 ease-in-out translate-y-0 opacity-0`;
    notification.innerHTML = `
      <div class="flex items-center">
        <i class="ri-information-line mr-2 text-${color}-600"></i>
        <span>${message}</span>
        <button class="ml-4 text-${color}-600 hover:text-${color}-800 transition-colors">
          <i class="ri-close-line"></i>
        </button>
      </div>
    `;
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Add close button functionality
    const closeButton = notification.querySelector('button');
    closeButton.addEventListener('click', () => {
      fadeOutNotification(notification);
    });
    
    // Animate in
    setTimeout(() => {
      notification.classList.remove('opacity-0');
    }, 10);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      fadeOutNotification(notification);
    }, 5000);
  } catch (error) {
    console.error("Error showing notification:", error);
  }
};

/**
 * Fades out and removes a notification
 * @param {HTMLElement} notification - The notification element
 */
const fadeOutNotification = (notification) => {
  notification.classList.add('opacity-0', 'translate-y-2');
  setTimeout(() => {
    notification.remove();
  }, 300);
}; 