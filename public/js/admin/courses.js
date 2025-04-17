// Khởi tạo AOS
AOS.init();

// Khởi tạo các biến trạng thái
let allCourses = [];
let filteredCourses = [];

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
  const userMenuButton = document.getElementById('user-menu-button');
  const userMenu = document.getElementById('user-menu');

  if (userMenuButton && userMenu) {
    userMenuButton.addEventListener('click', () => {
      userMenu.classList.toggle('opacity-0');
      userMenu.classList.toggle('invisible');
      userMenu.classList.toggle('scale-95');
      userMenu.classList.toggle('scale-100');
    });

    // Đóng menu khi click ra ngoài
    document.addEventListener('click', (e) => {
      if (!userMenuButton.contains(e.target) && !userMenu.contains(e.target)) {
        userMenu.classList.add('opacity-0', 'invisible', 'scale-95');
        userMenu.classList.remove('scale-100');
      }
    });
  }

  // Dữ liệu mẫu cho khóa học
  allCourses = [
    {
      khoa_hoc_id: 1,
      ma_khoa_hoc: "CS2021",
      ten_khoa_hoc: "Công nghệ thông tin",
      tin_chi: 4,
      bac_hoc: "Đại học",
      bac_hoc_id: 1, 
      status: 1,
      created_at: "2021-05-10T00:00:00",
      updated_at: "2021-05-10T00:00:00",
      deleted_at: null
    },
    {
      khoa_hoc_id: 2,
      ma_khoa_hoc: "BA2021",
      ten_khoa_hoc: "Quản trị kinh doanh",
      tin_chi: 3,
      bac_hoc: "Đại học",
      bac_hoc_id: 1,
      status: 1,
      created_at: "2020-05-15T00:00:00",
      updated_at: "2020-05-15T00:00:00",
      deleted_at: null
    },
    {
      khoa_hoc_id: 3,
      ma_khoa_hoc: "FIN2021",
      ten_khoa_hoc: "Tài chính - Ngân hàng",
      tin_chi: 3,
      bac_hoc: "Đại học",
      bac_hoc_id: 1,
      status: 1,
      created_at: "2019-05-20T00:00:00",
      updated_at: "2019-05-20T00:00:00",
      deleted_at: null
    },
    {
      khoa_hoc_id: 4,
      ma_khoa_hoc: "MKT2020",
      ten_khoa_hoc: "Marketing",
      tin_chi: 3,
      bac_hoc: "Đại học",
      bac_hoc_id: 1,
      status: 0,
      created_at: "2018-05-25T00:00:00",
      updated_at: "2018-05-25T00:00:00",
      deleted_at: null
    },
    {
      khoa_hoc_id: 5,
      ma_khoa_hoc: "ACC2019",
      ten_khoa_hoc: "Kế toán",
      tin_chi: 3,
      bac_hoc: "Đại học",
      bac_hoc_id: 1,
      status: 0,
      created_at: "2017-06-01T00:00:00",
      updated_at: "2017-06-01T00:00:00",
      deleted_at: null
    },
    {
      khoa_hoc_id: 6,
      ma_khoa_hoc: "AI2022",
      ten_khoa_hoc: "Trí tuệ nhân tạo",
      tin_chi: 4,
      bac_hoc: "Cao học",
      bac_hoc_id: 2,
      status: 1,
      created_at: "2022-05-05T00:00:00",
      updated_at: "2022-05-05T00:00:00",
      deleted_at: null
    },
    {
      khoa_hoc_id: 7,
      ma_khoa_hoc: "ML2023",
      ten_khoa_hoc: "Học máy",
      tin_chi: 3,
      bac_hoc: "Cao học",
      bac_hoc_id: 2,
      status: 1,
      created_at: "2023-05-01T00:00:00",
      updated_at: "2023-05-01T00:00:00",
      deleted_at: null
    },
    {
      khoa_hoc_id: 8,
      ma_khoa_hoc: "DL2022",
      ten_khoa_hoc: "Học sâu",
      tin_chi: 3,
      bac_hoc: "Cao học",
      bac_hoc_id: 2,
      status: 0,
      created_at: "2016-05-10T00:00:00",
      updated_at: "2016-05-10T00:00:00",
      deleted_at: null
    },
    {
      khoa_hoc_id: 9,
      ma_khoa_hoc: "STAT2021",
      ten_khoa_hoc: "Thống kê ứng dụng",
      tin_chi: 2,
      bac_hoc: "Đại học",
      bac_hoc_id: 1,
      status: 0,
      created_at: "2015-05-15T00:00:00",
      updated_at: "2015-05-15T00:00:00",
      deleted_at: null
    },
    {
      khoa_hoc_id: 10,
      ma_khoa_hoc: "DM2024",
      ten_khoa_hoc: "Khai phá dữ liệu",
      tin_chi: 3,
      bac_hoc: "Cao học",
      bac_hoc_id: 2,
      status: 1,
      created_at: "2024-04-30T00:00:00",
      updated_at: "2024-04-30T00:00:00",
      deleted_at: null
    }
  ];

  // Hàm lọc khóa học
  function applyFilters() {
    // Hiện loading indicator
    const loadingIndicator = document.getElementById('loading-indicator');
    const coursesListContainer = document.getElementById('courses-list-container');
    const emptyState = document.getElementById('empty-state');
    const errorContainer = document.getElementById('error-container');
    
    if (loadingIndicator) loadingIndicator.classList.remove('hidden');
    if (coursesListContainer) coursesListContainer.classList.add('hidden');
    if (emptyState) emptyState.classList.add('hidden');
    if (errorContainer) errorContainer.classList.add('hidden');
    
    // Lấy giá trị từ form lọc
    const nameFilter = document.getElementById('filter-name')?.value?.toLowerCase() || '';
    const codeFilter = document.getElementById('filter-code')?.value?.toLowerCase() || '';
    const statusFilter = document.getElementById('filter-status')?.value || '';
    const levelFilter = document.getElementById('filter-level')?.value || '';
    
    // Thực hiện lọc dữ liệu
    filteredCourses = allCourses.filter(course => {
      // Lọc theo tên
      const nameMatch = !nameFilter || 
        course.ten_khoa_hoc.toLowerCase().includes(nameFilter);
      
      // Lọc theo mã khóa học
      const codeMatch = !codeFilter || 
        course.ma_khoa_hoc.toLowerCase().includes(codeFilter);
      
      // Lọc theo trạng thái
      const statusMatch = !statusFilter || 
        course.status.toString() === statusFilter;
      
      // Lọc theo bậc học
      const levelMatch = !levelFilter || 
        course.bac_hoc_id.toString() === levelFilter;
      
      return nameMatch && codeMatch && statusMatch && levelMatch;
    });
    
    // Mô phỏng delay từ API để hiển thị loading
    setTimeout(() => {
      if (loadingIndicator) loadingIndicator.classList.add('hidden');
      
      // Cập nhật hiển thị dựa trên kết quả lọc
      if (filteredCourses.length === 0) {
        if (emptyState) emptyState.classList.remove('hidden');
      } else {
        if (coursesListContainer) coursesListContainer.classList.remove('hidden');
      }
      
      // Cập nhật phân trang
      paginationState.currentPage = 1;
      updatePagination();
      
      // Render bảng với dữ liệu đã lọc
      renderTable();
      
      // Cập nhật tổng số khóa học
      updateTotalCoursesCount();
    }, 500);
  }
  
  // Cập nhật số lượng khóa học
  function updateTotalCoursesCount() {
    const totalCoursesBadge = document.getElementById('total-courses-badge');
    if (totalCoursesBadge) {
      totalCoursesBadge.textContent = filteredCourses.length;
    }
  }

  // Cập nhật trạng thái phân trang
  function updatePagination() {
    const totalItems = filteredCourses.length;
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
    
    // Cập nhật cho desktop
    if (currentPageInput) currentPageInput.value = paginationState.currentPage;
    if (totalPagesCount) totalPagesCount.textContent = paginationState.totalPages;
    if (totalItemsCount) totalItemsCount.textContent = totalItems;
    
    // Cập nhật cho mobile
    const currentPageMobile = document.getElementById('current-page-mobile');
    const totalPagesMobile = document.getElementById('total-pages-mobile');
    const btnPrevMobile = document.getElementById('prev-page-mobile');
    const btnNextMobile = document.getElementById('next-page-mobile');
    
    if (currentPageMobile) currentPageMobile.textContent = paginationState.currentPage;
    if (totalPagesMobile) totalPagesMobile.textContent = paginationState.totalPages;
    
    // Cập nhật trạng thái nút - desktop
    if (btnFirst) btnFirst.disabled = paginationState.currentPage === 1;
    if (btnPrev) btnPrev.disabled = paginationState.currentPage === 1;
    if (btnNext) btnNext.disabled = paginationState.currentPage === paginationState.totalPages;
    if (btnLast) btnLast.disabled = paginationState.currentPage === paginationState.totalPages;
    
    // Cập nhật trạng thái nút - mobile
    if (btnPrevMobile) btnPrevMobile.disabled = paginationState.currentPage === 1;
    if (btnNextMobile) btnNextMobile.disabled = paginationState.currentPage === paginationState.totalPages;
  }

  // Render dữ liệu vào bảng
  function renderTable() {
    const tableBody = document.getElementById('coursesTableBody');
    
    if (!tableBody) return;
    
    const startIndex = (paginationState.currentPage - 1) * paginationState.itemsPerPage;
    const endIndex = Math.min(startIndex + paginationState.itemsPerPage, filteredCourses.length);
    const displayedCourses = filteredCourses.slice(startIndex, endIndex);
    
    // Kiểm tra nếu không có dữ liệu
    if (displayedCourses.length === 0) {
      tableBody.innerHTML = '';
      document.getElementById('courses-list-container').classList.add('hidden');
      document.getElementById('empty-state').classList.remove('hidden');
      return;
    }
    
    // Render dữ liệu theo cấu trúc của bảng trong HTML
    tableBody.innerHTML = displayedCourses.map(course => `
      <tr class="hover:bg-gray-50">
        <td class="px-4 py-3 text-sm">${course.khoa_hoc_id}</td>
        <td class="px-4 py-3 text-sm">${course.ma_khoa_hoc}</td>
        <td class="px-4 py-3">
          <div class="font-medium text-gray-900">${course.ten_khoa_hoc}</div>
        </td>
        <td class="px-4 py-3 text-sm">${course.tin_chi}</td>
        <td class="px-4 py-3 text-sm">${course.bac_hoc}</td>
        <td class="px-4 py-3">
          <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
            ${course.status === 1 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
            ${course.status === 1 ? 'Hoạt động' : 'Không hoạt động'}
          </span>
        </td>
        <td class="px-4 py-3 text-right text-sm font-medium">
          <div class="flex justify-end space-x-2">
            <a href="course-detail.html?id=${course.khoa_hoc_id}" class="text-blue-600 hover:text-blue-900" title="Xem chi tiết">
              <i class="ri-eye-line"></i>
            </a>
            <a href="course-edit.html?id=${course.khoa_hoc_id}" class="text-blue-600 hover:text-blue-900" title="Chỉnh sửa">
              <i class="ri-edit-line"></i>
            </a>
            <button onclick="deleteCourse(${course.khoa_hoc_id})" class="text-red-600 hover:text-red-900" title="Xóa">
              <i class="ri-delete-bin-line"></i>
            </button>
          </div>
        </td>
      </tr>
    `).join('');
  }

  // Hàm xóa khóa học
  window.deleteCourse = function(courseId) {
    if (confirm('Bạn có chắc chắn muốn xóa khóa học này?')) {
      const courseIndex = allCourses.findIndex(c => c.khoa_hoc_id === courseId);
      if (courseIndex !== -1) {
        allCourses.splice(courseIndex, 1);
        applyFilters(); // Cập nhật lại danh sách
        showToast('success', 'Đã xóa khóa học thành công!');
      } else {
        showToast('error', 'Không tìm thấy khóa học để xóa!');
      }
    }
  };

  // Hiển thị thông báo toast
  function showToast(type, message) {
    const toastContainer = document.getElementById('toast-container');
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `animate-fade-in-up max-w-xs bg-white border rounded-lg shadow-lg pointer-events-auto mb-3 ${type === 'success' ? 'border-green-500' : 'border-red-500'}`;
    
    toast.innerHTML = `
      <div class="p-4">
        <div class="flex items-start">
          <div class="flex-shrink-0">
            <i class="${type === 'success' ? 'ri-checkbox-circle-line text-green-500' : 'ri-error-warning-line text-red-500'}"></i>
          </div>
          <div class="ml-3 w-0 flex-1">
            <p class="text-sm font-medium text-gray-900">${message}</p>
          </div>
          <div class="ml-4 flex-shrink-0 flex">
            <button class="inline-flex text-gray-400 hover:text-gray-500">
              <i class="ri-close-line"></i>
            </button>
          </div>
        </div>
      </div>
    `;
    
    toastContainer.appendChild(toast);
    
    // Tự động đóng sau 3 giây
    setTimeout(() => {
      toast.classList.add('animate-fade-out-down');
      setTimeout(() => {
        toastContainer.removeChild(toast);
      }, 300);
    }, 3000);
    
    // Xử lý nút đóng
    const closeButton = toast.querySelector('button');
    closeButton.addEventListener('click', () => {
      toast.classList.add('animate-fade-out-down');
      setTimeout(() => {
        toastContainer.removeChild(toast);
      }, 300);
    });
  }

  // Thiết lập các event listeners cho phân trang
  const itemsPerPageSelect = document.getElementById('items-per-page');
  const currentPageInput = document.getElementById('current-page-input');
  const btnFirst = document.getElementById('first-page');
  const btnPrev = document.getElementById('prev-page');
  const btnNext = document.getElementById('next-page');
  const btnLast = document.getElementById('last-page');
  
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
  const btnPrevMobile = document.getElementById('prev-page-mobile');
  const btnNextMobile = document.getElementById('next-page-mobile');
  
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
  const retryButton = document.getElementById('retry-button');
  
  if (filterForm) {
    filterForm.addEventListener('submit', function(e) {
      e.preventDefault();
      applyFilters();
    });
  }
  
  if (resetFilterBtn) {
    resetFilterBtn.addEventListener('click', function() {
      filterForm.reset();
      // Khi reset không tự động apply, cần click nút lọc
    });
  }
  
  if (clearFiltersEmpty) {
    clearFiltersEmpty.addEventListener('click', function() {
      filterForm.reset();
      applyFilters();
    });
  }
  
  if (retryButton) {
    retryButton.addEventListener('click', function() {
      applyFilters();
    });
  }

  // Khởi tạo ban đầu
  filteredCourses = [...allCourses];
  updatePagination();
  renderTable();
  updateTotalCoursesCount();
}); 