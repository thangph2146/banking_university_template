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
  let currentEventTypeIdToDelete = null;

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
  const deleteConfirmationText = document.getElementById('delete-confirmation-text');
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
  const refreshBtn = document.getElementById('refresh-btn');

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
    
    // Cập nhật tổng số mục đếm được
    totalItemsCount.textContent = filteredEventTypes.length;
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
					<button class="delete-btn text-red-500 hover:text-red-700 mx-1" data-id="${eventType.loai_su_kien_id}" data-name="${eventType.ten_loai_su_kien}">
						<i class="ri-delete-bin-line text-lg"></i>
					</button>
				</td>
			`;

      eventTypesTableBody.appendChild(row);
    }

    // Gắn sự kiện cho các nút
    attachButtonListeners();
  }

  // Gắn sự kiện cho các nút trong bảng
  function attachButtonListeners() {
    // Gắn sự kiện cho các nút xem
    const viewButtons = document.querySelectorAll('.view-btn');
    viewButtons.forEach(button => {
      button.addEventListener('click', function() {
        const id = this.dataset.id;
        window.location.href = `event-type-detail.html?id=${id}`;
      });
    });

    // Gắn sự kiện cho các nút sửa
    const editButtons = document.querySelectorAll('.edit-btn');
    editButtons.forEach(button => {
      button.addEventListener('click', function() {
        const id = this.dataset.id;
        window.location.href = `event-type-edit.html?id=${id}`;
      });
    });

    // Gắn sự kiện cho các nút xóa
    const deleteButtons = document.querySelectorAll('.delete-btn');
    deleteButtons.forEach(button => {
      button.addEventListener('click', function() {
        const id = this.dataset.id;
        const name = this.dataset.name;
        
        // Lưu ID của loại sự kiện cần xóa
        currentEventTypeIdToDelete = id;
        
        // Cập nhật nội dung xác nhận xóa
        deleteConfirmationText.textContent = `Bạn có chắc chắn muốn xóa loại sự kiện "${name}" không? Hành động này không thể hoàn tác.`;
        
        // Hiển thị modal xác nhận xóa
        deleteModal.classList.remove('hidden');
      });
    });
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

  // Hàm xóa loại sự kiện
  function deleteEventType(id) {
    // Trong thực tế sẽ gọi API để xóa
    allEventTypes = allEventTypes.filter(eventType => eventType.loai_su_kien_id.toString() !== id.toString());
    filteredEventTypes = filteredEventTypes.filter(eventType => eventType.loai_su_kien_id.toString() !== id.toString());

    // Cập nhật UI
    updatePagination();
    renderTable();
    totalItemsCount.textContent = filteredEventTypes.length;

    // Hiển thị thông báo thành công
    showToast("Xóa loại sự kiện thành công!", "success");
  }

  // Hàm hiển thị thông báo toast
  function showToast(message, type = 'info') {
    let backgroundColor = '#3b82f6'; // Mặc định màu xanh info

    if (type === 'success') {
      backgroundColor = '#10B981';
    } else if (type === 'error') {
      backgroundColor = '#EF4444';
    } else if (type === 'warning') {
      backgroundColor = '#F59E0B';
    }

    // Tạo toast message
    const toast = document.createElement('div');
    toast.className = 'fixed top-4 right-4 z-50 px-4 py-2 rounded-md text-white shadow-lg transform transition-transform duration-300 ease-in-out';
    toast.style.backgroundColor = backgroundColor;
    toast.style.minWidth = '250px';
    toast.style.transform = 'translateX(100%)';
    
    // Nội dung toast
    toast.innerHTML = `
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <i class="ri-${type === 'success' ? 'check-line' : type === 'error' ? 'error-warning-line' : 'information-line'} mr-2"></i>
          <span>${message}</span>
        </div>
        <button class="text-white hover:text-gray-200 focus:outline-none ml-4">
          <i class="ri-close-line"></i>
        </button>
      </div>
    `;
    
    document.body.appendChild(toast);
    
    // Hiệu ứng xuất hiện
    setTimeout(() => {
      toast.style.transform = 'translateX(0)';
    }, 10);
    
    // Tự động đóng sau 3 giây
    setTimeout(() => {
      toast.style.transform = 'translateX(100%)';
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, 3000);
    
    // Sự kiện nút đóng
    toast.querySelector('button').addEventListener('click', () => {
      toast.style.transform = 'translateX(100%)';
      setTimeout(() => {
        toast.remove();
      }, 300);
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

  // Nút refresh dữ liệu
  if (refreshBtn) {
    refreshBtn.addEventListener('click', function() {
      loadingOverlay.classList.remove('hidden');
      
      // Giả lập tải lại dữ liệu từ server
      setTimeout(() => {
        init();
        loadingOverlay.classList.add('hidden');
        showToast('Dữ liệu đã được làm mới!', 'success');
      }, 800);
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

  // Sự kiện xác nhận xóa
  if (confirmDeleteBtn) {
    confirmDeleteBtn.addEventListener('click', function () {
      if (currentEventTypeIdToDelete) {
        deleteEventType(currentEventTypeIdToDelete);
        
        // Reset biến lưu trữ ID và ẩn modal
        currentEventTypeIdToDelete = null;
        deleteModal.classList.add('hidden');
      }
    });
  }

  // Sự kiện hủy xóa
  if (cancelDeleteBtn) {
    cancelDeleteBtn.addEventListener('click', function () {
      currentEventTypeIdToDelete = null;
      deleteModal.classList.add('hidden');
    });
  }

  // Sự kiện ESC để đóng các modal
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
      // Đóng modal xóa nếu đang mở
      if (!deleteModal.classList.contains('hidden')) {
        currentEventTypeIdToDelete = null;
        deleteModal.classList.add('hidden');
      }
    }
  });

  // Sự kiện click vào overlay để đóng modal
  document.addEventListener('click', function(event) {
    // Đóng modal xóa khi click ra ngoài
    if (!deleteModal.classList.contains('hidden') && 
        event.target === deleteModal) {
      currentEventTypeIdToDelete = null;
      deleteModal.classList.add('hidden');
    }
  });

  // Khởi tạo dữ liệu khi trang được tải
  init();
});
