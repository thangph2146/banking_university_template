// Khởi tạo AOS
AOS.init();

// Khởi tạo các biến trạng thái
let allUsers = [];
let filteredUsers = [];

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
  const userMenu = document.querySelector('.group button');
  const userMenuDropdown = document.querySelector('.group div.hidden');

  if (userMenu && userMenuDropdown) {
    userMenu.addEventListener('click', () => {
      userMenuDropdown.classList.toggle('hidden');
    });

    document.addEventListener('click', (e) => {
      if (!userMenu.contains(e.target) && !userMenuDropdown.contains(e.target)) {
        userMenuDropdown.classList.add('hidden');
      }
    });
  }

  // Modal xử lý
  const createUserBtn = document.getElementById('create-user-btn');
  
  function openUserModal() {
    const modal = document.getElementById('user-modal');
    if (modal) {
      modal.classList.remove('hidden');
    }
  }

  window.closeUserModal = function() {
    const modal = document.getElementById('user-modal');
    if (modal) {
      modal.classList.add('hidden');
      // Reset form
      document.getElementById('user-form').reset();
    }
  };

  if (createUserBtn) {
    createUserBtn.addEventListener('click', openUserModal);
  }

  // Form xử lý
  const userForm = document.getElementById('user-form');
  if (userForm) {
    userForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const password = document.getElementById('mat_khau').value;
      const confirmPassword = document.getElementById('xac_nhan_mat_khau').value;
      
      // Kiểm tra mật khẩu và xác nhận mật khẩu
      if (password !== confirmPassword) {
        alert('Mật khẩu và xác nhận mật khẩu không khớp!');
        return;
      }
      
      // Nếu thành công, thêm user mới vào danh sách
      const newUser = {
        id: allUsers.length + 1,
        ho_ten: document.getElementById('ho_ten').value,
        email: document.getElementById('email').value,
        so_dien_thoai: document.getElementById('so_dien_thoai').value,
        vai_tro: document.getElementById('vai_tro').value,
        trang_thai: document.getElementById('trang_thai').value,
        ngay_tham_gia: new Date().toISOString().split('T')[0],
        dia_chi: document.getElementById('dia_chi').value,
        avatar: 'https://readdy.ai/api/search-image?query=young%20vietnamese%20' + 
                (Math.random() > 0.5 ? 'male' : 'female') + 
                '%20student%20minimal%20background&width=100&height=100&seq=' + 
                Math.floor(Math.random() * 20)
      };
      
      allUsers.unshift(newUser);
      applyFilters();
      
      alert('Người dùng đã được tạo thành công!');
      closeUserModal();
    });
  }

  // Dữ liệu mẫu cho 20 người dùng
  allUsers = [
    {
      id: 1,
      ho_ten: "Nguyễn Văn Anh",
      email: "nguyenvananh@hub.edu.vn",
      so_dien_thoai: "0901234567",
      vai_tro: "admin",
      trang_thai: "active",
      ngay_tham_gia: "2023-01-15",
      dia_chi: "Quận 1, TP.HCM",
      avatar: "https://readdy.ai/api/search-image?query=young%20vietnamese%20male%20student%20minimal%20background&width=100&height=100&seq=1"
    },
    {
      id: 2,
      ho_ten: "Trần Thị Bình",
      email: "tranthib@hub.edu.vn",
      so_dien_thoai: "0912345678",
      vai_tro: "moderator",
      trang_thai: "active",
      ngay_tham_gia: "2023-02-20",
      dia_chi: "Quận 3, TP.HCM",
      avatar: "https://readdy.ai/api/search-image?query=young%20vietnamese%20female%20student%20minimal%20background&width=100&height=100&seq=2"
    },
    {
      id: 3,
      ho_ten: "Lê Văn Cường",
      email: "levancuong@hub.edu.vn",
      so_dien_thoai: "0923456789",
      vai_tro: "user",
      trang_thai: "active",
      ngay_tham_gia: "2023-03-10",
      dia_chi: "Quận 7, TP.HCM",
      avatar: "https://readdy.ai/api/search-image?query=young%20vietnamese%20male%20student%20minimal%20background&width=100&height=100&seq=3"
    },
    {
      id: 4,
      ho_ten: "Phạm Thị Dung",
      email: "phamthid@hub.edu.vn",
      so_dien_thoai: "0934567890",
      vai_tro: "user",
      trang_thai: "inactive",
      ngay_tham_gia: "2023-04-05",
      dia_chi: "Quận 2, TP.HCM",
      avatar: "https://readdy.ai/api/search-image?query=young%20vietnamese%20female%20student%20minimal%20background&width=100&height=100&seq=4"
    },
    {
      id: 5,
      ho_ten: "Hoàng Văn Em",
      email: "hoangvanem@hub.edu.vn",
      so_dien_thoai: "0945678901",
      vai_tro: "moderator",
      trang_thai: "banned",
      ngay_tham_gia: "2023-05-15",
      dia_chi: "Quận 5, TP.HCM",
      avatar: "https://readdy.ai/api/search-image?query=young%20vietnamese%20male%20student%20minimal%20background&width=100&height=100&seq=5"
    },
    {
      id: 6,
      ho_ten: "Ngô Thị Giang",
      email: "ngothig@hub.edu.vn",
      so_dien_thoai: "0956789012",
      vai_tro: "user",
      trang_thai: "active",
      ngay_tham_gia: "2023-06-20",
      dia_chi: "Quận 4, TP.HCM",
      avatar: "https://readdy.ai/api/search-image?query=young%20vietnamese%20female%20student%20minimal%20background&width=100&height=100&seq=6"
    },
    {
      id: 7,
      ho_ten: "Đinh Văn Huy",
      email: "dinhvanhuy@hub.edu.vn",
      so_dien_thoai: "0967890123",
      vai_tro: "user",
      trang_thai: "active",
      ngay_tham_gia: "2023-07-10",
      dia_chi: "Quận 6, TP.HCM",
      avatar: "https://readdy.ai/api/search-image?query=young%20vietnamese%20male%20student%20minimal%20background&width=100&height=100&seq=7"
    },
    {
      id: 8,
      ho_ten: "Lý Thị Iu",
      email: "lythiiu@hub.edu.vn",
      so_dien_thoai: "0978901234",
      vai_tro: "user",
      trang_thai: "inactive",
      ngay_tham_gia: "2023-08-05",
      dia_chi: "Quận 10, TP.HCM",
      avatar: "https://readdy.ai/api/search-image?query=young%20vietnamese%20female%20student%20minimal%20background&width=100&height=100&seq=8"
    },
    {
      id: 9,
      ho_ten: "Trịnh Văn Khánh",
      email: "trinhvank@hub.edu.vn",
      so_dien_thoai: "0989012345",
      vai_tro: "admin",
      trang_thai: "active",
      ngay_tham_gia: "2023-09-15",
      dia_chi: "Quận 8, TP.HCM",
      avatar: "https://readdy.ai/api/search-image?query=young%20vietnamese%20male%20student%20minimal%20background&width=100&height=100&seq=9"
    },
    {
      id: 10,
      ho_ten: "Mai Thị Lan",
      email: "maithilan@hub.edu.vn",
      so_dien_thoai: "0990123456",
      vai_tro: "moderator",
      trang_thai: "active",
      ngay_tham_gia: "2023-10-20",
      dia_chi: "Quận 9, TP.HCM",
      avatar: "https://readdy.ai/api/search-image?query=young%20vietnamese%20female%20student%20minimal%20background&width=100&height=100&seq=10"
    },
    {
      id: 11,
      ho_ten: "Hồ Văn Minh",
      email: "hovanminh@hub.edu.vn",
      so_dien_thoai: "0981234567",
      vai_tro: "user",
      trang_thai: "banned",
      ngay_tham_gia: "2023-11-10",
      dia_chi: "Quận 11, TP.HCM",
      avatar: "https://readdy.ai/api/search-image?query=young%20vietnamese%20male%20student%20minimal%20background&width=100&height=100&seq=11"
    },
    {
      id: 12,
      ho_ten: "Vũ Thị Nga",
      email: "vuthinga@hub.edu.vn",
      so_dien_thoai: "0972345678",
      vai_tro: "user",
      trang_thai: "active",
      ngay_tham_gia: "2023-12-05",
      dia_chi: "Quận 12, TP.HCM",
      avatar: "https://readdy.ai/api/search-image?query=young%20vietnamese%20female%20student%20minimal%20background&width=100&height=100&seq=12"
    },
    {
      id: 13,
      ho_ten: "Đặng Văn Oanh",
      email: "dangvanoanh@hub.edu.vn",
      so_dien_thoai: "0963456789",
      vai_tro: "user",
      trang_thai: "active",
      ngay_tham_gia: "2024-01-15",
      dia_chi: "Bình Tân, TP.HCM",
      avatar: "https://readdy.ai/api/search-image?query=young%20vietnamese%20male%20student%20minimal%20background&width=100&height=100&seq=13"
    },
    {
      id: 14,
      ho_ten: "Bùi Thị Phương",
      email: "buithiphuong@hub.edu.vn",
      so_dien_thoai: "0954567890",
      vai_tro: "moderator",
      trang_thai: "inactive",
      ngay_tham_gia: "2024-02-20",
      dia_chi: "Tân Bình, TP.HCM",
      avatar: "https://readdy.ai/api/search-image?query=young%20vietnamese%20female%20student%20minimal%20background&width=100&height=100&seq=14"
    },
    {
      id: 15,
      ho_ten: "Lương Văn Quân",
      email: "luongvanquan@hub.edu.vn",
      so_dien_thoai: "0945678901",
      vai_tro: "user",
      trang_thai: "active",
      ngay_tham_gia: "2024-03-10",
      dia_chi: "Gò Vấp, TP.HCM",
      avatar: "https://readdy.ai/api/search-image?query=young%20vietnamese%20male%20student%20minimal%20background&width=100&height=100&seq=15"
    },
    {
      id: 16,
      ho_ten: "Phan Thị Sương",
      email: "phanthisuong@hub.edu.vn",
      so_dien_thoai: "0936789012",
      vai_tro: "user",
      trang_thai: "banned",
      ngay_tham_gia: "2024-04-05",
      dia_chi: "Bình Thạnh, TP.HCM",
      avatar: "https://readdy.ai/api/search-image?query=young%20vietnamese%20female%20student%20minimal%20background&width=100&height=100&seq=16"
    },
    {
      id: 17,
      ho_ten: "Đỗ Văn Tâm",
      email: "dovantam@hub.edu.vn",
      so_dien_thoai: "0927890123",
      vai_tro: "admin",
      trang_thai: "active",
      ngay_tham_gia: "2024-05-15",
      dia_chi: "Tân Phú, TP.HCM",
      avatar: "https://readdy.ai/api/search-image?query=young%20vietnamese%20male%20student%20minimal%20background&width=100&height=100&seq=17"
    },
    {
      id: 18,
      ho_ten: "Kim Thị Uyên",
      email: "kimthiuyen@hub.edu.vn",
      so_dien_thoai: "0918901234",
      vai_tro: "moderator",
      trang_thai: "active",
      ngay_tham_gia: "2024-06-20",
      dia_chi: "Phú Nhuận, TP.HCM",
      avatar: "https://readdy.ai/api/search-image?query=young%20vietnamese%20female%20student%20minimal%20background&width=100&height=100&seq=18"
    },
    {
      id: 19,
      ho_ten: "Dương Văn Vinh",
      email: "duongvanvinh@hub.edu.vn",
      so_dien_thoai: "0909012345",
      vai_tro: "user",
      trang_thai: "inactive",
      ngay_tham_gia: "2024-07-10",
      dia_chi: "Thủ Đức, TP.HCM",
      avatar: "https://readdy.ai/api/search-image?query=young%20vietnamese%20male%20student%20minimal%20background&width=100&height=100&seq=19"
    },
    {
      id: 20,
      ho_ten: "Hà Thị Xuân",
      email: "hathixuan@hub.edu.vn",
      so_dien_thoai: "0900123456",
      vai_tro: "user",
      trang_thai: "active",
      ngay_tham_gia: "2024-08-05",
      dia_chi: "Nhà Bè, TP.HCM",
      avatar: "https://readdy.ai/api/search-image?query=young%20vietnamese%20female%20student%20minimal%20background&width=100&height=100&seq=20"
    }
  ];

  // Hàm lọc người dùng
  function applyFilters() {
    const searchInput = document.getElementById('filter-search').value.toLowerCase();
    const roleFilter = document.getElementById('filter-role').value;
    const statusFilter = document.getElementById('filter-status').value;
    
    filteredUsers = allUsers.filter(user => {
      // Kiểm tra tìm kiếm
      const searchMatch = 
        user.ho_ten.toLowerCase().includes(searchInput) || 
        user.email.toLowerCase().includes(searchInput) ||
        user.so_dien_thoai.includes(searchInput);
        
      // Kiểm tra vai trò
      const roleMatch = !roleFilter || user.vai_tro === roleFilter;
      
      // Kiểm tra trạng thái
      const statusMatch = !statusFilter || user.trang_thai === statusFilter;
      
      return searchMatch && roleMatch && statusMatch;
    });
    
    // Cập nhật phân trang
    paginationState.currentPage = 1;
    updatePagination();
    
    // Render bảng với dữ liệu đã lọc
    renderTable();
  }

  // Cập nhật trạng thái phân trang
  function updatePagination() {
    const totalItems = filteredUsers.length;
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
    const tableBody = document.getElementById('users-table-body');
    if (!tableBody) return;
    
    const startIndex = (paginationState.currentPage - 1) * paginationState.itemsPerPage;
    const endIndex = Math.min(startIndex + paginationState.itemsPerPage, filteredUsers.length);
    const displayedUsers = filteredUsers.slice(startIndex, endIndex);
    
    // Kiểm tra nếu không có dữ liệu
    if (displayedUsers.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="6" class="px-6 py-4 text-center text-gray-500">
            Không tìm thấy người dùng nào phù hợp với bộ lọc
          </td>
        </tr>
      `;
      return;
    }
    
    // Render dữ liệu
    tableBody.innerHTML = displayedUsers.map(user => `
      <tr>
        <td class="px-6 py-4">
          <div class="flex items-center">
            <div class="flex-shrink-0 h-10 w-10">
              <img class="h-10 w-10 rounded-full" src="${user.avatar}" alt="${user.ho_ten}">
            </div>
            <div class="ml-4">
              <div class="text-sm font-medium text-gray-900">${user.ho_ten}</div>
              <div class="text-sm text-gray-500">${user.email}</div>
            </div>
          </div>
        </td>
        <td class="px-6 py-4">
          <div class="text-sm text-gray-900">${user.so_dien_thoai}</div>
          <div class="text-sm text-gray-500">${user.dia_chi || 'Chưa cập nhật'}</div>
        </td>
        <td class="px-6 py-4">
          <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
            ${user.vai_tro === 'admin' ? 'bg-purple-100 text-purple-800' : 
            user.vai_tro === 'moderator' ? 'bg-blue-100 text-blue-800' : 
            'bg-green-100 text-green-800'}">
            ${user.vai_tro === 'admin' ? 'Admin' : 
            user.vai_tro === 'moderator' ? 'Điều hành viên' : 
            'Người dùng'}
          </span>
        </td>
        <td class="px-6 py-4">
          <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
            ${user.trang_thai === 'active' ? 'bg-green-100 text-green-800' : 
            user.trang_thai === 'inactive' ? 'bg-gray-100 text-gray-800' : 
            'bg-red-100 text-red-800'}">
            ${user.trang_thai === 'active' ? 'Đang hoạt động' : 
            user.trang_thai === 'inactive' ? 'Không hoạt động' : 
            'Đã khóa'}
          </span>
        </td>
        <td class="px-6 py-4 text-sm text-gray-500">
          ${formatDate(user.ngay_tham_gia)}
        </td>
        <td class="px-6 py-4 text-right text-sm font-medium">
          <div class="flex justify-end space-x-2">
            <button onclick="viewUser(${user.id})" class="text-blue-600 hover:text-blue-900">
              <i class="ri-eye-line"></i>
            </button>
            <button onclick="editUser(${user.id})" class="text-green-600 hover:text-green-900">
              <i class="ri-edit-line"></i>
            </button>
            <button onclick="deleteUser(${user.id})" class="text-red-600 hover:text-red-900">
              <i class="ri-delete-bin-line"></i>
            </button>
          </div>
        </td>
      </tr>
    `).join('');
  }

  // Định dạng ngày
  function formatDate(dateString) {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('vi-VN', options);
  }
  
  // Các hàm xử lý người dùng
  window.viewUser = function(userId) {
    const user = allUsers.find(u => u.id === userId);
    if (user) {
      alert(`Xem chi tiết người dùng: ${user.ho_ten}`);
      // Thực hiện chuyển hướng hoặc hiển thị modal chi tiết
    }
  };
  
  window.editUser = function(userId) {
    const user = allUsers.find(u => u.id === userId);
    if (user) {
      alert(`Sửa thông tin người dùng: ${user.ho_ten}`);
      // Thực hiện mở modal chỉnh sửa và điền dữ liệu
    }
  };
  
  window.deleteUser = function(userId) {
    if (confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
      const userIndex = allUsers.findIndex(u => u.id === userId);
      if (userIndex !== -1) {
        allUsers.splice(userIndex, 1);
        applyFilters(); // Cập nhật lại danh sách
        alert('Đã xóa người dùng thành công!');
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
      document.getElementById('filter-search').value = '';
      document.getElementById('filter-role').value = '';
      document.getElementById('filter-status').value = '';
      applyFilters();
    });
  }
  
  if (refreshBtn) {
    refreshBtn.addEventListener('click', function() {
      // Reset lại dữ liệu từ nguồn (trong trường hợp thực tế sẽ gọi API)
      filteredUsers = [...allUsers];
      document.getElementById('filter-search').value = '';
      document.getElementById('filter-role').value = '';
      document.getElementById('filter-status').value = '';
      paginationState.currentPage = 1;
      updatePagination();
      renderTable();
    });
  }

  // Khởi tạo ban đầu
  filteredUsers = [...allUsers];
  updatePagination();
  renderTable();
});
