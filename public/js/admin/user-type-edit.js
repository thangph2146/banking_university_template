/**
 * Trang chỉnh sửa loại người dùng - Banking University
 * File: user-type-edit.js
 * 
 * Chức năng:
 * - Tải thông tin loại người dùng hiện tại
 * - Xử lý form chỉnh sửa loại người dùng
 * - Quản lý quyền hạn của loại người dùng
 * - Xử lý submit form và cập nhật thông tin
 * - Xử lý xóa loại người dùng
 */

// Thêm CSS animations cho toast
(function addAnimationStyles() {
  const styleElement = document.createElement('style');
  styleElement.textContent = `
    @keyframes fadeIn {
      from { opacity: 0; transform: translateX(20px); }
      to { opacity: 1; transform: translateX(0); }
    }
    
    @keyframes fadeOut {
      from { opacity: 1; transform: translateX(0); }
      to { opacity: 0; transform: translateX(20px); }
    }
    
    .animate-fadeIn {
      animation: fadeIn 0.3s ease-out forwards;
    }
    
    .animate-fadeOut {
      animation: fadeOut 0.3s ease-in forwards;
    }
  `;
  document.head.appendChild(styleElement);
})();

// IIFE để đóng gói module
(function() {
  'use strict';
  
  // --------------------------------------------------
  // Constants & Global Variables
  // --------------------------------------------------
  let userTypeId = null; // ID của loại người dùng đang chỉnh sửa
  let originalUserTypeData = null; // Dữ liệu gốc của loại người dùng
  let selectedPermissions = []; // Danh sách ID quyền đã chọn
  
  // Dữ liệu mẫu loại người dùng
  const userTypesMockData = [
    {
      id: 1,
      name: "Quản trị viên",
      description: "Người dùng có toàn quyền quản trị hệ thống",
      status: "active",
      userCount: 5,
      activeUserCount: 5,
      inactiveUserCount: 0,
      permissions: ["view_all", "edit_all", "delete_all", "manage_users", "manage_events", "manage_settings"],
      createdAt: "2023-01-15T08:30:00Z",
      updatedAt: "2023-05-20T14:45:00Z"
    },
    {
      id: 2,
      name: "Giảng viên",
      description: "Giảng viên của trường đại học",
      status: "active",
      userCount: 120,
      activeUserCount: 98,
      inactiveUserCount: 22,
      permissions: ["view_events", "create_events", "edit_own_events", "view_students"],
      createdAt: "2023-01-20T09:15:00Z",
      updatedAt: "2023-06-12T11:30:00Z"
    },
    {
      id: 3,
      name: "Sinh viên",
      description: "Sinh viên đang theo học tại trường",
      status: "active",
      userCount: 3500,
      activeUserCount: 3200,
      inactiveUserCount: 300,
      permissions: ["view_events", "register_events", "view_own_profile"],
      createdAt: "2023-01-25T10:00:00Z",
      updatedAt: "2023-06-15T13:20:00Z"
    },
    {
      id: 4,
      name: "Cựu sinh viên",
      description: "Sinh viên đã tốt nghiệp",
      status: "active",
      userCount: 870,
      activeUserCount: 450,
      inactiveUserCount: 420,
      permissions: ["view_events", "register_alumni_events", "view_own_profile"],
      createdAt: "2023-02-01T08:45:00Z",
      updatedAt: "2023-06-20T15:10:00Z"
    },
    {
      id: 5,
      name: "Nhân viên",
      description: "Nhân viên hành chính của trường",
      status: "active",
      userCount: 85,
      activeUserCount: 82,
      inactiveUserCount: 3,
      permissions: ["view_events", "manage_own_department", "view_reports"],
      createdAt: "2023-02-10T09:30:00Z",
      updatedAt: "2023-07-05T10:45:00Z"
    },
    {
      id: 6,
      name: "Khách",
      description: "Tài khoản khách tham quan",
      status: "inactive",
      userCount: 250,
      activeUserCount: 0,
      inactiveUserCount: 250,
      permissions: ["view_public_events"],
      createdAt: "2023-02-15T14:20:00Z",
      updatedAt: "2023-07-10T16:30:00Z"
    }
  ];
  
  const permissionsList = [
    {
      id: "view_all",
      name: "Xem tất cả dữ liệu",
      description: "Xem tất cả dữ liệu trong hệ thống",
      group: "Quản trị"
    },
    {
      id: "edit_all",
      name: "Chỉnh sửa dữ liệu",
      description: "Chỉnh sửa tất cả dữ liệu trong hệ thống",
      group: "Quản trị"
    },
    {
      id: "delete_all",
      name: "Xóa dữ liệu",
      description: "Xóa tất cả dữ liệu trong hệ thống",
      group: "Quản trị"
    },
    {
      id: "manage_users",
      name: "Quản lý người dùng",
      description: "Quản lý tài khoản người dùng",
      group: "Quản trị"
    },
    {
      id: "manage_events",
      name: "Quản lý sự kiện",
      description: "Quản lý tất cả sự kiện",
      group: "Sự kiện"
    },
    {
      id: "manage_settings",
      name: "Quản lý cài đặt",
      description: "Quản lý cài đặt hệ thống",
      group: "Quản trị"
    },
    {
      id: "view_events",
      name: "Xem sự kiện",
      description: "Xem danh sách sự kiện",
      group: "Sự kiện"
    },
    {
      id: "create_events",
      name: "Tạo sự kiện",
      description: "Tạo sự kiện mới",
      group: "Sự kiện"
    },
    {
      id: "edit_own_events",
      name: "Sửa sự kiện cá nhân",
      description: "Chỉnh sửa sự kiện đã tạo",
      group: "Sự kiện"
    },
    {
      id: "view_students",
      name: "Xem sinh viên",
      description: "Xem danh sách sinh viên",
      group: "Người dùng"
    },
    {
      id: "register_events",
      name: "Đăng ký sự kiện",
      description: "Đăng ký tham gia sự kiện",
      group: "Sự kiện"
    },
    {
      id: "view_own_profile",
      name: "Xem hồ sơ cá nhân",
      description: "Xem thông tin cá nhân",
      group: "Người dùng"
    },
    {
      id: "register_alumni_events",
      name: "Đăng ký sự kiện cựu sinh viên",
      description: "Đăng ký sự kiện dành cho cựu sinh viên",
      group: "Sự kiện"
    },
    {
      id: "manage_own_department",
      name: "Quản lý phòng ban",
      description: "Quản lý thông tin phòng ban của mình",
      group: "Phòng ban"
    },
    {
      id: "view_reports",
      name: "Xem báo cáo",
      description: "Xem báo cáo thống kê",
      group: "Báo cáo"
    },
    {
      id: "view_public_events",
      name: "Xem sự kiện công khai",
      description: "Xem các sự kiện công khai",
      group: "Sự kiện"
    }
  ];
  
  // DOM Elements Cache
  const $elements = {
    editForm: document.getElementById('user-type-edit-form'),
    editFormContainer: document.getElementById('edit-form-container'),
    userTypeIdInput: document.getElementById('user-type-id'),
    userTypeNameBreadcrumb: document.getElementById('user-type-name-breadcrumb'),
    breadcrumbDetailLink: document.getElementById('breadcrumb-detail-link'),
    breadcrumbDetailSeparator: document.getElementById('breadcrumb-detail-separator'),
    backToDetailButton: document.getElementById('view-detail-button'),
    nameInput: document.getElementById('name'),
    descriptionInput: document.getElementById('description'),
    statusSelect: document.getElementById('status'),
    createdAtDisplay: document.getElementById('created-at'),
    updatedAtDisplay: document.getElementById('updated-at'),
    loadingIndicator: document.getElementById('loading-indicator'),
    errorAlert: document.getElementById('error-alert'),
    errorMessage: document.getElementById('error-message'),
    errorDetail: document.getElementById('error-detail'),
    permissionsGrid: document.getElementById('permissions-grid'),
    permissionFilterButtonsContainer: document.getElementById('permission-filter-buttons'),
    selectAllPermissionsBtn: document.getElementById('select-all-permissions'),
    deselectAllPermissionsBtn: document.getElementById('deselect-all-permissions'),
    searchPermissionsInput: document.getElementById('search-permissions'),
    selectedPermissionsCount: document.getElementById('selected-permissions-count'),
    submitButton: document.getElementById('submit-btn'),
    deleteButton: document.getElementById('delete-btn'),
    cancelButton: document.getElementById('cancel-btn'),
    sidebar: document.getElementById('sidebar'),
    sidebarOpen: document.getElementById('sidebar-open'),
    sidebarClose: document.getElementById('sidebar-close'),
    sidebarBackdrop: document.getElementById('sidebar-backdrop'),
    userMenuButton: document.getElementById('user-menu-button'),
    userMenu: document.getElementById('user-menu')
  };
  
  // --------------------------------------------------
  // Initialization
  // --------------------------------------------------
  
  /**
   * Khởi tạo module khi trang đã tải xong
   */
  function initialize() {
    // Khởi tạo AOS animation
    if (typeof AOS !== 'undefined') {
      AOS.init({
        duration: 800,
        once: true
      });
    } else {
      console.warn('AOS library not found.');
    }
    
    // Thiết lập sidebar và user menu
    initSidebar();
    initUserMenu();
    
    // Thiết lập các sự kiện khác
    setupEventListeners();
    
    // Tạo container cho toast (nếu chưa có)
    ensureToastContainerExists();
    
    // Lấy userTypeId từ URL
    userTypeId = getUserTypeIdFromURL();
    
    if (!userTypeId) {
      showError("Không tìm thấy ID loại người dùng trong URL.", "Bạn sẽ được chuyển hướng về trang danh sách.");
      setTimeout(() => {
        window.location.href = "user-types.html";
      }, 2500);
      return;
    }
    
    // Cập nhật link nút Hủy và Xem chi tiết
    if ($elements.cancelButton) {
      $elements.cancelButton.href = `user-type-detail.html?id=${userTypeId}`;
    }
     if ($elements.backToDetailButton) {
      $elements.backToDetailButton.href = `user-type-detail.html?id=${userTypeId}`;
      $elements.backToDetailButton.classList.remove('hidden'); // Make sure it's visible
    }
     // Cập nhật link breadcrumb chi tiết
     if ($elements.breadcrumbDetailLink) {
        $elements.breadcrumbDetailLink.href = `user-type-detail.html?id=${userTypeId}`;
        $elements.breadcrumbDetailLink.classList.remove('hidden');
    }
    if ($elements.breadcrumbDetailSeparator) {
        $elements.breadcrumbDetailSeparator.classList.remove('hidden');
    }

    // Tải dữ liệu
    loadUserTypeData();
  }

  /**
   * Tạo container cho toast nếu chưa tồn tại
   */
  function ensureToastContainerExists() {
    if (!document.getElementById('toast-container')) {
      const toastContainer = document.createElement('div');
      toastContainer.id = 'toast-container';
      // Classes for positioning and z-index should match toast function's expectations
      toastContainer.className = 'fixed bottom-4 right-4 z-[100] space-y-2'; 
      document.body.appendChild(toastContainer);
    }
  }

  /**
   * Lấy ID loại người dùng từ URL
   */
  function getUserTypeIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    return id ? parseInt(id) : null;
  }
  
  /**
   * Khởi tạo sidebar cho mobile
   */
  function initSidebar() {
    const { sidebar, sidebarOpen, sidebarClose, sidebarBackdrop } = $elements;
    
    if (sidebarOpen && sidebar && sidebarBackdrop) {
        sidebarOpen.addEventListener('click', () => {
            sidebar.classList.remove('-translate-x-full');
            sidebarBackdrop.classList.remove('hidden');
        });
    }

    if (sidebarClose && sidebar && sidebarBackdrop) {
        sidebarClose.addEventListener('click', () => {
            sidebar.classList.add('-translate-x-full');
            sidebarBackdrop.classList.add('hidden');
        });
    }

    if (sidebarBackdrop && sidebar) {
        sidebarBackdrop.addEventListener('click', () => {
            sidebar.classList.add('-translate-x-full');
            sidebarBackdrop.classList.add('hidden');
        });
    }
  }
  
  /**
   * Khởi tạo menu người dùng
   */
  function initUserMenu() {
    const { userMenuButton, userMenu } = $elements;
    
    if (userMenuButton && userMenu) {
        userMenuButton.addEventListener('click', (event) => {
            event.stopPropagation(); // Prevent click from propagating to document
            const isVisible = !userMenu.classList.contains('hidden'); // Check hidden class
            if (isVisible) {
                userMenu.classList.add('hidden'); // Use hidden class like create.html
            } else {
                userMenu.classList.remove('hidden');
            }
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
          if (userMenuButton && userMenu && !userMenuButton.contains(e.target) && !userMenu.contains(e.target)) {
             userMenu.classList.add('hidden');
          }
       });
    }
  }
  
  /**
   * Thiết lập các sự kiện
   */
  function setupEventListeners() {
    // Form submit
    $elements.editForm?.addEventListener('submit', handleFormSubmit);
    
    // Permission buttons
    $elements.selectAllPermissionsBtn?.addEventListener('click', () => toggleAllPermissions(true));
    $elements.deselectAllPermissionsBtn?.addEventListener('click', () => toggleAllPermissions(false));
    
    // Permission search
    $elements.searchPermissionsInput?.addEventListener('input', filterAndSearchPermissions);
    
    // Permission filter buttons
    const filterButtons = $elements.permissionFilterButtonsContainer?.querySelectorAll('.permission-filter-btn');
    filterButtons?.forEach(button => {
        button.addEventListener('click', handleFilterButtonClick);
    });
    
    // Delete button
    $elements.deleteButton?.addEventListener('click', handleDeleteConfirmation);

    // Validate form on input
    $elements.nameInput?.addEventListener('input', validateForm);
  }

  // --------------------------------------------------
  // Data Loading & Display
  // --------------------------------------------------

  /**
   * Tải thông tin loại người dùng
   */
  function loadUserTypeData() {
    showLoading(true);
    hideError();
    
    // Giả lập gọi API
    setTimeout(() => {
      try {
        // Tìm loại người dùng theo ID
        originalUserTypeData = userTypesMockData.find(type => type.id == userTypeId);
        
        if (!originalUserTypeData) {
          showError("Không tìm thấy loại người dùng với ID đã cung cấp");
          return;
        }
        
        // Hiển thị form
        if ($elements.editFormContainer) {
          $elements.editFormContainer.classList.remove('hidden');
        }
        
        // Cập nhật breadcrumb
        updateBreadcrumb(originalUserTypeData.name);
        
        // Cập nhật thông tin hiển thị
        if ($elements.displayUserTypeId) {
          $elements.displayUserTypeId.textContent = originalUserTypeData.id;
        }
        
        if ($elements.displayUserTypeName) {
          $elements.displayUserTypeName.textContent = originalUserTypeData.name;
        }
        
        if ($elements.displayUserTypeStatus) {
          const statusClass = originalUserTypeData.status === 'active' ? 
            'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
          const statusText = originalUserTypeData.status === 'active' ? 'Hoạt động' : 'Không hoạt động';
          
          $elements.displayUserTypeStatus.className = `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusClass}`;
          $elements.displayUserTypeStatus.textContent = statusText;
        }
        
        // Điền thông tin vào form
        fillFormData();
        
        // Khởi tạo danh sách quyền
        selectedPermissions = [...originalUserTypeData.permissions];
        renderPermissionsList();
        
        // Cập nhật link xem chi tiết
        if ($elements.backToDetailButton) {
          $elements.backToDetailButton.classList.remove('hidden');
          $elements.backToDetailButton.href = `user-type-detail.html?id=${userTypeId}`;
        }
        
        showLoading(false);
      } catch (error) {
        showError("Có lỗi khi tải thông tin: " + error.message);
      }
    }, 500);
  }

  /**
   * Cập nhật breadcrumb
   */
  function updateBreadcrumb(userTypeName) {
    $elements.userTypeNameBreadcrumb.textContent = userTypeName;
    
    // Cập nhật link chi tiết nếu có
    if ($elements.breadcrumbDetailLink) {
      $elements.breadcrumbDetailLink.href = `user-type-detail.html?id=${userTypeId}`;
    }
  }
  
  /**
   * Điền thông tin vào form
   */
  function fillFormData() {
    $elements.userTypeIdInput.value = originalUserTypeData.id;
    $elements.nameInput.value = originalUserTypeData.name;
    $elements.descriptionInput.value = originalUserTypeData.description || '';
    $elements.statusSelect.value = originalUserTypeData.status;
    
    // Hiển thị thời gian tạo và cập nhật
    if ($elements.createdAtDisplay) {
      $elements.createdAtDisplay.textContent = formatDateTime(originalUserTypeData.createdAt);
    }
    
    if ($elements.updatedAtDisplay) {
      $elements.updatedAtDisplay.textContent = formatDateTime(originalUserTypeData.updatedAt);
    }
  }

  /**
   * Định dạng ngày giờ
   */
  function formatDateTime(dateTimeString) {
    if (!dateTimeString) return '-'; // Consistent fallback
    try {
        const date = new Date(dateTimeString);
        // Kiểm tra xem date có hợp lệ không
        if (isNaN(date.getTime())) {
            return 'Ngày không hợp lệ';
        }
        return new Intl.DateTimeFormat('vi-VN', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          // second: '2-digit' // Optional: include seconds
        }).format(date);
    } catch (error) {
        console.error("Error formatting date:", error);
        return 'Lỗi định dạng ngày';
    }
  }
  
  // --------------------------------------------------
  // Permissions Handling
  // --------------------------------------------------

  /**
   * Render danh sách quyền hạn và các nút lọc
   */
  function renderPermissionsList() {
    const permissionsContainer = $elements.permissionsGrid;
    const filterContainer = $elements.permissionFilterButtonsContainer;

    if (!permissionsContainer || !filterContainer) return;
    
    // Xóa nội dung cũ
    permissionsContainer.innerHTML = ''; 
    filterContainer.innerHTML = ''; // Clear old filters
    
    // Nhóm quyền theo group
    const permissionsByGroup = groupPermissionsByCategory();
    const groups = Object.keys(permissionsByGroup);

    // Tạo nút lọc "Tất cả"
    const allFilterButton = createFilterButton('all', 'Tất cả', true); // Active by default
    filterContainer.appendChild(allFilterButton);

    // Tạo nút lọc cho mỗi nhóm và render quyền
    groups.forEach(group => {
        // Tạo nút lọc cho nhóm
        const filterButton = createFilterButton(group, group);
        filterContainer.appendChild(filterButton);

        // Render các quyền trong nhóm
        permissionsByGroup[group].forEach(permission => {
            const permissionItem = renderPermissionItem(permission);
            permissionsContainer.appendChild(permissionItem);
        });
    });
    
    // Cập nhật số lượng quyền đã chọn ban đầu
    updateSelectedPermissionsCount();
    
    // Áp dụng lọc/tìm kiếm ban đầu (hiển thị tất cả)
    filterAndSearchPermissions(); 
  }

  /**
   * Tạo nút lọc quyền
   */
   function createFilterButton(filterValue, text, isActive = false) {
      const button = document.createElement('button');
      button.type = 'button';
      button.dataset.filter = filterValue;
      button.className = `permission-filter-btn flex items-center px-3 py-1.5 text-sm text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 border border-gray-200`;
      // Thêm icon nếu cần dựa trên filterValue (ví dụ)
      let iconClass = 'ri-list-check';
      if (filterValue === 'Sự kiện') iconClass = 'ri-calendar-event-line';
      else if (filterValue === 'Người dùng') iconClass = 'ri-user-line';
      else if (filterValue === 'Quản trị') iconClass = 'ri-shield-user-line'; 
      // Thêm các nhóm khác...

      button.innerHTML = `<i class="${iconClass} mr-1"></i> ${text}`;
      
      if (isActive) {
          button.classList.add('active', 'bg-primary/10', 'text-primary');
      }
      button.addEventListener('click', handleFilterButtonClick); // Gắn listener
      return button;
   }

  /**
   * Tạo một mục (item) quyền trong grid
   */
  function renderPermissionItem(permission) {
    const isChecked = selectedPermissions.includes(permission.id);
    
    const permissionItem = document.createElement('div');
    // Assign category based on group for filtering consistency
    permissionItem.className = 'border rounded-md p-3 permission-item hover:bg-gray-50 transition-colors duration-150';
    permissionItem.setAttribute('data-category', permission.group); // Use group as category
    permissionItem.dataset.permissionId = permission.id;
    
    permissionItem.innerHTML = `
      <label class="flex items-start cursor-pointer group">
        <input type="checkbox" name="permissions[]" value="${permission.id}" 
          class="permission-checkbox mt-1 h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary/50 focus:ring-offset-0" 
          ${isChecked ? 'checked' : ''}>
        <div class="ml-2">
          <span class="font-medium text-sm text-gray-800 group-hover:text-primary">${permission.name}</span>
          <p class="text-xs text-gray-500 mt-0.5">${permission.description}</p>
        </div>
      </label>
    `;
    
    // Thêm sự kiện cho checkbox
    const checkbox = permissionItem.querySelector('.permission-checkbox');
    checkbox.addEventListener('change', function() {
      updatePermissionSelection(permission.id, this.checked);
    });
    
    return permissionItem;
  }
  
  /**
   * Cập nhật mảng selectedPermissions khi checkbox thay đổi
   */
  function updatePermissionSelection(permissionId, isChecked) {
    if (isChecked) {
      if (!selectedPermissions.includes(permissionId)) {
        selectedPermissions.push(permissionId);
      }
    } else {
      selectedPermissions = selectedPermissions.filter(id => id !== permissionId);
    }
    updateSelectedPermissionsCount();
  }
  
  /**
   * Nhóm quyền theo thuộc tính 'group'
   */
  function groupPermissionsByCategory() {
    return permissionsList.reduce((groups, permission) => {
      const group = permission.group || 'Khác'; // Default group
      if (!groups[group]) {
        groups[group] = [];
      }
      groups[group].push(permission);
      return groups;
    }, {});
  }
  
  /**
   * Cập nhật số lượng quyền đã chọn hiển thị trên UI
   */
  function updateSelectedPermissionsCount() {
    if ($elements.selectedPermissionsCount) {
      $elements.selectedPermissionsCount.textContent = selectedPermissions.length;
    }
  }
  
  /**
   * Chọn hoặc bỏ chọn tất cả quyền đang hiển thị (visible)
   */
  function toggleAllPermissions(checkedState) {
    const visibleCheckboxes = $elements.permissionsGrid?.querySelectorAll('.permission-item:not([style*="display: none"]) input[type="checkbox"]');
    visibleCheckboxes?.forEach(checkbox => {
        if (checkbox.checked !== checkedState) {
            checkbox.checked = checkedState;
            // Trigger change event manually to update selectedPermissions array
            updatePermissionSelection(checkbox.value, checkedState);
        }
    });
  }
  
  /**
   * Xử lý khi nhấn nút lọc quyền theo nhóm
   */
  function handleFilterButtonClick(event) {
      const filterButtons = $elements.permissionFilterButtonsContainer?.querySelectorAll('.permission-filter-btn');
      // Bỏ active tất cả nút
      filterButtons?.forEach(btn => btn.classList.remove('active', 'bg-primary/10', 'text-primary'));
      // Active nút được nhấn
      event.currentTarget.classList.add('active', 'bg-primary/10', 'text-primary');
      filterAndSearchPermissions();
  }

  /**
   * Lọc và tìm kiếm quyền hạn dựa trên filter và search input
   */
   function filterAndSearchPermissions() {
    const searchValue = $elements.searchPermissionsInput ? $elements.searchPermissionsInput.value.toLowerCase().trim() : '';
    const activeFilterButton = $elements.permissionFilterButtonsContainer?.querySelector('.permission-filter-btn.active');
    const filterValue = activeFilterButton ? activeFilterButton.dataset.filter : 'all'; // Use dataset
    
    const permissionItems = $elements.permissionsGrid?.querySelectorAll('.permission-item');
    
    permissionItems?.forEach(item => {
      const permissionText = item.textContent.toLowerCase();
      const itemGroup = item.getAttribute('data-category'); // Keep using data-category as set in renderPermissionItem
      
      const matchesSearch = !searchValue || permissionText.includes(searchValue);
      const matchesFilter = filterValue === 'all' || itemGroup === filterValue;
      
      if (matchesSearch && matchesFilter) {
        item.style.display = 'block';
      } else {
        item.style.display = 'none';
      }
    });
  }
  
  // --------------------------------------------------
  // Form Handling & Validation
  // --------------------------------------------------

  /**
   * Kiểm tra hợp lệ của form (Nhất quán với create.js)
   */
  function validateForm() {
    let isValid = true;
    // Clear previous errors
    $elements.nameInput?.classList.remove('border-red-500');

    if (!$elements.nameInput?.value.trim()) {
      console.warn("Tên loại người dùng là bắt buộc.");
      $elements.nameInput?.classList.add('border-red-500');
      // TODO: Display user-friendly message near the input
      isValid = false;
    }
    
    // Add other validation rules if needed

    // Update submit button state
    if ($elements.submitButton) {
      $elements.submitButton.disabled = !isValid;
    }
    return isValid;
  }
  
  /**
   * Xử lý sự kiện submit form (Cập nhật)
   */
  function handleFormSubmit(e) {
    e.preventDefault();
    if (!validateForm()) return;

    showSubmitLoading(true);
    
    // Lấy dữ liệu form
    const name = $elements.nameInput.value.trim();
    const description = $elements.descriptionInput.value.trim();
    const status = $elements.statusSelect.value;
    
    // Tạo đối tượng dữ liệu cập nhật
    const updatedUserType = {
      ...originalUserTypeData, // Giữ lại các trường không đổi như id, createdAt
      name,
      description,
      status,
      permissions: selectedPermissions,
      updatedAt: new Date().toISOString() // Cập nhật thời gian
    };
    
    // Giả lập gọi API
    setTimeout(() => {
      try {
        console.log("Đã cập nhật loại người dùng:", updatedUserType);
        
        // Cập nhật dữ liệu gốc trong mock data (ví dụ)
        const index = userTypesMockData.findIndex(type => type.id == userTypeId);
        if (index !== -1) {
          userTypesMockData[index] = updatedUserType;
        }
        
        // Lưu trạng thái mới vào originalUserTypeData để reflect thay đổi nếu user không rời trang
        originalUserTypeData = updatedUserType;

        showToast("Cập nhật loại người dùng thành công!", "success");
        
        // Cập nhật breadcrumb với tên mới
        updateBreadcrumb(name); 
        
        showSubmitLoading(false);
      } catch (error) {
        showToast("Lỗi khi cập nhật loại người dùng: " + error.message, "error");
        showSubmitLoading(false);
      }
    }, 800);
  }
  
  /**
   * Hiển thị/ẩn loading trên nút Submit (Nhất quán với create.js)
   */
  function showSubmitLoading(show) {
    if (!$elements.submitButton) return;
    const spanElement = $elements.submitButton.querySelector('span'); // Target the span for text update

    if (show) {
        $elements.submitButton.disabled = true;
        // Use innerHTML to include the icon
        if (spanElement) {
            spanElement.innerHTML = '<i class="ri-loader-4-line animate-spin mr-2"></i> Đang xử lý...';
        } else { 
             // Fallback if span is not found (should not happen with current HTML)
            $elements.submitButton.innerHTML = '<i class="ri-loader-4-line animate-spin mr-2"></i> Đang xử lý...';
        }
    } else {
        $elements.submitButton.disabled = false;
         // Restore original text in the span
        if (spanElement) {
            spanElement.textContent = 'Lưu thay đổi'; 
        } else {
            // Fallback
            $elements.submitButton.innerHTML = '<i class="ri-save-line mr-2"></i> Lưu thay đổi';
        }
         // Re-validate form to potentially re-enable button if needed
        validateForm();
    }
  }

  // --------------------------------------------------
  // Deletion Handling
  // --------------------------------------------------

  /**
   * Hiển thị xác nhận xóa (sử dụng confirm() đơn giản)
   */
  function handleDeleteConfirmation() {
    if (!originalUserTypeData) {
        showToast("Không thể xóa vì dữ liệu chưa được tải.", "warning");
        return;
    }
    // Sử dụng confirm() của trình duyệt cho đơn giản
    const confirmation = confirm(
        `Bạn có chắc chắn muốn xóa loại người dùng "${originalUserTypeData.name}" (ID: ${userTypeId}) không?
` +
        `Hành động này không thể hoàn tác.`
    );
    
    if (confirmation) {
        deleteUserType();
    }
  }
  
  /**
   * Thực hiện xóa loại người dùng
   */
  function deleteUserType() {
    console.log(`Attempting to delete user type ID: ${userTypeId}`);
    // Hiển thị loading trên nút xóa hoặc nút submit
    showDeleteLoading(true); 

    // Giả lập gọi API
    setTimeout(() => {
      try {
        // Xóa từ dữ liệu mẫu (ví dụ)
        const index = userTypesMockData.findIndex(type => type.id == userTypeId);
        if (index !== -1) {
          userTypesMockData.splice(index, 1);
          console.log(`Deleted user type ID: ${userTypeId}`);
        } else {
           console.warn(`User type ID: ${userTypeId} not found in mock data.`);
           throw new Error("Không tìm thấy loại người dùng để xóa.");
        }
        
        showToast("Xóa loại người dùng thành công!", "success");
        
        // Chuyển hướng về trang danh sách sau 1 giây
        setTimeout(() => {
          window.location.href = "user-types.html";
        }, 1000);
      } catch (error) {
        showToast("Lỗi khi xóa loại người dùng: " + error.message, "error");
        showDeleteLoading(false); // Ẩn loading nếu có lỗi
      }
    }, 500);
  }

  /**
   * Hiển thị/ẩn loading trên nút Delete 
   * (Tương tự showSubmitLoading nhưng cho nút khác)
   */
   function showDeleteLoading(show) {
      if (!$elements.deleteButton) return;

      if (show) {
          $elements.deleteButton.disabled = true;
          $elements.deleteButton.innerHTML = '<i class="ri-loader-4-line animate-spin mr-2"></i> Đang xóa...';
          // Optionally disable submit button too during delete
          if ($elements.submitButton) $elements.submitButton.disabled = true;
      } else {
          $elements.deleteButton.disabled = false;
          $elements.deleteButton.innerHTML = '<i class="ri-delete-bin-line mr-2"></i> Xóa loại người dùng';
          // Re-enable submit button if it was disabled
           if ($elements.submitButton) validateForm(); // Re-check submit button state
      }
   }

  // --------------------------------------------------
  // UI Feedback (Loading, Error, Toast)
  // --------------------------------------------------

  /**
   * Hiển thị hoặc ẩn trạng thái loading chính của trang
   */
  function showLoading(show) {
    const { loadingIndicator, editFormContainer } = $elements;
    
    if (loadingIndicator) {
        loadingIndicator.classList.toggle('hidden', !show);
    }
     if (editFormContainer) {
        // Hide form when loading, show when not loading (if data fetch succeeded)
        editFormContainer.classList.toggle('hidden', show); 
    }
  }
  
  /**
   * Hiển thị thông báo lỗi chung của trang
   */
  function showError(message, detail = '') {
    const { errorAlert, errorMessage, errorDetail, loadingIndicator, editFormContainer } = $elements;
    
    if (errorMessage) errorMessage.textContent = message || "Đã có lỗi xảy ra.";
    if (errorDetail) errorDetail.textContent = detail || 'Vui lòng thử lại hoặc liên hệ quản trị viên.';
    
    if (errorAlert) errorAlert.classList.remove('hidden');
    if (loadingIndicator) loadingIndicator.classList.add('hidden'); // Hide loading if error occurs
    if (editFormContainer) editFormContainer.classList.add('hidden'); // Hide form on error
  }
  
  /**
   * Ẩn thông báo lỗi chung của trang
   */
  function hideError() {
    const { errorAlert } = $elements;
    if (errorAlert) errorAlert.classList.add('hidden');
  }
  
  
  /**
   * Hiển thị thông báo toast (Adapt from create.js style but keep animation)
   * Sử dụng container #toast-container được tạo bởi ensureToastContainerExists
   */
  function showToast(message, type = "info") {
    const toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
      console.error("Toast container not found!");
      return;
    }

    const toastId = `toast-${Date.now()}`;
    const toast = document.createElement('div');
    toast.id = toastId;
    // Base classes + animation class (use create.js style directly)
    toast.className = `flex items-center p-4 mb-3 w-full max-w-xs rounded-lg shadow ${getToastBgColor(type)}`; 
    // Add animation class if fadeIn/fadeOut exists
    if (typeof addAnimationStyles === 'function') {
        toast.classList.add('animate-fadeIn');
    }
    toast.setAttribute('role', 'alert');

    // Nội dung thông báo (Sử dụng cấu trúc và icon từ create.js)
    toast.innerHTML = `
      <div class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 ${getToastIconBgColor(type)} rounded-lg">
        ${getToastIcon(type)} 
      </div>
      <div class="ml-3 text-sm font-normal">
        ${message}
      </div>
      <button type="button" class="ml-auto -mx-1.5 -my-1.5 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 inline-flex h-8 w-8 ${getToastCloseButtonColor(type)}" data-dismiss-target="#${toastId}" aria-label="Close">
          <span class="sr-only">Đóng</span>
          <i class="ri-close-line"></i>
      </button>
    `;
    
    // Thêm vào container
    toastContainer.prepend(toast); // Add to top

    const closeButton = toast.querySelector('button');
    
    const removeToast = () => {
      // Add fadeOut animation if available
      if (toast.classList.contains('animate-fadeIn')) {
          toast.classList.remove('animate-fadeIn');
          toast.classList.add('animate-fadeOut');
          // Wait for fadeOut animation to complete before removing
          setTimeout(() => {
            if (toast.parentNode) {
              toast.remove();
               // Optional: Remove container if empty
               if (toastContainer.children.length === 0) {
                  // toastContainer.remove(); 
               }
            }
          }, 300); // Match fadeOut duration
      } else {
          // Remove directly if no animation
          if (toast.parentNode) {
              toast.remove();
              if (toastContainer.children.length === 0) {
                  // toastContainer.remove(); 
               }
          }
      }
    };

    closeButton.addEventListener('click', removeToast);
    
    // Tự động ẩn sau 5 giây
    setTimeout(removeToast, 5000);
  }
  
  /**
   * Lấy màu nền cho toast (nhất quán với create.js)
   */
  function getToastBgColor(type) {
    switch (type) {
      case 'success': return 'bg-green-50 text-green-800';
      case 'error':   return 'bg-red-50 text-red-800';
      case 'warning': return 'bg-yellow-50 text-yellow-800';
      default:        return 'bg-blue-50 text-blue-800';
    }
  }

  /**
   * Lấy màu nền icon cho toast (nhất quán với create.js)
   */
  function getToastIconBgColor(type) {
    switch (type) {
      case 'success': return 'bg-green-100 text-green-500';
      case 'error':   return 'bg-red-100 text-red-500';
      case 'warning': return 'bg-yellow-100 text-yellow-500';
      default:        return 'bg-blue-100 text-blue-500';
    }
  }

  /**
   * Lấy màu nút đóng cho toast (nhất quán với create.js)
   */
  function getToastCloseButtonColor(type) {
    switch (type) {
      case 'success': return 'bg-green-50 text-green-500 hover:bg-green-100';
      case 'error':   return 'bg-red-50 text-red-500 hover:bg-red-100';
      case 'warning': return 'bg-yellow-50 text-yellow-500 hover:bg-yellow-100';
      default:        return 'bg-blue-50 text-blue-500 hover:bg-blue-100';
    }
  }

  /**
   * Lấy HTML string cho icon của toast (nhất quán với create.js)
   */
  function getToastIcon(type) {
    switch (type) {
      case 'success': return '<i class="ri-check-line"></i>';
      case 'error':   return '<i class="ri-error-warning-line"></i>';
      case 'warning': return '<i class="ri-alert-line"></i>';
      default:        return '<i class="ri-information-line"></i>';
    }
  }
  
  // --------------------------------------------------
  // DOM Ready - Start Initialization
  // --------------------------------------------------
  document.addEventListener('DOMContentLoaded', initialize);

})(); 