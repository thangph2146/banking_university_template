/**
 * Quản lý trang chỉnh sửa tài khoản Admin
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
  // Lấy ID tài khoản từ URL
  const urlParams = new URLSearchParams(window.location.search);
  const accountId = urlParams.get('id');
  
  // Lưu trữ dữ liệu ban đầu để khôi phục nếu hủy
  let originalFormData = {};
  
  // Khởi tạo các tính năng
  initPasswordToggle();
  initFormHandling(accountId, originalFormData);
  initButtonHandlers(originalFormData);
  initSidebar();
  
  // Tải dữ liệu nếu có ID
  if (accountId) {
    loadAccountData(accountId, originalFormData);
  } else {
    // Nếu không có ID, hiển thị form trống
    showMessage('Form đang ở chế độ tạo mới', 'info');
    clearForm();
  }
};

/**
 * Xóa form về trạng thái ban đầu
 */
const clearForm = () => {
  const form = document.getElementById('account-form');
  if (!form) return;
  
  form.reset();
  
  const createdAtEl = document.getElementById('created_at');
  const updatedAtEl = document.getElementById('updated_at');
  
  if (createdAtEl) createdAtEl.textContent = '-';
  if (updatedAtEl) updatedAtEl.textContent = '-';
};

/**
 * Tải dữ liệu tài khoản từ API
 */
const loadAccountData = (id, originalFormData) => {
  showLoading('Đang tải dữ liệu...');
  
  // Giả lập API call - trong thực tế sẽ gọi đến backend
  setTimeout(() => {
    try {
      // Dữ liệu giả lập từ API dựa theo cấu trúc bảng users trong hanet.sql
      const response = {
        success: true,
        data: {
          u_id: id,
          u_LastName: 'Nguyễn',
          u_MiddleName: 'Văn',
          u_FirstName: 'A',
          u_type: 'admin',
          u_username: 'admin',
          u_email: 'admin@example.com',
          u_status: 1,
          u_created_at: '2023-05-15 10:30:45',
          u_updated_at: '2023-06-20 15:20:30',
          u_deleted_at: null
        }
      };
      
      // Xử lý trường hợp không tìm thấy dữ liệu
      if (!response.success || !response.data) {
        hideLoading();
        showMessage('Không tìm thấy dữ liệu tài khoản', 'error');
        clearForm(); // Đảm bảo form trống nếu không có dữ liệu
        return;
      }
      
      // Cập nhật form với dữ liệu
      populateForm(response.data);
      
      // Lưu dữ liệu gốc để sử dụng khi hủy thay đổi
      Object.assign(originalFormData, response.data);
      
      hideLoading();
      showMessage('Đã tải dữ liệu tài khoản', 'success');
    } catch (error) {
      hideLoading();
      showMessage(`Lỗi khi tải dữ liệu: ${error.message}`, 'error');
      clearForm(); // Đảm bảo form trống khi xảy ra lỗi
    }
  }, 800);
};

/**
 * Điền dữ liệu vào form
 */
const populateForm = (data) => {
  const form = document.getElementById('account-form');
  if (!form) return;
  
  // Cập nhật các trường input chỉ khi có dữ liệu
  const fields = ['u_id', 'u_LastName', 'u_MiddleName', 'u_FirstName', 'u_username', 'u_email'];
  
  fields.forEach(field => {
    const input = document.getElementById(field);
    if (input && data[field] !== undefined) {
      input.value = data[field] || '';
    }
  });
  
  // Cập nhật select
  const typeSelect = document.getElementById('u_type');
  const statusSelect = document.getElementById('u_status');
  
  if (typeSelect && data.u_type !== undefined) {
    typeSelect.value = data.u_type || 'admin';
  }
  
  if (statusSelect && data.u_status !== undefined) {
    statusSelect.value = data.u_status;
  }
  
  // Cập nhật thông tin thời gian
  const createdAtEl = document.getElementById('created_at');
  const updatedAtEl = document.getElementById('updated_at');
  
  if (createdAtEl) {
    createdAtEl.textContent = data.u_created_at ? formatDateTime(data.u_created_at) : '-';
  }
  
  if (updatedAtEl) {
    updatedAtEl.textContent = data.u_updated_at ? formatDateTime(data.u_updated_at) : '-';
  }
};

/**
 * Định dạng ngày giờ theo định dạng Việt Nam
 */
const formatDateTime = (dateTimeStr) => {
  if (!dateTimeStr) return '-';
  
  try {
    const date = new Date(dateTimeStr);
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(date);
  } catch (error) {
    console.error('Lỗi định dạng ngày tháng:', error);
    return dateTimeStr;
  }
};

/**
 * Xử lý form
 */
const initFormHandling = (accountId, originalFormData) => {
  const form = document.getElementById('account-form');
  if (!form) return;
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Xóa tất cả lỗi hiện tại
    clearAllErrors();
    
    // Kiểm tra hợp lệ
    if (!validateForm(form)) return;
    1
    // Thu thập dữ liệu
    const formData = new FormData(form);
    const accountData = {
      u_id: formData.get('u_id') || accountId,
      u_LastName: formData.get('u_LastName'),
      u_MiddleName: formData.get('u_MiddleName'),
      u_FirstName: formData.get('u_FirstName'),
      u_type: formData.get('u_type'),
      u_username: formData.get('u_username'),
      u_email: formData.get('u_email'),
      u_status: formData.get('u_status')
    };
    
    // Xử lý mật khẩu
    const password = formData.get('u_password');
    const passwordConfirm = formData.get('u_password_confirm');
    
    if (password) {
      // Nếu có mật khẩu mới, kiểm tra xác nhận
      if (password !== passwordConfirm) {
        showFieldError(document.getElementById('u_password_confirm'), 'Mật khẩu xác nhận không khớp');
        return;
      }
      accountData.u_password = password;
    }
    
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
    { id: 'u_email', message: 'Email không được để trống' }
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
  showLoading('Đang lưu thay đổi...');
  
  // Log dữ liệu (cho mục đích phát triển)
  console.log('Dữ liệu gửi lên server:', data);
  
  // Giả lập gọi API - trong thực tế sẽ sử dụng fetch hoặc axios
  setTimeout(() => {
    try {
      // Giả lập phản hồi từ API
      const response = {
        success: true,
        message: 'Cập nhật tài khoản thành công'
      };
      
      if (response.success) {
        hideLoading();
        showMessage('Cập nhật tài khoản thành công!', 'success');
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
const initButtonHandlers = (originalFormData) => {
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
      // Nếu có dữ liệu gốc, khôi phục lại
      if (Object.keys(originalFormData).length > 0) {
        populateForm(originalFormData);
      } else {
        clearForm();
      }
      
      // Xóa các trường mật khẩu
      const passwordInputs = document.querySelectorAll('input[type="password"]');
      passwordInputs.forEach(input => input.value = '');
      
      // Xóa tất cả lỗi
      clearAllErrors();
      
      showMessage('Đã hủy thay đổi', 'info');
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