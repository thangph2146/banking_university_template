// Initialize AOS
AOS.init();

// Pagination configuration
const DEFAULT_PAGE = 1;
const DEFAULT_PER_PAGE = 10;
const PER_PAGE_OPTIONS = [5, 10, 20, 50, 100];
let currentPage = DEFAULT_PAGE;
let currentPerPage = DEFAULT_PER_PAGE;
let totalEvents = 0;
let totalPages = 0;
let events = [];

// Handle sidebar toggle
const sidebarToggle = document.getElementById('sidebar-toggle');
const sidebar = document.getElementById('sidebar');

sidebarToggle.addEventListener('click', () => {
  sidebar.classList.toggle('-translate-x-full');
});

// Handle user menu toggle
const userMenuButton = document.getElementById('user-menu-button');
const userMenu = document.getElementById('user-menu');

if (userMenuButton && userMenu) {
  const showMenu = () => {
    userMenu.classList.remove('invisible', 'opacity-0', 'scale-95');
    userMenu.classList.add('visible', 'opacity-100', 'scale-100');
    userMenuButton.setAttribute('aria-expanded', 'true');
    userMenuButton.querySelector('.ri-arrow-down-s-line').style.transform = 'rotate(180deg)';
  };

  const hideMenu = () => {
    userMenu.classList.add('invisible', 'opacity-0', 'scale-95');
    userMenu.classList.remove('visible', 'opacity-100', 'scale-100');
    userMenuButton.setAttribute('aria-expanded', 'false');
    userMenuButton.querySelector('.ri-arrow-down-s-line').style.transform = 'rotate(0deg)';
  };

  // Toggle menu when clicking the button
  userMenuButton.addEventListener('click', (e) => {
    e.stopPropagation();
    const isExpanded = userMenuButton.getAttribute('aria-expanded') === 'true';
    if (isExpanded) {
      hideMenu();
    } else {
      showMenu();
    }
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!userMenuButton.contains(e.target) && !userMenu.contains(e.target)) {
      hideMenu();
    }
  });

  // Close menu when pressing Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      hideMenu();
    }
  });

  // Handle menu item focus
  const menuItems = userMenu.querySelectorAll('[role="menuitem"]');
  
  menuItems.forEach((item, index) => {
    item.addEventListener('keydown', (e) => {
      const firstItem = menuItems[0];
      const lastItem = menuItems[menuItems.length - 1];
      const nextItem = menuItems[index + 1];
      const prevItem = menuItems[index - 1];

      // Handle arrow keys
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          if (nextItem) nextItem.focus();
          else firstItem.focus();
          break;
        case 'ArrowUp':
          e.preventDefault();
          if (prevItem) prevItem.focus();
          else lastItem.focus();
          break;
        case 'Tab':
          if (!e.shiftKey && !nextItem) {
            e.preventDefault();
            firstItem.focus();
          }
          if (e.shiftKey && !prevItem) {
            e.preventDefault();
            lastItem.focus();
          }
          break;
        case 'Escape':
          e.preventDefault();
          hideMenu();
          userMenuButton.focus();
          break;
      }
    });
  });
}

// Handle event modal
const eventModal = document.getElementById('event-modal');
const createEventBtn = document.getElementById('create-event-btn');
const eventForm = document.getElementById('event-form');

function openEventModal() {
  eventModal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeEventModal() {
  eventModal.classList.add('hidden');
  document.body.style.overflow = 'auto';
  eventForm.reset();
}

createEventBtn.addEventListener('click', openEventModal);

// Close modal when clicking outside
eventModal.addEventListener('click', (e) => {
  if (e.target === eventModal) {
    closeEventModal();
  }
});

// Handle form submission
eventForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  try {
    const formData = new FormData(eventForm);
    const data = Object.fromEntries(formData);
    
    // Add validation here
    if (new Date(data.thoi_gian_ket_thuc) <= new Date(data.thoi_gian_bat_dau)) {
      alert('Thời gian kết thúc phải sau thời gian bắt đầu');
      return;
    }
    
    // TODO: Send data to server
    console.log('Form data:', data);
    
    // Show success message
    alert('Thêm sự kiện thành công!');
    closeEventModal();
    
    // Reload events list
    loadEvents();
    
  } catch (error) {
    console.error('Error submitting form:', error);
    alert('Có lỗi xảy ra khi thêm sự kiện. Vui lòng thử lại!');
  }
});

// Handle file upload preview
const fileUpload = document.getElementById('file-upload');
fileUpload.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    if (file.size > 10 * 1024 * 1024) { // 10MB
      alert('Kích thước file không được vượt quá 10MB');
      fileUpload.value = '';
      return;
    }
    
    if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
      alert('Chỉ chấp nhận file ảnh định dạng JPG, PNG hoặc GIF');
      fileUpload.value = '';
      return;
    }
    
    // TODO: Handle file preview
  }
});

// Handle filters
const searchInput = document.getElementById('search-input');
const eventTypeFilter = document.getElementById('event-type-filter');
const dateFrom = document.getElementById('date-from');
const dateTo = document.getElementById('date-to');
const perPageSelect = document.getElementById('per-page-select');

// Initialize per page select
function initPerPageSelect() {
  if (!perPageSelect) return;
  
  PER_PAGE_OPTIONS.forEach(option => {
    const optionEl = document.createElement('option');
    optionEl.value = option;
    optionEl.textContent = `${option} mục / trang`;
    perPageSelect.appendChild(optionEl);
  });
  
  perPageSelect.value = currentPerPage;
  
  perPageSelect.addEventListener('change', () => {
    currentPerPage = parseInt(perPageSelect.value);
    currentPage = 1; // Reset to first page when changing items per page
    applyFilters();
  });
}

// Add event listeners for filters
searchInput.addEventListener('input', debounce(() => {
  currentPage = 1; // Reset to first page when filtering
  applyFilters();
}, 300));

eventTypeFilter.addEventListener('change', () => {
  currentPage = 1;
  applyFilters();
});

dateFrom.addEventListener('change', () => {
  if (dateTo.value && dateFrom.value > dateTo.value) {
    dateTo.value = dateFrom.value;
  }
  dateTo.min = dateFrom.value;
  currentPage = 1;
  applyFilters();
});

dateTo.addEventListener('change', () => {
  if (dateFrom.value && dateTo.value < dateFrom.value) {
    dateFrom.value = dateTo.value;
  }
  dateFrom.max = dateTo.value;
  currentPage = 1;
  applyFilters();
});

// Debounce helper function
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Apply filters function
function applyFilters() {
  const filters = {
    search: searchInput.value,
    eventType: eventTypeFilter.value,
    dateFrom: dateFrom.value,
    dateTo: dateTo.value,
    perPage: currentPerPage
  };
  loadEvents(currentPage, filters);
}

// Load events from server
async function loadEvents(page = DEFAULT_PAGE, filters = {}) {
  try {
    // TODO: Fetch events from server with filters
    // For demo purposes, we'll filter the sample data locally
    let events = [
      {
        id: 1,
        ten_su_kien: 'Hội thảo Công nghệ 2025',
        don_vi_to_chuc: 'Khoa Công nghệ thông tin',
        thoi_gian_bat_dau: '2025-05-15T08:00',
        thoi_gian_ket_thuc: '2025-05-15T17:00',
        dia_diem: 'Hội trường A',
        co_so: 'Cơ sở 1',
        so_luong_dang_ky: 150,
        so_luong_toi_da: 200,
        loai_su_kien: 'offline',
        hinh_anh: 'https://readdy.ai/api/search-image?query=Tech%20conference%20event&width=80&height=80',
        trang_thai: 'upcoming'
      },
      // Thêm nhiều sự kiện mẫu để test phân trang
      ...Array.from({length: 95}, (_, i) => ({
        id: i + 2,
        ten_su_kien: `Sự kiện mẫu ${i + 2}`,
        don_vi_to_chuc: 'Đơn vị tổ chức',
        thoi_gian_bat_dau: '2025-06-15T08:00',
        thoi_gian_ket_thuc: '2025-06-15T17:00',
        dia_diem: 'Địa điểm',
        co_so: 'Cơ sở',
        so_luong_dang_ky: 100,
        so_luong_toi_da: 150,
        loai_su_kien: 'offline',
        hinh_anh: 'https://readdy.ai/api/search-image?query=Event&width=80&height=80',
        trang_thai: 'upcoming'
      }))
    ];
    
    // Apply filters
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      events = events.filter(event => 
        event.ten_su_kien.toLowerCase().includes(searchTerm) ||
        event.don_vi_to_chuc.toLowerCase().includes(searchTerm)
      );
    }
    
    if (filters.eventType) {
      events = events.filter(event => event.loai_su_kien === filters.eventType);
    }
    
    if (filters.dateFrom) {
      events = events.filter(event => 
        new Date(event.thoi_gian_bat_dau).toISOString().split('T')[0] >= filters.dateFrom
      );
    }
    
    if (filters.dateTo) {
      events = events.filter(event => 
        new Date(event.thoi_gian_bat_dau).toISOString().split('T')[0] <= filters.dateTo
      );
    }

    // Calculate pagination
    totalEvents = events.length;
    totalPages = Math.ceil(totalEvents / currentPerPage);
    
    // Get current page events
    const startIndex = (page - 1) * currentPerPage;
    const endIndex = startIndex + currentPerPage;
    const paginatedEvents = events.slice(startIndex, endIndex);
    
    // Render events and pagination
    renderEvents(paginatedEvents);
    renderPagination();
    updatePaginationInfo();
    
  } catch (error) {
    console.error('Error loading events:', error);
    alert('Có lỗi xảy ra khi tải danh sách sự kiện');
  }
}

// Render events to table
function renderEvents(events) {
  const tbody = document.querySelector('tbody');
  if (!tbody) return;

  // Add fade out animation
  tbody.style.opacity = '0';
  tbody.style.transition = 'opacity 0.3s ease';

  setTimeout(() => {
    tbody.innerHTML = events.map(event => `
      <tr>
        <td class="px-6 py-4 whitespace-nowrap">
          <div class="flex items-center">
            <div class="flex-shrink-0 h-10 w-10">
              <img class="h-10 w-10 rounded-lg object-cover" src="${event.hinh_anh}" alt="${event.ten_su_kien}">
            </div>
            <div class="ml-4">
              <div class="text-sm font-medium text-gray-900">
                ${event.ten_su_kien}
              </div>
              <div class="text-sm text-gray-500">
                ${event.don_vi_to_chuc}
              </div>
            </div>
          </div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
          <div class="text-sm text-gray-900">${new Date(event.thoi_gian_bat_dau).toLocaleDateString('vi-VN')}</div>
          <div class="text-sm text-gray-500">
            ${new Date(event.thoi_gian_bat_dau).toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'})} - 
            ${new Date(event.thoi_gian_ket_thuc).toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'})}
          </div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
          <div class="text-sm text-gray-900">${event.dia_diem}</div>
          <div class="text-sm text-gray-500">${event.co_so}</div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          <div class="flex items-center">
            <i class="ri-user-line mr-1"></i>
            <span>${event.so_luong_dang_ky}/${event.so_luong_toi_da}</span>
          </div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
          <span class="px-2 inline-flex text-xs leading-5 font-semibold ${getStatusClass(event.trang_thai)}">
            ${getStatusText(event.trang_thai)}
          </span>
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
          <div class="flex space-x-2">
            <a href="event-detail.html?id=${event.id}" class="text-primary hover:text-primary/80" title="Xem chi tiết">
              <i class="ri-eye-line"></i>
            </a>
            <a href="event-detail-update.html?id=${event.id}" class="text-blue-600 hover:text-blue-800" title="Chỉnh sửa">
              <i class="ri-edit-line"></i>
            </a>
            <button class="text-red-600 hover:text-red-800" title="Xóa" onclick="deleteEvent(${event.id})">
              <i class="ri-delete-bin-line"></i>
            </button>
          </div>
        </td>
      </tr>
    `).join('');

    // Add fade in animation
    tbody.style.opacity = '1';
  }, 150);
}

// Render pagination
function renderPagination() {
  const pagination = document.querySelector('.pagination');
  if (!pagination) return;

  let html = '';
  
  // Previous button
  html += `
    <a href="#" class="px-3 py-2 rounded-md text-gray-500 hover:bg-primary hover:text-white transition-colors ${currentPage === 1 ? 'opacity-50 pointer-events-none' : ''}" 
       onclick="event.preventDefault(); changePage(${currentPage - 1})" 
       aria-label="Previous page">
      <i class="ri-arrow-left-s-line"></i>
    </a>
  `;

  // Generate page numbers
  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 || // First page
      i === totalPages || // Last page
      (i >= currentPage - 1 && i <= currentPage + 1) // Pages around current page
    ) {
      html += `
        <a href="#" 
           class="px-3 py-2 rounded-md ${i === currentPage ? 'bg-primary text-white' : 'text-gray-700 hover:bg-primary hover:text-white'} transition-colors" 
           onclick="event.preventDefault(); changePage(${i})"
           data-page="${i}">${i}</a>
      `;
    } else if (i === currentPage - 2 || i === currentPage + 2) {
      html += `<span class="px-3 py-2">...</span>`;
    }
  }

  // Next button
  html += `
    <a href="#" class="px-3 py-2 rounded-md text-gray-500 hover:bg-primary hover:text-white transition-colors ${currentPage === totalPages ? 'opacity-50 pointer-events-none' : ''}" 
       onclick="event.preventDefault(); changePage(${currentPage + 1})" 
       aria-label="Next page">
      <i class="ri-arrow-right-s-line"></i>
    </a>
  `;

  pagination.innerHTML = html;
}

// Update pagination info
function updatePaginationInfo() {
  const info = document.querySelector('.pagination-info');
  if (!info) return;

  const startItem = (currentPage - 1) * currentPerPage + 1;
  const endItem = Math.min(currentPage * currentPerPage, totalEvents);

  info.innerHTML = `
    Hiển thị <span class="font-medium">${startItem}</span> đến 
    <span class="font-medium">${endItem}</span> trong số 
    <span class="font-medium">${totalEvents}</span> kết quả
  `;
}

// Change page with animation
function changePage(newPage) {
  if (newPage < 1 || newPage > totalPages || newPage === currentPage) return;
  currentPage = newPage;
  applyFilters();
}

// Helper functions for status display
function getStatusClass(status) {
  switch (status) {
    case 'upcoming':
      return 'bg-green-100 text-green-800';
    case 'ongoing':
      return 'bg-blue-100 text-blue-800';
    case 'completed':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

function getStatusText(status) {
  switch (status) {
    case 'upcoming':
      return 'Sắp diễn ra';
    case 'ongoing':
      return 'Đang diễn ra';
    case 'completed':
      return 'Đã kết thúc';
    default:
      return 'Không xác định';
  }
}

// Event actions
function viewEvent(id) {
  window.location.href = `event-detail.html?id=${id}`;
}

function editEvent(id) {
  window.location.href = `event-detail-update.html?id=${id}`;
}

async function deleteEvent(id) {
  if (confirm('Bạn có chắc chắn muốn xóa sự kiện này?')) {
    try {
      // TODO: Send delete request to server
      console.log('Delete event:', id);
      
      // Reload events list
      loadEvents(currentPage);
      
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Có lỗi xảy ra khi xóa sự kiện');
    }
  }
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
  initPerPageSelect();
  loadEvents();
});
