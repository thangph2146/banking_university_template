/**
 * Trang chỉnh sửa loại người dùng - Banking University
 * File: user-type-edit.js
 * 
 * Chức năng:
 * - Tải thông tin loại người dùng hiện tại
 * - Xử lý form chỉnh sửa loại người dùng
 * - Quản lý quyền hạn của loại người dùng
 * - Xử lý submit form và cập nhật thông tin
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
  
  // Khởi tạo các biến
  let userTypeId = null; // ID của loại người dùng đang chỉnh sửa
  let originalUserTypeData = null; // Dữ liệu gốc của loại người dùng
  let selectedPermissions = []; // Danh sách quyền đã chọn
  
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
  
  // Danh sách quyền hạn
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
  
  // Các element DOM
  const $elements = {
    // Form và container
    editForm: document.getElementById('user-type-edit-form'),
    editFormContainer: document.getElementById('edit-form-container'),
    
    // ID đối tượng
    userTypeIdInput: document.getElementById('user-type-id'),
    
    // Display elements
    displayUserTypeId: document.getElementById('display-user-type-id'),
    displayUserTypeName: document.getElementById('display-user-type-name'),
    displayUserTypeStatus: document.getElementById('display-user-type-status'),
    userTypeNameBreadcrumb: document.getElementById('user-type-name-breadcrumb'),
    
    // Breadcrumb
    breadcrumbDetailLink: document.getElementById('breadcrumb-detail-link'),
    breadcrumbDetailSeparator: document.getElementById('breadcrumb-detail-separator'),
    
    // Back to detail link
    backToDetailButton: document.getElementById('back-to-detail-button'),
    
    // Input fields
    nameInput: document.getElementById('name'),
    descriptionInput: document.getElementById('description'),
    statusSelect: document.getElementById('status'),
    createdAtDisplay: document.getElementById('created-at'),
    updatedAtDisplay: document.getElementById('updated-at'),
    
    // Loading và error
    loadingIndicator: document.getElementById('loading-indicator'),
    errorAlert: document.getElementById('error-alert'),
    errorMessage: document.getElementById('error-message'),
    errorDetail: document.getElementById('error-detail'),
    
    // Permissions
    permissionsList: document.getElementById('permissions-list'),
    selectAllPermissionsBtn: document.getElementById('select-all-permissions'),
    deselectAllPermissionsBtn: document.getElementById('deselect-all-permissions'),
    
    // Form buttons
    submitButton: document.getElementById('submit-btn'),
    submitSpinner: document.getElementById('submit-spinner'),
    deleteButton: document.getElementById('delete-btn'),
    
    // Delete modal
    deleteModal: document.getElementById('delete-modal'),
    deleteConfirmationMessage: document.getElementById('delete-confirmation-message'),
    confirmDeleteButton: document.getElementById('confirm-delete-btn'),
    cancelDeleteButton: document.getElementById('cancel-delete-btn'),
    
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
    
    // Thiết lập sự kiện cho sidebar
    initSidebar();
    
    // Thiết lập sự kiện cho user menu
    initUserMenu();
    
    // Thiết lập các sự kiện
    setupEventListeners();
    
    // Tạo container cho toast nếu chưa tồn tại
    if (!document.getElementById('toast-container')) {
      const toastContainer = document.createElement('div');
      toastContainer.id = 'toast-container';
      toastContainer.className = 'fixed bottom-4 right-4 z-50';
      document.body.appendChild(toastContainer);
    }
    
    // Lấy userTypeId từ tham số URL
    userTypeId = getUserTypeIdFromURL();
    
    if (!userTypeId) {
      // Nếu không có ID, hiển thị thông báo lỗi
      showError("Không tìm thấy ID loại người dùng trong URL");
      setTimeout(() => {
        // Chuyển về trang danh sách sau 2 giây
        window.location.href = "user-types.html";
      }, 2000);
      return;
    }
    
    // Tải thông tin loại người dùng
    loadUserTypeData();
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
   * Khởi tạo menu người dùng
   */
  function initUserMenu() {
    const userMenuButton = document.getElementById('user-menu-button');
    const userMenu = document.getElementById('user-menu');
    
    userMenuButton?.addEventListener('click', () => {
      const isVisible = !userMenu.classList.contains('invisible');
      
      if (isVisible) {
        userMenu.classList.add('invisible', 'opacity-0', 'scale-95');
        userMenu.classList.remove('visible', 'opacity-100', 'scale-100');
      } else {
        userMenu.classList.remove('invisible', 'opacity-0', 'scale-95');
        userMenu.classList.add('visible', 'opacity-100', 'scale-100');
      }
    });
    
    // Đóng menu khi click ra ngoài
    document.addEventListener('click', (e) => {
      if (userMenuButton && userMenu && !userMenuButton.contains(e.target) && !userMenu.contains(e.target)) {
        userMenu.classList.add('invisible', 'opacity-0', 'scale-95');
        userMenu.classList.remove('visible', 'opacity-100', 'scale-100');
      }
    });
  }
  
  /**
   * Thiết lập các sự kiện
   */
  function setupEventListeners() {
    // Form submit
    if ($elements.editForm) {
      $elements.editForm.addEventListener('submit', handleFormSubmit);
    }
    
    // Nút chọn tất cả quyền
    if ($elements.selectAllPermissionsBtn) {
      $elements.selectAllPermissionsBtn.addEventListener('click', handleSelectAllPermissions);
    }
    
    // Nút bỏ chọn tất cả quyền
    if ($elements.deselectAllPermissionsBtn) {
      $elements.deselectAllPermissionsBtn.addEventListener('click', handleDeselectAllPermissions);
    }
    
    // Tìm kiếm quyền
    const searchInput = document.getElementById('search-permissions');
    if (searchInput) {
      searchInput.addEventListener('input', handleSearchPermissions);
    }
    
    // Lọc quyền theo nhóm
    const groupFilter = document.getElementById('filter-permissions-group');
    if (groupFilter) {
      groupFilter.addEventListener('change', handleFilterPermissions);
    }
    
    // Nút xem chi tiết
    if ($elements.backToDetailButton) {
      $elements.backToDetailButton.addEventListener('click', function() {
        window.location.href = `user-type-detail.html?id=${userTypeId}`;
      });
    }
    
    // Nút xóa loại người dùng
    if ($elements.deleteButton) {
      $elements.deleteButton.addEventListener('click', showDeleteConfirmation);
    }
    
    if ($elements.confirmDeleteButton) {
      $elements.confirmDeleteButton.addEventListener('click', deleteUserType);
    }
    
    if ($elements.cancelDeleteButton) {
      $elements.cancelDeleteButton.addEventListener('click', hideDeleteConfirmation);
    }
  }
  
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
    if (!dateTimeString) return 'N/A';
    
    const date = new Date(dateTimeString);
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  }
  
  /**
   * Tạo danh sách quyền hạn
   */
  function renderPermissionsList() {
    const permissionsContainer = $elements.permissionsList;
    if (!permissionsContainer) return;
    
    // Xóa nội dung cũ
    permissionsContainer.innerHTML = '';
    
    // Nhóm quyền theo group
    const permissionsByGroup = groupPermissionsByCategory();
    
    // Tạo danh sách quyền theo nhóm
    for (const [group, permissions] of Object.entries(permissionsByGroup)) {
      // Tạo header nhóm
      const groupHeader = document.createElement('div');
      groupHeader.className = 'mb-4';
      groupHeader.innerHTML = `
        <h3 class="text-base font-medium text-gray-900 mb-2">${group}</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 permission-group" data-group="${group}">
        </div>
      `;
      
      permissionsContainer.appendChild(groupHeader);
      
      const permissionsGrid = groupHeader.querySelector('.permission-group');
      
      // Thêm các quyền vào nhóm
      permissions.forEach(permission => {
        const permissionItem = renderPermissionItem(permission);
        permissionsGrid.appendChild(permissionItem);
      });
    }
    
    // Cập nhật số lượng quyền đã chọn
    updateSelectedPermissionsCount();
    
    // Cập nhật danh sách nhóm quyền trong select
    updatePermissionGroupsFilter(permissionsByGroup);
  }

  /**
   * Tạo một mục quyền
   */
  function renderPermissionItem(permission) {
    const isChecked = selectedPermissions.includes(permission.id);
    
    const permissionItem = document.createElement('div');
    permissionItem.className = 'permission-item border border-gray-200 rounded-md p-3 hover:bg-gray-50';
    permissionItem.dataset.permissionId = permission.id;
    permissionItem.dataset.permissionGroup = permission.group;
    
    permissionItem.innerHTML = `
      <label class="flex items-start cursor-pointer">
        <input type="checkbox" name="permissions[]" value="${permission.id}" class="permission-checkbox mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded" ${isChecked ? 'checked' : ''}>
        <div class="ml-2">
          <div class="text-sm font-medium text-gray-900">${permission.name}</div>
          <p class="text-xs text-gray-500">${permission.description}</p>
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
   * Cập nhật lựa chọn quyền
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
   * Nhóm quyền theo danh mục
   */
  function groupPermissionsByCategory() {
    const groups = {};
    
    permissionsList.forEach(permission => {
      if (!groups[permission.group]) {
        groups[permission.group] = [];
      }
      
      groups[permission.group].push(permission);
    });
    
    return groups;
  }
  
  /**
   * Cập nhật danh sách nhóm quyền trong select
   */
  function updatePermissionGroupsFilter(permissionsByGroup) {
    const groupFilter = document.getElementById('filter-permissions-group');
    if (!groupFilter) return;
    
    // Thêm tùy chọn mặc định
    groupFilter.innerHTML = '<option value="">Tất cả nhóm quyền</option>';
    
    // Thêm các nhóm quyền
    for (const group of Object.keys(permissionsByGroup)) {
      const option = document.createElement('option');
      option.value = group;
      option.textContent = group;
      groupFilter.appendChild(option);
    }
  }
  
  /**
   * Cập nhật số lượng quyền đã chọn
   */
  function updateSelectedPermissionsCount() {
    const countElement = document.getElementById('selected-permissions-count');
    if (countElement) {
      countElement.textContent = selectedPermissions.length;
    }
  }
  
  /**
   * Xử lý chọn tất cả quyền
   */
  function handleSelectAllPermissions(e) {
    e.preventDefault();
    
    const checkboxes = document.querySelectorAll('.permission-checkbox');
    checkboxes.forEach(checkbox => {
      if (!checkbox.checked) {
        checkbox.checked = true;
        const permissionId = checkbox.value;
        updatePermissionSelection(permissionId, true);
      }
    });
  }
  
  /**
   * Xử lý bỏ chọn tất cả quyền
   */
  function handleDeselectAllPermissions(e) {
    e.preventDefault();
    
    const checkboxes = document.querySelectorAll('.permission-checkbox');
    checkboxes.forEach(checkbox => {
      if (checkbox.checked) {
        checkbox.checked = false;
        const permissionId = checkbox.value;
        updatePermissionSelection(permissionId, false);
      }
    });
  }
  
  /**
   * Xử lý tìm kiếm quyền
   */
  function handleSearchPermissions() {
    const searchInput = document.getElementById('search-permissions');
    const searchValue = searchInput.value.toLowerCase();
    
    const permissionItems = document.querySelectorAll('.permission-item');
    
    permissionItems.forEach(item => {
      const permissionName = item.querySelector('.text-sm').textContent.toLowerCase();
      const permissionDescription = item.querySelector('.text-xs').textContent.toLowerCase();
      
      const isMatch = permissionName.includes(searchValue) || permissionDescription.includes(searchValue);
      
      if (isMatch) {
        item.classList.remove('hidden');
      } else {
        item.classList.add('hidden');
      }
    });
    
    // Kiểm tra và hiển thị các header nhóm
    updateGroupVisibility();
  }
  
  /**
   * Xử lý lọc quyền theo nhóm
   */
  function handleFilterPermissions() {
    const groupFilter = document.getElementById('filter-permissions-group');
    const selectedGroup = groupFilter.value;
    
    const permissionGroups = document.querySelectorAll('.permission-group');
    
    if (selectedGroup) {
      // Hiển thị nhóm được chọn, ẩn các nhóm khác
      permissionGroups.forEach(group => {
        if (group.dataset.group === selectedGroup) {
          group.closest('.mb-4').classList.remove('hidden');
        } else {
          group.closest('.mb-4').classList.add('hidden');
        }
      });
    } else {
      // Hiển thị tất cả nhóm
      permissionGroups.forEach(group => {
        group.closest('.mb-4').classList.remove('hidden');
      });
    }
    
    // Áp dụng tìm kiếm kết hợp với lọc
    handleSearchPermissions();
  }
  
  /**
   * Cập nhật hiển thị các header nhóm
   */
  function updateGroupVisibility() {
    const permissionGroups = document.querySelectorAll('.permission-group');
    
    permissionGroups.forEach(group => {
      const visibleItems = group.querySelectorAll('.permission-item:not(.hidden)');
      
      if (visibleItems.length === 0) {
        group.closest('.mb-4').classList.add('hidden');
      } else {
        group.closest('.mb-4').classList.remove('hidden');
      }
    });
  }
  
  /**
   * Xử lý submit form
   */
  function handleFormSubmit(e) {
    e.preventDefault();
    
    // Hiển thị loading
    showSubmitLoading(true);
    
    // Lấy dữ liệu từ form
    const formData = new FormData(e.target);
    const name = formData.get('name');
    const description = formData.get('description');
    const status = formData.get('status');
    
    // Kiểm tra dữ liệu
    if (!name) {
      showToast("Vui lòng nhập tên loại người dùng", "error");
      showSubmitLoading(false);
      return;
    }
    
    // Tạo đối tượng dữ liệu
    const updatedUserType = {
      ...originalUserTypeData,
      name,
      description,
      status,
      permissions: selectedPermissions,
      updatedAt: new Date().toISOString()
    };
    
    // Giả lập gọi API
    setTimeout(() => {
      try {
        console.log("Đã cập nhật loại người dùng:", updatedUserType);
        
        // Cập nhật dữ liệu gốc
        const index = userTypesMockData.findIndex(type => type.id == userTypeId);
        if (index !== -1) {
          userTypesMockData[index] = updatedUserType;
        }
        
        // Hiển thị thông báo thành công
        showToast("Cập nhật loại người dùng thành công!", "success");
        
        // Cập nhật breadcrumb và dữ liệu gốc
        updateBreadcrumb(name);
        originalUserTypeData = updatedUserType;
        
        // Ẩn loading
        showSubmitLoading(false);
      } catch (error) {
        showToast("Lỗi khi cập nhật loại người dùng: " + error.message, "error");
        showSubmitLoading(false);
      }
    }, 800);
  }
  
  /**
   * Hiển thị/ẩn loading khi submit
   */
  function showSubmitLoading(show) {
    const { submitButton, submitSpinner } = $elements;
    
    if (show) {
      submitButton.disabled = true;
      submitSpinner.classList.remove('hidden');
      submitButton.querySelector('span').textContent = 'Đang xử lý...';
    } else {
      submitButton.disabled = false;
      submitSpinner.classList.add('hidden');
      submitButton.querySelector('span').textContent = 'Lưu thay đổi';
    }
  }
  
  /**
   * Xác nhận xóa loại người dùng
   */
  function showDeleteConfirmation() {
    if (originalUserTypeData) {
      $elements.deleteConfirmationMessage.textContent = `Bạn có chắc chắn muốn xóa loại người dùng "${originalUserTypeData.name}" không? Hành động này không thể hoàn tác.`;
      $elements.deleteModal.classList.remove('hidden');
    }
  }
  
  /**
   * Ẩn hộp thoại xác nhận xóa
   */
  function hideDeleteConfirmation() {
    $elements.deleteModal.classList.add('hidden');
  }
  
  /**
   * Xóa loại người dùng
   */
  function deleteUserType() {
    hideDeleteConfirmation();
    showLoading(true);
    
    // Giả lập gọi API
    setTimeout(() => {
      try {
        // Xóa từ dữ liệu mẫu
        const index = userTypesMockData.findIndex(type => type.id == userTypeId);
        if (index !== -1) {
          userTypesMockData.splice(index, 1);
        }
        
        // Hiển thị thông báo thành công
        showToast("Xóa loại người dùng thành công!", "success");
        
        // Chuyển hướng về trang danh sách sau 1 giây
        setTimeout(() => {
          window.location.href = "user-types.html";
        }, 1000);
      } catch (error) {
        showToast("Lỗi khi xóa loại người dùng: " + error.message, "error");
        showLoading(false);
      }
    }, 500);
  }
  
  /**
   * Hiển thị hoặc ẩn trạng thái loading
   */
  function showLoading(show) {
    const { loadingIndicator, editFormContainer } = $elements;
    
    if (show) {
      loadingIndicator.classList.remove('hidden');
      if (editFormContainer) {
        editFormContainer.classList.add('hidden');
      }
    } else {
      loadingIndicator.classList.add('hidden');
      if (editFormContainer) {
        editFormContainer.classList.remove('hidden');
      }
    }
  }
  
  /**
   * Hiển thị thông báo lỗi
   */
  function showError(message, detail = '') {
    const { errorAlert, errorMessage, errorDetail, loadingIndicator } = $elements;
    
    if (errorMessage) errorMessage.textContent = message;
    if (errorDetail) errorDetail.textContent = detail || 'Vui lòng thử lại hoặc liên hệ quản trị viên.';
    
    if (errorAlert) errorAlert.classList.remove('hidden');
    if (loadingIndicator) loadingIndicator.classList.add('hidden');
  }
  
  /**
   * Ẩn thông báo lỗi
   */
  function hideError() {
    const { errorAlert } = $elements;
    if (errorAlert) errorAlert.classList.add('hidden');
  }
  
  /**
   * Hiển thị thông báo toast
   */
  function showToast(message, type = "info") {
    let toastContainer = document.getElementById('toast-container');
    
    // Tạo container nếu chưa có
    if (!toastContainer) {
      toastContainer = document.createElement('div');
      toastContainer.id = 'toast-container';
      toastContainer.className = 'fixed bottom-4 right-4 z-50';
      document.body.appendChild(toastContainer);
    }
    
    // Tạo thông báo
    const toast = document.createElement('div');
    toast.classList.add(
      'flex', 'items-center', 'p-4', 'mb-3', 'rounded-md', 'shadow-md', 
      'max-w-md', 'animate-fadeIn'
    );
    
    // Áp dụng màu sắc dựa trên loại thông báo
    if (type === "success") {
      toast.classList.add('bg-green-50', 'border-l-4', 'border-green-500');
    } else if (type === "error") {
      toast.classList.add('bg-red-50', 'border-l-4', 'border-red-500');
    } else {
      toast.classList.add('bg-blue-50', 'border-l-4', 'border-blue-500');
    }
    
    // Nội dung thông báo
    toast.innerHTML = `
      <div class="flex-shrink-0 mr-3">
        ${getToastIcon(type)}
      </div>
      <div class="flex-1">
        <p class="text-sm font-medium text-gray-900">${message}</p>
      </div>
      <div class="ml-4 flex-shrink-0 flex">
        <button class="inline-flex text-gray-400 hover:text-gray-500 focus:outline-none">
          <i class="ri-close-line"></i>
        </button>
      </div>
    `;
    
    // Thêm vào container
    toastContainer.appendChild(toast);
    
    // Xử lý đóng thông báo
    toast.querySelector('button').addEventListener('click', () => {
      toast.classList.add('animate-fadeOut');
      setTimeout(() => {
        if (toast.parentNode) {
          toast.remove();
        }
      }, 300);
    });
    
    // Tự động ẩn sau 5 giây
    setTimeout(() => {
      if (toast.parentNode) {
        toast.classList.add('animate-fadeOut');
        setTimeout(() => {
          if (toast.parentNode) {
            toast.remove();
          }
        }, 300);
      }
    }, 5000);
  }
  
  /**
   * Lấy biểu tượng cho thông báo toast
   */
  function getToastIcon(type) {
    if (type === "success") {
      return '<i class="fas fa-check-circle text-green-500"></i>';
    } else if (type === "error") {
      return '<i class="fas fa-exclamation-circle text-red-500"></i>';
    } else {
      return '<i class="fas fa-info-circle text-blue-500"></i>';
    }
  }
  
  // Khởi tạo trang khi DOM đã sẵn sàng
  document.addEventListener('DOMContentLoaded', initialize);
})(); 