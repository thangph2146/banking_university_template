// Initialize AOS
AOS.init({
  duration: 800, // Animation duration
  once: true, // Whether animation should happen only once
});

document.addEventListener('DOMContentLoaded', function () {
  // State variables
  let allLevels = []; // Stores all academic levels
  let currentLevels = []; // Stores levels currently displayed
  let currentPage = 1;
  let itemsPerPage = 10;
  let totalPages = 1;

  // --- Sample Data (Based on bac_hoc table structure) ---
  allLevels = [
    { MaBacHoc: 1, TenBacHoc: 'Đại học', MoTa: 'Chương trình đào tạo cử nhân, kỹ sư.' },
    { MaBacHoc: 2, TenBacHoc: 'Cao đẳng', MoTa: 'Chương trình đào tạo nghề nghiệp.' },
    { MaBacHoc: 3, TenBacHoc: 'Trung cấp chuyên nghiệp', MoTa: 'Đào tạo kỹ thuật viên, nhân viên nghiệp vụ.' },
    { MaBacHoc: 4, TenBacHoc: 'Sau đại học - Thạc sĩ', MoTa: 'Chương trình đào tạo thạc sĩ khoa học/nghệ thuật.' },
    { MaBacHoc: 5, TenBacHoc: 'Sau đại học - Tiến sĩ', MoTa: 'Chương trình đào tạo tiến sĩ.' },
    { MaBacHoc: 6, TenBacHoc: 'Dạy nghề', MoTa: 'Đào tạo kỹ năng nghề ngắn hạn.' },
    { MaBacHoc: 7, TenBacHoc: 'Liên thông', MoTa: 'Chương trình liên thông từ trung cấp/cao đẳng lên cao đẳng/đại học.' },
    { MaBacHoc: 8, TenBacHoc: 'Văn bằng 2', MoTa: 'Chương trình đào tạo cấp bằng đại học thứ hai.' },
    { MaBacHoc: 9, TenBacHoc: 'Chứng chỉ', MoTa: 'Các khóa học cấp chứng chỉ ngắn hạn.' },
    { MaBacHoc: 10, TenBacHoc: 'Bồi dưỡng nghiệp vụ', MoTa: 'Các khóa học nâng cao nghiệp vụ chuyên môn.' }
    // Add more sample levels if needed
  ];

  // DOM Elements
  const sidebar = document.getElementById('sidebar');
  const sidebarBackdrop = document.getElementById('sidebar-backdrop');
  const sidebarOpenBtn = document.getElementById('sidebar-open');
  const sidebarCloseBtn = document.getElementById('sidebar-close');
  const userMenuButton = document.getElementById('user-menu-button'); // Assumed ID from HTML structure
  const userMenu = document.getElementById('user-menu'); // Assumed ID from HTML structure
  const levelsTableBody = document.getElementById('levelsTableBody');
  const paginationControls = document.getElementById('pagination-controls');
  const itemsPerPageSelect = document.getElementById('items-per-page');
  const totalItemsCountSpan = document.getElementById('total-items-count');
  const totalPagesCountSpan = document.getElementById('total-pages-count');
  const currentPageInput = document.getElementById('current-page-input');
  const filterForm = document.getElementById('filter-form');
  const filterNameInput = document.getElementById('filter-name');
  const filterDescriptionInput = document.getElementById('filter-description');
  const noDataPlaceholder = document.getElementById('no-data-placeholder');

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
    levelForm.reset(); // Clear form fields
    if (level) {
      // Edit mode
      modalTitle.textContent = 'Chỉnh sửa Bậc học';
      levelIdInput.value = level.MaBacHoc;
      modalLevelNameInput.value = level.TenBacHoc;
      modalLevelDescriptionInput.value = level.MoTa || '';
    } else {
      // Add mode
      modalTitle.textContent = 'Thêm Bậc học mới';
      levelIdInput.value = ''; // Ensure ID is empty for adding
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

  // Function to render the table
  function renderTable() {
    levelsTableBody.innerHTML = ''; // Clear existing rows
    noDataPlaceholder.classList.add('hidden'); // Hide no data message initially

    if (currentLevels.length === 0) {
      noDataPlaceholder.classList.remove('hidden'); // Show if no data
      // Clear pagination info and disable controls
      totalItemsCountSpan.textContent = 0;
      totalPagesCountSpan.textContent = 1;
      currentPageInput.value = 1;
      updatePaginationButtons();
      return;
    }

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const levelsToRender = currentLevels.slice(startIndex, endIndex);

    levelsToRender.forEach(level => {
      const row = document.createElement('tr');
      row.className = 'hover:bg-gray-50 transition-colors duration-150';

      row.innerHTML = `
        <td class="px-4 py-3 text-sm text-gray-700">${level.MaBacHoc}</td>
        <td class="px-4 py-3 text-sm font-medium text-gray-900">${level.TenBacHoc}</td>
        <td class="px-4 py-3 text-sm text-gray-600">${level.MoTa || 'N/A'}</td>
        <td class="px-4 py-3 text-right text-sm font-medium space-x-2">
          <button class="text-blue-600 hover:text-blue-800 edit-level-btn" data-id="${level.MaBacHoc}" title="Sửa">
            <i class="ri-pencil-line"></i>
          </button>
          <button class="text-red-600 hover:text-red-800 delete-level-btn" data-id="${level.MaBacHoc}" title="Xóa">
            <i class="ri-delete-bin-line"></i>
          </button>
        </td>
      `;
      levelsTableBody.appendChild(row);
    });

    // Add event listeners for edit/delete buttons
    levelsTableBody.querySelectorAll('.edit-level-btn').forEach(button => {
      button.addEventListener('click', handleEditLevel);
    });
    levelsTableBody.querySelectorAll('.delete-level-btn').forEach(button => {
      button.addEventListener('click', handleDeleteLevel);
    });

    updatePaginationInfo();
  }

  // Function to update pagination info (total items, total pages)
  function updatePaginationInfo() {
    totalPages = Math.ceil(currentLevels.length / itemsPerPage);
    if (totalPages < 1) totalPages = 1; // Ensure at least one page

    totalItemsCountSpan.textContent = currentLevels.length;
    totalPagesCountSpan.textContent = totalPages;
    currentPageInput.max = totalPages;
    currentPageInput.value = currentPage;

    updatePaginationButtons();
  }

  // Function to update pagination button states (disabled/enabled)
  function updatePaginationButtons() {
    const isFirstPage = currentPage === 1;
    const isLastPage = currentPage === totalPages;

    paginationControls.querySelector('.btn-first').disabled = isFirstPage;
    paginationControls.querySelector('.btn-prev').disabled = isFirstPage;
    paginationControls.querySelector('.btn-next').disabled = isLastPage;
    paginationControls.querySelector('.btn-last').disabled = isLastPage;
  }

  // Function to apply filters
  function applyFilters() {
    const nameFilter = filterNameInput.value.toLowerCase().trim();
    const descriptionFilter = filterDescriptionInput.value.toLowerCase().trim();

    currentLevels = allLevels.filter(level => {
      const nameMatch = !nameFilter || level.TenBacHoc.toLowerCase().includes(nameFilter);
      const descriptionMatch = !descriptionFilter || (level.MoTa && level.MoTa.toLowerCase().includes(descriptionFilter));
      return nameMatch && descriptionMatch;
    });

    currentPage = 1; // Reset to first page after filtering
    renderTable();
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
        applyFilters(); // Re-apply filters (which will show all levels)
      });
    }
  }

  // Items per page change
  if (itemsPerPageSelect) {
    itemsPerPageSelect.addEventListener('change', (e) => {
      itemsPerPage = parseInt(e.target.value, 10);
      currentPage = 1; // Reset to first page
      renderTable();
    });
  }

  // Pagination controls
  if (paginationControls) {
    paginationControls.addEventListener('click', (e) => {
      const button = e.target.closest('button');
      if (!button) return;

      if (button.classList.contains('btn-first')) {
        currentPage = 1;
      } else if (button.classList.contains('btn-prev')) {
        if (currentPage > 1) currentPage--;
      } else if (button.classList.contains('btn-next')) {
        if (currentPage < totalPages) currentPage++;
      } else if (button.classList.contains('btn-last')) {
        currentPage = totalPages;
      }
      renderTable();
    });

    // Current page input change
    currentPageInput.addEventListener('change', (e) => {
      let newPage = parseInt(e.target.value, 10);
      if (isNaN(newPage) || newPage < 1) {
        newPage = 1;
      } else if (newPage > totalPages) {
        newPage = totalPages;
      }
      currentPage = newPage;
      renderTable();
    });
    currentPageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            let newPage = parseInt(e.target.value, 10);
            if (isNaN(newPage) || newPage < 1) {
                newPage = 1;
            } else if (newPage > totalPages) {
                newPage = totalPages;
            }
            currentPage = newPage;
            renderTable();
        }
    });
  }

  // Level form submission (Add/Edit)
  if (levelForm) {
    levelForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const id = levelIdInput.value;
      const name = modalLevelNameInput.value.trim();
      const description = modalLevelDescriptionInput.value.trim();

      if (!name) {
        // Basic validation
        alert('Vui lòng nhập Tên Bậc học.');
        return;
      }

      const levelData = {
        TenBacHoc: name,
        MoTa: description || null, // Store null if empty
      };

      if (id) {
        // Edit existing level
        levelData.MaBacHoc = parseInt(id, 10);
        // Find index and update (in real app, send to server)
        const index = allLevels.findIndex(l => l.MaBacHoc === levelData.MaBacHoc);
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
        levelData.MaBacHoc = allLevels.length > 0 ? Math.max(...allLevels.map(l => l.MaBacHoc)) + 1 : 1;
        allLevels.push(levelData);
        console.log('Added level:', levelData);
        alert('Thêm bậc học thành công!');
      }

      closeModal();
      applyFilters(); // Refresh the table to show changes
    });
  }

  // Handler for Edit Level button click
  function handleEditLevel(event) {
    const button = event.target.closest('.edit-level-btn');
    const levelId = parseInt(button.dataset.id, 10);
    const levelToEdit = allLevels.find(level => level.MaBacHoc === levelId);
    if (levelToEdit) {
      openModal(levelToEdit);
    } else {
      console.error('Level not found for editing:', levelId);
      alert('Lỗi: Không tìm thấy bậc học để chỉnh sửa.');
    }
  }

  // Handler for Delete Level button click
  function handleDeleteLevel(event) {
    const button = event.target.closest('.delete-level-btn');
    const levelId = parseInt(button.dataset.id, 10);
    const levelToDelete = allLevels.find(level => level.MaBacHoc === levelId);

    if (!levelToDelete) {
        console.error('Level not found for deletion:', levelId);
        alert('Lỗi: Không tìm thấy bậc học để xóa.');
        return;
    }

    // Confirmation dialog
    if (confirm(`Bạn có chắc chắn muốn xóa bậc học "${levelToDelete.TenBacHoc}" (ID: ${levelId}) không?`)) {
      // Find index and remove (in real app, send delete request to server)
      const index = allLevels.findIndex(l => l.MaBacHoc === levelId);
      if (index !== -1) {
        allLevels.splice(index, 1);
        console.log('Deleted level ID:', levelId);
        alert('Xóa bậc học thành công!');
        applyFilters(); // Refresh the table
      } else {
        console.error('Level index not found for deletion after confirmation:', levelId);
        alert('Lỗi: Không thể xóa bậc học.');
      }
    }
  }

  // Refresh Button
  const refreshBtn = document.getElementById('refresh-btn');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', () => {
      // In a real app, you might re-fetch data here
      // For now, just reset filters and render
      filterForm.reset();
      applyFilters();
      alert('Đã tải lại danh sách bậc học.');
    });
  }

  // --- Initial Load ---
  itemsPerPage = parseInt(itemsPerPageSelect.value, 10);
  applyFilters(); // Apply default filters (none) and render initial data
}); 