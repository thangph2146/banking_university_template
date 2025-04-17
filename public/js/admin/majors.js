// Khởi tạo AOS
AOS.init();

/**
 * Quản lý ngành đào tạo 
 * 
 * File này xử lý các chức năng liên quan đến quản lý ngành đào tạo:
 * - Hiển thị danh sách ngành đào tạo từ dữ liệu của bảng 'nganh' trong CSDL
 * - Lọc ngành theo tên, mã ngành, phòng khoa và trạng thái
 * - Xem chi tiết ngành (chuyển sang trang major-detail.html)
 * - Chỉnh sửa ngành (chuyển sang trang major-edit.html)
 * - Xóa ngành (xử lý trên trang hiện tại với modal xác nhận)
 * - Phân trang dữ liệu
 * 
 * Dữ liệu được lấy từ bảng 'nganh' trong cơ sở dữ liệu, có cấu trúc:
 * - nganh_id: ID của ngành
 * - ten_nganh: Tên ngành đào tạo
 * - ma_nganh: Mã ngành đào tạo
 * - phong_khoa_id: ID của phòng khoa quản lý ngành
 * - status: Trạng thái (1: Hoạt động, 0: Không hoạt động)
 * - created_at: Thời gian tạo
 */

// Khởi tạo các biến trạng thái
let allMajors = [];
let filteredMajors = [];

// Biến pagination
const paginationState = {
  currentPage: 1,
  itemsPerPage: 10,
  totalPages: 1
};

// Sự kiện khi DOM đã tải
document.addEventListener('DOMContentLoaded', function() {
  // Xử lý sidebar
  const sidebarOpen = document.getElementById('sidebar-open');
  const sidebarClose = document.getElementById('sidebar-close');
  const sidebar = document.getElementById('sidebar');
  const sidebarBackdrop = document.getElementById('sidebar-backdrop');

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

  // User Menu Toggle
  const userMenu = document.querySelector('.group button');
  const userMenuDropdown = document.querySelector('.group div.hidden');

  if (userMenu && userMenuDropdown) {
    userMenu.addEventListener('click', () => {
      userMenuDropdown.classList.toggle('hidden');
    });

    document.addEventListener('click', (e) => {
      if (!userMenu.contains(e.target) && !userMenuDropdown.contains(e.target)) {
        userMenuDropdown.classList.add('hidden');
      }
    });
  }

  // Lấy tên phòng khoa từ ID
  function getPhongKhoaName(id) {
    const phongKhoa = {
      '1': 'Công nghệ thông tin',
      '2': 'Kế toán - Quản trị',
      '3': 'Ngôn ngữ học',
      '4': 'Tài chính - Ngân hàng'
    };
    return phongKhoa[id] || 'Chưa phân công';
  }

  // Dữ liệu mẫu cho ngành đào tạo (dựa trên cấu trúc bảng nganh từ hanet.sql)
  allMajors = [
    {
      nganh_id: 1,
      ten_nganh: "Công nghệ thông tin",
      ma_nganh: "7480201",
      phong_khoa_id: "1",
      phong_khoa_ten: "Công nghệ thông tin",
      status: "1",
      created_at: "2023-01-15 08:30:00"
    },
    {
      nganh_id: 2,
      ten_nganh: "Kỹ thuật phần mềm",
      ma_nganh: "7480103",
      phong_khoa_id: "1",
      phong_khoa_ten: "Công nghệ thông tin",
      status: "1",
      created_at: "2023-01-16 09:15:00"
    },
    {
      nganh_id: 3,
      ten_nganh: "Hệ thống thông tin",
      ma_nganh: "7480104",
      phong_khoa_id: "1",
      phong_khoa_ten: "Công nghệ thông tin",
      status: "1",
      created_at: "2023-01-17 10:45:00"
    },
    {
      nganh_id: 4,
      ten_nganh: "Khoa học máy tính",
      ma_nganh: "7480101",
      phong_khoa_id: "1",
      phong_khoa_ten: "Công nghệ thông tin",
      status: "0",
      created_at: "2023-01-18 11:30:00"
    },
    {
      nganh_id: 5,
      ten_nganh: "Kế toán",
      ma_nganh: "7340301",
      phong_khoa_id: "2",
      phong_khoa_ten: "Kế toán - Quản trị",
      status: "1",
      created_at: "2023-02-01 09:00:00"
    },
    {
      nganh_id: 6,
      ten_nganh: "Kiểm toán",
      ma_nganh: "7340302",
      phong_khoa_id: "2",
      phong_khoa_ten: "Kế toán - Quản trị",
      status: "1",
      created_at: "2023-02-02 09:30:00"
    },
    {
      nganh_id: 7,
      ten_nganh: "Quản trị kinh doanh",
      ma_nganh: "7340101",
      phong_khoa_id: "2",
      phong_khoa_ten: "Kế toán - Quản trị",
      status: "1",
      created_at: "2023-02-03 10:15:00"
    },
    {
      nganh_id: 8,
      ten_nganh: "Marketing",
      ma_nganh: "7340115",
      phong_khoa_id: "2",
      phong_khoa_ten: "Kế toán - Quản trị",
      status: "0",
      created_at: "2023-02-04 11:00:00"
    },
    {
      nganh_id: 9,
      ten_nganh: "Tiếng Anh",
      ma_nganh: "7220201",
      phong_khoa_id: "3",
      phong_khoa_ten: "Ngôn ngữ học",
      status: "1",
      created_at: "2023-03-01 08:45:00"
    },
    {
      nganh_id: 10,
      ten_nganh: "Tiếng Nhật",
      ma_nganh: "7220209",
      phong_khoa_id: "3",
      phong_khoa_ten: "Ngôn ngữ học",
      status: "1",
      created_at: "2023-03-02 09:00:00"
    },
    {
      nganh_id: 11,
      ten_nganh: "Tiếng Hàn",
      ma_nganh: "7220210",
      phong_khoa_id: "3",
      phong_khoa_ten: "Ngôn ngữ học",
      status: "1",
      created_at: "2023-03-03 10:30:00"
    },
    {
      nganh_id: 12,
      ten_nganh: "Tiếng Trung",
      ma_nganh: "7220204",
      phong_khoa_id: "3",
      phong_khoa_ten: "Ngôn ngữ học",
      status: "0",
      created_at: "2023-03-04 11:15:00"
    },
    {
      nganh_id: 13,
      ten_nganh: "Tài chính - Ngân hàng",
      ma_nganh: "7340201",
      phong_khoa_id: "4",
      phong_khoa_ten: "Tài chính - Ngân hàng",
      status: "1",
      created_at: "2023-04-01 08:00:00"
    },
    {
      nganh_id: 14,
      ten_nganh: "Bảo hiểm",
      ma_nganh: "7340204",
      phong_khoa_id: "4",
      phong_khoa_ten: "Tài chính - Ngân hàng",
      status: "1",
      created_at: "2023-04-02 09:30:00"
    },
    {
      nganh_id: 15,
      ten_nganh: "Quản trị rủi ro tài chính",
      ma_nganh: "7340205",
      phong_khoa_id: "4",
      phong_khoa_ten: "Tài chính - Ngân hàng",
      status: "1",
      created_at: "2023-04-03 10:45:00"
    },
    {
      nganh_id: 16,
      ten_nganh: "Phân tích đầu tư tài chính",
      ma_nganh: "7340208",
      phong_khoa_id: "4",
      phong_khoa_ten: "Tài chính - Ngân hàng",
      status: "0",
      created_at: "2023-04-04 11:30:00"
    },
    {
      nganh_id: 17,
      ten_nganh: "An toàn thông tin",
      ma_nganh: "7480202",
      phong_khoa_id: "1",
      phong_khoa_ten: "Công nghệ thông tin",
      status: "1",
      created_at: "2023-05-01 08:15:00"
    },
    {
      nganh_id: 18,
      ten_nganh: "Thương mại điện tử",
      ma_nganh: "7340122",
      phong_khoa_id: "2",
      phong_khoa_ten: "Kế toán - Quản trị",
      status: "1",
      created_at: "2023-05-02 09:20:00"
    },
    {
      nganh_id: 19,
      ten_nganh: "Ngôn ngữ học",
      ma_nganh: "7229020",
      phong_khoa_id: "3",
      phong_khoa_ten: "Ngôn ngữ học",
      status: "1",
      created_at: "2023-05-03 10:45:00"
    },
    {
      nganh_id: 20,
      ten_nganh: "Đầu tư chứng khoán",
      ma_nganh: "7340207",
      phong_khoa_id: "4",
      phong_khoa_ten: "Tài chính - Ngân hàng",
      status: "1",
      created_at: "2023-05-04 11:30:00"
    }
  ];

  /**
   * Hàm lọc danh sách ngành đào tạo theo các tiêu chí
   * - Tìm kiếm theo tên hoặc mã ngành
   * - Lọc theo phòng khoa
   * - Lọc theo trạng thái
   */
  function applyFilters() {
    const searchInput = document.getElementById('filter-name').value.toLowerCase();
    const departmentFilter = document.getElementById('filter-department').value;
    const statusFilter = document.getElementById('filter-status').value;
    
    filteredMajors = allMajors.filter(major => {
      // Kiểm tra tìm kiếm
      const searchMatch = 
        major.ten_nganh.toLowerCase().includes(searchInput) || 
        major.ma_nganh.toLowerCase().includes(searchInput);
        
      // Kiểm tra phòng khoa
      const departmentMatch = !departmentFilter || major.phong_khoa_id === departmentFilter;
      
      // Kiểm tra trạng thái
      const statusMatch = !statusFilter || major.status === statusFilter;
      
      return searchMatch && departmentMatch && statusMatch;
    });
    
    // Cập nhật phân trang
    paginationState.currentPage = 1;
    updatePagination();
    
    // Render bảng với dữ liệu đã lọc
    renderTable();
  }

  /**
   * Cập nhật trạng thái phân trang dựa trên số lượng dữ liệu hiển thị
   * và số lượng mục trên mỗi trang
   */
  function updatePagination() {
    const totalItems = filteredMajors.length;
    paginationState.totalPages = Math.max(1, Math.ceil(totalItems / paginationState.itemsPerPage));
    
    // Điều chỉnh trang hiện tại nếu vượt quá tổng số trang
    if (paginationState.currentPage > paginationState.totalPages) {
      paginationState.currentPage = paginationState.totalPages;
    }
    
    // Cập nhật UI phân trang
    const currentPageInput = document.getElementById('current-page-input');
    const totalPagesCount = document.getElementById('total-pages-count');
    const totalItemsCount = document.getElementById('total-items-count');
    const btnFirst = document.getElementById('first-page');
    const btnPrev = document.getElementById('prev-page');
    const btnNext = document.getElementById('next-page');
    const btnLast = document.getElementById('last-page');
    const btnPrevMobile = document.getElementById('prev-page-mobile');
    const btnNextMobile = document.getElementById('next-page-mobile');
    
    if (currentPageInput) currentPageInput.value = paginationState.currentPage;
    if (totalPagesCount) totalPagesCount.textContent = paginationState.totalPages;
    if (totalItemsCount) totalItemsCount.textContent = totalItems;
    
    // Cập nhật trạng thái nút
    if (btnFirst) btnFirst.disabled = paginationState.currentPage === 1;
    if (btnPrev) btnPrev.disabled = paginationState.currentPage === 1;
    if (btnNext) btnNext.disabled = paginationState.currentPage === paginationState.totalPages;
    if (btnLast) btnLast.disabled = paginationState.currentPage === paginationState.totalPages;
    
    // Cập nhật trạng thái nút di động
    if (btnPrevMobile) btnPrevMobile.disabled = paginationState.currentPage === 1;
    if (btnNextMobile) btnNextMobile.disabled = paginationState.currentPage === paginationState.totalPages;
  }

  /**
   * Hiển thị dữ liệu ngành đào tạo vào bảng
   * - Phân nhóm theo phòng khoa
   * - Hiển thị phân trang
   * - Xử lý trạng thái UI: loading, empty, error
   */
  function renderTable() {
    const tableBody = document.getElementById('majorsTableBody');
    const tableContainer = document.getElementById('majors-table-container');
    const loadingIndicator = document.getElementById('loading-indicator');
    const errorAlert = document.getElementById('error-alert');
    const emptyState = document.getElementById('empty-state');
    const totalMajorsBadge = document.getElementById('total-majors-badge');
    
    if (!tableBody) return;
    
    // Cập nhật tổng số ngành
    if (totalMajorsBadge) {
      totalMajorsBadge.textContent = filteredMajors.length;
    }
    
    // Hiển thị component phù hợp: loading, error, empty, hoặc table
    loadingIndicator.classList.add('hidden');
    errorAlert.classList.add('hidden');
    
    if (filteredMajors.length === 0) {
      tableContainer.classList.add('hidden');
      emptyState.classList.remove('hidden');
      return;
    } else {
      tableContainer.classList.remove('hidden');
      emptyState.classList.add('hidden');
    }
    
    const startIndex = (paginationState.currentPage - 1) * paginationState.itemsPerPage;
    const endIndex = Math.min(startIndex + paginationState.itemsPerPage, filteredMajors.length);
    const displayedMajors = filteredMajors.slice(startIndex, endIndex);
    
    // Nhóm ngành theo phòng khoa
    const majorsByDepartment = {};
    displayedMajors.forEach(major => {
      const deptId = major.phong_khoa_id;
      if (!majorsByDepartment[deptId]) {
        majorsByDepartment[deptId] = {
          name: major.phong_khoa_ten || 'Chưa phân công',
          majors: []
        };
      }
      majorsByDepartment[deptId].majors.push(major);
    });

    // Render dữ liệu theo nhóm
    let html = '';
    
    Object.keys(majorsByDepartment).forEach(deptId => {
      const department = majorsByDepartment[deptId];
      
      // Header cho mỗi phòng khoa
      html += `
        <tr class="bg-gray-50">
          <td colspan="6" class="px-4 py-3">
            <div class="flex items-center font-semibold text-gray-700">
              <i class="ri-building-line mr-2 text-primary"></i>
              Phòng/Khoa: ${department.name}
              <span class="ml-2 text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                ${department.majors.length} ngành
              </span>
            </div>
          </td>
        </tr>
      `;
      
      // Dữ liệu của các ngành trong phòng khoa
      department.majors.forEach(major => {
        html += `
          <tr class="hover:bg-gray-50">
            <td class="px-4 py-3 whitespace-nowrap">
              <div class="text-sm font-medium text-gray-900">${major.nganh_id}</div>
            </td>
            <td class="px-4 py-3 whitespace-nowrap">
              <div class="text-sm font-medium text-gray-900">${major.ma_nganh}</div>
            </td>
            <td class="px-4 py-3">
              <div class="text-sm font-medium text-gray-900">${major.ten_nganh}</div>
            </td>
            <td class="px-4 py-3">
              <div class="text-sm text-gray-900">${major.phong_khoa_ten || 'Chưa phân công'}</div>
            </td>
            <td class="px-4 py-3">
              <span class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                ${major.status === '1' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
                ${major.status === '1' ? 'Hoạt động' : 'Không hoạt động'}
              </span>
            </td>
            <td class="px-4 py-3 text-right text-sm font-medium">
              <div class="flex justify-end space-x-2">
                <a href="major-detail.html?id=${major.nganh_id}" class="text-blue-600 hover:text-blue-900" title="Xem chi tiết">
                  <i class="ri-eye-line"></i>
                </a>
                <a href="major-edit.html?id=${major.nganh_id}" class="text-green-600 hover:text-green-900" title="Chỉnh sửa">
                  <i class="ri-edit-line"></i>
                </a>
                <button onclick="deleteMajor(${major.nganh_id})" class="text-red-600 hover:text-red-900" title="Xóa">
                  <i class="ri-delete-bin-line"></i>
                </button>
              </div>
            </td>
          </tr>
        `;
      });
    });
    
    tableBody.innerHTML = html;
    
    // Cập nhật UI phân trang di động
    const currentPageMobile = document.getElementById('current-page-mobile');
    const totalPagesMobile = document.getElementById('total-pages-mobile');
    
    if (currentPageMobile) currentPageMobile.textContent = paginationState.currentPage;
    if (totalPagesMobile) totalPagesMobile.textContent = paginationState.totalPages;
    
    // Cập nhật trạng thái nút di động
    const prevPageMobile = document.getElementById('prev-page-mobile');
    const nextPageMobile = document.getElementById('next-page-mobile');
    
    if (prevPageMobile) prevPageMobile.disabled = paginationState.currentPage === 1;
    if (nextPageMobile) nextPageMobile.disabled = paginationState.currentPage === paginationState.totalPages;
  }

  /**
   * Định dạng ngày giờ theo định dạng Việt Nam
   * @param {string} dateString - Chuỗi ngày giờ cần định dạng
   * @returns {string} Chuỗi ngày giờ đã định dạng
   */
  function formatDate(dateString) {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('vi-VN', options);
  }
  
  /**
   * Xử lý xóa ngành đào tạo
   * @param {number} majorId - ID của ngành cần xóa
   */
  window.deleteMajor = function(majorId) {
    const major = allMajors.find(m => m.nganh_id === majorId);
    if (major) {
      // Hiển thị modal xác nhận
      const deleteMajorName = document.getElementById('delete-major-name');
      if (deleteMajorName) {
        deleteMajorName.textContent = `${major.ten_nganh} (${major.ma_nganh})`;
      }
      
      currentMajorIdToDelete = majorId;
      deleteModal.classList.remove('hidden');
    }
  };
  
  // Chuyển link thêm mới đến trang create
  const addMajorBtn = document.querySelector('a[href="major-create.html"]');
  if (addMajorBtn) {
    // Đảm bảo link hoạt động đúng
    addMajorBtn.href = "major-create.html";
  }
  
  // Thiết lập các event listeners cho phân trang
  const itemsPerPageSelect = document.getElementById('items-per-page');
  const currentPageInput = document.getElementById('current-page-input');
  const btnFirst = document.getElementById('first-page');
  const btnPrev = document.getElementById('prev-page');
  const btnNext = document.getElementById('next-page');
  const btnLast = document.getElementById('last-page');
  const btnPrevMobile = document.getElementById('prev-page-mobile');
  const btnNextMobile = document.getElementById('next-page-mobile');
  
  if (itemsPerPageSelect) {
    itemsPerPageSelect.addEventListener('change', function() {
      paginationState.itemsPerPage = Number(this.value);
      paginationState.currentPage = 1;
      updatePagination();
      renderTable();
    });
  }
  
  if (currentPageInput) {
    currentPageInput.addEventListener('change', function() {
      let newPage = Number(this.value);
      if (newPage < 1) newPage = 1;
      if (newPage > paginationState.totalPages) newPage = paginationState.totalPages;
      
      paginationState.currentPage = newPage;
      updatePagination();
      renderTable();
    });
  }
  
  // Desktop pagination
  if (btnFirst) {
    btnFirst.addEventListener('click', function() {
      if (paginationState.currentPage > 1) {
        paginationState.currentPage = 1;
        updatePagination();
        renderTable();
      }
    });
  }
  
  if (btnPrev) {
    btnPrev.addEventListener('click', function() {
      if (paginationState.currentPage > 1) {
        paginationState.currentPage--;
        updatePagination();
        renderTable();
      }
    });
  }
  
  if (btnNext) {
    btnNext.addEventListener('click', function() {
      if (paginationState.currentPage < paginationState.totalPages) {
        paginationState.currentPage++;
        updatePagination();
        renderTable();
      }
    });
  }
  
  if (btnLast) {
    btnLast.addEventListener('click', function() {
      if (paginationState.currentPage < paginationState.totalPages) {
        paginationState.currentPage = paginationState.totalPages;
        updatePagination();
        renderTable();
      }
    });
  }
  
  // Mobile pagination
  if (btnPrevMobile) {
    btnPrevMobile.addEventListener('click', function() {
      if (paginationState.currentPage > 1) {
        paginationState.currentPage--;
        updatePagination();
        renderTable();
      }
    });
  }
  
  if (btnNextMobile) {
    btnNextMobile.addEventListener('click', function() {
      if (paginationState.currentPage < paginationState.totalPages) {
        paginationState.currentPage++;
        updatePagination();
        renderTable();
      }
    });
  }

  // Thiết lập các event listeners cho bộ lọc
  const filterForm = document.getElementById('filter-form');
  const resetFilterBtn = document.getElementById('reset-filter-btn');
  const clearFiltersEmpty = document.getElementById('clear-filters-empty');
  const retryBtn = document.getElementById('retry-btn');
  
  if (filterForm) {
    filterForm.addEventListener('submit', function(e) {
      e.preventDefault();
      applyFilters();
    });
  }
  
  if (resetFilterBtn) {
    resetFilterBtn.addEventListener('click', function() {
      document.getElementById('filter-name').value = '';
      document.getElementById('filter-department').value = '';
      document.getElementById('filter-status').value = '';
      applyFilters();
    });
  }
  
  if (clearFiltersEmpty) {
    clearFiltersEmpty.addEventListener('click', function() {
      document.getElementById('filter-name').value = '';
      document.getElementById('filter-department').value = '';
      document.getElementById('filter-status').value = '';
      applyFilters();
    });
  }

  if (retryBtn) {
    retryBtn.addEventListener('click', function() {
      loadData();
    });
  }

  /**
   * Hiển thị thông báo dạng toast
   * @param {string} message - Nội dung thông báo
   * @param {string} type - Loại thông báo: 'success' hoặc 'error'
   */
  function showToast(message, type = 'success') {
    const toastContainer = document.getElementById('toast-container');
    const toastId = 'toast-' + Date.now();
    const toastClasses = type === 'success' ? 'bg-green-500' : 'bg-red-500';
    const toastIcon = type === 'success' ? '<i class="ri-check-line"></i>' : '<i class="ri-error-warning-line"></i>';
    
    const toast = document.createElement('div');
    toast.id = toastId;
    toast.className = `${toastClasses} text-white px-4 py-3 rounded-lg shadow-lg mb-3 flex items-center transform transition-all duration-300 translate-y-0 opacity-100`;
    toast.innerHTML = `
      <div class="mr-2">${toastIcon}</div>
      <div>${message}</div>
      <div class="ml-auto cursor-pointer" onclick="document.getElementById('${toastId}').remove()">
        <i class="ri-close-line"></i>
      </div>
    `;
    
    toastContainer.appendChild(toast);
    
    // Tự động xóa sau 5 giây
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
  }

  // Xử lý form xóa ngành
  const deleteModal = document.getElementById('delete-modal');
  const cancelDeleteBtn = document.getElementById('cancel-delete');
  const confirmDeleteBtn = document.getElementById('confirm-delete');
  let currentMajorIdToDelete = null;

  if (cancelDeleteBtn) {
    cancelDeleteBtn.addEventListener('click', function() {
      deleteModal.classList.add('hidden');
      currentMajorIdToDelete = null;
    });
  }
  
  if (confirmDeleteBtn) {
    confirmDeleteBtn.addEventListener('click', function() {
      try {
        if (currentMajorIdToDelete !== null) {
          const index = allMajors.findIndex(m => m.nganh_id === currentMajorIdToDelete);
          if (index !== -1) {
            const deletedMajor = allMajors[index];
            allMajors.splice(index, 1);
            
            // Cập nhật UI
            applyFilters();
            showToast(`Đã xóa ngành đào tạo "${deletedMajor.ten_nganh}" thành công!`, 'success');
            
            // Đóng modal
            deleteModal.classList.add('hidden');
            currentMajorIdToDelete = null;
          } else {
            throw new Error('Không tìm thấy ngành cần xóa!');
          }
        }
      } catch (error) {
        showToast(`Lỗi khi xóa ngành: ${error.message}`, 'error');
      }
    });
  }

  /**
   * Tạo danh sách phòng khoa cho bộ lọc từ dữ liệu ngành
   */
  function populateDepartmentFilter() {
    const departmentFilter = document.getElementById('filter-department');
    if (!departmentFilter) return;
    
    // Reset options
    departmentFilter.innerHTML = '<option value="">Tất cả</option>';
    
    // Get unique departments
    const departments = new Map();
    
    allMajors.forEach(major => {
      if (!departments.has(major.phong_khoa_id)) {
        departments.set(major.phong_khoa_id, major.phong_khoa_ten);
      }
    });
    
    // Add options
    departments.forEach((name, id) => {
      const option = document.createElement('option');
      option.value = id;
      option.textContent = name;
      departmentFilter.appendChild(option);
    });
  }
  
  /**
   * Lưu dữ liệu vào localStorage để các trang khác sử dụng
   * như trang major-create.html, major-edit.html, major-detail.html
   */
  function saveMajorsToLocalStorage() {
    localStorage.setItem('majorsMockData', JSON.stringify(allMajors));
  }
  
  /**
   * Tải dữ liệu ngành đào tạo
   * Trong môi trường thực tế, hàm này sẽ gọi API để lấy dữ liệu từ server
   */
  function loadData() {
    const loadingIndicator = document.getElementById('loading-indicator');
    const errorAlert = document.getElementById('error-alert');
    const tableContainer = document.getElementById('majors-table-container');
    const emptyState = document.getElementById('empty-state');
    
    // Hiển thị loading
    if (loadingIndicator) loadingIndicator.classList.remove('hidden');
    if (errorAlert) errorAlert.classList.add('hidden');
    if (tableContainer) tableContainer.classList.add('hidden');
    if (emptyState) emptyState.classList.add('hidden');
    
    // Simulate API call
    setTimeout(() => {
      try {
        // Lưu dữ liệu vào localStorage
        saveMajorsToLocalStorage();
        
        // Populate department filter
        populateDepartmentFilter();
        
        // Update UI
        filteredMajors = [...allMajors];
        paginationState.currentPage = 1;
        updatePagination();
        renderTable();
        
        // Ẩn loading
        if (loadingIndicator) loadingIndicator.classList.add('hidden');
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu:', error);
        
        // Hiển thị lỗi
        if (loadingIndicator) loadingIndicator.classList.add('hidden');
        if (errorAlert) {
          errorAlert.classList.remove('hidden');
          const errorMessage = document.getElementById('error-message');
          if (errorMessage) {
            errorMessage.textContent = error.message || 'Có lỗi xảy ra khi tải danh sách ngành đào tạo.';
          }
        }
      }
    }, 1000); // Giả lập độ trễ mạng 1 giây
  }

  // Khởi tạo ban đầu
  loadData();
});

