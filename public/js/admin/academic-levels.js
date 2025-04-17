// Initialize AOS
AOS.init({
  duration: 800, // Animation duration
  once: true, // Whether animation should happen only once
});

document.addEventListener('DOMContentLoaded', function () {
  // State variables
  let allLevels = []; // Stores all academic levels
  let filteredLevels = []; // Stores levels after filtering

  // Pagination state
  const paginationState = {
    currentPage: 1,
    itemsPerPage: 10,
    totalPages: 1
  };

  // --- Sample Data (Based on bac_hoc table structure) ---
  allLevels = [
    { bac_hoc_id: 1, ten_bac_hoc: 'Đại học', ma_bac_hoc: 'DH', status: 1, created_at: "2023-01-15T00:00:00" },
    { bac_hoc_id: 2, ten_bac_hoc: 'Cao đẳng', ma_bac_hoc: 'CD', status: 1, created_at: "2023-01-15T00:00:00" },
    { bac_hoc_id: 3, ten_bac_hoc: 'Trung cấp chuyên nghiệp', ma_bac_hoc: 'TCCN', status: 1, created_at: "2023-02-20T00:00:00" },
    { bac_hoc_id: 4, ten_bac_hoc: 'Sau đại học - Thạc sĩ', ma_bac_hoc: 'ThS', status: 1, created_at: "2023-03-10T00:00:00" },
    { bac_hoc_id: 5, ten_bac_hoc: 'Sau đại học - Tiến sĩ', ma_bac_hoc: 'TS', status: 1, created_at: "2023-04-05T00:00:00" },
    { bac_hoc_id: 6, ten_bac_hoc: 'Dạy nghề', ma_bac_hoc: 'DN', status: 0, created_at: "2023-05-15T00:00:00" },
    { bac_hoc_id: 7, ten_bac_hoc: 'Liên thông', ma_bac_hoc: 'LT', status: 1, created_at: "2023-06-20T00:00:00" },
    { bac_hoc_id: 8, ten_bac_hoc: 'Văn bằng 2', ma_bac_hoc: 'VB2', status: 1, created_at: "2023-07-10T00:00:00" },
    { bac_hoc_id: 9, ten_bac_hoc: 'Chứng chỉ', ma_bac_hoc: 'CC', status: 1, created_at: "2023-08-15T00:00:00" },
    { bac_hoc_id: 10, ten_bac_hoc: 'Bồi dưỡng nghiệp vụ', ma_bac_hoc: 'BDNV', status: 0, created_at: "2023-09-20T00:00:00" },
    { bac_hoc_id: 11, ten_bac_hoc: 'Chuyên khoa cấp I', ma_bac_hoc: 'CKI', status: 1, created_at: "2023-10-05T00:00:00" },
    { bac_hoc_id: 12, ten_bac_hoc: 'Chuyên khoa cấp II', ma_bac_hoc: 'CKII', status: 1, created_at: "2023-10-15T00:00:00" },
    { bac_hoc_id: 13, ten_bac_hoc: 'Tiến sĩ Khoa học', ma_bac_hoc: 'TSKH', status: 1, created_at: "2023-11-01T00:00:00" },
    { bac_hoc_id: 14, ten_bac_hoc: 'Nghiên cứu sinh', ma_bac_hoc: 'NCS', status: 1, created_at: "2023-11-10T00:00:00" },
    { bac_hoc_id: 15, ten_bac_hoc: 'Cử nhân thực hành', ma_bac_hoc: 'CNTT', status: 1, created_at: "2023-12-01T00:00:00" },
    { bac_hoc_id: 16, ten_bac_hoc: 'Đào tạo từ xa', ma_bac_hoc: 'DTX', status: 0, created_at: "2023-12-15T00:00:00" },
    { bac_hoc_id: 17, ten_bac_hoc: 'E-learning', ma_bac_hoc: 'ELEARN', status: 1, created_at: "2024-01-05T00:00:00" },
    { bac_hoc_id: 18, ten_bac_hoc: 'Cao học', ma_bac_hoc: 'CH', status: 1, created_at: "2024-01-20T00:00:00" },
    { bac_hoc_id: 19, ten_bac_hoc: 'Trung cấp nghề', ma_bac_hoc: 'TCN', status: 0, created_at: "2024-02-01T00:00:00" },
    { bac_hoc_id: 20, ten_bac_hoc: 'Đào tạo liên kết quốc tế', ma_bac_hoc: 'LKQT', status: 1, created_at: "2024-02-15T00:00:00" },
    { bac_hoc_id: 21, ten_bac_hoc: 'Cao đẳng nghề', ma_bac_hoc: 'CDN', status: 1, created_at: "2024-03-01T00:00:00" },
    { bac_hoc_id: 22, ten_bac_hoc: 'Dự bị đại học', ma_bac_hoc: 'DBDH', status: 1, created_at: "2024-03-15T00:00:00" },
    { bac_hoc_id: 23, ten_bac_hoc: 'Đào tạo tại chức', ma_bac_hoc: 'TC', status: 0, created_at: "2024-03-20T00:00:00" },
    { bac_hoc_id: 24, ten_bac_hoc: 'Cử nhân Khoa học', ma_bac_hoc: 'CNKH', status: 1, created_at: "2024-04-01T00:00:00" },
    { bac_hoc_id: 25, ten_bac_hoc: 'Postdoc', ma_bac_hoc: 'POSTDOC', status: 1, created_at: "2024-04-15T00:00:00" }
  ];

  // DOM Elements
  const sidebar = document.getElementById('sidebar');
  const sidebarBackdrop = document.getElementById('sidebar-backdrop');
  const sidebarOpenBtn = document.getElementById('sidebar-open');
  const sidebarCloseBtn = document.getElementById('sidebar-close');
  const userMenuButton = document.getElementById('user-menu-button'); // Assumed ID from HTML structure
  const userMenu = document.getElementById('user-menu'); // Assumed ID from HTML structure
  const levelsTableBody = document.getElementById('levelsTableBody');
  const noDataPlaceholder = document.getElementById('no-data-placeholder');
  const filterForm = document.getElementById('filter-form');
  const filterNameInput = document.getElementById('filter-name');
  const filterCodeInput = document.getElementById('filter-code');
  const filterStatusInput = document.getElementById('filter-status');

  // Modal elements
  const levelModal = document.getElementById('level-modal');
  const addLevelBtn = document.getElementById('add-level-btn');
  const closeLevelModalBtn = document.getElementById('close-level-modal');
  const cancelLevelBtn = document.getElementById('cancel-level');
  const levelForm = document.getElementById('level-form');
  const modalTitle = document.getElementById('modal-title');
  const levelIdInput = document.getElementById('level-id');
  const modalLevelNameInput = document.getElementById('modal-level-name');
  const modalLevelDescriptionInput = document.getElementById('modal-level-description');
  const filterSearchInput = document.getElementById('filter-search');
  const applyFilterBtn = document.getElementById('apply-filter-btn');
  const resetFilterBtn = document.getElementById('reset-filter-btn');

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

  // User menu toggle (assuming similar structure as other pages)
  if (userMenuButton && userMenu) {
     // Function to check if click is outside the menu
     function handleClickOutside(event) {
        if (userMenu && !userMenu.contains(event.target) && !userMenuButton.contains(event.target)) {
            userMenu.classList.add('opacity-0', 'invisible', 'scale-95');
            userMenu.classList.remove('opacity-100', 'visible', 'scale-100');
            document.removeEventListener('click', handleClickOutside);
        }
      }

      userMenuButton.addEventListener('click', (event) => {
          event.stopPropagation(); // Prevent the click from immediately closing the menu
          const isVisible = userMenu.classList.contains('opacity-100');
          if (isVisible) {
              userMenu.classList.add('opacity-0', 'invisible', 'scale-95');
              userMenu.classList.remove('opacity-100', 'visible', 'scale-100');
              document.removeEventListener('click', handleClickOutside);
          } else {
              userMenu.classList.remove('opacity-0', 'invisible', 'scale-95');
              userMenu.classList.add('opacity-100', 'visible', 'scale-100');
              // Add event listener to close when clicking outside
              setTimeout(() => document.addEventListener('click', handleClickOutside), 0);
          }
      });
  }

  // --- Modal Handling ---
  function openModal(level = null) {
    levelForm.reset(); // Xóa dữ liệu form cũ
    if (level) {
      // Chế độ chỉnh sửa
      modalTitle.textContent = 'Chỉnh sửa Bậc học';
      levelIdInput.value = level.bac_hoc_id;
      modalLevelNameInput.value = level.ten_bac_hoc;
      modalLevelDescriptionInput.value = level.ma_bac_hoc || '';
      document.getElementById('modal-level-status').value = level.status.toString();
    } else {
      // Chế độ thêm mới
      modalTitle.textContent = 'Thêm Bậc học mới';
      levelIdInput.value = ''; // Đảm bảo ID trống khi thêm mới
      document.getElementById('modal-level-status').value = '1'; // Mặc định là hoạt động
    }
    levelModal.classList.remove('hidden');
  }

  function closeModal() {
    levelModal.classList.add('hidden');
    levelForm.reset();
  }

  if (addLevelBtn) {
    addLevelBtn.addEventListener('click', () => openModal());
  }
  if (closeLevelModalBtn) {
    closeLevelModalBtn.addEventListener('click', closeModal);
  }
  if (cancelLevelBtn) {
    cancelLevelBtn.addEventListener('click', closeModal);
  }
  // Close modal on outside click
  if (levelModal) {
    levelModal.addEventListener('click', (event) => {
      if (event.target === levelModal) {
        closeModal();
      }
    });
  }

  // --- Data Handling & Rendering ---

  // Function to apply filters
  function applyFilters() {
    const searchTerm = filterSearchInput.value.toLowerCase().trim();
    const statusFilter = filterStatusInput.value;

    filteredLevels = allLevels.filter(level => {
      const searchMatch = !searchTerm || 
                          level.ten_bac_hoc.toLowerCase().includes(searchTerm) ||
                          (level.ma_bac_hoc && level.ma_bac_hoc.toLowerCase().includes(searchTerm));
      const statusMatch = !statusFilter || level.status.toString() === statusFilter;
      return searchMatch && statusMatch;
    });
    
    // Update pagination
    paginationState.currentPage = 1;
    updatePagination();
    
    // Render table with filtered data
    renderTable();
  }

  // Function to update pagination info (total items, total pages)
  function updatePagination() {
    const totalItems = filteredLevels.length;
    paginationState.totalPages = Math.max(1, Math.ceil(totalItems / paginationState.itemsPerPage));
    
    // Adjust current page if it exceeds total pages
    if (paginationState.currentPage > paginationState.totalPages) {
      paginationState.currentPage = paginationState.totalPages;
    }
    
    // Update UI pagination elements
    const currentPageInput = document.getElementById('current-page-input');
    const totalPagesCount = document.getElementById('total-pages-count');
    const totalItemsCount = document.getElementById('total-items-count');
    const totalItemsDisplay = document.getElementById('total-items-display'); 
    const currentPageMobile = document.getElementById('current-page-mobile');
    const totalPagesMobile = document.getElementById('total-pages-mobile');
    const currentRangeStart = document.getElementById('current-range-start');
    const currentRangeEnd = document.getElementById('current-range-end');
    
    // Các nút điều hướng
    const btnFirst = document.getElementById('first-page');
    const btnLast = document.getElementById('last-page');
    const btnPrev = document.getElementById('prev-page');
    const btnNext = document.getElementById('next-page');
    const btnPrevMobile = document.getElementById('prev-page-mobile');
    const btnNextMobile = document.getElementById('next-page-mobile');

    // Calculate display range
    const startIndex = (paginationState.currentPage - 1) * paginationState.itemsPerPage;
    const endIndex = Math.min(startIndex + paginationState.itemsPerPage, totalItems);

    // Update text displays
    if (currentPageInput) currentPageInput.value = paginationState.currentPage;
    if (totalPagesCount) totalPagesCount.textContent = paginationState.totalPages;
    if (totalItemsCount) totalItemsCount.textContent = totalItems;
    if (totalItemsDisplay) totalItemsDisplay.textContent = totalItems;
    if (currentPageMobile) currentPageMobile.textContent = paginationState.currentPage;
    if (totalPagesMobile) totalPagesMobile.textContent = paginationState.totalPages;
    if (currentRangeStart) currentRangeStart.textContent = totalItems > 0 ? startIndex + 1 : 0;
    if (currentRangeEnd) currentRangeEnd.textContent = endIndex;

    // Update pagination button states (disabled/enabled)
    const isFirstPage = paginationState.currentPage === 1;
    const isLastPage = paginationState.currentPage === paginationState.totalPages;

    // Cập nhật trạng thái các nút điều hướng
    if (btnFirst) btnFirst.disabled = isFirstPage;
    if (btnLast) btnLast.disabled = isLastPage;
    if (btnPrev) btnPrev.disabled = isFirstPage;
    if (btnNext) btnNext.disabled = isLastPage;
    if (btnPrevMobile) btnPrevMobile.disabled = isFirstPage;
    if (btnNextMobile) btnNextMobile.disabled = isLastPage;
  }

  // Function to render the table
  function renderTable() {
    if (!levelsTableBody) return;
    
    levelsTableBody.innerHTML = ''; // Xóa các hàng hiện có
    
    if (noDataPlaceholder) {
      noDataPlaceholder.classList.add('hidden'); // Ẩn thông báo không có dữ liệu ban đầu
    }

    if (filteredLevels.length === 0) {
      if (noDataPlaceholder) {
        noDataPlaceholder.classList.remove('hidden'); // Hiển thị nếu không có dữ liệu
      }
      return;
    }

    const startIndex = (paginationState.currentPage - 1) * paginationState.itemsPerPage;
    const endIndex = Math.min(startIndex + paginationState.itemsPerPage, filteredLevels.length);
    const levelsToRender = filteredLevels.slice(startIndex, endIndex);

    levelsTableBody.innerHTML = levelsToRender.map(level => `
      <tr class="hover:bg-gray-50 transition-colors duration-150">
        <td class="px-4 py-3 text-sm text-gray-700">${level.bac_hoc_id}</td>
        <td class="px-4 py-3 text-sm text-gray-700">${level.ma_bac_hoc || 'N/A'}</td>
        <td class="px-4 py-3 text-sm font-medium text-gray-900">${level.ten_bac_hoc}</td>
        <td class="px-4 py-3 text-sm text-gray-600">
          <span class="px-2 py-1 text-xs font-medium rounded-full ${
            level.status === 1 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }">
            ${level.status === 1 ? 'Hoạt động' : 'Không hoạt động'}
          </span>
        </td>
        <td class="px-4 py-3 text-right text-sm font-medium space-x-2">
          <a href="academic-level-detail.html?id=${level.bac_hoc_id}" 
             class="text-gray-600 hover:text-gray-900" title="Xem chi tiết">
             <i class="ri-eye-line"></i>
          </a>
          <a href="academic-level-edit.html?id=${level.bac_hoc_id}" 
             class="text-blue-600 hover:text-blue-800" title="Sửa">
             <i class="ri-pencil-line"></i>
          </a>
          <button class="text-red-600 hover:text-red-800 delete-level-btn" 
                  onclick="deleteLevel(${level.bac_hoc_id})" title="Xóa">
             <i class="ri-delete-bin-line"></i>
          </button>
        </td>
      </tr>
    `).join('');
  }

  // --- Event Listeners ---

  // Filter form submission
  if (filterForm) {
    filterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      applyFilters();
    });

    // Reset button
    const resetFilterBtn = document.getElementById('reset-filter-btn');
    if (resetFilterBtn) {
      resetFilterBtn.addEventListener('click', () => {
        filterForm.reset();
        setTimeout(() => {
          applyFilters(); // Re-apply filters (which will show all levels)
        }, 0);
      });
    }
  }

  // Items per page change
  const itemsPerPageSelect = document.getElementById('items-per-page');
  if (itemsPerPageSelect) {
    itemsPerPageSelect.addEventListener('change', (e) => {
      paginationState.itemsPerPage = parseInt(e.target.value, 10);
      paginationState.currentPage = 1; // Reset to first page
      updatePagination();
      renderTable();
    });
  }

  // Pagination controls
  const paginationControls = document.getElementById('pagination-controls');
  if (paginationControls) {
    // Nút first và last
    const btnFirst = document.getElementById('first-page');
    const btnLast = document.getElementById('last-page');
    const btnPrev = document.getElementById('prev-page');
    const btnNext = document.getElementById('next-page');
    const btnPrevMobile = document.getElementById('prev-page-mobile');
    const btnNextMobile = document.getElementById('next-page-mobile');
    
    // Chức năng chung cho các nút điều hướng
    function goToFirstPage() {
      if (paginationState.currentPage !== 1) {
        paginationState.currentPage = 1;
        updatePagination();
        renderTable();
      }
    }
    
    function goToLastPage() {
      if (paginationState.currentPage !== paginationState.totalPages) {
        paginationState.currentPage = paginationState.totalPages;
        updatePagination();
        renderTable();
      }
    }
    
    function goToPrevPage() {
      if (paginationState.currentPage > 1) {
        paginationState.currentPage--;
        updatePagination();
        renderTable();
      }
    }
    
    function goToNextPage() {
      if (paginationState.currentPage < paginationState.totalPages) {
        paginationState.currentPage++;
        updatePagination();
        renderTable();
      }
    }
    
    // Đăng ký sự kiện cho các nút phân trang
    if (btnFirst) btnFirst.addEventListener('click', goToFirstPage);
    if (btnLast) btnLast.addEventListener('click', goToLastPage);
    if (btnPrev) btnPrev.addEventListener('click', goToPrevPage);
    if (btnNext) btnNext.addEventListener('click', goToNextPage);
    
    // Xử lý điều hướng trên điện thoại
    if (btnPrevMobile) btnPrevMobile.addEventListener('click', goToPrevPage);
    if (btnNextMobile) btnNextMobile.addEventListener('click', goToNextPage);

    // Current page input change
    const currentPageInput = document.getElementById('current-page-input');
    if (currentPageInput) {
      currentPageInput.addEventListener('change', (e) => {
        let newPage = parseInt(e.target.value, 10);
        if (isNaN(newPage) || newPage < 1) {
          newPage = 1;
        } else if (newPage > paginationState.totalPages) {
          newPage = paginationState.totalPages;
        }
        currentPageInput.value = newPage; // Cập nhật giá trị trong input
        paginationState.currentPage = newPage;
        updatePagination();
        renderTable();
      });
      
      currentPageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          let newPage = parseInt(e.target.value, 10);
          if (isNaN(newPage) || newPage < 1) {
            newPage = 1;
          } else if (newPage > paginationState.totalPages) {
            newPage = paginationState.totalPages;
          }
          currentPageInput.value = newPage; // Cập nhật giá trị trong input
          paginationState.currentPage = newPage;
          updatePagination();
          renderTable();
        }
      });
    }
  }

  // Level form submission (Add/Edit)
  if (levelForm) {
    levelForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const id = levelIdInput.value;
      const name = modalLevelNameInput.value.trim();
      const code = modalLevelDescriptionInput.value.trim();
      const status = parseInt(document.getElementById('modal-level-status').value, 10);

      if (!name) {
        // Basic validation
        alert('Vui lòng nhập Tên Bậc học.');
        return;
      }

      const levelData = {
        ten_bac_hoc: name,
        ma_bac_hoc: code || null, // Store null if empty
        status: status, // Use status from form
        created_at: new Date().toISOString()
      };

      if (id) {
        // Edit existing level
        levelData.bac_hoc_id = parseInt(id, 10);
        // Find index and update (in real app, send to server)
        const index = allLevels.findIndex(l => l.bac_hoc_id === levelData.bac_hoc_id);
        if (index !== -1) {
          allLevels[index] = { ...allLevels[index], ...levelData };
          console.log('Updated level:', allLevels[index]);
          alert('Cập nhật bậc học thành công!');
        } else {
            console.error('Level not found for editing');
            alert('Lỗi: Không tìm thấy bậc học để cập nhật.');
            return; // Stop if level not found
        }
      } else {
        // Add new level
        // Generate a temporary ID (in real app, server provides ID)
        levelData.bac_hoc_id = allLevels.length > 0 ? Math.max(...allLevels.map(l => l.bac_hoc_id)) + 1 : 1;
        allLevels.push(levelData);
        console.log('Added level:', levelData);
        alert('Thêm bậc học thành công!');
      }

      closeModal();
      applyFilters(); // Refresh the table to show changes
    });
  }

  // Các hàm xử lý bậc học
  window.deleteLevel = function(levelId) {
    const level = allLevels.find(l => l.bac_hoc_id === levelId);
    if (!level) {
      console.error('Không tìm thấy bậc học để xóa:', levelId);
      alert('Lỗi: Không tìm thấy bậc học để xóa.');
      return;
    }

    // Hộp thoại xác nhận
    if (confirm(`Bạn có chắc chắn muốn xóa bậc học "${level.ten_bac_hoc}" không?`)) {
      // Tìm index và xóa (trong thực tế, gửi yêu cầu DELETE đến server)
      const index = allLevels.findIndex(l => l.bac_hoc_id === levelId);
      if (index !== -1) {
        allLevels.splice(index, 1);
        console.log('Đã xóa bậc học ID:', levelId);
        alert('Xóa bậc học thành công!');
        applyFilters(); // Tải lại bảng
      } else {
        console.error('Không tìm thấy index bậc học để xóa sau xác nhận:', levelId);
        alert('Lỗi: Không thể xóa bậc học.');
      }
    }
  };

  // Nút Tải lại
  const refreshBtn = document.getElementById('refresh-btn');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', () => {
      // Trong thực tế, bạn có thể tải lại dữ liệu từ server
      // Hiện tại, chỉ đặt lại bộ lọc và hiển thị lại
      filterForm.reset();
      applyFilters();
      alert('Đã tải lại danh sách bậc học.');
    });
  }

  // --- Initial Load ---
  if (itemsPerPageSelect) {
    paginationState.itemsPerPage = parseInt(itemsPerPageSelect.value, 10);
  }
  
  // Apply default filters (none) and render initial data
  filteredLevels = [...allLevels];
  updatePagination();
  renderTable();
}); 