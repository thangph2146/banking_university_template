document.addEventListener('DOMContentLoaded', function() {
  // Lấy tất cả các button tab và nội dung tab
  const tabButtons = document.querySelectorAll('.tab-button');
  const tabContents = document.querySelectorAll('.tab-content');
  
  // Biến để lưu trữ ID sự kiện từ URL
  const urlParams = new URLSearchParams(window.location.search);
  const eventId = urlParams.get('id');
  
  // Hàm chuyển đổi tab
  function switchTab(tabId) {
    // Bỏ active tất cả các tab button
    tabButtons.forEach(button => {
      button.classList.remove('border-primary', 'text-primary');
      button.classList.add('border-transparent', 'text-gray-500');
      button.setAttribute('aria-selected', 'false');
    });
    
    // Ẩn tất cả nội dung tab
    tabContents.forEach(content => {
      content.style.opacity = '0';
      setTimeout(() => {
        if (content.id !== tabId) {
          content.classList.add('hidden');
          content.setAttribute('aria-hidden', 'true');
        }
      }, 300); // Đợi transition kết thúc
    });
    
    // Active tab hiện tại
    const currentButton = document.querySelector(`.tab-button[data-tab="${tabId}"]`);
    if (currentButton) {
      currentButton.classList.remove('border-transparent', 'text-gray-500');
      currentButton.classList.add('border-primary', 'text-primary');
      currentButton.setAttribute('aria-selected', 'true');
    }
    
    // Hiển thị nội dung tab hiện tại với animation
    const currentContent = document.getElementById(tabId);
    if (currentContent) {
      // Kiểm tra nếu tab content đang ẩn, thì hiển thị lại
      if (currentContent.classList.contains('hidden')) {
        currentContent.classList.remove('hidden');
        // Cho phép layout tính toán trước khi bắt đầu transition
        setTimeout(() => {
          currentContent.style.opacity = '1';
          currentContent.setAttribute('aria-hidden', 'false');
        }, 10);
      } else {
        currentContent.style.opacity = '1';
        currentContent.setAttribute('aria-hidden', 'false');
      }
    }
  }
  
  // Gắn sự kiện click cho các tab button
  tabButtons.forEach(button => {
    button.addEventListener('click', function() {
      const tabId = this.getAttribute('data-tab');
      switchTab(tabId);
      
      // Lưu trạng thái tab hiện tại vào localStorage
      localStorage.setItem('currentEventTab', tabId);
    });
  });
  
  // Xử lý phím tắt
  document.addEventListener('keydown', function(event) {
    // Lấy danh sách tabs
    const tabIds = Array.from(tabButtons).map(button => button.getAttribute('data-tab'));
    
    // Alt + 1-6 để chuyển đến tab tương ứng
    if (event.altKey && event.key >= '1' && event.key <= '7') {
      const index = parseInt(event.key) - 1;
      if (index < tabIds.length) {
        switchTab(tabIds[index]);
        localStorage.setItem('currentEventTab', tabIds[index]);
        event.preventDefault();
      }
    }
    
    // Alt + Tab để chuyển đến tab tiếp theo
    if (event.altKey && event.key === 'Tab') {
      const activeTabButton = document.querySelector('.tab-button[aria-selected="true"]');
      const activeTabId = activeTabButton.getAttribute('data-tab');
      const currentIndex = tabIds.indexOf(activeTabId);
      const nextIndex = (currentIndex + 1) % tabIds.length;
      switchTab(tabIds[nextIndex]);
      localStorage.setItem('currentEventTab', tabIds[nextIndex]);
      event.preventDefault();
    }
    
    // Alt + Left/Right để di chuyển giữa các tab
    if (event.altKey && (event.key === 'ArrowLeft' || event.key === 'ArrowRight')) {
      const activeTabButton = document.querySelector('.tab-button[aria-selected="true"]');
      const activeTabId = activeTabButton.getAttribute('data-tab');
      const currentIndex = tabIds.indexOf(activeTabId);
      
      let nextIndex;
      if (event.key === 'ArrowLeft') {
        nextIndex = (currentIndex - 1 + tabIds.length) % tabIds.length;
      } else {
        nextIndex = (currentIndex + 1) % tabIds.length;
      }
      
      switchTab(tabIds[nextIndex]);
      localStorage.setItem('currentEventTab', tabIds[nextIndex]);
      event.preventDefault();
    }
  });
  
  // Xử lý hiển thị/ẩn phần online dựa trên giá trị của hình thức
  const hinhThucSelect = document.getElementById('hinh_thuc');
  const onlineSection = document.getElementById('online_section');
  
  if (hinhThucSelect && onlineSection) {
    hinhThucSelect.addEventListener('change', function() {
      if (this.value === 'online' || this.value === 'hybrid') {
        onlineSection.classList.remove('hidden');
      } else {
        onlineSection.classList.add('hidden');
      }
    });
    
    // Kiểm tra giá trị ban đầu
    if (hinhThucSelect.value === 'online' || hinhThucSelect.value === 'hybrid') {
      onlineSection.classList.remove('hidden');
    }
  }
  
  // Xử lý xem trước poster
  const posterInput = document.getElementById('su_kien_poster');
  const posterPreview = document.getElementById('poster_preview');
  const posterImage = posterPreview ? posterPreview.querySelector('img') : null;
  
  if (posterInput && posterPreview && posterImage) {
    posterInput.addEventListener('change', function(e) {
      if (this.files && this.files[0]) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
          posterImage.src = e.target.result;
          posterPreview.classList.remove('hidden');
        };
        
        reader.readAsDataURL(this.files[0]);
      }
    });
  }
  
  // Hàm xóa poster
  window.removePoster = function() {
    if (posterInput && posterPreview) {
      posterInput.value = '';
      posterPreview.classList.add('hidden');
    }
  };
  
  // Xử lý lịch trình sự kiện
  const scheduleItemsContainer = document.getElementById('schedule-items');
  const addScheduleItemButton = document.getElementById('add-schedule-item');
  
  if (scheduleItemsContainer && addScheduleItemButton) {
    // Hàm cập nhật số thứ tự
    function updateItemOrder() {
      const items = scheduleItemsContainer.querySelectorAll('.schedule-item');
      items.forEach((item, index) => {
        item.querySelector('.item-order').textContent = index + 1;
      });
    }
    
    // Hàm tạo mẫu mới cho hoạt động lịch trình
    function createScheduleItem() {
      const itemCount = scheduleItemsContainer.querySelectorAll('.schedule-item').length;
      
      const tr = document.createElement('tr');
      tr.className = 'schedule-item';
      
      tr.innerHTML = `
        <td class="px-3 py-2 whitespace-nowrap">
          <span class="item-order">${itemCount + 1}</span>
        </td>
        <td class="px-3 py-2">
          <div class="flex space-x-2">
            <input type="time" name="schedule_time[]" class="w-full px-2 py-1 text-sm border border-gray-300 rounded-md">
            <span class="flex items-center">-</span>
            <input type="time" name="schedule_time_end[]" class="w-full px-2 py-1 text-sm border border-gray-300 rounded-md">
          </div>
        </td>
        <td class="px-3 py-2">
          <input type="text" name="schedule_activity[]" class="w-full px-2 py-1 text-sm border border-gray-300 rounded-md">
        </td>
        <td class="px-3 py-2">
          <input type="text" name="schedule_person[]" class="w-full px-2 py-1 text-sm border border-gray-300 rounded-md">
        </td>
        <td class="px-3 py-2 whitespace-nowrap">
          <div class="flex space-x-1">
            <button type="button" class="move-up text-gray-500 hover:text-primary p-1" title="Di chuyển lên">
              <i class="ri-arrow-up-s-line"></i>
            </button>
            <button type="button" class="move-down text-gray-500 hover:text-primary p-1" title="Di chuyển xuống">
              <i class="ri-arrow-down-s-line"></i>
            </button>
            <button type="button" class="remove-item text-gray-500 hover:text-red-500 p-1" title="Xóa">
              <i class="ri-delete-bin-line"></i>
            </button>
          </div>
        </td>
      `;
      
      return tr;
    }
    
    // Thêm hoạt động mới
    addScheduleItemButton.addEventListener('click', function() {
      const newItem = createScheduleItem();
      scheduleItemsContainer.appendChild(newItem);
      attachScheduleItemEvents(newItem);
      
      // Tạo hiệu ứng khi thêm dòng mới
      newItem.style.backgroundColor = '#f3f9ff';
      setTimeout(() => {
        newItem.style.backgroundColor = '';
        newItem.style.transition = 'background-color 0.5s';
      }, 100);
    });
    
    // Gắn sự kiện cho mục lịch trình
    function attachScheduleItemEvents(item) {
      const moveUpButton = item.querySelector('.move-up');
      const moveDownButton = item.querySelector('.move-down');
      const removeButton = item.querySelector('.remove-item');
      
      // Di chuyển lên
      moveUpButton.addEventListener('click', function() {
        const previousItem = item.previousElementSibling;
        if (previousItem) {
          scheduleItemsContainer.insertBefore(item, previousItem);
          updateItemOrder();
        }
      });
      
      // Di chuyển xuống
      moveDownButton.addEventListener('click', function() {
        const nextItem = item.nextElementSibling;
        if (nextItem) {
          scheduleItemsContainer.insertBefore(nextItem, item);
          updateItemOrder();
        }
      });
      
      // Xóa mục
      removeButton.addEventListener('click', function() {
        // Hiệu ứng khi xóa
        item.style.transition = 'opacity 0.3s, transform 0.3s';
        item.style.opacity = '0';
        item.style.transform = 'translateX(20px)';
        
        setTimeout(() => {
          scheduleItemsContainer.removeChild(item);
          updateItemOrder();
        }, 300);
      });
    }
    
    // Gắn sự kiện cho các item có sẵn
    const existingItems = scheduleItemsContainer.querySelectorAll('.schedule-item');
    existingItems.forEach(item => {
      attachScheduleItemEvents(item);
    });
  }
  
  // Khởi tạo rich text editor cho các trường mô tả
  if (typeof tinymce !== 'undefined') {
    tinymce.init({
      selector: '#chi_tiet_su_kien, #mo_ta_su_kien, #ghi_chu_lich_trinh',
      height: 300,
      menubar: true,
      plugins: [
        'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
        'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
        'insertdatetime', 'media', 'table', 'help', 'wordcount'
      ],
      toolbar: 'undo redo | blocks | ' +
        'bold italic backcolor | alignleft aligncenter ' +
        'alignright alignjustify | bullist numlist outdent indent | ' +
        'removeformat | image media link | help',
      content_style: 'body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; font-size: 16px }',
      branding: false,
      promotion: false,
      images_upload_handler: function (blobInfo, progress) {
        return new Promise((resolve, reject) => {
          // Thực hiện upload ảnh đến máy chủ
          const formData = new FormData();
          formData.append('file', blobInfo.blob(), blobInfo.filename());
          
          // Giả lập upload thành công và trả về URL ảnh
          setTimeout(() => {
            // Trong thực tế, đây sẽ là phản hồi từ API
            resolve('https://via.placeholder.com/500x300?text=Hình+ảnh+sự+kiện');
          }, 1000);
          
          // Mô phỏng tiến trình upload
          let percent = 0;
          const interval = setInterval(() => {
            percent += 10;
            progress(percent);
            if (percent >= 100) {
              clearInterval(interval);
            }
          }, 100);
        });
      },
      setup: function(editor) {
        editor.on('change', function() {
          editor.save(); // Lưu nội dung vào textarea gốc
        });
      }
    });
  }
  
  // Khởi tạo thư viện AOS cho hiệu ứng scroll
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out'
    });
  }
  
  // Đặt opacity cho tab content ban đầu
  tabContents.forEach(content => {
    if (content.id === 'basic') {
      content.style.opacity = '1';
    } else {
      content.style.opacity = '0';
    }
  });
  
  // Khôi phục tab đã chọn từ localStorage
  const savedTab = localStorage.getItem('currentEventTab');
  if (savedTab) {
    switchTab(savedTab);
  }
  
  // Xử lý tải dữ liệu nếu có ID sự kiện
  if (eventId) {
    loadEventData(eventId);
  }
  
  // Hàm tải dữ liệu sự kiện
  function loadEventData(id) {
    // Trong thực tế, đây sẽ là một API call để lấy dữ liệu sự kiện
    // Phần này giả lập dữ liệu cho mục đích demo
    
    // Giả lập loading dữ liệu
    const loadingMessage = document.createElement('div');
    loadingMessage.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    loadingMessage.innerHTML = `
      <div class="bg-white p-6 rounded-lg shadow-xl">
        <div class="flex items-center space-x-4">
          <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          <p class="text-gray-700">Đang tải dữ liệu sự kiện...</p>
        </div>
      </div>
    `;
    document.body.appendChild(loadingMessage);
    
    // Giả lập delay API
    setTimeout(() => {
      // Xóa loading message
      document.body.removeChild(loadingMessage);
      
      // Đổ dữ liệu vào form
      document.getElementById('ten_su_kien').value = 'Workshop Kỹ năng mềm 2024';
      document.getElementById('don_vi_to_chuc').value = 'Phòng Công tác Sinh viên';
      document.getElementById('don_vi_phoi_hop').value = 'Đoàn Thanh niên, Hội Sinh viên';
      document.getElementById('loai_su_kien_id').value = '3'; // Workshop
      document.getElementById('hinh_thuc').value = 'hybrid';
      
      // Trigger change event để hiển thị phần online
      const event = new Event('change');
      document.getElementById('hinh_thuc').dispatchEvent(event);
      
      // Đổ dữ liệu cho các tab khác
      document.getElementById('thoi_gian_bat_dau_su_kien').value = '2024-05-15T08:00';
      document.getElementById('thoi_gian_ket_thuc_su_kien').value = '2024-05-15T12:00';
      document.getElementById('thoi_gian_bat_dau_dang_ky').value = '2024-05-01T08:00';
      document.getElementById('thoi_gian_ket_thuc_dang_ky').value = '2024-05-14T18:00';
      
      document.getElementById('dia_diem').value = 'Hội trường A';
      document.getElementById('dia_chi_cu_the').value = 'Tầng 5, Tòa nhà A, Trường Đại học Ngân hàng TP.HCM';
      document.getElementById('link_online').value = 'https://meet.google.com/abc-defg-hij';
      
      document.getElementById('mo_ta').value = 'Workshop đào tạo kỹ năng mềm thiết yếu cho sinh viên';
      
      // Cập nhật nội dung cho TinyMCE
      if (tinymce.get('mo_ta_su_kien')) {
        tinymce.get('mo_ta_su_kien').setContent('<p>Chương trình đào tạo kỹ năng mềm cho sinh viên với các chủ đề:</p><ul><li>Kỹ năng giao tiếp hiệu quả</li><li>Kỹ năng thuyết trình</li><li>Kỹ năng làm việc nhóm</li><li>Kỹ năng quản lý thời gian</li></ul>');
      }
      
      if (tinymce.get('chi_tiet_su_kien')) {
        tinymce.get('chi_tiet_su_kien').setContent('<h3>Lịch trình chương trình</h3><p>08:00 - 08:30: Đón tiếp đại biểu</p><p>08:30 - 09:00: Khai mạc</p><p>09:00 - 10:30: Phần 1: Kỹ năng giao tiếp và thuyết trình</p><p>10:30 - 10:45: Giải lao</p><p>10:45 - 12:00: Phần 2: Kỹ năng làm việc nhóm và quản lý thời gian</p>');
      }
      
      if (tinymce.get('ghi_chu_lich_trinh')) {
        tinymce.get('ghi_chu_lich_trinh').setContent('<p>Chương trình có thể thay đổi tùy theo điều kiện thực tế và sẽ được thông báo trước.</p>');
      }
      
      // Thêm các mục lịch trình (có thể thêm API riêng để lấy dữ liệu lịch trình)
      // Ở đây chỉ dùng dữ liệu đã có sẵn từ HTML
      
      // Hiển thị thông báo thành công
      showToast('Tải dữ liệu sự kiện thành công!', 'success');
    }, 1500);
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
  // --- End Mobile Sidebar Toggle ---
});
