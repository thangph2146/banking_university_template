// Khởi tạo AOS
AOS.init({
  duration: 800,
  once: true
});

// Khởi tạo các biến trạng thái
let allDepartments = [];
let filteredDepartments = [];

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
    function handleClickOutside(event) {
      if (userMenu && !userMenu.contains(event.target) && !userMenuButton.contains(event.target)) {
        userMenu.classList.add('opacity-0', 'invisible', 'scale-95');
        userMenu.classList.remove('opacity-100', 'visible', 'scale-100');
        document.removeEventListener('click', handleClickOutside);
      }
    }
    
    userMenuButton.addEventListener('click', (event) => {
      event.stopPropagation();
      const isVisible = userMenu.classList.contains('opacity-100');
      if (isVisible) {
        userMenu.classList.add('opacity-0', 'invisible', 'scale-95');
        userMenu.classList.remove('opacity-100', 'visible', 'scale-100');
        document.removeEventListener('click', handleClickOutside);
      } else {
        userMenu.classList.remove('opacity-0', 'invisible', 'scale-95');
        userMenu.classList.add('opacity-100', 'visible', 'scale-100');
        setTimeout(() => document.addEventListener('click', handleClickOutside), 0);
      }
    });
  }

  // Modal xử lý
  const addDepartmentBtn = document.getElementById('add-department-btn');

  function openDepartmentModal(department = null) {
    const modal = document.getElementById('department-modal');
    const modalTitle = document.getElementById('modal-title');
    const departmentForm = document.getElementById('department-form');
    const departmentIdInput = document.getElementById('department-id');
    const modalDepartmentNameInput = document.getElementById('modal-department-name');
    const modalDepartmentDescriptionInput = document.getElementById('modal-department-description');
    
    departmentForm.reset();
    
    if (department) {
      // Chế độ chỉnh sửa
      modalTitle.textContent = 'Chỉnh sửa Phòng khoa';
      departmentIdInput.value = department.phong_khoa_id;
      modalDepartmentNameInput.value = department.ten_phong_khoa;
      modalDepartmentDescriptionInput.value = department.ghi_chu || '';
    } else {
      // Chế độ thêm mới
      modalTitle.textContent = 'Thêm Phòng khoa mới';
      departmentIdInput.value = '';
    }
    
    if (modal) {
      modal.classList.remove('hidden');
    }
  }

  window.closeDepartmentModal = function() {
    const modal = document.getElementById('department-modal');
    if (modal) {
      modal.classList.add('hidden');
      // Reset form
      document.getElementById('department-form').reset();
    }
  };

  if (addDepartmentBtn) {
    addDepartmentBtn.addEventListener('click', () => openDepartmentModal());
  }

  // Đóng modal khi click bên ngoài
  const departmentModal = document.getElementById('department-modal');
  if (departmentModal) {
    departmentModal.addEventListener('click', (event) => {
      if (event.target === departmentModal) {
        closeDepartmentModal();
      }
    });
  }

  // Xử lý nút đóng modal
  const closeDepartmentModalBtn = document.getElementById('close-department-modal');
  if (closeDepartmentModalBtn) {
    closeDepartmentModalBtn.addEventListener('click', closeDepartmentModal);
  }

  // Xử lý nút hủy
  const cancelDepartmentBtn = document.getElementById('cancel-department');
  if (cancelDepartmentBtn) {
    cancelDepartmentBtn.addEventListener('click', closeDepartmentModal);
  }

  // Form xử lý
  const departmentForm = document.getElementById('department-form');
  if (departmentForm) {
    departmentForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const departmentId = document.getElementById('department-id').value;
      const departmentName = document.getElementById('modal-department-name').value.trim();
      const departmentDescription = document.getElementById('modal-department-description').value.trim();
      
      if (!departmentName) {
        alert('Vui lòng nhập tên Phòng khoa!');
        return;
      }
      
      if (departmentId) {
        // Chế độ cập nhật
        const index = allDepartments.findIndex(dept => dept.phong_khoa_id === parseInt(departmentId));
        if (index !== -1) {
          allDepartments[index].ten_phong_khoa = departmentName;
          allDepartments[index].ghi_chu = departmentDescription;
          allDepartments[index].updated_at = new Date().toISOString();
          
          alert('Cập nhật phòng khoa thành công!');
        }
      } else {
        // Chế độ thêm mới
        const newDepartment = {
          phong_khoa_id: getNewDepartmentId(),
          ma_phong_khoa: generateDepartmentCode(departmentName),
          ten_phong_khoa: departmentName,
          ghi_chu: departmentDescription,
          status: 1,
          created_at: new Date().toISOString(),
          updated_at: null,
          deleted_at: null
        };
        
        allDepartments.unshift(newDepartment);
        alert('Thêm phòng khoa thành công!');
      }
      
      applyFilters();
      closeDepartmentModal();
    });
  }
  
  // Hàm tạo ID mới cho phòng khoa
  function getNewDepartmentId() {
    return allDepartments.length > 0 
      ? Math.max(...allDepartments.map(dept => dept.phong_khoa_id)) + 1 
      : 1;
  }
  
  // Hàm tạo mã phòng khoa từ tên
  function generateDepartmentCode(name) {
    // Loại bỏ dấu tiếng Việt
    const normalized = name.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    // Lấy các chữ cái đầu và viết hoa
    const initials = normalized
      .split(/\s+/)
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase();
    
    // Thêm số ngẫu nhiên để tránh trùng lặp
    return `${initials}${Math.floor(100 + Math.random() * 900)}`;
  }

  // Dữ liệu mẫu cho 20 phòng khoa
  allDepartments = [
    {
      phong_khoa_id: 1,
      ma_phong_khoa: "CNTT",
      ten_phong_khoa: "Công nghệ thông tin",
      ghi_chu: "Đào tạo các chuyên ngành về máy tính và phần mềm",
      status: 1,
      created_at: "2023-01-10T00:00:00.000Z",
      updated_at: null,
      deleted_at: null
    },
    {
      phong_khoa_id: 2,
      ma_phong_khoa: "QTKD",
      ten_phong_khoa: "Quản trị kinh doanh",
      ghi_chu: "Đào tạo về quản lý, marketing, tài chính",
      status: 1,
      created_at: "2023-01-15T00:00:00.000Z",
      updated_at: null,
      deleted_at: null
    },
    {
      phong_khoa_id: 3,
      ma_phong_khoa: "KTKT",
      ten_phong_khoa: "Kế toán - Kiểm toán",
      ghi_chu: "Đào tạo chuyên sâu về kế toán và kiểm toán",
      status: 1,
      created_at: "2023-02-05T00:00:00.000Z",
      updated_at: null,
      deleted_at: null
    },
    {
      phong_khoa_id: 4,
      ma_phong_khoa: "NNA",
      ten_phong_khoa: "Ngôn ngữ Anh",
      ghi_chu: "Đào tạo về ngôn ngữ và văn hóa Anh - Mỹ",
      status: 1,
      created_at: "2023-02-10T00:00:00.000Z",
      updated_at: null,
      deleted_at: null
    },
    {
      phong_khoa_id: 5,
      ma_phong_khoa: "LUAT",
      ten_phong_khoa: "Luật",
      ghi_chu: "Đào tạo các chuyên ngành luật học",
      status: 1,
      created_at: "2023-03-01T00:00:00.000Z",
      updated_at: null,
      deleted_at: null
    },
    {
      phong_khoa_id: 6,
      ma_phong_khoa: "CKCTM",
      ten_phong_khoa: "Cơ khí chế tạo máy",
      ghi_chu: "Đào tạo kỹ sư cơ khí",
      status: 1,
      created_at: "2023-03-15T00:00:00.000Z",
      updated_at: null,
      deleted_at: null
    },
    {
      phong_khoa_id: 7,
      ma_phong_khoa: "DDT",
      ten_phong_khoa: "Điện - Điện tử",
      ghi_chu: "Đào tạo kỹ sư điện, điện tử viễn thông",
      status: 1,
      created_at: "2023-04-05T00:00:00.000Z",
      updated_at: null,
      deleted_at: null
    },
    {
      phong_khoa_id: 8,
      ma_phong_khoa: "KT",
      ten_phong_khoa: "Kiến trúc",
      ghi_chu: "Đào tạo kiến trúc sư",
      status: 0,
      created_at: "2023-04-20T00:00:00.000Z",
      updated_at: null,
      deleted_at: null
    },
    {
      phong_khoa_id: 9,
      ma_phong_khoa: "MT",
      ten_phong_khoa: "Môi trường",
      ghi_chu: "Đào tạo về khoa học và kỹ thuật môi trường",
      status: 1,
      created_at: "2023-05-10T00:00:00.000Z",
      updated_at: null,
      deleted_at: null
    },
    {
      phong_khoa_id: 10,
      ma_phong_khoa: "DL",
      ten_phong_khoa: "Du lịch",
      ghi_chu: "Đào tạo các nghiệp vụ du lịch, khách sạn",
      status: 1,
      created_at: "2023-05-25T00:00:00.000Z",
      updated_at: null,
      deleted_at: null
    },
    {
      phong_khoa_id: 11,
      ma_phong_khoa: "YDUOC",
      ten_phong_khoa: "Y - Dược",
      ghi_chu: "Đào tạo chuyên ngành y học và dược phẩm",
      status: 1,
      created_at: "2023-06-10T00:00:00.000Z",
      updated_at: null,
      deleted_at: null
    },
    {
      phong_khoa_id: 12,
      ma_phong_khoa: "MT",
      ten_phong_khoa: "Mỹ thuật",
      ghi_chu: "Đào tạo về nghệ thuật tạo hình, thiết kế",
      status: 0,
      created_at: "2023-06-20T00:00:00.000Z",
      updated_at: null,
      deleted_at: null
    },
    {
      phong_khoa_id: 13,
      ma_phong_khoa: "TDH",
      ten_phong_khoa: "Tự động hóa",
      ghi_chu: "Đào tạo kỹ sư tự động hóa, hệ thống thông minh",
      status: 1,
      created_at: "2023-07-05T00:00:00.000Z",
      updated_at: null,
      deleted_at: null
    },
    {
      phong_khoa_id: 14,
      ma_phong_khoa: "BBT",
      ten_phong_khoa: "Báo chí - Báo truyền hình",
      ghi_chu: "Đào tạo nghiệp vụ báo chí, truyền thông",
      status: 1,
      created_at: "2023-07-15T00:00:00.000Z",
      updated_at: null,
      deleted_at: null
    },
    {
      phong_khoa_id: 15,
      ma_phong_khoa: "NNPD",
      ten_phong_khoa: "Ngôn ngữ Pháp - Đức",
      ghi_chu: "Đào tạo chuyên sâu về ngôn ngữ và văn hóa Pháp, Đức",
      status: 1,
      created_at: "2023-08-01T00:00:00.000Z",
      updated_at: null,
      deleted_at: null
    },
    {
      phong_khoa_id: 16,
      ma_phong_khoa: "NNTQ",
      ten_phong_khoa: "Ngôn ngữ Trung Quốc",
      ghi_chu: "Đào tạo về ngôn ngữ và văn hóa Trung Quốc",
      status: 1,
      created_at: "2023-08-20T00:00:00.000Z",
      updated_at: null,
      deleted_at: null
    },
    {
      phong_khoa_id: 17,
      ma_phong_khoa: "TCNH",
      ten_phong_khoa: "Tài chính - Ngân hàng",
      ghi_chu: "Đào tạo chuyên sâu về tài chính, ngân hàng",
      status: 1,
      created_at: "2023-09-05T00:00:00.000Z",
      updated_at: null,
      deleted_at: null
    },
    {
      phong_khoa_id: 18,
      ma_phong_khoa: "KTXD",
      ten_phong_khoa: "Kỹ thuật xây dựng",
      ghi_chu: "Đào tạo kỹ sư xây dựng, cầu đường",
      status: 1,
      created_at: "2023-09-25T00:00:00.000Z",
      updated_at: null,
      deleted_at: null
    },
    {
      phong_khoa_id: 19,
      ma_phong_khoa: "KTCNTP",
      ten_phong_khoa: "Kỹ thuật công nghệ thực phẩm",
      ghi_chu: "Đào tạo kỹ thuật chế biến, bảo quản thực phẩm",
      status: 0,
      created_at: "2023-10-10T00:00:00.000Z",
      updated_at: null,
      deleted_at: null
    },
    {
      phong_khoa_id: 20,
      ma_phong_khoa: "LLCT",
      ten_phong_khoa: "Lý luận chính trị",
      ghi_chu: "Đào tạo về chính trị, tư tưởng",
      status: 1,
      created_at: "2023-10-20T00:00:00.000Z",
      updated_at: null,
      deleted_at: null
    }
  ];

  // Thiết lập bộ lọc và sự kiện
  const filterForm = document.getElementById('filter-form');
  const filterNameInput = document.getElementById('filter-name');
  const filterCodeInput = document.getElementById('filter-code');
  const filterTypeInput = document.getElementById('filter-type');
  const filterStatusInput = document.getElementById('filter-status');
  const resetFilterBtn = document.getElementById('reset-filter-btn');
  
  // Sự kiện áp dụng bộ lọc
  if (filterForm) {
    filterForm.addEventListener('submit', function(e) {
      e.preventDefault();
      applyFilters();
    });
  }
  
  // Sự kiện đặt lại bộ lọc
  if (resetFilterBtn) {
    resetFilterBtn.addEventListener('click', function() {
      filterForm.reset();
      applyFilters();
    });
  }
  
  // Hàm áp dụng bộ lọc
  function applyFilters() {
    const nameFilter = filterNameInput ? filterNameInput.value.toLowerCase().trim() : '';
    const codeFilter = filterCodeInput ? filterCodeInput.value.toLowerCase().trim() : '';
    const typeFilter = filterTypeInput ? filterTypeInput.value : '';
    const statusFilter = filterStatusInput ? filterStatusInput.value : '';
    
    filteredDepartments = allDepartments.filter(dept => {
      const nameMatch = !nameFilter || dept.ten_phong_khoa.toLowerCase().includes(nameFilter);
      const codeMatch = !codeFilter || dept.ma_phong_khoa.toLowerCase().includes(codeFilter);
      // Type filter not implemented yet as it's not in the schema
      const statusMatch = statusFilter === '' || dept.status.toString() === statusFilter;
      
      return nameMatch && codeMatch && statusMatch;
    });
    
    paginationState.currentPage = 1;
    updatePagination();
    renderTable();
  }
  
  // Thiết lập phân trang
  const itemsPerPageSelect = document.getElementById('items-per-page');
  const currentPageInput = document.getElementById('current-page-input');
  const totalItemsCountSpan = document.getElementById('total-items-count');
  const totalPagesCountSpan = document.getElementById('total-pages-count');
  const btnFirst = document.querySelector('.btn-first');
  const btnPrev = document.querySelector('.btn-prev');
  const btnNext = document.querySelector('.btn-next');
  const btnLast = document.querySelector('.btn-last');
  
  if (itemsPerPageSelect) {
    itemsPerPageSelect.addEventListener('change', function() {
      paginationState.itemsPerPage = parseInt(this.value);
      paginationState.currentPage = 1;
      updatePagination();
      renderTable();
    });
  }
  
  if (currentPageInput) {
    currentPageInput.addEventListener('change', function() {
      let page = parseInt(this.value);
      if (isNaN(page) || page < 1) {
        page = 1;
      } else if (page > paginationState.totalPages) {
        page = paginationState.totalPages;
      }
      paginationState.currentPage = page;
      renderTable();
    });
  }
  
  if (btnFirst) {
    btnFirst.addEventListener('click', function() {
      if (paginationState.currentPage > 1) {
        paginationState.currentPage = 1;
        renderTable();
      }
    });
  }
  
  if (btnPrev) {
    btnPrev.addEventListener('click', function() {
      if (paginationState.currentPage > 1) {
        paginationState.currentPage--;
        renderTable();
      }
    });
  }
  
  if (btnNext) {
    btnNext.addEventListener('click', function() {
      if (paginationState.currentPage < paginationState.totalPages) {
        paginationState.currentPage++;
        renderTable();
      }
    });
  }
  
  if (btnLast) {
    btnLast.addEventListener('click', function() {
      if (paginationState.currentPage < paginationState.totalPages) {
        paginationState.currentPage = paginationState.totalPages;
        renderTable();
      }
    });
  }
  
  // Cập nhật thông tin phân trang
  function updatePagination() {
    paginationState.totalPages = Math.ceil(filteredDepartments.length / paginationState.itemsPerPage);
    if (paginationState.totalPages < 1) paginationState.totalPages = 1;
    
    if (totalItemsCountSpan) {
      totalItemsCountSpan.textContent = filteredDepartments.length;
    }
    
    if (totalPagesCountSpan) {
      totalPagesCountSpan.textContent = paginationState.totalPages;
    }
    
    if (currentPageInput) {
      currentPageInput.value = paginationState.currentPage;
      currentPageInput.max = paginationState.totalPages;
    }
    
    updatePaginationButtons();
  }
  
  // Cập nhật trạng thái các nút phân trang
  function updatePaginationButtons() {
    const isFirstPage = paginationState.currentPage === 1;
    const isLastPage = paginationState.currentPage === paginationState.totalPages;
    
    if (btnFirst) btnFirst.disabled = isFirstPage;
    if (btnPrev) btnPrev.disabled = isFirstPage;
    if (btnNext) btnNext.disabled = isLastPage;
    if (btnLast) btnLast.disabled = isLastPage;
  }
  
  // Render bảng dữ liệu
  function renderTable() {
    const tableBody = document.getElementById('departmentsTableBody');
    const noDataPlaceholder = document.getElementById('no-data-placeholder');
    
    if (!tableBody) return;
    
    // Xóa dữ liệu cũ
    tableBody.innerHTML = '';
    
    // Hiển thị thông báo khi không có dữ liệu
    if (filteredDepartments.length === 0) {
      if (noDataPlaceholder) {
        noDataPlaceholder.classList.remove('hidden');
      }
      updatePagination();
      return;
    }
    
    // Ẩn thông báo không có dữ liệu
    if (noDataPlaceholder) {
      noDataPlaceholder.classList.add('hidden');
    }
    
    // Tính toán dữ liệu cần hiển thị
    const start = (paginationState.currentPage - 1) * paginationState.itemsPerPage;
    const end = Math.min(start + paginationState.itemsPerPage, filteredDepartments.length);
    const displayedDepartments = filteredDepartments.slice(start, end);
    
    // Render các hàng dữ liệu
    displayedDepartments.forEach(dept => {
      const row = document.createElement('tr');
      row.className = 'hover:bg-gray-50 transition-colors duration-150';
      
      row.innerHTML = `
        <td class="px-4 py-3 text-sm text-gray-700">${dept.ma_phong_khoa}</td>
        <td class="px-4 py-3 text-sm font-medium text-gray-900">${dept.ten_phong_khoa}</td>
        <td class="px-4 py-3 text-sm text-gray-600">${dept.ghi_chu || 'Chưa có mô tả'}</td>
        <td class="px-4 py-3 text-right text-sm font-medium">
          <div class="flex items-center justify-end space-x-3">
            <button onclick="editDepartment(${dept.phong_khoa_id})" class="text-blue-600 hover:text-blue-900">
              <i class="ri-pencil-line"></i>
            </button>
            <button onclick="deleteDepartment(${dept.phong_khoa_id})" class="text-red-600 hover:text-red-900">
              <i class="ri-delete-bin-line"></i>
            </button>
          </div>
        </td>
      `;
      
      tableBody.appendChild(row);
    });
    
    updatePagination();
  }
  
  // Các hàm xử lý phòng khoa
  window.editDepartment = function(departmentId) {
    const department = allDepartments.find(d => d.phong_khoa_id === departmentId);
    if (department) {
      openDepartmentModal(department);
    }
  };
  
  window.deleteDepartment = function(departmentId) {
    const department = allDepartments.find(d => d.phong_khoa_id === departmentId);
    if (!department) return;
    
    if (confirm(`Bạn có chắc chắn muốn xóa phòng khoa "${department.ten_phong_khoa}" không?`)) {
      const index = allDepartments.findIndex(d => d.phong_khoa_id === departmentId);
      if (index !== -1) {
        allDepartments.splice(index, 1);
        applyFilters();
        alert('Đã xóa phòng khoa thành công!');
      }
    }
  };
  
  // Nút làm mới
  const refreshBtn = document.getElementById('refresh-btn');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', function() {
      filterForm.reset();
      applyFilters();
      alert('Đã tải lại danh sách phòng khoa.');
    });
  }
  
  // Khởi tạo dữ liệu ban đầu
  paginationState.itemsPerPage = parseInt(itemsPerPageSelect ? itemsPerPageSelect.value : 10);
  filteredDepartments = [...allDepartments];
  updatePagination();
  renderTable();
}); 