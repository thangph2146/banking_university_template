// Khởi tạo AOS
AOS.init();

// Biến lưu trữ thông tin vai trò
let currentRole = null;

// Lấy các tham số từ URL
const urlParams = new URLSearchParams(window.location.search);
const roleId = parseInt(urlParams.get('id'));

// Danh sách người dùng mẫu có vai trò này
const mockUsers = [
  {
    u_id: 1,
    u_fullname: "Nguyễn Văn An",
    u_email: "nguyenvanan@example.com",
    u_avatar: "https://ui-avatars.com/api/?name=Nguyen+Van+An&background=0D8ABC&color=fff"
  },
  {
    u_id: 2,
    u_fullname: "Trần Thị Bình",
    u_email: "tranthib@example.com",
    u_avatar: "https://ui-avatars.com/api/?name=Tran+Thi+Binh&background=0D8ABC&color=fff"
  },
  {
    u_id: 3,
    u_fullname: "Lê Văn Cường",
    u_email: "levanc@example.com",
    u_avatar: "https://ui-avatars.com/api/?name=Le+Van+Cuong&background=0D8ABC&color=fff"
  }
];

// Định dạng ngày giờ
function formatDate(dateString) {
  if (!dateString) return 'N/A';
  const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
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
    
    // Cập nhật dữ liệu lên giao diện
    updateRoleUI();
    
    // Sau khi hiển thị thông tin vai trò, tải danh sách người dùng
    setTimeout(loadUsersWithRole, 500);
    
    // Cập nhật liên kết chỉnh sửa
    const editRoleBtn = document.getElementById('edit-role-btn');
    if (editRoleBtn) {
      editRoleBtn.href = `role-edit.html?id=${roleId}`;
    }
  } catch (error) {
    console.error('Lỗi khi tải dữ liệu vai trò:', error);
    alert('Có lỗi xảy ra khi tải thông tin vai trò. Vui lòng thử lại sau.');
  }
}

// Cập nhật giao diện người dùng với dữ liệu vai trò
function updateRoleUI() {
  // Cập nhật tiêu đề
  document.title = `${currentRole.r_name} - Chi tiết Vai trò - HUB Admin`;
  
  // Cập nhật thông tin vai trò
  document.getElementById('role-name').textContent = currentRole.r_name;
  document.getElementById('role-description').textContent = 
    currentRole.r_description || 'Không có mô tả';
  
  // Cập nhật trạng thái
  const statusElement = document.getElementById('role-status');
  if (currentRole.r_status === 1) {
    statusElement.textContent = 'Hoạt động';
    statusElement.classList.add('bg-green-100', 'text-green-800');
  } else {
    statusElement.textContent = 'Không hoạt động';
    statusElement.classList.add('bg-red-100', 'text-red-800');
  }
  
  // Cập nhật thông tin chi tiết
  document.getElementById('role-id').textContent = currentRole.r_id;
  document.getElementById('role-created-at').textContent = formatDate(currentRole.r_created_at);
  document.getElementById('role-updated-at').textContent = formatDate(currentRole.r_updated_at);
}

// Tải danh sách người dùng có vai trò này
function loadUsersWithRole() {
  const loadingElement = document.getElementById('loading-users');
  const usersListElement = document.getElementById('users-list');
  const noUsersMessage = document.getElementById('no-users-message');
  
  // Trong thực tế sẽ gọi API để lấy danh sách người dùng theo role_id
  // Ở đây sử dụng dữ liệu mẫu
  
  // Ẩn loading
  loadingElement.classList.add('hidden');
  
  if (currentRole.r_id % 2 === 0) {
    // Giả lập không có người dùng nào
    noUsersMessage.classList.remove('hidden');
    return;
  }
  
  // Hiển thị danh sách người dùng
  usersListElement.innerHTML = '';
  usersListElement.classList.remove('hidden');
  
  mockUsers.forEach(user => {
    const userCard = document.createElement('div');
    userCard.className = 'border border-gray-200 rounded-lg p-4 flex items-center space-x-3';
    userCard.innerHTML = `
      <img src="${user.u_avatar}" alt="${user.u_fullname}" class="w-10 h-10 rounded-full">
      <div>
        <p class="font-medium text-gray-800">${user.u_fullname}</p>
        <p class="text-sm text-gray-500">${user.u_email}</p>
      </div>
    `;
    usersListElement.appendChild(userCard);
  });
}

// Xóa vai trò
function setupDeleteButton() {
  const deleteBtn = document.getElementById('delete-role-btn');
  if (deleteBtn) {
    deleteBtn.addEventListener('click', function() {
      if (confirm(`Bạn có chắc chắn muốn xóa vai trò "${currentRole.r_name}" không?`)) {
        try {
          // Lấy dữ liệu từ sessionStorage
          let rolesMockData = JSON.parse(sessionStorage.getItem('rolesMockData')) || [];
          
          // Lọc bỏ vai trò cần xóa
          rolesMockData = rolesMockData.filter(role => role.r_id !== roleId);
          
          // Cập nhật lại sessionStorage
          sessionStorage.setItem('rolesMockData', JSON.stringify(rolesMockData));
          
          alert('Vai trò đã được xóa thành công!');
          
          // Chuyển về trang danh sách
          window.location.href = 'roles.html';
        } catch (error) {
          console.error('Lỗi khi xóa vai trò:', error);
          alert('Có lỗi xảy ra khi xóa vai trò. Vui lòng thử lại sau.');
        }
      }
    });
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
  
  // Thiết lập nút xóa
  setupDeleteButton();
}); 