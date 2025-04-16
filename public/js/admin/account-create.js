/**
 * Quản lý trang thêm mới tài khoản Admin
 * Tối ưu hóa theo phong cách lập trình hàm
 */

document.addEventListener('DOMContentLoaded', () => {
  // Khởi tạo hiệu ứng AOS nếu có
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out'
    });
  }
  
  // Khởi tạo ứng dụng
  initApp();
});

/**
 * Khởi tạo ứng dụng
 */
const initApp = () => {
  // Khởi tạo các tính năng
  initPasswordToggle();
  initFormHandling();
  initButtonHandlers();
  initSidebar();
  initAutoPassword();
  
  // Hiển thị thông báo
  showMessage('Sẵn sàng tạo mới tài khoản Admin', 'info');
};

/**
 * Xử lý tạo mật khẩu tự động
 */
const initAutoPassword = () => {
  const autoPasswordCheckbox = document.getElementById('auto_password');
  const passwordInput = document.getElementById('u_password');
  const passwordConfirmInput = document.getElementById('u_password_confirm');
  
  if (!autoPasswordCheckbox || !passwordInput || !passwordConfirmInput) return;
  
  // Tạo mật khẩu ngẫu nhiên
  const generateRandomPassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
    let password = '';
    
    // Tạo mật khẩu có độ dài 10 ký tự
    for (let i = 0; i < 10; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      password += chars[randomIndex];
    }
    
    return password;
  };
  
  // Xử lý khi checkbox thay đổi
  autoPasswordCheckbox.addEventListener('change', () => {
    if (autoPasswordCheckbox.checked) {
      const randomPassword = generateRandomPassword();
      passwordInput.value = randomPassword;
      passwordConfirmInput.value = randomPassword;
      
      // Vô hiệu hóa trường nhập mật khẩu
      passwordInput.setAttribute('readonly', 'readonly');
      passwordConfirmInput.setAttribute('readonly', 'readonly');
      
      // Hiển thị mật khẩu
      passwordInput.type = 'text';
      passwordConfirmInput.type = 'text';
      
      // Cập nhật icon
      const passwordToggle = document.getElementById('toggle-password');
      const confirmToggle = document.getElementById('toggle-password-confirm');
      
      if (passwordToggle && passwordToggle.querySelector('i')) {
        passwordToggle.querySelector('i').className = 'ri-eye-line';
      }
      
      if (confirmToggle && confirmToggle.querySelector('i')) {
        confirmToggle.querySelector('i').className = 'ri-eye-line';
      }
    } else {
      // Xóa mật khẩu
      passwordInput.value = '';
      passwordConfirmInput.value = '';
      
      // Bỏ vô hiệu hóa
      passwordInput.removeAttribute('readonly');
      passwordConfirmInput.removeAttribute('readonly');
      
      // Ẩn mật khẩu
      passwordInput.type = 'password';
      passwordConfirmInput.type = 'password';
      
      // Cập nhật icon
      const passwordToggle = document.getElementById('toggle-password');
      const confirmToggle = document.getElementById('toggle-password-confirm');
      
      if (passwordToggle && passwordToggle.querySelector('i')) {
        passwordToggle.querySelector('i').className = 'ri-eye-off-line';
      }
      
      if (confirmToggle && confirmToggle.querySelector('i')) {
        confirmToggle.querySelector('i').className = 'ri-eye-off-line';
      }
    }
  });
};

/**
 * Xử lý form
 */
const initFormHandling = () => {
  const form = document.getElementById('account-form');
  if (!form) return;
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Xóa tất cả lỗi hiện tại
    clearAllErrors();
    
    // Kiểm tra hợp lệ
    if (!validateForm(form)) return;
    
    // Thu thập dữ liệu
    const formData = new FormData(form);
    const accountData = {
      u_LastName: formData.get('u_LastName'),
      u_MiddleName: formData.get('u_MiddleName'),
      u_FirstName: formData.get('u_FirstName'),
      u_type: formData.get('u_type'),
      u_username: formData.get('u_username'),
      u_email: formData.get('u_email'),
      u_password: formData.get('u_password'),
      u_status: formData.get('u_status')
    };
    
    // Gửi dữ liệu
    saveAccountData(accountData);
  };
  
  form.addEventListener('submit', handleSubmit);
};

/**
 * Xóa tất cả lỗi
 */
const clearAllErrors = () => {
  // Xóa thông báo lỗi
  const errorMessages = document.querySelectorAll('.error-message');
  errorMessages.forEach(el => el.remove());
  
  // Xóa viền đỏ ở các trường lỗi
  const errorFields = document.querySelectorAll('.border-red-500');
  errorFields.forEach(field => field.classList.remove('border-red-500'));
};

/**
 * Kiểm tra biểu mẫu
 */
const validateForm = (form) => {
  let isValid = true;
  
  // Kiểm tra các trường bắt buộc
  const requiredFields = [
    { id: 'u_FirstName', message: 'Tên không được để trống' },
    { id: 'u_username', message: 'Tên đăng nhập không được để trống' },
    { id: 'u_email', message: 'Email không được để trống' },
    { id: 'u_password', message: 'Mật khẩu không được để trống' }
  ];
  
  requiredFields.forEach(field => {
    const input = document.getElementById(field.id);
    if (!input) return;
    
    if (!input.value.trim()) {
      showFieldError(input, field.message);
      isValid = false;
    }
  });
  
  // Kiểm tra định dạng email
  const emailInput = document.getElementById('u_email');
  if (emailInput && emailInput.value.trim()) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput.value.trim())) {
      showFieldError(emailInput, 'Địa chỉ email không hợp lệ');
      isValid = false;
    }
  }
  
  // Kiểm tra mật khẩu xác nhận
  const passwordInput = document.getElementById('u_password');
  const passwordConfirmInput = document.getElementById('u_password_confirm');
  
  if (passwordInput && passwordConfirmInput && 
      passwordInput.value && passwordInput.value !== passwordConfirmInput.value) {
    showFieldError(passwordConfirmInput, 'Mật khẩu xác nhận không khớp');
    isValid = false;
  }
  
  return isValid;
};

/**
 * Hiển thị lỗi cho một trường
 */
const showFieldError = (field, message) => {
  if (!field || !field.parentElement) return;
  
  // Tạo thông báo lỗi
  const errorElement = document.createElement('div');
  errorElement.className = 'error-message text-red-500 text-sm mt-1';
  errorElement.textContent = message;
  
  // Thêm viền đỏ cho input
  field.classList.add('border-red-500');
  
  // Tìm phần tử cha để thêm thông báo lỗi
  // Nếu field nằm trong div.relative (trường hợp input mật khẩu), thêm lỗi vào cha của div.relative
  const parent = field.parentElement.classList.contains('relative') ? 
                 field.parentElement.parentElement : 
                 field.parentElement;
  
  // Thêm thông báo lỗi vào DOM
  parent.appendChild(errorElement);
};

/**
 * Gửi dữ liệu tài khoản
 */
const saveAccountData = (data) => {
  showLoading('Đang lưu dữ liệu...');
  
  // Log dữ liệu (cho mục đích phát triển)
  console.log('Dữ liệu gửi lên server:', data);
  
  // Giả lập gọi API - trong thực tế sẽ sử dụng fetch hoặc axios
  setTimeout(() => {
    try {
      // Giả lập phản hồi từ API
      const response = {
        success: true,
        message: 'Tạo mới tài khoản thành công',
        data: {
          u_id: Math.floor(Math.random() * 1000) + 1, // ID giả lập
          ...data,
          u_created_at: new Date().toISOString(),
          u_updated_at: new Date().toISOString()
        }
      };
      
      if (response.success) {
        hideLoading();
        
        // Hiển thị thông báo thành công
        showMessage('Tạo mới tài khoản thành công!', 'success');
        
        // Xóa form sau khi tạo thành công
        setTimeout(() => {
          const form = document.getElementById('account-form');
          if (form) form.reset();
          
          // Dùng location.href để chuyển trang nếu cần thiết
          // window.location.href = 'accounts.html';
        }, 1500);
      } else {
        throw new Error(response.message || 'Lỗi không xác định');
      }
    } catch (error) {
      hideLoading();
      showMessage(`Lỗi khi lưu dữ liệu: ${error.message}`, 'error');
    }
  }, 1000);
};

/**
 * Xử lý các nút
 */
const initButtonHandlers = () => {
  // Nút quay lại
  const backBtn = document.getElementById('back-btn');
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      window.location.href = 'accounts.html';
    });
  }
  
  // Nút hủy
  const cancelBtn = document.getElementById('cancel-btn');
  if (cancelBtn) {
    cancelBtn.addEventListener('click', () => {
      // Xóa form về trạng thái ban đầu
      const form = document.getElementById('account-form');
      if (form) form.reset();
      
      // Xóa tất cả lỗi
      clearAllErrors();
      
      // Reset checkbox mật khẩu tự động
      const autoPasswordCheckbox = document.getElementById('auto_password');
      if (autoPasswordCheckbox && autoPasswordCheckbox.checked) {
        autoPasswordCheckbox.checked = false;
        
        // Kích hoạt sự kiện change để áp dụng thay đổi
        const event = new Event('change');
        autoPasswordCheckbox.dispatchEvent(event);
      }
      
      showMessage('Đã hủy thao tác', 'info');
    });
  }
};

/**
 * Khởi tạo hiển thị/ẩn mật khẩu
 */
const initPasswordToggle = () => {
  const setupToggle = (inputId, toggleId) => {
    const input = document.getElementById(inputId);
    const toggle = document.getElementById(toggleId);
    
    if (!input || !toggle) return;
    
    toggle.addEventListener('click', () => {
      // Nếu trường đang readonly, không cho phép thay đổi
      if (input.hasAttribute('readonly')) return;
      
      const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
      input.setAttribute('type', type);
      
      // Thay đổi icon
      const icon = toggle.querySelector('i');
      if (icon) {
        icon.className = type === 'password' ? 'ri-eye-off-line' : 'ri-eye-line';
      }
    });
  };
  
  setupToggle('u_password', 'toggle-password');
  setupToggle('u_password_confirm', 'toggle-password-confirm');
};

/**
 * Hiển thị loading
 */
const showLoading = (message = 'Đang xử lý...') => {
  const loadingOverlay = document.getElementById('loading-overlay');
  const loadingText = document.getElementById('loading-text');
  
  if (loadingText) loadingText.textContent = message;
  if (loadingOverlay) loadingOverlay.classList.remove('hidden');
};

/**
 * Ẩn loading
 */
const hideLoading = () => {
  const loadingOverlay = document.getElementById('loading-overlay');
  if (loadingOverlay) loadingOverlay.classList.add('hidden');
};

/**
 * Hiển thị thông báo
 */
const showMessage = (message, type = 'info') => {
  // Xóa thông báo cũ
  const existingToast = document.querySelector('.toast-notification');
  if (existingToast) existingToast.remove();
  
  // Tạo thông báo mới
  const toast = document.createElement('div');
  
  // Xác định lớp và biểu tượng dựa trên loại thông báo
  const typeConfig = {
    success: { bgColor: 'bg-green-500', icon: 'ri-check-line' },
    error: { bgColor: 'bg-red-500', icon: 'ri-error-warning-line' },
    warning: { bgColor: 'bg-yellow-500', icon: 'ri-alert-line' },
    info: { bgColor: 'bg-blue-500', icon: 'ri-information-line' }
  };
  
  const { bgColor, icon } = typeConfig[type] || typeConfig.info;
  
  toast.className = `toast-notification fixed top-4 right-4 z-50 ${bgColor} text-white px-4 py-3 rounded-lg shadow-lg animate-fade-in`;
  toast.innerHTML = `
    <div class="flex items-center">
      <i class="${icon} mr-2 text-lg"></i>
      <span>${message}</span>
    </div>
  `;
  
  // Thêm vào DOM
  document.body.appendChild(toast);
  
  // Tự động ẩn sau 3 giây
  setTimeout(() => {
    toast.classList.remove('animate-fade-in');
    toast.classList.add('animate-fade-out');
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3000);
};

/**
 * Khởi tạo sidebar (mobile)
 */
const initSidebar = () => {
  const sidebar = document.getElementById('sidebar');
  const sidebarOpen = document.getElementById('sidebar-open');
  const sidebarClose = document.getElementById('sidebar-close');
  const sidebarBackdrop = document.getElementById('sidebar-backdrop');
  
  if (!sidebar) return;
  
  const openSidebar = () => {
    sidebar.classList.remove('-translate-x-full');
    sidebarBackdrop.classList.remove('hidden');
    setTimeout(() => sidebarBackdrop.classList.add('opacity-100'), 50);
  };
  
  const closeSidebar = () => {
    sidebar.classList.add('-translate-x-full');
    sidebarBackdrop.classList.remove('opacity-100');
    setTimeout(() => sidebarBackdrop.classList.add('hidden'), 300);
  };
  
  if (sidebarOpen) sidebarOpen.addEventListener('click', openSidebar);
  if (sidebarClose) sidebarClose.addEventListener('click', closeSidebar);
  if (sidebarBackdrop) sidebarBackdrop.addEventListener('click', closeSidebar);
}; 