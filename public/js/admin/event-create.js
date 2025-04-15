/**
 * Quản lý trang tạo sự kiện mới
 */

// Hàm khởi tạo khi tài liệu đã sẵn sàng
document.addEventListener('DOMContentLoaded', () => {
  // Khởi tạo hiệu ứng AOS
  AOS.init();
  
  // Khởi tạo trình soạn thảo TinyMCE
  initTinyMCE();
  
  // Quản lý tabs
  initTabNavigation();
  
  // Quản lý lịch trình
  initScheduleManagement();
  
  // Quản lý Poster
  initPosterUpload();
  
  // Xử lý hiển thị mục online khi thay đổi hình thức
  initFormatDependencies();
  
  // Xử lý form
  initFormHandling();
  
  // Phím tắt
  initKeyboardShortcuts();
  
  // Sidebar
  initSidebar();
});

/**
 * Khởi tạo trình soạn thảo TinyMCE
 */
const initTinyMCE = () => {
  tinymce.init({
    selector: '#chi_tiet_su_kien, #mo_ta_su_kien',
    height: 300,
    menubar: false,
    plugins: 'lists link image charmap preview anchor searchreplace visualblocks code fullscreen insertdatetime media table emoticons',
    toolbar: 'undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help',
    content_style: 'body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; font-size: 16px; }'
  });
};

/**
 * Quản lý tabs và chuyển đổi tab
 */
const initTabNavigation = () => {
  const tabButtons = document.querySelectorAll('.tab-button');
  const tabContents = document.querySelectorAll('.tab-content');
  
  // Hàm chuyển tab
  const switchTab = (tabId) => {
    // Ẩn tất cả tab content
    tabContents.forEach(content => {
      content.classList.add('hidden');
      content.setAttribute('aria-hidden', 'true');
    });
    
    // Bỏ chọn tất cả tab buttons
    tabButtons.forEach(btn => {
      btn.classList.remove('border-primary', 'text-primary');
      btn.classList.add('border-transparent', 'text-gray-500');
      btn.setAttribute('aria-selected', 'false');
    });
    
    // Hiển thị tab content được chọn
    const selectedContent = document.getElementById(tabId);
    if (selectedContent) {
      selectedContent.classList.remove('hidden');
      selectedContent.setAttribute('aria-hidden', 'false');
    }
    
    // Style cho tab button được chọn
    const activeTabButton = document.querySelector(`.tab-button[data-tab="${tabId}"]`);
    if (activeTabButton) {
      activeTabButton.classList.remove('border-transparent', 'text-gray-500');
      activeTabButton.classList.add('border-primary', 'text-primary');
      activeTabButton.setAttribute('aria-selected', 'true');
    }
  };
  
  // Đăng ký sự kiện cho các tab button
  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const tabId = button.getAttribute('data-tab');
      switchTab(tabId);
    });
  });
  
  // Chức năng chuyển tab bằng phím tắt
  const switchTabByIndex = (index) => {
    if (index >= 0 && index < tabButtons.length) {
      const tabId = tabButtons[index].getAttribute('data-tab');
      switchTab(tabId);
    }
  };
  
  // Chuyển đến tab tiếp theo
  const switchToNextTab = () => {
    const activeTabIndex = Array.from(tabButtons).findIndex(
      tab => tab.getAttribute('aria-selected') === 'true'
    );
    const nextTabIndex = (activeTabIndex + 1) % tabButtons.length;
    switchTabByIndex(nextTabIndex);
  };
  
  // Chuyển đến tab trước đó
  const switchToPrevTab = () => {
    const activeTabIndex = Array.from(tabButtons).findIndex(
      tab => tab.getAttribute('aria-selected') === 'true'
    );
    const prevTabIndex = (activeTabIndex - 1 + tabButtons.length) % tabButtons.length;
    switchTabByIndex(prevTabIndex);
  };
  
  // Thêm sự kiện phím tắt cho điều hướng tab
  window.addEventListener('keydown', (e) => {
    // Alt + Tab chuyển đến tab tiếp theo
    if (e.altKey && e.key === 'Tab') {
      e.preventDefault();
      switchToNextTab();
    }
    
    // Alt + Arrow Right chuyển đến tab tiếp theo
    if (e.altKey && e.key === 'ArrowRight') {
      e.preventDefault();
      switchToNextTab();
    }
    
    // Alt + Arrow Left chuyển đến tab trước đó
    if (e.altKey && e.key === 'ArrowLeft') {
      e.preventDefault();
      switchToPrevTab();
    }
    
    // Alt + 1-7 để chuyển đến tab tương ứng
    if (e.altKey && e.key >= '1' && e.key <= '7') {
      e.preventDefault();
      const tabIndex = parseInt(e.key) - 1;
      switchTabByIndex(tabIndex);
    }
  });
};

/**
 * Quản lý lịch trình sự kiện
 */
const initScheduleManagement = () => {
  const scheduleItems = document.getElementById('schedule-items');
  const addScheduleBtn = document.getElementById('add-schedule-item');
  
  // Cập nhật STT
  const updateItemOrders = () => {
    const items = scheduleItems.querySelectorAll('.schedule-item');
    items.forEach((item, index) => {
      item.querySelector('.item-order').textContent = index + 1;
    });
  };
  
  // Thêm hoạt động mới
  addScheduleBtn.addEventListener('click', () => {
    const newRow = document.createElement('tr');
    newRow.className = 'schedule-item';
    
    const currentTime = new Date();
    const hours = currentTime.getHours().toString().padStart(2, '0');
    const minutes = currentTime.getMinutes().toString().padStart(2, '0');
    const endHours = (currentTime.getHours() + 1).toString().padStart(2, '0');
    
    newRow.innerHTML = `
      <td class="px-3 py-2 whitespace-nowrap">
        <span class="item-order">${scheduleItems.querySelectorAll('.schedule-item').length + 1}</span>
      </td>
      <td class="px-3 py-2">
        <div class="flex space-x-2">
          <input type="time" name="schedule_time[]" class="w-full px-2 py-1 text-sm border border-gray-300 rounded-md" value="${hours}:${minutes}">
          <span class="flex items-center">-</span>
          <input type="time" name="schedule_time_end[]" class="w-full px-2 py-1 text-sm border border-gray-300 rounded-md" value="${endHours}:${minutes}">
        </div>
      </td>
      <td class="px-3 py-2">
        <input type="text" name="schedule_activity[]" class="w-full px-2 py-1 text-sm border border-gray-300 rounded-md" placeholder="Tên hoạt động">
      </td>
      <td class="px-3 py-2">
        <input type="text" name="schedule_person[]" class="w-full px-2 py-1 text-sm border border-gray-300 rounded-md" placeholder="Người phụ trách">
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
    
    scheduleItems.appendChild(newRow);
    updateItemOrders();
    
    // Đăng ký sự kiện cho nút mới
    registerScheduleItemEvents(newRow);
  });
  
  // Đăng ký sự kiện cho nút di chuyển và xoá
  const registerScheduleItemEvents = (item) => {
    const moveUpBtn = item.querySelector('.move-up');
    const moveDownBtn = item.querySelector('.move-down');
    const removeBtn = item.querySelector('.remove-item');
    
    moveUpBtn.addEventListener('click', () => {
      const prevItem = item.previousElementSibling;
      if (prevItem) {
        scheduleItems.insertBefore(item, prevItem);
        updateItemOrders();
      }
    });
    
    moveDownBtn.addEventListener('click', () => {
      const nextItem = item.nextElementSibling;
      if (nextItem) {
        scheduleItems.insertBefore(nextItem, item);
        updateItemOrders();
      }
    });
    
    removeBtn.addEventListener('click', () => {
      if (confirm('Bạn có chắc chắn muốn xóa hoạt động này?')) {
        item.remove();
        updateItemOrders();
      }
    });
  };
  
  // Đăng ký sự kiện cho các mục ban đầu
  document.querySelectorAll('.schedule-item').forEach(item => {
    registerScheduleItemEvents(item);
  });
};

/**
 * Quản lý upload ảnh poster
 */
const initPosterUpload = () => {
  const posterInput = document.getElementById('su_kien_poster');
  const posterPreview = document.getElementById('poster_preview');
  
  posterInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        posterPreview.classList.remove('hidden');
        posterPreview.querySelector('img').src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  });
  
  // Xóa poster
  window.removePoster = () => {
    posterInput.value = '';
    posterPreview.classList.add('hidden');
    posterPreview.querySelector('img').src = '';
  };
  
  // Xử lý kéo thả
  const dropZone = document.querySelector('.border-dashed');
  
  dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('border-primary');
  });
  
  dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('border-primary');
  });
  
  dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('border-primary');
    
    if (e.dataTransfer.files.length) {
      posterInput.files = e.dataTransfer.files;
      const event = new Event('change', { bubbles: true });
      posterInput.dispatchEvent(event);
    }
  });
};

/**
 * Xử lý phụ thuộc khi thay đổi hình thức tổ chức
 */
const initFormatDependencies = () => {
  const formatSelect = document.getElementById('hinh_thuc');
  const onlineSection = document.getElementById('online_section');
  
  const updateOnlineSection = () => {
    const format = formatSelect.value;
    if (format === 'online' || format === 'hybrid') {
      onlineSection.classList.remove('hidden');
    } else {
      onlineSection.classList.add('hidden');
    }
  };
  
  formatSelect.addEventListener('change', updateOnlineSection);
  
  // Khởi tạo trạng thái ban đầu
  updateOnlineSection();
};

/**
 * Xử lý gửi form
 */
const initFormHandling = () => {
  const eventForm = document.getElementById('event-form');
  
  eventForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Cập nhật dữ liệu từ TinyMCE
    if (tinymce.get('chi_tiet_su_kien')) {
      tinymce.get('chi_tiet_su_kien').save();
    }
    if (tinymce.get('mo_ta_su_kien')) {
      tinymce.get('mo_ta_su_kien').save();
    }
    
    // Kiểm tra các trường bắt buộc
    const requiredFields = eventForm.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
      if (!field.value.trim()) {
        field.classList.add('border-red-500');
        isValid = false;
      } else {
        field.classList.remove('border-red-500');
      }
    });
    
    if (!isValid) {
      showMessage('Vui lòng điền đầy đủ thông tin bắt buộc', 'error');
      return;
    }
    
    // Xử lý gửi form (thường là gửi AJAX)
    showMessage('Đang tạo sự kiện...', 'info');
    
    // Giả lập API call
    setTimeout(() => {
      showMessage('Tạo sự kiện thành công!', 'success');
      
      // Chuyển hướng sau 1.5 giây
      setTimeout(() => {
        window.location.href = 'events.html';
      }, 1500);
    }, 1000);
  });
};

/**
 * Hiển thị thông báo
 */
const showMessage = (message, type = 'info') => {
  const existingToast = document.querySelector('.toast-notification');
  if (existingToast) {
    existingToast.remove();
  }
  
  const toast = document.createElement('div');
  toast.className = 'toast-notification fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg animate-fade-in';
  
  let bgColor, icon;
  switch (type) {
    case 'success':
      bgColor = 'bg-green-500';
      icon = 'ri-check-line';
      break;
    case 'error':
      bgColor = 'bg-red-500';
      icon = 'ri-error-warning-line';
      break;
    case 'warning':
      bgColor = 'bg-yellow-500';
      icon = 'ri-alert-line';
      break;
    default:
      bgColor = 'bg-blue-500';
      icon = 'ri-information-line';
  }
  
  toast.classList.add(bgColor);
  
  toast.innerHTML = `
    <div class="flex items-center text-white">
      <i class="${icon} mr-2 text-lg"></i>
      <span>${message}</span>
    </div>
  `;
  
  document.body.appendChild(toast);
  
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
  // Phím tắt đã được xử lý trong initTabNavigation
};

/**
 * Khởi tạo sidebar
 */
const initSidebar = () => {
  const sidebar = document.getElementById('sidebar');
  const sidebarOpen = document.getElementById('sidebar-open');
  const sidebarClose = document.getElementById('sidebar-close');
  const sidebarBackdrop = document.getElementById('sidebar-backdrop');
  
  // Mở sidebar (mobile)
  sidebarOpen.addEventListener('click', () => {
    sidebar.classList.remove('-translate-x-full');
    sidebarBackdrop.classList.remove('hidden');
    setTimeout(() => {
      sidebarBackdrop.classList.add('opacity-100');
    }, 100);
  });
  
  // Đóng sidebar (mobile)
  const closeSidebar = () => {
    sidebar.classList.add('-translate-x-full');
    sidebarBackdrop.classList.remove('opacity-100');
    setTimeout(() => {
      sidebarBackdrop.classList.add('hidden');
    }, 300);
  };
  
  sidebarClose.addEventListener('click', closeSidebar);
  sidebarBackdrop.addEventListener('click', closeSidebar);
}; 