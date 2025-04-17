/**
 * Quản lý loại người dùng - Banking University
 * File: user-types.js
 * 
 * Chức năng:
 * - Hiển thị danh sách loại người dùng
 * - Tìm kiếm, lọc theo trạng thái
 * - Phân trang
 * - Xử lý xóa loại người dùng
 */

// Khởi tạo các biến global
let currentPage = 1; // Trang hiện tại
let itemsPerPage = 10; // Số lượng phần tử trên mỗi trang
let totalItems = 0; // Tổng số loại người dùng
let totalPages = 0; // Tổng số trang

// Dữ liệu mẫu loại người dùng
const userTypesMockData = [
  {
    id: 1,
    name: "Quản trị viên",
    description: "Người dùng có toàn quyền quản trị hệ thống",
    status: "active",
    userCount: 5,
    createdAt: "2023-01-15T08:30:00Z",
    updatedAt: "2023-05-20T14:45:00Z"
  },
  {
    id: 2,
    name: "Giảng viên",
    description: "Giảng viên của trường đại học",
    status: "active",
    userCount: 120,
    createdAt: "2023-01-20T09:15:00Z",
    updatedAt: "2023-06-12T11:30:00Z"
  },
  {
    id: 3,
    name: "Sinh viên",
    description: "Sinh viên đang theo học tại trường",
    status: "active",
    userCount: 3500,
    createdAt: "2023-01-25T10:00:00Z",
    updatedAt: "2023-06-15T13:20:00Z"
  },
  {
    id: 4,
    name: "Cựu sinh viên",
    description: "Sinh viên đã tốt nghiệp",
    status: "active",
    userCount: 870,
    createdAt: "2023-02-01T08:45:00Z",
    updatedAt: "2023-06-20T15:10:00Z"
  },
  {
    id: 5,
    name: "Nhân viên",
    description: "Nhân viên hành chính của trường",
    status: "active",
    userCount: 85,
    createdAt: "2023-02-10T09:30:00Z",
    updatedAt: "2023-07-05T10:45:00Z"
  },
  {
    id: 6,
    name: "Khách",
    description: "Tài khoản khách tham quan",
    status: "inactive",
    userCount: 250,
    createdAt: "2023-02-15T14:20:00Z",
    updatedAt: "2023-07-10T16:30:00Z"
  },
  {
    id: 7,
    name: "Đối tác",
    description: "Đối tác của trường đại học",
    status: "active",
    userCount: 45,
    createdAt: "2023-03-01T11:15:00Z",
    updatedAt: "2023-07-15T13:40:00Z"
  },
  {
    id: 8,
    name: "Thư viện",
    description: "Nhân viên thư viện",
    status: "active",
    userCount: 12,
    createdAt: "2023-03-10T13:30:00Z",
    updatedAt: "2023-08-01T09:25:00Z"
  },
  {
    id: 9,
    name: "Phòng đào tạo",
    description: "Nhân viên phòng đào tạo",
    status: "active",
    userCount: 25,
    createdAt: "2023-03-20T10:45:00Z",
    updatedAt: "2023-08-10T14:50:00Z"
  },
  {
    id: 10,
    name: "Ban giám hiệu",
    description: "Thành viên ban giám hiệu",
    status: "active",
    userCount: 8,
    createdAt: "2023-04-01T09:00:00Z",
    updatedAt: "2023-08-15T11:20:00Z"
  },
  {
    id: 11,
    name: "Phụ huynh",
    description: "Phụ huynh học sinh sinh viên",
    status: "inactive",
    userCount: 320,
    createdAt: "2023-04-15T15:30:00Z",
    updatedAt: "2023-09-01T10:15:00Z"
  },
  {
    id: 12,
    name: "Khảo thí",
    description: "Nhân viên phòng khảo thí",
    status: "active",
    userCount: 15,
    createdAt: "2023-05-01T11:45:00Z",
    updatedAt: "2023-09-10T13:35:00Z"
  }
];

// Chờ DOM tải xong
document.addEventListener('DOMContentLoaded', function() {
  // Khởi tạo hiệu ứng AOS
  AOS.init({
    duration: 800,
    once: true
  });
  
  // Khởi tạo xử lý sidebar cho mobile
  initSidebar();
  
  // Tải dữ liệu và render danh sách
  loadUserTypes();
  
  // Xử lý các sự kiện
  setupEventListeners();
});

/**
 * Khởi tạo xử lý sidebar cho mobile
 */
function initSidebar() {
  const sidebar = document.getElementById('sidebar');
  const sidebarBackdrop = document.getElementById('sidebar-backdrop');
  const sidebarOpen = document.getElementById('sidebar-open');
  const sidebarClose = document.getElementById('sidebar-close');
  
  sidebarOpen.addEventListener('click', () => {
    sidebar.classList.remove('-translate-x-full');
    sidebarBackdrop.classList.remove('hidden');
  });
  
  sidebarClose.addEventListener('click', () => {
    sidebar.classList.add('-translate-x-full');
    sidebarBackdrop.classList.add('hidden');
  });
  
  sidebarBackdrop.addEventListener('click', () => {
    sidebar.classList.add('-translate-x-full');
    sidebarBackdrop.classList.add('hidden');
  });
}

/**
 * Khởi tạo các sự kiện
 */
function setupEventListeners() {
  // Lắng nghe sự kiện tìm kiếm
  document.getElementById('search-input').addEventListener('input', debounce(handleFilter, 300));
  
  // Lắng nghe sự kiện lọc trạng thái
  document.getElementById('status-filter').addEventListener('change', handleFilter);
  
  // Lắng nghe sự kiện áp dụng bộ lọc
  document.getElementById('apply-filters').addEventListener('click', handleFilter);
  
  // Lắng nghe sự kiện xóa bộ lọc
  document.getElementById('clear-filters').addEventListener('click', clearFilters);
  
  // Lắng nghe sự kiện xóa bộ lọc từ trạng thái trống
  document.getElementById('clear-filters-empty').addEventListener('click', clearFilters);
  
  // Lắng nghe sự kiện thử lại khi có lỗi
  document.getElementById('retry-button').addEventListener('click', loadUserTypes);
  
  // Lắng nghe sự kiện phân trang sử dụng querySelector với class
  const btnFirst = document.querySelector('.btn-first');
  const btnPrev = document.querySelector('.btn-prev');
  const btnNext = document.querySelector('.btn-next');
  const btnLast = document.querySelector('.btn-last');
  
  if (btnFirst) btnFirst.addEventListener('click', () => navigatePage(1));
  if (btnPrev) btnPrev.addEventListener('click', () => navigatePage(currentPage - 1));
  if (btnNext) btnNext.addEventListener('click', () => navigatePage(currentPage + 1));
  if (btnLast) btnLast.addEventListener('click', () => navigatePage(totalPages));
  
  // Lắng nghe sự kiện nhập trực tiếp số trang
  const currentPageInput = document.getElementById('current-page-input');
  if (currentPageInput) {
    currentPageInput.addEventListener('change', function() {
      const page = parseInt(this.value);
      if (!isNaN(page) && page > 0) {
        navigatePage(page);
      } else {
        this.value = currentPage;
      }
    });
  }
  
  // Lắng nghe sự kiện số mục trên mỗi trang
  const itemsPerPageSelect = document.getElementById('items-per-page');
  if (itemsPerPageSelect) {
    itemsPerPageSelect.addEventListener('change', function() {
      itemsPerPage = parseInt(this.value);
      currentPage = 1;
      loadUserTypes();
    });
  }
}

/**
 * Hàm debounce để giảm số lần gọi hàm
 */
function debounce(func, wait) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

/**
 * Tải danh sách loại người dùng
 */
function loadUserTypes() {
  showLoading(true);
  hideError();
  hideEmptyState();
  
  // Giả lập gọi API
  setTimeout(() => {
    try {
      // Trong thực tế, đây sẽ là một cuộc gọi API để lấy dữ liệu
      const filteredData = filterUserTypes();
      renderUserTypesTable(filteredData);
      
      showLoading(false);
    } catch (error) {
      showError("Không thể tải dữ liệu loại người dùng: " + error.message);
    }
  }, 500); // Giả lập độ trễ mạng
}

/**
 * Lọc dữ liệu loại người dùng theo các tiêu chí tìm kiếm
 */
function filterUserTypes() {
  const searchValue = document.getElementById('search-input').value.toLowerCase();
  const statusFilter = document.getElementById('status-filter').value;
  
  let filteredData = [...userTypesMockData];
  
  // Lọc theo tên
  if (searchValue) {
    filteredData = filteredData.filter(userType => 
      userType.name.toLowerCase().includes(searchValue) || 
      userType.description.toLowerCase().includes(searchValue)
    );
  }
  
  // Lọc theo trạng thái
  if (statusFilter) {
    filteredData = filteredData.filter(userType => userType.status === statusFilter);
  }
  
  // Cập nhật tổng số phần tử và số trang
  totalItems = filteredData.length;
  totalPages = Math.ceil(totalItems / itemsPerPage);
  
  // Kiểm tra và điều chỉnh trang hiện tại nếu cần
  if (currentPage > totalPages && totalPages > 0) {
    currentPage = totalPages;
  } else if (currentPage < 1 || totalPages === 0) {
    currentPage = 1;
  }
  
  return filteredData;
}

/**
 * Hiện/ẩn trạng thái đang tải
 */
function showLoading(show) {
  const loadingIndicator = document.getElementById('loading-indicator');
  const userTypesList = document.getElementById('user-types-list');
  
  if (show) {
    loadingIndicator.classList.remove('hidden');
    userTypesList.classList.add('hidden');
  } else {
    loadingIndicator.classList.add('hidden');
    userTypesList.classList.remove('hidden');
  }
}

/**
 * Hiển thị thông báo lỗi
 */
function showError(message) {
  const errorContainer = document.getElementById('error-container');
  const errorMessage = document.getElementById('error-message');
  const loadingIndicator = document.getElementById('loading-indicator');
  const userTypesList = document.getElementById('user-types-list');
  
  errorMessage.textContent = message;
  errorContainer.classList.remove('hidden');
  loadingIndicator.classList.add('hidden');
  userTypesList.classList.add('hidden');
}

/**
 * Ẩn thông báo lỗi
 */
function hideError() {
  const errorContainer = document.getElementById('error-container');
  errorContainer.classList.add('hidden');
}

/**
 * Hiển thị trạng thái không có dữ liệu
 */
function showEmptyState() {
  const emptyState = document.getElementById('empty-state');
  const userTypesList = document.getElementById('user-types-list');
  
  emptyState.classList.remove('hidden');
  userTypesList.classList.add('hidden');
}

/**
 * Ẩn trạng thái không có dữ liệu
 */
function hideEmptyState() {
  const emptyState = document.getElementById('empty-state');
  emptyState.classList.add('hidden');
}

/**
 * Xử lý khi lọc dữ liệu
 */
function handleFilter() {
  currentPage = 1; // Reset về trang đầu tiên khi lọc
  loadUserTypes();
}

/**
 * Xóa các bộ lọc và tải lại dữ liệu
 */
function clearFilters() {
  document.getElementById('search-input').value = '';
  document.getElementById('status-filter').value = '';
  
  handleFilter();
}

/**
 * Định dạng ngày tháng
 */
function formatDate(dateString) {
  if (!dateString) return '-';
  
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  
  return `${day}/${month}/${year}`;
}

/**
 * Render bảng danh sách loại người dùng
 */
function renderUserTypesTable(data) {
  const tableBody = document.getElementById('user-types-table-body');
  tableBody.innerHTML = '';
  
  // Nếu không có dữ liệu
  if (data.length === 0) {
    showEmptyState();
    updatePaginationInfo(0, 0, 0);
    return;
  }
  
  // Tính toán phân trang
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, data.length);
  const paginatedData = data.slice(startIndex, endIndex);
  
  // Render dữ liệu
  paginatedData.forEach(userType => {
    const row = document.createElement('tr');
    row.className = 'hover:bg-gray-50 transition-colors duration-200';
    
    row.innerHTML = `
      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${userType.id}</td>
      <td class="px-6 py-4 whitespace-nowrap">
        <div class="text-sm font-medium text-gray-900">${userType.name}</div>
      </td>
      <td class="px-6 py-4">
        <div class="text-sm text-gray-500 line-clamp-2">${userType.description || '-'}</div>
      </td>
      <td class="px-6 py-4 whitespace-nowrap">
        <div class="text-sm text-gray-900 font-medium">${userType.userCount.toLocaleString('vi-VN')}</div>
      </td>
      <td class="px-6 py-4 whitespace-nowrap">
        ${getStatusBadge(userType.status)}
      </td>
      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        ${formatDate(userType.createdAt)}
      </td>
      <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div class="flex justify-end space-x-2">
          <a href="user-type-detail.html?id=${userType.id}" 
            class="text-primary hover:text-primary-dark px-2 py-1 rounded-md hover:bg-primary/10" 
            title="Xem chi tiết">
            <i class="ri-eye-line"></i>
          </a>
          <a href="user-type-edit.html?id=${userType.id}" 
            class="text-blue-600 hover:text-blue-800 px-2 py-1 rounded-md hover:bg-blue-50" 
            title="Chỉnh sửa">
            <i class="ri-edit-line"></i>
          </a>
          <button onclick="confirmDeleteUserType(${userType.id})" 
            class="text-red-600 hover:text-red-800 px-2 py-1 rounded-md hover:bg-red-50" 
            title="Xóa">
            <i class="ri-delete-bin-line"></i>
          </button>
        </div>
      </td>
    `;
    
    tableBody.appendChild(row);
  });
  
  // Cập nhật thông tin phân trang
  updatePaginationInfo(startIndex + 1, endIndex, data.length);
  updatePaginationControls();
}

/**
 * Tạo badge cho trạng thái
 */
function getStatusBadge(status) {
  if (status === 'active') {
    return `<span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
      Hoạt động
    </span>`;
  } else {
    return `<span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
      Không hoạt động
    </span>`;
  }
}

/**
 * Cập nhật thông tin phân trang
 */
function updatePaginationInfo(startIndex, endIndex, totalItems) {
  // Cập nhật tổng số loại người dùng
  const totalItemsCount = document.getElementById('total-items-count');
  
  if (totalItemsCount) {
    totalItemsCount.textContent = totalItems;
  }
}

/**
 * Cập nhật điều khiển phân trang
 */
function updatePaginationControls() {
  // Cập nhật số trang hiện tại và tổng số trang
  const currentPageInput = document.getElementById('current-page-input');
  const totalPagesEl = document.getElementById('total-pages-count');
  
  if (currentPageInput) {
    currentPageInput.value = currentPage;
  }
  
  if (totalPagesEl) {
    totalPagesEl.textContent = totalPages;
  }
  
  // Cập nhật trạng thái nút điều hướng
  const btnFirst = document.querySelector('.btn-first');
  const btnPrev = document.querySelector('.btn-prev');
  const btnNext = document.querySelector('.btn-next');
  const btnLast = document.querySelector('.btn-last');
  
  // Vô hiệu hóa nút previous và first nếu đang ở trang đầu tiên
  if (currentPage <= 1) {
    if (btnPrev) {
      btnPrev.disabled = true;
      btnPrev.classList.add('opacity-50', 'cursor-not-allowed');
    }
    if (btnFirst) {
      btnFirst.disabled = true;
      btnFirst.classList.add('opacity-50', 'cursor-not-allowed');
    }
  } else {
    if (btnPrev) {
      btnPrev.disabled = false;
      btnPrev.classList.remove('opacity-50', 'cursor-not-allowed');
    }
    if (btnFirst) {
      btnFirst.disabled = false;
      btnFirst.classList.remove('opacity-50', 'cursor-not-allowed');
    }
  }
  
  // Vô hiệu hóa nút next và last nếu đang ở trang cuối cùng
  if (currentPage >= totalPages) {
    if (btnNext) {
      btnNext.disabled = true;
      btnNext.classList.add('opacity-50', 'cursor-not-allowed');
    }
    if (btnLast) {
      btnLast.disabled = true;
      btnLast.classList.add('opacity-50', 'cursor-not-allowed');
    }
  } else {
    if (btnNext) {
      btnNext.disabled = false;
      btnNext.classList.remove('opacity-50', 'cursor-not-allowed');
    }
    if (btnLast) {
      btnLast.disabled = false;
      btnLast.classList.remove('opacity-50', 'cursor-not-allowed');
    }
  }
}

/**
 * Điều hướng đến trang khác
 */
function navigatePage(page) {
  if (page < 1 || page > totalPages) return;
  
  currentPage = page;
  loadUserTypes();
}

/**
 * Xác nhận xóa loại người dùng
 */
function confirmDeleteUserType(id) {
  if (confirm(`Bạn có chắc chắn muốn xóa loại người dùng này không? Hành động này không thể hoàn tác.`)) {
    deleteUserType(id);
  }
}

/**
 * Thực hiện xóa loại người dùng
 */
function deleteUserType(id) {
  // Hiển thị trạng thái đang tải
  showLoading(true);
  
  // Giả lập gọi API để xóa
  setTimeout(() => {
    try {
      // Tìm loại người dùng trong danh sách
      const index = userTypesMockData.findIndex(item => item.id === id);
      
      if (index !== -1) {
        // Xóa loại người dùng (trong thực tế, đây sẽ là một cuộc gọi API DELETE)
        userTypesMockData.splice(index, 1);
        
        // Tải lại danh sách
        loadUserTypes();
        
        // Hiển thị thông báo thành công
        showToast("Xóa loại người dùng thành công!", "success");
      } else {
        // Hiển thị thông báo lỗi
        showToast("Không tìm thấy loại người dùng!", "error");
      }
    } catch (error) {
      // Hiển thị thông báo lỗi
      showToast("Lỗi khi xóa loại người dùng: " + error.message, "error");
    } finally {
      // Ẩn trạng thái đang tải
      showLoading(false);
    }
  }, 500); // Giả lập độ trễ mạng
}

/**
 * Hiển thị thông báo toast
 */
function showToast(message, type = "info") {
  // Tạo phần tử toast
  const toast = document.createElement('div');
  toast.className = `flex items-center p-4 mb-3 text-sm rounded-lg shadow-md transform transition-transform duration-300 ease-in-out ${getToastBgColor(type)}`;
  
  // Đặt nội dung cho toast
  toast.innerHTML = `
    <div class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 ${getToastIconBgColor(type)} rounded-lg">
      ${getToastIcon(type)}
    </div>
    <div class="ml-3 font-normal">${message}</div>
    <button type="button" class="ml-auto -mx-1.5 -my-1.5 ${getToastCloseButtonColor(type)} rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 inline-flex h-8 w-8" aria-label="Close">
      <span class="sr-only">Đóng</span>
      <i class="ri-close-line"></i>
    </button>
  `;
  
  // Thêm toast vào container
  const toastContainer = document.getElementById('toast-container');
  toastContainer.appendChild(toast);
  
  // Animation hiển thị
  setTimeout(() => {
    toast.classList.add('translate-y-0');
    toast.classList.remove('translate-y-full');
  }, 10);
  
  // Xử lý nút đóng
  const closeButton = toast.querySelector('button');
  closeButton.addEventListener('click', () => {
    closeToast(toast);
  });
  
  // Tự động đóng sau 5 giây
  setTimeout(() => {
    closeToast(toast);
  }, 5000);
}

/**
 * Đóng toast
 */
function closeToast(toast) {
  // Animation ẩn
  toast.classList.add('translate-y-full');
  toast.classList.remove('translate-y-0');
  
  // Xóa phần tử sau khi animation kết thúc
  setTimeout(() => {
    toast.remove();
  }, 300);
}

/**
 * Lấy màu nền cho toast theo loại
 */
function getToastBgColor(type) {
  switch (type) {
    case 'success':
      return 'text-green-800 bg-green-50';
    case 'error':
      return 'text-red-800 bg-red-50';
    case 'warning':
      return 'text-yellow-800 bg-yellow-50';
    case 'info':
    default:
      return 'text-blue-800 bg-blue-50';
  }
}

/**
 * Lấy màu nền cho icon toast theo loại
 */
function getToastIconBgColor(type) {
  switch (type) {
    case 'success':
      return 'text-green-500 bg-green-100';
    case 'error':
      return 'text-red-500 bg-red-100';
    case 'warning':
      return 'text-yellow-500 bg-yellow-100';
    case 'info':
    default:
      return 'text-blue-500 bg-blue-100';
  }
}

/**
 * Lấy màu cho nút đóng toast theo loại
 */
function getToastCloseButtonColor(type) {
  switch (type) {
    case 'success':
      return 'bg-green-50 text-green-500 hover:text-green-800 hover:bg-green-100';
    case 'error':
      return 'bg-red-50 text-red-500 hover:text-red-800 hover:bg-red-100';
    case 'warning':
      return 'bg-yellow-50 text-yellow-500 hover:text-yellow-800 hover:bg-yellow-100';
    case 'info':
    default:
      return 'bg-blue-50 text-blue-500 hover:text-blue-800 hover:bg-blue-100';
  }
}

/**
 * Lấy icon cho toast theo loại
 */
function getToastIcon(type) {
  switch (type) {
    case 'success':
      return '<i class="ri-check-line text-xl"></i>';
    case 'error':
      return '<i class="ri-error-warning-line text-xl"></i>';
    case 'warning':
      return '<i class="ri-alert-line text-xl"></i>';
    case 'info':
    default:
      return '<i class="ri-information-line text-xl"></i>';
  }
} 