// Initialize AOS
AOS.init({
  duration: 800, // Animation duration
  once: true, // Whether animation should happen only once
});

document.addEventListener('DOMContentLoaded', function () {
  // State variables
  let allRoles = []; // Stores all roles fetched or defined
  let currentRoles = []; // Stores roles currently displayed (after filtering/pagination)
  let currentPage = 1;
  let itemsPerPage = 10;
  let totalPages = 1;

  // --- Sample Data (Based on loai_nguoi_dung table) ---
  allRoles = [
    { MaLoai: 1, TenLoai: 'Quản trị viên', MoTa: 'Quản lý toàn bộ hệ thống' },
    { MaLoai: 2, TenLoai: 'Biên tập viên', MoTa: 'Quản lý nội dung sự kiện' },
    { MaLoai: 3, TenLoai: 'Người dùng thường', MoTa: 'Tham gia sự kiện' },
    { MaLoai: 4, TenLoai: 'Diễn giả', MoTa: 'Trình bày tại sự kiện' },
    { MaLoai: 5, TenLoai: 'Đối tác', MoTa: 'Hợp tác tổ chức sự kiện' },
    { MaLoai: 6, TenLoai: 'Khách mời VIP', MoTa: 'Khách mời đặc biệt' },
    { MaLoai: 7, TenLoai: 'Tình nguyện viên', MoTa: 'Hỗ trợ tổ chức sự kiện' },
    { MaLoai: 8, TenLoai: 'Nhân viên kỹ thuật', MoTa: 'Hỗ trợ kỹ thuật cho sự kiện' },
    { MaLoai: 9, TenLoai: 'Ban tổ chức', MoTa: 'Thành viên trong ban tổ chức' },
    { MaLoai: 10, TenLoai: 'Nhà tài trợ', MoTa: 'Đơn vị tài trợ cho sự kiện' },
    // Add more sample roles if needed
  ];

  // DOM Elements
  const sidebar = document.getElementById('sidebar');
  const sidebarBackdrop = document.getElementById('sidebar-backdrop');
  const sidebarOpenBtn = document.getElementById('sidebar-open');
  const sidebarCloseBtn = document.getElementById('sidebar-close');
  const userMenuButton = document.getElementById('user-menu-button');
  const userMenu = document.getElementById('user-menu');
  const rolesTableBody = document.getElementById('rolesTableBody');
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
  const roleModal = document.getElementById('role-modal');
  const addRoleBtn = document.getElementById('add-role-btn');
  const closeRoleModalBtn = document.getElementById('close-role-modal');
  const cancelRoleBtn = document.getElementById('cancel-role');
  const roleForm = document.getElementById('role-form');
  const modalTitle = document.getElementById('modal-title');
  const roleIdInput = document.getElementById('role-id');
  const modalRoleNameInput = document.getElementById('modal-role-name');
  const modalRoleDescriptionInput = document.getElementById('modal-role-description');

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

  // User menu toggle (assuming similar structure)
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
  function openModal(role = null) {
    roleForm.reset(); // Clear form fields
    if (role) {
      // Edit mode
      modalTitle.textContent = 'Chỉnh sửa Loại người dùng';
      roleIdInput.value = role.MaLoai;
      modalRoleNameInput.value = role.TenLoai;
      modalRoleDescriptionInput.value = role.MoTa || '';
    } else {
      // Add mode
      modalTitle.textContent = 'Thêm Loại người dùng';
      roleIdInput.value = ''; // Ensure ID is empty for adding
    }
    roleModal.classList.remove('hidden');
  }

  function closeModal() {
    roleModal.classList.add('hidden');
    roleForm.reset();
  }

  if (addRoleBtn) {
    addRoleBtn.addEventListener('click', () => openModal());
  }
  if (closeRoleModalBtn) {
    closeRoleModalBtn.addEventListener('click', closeModal);
  }
  if (cancelRoleBtn) {
    cancelRoleBtn.addEventListener('click', closeModal);
  }
  // Close modal on outside click
  if (roleModal) {
    roleModal.addEventListener('click', (event) => {
      if (event.target === roleModal) {
        closeModal();
      }
    });
  }

  // --- Data Handling & Rendering ---

  // Function to render the table
  function renderTable() {
    rolesTableBody.innerHTML = ''; // Clear existing rows
    noDataPlaceholder.classList.add('hidden'); // Hide no data message initially

    if (currentRoles.length === 0) {
      noDataPlaceholder.classList.remove('hidden'); // Show if no data
      // Optionally clear pagination info or disable controls
      totalItemsCountSpan.textContent = 0;
      totalPagesCountSpan.textContent = 1;
      currentPageInput.value = 1;
      updatePaginationButtons();
      return;
    }

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const rolesToRender = currentRoles.slice(startIndex, endIndex);

    rolesToRender.forEach(role => {
      const row = document.createElement('tr');
      row.className = 'hover:bg-gray-50 transition-colors duration-150';

      row.innerHTML = `
        <td class="px-4 py-3 text-sm text-gray-700">${role.MaLoai}</td>
        <td class="px-4 py-3 text-sm font-medium text-gray-900">${role.TenLoai}</td>
        <td class="px-4 py-3 text-sm text-gray-600">${role.MoTa || 'N/A'}</td>
        <td class="px-4 py-3 text-right text-sm font-medium space-x-2">
          <button class="text-blue-600 hover:text-blue-800 edit-role-btn" data-id="${role.MaLoai}" title="Sửa">
            <i class="ri-pencil-line"></i>
          </button>
          <button class="text-red-600 hover:text-red-800 delete-role-btn" data-id="${role.MaLoai}" title="Xóa">
            <i class="ri-delete-bin-line"></i>
          </button>
        </td>
      `;
      rolesTableBody.appendChild(row);
    });

    // Add event listeners for edit/delete buttons
    rolesTableBody.querySelectorAll('.edit-role-btn').forEach(button => {
      button.addEventListener('click', handleEditRole);
    });
    rolesTableBody.querySelectorAll('.delete-role-btn').forEach(button => {
      button.addEventListener('click', handleDeleteRole);
    });

    updatePaginationInfo();
  }

  // Function to update pagination info (total items, total pages)
  function updatePaginationInfo() {
    totalPages = Math.ceil(currentRoles.length / itemsPerPage);
    if (totalPages < 1) totalPages = 1; // Ensure at least one page

    totalItemsCountSpan.textContent = currentRoles.length;
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

    currentRoles = allRoles.filter(role => {
      const nameMatch = !nameFilter || role.TenLoai.toLowerCase().includes(nameFilter);
      const descriptionMatch = !descriptionFilter || (role.MoTa && role.MoTa.toLowerCase().includes(descriptionFilter));
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
        applyFilters(); // Re-apply filters (which will show all roles)
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

  // Role form submission (Add/Edit)
  if (roleForm) {
    roleForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const id = roleIdInput.value;
      const name = modalRoleNameInput.value.trim();
      const description = modalRoleDescriptionInput.value.trim();

      if (!name) {
        // Basic validation
        alert('Vui lòng nhập Tên loại.');
        return;
      }

      const roleData = {
        TenLoai: name,
        MoTa: description || null, // Store null if empty
      };

      if (id) {
        // Edit existing role
        roleData.MaLoai = parseInt(id, 10);
        // Find index and update (in real app, send to server)
        const index = allRoles.findIndex(r => r.MaLoai === roleData.MaLoai);
        if (index !== -1) {
          allRoles[index] = { ...allRoles[index], ...roleData };
          console.log('Updated role:', allRoles[index]);
          alert('Cập nhật loại người dùng thành công!');
        } else {
            console.error('Role not found for editing');
            alert('Lỗi: Không tìm thấy loại người dùng để cập nhật.');
            return; // Stop if role not found
        }
      } else {
        // Add new role
        // Generate a temporary ID (in real app, server provides ID)
        roleData.MaLoai = allRoles.length > 0 ? Math.max(...allRoles.map(r => r.MaLoai)) + 1 : 1;
        allRoles.push(roleData);
        console.log('Added role:', roleData);
        alert('Thêm loại người dùng thành công!');
      }

      closeModal();
      applyFilters(); // Refresh the table to show changes
    });
  }

  // Handler for Edit Role button click
  function handleEditRole(event) {
    const button = event.target.closest('.edit-role-btn');
    const roleId = parseInt(button.dataset.id, 10);
    const roleToEdit = allRoles.find(role => role.MaLoai === roleId);
    if (roleToEdit) {
      openModal(roleToEdit);
    } else {
      console.error('Role not found for editing:', roleId);
      alert('Lỗi: Không tìm thấy loại người dùng để chỉnh sửa.');
    }
  }

  // Handler for Delete Role button click
  function handleDeleteRole(event) {
    const button = event.target.closest('.delete-role-btn');
    const roleId = parseInt(button.dataset.id, 10);
    const roleToDelete = allRoles.find(role => role.MaLoai === roleId);

    if (!roleToDelete) {
        console.error('Role not found for deletion:', roleId);
        alert('Lỗi: Không tìm thấy loại người dùng để xóa.');
        return;
    }

    // Confirmation dialog
    if (confirm(`Bạn có chắc chắn muốn xóa loại người dùng "${roleToDelete.TenLoai}" (ID: ${roleId}) không?`)) {
      // Find index and remove (in real app, send delete request to server)
      const index = allRoles.findIndex(r => r.MaLoai === roleId);
      if (index !== -1) {
        allRoles.splice(index, 1);
        console.log('Deleted role ID:', roleId);
        alert('Xóa loại người dùng thành công!');
        applyFilters(); // Refresh the table
      } else {
        console.error('Role index not found for deletion after confirmation:', roleId);
        alert('Lỗi: Không thể xóa loại người dùng.');
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
      alert('Đã tải lại danh sách loại người dùng.');
    });
  }

  // --- Initial Load ---
  itemsPerPage = parseInt(itemsPerPageSelect.value, 10);
  applyFilters(); // Apply default filters (none) and render initial data
}); 