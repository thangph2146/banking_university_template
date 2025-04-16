// Khởi tạo AOS
AOS.init();

// Biến lưu trữ thông tin vai trò
let currentRole = null;

// Lấy các tham số từ URL
const urlParams = new URLSearchParams(window.location.search);
const roleId = parseInt(urlParams.get('id'));

// Định dạng ngày giờ
function formatDate(dateString) {
  if (!dateString) return 'N/A';
  const options = { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Date(dateString).toLocaleDateString('vi-VN', options);
}

// Lấy dữ liệu vai trò từ sessionStorage
function loadRoleData() {
  try {
    // Lấy dữ liệu từ sessionStorage
    const rolesMockData = JSON.parse(sessionStorage.getItem('rolesMockData')) || [];
    
    // Tìm vai trò theo ID
    currentRole = rolesMockData.find(role => role.r_id === roleId);
    
    if (!currentRole) {
      // Không tìm thấy vai trò, chuyển hướng về trang danh sách
      alert('Không tìm thấy thông tin vai trò!');
      window.location.href = 'roles.html';
      return;
    }
    
    // Cập nhật dữ liệu lên form
    populateFormData();
    
    // Cập nhật liên kết xem chi tiết
    const viewRoleBtn = document.getElementById('view-role-btn');
    if (viewRoleBtn) {
      viewRoleBtn.href = `role-detail.html?id=${roleId}`;
    }
  } catch (error) {
    console.error('Lỗi khi tải dữ liệu vai trò:', error);
    alert('Có lỗi xảy ra khi tải thông tin vai trò. Vui lòng thử lại sau.');
  }
}

// Điền dữ liệu vào form
function populateFormData() {
  // Cập nhật tiêu đề
  document.title = `Chỉnh sửa: ${currentRole.r_name} - HUB Admin`;
  
  // Điền dữ liệu vào form
  document.getElementById('role-id').value = currentRole.r_id;
  document.getElementById('role-name').value = currentRole.r_name || '';
  document.getElementById('role-description').value = currentRole.r_description || '';
  document.getElementById('role-status').value = currentRole.r_status.toString();
  
  // Hiển thị ngày cập nhật
  document.getElementById('current-date').textContent = formatDate(new Date());
  
  // Thiết lập các quyền hạn (ví dụ)
  // Trong thực tế, dữ liệu này sẽ được lấy từ API dựa trên vai trò
  setupPermissions();
}

// Thiết lập các quyền
function setupPermissions() {
  // Ví dụ về thiết lập quyền dựa trên tên vai trò
  const roleName = currentRole.r_name.toLowerCase();
  
  // Mặc định: các quyền cơ bản
  document.getElementById('perm-view-reports').checked = true;
  
  // Kiểm tra tên vai trò để xác định quyền
  if (roleName.includes('quản trị') || roleName.includes('admin')) {
    // Quản trị viên có tất cả các quyền
    document.getElementById('perm-manage-users').checked = true;
    document.getElementById('perm-manage-events').checked = true;
    document.getElementById('perm-manage-registrations').checked = true;
    document.getElementById('perm-manage-checkins').checked = true;
    document.getElementById('perm-system-settings').checked = true;
  } else if (roleName.includes('điều hành') || roleName.includes('quản lý')) {
    // Quản lý có nhiều quyền nhưng không có quyền cài đặt hệ thống
    document.getElementById('perm-manage-users').checked = true;
    document.getElementById('perm-manage-events').checked = true;
    document.getElementById('perm-manage-registrations').checked = true;
    document.getElementById('perm-manage-checkins').checked = true;
  } else if (roleName.includes('biên tập')) {
    // Biên tập viên có quyền quản lý sự kiện và đăng ký
    document.getElementById('perm-manage-events').checked = true;
    document.getElementById('perm-manage-registrations').checked = true;
  } else if (roleName.includes('kỹ thuật')) {
    // Nhân viên kỹ thuật có quyền quản lý check-in và báo cáo
    document.getElementById('perm-manage-checkins').checked = true;
  }
}

// Lưu thay đổi
function saveRoleChanges(e) {
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
    
    // Tạo đối tượng cập nhật
    const updatedRole = {
      ...currentRole,
      r_name: name,
      r_description: description || null,
      r_status: status,
      r_updated_at: new Date().toISOString()
    };
    
    // Lấy dữ liệu từ sessionStorage
    let rolesMockData = JSON.parse(sessionStorage.getItem('rolesMockData')) || [];
    
    // Tìm và cập nhật trong mảng
    const index = rolesMockData.findIndex(r => r.r_id === roleId);
    if (index !== -1) {
      rolesMockData[index] = updatedRole;
      
      // Lưu lại vào sessionStorage
      sessionStorage.setItem('rolesMockData', JSON.stringify(rolesMockData));
      
      alert('Vai trò đã được cập nhật thành công!');
      
      // Chuyển hướng đến trang chi tiết
      window.location.href = `role-detail.html?id=${roleId}`;
    } else {
      throw new Error('Không tìm thấy vai trò để cập nhật');
    }
  } catch (error) {
    console.error('Lỗi khi cập nhật vai trò:', error);
    alert('Có lỗi xảy ra khi cập nhật vai trò. Vui lòng thử lại sau.');
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
  const editForm = document.getElementById('edit-role-form');
  if (editForm) {
    editForm.addEventListener('submit', saveRoleChanges);
  }
  
  // Nút hủy
  const cancelBtn = document.getElementById('cancel-edit');
  if (cancelBtn) {
    cancelBtn.addEventListener('click', function() {
      // Quay lại trang trước đó hoặc trang chi tiết
      if (document.referrer && document.referrer.includes('role-detail.html')) {
        history.back();
      } else {
        window.location.href = `role-detail.html?id=${roleId}`;
      }
    });
  }
}

// Sự kiện khi DOM đã tải
document.addEventListener('DOMContentLoaded', function() {
  setupSidebar();
  setupUserMenu();
  
  // Kiểm tra ID vai trò
  if (!roleId) {
    alert('Không có thông tin ID vai trò!');
    window.location.href = 'roles.html';
    return;
  }
  
  // Tải dữ liệu vai trò
  loadRoleData();
  
  // Thiết lập event listeners
  setupEventListeners();
}); 