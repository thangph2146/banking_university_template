/**
 * Quản lý phòng khoa
 * 
 * File này xử lý các chức năng liên quan đến quản lý phòng khoa:
 * - Hiển thị danh sách phòng khoa
 * - Lọc phòng khoa theo tên, mã phòng khoa và trạng thái
 * - Xem chi tiết phòng khoa (chuyển sang trang department-detail.html)
 * - Sửa phòng khoa (chuyển sang trang department-edit.html)
 * - Xóa phòng khoa (với xác nhận)
 * - Phân trang dữ liệu
 */

// Khởi tạo AOS
AOS.init();

// Dữ liệu mẫu cho phòng khoa
window.departmentsMockData = [
  {
    phong_khoa_id: 1,
    ma_phong_khoa: 'CNTT',
    ten_phong_khoa: 'Công nghệ thông tin',
    ghi_chu: 'Phòng khoa quản lý các ngành liên quan đến CNTT',
    status: '1',
    created_at: '2023-05-10 08:00:00',
    updated_at: null
  },
  {
    phong_khoa_id: 2,
    ma_phong_khoa: 'KTQT',
    ten_phong_khoa: 'Kế toán - Quản trị',
    ghi_chu: 'Phòng khoa quản lý các ngành kinh tế và quản trị',
    status: '1',
    created_at: '2023-05-11 09:15:00',
    updated_at: '2023-06-15 14:30:00'
  },
  {
    phong_khoa_id: 3,
    ma_phong_khoa: 'NNH',
    ten_phong_khoa: 'Ngôn ngữ học',
    ghi_chu: 'Phòng khoa quản lý các ngành ngôn ngữ',
    status: '1',
    created_at: '2023-05-12 10:30:00',
    updated_at: null
  },
  {
    phong_khoa_id: 4,
    ma_phong_khoa: 'TCNH',
    ten_phong_khoa: 'Tài chính - Ngân hàng',
    ghi_chu: 'Phòng khoa quản lý các ngành tài chính, ngân hàng',
    status: '1',
    created_at: '2023-05-13 11:45:00',
    updated_at: null
  },
  {
    phong_khoa_id: 5,
    ma_phong_khoa: 'KTXD',
    ten_phong_khoa: 'Kỹ thuật xây dựng',
    ghi_chu: 'Phòng khoa quản lý các ngành xây dựng, kiến trúc',
    status: '0',
    created_at: '2023-05-14 13:00:00',
    updated_at: '2023-07-20 16:45:00'
  },
  {
    phong_khoa_id: 6,
    ma_phong_khoa: 'KTĐL',
    ten_phong_khoa: 'Kỹ thuật điện - điện tử',
    ghi_chu: 'Phòng khoa quản lý các ngành điện, điện tử, tự động hóa',
    status: '1',
    created_at: '2023-05-15 14:15:00',
    updated_at: null
  },
  {
    phong_khoa_id: 7,
    ma_phong_khoa: 'QTKD',
    ten_phong_khoa: 'Quản trị kinh doanh',
    ghi_chu: 'Phòng khoa quản lý các ngành quản trị và kinh doanh',
    status: '1',
    created_at: '2023-05-16 15:30:00',
    updated_at: null
  },
  {
    phong_khoa_id: 8,
    ma_phong_khoa: 'LLCT',
    ten_phong_khoa: 'Lý luận chính trị',
    ghi_chu: 'Phòng khoa quản lý các môn chính trị, xã hội',
    status: '0',
    created_at: '2023-05-17 16:45:00',
    updated_at: '2023-08-05 10:20:00'
  },
  {
    phong_khoa_id: 9,
    ma_phong_khoa: 'GDTC',
    ten_phong_khoa: 'Giáo dục thể chất',
    ghi_chu: 'Phòng khoa quản lý giáo dục thể chất và quốc phòng',
    status: '1',
    created_at: '2023-05-18 08:30:00',
    updated_at: null
  },
  {
    phong_khoa_id: 10,
    ma_phong_khoa: 'KHCB',
    ten_phong_khoa: 'Khoa học cơ bản',
    ghi_chu: 'Phòng khoa quản lý các môn khoa học cơ bản',
    status: '1',
    created_at: '2023-05-19 09:45:00',
    updated_at: '2023-09-10 11:30:00'
  }
];

// Biến trạng thái
let filteredDepartments = [];

// Biến phân trang
const paginationState = {
  currentPage: 1,
  itemsPerPage: 10,
  totalPages: 1
};

// Lưu trữ DOM elements
const domElements = {
  // Bảng và container
  departmentsTableBody: document.getElementById('departmentsTableBody'),
  tableContainer: document.getElementById('departments-table-container'),
  
  // Trạng thái UI
  loadingIndicator: document.getElementById('loading-indicator'),
  errorAlert: document.getElementById('error-alert'),
  errorMessage: document.getElementById('error-message'),
  emptyState: document.getElementById('empty-state'),
  
  // Bộ lọc
  filterForm: document.getElementById('filter-form'),
  filterName: document.getElementById('filter-name'),
  filterStatus: document.getElementById('filter-status'),
  resetFilterBtn: document.getElementById('reset-filter-btn'),
  clearFiltersEmpty: document.getElementById('clear-filters-empty'),
  retryBtn: document.getElementById('retry-btn'),
  
  // Phân trang
  itemsPerPageSelect: document.getElementById('items-per-page'),
  currentPageInput: document.getElementById('current-page-input'),
  totalPagesCount: document.getElementById('total-pages-count'),
  totalItemsCount: document.getElementById('total-items-count'),
  firstPageBtn: document.getElementById('first-page'),
  prevPageBtn: document.getElementById('prev-page'),
  nextPageBtn: document.getElementById('next-page'),
  lastPageBtn: document.getElementById('last-page'),
  
  // Mobile pagination
  currentPageMobile: document.getElementById('current-page-mobile'),
  totalPagesMobile: document.getElementById('total-pages-mobile'),
  prevPageMobile: document.getElementById('prev-page-mobile'),
  nextPageMobile: document.getElementById('next-page-mobile'),
  
  // Sidebar
  sidebar: document.getElementById('sidebar'),
  sidebarOpen: document.getElementById('sidebar-open'),
  sidebarClose: document.getElementById('sidebar-close'),
  sidebarBackdrop: document.getElementById('sidebar-backdrop'),
  
  // Số lượng hiển thị
  totalDepartmentsBadge: document.getElementById('total-departments-badge'),
  
  // Modal xóa
  deleteModal: document.getElementById('delete-modal'),
  deleteDepartmentName: document.getElementById('delete-department-name'),
  cancelDeleteBtn: document.getElementById('cancel-delete'),
  confirmDeleteBtn: document.getElementById('confirm-delete')
};

/**
 * Định dạng ngày giờ theo định dạng dd/MM/yyyy
 * @param {string} dateString - Chuỗi ngày giờ cần định dạng
 * @returns {string} Chuỗi ngày giờ đã định dạng
 */
const formatDate = (dateString) => {
  if (!dateString) return '-';
  
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  } catch (error) {
    console.error('Lỗi định dạng ngày:', error);
    return dateString;
  }
};

/**
 * Tải dữ liệu phòng khoa
 */
const fetchDepartments = async () => {
  try {
    // Hiển thị loading
    toggleLoadingState(true);
    
    // Giả lập delay khi gọi API
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Lưu vào localStorage để các file khác có thể sử dụng
    localStorage.setItem('departmentsMockData', JSON.stringify(window.departmentsMockData));
    
    // Cập nhật và render dữ liệu
    applyFiltersAndLoadData();
  } catch (error) {
    console.error('Lỗi khi tải dữ liệu phòng khoa:', error);
    showError(error.message || 'Có lỗi xảy ra khi tải dữ liệu phòng khoa.');
  }
};

/**
 * Áp dụng bộ lọc và tải dữ liệu
 */
const applyFiltersAndLoadData = () => {
  try {
    const searchKeyword = domElements.filterName ? domElements.filterName.value.toLowerCase() : '';
    const statusFilter = domElements.filterStatus ? domElements.filterStatus.value : '';
    
    // Lọc dữ liệu
    filteredDepartments = window.departmentsMockData.filter(dept => {
      // Tìm kiếm theo tên hoặc mã
      const searchMatch = 
        !searchKeyword || 
        dept.ten_phong_khoa.toLowerCase().includes(searchKeyword) || 
        dept.ma_phong_khoa.toLowerCase().includes(searchKeyword);
      
      // Lọc theo trạng thái
      const statusMatch = !statusFilter || dept.status === statusFilter;
      
      return searchMatch && statusMatch;
    });
    
    // Sắp xếp theo ID giảm dần (mới nhất lên đầu)
    filteredDepartments.sort((a, b) => b.phong_khoa_id - a.phong_khoa_id);
    
    // Cập nhật phân trang
    paginationState.currentPage = 1;
    updatePagination();
    
    // Render bảng với dữ liệu đã lọc
    renderTable();
    
    // Ẩn loading
    toggleLoadingState(false);
  } catch (error) {
    console.error('Lỗi khi áp dụng bộ lọc:', error);
    showError(error.message || 'Có lỗi xảy ra khi lọc dữ liệu.');
  }
};

/**
 * Hiển thị dữ liệu vào bảng
 */
const renderTable = () => {
  if (!domElements.departmentsTableBody) return;
  
  // Cập nhật tổng số phòng khoa
  if (domElements.totalDepartmentsBadge) {
    domElements.totalDepartmentsBadge.textContent = filteredDepartments.length;
  }
  
  // Hiển thị component phù hợp: loading, error, empty, hoặc table
  if (domElements.loadingIndicator) {
    domElements.loadingIndicator.classList.add('hidden');
  }
  
  if (domElements.errorAlert) {
    domElements.errorAlert.classList.add('hidden');
  }
  
  if (filteredDepartments.length === 0) {
    if (domElements.tableContainer) domElements.tableContainer.classList.add('hidden');
    if (domElements.emptyState) domElements.emptyState.classList.remove('hidden');
    return;
  } else {
    if (domElements.tableContainer) domElements.tableContainer.classList.remove('hidden');
    if (domElements.emptyState) domElements.emptyState.classList.add('hidden');
  }
  
  // Tính toán phân trang
  const startIndex = (paginationState.currentPage - 1) * paginationState.itemsPerPage;
  const endIndex = Math.min(startIndex + paginationState.itemsPerPage, filteredDepartments.length);
  const displayedDepartments = filteredDepartments.slice(startIndex, endIndex);
  
  // Tạo HTML cho bảng
  let html = '';
  
  displayedDepartments.forEach(dept => {
    html += `
      <tr class="hover:bg-gray-50">
        <td class="px-4 py-3">
          <div class="text-sm font-medium text-gray-900">${dept.phong_khoa_id}</div>
        </td>
        <td class="px-4 py-3">
          <div class="text-sm font-medium text-gray-900">${dept.ma_phong_khoa}</div>
        </td>
        <td class="px-4 py-3">
          <div class="text-sm font-medium text-gray-900">${dept.ten_phong_khoa}</div>
        </td>
        <td class="px-4 py-3">
          <div class="text-sm text-gray-500">${formatDate(dept.created_at)}</div>
        </td>
        <td class="px-4 py-3">
          <span class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
            ${dept.status === '1' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
            ${dept.status === '1' ? 'Hoạt động' : 'Không hoạt động'}
          </span>
        </td>
        <td class="px-4 py-3 text-right text-sm font-medium">
          <div class="flex justify-end space-x-2">
            <a href="department-detail.html?id=${dept.phong_khoa_id}" class="text-primary hover:text-primary-dark" title="Xem chi tiết">
              <i class="ri-eye-line"></i>
            </a>
            <a href="department-edit.html?id=${dept.phong_khoa_id}" class="text-green-600 hover:text-green-900" title="Chỉnh sửa">
              <i class="ri-edit-line"></i>
            </a>
            <button onclick="deleteDepartment(${dept.phong_khoa_id})" class="text-red-600 hover:text-red-900" title="Xóa">
              <i class="ri-delete-bin-line"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  });
  
  domElements.departmentsTableBody.innerHTML = html;
  
  // Cập nhật UI phân trang
  updatePaginationButtons();
};

/**
 * Cập nhật trạng thái phân trang
 */
const updatePagination = () => {
  const totalItems = filteredDepartments.length;
  paginationState.totalPages = Math.max(1, Math.ceil(totalItems / paginationState.itemsPerPage));
  
  // Điều chỉnh trang hiện tại nếu vượt quá tổng số trang
  if (paginationState.currentPage > paginationState.totalPages) {
    paginationState.currentPage = paginationState.totalPages;
  }
};

/**
 * Cập nhật UI các nút phân trang
 */
const updatePaginationButtons = () => {
  // Cập nhật input trang hiện tại và tổng số trang
  if (domElements.currentPageInput) {
    domElements.currentPageInput.value = paginationState.currentPage;
  }
  
  if (domElements.totalPagesCount) {
    domElements.totalPagesCount.textContent = paginationState.totalPages;
  }
  
  if (domElements.totalItemsCount) {
    domElements.totalItemsCount.textContent = filteredDepartments.length;
  }
  
  // Cập nhật trạng thái nút phân trang
  if (domElements.firstPageBtn) {
    domElements.firstPageBtn.disabled = paginationState.currentPage === 1;
  }
  
  if (domElements.prevPageBtn) {
    domElements.prevPageBtn.disabled = paginationState.currentPage === 1;
  }
  
  if (domElements.nextPageBtn) {
    domElements.nextPageBtn.disabled = paginationState.currentPage === paginationState.totalPages;
  }
  
  if (domElements.lastPageBtn) {
    domElements.lastPageBtn.disabled = paginationState.currentPage === paginationState.totalPages;
  }
  
  // Cập nhật UI phân trang mobile
  if (domElements.currentPageMobile) {
    domElements.currentPageMobile.textContent = paginationState.currentPage;
  }
  
  if (domElements.totalPagesMobile) {
    domElements.totalPagesMobile.textContent = paginationState.totalPages;
  }
  
  if (domElements.prevPageMobile) {
    domElements.prevPageMobile.disabled = paginationState.currentPage === 1;
  }
  
  if (domElements.nextPageMobile) {
    domElements.nextPageMobile.disabled = paginationState.currentPage === paginationState.totalPages;
  }
};

/**
 * Hiển thị/ẩn trạng thái loading
 * @param {boolean} isLoading - true để hiển thị, false để ẩn
 */
const toggleLoadingState = (isLoading) => {
  if (domElements.loadingIndicator) {
    domElements.loadingIndicator.classList.toggle('hidden', !isLoading);
  }
};

/**
 * Hiển thị thông báo lỗi
 * @param {string} message - Thông báo lỗi cần hiển thị
 */
const showError = (message) => {
  if (domElements.errorAlert && domElements.errorMessage) {
    domElements.errorMessage.textContent = message;
    domElements.errorAlert.classList.remove('hidden');
    
    if (domElements.loadingIndicator) {
      domElements.loadingIndicator.classList.add('hidden');
    }
    
    if (domElements.tableContainer) {
      domElements.tableContainer.classList.add('hidden');
    }
    
    if (domElements.emptyState) {
      domElements.emptyState.classList.add('hidden');
    }
  }
};

/**
 * Xóa phòng khoa
 * @param {number} departmentId - ID phòng khoa cần xóa
 */
window.deleteDepartment = function(departmentId) {
  // Tìm phòng khoa cần xóa để hiển thị tên
  const departmentToDelete = window.departmentsMockData.find(d => d.phong_khoa_id === departmentId);
  
  if (departmentToDelete && domElements.deleteModal) {
    // Hiển thị tên phòng khoa trong modal
    if (domElements.deleteDepartmentName) {
      domElements.deleteDepartmentName.textContent = `${departmentToDelete.ten_phong_khoa} (${departmentToDelete.ma_phong_khoa})`;
    }
    
    // Lưu ID để xóa khi xác nhận
    window.currentDepartmentIdToDelete = departmentId;
    
    // Hiển thị modal xác nhận
    domElements.deleteModal.classList.remove('hidden');
  }
};

/**
 * Xác nhận xóa phòng khoa
 */
const confirmDeleteDepartment = () => {
  try {
    const departmentId = window.currentDepartmentIdToDelete;
    
    if (departmentId) {
      // Tìm index của phòng khoa cần xóa
      const index = window.departmentsMockData.findIndex(d => d.phong_khoa_id === departmentId);
      
      if (index !== -1) {
        // Lưu tên để hiển thị thông báo
        const deletedName = window.departmentsMockData[index].ten_phong_khoa;
        
        // Xóa phòng khoa
        window.departmentsMockData.splice(index, 1);
        
        // Cập nhật localStorage
        localStorage.setItem('departmentsMockData', JSON.stringify(window.departmentsMockData));
        
        // Cập nhật UI
        applyFiltersAndLoadData();
        
        // Hiển thị thông báo thành công
        showToast(`Đã xóa phòng khoa "${deletedName}" thành công`, 'success');
      }
    }
    
    // Đóng modal
    if (domElements.deleteModal) {
      domElements.deleteModal.classList.add('hidden');
    }
    
    // Reset ID đang xóa
    window.currentDepartmentIdToDelete = null;
  } catch (error) {
    console.error('Lỗi khi xóa phòng khoa:', error);
    showToast(`Lỗi khi xóa phòng khoa: ${error.message}`, 'error');
  }
};

/**
 * Hiển thị thông báo toast
 * @param {string} message - Nội dung thông báo
 * @param {string} type - Loại thông báo (success, error)
 */
const showToast = (message, type = 'success') => {
  const toastContainer = document.getElementById('toast-container');
  if (!toastContainer) return;
  
  const toastId = 'toast-' + Date.now();
  const iconClass = type === 'success' ? 'ri-check-line' : 'ri-error-warning-line';
  const bgColorClass = type === 'success' ? 'bg-green-500' : 'bg-red-500';
  
  const toast = document.createElement('div');
  toast.id = toastId;
  toast.className = `${bgColorClass} text-white px-4 py-3 rounded-lg shadow-lg mb-3 flex items-center transform transition-all duration-300 translate-y-0 opacity-100`;
  toast.innerHTML = `
    <div class="mr-2"><i class="${iconClass}"></i></div>
    <div>${message}</div>
    <div class="ml-auto cursor-pointer" onclick="document.getElementById('${toastId}').remove()">
      <i class="ri-close-line"></i>
    </div>
  `;
  
  toastContainer.appendChild(toast);
  
  // Tự động ẩn sau 5 giây
  setTimeout(() => {
    if (document.getElementById(toastId)) {
      document.getElementById(toastId).classList.add('opacity-0', 'translate-y-2');
      setTimeout(() => {
        if (document.getElementById(toastId)) {
          document.getElementById(toastId).remove();
        }
      }, 300);
    }
  }, 5000);
};

/**
 * Khởi tạo các sự kiện
 */
const setupEventListeners = () => {
  // Xử lý form lọc
  if (domElements.filterForm) {
    domElements.filterForm.addEventListener('submit', function(e) {
      e.preventDefault();
      applyFiltersAndLoadData();
    });
  }
  
  // Xử lý reset bộ lọc
  if (domElements.resetFilterBtn) {
    domElements.resetFilterBtn.addEventListener('click', function() {
      if (domElements.filterName) domElements.filterName.value = '';
      if (domElements.filterStatus) domElements.filterStatus.value = '';
      applyFiltersAndLoadData();
    });
  }
  
  // Xử lý clear bộ lọc từ trang empty
  if (domElements.clearFiltersEmpty) {
    domElements.clearFiltersEmpty.addEventListener('click', function() {
      if (domElements.filterName) domElements.filterName.value = '';
      if (domElements.filterStatus) domElements.filterStatus.value = '';
      applyFiltersAndLoadData();
    });
  }
  
  // Xử lý retry
  if (domElements.retryBtn) {
    domElements.retryBtn.addEventListener('click', fetchDepartments);
  }
  
  // Xử lý số mục trên mỗi trang
  if (domElements.itemsPerPageSelect) {
    domElements.itemsPerPageSelect.addEventListener('change', function() {
      paginationState.itemsPerPage = parseInt(this.value);
      paginationState.currentPage = 1;
      updatePagination();
      renderTable();
    });
  }
  
  // Xử lý nhập trang
  if (domElements.currentPageInput) {
    domElements.currentPageInput.addEventListener('change', function() {
      let newPage = parseInt(this.value);
      if (isNaN(newPage) || newPage < 1) {
        newPage = 1;
      } else if (newPage > paginationState.totalPages) {
        newPage = paginationState.totalPages;
      }
      
      paginationState.currentPage = newPage;
      updatePagination();
      renderTable();
    });
  }
  
  // Xử lý các nút phân trang
  if (domElements.firstPageBtn) {
    domElements.firstPageBtn.addEventListener('click', function() {
      if (paginationState.currentPage > 1) {
        paginationState.currentPage = 1;
        updatePagination();
        renderTable();
      }
    });
  }
  
  if (domElements.prevPageBtn) {
    domElements.prevPageBtn.addEventListener('click', function() {
      if (paginationState.currentPage > 1) {
        paginationState.currentPage--;
        updatePagination();
        renderTable();
      }
    });
  }
  
  if (domElements.nextPageBtn) {
    domElements.nextPageBtn.addEventListener('click', function() {
      if (paginationState.currentPage < paginationState.totalPages) {
        paginationState.currentPage++;
        updatePagination();
        renderTable();
      }
    });
  }
  
  if (domElements.lastPageBtn) {
    domElements.lastPageBtn.addEventListener('click', function() {
      if (paginationState.currentPage < paginationState.totalPages) {
        paginationState.currentPage = paginationState.totalPages;
        updatePagination();
        renderTable();
      }
    });
  }
  
  // Xử lý các nút phân trang mobile
  if (domElements.prevPageMobile) {
    domElements.prevPageMobile.addEventListener('click', function() {
      if (paginationState.currentPage > 1) {
        paginationState.currentPage--;
        updatePagination();
        renderTable();
      }
    });
  }
  
  if (domElements.nextPageMobile) {
    domElements.nextPageMobile.addEventListener('click', function() {
      if (paginationState.currentPage < paginationState.totalPages) {
        paginationState.currentPage++;
        updatePagination();
        renderTable();
      }
    });
  }
  
  // Xử lý xác nhận và hủy xóa
  if (domElements.confirmDeleteBtn) {
    domElements.confirmDeleteBtn.addEventListener('click', confirmDeleteDepartment);
  }
  
  if (domElements.cancelDeleteBtn) {
    domElements.cancelDeleteBtn.addEventListener('click', function() {
      if (domElements.deleteModal) {
        domElements.deleteModal.classList.add('hidden');
      }
      window.currentDepartmentIdToDelete = null;
    });
  }
  
  // Xử lý sidebar
  if (domElements.sidebarOpen) {
    domElements.sidebarOpen.addEventListener('click', function() {
      if (domElements.sidebar && domElements.sidebarBackdrop) {
        domElements.sidebar.classList.remove('-translate-x-full');
        domElements.sidebarBackdrop.classList.remove('hidden');
      }
    });
  }
  
  if (domElements.sidebarClose) {
    domElements.sidebarClose.addEventListener('click', function() {
      if (domElements.sidebar && domElements.sidebarBackdrop) {
        domElements.sidebar.classList.add('-translate-x-full');
        domElements.sidebarBackdrop.classList.add('hidden');
      }
    });
  }
  
  if (domElements.sidebarBackdrop) {
    domElements.sidebarBackdrop.addEventListener('click', function() {
      if (domElements.sidebar) {
        domElements.sidebar.classList.add('-translate-x-full');
        domElements.sidebarBackdrop.classList.add('hidden');
      }
    });
  }
};

/**
 * Khởi tạo trang
 */
const init = () => {
  // Thiết lập các sự kiện
  setupEventListeners();
  
  // Tải dữ liệu
  fetchDepartments();
};

// Khởi tạo khi trang đã tải xong
document.addEventListener('DOMContentLoaded', init); 