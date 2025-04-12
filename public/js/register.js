/**
 * Register Page JavaScript
 * Banking University Event Management System
 * 
 * This file implements the interactive features for the register page
 * using a functional programming approach.
 */

// Wait for DOM to fully load before initializing
document.addEventListener("DOMContentLoaded", () => {
  // Initialize all components
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
    const menuButton = document.querySelector("button.md\\:hidden");
    const mobileMenu = document.querySelector(".fixed.inset-0.bg-primary.z-50");
    
    if (!menuButton || !mobileMenu) {
      // Create mobile menu if it doesn't exist
      if (menuButton && !mobileMenu) {
        createMobileMenu();
        return;
      } else {
        return;
      }
    }
    
    // Open menu
    menuButton.addEventListener("click", () => {
      mobileMenu.classList.remove("translate-x-full");
      document.body.classList.add("overflow-hidden");
      
      // Toggle icon
      const icon = menuButton.querySelector("i");
      if (icon) {
        icon.className = "ri-close-line ri-lg";
      }
    });
    
    // Close menu
    const closeButton = mobileMenu.querySelector("button");
    if (closeButton) {
      closeButton.addEventListener("click", () => {
        mobileMenu.classList.add("translate-x-full");
        document.body.classList.remove("overflow-hidden");
        
        const icon = menuButton.querySelector("i");
        if (icon) {
          icon.className = "ri-menu-line ri-lg";
        }
      });
    }
    
    // Close when clicking outside
    document.addEventListener("click", (e) => {
      if (!mobileMenu.contains(e.target) && 
          !menuButton.contains(e.target) && 
          !mobileMenu.classList.contains("translate-x-full")) {
        mobileMenu.classList.add("translate-x-full");
        document.body.classList.remove("overflow-hidden");
        
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
        
        const icon = menuButton.querySelector("i");
        if (icon) {
          icon.className = "ri-menu-line ri-lg";
        }
      }
    });
  } catch (error) {
    console.error("Error initializing mobile menu:", error);
  }
};

/**
 * Creates mobile menu if it doesn't exist in the HTML
 */
const createMobileMenu = () => {
  try {
    const menuButton = document.querySelector("button.md\\:hidden");
    if (!menuButton) return;
    
    const mobileMenu = document.createElement("div");
    mobileMenu.className = "fixed inset-0 bg-primary z-50 transform translate-x-full transition-transform duration-300 ease-in-out";
    mobileMenu.innerHTML = `
      <div class="p-4 flex justify-between items-center border-b border-red-900/30">
        <a href="index.html" class="text-2xl font-['Pacifico'] text-white">
          <img src="../images/logo/logo-white-vertical.png" alt="logo" class="w-16 h-16">
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
            <a href="login.html" class="bg-white text-primary px-4 py-2 !rounded-button whitespace-nowrap block text-center mt-2">Đăng nhập</a>
          </li>
          <li>
            <a href="register.html" class="bg-white text-primary px-4 py-2 !rounded-button whitespace-nowrap block text-center mt-2">Đăng ký</a>
          </li>
        </ul>
      </nav>
    `;
    document.body.appendChild(mobileMenu);
    
    // Reinitialize mobile menu after creation
    initMobileMenu();
  } catch (error) {
    console.error("Error creating mobile menu:", error);
  }
};

/**
 * Password visibility toggle functionality
 */
const initPasswordVisibility = () => {
  try {
    /**
     * Toggle password field visibility between text and password type
     * @param {string} passwordId - ID of the password input field
     * @param {string} buttonId - ID of the toggle button
     */
    const togglePasswordVisibility = (passwordId, buttonId) => {
      const passwordInput = document.getElementById(passwordId);
      const toggleButton = document.getElementById(buttonId);
      
      if (!toggleButton || !passwordInput) return;
      
      toggleButton.addEventListener("click", () => {
        // Toggle password visibility
        const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
        passwordInput.setAttribute("type", type);
        
        // Toggle icon
        const icon = toggleButton.querySelector("i");
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
    };
    
    // Apply to both password fields
    togglePasswordVisibility("password", "showPassword");
    togglePasswordVisibility("confirmPassword", "showConfirmPassword");
  } catch (error) {
    console.error("Error initializing password visibility:", error);
  }
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
  try {
    const registerForm = document.getElementById('registerForm');
    if (!registerForm) return;
    
    // Add input event listeners for validation
    const inputs = registerForm.querySelectorAll('input[required], select[required]');
    
    inputs.forEach(input => {
      input.addEventListener('input', () => {
        // Validate specific fields
        switch(input.id) {
          case 'email':
            const isValidEmail = validateEmail(input.value);
            toggleValidationIcons('email', isValidEmail, 'Email phải có đuôi @sv.hub.edu.vn hoặc @hub.edu.vn');
            break;
          
          case 'password':
            const isValidPassword = validatePassword(input.value);
            toggleValidationIcons('password', isValidPassword, 'Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số');
            
            // Also check confirm password if it has value
            const confirmPassword = document.getElementById('confirmPassword');
            if (confirmPassword && confirmPassword.value.trim() !== '') {
              const isMatch = confirmPassword.value === input.value;
              toggleValidationIcons('confirmPassword', isMatch, 'Mật khẩu xác nhận không khớp');
            }
            break;
          
          case 'confirmPassword':
            const password = document.getElementById('password');
            if (password) {
              const isMatch = input.value === password.value;
              toggleValidationIcons('confirmPassword', isMatch, 'Mật khẩu xác nhận không khớp');
            }
            break;
          
          case 'studentId':
            const studentId = input.value.trim();
            const studentIdValidIcon = document.getElementById('studentIdValidIcon');
            const studentIdInvalidIcon = document.getElementById('studentIdInvalidIcon');
            const studentIdFeedback = document.getElementById('studentIdFeedback');
            
            if (studentId === '') {
              toggleStudentIdValidationIcons(false, studentIdValidIcon, studentIdInvalidIcon, studentIdFeedback, 'Mã sinh viên không được để trống');
              return;
            }
            
            const isStudentIdValid = isValidStudentId(studentId);
            toggleStudentIdValidationIcons(isStudentIdValid, studentIdValidIcon, studentIdInvalidIcon, studentIdFeedback, 'Mã sinh viên phải có ít nhất 5 ký tự và chỉ chứa chữ cái và số');
            
            updateProgress();
            break;
          
          default:
            // Generic validation for other fields
            if (input.value.trim() !== '') {
              input.classList.remove('border-red-500');
              input.classList.add('border-green-500');
            } else {
              input.classList.remove('border-red-500', 'border-green-500');
            }
        }
      });

      // Also trigger validation on blur
      input.addEventListener('blur', () => {
        if (input.value.trim() === '' && input.hasAttribute('required')) {
          input.classList.add('border-red-500');
          const feedbackElement = document.getElementById(`${input.id}Feedback`);
          if (feedbackElement) {
            feedbackElement.textContent = 'Trường này là bắt buộc';
            feedbackElement.classList.remove('hidden');
          }
        }
      });
    });

    // Student ID validation
    const studentIdInput = document.getElementById('studentId');
    const studentIdFeedback = document.createElement('p');
    studentIdFeedback.id = 'studentIdFeedback';
    studentIdFeedback.className = 'text-xs text-red-500 mt-1 hidden';
    studentIdInput.parentNode.parentNode.appendChild(studentIdFeedback);
    
    const studentIdValidIcon = document.createElement('div');
    studentIdValidIcon.id = 'studentIdValidIcon';
    studentIdValidIcon.className = 'absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none opacity-0 transition-opacity duration-200';
    studentIdValidIcon.innerHTML = '<i class="ri-checkbox-circle-line text-green-500"></i>';
    
    const studentIdInvalidIcon = document.createElement('div');
    studentIdInvalidIcon.id = 'studentIdInvalidIcon';
    studentIdInvalidIcon.className = 'absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none opacity-0 transition-opacity duration-200';
    studentIdInvalidIcon.innerHTML = '<i class="ri-error-warning-line text-red-500"></i>';
    
    studentIdInput.parentNode.appendChild(studentIdValidIcon);
    studentIdInput.parentNode.appendChild(studentIdInvalidIcon);
    
    studentIdInput.addEventListener('input', () => {
      const studentId = studentIdInput.value.trim();
      if (studentId === '') {
        toggleStudentIdValidationIcons(false, studentIdValidIcon, studentIdInvalidIcon, studentIdFeedback, 'Mã sinh viên không được để trống');
        return;
      }
      
      const isValid = isValidStudentId(studentId);
      toggleStudentIdValidationIcons(isValid, studentIdValidIcon, studentIdInvalidIcon, studentIdFeedback, 'Mã sinh viên phải có ít nhất 5 ký tự và chỉ chứa chữ cái và số');
      
      updateProgress();
    });

    // Password confirmation validation
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const confirmPasswordFeedback = document.createElement('p');
    confirmPasswordFeedback.id = 'confirmPasswordFeedback';
    confirmPasswordFeedback.className = 'text-xs text-red-500 mt-1 hidden';
    confirmPasswordInput.parentNode.parentNode.appendChild(confirmPasswordFeedback);

    const confirmPasswordValidIcon = document.createElement('div');
    confirmPasswordValidIcon.id = 'confirmPasswordValidIcon';
    confirmPasswordValidIcon.className = 'absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none opacity-0 transition-opacity duration-200';
    confirmPasswordValidIcon.innerHTML = '<i class="ri-checkbox-circle-line text-green-500"></i>';

    const confirmPasswordInvalidIcon = document.createElement('div');
    confirmPasswordInvalidIcon.id = 'confirmPasswordInvalidIcon';
    confirmPasswordInvalidIcon.className = 'absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none opacity-0 transition-opacity duration-200';
    confirmPasswordInvalidIcon.innerHTML = '<i class="ri-error-warning-line text-red-500"></i>';

    confirmPasswordInput.parentNode.appendChild(confirmPasswordValidIcon);
    confirmPasswordInput.parentNode.appendChild(confirmPasswordInvalidIcon);

    confirmPasswordInput.addEventListener('input', () => {
      const passwordInput = document.getElementById('password');
      const password = passwordInput.value;
      const confirmPassword = confirmPasswordInput.value;
      
      if (confirmPassword === '') {
        toggleValidationIcons(false, confirmPasswordValidIcon, confirmPasswordInvalidIcon, confirmPasswordFeedback, 'Vui lòng xác nhận mật khẩu của bạn');
        return;
      }
      
      const isValid = password === confirmPassword;
      toggleValidationIcons(isValid, confirmPasswordValidIcon, confirmPasswordInvalidIcon, confirmPasswordFeedback, 'Mật khẩu xác nhận không khớp');
      
      updateProgress();
    });

    // Trigger validation when password changes to check if confirmation still matches
    const passwordInput = document.getElementById('password');
    passwordInput.addEventListener('input', () => {
      if (confirmPasswordInput.value !== '') {
        const isValid = passwordInput.value === confirmPasswordInput.value;
        toggleValidationIcons(isValid, confirmPasswordValidIcon, confirmPasswordInvalidIcon, confirmPasswordFeedback, 'Mật khẩu xác nhận không khớp');
      }
      
      updateProgress();
    });

    // Form submission handling
    registerForm.addEventListener('submit', handleFormSubmit);
  } catch (error) {
    console.error("Error initializing form validation:", error);
  }
};

/**
 * Handle form submission
 * @param {Event} event - The form submission event
 */
const handleFormSubmit = async (event) => {
  event.preventDefault();
  
  try {
    // Show loading modal
    showModal('loading', 'Đang xử lý...', 'Vui lòng đợi trong giây lát');
    
    // Get all form inputs
    const fullName = document.getElementById('fullName').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const studentId = document.getElementById('studentId').value.trim();
    
    // Validate all fields
    let isValid = true;
    
    // Create a validation error collection
    const validationErrors = [];
    
    // Validate fullName
    if (fullName === '') {
      validationErrors.push('Vui lòng nhập họ và tên');
      isValid = false;
    }
    
    // Validate email
    if (!validateEmail(email)) {
      validationErrors.push('Email không hợp lệ');
      isValid = false;
    }
    
    // Validate password
    if (password.length < 8) {
      validationErrors.push('Mật khẩu phải có ít nhất 8 ký tự');
      isValid = false;
    }
    
    // Validate confirm password
    if (password !== confirmPassword) {
      validationErrors.push('Mật khẩu xác nhận không khớp');
      isValid = false;
    }
    
    // Validate student ID
    if (!isValidStudentId(studentId)) {
      validationErrors.push('Mã sinh viên không hợp lệ');
      isValid = false;
    }
    
    if (!isValid) {
      // Show validation errors in the modal
      const errorMessages = validationErrors.map(error => `<li>${error}</li>`).join('');
      showModal('error', 'Đăng ký thất bại', `<ul class="list-disc pl-5">${errorMessages}</ul>`);
      return;
    }
    
    // Show loading state
    const submitBtn = document.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="ri-loader-4-line animate-spin"></i> Đang xử lý...';
    
    // Prepare data for submission
    const formData = {
      fullName,
      email,
      password,
      studentId
    };
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // In a real application, this would be an actual API call
    // const response = await fetch('/api/register', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(formData)
    // });
    
    // if (response.ok) {
    //   const data = await response.json();
    //   showModal('success', 'Đăng ký thành công', 'Tài khoản của bạn đã được tạo thành công. Vui lòng kiểm tra email để xác thực tài khoản.');
    //   registerForm.reset();
    // } else {
    //   const errorData = await response.json();
    //   showModal('error', 'Đăng ký thất bại', errorData.message || 'Đã có lỗi xảy ra khi đăng ký. Vui lòng thử lại sau.');
    // }
    
    // For demonstration, we'll simulate a successful response
    showModal('success', 'Đăng ký thành công', 'Tài khoản của bạn đã được tạo thành công. Vui lòng kiểm tra email để xác thực tài khoản.');
    registerForm.reset();
    
    // Reset progress bar
    updateProgress();
    
    // Reset validation icons
    const validIcons = document.querySelectorAll('[id$="ValidIcon"]');
    const invalidIcons = document.querySelectorAll('[id$="InvalidIcon"]');
    const feedbacks = document.querySelectorAll('[id$="Feedback"]');
    
    validIcons.forEach(icon => icon.style.opacity = '0');
    invalidIcons.forEach(icon => icon.style.opacity = '0');
    feedbacks.forEach(feedback => feedback.classList.add('hidden'));
    
  } catch (error) {
    console.error('Registration error:', error);
    showModal('error', 'Đăng ký thất bại', 'Đã có lỗi xảy ra khi đăng ký. Vui lòng thử lại sau.');
  } finally {
    // Reset button state
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalBtnText;
  }
};

/**
 * Initialize progress bar functionality
 */
const initProgressBar = () => {
  try {
    const form = document.getElementById('registerForm');
    if (!form) return;
    
    const inputs = form.querySelectorAll('input[required], select[required]');
    const progressBar = document.getElementById('progressBar');
    
    if (!progressBar || !inputs.length) return;
    
    // Update progress bar based on form completion
    const updateProgress = () => {
      let filledInputs = 0;
      
      inputs.forEach(input => {
        if (input.type === 'checkbox') {
          if (input.checked) filledInputs++;
        } else if (input.value.trim() !== '') {
          filledInputs++;
        }
      });
      
      const progress = (filledInputs / inputs.length) * 100;
      progressBar.style.width = `${progress}%`;
      
      // Update step indicators
      const step2Circle = document.querySelector('.flex.items-center:last-child div:first-child');
      const step2Text = document.querySelector('.flex.items-center:last-child div:last-child');
      
      if (progress === 100) {
        if (step2Circle) {
          step2Circle.classList.remove('bg-gray-200', 'text-gray-600');
          step2Circle.classList.add('bg-primary', 'text-white');
        }
        if (step2Text) {
          step2Text.classList.remove('text-gray-600');
        }
      } else {
        if (step2Circle) {
          step2Circle.classList.add('bg-gray-200', 'text-gray-600');
          step2Circle.classList.remove('bg-primary', 'text-white');
        }
        if (step2Text) {
          step2Text.classList.add('text-gray-600');
        }
      }
    };
    
    // Add input event listeners for all form fields
    inputs.forEach(input => {
      input.addEventListener('input', updateProgress);
    });
    
    // Make updateProgress globally available
    window.updateProgress = updateProgress;
    
    // Initialize on page load
    updateProgress();
  } catch (error) {
    console.error("Error initializing progress bar:", error);
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
    // Skip if link doesn't have href attribute
    if (!link.hasAttribute('href')) return;
    
    // Reset all links to default state
    if (isMobile) {
      link.className = 'text-red-100 block py-2 hover:text-white';
    } else {
      link.className = 'text-red-100 hover:text-white transition-colors';
    }
    
    // Check if link matches current page
    const linkHref = link.getAttribute('href');
    const isActive = linkHref === currentPage || 
                   (currentPage === 'register.html' && linkHref === './register.html');
    
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
    showModal('error', 'Lỗi hệ thống', `
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