// Khởi tạo AOS
AOS.init();

// Khởi tạo các biến trạng thái
let rolesMockData = [
  {
    r_id: 1,
    r_name: "Quản trị viên",
    r_description: "Quản lý toàn bộ hệ thống và phân quyền",
    r_status: 1,
    r_created_at: "2023-01-15T00:00:00",
    r_updated_at: "2023-01-15T00:00:00",
    r_deleted_at: null
  },
  {
    r_id: 2,
    r_name: "Biên tập viên",
    r_description: "Quản lý nội dung và sự kiện",
    r_status: 1,
    r_created_at: "2023-01-20T00:00:00",
    r_updated_at: "2023-01-20T00:00:00",
    r_deleted_at: null
  },
  {
    r_id: 3,
    r_name: "Người dùng",
    r_description: "Người dùng thông thường",
    r_status: 1,
    r_created_at: "2023-01-25T00:00:00",
    r_updated_at: "2023-01-25T00:00:00",
    r_deleted_at: null
  },
  {
    r_id: 4,
    r_name: "Điều hành viên",
    r_description: "Điều hành sự kiện và quản lý người tham gia",
    r_status: 1,
    r_created_at: "2023-02-10T00:00:00",
    r_updated_at: "2023-02-10T00:00:00",
    r_deleted_at: null
  },
  {
    r_id: 5,
    r_name: "Nhân viên kỹ thuật",
    r_description: "Hỗ trợ kỹ thuật cho hệ thống",
    r_status: 1,
    r_created_at: "2023-03-05T00:00:00",
    r_updated_at: "2023-03-05T00:00:00",
    r_deleted_at: null
  },
  {
    r_id: 6,
    r_name: "Nhân viên quản lý sự kiện",
    r_description: "Tổ chức và quản lý sự kiện",
    r_status: 0,
    r_created_at: "2023-04-15T00:00:00",
    r_updated_at: "2023-04-15T00:00:00",
    r_deleted_at: null
  },
  {
    r_id: 7,
    r_name: "Quản lý cơ sở dữ liệu",
    r_description: "Quản lý và duy trì cơ sở dữ liệu",
    r_status: 1,
    r_created_at: "2023-05-20T00:00:00",
    r_updated_at: "2023-05-20T00:00:00",
    r_deleted_at: null
  },
  {
    r_id: 8,
    r_name: "Giám sát viên",
    r_description: "Giám sát hoạt động của hệ thống",
    r_status: 1,
    r_created_at: "2023-06-25T00:00:00",
    r_updated_at: "2023-06-25T00:00:00",
    r_deleted_at: null
  },
  {
    r_id: 9,
    r_name: "Nhân viên phân tích dữ liệu",
    r_description: "Phân tích dữ liệu và báo cáo",
    r_status: 0,
    r_created_at: "2023-07-30T00:00:00",
    r_updated_at: "2023-07-30T00:00:00",
    r_deleted_at: null
  },
  {
    r_id: 10,
    r_name: "Nhân viên hỗ trợ",
    r_description: "Hỗ trợ người dùng",
    r_status: 1,
    r_created_at: "2023-08-10T00:00:00",
    r_updated_at: "2023-08-10T00:00:00",
    r_deleted_at: null
  }
];

let filteredRoles = [];

// Biến pagination
const paginationState = {
  currentPage: 1,
  itemsPerPage: 10,
  totalPages: 1
};

// Sự kiện khi DOM đã tải
document.addEventListener('DOMContentLoaded', function() {
  // Xử lý sidebar
  const sidebarOpen = document.getElementById('sidebar-open');
  const sidebarClose = document.getElementById('sidebar-close');
  const sidebar = document.getElementById('sidebar');
  const sidebarBackdrop = document.getElementById('sidebar-backdrop');

  if (sidebarOpen) {
    sidebarOpen.addEventListener('click', () => {
      sidebar.classList.remove('-translate-x-full');
      sidebarBackdrop.classList.remove('hidden');
    });
  }

  if (sidebarClose) {
    sidebarClose.addEventListener('click', () => {
      sidebar.classList.add('-translate-x-full');
      sidebarBackdrop.classList.add('hidden');
    });
  }

  if (sidebarBackdrop) {
    sidebarBackdrop.addEventListener('click', () => {
      sidebar.classList.add('-translate-x-full');
      sidebarBackdrop.classList.add('hidden');
    });
  }

  // User Menu Toggle
  const userMenuButton = document.getElementById('user-menu-button');
  const userMenu = document.getElementById('user-menu');

  if (userMenuButton && userMenu) {
    // Hàm kiểm tra click bên ngoài menu
    function handleClickOutside(event) {
      if (userMenu && !userMenu.contains(event.target) && !userMenuButton.contains(event.target)) {
        userMenu.classList.add('opacity-0', 'invisible', 'scale-95');
        userMenu.classList.remove('opacity-100', 'visible', 'scale-100');
        document.removeEventListener('click', handleClickOutside);
      }
    }

    userMenuButton.addEventListener('click', (event) => {
      event.stopPropagation(); // Ngăn chặn click từ đóng menu ngay lập tức
      const isVisible = userMenu.classList.contains('opacity-100');
      if (isVisible) {
        userMenu.classList.add('opacity-0', 'invisible', 'scale-95');
        userMenu.classList.remove('opacity-100', 'visible', 'scale-100');
        document.removeEventListener('click', handleClickOutside);
      } else {
        userMenu.classList.remove('opacity-0', 'invisible', 'scale-95');
        userMenu.classList.add('opacity-100', 'visible', 'scale-100');
        // Thêm sự kiện để đóng khi click bên ngoài
        setTimeout(() => document.addEventListener('click', handleClickOutside), 0);
      }
    });
  }

  // Hàm lọc vai trò
  function applyFilters() {
    const nameFilter = document.getElementById('filter-name').value.toLowerCase().trim();
    const descriptionFilter = document.getElementById('filter-description').value.toLowerCase().trim();
    const statusFilter = document.getElementById('filter-status').value;
    
    filteredRoles = rolesMockData.filter(role => {
      // Kiểm tra tên
      const nameMatch = !nameFilter || role.r_name.toLowerCase().includes(nameFilter);
      
      // Kiểm tra mô tả
      const descriptionMatch = !descriptionFilter || 
        (role.r_description && role.r_description.toLowerCase().includes(descriptionFilter));
      
      // Kiểm tra trạng thái
      const statusMatch = !statusFilter || role.r_status.toString() === statusFilter;
      
      return nameMatch && descriptionMatch && statusMatch;
    });
    
    // Cập nhật phân trang
    paginationState.currentPage = 1;
    updatePagination();
    
    // Render bảng với dữ liệu đã lọc
    renderTable();
  }

  // Cập nhật trạng thái phân trang
  function updatePagination() {
    const totalItems = filteredRoles.length;
    paginationState.totalPages = Math.max(1, Math.ceil(totalItems / paginationState.itemsPerPage));
    
    // Điều chỉnh trang hiện tại nếu vượt quá tổng số trang
    if (paginationState.currentPage > paginationState.totalPages) {
      paginationState.currentPage = paginationState.totalPages;
    }
    
    // Cập nhật UI phân trang
    const currentPageInput = document.getElementById('current-page-input');
    const totalPagesCount = document.getElementById('total-pages-count');
    const totalItemsCount = document.getElementById('total-items-count');
    const btnFirst = document.querySelector('.btn-first');
    const btnPrev = document.querySelector('.btn-prev');
    const btnNext = document.querySelector('.btn-next');
    const btnLast = document.querySelector('.btn-last');
    
    if (currentPageInput) currentPageInput.value = paginationState.currentPage;
    if (totalPagesCount) totalPagesCount.textContent = paginationState.totalPages;
    if (totalItemsCount) totalItemsCount.textContent = totalItems;
    
    // Cập nhật trạng thái nút
    if (btnFirst) btnFirst.disabled = paginationState.currentPage === 1;
    if (btnPrev) btnPrev.disabled = paginationState.currentPage === 1;
    if (btnNext) btnNext.disabled = paginationState.currentPage === paginationState.totalPages;
    if (btnLast) btnLast.disabled = paginationState.currentPage === paginationState.totalPages;
  }

  // Render dữ liệu vào bảng
  function renderTable() {
    const tableBody = document.getElementById('rolesTableBody');
    const noDataPlaceholder = document.getElementById('no-data-placeholder');
    
    if (!tableBody) return;
    
    const startIndex = (paginationState.currentPage - 1) * paginationState.itemsPerPage;
    const endIndex = Math.min(startIndex + paginationState.itemsPerPage, filteredRoles.length);
    const displayedRoles = filteredRoles.slice(startIndex, endIndex);
    
    // Kiểm tra nếu không có dữ liệu
    if (displayedRoles.length === 0) {
      tableBody.innerHTML = '';
      if (noDataPlaceholder) {
        noDataPlaceholder.classList.remove('hidden');
      }
      return;
    }
    
    // Có dữ liệu, ẩn thông báo không có dữ liệu
    if (noDataPlaceholder) {
      noDataPlaceholder.classList.add('hidden');
    }
    
    // Render dữ liệu
    tableBody.innerHTML = displayedRoles.map(role => `
      <tr class="hover:bg-gray-50 transition-colors duration-150">
        <td class="px-4 py-3 text-sm text-gray-700">${role.r_id}</td>
        <td class="px-4 py-3 text-sm font-medium text-gray-900">${role.r_name}</td>
        <td class="px-4 py-3 text-sm text-gray-600">${role.r_description || 'N/A'}</td>
        <td class="px-4 py-3 text-sm">
          <span class="px-2 py-1 text-xs font-medium rounded-full ${
            role.r_status === 1 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }">
            ${role.r_status === 1 ? 'Hoạt động' : 'Không hoạt động'}
          </span>
        </td>
        <td class="px-4 py-3 text-sm text-gray-500">${formatDate(role.r_created_at)}</td>
        <td class="px-4 py-3 text-right text-sm font-medium space-x-2">
          <a href="role-detail.html?id=${role.r_id}" class="text-blue-600 hover:text-blue-800" title="Xem chi tiết">
            <i class="ri-eye-line"></i>
          </a>
          <a href="role-edit.html?id=${role.r_id}" class="text-blue-600 hover:text-blue-800" title="Sửa">
            <i class="ri-pencil-line"></i>
          </a>
          <button class="text-red-600 hover:text-red-800 delete-role-btn" 
                  onclick="deleteRole(${role.r_id})" title="Xóa">
            <i class="ri-delete-bin-line"></i>
          </button>
        </td>
      </tr>
    `).join('');
  }

  // Định dạng ngày
  function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('vi-VN', options);
  }
  
  // Xóa vai trò
  window.deleteRole = function(roleId) {
    const role = rolesMockData.find(r => r.r_id === roleId);
    if (!role) return;
    
    if (confirm(`Bạn có chắc chắn muốn xóa vai trò "${role.r_name}" không?`)) {
      // Trong thực tế sẽ gửi yêu cầu DELETE đến API
      // Ở đây chỉ xóa khỏi mảng
      const roleIndex = rolesMockData.findIndex(r => r.r_id === roleId);
      if (roleIndex !== -1) {
        rolesMockData.splice(roleIndex, 1);
        applyFilters(); // Cập nhật lại danh sách
        alert('Đã xóa vai trò thành công!');
      }
    }
  };

  // Thiết lập các event listeners cho phân trang
  const itemsPerPageSelect = document.getElementById('items-per-page');
  const currentPageInput = document.getElementById('current-page-input');
  const btnFirst = document.querySelector('.btn-first');
  const btnPrev = document.querySelector('.btn-prev');
  const btnNext = document.querySelector('.btn-next');
  const btnLast = document.querySelector('.btn-last');
  
  if (itemsPerPageSelect) {
    itemsPerPageSelect.addEventListener('change', function() {
      paginationState.itemsPerPage = Number(this.value);
      paginationState.currentPage = 1;
      updatePagination();
      renderTable();
    });
  }
  
  if (currentPageInput) {
    currentPageInput.addEventListener('change', function() {
      let newPage = Number(this.value);
      if (newPage < 1) newPage = 1;
      if (newPage > paginationState.totalPages) newPage = paginationState.totalPages;
      
      paginationState.currentPage = newPage;
      updatePagination();
      renderTable();
    });
    
    currentPageInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        let newPage = Number(this.value);
        if (newPage < 1) newPage = 1;
        if (newPage > paginationState.totalPages) newPage = paginationState.totalPages;
        
        paginationState.currentPage = newPage;
        updatePagination();
        renderTable();
      }
    });
  }
  
  if (btnFirst) {
    btnFirst.addEventListener('click', function() {
      if (paginationState.currentPage > 1) {
        paginationState.currentPage = 1;
        updatePagination();
        renderTable();
      }
    });
  }
  
  if (btnPrev) {
    btnPrev.addEventListener('click', function() {
      if (paginationState.currentPage > 1) {
        paginationState.currentPage--;
        updatePagination();
        renderTable();
      }
    });
  }
  
  if (btnNext) {
    btnNext.addEventListener('click', function() {
      if (paginationState.currentPage < paginationState.totalPages) {
        paginationState.currentPage++;
        updatePagination();
        renderTable();
      }
    });
  }
  
  if (btnLast) {
    btnLast.addEventListener('click', function() {
      if (paginationState.currentPage < paginationState.totalPages) {
        paginationState.currentPage = paginationState.totalPages;
        updatePagination();
        renderTable();
      }
    });
  }

  // Thiết lập các event listeners cho bộ lọc
  const filterForm = document.getElementById('filter-form');
  const resetFilterBtn = document.getElementById('reset-filter-btn');
  const refreshBtn = document.getElementById('refresh-btn');
  
  if (filterForm) {
    filterForm.addEventListener('submit', function(e) {
      e.preventDefault();
      applyFilters();
    });
  }
  
  if (resetFilterBtn) {
    resetFilterBtn.addEventListener('click', function() {
      document.getElementById('filter-name').value = '';
      document.getElementById('filter-description').value = '';
      document.getElementById('filter-status').value = '';
      applyFilters();
    });
  }
  
  if (refreshBtn) {
    refreshBtn.addEventListener('click', function() {
      // Reset lại dữ liệu từ nguồn (trong trường hợp thực tế sẽ gọi API)
      filteredRoles = [...rolesMockData];
      
      // Reset bộ lọc
      document.getElementById('filter-name').value = '';
      document.getElementById('filter-description').value = '';
      document.getElementById('filter-status').value = '';
      
      paginationState.currentPage = 1;
      updatePagination();
      renderTable();
      
      alert('Đã tải lại danh sách vai trò!');
    });
  }

  // Lưu dữ liệu vào sessionStorage để sử dụng ở các trang khác
  sessionStorage.setItem('rolesMockData', JSON.stringify(rolesMockData));

  // Khởi tạo ban đầu
  filteredRoles = [...rolesMockData];
  updatePagination();
  renderTable();
}); 