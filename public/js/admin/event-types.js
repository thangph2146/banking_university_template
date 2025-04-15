document.addEventListener('DOMContentLoaded', () => {
  AOS.init();

  // --- State Variables ---
  let allEventTypes = []; // Store all event type data
  let currentEventTypes = []; // Store filtered and paginated event type data
  let currentPage = 1;
  let itemsPerPage = 10;
  let totalPages = 1;
  let currentEditEventTypeId = null; // To track which event type is being edited

  // --- DOM Elements ---
  const sidebar = document.getElementById('sidebar');
  const sidebarBackdrop = document.getElementById('sidebar-backdrop');
  const sidebarOpenBtn = document.getElementById('sidebar-open');
  const sidebarCloseBtn = document.getElementById('sidebar-close');
  const userMenuButton = document.getElementById('user-menu-button');
  const userMenu = document.getElementById('user-menu');

  const eventTypeModal = document.getElementById('event-type-modal');
  const addEventTypeBtn = document.getElementById('add-event-type-btn');
  const closeEventTypeModalBtn = document.getElementById('close-event-type-modal');
  const cancelEventTypeBtn = document.getElementById('cancel-event-type');
  const eventTypeForm = document.getElementById('event-type-form');
  const modalTitle = document.getElementById('modal-title'); // Ensure modal title ID matches HTML
  const eventTypeIdInput = document.getElementById('event-type-id');
  const eventTypeNameInput = document.getElementById('modal-event-type-name');
  const eventTypeDescriptionInput = document.getElementById('modal-event-type-description');

  const filterForm = document.getElementById('filter-form');
  const filterNameInput = document.getElementById('filter-name');
  const filterDescriptionInput = document.getElementById('filter-description');
  const resetFilterBtn = document.getElementById('reset-filter-btn');

  const eventTypesTableBody = document.getElementById('eventTypesTableBody');
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

  // --- Sample Event Type Data (based on loai_su_kien structure) ---
  const generateSampleEventTypes = (count) => {
    const types = ['Hội thảo', 'Workshop', 'Talkshow', 'Cuộc thi', 'Triển lãm', 'Ngày hội', 'Khóa học', 'Hội nghị'];
    const descriptions = [
      'Chia sẻ kiến thức chuyên sâu.',
      'Thực hành và tương tác.',
      'Giao lưu và trò chuyện với chuyên gia.',
      'Sân chơi thể hiện tài năng.',
      'Trưng bày sản phẩm, tác phẩm.',
      'Sự kiện lớn với nhiều hoạt động.',
      'Chương trình học tập ngắn hạn.',
      'Họp mặt chuyên môn quy mô lớn.'
    ];
    const sampleData = [];

    for (let i = 1; i <= count; i++) {
      const typeIndex = Math.floor(Math.random() * types.length);
      sampleData.push({
        id: i,
        ten_loai_sk: `${types[typeIndex]} Chủ đề ${String.fromCharCode(65 + Math.floor(Math.random() * 10))}`,
        mo_ta: Math.random() > 0.3 ? descriptions[typeIndex] + ` (ID: ${i})` : null,
        // created_at, updated_at, deleted_at can be added if needed from the schema
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

  const openEventTypeModal = (eventType = null) => {
    eventTypeForm.reset(); // Clear previous data
    if (eventType) {
      modalTitle.textContent = 'Chỉnh sửa Loại Sự kiện';
      currentEditEventTypeId = eventType.id;
      eventTypeIdInput.value = eventType.id;
      eventTypeNameInput.value = eventType.ten_loai_sk || '';
      eventTypeDescriptionInput.value = eventType.mo_ta || '';
    } else {
      modalTitle.textContent = 'Thêm Loại Sự kiện mới';
      currentEditEventTypeId = null;
      eventTypeIdInput.value = '';
    }
    eventTypeModal.classList.remove('hidden');
  };

  const closeEventTypeModal = () => {
    eventTypeModal.classList.add('hidden');
    eventTypeForm.reset();
    currentEditEventTypeId = null;
  };

  // --- Data Handling Functions ---
  const applyFiltersAndPagination = () => {
    const nameFilter = filterNameInput.value.toLowerCase();
    const descriptionFilter = filterDescriptionInput.value.toLowerCase();

    let filteredEventTypes = allEventTypes.filter(type => {
      const matchesName = type.ten_loai_sk.toLowerCase().includes(nameFilter);
      const matchesDescription = !descriptionFilter || (type.mo_ta && type.mo_ta.toLowerCase().includes(descriptionFilter));
      return matchesName && matchesDescription;
    });

    totalPages = Math.ceil(filteredEventTypes.length / itemsPerPage);
    if (totalPages < 1) totalPages = 1;
    if (currentPage > totalPages) currentPage = totalPages;
    if (currentPage < 1) currentPage = 1;

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    currentEventTypes = filteredEventTypes.slice(startIndex, endIndex);

    renderTable();
    updatePagination(filteredEventTypes.length);
  };

  const renderTable = () => {
    eventTypesTableBody.innerHTML = ''; // Clear existing rows

    if (currentEventTypes.length === 0) {
      noDataPlaceholder.classList.remove('hidden');
      return;
    }

    noDataPlaceholder.classList.add('hidden');

    currentEventTypes.forEach(type => {
      const row = document.createElement('tr');
      row.classList.add('hover:bg-gray-50');

      const descriptionDisplay = type.mo_ta || '<i class="text-gray-400">Không có mô tả</i>';

      row.innerHTML = `
        <td class="px-4 py-3 text-sm text-gray-700 font-medium">${type.id}</td>
        <td class="px-4 py-3 text-sm text-gray-900 font-medium">${type.ten_loai_sk}</td>
        <td class="px-4 py-3 text-sm text-gray-600">${descriptionDisplay}</td>
        <td class="px-4 py-3 text-right text-sm font-medium space-x-1 whitespace-nowrap">
          <button class="btn-edit p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded" title="Sửa" data-id="${type.id}">
            <i class="ri-pencil-line"></i>
          </button>
          <button class="btn-delete p-1 text-red-600 hover:text-red-800 hover:bg-red-100 rounded" title="Xóa" data-id="${type.id}">
            <i class="ri-delete-bin-line"></i>
          </button>
        </td>
      `;

      // Add event listeners for action buttons
      row.querySelector('.btn-edit').addEventListener('click', () => handleEditEventType(type.id));
      row.querySelector('.btn-delete').addEventListener('click', () => handleDeleteEventType(type.id));

      eventTypesTableBody.appendChild(row);
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

  const handleEditEventType = (id) => {
    const typeToEdit = allEventTypes.find(t => t.id === id);
    if (typeToEdit) {
      openEventTypeModal(typeToEdit);
    } else {
      console.error('Event type not found for editing:', id);
      alert('Không tìm thấy loại sự kiện để chỉnh sửa.');
    }
  };

  const handleDeleteEventType = (id) => {
    if (confirm(`Bạn có chắc chắn muốn xóa loại sự kiện có ID ${id} không?`)) {
      const index = allEventTypes.findIndex(t => t.id === id);
      if (index > -1) {
        allEventTypes.splice(index, 1);
        applyFiltersAndPagination();
        console.log('Event type deleted:', id);
        alert('Loại sự kiện đã được xóa (mô phỏng).');
      } else {
        console.error('Event type not found for deletion:', id);
        alert('Không tìm thấy loại sự kiện để xóa.');
      }
    }
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();

    const formData = new FormData(eventTypeForm);
    const eventTypeData = {
      id: currentEditEventTypeId ? parseInt(currentEditEventTypeId) : Date.now(), // Generate new ID or use existing
      ten_loai_sk: formData.get('modal-event-type-name'),
      mo_ta: formData.get('modal-event-type-description') || null,
      // Add other fields like created_at, updated_at if needed
    };

    // Basic validation
    if (!eventTypeData.ten_loai_sk) {
        alert('Vui lòng nhập Tên Loại Sự kiện.');
        return;
    }

    if (currentEditEventTypeId) {
      // Update existing event type
      const index = allEventTypes.findIndex(t => t.id === currentEditEventTypeId);
      if (index > -1) {
        allEventTypes[index] = eventTypeData;
        console.log('Event type updated:', eventTypeData);
         alert('Loại sự kiện đã được cập nhật (mô phỏng).');
      } else {
         console.error('Event type not found for update:', currentEditEventTypeId);
         alert('Lỗi: Không tìm thấy loại sự kiện để cập nhật.');
      }
    } else {
      // Add new event type
      allEventTypes.unshift(eventTypeData); // Add to the beginning
      console.log('Event type added:', eventTypeData);
      alert('Loại sự kiện đã được thêm (mô phỏng).');
    }

    closeEventTypeModal();
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

  addEventTypeBtn?.addEventListener('click', () => openEventTypeModal());
  closeEventTypeModalBtn?.addEventListener('click', closeEventTypeModal);
  cancelEventTypeBtn?.addEventListener('click', closeEventTypeModal);
  eventTypeForm?.addEventListener('submit', handleFormSubmit);

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
      console.log('Refreshing event type list (simulation)...');
      // allEventTypes = generateSampleEventTypes(10); // Regenerate if needed
      applyFiltersAndPagination();
      alert('Danh sách loại sự kiện đã được làm mới (mô phỏng).');
  });


  // --- Initial Load ---
  allEventTypes = generateSampleEventTypes(15); // Generate initial sample data
  itemsPerPage = parseInt(itemsPerPageSelect.value);
  applyFiltersAndPagination(); // Initial render
});
