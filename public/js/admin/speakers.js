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

// Handle speaker modal
const speakerModal = document.getElementById('speaker-modal');
const createSpeakerBtn = document.getElementById('create-speaker-btn');
const speakerForm = document.getElementById('speaker-form');

function openSpeakerModal() {
  speakerModal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeSpeakerModal() {
  speakerModal.classList.add('hidden');
  document.body.style.overflow = 'auto';
  speakerForm.reset();
}

createSpeakerBtn.addEventListener('click', openSpeakerModal);

// Close modal when clicking outside
speakerModal.addEventListener('click', (e) => {
  if (e.target === speakerModal) {
    closeSpeakerModal();
  }
});

// Handle form submission
speakerForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  try {
    const formData = new FormData(speakerForm);
    const data = Object.fromEntries(formData);
    
    // Handle social media links
    data.mang_xa_hoi = {
      linkedin: data.linkedin || null,
      facebook: data.facebook || null,
      twitter: data.twitter || null
    };
    
    // Remove individual social media fields
    delete data.linkedin;
    delete data.facebook;
    delete data.twitter;
    
    // Handle avatar upload
    const avatarFile = formData.get('avatar');
    if (avatarFile && avatarFile.size > 0) {
      if (avatarFile.size > 2 * 1024 * 1024) { // 2MB
        alert('Kích thước ảnh không được vượt quá 2MB');
        return;
      }
      
      if (!['image/jpeg', 'image/png'].includes(avatarFile.type)) {
        alert('Chỉ chấp nhận file ảnh định dạng JPG hoặc PNG');
        return;
      }
      
      // TODO: Upload avatar to server
      console.log('Avatar file:', avatarFile);
    }
    
    // TODO: Send data to server
    console.log('Form data:', data);
    
    // Show success message
    alert('Thêm diễn giả thành công!');
    closeSpeakerModal();
    
    // Reload speakers list
    loadSpeakers();
    
  } catch (error) {
    console.error('Error submitting form:', error);
    alert('Có lỗi xảy ra khi thêm diễn giả. Vui lòng thử lại!');
  }
});

// Load speakers from server
async function loadSpeakers(page = 1, filters = {}) {
  try {
    // TODO: Fetch speakers from server
    const speakers = [
      {
        id: 1,
        ten_dien_gia: 'TS. Nguyễn Văn A',
        chuc_danh: 'Tiến sĩ',
        to_chuc: 'Đại học ABC',
        email: 'nguyenvana@abc.edu.vn',
        dien_thoai: '0123456789',
        chuyen_mon: 'Công nghệ thông tin, Trí tuệ nhân tạo',
        so_su_kien_tham_gia: 5,
        status: 1,
        avatar: 'https://ui-avatars.com/api/?name=Nguyen+Van+A&background=random'
      }
      // Add more sample speakers...
    ];
    
    renderSpeakers(speakers);
    
  } catch (error) {
    console.error('Error loading speakers:', error);
    alert('Có lỗi xảy ra khi tải danh sách diễn giả');
  }
}

// Render speakers to table
function renderSpeakers(speakers) {
  const tbody = document.querySelector('#speakers-table-body');
  tbody.innerHTML = speakers.map(speaker => `
    <tr>
      <td class="px-6 py-4 whitespace-nowrap">
        <div class="flex items-center">
          <div class="flex-shrink-0 h-10 w-10">
            <img class="h-10 w-10 rounded-full object-cover" src="${speaker.avatar}" alt="${speaker.ten_dien_gia}">
          </div>
          <div class="ml-4">
            <div class="text-sm font-medium text-gray-900">
              ${speaker.ten_dien_gia}
            </div>
            <div class="text-sm text-gray-500">
              ${speaker.chuc_danh || ''}
            </div>
          </div>
        </div>
      </td>
      <td class="px-6 py-4 whitespace-nowrap">
        <div class="text-sm text-gray-900">${speaker.email}</div>
        <div class="text-sm text-gray-500">${speaker.dien_thoai || 'Chưa cập nhật'}</div>
      </td>
      <td class="px-6 py-4">
        <div class="text-sm text-gray-900">${speaker.chuyen_mon}</div>
        <div class="text-sm text-gray-500">${speaker.to_chuc}</div>
      </td>
      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        <div class="flex items-center">
          <i class="ri-calendar-event-line mr-1"></i>
          <span>${speaker.so_su_kien_tham_gia} sự kiện</span>
        </div>
      </td>
      <td class="px-6 py-4 whitespace-nowrap">
        <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(speaker.status)}">
          ${getStatusText(speaker.status)}
        </span>
      </td>
      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <div class="flex space-x-2">
          <button class="text-primary hover:text-primary/80" title="Xem chi tiết" onclick="viewSpeaker(${speaker.id})">
            <i class="ri-eye-line"></i>
          </button>
          <button class="text-blue-600 hover:text-blue-800" title="Chỉnh sửa" onclick="editSpeaker(${speaker.id})">
            <i class="ri-edit-line"></i>
          </button>
          <button class="text-red-600 hover:text-red-800" title="Xóa" onclick="deleteSpeaker(${speaker.id})">
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
    case 1:
      return 'bg-green-100 text-green-800';
    case 0:
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

function getStatusText(status) {
  switch (status) {
    case 1:
      return 'Đang hoạt động';
    case 0:
      return 'Không hoạt động';
    default:
      return 'Không xác định';
  }
}

// Speaker actions
function viewSpeaker(id) {
  // TODO: Implement view speaker details
  console.log('View speaker:', id);
}

function editSpeaker(id) {
  // TODO: Implement edit speaker
  console.log('Edit speaker:', id);
}

async function deleteSpeaker(id) {
  if (confirm('Bạn có chắc chắn muốn xóa diễn giả này?')) {
    try {
      // TODO: Send delete request to server
      console.log('Delete speaker:', id);
      
      // Reload speakers list
      loadSpeakers();
      
    } catch (error) {
      console.error('Error deleting speaker:', error);
      alert('Có lỗi xảy ra khi xóa diễn giả');
    }
  }
}

// Handle avatar upload preview
const avatarUpload = document.getElementById('avatar-upload');
avatarUpload.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    if (file.size > 2 * 1024 * 1024) { // 2MB
      alert('Kích thước ảnh không được vượt quá 2MB');
      avatarUpload.value = '';
      return;
    }
    
    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      alert('Chỉ chấp nhận file ảnh định dạng JPG hoặc PNG');
      avatarUpload.value = '';
      return;
    }
    
    // TODO: Show image preview
  }
});

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
  loadSpeakers();
}); 