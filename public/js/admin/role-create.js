// Khởi tạo AOS
AOS.init();

// Định dạng ngày giờ
function formatDate(dateString) {
  if (!dateString) return 'N/A';
  const options = { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Date(dateString).toLocaleDateString('vi-VN', options);
}

// Khởi tạo form
function initializeForm() {
  // Hiển thị ngày hiện tại
  document.getElementById('current-date').textContent = formatDate(new Date());
}

// Lưu vai trò mới
function saveNewRole(e) {
  e.preventDefault();
  
  try {
    // Lấy dữ liệu từ form
    const name = document.getElementById('role-name').value.trim();
    const description = document.getElementById('role-description').value.trim();
    const status = parseInt(document.getElementById('role-status').value);
    
    // Kiểm tra dữ liệu
    if (!name) {
      alert('Vui lòng nhập tên vai trò!');
      return;
    }
    
    // Tạo đối tượng vai trò mới
    const now = new Date().toISOString();
    const newRole = {
      r_name: name,
      r_description: description || null,
      r_status: status,
      r_created_at: now,
      r_updated_at: now,
      r_deleted_at: null
    };
    
    // Lấy dữ liệu từ sessionStorage
    let rolesMockData = JSON.parse(sessionStorage.getItem('rolesMockData')) || [];
    
    // Tạo ID mới
    newRole.r_id = rolesMockData.length > 0 ? Math.max(...rolesMockData.map(r => r.r_id)) + 1 : 1;
    
    // Thêm vai trò mới vào mảng
    rolesMockData.push(newRole);
    
    // Lưu lại vào sessionStorage
    sessionStorage.setItem('rolesMockData', JSON.stringify(rolesMockData));
    
    alert('Vai trò mới đã được tạo thành công!');
    
    // Chuyển hướng đến trang chi tiết vai trò mới
    window.location.href = `role-detail.html?id=${newRole.r_id}`;
  } catch (error) {
    console.error('Lỗi khi tạo vai trò mới:', error);
    alert('Có lỗi xảy ra khi tạo vai trò mới. Vui lòng thử lại sau.');
  }
}

// Xử lý sidebar
function setupSidebar() {
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
}

// Xử lý user menu
function setupUserMenu() {
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
}

// Thiết lập các event listeners
function setupEventListeners() {
  // Form submit
  const createForm = document.getElementById('create-role-form');
  if (createForm) {
    createForm.addEventListener('submit', saveNewRole);
  }
  
  // Nút hủy
  const cancelBtn = document.getElementById('cancel-create');
  if (cancelBtn) {
    cancelBtn.addEventListener('click', function() {
      // Quay lại trang danh sách
      window.location.href = 'roles.html';
    });
  }
}

// Sự kiện khi DOM đã tải
document.addEventListener('DOMContentLoaded', function() {
  setupSidebar();
  setupUserMenu();
  
  // Khởi tạo form
  initializeForm();
  
  // Thiết lập event listeners
  setupEventListeners();
}); 