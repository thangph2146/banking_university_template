/**
 * Trang chi tiết loại người dùng - Banking University
 * File: user-type-detail.js
 * 
 * Chức năng:
 * - Hiển thị thông tin chi tiết loại người dùng
 * - Hiển thị danh sách người dùng thuộc loại này
 * - Xử lý chuyển hướng tới trang chỉnh sửa
 */

// IIFE để đóng gói module
(function() {
  'use strict';

  // --------------------------------------------------
  // Constants & Global Variables
  // --------------------------------------------------
  let userTypeId = null; // ID của loại người dùng đang xem
  let userTypeData = null; // Dữ liệu của loại người dùng
  let usersList = []; // Danh sách người dùng thuộc loại này
  let usersCurrentPage = 1; // Trang hiện tại của danh sách người dùng
  let usersItemsPerPage = 10; // Số lượng người dùng mỗi trang (có thể thay đổi qua select)

  // Lấy danh sách quyền từ file khác hoặc API endpoint thực tế
  // Tạm thời sử dụng biến từ user-type-edit.js (cần đảm bảo biến này global hoặc import)
  // Giả sử permissionsList đã tồn tại trong scope này
  const permissionsList = [
    { id: "view_all", name: "Xem tất cả dữ liệu", description: "Xem tất cả dữ liệu trong hệ thống", group: "Quản trị" },
    { id: "edit_all", name: "Chỉnh sửa dữ liệu", description: "Chỉnh sửa tất cả dữ liệu trong hệ thống", group: "Quản trị" },
    { id: "delete_all", name: "Xóa dữ liệu", description: "Xóa tất cả dữ liệu trong hệ thống", group: "Quản trị" },
    { id: "manage_users", name: "Quản lý người dùng", description: "Quản lý tài khoản người dùng", group: "Quản trị" },
    { id: "manage_events", name: "Quản lý sự kiện", description: "Quản lý tất cả sự kiện", group: "Sự kiện" },
    { id: "manage_settings", name: "Quản lý cài đặt", description: "Quản lý cài đặt hệ thống", group: "Quản trị" },
    { id: "view_events", name: "Xem sự kiện", description: "Xem danh sách sự kiện", group: "Sự kiện" },
    { id: "create_events", name: "Tạo sự kiện", description: "Tạo sự kiện mới", group: "Sự kiện" },
    { id: "edit_own_events", name: "Sửa sự kiện cá nhân", description: "Chỉnh sửa sự kiện đã tạo", group: "Sự kiện" },
    { id: "view_students", name: "Xem sinh viên", description: "Xem danh sách sinh viên", group: "Người dùng" },
    { id: "register_events", name: "Đăng ký sự kiện", description: "Đăng ký tham gia sự kiện", group: "Sự kiện" },
    { id: "view_own_profile", name: "Xem hồ sơ cá nhân", description: "Xem thông tin cá nhân", group: "Người dùng" },
    { id: "register_alumni_events", name: "Đăng ký sự kiện cựu sinh viên", description: "Đăng ký sự kiện dành cho cựu sinh viên", group: "Sự kiện" },
    { id: "manage_own_department", name: "Quản lý phòng ban", description: "Quản lý thông tin phòng ban của mình", group: "Phòng ban" },
    { id: "view_reports", name: "Xem báo cáo", description: "Xem báo cáo thống kê", group: "Báo cáo" },
    { id: "view_public_events", name: "Xem sự kiện công khai", description: "Xem các sự kiện công khai", group: "Sự kiện" }
  ];

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

  // Danh sách người dùng mẫu
  const usersMockData = [
    {
      id: 1,
      name: "Nguyễn Văn A",
      email: "nguyenvana@example.com",
      phone: "0901234567",
      status: "active",
      userTypeId: 1,
      joinedDate: "2023-01-16T10:30:00Z"
    },
    {
      id: 2,
      name: "Trần Thị B",
      email: "tranthib@example.com",
      phone: "0901234568",
      status: "active",
      userTypeId: 1,
      joinedDate: "2023-01-17T11:45:00Z"
    },
    {
      id: 3,
      name: "Lê Văn C",
      email: "levanc@example.com",
      phone: "0901234569",
      status: "active",
      userTypeId: 1,
      joinedDate: "2023-01-18T09:15:00Z"
    },
    {
      id: 4,
      name: "Phạm Thị D",
      email: "phamthid@example.com",
      phone: "0901234570",
      status: "inactive",
      userTypeId: 1,
      joinedDate: "2023-01-19T14:20:00Z"
    },
    {
      id: 5,
      name: "Hoàng Văn E",
      email: "hoangvane@example.com",
      phone: "0901234571",
      status: "active",
      userTypeId: 1,
      joinedDate: "2023-01-20T16:10:00Z"
    },
    {
      id: 6,
      name: "Nguyễn Thị F",
      email: "nguyenthif@example.com",
      phone: "0901234572",
      status: "active",
      userTypeId: 2,
      joinedDate: "2023-01-21T08:30:00Z"
    },
    {
      id: 7,
      name: "Trần Văn G",
      email: "tranvang@example.com",
      phone: "0901234573",
      status: "active",
      userTypeId: 2,
      joinedDate: "2023-01-22T10:45:00Z"
    }
    // ... Add more user data for pagination testing
  ];

  // --------------------------------------------------
  // DOM Elements Cache
  // --------------------------------------------------
  const $elements = {
      loadingIndicator: document.getElementById('loading-indicator'),
      errorContainer: document.getElementById('error-container'),
      errorMessage: document.getElementById('error-message'),
      errorDetail: document.getElementById('error-detail'),
      retryButton: document.getElementById('retry-button'),
      detailContainer: document.getElementById('user-type-detail'),
      userTypeNameBreadcrumb: document.getElementById('user-type-name-breadcrumb'),
      userTypeIdDisplay: document.getElementById('user-type-id'),
      userTypeNameDisplay: document.getElementById('user-type-name'),
      userTypeDescriptionDisplay: document.getElementById('user-type-description'),
      userTypeStatusDisplay: document.getElementById('user-type-status'),
      userTypeCreatedAtDisplay: document.getElementById('user-type-created-at'),
      userTypeUpdatedAtDisplay: document.getElementById('user-type-updated-at'),
      userTypeUserCountDisplay: document.getElementById('user-type-user-count'),
      userTypeActiveUserCountDisplay: document.getElementById('user-type-active-user-count'),
      userTypeInactiveUserCountDisplay: document.getElementById('user-type-inactive-user-count'),
      userTypeUserCountBar: document.getElementById('user-type-user-count-bar'),
      userTypeActiveUserCountBar: document.getElementById('user-type-active-user-count-bar'),
      userTypeInactiveUserCountBar: document.getElementById('user-type-inactive-user-count-bar'),
      permissionsListContainer: document.getElementById('permissions-list'),
      permissionsCountDisplay: document.getElementById('permissions-count'),
      editButton: document.getElementById('edit-user-type-button'),
      usersListBody: document.getElementById('users-list'),
      noUsersMessage: document.getElementById('no-users-message'),
      usersPaginationContainer: document.getElementById('users-pagination'),
      usersPerPageSelect: document.getElementById('users-per-page'),
      usersTotalItemsDisplay: document.getElementById('users-total-items'),
      usersPaginationControls: document.getElementById('users-pagination-controls'),
      usersCurrentPageInput: document.getElementById('users-current-page-input'),
      usersTotalPagesDisplay: document.getElementById('users-total-pages-count'),
      usersBtnFirst: document.querySelector('.users-btn-first'),
      usersBtnPrev: document.querySelector('.users-btn-prev'),
      usersBtnNext: document.querySelector('.users-btn-next'),
      usersBtnLast: document.querySelector('.users-btn-last'),
      // Sidebar elements
      sidebar: document.getElementById('sidebar'),
      sidebarOpen: document.getElementById('sidebar-open'),
      sidebarClose: document.getElementById('sidebar-close'),
      sidebarBackdrop: document.getElementById('sidebar-backdrop'),
      // User menu elements
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
    // Khởi tạo animation
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            once: true
        });
    } else {
        console.warn('AOS library not found.');
    }
    
    // Khởi tạo sidebar và user menu
    initSidebar();
    initUserMenu();
    
    // Tạo container cho toast nếu chưa có
    ensureToastContainerExists();

    // Lấy userTypeId từ tham số URL
    userTypeId = getIdFromUrl();
    
    if (!userTypeId) {
      showError("Không tìm thấy ID loại người dùng trong URL", "Vui lòng kiểm tra lại đường dẫn.");
      return;
    }
    
    // Thiết lập các sự kiện
    setupEventListeners();

    // Load dữ liệu và hiển thị
    loadUserTypeDetails();
  }

  /**
   * Tạo container cho toast nếu chưa tồn tại (nhất quán với edit.js)
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
   * Khởi tạo sidebar cho mobile (nhất quán với edit.js)
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
   * Khởi tạo menu người dùng (nhất quán với edit.js)
   */
  function initUserMenu() {
      const { userMenuButton, userMenu } = $elements;
      
      if (userMenuButton && userMenu) {
          userMenuButton.addEventListener('click', (event) => {
              event.stopPropagation(); // Ngăn chặn sự kiện click lan ra document
              const isVisible = !userMenu.classList.contains('hidden'); // Kiểm tra class hidden
              if (isVisible) {
                  userMenu.classList.add('hidden');
              } else {
                  userMenu.classList.remove('hidden');
              }
          });

          // Đóng menu khi click bên ngoài
          document.addEventListener('click', (e) => {
            if (userMenuButton && userMenu && !userMenuButton.contains(e.target) && !userMenu.contains(e.target)) {
               userMenu.classList.add('hidden');
            }
         });
      }
  }

  /**
   * Lấy ID từ tham số URL
   */
  function getIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    return id ? parseInt(id) : null; // Parse thành số nguyên
  }

  /**
   * Thiết lập các sự kiện
   */
  function setupEventListeners() {
    // Nút chỉnh sửa loại người dùng
    if ($elements.editButton) {
        // Cập nhật href trong loadUserTypeDetails khi có userTypeId
    }
    
    // Nút thử lại khi có lỗi
    if ($elements.retryButton) {
        $elements.retryButton.addEventListener('click', loadUserTypeDetails);
    }
    
    // Thay đổi số lượng item/trang
    if ($elements.usersPerPageSelect) {
        $elements.usersPerPageSelect.addEventListener('change', (e) => {
            usersItemsPerPage = parseInt(e.target.value);
            usersCurrentPage = 1; // Reset về trang đầu khi thay đổi số lượng
            displayUsersList();
        });
    }

    // Input trang hiện tại
    if ($elements.usersCurrentPageInput) {
        $elements.usersCurrentPageInput.addEventListener('change', (e) => {
            const targetPage = parseInt(e.target.value);
            const totalPages = Math.ceil(usersList.length / usersItemsPerPage);
            // Chấp nhận 0 nếu totalPages = 0
            const maxPage = totalPages > 0 ? totalPages : 1;
            if (targetPage >= 1 && targetPage <= maxPage) {
                navigateUserListPage(targetPage);
            } else {
                // Reset input về trang hiện tại nếu nhập không hợp lệ
                e.target.value = usersCurrentPage;
            }
        });
         // Ngăn chặn việc nhập số âm hoặc 0
         $elements.usersCurrentPageInput.addEventListener('input', (e) => {
              if (parseInt(e.target.value) < 1) {
                  e.target.value = 1;
              }
         });
    }

    // Nút điều hướng phân trang
    if ($elements.usersBtnFirst) $elements.usersBtnFirst.addEventListener('click', () => navigateUserListPage(1));
    if ($elements.usersBtnPrev) $elements.usersBtnPrev.addEventListener('click', () => navigateUserListPage(usersCurrentPage - 1));
    if ($elements.usersBtnNext) $elements.usersBtnNext.addEventListener('click', () => navigateUserListPage(usersCurrentPage + 1));
    if ($elements.usersBtnLast) {
        $elements.usersBtnLast.addEventListener('click', () => {
            const totalPages = Math.ceil(usersList.length / usersItemsPerPage);
            navigateUserListPage(totalPages > 0 ? totalPages : 1);
        });
    }
  }

  // --------------------------------------------------
  // Data Loading & Display
  // --------------------------------------------------

  /**
   * Tải chi tiết loại người dùng
   */
  function loadUserTypeDetails() {
    showLoading(true);
    hideError();
    
    // Cập nhật link nút Edit ngay khi có ID
    if ($elements.editButton && userTypeId) {
       $elements.editButton.href = `user-type-edit.html?id=${userTypeId}`;
    }

    // Giả lập gọi API
    setTimeout(() => {
      try {
        userTypeData = userTypesMockData.find(type => type.id == userTypeId);
        
        if (!userTypeData) {
          showError("Không tìm thấy loại người dùng với ID đã cung cấp.", "Vui lòng quay lại trang danh sách.");
          return;
        }
        
        // Hiển thị thông tin loại người dùng
        displayUserTypeInfo();
        
        // Tải danh sách người dùng thuộc loại này
        loadUsersByType();
        
        // Hiển thị container chi tiết
        if ($elements.detailContainer) {
            $elements.detailContainer.classList.remove('hidden');
        }
        showLoading(false);
      } catch (error) {
        console.error("Lỗi khi tải chi tiết loại người dùng:", error);
        showError("Có lỗi khi tải thông tin chi tiết", error.message);
      }
    }, 500);
  }

  /**
   * Hiển thị thông tin của loại người dùng
   */
  function displayUserTypeInfo() {
    if (!userTypeData) return;
    
    // Cập nhật breadcrumb
    if ($elements.userTypeNameBreadcrumb) {
        $elements.userTypeNameBreadcrumb.textContent = `: ${userTypeData.name}`;
    }
    
    // Thông tin cơ bản
    if ($elements.userTypeIdDisplay) $elements.userTypeIdDisplay.textContent = userTypeData.id;
    if ($elements.userTypeNameDisplay) $elements.userTypeNameDisplay.textContent = userTypeData.name;
    if ($elements.userTypeDescriptionDisplay) $elements.userTypeDescriptionDisplay.textContent = userTypeData.description || "-";
    if ($elements.userTypeStatusDisplay) $elements.userTypeStatusDisplay.innerHTML = getStatusBadge(userTypeData.status);
    if ($elements.userTypeCreatedAtDisplay) $elements.userTypeCreatedAtDisplay.textContent = formatDateTime(userTypeData.createdAt);
    if ($elements.userTypeUpdatedAtDisplay) $elements.userTypeUpdatedAtDisplay.textContent = formatDateTime(userTypeData.updatedAt);
    
    // Thống kê
    if ($elements.userTypeUserCountDisplay) $elements.userTypeUserCountDisplay.textContent = userTypeData.userCount;
    if ($elements.userTypeActiveUserCountDisplay) $elements.userTypeActiveUserCountDisplay.textContent = userTypeData.activeUserCount;
    if ($elements.userTypeInactiveUserCountDisplay) $elements.userTypeInactiveUserCountDisplay.textContent = userTypeData.inactiveUserCount;
    
    // Cập nhật các thanh tiến trình
    updateProgressBars();
    
    // Hiển thị danh sách quyền hạn
    displayPermissions();
  }

  /**
   * Cập nhật các thanh tiến trình
   */
  function updateProgressBars() {
    const userCount = userTypeData?.userCount ?? 0;
    
    let activePercent = 0;
    let inactivePercent = 0;
    let totalPercent = 0;

    if (userCount > 0) {
      activePercent = (userTypeData.activeUserCount / userCount) * 100;
      inactivePercent = (userTypeData.inactiveUserCount / userCount) * 100;
      totalPercent = 100; // Thanh tổng luôn đầy nếu có user
    }
        
    if ($elements.userTypeUserCountBar) $elements.userTypeUserCountBar.style.width = `${totalPercent}%`;
    if ($elements.userTypeActiveUserCountBar) $elements.userTypeActiveUserCountBar.style.width = `${activePercent}%`;
    if ($elements.userTypeInactiveUserCountBar) $elements.userTypeInactiveUserCountBar.style.width = `${inactivePercent}%`;
  }

  /**
   * Hiển thị danh sách quyền hạn (nhất quán với edit.js)
   */
  function displayPermissions() {
    const container = $elements.permissionsListContainer;
    const countDisplay = $elements.permissionsCountDisplay;
    if (!container || !userTypeData) return;
    
    container.innerHTML = ''; // Xóa nội dung cũ
    const assignedPermissions = userTypeData.permissions || [];
    
    if (assignedPermissions.length === 0) {
      container.innerHTML = '<p class="text-gray-500 italic col-span-full">Không có quyền hạn nào được cấp.</p>';
      if (countDisplay) countDisplay.textContent = 0;
      return;
    }

    if (countDisplay) countDisplay.textContent = assignedPermissions.length;
    
    assignedPermissions.forEach(permissionId => {
      const permissionData = permissionsList.find(p => p.id === permissionId);
      
      const permissionElement = document.createElement('div');
      permissionElement.className = 'border rounded-md p-3 bg-gray-50'; // Style for detail view
      
      const name = permissionData?.name || permissionId;
      const description = permissionData?.description || 'Không có mô tả';
      
      // Sử dụng icon nhất quán hơn (ví dụ: ri-check-line)
      permissionElement.innerHTML = `
        <div class="flex items-start">
          <i class="ri-checkbox-circle-fill text-primary mt-0.5 mr-2 text-base"></i> 
          <div>
            <p class="text-sm font-medium text-gray-800">${name}</p>
            <p class="text-xs text-gray-500 mt-0.5">${description}</p>
          </div>
        </div>
      `;
      
      container.appendChild(permissionElement);
    });
  }

  // --------------------------------------------------
  // User List Handling
  // --------------------------------------------------

  /**
   * Tải danh sách người dùng thuộc loại người dùng này
   */
  function loadUsersByType() {
    // Lọc danh sách người dùng mẫu
    // Trong ứng dụng thực tế, đây sẽ là một API call với userTypeId
    usersList = usersMockData.filter(user => user.userTypeId == userTypeId);
    
    // Cập nhật badge số lượng người dùng
    const userCountBadge = document.getElementById('user-count-badge');
    if (userCountBadge) {
        userCountBadge.textContent = `${usersList.length} người dùng`;
    }
    
    // Reset phân trang và hiển thị
    usersCurrentPage = 1;
    if ($elements.usersCurrentPageInput) $elements.usersCurrentPageInput.value = 1;
    displayUsersList(); 
  }

  /**
   * Hiển thị danh sách người dùng với phân trang
   */
  function displayUsersList() {
    if (!$elements.usersListBody || !$elements.usersPaginationContainer || !$elements.noUsersMessage) return;
    
    const totalItems = usersList.length;
    const totalPages = Math.ceil(totalItems / usersItemsPerPage);

    if (totalItems === 0) {
        $elements.usersListBody.innerHTML = ''; // Clear table body
        $elements.noUsersMessage.classList.remove('hidden');
        $elements.usersPaginationContainer.classList.add('hidden');
        return;
    }

    $elements.noUsersMessage.classList.add('hidden');
    $elements.usersPaginationContainer.classList.remove('hidden');

    const startIndex = (usersCurrentPage - 1) * usersItemsPerPage;
    const endIndex = Math.min(startIndex + usersItemsPerPage, totalItems);
    const currentUsers = usersList.slice(startIndex, endIndex);
    
    // Xóa nội dung cũ
    $elements.usersListBody.innerHTML = '';
    
    // Thêm người dùng vào bảng
    currentUsers.forEach(user => {
      const row = $elements.usersListBody.insertRow();
      row.className = 'hover:bg-gray-50 transition-colors duration-150';
      
      row.innerHTML = `
        <td class="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
          ${user.id}
        </td>
        <td class="px-6 py-3 whitespace-nowrap">
          <div class="flex items-center">
            <%-- Optional avatar --%>
            <%-- <img class="h-8 w-8 rounded-full mr-3" src="..." alt=""> --%>
            <div>
              <div class="text-sm font-medium text-gray-900">${user.name}</div>
            </div>
          </div>
        </td>
        <td class="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
          ${user.email || '-'}
        </td>
        <td class="px-6 py-3 whitespace-nowrap">
          ${getStatusBadge(user.status)}
        </td>
        <td class="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
          ${formatDateTime(user.joinedDate)}
        </td>
        <td class="px-6 py-3 whitespace-nowrap text-right text-sm font-medium space-x-1">
          <a href="user-detail.html?id=${user.id}" class="text-primary hover:text-primary-dark p-1 inline-block" title="Xem chi tiết">
            <i class="ri-eye-line text-base"></i>
          </a>
          <a href="user-edit.html?id=${user.id}" class="text-blue-600 hover:text-blue-800 p-1 inline-block" title="Chỉnh sửa">
            <i class="ri-edit-line text-base"></i>
          </a>
          <%-- Optional: Delete button --%>
          <%-- <button class="text-red-600 hover:text-red-800 p-1 inline-block" title="Xóa">
            <i class="ri-delete-bin-line text-base"></i>
          </button> --%>
        </td>
      `;
    });
    
    // Cập nhật thông tin phân trang
    updateUsersPaginationInfo(startIndex, endIndex, totalItems, totalPages);
    
    // Cập nhật trạng thái các nút điều hướng
    updatePaginationControls(totalPages);
  }

  /**
   * Điều hướng đến trang được chỉ định trong danh sách người dùng
   */
  function navigateUserListPage(page) {
    const totalPages = Math.ceil(usersList.length / usersItemsPerPage);
    const maxPage = totalPages > 0 ? totalPages : 1;
    
    // Đảm bảo trang hợp lệ
    if (page < 1) page = 1;
    if (page > maxPage) page = maxPage;

    if (page !== usersCurrentPage) { 
        usersCurrentPage = page;
        if ($elements.usersCurrentPageInput) $elements.usersCurrentPageInput.value = usersCurrentPage;
        displayUsersList();
    }
  }

  /**
   * Cập nhật thông tin hiển thị của phân trang
   */
  function updateUsersPaginationInfo(startIndex, endIndex, totalItems, totalPages) {
    const currentPageVal = totalPages > 0 ? usersCurrentPage : 1;
    const totalPagesVal = totalPages > 0 ? totalPages : 1;
    
    if ($elements.usersTotalItemsDisplay) $elements.usersTotalItemsDisplay.textContent = totalItems;
    if ($elements.usersTotalPagesDisplay) $elements.usersTotalPagesDisplay.textContent = totalPagesVal;
    if ($elements.usersCurrentPageInput) {
        $elements.usersCurrentPageInput.value = currentPageVal;
        $elements.usersCurrentPageInput.max = totalPagesVal;
    }
  }

  /**
   * Cập nhật trạng thái (enabled/disabled) của các nút điều hướng phân trang
   */
  function updatePaginationControls(totalPages) {
      const currentPageVal = totalPages > 0 ? usersCurrentPage : 1;
      const totalPagesVal = totalPages > 0 ? totalPages : 1;
      const isFirstPage = currentPageVal === 1;
      const isLastPage = currentPageVal === totalPagesVal;

      [$elements.usersBtnFirst, $elements.usersBtnPrev].forEach(btn => {
          if(btn) btn.disabled = isFirstPage;
      });

      [$elements.usersBtnNext, $elements.usersBtnLast].forEach(btn => {
          if(btn) btn.disabled = isLastPage;
      });
  }

  // --------------------------------------------------
  // UI Feedback (Loading, Error, Toast)
  // --------------------------------------------------

  /**
   * Hiển thị hoặc ẩn trạng thái loading chính
   */
  function showLoading(show) {
    const { loadingIndicator, detailContainer } = $elements;
    if (loadingIndicator) {
        loadingIndicator.classList.toggle('hidden', !show);
    }
    if (detailContainer) {
        // Hide detail container when loading, show when not loading (if data fetch succeeded)
        detailContainer.classList.toggle('hidden', show);
    }
  }

  /**
   * Hiển thị thông báo lỗi chính
   */
  function showError(message, detail = '') {
    const { errorContainer, errorMessage, errorDetail, loadingIndicator, detailContainer } = $elements;
    
    if (errorMessage) errorMessage.textContent = message || "Đã có lỗi xảy ra.";
    if (errorDetail) errorDetail.textContent = detail || 'Vui lòng tải lại trang hoặc liên hệ quản trị viên.';
    
    if (errorContainer) errorContainer.classList.remove('hidden');
    if (loadingIndicator) loadingIndicator.classList.add('hidden'); // Hide loading if error occurs
    if (detailContainer) detailContainer.classList.add('hidden'); // Hide detail container on error
  }

  /**
   * Ẩn thông báo lỗi chính
   */
  function hideError() {
    const { errorContainer } = $elements;
    if (errorContainer) {
        errorContainer.classList.add('hidden');
    }
  }

  /**
   * Tạo badge hiển thị trạng thái (nhất quán với edit.js)
   */
  function getStatusBadge(status) {
    if (status === 'active') {
      return `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <svg class="-ml-0.5 mr-1.5 h-2 w-2 text-green-400" fill="currentColor" viewBox="0 0 8 8">
                  <circle cx="4" cy="4" r="3" />
                </svg>
                Hoạt động
              </span>`;
    } else {
      return `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                <svg class="-ml-0.5 mr-1.5 h-2 w-2 text-red-400" fill="currentColor" viewBox="0 0 8 8">
                  <circle cx="4" cy="4" r="3" />
                </svg>
                Không hoạt động
              </span>`;
    }
  }

  /**
   * Format thời gian dạng datetime (nhất quán với edit.js)
   */
  function formatDateTime(dateTimeStr) {
    if (!dateTimeStr) return '-'; // Return dash if no date
    try {
      const date = new Date(dateTimeStr);
      // Kiểm tra xem date có hợp lệ không
      if (isNaN(date.getTime())) {
        return 'Ngày không hợp lệ';
      }
      return new Intl.DateTimeFormat('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    } catch (error) {
      console.error("Lỗi định dạng ngày:", error);
      return 'Lỗi định dạng ngày';
    }
  }

  // --------------------------------------------------
  // Toast Notifications (Copied from create.js / edit.js)
  // --------------------------------------------------

  /**
   * Hiển thị thông báo toast
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
    // Add animation classes if available (optional)
    const animationClass = typeof addAnimationStyles === 'function' ? ' animate-fadeIn' : '';
    toast.className = `flex items-center p-4 mb-3 w-full max-w-xs rounded-lg shadow ${getToastBgColor(type)}${animationClass}`;
    toast.setAttribute('role', 'alert');

    toast.innerHTML = `
        <div class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 ${getToastIconBgColor(type)} rounded-lg">
            ${getToastIcon(type)}
        </div>
        <div class="ml-3 text-sm font-normal">${message}</div>
        <button type="button" class="ml-auto -mx-1.5 -my-1.5 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 inline-flex h-8 w-8 ${getToastCloseButtonColor(type)}" data-dismiss-target="#${toastId}" aria-label="Close">
            <span class="sr-only">Đóng</span>
            <i class="ri-close-line"></i>
        </button>
    `;

    toastContainer.prepend(toast);

    const closeButton = toast.querySelector('button');
    const removeToast = () => {
      // Add fadeOut animation if available
      if (toast.classList.contains('animate-fadeIn')) {
        toast.classList.remove('animate-fadeIn');
        toast.classList.add('animate-fadeOut');
        setTimeout(() => {
          if (toast.parentNode) toast.remove();
        }, 300); // Match animation duration
      } else {
        if (toast.parentNode) toast.remove();
      }
    };

    closeButton.addEventListener('click', removeToast);

    // Auto dismiss
    setTimeout(removeToast, 5000);
  }

  /**
   * Lấy màu nền cho toast (giống create.js)
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
   * Lấy màu nền cho icon toast (giống create.js)
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
   * Lấy màu cho nút đóng toast (giống create.js)
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
   * Lấy icon cho toast (giống create.js)
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

})(); // End IIFE