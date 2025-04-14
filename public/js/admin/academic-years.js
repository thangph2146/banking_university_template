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

  // --- Sample Data (Based on nam_hoc table structure) ---
  allAcademicYears = [
    { MaNH: 1, TenNH: 'Năm học 2023-2024', NamBatDau: 2023, NamKetThuc: 2024 },
    { MaNH: 2, TenNH: 'Năm học 2022-2023', NamBatDau: 2022, NamKetThuc: 2023 },
    { MaNH: 3, TenNH: 'Năm học 2021-2022', NamBatDau: 2021, NamKetThuc: 2022 },
    { MaNH: 4, TenNH: 'Năm học 2020-2021', NamBatDau: 2020, NamKetThuc: 2021 },
    { MaNH: 5, TenNH: 'Năm học 2019-2020', NamBatDau: 2019, NamKetThuc: 2020 },
    { MaNH: 6, TenNH: 'Năm học 2018-2019', NamBatDau: 2018, NamKetThuc: 2019 },
    { MaNH: 7, TenNH: 'Năm học 2017-2018', NamBatDau: 2017, NamKetThuc: 2018 },
    { MaNH: 8, TenNH: 'Năm học 2016-2017', NamBatDau: 2016, NamKetThuc: 2017 },
    { MaNH: 9, TenNH: 'Năm học 2015-2016', NamBatDau: 2015, NamKetThuc: 2016 },
    { MaNH: 10, TenNH: 'Năm học 2014-2015', NamBatDau: 2014, NamKetThuc: 2015 }
    // Add more sample academic years if needed
  ];

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
  const noDataPlaceholder = document.getElementById('no-data-placeholder');

  // Modal elements
  const yearModal = document.getElementById('year-modal');
  const addYearBtn = document.getElementById('add-year-btn');
  const closeYearModalBtn = document.getElementById('close-year-modal');
  const cancelYearBtn = document.getElementById('cancel-year');
  const yearForm = document.getElementById('year-form');
  const modalTitle = document.getElementById('modal-title');
  const yearIdInput = document.getElementById('year-id');
  const modalYearNameInput = document.getElementById('modal-year-name');
  const modalStartYearInput = document.getElementById('modal-start-year');
  const modalEndYearInput = document.getElementById('modal-end-year');

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

  // --- Modal Handling ---
  function openModal(year = null) {
    yearForm.reset();
    if (year) {
      // Edit mode
      modalTitle.textContent = 'Chỉnh sửa Năm học';
      yearIdInput.value = year.MaNH;
      modalYearNameInput.value = year.TenNH;
      modalStartYearInput.value = year.NamBatDau;
      modalEndYearInput.value = year.NamKetThuc;
    } else {
      // Add mode
      modalTitle.textContent = 'Thêm Năm học mới';
      yearIdInput.value = '';
    }
    yearModal.classList.remove('hidden');
  }

  function closeModal() {
    yearModal.classList.add('hidden');
    yearForm.reset();
  }

  if (addYearBtn) {
    addYearBtn.addEventListener('click', () => openModal());
  }
  if (closeYearModalBtn) {
    closeYearModalBtn.addEventListener('click', closeModal);
  }
  if (cancelYearBtn) {
    cancelYearBtn.addEventListener('click', closeModal);
  }
  if (yearModal) {
    yearModal.addEventListener('click', (event) => {
      if (event.target === yearModal) {
        closeModal();
      }
    });
  }

  // --- Data Handling & Rendering ---

  function renderTable() {
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

      row.innerHTML = `
        <td class="px-4 py-3 text-sm text-gray-700">${year.MaNH}</td>
        <td class="px-4 py-3 text-sm font-medium text-gray-900">${year.TenNH}</td>
        <td class="px-4 py-3 text-sm text-gray-600">${year.NamBatDau}</td>
        <td class="px-4 py-3 text-sm text-gray-600">${year.NamKetThuc}</td>
        <td class="px-4 py-3 text-right text-sm font-medium space-x-2">
          <button class="text-blue-600 hover:text-blue-800 edit-year-btn" data-id="${year.MaNH}" title="Sửa">
            <i class="ri-pencil-line"></i>
          </button>
          <button class="text-red-600 hover:text-red-800 delete-year-btn" data-id="${year.MaNH}" title="Xóa">
            <i class="ri-delete-bin-line"></i>
          </button>
        </td>
      `;
      academicYearsTableBody.appendChild(row);
    });

    academicYearsTableBody.querySelectorAll('.edit-year-btn').forEach(button => {
      button.addEventListener('click', handleEditYear);
    });
    academicYearsTableBody.querySelectorAll('.delete-year-btn').forEach(button => {
      button.addEventListener('click', handleDeleteYear);
    });

    updatePaginationInfo();
  }

  function updatePaginationInfo() {
    totalPages = Math.ceil(currentAcademicYears.length / itemsPerPage);
    if (totalPages < 1) totalPages = 1;

    totalItemsCountSpan.textContent = currentAcademicYears.length;
    totalPagesCountSpan.textContent = totalPages;
    currentPageInput.max = totalPages;
    currentPageInput.value = currentPage;

    updatePaginationButtons();
  }

  function updatePaginationButtons() {
    const isFirstPage = currentPage === 1;
    const isLastPage = currentPage === totalPages;

    paginationControls.querySelector('.btn-first').disabled = isFirstPage;
    paginationControls.querySelector('.btn-prev').disabled = isFirstPage;
    paginationControls.querySelector('.btn-next').disabled = isLastPage;
    paginationControls.querySelector('.btn-last').disabled = isLastPage;
  }

  function applyFilters() {
    const nameFilter = filterNameInput.value.toLowerCase().trim();
    const startYearFilter = filterStartYearInput.value ? parseInt(filterStartYearInput.value, 10) : null;
    const endYearFilter = filterEndYearInput.value ? parseInt(filterEndYearInput.value, 10) : null;

    currentAcademicYears = allAcademicYears.filter(year => {
      const nameMatch = !nameFilter || year.TenNH.toLowerCase().includes(nameFilter);
      const startYearMatch = !startYearFilter || year.NamBatDau === startYearFilter;
      const endYearMatch = !endYearFilter || year.NamKetThuc === endYearFilter;

      return nameMatch && startYearMatch && endYearMatch;
    });

    currentPage = 1;
    renderTable();
  }

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

  if (yearForm) {
    yearForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const id = yearIdInput.value;
      const name = modalYearNameInput.value.trim();
      const startYear = modalStartYearInput.value ? parseInt(modalStartYearInput.value, 10) : null;
      const endYear = modalEndYearInput.value ? parseInt(modalEndYearInput.value, 10) : null;

      if (!name || !startYear || !endYear) {
        alert('Vui lòng nhập đầy đủ Tên Năm học, Năm bắt đầu và Năm kết thúc.');
        return;
      }
      if (startYear >= endYear) {
        alert('Năm bắt đầu phải nhỏ hơn Năm kết thúc.');
        return;
      }

      const yearData = {
        TenNH: name,
        NamBatDau: startYear,
        NamKetThuc: endYear,
      };

      if (id) {
        yearData.MaNH = parseInt(id, 10);
        const index = allAcademicYears.findIndex(y => y.MaNH === yearData.MaNH);
        if (index !== -1) {
          allAcademicYears[index] = { ...allAcademicYears[index], ...yearData };
          console.log('Updated year:', allAcademicYears[index]);
          alert('Cập nhật năm học thành công!');
        } else {
            console.error('Year not found for editing');
            alert('Lỗi: Không tìm thấy năm học để cập nhật.');
            return;
        }
      } else {
        yearData.MaNH = allAcademicYears.length > 0 ? Math.max(...allAcademicYears.map(y => y.MaNH)) + 1 : 1;
        allAcademicYears.push(yearData);
        console.log('Added year:', yearData);
        alert('Thêm năm học thành công!');
      }
      closeModal();
      applyFilters();
    });
  }

  function handleEditYear(event) {
    const button = event.target.closest('.edit-year-btn');
    const yearId = parseInt(button.dataset.id, 10);
    const yearToEdit = allAcademicYears.find(year => year.MaNH === yearId);
    if (yearToEdit) {
      openModal(yearToEdit);
    } else {
      console.error('Year not found for editing:', yearId);
      alert('Lỗi: Không tìm thấy năm học để chỉnh sửa.');
    }
  }

  function handleDeleteYear(event) {
    const button = event.target.closest('.delete-year-btn');
    const yearId = parseInt(button.dataset.id, 10);
    const yearToDelete = allAcademicYears.find(year => year.MaNH === yearId);

    if (!yearToDelete) {
        console.error('Year not found for deletion:', yearId);
        alert('Lỗi: Không tìm thấy năm học để xóa.');
        return;
    }

    if (confirm(`Bạn có chắc chắn muốn xóa năm học "${yearToDelete.TenNH}" (ID: ${yearId}) không?`)) {
      const index = allAcademicYears.findIndex(y => y.MaNH === yearId);
      if (index !== -1) {
        allAcademicYears.splice(index, 1);
        console.log('Deleted year ID:', yearId);
        alert('Xóa năm học thành công!');
        applyFilters();
      } else {
        console.error('Year index not found for deletion after confirmation:', yearId);
        alert('Lỗi: Không thể xóa năm học.');
      }
    }
  }

  const refreshBtn = document.getElementById('refresh-btn');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', () => {
      filterForm.reset();
      applyFilters();
      alert('Đã tải lại danh sách năm học.');
    });
  }

  // --- Initial Load ---
  itemsPerPage = parseInt(itemsPerPageSelect.value, 10);
  applyFilters(); // Apply default filters (none) and render initial data
}); 