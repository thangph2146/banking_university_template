/**
 * Login Page JavaScript
 * Banking University Event Management System
 * 
 * This file implements the interactive features for the login page
 * using a functional programming approach.
 */

// Wait for DOM to fully load before initializing
document.addEventListener("DOMContentLoaded", () => {
  // Initialize all components
  initMobileMenu();
  initPasswordToggle();
  initFormValidation();
  initBackToTopButton();
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
 * Password visibility toggle
 */
const initPasswordToggle = () => {
  try {
    const showPasswordButton = document.getElementById("showPassword");
    const passwordInput = document.getElementById("password");
    
    if (!showPasswordButton || !passwordInput) return;
    
    showPasswordButton.addEventListener("click", () => {
      const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
      passwordInput.setAttribute("type", type);
      
      const icon = showPasswordButton.querySelector("i");
      if (icon) {
        if (type === "text") {
          icon.classList.remove("ri-eye-off-line");
          icon.classList.add("ri-eye-line");
        } else {
          icon.classList.remove("ri-eye-line");
          icon.classList.add("ri-eye-off-line");
        }
      }
    });
  } catch (error) {
    console.error("Error initializing password toggle:", error);
  }
};

/**
 * Form validation and submission
 */
const initFormValidation = () => {
  try {
    const loginForm = document.getElementById("loginForm");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    
    if (!loginForm || !emailInput || !passwordInput) return;
    
    // Real-time validation
    emailInput.addEventListener('input', () => {
      if (emailInput.value.length > 0) {
        if (!validateEmail(emailInput.value)) {
          showError(emailInput, 'Email không hợp lệ');
        } else {
          clearError(emailInput);
        }
      } else {
        clearError(emailInput);
      }
    });

    passwordInput.addEventListener('input', () => {
      if (passwordInput.value.length > 0 && passwordInput.value.length < 6) {
        showError(passwordInput, 'Mật khẩu phải có ít nhất 6 ký tự');
      } else {
        clearError(passwordInput);
      }
    });
    
    // Form submission
    loginForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      
      const email = emailInput.value;
      const password = passwordInput.value;
      const remember = document.getElementById("remember").checked;
      
      // Validate email
      if (!email) {
        showError(emailInput, 'Vui lòng nhập email');
        return;
      }
      if (!validateEmail(email)) {
        showError(emailInput, 'Email không hợp lệ');
        return;
      }
      
      // Validate password
      if (!password) {
        showError(passwordInput, 'Vui lòng nhập mật khẩu');
        return;
      }
      if (password.length < 6) {
        showError(passwordInput, 'Mật khẩu phải có ít nhất 6 ký tự');
        return;
      }

      // Show loading state
      const loginButton = document.getElementById('loginButton');
      const originalContent = loginButton.innerHTML;
      loginButton.innerHTML = '<i class="ri-loader-4-line animate-spin"></i>';
      loginButton.disabled = true;
      
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // For demo purposes, show different modals based on email
        if (email === 'demo@example.com') {
          showModal('successModal');
          setTimeout(() => {
            window.location.href = 'index.html';
          }, 1500);
        } else if (email === 'wrong@example.com') {
          showModal('errorModal', 'Email hoặc mật khẩu không chính xác');
        } else {
          showModal('accountNotFoundModal');
        }
      } catch (error) {
        showModal('errorModal', 'Có lỗi xảy ra. Vui lòng thử lại sau.');
      } finally {
        loginButton.innerHTML = originalContent;
        loginButton.disabled = false;
      }
    });
  } catch (error) {
    console.error("Error initializing form validation:", error);
  }
};

/**
 * Modal functions
 * @param {string} modalId - ID of the modal to show
 * @param {string} message - Optional message to display in modal
 */
const showModal = (modalId, message = null) => {
  const modal = document.getElementById(modalId);
  if (!modal) return;
  
  if (message && modalId === 'errorModal') {
    const errorMessage = document.getElementById('errorMessage');
    if (errorMessage) {
      errorMessage.textContent = message;
    }
  }
  
  // Show modal with flex display and animate
  modal.classList.remove('hidden');
  modal.classList.add('flex');
  
  // Prevent body scroll
  document.body.style.overflow = 'hidden';
  
  // Add click outside to close
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal(modalId);
    }
  });
  
  // Add escape key to close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal(modalId);
    }
  });
};

/**
 * Close modal
 * @param {string} modalId - ID of the modal to close
 */
const closeModal = (modalId) => {
  const modal = document.getElementById(modalId);
  if (!modal) return;
  
  // Hide modal
  modal.classList.add('hidden');
  modal.classList.remove('flex');
  
  // Restore body scroll
  document.body.style.overflow = '';
};

/**
 * Email validation
 * @param {string} email - Email to validate
 * @returns {boolean} - Whether the email is valid
 */
const validateEmail = (email) => {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

/**
 * Show error on form field
 * @param {HTMLElement} input - Input element
 * @param {string} message - Error message
 */
const showError = (input, message) => {
  const parent = input.parentElement.parentElement;
  const errorText = parent.querySelector('.text-red-500');
  const errorIcon = parent.querySelector('.ri-error-warning-line')?.parentElement;
  
  input.classList.add('border-red-500');
  if (errorText) {
    errorText.textContent = message;
    errorText.classList.remove('hidden');
  }
  
  if (errorIcon) {
    errorIcon.classList.remove('hidden');
  }
  
  // Add shake animation
  input.classList.add('shake');
  setTimeout(() => input.classList.remove('shake'), 500);
};

/**
 * Clear error on form field
 * @param {HTMLElement} input - Input element
 */
const clearError = (input) => {
  const parent = input.parentElement.parentElement;
  const errorText = parent.querySelector('.text-red-500');
  const errorIcon = parent.querySelector('.ri-error-warning-line')?.parentElement;
  
  input.classList.remove('border-red-500');
  
  if (errorText) {
    errorText.classList.add('hidden');
  }
  
  if (errorIcon) {
    errorIcon.classList.add('hidden');
  }
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
                    (currentPage === 'login.html' && linkHref === './login.html') ||
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

// Setup close modal buttons when the page loads
window.addEventListener('load', () => {
  document.querySelectorAll('.modal button').forEach(button => {
    const modalId = button.closest('.modal').id;
    button.addEventListener('click', () => closeModal(modalId));
  });
}); 