document.addEventListener('DOMContentLoaded', () => {
  AOS.init();

  // --- State Variables ---
  let allEventSpeakers = []; // Store all event-speaker relationships
  let currentEventSpeakers = []; // Store filtered and paginated relationships
  let currentPage = 1;
  let itemsPerPage = 10;
  let totalPages = 1;
  // No edit ID needed for this table, identified by composite key

  // --- DOM Elements ---
  const sidebar = document.getElementById('sidebar');
  const sidebarBackdrop = document.getElementById('sidebar-backdrop');
  const sidebarOpenBtn = document.getElementById('sidebar-open');
  const sidebarCloseBtn = document.getElementById('sidebar-close');
  const userMenuButton = document.getElementById('user-menu-button');
  const userMenu = document.getElementById('user-menu');

  const eventSpeakerModal = document.getElementById('event-speaker-modal');
  const addEventSpeakerBtn = document.getElementById('add-event-speaker-btn');
  const closeEventSpeakerModalBtn = document.getElementById('close-event-speaker-modal');
  const cancelEventSpeakerBtn = document.getElementById('cancel-event-speaker');
  const eventSpeakerForm = document.getElementById('event-speaker-form');
  const modalEventIdInput = document.getElementById('modal-event-id');
  const modalSpeakerIdInput = document.getElementById('modal-speaker-id');

  const filterForm = document.getElementById('filter-form');
  const filterEventIdInput = document.getElementById('filter-event-id');
  const filterSpeakerIdInput = document.getElementById('filter-speaker-id');
  const resetFilterBtn = document.getElementById('reset-filter-btn');

  const eventSpeakersTableBody = document.getElementById('eventSpeakersTableBody');
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

  // --- Sample Event Speaker Data (based on su_kien_dien_gia structure) ---
  // Assuming we have event IDs (1-20) and speaker IDs (1-10) for sample data
  const generateSampleEventSpeakers = (count) => {
    const sampleData = [];
    const eventIds = Array.from({ length: 20 }, (_, i) => i + 1);
    const speakerIds = Array.from({ length: 10 }, (_, i) => i + 1);
    const existingPairs = new Set(); // To avoid duplicate pairs

    for (let i = 0; i < count; i++) {
      let eventId, speakerId, pairKey;
      do {
        eventId = eventIds[Math.floor(Math.random() * eventIds.length)];
        speakerId = speakerIds[Math.floor(Math.random() * speakerIds.length)];
        pairKey = `${eventId}-${speakerId}`;
      } while (existingPairs.has(pairKey)); // Ensure unique pairs

      existingPairs.add(pairKey);
      sampleData.push({
        su_kien_id: eventId,
        dien_gia_id: speakerId,
        // created_at and updated_at could be added if needed
        // created_at: new Date(Date.now() - Math.random() * 5 * 24 * 60 * 60 * 1000).toISOString().slice(0, 19).replace('T', ' '),
        // updated_at: Math.random() > 0.5 ? new Date().toISOString().slice(0, 19).replace('T', ' ') : null,
      });
    }
    return sampleData.sort((a, b) => a.su_kien_id - b.su_kien_id || a.dien_gia_id - b.dien_gia_id); // Sort for consistency
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

  const openEventSpeakerModal = () => {
    eventSpeakerForm.reset(); // Clear previous data
    // Modal is only for adding, so no need to populate with existing data
    eventSpeakerModal.classList.remove('hidden');
  };

  const closeEventSpeakerModal = () => {
    eventSpeakerModal.classList.add('hidden');
    eventSpeakerForm.reset();
  };

  // --- Data Handling Functions ---
  const applyFiltersAndPagination = () => {
    const eventIdFilter = filterEventIdInput.value;
    const speakerIdFilter = filterSpeakerIdInput.value;

    let filteredData = allEventSpeakers.filter(item => {
      const matchesEventId = eventIdFilter === '' || item.su_kien_id.toString() === eventIdFilter;
      const matchesSpeakerId = speakerIdFilter === '' || item.dien_gia_id.toString() === speakerIdFilter;
      return matchesEventId && matchesSpeakerId;
    });

    totalPages = Math.ceil(filteredData.length / itemsPerPage);
    if (totalPages < 1) totalPages = 1;
    if (currentPage > totalPages) currentPage = totalPages;
    if (currentPage < 1) currentPage = 1;

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    currentEventSpeakers = filteredData.slice(startIndex, endIndex);

    renderTable();
    updatePagination(filteredData.length);
  };

  const renderTable = () => {
    eventSpeakersTableBody.innerHTML = ''; // Clear existing rows

    if (currentEventSpeakers.length === 0) {
      noDataPlaceholder.classList.remove('hidden');
      return;
    }

    noDataPlaceholder.classList.add('hidden');

    currentEventSpeakers.forEach(item => {
      const row = document.createElement('tr');
      row.classList.add('hover:bg-gray-50');

      // In a real app, you might fetch Event Name and Speaker Name based on IDs
      // const eventName = fetchEventName(item.su_kien_id); // Placeholder
      // const speakerName = fetchSpeakerName(item.dien_gia_id); // Placeholder

      row.innerHTML = `
        <td class="px-4 py-3 text-sm text-gray-700 font-medium">${item.su_kien_id}</td>
        <td class="px-4 py-3 text-sm text-gray-700 font-medium">${item.dien_gia_id}</td>
        <td class="px-4 py-3 text-right text-sm font-medium space-x-1 whitespace-nowrap">
          <button class="btn-delete p-1 text-red-600 hover:text-red-800 hover:bg-red-100 rounded" title="Xóa" data-event-id="${item.su_kien_id}" data-speaker-id="${item.dien_gia_id}">
            <i class="ri-delete-bin-line"></i>
          </button>
          <!-- Edit button removed as it's usually not applicable for link tables -->
        </td>
      `;

      // Add event listeners for action buttons
      row.querySelector('.btn-delete').addEventListener('click', (e) => {
          const eventId = e.currentTarget.getAttribute('data-event-id');
          const speakerId = e.currentTarget.getAttribute('data-speaker-id');
          handleDeleteEventSpeaker(parseInt(eventId), parseInt(speakerId));
      });

      eventSpeakersTableBody.appendChild(row);
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

  // Delete function uses composite key
  const handleDeleteEventSpeaker = (eventId, speakerId) => {
    if (confirm(`Bạn có chắc chắn muốn xóa diễn giả ID ${speakerId} khỏi sự kiện ID ${eventId} không?`)) {
      const index = allEventSpeakers.findIndex(item => item.su_kien_id === eventId && item.dien_gia_id === speakerId);
      if (index > -1) {
        allEventSpeakers.splice(index, 1);
        // Re-apply filters and pagination
        applyFiltersAndPagination();
        console.log('Event-Speaker relationship deleted:', { eventId, speakerId });
        // Add actual API call here in a real application
        alert('Mối quan hệ Diễn giả - Sự kiện đã được xóa (mô phỏng).');
      } else {
        console.error('Event-Speaker relationship not found for deletion:', { eventId, speakerId });
        alert('Không tìm thấy bản ghi để xóa.');
      }
    }
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();

    const formData = new FormData(eventSpeakerForm);
    const eventId = parseInt(formData.get('modal-event-id'));
    const speakerId = parseInt(formData.get('modal-speaker-id'));

    // Basic validation
    if (!eventId || !speakerId) {
        alert('Vui lòng nhập ID Sự kiện và ID Diễn giả.');
        return;
    }

    // Check if the pair already exists
    const exists = allEventSpeakers.some(item => item.su_kien_id === eventId && item.dien_gia_id === speakerId);
    if (exists) {
        alert(`Diễn giả ID ${speakerId} đã được thêm vào sự kiện ID ${eventId}.`);
        return;
    }

    // Add new relationship
    const newRelationship = {
      su_kien_id: eventId,
      dien_gia_id: speakerId,
      // Add created_at/updated_at if needed
    };
    allEventSpeakers.push(newRelationship);
    // Sort again after adding
    allEventSpeakers.sort((a, b) => a.su_kien_id - b.su_kien_id || a.dien_gia_id - b.dien_gia_id);

    console.log('Event-Speaker relationship added:', newRelationship);
    alert('Đã thêm diễn giả vào sự kiện (mô phỏng).');

    closeEventSpeakerModal();
    // Go to the page where the new item might be (optional, might be complex)
    // Or simply refresh the current view
    applyFiltersAndPagination(); // Refresh the table
    // Add actual API call here in a real application
  };

  // --- Event Listeners ---
  sidebarOpenBtn?.addEventListener('click', toggleSidebar);
  sidebarCloseBtn?.addEventListener('click', toggleSidebar);
  sidebarBackdrop?.addEventListener('click', toggleSidebar);
  userMenuButton?.addEventListener('click', (e) => {
      e.stopPropagation(); // Prevent click from closing immediately
      toggleUserMenu();
  });

  // Close user menu if clicked outside
  document.addEventListener('click', (e) => {
    if (userMenu && !userMenu.classList.contains('invisible') && !userMenuButton.contains(e.target)) {
      toggleUserMenu();
    }
  });

  addEventSpeakerBtn?.addEventListener('click', openEventSpeakerModal);
  closeEventSpeakerModalBtn?.addEventListener('click', closeEventSpeakerModal);
  cancelEventSpeakerBtn?.addEventListener('click', closeEventSpeakerModal);
  eventSpeakerForm?.addEventListener('submit', handleFormSubmit);

  // Filtering
  filterForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      currentPage = 1; // Reset to first page on filter apply
      applyFiltersAndPagination();
  });

  resetFilterBtn?.addEventListener('click', () => {
      filterForm.reset();
      currentPage = 1;
      applyFiltersAndPagination();
  });

  // Real-time filtering (optional)
  /*
  filterEventIdInput.addEventListener('input', () => { currentPage = 1; applyFiltersAndPagination(); });
  filterSpeakerIdInput.addEventListener('input', () => { currentPage = 1; applyFiltersAndPagination(); });
  */

  // Pagination
  itemsPerPageSelect?.addEventListener('change', (e) => {
    itemsPerPage = parseInt(e.target.value);
    currentPage = 1; // Reset to first page when changing items per page
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
      // Reset input to current page if invalid
      e.target.value = currentPage;
    }
  });

  refreshBtn?.addEventListener('click', () => {
      // In a real app, this would re-fetch data from the server
      console.log('Refreshing event-speaker list (simulation)...');
      // For simulation, we can just re-apply filters/pagination
      // Or optionally regenerate sample data:
      // allEventSpeakers = generateSampleEventSpeakers(30); // Generate maybe more for linking table
      applyFiltersAndPagination();
      alert('Danh sách diễn giả - sự kiện đã được làm mới (mô phỏng).');
  });


  // --- Initial Load ---
  allEventSpeakers = generateSampleEventSpeakers(30); // Generate initial sample data (more for link table)
  itemsPerPage = parseInt(itemsPerPageSelect.value);
  applyFiltersAndPagination(); // Initial render
}); 