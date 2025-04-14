// Initialize AOS
AOS.init({
  duration: 800, // Animation duration
  once: true, // Whether animation should happen only once
});

document.addEventListener('DOMContentLoaded', function () {
  // State variables
  let allDepartments = []; // Stores all departments
  let currentDepartments = []; // Stores departments currently displayed
  let currentPage = 1;
  let itemsPerPage = 10;
  let totalPages = 1;

  // --- Sample Data (Based on phong_khoa table structure) ---
  allDepartments = [
    { MaPK: 1, TenPK: 'Công nghệ thông tin', MoTa: 'Đào tạo các chuyên ngành về máy tính và phần mềm.' },
    { MaPK: 2, TenPK: 'Quản trị kinh doanh', MoTa: 'Đào tạo về quản lý, marketing, tài chính.' },
    { MaPK: 3, TenPK: 'Kế toán - Kiểm toán', MoTa: 'Đào tạo chuyên sâu về kế toán và kiểm toán.' },
    { MaPK: 4, TenPK: 'Ngôn ngữ Anh', MoTa: 'Đào tạo về ngôn ngữ và văn hóa Anh - Mỹ.' },
    { MaPK: 5, TenPK: 'Luật', MoTa: 'Đào tạo các chuyên ngành luật học.' },
    { MaPK: 6, TenPK: 'Cơ khí chế tạo máy', MoTa: 'Đào tạo kỹ sư cơ khí.' },
    { MaPK: 7, TenPK: 'Điện - Điện tử', MoTa: 'Đào tạo kỹ sư điện, điện tử viễn thông.' },
    { MaPK: 8, TenPK: 'Kiến trúc', MoTa: 'Đào tạo kiến trúc sư.' },
    { MaPK: 9, TenPK: 'Môi trường', MoTa: 'Đào tạo về khoa học và kỹ thuật môi trường.' },
    { MaPK: 10, TenPK: 'Du lịch', MoTa: 'Đào tạo các nghiệp vụ du lịch, khách sạn.' }
    // Add more sample departments if needed
  ];

  // DOM Elements
  const sidebar = document.getElementById('sidebar');
  const sidebarBackdrop = document.getElementById('sidebar-backdrop');
  const sidebarOpenBtn = document.getElementById('sidebar-open');
  const sidebarCloseBtn = document.getElementById('sidebar-close');
  const userMenuButton = document.getElementById('user-menu-button');
  const userMenu = document.getElementById('user-menu');
  const departmentsTableBody = document.getElementById('departmentsTableBody');
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
  const departmentModal = document.getElementById('department-modal');
  const addDepartmentBtn = document.getElementById('add-department-btn');
  const closeDepartmentModalBtn = document.getElementById('close-department-modal');
  const cancelDepartmentBtn = document.getElementById('cancel-department');
  const departmentForm = document.getElementById('department-form');
  const modalTitle = document.getElementById('modal-title');
  const departmentIdInput = document.getElementById('department-id');
  const modalDepartmentNameInput = document.getElementById('modal-department-name');
  const modalDepartmentDescriptionInput = document.getElementById('modal-department-description');

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
  function openModal(department = null) {
    departmentForm.reset();
    if (department) {
      // Edit mode
      modalTitle.textContent = 'Chỉnh sửa Phòng khoa';
      departmentIdInput.value = department.MaPK;
      modalDepartmentNameInput.value = department.TenPK;
      modalDepartmentDescriptionInput.value = department.MoTa || '';
    } else {
      // Add mode
      modalTitle.textContent = 'Thêm Phòng khoa mới';
      departmentIdInput.value = '';
    }
    departmentModal.classList.remove('hidden');
  }

  function closeModal() {
    departmentModal.classList.add('hidden');
    departmentForm.reset();
  }

  if (addDepartmentBtn) {
    addDepartmentBtn.addEventListener('click', () => openModal());
  }
  if (closeDepartmentModalBtn) {
    closeDepartmentModalBtn.addEventListener('click', closeModal);
  }
  if (cancelDepartmentBtn) {
    cancelDepartmentBtn.addEventListener('click', closeModal);
  }
  if (departmentModal) {
    departmentModal.addEventListener('click', (event) => {
      if (event.target === departmentModal) {
        closeModal();
      }
    });
  }

  // --- Data Handling & Rendering ---

  function renderTable() {
    departmentsTableBody.innerHTML = '';
    noDataPlaceholder.classList.add('hidden');

    if (currentDepartments.length === 0) {
      noDataPlaceholder.classList.remove('hidden');
      totalItemsCountSpan.textContent = 0;
      totalPagesCountSpan.textContent = 1;
      currentPageInput.value = 1;
      updatePaginationButtons();
      return;
    }

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const departmentsToRender = currentDepartments.slice(startIndex, endIndex);

    departmentsToRender.forEach(dept => {
      const row = document.createElement('tr');
      row.className = 'hover:bg-gray-50 transition-colors duration-150';

      row.innerHTML = `
        <td class="px-4 py-3 text-sm text-gray-700">${dept.MaPK}</td>
        <td class="px-4 py-3 text-sm font-medium text-gray-900">${dept.TenPK}</td>
        <td class="px-4 py-3 text-sm text-gray-600">${dept.MoTa || 'N/A'}</td>
        <td class="px-4 py-3 text-right text-sm font-medium space-x-2">
          <button class="text-blue-600 hover:text-blue-800 edit-department-btn" data-id="${dept.MaPK}" title="Sửa">
            <i class="ri-pencil-line"></i>
          </button>
          <button class="text-red-600 hover:text-red-800 delete-department-btn" data-id="${dept.MaPK}" title="Xóa">
            <i class="ri-delete-bin-line"></i>
          </button>
        </td>
      `;
      departmentsTableBody.appendChild(row);
    });

    departmentsTableBody.querySelectorAll('.edit-department-btn').forEach(button => {
      button.addEventListener('click', handleEditDepartment);
    });
    departmentsTableBody.querySelectorAll('.delete-department-btn').forEach(button => {
      button.addEventListener('click', handleDeleteDepartment);
    });

    updatePaginationInfo();
  }

  function updatePaginationInfo() {
    totalPages = Math.ceil(currentDepartments.length / itemsPerPage);
    if (totalPages < 1) totalPages = 1;

    totalItemsCountSpan.textContent = currentDepartments.length;
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
    const descriptionFilter = filterDescriptionInput.value.toLowerCase().trim();

    currentDepartments = allDepartments.filter(dept => {
      const nameMatch = !nameFilter || dept.TenPK.toLowerCase().includes(nameFilter);
      const descriptionMatch = !descriptionFilter || (dept.MoTa && dept.MoTa.toLowerCase().includes(descriptionFilter));
      return nameMatch && descriptionMatch;
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

  if (departmentForm) {
    departmentForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const id = departmentIdInput.value;
      const name = modalDepartmentNameInput.value.trim();
      const description = modalDepartmentDescriptionInput.value.trim();

      if (!name) {
        alert('Vui lòng nhập Tên Phòng khoa.');
        return;
      }

      const departmentData = {
        TenPK: name,
        MoTa: description || null,
      };

      if (id) {
        departmentData.MaPK = parseInt(id, 10);
        const index = allDepartments.findIndex(d => d.MaPK === departmentData.MaPK);
        if (index !== -1) {
          allDepartments[index] = { ...allDepartments[index], ...departmentData };
          console.log('Updated department:', allDepartments[index]);
          alert('Cập nhật phòng khoa thành công!');
        } else {
            console.error('Department not found for editing');
            alert('Lỗi: Không tìm thấy phòng khoa để cập nhật.');
            return;
        }
      } else {
        departmentData.MaPK = allDepartments.length > 0 ? Math.max(...allDepartments.map(d => d.MaPK)) + 1 : 1;
        allDepartments.push(departmentData);
        console.log('Added department:', departmentData);
        alert('Thêm phòng khoa thành công!');
      }
      closeModal();
      applyFilters();
    });
  }

  function handleEditDepartment(event) {
    const button = event.target.closest('.edit-department-btn');
    const departmentId = parseInt(button.dataset.id, 10);
    const departmentToEdit = allDepartments.find(dept => dept.MaPK === departmentId);
    if (departmentToEdit) {
      openModal(departmentToEdit);
    } else {
      console.error('Department not found for editing:', departmentId);
      alert('Lỗi: Không tìm thấy phòng khoa để chỉnh sửa.');
    }
  }

  function handleDeleteDepartment(event) {
    const button = event.target.closest('.delete-department-btn');
    const departmentId = parseInt(button.dataset.id, 10);
    const departmentToDelete = allDepartments.find(dept => dept.MaPK === departmentId);

    if (!departmentToDelete) {
        console.error('Department not found for deletion:', departmentId);
        alert('Lỗi: Không tìm thấy phòng khoa để xóa.');
        return;
    }

    if (confirm(`Bạn có chắc chắn muốn xóa phòng khoa "${departmentToDelete.TenPK}" (ID: ${departmentId}) không?`)) {
      const index = allDepartments.findIndex(d => d.MaPK === departmentId);
      if (index !== -1) {
        allDepartments.splice(index, 1);
        console.log('Deleted department ID:', departmentId);
        alert('Xóa phòng khoa thành công!');
        applyFilters();
      } else {
        console.error('Department index not found for deletion after confirmation:', departmentId);
        alert('Lỗi: Không thể xóa phòng khoa.');
      }
    }
  }

  const refreshBtn = document.getElementById('refresh-btn');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', () => {
      filterForm.reset();
      applyFilters();
      alert('Đã tải lại danh sách phòng khoa.');
    });
  }

  // --- Initial Load ---
  itemsPerPage = parseInt(itemsPerPageSelect.value, 10);
  applyFilters(); // Apply default filters (none) and render initial data
}); 