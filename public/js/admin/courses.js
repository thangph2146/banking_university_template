// Initialize AOS
AOS.init({
  duration: 800, // Animation duration
  once: true, // Whether animation should happen only once
});

document.addEventListener('DOMContentLoaded', function () {
  // State variables
  let allCourses = []; // Stores all courses
  let currentCourses = []; // Stores courses currently displayed
  let currentPage = 1;
  let itemsPerPage = 10;
  let totalPages = 1;

  // --- Sample Data (Based on khoa_hoc table structure) ---
  allCourses = [
    { MaKH: 1, TenKH: 'K64', MoTaKH: 'Khóa tuyển sinh năm 2023' },
    { MaKH: 2, TenKH: 'K63', MoTaKH: 'Khóa tuyển sinh năm 2022' },
    { MaKH: 3, TenKH: 'K62', MoTaKH: 'Khóa tuyển sinh năm 2021' },
    { MaKH: 4, TenKH: 'K61', MoTaKH: 'Khóa tuyển sinh năm 2020' },
    { MaKH: 5, TenKH: 'K60', MoTaKH: 'Khóa tuyển sinh năm 2019' },
    { MaKH: 6, TenKH: 'K59', MoTaKH: 'Khóa tuyển sinh năm 2018' },
    { MaKH: 7, TenKH: 'K58', MoTaKH: 'Khóa tuyển sinh năm 2017' },
    { MaKH: 8, TenKH: 'K57', MoTaKH: 'Khóa tuyển sinh năm 2016' },
    { MaKH: 9, TenKH: 'K56', MoTaKH: 'Khóa tuyển sinh năm 2015' },
    { MaKH: 10, TenKH: 'K55', MoTaKH: 'Khóa tuyển sinh năm 2014' }
    // Add more sample courses if needed
  ];

  // DOM Elements
  const sidebar = document.getElementById('sidebar');
  const sidebarBackdrop = document.getElementById('sidebar-backdrop');
  const sidebarOpenBtn = document.getElementById('sidebar-open');
  const sidebarCloseBtn = document.getElementById('sidebar-close');
  const userMenuButton = document.getElementById('user-menu-button');
  const userMenu = document.getElementById('user-menu');
  const coursesTableBody = document.getElementById('coursesTableBody');
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
  const courseModal = document.getElementById('course-modal');
  const addCourseBtn = document.getElementById('add-course-btn');
  const closeCourseModalBtn = document.getElementById('close-course-modal');
  const cancelCourseBtn = document.getElementById('cancel-course');
  const courseForm = document.getElementById('course-form');
  const modalTitle = document.getElementById('modal-title');
  const courseIdInput = document.getElementById('course-id');
  const modalCourseNameInput = document.getElementById('modal-course-name');
  const modalCourseDescriptionInput = document.getElementById('modal-course-description');

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
  function openModal(course = null) {
    courseForm.reset();
    if (course) {
      // Edit mode
      modalTitle.textContent = 'Chỉnh sửa Khoá học';
      courseIdInput.value = course.MaKH;
      modalCourseNameInput.value = course.TenKH;
      modalCourseDescriptionInput.value = course.MoTaKH || '';
    } else {
      // Add mode
      modalTitle.textContent = 'Thêm Khoá học mới';
      courseIdInput.value = '';
    }
    courseModal.classList.remove('hidden');
  }

  function closeModal() {
    courseModal.classList.add('hidden');
    courseForm.reset();
  }

  if (addCourseBtn) {
    addCourseBtn.addEventListener('click', () => openModal());
  }
  if (closeCourseModalBtn) {
    closeCourseModalBtn.addEventListener('click', closeModal);
  }
  if (cancelCourseBtn) {
    cancelCourseBtn.addEventListener('click', closeModal);
  }
  if (courseModal) {
    courseModal.addEventListener('click', (event) => {
      if (event.target === courseModal) {
        closeModal();
      }
    });
  }

  // --- Data Handling & Rendering ---

  function renderTable() {
    coursesTableBody.innerHTML = '';
    noDataPlaceholder.classList.add('hidden');

    if (currentCourses.length === 0) {
      noDataPlaceholder.classList.remove('hidden');
      totalItemsCountSpan.textContent = 0;
      totalPagesCountSpan.textContent = 1;
      currentPageInput.value = 1;
      updatePaginationButtons();
      return;
    }

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const coursesToRender = currentCourses.slice(startIndex, endIndex);

    coursesToRender.forEach(course => {
      const row = document.createElement('tr');
      row.className = 'hover:bg-gray-50 transition-colors duration-150';

      row.innerHTML = `
        <td class="px-4 py-3 text-sm text-gray-700">${course.MaKH}</td>
        <td class="px-4 py-3 text-sm font-medium text-gray-900">${course.TenKH}</td>
        <td class="px-4 py-3 text-sm text-gray-600">${course.MoTaKH || 'N/A'}</td>
        <td class="px-4 py-3 text-right text-sm font-medium space-x-2">
          <button class="text-blue-600 hover:text-blue-800 edit-course-btn" data-id="${course.MaKH}" title="Sửa">
            <i class="ri-pencil-line"></i>
          </button>
          <button class="text-red-600 hover:text-red-800 delete-course-btn" data-id="${course.MaKH}" title="Xóa">
            <i class="ri-delete-bin-line"></i>
          </button>
        </td>
      `;
      coursesTableBody.appendChild(row);
    });

    coursesTableBody.querySelectorAll('.edit-course-btn').forEach(button => {
      button.addEventListener('click', handleEditCourse);
    });
    coursesTableBody.querySelectorAll('.delete-course-btn').forEach(button => {
      button.addEventListener('click', handleDeleteCourse);
    });

    updatePaginationInfo();
  }

  function updatePaginationInfo() {
    totalPages = Math.ceil(currentCourses.length / itemsPerPage);
    if (totalPages < 1) totalPages = 1;

    totalItemsCountSpan.textContent = currentCourses.length;
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

    currentCourses = allCourses.filter(course => {
      const nameMatch = !nameFilter || course.TenKH.toLowerCase().includes(nameFilter);
      const descriptionMatch = !descriptionFilter || (course.MoTaKH && course.MoTaKH.toLowerCase().includes(descriptionFilter));
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

  if (courseForm) {
    courseForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const id = courseIdInput.value;
      const name = modalCourseNameInput.value.trim();
      const description = modalCourseDescriptionInput.value.trim();

      if (!name) {
        alert('Vui lòng nhập Tên Khoá học.');
        return;
      }

      const courseData = {
        TenKH: name,
        MoTaKH: description || null,
      };

      if (id) {
        courseData.MaKH = parseInt(id, 10);
        const index = allCourses.findIndex(c => c.MaKH === courseData.MaKH);
        if (index !== -1) {
          allCourses[index] = { ...allCourses[index], ...courseData };
          console.log('Updated course:', allCourses[index]);
          alert('Cập nhật khoá học thành công!');
        } else {
            console.error('Course not found for editing');
            alert('Lỗi: Không tìm thấy khoá học để cập nhật.');
            return;
        }
      } else {
        courseData.MaKH = allCourses.length > 0 ? Math.max(...allCourses.map(c => c.MaKH)) + 1 : 1;
        allCourses.push(courseData);
        console.log('Added course:', courseData);
        alert('Thêm khoá học thành công!');
      }
      closeModal();
      applyFilters();
    });
  }

  function handleEditCourse(event) {
    const button = event.target.closest('.edit-course-btn');
    const courseId = parseInt(button.dataset.id, 10);
    const courseToEdit = allCourses.find(course => course.MaKH === courseId);
    if (courseToEdit) {
      openModal(courseToEdit);
    } else {
      console.error('Course not found for editing:', courseId);
      alert('Lỗi: Không tìm thấy khoá học để chỉnh sửa.');
    }
  }

  function handleDeleteCourse(event) {
    const button = event.target.closest('.delete-course-btn');
    const courseId = parseInt(button.dataset.id, 10);
    const courseToDelete = allCourses.find(course => course.MaKH === courseId);

    if (!courseToDelete) {
        console.error('Course not found for deletion:', courseId);
        alert('Lỗi: Không tìm thấy khoá học để xóa.');
        return;
    }

    if (confirm(`Bạn có chắc chắn muốn xóa khoá học "${courseToDelete.TenKH}" (ID: ${courseId}) không?`)) {
      const index = allCourses.findIndex(c => c.MaKH === courseId);
      if (index !== -1) {
        allCourses.splice(index, 1);
        console.log('Deleted course ID:', courseId);
        alert('Xóa khoá học thành công!');
        applyFilters();
      } else {
        console.error('Course index not found for deletion after confirmation:', courseId);
        alert('Lỗi: Không thể xóa khoá học.');
      }
    }
  }

  const refreshBtn = document.getElementById('refresh-btn');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', () => {
      filterForm.reset();
      applyFilters();
      alert('Đã tải lại danh sách khoá học.');
    });
  }

  // --- Initial Load ---
  itemsPerPage = parseInt(itemsPerPageSelect.value, 10);
  applyFilters(); // Apply default filters (none) and render initial data
}); 