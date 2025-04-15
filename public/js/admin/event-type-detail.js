document.addEventListener('DOMContentLoaded', function() {
  // Biến để lưu trữ ID loại sự kiện từ URL
  const urlParams = new URLSearchParams(window.location.search);
  const eventTypeId = urlParams.get('id');
  
  // Tham chiếu các nút thao tác
  const backBtn = document.getElementById('back-btn');
  const editBtn = document.getElementById('edit-btn');
  const saveBtn = document.getElementById('save-btn');
  const cancelBtn = document.getElementById('cancel-btn');
  const deleteBtn = document.getElementById('delete-btn');

  // Tham chiếu tới form và các trường dữ liệu
  const eventTypeForm = document.getElementById('event-type-form');
  const eventTypeNameInput = document.getElementById('ten_loai_su_kien');
  const eventTypeCodeInput = document.getElementById('ma_loai_su_kien');
  const eventTypeStatusInput = document.getElementById('status');

  // Tham chiếu đến loading overlay
  const loadingOverlay = document.getElementById('loading-overlay');
  
  // Khai báo các biến toàn cục
  let isEditing = false;
  let originalFormData = {};
  let eventTypeData = null;
  
  // Gắn sự kiện cho các nút
  if (backBtn) backBtn.addEventListener('click', () => window.location.href = 'event-types.html');
  if (editBtn) editBtn.addEventListener('click', enableFormEditing);
  if (saveBtn) saveBtn.addEventListener('click', saveEventTypeData);
  if (cancelBtn) cancelBtn.addEventListener('click', cancelEditing);
  if (deleteBtn) deleteBtn.addEventListener('click', confirmDeleteEventType);
  if (eventTypeForm) eventTypeForm.addEventListener('submit', handleFormSubmit);

  // Hàm xử lý form submit
  function handleFormSubmit(e) {
    e.preventDefault();
    saveEventTypeData();
  }

  // Hàm bật chế độ chỉnh sửa form
  function enableFormEditing() {
    isEditing = true;
    
    // Lưu dữ liệu ban đầu để khôi phục nếu hủy
    if (eventTypeNameInput && eventTypeCodeInput && eventTypeStatusInput) {
      originalFormData = {
        tenLoaiSuKien: eventTypeNameInput.value,
        maLoaiSuKien: eventTypeCodeInput.value,
        status: eventTypeStatusInput.checked
      };
    }
    
    // Bật các trường input
    const formInputs = document.querySelectorAll('#event-type-form input, #event-type-form select');
    formInputs.forEach(input => {
      input.disabled = false;
    });
    
    // Hiển thị nút lưu và hủy, ẩn nút chỉnh sửa và xóa
    if (editBtn) editBtn.classList.add('hidden');
    if (saveBtn) saveBtn.classList.remove('hidden');
    if (cancelBtn) cancelBtn.classList.remove('hidden');
    if (deleteBtn) deleteBtn.classList.add('hidden');
    
    // Hiển thị thông báo
    showNotification('Bạn đang trong chế độ chỉnh sửa', 'info');
    
    // Focus vào trường đầu tiên
    if (eventTypeNameInput) eventTypeNameInput.focus();
  }
  
  // Hàm hủy chỉnh sửa
  function cancelEditing() {
    isEditing = false;
    
    // Khôi phục dữ liệu ban đầu
    if (eventTypeNameInput && eventTypeCodeInput && eventTypeStatusInput) {
      eventTypeNameInput.value = originalFormData.tenLoaiSuKien;
      eventTypeCodeInput.value = originalFormData.maLoaiSuKien;
      eventTypeStatusInput.checked = originalFormData.status;
    }
    
    // Vô hiệu hóa các trường input
    const formInputs = document.querySelectorAll('#event-type-form input, #event-type-form select');
    formInputs.forEach(input => {
      input.disabled = true;
    });
    
    // Hiện nút chỉnh sửa và xóa, ẩn nút lưu và hủy
    if (editBtn) editBtn.classList.remove('hidden');
    if (saveBtn) saveBtn.classList.add('hidden');
    if (cancelBtn) cancelBtn.classList.add('hidden');
    if (deleteBtn && eventTypeId) deleteBtn.classList.remove('hidden');
    
    showNotification('Đã hủy chỉnh sửa', 'info');
  }
  
  // Hàm xác nhận xóa loại sự kiện
  function confirmDeleteEventType() {
    if (!eventTypeId) return;
    
    // Hiển thị modal xác nhận xóa
    const confirmModal = document.getElementById('confirm-delete-modal');
    const confirmButton = document.getElementById('confirm-delete-btn');
    const cancelDeleteButton = document.getElementById('cancel-delete-btn');
    
    if (confirmModal) {
      confirmModal.classList.remove('hidden');
      
      // Xử lý nút xác nhận xóa
      if (confirmButton) {
        // Xóa event listener cũ nếu có
        const newConfirmButton = confirmButton.cloneNode(true);
        confirmButton.parentNode.replaceChild(newConfirmButton, confirmButton);
        
        // Thêm event listener mới
        newConfirmButton.addEventListener('click', () => {
          deleteEventType();
          confirmModal.classList.add('hidden');
        });
      }
      
      // Xử lý nút hủy xóa
      if (cancelDeleteButton) {
        cancelDeleteButton.addEventListener('click', () => {
          confirmModal.classList.add('hidden');
        });
      }
    }
  }
  
  // Hàm xóa loại sự kiện
  function deleteEventType() {
    if (!eventTypeId) return;
    
    // Hiển thị loading overlay
    if (loadingOverlay) loadingOverlay.style.display = 'flex';
    
    // Giả lập API call để xóa loại sự kiện
    setTimeout(() => {
      if (loadingOverlay) loadingOverlay.style.display = 'none';
      showNotification('Đã xóa loại sự kiện thành công', 'success');
      
      // Chuyển về trang danh sách sau khi xóa
      setTimeout(() => {
        window.location.href = 'event-types.html';
      }, 1500);
    }, 1000);
  }
  
  // Hàm lưu dữ liệu loại sự kiện
  function saveEventTypeData() {
    // Kiểm tra validate form
    if (!validateEventTypeForm()) {
      return;
    }
    
    // Hiển thị loading overlay
    if (loadingOverlay) loadingOverlay.style.display = 'flex';
    
    // Lấy dữ liệu từ form
    const formData = {
      loai_su_kien_id: eventTypeId || null,
      ten_loai_su_kien: eventTypeNameInput ? eventTypeNameInput.value.trim() : '',
      ma_loai_su_kien: eventTypeCodeInput ? eventTypeCodeInput.value.trim() : '',
      status: eventTypeStatusInput ? (eventTypeStatusInput.checked ? 1 : 0) : 1
    };
    
    // Giả lập API call để lưu dữ liệu
    setTimeout(() => {
      if (loadingOverlay) loadingOverlay.style.display = 'none';
      
      // Cập nhật UI về trạng thái xem
      isEditing = false;
      if (editBtn) editBtn.classList.remove('hidden');
      if (saveBtn) saveBtn.classList.add('hidden');
      if (cancelBtn) cancelBtn.classList.add('hidden');
      if (deleteBtn && eventTypeId) deleteBtn.classList.remove('hidden');
      
      // Vô hiệu hóa các trường input
      const formInputs = document.querySelectorAll('#event-type-form input, #event-type-form select');
      formInputs.forEach(input => {
        input.disabled = true;
      });
      
      // Hiển thị thông báo thành công
      if (eventTypeId) {
        showNotification('Đã cập nhật loại sự kiện thành công', 'success');
      } else {
        // Nếu là tạo mới, chuyển sang trang có ID
        const newId = Math.floor(Math.random() * 1000) + 1; // Giả lập ID mới
        showNotification('Đã tạo loại sự kiện thành công', 'success');
        
        setTimeout(() => {
          window.location.href = `event-type-detail.html?id=${newId}`;
        }, 1500);
      }
    }, 1000);
  }
  
  // Hàm validate form
  function validateEventTypeForm() {
    let isValid = true;
    
    // Kiểm tra tên loại sự kiện
    if (eventTypeNameInput && !eventTypeNameInput.value.trim()) {
      showFieldError(eventTypeNameInput, 'Vui lòng nhập tên loại sự kiện');
      isValid = false;
    } else if (eventTypeNameInput) {
      clearFieldError(eventTypeNameInput);
    }
    
    // Kiểm tra mã loại sự kiện (không bắt buộc, nhưng nếu có thì phải đúng định dạng)
    if (eventTypeCodeInput && eventTypeCodeInput.value.trim()) {
      const regex = /^[a-zA-Z0-9_]+$/;
      if (!regex.test(eventTypeCodeInput.value.trim())) {
        showFieldError(eventTypeCodeInput, 'Mã loại sự kiện chỉ được chứa chữ cái không dấu, số và dấu gạch dưới');
        isValid = false;
      } else {
        clearFieldError(eventTypeCodeInput);
      }
    }
    
    return isValid;
  }
  
  // Hàm hiển thị lỗi trường dữ liệu
  function showFieldError(field, message) {
    const errorElement = field.parentElement.querySelector('.error-message');
    
    if (errorElement) {
      errorElement.textContent = message;
      errorElement.classList.remove('hidden');
    } else {
      const newError = document.createElement('div');
      newError.className = 'error-message text-red-500 text-sm mt-1';
      newError.textContent = message;
      field.parentElement.appendChild(newError);
    }
    
    field.classList.add('border-red-500');
  }
  
  // Hàm xóa lỗi trường dữ liệu
  function clearFieldError(field) {
    const errorElement = field.parentElement.querySelector('.error-message');
    
    if (errorElement) {
      errorElement.classList.add('hidden');
    }
    
    field.classList.remove('border-red-500');
  }
  
  // Hàm tải dữ liệu loại sự kiện
  function loadEventTypeData(id) {
    // Hiển thị loading overlay
    if (loadingOverlay) loadingOverlay.style.display = 'flex';
    
    // Giả lập API call để lấy dữ liệu
    setTimeout(() => {
      // Giả lập dữ liệu
      const dummyData = {
        loai_su_kien_id: id,
        ten_loai_su_kien: 'Hội thảo khoa học',
        ma_loai_su_kien: 'HTKHCN',
        status: 1,
        created_at: '2023-10-01 08:00:00',
        updated_at: '2023-10-15 10:30:00'
      };
      
      // Đổ dữ liệu vào form
      if (eventTypeNameInput) eventTypeNameInput.value = dummyData.ten_loai_su_kien;
      if (eventTypeCodeInput) eventTypeCodeInput.value = dummyData.ma_loai_su_kien;
      if (eventTypeStatusInput) eventTypeStatusInput.checked = dummyData.status === 1;
      
      // Hiển thị thời gian tạo/cập nhật
      const createdAtElement = document.getElementById('created-at');
      const updatedAtElement = document.getElementById('updated-at');
      
      if (createdAtElement) {
        createdAtElement.textContent = formatDateTime(dummyData.created_at);
      }
      
      if (updatedAtElement) {
        updatedAtElement.textContent = formatDateTime(dummyData.updated_at);
      }
      
      // Vô hiệu hóa các trường form
      const formInputs = document.querySelectorAll('#event-type-form input, #event-type-form select');
      formInputs.forEach(input => {
        input.disabled = true;
      });
      
      // Ẩn loading overlay
      if (loadingOverlay) loadingOverlay.style.display = 'none';
      
      // Cập nhật tiêu đề trang
      document.title = `Chi tiết loại sự kiện: ${dummyData.ten_loai_su_kien}`;
      
      // Hiển thị nút chỉnh sửa và xóa, ẩn nút lưu và hủy
      if (editBtn) editBtn.classList.remove('hidden');
      if (saveBtn) saveBtn.classList.add('hidden');
      if (cancelBtn) cancelBtn.classList.add('hidden');
      if (deleteBtn) deleteBtn.classList.remove('hidden');
      
      // Hiển thị sự kiện theo loại
      loadEventsByType(id);
    }, 1000);
  }
  
  // Hàm tải danh sách sự kiện theo loại
  function loadEventsByType(typeId) {
    const eventsContainer = document.getElementById('events-list');
    if (!eventsContainer) return;
    
    // Giả lập danh sách sự kiện thuộc loại đang xem
    const dummyEvents = [
      {
        su_kien_id: 101,
        ten_su_kien: 'Hội thảo khoa học về Trí tuệ nhân tạo',
        thoi_gian_bat_dau_su_kien: '2023-11-01 08:00:00',
        thoi_gian_ket_thuc_su_kien: '2023-11-01 12:00:00',
        don_vi_to_chuc: 'Khoa Công nghệ thông tin',
        hinh_thuc: 'hybrid',
        tong_dang_ky: 120,
        tong_check_in: 98
      },
      {
        su_kien_id: 102,
        ten_su_kien: 'Hội thảo nghiên cứu khoa học sinh viên 2023',
        thoi_gian_bat_dau_su_kien: '2023-12-15 13:30:00',
        thoi_gian_ket_thuc_su_kien: '2023-12-15 17:00:00',
        don_vi_to_chuc: 'Phòng Khoa học Công nghệ',
        hinh_thuc: 'offline',
        tong_dang_ky: 85,
        tong_check_in: 72
      }
    ];
    
    // Tạo bảng sự kiện
    let htmlContent = '';
    
    if (dummyEvents.length > 0) {
      htmlContent = `
        <div class="overflow-x-auto">
          <table class="min-w-full bg-white border rounded-lg">
            <thead>
              <tr class="bg-gray-100 text-gray-700">
                <th class="py-2 px-4 border-b">Tên sự kiện</th>
                <th class="py-2 px-4 border-b">Thời gian</th>
                <th class="py-2 px-4 border-b">Đơn vị tổ chức</th>
                <th class="py-2 px-4 border-b">Hình thức</th>
                <th class="py-2 px-4 border-b">Số người tham gia</th>
                <th class="py-2 px-4 border-b">Thao tác</th>
              </tr>
            </thead>
            <tbody>
      `;
      
      dummyEvents.forEach(event => {
        htmlContent += `
          <tr class="hover:bg-gray-50 border-b">
            <td class="py-2 px-4">${event.ten_su_kien}</td>
            <td class="py-2 px-4">${formatDate(event.thoi_gian_bat_dau_su_kien)}</td>
            <td class="py-2 px-4">${event.don_vi_to_chuc}</td>
            <td class="py-2 px-4">
              <span class="px-2 py-1 rounded-full text-xs ${
                event.hinh_thuc === 'online' ? 'bg-blue-100 text-blue-800' : 
                event.hinh_thuc === 'offline' ? 'bg-green-100 text-green-800' : 
                'bg-purple-100 text-purple-800'
              }">
                ${
                  event.hinh_thuc === 'online' ? 'Trực tuyến' : 
                  event.hinh_thuc === 'offline' ? 'Trực tiếp' : 
                  'Kết hợp'
                }
              </span>
            </td>
            <td class="py-2 px-4">
              <div class="flex flex-col">
                <span>Đăng ký: ${event.tong_dang_ky}</span>
                <span>Tham dự: ${event.tong_check_in}</span>
              </div>
            </td>
            <td class="py-2 px-4">
              <a href="event-detail.html?id=${event.su_kien_id}" class="text-primary hover:underline">Xem chi tiết</a>
            </td>
          </tr>
        `;
      });
      
      htmlContent += `
            </tbody>
          </table>
        </div>
      `;
    } else {
      htmlContent = `
        <div class="p-4 text-center text-gray-500">
          <div class="mb-3">
            <i class="ri-file-list-3-line text-4xl"></i>
          </div>
          <p>Chưa có sự kiện nào thuộc loại này</p>
        </div>
      `;
    }
    
    eventsContainer.innerHTML = htmlContent;
  }
  
  // Hiển thị thông báo
  function showNotification(message, type = 'info') {
    const toast = document.createElement('div');
    const icon = type === 'success' ? 'ri-check-line' : 
                type === 'error' ? 'ri-error-warning-line' : 
                'ri-information-line';
    
    const bgColor = type === 'success' ? 'bg-green-500' : 
                   type === 'error' ? 'bg-red-500' : 
                   'bg-blue-500';
    
    toast.className = `fixed bottom-4 right-4 z-50 flex items-center p-4 ${bgColor} text-white rounded-lg shadow-lg transform transition-all duration-500 opacity-0 translate-y-2`;
    toast.innerHTML = `
      <i class="${icon} mr-2 text-xl"></i>
      <span>${message}</span>
    `;
    
    document.body.appendChild(toast);
    
    // Hiển thị toast với animation
    setTimeout(() => {
      toast.classList.remove('opacity-0', 'translate-y-2');
    }, 10);
    
    // Ẩn toast sau 3 giây
    setTimeout(() => {
      toast.classList.add('opacity-0', 'translate-y-2');
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 500);
    }, 3000);
  }
  
  // Hàm format ngày giờ
  function formatDateTime(dateTimeStr) {
    const date = new Date(dateTimeStr);
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(date);
  }
  
  // Hàm format ngày
  function formatDate(dateTimeStr) {
    const date = new Date(dateTimeStr);
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  }

  // Khởi tạo AOS Animation
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true
    });
  }

  // Xử lý khi có ID loại sự kiện
  if (eventTypeId) {
    loadEventTypeData(eventTypeId);
  } else {
    // Trường hợp tạo mới
    enableFormEditing();
    
    // Cập nhật giao diện cho chế độ tạo mới
    document.title = 'Tạo mới loại sự kiện';
    const pageTitle = document.querySelector('h1');
    if (pageTitle) pageTitle.textContent = 'Tạo mới loại sự kiện';
    
    if (deleteBtn) deleteBtn.classList.add('hidden');

    // Ẩn loading overlay
    if (loadingOverlay) loadingOverlay.style.display = 'none';

    // Ẩn phần danh sách sự kiện vì đây là loại sự kiện mới
    const eventsSection = document.querySelector('.bg-white:last-child');
    if (eventsSection) eventsSection.classList.add('hidden');
  }
}); 