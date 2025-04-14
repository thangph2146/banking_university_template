document.addEventListener('DOMContentLoaded', () => {
  AOS.init();

  // --- State Variables ---
  let allCameras = []; // Store all camera data
  let currentCameras = []; // Store filtered and paginated camera data
  let currentPage = 1;
  let itemsPerPage = 10;
  let totalPages = 1;
  let currentEditCameraId = null; // To track which camera is being edited

  // --- DOM Elements ---
  const sidebar = document.getElementById('sidebar');
  const sidebarBackdrop = document.getElementById('sidebar-backdrop');
  const sidebarOpenBtn = document.getElementById('sidebar-open');
  const sidebarCloseBtn = document.getElementById('sidebar-close');
  const userMenuButton = document.getElementById('user-menu-button');
  const userMenu = document.getElementById('user-menu');

  const cameraModal = document.getElementById('camera-modal');
  const addCameraBtn = document.getElementById('add-camera-btn');
  const closeCameraModalBtn = document.getElementById('close-camera-modal');
  const cancelCameraBtn = document.getElementById('cancel-camera');
  const cameraForm = document.getElementById('camera-form');
  const modalTitle = document.getElementById('modal-title');
  const cameraIdInput = document.getElementById('camera-id');
  const cameraNameInput = document.getElementById('modal-camera-name');
  const cameraIpInput = document.getElementById('modal-camera-ip');
  const cameraPortInput = document.getElementById('modal-camera-port');
  const cameraStatusInput = document.getElementById('modal-camera-status');
  const cameraDepartmentInput = document.getElementById('modal-camera-department');

  const filterForm = document.getElementById('filter-form');
  const filterNameInput = document.getElementById('filter-name');
  const filterIpInput = document.getElementById('filter-ip');
  const filterStatusInput = document.getElementById('filter-status');
  const filterDepartmentInput = document.getElementById('filter-department');
  const resetFilterBtn = document.getElementById('reset-filter-btn');

  const camerasTableBody = document.getElementById('camerasTableBody');
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

  // --- Sample Camera Data (based on hanet.sql structure) ---
  const generateSampleCameras = (count) => {
    const sampleData = [];
    const statuses = [0, 1]; // 0: Inactive, 1: Active
    const departments = [1, 2, 3, 4, 5, null]; // Example department IDs + null
    for (let i = 1; i <= count; i++) {
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const deptId = departments[Math.floor(Math.random() * departments.length)];
      sampleData.push({
        id: i,
        name: `Camera Khu Vực ${String.fromCharCode(65 + Math.floor(Math.random() * 26))}-${Math.floor(Math.random() * 100)}`,
        ip_address: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 254) + 1}`,
        port: Math.random() > 0.5 ? 8080 : 554,
        status: status,
        phong_khoa_id: deptId,
        created_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 19).replace('T', ' '),
        updated_at: Math.random() > 0.3 ? new Date().toISOString().slice(0, 19).replace('T', ' ') : null,
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

  const openCameraModal = (camera = null) => {
    cameraForm.reset(); // Clear previous data
    if (camera) {
      modalTitle.textContent = 'Chỉnh sửa Camera';
      currentEditCameraId = camera.id;
      cameraIdInput.value = camera.id;
      cameraNameInput.value = camera.name || '';
      cameraIpInput.value = camera.ip_address || '';
      cameraPortInput.value = camera.port || '';
      cameraStatusInput.value = camera.status !== undefined ? camera.status.toString() : '1'; // Default to active if undefined
      cameraDepartmentInput.value = camera.phong_khoa_id || '';
    } else {
      modalTitle.textContent = 'Thêm Camera mới';
      currentEditCameraId = null;
      cameraIdInput.value = '';
    }
    cameraModal.classList.remove('hidden');
  };

  const closeCameraModal = () => {
    cameraModal.classList.add('hidden');
    cameraForm.reset();
    currentEditCameraId = null;
  };

  // --- Data Handling Functions ---
  const applyFiltersAndPagination = () => {
    const nameFilter = filterNameInput.value.toLowerCase();
    const ipFilter = filterIpInput.value.toLowerCase();
    const statusFilter = filterStatusInput.value; // Can be '', '0', '1'
    const departmentFilter = filterDepartmentInput.value;

    let filteredCameras = allCameras.filter(camera => {
      const matchesName = camera.name.toLowerCase().includes(nameFilter);
      const matchesIp = camera.ip_address.toLowerCase().includes(ipFilter);
      const matchesStatus = statusFilter === '' || camera.status.toString() === statusFilter;
      const matchesDepartment = departmentFilter === '' || (camera.phong_khoa_id !== null && camera.phong_khoa_id.toString() === departmentFilter);

      return matchesName && matchesIp && matchesStatus && matchesDepartment;
    });

    totalPages = Math.ceil(filteredCameras.length / itemsPerPage);
    if (totalPages < 1) totalPages = 1;
    if (currentPage > totalPages) currentPage = totalPages;
    if (currentPage < 1) currentPage = 1;

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    currentCameras = filteredCameras.slice(startIndex, endIndex);

    renderTable();
    updatePagination(filteredCameras.length);
  };

  const renderTable = () => {
    camerasTableBody.innerHTML = ''; // Clear existing rows

    if (currentCameras.length === 0) {
      noDataPlaceholder.classList.remove('hidden');
      return;
    }

    noDataPlaceholder.classList.add('hidden');

    currentCameras.forEach(camera => {
      const row = document.createElement('tr');
      row.classList.add('hover:bg-gray-50');

      const statusText = camera.status === 1 ? 'Hoạt động' : 'Không hoạt động';
      const statusClass = camera.status === 1 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
      const departmentDisplay = camera.phong_khoa_id !== null ? camera.phong_khoa_id : 'N/A';

      row.innerHTML = `
        <td class="px-4 py-3 text-sm text-gray-700 font-medium">${camera.id}</td>
        <td class="px-4 py-3 text-sm text-gray-600">${camera.name}</td>
        <td class="px-4 py-3 text-sm text-gray-500">${camera.ip_address}</td>
        <td class="px-4 py-3 text-sm text-gray-500">${camera.port}</td>
        <td class="px-4 py-3 text-sm">
          <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClass}">
            ${statusText}
          </span>
        </td>
        <td class="px-4 py-3 text-sm text-gray-500">${departmentDisplay}</td>
        <td class="px-4 py-3 text-right text-sm font-medium space-x-1 whitespace-nowrap">
          <button class="btn-edit p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded" title="Sửa" data-id="${camera.id}">
            <i class="ri-pencil-line"></i>
          </button>
          <button class="btn-delete p-1 text-red-600 hover:text-red-800 hover:bg-red-100 rounded" title="Xóa" data-id="${camera.id}">
            <i class="ri-delete-bin-line"></i>
          </button>
          <!-- Add view button if needed -->
          <!--
          <button class="btn-view p-1 text-green-600 hover:text-green-800 hover:bg-green-100 rounded" title="Xem" data-id="${camera.id}">
            <i class="ri-eye-line"></i>
          </button>
          -->
        </td>
      `;

      // Add event listeners for action buttons
      row.querySelector('.btn-edit').addEventListener('click', () => handleEditCamera(camera.id));
      row.querySelector('.btn-delete').addEventListener('click', () => handleDeleteCamera(camera.id));
      // row.querySelector('.btn-view')?.addEventListener('click', () => handleViewCamera(camera.id));

      camerasTableBody.appendChild(row);
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

  const handleEditCamera = (id) => {
    const cameraToEdit = allCameras.find(c => c.id === id);
    if (cameraToEdit) {
      openCameraModal(cameraToEdit);
    } else {
      console.error('Camera not found for editing:', id);
      alert('Không tìm thấy camera để chỉnh sửa.');
    }
  };

  const handleDeleteCamera = (id) => {
    if (confirm(`Bạn có chắc chắn muốn xóa camera có ID ${id} không?`)) {
      // Find index of camera to delete
      const index = allCameras.findIndex(c => c.id === id);
      if (index > -1) {
        allCameras.splice(index, 1);
        // Re-apply filters and pagination
        applyFiltersAndPagination();
        console.log('Camera deleted:', id);
        // Add actual API call here in a real application
        alert('Camera đã được xóa (mô phỏng).');
      } else {
        console.error('Camera not found for deletion:', id);
        alert('Không tìm thấy camera để xóa.');
      }
    }
  };

  const handleViewCamera = (id) => {
     // Implement view functionality if needed, e.g., open a different modal or redirect
     console.log('View camera:', id);
     alert(`Xem chi tiết camera ID: ${id} (chưa triển khai)`);
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();

    const formData = new FormData(cameraForm);
    const cameraData = {
      id: currentEditCameraId ? parseInt(currentEditCameraId) : Date.now(), // Generate new ID or use existing
      name: formData.get('modal-camera-name'),
      ip_address: formData.get('modal-camera-ip'),
      port: parseInt(formData.get('modal-camera-port')),
      status: parseInt(formData.get('modal-camera-status')),
      phong_khoa_id: formData.get('modal-camera-department') ? parseInt(formData.get('modal-camera-department')) : null,
      created_at: currentEditCameraId ? allCameras.find(c => c.id === currentEditCameraId).created_at : new Date().toISOString().slice(0, 19).replace('T', ' '),
      updated_at: new Date().toISOString().slice(0, 19).replace('T', ' '),
    };

    // Basic validation (IP format is handled by pattern attribute)
    if (!cameraData.name || !cameraData.ip_address || !cameraData.port) {
        alert('Vui lòng điền đầy đủ Tên Camera, Địa chỉ IP và Port.');
        return;
    }

    if (currentEditCameraId) {
      // Update existing camera
      const index = allCameras.findIndex(c => c.id === currentEditCameraId);
      if (index > -1) {
        allCameras[index] = cameraData;
        console.log('Camera updated:', cameraData);
         alert('Camera đã được cập nhật (mô phỏng).');
      } else {
         console.error('Camera not found for update:', currentEditCameraId);
         alert('Lỗi: Không tìm thấy camera để cập nhật.');
      }
    } else {
      // Add new camera
      allCameras.unshift(cameraData); // Add to the beginning
      console.log('Camera added:', cameraData);
      alert('Camera đã được thêm (mô phỏng).');
    }

    closeCameraModal();
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

  addCameraBtn?.addEventListener('click', () => openCameraModal());
  closeCameraModalBtn?.addEventListener('click', closeCameraModal);
  cancelCameraBtn?.addEventListener('click', closeCameraModal);
  cameraForm?.addEventListener('submit', handleFormSubmit);

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

  // Real-time filtering (optional, uncomment if desired)
  /*
  filterNameInput.addEventListener('input', () => { currentPage = 1; applyFiltersAndPagination(); });
  filterIpInput.addEventListener('input', () => { currentPage = 1; applyFiltersAndPagination(); });
  filterStatusInput.addEventListener('change', () => { currentPage = 1; applyFiltersAndPagination(); });
  filterDepartmentInput.addEventListener('input', () => { currentPage = 1; applyFiltersAndPagination(); });
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
      console.log('Refreshing camera list (simulation)...');
      // For simulation, we can just re-apply filters/pagination
      // Or optionally regenerate sample data:
      // allCameras = generateSampleCameras(20);
      applyFiltersAndPagination();
      alert('Danh sách camera đã được làm mới (mô phỏng).');
  });


  // --- Initial Load ---
  allCameras = generateSampleCameras(20); // Generate initial sample data
  itemsPerPage = parseInt(itemsPerPageSelect.value);
  applyFiltersAndPagination(); // Initial render
}); 