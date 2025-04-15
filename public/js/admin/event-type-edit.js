document.addEventListener('DOMContentLoaded', function() {
  // Biến để lưu trữ ID loại sự kiện từ URL
  const urlParams = new URLSearchParams(window.location.search);
  const eventTypeId = urlParams.get('id');
  
  // Khai báo các biến và tham chiếu cần thiết
  const form = document.getElementById('event-type-form');
  const backBtn = document.getElementById('back-btn');
  const saveBtn = document.getElementById('save-btn');
  const cancelBtn = document.getElementById('cancel-btn');
  
  // Tham chiếu đến các trường dữ liệu
  const tenLoaiSuKienInput = document.getElementById('ten_loai_su_kien');
  const maLoaiSuKienInput = document.getElementById('ma_loai_su_kien');
  const statusSelect = document.getElementById('status');
  
  // Lưu trữ dữ liệu ban đầu để khôi phục nếu hủy
  let originalFormData = {};
  
  // Khởi tạo form submit
  function initFormSubmit() {
    if (form) {
      form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Kiểm tra dữ liệu trước khi submit
        if (!validateForm()) {
          return;
        }
        
        // Hiển thị loading
        showLoading('Đang lưu dữ liệu...');
        
        // Dữ liệu để gửi lên server
        const data = {
          loai_su_kien_id: eventTypeId || null,
          ten_loai_su_kien: tenLoaiSuKienInput.value.trim(),
          ma_loai_su_kien: maLoaiSuKienInput.value.trim(),
          status: statusSelect.value
        };
        
        console.log('Dữ liệu gửi lên server:', data);
        
        // Mô phỏng API call để lưu dữ liệu
        setTimeout(() => {
          hideLoading();
          
          // Giả lập thành công
          showToast('Cập nhật loại sự kiện thành công!', 'success');
          
          // Chuyển về trang danh sách sau 1 giây
          setTimeout(() => {
            window.location.href = 'event-types.html';
          }, 1000);
        }, 1000);
      });
    }
    
    // Gắn sự kiện cho nút hủy
    if (cancelBtn) {
      cancelBtn.addEventListener('click', function() {
        // Khôi phục dữ liệu gốc
        tenLoaiSuKienInput.value = originalFormData.ten_loai_su_kien || '';
        maLoaiSuKienInput.value = originalFormData.ma_loai_su_kien || '';
        statusSelect.value = originalFormData.status || '1';
        
        // Thông báo đã hủy
        showToast('Đã hủy thay đổi', 'info');
      });
    }
    
    // Gắn sự kiện cho nút quay lại
    if (backBtn) {
      backBtn.addEventListener('click', function() {
        window.location.href = 'event-types.html';
      });
    }
  }
  
  // Hàm kiểm tra dữ liệu form
  function validateForm() {
    let isValid = true;
    
    // Kiểm tra tên loại sự kiện
    if (!tenLoaiSuKienInput.value.trim()) {
      showFieldError(tenLoaiSuKienInput, 'Vui lòng nhập tên loại sự kiện');
      isValid = false;
    } else {
      clearFieldError(tenLoaiSuKienInput);
    }
    
    // Kiểm tra mã loại sự kiện (không bắt buộc)
    if (maLoaiSuKienInput.value.trim()) {
      // Kiểm tra định dạng mã: chỉ chữ cái, số và gạch dưới, không dấu, không khoảng trắng
      const regex = /^[a-zA-Z0-9_]+$/;
      if (!regex.test(maLoaiSuKienInput.value.trim())) {
        showFieldError(maLoaiSuKienInput, 'Mã loại sự kiện chỉ được chứa chữ cái không dấu, số và dấu gạch dưới');
        isValid = false;
      } else {
        clearFieldError(maLoaiSuKienInput);
      }
    } else {
      clearFieldError(maLoaiSuKienInput);
    }
    
    return isValid;
  }
  
  // Hàm hiển thị lỗi cho trường dữ liệu
  function showFieldError(field, message) {
    let errorElement = field.parentElement.querySelector('.error-message');
    
    if (!errorElement) {
      errorElement = document.createElement('div');
      errorElement.className = 'error-message text-red-500 text-sm mt-1';
      field.parentElement.appendChild(errorElement);
    }
    
    errorElement.textContent = message;
    field.classList.add('border-red-500');
  }
  
  // Hàm xóa lỗi cho trường dữ liệu
  function clearFieldError(field) {
    const errorElement = field.parentElement.querySelector('.error-message');
    
    if (errorElement) {
      errorElement.textContent = '';
    }
    
    field.classList.remove('border-red-500');
  }
  
  // Tải dữ liệu loại sự kiện
  function loadEventTypeData(id) {
    // Giả lập loading dữ liệu
    showLoading('Đang tải dữ liệu...');
    
    // Trong thực tế, đây sẽ là một API call để lấy dữ liệu loại sự kiện
    // Giả lập delay API
    setTimeout(() => {
      try {
        // Dữ liệu giả lập từ API
        const data = {
          loai_su_kien_id: id,
          ten_loai_su_kien: 'Hội thảo',
          ma_loai_su_kien: 'HOITHAO',
          status: 1
        };
        
        // Đổ dữ liệu vào form
        tenLoaiSuKienInput.value = data.ten_loai_su_kien;
        maLoaiSuKienInput.value = data.ma_loai_su_kien;
        statusSelect.value = data.status;
        
        // Lưu dữ liệu gốc
        originalFormData = { ...data };
        
        hideLoading();
        
        // Hiển thị thông báo thành công
        showToast('Tải dữ liệu loại sự kiện thành công!', 'success');
      } catch (error) {
        hideLoading();
        showToast('Có lỗi xảy ra khi tải dữ liệu: ' + error.message, 'error');
      }
    }, 1000);
  }
  
  // Hiển thị loading
  function showLoading(message) {
    const loadingElement = document.createElement('div');
    loadingElement.id = 'loading-overlay';
    loadingElement.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    loadingElement.innerHTML = `
      <div class="bg-white p-6 rounded-lg shadow-xl">
        <div class="flex items-center space-x-4">
          <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          <p class="text-gray-700">${message}</p>
        </div>
      </div>
    `;
    document.body.appendChild(loadingElement);
  }
  
  // Ẩn loading
  function hideLoading() {
    const loadingElement = document.getElementById('loading-overlay');
    if (loadingElement) {
      document.body.removeChild(loadingElement);
    }
  }
  
  // Hiển thị thông báo
  function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in ${type === 'success' ? 'bg-green-500 text-white' : type === 'error' ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'}`;
    toast.innerHTML = `
      <div class="flex items-center space-x-2">
        <i class="${type === 'success' ? 'ri-checkbox-circle-line' : type === 'error' ? 'ri-error-warning-line' : 'ri-information-line'} text-xl"></i>
        <p>${message}</p>
      </div>
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.classList.remove('animate-fade-in');
      toast.classList.add('animate-fade-out');
      
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 300);
    }, 3000);
  }

  // --- Mobile Sidebar Toggle ---
  function initMobileSidebar() {
    const sidebar = document.getElementById('sidebar');
    const sidebarOpenBtn = document.getElementById('sidebar-open');
    const sidebarCloseBtn = document.getElementById('sidebar-close');
    const sidebarBackdrop = document.getElementById('sidebar-backdrop');

    function openSidebar() {
      if (sidebar && sidebarBackdrop) {
        sidebar.classList.remove('-translate-x-full');
        sidebarBackdrop.classList.remove('hidden');
        sidebarBackdrop.classList.add('opacity-100'); // Fade in backdrop
      }
    }

    function closeSidebar() {
      if (sidebar && sidebarBackdrop) {
        sidebar.classList.add('-translate-x-full');
        sidebarBackdrop.classList.add('hidden');
        sidebarBackdrop.classList.remove('opacity-100'); // Fade out backdrop
      }
    }

    if (sidebarOpenBtn) sidebarOpenBtn.addEventListener('click', openSidebar);
    if (sidebarCloseBtn) sidebarCloseBtn.addEventListener('click', closeSidebar);
    if (sidebarBackdrop) sidebarBackdrop.addEventListener('click', closeSidebar);
  }
  
  // --- Khởi tạo AOS Animation ---
  function initAOS() {
    if (typeof AOS !== 'undefined') {
      AOS.init({
        duration: 800,
        easing: 'ease-in-out'
      });
    }
  }
  
  // Khởi tạo ứng dụng
  function initApp() {
    initFormSubmit();
    initMobileSidebar();
    initAOS();
    
    // Xử lý tải dữ liệu nếu có ID loại sự kiện
    if (eventTypeId) {
      loadEventTypeData(eventTypeId);
    } else {
      // Nếu là tạo mới, lưu trạng thái ban đầu của form
      originalFormData = {
        ten_loai_su_kien: '',
        ma_loai_su_kien: '',
        status: '1'
      };
    }
  }
  
  // Chạy hàm khởi tạo
  initApp();
}); 