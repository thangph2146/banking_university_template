/**
 * Quản lý trang chỉnh sửa loại sự kiện
 * Tối ưu hóa theo phong cách lập trình hàm
 */

document.addEventListener('DOMContentLoaded', () => {
  // Khởi tạo hiệu ứng AOS
  if (typeof AOS !== 'undefined') {
    AOS.init();
  }
  
  // Khởi tạo các chức năng chính
  initApp();
});

/**
 * Khởi tạo ứng dụng
 */
const initApp = () => {
  // Lấy ID loại sự kiện từ URL
  const urlParams = new URLSearchParams(window.location.search);
  const eventTypeId = urlParams.get('id');
  
  // Kiểm tra ID và tải dữ liệu
  if (!eventTypeId) {
    showMessage('Không tìm thấy ID loại sự kiện', 'error');
    setTimeout(() => window.location.href = 'event-types.html', 1500);
    return;
  }
  
  // Lưu trữ dữ liệu ban đầu để khôi phục nếu hủy
  let originalFormData = {};
  
  // Khởi tạo các tính năng
  initFormHandling(eventTypeId, originalFormData);
  initButtonHandlers(originalFormData);
  initSidebar();
  
  // Tải dữ liệu
  loadEventTypeData(eventTypeId, originalFormData);
};

/**
 * Tải dữ liệu loại sự kiện
 */
const loadEventTypeData = (id, originalFormData) => {
  showLoading('Đang tải dữ liệu...');
  
  // Giả lập API call - trong thực tế sẽ gọi đến backend
  setTimeout(() => {
    try {
      // Dữ liệu giả lập từ API
      const data = {
        loai_su_kien_id: id,
        ten_loai_su_kien: 'Hội thảo',
        ma_loai_su_kien: 'hoi_thao',
        status: 1,
        created_at: '2023-08-15 10:30:45',
        updated_at: '2023-10-20 15:20:30'
      };
      
      // Cập nhật form với dữ liệu
      populateForm(data);
      
      // Lưu dữ liệu gốc để sử dụng khi hủy thay đổi
      Object.assign(originalFormData, data);
      
      hideLoading();
      showMessage('Đã tải dữ liệu loại sự kiện', 'success');
    } catch (error) {
      hideLoading();
      showMessage(`Lỗi khi tải dữ liệu: ${error.message}`, 'error');
    }
  }, 800);
};

/**
 * Điền dữ liệu vào form
 */
const populateForm = (data) => {
  const form = document.getElementById('event-type-form');
  if (!form) return;
  
  // Cập nhật các trường input
  const fields = ['loai_su_kien_id', 'ten_loai_su_kien', 'ma_loai_su_kien'];
  
  fields.forEach(field => {
    const input = document.getElementById(field);
    if (input) input.value = data[field] || '';
  });
  
  // Cập nhật select status
  const statusSelect = document.getElementById('status');
  if (statusSelect) statusSelect.value = data.status;
  
  // Cập nhật thông tin thời gian
  const createdAtEl = document.getElementById('created_at');
  const updatedAtEl = document.getElementById('updated_at');
  
  if (createdAtEl) createdAtEl.textContent = formatDateTime(data.created_at);
  if (updatedAtEl) updatedAtEl.textContent = formatDateTime(data.updated_at);
};

/**
 * Định dạng ngày giờ
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
const initFormHandling = (eventTypeId, originalFormData) => {
  const form = document.getElementById('event-type-form');
  if (!form) return;
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Kiểm tra hợp lệ
    if (!validateForm(form)) return;
    
    // Thu thập dữ liệu
    const formData = new FormData(form);
    const eventTypeData = {
      loai_su_kien_id: eventTypeId,
      ten_loai_su_kien: formData.get('ten_loai_su_kien'),
      ma_loai_su_kien: formData.get('ma_loai_su_kien'),
      status: formData.get('status')
    };
    
    // Gửi dữ liệu
    saveEventTypeData(eventTypeData);
  };
  
  form.addEventListener('submit', handleSubmit);
};

/**
 * Kiểm tra biểu mẫu
 */
const validateForm = (form) => {
  let isValid = true;
  
  // Xóa tất cả lỗi hiện tại
  const errorMessages = form.querySelectorAll('.error-message');
  errorMessages.forEach(el => el.remove());
  
  // Kiểm tra tên loại sự kiện
  const nameInput = form.querySelector('#ten_loai_su_kien');
  if (!nameInput.value.trim()) {
    showFieldError(nameInput, 'Tên loại sự kiện không được để trống');
    isValid = false;
  }
  
  // Kiểm tra mã loại sự kiện (nếu có)
  const codeInput = form.querySelector('#ma_loai_su_kien');
  if (codeInput.value.trim()) {
    const codeRegex = /^[a-zA-Z0-9_]+$/;
    if (!codeRegex.test(codeInput.value.trim())) {
      showFieldError(codeInput, 'Mã loại sự kiện chỉ được chứa chữ cái không dấu, số và dấu gạch dưới');
      isValid = false;
    }
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
  
  // Thêm thông báo lỗi vào DOM
  field.parentElement.appendChild(errorElement);
};

/**
 * Gửi dữ liệu loại sự kiện
 */
const saveEventTypeData = (data) => {
  showLoading('Đang lưu thay đổi...');
  
  // Log dữ liệu (cho mục đích phát triển)
  console.log('Dữ liệu gửi lên server:', data);
  
  // Giả lập gọi API - trong thực tế sẽ sử dụng fetch hoặc axios
  setTimeout(() => {
    hideLoading();
    showMessage('Cập nhật loại sự kiện thành công!', 'success');
    
    // Chuyển hướng sau khi lưu thành công
    setTimeout(() => {
      window.location.href = 'event-types.html';
    }, 1500);
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
      window.location.href = 'event-types.html';
    });
  }
  
  // Nút hủy
  const cancelBtn = document.getElementById('cancel-btn');
  if (cancelBtn) {
    cancelBtn.addEventListener('click', () => {
      // Khôi phục dữ liệu gốc
      populateForm(originalFormData);
      showMessage('Đã hủy thay đổi', 'info');
    });
  }
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
  const bgColor = type === 'success' ? 'bg-green-500' : 
                 type === 'error' ? 'bg-red-500' : 
                 type === 'warning' ? 'bg-yellow-500' :
                 'bg-blue-500';
  
  const icon = type === 'success' ? 'ri-check-line' : 
              type === 'error' ? 'ri-error-warning-line' : 
              type === 'warning' ? 'ri-alert-line' :
              'ri-information-line';
  
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