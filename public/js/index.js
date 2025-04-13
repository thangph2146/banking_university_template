/**
 * Main JavaScript for index.html
 * Implements UI interactions and animations for the Banking University Event Management System
 */

// Wait for DOM to fully load before initializing
document.addEventListener("DOMContentLoaded", () => {
  // Initialize all UI components and functionality
  initMobileMenu();
  initSmoothScrolling();
  initBackToTopButton();
  initHeroSlider();
  initScrollAnimations();
  setActiveMenuItems();
  
  // Initialize analytics tracking
  initInteractionTracking();
});

/**
 * Mobile menu functionality
 * Handles mobile menu opening/closing and related transitions
 */
const initMobileMenu = () => {
  const menuButton = document.querySelector("#mobile-menu-button");
  const mobileMenu = document.getElementById("mobile-menu");
  const closeButton = document.getElementById("mobile-menu-close");
  
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
  
  // Animate menu items with staggered entrance
  const menuItems = mobileMenu.querySelectorAll('.mobile-menu-item');
  menuItems.forEach((item, index) => {
    item.style.setProperty('--index', index);
    item.classList.add('animate-fade-in-up-delayed');
  });
};

/**
 * Initialize smooth scrolling for anchor links
 */
const initSmoothScrolling = () => {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      if (this.getAttribute('href') !== '#') {
        e.preventDefault();
        
        // Close mobile menu if open
        if (window.innerWidth < 768) {
          const mobileMenu = document.getElementById('mobile-menu');
          const menuButton = document.querySelector("button[aria-label='Mở menu']");
          
          if (mobileMenu && !mobileMenu.classList.contains("translate-x-full")) {
            mobileMenu.classList.add("translate-x-full");
            document.body.classList.remove("overflow-hidden");
            menuButton.setAttribute("aria-expanded", "false");
            
            const icon = menuButton.querySelector("i");
            if (icon) {
              icon.className = "ri-menu-line ri-lg";
            }
          }
        }
        
        // Scroll to target
        scrollToTarget(this.getAttribute('href'));
      }
    });
  });
};

/**
 * Scroll to a target element by ID with smooth animation
 * @param {string} targetId - The ID of the target element
 */
const scrollToTarget = (targetId) => {
  const targetElement = document.querySelector(targetId);
  if (targetElement) {
    window.scrollTo({
      top: targetElement.offsetTop - 80, // Account for sticky header
      behavior: 'smooth'
    });
  }
};

/**
 * Initialize "back to top" button
 */
const initBackToTopButton = () => {
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
 * Initialize hero slider functionality
 */
const initHeroSlider = () => {
  const sliderElement = document.getElementById('hero-slider');
  if (!sliderElement) return;
  
  const slides = document.querySelectorAll('#hero-slider .slide');
  const indicators = document.querySelectorAll('.slide-indicator');
  const nextButton = document.getElementById('next-slide');
  const prevButton = document.getElementById('prev-slide');
  
  if (!slides.length || !indicators.length) return;
  
  let currentSlide = 0;
  let slideInterval;
  const intervalTime = 5000; // 5 seconds between slides
  
  // Show initial slide
  showSlide(currentSlide);
  
  // Start automatic sliding
  startSlideTimer();
  
  // Event listeners for controls
  if (nextButton) {
    nextButton.addEventListener('click', () => {
      stopSlideTimer();
      currentSlide = (currentSlide + 1) % slides.length;
      showSlide(currentSlide);
      startSlideTimer();
    });
  }
  
  if (prevButton) {
    prevButton.addEventListener('click', () => {
      stopSlideTimer();
      currentSlide = (currentSlide - 1 + slides.length) % slides.length;
      showSlide(currentSlide);
      startSlideTimer();
    });
  }
  
  // Handle indicator clicks
  indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => {
      stopSlideTimer();
      currentSlide = index;
      showSlide(currentSlide);
      startSlideTimer();
    });
  });
  
  // Pause on hover
  sliderElement.addEventListener('mouseenter', stopSlideTimer);
  sliderElement.addEventListener('mouseleave', startSlideTimer);
  
  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!isSliderInViewport(sliderElement)) return;
    
    if (e.key === 'ArrowLeft') {
      stopSlideTimer();
      currentSlide = (currentSlide - 1 + slides.length) % slides.length;
      showSlide(currentSlide);
      startSlideTimer();
    } else if (e.key === 'ArrowRight') {
      stopSlideTimer();
      currentSlide = (currentSlide + 1) % slides.length;
      showSlide(currentSlide);
      startSlideTimer();
    }
  });
  
  // Touch support for mobile
  setupTouchControls();
  
  /**
   * Show a specific slide in the slider
   * @param {number} index - The index of the slide to show
   */
  function showSlide(index) {
    // Hide all slides
    slides.forEach(slide => {
      slide.classList.remove('opacity-100');
      slide.classList.add('opacity-0');
    });
    
    // Show current slide
    slides[index].classList.remove('opacity-0');
    slides[index].classList.add('opacity-100');
    
    // Update indicators
    indicators.forEach(indicator => {
      indicator.classList.remove('bg-white', 'active');
      indicator.classList.add('bg-white/50');
    });
    
    indicators[index].classList.remove('bg-white/50');
    indicators[index].classList.add('bg-white', 'active');
  }
  
  /**
   * Start the automatic slide timer
   */
  function startSlideTimer() {
    slideInterval = setInterval(() => {
      currentSlide = (currentSlide + 1) % slides.length;
      showSlide(currentSlide);
    }, intervalTime);
  }
  
  /**
   * Stop the automatic slide timer
   */
  function stopSlideTimer() {
    clearInterval(slideInterval);
  }
  
  /**
   * Set up touch controls for the slider
   */
  function setupTouchControls() {
    let touchStartX = 0;
    let touchEndX = 0;
    
    sliderElement.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    sliderElement.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });
    
    const handleSwipe = () => {
      if (touchEndX < touchStartX - 50) {
        // Swipe left (next slide)
        stopSlideTimer();
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
        startSlideTimer();
      } else if (touchEndX > touchStartX + 50) {
        // Swipe right (previous slide)
        stopSlideTimer();
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(currentSlide);
        startSlideTimer();
      }
    };
  }
};

/**
 * Check if slider is currently visible in viewport
 * @param {HTMLElement} element - The slider element
 * @returns {boolean} Whether the slider is in viewport
 */
const isSliderInViewport = (element) => {
  const rect = element.getBoundingClientRect();
  return (
    rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.bottom >= 0
  );
};

/**
 * Initialize scroll-based animations
 */
const initScrollAnimations = () => {
  // Initial check for elements in viewport
  handleScrollAnimations();
  
  // Add scroll and resize event listeners
  window.addEventListener('scroll', debounce(handleScrollAnimations, 50));
  window.addEventListener('resize', debounce(handleScrollAnimations, 50));
  
  // Initialize elements with data-animate attribute
  initAnimatedElements();
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

/**
 * Handle reveal animations based on scroll position
 */
const handleScrollAnimations = () => {
  const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
  const elementVisible = 150; // Distance from viewport when element becomes visible
  
  reveals.forEach(element => {
    const windowHeight = window.innerHeight;
    const elementTop = element.getBoundingClientRect().top;
    
    if (elementTop < windowHeight - elementVisible) {
      element.classList.add('active');
    }
  });
};

/**
 * Initialize elements with data-animate attribute
 */
const initAnimatedElements = () => {
  const animatedElements = document.querySelectorAll('[data-animate]');
  
  animatedElements.forEach(element => {
    const animationType = element.getAttribute('data-animate');
    const delay = element.getAttribute('data-delay') || 0;
    
    element.style.animationDelay = `${delay}ms`;
    element.style.animationFillMode = 'both';
    element.classList.add(`animate-${animationType}`);
  });
};

/**
 * Set active menu items based on current page
 */
const setActiveMenuItems = () => {
  const currentPath = window.location.pathname;
  const desktopLinks = document.querySelectorAll('header nav.hidden.md\\:flex a');
  const mobileLinks = document.querySelectorAll('#mobile-menu nav ul li a');
  
  // Get current page name from path
  const pageName = currentPath.split('/').pop() || 'index.html';
  
  // Update desktop menu
  updateActiveLinks(desktopLinks, pageName);
  
  // Update mobile menu
  updateActiveLinks(mobileLinks, pageName, true);
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
                    (currentPage === 'index.html' && linkHref === 'index.html') ||
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
 * Initialize interaction tracking for analytics
 */
const initInteractionTracking = () => {
  // Track clicks on primary CTA buttons
  trackElementInteractions('.bg-primary', 'click', 'primary-cta');
  
  // Track link clicks by category
  trackElementInteractions('nav a', 'click', 'navigation');
  trackElementInteractions('footer a', 'click', 'footer-link');
  
  // Track event card interactions
  trackElementInteractions('.group.border.border-gray-100', 'click', 'event-card');
};

/**
 * Utility function to track element interactions
 * @param {string} selector - CSS selector for elements to track
 * @param {string} eventType - Event type to listen for (e.g., 'click')
 * @param {string} category - Tracking category name
 */
const trackElementInteractions = (selector, eventType, category) => {
  const elements = document.querySelectorAll(selector);
  
  elements.forEach((element, index) => {
    element.addEventListener(eventType, (e) => {
      // Get the element's text content or href for identification
      const label = element.textContent?.trim() || 
                    element.getAttribute('href') || 
                    `${category}-${index}`;
      
      // This can be replaced with actual analytics tracking code
      console.debug(`[Analytics] Category: ${category}, Action: ${eventType}, Label: ${label}`);
    });
  });
};

// Add animation to hero content when page loads
window.addEventListener('load', () => {
  // Animate hero section elements with delay
  const heroTitle = document.querySelector('.hero-gradient h1');
  const heroDescription = document.querySelector('.hero-gradient p');
  const heroButtons = document.querySelector('.hero-gradient div.flex');
  
  if (heroTitle) {
    heroTitle.classList.add('animate-fade-in');
    heroTitle.classList.remove('opacity-0');
  }
  
  if (heroDescription) {
    setTimeout(() => {
      heroDescription.classList.add('animate-fade-in');
      heroDescription.classList.remove('opacity-0');
    }, 300);
  }
  
  if (heroButtons) {
    setTimeout(() => {
      heroButtons.classList.add('animate-fade-in');
      heroButtons.classList.remove('opacity-0');
    }, 500);
  }
});
