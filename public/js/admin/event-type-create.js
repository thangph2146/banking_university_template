/**
 * Quản lý trang tạo loại sự kiện mới
 * Tối ưu hóa theo phong cách lập trình hàm
 */

document.addEventListener('DOMContentLoaded', () => {
  // Khởi tạo hiệu ứng AOS
  if (typeof AOS !== 'undefined') {
    AOS.init();
  }
  
  // Xử lý các chức năng chính
  initFormHandling();
  initKeyboardShortcuts();
  initSpecialFields();
  initEventTypeTemplates();
  initSidebar();
});

/**
 * Xử lý mẫu loại sự kiện
 */
const initEventTypeTemplates = () => {
  const templates = document.querySelectorAll('.event-type-template');
  const nameInput = document.getElementById('ten_loai_su_kien');
  const codeInput = document.getElementById('ma_loai_su_kien');
  
  if (!templates.length || !nameInput || !codeInput) return;
  
  const handleTemplateClick = (template) => {
    // Lấy dữ liệu từ thuộc tính data của mẫu
    const name = template.getAttribute('data-name') || '';
    const code = template.getAttribute('data-code') || '';
    
    // Điền vào form
    nameInput.value = name;
    codeInput.value = code;
    
    // Thêm hiệu ứng đã chọn
    templates.forEach(t => t.classList.remove('border-primary', 'bg-primary/5'));
    template.classList.add('border-primary', 'bg-primary/5');
    
    // Focus vào ô input tên - giảm timeout
    setTimeout(() => nameInput.focus(), 50);
  };
  
  // Thêm sự kiện click cho từng mẫu
  templates.forEach(template => {
    template.addEventListener('click', () => handleTemplateClick(template));
  });
};

/**
 * Xử lý các trường input đặc biệt
 */
const initSpecialFields = () => {
  // Tự động tạo mã loại sự kiện từ tên
  const nameInput = document.getElementById('ten_loai_su_kien');
  const codeInput = document.getElementById('ma_loai_su_kien');

  if (!nameInput || !codeInput) return;
  
  const handleNameBlur = () => {
    if (!codeInput.value && nameInput.value) {
      codeInput.value = generateCodeFromName(nameInput.value);
    }
  };
  
  nameInput.addEventListener('blur', handleNameBlur);
  
  // Focus vào ô tên loại sự kiện khi trang load xong
  setTimeout(() => nameInput.focus(), 50);
};

/**
 * Xử lý gửi form
 */
const initFormHandling = () => {
  const eventTypeForm = document.getElementById('event-type-form');
  
  if (!eventTypeForm) return;
  
  const validateForm = (form) => {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
      if (!field.value.trim()) {
        field.classList.add('border-red-500');
        showFieldError(field, 'Trường này không được để trống');
        isValid = false;
      } else {
        field.classList.remove('border-red-500');
        clearFieldError(field);
      }
    });
    
    return isValid;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Kiểm tra các trường bắt buộc
    if (!validateForm(eventTypeForm)) {
      showMessage('Vui lòng điền đầy đủ thông tin bắt buộc', 'error');
      return;
    }
    
    // Thu thập dữ liệu form
    const formData = new FormData(eventTypeForm);
    const eventTypeData = {
      ten_loai_su_kien: formData.get('ten_loai_su_kien') || '',
      ma_loai_su_kien: formData.get('ma_loai_su_kien') || generateCodeFromName(formData.get('ten_loai_su_kien') || ''),
      status: formData.get('status') || 'active',
    };
    
    // Xử lý gửi form (thường là gửi AJAX)
    showMessage('Đang lưu loại sự kiện...', 'info');
    
    // Mô phỏng gửi API
    submitEventTypeData(eventTypeData);
  };
  
  eventTypeForm.addEventListener('submit', handleSubmit);
};

/**
 * Hàm mô phỏng gửi dữ liệu đến API
 */
const submitEventTypeData = (data) => {
  // Log dữ liệu để debug trong quá trình phát triển
  console.log('Dữ liệu loại sự kiện:', data);
  
  // Giả lập API call - trong thực tế sẽ sử dụng fetch hoặc axios
  return new Promise((resolve) => {
    setTimeout(() => {
      showMessage('Tạo loại sự kiện thành công!', 'success');
      
      // Chuyển hướng sau khi thành công
      setTimeout(() => {
        window.location.href = 'event-types.html';
      }, 1000);
      
      resolve({ success: true, data });
    }, 800);
  });
};

/**
 * Tạo mã từ tên - hàm thuần túy
 */
const generateCodeFromName = (name) => {
  if (!name) return '';
  
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Loại bỏ dấu
    .replace(/[^a-zA-Z0-9\s]/g, '') // Chỉ giữ lại chữ cái, số và khoảng trắng
    .replace(/\s+/g, '_') // Thay thế khoảng trắng bằng gạch dưới
    .toLowerCase(); // Chuyển thành chữ thường
};

/**
 * Hiển thị lỗi cho một trường input
 */
const showFieldError = (field, message) => {
  if (!field || !field.parentNode) return;
  
  // Xóa thông báo lỗi cũ nếu có
  clearFieldError(field);
  
  // Thêm thông báo lỗi mới
  const errorDiv = document.createElement('div');
  errorDiv.className = 'error-message text-red-500 text-xs mt-1';
  errorDiv.textContent = message;
  field.parentNode.appendChild(errorDiv);
};

/**
 * Xóa thông báo lỗi khỏi một trường input
 */
const clearFieldError = (field) => {
  if (!field || !field.parentNode) return;
  
  const existingError = field.parentNode.querySelector('.error-message');
  if (existingError) {
    existingError.remove();
  }
};

/**
 * Hiển thị thông báo - hàm thuần túy
 */
const createToastElement = (message, type = 'info') => {
  const toast = document.createElement('div');
  toast.className = 'toast-notification fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg animate-fade-in';
  
  // Xác định kiểu thông báo
  const typeConfig = {
    success: { bgColor: 'bg-green-500', icon: 'ri-check-line' },
    error: { bgColor: 'bg-red-500', icon: 'ri-error-warning-line' },
    warning: { bgColor: 'bg-yellow-500', icon: 'ri-alert-line' },
    info: { bgColor: 'bg-blue-500', icon: 'ri-information-line' }
  };
  
  const { bgColor, icon } = typeConfig[type] || typeConfig.info;
  toast.classList.add(bgColor);
  
  toast.innerHTML = `
    <div class="flex items-center text-white">
      <i class="${icon} mr-2 text-lg"></i>
      <span>${message}</span>
    </div>
  `;
  
  return toast;
};

/**
 * Hiển thị thông báo trên giao diện
 */
const showMessage = (message, type = 'info') => {
  // Xóa thông báo cũ
  const existingToast = document.querySelector('.toast-notification');
  if (existingToast) {
    existingToast.remove();
  }
  
  // Tạo và hiển thị thông báo mới
  const toast = createToastElement(message, type);
  document.body.appendChild(toast);
  
  // Tự động ẩn thông báo sau 3 giây
  setTimeout(() => {
    toast.classList.remove('animate-fade-in');
    toast.classList.add('animate-fade-out');
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3000);
};

/**
 * Khởi tạo phím tắt
 */
const initKeyboardShortcuts = () => {
  // Phím tắt để submit form: Alt + S
  const handleKeyDown = (e) => {
    if (e.altKey && e.key === 's') {
      e.preventDefault();
      const submitButton = document.querySelector('button[form="event-type-form"]');
      if (submitButton) submitButton.click();
    }
  };
  
  window.addEventListener('keydown', handleKeyDown);
};

/**
 * Khởi tạo sidebar
 */
const initSidebar = () => {
  const sidebar = document.getElementById('sidebar');
  const sidebarOpen = document.getElementById('sidebar-open');
  const sidebarClose = document.getElementById('sidebar-close');
  const sidebarBackdrop = document.getElementById('sidebar-backdrop');
  
  if (!sidebar) return;
  
  // Hàm đóng sidebar
  const closeSidebar = () => {
    if (!sidebar || !sidebarBackdrop) return;
    
    sidebar.classList.add('-translate-x-full');
    sidebarBackdrop.classList.remove('opacity-100');
    setTimeout(() => {
      sidebarBackdrop.classList.add('hidden');
    }, 300);
  };
  
  // Hàm mở sidebar
  const openSidebar = () => {
    if (!sidebar || !sidebarBackdrop) return;
    
    sidebar.classList.remove('-translate-x-full');
    sidebarBackdrop.classList.remove('hidden');
    setTimeout(() => {
      sidebarBackdrop.classList.add('opacity-100');
    }, 50);
  };
  
  // Thêm sự kiện
  if (sidebarOpen) sidebarOpen.addEventListener('click', openSidebar);
  if (sidebarClose) sidebarClose.addEventListener('click', closeSidebar);
  if (sidebarBackdrop) sidebarBackdrop.addEventListener('click', closeSidebar);
}; 