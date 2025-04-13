/**
 * Contact Page JavaScript
 * Banking University Event Management System
 * 
 * This file implements interactive features for the contact page
 * using a functional programming approach.
 */

// Wait for DOM to fully load before initializing
document.addEventListener("DOMContentLoaded", () => {
  // Initialize all components
  initAOS();
  initMobileMenu();
  initContactForm();
  setupMapHandling();
  initFAQInteractions();
  initBackToTopButton();
  initFloatingAnimation();
  initSmoothScrolling();
});

/**
 * Initialize AOS (Animate On Scroll) library
 */
const initAOS = () => {
  try {
    AOS.init({
      duration: 800,
      once: true,
      offset: 50,
      delay: 50,
      easing: 'ease-in-out'
    });
  } catch (error) {
    console.error('Error initializing AOS:', error);
  }
};

/**
 * Initialize mobile menu functionality
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
 * Initialize contact form with validation and submission handling
 */
const initContactForm = () => {
  const contactForm = document.getElementById('contactForm');
  if (!contactForm) return;
  
  try {
    const allInputs = contactForm.querySelectorAll('input, textarea, select');
    
    // Add focus effect to input fields
    allInputs.forEach(input => {
      setupInputFocusEffects(input);
      
      // Add input validation for mobile
      if (input.type === 'text' || input.type === 'email' || input.type === 'tel') {
        input.addEventListener('input', () => {
          // Prevent horizontal scroll on mobile
          input.style.width = '100%';
          input.style.maxWidth = '100%';
          
          // Adjust font size if content is too long
          const inputLength = input.value.length;
          if (window.innerWidth < 768 && inputLength > 30) {
            input.style.fontSize = '12px';
          } else {
            input.style.fontSize = '';
          }
        });
      }
    });
    
    // Handle textarea responsively
    const messageTextarea = contactForm.querySelector('textarea');
    if (messageTextarea) {
      messageTextarea.addEventListener('input', () => {
        // Auto resize height based on content
        messageTextarea.style.height = 'auto';
        messageTextarea.style.height = messageTextarea.scrollHeight + 'px';
      });
    }

    // Form submission handling
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      if (validateForm(contactForm)) {
        submitForm(contactForm);
      } else {
        showErrorMessage(contactForm);
      }
    });
  } catch (error) {
    console.error('Error initializing contact form:', error);
  }
};

/**
 * Setup input focus effects
 * @param {HTMLElement} input - The input element
 */
const setupInputFocusEffects = (input) => {
  try {
    input.addEventListener('focus', () => {
      input.parentElement.classList.add('relative');
      
      // Create or update the focus effect
      let focusEffect = input.parentElement.querySelector('.focus-effect');
      if (!focusEffect) {
        focusEffect = document.createElement('span');
        focusEffect.className = 'focus-effect absolute inset-0 border-2 border-primary/20 rounded-md opacity-0 pointer-events-none';
        input.parentElement.appendChild(focusEffect);
      }
      
      // Reset animation
      focusEffect.style.animation = 'none';
      setTimeout(() => {
        focusEffect.style.animation = 'pulse-soft 2s infinite';
        focusEffect.style.opacity = '1';
      }, 10);
    });
    
    input.addEventListener('blur', () => {
      const focusEffect = input.parentElement.querySelector('.focus-effect');
      if (focusEffect) {
        focusEffect.style.opacity = '0';
      }
    });
  } catch (error) {
    console.error('Error setting up input focus effects:', error);
  }
};

/**
 * Validate form fields
 * @param {HTMLFormElement} form - The form to validate
 * @returns {boolean} Whether the form is valid
 */
const validateForm = (form) => {
  try {
    const formData = new FormData(form);
    const formValues = Object.fromEntries(formData.entries());
    
    let isValid = true;
    const requiredFields = ['fullName', 'email', 'subject', 'message', 'privacy'];
    
    // Check required fields
    requiredFields.forEach(field => {
      const input = document.getElementById(field);
      if (!input) return;
      
      if (!formValues[field]) {
        markFieldAsInvalid(input);
        isValid = false;
      } else {
        markFieldAsValid(input);
      }
    });
    
    // Email validation
    const emailInput = document.getElementById('email');
    if (emailInput && formValues.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formValues.email)) {
        markFieldAsInvalid(emailInput);
        isValid = false;
      }
    }
    
    return isValid;
  } catch (error) {
    console.error('Error validating form:', error);
    return false;
  }
};

/**
 * Mark a field as invalid with animation
 * @param {HTMLElement} input - The input element
 */
const markFieldAsInvalid = (input) => {
  input.classList.add('border-red-500');
  
  // Add shake animation
  input.classList.add('animate-shake');
  setTimeout(() => {
    input.classList.remove('animate-shake');
  }, 500);
};

/**
 * Mark a field as valid
 * @param {HTMLElement} input - The input element
 */
const markFieldAsValid = (input) => {
  input.classList.remove('border-red-500');
};

/**
 * Show form error message
 * @param {HTMLFormElement} form - The form element
 */
const showErrorMessage = (form) => {
  try {
    // Create or update error message
    let errorMsg = form.querySelector('.error-message');
    
    if (!errorMsg) {
      errorMsg = document.createElement('div');
      errorMsg.className = 'error-message text-red-500 text-center mt-4 animate-bounce';
      errorMsg.textContent = 'Vui lòng kiểm tra lại thông tin đã nhập.';
      form.appendChild(errorMsg);
    } else {
      errorMsg.classList.add('animate-bounce');
    }
    
    // Hide error message after 3 seconds
    setTimeout(() => {
      errorMsg.classList.remove('animate-bounce');
      errorMsg.style.opacity = '0';
      errorMsg.style.transition = 'opacity 0.5s ease';
      setTimeout(() => {
        errorMsg.remove();
      }, 500);
    }, 3000);
  } catch (error) {
    console.error('Error showing error message:', error);
  }
};

/**
 * Submit form and show success message
 * @param {HTMLFormElement} form - The form element
 */
const submitForm = (form) => {
  try {
    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnContent = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span class="mr-2">Đang gửi</span><i class="ri-loader-4-line animate-spin"></i>';
    submitBtn.disabled = true;
    
    // Simulate form submission with a delay
    setTimeout(() => {
      showSuccessMessage(form, submitBtn, originalBtnContent);
    }, 1500);
  } catch (error) {
    console.error('Error submitting form:', error);
  }
};

/**
 * Show success message after form submission
 * @param {HTMLFormElement} form - The form element
 * @param {HTMLButtonElement} submitBtn - The submit button
 * @param {string} originalBtnContent - The original button content
 */
const showSuccessMessage = (form, submitBtn, originalBtnContent) => {
  try {
    // Create success message
    const formContainer = form.parentElement;
    const successMsg = document.createElement('div');
    successMsg.className = 'p-8 text-center';
    successMsg.innerHTML = `
      <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
        <i class="ri-check-line ri-2x text-green-600"></i>
      </div>
      <h3 class="text-xl font-bold text-gray-900 mb-3">Cảm ơn bạn!</h3>
      <p class="text-gray-600 mb-6">
        Thông tin liên hệ của bạn đã được gửi thành công. Chúng tôi sẽ phản hồi trong thời gian sớm nhất!
      </p>
      <button type="button" id="resetForm" class="text-primary font-medium">
        Gửi liên hệ khác
      </button>
    `;
    
    // Hide form and show success message with fade effect
    form.style.transition = 'opacity 0.5s ease';
    form.style.opacity = '0';
    
    setTimeout(() => {
      form.style.display = 'none';
      formContainer.appendChild(successMsg);
      
      // Add reset form button functionality
      const resetBtn = document.getElementById('resetForm');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          successMsg.remove();
          form.reset();
          submitBtn.innerHTML = originalBtnContent;
          submitBtn.disabled = false;
          form.style.display = 'grid';
          setTimeout(() => {
            form.style.opacity = '1';
          }, 10);
        });
      }
    }, 500);
  } catch (error) {
    console.error('Error showing success message:', error);
  }
};

/**
 * Setup map handling with error fallback and responsive behavior
 */
const setupMapHandling = () => {
  const mapContainer = document.getElementById('map-container');
  const googleMap = document.getElementById('google-map');
  const mapFallback = document.getElementById('map-fallback');
  
  if (!mapContainer || !googleMap || !mapFallback) return;
  
  try {
    // Make map responsive
    const adjustMapHeight = () => {
      const width = mapContainer.offsetWidth;
      const isMobile = window.innerWidth < 768;
      const aspectRatio = isMobile ? 0.75 : 0.5625; // 4:3 for mobile, 16:9 for desktop
      mapContainer.style.height = `${width * aspectRatio}px`;
    };

    // Adjust map on load and resize
    window.addEventListener('load', adjustMapHeight);
    window.addEventListener('resize', adjustMapHeight);

    // Check if online
    const checkOnlineStatus = () => {
      if (!navigator.onLine) {
        showMapFallback();
      }
    };
    
    // Show map fallback
    const showMapFallback = () => {
      mapFallback.classList.remove('hidden');
      // Adjust fallback text size for mobile
      if (window.innerWidth < 768) {
        const fallbackText = mapFallback.querySelector('p');
        if (fallbackText) {
          fallbackText.classList.add('text-sm');
        }
      }
    };
    
    // Hide map fallback
    const hideMapFallback = () => {
      mapFallback.classList.add('hidden');
    };
    
    // Setup initial checks
    checkOnlineStatus();
    adjustMapHeight();
    
    // Add event listeners
    window.addEventListener('offline', showMapFallback);
    window.addEventListener('online', () => {
      hideMapFallback();
      googleMap.src = googleMap.src;
    });
    
    // Add resize observer for responsive updates
    const resizeObserver = new ResizeObserver(adjustMapHeight);
    resizeObserver.observe(mapContainer);
    
  } catch (error) {
    console.error('Error setting up map handling:', error);
    showMapFallback();
  }
};

/**
 * Initialize FAQ items with interactive effects and responsive handling
 */
const initFAQInteractions = () => {
  const faqItems = document.querySelectorAll('.bg-white.p-3.md\\:p-6.rounded-lg, .bg-white.p-4.md\\:p-6.rounded-lg');
  
  if (!faqItems.length) return;
  
  try {
    faqItems.forEach(item => {
      const question = item.querySelector('h3');
      const answer = item.querySelector('p');
      
      if (!question || !answer) return;
      
      // Add hover effect
      item.addEventListener('mouseenter', () => {
        item.classList.add('shadow-md', 'transform', 'scale-[1.01]');
      });
      
      item.addEventListener('mouseleave', () => {
        item.classList.remove('shadow-md', 'transform', 'scale-[1.01]');
      });
      
      // Make clickable
      item.style.cursor = 'pointer';
      
      // Handle click with responsive animation
      item.addEventListener('click', () => {
        const isMobile = window.innerWidth < 768;
        
        // Toggle expanded state
        if (answer.style.maxHeight === '0px' || !answer.style.maxHeight) {
          answer.style.maxHeight = answer.scrollHeight + 'px';
          question.classList.add('text-primary');
          
          // Adjust text size on mobile when expanded
          if (isMobile) {
            answer.style.fontSize = '12px';
            answer.style.lineHeight = '1.4';
          }
        } else {
          answer.style.maxHeight = '0px';
          question.classList.remove('text-primary');
          
          // Reset text size
          answer.style.fontSize = '';
          answer.style.lineHeight = '';
        }
      });
      
      // Initial state
      answer.style.maxHeight = '0px';
      answer.style.overflow = 'hidden';
      answer.style.transition = 'all 0.3s ease-in-out';
    });
  } catch (error) {
    console.error('Error initializing FAQ interactions:', error);
  }
};

/**
 * Initialize back to top button
 */
const initBackToTopButton = () => {
  // Create back to top button if it doesn't exist
  let backToTopButton = document.getElementById('back-to-top');
  
  if (!backToTopButton) {
    try {
      backToTopButton = document.createElement('button');
      backToTopButton.id = 'back-to-top';
      backToTopButton.className = 'fixed bottom-6 right-6 bg-primary text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg z-40 transition-all duration-300 opacity-0 translate-y-10 scale-90';
      backToTopButton.innerHTML = '<i class="ri-arrow-up-line text-xl"></i>';
      backToTopButton.setAttribute('aria-label', 'Lên đầu trang');
      document.body.appendChild(backToTopButton);
      
      // Show/hide back to top button based on scroll position
      const toggleBackToTopButton = () => {
        if (window.scrollY > 300) {
          backToTopButton.classList.remove('opacity-0', 'translate-y-10', 'scale-90');
        } else {
          backToTopButton.classList.add('opacity-0', 'translate-y-10', 'scale-90');
        }
      };
      
      // Scroll to top when button is clicked
      backToTopButton.addEventListener('click', () => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      });
      
      // Add scroll event listener
      window.addEventListener('scroll', toggleBackToTopButton);
      
      // Initial check
      toggleBackToTopButton();
    } catch (error) {
      console.error('Error initializing back to top button:', error);
    }
  }
};

/**
 * Initialize floating animation for contact cards
 */
const initFloatingAnimation = () => {
  const floatingElements = document.querySelectorAll('.float-animation');
  
  if (!floatingElements.length) return;
  
  try {
    // Add CSS for floating animation if not already present
    if (!document.getElementById('floating-animation-style')) {
      const style = document.createElement('style');
      style.id = 'floating-animation-style';
      style.textContent = `
        @keyframes floating {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .floating {
          animation: floating 3s ease-in-out infinite;
        }
      `;
      document.head.appendChild(style);
    }
    
    // Apply floating animation with different delays
    floatingElements.forEach((element, index) => {
      element.classList.add('floating');
      element.style.animationDelay = `${index * 0.2}s`;
    });
  } catch (error) {
    console.error('Error initializing floating animation:', error);
  }
};

/**
 * Initialize smooth scrolling for anchor links
 */
const initSmoothScrolling = () => {
  try {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        
        // Only apply smooth scroll to anchors pointing to elements on the page
        if (href !== '#' && document.querySelector(href)) {
          e.preventDefault();
          
          document.querySelector(href).scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  } catch (error) {
    console.error('Error initializing smooth scrolling:', error);
  }
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