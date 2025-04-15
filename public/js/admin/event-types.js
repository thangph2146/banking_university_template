document.addEventListener('DOMContentLoaded', () => {
  AOS.init({
    duration: 800,
    easing: 'ease-in-out',
    once: true
  });

  // --- Biến trạng thái ---
  let allEventTypes = []; // Lưu trữ tất cả dữ liệu loại sự kiện
  let currentEventTypes = []; // Lưu trữ dữ liệu loại sự kiện đã lọc và phân trang
  let currentPage = 1;
  let itemsPerPage = 10;
  let totalPages = 1;
  let currentEditEventTypeId = null; // Để theo dõi loại sự kiện đang được chỉnh sửa

  // --- Phần tử DOM ---
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
  const modalTitle = document.getElementById('modal-title');
  const eventTypeIdInput = document.getElementById('loai-su-kien-id');
  const eventTypeNameInput = document.getElementById('ten-loai-su-kien');
  const eventTypeCodeInput = document.getElementById('ma-loai-su-kien');

  const filterForm = document.getElementById('filter-form');
  const filterNameInput = document.getElementById('filter-name');
  const filterCodeInput = document.getElementById('filter-code');
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

  const loadingOverlay = document.getElementById('loading-overlay');
  const searchInput = document.getElementById('search-input');
  const statusFilter = document.getElementById('status-filter');
  
  const confirmDeleteModal = document.getElementById('confirm-delete-modal');
  const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
  const cancelDeleteBtn = document.getElementById('cancel-delete-btn');
  const deleteConfirmationText = document.getElementById('delete-confirmation-text');

  // --- Tạo dữ liệu mẫu Loại Sự kiện ---
  const generateSampleEventTypes = (count) => {
    const types = ['Hội thảo', 'Workshop', 'Talkshow', 'Cuộc thi', 'Triển lãm', 'Ngày hội', 'Khóa học', 'Hội nghị'];
    const codes = ['HOITHAO', 'WORKSHOP', 'TALKSHOW', 'CUOCTHI', 'TRIENLAM', 'NGAYHOI', 'KHOAHOC', 'HOINGHI'];
    const sampleData = [];

    for (let i = 1; i <= count; i++) {
      const typeIndex = Math.floor(Math.random() * types.length);
      const isActive = Math.random() > 0.3;
      const createdDate = new Date(Date.now() - Math.random() * 10000000000);
      const updatedDate = Math.random() > 0.5 ? new Date(createdDate.getTime() + Math.random() * 5000000000) : null;
      
      sampleData.push({
        loai_su_kien_id: i,
        ten_loai_su_kien: `${types[typeIndex]} ${String.fromCharCode(65 + Math.floor(Math.random() * 10))}`,
        ma_loai_su_kien: `${codes[typeIndex]}_${i}`,
        status: isActive ? 1 : 0,
        created_at: createdDate.toISOString(),
        updated_at: updatedDate ? updatedDate.toISOString() : null
      });
    }
    return sampleData;
  };

  // --- Tương tác UI ---
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
    eventTypeForm.reset(); // Xóa dữ liệu trước đó
    if (eventType) {
      modalTitle.textContent = 'Chỉnh sửa Loại Sự kiện';
      currentEditEventTypeId = eventType.loai_su_kien_id;
      eventTypeIdInput.value = eventType.loai_su_kien_id;
      eventTypeNameInput.value = eventType.ten_loai_su_kien || '';
      eventTypeCodeInput.value = eventType.ma_loai_su_kien || '';
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

  // --- Xử lý dữ liệu ---
  const applyFiltersAndPagination = () => {
    const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
    const statusValue = statusFilter ? statusFilter.value : 'all';
    
    currentEventTypes = allEventTypes.filter(eventType => {
      // Lọc theo từ khóa tìm kiếm
      const matchSearch = 
        eventType.ten_loai_su_kien.toLowerCase().includes(searchTerm) ||
        (eventType.ma_loai_su_kien && eventType.ma_loai_su_kien.toLowerCase().includes(searchTerm));
      
      // Lọc theo trạng thái
      const matchStatus = statusValue === 'all' || eventType.status.toString() === statusValue;
      
      return matchSearch && matchStatus;
    });
    
    // Tính toán tổng số trang
    totalPages = Math.ceil(currentEventTypes.length / itemsPerPage);
    if (totalPages < 1) totalPages = 1;
    if (currentPage > totalPages) currentPage = totalPages;
    if (currentPage < 1) currentPage = 1;
    
    // Cập nhật UI
    renderTable();
    updatePagination();
  };

  const renderTable = () => {
    eventTypesTableBody.innerHTML = ''; // Xóa các hàng hiện có

    if (currentEventTypes.length === 0) {
      noDataPlaceholder.classList.remove('hidden');
      return;
    }

    noDataPlaceholder.classList.add('hidden');

    // Tính dữ liệu cho trang hiện tại
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, currentEventTypes.length);
    const displayedEventTypes = currentEventTypes.slice(startIndex, endIndex);

    displayedEventTypes.forEach(type => {
      const row = document.createElement('tr');
      row.classList.add('hover:bg-gray-50');

      const codeDisplay = type.ma_loai_su_kien || '<i class="text-gray-400">Chưa có mã</i>';
      const statusDisplay = type.status === 1 
        ? '<span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Đang hoạt động</span>'
        : '<span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Không hoạt động</span>';

      row.innerHTML = `
        <td class="px-4 py-3 text-sm text-gray-700 font-medium">${type.loai_su_kien_id}</td>
        <td class="px-4 py-3 text-sm text-gray-900 font-medium">${type.ten_loai_su_kien}</td>
        <td class="px-4 py-3 text-sm text-gray-600">${codeDisplay}</td>
        <td class="px-4 py-3 text-sm">${statusDisplay}</td>
        <td class="px-4 py-3 text-sm text-gray-500">${formatDate(type.created_at)}</td>
        <td class="px-4 py-3 text-right text-sm font-medium space-x-1 whitespace-nowrap">
          <button class="btn-detail p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded" title="Chi tiết" data-id="${type.loai_su_kien_id}">
            <i class="ri-eye-line"></i>
          </button>
          <button class="btn-edit p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded" title="Sửa" data-id="${type.loai_su_kien_id}">
            <i class="ri-pencil-line"></i>
          </button>
          <button class="btn-delete p-1 text-red-600 hover:text-red-800 hover:bg-red-100 rounded" title="Xóa" data-id="${type.loai_su_kien_id}">
            <i class="ri-delete-bin-line"></i>
          </button>
        </td>
      `;

      // Thêm event listeners cho các nút hành động
      row.querySelector('.btn-detail').addEventListener('click', () => handleDetailEventType(type.loai_su_kien_id));
      row.querySelector('.btn-edit').addEventListener('click', () => handleEditEventType(type.loai_su_kien_id));
      row.querySelector('.btn-delete').addEventListener('click', () => openDeleteConfirmation(type.loai_su_kien_id, type.ten_loai_su_kien));

      eventTypesTableBody.appendChild(row);
    });
  };

  const updatePagination = () => {
    totalItemsCountEl.textContent = currentEventTypes.length;
    totalPagesCountEl.textContent = totalPages;
    currentPageInput.value = currentPage;
    currentPageInput.max = totalPages;

    // Bật/tắt các nút
    btnFirst.disabled = currentPage === 1;
    btnPrev.disabled = currentPage === 1;
    btnNext.disabled = currentPage === totalPages;
    btnLast.disabled = currentPage === totalPages;

    // Ẩn phân trang nếu chỉ có một trang
    if (totalPages <= 1) {
        paginationControls.classList.add('hidden');
    } else {
        paginationControls.classList.remove('hidden');
    }
  };

  const handleDetailEventType = (id) => {
    const typeToDetail = allEventTypes.find(t => t.loai_su_kien_id === id);
    if (typeToDetail) {
      window.location.href = `event-type-detail.html?id=${id}`;
    } else {
      console.error('Không tìm thấy loại sự kiện:', id);
      showToast('Không tìm thấy loại sự kiện để xem chi tiết.', 'error');
    }
  };

  const handleEditEventType = (id) => {
    const typeToEdit = allEventTypes.find(t => t.loai_su_kien_id === id);
    if (typeToEdit) {
      openEventTypeModal(typeToEdit);
    } else {
      console.error('Không tìm thấy loại sự kiện để chỉnh sửa:', id);
      showToast('Không tìm thấy loại sự kiện để chỉnh sửa.', 'error');
    }
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();

    const formData = new FormData(eventTypeForm);
    
    // Kiểm tra dữ liệu hợp lệ
    const eventTypeName = formData.get('ten-loai-su-kien').trim();
    if (!eventTypeName) {
      showToast('Vui lòng nhập Tên Loại Sự kiện.', 'error');
      return;
    }

    const eventTypeData = {
      loai_su_kien_id: currentEditEventTypeId ? parseInt(currentEditEventTypeId) : Date.now(), 
      ten_loai_su_kien: eventTypeName,
      ma_loai_su_kien: formData.get('ma-loai-su-kien').trim() || null,
      status: parseInt(formData.get('status')),
      updated_at: new Date().toISOString()
    };

    if (currentEditEventTypeId) {
      // Cập nhật loại sự kiện đã tồn tại
      const index = allEventTypes.findIndex(t => t.loai_su_kien_id === currentEditEventTypeId);
      if (index > -1) {
        // Giữ lại created_at từ bản ghi cũ
        eventTypeData.created_at = allEventTypes[index].created_at;
        allEventTypes[index] = eventTypeData;
        console.log('Loại sự kiện đã được cập nhật:', eventTypeData);
        showToast('Loại sự kiện đã được cập nhật thành công.', 'success');
      } else {
         console.error('Không tìm thấy loại sự kiện để cập nhật:', currentEditEventTypeId);
         showToast('Lỗi: Không tìm thấy loại sự kiện để cập nhật.', 'error');
      }
    } else {
      // Thêm loại sự kiện mới
      eventTypeData.created_at = new Date().toISOString();
      allEventTypes.unshift(eventTypeData);
      console.log('Đã thêm loại sự kiện mới:', eventTypeData);
      showToast('Loại sự kiện mới đã được thêm thành công.', 'success');
    }

    closeEventTypeModal();
    applyFiltersAndPagination();
  };

  // --- Xử lý sự kiện ---
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

  // Lọc
  filterForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      applyFiltersAndPagination();
  });

  resetFilterBtn?.addEventListener('click', () => {
      filterForm.reset();
      applyFiltersAndPagination();
  });

  // Phân trang
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
      loadEventTypes();
      showToast('Danh sách loại sự kiện đã được làm mới.', 'info');
  });

  // --- Chức năng bổ sung ---
  const loadEventTypes = () => {
    showLoading();

    // Mô phỏng API call để lấy dữ liệu
    setTimeout(() => {
      // Tạo dữ liệu mẫu
      allEventTypes = generateSampleEventTypes(15);
      
      // Cập nhật dữ liệu và hiển thị
      applyFiltersAndPagination();
      
      hideLoading();
    }, 800);
  };

  const showLoading = () => {
    loadingOverlay.classList.remove('hidden');
  };

  const hideLoading = () => {
    loadingOverlay.classList.add('hidden');
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Chưa có dữ liệu';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const openDeleteConfirmation = (id, name) => {
    currentEditEventTypeId = id;
    deleteConfirmationText.textContent = `Bạn có chắc chắn muốn xóa loại sự kiện "${name}" không? Hành động này không thể hoàn tác.`;
    confirmDeleteModal.classList.remove('hidden');
  };

  const closeDeleteConfirmation = () => {
    confirmDeleteModal.classList.add('hidden');
    currentEditEventTypeId = null;
  };

  const deleteEventType = () => {
    if (!currentEditEventTypeId) return;
    
    showLoading();
    
    // Mô phỏng API call để xóa
    setTimeout(() => {
      // Lọc ra loại sự kiện có ID khác với ID đã chọn
      allEventTypes = allEventTypes.filter(eventType => eventType.loai_su_kien_id != currentEditEventTypeId);
      
      // Cập nhật lại danh sách đã lọc
      applyFiltersAndPagination();
      
      // Hiển thị thông báo thành công
      showToast('Xóa loại sự kiện thành công', 'success');
      
      hideLoading();
      closeDeleteConfirmation();
    }, 800);
  };

  const showToast = (message, type = 'info') => {
    // Kiểm tra xem đã có toast container chưa
    let toastContainer = document.querySelector('.toast-container');
    
    if (!toastContainer) {
      toastContainer = document.createElement('div');
      toastContainer.className = 'toast-container fixed bottom-4 right-4 z-50';
      document.body.appendChild(toastContainer);
    }
    
    // Tạo toast
    const toast = document.createElement('div');
    toast.className = `flex items-center p-4 mb-3 max-w-md rounded-lg shadow-lg text-white ${type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500'} animate-fade-in`;
    
    // Icon
    const icon = type === 'success' ? 'ri-check-line' : type === 'error' ? 'ri-error-warning-line' : 'ri-information-line';
    
    // Nội dung toast
    toast.innerHTML = `
      <i class="${icon} text-xl mr-3"></i>
      <div class="text-sm font-normal">${message}</div>
      <button type="button" class="ml-auto text-white hover:text-gray-200 focus:outline-none">
        <i class="ri-close-line text-xl"></i>
      </button>
    `;
    
    // Thêm toast vào container
    toastContainer.appendChild(toast);
    
    // Xử lý đóng toast
    const closeBtn = toast.querySelector('button');
    closeBtn.addEventListener('click', () => {
      toast.classList.add('animate-fade-out');
      setTimeout(() => {
        toast.remove();
      }, 300);
    });
    
    // Tự động đóng sau 3 giây
    setTimeout(() => {
      if (toast) {
        toast.classList.add('animate-fade-out');
        setTimeout(() => {
          if (toast.parentNode) {
            toast.remove();
          }
        }, 300);
      }
    }, 3000);
  };

  // Tìm kiếm và bộ lọc
  searchInput?.addEventListener('input', applyFiltersAndPagination);
  statusFilter?.addEventListener('change', applyFiltersAndPagination);
  
  // Xác nhận xóa
  confirmDeleteBtn?.addEventListener('click', deleteEventType);
  cancelDeleteBtn?.addEventListener('click', closeDeleteConfirmation);

  // --- Khởi tạo ban đầu ---
  loadEventTypes();
});
