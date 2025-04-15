// Khởi tạo AOS
AOS.init({ duration: 800, easing: 'ease', once: true });

// Các biến trạng thái cho quản lý cài đặt
let allSettings = []; // Tất cả cài đặt
let filteredSettings = []; // Cài đặt đã lọc

// Biến pagination
const paginationState = {
  currentPage: 1,
  itemsPerPage: 10,
  totalPages: 1
};

// Sự kiện khi DOM đã tải
document.addEventListener('DOMContentLoaded', function() {
  // Xử lý sidebar cho thiết bị di động
  const sidebarOpen = document.getElementById('sidebar-open');
  const sidebarClose = document.getElementById('sidebar-close');
  const sidebar = document.getElementById('sidebar');
  const sidebarBackdrop = document.getElementById('sidebar-backdrop');

  // Mở sidebar
  sidebarOpen?.addEventListener('click', function() {
    sidebar.classList.remove('-translate-x-full');
    sidebarBackdrop.classList.remove('hidden');
    setTimeout(() => {
      sidebarBackdrop.classList.remove('opacity-0');
    }, 50);
  });

  // Đóng sidebar
  function closeSidebar() {
    sidebarBackdrop.classList.add('opacity-0');
    setTimeout(() => {
      sidebar.classList.add('-translate-x-full');
      sidebarBackdrop.classList.add('hidden');
    }, 300);
  }

  sidebarClose?.addEventListener('click', closeSidebar);
  sidebarBackdrop?.addEventListener('click', closeSidebar);

  // Xử lý modal cài đặt
  const createSettingBtn = document.getElementById('create-setting-btn');
  const settingModal = document.getElementById('setting-modal');
  const settingForm = document.getElementById('setting-form');

  // Mở modal cài đặt
  createSettingBtn?.addEventListener('click', function() {
    openSettingModal();
  });

  // Đóng modal cài đặt khi click ra ngoài
  window.addEventListener('click', function(event) {
    if (event.target === settingModal) {
      closeSettingModal();
    }
  });

  // Xử lý submit form
  settingForm?.addEventListener('submit', function(event) {
    event.preventDefault();
    
    // Lấy dữ liệu từ form
    const settingId = document.getElementById('setting_id')?.value;
    const key = document.getElementById('key').value;
    const value = document.getElementById('value').value;
    const classValue = document.getElementById('class').value;
    const type = document.getElementById('type').value;
    const context = document.getElementById('context').value;
    const status = document.getElementById('trang_thai').value;
    
    // Thêm hoặc cập nhật cài đặt
    if (settingId) {
      // Cập nhật cài đặt
      const index = allSettings.findIndex(s => s.id === parseInt(settingId));
      if (index !== -1) {
        allSettings[index] = {
          ...allSettings[index],
          key: key,
          value: value,
          class: classValue,
          type: type,
          context: context || null,
          status: parseInt(status),
          updated_at: new Date().toISOString().slice(0, 19).replace('T', ' ')
        };
      }
      
      alert('Cài đặt đã được cập nhật thành công!');
    } else {
      // Thêm cài đặt mới
      const newSetting = {
        id: allSettings.length > 0 ? Math.max(...allSettings.map(s => s.id)) + 1 : 1,
        key: key,
        value: value,
        class: classValue,
        type: type,
        context: context || null,
        status: parseInt(status),
        created_at: new Date().toISOString().slice(0, 19).replace('T', ' '),
        updated_at: new Date().toISOString().slice(0, 19).replace('T', ' ')
      };
      
      // Thêm vào đầu danh sách
      allSettings.unshift(newSetting);
      alert('Cài đặt mới đã được tạo thành công!');
    }
    
    // Cập nhật bảng và đóng modal
    applyFilters();
    closeSettingModal();
  });

  // Khởi tạo dữ liệu cài đặt
  initSettingsData();

  // Xử lý sự kiện cho các bộ lọc
  const filterForm = document.getElementById('filter-form');
  filterForm?.addEventListener('submit', function(event) {
    event.preventDefault();
    applyFilters();
  });

  // Nút đặt lại bộ lọc
  const resetFilterBtn = document.getElementById('reset-filter-btn');
  resetFilterBtn?.addEventListener('click', function() {
    filterForm.reset();
    applyFilters();
  });

  // Xử lý nút tải lại
  const refreshBtn = document.getElementById('refresh-btn');
  refreshBtn?.addEventListener('click', function() {
    filteredSettings = [...allSettings];
    document.getElementById('filter-search').value = '';
    document.getElementById('filter-category').value = '';
    document.getElementById('filter-status').value = '';
    paginationState.currentPage = 1;
    updatePagination();
    renderTable();
    alert('Đã tải lại dữ liệu!');
  });

  // Xử lý phân trang
  const itemsPerPageSelect = document.getElementById('items-per-page');
  const currentPageInput = document.getElementById('current-page-input');
  const btnFirst = document.querySelector('.btn-first');
  const btnPrev = document.querySelector('.btn-prev');
  const btnNext = document.querySelector('.btn-next');
  const btnLast = document.querySelector('.btn-last');

  // Thay đổi số mục trên mỗi trang
  itemsPerPageSelect?.addEventListener('change', function() {
    paginationState.itemsPerPage = parseInt(this.value);
    paginationState.currentPage = 1;
    updatePagination();
    renderTable();
  });

  // Thay đổi trang hiện tại qua input
  currentPageInput?.addEventListener('change', function() {
    const pageNumber = parseInt(this.value);
    if (pageNumber >= 1 && pageNumber <= paginationState.totalPages) {
      paginationState.currentPage = pageNumber;
      updatePagination();
      renderTable();
    } else {
      this.value = paginationState.currentPage;
    }
  });

  // Các nút điều hướng phân trang
  btnFirst?.addEventListener('click', function() {
    if (paginationState.currentPage > 1) {
      paginationState.currentPage = 1;
      updatePagination();
      renderTable();
    }
  });

  btnPrev?.addEventListener('click', function() {
    if (paginationState.currentPage > 1) {
      paginationState.currentPage--;
      updatePagination();
      renderTable();
    }
  });

  btnNext?.addEventListener('click', function() {
    if (paginationState.currentPage < paginationState.totalPages) {
      paginationState.currentPage++;
      updatePagination();
      renderTable();
    }
  });

  btnLast?.addEventListener('click', function() {
    if (paginationState.currentPage < paginationState.totalPages) {
      paginationState.currentPage = paginationState.totalPages;
      updatePagination();
      renderTable();
    }
  });
});

// Mở modal cài đặt
function openSettingModal(settingId = null) {
  const settingModal = document.getElementById('setting-modal');
  const settingForm = document.getElementById('setting-form');
  const modalTitle = document.querySelector('#setting-modal h3');
  
  // Reset form
  settingForm.reset();
  
  // Xóa hidden field cũ nếu có
  const oldHiddenField = document.getElementById('setting_id');
  if (oldHiddenField) {
    oldHiddenField.remove();
  }
  
  if (settingId) {
    // Chế độ chỉnh sửa
    const setting = allSettings.find(s => s.id === settingId);
    if (setting) {
      // Thêm trường ẩn chứa ID
      const hiddenField = document.createElement('input');
      hiddenField.type = 'hidden';
      hiddenField.id = 'setting_id';
      hiddenField.value = settingId;
      settingForm.appendChild(hiddenField);
      
      // Điền dữ liệu vào form
      document.getElementById('key').value = setting.key;
      document.getElementById('value').value = setting.value;
      document.getElementById('class').value = setting.class;
      document.getElementById('type').value = setting.type;
      document.getElementById('context').value = setting.context || '';
      document.getElementById('trang_thai').value = setting.status;
      
      // Thay đổi tiêu đề modal
      modalTitle.textContent = 'Chỉnh sửa cài đặt';
    }
  } else {
    // Chế độ thêm mới
    modalTitle.textContent = 'Thêm cài đặt mới';
  }
  
  // Hiển thị modal
  settingModal.classList.remove('hidden');
}

// Đóng modal cài đặt
function closeSettingModal() {
  const settingModal = document.getElementById('setting-modal');
  settingModal.classList.add('hidden');
}

// Khởi tạo dữ liệu cài đặt từ mẫu
function initSettingsData() {
  // Phiên làm việc 1: Cài đặt Google
  const session1 = [
    {
      id: 1,
      class: 'Config\\App',
      key: 'GOOGLE_CLIENT_ID',
      value: 'YOUR_GOOGLE_CLIENT_ID_PLACEHOLDER',
      type: 'string',
      context: null,
      status: 1,
      created_at: '2025-03-11 11:01:10',
      updated_at: '2025-03-11 11:01:10'
    },
    {
      id: 2,
      class: 'Config\\App',
      key: 'GOOGLE_CLIENT_SECRET',
      value: 'YOUR_GOOGLE_CLIENT_SECRET_PLACEHOLDER',
      type: 'string',
      context: null,
      status: 1,
      created_at: '2025-03-11 11:01:23',
      updated_at: '2025-03-11 11:01:23'
    },
    {
      id: 3,
      class: 'Config\\App',
      key: 'GOOGLE_REDIRECT_URI',
      value: 'https://muster.vn/google-callback',
      type: 'string',
      context: null,
      status: 1,
      created_at: '2025-03-11 11:01:33',
      updated_at: '2025-03-11 11:01:33'
    }
  ];
  
  // Phiên làm việc 2: Cài đặt khác từ mẫu
  const session2 = [
    {
      id: 4,
      class: 'Config\\App',
      key: 'resetPassWord',
      value: '123456',
      type: 'string',
      context: null,
      status: 1,
      created_at: '2025-03-12 08:32:41',
      updated_at: '2025-03-12 08:34:31'
    },
    {
      id: 5,
      class: 'Config\\App',
      key: 'classTable',
      value: 'table_id',
      type: 'string',
      context: null,
      status: 1,
      created_at: '2025-03-12 11:11:09',
      updated_at: '2025-03-12 11:14:15'
    },
    {
      id: 6,
      class: 'Config\\App',
      key: 'table_id',
      value: 'example2_wrapper',
      type: 'string',
      context: null,
      status: 1,
      created_at: '2025-03-12 11:14:46',
      updated_at: '2025-03-12 11:14:46'
    }
  ];
  
  // Phiên làm việc 3: Cài đặt email
  const session3 = [
    {
      id: 7,
      class: 'Config\\Email',
      key: 'email_driver',
      value: 'smtp',
      type: 'string',
      context: 'email',
      status: 1,
      created_at: '2025-03-15 09:10:22',
      updated_at: '2025-03-15 09:10:22'
    },
    {
      id: 8,
      class: 'Config\\Email',
      key: 'email_host',
      value: 'smtp.gmail.com',
      type: 'string',
      context: 'email',
      status: 1,
      created_at: '2025-03-15 09:11:05',
      updated_at: '2025-03-15 09:11:05'
    },
    {
      id: 9,
      class: 'Config\\Email',
      key: 'email_port',
      value: '587',
      type: 'number',
      context: 'email',
      status: 1,
      created_at: '2025-03-15 09:11:30',
      updated_at: '2025-03-15 09:11:30'
    },
    {
      id: 10,
      class: 'Config\\Email',
      key: 'email_username',
      value: 'noreply@hub.edu.vn',
      type: 'string',
      context: 'email',
      status: 1,
      created_at: '2025-03-15 09:12:15',
      updated_at: '2025-03-15 09:12:15'
    },
    {
      id: 11,
      class: 'Config\\Email',
      key: 'email_password',
      value: 'hub_password_123',
      type: 'string',
      context: 'email',
      status: 1,
      created_at: '2025-03-15 09:13:00',
      updated_at: '2025-03-15 09:13:00'
    }
  ];
  
  // Phiên làm việc 4: Cài đặt bảo mật
  const session4 = [
    {
      id: 12,
      class: 'Config\\Security',
      key: 'login_max_attempts',
      value: '5',
      type: 'number',
      context: 'security',
      status: 1,
      created_at: '2025-03-18 14:22:10',
      updated_at: '2025-03-18 14:22:10'
    },
    {
      id: 13,
      class: 'Config\\Security',
      key: 'login_lockout_time',
      value: '300',
      type: 'number',
      context: 'security',
      status: 1,
      created_at: '2025-03-18 14:23:05',
      updated_at: '2025-03-18 14:23:05'
    },
    {
      id: 14,
      class: 'Config\\Security',
      key: 'force_https',
      value: 'true',
      type: 'boolean',
      context: 'security',
      status: 1,
      created_at: '2025-03-18 14:25:12',
      updated_at: '2025-03-18 14:25:12'
    },
    {
      id: 15,
      class: 'Config\\Security',
      key: 'csrf_protection',
      value: 'true',
      type: 'boolean',
      context: 'security',
      status: 1,
      created_at: '2025-03-18 14:27:30',
      updated_at: '2025-03-18 14:27:30'
    }
  ];
  
  // Phiên làm việc 5: Cài đặt ứng dụng
  const session5 = [
    {
      id: 16,
      class: 'Config\\App',
      key: 'app_name',
      value: 'HUB Banking University',
      type: 'string',
      context: 'general',
      status: 1,
      created_at: '2025-03-20 10:05:18',
      updated_at: '2025-03-20 10:05:18'
    },
    {
      id: 17,
      class: 'Config\\App',
      key: 'app_timezone',
      value: 'Asia/Ho_Chi_Minh',
      type: 'string',
      context: 'general',
      status: 1,
      created_at: '2025-03-20 10:06:22',
      updated_at: '2025-03-20 10:06:22'
    },
    {
      id: 18,
      class: 'Config\\App',
      key: 'app_locale',
      value: 'vi',
      type: 'string',
      context: 'general',
      status: 1,
      created_at: '2025-03-20 10:07:15',
      updated_at: '2025-03-20 10:07:15'
    },
    {
      id: 19,
      class: 'Config\\App',
      key: 'maintenance_mode',
      value: 'false',
      type: 'boolean',
      context: 'general',
      status: 0,
      created_at: '2025-03-20 10:09:30',
      updated_at: '2025-03-20 10:09:30'
    },
    {
      id: 20,
      class: 'Config\\App',
      key: 'debug_mode',
      value: 'false',
      type: 'boolean',
      context: 'general',
      status: 0,
      created_at: '2025-03-20 10:11:45',
      updated_at: '2025-03-20 10:11:45'
    }
  ];
  
  // Kết hợp các phiên làm việc
  allSettings = [...session1, ...session2, ...session3, ...session4, ...session5];
  
  // Áp dụng bộ lọc và hiển thị bảng
  applyFilters();
}

// Áp dụng bộ lọc
function applyFilters() {
  const searchInput = document.getElementById('filter-search')?.value.toLowerCase() || '';
  const categoryFilter = document.getElementById('filter-category')?.value || '';
  const statusFilter = document.getElementById('filter-status')?.value || '';
  
  // Lọc dữ liệu dựa trên các điều kiện
  filteredSettings = allSettings.filter(setting => {
    // Lọc theo tìm kiếm
    const matchSearch = 
      setting.key.toLowerCase().includes(searchInput) || 
      setting.value.toLowerCase().includes(searchInput) ||
      (setting.context && setting.context.toLowerCase().includes(searchInput));
    
    // Lọc theo phân loại
    const matchCategory = !categoryFilter || setting.context === categoryFilter;
    
    // Lọc theo trạng thái
    const matchStatus = statusFilter === '' || setting.status === parseInt(statusFilter);
    
    return matchSearch && matchCategory && matchStatus;
  });
  
  // Cập nhật phân trang và bảng
  paginationState.currentPage = 1;
  updatePagination();
  renderTable();
}

// Cập nhật thông tin phân trang
function updatePagination() {
  const totalItems = filteredSettings.length;
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

// Hiển thị bảng với dữ liệu
function renderTable() {
  const tableBody = document.getElementById('settings-table-body');
  if (!tableBody) return;
  
  // Tính toán vị trí bắt đầu và kết thúc cho trang hiện tại
  const startIndex = (paginationState.currentPage - 1) * paginationState.itemsPerPage;
  const endIndex = Math.min(startIndex + paginationState.itemsPerPage, filteredSettings.length);
  const displayedSettings = filteredSettings.slice(startIndex, endIndex);
  
  // Hiển thị thông báo nếu không có dữ liệu
  if (displayedSettings.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="7" class="px-6 py-4 text-center text-gray-500">
          Không tìm thấy dữ liệu cài đặt nào
        </td>
      </tr>
    `;
    return;
  }
  
  // Tạo HTML cho các dòng trong bảng
  let html = '';
  
  for (const setting of displayedSettings) {
    // Định dạng phân loại
    let categoryName = 'Chưa phân loại';
    let categoryBadge = 'bg-gray-100 text-gray-800';
    
    if (setting.context) {
      switch(setting.context) {
        case 'general':
          categoryName = 'Chung';
          categoryBadge = 'bg-gray-100 text-gray-800';
          break;
        case 'security':
          categoryName = 'Bảo mật';
          categoryBadge = 'bg-red-100 text-red-800';
          break;
        case 'email':
          categoryName = 'Email';
          categoryBadge = 'bg-blue-100 text-blue-800';
          break;
        case 'notification':
          categoryName = 'Thông báo';
          categoryBadge = 'bg-purple-100 text-purple-800';
          break;
        default:
          categoryName = setting.context;
      }
    }
    
    html += `
      <tr>
        <td class="px-4 py-3">
          <div class="flex items-center">
            <div>
              <div class="text-sm font-medium text-gray-900">${setting.key}</div>
              <div class="text-xs text-gray-500">${setting.class}</div>
            </div>
          </div>
        </td>
        <td class="px-4 py-3">
          <div class="text-sm text-gray-900 max-w-xs truncate">${setting.value}</div>
          <div class="text-xs text-gray-500">${setting.type}</div>
        </td>
        <td class="px-4 py-3">
          <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${categoryBadge}">
            ${categoryName}
          </span>
        </td>
        <td class="px-4 py-3">
          <div class="text-sm text-gray-900">${setting.context || '-'}</div>
        </td>
        <td class="px-4 py-3">
          ${
            setting.status === 1 
              ? '<span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Kích hoạt</span>' 
              : '<span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Đã tắt</span>'
          }
        </td>
        <td class="px-4 py-3 text-sm text-gray-500">
          ${formatDate(setting.updated_at)}
        </td>
        <td class="px-4 py-3 text-right text-sm font-medium">
          <button onclick="editSetting(${setting.id})" class="text-indigo-600 hover:text-indigo-900 mr-3">
            <i class="ri-edit-line"></i>
          </button>
          <button onclick="deleteSetting(${setting.id})" class="text-red-600 hover:text-red-900">
            <i class="ri-delete-bin-line"></i>
          </button>
        </td>
      </tr>
    `;
  }
  
  tableBody.innerHTML = html;
}

// Định dạng ngày giờ
function formatDate(dateString) {
  const options = { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Date(dateString).toLocaleString('vi-VN', options);
}

// Xử lý chỉnh sửa cài đặt
function editSetting(id) {
  openSettingModal(id);
}

// Xử lý xóa cài đặt
function deleteSetting(id) {
  if (confirm('Bạn có chắc chắn muốn xóa cài đặt này?')) {
    // Xóa cài đặt khỏi danh sách
    const index = allSettings.findIndex(s => s.id === id);
    if (index !== -1) {
      allSettings.splice(index, 1);
      
      // Cập nhật bảng
      applyFilters();
      
      // Hiển thị thông báo thành công
      alert('Đã xóa cài đặt thành công!');
    }
  }
} 