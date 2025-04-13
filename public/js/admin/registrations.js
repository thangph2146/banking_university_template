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

// Handle registration modal
const registrationModal = document.getElementById('registration-modal');
const createRegistrationBtn = document.getElementById('create-registration-btn');
const registrationForm = document.getElementById('registration-form');

function openRegistrationModal() {
  registrationModal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  loadEventsAndUsers();
}

function closeRegistrationModal() {
  registrationModal.classList.add('hidden');
  document.body.style.overflow = 'auto';
  registrationForm.reset();
}

createRegistrationBtn.addEventListener('click', openRegistrationModal);

// Close modal when clicking outside
registrationModal.addEventListener('click', (e) => {
  if (e.target === registrationModal) {
    closeRegistrationModal();
  }
});

// Load events and users for dropdowns
async function loadEventsAndUsers() {
  try {
    // TODO: Fetch events from server
    const events = [
      { id: 1, name: 'Hội thảo Công nghệ 2025' },
      { id: 2, name: 'Workshop Khởi nghiệp' }
    ];
    
    // TODO: Fetch users from server
    const users = [
      { id: 1, name: 'Nguyễn Văn A', email: 'nguyenvana@example.com' },
      { id: 2, name: 'Trần Thị B', email: 'tranthib@example.com' }
    ];
    
    // Populate event dropdown
    const eventSelect = registrationForm.querySelector('[name="event_id"]');
    eventSelect.innerHTML = '<option value="">Chọn sự kiện</option>' +
      events.map(event => `<option value="${event.id}">${event.name}</option>`).join('');
    
    // Populate user dropdown
    const userSelect = registrationForm.querySelector('[name="user_id"]');
    userSelect.innerHTML = '<option value="">Chọn người dùng</option>' +
      users.map(user => `<option value="${user.id}">${user.name} (${user.email})</option>`).join('');
    
  } catch (error) {
    console.error('Error loading events and users:', error);
    alert('Có lỗi xảy ra khi tải danh sách sự kiện và người dùng');
  }
}

// Handle form submission
registrationForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  try {
    const formData = new FormData(registrationForm);
    const data = Object.fromEntries(formData);
    
    // TODO: Send data to server
    console.log('Form data:', data);
    
    // Show success message
    alert('Thêm đăng ký thành công!');
    closeRegistrationModal();
    
    // Reload registrations list
    loadRegistrations();
    
  } catch (error) {
    console.error('Error submitting form:', error);
    alert('Có lỗi xảy ra khi thêm đăng ký. Vui lòng thử lại!');
  }
});

// Load registrations from server
async function loadRegistrations(page = 1, filters = {}) {
  try {
    // TODO: Fetch registrations from server
    const registrations = [
      {
        id: 1,
        user: {
          name: 'Nguyễn Văn A',
          email: 'nguyenvana@example.com',
          avatar: 'https://ui-avatars.com/api/?name=Nguyen+Van+A&background=random'
        },
        event: {
          name: 'Hội thảo Công nghệ 2025',
          start_time: '2025-05-15T09:00:00Z'
        },
        registration_time: '2025-05-01T10:30:00Z',
        status: 'approved',
        checkin_time: '2025-05-15T08:45:00Z',
        checkout_time: '2025-05-15T16:30:00Z'
      }
      // Add more sample registrations...
    ];
    
    renderRegistrations(registrations);
    
  } catch (error) {
    console.error('Error loading registrations:', error);
    alert('Có lỗi xảy ra khi tải danh sách đăng ký');
  }
}

// Render registrations to table
function renderRegistrations(registrations) {
  const tbody = document.querySelector('#registrations-table-body');
  tbody.innerHTML = registrations.map(registration => `
    <tr>
      <td class="px-6 py-4 whitespace-nowrap">
        <div class="flex items-center">
          <div class="flex-shrink-0 h-10 w-10">
            <img class="h-10 w-10 rounded-full object-cover" src="${registration.user.avatar}" alt="${registration.user.name}">
          </div>
          <div class="ml-4">
            <div class="text-sm font-medium text-gray-900">
              ${registration.user.name}
            </div>
            <div class="text-sm text-gray-500">
              ${registration.user.email}
            </div>
          </div>
        </div>
      </td>
      <td class="px-6 py-4">
        <div class="text-sm text-gray-900">${registration.event.name}</div>
        <div class="text-sm text-gray-500">${formatDate(registration.event.start_time)}</div>
      </td>
      <td class="px-6 py-4 whitespace-nowrap">
        <div class="text-sm text-gray-900">${formatDate(registration.registration_time)}</div>
      </td>
      <td class="px-6 py-4 whitespace-nowrap">
        <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(registration.status)}">
          ${getStatusText(registration.status)}
        </span>
      </td>
      <td class="px-6 py-4 whitespace-nowrap">
        <div class="text-sm text-gray-900">
          ${registration.checkin_time ? `
            <div class="flex items-center text-green-600">
              <i class="ri-login-box-line mr-1"></i>
              ${formatTime(registration.checkin_time)}
            </div>
          ` : '-'}
        </div>
        <div class="text-sm text-gray-500">
          ${registration.checkout_time ? `
            <div class="flex items-center text-blue-600">
              <i class="ri-logout-box-line mr-1"></i>
              ${formatTime(registration.checkout_time)}
            </div>
          ` : '-'}
        </div>
      </td>
      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <div class="flex space-x-2">
          <button class="text-primary hover:text-primary/80" title="Xem chi tiết" onclick="viewRegistration(${registration.id})">
            <i class="ri-eye-line"></i>
          </button>
          <button class="text-blue-600 hover:text-blue-800" title="Chỉnh sửa" onclick="editRegistration(${registration.id})">
            <i class="ri-edit-line"></i>
          </button>
          <button class="text-red-600 hover:text-red-800" title="Xóa" onclick="deleteRegistration(${registration.id})">
            <i class="ri-delete-bin-line"></i>
          </button>
        </div>
      </td>
    </tr>
  `).join('');
}

// Helper functions for status display
function getStatusClass(status) {
  switch (status) {
    case 'approved':
      return 'bg-green-100 text-green-800';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'rejected':
      return 'bg-red-100 text-red-800';
    case 'cancelled':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

function getStatusText(status) {
  switch (status) {
    case 'approved':
      return 'Đã duyệt';
    case 'pending':
      return 'Chờ duyệt';
    case 'rejected':
      return 'Từ chối';
    case 'cancelled':
      return 'Đã hủy';
    default:
      return 'Không xác định';
  }
}

// Format date and time
function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function formatTime(dateString) {
  return new Date(dateString).toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit'
  });
}

// Registration actions
function viewRegistration(id) {
  // TODO: Implement view registration details
  console.log('View registration:', id);
}

function editRegistration(id) {
  // TODO: Implement edit registration
  console.log('Edit registration:', id);
}

async function deleteRegistration(id) {
  if (confirm('Bạn có chắc chắn muốn xóa đăng ký này?')) {
    try {
      // TODO: Send delete request to server
      console.log('Delete registration:', id);
      
      // Reload registrations list
      loadRegistrations();
      
    } catch (error) {
      console.error('Error deleting registration:', error);
      alert('Có lỗi xảy ra khi xóa đăng ký');
    }
  }
}

// Handle filters
const searchInput = document.querySelector('input[type="text"]');
const eventFilter = document.querySelector('select:nth-of-type(1)');
const statusFilter = document.querySelector('select:nth-of-type(2)');
const dateFilter = document.querySelector('input[type="date"]');

function handleFilters() {
  const filters = {
    search: searchInput.value,
    event: eventFilter.value,
    status: statusFilter.value,
    date: dateFilter.value
  };
  
  loadRegistrations(1, filters);
}

searchInput.addEventListener('input', handleFilters);
eventFilter.addEventListener('change', handleFilters);
statusFilter.addEventListener('change', handleFilters);
dateFilter.addEventListener('change', handleFilters);

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
  loadRegistrations();
}); 