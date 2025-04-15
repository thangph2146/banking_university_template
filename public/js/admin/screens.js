document.addEventListener('DOMContentLoaded', () => {
  AOS.init();

  // --- State Variables ---
  let allScreens = []; // Store all screen data
  let currentScreens = []; // Store filtered and paginated screen data
  let currentPage = 1;
  let itemsPerPage = 10;
  let totalPages = 1;
  let currentEditScreenId = null; // To track which screen is being edited

  // --- DOM Elements ---
  const sidebar = document.getElementById('sidebar');
  const sidebarBackdrop = document.getElementById('sidebar-backdrop');
  const sidebarOpenBtn = document.getElementById('sidebar-open');
  const sidebarCloseBtn = document.getElementById('sidebar-close');
  const userMenuButton = document.getElementById('user-menu-button');
  const userMenu = document.getElementById('user-menu');

  const screenModal = document.getElementById('screen-modal');
  const addScreenBtn = document.getElementById('add-screen-btn');
  const closeScreenModalBtn = document.getElementById('close-screen-modal');
  const cancelScreenBtn = document.getElementById('cancel-screen');
  const screenForm = document.getElementById('screen-form');
  const modalTitle = document.getElementById('modal-title');
  const screenIdInput = document.getElementById('screen-id');
  const screenNameInput = document.getElementById('modal-screen-name');
  const screenCodeInput = document.getElementById('modal-screen-code');
  const screenCameraIdInput = document.getElementById('modal-camera-id');
  const screenTemplateIdInput = document.getElementById('modal-template-id');
  const screenStatusInput = document.getElementById('modal-screen-status');

  const filterForm = document.getElementById('filter-form');
  const filterNameInput = document.getElementById('filter-name');
  const filterCodeInput = document.getElementById('filter-code');
  const filterStatusInput = document.getElementById('filter-status');
  const filterCameraIdInput = document.getElementById('filter-camera-id');
  const filterTemplateIdInput = document.getElementById('filter-template-id');
  const resetFilterBtn = document.getElementById('reset-filter-btn');

  const screensTableBody = document.getElementById('screensTableBody');
  const noDataPlaceholder = document.getElementById('no-data-placeholder');
  const paginationControls = document.getElementById('pagination-controls');
  const totalItemsCountEl = document.getElementById('total-items-count');
  const totalPagesCountEl = document.getElementById('total-pages-count');
  const currentPageInput = document.getElementById('current-page-input');
  const itemsPerPageSelect = document.getElementById('items-per-page');
  const btnFirst = paginationControls.querySelector('.btn-first');
  const btnPrev = paginationControls.querySelector('.btn-prev');
  const btnNext = paginationControls.querySelector('.btn-next');
  const btnLast = paginationControls.querySelector('.btn-last');
  const refreshBtn = document.getElementById('refresh-btn');

  // --- Sample Screen Data (based on hanet.sql man_hinh structure) ---
  // Assuming camera IDs (1-10) and template IDs (1-5) exist
  const generateSampleScreens = (count) => {
    const sampleData = [];
    const statuses = [0, 1]; // 0: Inactive, 1: Active
    const cameraIds = Array.from({ length: 10 }, (_, i) => i + 1).concat(null);
    const templateIds = Array.from({ length: 5 }, (_, i) => i + 1).concat(null);

    for (let i = 1; i <= count; i++) {
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const cameraId = cameraIds[Math.floor(Math.random() * cameraIds.length)];
      const templateId = templateIds[Math.floor(Math.random() * templateIds.length)];
      const maManHinh = `MH-${String(i).padStart(3, '0')}`;

      sampleData.push({
        man_hinh_id: i,
        ten_man_hinh: `Màn hình ${String.fromCharCode(65 + Math.floor(Math.random() * 5))}-${Math.floor(Math.random() * 10)}`,
        ma_man_hinh: Math.random() > 0.2 ? maManHinh : null, // Some might not have code
        camera_id: cameraId,
        template_id: templateId,
        status: status,
        created_at: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000).toISOString().slice(0, 19).replace('T', ' '),
        updated_at: Math.random() > 0.4 ? new Date().toISOString().slice(0, 19).replace('T', ' ') : null,
        deleted_at: null
      });
    }
    return sampleData;
  };

  // --- UI Interaction Functions ---
  const toggleSidebar = () => {
    sidebar.classList.toggle('-translate-x-full');
    sidebarBackdrop.classList.toggle('hidden');
  };

  const toggleUserMenu = () => {
    userMenu.classList.toggle('opacity-0');
    userMenu.classList.toggle('invisible');
    userMenu.classList.toggle('group-hover:opacity-100');
    userMenu.classList.toggle('group-hover:visible');
  };

  const openScreenModal = (screen = null) => {
    screenForm.reset(); // Clear previous data
    if (screen) {
      modalTitle.textContent = 'Chỉnh sửa Màn hình';
      currentEditScreenId = screen.man_hinh_id;
      screenIdInput.value = screen.man_hinh_id;
      screenNameInput.value = screen.ten_man_hinh || '';
      screenCodeInput.value = screen.ma_man_hinh || '';
      screenCameraIdInput.value = screen.camera_id || '';
      screenTemplateIdInput.value = screen.template_id || '';
      screenStatusInput.value = screen.status !== undefined ? screen.status.toString() : '1';
    } else {
      modalTitle.textContent = 'Thêm Màn hình mới';
      currentEditScreenId = null;
      screenIdInput.value = '';
    }
    screenModal.classList.remove('hidden');
  };

  const closeScreenModal = () => {
    screenModal.classList.add('hidden');
    screenForm.reset();
    currentEditScreenId = null;
  };

  // --- Data Handling Functions ---
  const applyFiltersAndPagination = () => {
    const nameFilter = filterNameInput.value.toLowerCase();
    const codeFilter = filterCodeInput.value.toLowerCase();
    const statusFilter = filterStatusInput.value;
    const cameraIdFilter = filterCameraIdInput.value;
    const templateIdFilter = filterTemplateIdInput.value;

    let filteredScreens = allScreens.filter(screen => {
      const matchesName = screen.ten_man_hinh.toLowerCase().includes(nameFilter);
      const matchesCode = !codeFilter || (screen.ma_man_hinh && screen.ma_man_hinh.toLowerCase().includes(codeFilter));
      const matchesStatus = statusFilter === '' || screen.status.toString() === statusFilter;
      const matchesCameraId = cameraIdFilter === '' || (screen.camera_id !== null && screen.camera_id.toString() === cameraIdFilter);
      const matchesTemplateId = templateIdFilter === '' || (screen.template_id !== null && screen.template_id.toString() === templateIdFilter);

      return matchesName && matchesCode && matchesStatus && matchesCameraId && matchesTemplateId;
    });

    totalPages = Math.ceil(filteredScreens.length / itemsPerPage);
    if (totalPages < 1) totalPages = 1;
    if (currentPage > totalPages) currentPage = totalPages;
    if (currentPage < 1) currentPage = 1;

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    currentScreens = filteredScreens.slice(startIndex, endIndex);

    renderTable();
    updatePagination(filteredScreens.length);
  };

  const renderTable = () => {
    screensTableBody.innerHTML = ''; // Clear existing rows

    if (currentScreens.length === 0) {
      noDataPlaceholder.classList.remove('hidden');
      return;
    }

    noDataPlaceholder.classList.add('hidden');

    currentScreens.forEach(screen => {
      const row = document.createElement('tr');
      row.classList.add('hover:bg-gray-50');

      const statusText = screen.status === 1 ? 'Hoạt động' : 'Không hoạt động';
      const statusClass = screen.status === 1 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
      const cameraDisplay = screen.camera_id !== null ? screen.camera_id : 'N/A';
      const templateDisplay = screen.template_id !== null ? screen.template_id : 'N/A';
      const codeDisplay = screen.ma_man_hinh || 'N/A';

      row.innerHTML = `
        <td class="px-4 py-3 text-sm text-gray-700 font-medium">${screen.man_hinh_id}</td>
        <td class="px-4 py-3 text-sm text-gray-600">${screen.ten_man_hinh}</td>
        <td class="px-4 py-3 text-sm text-gray-500">${codeDisplay}</td>
        <td class="px-4 py-3 text-sm text-gray-500">${cameraDisplay}</td>
        <td class="px-4 py-3 text-sm text-gray-500">${templateDisplay}</td>
        <td class="px-4 py-3 text-sm">
          <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClass}">
            ${statusText}
          </span>
        </td>
        <td class="px-4 py-3 text-right text-sm font-medium space-x-1 whitespace-nowrap">
          <button class="btn-edit p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded" title="Sửa" data-id="${screen.man_hinh_id}">
            <i class="ri-pencil-line"></i>
          </button>
          <button class="btn-delete p-1 text-red-600 hover:text-red-800 hover:bg-red-100 rounded" title="Xóa" data-id="${screen.man_hinh_id}">
            <i class="ri-delete-bin-line"></i>
          </button>
        </td>
      `;

      // Add event listeners for action buttons
      row.querySelector('.btn-edit').addEventListener('click', () => handleEditScreen(screen.man_hinh_id));
      row.querySelector('.btn-delete').addEventListener('click', () => handleDeleteScreen(screen.man_hinh_id));

      screensTableBody.appendChild(row);
    });
  };

  const updatePagination = (totalItems) => {
    totalItemsCountEl.textContent = totalItems;
    totalPagesCountEl.textContent = totalPages;
    currentPageInput.value = currentPage;
    currentPageInput.max = totalPages;

    // Enable/disable buttons
    btnFirst.disabled = currentPage === 1;
    btnPrev.disabled = currentPage === 1;
    btnNext.disabled = currentPage === totalPages;
    btnLast.disabled = currentPage === totalPages;

    // Hide pagination if only one page
    if (totalPages <= 1) {
        paginationControls.classList.add('hidden');
    } else {
        paginationControls.classList.remove('hidden');
    }
  };

  const handleEditScreen = (id) => {
    const screenToEdit = allScreens.find(s => s.man_hinh_id === id);
    if (screenToEdit) {
      openScreenModal(screenToEdit);
    } else {
      console.error('Screen not found for editing:', id);
      alert('Không tìm thấy màn hình để chỉnh sửa.');
    }
  };

  const handleDeleteScreen = (id) => {
    if (confirm(`Bạn có chắc chắn muốn xóa màn hình có ID ${id} không?`)) {
      const index = allScreens.findIndex(s => s.man_hinh_id === id);
      if (index > -1) {
        allScreens.splice(index, 1);
        applyFiltersAndPagination();
        console.log('Screen deleted:', id);
        alert('Màn hình đã được xóa (mô phỏng).');
      } else {
        console.error('Screen not found for deletion:', id);
        alert('Không tìm thấy màn hình để xóa.');
      }
    }
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();

    const formData = new FormData(screenForm);
    const screenData = {
      man_hinh_id: currentEditScreenId ? parseInt(currentEditScreenId) : Date.now(), // Generate new ID or use existing
      ten_man_hinh: formData.get('modal-screen-name'),
      ma_man_hinh: formData.get('modal-screen-code') || null,
      camera_id: formData.get('modal-camera-id') ? parseInt(formData.get('modal-camera-id')) : null,
      template_id: formData.get('modal-template-id') ? parseInt(formData.get('modal-template-id')) : null,
      status: parseInt(formData.get('modal-screen-status')),
      created_at: currentEditScreenId ? allScreens.find(s => s.man_hinh_id === currentEditScreenId).created_at : new Date().toISOString().slice(0, 19).replace('T', ' '),
      updated_at: new Date().toISOString().slice(0, 19).replace('T', ' '),
      deleted_at: null // Ensure deleted_at is null on create/update
    };

    // Basic validation
    if (!screenData.ten_man_hinh) {
        alert('Vui lòng nhập Tên Màn hình.');
        return;
    }

    if (currentEditScreenId) {
      // Update existing screen
      const index = allScreens.findIndex(s => s.man_hinh_id === currentEditScreenId);
      if (index > -1) {
        allScreens[index] = screenData;
        console.log('Screen updated:', screenData);
         alert('Màn hình đã được cập nhật (mô phỏng).');
      } else {
         console.error('Screen not found for update:', currentEditScreenId);
         alert('Lỗi: Không tìm thấy màn hình để cập nhật.');
      }
    } else {
      // Add new screen
      allScreens.unshift(screenData); // Add to the beginning
      console.log('Screen added:', screenData);
      alert('Màn hình đã được thêm (mô phỏng).');
    }

    closeScreenModal();
    applyFiltersAndPagination(); // Refresh the table
  };

  // --- Event Listeners ---
  sidebarOpenBtn?.addEventListener('click', toggleSidebar);
  sidebarCloseBtn?.addEventListener('click', toggleSidebar);
  sidebarBackdrop?.addEventListener('click', toggleSidebar);
  userMenuButton?.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleUserMenu();
  });

  document.addEventListener('click', (e) => {
    if (userMenu && !userMenu.classList.contains('invisible') && !userMenuButton.contains(e.target)) {
      toggleUserMenu();
    }
  });

  addScreenBtn?.addEventListener('click', () => openScreenModal());
  closeScreenModalBtn?.addEventListener('click', closeScreenModal);
  cancelScreenBtn?.addEventListener('click', closeScreenModal);
  screenForm?.addEventListener('submit', handleFormSubmit);

  // Filtering
  filterForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      currentPage = 1;
      applyFiltersAndPagination();
  });

  resetFilterBtn?.addEventListener('click', () => {
      filterForm.reset();
      currentPage = 1;
      applyFiltersAndPagination();
  });

  // Pagination
  itemsPerPageSelect?.addEventListener('change', (e) => {
    itemsPerPage = parseInt(e.target.value);
    currentPage = 1;
    applyFiltersAndPagination();
  });

  btnFirst?.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage = 1;
      applyFiltersAndPagination();
    }
  });

  btnPrev?.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      applyFiltersAndPagination();
    }
  });

  btnNext?.addEventListener('click', () => {
    if (currentPage < totalPages) {
      currentPage++;
      applyFiltersAndPagination();
    }
  });

  btnLast?.addEventListener('click', () => {
    if (currentPage < totalPages) {
      currentPage = totalPages;
      applyFiltersAndPagination();
    }
  });

  currentPageInput?.addEventListener('change', (e) => {
    let newPage = parseInt(e.target.value);
    if (newPage >= 1 && newPage <= totalPages) {
      currentPage = newPage;
      applyFiltersAndPagination();
    } else {
      e.target.value = currentPage;
    }
  });

  refreshBtn?.addEventListener('click', () => {
      console.log('Refreshing screen list (simulation)...');
      // allScreens = generateSampleScreens(20);
      applyFiltersAndPagination();
      alert('Danh sách màn hình đã được làm mới (mô phỏng).');
  });


  // --- Initial Load ---
  allScreens = generateSampleScreens(20);
  itemsPerPage = parseInt(itemsPerPageSelect.value);
  applyFiltersAndPagination(); // Initial render
}); 