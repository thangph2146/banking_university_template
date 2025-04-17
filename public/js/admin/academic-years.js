// Initialize AOS
AOS.init({
  duration: 800, // Animation duration
  once: true, // Whether animation should happen only once
});

document.addEventListener('DOMContentLoaded', function () {
  // State variables
  let allAcademicYears = []; // Stores all academic years
  let currentAcademicYears = []; // Stores years currently displayed
  let currentPage = 1;
  let itemsPerPage = 10;
  let totalPages = 1;

  // --- Mock Data (Dữ liệu mẫu dựa trên bảng nam_hoc) ---
  const academicYearsMockData = [
    { MaNH: 1, TenNH: 'Năm học 2023-2024', NamBatDau: 2023, NamKetThuc: 2024, TrangThai: 1 },
    { MaNH: 2, TenNH: 'Năm học 2022-2023', NamBatDau: 2022, NamKetThuc: 2023, TrangThai: 1 },
    { MaNH: 3, TenNH: 'Năm học 2021-2022', NamBatDau: 2021, NamKetThuc: 2022, TrangThai: 1 },
    { MaNH: 4, TenNH: 'Năm học 2020-2021', NamBatDau: 2020, NamKetThuc: 2021, TrangThai: 0 },
    { MaNH: 5, TenNH: 'Năm học 2019-2020', NamBatDau: 2019, NamKetThuc: 2020, TrangThai: 0 },
    { MaNH: 6, TenNH: 'Năm học 2018-2019', NamBatDau: 2018, NamKetThuc: 2019, TrangThai: 0 },
    { MaNH: 7, TenNH: 'Năm học 2017-2018', NamBatDau: 2017, NamKetThuc: 2018, TrangThai: 0 },
    { MaNH: 8, TenNH: 'Năm học 2016-2017', NamBatDau: 2016, NamKetThuc: 2017, TrangThai: 0 },
    { MaNH: 9, TenNH: 'Năm học 2015-2016', NamBatDau: 2015, NamKetThuc: 2016, TrangThai: 0 },
    { MaNH: 10, TenNH: 'Năm học 2014-2015', NamBatDau: 2014, NamKetThuc: 2015, TrangThai: 0 },
    { MaNH: 11, TenNH: 'Năm học 2013-2014', NamBatDau: 2013, NamKetThuc: 2014, TrangThai: 0 },
    { MaNH: 12, TenNH: 'Năm học 2012-2013', NamBatDau: 2012, NamKetThuc: 2013, TrangThai: 0 },
    { MaNH: 13, TenNH: 'Năm học 2011-2012', NamBatDau: 2011, NamKetThuc: 2012, TrangThai: 0 },
    { MaNH: 14, TenNH: 'Năm học 2010-2011', NamBatDau: 2010, NamKetThuc: 2011, TrangThai: 0 },
    { MaNH: 15, TenNH: 'Năm học 2009-2010', NamBatDau: 2009, NamKetThuc: 2010, TrangThai: 0 }
  ];
  
  // Sử dụng dữ liệu mẫu
  allAcademicYears = [...academicYearsMockData];

  // DOM Elements
  const sidebar = document.getElementById('sidebar');
  const sidebarBackdrop = document.getElementById('sidebar-backdrop');
  const sidebarOpenBtn = document.getElementById('sidebar-open');
  const sidebarCloseBtn = document.getElementById('sidebar-close');
  const userMenuButton = document.getElementById('user-menu-button');
  const userMenu = document.getElementById('user-menu');
  const academicYearsTableBody = document.getElementById('academicYearsTableBody');
  const paginationControls = document.getElementById('pagination-controls');
  const itemsPerPageSelect = document.getElementById('items-per-page');
  const totalItemsCountSpan = document.getElementById('total-items-count');
  const totalPagesCountSpan = document.getElementById('total-pages-count');
  const currentPageInput = document.getElementById('current-page-input');
  const filterForm = document.getElementById('filter-form');
  const filterNameInput = document.getElementById('filter-name');
  const filterStartYearInput = document.getElementById('filter-start-year');
  const filterEndYearInput = document.getElementById('filter-end-year');
  const filterStatusSelect = document.getElementById('filter-status');
  const noDataPlaceholder = document.getElementById('no-data-placeholder');
  const addYearBtn = document.getElementById('add-year-btn');
  const refreshBtn = document.getElementById('refresh-btn');

  // --- UI Interactions ---

  // Sidebar toggle
  if (sidebarOpenBtn && sidebar && sidebarBackdrop && sidebarCloseBtn) {
    sidebarOpenBtn.addEventListener('click', () => {
      sidebar.classList.remove('-translate-x-full');
      sidebarBackdrop.classList.remove('hidden');
    });
    sidebarCloseBtn.addEventListener('click', () => {
      sidebar.classList.add('-translate-x-full');
      sidebarBackdrop.classList.add('hidden');
    });
    sidebarBackdrop.addEventListener('click', () => {
      sidebar.classList.add('-translate-x-full');
      sidebarBackdrop.classList.add('hidden');
    });
  }

  // User menu toggle
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

  // --- Data Handling & Rendering ---

  // Hàm hiển thị dữ liệu trong bảng
  const renderTable = () => {
    academicYearsTableBody.innerHTML = '';
    noDataPlaceholder.classList.add('hidden');

    if (currentAcademicYears.length === 0) {
      noDataPlaceholder.classList.remove('hidden');
      totalItemsCountSpan.textContent = 0;
      totalPagesCountSpan.textContent = 1;
      currentPageInput.value = 1;
      updatePaginationButtons();
      return;
    }

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const yearsToRender = currentAcademicYears.slice(startIndex, endIndex);

    yearsToRender.forEach(year => {
      const row = document.createElement('tr');
      row.className = 'hover:bg-gray-50 transition-colors duration-150';

      // Định dạng trạng thái
      const statusClass = year.TrangThai === 1 
        ? 'bg-green-100 text-green-800' 
        : 'bg-gray-100 text-gray-800';
      const statusText = year.TrangThai === 1 
        ? 'Hoạt động' 
        : 'Không hoạt động';

      row.innerHTML = `
        <td class="px-4 py-3 text-sm text-gray-700">${year.MaNH}</td>
        <td class="px-4 py-3 text-sm font-medium text-gray-900">${year.TenNH}</td>
        <td class="px-4 py-3 text-sm text-gray-600">${year.NamBatDau}</td>
        <td class="px-4 py-3 text-sm text-gray-600">${year.NamKetThuc}</td>
        <td class="px-4 py-3 text-sm">
          <span class="px-2 py-1 rounded-full text-xs font-medium ${statusClass}">
            ${statusText}
          </span>
        </td>
        <td class="px-4 py-3 text-right text-sm font-medium space-x-2">
          <a href="academic-year-detail.html?id=${year.MaNH}" class="text-blue-600 hover:text-blue-800" title="Chi tiết">
            <i class="ri-eye-line"></i>
          </a>
          <a href="academic-year-edit.html?id=${year.MaNH}" class="text-blue-600 hover:text-blue-800" title="Sửa">
            <i class="ri-pencil-line"></i>
          </a>
          <button class="text-red-600 hover:text-red-800 delete-year-btn" data-id="${year.MaNH}" title="Xóa">
            <i class="ri-delete-bin-line"></i>
          </button>
        </td>
      `;
      academicYearsTableBody.appendChild(row);
    });

    academicYearsTableBody.querySelectorAll('.delete-year-btn').forEach(button => {
      button.addEventListener('click', handleDeleteYear);
    });

    updatePaginationInfo();
  };

  // Hàm cập nhật thông tin phân trang
  const updatePaginationInfo = () => {
    totalPages = Math.ceil(currentAcademicYears.length / itemsPerPage);
    if (totalPages < 1) totalPages = 1;

    totalItemsCountSpan.textContent = currentAcademicYears.length;
    totalPagesCountSpan.textContent = totalPages;
    currentPageInput.max = totalPages;
    currentPageInput.value = currentPage;

    updatePaginationButtons();
  };

  // Hàm cập nhật trạng thái các nút phân trang
  const updatePaginationButtons = () => {
    const isFirstPage = currentPage === 1;
    const isLastPage = currentPage === totalPages;

    paginationControls.querySelector('.btn-first').disabled = isFirstPage;
    paginationControls.querySelector('.btn-prev').disabled = isFirstPage;
    paginationControls.querySelector('.btn-next').disabled = isLastPage;
    paginationControls.querySelector('.btn-last').disabled = isLastPage;
  };

  // Hàm áp dụng bộ lọc
  const applyFilters = () => {
    const nameFilter = filterNameInput.value.toLowerCase().trim();
    const startYearFilter = filterStartYearInput.value ? parseInt(filterStartYearInput.value, 10) : null;
    const endYearFilter = filterEndYearInput.value ? parseInt(filterEndYearInput.value, 10) : null;
    const statusFilter = filterStatusSelect.value;

    currentAcademicYears = allAcademicYears.filter(year => {
      const nameMatch = !nameFilter || year.TenNH.toLowerCase().includes(nameFilter);
      const startYearMatch = !startYearFilter || year.NamBatDau === startYearFilter;
      const endYearMatch = !endYearFilter || year.NamKetThuc === endYearFilter;
      
      // Xử lý lọc theo trạng thái
      let statusMatch = true;
      if (statusFilter === '1') {
        statusMatch = year.TrangThai === 1;
      } else if (statusFilter === '0') {
        statusMatch = year.TrangThai === 0;
      } else if (statusFilter === 'current') {
        // Giả định năm học hiện tại là năm học hoạt động gần đây nhất
        const currentYear = new Date().getFullYear();
        statusMatch = year.NamBatDau <= currentYear && year.NamKetThuc >= currentYear;
      }

      return nameMatch && startYearMatch && endYearMatch && statusMatch;
    });

    currentPage = 1;
    renderTable();
  };

  // Hàm xử lý xóa năm học
  const handleDeleteYear = (event) => {
    const button = event.target.closest('.delete-year-btn');
    const yearId = parseInt(button.dataset.id, 10);
    const yearToDelete = allAcademicYears.find(year => year.MaNH === yearId);

    if (!yearToDelete) {
        console.error('Năm học không tồn tại:', yearId);
        alert('Lỗi: Không tìm thấy năm học để xóa.');
        return;
    }

    if (confirm(`Bạn có chắc chắn muốn xóa năm học "${yearToDelete.TenNH}" (ID: ${yearId}) không?`)) {
      const index = allAcademicYears.findIndex(y => y.MaNH === yearId);
      if (index !== -1) {
        allAcademicYears.splice(index, 1);
        console.log('Đã xóa năm học ID:', yearId);
        alert('Xóa năm học thành công!');
        applyFilters();
      } else {
        console.error('Không tìm thấy năm học để xóa sau khi xác nhận:', yearId);
        alert('Lỗi: Không thể xóa năm học.');
      }
    }
  };

  // --- Event Listeners ---

  if (filterForm) {
    filterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      applyFilters();
    });
    
    const resetFilterBtn = document.getElementById('reset-filter-btn');
    if (resetFilterBtn) {
      resetFilterBtn.addEventListener('click', () => {
        filterForm.reset();
        applyFilters();
      });
    }
  }

  if (itemsPerPageSelect) {
    itemsPerPageSelect.addEventListener('change', (e) => {
      itemsPerPage = parseInt(e.target.value, 10);
      currentPage = 1;
      renderTable();
    });
  }

  if (paginationControls) {
    paginationControls.addEventListener('click', (e) => {
      const button = e.target.closest('button');
      if (!button) return;
      if (button.classList.contains('btn-first')) currentPage = 1;
      else if (button.classList.contains('btn-prev')) { if (currentPage > 1) currentPage--; }
      else if (button.classList.contains('btn-next')) { if (currentPage < totalPages) currentPage++; }
      else if (button.classList.contains('btn-last')) currentPage = totalPages;
      renderTable();
    });
    
    currentPageInput.addEventListener('change', (e) => {
      let newPage = parseInt(e.target.value, 10);
      if (isNaN(newPage) || newPage < 1) newPage = 1;
      else if (newPage > totalPages) newPage = totalPages;
      currentPage = newPage;
      renderTable();
    });
    
    currentPageInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        let newPage = parseInt(e.target.value, 10);
        if (isNaN(newPage) || newPage < 1) newPage = 1;
        else if (newPage > totalPages) newPage = totalPages;
        currentPage = newPage;
        renderTable();
      }
    });
  }

  if (addYearBtn) {
    addYearBtn.addEventListener('click', () => {
      window.location.href = 'academic-year-create.html';
    });
  }

  if (refreshBtn) {
    refreshBtn.addEventListener('click', () => {
      filterForm.reset();
      applyFilters();
      alert('Đã tải lại danh sách năm học.');
    });
  }

  // --- Initial Load ---
  if (itemsPerPageSelect) {
    itemsPerPage = parseInt(itemsPerPageSelect.value, 10);
  }
  applyFilters(); // Áp dụng bộ lọc mặc định (không có) và hiển thị dữ liệu ban đầu
}); 