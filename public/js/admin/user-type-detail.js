/**
 * Trang chi tiết loại người dùng - Banking University
 * File: user-type-detail.js
 * 
 * Chức năng:
 * - Hiển thị thông tin chi tiết loại người dùng
 * - Hiển thị danh sách người dùng thuộc loại này
 * - Xử lý chuyển hướng tới trang chỉnh sửa
 */

// Biến toàn cục
let userTypeId = null; // ID của loại người dùng đang xem
let userTypeData = null; // Dữ liệu của loại người dùng
let usersList = []; // Danh sách người dùng thuộc loại này
let currentPage = 1; // Trang hiện tại của danh sách người dùng
const itemsPerPage = 5; // Số lượng người dùng mỗi trang

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
];

// Danh sách quyền hạn
const permissionDescriptions = {
  "view_all": "Xem tất cả dữ liệu trong hệ thống",
  "edit_all": "Chỉnh sửa tất cả dữ liệu trong hệ thống",
  "delete_all": "Xóa tất cả dữ liệu trong hệ thống",
  "manage_users": "Quản lý người dùng",
  "manage_events": "Quản lý sự kiện",
  "manage_settings": "Quản lý cài đặt hệ thống",
  "view_events": "Xem danh sách sự kiện",
  "create_events": "Tạo sự kiện mới",
  "edit_own_events": "Chỉnh sửa sự kiện đã tạo",
  "view_students": "Xem danh sách sinh viên",
  "register_events": "Đăng ký tham gia sự kiện",
  "view_own_profile": "Xem thông tin cá nhân",
  "register_alumni_events": "Đăng ký sự kiện dành cho cựu sinh viên",
  "manage_own_department": "Quản lý thông tin phòng ban của mình",
  "view_reports": "Xem báo cáo thống kê",
  "view_public_events": "Xem sự kiện công khai"
};

// DOM ready
document.addEventListener('DOMContentLoaded', function() {
  // Khởi tạo animation
  AOS.init({
    duration: 800,
    once: true
  });
  
  // Thiết lập sự kiện cho sidebar
  initSidebar();
  
  // Thiết lập sự kiện cho user menu
  initUserMenu();
  
  // Lấy userTypeId từ tham số URL
  userTypeId = getIdFromUrl();
  
  if (!userTypeId) {
    showError("Không tìm thấy ID loại người dùng trong URL");
    return;
  }
  
  // Load dữ liệu và hiển thị
  loadUserTypeDetails();
  
  // Thiết lập các sự kiện
  setupEventListeners();
});

/**
 * Khởi tạo sidebar cho mobile
 */
function initSidebar() {
  const sidebar = document.getElementById('sidebar');
  const sidebarBackdrop = document.getElementById('sidebar-backdrop');
  const sidebarOpen = document.getElementById('sidebar-open');
  const sidebarClose = document.getElementById('sidebar-close');
  
  sidebarOpen?.addEventListener('click', () => {
    sidebar.classList.remove('-translate-x-full');
    sidebarBackdrop.classList.remove('hidden');
  });
  
  sidebarClose?.addEventListener('click', () => {
    sidebar.classList.add('-translate-x-full');
    sidebarBackdrop.classList.add('hidden');
  });
  
  sidebarBackdrop?.addEventListener('click', () => {
    sidebar.classList.add('-translate-x-full');
    sidebarBackdrop.classList.add('hidden');
  });
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
 * Lấy ID từ tham số URL
 */
function getIdFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('id');
}

/**
 * Thiết lập các sự kiện
 */
function setupEventListeners() {
  // Nút chỉnh sửa loại người dùng
  const editButton = document.getElementById('edit-user-type-button');
  editButton?.addEventListener('click', function(e) {
    e.preventDefault();
    window.location.href = `user-type-edit.html?id=${userTypeId}`;
  });
  
  // Nút xóa loại người dùng
  const deleteButton = document.getElementById('delete-user-type');
  deleteButton?.addEventListener('click', function(e) {
    e.preventDefault();
    confirmDeleteUserType();
  });
  
  // Nút thử lại khi có lỗi
  const retryButton = document.getElementById('retry-button');
  retryButton?.addEventListener('click', function() {
    loadUserTypeDetails();
  });
  
  // Phân trang trong danh sách người dùng
  document.getElementById('users-prev-page')?.addEventListener('click', () => navigateUserListPage(currentPage - 1));
  document.getElementById('users-next-page')?.addEventListener('click', () => navigateUserListPage(currentPage + 1));
  document.getElementById('users-prev-page-mobile')?.addEventListener('click', () => navigateUserListPage(currentPage - 1));
  document.getElementById('users-next-page-mobile')?.addEventListener('click', () => navigateUserListPage(currentPage + 1));
}

/**
 * Tải chi tiết loại người dùng
 */
function loadUserTypeDetails() {
  showLoading(true);
  hideError();
  
  // Giả lập gọi API
  setTimeout(() => {
    try {
      // Tìm loại người dùng theo ID
      userTypeData = userTypesMockData.find(type => type.id == userTypeId);
      
      if (!userTypeData) {
        showError("Không tìm thấy loại người dùng với ID đã cung cấp");
        return;
      }
      
      // Hiển thị thông tin loại người dùng
      displayUserTypeInfo();
      
      // Tải danh sách người dùng thuộc loại này
      loadUsersByType();
      
      showLoading(false);
    } catch (error) {
      showError("Có lỗi khi tải thông tin: " + error.message);
    }
  }, 500);
}

/**
 * Hiển thị thông tin của loại người dùng
 */
function displayUserTypeInfo() {
  // Cập nhật breadcrumb
  document.getElementById('user-type-name-breadcrumb').textContent = userTypeData.name;
  
  // Thông tin cơ bản
  document.getElementById('user-type-id').textContent = userTypeData.id;
  document.getElementById('user-type-name').textContent = userTypeData.name;
  document.getElementById('user-type-description').textContent = userTypeData.description || "Không có mô tả";
  document.getElementById('user-type-status').innerHTML = getStatusBadge(userTypeData.status);
  document.getElementById('user-type-created-at').textContent = formatDateTime(userTypeData.createdAt);
  document.getElementById('user-type-updated-at').textContent = formatDateTime(userTypeData.updatedAt);
  
  // Thống kê
  document.getElementById('user-type-user-count').textContent = userTypeData.userCount;
  document.getElementById('user-type-active-user-count').textContent = userTypeData.activeUserCount;
  document.getElementById('user-type-inactive-user-count').textContent = userTypeData.inactiveUserCount;
  
  // Cập nhật các thanh tiến trình
  updateProgressBars();
  
  // Hiển thị danh sách quyền hạn
  displayPermissions();
}

/**
 * Cập nhật các thanh tiến trình
 */
function updateProgressBars() {
  // Tính toán phần trăm người dùng hoạt động và không hoạt động
  const userCount = userTypeData.userCount;
  
  if (userCount > 0) {
    const activePercent = (userTypeData.activeUserCount / userCount) * 100;
    const inactivePercent = (userTypeData.inactiveUserCount / userCount) * 100;
    
    // Cập nhật chiều rộng của các thanh tiến trình
    document.getElementById('user-type-user-count-bar').style.width = "100%";
    document.getElementById('user-type-active-user-count-bar').style.width = `${activePercent}%`;
    document.getElementById('user-type-inactive-user-count-bar').style.width = `${inactivePercent}%`;
  } else {
    // Nếu không có người dùng, đặt tất cả về 0%
    document.getElementById('user-type-user-count-bar').style.width = "0%";
    document.getElementById('user-type-active-user-count-bar').style.width = "0%";
    document.getElementById('user-type-inactive-user-count-bar').style.width = "0%";
  }
}

/**
 * Hiển thị danh sách quyền hạn
 */
function displayPermissions() {
  const permissionsList = document.getElementById('permissions-list');
  permissionsList.innerHTML = '';
  
  if (!userTypeData.permissions || userTypeData.permissions.length === 0) {
    permissionsList.innerHTML = '<p class="text-gray-500 italic">Không có quyền hạn nào được cấp</p>';
    return;
  }
  
  userTypeData.permissions.forEach(permission => {
    const permissionElement = document.createElement('div');
    permissionElement.className = 'bg-gray-50 p-3 rounded-md border border-gray-200';
    
    const description = permissionDescriptions[permission] || permission;
    
    permissionElement.innerHTML = `
      <div class="flex items-start">
        <i class="fas fa-check-circle text-green-500 mt-0.5 mr-2"></i>
        <div>
          <p class="text-sm font-medium text-gray-900">${permission}</p>
          <p class="text-xs text-gray-500">${description}</p>
        </div>
      </div>
    `;
    
    permissionsList.appendChild(permissionElement);
  });
}

/**
 * Tải danh sách người dùng thuộc loại người dùng này
 */
function loadUsersByType() {
  // Lọc danh sách người dùng theo loại
  usersList = usersMockData.filter(user => user.userTypeId == userTypeId);
  
  // Cập nhật badge số lượng người dùng
  document.getElementById('user-count-badge').textContent = `${usersList.length} người dùng`;
  
  // Hiển thị danh sách người dùng hoặc thông báo trống
  if (usersList.length === 0) {
    document.getElementById('no-users-message').classList.remove('hidden');
    document.getElementById('users-pagination').classList.add('hidden');
  } else {
    document.getElementById('no-users-message').classList.add('hidden');
    document.getElementById('users-pagination').classList.remove('hidden');
    
    // Hiển thị người dùng với phân trang
    displayUsersList();
  }
}

/**
 * Hiển thị danh sách người dùng với phân trang
 */
function displayUsersList() {
  const userListElement = document.getElementById('users-list');
  
  // Tính toán phân trang
  const totalPages = Math.ceil(usersList.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, usersList.length);
  const currentUsers = usersList.slice(startIndex, endIndex);
  
  // Xóa nội dung cũ
  userListElement.innerHTML = '';
  
  // Thêm người dùng vào danh sách
  currentUsers.forEach(user => {
    const row = document.createElement('tr');
    
    row.innerHTML = `
      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        ${user.id}
      </td>
      <td class="px-6 py-4 whitespace-nowrap">
        <div class="flex items-center">
          <div class="text-sm font-medium text-gray-900">${user.name}</div>
        </div>
      </td>
      <td class="px-6 py-4 whitespace-nowrap">
        <div class="text-sm text-gray-900">${user.email}</div>
      </td>
      <td class="px-6 py-4 whitespace-nowrap">
        ${getStatusBadge(user.status)}
      </td>
      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        ${formatDateTime(user.joinedDate)}
      </td>
      <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <a href="user-detail.html?id=${user.id}" class="text-primary-600 hover:text-primary-900 p-1" title="Xem chi tiết">
          <i class="fas fa-eye"></i>
        </a>
        <a href="user-edit.html?id=${user.id}" class="text-indigo-600 hover:text-indigo-900 p-1" title="Chỉnh sửa">
          <i class="fas fa-edit"></i>
        </a>
      </td>
    `;
    
    userListElement.appendChild(row);
  });
  
  // Cập nhật thông tin phân trang
  updateUsersPaginationInfo(startIndex, endIndex);
  
  // Tạo các nút phân trang
  createPaginationButtons(totalPages);
  
  // Cập nhật trạng thái các nút điều hướng
  updatePaginationControls(totalPages);
}

/**
 * Điều hướng đến trang được chỉ định trong danh sách người dùng
 */
function navigateUserListPage(page) {
  const totalPages = Math.ceil(usersList.length / itemsPerPage);
  
  // Đảm bảo trang hợp lệ
  if (page < 1 || page > totalPages || page === currentPage) {
    return;
  }
  
  currentPage = page;
  displayUsersList();
}

/**
 * Cập nhật thông tin phân trang
 */
function updateUsersPaginationInfo(startIndex, endIndex) {
  const startItem = usersList.length > 0 ? startIndex + 1 : 0;
  const endItem = Math.min(usersList.length, endIndex);
  
  // Cập nhật cho desktop
  document.getElementById('users-start-item').textContent = startItem;
  document.getElementById('users-end-item').textContent = endItem;
  document.getElementById('users-total-items').textContent = usersList.length;
  
  // Cập nhật cho mobile
  const totalPages = Math.ceil(usersList.length / itemsPerPage);
  document.getElementById('users-current-page-mobile').textContent = currentPage;
  document.getElementById('users-total-pages-mobile').textContent = totalPages;
}

/**
 * Tạo các nút phân trang
 */
function createPaginationButtons(totalPages) {
  const paginationContainer = document.getElementById('users-pagination-numbers');
  paginationContainer.innerHTML = '';
  
  // Giới hạn số lượng nút trang để hiển thị
  const maxVisiblePages = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
  
  if (endPage - startPage + 1 < maxVisiblePages && startPage > 1) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }
  
  // Tạo các nút phân trang
  for (let i = startPage; i <= endPage; i++) {
    const button = document.createElement('button');
    button.innerText = i;
    button.classList.add(
      'relative', 'inline-flex', 'items-center', 'px-4', 'py-2', 'border', 
      'text-sm', 'font-medium', 'bg-white', 'border-gray-300'
    );
    
    if (i === currentPage) {
      button.classList.add('z-10', 'bg-primary-50', 'border-primary-500', 'text-primary-600');
    } else {
      button.classList.add('text-gray-500', 'hover:bg-gray-50');
    }
    
    button.addEventListener('click', () => navigateUserListPage(i));
    paginationContainer.appendChild(button);
  }
}

/**
 * Cập nhật trạng thái các nút điều hướng phân trang
 */
function updatePaginationControls(totalPages) {
  const prevButton = document.getElementById('users-prev-page');
  const nextButton = document.getElementById('users-next-page');
  const prevButtonMobile = document.getElementById('users-prev-page-mobile');
  const nextButtonMobile = document.getElementById('users-next-page-mobile');
  
  // Vô hiệu hóa nút trước nếu đang ở trang đầu tiên
  if (currentPage === 1) {
    prevButton.classList.add('opacity-50', 'cursor-not-allowed');
    prevButtonMobile.classList.add('opacity-50', 'cursor-not-allowed');
    prevButton.disabled = true;
    prevButtonMobile.disabled = true;
  } else {
    prevButton.classList.remove('opacity-50', 'cursor-not-allowed');
    prevButtonMobile.classList.remove('opacity-50', 'cursor-not-allowed');
    prevButton.disabled = false;
    prevButtonMobile.disabled = false;
  }
  
  // Vô hiệu hóa nút sau nếu đang ở trang cuối cùng
  if (currentPage === totalPages || totalPages === 0) {
    nextButton.classList.add('opacity-50', 'cursor-not-allowed');
    nextButtonMobile.classList.add('opacity-50', 'cursor-not-allowed');
    nextButton.disabled = true;
    nextButtonMobile.disabled = true;
  } else {
    nextButton.classList.remove('opacity-50', 'cursor-not-allowed');
    nextButtonMobile.classList.remove('opacity-50', 'cursor-not-allowed');
    nextButton.disabled = false;
    nextButtonMobile.disabled = false;
  }
}

/**
 * Hiển thị hoặc ẩn trạng thái loading
 */
function showLoading(show) {
  const loadingIndicator = document.getElementById('loading-indicator');
  const userTypeDetail = document.getElementById('user-type-detail');
  
  if (show) {
    loadingIndicator.classList.remove('hidden');
    userTypeDetail.classList.add('hidden');
  } else {
    loadingIndicator.classList.add('hidden');
    userTypeDetail.classList.remove('hidden');
  }
}

/**
 * Hiển thị thông báo lỗi
 */
function showError(message) {
  const errorContainer = document.getElementById('error-container');
  const errorMessage = document.getElementById('error-message');
  const loadingIndicator = document.getElementById('loading-indicator');
  const userTypeDetail = document.getElementById('user-type-detail');
  
  errorMessage.textContent = message;
  errorContainer.classList.remove('hidden');
  loadingIndicator.classList.add('hidden');
  userTypeDetail.classList.add('hidden');
}

/**
 * Ẩn thông báo lỗi
 */
function hideError() {
  const errorContainer = document.getElementById('error-container');
  errorContainer.classList.add('hidden');
}

/**
 * Xác nhận xóa loại người dùng
 */
function confirmDeleteUserType() {
  if (confirm(`Bạn có chắc chắn muốn xóa loại người dùng "${userTypeData.name}" không? Hành động này không thể hoàn tác.`)) {
    deleteUserType();
  }
}

/**
 * Xóa loại người dùng
 */
function deleteUserType() {
  showLoading(true);
  
  // Giả lập gọi API
  setTimeout(() => {
    try {
      // Hiển thị thông báo thành công
      showToast("Xóa loại người dùng thành công!", "success");
      
      // Điều hướng về trang danh sách
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
 * Tạo badge hiển thị trạng thái
 */
function getStatusBadge(status) {
  if (status === 'active') {
    return `<span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
              Đang hoạt động
            </span>`;
  } else {
    return `<span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
              Không hoạt động
            </span>`;
  }
}

/**
 * Format thời gian dạng datetime
 */
function formatDateTime(dateTimeStr) {
  try {
    const date = new Date(dateTimeStr);
    return date.toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    return dateTimeStr;
  }
}

/**
 * Hiển thị thông báo toast
 */
function showToast(message, type = "info") {
  const toastContainer = document.getElementById('toast-container');
  
  // Tạo thông báo
  const toast = document.createElement('div');
  toast.classList.add(
    'flex', 'items-center', 'p-4', 'mb-3', 'rounded-md', 'shadow-md', 
    'max-w-md', 'animate__animated', 'animate__fadeInRight'
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
        <i class="fas fa-times"></i>
      </button>
    </div>
  `;
  
  // Thêm vào container
  toastContainer.appendChild(toast);
  
  // Xử lý đóng thông báo
  toast.querySelector('button').addEventListener('click', () => {
    toast.classList.replace('animate__fadeInRight', 'animate__fadeOutRight');
    setTimeout(() => {
      toast.remove();
    }, 300);
  });
  
  // Tự động ẩn sau 5 giây
  setTimeout(() => {
    if (toast.parentNode) {
      toast.classList.replace('animate__fadeInRight', 'animate__fadeOutRight');
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