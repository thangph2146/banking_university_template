/**
 * Register Page JavaScript
 * Banking University Event Management System
 * 
 * This file implements the interactive features for the register page
 * using a functional programming approach.
 */

// Wait for DOM content to be fully loaded
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM loaded");
  
  // Initialize components
  initMobileMenu();
  initPasswordVisibility();
  initFormValidation();
  initProgressBar();
  setActiveMenuItems();
});

/**
 * Mobile menu functionality
 * Handles mobile menu opening/closing and related transitions
 */
const initMobileMenu = () => {
  try {
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
        icon.className = "ri-close-line text-2xl";
      }
    });
    
    // Close menu
    closeButton.addEventListener("click", () => {
      mobileMenu.classList.add("translate-x-full");
      document.body.classList.remove("overflow-hidden");
      menuButton.setAttribute("aria-expanded", "false");
      
      const icon = menuButton.querySelector("i");
      if (icon) {
        icon.className = "ri-menu-line text-2xl";
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
          icon.className = "ri-menu-line text-2xl";
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
          icon.className = "ri-menu-line text-2xl";
        }
      }
    });
  } catch (error) {
    console.error("Error initializing mobile menu:", error);
  }
};

/**
 * Password visibility toggle functionality
 */
const initPasswordVisibility = () => {
  const togglePasswordVisibility = (passwordId, buttonId) => {
    const passwordInput = document.getElementById(passwordId);
    const toggleButton = document.getElementById(buttonId);
    
    if (!toggleButton || !passwordInput) return;
    
    toggleButton.addEventListener("click", () => {
      const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
      passwordInput.setAttribute("type", type);
      
      const icon = toggleButton.querySelector("i");
      if (icon) {
        icon.className = type === "text" ? "ri-eye-line" : "ri-eye-off-line";
      }
    });
  };
  
  togglePasswordVisibility("password", "showPassword");
  togglePasswordVisibility("confirmPassword", "showConfirmPassword");
};

/**
 * Show modal with success or error message
 */
function showModal(type, title, message) {
  // Remove any existing modals
  const existingModals = document.querySelectorAll('.modal-overlay');
  existingModals.forEach(modal => document.body.removeChild(modal));
  
  const modalOverlay = document.createElement('div');
  modalOverlay.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 modal-overlay';
  
  const modalContent = document.createElement('div');
  modalContent.className = 'bg-white rounded-lg p-6 max-w-md mx-auto shadow-xl transform transition-all';
  
  // Apply different styling based on modal type
  if (type === 'success') {
    modalContent.innerHTML = `
      <div class="flex items-center mb-4">
        <i class="ri-checkbox-circle-line text-green-500 text-3xl mr-3"></i>
        <h3 class="text-xl font-semibold text-gray-800">${title}</h3>
      </div>
      <div class="mb-5 text-gray-600">${message}</div>
      <div class="flex justify-end">
        <button class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition duration-200 close-modal">
          Đóng
        </button>
      </div>
    `;
  } else if (type === 'error') {
    modalContent.innerHTML = `
      <div class="flex items-center mb-4">
        <i class="ri-error-warning-line text-red-500 text-3xl mr-3"></i>
        <h3 class="text-xl font-semibold text-gray-800">${title}</h3>
      </div>
      <div class="mb-5 text-gray-600">${message}</div>
      <div class="flex justify-end">
        <button class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition duration-200 close-modal">
          Đóng
        </button>
      </div>
    `;
  } else if (type === 'loading') {
    modalContent.innerHTML = `
      <div class="flex flex-col items-center justify-center py-4">
        <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mb-4"></div>
        <h3 class="text-xl font-semibold text-gray-800">${title || 'Đang xử lý...'}</h3>
        <p class="text-gray-600 mt-2">${message || 'Vui lòng đợi trong giây lát'}</p>
      </div>
    `;
  }
  
  modalOverlay.appendChild(modalContent);
  document.body.appendChild(modalOverlay);
  
  // Add event listeners for close buttons
  const closeButtons = modalOverlay.querySelectorAll('.close-modal');
  closeButtons.forEach(button => {
    button.addEventListener('click', () => {
      document.body.removeChild(modalOverlay);
    });
  });
  
  // Close on click outside (except for loading modals)
  if (type !== 'loading') {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        document.body.removeChild(modalOverlay);
      }
    });
    
    // Close on Escape key press
    const handleEscapeKey = (e) => {
      if (e.key === 'Escape') {
        document.body.removeChild(modalOverlay);
        document.removeEventListener('keydown', handleEscapeKey);
      }
    };
    
    document.addEventListener('keydown', handleEscapeKey);
  }
  
  // Return the modal element if needed for later reference
  return modalOverlay;
}

/**
 * Close a specific modal by its element reference
 */
function closeModal(modalElement) {
  if (typeof modalElement === 'string') {
    // If a string is passed, try to find modals by class
    const modals = document.querySelectorAll('.modal-overlay');
    modals.forEach(modal => document.body.removeChild(modal));
  } else if (modalElement instanceof HTMLElement) {
    // If an HTML element is passed, remove it directly
    document.body.removeChild(modalElement);
  }
}

/**
 * Helper function to validate email format
 * @param {string} email - The email to validate
 * @returns {boolean} Whether the email is valid
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Helper function to validate student ID format
 * @param {string} studentId - The student ID to validate
 * @returns {boolean} Whether the student ID is valid
 */
function isValidStudentId(studentId) {
  const studentIdRegex = /^[a-zA-Z0-9]{8,}$/;
  return studentIdRegex.test(studentId);
}

/**
 * Helper function to check if a string has minimum length
 * @param {string} value - The string to check
 * @param {number} minLength - The minimum length required
 * @returns {boolean} Whether the string meets minimum length
 */
function hasMinLength(value, minLength) {
  return value.length >= minLength;
}

/**
 * Helper function to set input validation state
 * @param {string} inputId - The ID of the input element
 * @param {boolean} isValid - Whether the input is valid
 */
function setInputValidationState(inputId, isValid) {
  const input = document.getElementById(inputId);
  if (!input) return;
  
  if (isValid) {
    input.classList.remove('is-invalid');
    input.classList.add('is-valid');
  } else {
    input.classList.remove('is-valid');
    input.classList.add('is-invalid');
  }
}

/**
 * Reset validation states for all inputs
 */
function resetValidationStates() {
  const inputs = ['fullname', 'email', 'password', 'confirm-password', 'student-id'];
  inputs.forEach(inputId => {
    const input = document.getElementById(inputId);
    if (input) {
      input.classList.remove('is-valid', 'is-invalid');
    }
  });
}

/**
 * Toggle validation icons for input fields
 * @param {string} inputId - ID of the input field
 * @param {boolean} isValid - Whether the input is valid
 * @param {string} feedbackMessage - Optional feedback message for invalid input
 */
const toggleValidationIcons = (inputId, isValid, feedbackMessage = '') => {
  try {
    const validIcon = document.getElementById(`${inputId}ValidIcon`);
    const invalidIcon = document.getElementById(`${inputId}InvalidIcon`);
    const input = document.getElementById(inputId);
    const feedbackElement = document.getElementById(`${inputId}Feedback`);
    
    if (!input) return;
    
    if (input.value.trim() === '') {
      if (validIcon) validIcon.style.opacity = '0';
      if (invalidIcon) invalidIcon.style.opacity = '0';
      input.classList.remove('border-red-500', 'border-green-500');
      if (feedbackElement) feedbackElement.classList.add('hidden');
      return;
    }
    
    if (isValid) {
      if (validIcon) validIcon.style.opacity = '1';
      if (invalidIcon) invalidIcon.style.opacity = '0';
      input.classList.remove('border-red-500');
      input.classList.add('border-green-500');
      if (feedbackElement) feedbackElement.classList.add('hidden');
    } else {
      if (validIcon) validIcon.style.opacity = '0';
      if (invalidIcon) invalidIcon.style.opacity = '1';
      input.classList.remove('border-green-500');
      input.classList.add('border-red-500');
      
      if (feedbackElement && feedbackMessage) {
        feedbackElement.textContent = feedbackMessage;
        feedbackElement.classList.remove('hidden');
      }
    }
  } catch (error) {
    console.error(`Error toggling validation icons for ${inputId}:`, error);
  }
};

/**
 * Validate if the studentId is in valid format (alphanumeric with at least 5 characters)
 * @param {string} studentId - The student ID to validate
 * @returns {boolean} - Whether the studentId is valid
 */
const isValidStudentId = (studentId) => {
  // Student ID should be alphanumeric and at least 5 characters
  const studentIdRegex = /^[a-zA-Z0-9]{5,}$/;
  return studentIdRegex.test(studentId);
};

/**
 * Toggle validation icons for student ID field
 * @param {boolean} isValid - Whether the input is valid
 * @param {HTMLElement} validIcon - The valid icon element
 * @param {HTMLElement} invalidIcon - The invalid icon element
 * @param {HTMLElement} feedbackElement - The feedback text element
 * @param {string} feedbackMessage - The feedback message to display when invalid
 */
const toggleStudentIdValidationIcons = (isValid, validIcon, invalidIcon, feedbackElement, feedbackMessage) => {
  if (isValid) {
    validIcon.style.opacity = '1';
    invalidIcon.style.opacity = '0';
    feedbackElement.classList.add('hidden');
    feedbackElement.textContent = '';
  } else {
    validIcon.style.opacity = '0';
    invalidIcon.style.opacity = '1';
    feedbackElement.classList.remove('hidden');
    feedbackElement.textContent = feedbackMessage;
  }
};

/**
 * Initialize form validation functionality
 */
const initFormValidation = () => {
  const form = document.getElementById('registerForm');
  if (!form) return;

  const validateEmail = (email) => {
    const regex = /@(sv\.)?hub\.edu\.vn$/;
    return regex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 8;
  };

  const toggleValidationIcons = (inputId, isValid, feedbackMessage = '') => {
    const validIcon = document.getElementById(`${inputId}ValidIcon`);
    const invalidIcon = document.getElementById(`${inputId}InvalidIcon`);
    const feedbackElement = document.getElementById(`${inputId}Feedback`);
    
    if (validIcon) validIcon.style.opacity = isValid ? '1' : '0';
    if (invalidIcon) invalidIcon.style.opacity = isValid ? '0' : '1';
    if (feedbackElement) {
      feedbackElement.textContent = isValid ? '' : feedbackMessage;
      feedbackElement.classList.toggle('hidden', isValid);
    }
  };

  // Add input event listeners
  const inputs = form.querySelectorAll('input[required]');
  inputs.forEach(input => {
    input.addEventListener('input', () => {
      switch(input.id) {
        case 'email':
          toggleValidationIcons('email', validateEmail(input.value), 'Email phải có đuôi @sv.hub.edu.vn hoặc @hub.edu.vn');
          break;
        case 'password':
          toggleValidationIcons('password', validatePassword(input.value), 'Mật khẩu phải có ít nhất 8 ký tự');
          break;
        case 'confirmPassword':
          const password = document.getElementById('password').value;
          toggleValidationIcons('confirmPassword', input.value === password, 'Mật khẩu xác nhận không khớp');
          break;
      }
      updateProgress();
    });
  });

  // Form submission
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    // Form submission logic here
  });
};

/**
 * Initialize progress bar functionality
 */
const initProgressBar = () => {
  const progressBar = document.getElementById('progressBar');
  if (!progressBar) return;

  const updateProgress = () => {
    const form = document.getElementById('registerForm');
    if (!form) return;

    const inputs = form.querySelectorAll('input[required]');
    let filledInputs = 0;
    
    inputs.forEach(input => {
      if (input.value.trim() !== '') filledInputs++;
    });

    const progress = (filledInputs / inputs.length) * 100;
    progressBar.style.width = `${progress}%`;
  };

  window.updateProgress = updateProgress;
  updateProgress();
};

/**
 * Set active menu items based on current page
 */
const setActiveMenuItems = () => {
  try {
    const currentPath = window.location.pathname;
    const desktopLinks = document.querySelectorAll('header nav a');
    const mobileLinks = document.querySelectorAll('#mobile-menu nav ul li a');
    
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
      link.className = 'font-medium text-white/80 hover:text-white py-2 block transition-all duration-300 hover:translate-x-1';
    } else {
      link.className = 'text-red-100 hover:text-white transition-colors';
    }
    
    // Check if link matches current page
    const linkHref = link.getAttribute('href');
    const isActive = linkHref === currentPage || 
                    (currentPage === 'register.html' && linkHref === 'register.html');
    
    if (isActive) {
      if (isMobile) {
        link.className = 'font-medium text-white py-2 block transition-all duration-300 hover:translate-x-1 border-l-4 border-white pl-2';
      } else {
        link.className = 'text-white border-b-2 border-white hover:text-red-200 transition-colors';
      }
      link.setAttribute('aria-current', 'page');
    }
  });
};

/**
 * Validates the registration form
 * @param {HTMLFormElement} form - The form to validate
 * @returns {Object} Object with isValid flag and errors array
 */
function validateForm(form) {
  const fullname = form.querySelector('#fullname').value.trim();
  const email = form.querySelector('#email').value.trim();
  const password = form.querySelector('#password').value;
  const confirmPassword = form.querySelector('#confirm-password').value;
  const studentId = form.querySelector('#student-id').value.trim();
  
  const errors = [];
  
  // Validate fullname
  const isFullnameValid = hasMinLength(fullname, 3);
  setInputValidationState('fullname', isFullnameValid);
  if (!isFullnameValid) {
    errors.push('Full name must be at least 3 characters');
  }
  
  // Validate email
  const isEmailValid = isValidEmail(email);
  setInputValidationState('email', isEmailValid);
  if (!isEmailValid) {
    errors.push('Please enter a valid email address');
  }
  
  // Validate password
  const passwordMinLength = 8;
  const isPasswordValid = hasMinLength(password, passwordMinLength);
  setInputValidationState('password', isPasswordValid);
  if (!isPasswordValid) {
    errors.push(`Password must be at least ${passwordMinLength} characters`);
  }
  
  // Validate password confirmation
  const doPasswordsMatch = password === confirmPassword;
  setInputValidationState('confirm-password', doPasswordsMatch);
  if (!doPasswordsMatch) {
    errors.push('Passwords do not match');
  }
  
  // Validate student ID
  const isStudentIdValid = isValidStudentId(studentId);
  setInputValidationState('student-id', isStudentIdValid);
  if (!isStudentIdValid) {
    errors.push('Student ID must be at least 8 alphanumeric characters');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Handle form submission
 */
async function handleSubmit(e) {
  e.preventDefault();
  const form = e.target;
  
  try {
    // Show loading modal
    showModal('loading', 'Đang xử lý...', 'Vui lòng đợi trong giây lát');
    
    // Get all form inputs
    const formData = new FormData(form);
    
    // Validate form
    const validationResult = validateForm(form);
    
    // If form is invalid, show error messages
    if (!validationResult.isValid) {
      // Close loading modal
      closeModal('modal-overlay');
      
      // Prepare error message
      const errorList = validationResult.errors
        .map(error => `<li class="mb-1">- ${error}</li>`)
        .join('');
      
      // Show error modal with all validation errors
      showModal('error', 'Lỗi đăng ký', `
        <p class="mb-3">Vui lòng kiểm tra lại các thông tin sau:</p>
        <ul class="text-left">${errorList}</ul>
      `);
      
      return;
    }
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Process form data (this would normally be an API call)
    const formDataObject = Object.fromEntries(formData.entries());
    console.log('Form data submitted:', formDataObject);
    
    // Close loading modal and show success message
    closeModal('modal-overlay');
    showModal('success', 'Đăng ký thành công', `
      <p>Chúc mừng <strong>${formDataObject.fullname}</strong>!</p>
      <p>Tài khoản của bạn đã được tạo thành công. Mã sinh viên của bạn là: <strong>${formDataObject.student_id}</strong></p>
      <p>Hệ thống sẽ gửi email xác nhận đến <strong>${formDataObject.email}</strong>. Vui lòng kiểm tra hộp thư và xác nhận tài khoản để tiếp tục.</p>
    `);
    
    // Reset form after successful submission
    form.reset();
    resetValidationStates(form.querySelectorAll('.form-input'));
    
  } catch (error) {
    // Close loading modal and show error message
    closeModal('modal-overlay');
    showModal('error', 'Đăng ký thất bại', `
      <p>Đã có lỗi xảy ra khi xử lý yêu cầu của bạn.</p>
      <p>Chi tiết lỗi: ${error.message || 'Không xác định'}</p>
      <p>Vui lòng thử lại sau hoặc liên hệ hỗ trợ kỹ thuật.</p>
    `);
    console.error('Form submission error:', error);
  }
}

/**
 * Update validation state for a form input
 * @param {HTMLElement} inputElement - The input element to update
 * @param {boolean} isValid - Whether the input is valid
 * @param {string} message - Validation message to display
 */
function updateValidationState(inputElement, isValid, message) {
  const formGroup = inputElement.closest('.form-group');
  const feedbackElement = formGroup.querySelector('.form-feedback');
  
  // Update classes
  if (isValid) {
    formGroup.classList.add('has-success');
    formGroup.classList.remove('has-error');
  } else {
    formGroup.classList.add('has-error');
    formGroup.classList.remove('has-success');
  }
  
  // Update feedback message
  if (feedbackElement) {
    feedbackElement.textContent = message;
  }
}

/**
 * Reset validation states for multiple form inputs
 * @param {Array|NodeList} inputElements - Collection of input elements
 */
function resetValidationStates(inputElements) {
  inputElements.forEach(input => {
    if (!input) return;
    
    const formGroup = input.closest('.form-group');
    const feedbackElement = formGroup.querySelector('.form-feedback');
    
    // Reset classes
    formGroup.classList.remove('has-success', 'has-error');
    
    // Reset feedback message
    if (feedbackElement) {
      feedbackElement.textContent = '';
    }
  });
}

/**
 * Initialize registration form handling
 */
function initializeRegistrationForm() {
  const form = document.getElementById('registration-form');
  const alertContainer = document.getElementById('alert-container');
  
  if (!form) {
    console.error('Registration form not found');
    return;
  }
  
  form.addEventListener('submit', function(event) {
    event.preventDefault();
    
    // Hide any existing alerts
    alertContainer.innerHTML = '';
    alertContainer.style.display = 'none';
    
    // Validate form
    const validationResult = validateForm(form);
    
    // If form is invalid, show error messages
    if (!validationResult.isValid) {
      // Display alert with all error messages
      const alertHtml = `
        <div class="alert alert-danger alert-dismissible fade show" role="alert">
          <strong>Please correct the following errors:</strong>
          <ul>
            ${validationResult.errors.map(error => `<li>${error}</li>`).join('')}
          </ul>
          <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
      `;
      
      alertContainer.innerHTML = alertHtml;
      alertContainer.style.display = 'block';
      return;
    }
    
    // If validation passes, prepare form data for submission
    const formData = {
      fullname: document.getElementById('fullname').value.trim(),
      email: document.getElementById('email').value.trim(),
      password: document.getElementById('password').value,
      student_id: document.getElementById('student-id').value.trim()
    };
    
    // Show loading state
    const submitButton = form.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.innerHTML;
    submitButton.disabled = true;
    submitButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Processing...';
    
    // Submit form data (simulate API call)
    setTimeout(() => {
      // Simulate successful registration
      const successAlert = `
        <div class="alert alert-success alert-dismissible fade show" role="alert">
          <strong>Registration successful!</strong> You can now log in with your credentials.
          <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
      `;
      
      alertContainer.innerHTML = successAlert;
      alertContainer.style.display = 'block';
      
      // Reset form
      form.reset();
      
      // Reset button state
      submitButton.disabled = false;
      submitButton.innerHTML = originalButtonText;
      
      // In a real application, you would submit the form data to a server endpoint
      console.log('Form data:', formData);
    }, 1500);
  });
}

// Initialize form when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  initializeRegistrationForm();
});

// Utility function
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