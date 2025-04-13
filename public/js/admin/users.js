// Initialize AOS
AOS.init();

// Handle sidebar toggle
const sidebarToggle = document.getElementById('sidebar-toggle');
const sidebar = document.getElementById('sidebar');

sidebarToggle.addEventListener('click', () => {
  sidebar.classList.toggle('-translate-x-full');
});

// Handle user menu toggle
const userMenuButton = document.getElementById('user-menu-button');
const userMenu = document.getElementById('user-menu');

userMenuButton.addEventListener('click', () => {
  userMenu.classList.toggle('hidden');
});

// Close user menu when clicking outside
document.addEventListener('click', (e) => {
  if (!userMenuButton.contains(e.target) && !userMenu.contains(e.target)) {
    userMenu.classList.add('hidden');
  }
});

// Handle user modal
const userModal = document.getElementById('user-modal');
const createUserBtn = document.getElementById('create-user-btn');
const userForm = document.getElementById('user-form');

function openUserModal() {
  userModal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeUserModal() {
  userModal.classList.add('hidden');
  document.body.style.overflow = 'auto';
  userForm.reset();
}

createUserBtn.addEventListener('click', openUserModal);

// Close modal when clicking outside
userModal.addEventListener('click', (e) => {
  if (e.target === userModal) {
    closeUserModal();
  }
});

// Handle form submission
userForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  try {
    const formData = new FormData(userForm);
    const data = Object.fromEntries(formData);
    
    // Add validation
    if (data.mat_khau !== data.xac_nhan_mat_khau) {
      alert('Mật khẩu xác nhận không khớp');
      return;
    }
    
    // TODO: Send data to server
    console.log('Form data:', data);
    
    // Show success message
    alert('Thêm người dùng thành công!');
    closeUserModal();
    
    // Reload users list
    loadUsers();
    
  } catch (error) {
    console.error('Error submitting form:', error);
    alert('Có lỗi xảy ra khi thêm người dùng. Vui lòng thử lại!');
  }
});

// Load users from server
async function loadUsers(page = 1, filters = {}) {
  try {
    // TODO: Fetch users from server
    const users = [
      {
        id: 1,
        ho_ten: 'Nguyễn Văn A',
        email: 'nguyenvana@gmail.com',
        so_dien_thoai: '0123456789',
        vai_tro: 'admin',
        trang_thai: 'active',
        ngay_tham_gia: '2025-01-15',
        avatar: 'https://ui-avatars.com/api/?name=Nguyen+Van+A&background=random'
      }
      // Add more sample users...
    ];
    
    renderUsers(users);
    
  } catch (error) {
    console.error('Error loading users:', error);
    alert('Có lỗi xảy ra khi tải danh sách người dùng');
  }
}

// Render users to table
function renderUsers(users) {
  const tbody = document.querySelector('#users-table-body');
  tbody.innerHTML = users.map(user => `
    <tr>
      <td class="px-6 py-4 whitespace-nowrap">
        <div class="flex items-center">
          <div class="flex-shrink-0 h-10 w-10">
            <img class="h-10 w-10 rounded-full object-cover" src="${user.avatar}" alt="${user.ho_ten}">
          </div>
          <div class="ml-4">
            <div class="text-sm font-medium text-gray-900">
              ${user.ho_ten}
            </div>
            <div class="text-sm text-gray-500">
              ${user.email}
            </div>
          </div>
        </div>
      </td>
      <td class="px-6 py-4 whitespace-nowrap">
        <div class="text-sm text-gray-900">${user.so_dien_thoai || 'Chưa cập nhật'}</div>
      </td>
      <td class="px-6 py-4 whitespace-nowrap">
        <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleClass(user.vai_tro)}">
          ${getRoleText(user.vai_tro)}
        </span>
      </td>
      <td class="px-6 py-4 whitespace-nowrap">
        <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(user.trang_thai)}">
          ${getStatusText(user.trang_thai)}
        </span>
      </td>
      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        ${new Date(user.ngay_tham_gia).toLocaleDateString('vi-VN')}
      </td>
      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <div class="flex space-x-2">
          <button class="text-primary hover:text-primary/80" title="Xem chi tiết" onclick="viewUser(${user.id})">
            <i class="ri-eye-line"></i>
          </button>
          <button class="text-blue-600 hover:text-blue-800" title="Chỉnh sửa" onclick="editUser(${user.id})">
            <i class="ri-edit-line"></i>
          </button>
          <button class="text-red-600 hover:text-red-800" title="Xóa" onclick="deleteUser(${user.id})">
            <i class="ri-delete-bin-line"></i>
          </button>
        </div>
      </td>
    </tr>
  `).join('');
}

// Helper functions for role display
function getRoleClass(role) {
  switch (role) {
    case 'admin':
      return 'bg-purple-100 text-purple-800';
    case 'moderator':
      return 'bg-blue-100 text-blue-800';
    case 'user':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

function getRoleText(role) {
  switch (role) {
    case 'admin':
      return 'Admin';
    case 'moderator':
      return 'Điều hành viên';
    case 'user':
      return 'Người dùng';
    default:
      return 'Không xác định';
  }
}

// Helper functions for status display
function getStatusClass(status) {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800';
    case 'inactive':
      return 'bg-gray-100 text-gray-800';
    case 'banned':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

function getStatusText(status) {
  switch (status) {
    case 'active':
      return 'Đang hoạt động';
    case 'inactive':
      return 'Không hoạt động';
    case 'banned':
      return 'Đã khóa';
    default:
      return 'Không xác định';
  }
}

// User actions
function viewUser(id) {
  // TODO: Implement view user details
  console.log('View user:', id);
}

function editUser(id) {
  // TODO: Implement edit user
  console.log('Edit user:', id);
}

async function deleteUser(id) {
  if (confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
    try {
      // TODO: Send delete request to server
      console.log('Delete user:', id);
      
      // Reload users list
      loadUsers();
      
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Có lỗi xảy ra khi xóa người dùng');
    }
  }
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
  loadUsers();
}); 