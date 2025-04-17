/**
 * Trang tạo mới loại người dùng - Banking University
 * File: user-type-create.js
 * 
 * Chức năng:
 * - Xử lý form tạo mới loại người dùng
 * - Quản lý quyền hạn của loại người dùng
 * - Xử lý submit form và chuyển hướng
 */

// Danh sách quyền hạn mẫu (sẽ được thay thế bằng API call trong thực tế)
const permissionsData = [
  {
    id: "view_all",
    name: "Xem tất cả dữ liệu",
    description: "Xem tất cả dữ liệu trong hệ thống",
    category: "system"
  },
  {
    id: "edit_all",
    name: "Chỉnh sửa dữ liệu",
    description: "Chỉnh sửa tất cả dữ liệu trong hệ thống",
    category: "system"
  },
  {
    id: "delete_all",
    name: "Xóa dữ liệu",
    description: "Xóa tất cả dữ liệu trong hệ thống",
    category: "system"
  },
  {
    id: "manage_users",
    name: "Quản lý người dùng",
    description: "Quản lý tài khoản người dùng",
    category: "user"
  },
  {
    id: "view_students",
    name: "Xem sinh viên",
    description: "Xem danh sách sinh viên",
    category: "user"
  },
  {
    id: "view_own_profile",
    name: "Xem hồ sơ cá nhân",
    description: "Xem thông tin cá nhân",
    category: "user"
  },
  {
    id: "manage_events",
    name: "Quản lý sự kiện",
    description: "Quản lý tất cả sự kiện",
    category: "event"
  },
  {
    id: "view_events",
    name: "Xem sự kiện",
    description: "Xem danh sách sự kiện",
    category: "event"
  },
  {
    id: "create_events",
    name: "Tạo sự kiện",
    description: "Tạo sự kiện mới",
    category: "event"
  },
  {
    id: "edit_own_events",
    name: "Sửa sự kiện cá nhân",
    description: "Chỉnh sửa sự kiện đã tạo",
    category: "event"
  },
  {
    id: "register_events",
    name: "Đăng ký sự kiện",
    description: "Đăng ký tham gia sự kiện",
    category: "event"
  },
  {
    id: "register_alumni_events",
    name: "Đăng ký sự kiện cựu sinh viên",
    description: "Đăng ký sự kiện dành cho cựu sinh viên",
    category: "event"
  },
  {
    id: "view_public_events",
    name: "Xem sự kiện công khai",
    description: "Xem các sự kiện công khai",
    category: "event"
  },
  {
    id: "manage_registrations",
    name: "Quản lý đăng ký",
    description: "Quản lý đăng ký tham gia sự kiện",
    category: "event"
  },
  {
    id: "manage_settings",
    name: "Quản lý cài đặt",
    description: "Quản lý cài đặt hệ thống",
    category: "system"
  },
  {
    id: "view_reports",
    name: "Xem báo cáo",
    description: "Xem báo cáo thống kê",
    category: "system" // Hoặc có thể là nhóm "Báo cáo" riêng
  },
  // Thêm các quyền khác nếu cần
];

// Biến toàn cục
let selectedPermissions = []; // Danh sách quyền đã chọn

// IIFE để đóng gói module
(function() {
  'use strict';
  
  // Khởi tạo các element DOM
  const $elements = {
    // Form và container
    createForm: document.getElementById('user-type-create-form'),
    createFormContainer: document.getElementById('create-form-container'),
    
    // Loading và error
    loadingIndicator: document.getElementById('loading-indicator'),
    errorAlert: document.getElementById('error-alert'),
    errorMessage: document.getElementById('error-message'),
    errorDetail: document.getElementById('error-detail'),
    
    // Field input
    nameInput: document.getElementById('name'),
    descriptionInput: document.getElementById('description'),
    statusSelect: document.getElementById('status'),
    
    // Permissions
    permissionsGrid: document.getElementById('permissions-grid'),
    selectAllPermissionsBtn: document.getElementById('select-all-permissions'),
    deselectAllPermissionsBtn: document.getElementById('deselect-all-permissions'),
    searchPermissionsInput: document.getElementById('search-permissions'),
    filterButtons: document.querySelectorAll('.permission-filter-btn'),
    
    // Form controls
    submitButton: document.getElementById('submit-btn'),
    submitSpinner: document.getElementById('submit-spinner'),
    resetButton: document.getElementById('reset-btn'),
    cancelButton: document.getElementById('cancel-btn'),
    
    // Sidebar (mobile)
    sidebar: document.getElementById('sidebar'),
    sidebarOpen: document.getElementById('sidebar-open'),
    sidebarClose: document.getElementById('sidebar-close'),
    sidebarBackdrop: document.getElementById('sidebar-backdrop')
  };
  
  /**
   * Khởi tạo module khi trang đã tải xong
   */
  function initialize() {
    // Khởi tạo animation
    AOS.init({
      duration: 800,
      once: true
    });
    
    // Khởi tạo sidebar cho mobile
    initSidebar();
    
    // Tải danh sách quyền hạn
    loadPermissions();
    
    // Đăng ký các sự kiện
    setupEventListeners();
  }
  
  /**
   * Khởi tạo sidebar cho mobile
   */
  function initSidebar() {
    const { sidebar, sidebarOpen, sidebarClose, sidebarBackdrop } = $elements;
    
    if (sidebarOpen) {
      sidebarOpen.addEventListener('click', () => {
        sidebar.classList.remove('-translate-x-full');
        sidebarBackdrop.classList.remove('hidden');
      });
    }
    
    if (sidebarClose) {
      sidebarClose.addEventListener('click', () => {
        sidebar.classList.add('-translate-x-full');
        sidebarBackdrop.classList.add('hidden');
      });
    }
    
    if (sidebarBackdrop) {
      sidebarBackdrop.addEventListener('click', () => {
        sidebar.classList.add('-translate-x-full');
        sidebarBackdrop.classList.add('hidden');
      });
    }
  }
  
  /**
   * Tải danh sách quyền hạn
   */
  function loadPermissions() {
    $elements.permissionsGrid.innerHTML = ''; // Xóa nội dung cũ (ví dụ: "Đang tải...")
    
    if (!permissionsData || permissionsData.length === 0) {
      $elements.permissionsGrid.innerHTML = '<div class="text-center text-gray-500 py-4 col-span-full">Không tìm thấy quyền hạn nào.</div>';
      return;
    }

    permissionsData.forEach(permission => {
      const permissionItem = document.createElement('div');
      permissionItem.className = 'border rounded-md p-3 permission-item hover:bg-gray-50 transition-colors duration-150';
      permissionItem.setAttribute('data-category', permission.category);
      permissionItem.innerHTML = `
        <label class="flex items-start cursor-pointer">
          <input type="checkbox" id="perm-${permission.id}" name="permissions[]" value="${permission.id}"
            class="mt-1 h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary/50"
          />
          <div class="ml-2">
             <span class="font-medium text-sm text-gray-800">${permission.name}</span>
             <p class="text-xs text-gray-500 mt-0.5">${permission.description}</p>
          </div>
        </label>
      `;
      $elements.permissionsGrid.appendChild(permissionItem);
    });
    
    // Sau khi tải xong, có thể thực hiện lọc/tìm kiếm ban đầu nếu cần
    filterAndSearchPermissions();
  }
  
  /**
   * Thiết lập các sự kiện
   */
  function setupEventListeners() {
    // Form submit
    $elements.createForm.addEventListener('submit', handleFormSubmit);
    
    // Reset form
    if ($elements.resetButton) {
      $elements.resetButton.addEventListener('click', resetForm);
    }
    
    // Chọn/bỏ chọn tất cả
    if ($elements.selectAllPermissionsBtn) {
      $elements.selectAllPermissionsBtn.addEventListener('click', () => toggleAllPermissions(true));
    }
    if ($elements.deselectAllPermissionsBtn) {
      $elements.deselectAllPermissionsBtn.addEventListener('click', () => toggleAllPermissions(false));
    }
    
    // Tìm kiếm quyền
    if ($elements.searchPermissionsInput) {
      $elements.searchPermissionsInput.addEventListener('input', filterAndSearchPermissions);
    }
    
    // Lọc quyền theo nhóm
    $elements.filterButtons.forEach(button => {
      button.addEventListener('click', handleFilterButtonClick);
    });

    // Kiểm tra form khi nhập liệu
    if ($elements.nameInput) {
      $elements.nameInput.addEventListener('input', validateForm);
    }
    
    // Sidebar mobile toggle
    if ($elements.sidebarOpen && $elements.sidebar && $elements.sidebarClose) {
       $elements.sidebarOpen.addEventListener('click', () => {
           $elements.sidebar.classList.remove('-translate-x-full');
           // Thêm backdrop nếu cần
       });
       $elements.sidebarClose.addEventListener('click', () => {
           $elements.sidebar.classList.add('-translate-x-full');
           // Ẩn backdrop nếu cần
       });
       // Thêm sự kiện cho backdrop nếu có
    }
  }
  
  /**
   * Xử lý sự kiện submit form
   */
  function handleFormSubmit(event) {
    event.preventDefault();
    if (!validateForm()) return;
    
    showSubmitLoading(true);
    const formData = getFormData();
    console.log("Form data to submit:", formData);
    
    // --- Giả lập API Call --- 
    setTimeout(() => {
      console.log("API call successful for:", formData);
      // Chuyển hướng khi thành công
      window.location.href = "user-types.html";
      // Không cần gọi showSubmitLoading(false) vì đã chuyển trang
    }, 1500);
    // --- Kết thúc giả lập --- 
  }
  
  /**
   * Kiểm tra hợp lệ của form
   */
  function validateForm() {
    let isValid = true;
    if ($elements.nameInput && !$elements.nameInput.value.trim()) {
      // Nên hiển thị lỗi gần input thay vì alert
      console.warn("Tên loại người dùng là bắt buộc.");
      $elements.nameInput.classList.add('border-red-500'); // Ví dụ highlight lỗi
      isValid = false;
    } else if ($elements.nameInput) {
      $elements.nameInput.classList.remove('border-red-500');
    }
    
    // Thêm kiểm tra khác nếu cần
    
    // Cập nhật trạng thái nút submit (ví dụ)
    if ($elements.submitButton) {
      $elements.submitButton.disabled = !isValid;
    }
    
    return isValid;
  }
  
  /**
   * Lấy dữ liệu từ form
   */
  function getFormData() {
    const formData = {
      name: $elements.nameInput ? $elements.nameInput.value.trim() : '',
      description: $elements.descriptionInput ? $elements.descriptionInput.value.trim() : '',
      status: $elements.statusSelect ? $elements.statusSelect.value : 'active',
      permissions: []
    };
    
    const checkedPermissions = $elements.permissionsGrid.querySelectorAll('input[name="permissions[]"]:checked');
    checkedPermissions.forEach(checkbox => {
      formData.permissions.push(checkbox.value);
    });
    
    return formData;
  }
  
  /**
   * Reset form về trạng thái ban đầu
   */
  function resetForm() {
    if ($elements.createForm) {
      $elements.createForm.reset();
    }
    // Bỏ chọn tất cả checkbox quyền và hiển thị lại
    toggleAllPermissions(false);
    filterAndSearchPermissions(); // Reset filter/search
    if ($elements.nameInput) {
       $elements.nameInput.classList.remove('border-red-500');
       $elements.nameInput.focus();
    }
    // Reset active filter button
    $elements.filterButtons.forEach(btn => btn.classList.remove('active', 'bg-primary/10', 'text-primary'));
    const defaultFilter = document.querySelector('.permission-filter-btn[data-filter="all"]');
    if (defaultFilter) {
        defaultFilter.classList.add('active', 'bg-primary/10', 'text-primary');
    }
    if ($elements.searchPermissionsInput) {
        $elements.searchPermissionsInput.value = '';
    }
    validateForm(); // Cập nhật lại trạng thái nút submit
  }
  
  /**
   * Chọn hoặc bỏ chọn tất cả quyền hạn đang hiển thị
   */
  function toggleAllPermissions(checkedState) {
    const visibleCheckboxes = $elements.permissionsGrid.querySelectorAll('.permission-item:not([style*="display: none"]) input[name="permissions[]"]');
    visibleCheckboxes.forEach(checkbox => {
      checkbox.checked = checkedState;
    });
  }

  /**
   * Xử lý khi nhấn nút lọc
   */
  function handleFilterButtonClick(event) {
      // Bỏ active tất cả nút
      $elements.filterButtons.forEach(btn => btn.classList.remove('active', 'bg-primary/10', 'text-primary'));
      // Active nút được nhấn
      event.currentTarget.classList.add('active', 'bg-primary/10', 'text-primary');
      filterAndSearchPermissions();
  }
  
  /**
   * Lọc và tìm kiếm quyền hạn dựa trên trạng thái hiện tại của filter và search input
   */
   function filterAndSearchPermissions() {
    const searchValue = $elements.searchPermissionsInput ? $elements.searchPermissionsInput.value.toLowerCase().trim() : '';
    const activeFilterButton = document.querySelector('.permission-filter-btn.active');
    const filterValue = activeFilterButton ? activeFilterButton.getAttribute('data-filter') : 'all';
    
    const permissionItems = $elements.permissionsGrid.querySelectorAll('.permission-item');
    
    permissionItems.forEach(item => {
      const permissionText = item.textContent.toLowerCase();
      const itemCategory = item.getAttribute('data-category');
      
      const matchesSearch = !searchValue || permissionText.includes(searchValue);
      const matchesFilter = filterValue === 'all' || itemCategory === filterValue;
      
      if (matchesSearch && matchesFilter) {
        item.style.display = 'block';
      } else {
        item.style.display = 'none';
      }
    });
  }
  
  /**
   * Hiển thị/ẩn loading khi submit
   */
  function showSubmitLoading(show) {
    if (!$elements.submitButton) return;
    const spanElement = $elements.submitButton.querySelector('span');

    if (show) {
      $elements.submitButton.disabled = true;
      if (spanElement) {
        spanElement.innerHTML = '<i class="ri-loader-4-line animate-spin mr-2"></i> Đang xử lý...';
      } else {
        $elements.submitButton.innerHTML = '<i class="ri-loader-4-line animate-spin mr-2"></i> Đang xử lý...';
      }
    } else {
      $elements.submitButton.disabled = false;
      if (spanElement) {
         spanElement.innerHTML = 'Tạo loại người dùng'; // Chỉ cập nhật text trong span
      } else {
         $elements.submitButton.innerHTML = '<i class="ri-save-line mr-2"></i> Tạo loại người dùng'; // Fallback nếu không có span
      }
    }
  }
  
  /**
   * Hiển thị thông báo lỗi
   */
  function showError(message, detail = '') {
    const { errorAlert, errorMessage, errorDetail, createFormContainer } = $elements;
    
    errorMessage.textContent = message;
    errorDetail.textContent = detail || 'Vui lòng thử lại hoặc liên hệ quản trị viên.';
    
    errorAlert.classList.remove('hidden');
    createFormContainer.classList.add('hidden');
  }
  
  /**
   * Hiển thị thông báo toast
   */
  function showToast(message, type = "info") {
    // Tạo element toast
    const toast = document.createElement('div');
    toast.className = `flex items-center p-4 mb-3 text-sm rounded-lg ${getToastBgColor(type)}`;
    
    // Nội dung toast
    toast.innerHTML = `
      <div class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 ${getToastIconBgColor(type)} rounded-lg">
        ${getToastIcon(type)}
      </div>
      <div class="ml-3 text-sm font-normal">${message}</div>
      <button type="button" class="ml-auto -mx-1.5 -my-1.5 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 inline-flex h-8 w-8 ${getToastCloseButtonColor(type)}" aria-label="Close">
        <span class="sr-only">Đóng</span>
        <i class="ri-close-line"></i>
      </button>
    `;
    
    // Thêm vào body hoặc vào một container được chỉ định
    document.body.appendChild(toast);
    
    // Xử lý đóng toast
    toast.querySelector('button').addEventListener('click', () => {
      toast.remove();
    });
    
    // Tự động đóng sau 5 giây
    setTimeout(() => {
      if (toast.parentNode) {
        toast.remove();
      }
    }, 5000);
  }
  
  /**
   * Lấy màu nền cho toast
   */
  function getToastBgColor(type) {
    switch (type) {
      case 'success':
        return 'bg-green-50 text-green-800';
      case 'error':
        return 'bg-red-50 text-red-800';
      case 'warning':
        return 'bg-yellow-50 text-yellow-800';
      default:
        return 'bg-blue-50 text-blue-800';
    }
  }
  
  /**
   * Lấy màu nền cho icon toast
   */
  function getToastIconBgColor(type) {
    switch (type) {
      case 'success':
        return 'bg-green-100 text-green-500';
      case 'error':
        return 'bg-red-100 text-red-500';
      case 'warning':
        return 'bg-yellow-100 text-yellow-500';
      default:
        return 'bg-blue-100 text-blue-500';
    }
  }
  
  /**
   * Lấy màu cho nút đóng toast
   */
  function getToastCloseButtonColor(type) {
    switch (type) {
      case 'success':
        return 'bg-green-50 text-green-500 hover:bg-green-100';
      case 'error':
        return 'bg-red-50 text-red-500 hover:bg-red-100';
      case 'warning':
        return 'bg-yellow-50 text-yellow-500 hover:bg-yellow-100';
      default:
        return 'bg-blue-50 text-blue-500 hover:bg-blue-100';
    }
  }
  
  /**
   * Lấy icon cho toast
   */
  function getToastIcon(type) {
    switch (type) {
      case 'success':
        return '<i class="ri-check-line"></i>';
      case 'error':
        return '<i class="ri-error-warning-line"></i>';
      case 'warning':
        return '<i class="ri-alert-line"></i>';
      default:
        return '<i class="ri-information-line"></i>';
    }
  }
  
  // Khởi tạo trang khi DOM đã sẵn sàng
  document.addEventListener('DOMContentLoaded', initialize);
})(); 