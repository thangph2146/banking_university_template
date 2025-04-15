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

  // Modal xử lý
  const createCourseBtn = document.getElementById('add-course-btn');

  function openCourseModal() {
    const modal = document.getElementById('course-modal');
    if (modal) {
      modal.classList.remove('hidden');
    }
  }

  window.closeCourseModal = function() {
    const modal = document.getElementById('course-modal');
    if (modal) {
      modal.classList.add('hidden');
      // Reset form
      document.getElementById('course-form').reset();
    }
  };

  if (createCourseBtn) {
    createCourseBtn.addEventListener('click', openCourseModal);
  }

  // Form xử lý
  const courseForm = document.getElementById('course-form');
  if (courseForm) {
    courseForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Lấy dữ liệu từ form
      const courseName = document.getElementById('modal-course-name').value;
      
      if (!courseName) {
        alert('Vui lòng nhập tên khóa học!');
        return;
      }
      
      // Kiểm tra nếu có course ID thì là edit, không thì là thêm mới
      const courseId = document.getElementById('course-id').value;
      
      if (courseId) {
        // Cập nhật khóa học
        const index = allCourses.findIndex(course => course.khoa_hoc_id === parseInt(courseId));
        if (index !== -1) {
          allCourses[index].ten_khoa_hoc = courseName;
          allCourses[index].phong_khoa_id = document.getElementById('modal-course-department').value || null;
          allCourses[index].nam_bat_dau = document.getElementById('modal-course-year-start').value || null;
          allCourses[index].nam_ket_thuc = document.getElementById('modal-course-year-end').value || null;
          allCourses[index].status = parseInt(document.getElementById('modal-course-status').value);
          allCourses[index].updated_at = new Date().toISOString();
          
          alert('Cập nhật khóa học thành công!');
        } else {
          alert('Không tìm thấy khóa học để cập nhật!');
        }
      } else {
        // Thêm khóa học mới
        const newCourse = {
          khoa_hoc_id: allCourses.length > 0 ? Math.max(...allCourses.map(c => c.khoa_hoc_id)) + 1 : 1,
          ten_khoa_hoc: courseName,
          phong_khoa_id: document.getElementById('modal-course-department').value || null,
          nam_bat_dau: document.getElementById('modal-course-year-start').value || null,
          nam_ket_thuc: document.getElementById('modal-course-year-end').value || null,
          status: parseInt(document.getElementById('modal-course-status').value),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          deleted_at: null
        };
        
        allCourses.unshift(newCourse);
        alert('Thêm khóa học mới thành công!');
      }
      
      closeCourseModal();
      applyFilters();
    });
  }

  // Dữ liệu mẫu cho 20 khóa học
  allCourses = [
    {
      khoa_hoc_id: 1,
      ten_khoa_hoc: "Khóa 2021-2025",
      nam_bat_dau: 2021,
      nam_ket_thuc: 2025,
      phong_khoa_id: 1,
      status: 1,
      created_at: "2021-05-10T00:00:00",
      updated_at: "2021-05-10T00:00:00",
      deleted_at: null
    },
    {
      khoa_hoc_id: 2,
      ten_khoa_hoc: "Khóa 2020-2024",
      nam_bat_dau: 2020,
      nam_ket_thuc: 2024,
      phong_khoa_id: 2,
      status: 1,
      created_at: "2020-05-15T00:00:00",
      updated_at: "2020-05-15T00:00:00",
      deleted_at: null
    },
    {
      khoa_hoc_id: 3,
      ten_khoa_hoc: "Khóa 2019-2023",
      nam_bat_dau: 2019,
      nam_ket_thuc: 2023,
      phong_khoa_id: 1,
      status: 1,
      created_at: "2019-05-20T00:00:00",
      updated_at: "2019-05-20T00:00:00",
      deleted_at: null
    },
    {
      khoa_hoc_id: 4,
      ten_khoa_hoc: "Khóa 2018-2022",
      nam_bat_dau: 2018,
      nam_ket_thuc: 2022,
      phong_khoa_id: 3,
      status: 0,
      created_at: "2018-05-25T00:00:00",
      updated_at: "2018-05-25T00:00:00",
      deleted_at: null
    },
    {
      khoa_hoc_id: 5,
      ten_khoa_hoc: "Khóa 2017-2021",
      nam_bat_dau: 2017,
      nam_ket_thuc: 2021,
      phong_khoa_id: 2,
      status: 0,
      created_at: "2017-06-01T00:00:00",
      updated_at: "2017-06-01T00:00:00",
      deleted_at: null
    },
    {
      khoa_hoc_id: 6,
      ten_khoa_hoc: "Khóa 2022-2026",
      nam_bat_dau: 2022,
      nam_ket_thuc: 2026,
      phong_khoa_id: 4,
      status: 1,
      created_at: "2022-05-05T00:00:00",
      updated_at: "2022-05-05T00:00:00",
      deleted_at: null
    },
    {
      khoa_hoc_id: 7,
      ten_khoa_hoc: "Khóa 2023-2027",
      nam_bat_dau: 2023,
      nam_ket_thuc: 2027,
      phong_khoa_id: 1,
      status: 1,
      created_at: "2023-05-01T00:00:00",
      updated_at: "2023-05-01T00:00:00",
      deleted_at: null
    },
    {
      khoa_hoc_id: 8,
      ten_khoa_hoc: "Khóa 2016-2020",
      nam_bat_dau: 2016,
      nam_ket_thuc: 2020,
      phong_khoa_id: 3,
      status: 0,
      created_at: "2016-05-10T00:00:00",
      updated_at: "2016-05-10T00:00:00",
      deleted_at: null
    },
    {
      khoa_hoc_id: 9,
      ten_khoa_hoc: "Khóa 2015-2019",
      nam_bat_dau: 2015,
      nam_ket_thuc: 2019,
      phong_khoa_id: 2,
      status: 0,
      created_at: "2015-05-15T00:00:00",
      updated_at: "2015-05-15T00:00:00",
      deleted_at: null
    },
    {
      khoa_hoc_id: 10,
      ten_khoa_hoc: "Khóa 2024-2028",
      nam_bat_dau: 2024,
      nam_ket_thuc: 2028,
      phong_khoa_id: 4,
      status: 1,
      created_at: "2024-04-30T00:00:00",
      updated_at: "2024-04-30T00:00:00",
      deleted_at: null
    },
    {
      khoa_hoc_id: 11,
      ten_khoa_hoc: "Khóa 2014-2018",
      nam_bat_dau: 2014,
      nam_ket_thuc: 2018,
      phong_khoa_id: 1,
      status: 0,
      created_at: "2014-05-20T00:00:00",
      updated_at: "2014-05-20T00:00:00",
      deleted_at: null
    },
    {
      khoa_hoc_id: 12,
      ten_khoa_hoc: "Khóa 2013-2017",
      nam_bat_dau: 2013,
      nam_ket_thuc: 2017,
      phong_khoa_id: 3,
      status: 0,
      created_at: "2013-05-25T00:00:00",
      updated_at: "2013-05-25T00:00:00",
      deleted_at: null
    },
    {
      khoa_hoc_id: 13,
      ten_khoa_hoc: "Khóa 2012-2016",
      nam_bat_dau: 2012,
      nam_ket_thuc: 2016,
      phong_khoa_id: 2,
      status: 0,
      created_at: "2012-06-01T00:00:00",
      updated_at: "2012-06-01T00:00:00",
      deleted_at: null
    },
    {
      khoa_hoc_id: 14,
      ten_khoa_hoc: "Khóa 2011-2015",
      nam_bat_dau: 2011,
      nam_ket_thuc: 2015,
      phong_khoa_id: 4,
      status: 0,
      created_at: "2011-05-05T00:00:00",
      updated_at: "2011-05-05T00:00:00",
      deleted_at: null
    },
    {
      khoa_hoc_id: 15,
      ten_khoa_hoc: "Khóa 2010-2014",
      nam_bat_dau: 2010,
      nam_ket_thuc: 2014,
      phong_khoa_id: 1,
      status: 0,
      created_at: "2010-05-10T00:00:00",
      updated_at: "2010-05-10T00:00:00",
      deleted_at: null
    },
    {
      khoa_hoc_id: 16,
      ten_khoa_hoc: "Khóa 2009-2013",
      nam_bat_dau: 2009,
      nam_ket_thuc: 2013,
      phong_khoa_id: 3,
      status: 0,
      created_at: "2009-05-15T00:00:00",
      updated_at: "2009-05-15T00:00:00",
      deleted_at: null
    },
    {
      khoa_hoc_id: 17,
      ten_khoa_hoc: "Khóa 2008-2012",
      nam_bat_dau: 2008,
      nam_ket_thuc: 2012,
      phong_khoa_id: 2,
      status: 0,
      created_at: "2008-05-20T00:00:00",
      updated_at: "2008-05-20T00:00:00",
      deleted_at: null
    },
    {
      khoa_hoc_id: 18,
      ten_khoa_hoc: "Khóa 2007-2011",
      nam_bat_dau: 2007,
      nam_ket_thuc: 2011,
      phong_khoa_id: 4,
      status: 0,
      created_at: "2007-05-25T00:00:00",
      updated_at: "2007-05-25T00:00:00",
      deleted_at: null
    },
    {
      khoa_hoc_id: 19,
      ten_khoa_hoc: "Khóa 2006-2010",
      nam_bat_dau: 2006,
      nam_ket_thuc: 2010,
      phong_khoa_id: 1,
      status: 0,
      created_at: "2006-06-01T00:00:00",
      updated_at: "2006-06-01T00:00:00",
      deleted_at: null
    },
    {
      khoa_hoc_id: 20,
      ten_khoa_hoc: "Khóa 2005-2009",
      nam_bat_dau: 2005,
      nam_ket_thuc: 2009,
      phong_khoa_id: 3,
      status: 0,
      created_at: "2005-05-05T00:00:00",
      updated_at: "2005-05-05T00:00:00",
      deleted_at: null
    }
  ];

  // Hàm lọc khóa học
  function applyFilters() {
    const nameFilter = document.getElementById('filter-name').value.toLowerCase();
    const yearFilter = document.getElementById('filter-year').value;
    const statusFilter = document.getElementById('filter-status').value;
    
    filteredCourses = allCourses.filter(course => {
      // Kiểm tra tên
      const nameMatch = !nameFilter || 
        course.ten_khoa_hoc.toLowerCase().includes(nameFilter);
      
      // Kiểm tra năm học
      const yearMatch = !yearFilter || 
        (yearFilter === course.nam_bat_dau + "-" + course.nam_ket_thuc);
      
      // Kiểm tra trạng thái
      const statusMatch = !statusFilter || course.status.toString() === statusFilter;
      
      return nameMatch && yearMatch && statusMatch;
    });
    
    // Cập nhật phân trang
    paginationState.currentPage = 1;
    updatePagination();
    
    // Render bảng với dữ liệu đã lọc
    renderTable();
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
    const btnFirst = document.querySelector('.btn-first');
    const btnPrev = document.querySelector('.btn-prev');
    const btnNext = document.querySelector('.btn-next');
    const btnLast = document.querySelector('.btn-last');
    
    if (currentPageInput) currentPageInput.value = paginationState.currentPage;
    if (totalPagesCount) totalPagesCount.textContent = paginationState.totalPages;
    if (totalItemsCount) totalItemsCount.textContent = totalItems;
    
    // Cập nhật trạng thái nút
    if (btnFirst) btnFirst.disabled = paginationState.currentPage === 1;
    if (btnPrev) btnPrev.disabled = paginationState.currentPage === 1;
    if (btnNext) btnNext.disabled = paginationState.currentPage === paginationState.totalPages;
    if (btnLast) btnLast.disabled = paginationState.currentPage === paginationState.totalPages;
  }

  // Render dữ liệu vào bảng
  function renderTable() {
    const tableBody = document.getElementById('coursesTableBody');
    const noDataPlaceholder = document.getElementById('no-data-placeholder');
    
    if (!tableBody) return;
    
    const startIndex = (paginationState.currentPage - 1) * paginationState.itemsPerPage;
    const endIndex = Math.min(startIndex + paginationState.itemsPerPage, filteredCourses.length);
    const displayedCourses = filteredCourses.slice(startIndex, endIndex);
    
    // Kiểm tra nếu không có dữ liệu
    if (displayedCourses.length === 0) {
      tableBody.innerHTML = '';
      if (noDataPlaceholder) {
        noDataPlaceholder.classList.remove('hidden');
      }
      return;
    }
    
    // Ẩn thông báo không có dữ liệu nếu có dữ liệu
    if (noDataPlaceholder) {
      noDataPlaceholder.classList.add('hidden');
    }
    
    // Render dữ liệu
    tableBody.innerHTML = displayedCourses.map(course => `
      <tr class="hover:bg-gray-50">
        <td class="px-4 py-3 text-sm">${course.khoa_hoc_id}</td>
        <td class="px-4 py-3">
          <div class="font-medium text-gray-900">${course.ten_khoa_hoc}</div>
          <div class="text-sm text-gray-500">${course.nam_bat_dau || ''} - ${course.nam_ket_thuc || ''}</div>
        </td>
        <td class="px-4 py-3">
          <div class="text-sm text-gray-600">
            ${course.phong_khoa_id ? `Khoa/Phòng ID: ${course.phong_khoa_id}` : 'Chưa phân công'}
          </div>
        </td>
        <td class="px-4 py-3">
          <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
            ${course.status === 1 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
            ${course.status === 1 ? 'Hoạt động' : 'Không hoạt động'}
          </span>
        </td>
        <td class="px-4 py-3 text-right text-sm font-medium">
          <div class="flex justify-end space-x-2">
            <button onclick="editCourse(${course.khoa_hoc_id})" class="text-blue-600 hover:text-blue-900">
              <i class="ri-edit-line"></i>
            </button>
            <button onclick="deleteCourse(${course.khoa_hoc_id})" class="text-red-600 hover:text-red-900">
              <i class="ri-delete-bin-line"></i>
            </button>
          </div>
        </td>
      </tr>
    `).join('');
  }

  // Định dạng ngày
  function formatDate(dateString) {
    if (!dateString) return '';
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('vi-VN', options);
  }
  
  // Các hàm xử lý khóa học
  window.editCourse = function(courseId) {
    const course = allCourses.find(c => c.khoa_hoc_id === courseId);
    if (course) {
      document.getElementById('course-id').value = course.khoa_hoc_id;
      document.getElementById('modal-course-name').value = course.ten_khoa_hoc;
      
      if (document.getElementById('modal-course-department')) {
        document.getElementById('modal-course-department').value = course.phong_khoa_id || '';
      }
      
      if (document.getElementById('modal-course-year-start')) {
        document.getElementById('modal-course-year-start').value = course.nam_bat_dau || '';
      }
      
      if (document.getElementById('modal-course-year-end')) {
        document.getElementById('modal-course-year-end').value = course.nam_ket_thuc || '';
      }
      
      if (document.getElementById('modal-course-status')) {
        document.getElementById('modal-course-status').value = course.status.toString();
      }
      
      document.getElementById('modal-title').textContent = 'Chỉnh sửa khóa học';
      openCourseModal();
    } else {
      alert('Không tìm thấy khóa học này!');
    }
  };
  
  window.deleteCourse = function(courseId) {
    if (confirm('Bạn có chắc chắn muốn xóa khóa học này?')) {
      const courseIndex = allCourses.findIndex(c => c.khoa_hoc_id === courseId);
      if (courseIndex !== -1) {
        allCourses.splice(courseIndex, 1);
        applyFilters(); // Cập nhật lại danh sách
        alert('Đã xóa khóa học thành công!');
      } else {
        alert('Không tìm thấy khóa học để xóa!');
      }
    }
  };

  // Thiết lập các event listeners cho phân trang
  const itemsPerPageSelect = document.getElementById('items-per-page');
  const currentPageInput = document.getElementById('current-page-input');
  const btnFirst = document.querySelector('.btn-first');
  const btnPrev = document.querySelector('.btn-prev');
  const btnNext = document.querySelector('.btn-next');
  const btnLast = document.querySelector('.btn-last');
  
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

  // Thiết lập các event listeners cho bộ lọc
  const filterForm = document.getElementById('filter-form');
  const resetFilterBtn = document.getElementById('reset-filter-btn');
  const refreshBtn = document.getElementById('refresh-btn');
  
  if (filterForm) {
    filterForm.addEventListener('submit', function(e) {
      e.preventDefault();
      applyFilters();
    });
  }
  
  if (resetFilterBtn) {
    resetFilterBtn.addEventListener('click', function() {
      filterForm.reset();
    });
  }
  
  if (refreshBtn) {
    refreshBtn.addEventListener('click', function() {
      // Reset lại dữ liệu từ nguồn (trong trường hợp thực tế sẽ gọi API)
      filteredCourses = [...allCourses];
      filterForm.reset();
      paginationState.currentPage = 1;
      updatePagination();
      renderTable();
      alert('Đã tải lại danh sách khóa học!');
    });
  }

  // Khởi tạo ban đầu
  filteredCourses = [...allCourses];
  updatePagination();
  renderTable();
}); 