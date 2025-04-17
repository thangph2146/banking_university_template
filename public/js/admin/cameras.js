document.addEventListener('DOMContentLoaded', () => {
  AOS.init();

  // --- State Variables ---
  let allCameras = []; // Store all camera data
  let currentCameras = []; // Store filtered and paginated camera data
  let currentPage = 1;
  let itemsPerPage = 10;
  let totalPages = 1;
  // let currentEditCameraId = null; // Removed, modal is no longer used

  // --- DOM Elements ---
  const sidebar = document.getElementById('sidebar');
  const sidebarBackdrop = document.getElementById('sidebar-backdrop');
  const sidebarOpenBtn = document.getElementById('sidebar-open');
  const sidebarCloseBtn = document.getElementById('sidebar-close');
  const userMenuButton = document.getElementById('user-menu-button');
  const userMenu = document.getElementById('user-menu');

  // Removed modal elements
  // const cameraModal = document.getElementById('camera-modal');
  // const addCameraBtn = document.getElementById('add-camera-btn'); // This is now a link
  // const closeCameraModalBtn = document.getElementById('close-camera-modal');
  // const cancelCameraBtn = document.getElementById('cancel-camera');
  // const cameraForm = document.getElementById('camera-form');
  // const modalTitle = document.getElementById('modal-title');
  // const cameraIdInput = document.getElementById('camera-id');
  // const cameraNameInput = document.getElementById('modal-camera-name');
  // const cameraIpInput = document.getElementById('modal-camera-ip');
  // const cameraPortInput = document.getElementById('modal-camera-port');
  // const cameraStatusInput = document.getElementById('modal-camera-status');
  // const cameraDepartmentInput = document.getElementById('modal-camera-department');

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
  const btnFirst = paginationControls?.querySelector('.btn-first');
  const btnPrev = paginationControls?.querySelector('.btn-prev');
  const btnNext = paginationControls?.querySelector('.btn-next');
  const btnLast = paginationControls?.querySelector('.btn-last');
  const refreshBtn = document.getElementById('refresh-btn');

  // --- Mock Camera Data (Dữ liệu mẫu dựa trên bảng camera) ---
  const camerasMockData = [
    { id: 1, name: 'Camera Cổng Chính', ip_address: '192.168.1.101', port: 8080, status: 1, phong_khoa_id: null, created_at: '2023-01-15 09:00:00', updated_at: '2024-07-28 10:30:00' },
    { id: 2, name: 'Camera Hành lang A1', ip_address: '192.168.1.102', port: 554, status: 1, phong_khoa_id: 1, created_at: '2023-01-15 09:05:00', updated_at: '2024-07-28 10:30:00' },
    { id: 3, name: 'Camera Hội trường B', ip_address: '192.168.2.50', port: 8080, status: 0, phong_khoa_id: 2, created_at: '2023-02-10 14:00:00', updated_at: '2024-05-15 11:00:00' },
    { id: 4, name: 'Camera Thư viện Tầng 1', ip_address: '10.0.0.15', port: 554, status: 1, phong_khoa_id: 3, created_at: '2023-03-01 08:30:00', updated_at: '2024-07-20 15:00:00' },
    { id: 5, name: 'Camera Sân Vận Động', ip_address: '192.168.1.200', port: 8080, status: 1, phong_khoa_id: null, created_at: '2023-04-20 11:00:00', updated_at: '2024-06-30 16:45:00' },
    { id: 6, name: 'Camera Phòng Lab C1', ip_address: '192.168.3.10', port: 554, status: 0, phong_khoa_id: 4, created_at: '2023-05-05 10:15:00', updated_at: '2024-04-22 09:00:00' },
    { id: 7, name: 'Camera Nhà xe NV', ip_address: '192.168.1.110', port: 8080, status: 1, phong_khoa_id: null, created_at: '2023-06-12 13:00:00', updated_at: '2024-07-28 10:35:00' },
    { id: 8, name: 'Camera Phòng Học D201', ip_address: '192.168.4.25', port: 554, status: 1, phong_khoa_id: 5, created_at: '2023-07-18 07:50:00', updated_at: '2024-07-10 14:20:00' },
    { id: 9, name: 'Camera Khoa CNTT', ip_address: '10.1.1.5', port: 8080, status: 1, phong_khoa_id: 1, created_at: '2023-08-01 16:00:00', updated_at: '2024-07-25 17:00:00' },
    { id: 10, name: 'Camera Khoa Kế Toán', ip_address: '10.1.2.5', port: 554, status: 1, phong_khoa_id: 2, created_at: '2023-08-01 16:05:00', updated_at: '2024-07-25 17:05:00' },
    { id: 11, name: 'Camera Lối vào Thư Viện', ip_address: '10.0.0.16', port: 8080, status: 1, phong_khoa_id: 3, created_at: '2023-09-05 08:00:00', updated_at: '2024-07-27 10:00:00' },
    { id: 12, name: 'Camera Phòng Server', ip_address: '192.168.0.2', port: 22, status: 1, phong_khoa_id: 1, created_at: '2023-10-10 00:00:00', updated_at: '2024-07-01 09:00:00' },
    { id: 13, name: 'Camera Văn phòng Khoa QTKD', ip_address: '10.1.3.5', port: 554, status: 1, phong_khoa_id: 4, created_at: '2023-11-11 11:11:11', updated_at: '2024-06-28 14:30:00' },
    { id: 14, name: 'Camera Phòng họp E3', ip_address: '192.168.5.100', port: 8080, status: 0, phong_khoa_id: 5, created_at: '2023-12-01 15:30:00', updated_at: '2024-03-10 10:00:00' },
    { id: 15, name: 'Camera Giảng đường F1', ip_address: '192.168.6.20', port: 554, status: 1, phong_khoa_id: null, created_at: '2024-01-10 08:45:00', updated_at: '2024-07-28 11:00:00' },
    { id: 16, name: 'Camera Khu tự học', ip_address: '10.0.0.30', port: 8080, status: 1, phong_khoa_id: 3, created_at: '2024-02-14 09:20:00', updated_at: '2024-07-15 16:00:00' },
    { id: 17, name: 'Camera Phòng thực hành Mạng', ip_address: '192.168.3.11', port: 554, status: 1, phong_khoa_id: 1, created_at: '2024-03-10 10:00:00', updated_at: '2024-07-28 11:05:00' },
    { id: 18, name: 'Camera Sảnh chính', ip_address: '192.168.1.5', port: 8080, status: 1, phong_khoa_id: null, created_at: '2024-04-01 07:30:00', updated_at: '2024-07-26 08:00:00' },
    { id: 19, name: 'Camera Phòng Kế toán', ip_address: '10.1.2.6', port: 554, status: 1, phong_khoa_id: 2, created_at: '2024-05-15 14:45:00', updated_at: '2024-07-28 11:10:00' },
    { id: 20, name: 'Camera Bãi giữ xe GV', ip_address: '192.168.1.111', port: 8080, status: 0, phong_khoa_id: null, created_at: '2024-06-20 17:00:00', updated_at: '2024-07-20 09:30:00' },
];

  // --- UI Interaction Functions --- (Sidebar and User Menu toggles remain the same)
  const toggleSidebar = () => {
    sidebar?.classList.toggle('-translate-x-full');
    sidebarBackdrop?.classList.toggle('hidden');
  };

  const toggleUserMenu = () => {
    userMenu?.classList.toggle('opacity-0');
    userMenu?.classList.toggle('invisible');
    // The following lines are for hover effect, adjust if needed
    userMenu?.classList.toggle('group-hover:opacity-100');
    userMenu?.classList.toggle('group-hover:visible');
  };

  // --- Data Handling Functions ---
  const applyFiltersAndPagination = () => {
    const nameFilter = filterNameInput?.value.toLowerCase() || '';
    const ipFilter = filterIpInput?.value.toLowerCase() || '';
    const statusFilter = filterStatusInput?.value || ''; // Can be '', '0', '1'
    const departmentFilter = filterDepartmentInput?.value || '';

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
    if (!camerasTableBody) return;
    camerasTableBody.innerHTML = ''; // Clear existing rows

    if (currentCameras.length === 0) {
      noDataPlaceholder?.classList.remove('hidden');
      return;
    }

    noDataPlaceholder?.classList.add('hidden');

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
          <a href="camera-detail.html?id=${camera.id}" class="btn-view p-1 text-green-600 hover:text-green-800 hover:bg-green-100 rounded" title="Xem">
            <i class="ri-eye-line"></i>
          </a>
          <a href="camera-edit.html?id=${camera.id}" class="btn-edit p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded" title="Sửa">
            <i class="ri-pencil-line"></i>
          </a>
          <button class="btn-delete p-1 text-red-600 hover:text-red-800 hover:bg-red-100 rounded" title="Xóa" data-id="${camera.id}">
            <i class="ri-delete-bin-line"></i>
          </button>
        </td>
      `;

      // Add event listener for delete button
      row.querySelector('.btn-delete').addEventListener('click', () => handleDeleteCamera(camera.id));

      camerasTableBody.appendChild(row);
    });
  };

  const updatePagination = (totalItems) => {
    if (!totalItemsCountEl || !totalPagesCountEl || !currentPageInput || !paginationControls) return;

    totalItemsCountEl.textContent = totalItems;
    totalPagesCountEl.textContent = totalPages;
    currentPageInput.value = currentPage;
    currentPageInput.max = totalPages;

    // Enable/disable buttons
    if (btnFirst) btnFirst.disabled = currentPage === 1;
    if (btnPrev) btnPrev.disabled = currentPage === 1;
    if (btnNext) btnNext.disabled = currentPage === totalPages;
    if (btnLast) btnLast.disabled = currentPage === totalPages;

    // Hide pagination if only one page
    if (totalPages <= 1) {
        paginationControls.classList.add('hidden');
    } else {
        paginationControls.classList.remove('hidden');
    }
  };

  // Removed handleEditCamera (navigation handled by link)
  // Removed handleViewCamera (navigation handled by link)

  const handleDeleteCamera = (id) => {
    const cameraToDelete = allCameras.find(c => c.id === id);
    if (!cameraToDelete) {
        console.error('Camera not found for deletion:', id);
        alert('Không tìm thấy camera để xóa.');
        return;
    }

    if (confirm(`Bạn có chắc chắn muốn xóa camera "${cameraToDelete.name}" (ID: ${id}) không?`)) {
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
        console.error('Camera not found for deletion after confirmation:', id);
        alert('Không tìm thấy camera để xóa.');
      }
    }
  };

  // Removed handleFormSubmit (handled in create/edit pages)

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
    if (userMenu && !userMenu.classList.contains('invisible') && !userMenuButton?.contains(e.target)) {
      toggleUserMenu();
    }
  });

  // Removed modal-related listeners
  // addCameraBtn?.addEventListener('click', () => openCameraModal()); // This is now a link
  // closeCameraModalBtn?.addEventListener('click', closeCameraModal);
  // cancelCameraBtn?.addEventListener('click', closeCameraModal);
  // cameraForm?.addEventListener('submit', handleFormSubmit);

  // Filtering
  filterForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      currentPage = 1; // Reset to first page on filter apply
      applyFiltersAndPagination();
  });

  resetFilterBtn?.addEventListener('click', () => {
      filterForm?.reset();
      currentPage = 1;
      applyFiltersAndPagination();
  });

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
    if (!isNaN(newPage) && newPage >= 1 && newPage <= totalPages) {
      currentPage = newPage;
      applyFiltersAndPagination();
    } else {
      // Reset input to current page if invalid
      e.target.value = currentPage;
    }
  });
    currentPageInput?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            let newPage = parseInt(e.target.value, 10);
             if (!isNaN(newPage) && newPage >= 1 && newPage <= totalPages) {
                currentPage = newPage;
                applyFiltersAndPagination();
            } else {
                e.target.value = currentPage; // Reset if invalid
            }
        }
    });

  refreshBtn?.addEventListener('click', () => {
      // In a real app, this would re-fetch data from the server
      console.log('Refreshing camera list (simulation)...');
      // For simulation, we can just re-apply filters/pagination
      // Or optionally regenerate sample data:
      allCameras = [...camerasMockData]; // Reset to original mock data
      applyFiltersAndPagination();
      alert('Danh sách camera đã được làm mới (mô phỏng).');
  });


  // --- Initial Load --- Tải dữ liệu ban đầu
  const initializePage = () => {
      allCameras = [...camerasMockData]; // Load mock data
      if (itemsPerPageSelect) {
          itemsPerPage = parseInt(itemsPerPageSelect.value);
      }
      applyFiltersAndPagination(); // Render initial table and pagination
  };
  
  initializePage(); // Call initialization function

}); 