document.addEventListener('DOMContentLoaded', function () {
  // Khởi tạo AOS animation
  AOS.init();

  // Lưu trữ tất cả dữ liệu loại sự kiện
  let allEventTypes = [];

  // Biến quản lý phân trang
  let currentPage = 1;
  let itemsPerPage = 10;
  let totalPages = 1;
  let filteredEventTypes = [];

  // DOM Elements - Sửa lại các selector để khớp với HTML
  const sidebar = document.getElementById('sidebar');
  const sidebarOverlay = document.getElementById('sidebar-backdrop');
  const sidebarOpen = document.getElementById('sidebar-open');
  const sidebarClose = document.getElementById('sidebar-close');
  const userMenu = document.getElementById('user-menu');
  const userMenuBtn = document.getElementById('user-menu-button');
  const filterForm = document.getElementById('filter-form');
  const resetFilterBtn = document.getElementById('reset-filter-btn');
  const searchInput = document.getElementById('search-input');
  const eventTypesTable = document.getElementById('event-types-table');
  const eventTypesTableBody = document.getElementById('eventTypesTableBody');
  const noDataPlaceholder = document.getElementById('no-data-placeholder');
  const itemsPerPageSelect = document.getElementById('items-per-page');
  const currentPageInput = document.getElementById('current-page-input');
  const totalPagesCount = document.getElementById('total-pages-count');
  const totalItemsCount = document.getElementById('total-items-count');
  const firstPageBtn = document.querySelector('.btn-first');
  const prevPageBtn = document.querySelector('.btn-prev');
  const nextPageBtn = document.querySelector('.btn-next');
  const lastPageBtn = document.querySelector('.btn-last');
  const deleteModal = document.getElementById('confirm-delete-modal');
  const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
  const cancelDeleteBtn = document.getElementById('cancel-delete-btn');
  const loadingOverlay = document.getElementById('loading-overlay');
  const filterName = document.getElementById('filter-name');
  const filterCode = document.getElementById('filter-code');
  const statusFilter = document.getElementById('status-filter');
  const applyFilterBtn = document.getElementById('apply-filter-btn');

  // DOM Elements cho modal thêm/chỉnh sửa loại sự kiện
  const addEventTypeBtn = document.getElementById('add-event-type-btn');
  const eventTypeModal = document.getElementById('event-type-modal');
  const eventTypeForm = document.getElementById('event-type-form');
  const eventTypeModalTitle = document.getElementById('event-type-modal-title');
  const eventTypeNameInput = document.getElementById('event-type-name');
  const eventTypeCodeInput = document.getElementById('event-type-code');
  const eventTypeStatusSelect = document.getElementById('event-type-status');
  const saveEventTypeBtn = document.getElementById('save-event-type-btn');
  const closeEventTypeModalBtn = document.getElementById('close-event-type-modal');

  // Tạo mẫu dữ liệu cho thử nghiệm
  function generateSampleEventTypes() {
    const types = [
      { loai_su_kien_id: 1, ten_loai_su_kien: 'Hội thảo', ma_loai_su_kien: 'HT', status: 1, created_at: '2023-05-15 09:30:00' },
      { loai_su_kien_id: 2, ten_loai_su_kien: 'Hội nghị', ma_loai_su_kien: 'HN', status: 1, created_at: '2023-05-16 10:15:00' },
      { loai_su_kien_id: 3, ten_loai_su_kien: 'Tập huấn', ma_loai_su_kien: 'TH', status: 1, created_at: '2023-05-17 08:45:00' },
      { loai_su_kien_id: 4, ten_loai_su_kien: 'Workshop', ma_loai_su_kien: 'WS', status: 1, created_at: '2023-05-18 14:00:00' },
      { loai_su_kien_id: 5, ten_loai_su_kien: 'Triển lãm', ma_loai_su_kien: 'TL', status: 0, created_at: '2023-05-19 11:30:00' },
      { loai_su_kien_id: 6, ten_loai_su_kien: 'Lễ kỷ niệm', ma_loai_su_kien: 'LKN', status: 1, created_at: '2023-05-20 13:15:00' },
      { loai_su_kien_id: 7, ten_loai_su_kien: 'Tọa đàm', ma_loai_su_kien: 'TD', status: 1, created_at: '2023-05-21 09:00:00' },
      { loai_su_kien_id: 8, ten_loai_su_kien: 'Khai trương', ma_loai_su_kien: 'KT', status: 0, created_at: '2023-05-22 10:45:00' },
      { loai_su_kien_id: 9, ten_loai_su_kien: 'Lễ trao giải', ma_loai_su_kien: 'LTG', status: 1, created_at: '2023-05-23 16:30:00' },
      { loai_su_kien_id: 10, ten_loai_su_kien: 'Ngày hội', ma_loai_su_kien: 'NH', status: 1, created_at: '2023-05-24 08:15:00' },
      { loai_su_kien_id: 11, ten_loai_su_kien: 'Lễ khai giảng', ma_loai_su_kien: 'LKG', status: 1, created_at: '2023-05-25 07:30:00' },
      { loai_su_kien_id: 12, ten_loai_su_kien: 'Lễ tốt nghiệp', ma_loai_su_kien: 'LTN', status: 0, created_at: '2023-05-26 15:45:00' }
    ];
    return types;
  }

  // Load data và khởi tạo giao diện
  function init() {
    // Trong thực tế sẽ gọi API để lấy dữ liệu
    allEventTypes = generateSampleEventTypes();
    filteredEventTypes = [...allEventTypes];

    // Cập nhật số lượng trang và tổng số items
    updatePagination();
    totalItemsCount.textContent = allEventTypes.length;

    // Hiển thị dữ liệu
    renderTable();

    // Ẩn loading overlay
    loadingOverlay.classList.add('hidden');
  }

  // UI interaction functions
  function toggleSidebar() {
    sidebar.classList.toggle('-translate-x-full');
    sidebarOverlay.classList.toggle('hidden');
  }

  function toggleUserMenu() {
    userMenu.classList.toggle('hidden');
  }

  // Hàm áp dụng filter và phân trang
  function applyFiltersAndPagination() {
    const nameFilter = filterName.value.toLowerCase();
    const codeFilter = filterCode.value.toLowerCase();
    const statusFilterValue = statusFilter.value;

    filteredEventTypes = allEventTypes.filter(eventType => {
      // Lọc theo tên
      if (nameFilter && !eventType.ten_loai_su_kien.toLowerCase().includes(nameFilter)) {
        return false;
      }

      // Lọc theo mã
      if (codeFilter && !eventType.ma_loai_su_kien.toLowerCase().includes(codeFilter)) {
        return false;
      }

      // Lọc theo trạng thái (all, 1, 0)
      if (statusFilterValue !== 'all' && eventType.status.toString() !== statusFilterValue) {
        return false;
      }

      // Lọc theo search input (tìm kiếm trong cả tên và mã)
      const searchValue = searchInput.value.toLowerCase();
      if (searchValue && !eventType.ten_loai_su_kien.toLowerCase().includes(searchValue) &&
        !eventType.ma_loai_su_kien.toLowerCase().includes(searchValue)) {
        return false;
      }

      return true;
    });

    // Reset về trang đầu tiên sau khi lọc
    currentPage = 1;
    currentPageInput.value = 1;

    // Cập nhật phân trang và hiển thị dữ liệu
    updatePagination();
    renderTable();
  }

  // Hàm để hiển thị dữ liệu vào bảng
  function renderTable() {
    // Xóa nội dung cũ
    eventTypesTableBody.innerHTML = '';

    // Tính toán vị trí bắt đầu và kết thúc cho trang hiện tại
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, filteredEventTypes.length);

    // Kiểm tra nếu không có dữ liệu
    if (filteredEventTypes.length === 0) {
      noDataPlaceholder.classList.remove('hidden');
      return;
    }

    // Có dữ liệu, ẩn thông báo không có dữ liệu
    noDataPlaceholder.classList.add('hidden');

    // Tạo hàng cho mỗi loại sự kiện
    for (let i = startIndex; i < endIndex; i++) {
      const eventType = filteredEventTypes[i];
      const row = document.createElement('tr');

      // Format ngày tạo
      const createdAt = new Date(eventType.created_at);
      const formattedDate = createdAt.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });

      // Tạo HTML cho hàng
      row.className = 'hover:bg-gray-50 transition-colors duration-200';
      row.innerHTML = `
				<td class="py-3 px-4 border-b">${eventType.loai_su_kien_id}</td>
				<td class="py-3 px-4 border-b">${eventType.ten_loai_su_kien}</td>
				<td class="py-3 px-4 border-b">${eventType.ma_loai_su_kien}</td>
				<td class="py-3 px-4 border-b">
					<span class="inline-block px-2 py-1 rounded-full text-xs font-medium ${eventType.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
						${eventType.status ? 'Hoạt động' : 'Không hoạt động'}
					</span>
				</td>
				<td class="py-3 px-4 border-b">${formattedDate}</td>
				<td class="py-3 px-4 border-b text-right">
          <button class="view-btn text-blue-500 hover:text-blue-700 mx-1" data-id="${eventType.loai_su_kien_id}">
						<i class="ri-eye-line text-lg"></i>
					</button>
					<button class="edit-btn text-blue-500 hover:text-blue-700 mx-1" data-id="${eventType.loai_su_kien_id}">
						<i class="ri-edit-line text-lg"></i>
					</button>
					<button class="delete-btn text-red-500 hover:text-red-700 mx-1" data-id="${eventType.loai_su_kien_id}">
						<i class="ri-delete-bin-line text-lg"></i>
					</button>
				</td>
			`;

      eventTypesTableBody.appendChild(row);
    }

    // Gắn sự kiện cho các nút sửa
    attachEditButtonListeners();
    // Gắn sự kiện cho các nút xem
    attachViewButtonListeners();
  }

  // Cập nhật thông tin phân trang
  function updatePagination() {
    totalPages = Math.ceil(filteredEventTypes.length / itemsPerPage) || 1;

    // Cập nhật hiển thị tổng số trang
    totalPagesCount.textContent = totalPages;

    // Cập nhật trạng thái của các nút điều hướng
    firstPageBtn.disabled = currentPage === 1;
    prevPageBtn.disabled = currentPage === 1;
    nextPageBtn.disabled = currentPage === totalPages;
    lastPageBtn.disabled = currentPage === totalPages;

    // Thêm hoặc xóa lớp opacity cho nút bị vô hiệu hóa
    firstPageBtn.classList.toggle('opacity-50', firstPageBtn.disabled);
    prevPageBtn.classList.toggle('opacity-50', prevPageBtn.disabled);
    nextPageBtn.classList.toggle('opacity-50', nextPageBtn.disabled);
    lastPageBtn.classList.toggle('opacity-50', lastPageBtn.disabled);
  }

  // Chuyển đến trang cụ thể
  function goToPage(page) {
    // Đảm bảo trang nằm trong phạm vi hợp lệ
    if (page < 1) page = 1;
    if (page > totalPages) page = totalPages;

    currentPage = page;
    currentPageInput.value = page;
    updatePagination();
    renderTable();
  }

  // Hàm hiển thị modal thêm/sửa loại sự kiện
  function showEventTypeModal(isEdit = false, eventTypeId = null) {
    // Đặt tiêu đề cho modal
    eventTypeModalTitle.textContent = isEdit ? 'Chỉnh sửa loại sự kiện' : 'Thêm mới loại sự kiện';

    // Nếu là chỉnh sửa, điền thông tin loại sự kiện vào form
    if (isEdit && eventTypeId) {
      const eventType = allEventTypes.find(et => et.loai_su_kien_id.toString() === eventTypeId.toString());
      if (eventType) {
        eventTypeNameInput.value = eventType.ten_loai_su_kien;
        eventTypeCodeInput.value = eventType.ma_loai_su_kien;
        eventTypeStatusSelect.value = eventType.status;
        saveEventTypeBtn.dataset.id = eventTypeId;
        saveEventTypeBtn.dataset.mode = 'edit';
      } else {
        showToast('Không tìm thấy loại sự kiện', 'error');
        return;
      }
    } else {
      // Nếu là thêm mới, reset form
      eventTypeForm.reset();
      saveEventTypeBtn.dataset.id = '';
      saveEventTypeBtn.dataset.mode = 'add';
    }

    // Hiển thị modal
    eventTypeModal.classList.remove('hidden');
  }

  // Hàm đóng modal thêm/sửa loại sự kiện
  function closeEventTypeModal() {
    eventTypeModal.classList.add('hidden');
    eventTypeForm.reset();
  }

  // Hàm xử lý lưu loại sự kiện (thêm mới hoặc chỉnh sửa)
  function saveEventType() {
    // Kiểm tra form có hợp lệ không
    if (!validateEventTypeForm()) {
      return;
    }

    const mode = saveEventTypeBtn.dataset.mode;
    const id = saveEventTypeBtn.dataset.id;
    const name = eventTypeNameInput.value.trim();
    const code = eventTypeCodeInput.value.trim().toUpperCase();
    const status = parseInt(eventTypeStatusSelect.value);

    if (mode === 'add') {
      // Tạo loại sự kiện mới
      const newId = allEventTypes.length > 0
        ? Math.max(...allEventTypes.map(et => parseInt(et.loai_su_kien_id))) + 1
        : 1;

      const newEventType = {
        loai_su_kien_id: newId,
        ten_loai_su_kien: name,
        ma_loai_su_kien: code,
        status: status,
        created_at: new Date().toISOString().replace('T', ' ').slice(0, 19)
      };

      // Trong thực tế sẽ gọi API để thêm mới
      allEventTypes.push(newEventType);
      showToast('Thêm mới loại sự kiện thành công!', 'success');
    } else if (mode === 'edit') {
      // Cập nhật loại sự kiện
      const index = allEventTypes.findIndex(et => et.loai_su_kien_id.toString() === id.toString());
      if (index !== -1) {
        // Trong thực tế sẽ gọi API để cập nhật
        allEventTypes[index].ten_loai_su_kien = name;
        allEventTypes[index].ma_loai_su_kien = code;
        allEventTypes[index].status = status;
        showToast('Cập nhật loại sự kiện thành công!', 'success');
      } else {
        showToast('Không tìm thấy loại sự kiện để cập nhật!', 'error');
      }
    }

    // Đóng modal
    closeEventTypeModal();

    // Cập nhật lại mảng lọc
    filteredEventTypes = [...allEventTypes];

    // Áp dụng lại các filter hiện tại
    applyFiltersAndPagination();
  }

  // Hàm kiểm tra form thêm/sửa loại sự kiện
  function validateEventTypeForm() {
    const name = eventTypeNameInput.value.trim();
    const code = eventTypeCodeInput.value.trim();

    // Kiểm tra tên không được để trống
    if (!name) {
      showToast('Vui lòng nhập tên loại sự kiện', 'error');
      eventTypeNameInput.focus();
      return false;
    }

    // Kiểm tra mã không được để trống
    if (!code) {
      showToast('Vui lòng nhập mã loại sự kiện', 'error');
      eventTypeCodeInput.focus();
      return false;
    }

    // Kiểm tra mã không được trùng (trừ trường hợp đang sửa chính nó)
    const mode = saveEventTypeBtn.dataset.mode;
    const id = saveEventTypeBtn.dataset.id;

    const isDuplicate = allEventTypes.some(et => {
      // Nếu đang ở chế độ sửa, bỏ qua chính nó
      if (mode === 'edit' && et.loai_su_kien_id.toString() === id.toString()) {
        return false;
      }
      return et.ma_loai_su_kien.toLowerCase() === code.toLowerCase();
    });

    if (isDuplicate) {
      showToast('Mã loại sự kiện đã tồn tại', 'error');
      eventTypeCodeInput.focus();
      return false;
    }

    return true;
  }

  // Gắn sự kiện cho các nút sửa
  function attachEditButtonListeners() {
    const editButtons = document.querySelectorAll('.edit-btn');
    editButtons.forEach(button => {
      button.addEventListener('click', function () {
        const id = this.dataset.id;
        window.location.href = `event-type-edit.html?id=${id}`;
      });
    });
  }
  // Gắn sự kiện cho các nút xem
  function attachViewButtonListeners() {
    const viewButtons = document.querySelectorAll('.view-btn');
    viewButtons.forEach(button => {
      button.addEventListener('click', function () {
        const id = this.dataset.id;
        window.location.href = `event-type-detail.html?id=${id}`;
      });
    });
  }
  // Event Listeners
  // Sidebar toggle
  if (sidebarOpen) {
    sidebarOpen.addEventListener('click', toggleSidebar);
  }

  if (sidebarClose) {
    sidebarClose.addEventListener('click', toggleSidebar);
  }

  if (sidebarOverlay) {
    sidebarOverlay.addEventListener('click', toggleSidebar);
  }

  // User menu toggle
  if (userMenuBtn) {
    userMenuBtn.addEventListener('click', toggleUserMenu);
  }

  // Sự kiện đóng user menu khi click ra ngoài
  document.addEventListener('click', function (event) {
    if (userMenu && !userMenu.classList.contains('hidden') &&
      !userMenuBtn.contains(event.target) &&
      !userMenu.contains(event.target)) {
      userMenu.classList.add('hidden');
    }
  });

  // Sự kiện submit form lọc
  if (filterForm) {
    filterForm.addEventListener('submit', function (event) {
      event.preventDefault();
      applyFiltersAndPagination();
    });
  }

  // Sự kiện reset form lọc
  if (resetFilterBtn) {
    resetFilterBtn.addEventListener('click', function () {
      filterForm.reset();
      // Không tự động áp dụng filter sau khi đặt lại, chờ người dùng nhấn nút Lọc
    });
  }

  // Sự kiện thay đổi số lượng item mỗi trang
  if (itemsPerPageSelect) {
    itemsPerPageSelect.addEventListener('change', function () {
      itemsPerPage = parseInt(this.value);
      currentPage = 1;
      currentPageInput.value = 1;
      updatePagination();
      renderTable();
    });
  }

  // Sự kiện nhập trang cụ thể
  if (currentPageInput) {
    currentPageInput.addEventListener('change', function () {
      goToPage(parseInt(this.value));
    });
  }

  // Các sự kiện cho nút phân trang
  if (firstPageBtn) {
    firstPageBtn.addEventListener('click', function () {
      goToPage(1);
    });
  }

  if (prevPageBtn) {
    prevPageBtn.addEventListener('click', function () {
      goToPage(currentPage - 1);
    });
  }

  if (nextPageBtn) {
    nextPageBtn.addEventListener('click', function () {
      goToPage(currentPage + 1);
    });
  }

  if (lastPageBtn) {
    lastPageBtn.addEventListener('click', function () {
      goToPage(totalPages);
    });
  }

  // Sự kiện cho nút xóa
  document.addEventListener('click', function (event) {
    if (event.target.closest('.delete-btn')) {
      const id = event.target.closest('.delete-btn').dataset.id;
      // Hiển thị modal xác nhận xóa
      deleteModal.classList.remove('hidden');

      // Lưu ID của loại sự kiện cần xóa vào nút xác nhận
      confirmDeleteBtn.dataset.id = id;
    }
  });

  // Sự kiện xác nhận xóa
  if (confirmDeleteBtn) {
    confirmDeleteBtn.addEventListener('click', function () {
      const id = this.dataset.id;

      // Trong thực tế sẽ gọi API để xóa
      allEventTypes = allEventTypes.filter(eventType => eventType.loai_su_kien_id.toString() !== id);
      filteredEventTypes = filteredEventTypes.filter(eventType => eventType.loai_su_kien_id.toString() !== id);

      // Cập nhật UI
      updatePagination();
      renderTable();
      totalItemsCount.textContent = allEventTypes.length;

      // Hiển thị thông báo thành công
      showToast("Xóa loại sự kiện thành công!", "success");

      // Ẩn modal
      deleteModal.classList.add('hidden');
    });
  }

  // Sự kiện hủy xóa
  if (cancelDeleteBtn) {
    cancelDeleteBtn.addEventListener('click', function () {
      deleteModal.classList.add('hidden');
    });
  }

  // Sự kiện thêm mới loại sự kiện
  if (addEventTypeBtn) {
    addEventTypeBtn.addEventListener('click', function () {
      showEventTypeModal(false);
    });
  }

  // Sự kiện lưu loại sự kiện
  if (saveEventTypeBtn) {
    saveEventTypeBtn.addEventListener('click', function (event) {
      event.preventDefault();
      saveEventType();
    });
  }

  // Sự kiện đóng modal thêm/sửa
  if (closeEventTypeModalBtn) {
    closeEventTypeModalBtn.addEventListener('click', function () {
      closeEventTypeModal();
    });
  }

  // Sự kiện ESC để đóng các modal
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
      // Đóng modal xóa nếu đang mở
      if (!deleteModal.classList.contains('hidden')) {
        deleteModal.classList.add('hidden');
      }

      // Đóng modal thêm/sửa nếu đang mở
      if (!eventTypeModal.classList.contains('hidden')) {
        closeEventTypeModal();
      }
    }
  });

  // Hàm hiển thị thông báo toast
  function showToast(message, type = 'info') {
    // Kiểm tra nếu Toastify đã được load
    if (typeof Toastify === 'function') {
      let backgroundColor = '#3b82f6'; // Mặc định màu xanh info

      if (type === 'success') {
        backgroundColor = '#10B981';
      } else if (type === 'error') {
        backgroundColor = '#EF4444';
      } else if (type === 'warning') {
        backgroundColor = '#F59E0B';
      }

      Toastify({
        text: message,
        duration: 3000,
        gravity: "top",
        position: "right",
        backgroundColor: backgroundColor,
        stopOnFocus: true
      }).showToast();
    } else {
      // Fallback nếu không có Toastify
      alert(message);
    }
  }

  // Khởi tạo dữ liệu khi trang được tải
  init();
});
