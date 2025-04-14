// Initialize AOS
AOS.init({
  duration: 800, // Animation duration
  once: true, // Whether animation should happen only once
});

document.addEventListener('DOMContentLoaded', function () {
  // State variables
  let allMajors = []; // Stores all majors (he_dao_tao)
  let currentMajors = []; // Stores majors currently displayed
  let currentPage = 1;
  let itemsPerPage = 10;
  let totalPages = 1;

  // --- Sample Data (Based on he_dao_tao table structure) ---
  allMajors = [
    { MaHDT: 1, TenHDT: 'Chính quy', MoTa: 'Hệ đào tạo tập trung toàn thời gian.' },
    { MaHDT: 2, TenHDT: 'Tại chức (Vừa làm vừa học)', MoTa: 'Hệ đào tạo dành cho người đi làm.' },
    { MaHDT: 3, TenHDT: 'Từ xa', MoTa: 'Hệ đào tạo trực tuyến.' },
    { MaHDT: 4, TenHDT: 'Liên thông', MoTa: 'Hệ đào tạo liên thông từ bậc thấp lên bậc cao.' },
    { MaHDT: 5, TenHDT: 'Văn bằng 2', MoTa: 'Hệ đào tạo cấp bằng đại học thứ hai.' },
    { MaHDT: 6, TenHDT: 'Chất lượng cao', MoTa: 'Chương trình đào tạo tăng cường ngoại ngữ và kỹ năng.' },
    { MaHDT: 7, TenHDT: 'Tiên tiến', MoTa: 'Chương trình đào tạo theo chuẩn quốc tế.' },
    { MaHDT: 8, TenHDT: 'Song bằng', MoTa: 'Chương trình đào tạo cấp hai bằng cùng lúc.' },
    { MaHDT: 9, TenHDT: 'Đào tạo theo địa chỉ', MoTa: 'Đào tạo theo yêu cầu của doanh nghiệp/địa phương.' },
    { MaHDT: 10, TenHDT: 'Dự bị đại học', MoTa: 'Chương trình chuẩn bị kiến thức cho sinh viên trước khi vào đại học.' }
    // Add more sample majors if needed
  ];

  // DOM Elements
  const sidebar = document.getElementById('sidebar');
  const sidebarBackdrop = document.getElementById('sidebar-backdrop');
  const sidebarOpenBtn = document.getElementById('sidebar-open');
  const sidebarCloseBtn = document.getElementById('sidebar-close');
  const userMenuButton = document.getElementById('user-menu-button');
  const userMenu = document.getElementById('user-menu');
  const majorsTableBody = document.getElementById('majorsTableBody');
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
  const majorModal = document.getElementById('major-modal');
  const addMajorBtn = document.getElementById('add-major-btn');
  const closeMajorModalBtn = document.getElementById('close-major-modal');
  const cancelMajorBtn = document.getElementById('cancel-major');
  const majorForm = document.getElementById('major-form');
  const modalTitle = document.getElementById('modal-title');
  const majorIdInput = document.getElementById('major-id');
  const modalMajorNameInput = document.getElementById('modal-major-name');
  const modalMajorDescriptionInput = document.getElementById('modal-major-description');

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
  function openModal(major = null) {
    majorForm.reset();
    if (major) {
      // Edit mode
      modalTitle.textContent = 'Chỉnh sửa Ngành đào tạo';
      majorIdInput.value = major.MaHDT;
      modalMajorNameInput.value = major.TenHDT;
      modalMajorDescriptionInput.value = major.MoTa || '';
    } else {
      // Add mode
      modalTitle.textContent = 'Thêm Ngành mới';
      majorIdInput.value = '';
    }
    majorModal.classList.remove('hidden');
  }

  function closeModal() {
    majorModal.classList.add('hidden');
    majorForm.reset();
  }

  if (addMajorBtn) {
    addMajorBtn.addEventListener('click', () => openModal());
  }
  if (closeMajorModalBtn) {
    closeMajorModalBtn.addEventListener('click', closeModal);
  }
  if (cancelMajorBtn) {
    cancelMajorBtn.addEventListener('click', closeModal);
  }
  if (majorModal) {
    majorModal.addEventListener('click', (event) => {
      if (event.target === majorModal) {
        closeModal();
      }
    });
  }

  // --- Data Handling & Rendering ---

  function renderTable() {
    majorsTableBody.innerHTML = '';
    noDataPlaceholder.classList.add('hidden');

    if (currentMajors.length === 0) {
      noDataPlaceholder.classList.remove('hidden');
      totalItemsCountSpan.textContent = 0;
      totalPagesCountSpan.textContent = 1;
      currentPageInput.value = 1;
      updatePaginationButtons();
      return;
    }

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const majorsToRender = currentMajors.slice(startIndex, endIndex);

    majorsToRender.forEach(major => {
      const row = document.createElement('tr');
      row.className = 'hover:bg-gray-50 transition-colors duration-150';

      row.innerHTML = `
        <td class="px-4 py-3 text-sm text-gray-700">${major.MaHDT}</td>
        <td class="px-4 py-3 text-sm font-medium text-gray-900">${major.TenHDT}</td>
        <td class="px-4 py-3 text-sm text-gray-600">${major.MoTa || 'N/A'}</td>
        <td class="px-4 py-3 text-right text-sm font-medium space-x-2">
          <button class="text-blue-600 hover:text-blue-800 edit-major-btn" data-id="${major.MaHDT}" title="Sửa">
            <i class="ri-pencil-line"></i>
          </button>
          <button class="text-red-600 hover:text-red-800 delete-major-btn" data-id="${major.MaHDT}" title="Xóa">
            <i class="ri-delete-bin-line"></i>
          </button>
        </td>
      `;
      majorsTableBody.appendChild(row);
    });

    majorsTableBody.querySelectorAll('.edit-major-btn').forEach(button => {
      button.addEventListener('click', handleEditMajor);
    });
    majorsTableBody.querySelectorAll('.delete-major-btn').forEach(button => {
      button.addEventListener('click', handleDeleteMajor);
    });

    updatePaginationInfo();
  }

  function updatePaginationInfo() {
    totalPages = Math.ceil(currentMajors.length / itemsPerPage);
    if (totalPages < 1) totalPages = 1;

    totalItemsCountSpan.textContent = currentMajors.length;
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

    currentMajors = allMajors.filter(major => {
      const nameMatch = !nameFilter || major.TenHDT.toLowerCase().includes(nameFilter);
      const descriptionMatch = !descriptionFilter || (major.MoTa && major.MoTa.toLowerCase().includes(descriptionFilter));
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

  if (majorForm) {
    majorForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const id = majorIdInput.value;
      const name = modalMajorNameInput.value.trim();
      const description = modalMajorDescriptionInput.value.trim();

      if (!name) {
        alert('Vui lòng nhập Tên Ngành.');
        return;
      }

      const majorData = {
        TenHDT: name,
        MoTa: description || null,
      };

      if (id) {
        majorData.MaHDT = parseInt(id, 10);
        const index = allMajors.findIndex(m => m.MaHDT === majorData.MaHDT);
        if (index !== -1) {
          allMajors[index] = { ...allMajors[index], ...majorData };
          console.log('Updated major:', allMajors[index]);
          alert('Cập nhật ngành đào tạo thành công!');
        } else {
            console.error('Major not found for editing');
            alert('Lỗi: Không tìm thấy ngành đào tạo để cập nhật.');
            return;
        }
      } else {
        majorData.MaHDT = allMajors.length > 0 ? Math.max(...allMajors.map(m => m.MaHDT)) + 1 : 1;
        allMajors.push(majorData);
        console.log('Added major:', majorData);
        alert('Thêm ngành đào tạo thành công!');
      }
      closeModal();
      applyFilters();
    });
  }

  function handleEditMajor(event) {
    const button = event.target.closest('.edit-major-btn');
    const majorId = parseInt(button.dataset.id, 10);
    const majorToEdit = allMajors.find(major => major.MaHDT === majorId);
    if (majorToEdit) {
      openModal(majorToEdit);
    } else {
      console.error('Major not found for editing:', majorId);
      alert('Lỗi: Không tìm thấy ngành đào tạo để chỉnh sửa.');
    }
  }

  function handleDeleteMajor(event) {
    const button = event.target.closest('.delete-major-btn');
    const majorId = parseInt(button.dataset.id, 10);
    const majorToDelete = allMajors.find(major => major.MaHDT === majorId);

    if (!majorToDelete) {
        console.error('Major not found for deletion:', majorId);
        alert('Lỗi: Không tìm thấy ngành đào tạo để xóa.');
        return;
    }

    if (confirm(`Bạn có chắc chắn muốn xóa ngành "${majorToDelete.TenHDT}" (ID: ${majorId}) không?`)) {
      const index = allMajors.findIndex(m => m.MaHDT === majorId);
      if (index !== -1) {
        allMajors.splice(index, 1);
        console.log('Deleted major ID:', majorId);
        alert('Xóa ngành đào tạo thành công!');
        applyFilters();
      } else {
        console.error('Major index not found for deletion after confirmation:', majorId);
        alert('Lỗi: Không thể xóa ngành đào tạo.');
      }
    }
  }

  const refreshBtn = document.getElementById('refresh-btn');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', () => {
      filterForm.reset();
      applyFilters();
      alert('Đã tải lại danh sách ngành đào tạo.');
    });
  }

  // --- Initial Load ---
  itemsPerPage = parseInt(itemsPerPageSelect.value, 10);
  applyFilters(); // Apply default filters (none) and render initial data
}); 