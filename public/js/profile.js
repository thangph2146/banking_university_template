/**
 * Profile Page JavaScript
 * Banking University Event Management System
 * 
 * This file implements the interactive features for the profile page
 * using a functional programming approach.
 */

// Wait for DOM to fully load before initializing
document.addEventListener("DOMContentLoaded", () => {
  // Initialize all components
  initAOS();
  initMobileMenu();
  initPasswordToggle();
  initSmoothScrolling();
  initProfileEdit();
  initPasswordChange();
  initAvatarUpload();
  initBackToTopButton();
  setActiveMenuItems();
});

/**
 * Initialize AOS (Animate On Scroll) library
 */
const initAOS = () => {
  try {
    AOS.init({
      duration: 800,
      once: false,
      mirror: true,
      offset: 50
    });
  } catch (error) {
    console.error("Error initializing AOS:", error);
  }
};

/**
 * Mobile menu functionality
 * Handles mobile menu opening/closing and related transitions
 */
const initMobileMenu = () => {
  const menuButton = document.querySelector("#mobile-menu-button");
  const mobileMenu = document.querySelector("#mobile-menu");
  const closeButton = document.querySelector("#mobile-menu-close");
  
  if (!menuButton || !mobileMenu || !closeButton) return;
  
  // Toggle menu function
  const toggleMenu = () => {
    const isOpen = !mobileMenu.classList.contains("translate-x-full");
    
    if (isOpen) {
      // Close menu
      mobileMenu.classList.add("translate-x-full");
      document.body.classList.remove("overflow-hidden");
      menuButton.setAttribute("aria-expanded", "false");
    } else {
      // Open menu
      mobileMenu.classList.remove("translate-x-full");
      document.body.classList.add("overflow-hidden");
      menuButton.setAttribute("aria-expanded", "true");
    }
  };
  
  // Event listeners
  menuButton.addEventListener("click", toggleMenu);
  closeButton.addEventListener("click", toggleMenu);
  
  // Close when clicking outside
  document.addEventListener("click", (e) => {
    if (!mobileMenu.classList.contains("translate-x-full") && 
        !mobileMenu.contains(e.target) && 
        !menuButton.contains(e.target)) {
      toggleMenu();
    }
  });
  
  // Close menu on escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !mobileMenu.classList.contains("translate-x-full")) {
      toggleMenu();
    }
  });
};

/**
 * Password visibility toggle
 */
const initPasswordToggle = () => {
  try {
    const togglePasswordButtons = document.querySelectorAll('.relative button');
    
    togglePasswordButtons.forEach(button => {
      button.addEventListener('click', function() {
        const input = this.previousElementSibling;
        const icon = this.querySelector('i');
        
        if (input.type === 'password') {
          input.type = 'text';
          icon.className = 'ri-eye-line';
        } else {
          input.type = 'password';
          icon.className = 'ri-eye-off-line';
        }
      });
    });
  } catch (error) {
    console.error("Error initializing password toggle:", error);
  }
};

/**
 * Initialize smooth scrolling for sidebar navigation
 */
const initSmoothScrolling = () => {
  try {
    document.querySelectorAll('.sticky a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          // Update active class on sidebar links
          document.querySelectorAll('.sticky a').forEach(link => {
            link.classList.remove('bg-primary/10', 'text-primary');
            link.classList.add('text-gray-700', 'hover:bg-primary/5', 'hover:text-primary');
          });
          
          this.classList.remove('text-gray-700', 'hover:bg-primary/5', 'hover:text-primary');
          this.classList.add('bg-primary/10', 'text-primary');
          
          // Scroll to target with offset for header
          window.scrollTo({
            top: targetElement.offsetTop - 100,
            behavior: 'smooth'
          });
        }
      });
    });
  } catch (error) {
    console.error("Error initializing smooth scrolling:", error);
  }
};

/**
 * Profile edit functionality
 */
const initProfileEdit = () => {
  try {
    const editProfileBtn = document.getElementById('editProfileBtn');
    const editProfileModal = document.getElementById('editProfileModal');
    const closeProfileModal = document.getElementById('closeProfileModal');
    const cancelEditProfile = document.getElementById('cancelEditProfile');
    const editProfileForm = document.getElementById('editProfileForm');
    
    if (!editProfileBtn || !editProfileModal || !closeProfileModal || !cancelEditProfile || !editProfileForm) return;
    
    // Form fields for validation
    const fullNameField = document.getElementById('fullName');
    const emailField = document.getElementById('email');
    const phoneField = document.getElementById('phone');
    const submitButton = editProfileForm.querySelector('button[type="submit"]');
    const originalSubmitHtml = submitButton.innerHTML;
    
    // Open modal
    editProfileBtn.addEventListener('click', () => {
      editProfileModal.classList.add('show');
      document.body.style.overflow = 'hidden';
    });
    
    // Close modal
    const closeModal = () => {
      editProfileModal.classList.remove('show');
      document.body.style.overflow = '';
    };
    
    // Add event listeners for closing modal
    closeProfileModal.addEventListener('click', closeModal);
    cancelEditProfile.addEventListener('click', closeModal);
    
    // Close when clicking outside of modal content
    editProfileModal.addEventListener('click', (e) => {
      if (e.target === editProfileModal) {
        closeModal();
      }
    });
    
    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && editProfileModal.classList.contains('show')) {
        closeModal();
      }
    });
    
    // Form submission
    editProfileForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      if (!validateForm()) {
        return;
      }
      
      // Show loading state
      submitButton.disabled = true;
      submitButton.innerHTML = `
        <div class="flex items-center">
          <div class="spinner mr-2"></div>
          <span>Đang xử lý...</span>
        </div>
      `;
      
      // Simulate API call
      setTimeout(() => {
        // Generate random number for success/failure
        const randomNum = Math.floor(Math.random() * 100);
        
        if (randomNum < 80) {
          // Success
          showToast('success', 'Cập nhật thông tin thành công!');
          closeModal();
          
          // Update profile info in main view
          updateProfileInfo();
        } else if (randomNum < 90) {
          // Email already in use
          showToast('error', 'Email đã được sử dụng bởi tài khoản khác.');
          showError(emailField, 'Email đã được sử dụng bởi tài khoản khác');
        } else {
          // Server error
          showToast('error', 'Có lỗi xảy ra khi cập nhật. Vui lòng thử lại sau.');
        }
        
        // Reset button state
        submitButton.disabled = false;
        submitButton.innerHTML = originalSubmitHtml;
      }, 1500);
    });
  } catch (error) {
    console.error("Error initializing profile edit:", error);
  }
};

/**
 * Helper function to show validation error
 * @param {HTMLElement} element - The input element
 * @param {string} message - Error message
 */
const showError = (element, message) => {
  try {
    // Remove any existing error message
    const existingErrorMsg = element.parentElement.querySelector('.invalid-feedback');
    if (existingErrorMsg) {
      existingErrorMsg.remove();
    }
    
    // Add error class to input
    element.classList.add('is-invalid', 'border-red-500');
    
    // Create error message
    const errorMsg = document.createElement('div');
    errorMsg.className = 'invalid-feedback text-red-500 text-sm mt-1';
    errorMsg.textContent = message;
    
    // Insert error message after input
    element.parentElement.appendChild(errorMsg);
  } catch (error) {
    console.error("Error showing validation error:", error);
  }
};

/**
 * Helper function to clear validation error
 * @param {HTMLElement} element - The input element
 */
const clearError = (element) => {
  try {
    element.classList.remove('is-invalid', 'border-red-500');
    const errorMsg = element.parentElement.querySelector('.invalid-feedback');
    if (errorMsg) {
      errorMsg.remove();
    }
  } catch (error) {
    console.error("Error clearing validation error:", error);
  }
};

/**
 * Helper function to validate form
 * @returns {boolean} Whether the form is valid
 */
const validateForm = () => {
  try {
    let isValid = true;
    const fullNameField = document.getElementById('fullName');
    const emailField = document.getElementById('email');
    const phoneField = document.getElementById('phone');
    
    // Validate full name
    if (!fullNameField.value.trim()) {
      showError(fullNameField, 'Họ và tên không được để trống');
      isValid = false;
    } else if (fullNameField.value.trim().length < 3) {
      showError(fullNameField, 'Họ và tên phải có ít nhất 3 ký tự');
      isValid = false;
    } else {
      clearError(fullNameField);
    }
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailField.value.trim()) {
      showError(emailField, 'Email không được để trống');
      isValid = false;
    } else if (!emailRegex.test(emailField.value.trim())) {
      showError(emailField, 'Email không đúng định dạng');
      isValid = false;
    } else {
      clearError(emailField);
    }
    
    // Validate phone (if provided)
    if (phoneField.value.trim() && !/^(0|\+84)[3-9][0-9]{8}$/.test(phoneField.value.trim())) {
      showError(phoneField, 'Số điện thoại không đúng định dạng');
      isValid = false;
    } else {
      clearError(phoneField);
    }
    
    // Add shake animation to invalid inputs
    if (!isValid) {
      document.querySelectorAll('.is-invalid').forEach(input => {
        input.classList.add('animate-shake');
        setTimeout(() => {
          input.classList.remove('animate-shake');
        }, 500);
      });
      
      showToast('warning', 'Vui lòng kiểm tra lại thông tin nhập');
    }
    
    return isValid;
  } catch (error) {
    console.error("Error validating form:", error);
    return false;
  }
};

/**
 * Update profile info in main view after successful form submission
 */
const updateProfileInfo = () => {
  try {
    // Get form values
    const fullName = document.getElementById('fullName').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const birthDate = document.getElementById('birthDate').value;
    const gender = document.getElementById('gender').value;
    const faculty = document.getElementById('faculty').value;
    const major = document.getElementById('major').value;
    const address = document.getElementById('address').value;
    
    // Update profile info in main view
    const profileSection = document.getElementById('thong-tin');
    if (profileSection) {
      const nameElement = profileSection.querySelector(':scope div:nth-child(1) p');
      const emailElement = profileSection.querySelector(':scope div:nth-child(3) p');
      const phoneElement = profileSection.querySelector(':scope div:nth-child(4) p');
      const birthDateElement = profileSection.querySelector(':scope div:nth-child(5) p');
      const genderElement = profileSection.querySelector(':scope div:nth-child(6) p');
      const facultyElement = profileSection.querySelector(':scope div:nth-child(7) p');
      const majorElement = profileSection.querySelector(':scope div:nth-child(8) p');
      const addressElement = profileSection.querySelector('p:last-child');
      
      if (nameElement) nameElement.textContent = fullName;
      if (emailElement) emailElement.textContent = email;
      if (phoneElement) phoneElement.textContent = phone;
      if (birthDateElement) {
        const formattedDate = new Date(birthDate).toLocaleDateString('vi-VN');
        birthDateElement.textContent = formattedDate;
      }
      if (genderElement) {
        genderElement.textContent = gender === 'nam' ? 'Nam' : gender === 'nu' ? 'Nữ' : 'Khác';
      }
      
      // Update faculty name
      if (facultyElement) {
        const facultySelect = document.getElementById('faculty');
        if (facultySelect) {
          const selectedOption = facultySelect.options[facultySelect.selectedIndex];
          facultyElement.textContent = selectedOption.textContent;
        }
      }
      
      // Update major name
      if (majorElement) {
        const majorSelect = document.getElementById('major');
        if (majorSelect) {
          const selectedOption = majorSelect.options[majorSelect.selectedIndex];
          majorElement.textContent = selectedOption.textContent;
        }
      }
      
      if (addressElement) addressElement.textContent = address;
      
      // Update header username
      const headerUsername = document.querySelector('header button span');
      if (headerUsername) {
        headerUsername.textContent = fullName;
      }
      
      // Update mobile menu username
      const mobileUsername = document.querySelector('#mobile-menu .text-white.font-medium');
      if (mobileUsername) {
        mobileUsername.textContent = fullName;
      }
      
      // Update sidebar username
      const sidebarUsername = document.querySelector('.sidebar h2');
      if (sidebarUsername) {
        sidebarUsername.textContent = fullName;
      }
    }
  } catch (error) {
    console.error("Error updating profile info:", error);
  }
};

/**
 * Password change functionality
 */
const initPasswordChange = () => {
  try {
    const passwordChangeForm = document.getElementById('passwordChangeForm');
    const currentPasswordField = document.getElementById('currentPassword');
    const newPasswordField = document.getElementById('newPassword');
    const confirmPasswordField = document.getElementById('confirmPassword');
    const changePasswordBtn = document.getElementById('changePasswordBtn');
    const passwordStrength = document.getElementById('passwordStrength');
    const passwordStrengthBar = document.getElementById('passwordStrengthBar');
    
    if (!passwordChangeForm || !currentPasswordField || !newPasswordField || 
        !confirmPasswordField || !changePasswordBtn) return;
    
    // Password strength meter
    if (newPasswordField && passwordStrength && passwordStrengthBar) {
      newPasswordField.addEventListener('input', () => {
        const password = newPasswordField.value;
        
        if (password.length > 0) {
          passwordStrength.classList.remove('hidden');
          
          const strength = checkPasswordStrength(password);
          
          // Update strength bar
          passwordStrengthBar.style.width = `${(strength / 5) * 100}%`;
          
          // Update color based on strength
          if (strength <= 2) {
            passwordStrengthBar.className = 'h-full bg-red-500 transition-all duration-300';
          } else if (strength <= 3) {
            passwordStrengthBar.className = 'h-full bg-yellow-500 transition-all duration-300';
          } else {
            passwordStrengthBar.className = 'h-full bg-green-500 transition-all duration-300';
          }
        } else {
          passwordStrength.classList.add('hidden');
        }
      });
    }
    
    // Password form submission
    passwordChangeForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      let isValid = true;
      
      // Validate current password
      if (!currentPasswordField.value.trim()) {
        showError(currentPasswordField, 'Vui lòng nhập mật khẩu hiện tại');
        isValid = false;
      } else {
        clearError(currentPasswordField);
      }
      
      // Validate new password with more extensive requirements
      if (!newPasswordField.value.trim()) {
        showError(newPasswordField, 'Vui lòng nhập mật khẩu mới');
        isValid = false;
      } else if (newPasswordField.value.length < 8) {
        showError(newPasswordField, 'Mật khẩu phải có ít nhất 8 ký tự');
        isValid = false;
      } else if (checkPasswordStrength(newPasswordField.value) < 3) {
        showError(newPasswordField, 'Mật khẩu quá yếu. Vui lòng sử dụng chữ hoa, chữ thường, số và ký tự đặc biệt');
        isValid = false;
      } else if (newPasswordField.value === currentPasswordField.value) {
        showError(newPasswordField, 'Mật khẩu mới không được trùng với mật khẩu hiện tại');
        isValid = false;
      } else {
        clearError(newPasswordField);
      }
      
      // Validate confirm password
      if (!confirmPasswordField.value.trim()) {
        showError(confirmPasswordField, 'Vui lòng xác nhận mật khẩu mới');
        isValid = false;
      } else if (confirmPasswordField.value !== newPasswordField.value) {
        showError(confirmPasswordField, 'Mật khẩu xác nhận không khớp');
        isValid = false;
      } else {
        clearError(confirmPasswordField);
      }
      
      if (!isValid) {
        // Add shake animation to invalid inputs
        document.querySelectorAll('.is-invalid').forEach(input => {
          input.classList.add('animate-shake');
          setTimeout(() => {
            input.classList.remove('animate-shake');
          }, 500);
        });
        
        showToast('warning', 'Vui lòng kiểm tra lại thông tin nhập');
        return;
      }
      
      // Show loading state
      const originalBtnHtml = changePasswordBtn.innerHTML;
      changePasswordBtn.disabled = true;
      changePasswordBtn.innerHTML = `
        <div class="flex items-center">
          <div class="spinner mr-2"></div>
          <span>Đang xử lý...</span>
        </div>
      `;
      
      // Simulate API call with expanded random outcomes
      setTimeout(() => {
        // Generate random number for success/failure with more varied scenarios
        const randomNum = Math.floor(Math.random() * 100);
        
        if (randomNum < 70) {
          // Success
          showToast('success', 'Cập nhật mật khẩu thành công!');
          
          // Reset form
          passwordChangeForm.reset();
          passwordStrength.classList.add('hidden');
          
        } else if (randomNum < 80) {
          // Current password incorrect
          showToast('error', 'Mật khẩu hiện tại không chính xác.');
          showError(currentPasswordField, 'Mật khẩu hiện tại không chính xác');
          currentPasswordField.classList.add('animate-shake');
          setTimeout(() => {
            currentPasswordField.classList.remove('animate-shake');
          }, 500);
          
        } else if (randomNum < 85) {
          // New password was recently used
          showToast('warning', 'Mật khẩu mới đã được sử dụng gần đây. Vui lòng chọn mật khẩu khác.');
          showError(newPasswordField, 'Mật khẩu đã được sử dụng gần đây');
          newPasswordField.classList.add('animate-shake');
          setTimeout(() => {
            newPasswordField.classList.remove('animate-shake');
          }, 500);
          
        } else if (randomNum < 90) {
          // Account locked due to too many password change attempts
          showToast('error', 'Tài khoản tạm thời bị khóa do thay đổi mật khẩu quá nhiều lần. Vui lòng thử lại sau 30 phút.');
          
        } else if (randomNum < 95) {
          // Server error with more specific message
          showToast('error', 'Máy chủ đang bận, không thể xử lý yêu cầu. Vui lòng thử lại sau.');
          
        } else {
          // Network error with connection suggestion
          showToast('error', 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng và thử lại.');
        }
        
        // Reset button state
        changePasswordBtn.disabled = false;
        changePasswordBtn.innerHTML = originalBtnHtml;
      }, 1500);
    });
  } catch (error) {
    console.error("Error initializing password change:", error);
  }
};

/**
 * Check password strength
 * @param {string} password - Password to check
 * @returns {number} Strength score (1-5)
 */
const checkPasswordStrength = (password) => {
  try {
    let strength = 0;
    
    // Length check
    if (password.length >= 8) strength += 1;
    if (password.length >= 12) strength += 1;
    
    // Character type checks
    if (/[A-Z]/.test(password)) strength += 1;  // Uppercase
    if (/[a-z]/.test(password)) strength += 1;  // Lowercase
    if (/[0-9]/.test(password)) strength += 1;  // Numbers
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;  // Special characters
    
    return Math.min(5, strength);
  } catch (error) {
    console.error("Error checking password strength:", error);
    return 0;
  }
};

/**
 * Avatar upload functionality
 */
const initAvatarUpload = () => {
  try {
    const avatarUpload = document.getElementById('avatarUpload');
    const modalAvatarUpload = document.getElementById('modalAvatarUpload');
    const profileAvatar = document.getElementById('profileAvatar');
    const modalProfileAvatar = document.getElementById('modalProfileAvatar');
    const avatarContainer = document.getElementById('avatarContainer');
    
    if (!avatarUpload || !profileAvatar) return;
    
    // Make avatar container clickable to trigger file input
    if (avatarContainer) {
      avatarContainer.addEventListener('click', (e) => {
        // Don't trigger if clicking on the camera button (which has its own input)
        if (!e.target.closest('label')) {
          avatarUpload.click();
        }
      });
    }
    
    // Handle file input change
    avatarUpload.addEventListener('change', (e) => {
      handleImageUpload(e.target.files[0]);
    });
    
    // Handle modal file input change
    if (modalAvatarUpload) {
      modalAvatarUpload.addEventListener('change', (e) => {
        handleImageUpload(e.target.files[0]);
      });
    }
  } catch (error) {
    console.error("Error initializing avatar upload:", error);
  }
};

/**
 * Handle image upload for avatar
 * @param {File} file - The image file
 */
const handleImageUpload = (file) => {
  try {
    if (!file) return;
    
    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      showToast('error', 'Định dạng file không hợp lệ. Vui lòng chọn file hình ảnh (JPG, PNG, GIF)');
      return;
    }
    
    // Validate file size
    const maxSize = 2 * 1024 * 1024; // 2MB in bytes
    if (file.size > maxSize) {
      showToast('error', 'Dung lượng ảnh vượt quá giới hạn cho phép (tối đa 2MB)');
      return;
    }
    
    // Show loading overlay
    const profileAvatar = document.getElementById('profileAvatar');
    if (!profileAvatar) return;
    
    const loadingOverlay = document.createElement('div');
    loadingOverlay.className = 'absolute inset-0 bg-black/60 rounded-full flex items-center justify-center z-10';
    loadingOverlay.innerHTML = '<div class="spinner border-2 border-white/30 border-t-white w-8 h-8"></div>';
    
    const profileAvatarContainer = profileAvatar.parentElement;
    profileAvatarContainer.style.position = 'relative';
    profileAvatarContainer.appendChild(loadingOverlay);
    
    // Read file
    const reader = new FileReader();
    
    reader.onload = (e) => {
      // Simulate API upload
      setTimeout(() => {
        // Remove loading overlay
        loadingOverlay.remove();
        
        // Random success/failure for demo
        const randomNum = Math.floor(Math.random() * 100);
        
        if (randomNum < 75) {
          // Success case
          const imageUrl = e.target.result;
          
          // Update all avatar instances
          if (profileAvatar) profileAvatar.src = imageUrl;
          
          const modalProfileAvatar = document.getElementById('modalProfileAvatar');
          if (modalProfileAvatar) modalProfileAvatar.src = imageUrl;
          
          // Update header and mobile menu avatars
          const headerAvatar = document.querySelector('.group button img');
          const mobileAvatar = document.querySelector('#mobile-menu .w-12.h-12');
          
          if (headerAvatar) headerAvatar.src = imageUrl;
          if (mobileAvatar) mobileAvatar.src = imageUrl;
          
          showToast('success', 'Tải ảnh đại diện thành công!');
        } else if (randomNum < 85) {
          // Image processing error
          showToast('error', 'Không thể xử lý hình ảnh. Vui lòng thử lại với hình ảnh khác.');
        } else if (randomNum < 90) {
          // File corrupted
          showToast('error', 'File hình ảnh bị hỏng. Vui lòng chọn hình ảnh khác.');
        } else if (randomNum < 95) {
          // Server quota exceeded
          showToast('warning', 'Bạn đã đạt giới hạn số lần thay đổi ảnh đại diện trong ngày. Vui lòng thử lại sau.');
        } else {
          // Network error
          showToast('error', 'Lỗi kết nối. Vui lòng kiểm tra kết nối mạng và thử lại.');
        }
      }, 1500);
    };
    
    reader.onerror = () => {
      // Remove loading overlay
      loadingOverlay.remove();
      
      // Show error
      showToast('error', 'Không thể đọc file. File có thể bị hỏng hoặc không hợp lệ.');
    };
    
    reader.readAsDataURL(file);
  } catch (error) {
    console.error("Error handling image upload:", error);
    showToast('error', 'Có lỗi xảy ra khi xử lý ảnh. Vui lòng thử lại sau.');
  }
};

/**
 * Show toast notification
 * @param {string} type - Toast type (success, error, warning)
 * @param {string} message - Toast message
 */
const showToast = (type, message) => {
  try {
    // Check if toast container exists, create if not
    let toastContainer = document.getElementById('toast-container');
    
    if (!toastContainer) {
      toastContainer = document.createElement('div');
      toastContainer.id = 'toast-container';
      toastContainer.className = 'fixed bottom-4 right-4 z-50 flex flex-col gap-2';
      document.body.appendChild(toastContainer);
    }
    
    // Create toast element
    const toast = document.createElement('div');
    toast.className = 'toast opacity-0 transform translate-x-full transition-all duration-300 rounded-lg shadow-lg p-4 flex items-center text-sm max-w-md';
    
    // Set color based on type
    if (type === 'success') {
      toast.classList.add('bg-green-100', 'text-green-800', 'border-l-4', 'border-green-500');
    } else if (type === 'error') {
      toast.classList.add('bg-red-100', 'text-red-800', 'border-l-4', 'border-red-500');
    } else if (type === 'warning') {
      toast.classList.add('bg-yellow-100', 'text-yellow-800', 'border-l-4', 'border-yellow-500');
    } else {
      toast.classList.add('bg-blue-100', 'text-blue-800', 'border-l-4', 'border-blue-500');
    }
    
    // Set icon based on type
    let icon;
    if (type === 'success') {
      icon = '<i class="ri-check-line text-xl mr-2 text-green-500"></i>';
    } else if (type === 'error') {
      icon = '<i class="ri-error-warning-line text-xl mr-2 text-red-500"></i>';
    } else if (type === 'warning') {
      icon = '<i class="ri-alert-line text-xl mr-2 text-yellow-500"></i>';
    } else {
      icon = '<i class="ri-information-line text-xl mr-2 text-blue-500"></i>';
    }
    
    // Set content
    toast.innerHTML = `
      ${icon}
      <div class="flex-1">${message}</div>
      <button class="ml-2 text-gray-400 hover:text-gray-600">
        <i class="ri-close-line"></i>
      </button>
    `;
    
    // Add to container
    toastContainer.appendChild(toast);
    
    // Show toast
    setTimeout(() => {
      toast.classList.remove('opacity-0', 'translate-x-full');
      toast.classList.add('opacity-100', 'translate-x-0');
    }, 10);
    
    // Add close button event
    const closeButton = toast.querySelector('button');
    closeButton.addEventListener('click', () => {
      removeToast(toast);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      removeToast(toast);
    }, 5000);
  } catch (error) {
    console.error("Error showing toast:", error);
  }
};

/**
 * Remove toast notification
 * @param {HTMLElement} toast - Toast element to remove
 */
const removeToast = (toast) => {
  try {
    toast.classList.add('opacity-0', 'translate-x-full');
    setTimeout(() => {
      toast.remove();
    }, 300);
  } catch (error) {
    console.error("Error removing toast:", error);
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
                    (currentPage === 'profile.html' && linkHref === './profile.html') ||
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