/**
 * Quản lý trang chi tiết người dùng
 */

document.addEventListener('DOMContentLoaded', function() {
  // Khởi tạo hiệu ứng AOS
  AOS.init();
  
  // Lấy tất cả các button tab và nội dung tab
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');
  
  // Hàm chuyển đổi tab
  function switchTab(tabId) {
    // Bỏ active tất cả các tab button
    tabButtons.forEach(button => {
      button.classList.remove('active', 'border-primary', 'text-primary');
      button.classList.add('border-transparent', 'text-gray-500');
      button.setAttribute('aria-selected', 'false');
    });
    
    // Ẩn tất cả nội dung tab
    tabContents.forEach(content => {
      content.style.opacity = '0';
      setTimeout(() => {
        if (content.id !== `tab-${tabId}`) {
          content.classList.add('hidden');
          content.setAttribute('aria-hidden', 'true');
        }
      }, 100);
    });
    
    // Active tab hiện tại
    const currentButton = document.querySelector(`.tab-btn[data-tab="${tabId}"]`);
    if (currentButton) {
      currentButton.classList.remove('border-transparent', 'text-gray-500');
      currentButton.classList.add('active', 'border-primary', 'text-primary');
      currentButton.setAttribute('aria-selected', 'true');
    }
    
    // Hiển thị nội dung tab hiện tại với animation
    const currentContent = document.getElementById(`tab-${tabId}`);
    if (currentContent) {
      if (currentContent.classList.contains('hidden')) {
        currentContent.classList.remove('hidden');
        setTimeout(() => {
          currentContent.style.opacity = '1';
          currentContent.setAttribute('aria-hidden', 'false');
        }, 10);
      } else {
        currentContent.style.opacity = '1';
        currentContent.setAttribute('aria-hidden', 'false');
      }
    }
  }
  
  // Khởi tạo event listeners cho tab
  function initTabs() {
    const savedTab = localStorage.getItem('selectedUserDetailTab');
    
    tabButtons.forEach(button => {
      button.addEventListener('click', () => {
        const tabId = button.getAttribute('data-tab');
        switchTab(tabId);
        localStorage.setItem('selectedUserDetailTab', tabId);
      });
    });
    
    // Khởi tạo tab mặc định hoặc tab đã lưu
    if (savedTab && document.querySelector(`.tab-btn[data-tab="${savedTab}"]`)) {
      switchTab(savedTab);
    } else if (tabButtons.length > 0) {
      const defaultTab = tabButtons[0].getAttribute('data-tab');
      switchTab(defaultTab);
      localStorage.setItem('selectedUserDetailTab', defaultTab);
    }
  }
  
  // Đặt opacity cho tab content ban đầu
  tabContents.forEach(content => {
    content.style.opacity = content.id === 'tab-basic-info' ? '1' : '0';
  });
  
  // Khởi tạo tabs
  initTabs();
  
  // Xử lý nút quay lại
  const backButton = document.getElementById('back-btn');
  if (backButton) {
    backButton.addEventListener('click', () => window.location.href = 'users.html');
  }

  // Lấy dữ liệu người dùng từ API (giả lập)
  fetchUserData();
  
  // Lấy danh sách sự kiện đã tham gia
  fetchUserEvents();
  
  // Lấy lịch sử hoạt động
  fetchUserActivities();

  // Ẩn loading overlay sau khi tất cả dữ liệu đã được tải
  const loadingOverlay = document.getElementById('loading-overlay');
  if (loadingOverlay) {
    setTimeout(() => {
      loadingOverlay.style.display = 'none';
    }, 800);
  }

  // --- Mobile Sidebar Toggle --- 
  const sidebar = document.getElementById('sidebar');
  const sidebarOpenBtn = document.getElementById('sidebar-open');
  const sidebarCloseBtn = document.getElementById('sidebar-close');
  const sidebarBackdrop = document.getElementById('sidebar-backdrop');

  function openSidebar() {
    if (sidebar && sidebarBackdrop) {
      sidebar.classList.remove('-translate-x-full');
      sidebarBackdrop.classList.remove('hidden');
      sidebarBackdrop.classList.add('opacity-100'); // Fade in backdrop
    }
  }

  function closeSidebar() {
    if (sidebar && sidebarBackdrop) {
      sidebar.classList.add('-translate-x-full');
      sidebarBackdrop.classList.remove('opacity-100'); // Fade out backdrop
      setTimeout(() => {
        sidebarBackdrop.classList.add('hidden');
      }, 300);
    }
  }

  if (sidebarOpenBtn) sidebarOpenBtn.addEventListener('click', openSidebar);
  if (sidebarCloseBtn) sidebarCloseBtn.addEventListener('click', closeSidebar);
  if (sidebarBackdrop) sidebarBackdrop.addEventListener('click', closeSidebar);
});

/**
 * Lấy dữ liệu người dùng (giả lập)
 */
function fetchUserData() {
  // Trong thực tế, sẽ gọi API để lấy dữ liệu người dùng
  // Giả lập dữ liệu cho mục đích demo
  const userId = getUserIdFromUrl();
  
  // Giả lập thời gian tải dữ liệu
  setTimeout(() => {
    // Dữ liệu mẫu
    const userData = {
      id: userId,
      LastName: 'Nguyễn',
      MiddleName: 'Văn',
      FirstName: 'A',
      FullName: 'Nguyễn Văn A',
      Email: 'nguyenvana@example.com',
      MobilePhone: '0987654321',
      HomePhone: '0123456789',
      AccountId: 'SV12345',
      AccountType: 'Local',
      status: 1,
      last_login: '2024-06-12 15:30:00',
      
      // Thông tin học thuật
      loai_nguoi_dung: {
        id: 1,
        ten_loai: 'Sinh viên'
      },
      phong_khoa: {
        id: 1,
        ten_phong_khoa: 'Khoa Công nghệ thông tin'
      },
      nam_hoc: {
        id: 1,
        ten_nam_hoc: '2023-2024'
      },
      bac_hoc: {
        id: 1,
        ten_bac_hoc: 'Đại học'
      },
      he_dao_tao: {
        id: 1,
        ten_he_dao_tao: 'Chính quy'
      },
      nganh: {
        id: 1,
        ten_nganh: 'Công nghệ thông tin'
      }
    };
    
    // Điền dữ liệu vào trang
    updateUserInfo(userData);
  }, 500);
}

/**
 * Lấy danh sách sự kiện người dùng đã tham gia (giả lập)
 */
function fetchUserEvents() {
  // Giả lập dữ liệu các sự kiện đã tham gia
  setTimeout(() => {
    const events = [
      {
        id: 1,
        name: 'Hội thảo Công nghệ thông tin 2024',
        start_time: '2024-06-01 09:00:00',
        end_time: '2024-06-01 17:00:00',
        check_in_time: '2024-06-01 08:45:00',
        check_out_time: '2024-06-01 17:10:00',
        duration_minutes: 490
      },
      {
        id: 2,
        name: 'Workshop Trí tuệ nhân tạo',
        start_time: '2024-05-15 14:00:00',
        end_time: '2024-05-15 17:00:00',
        check_in_time: '2024-05-15 13:50:00',
        check_out_time: '2024-05-15 17:05:00',
        duration_minutes: 195
      },
      {
        id: 3,
        name: 'Chào tân sinh viên 2023',
        start_time: '2023-09-10 08:00:00',
        end_time: '2023-09-10 11:30:00',
        check_in_time: '2023-09-10 07:50:00',
        check_out_time: '2023-09-10 11:45:00',
        duration_minutes: 235
      }
    ];
    
    // Điền dữ liệu vào bảng
    updateEventsList(events);
  }, 600);
}

/**
 * Lấy lịch sử hoạt động người dùng (giả lập)
 */
function fetchUserActivities() {
  // Giả lập dữ liệu lịch sử hoạt động
  setTimeout(() => {
    const activities = [
      {
        id: 1,
        type: 'login',
        description: 'Đăng nhập vào hệ thống',
        timestamp: '2024-06-12 15:30:00',
        device: 'Chrome trên Windows',
        ip_address: '192.168.1.100'
      },
      {
        id: 2,
        type: 'event_register',
        description: 'Đăng ký tham gia sự kiện "Hội thảo Khởi nghiệp"',
        timestamp: '2024-06-10 09:15:00',
        device: 'Chrome trên Windows',
        ip_address: '192.168.1.100'
      },
      {
        id: 3,
        type: 'profile_update',
        description: 'Cập nhật thông tin cá nhân',
        timestamp: '2024-06-05 11:20:00',
        device: 'Firefox trên Windows',
        ip_address: '192.168.1.100'
      },
      {
        id: 4,
        type: 'event_checkin',
        description: 'Check-in sự kiện "Workshop Trí tuệ nhân tạo"',
        timestamp: '2024-05-15 13:50:00',
        device: 'Safari trên iOS',
        ip_address: '192.168.2.200'
      },
      {
        id: 5,
        type: 'event_checkout',
        description: 'Check-out sự kiện "Workshop Trí tuệ nhân tạo"',
        timestamp: '2024-05-15 17:05:00',
        device: 'Safari trên iOS',
        ip_address: '192.168.2.200'
      }
    ];
    
    // Điền dữ liệu vào danh sách hoạt động
    updateActivitiesList(activities);
  }, 700);
}

/**
 * Cập nhật thông tin người dùng trên giao diện
 */
function updateUserInfo(userData) {
  // Cập nhật tên và vai trò ở header
  document.getElementById('user-name').textContent = userData.FullName;
  document.getElementById('user-role').textContent = `${userData.loai_nguoi_dung.ten_loai} • ${userData.phong_khoa.ten_phong_khoa}`;
  
  // Cập nhật thông tin cá nhân
  document.getElementById('user-lastname').textContent = userData.LastName;
  document.getElementById('user-middlename').textContent = userData.MiddleName;
  document.getElementById('user-firstname').textContent = userData.FirstName;
  document.getElementById('user-fullname').textContent = userData.FullName;
  document.getElementById('user-email').textContent = userData.Email;
  document.getElementById('user-phone').textContent = userData.MobilePhone;
  document.getElementById('user-homephone').textContent = userData.HomePhone || 'Không có';
  document.getElementById('user-type').textContent = userData.loai_nguoi_dung.ten_loai;
  document.getElementById('user-accountid').textContent = userData.AccountId;
  document.getElementById('user-accounttype').textContent = userData.AccountType;
  
  // Cập nhật trạng thái
  const statusElement = document.getElementById('user-status');
  if (userData.status === 1) {
    statusElement.innerHTML = `
      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
        <span class="h-2 w-2 rounded-full bg-green-400 mr-1.5"></span>
        Đang hoạt động
      </span>
    `;
  } else {
    statusElement.innerHTML = `
      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
        <span class="h-2 w-2 rounded-full bg-gray-400 mr-1.5"></span>
        Vô hiệu hóa
      </span>
    `;
  }
  
  // Cập nhật thời gian đăng nhập gần nhất
  document.getElementById('user-lastlogin').textContent = formatDateTime(userData.last_login);
  
  // Cập nhật thông tin học thuật
  document.getElementById('user-department').textContent = userData.phong_khoa.ten_phong_khoa;
  document.getElementById('user-academic-year').textContent = userData.nam_hoc.ten_nam_hoc;
  document.getElementById('user-academic-level').textContent = userData.bac_hoc.ten_bac_hoc;
  document.getElementById('user-education-system').textContent = userData.he_dao_tao.ten_he_dao_tao;
  document.getElementById('user-major').textContent = userData.nganh.ten_nganh;
  
  // Cập nhật liên kết chỉnh sửa
  document.querySelector('a[href^="user-edit.html"]').href = `user-edit.html?id=${userData.id}`;
}

/**
 * Cập nhật danh sách sự kiện đã tham gia
 */
function updateEventsList(events) {
  const eventsListElement = document.getElementById('events-list');
  
  if (events.length === 0) {
    eventsListElement.innerHTML = `
      <tr>
        <td colspan="6" class="px-6 py-4 text-center text-gray-500">
          Người dùng chưa tham gia sự kiện nào
        </td>
      </tr>
    `;
    return;
  }
  
  let html = '';
  events.forEach(event => {
    html += `
      <tr>
        <td class="px-6 py-4 whitespace-nowrap">
          <div class="flex items-center">
            <div>
              <div class="text-sm font-medium text-gray-900">${event.name}</div>
            </div>
          </div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
          <div class="text-sm text-gray-900">${formatDateTime(event.start_time)}</div>
          <div class="text-sm text-gray-500">đến ${formatDateTime(event.end_time)}</div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
          <div class="text-sm text-gray-900">${formatDateTime(event.check_in_time)}</div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
          <div class="text-sm text-gray-900">${formatDateTime(event.check_out_time)}</div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          ${formatDuration(event.duration_minutes)}
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
          <a href="event-detail.html?id=${event.id}" class="text-primary hover:text-primary-dark">Xem chi tiết</a>
        </td>
      </tr>
    `;
  });
  
  eventsListElement.innerHTML = html;
}

/**
 * Cập nhật danh sách lịch sử hoạt động
 */
function updateActivitiesList(activities) {
  const activitiesListElement = document.getElementById('activity-list');
  
  if (activities.length === 0) {
    activitiesListElement.innerHTML = `
      <div class="text-center text-gray-500 py-6">
        Không có hoạt động nào được ghi nhận
      </div>
    `;
    return;
  }
  
  let html = '';
  activities.forEach(activity => {
    // Xác định màu và biểu tượng dựa trên loại hoạt động
    let iconClass, bgColorClass;
    switch (activity.type) {
      case 'login':
        iconClass = 'ri-login-circle-line';
        bgColorClass = 'bg-blue-500';
        break;
      case 'logout':
        iconClass = 'ri-logout-circle-line';
        bgColorClass = 'bg-gray-500';
        break;
      case 'event_register':
        iconClass = 'ri-calendar-event-line';
        bgColorClass = 'bg-purple-500';
        break;
      case 'profile_update':
        iconClass = 'ri-user-settings-line';
        bgColorClass = 'bg-yellow-500';
        break;
      case 'event_checkin':
        iconClass = 'ri-login-box-line';
        bgColorClass = 'bg-green-500';
        break;
      case 'event_checkout':
        iconClass = 'ri-logout-box-line';
        bgColorClass = 'bg-red-500';
        break;
      default:
        iconClass = 'ri-information-line';
        bgColorClass = 'bg-gray-500';
    }
    
    html += `
      <div class="flex gap-4">
        <div class="flex-none">
          <div class="relative flex items-center justify-center w-12 h-12 rounded-full ${bgColorClass} text-white z-10">
            <i class="${iconClass} text-xl"></i>
          </div>
        </div>
        <div class="flex-grow">
          <h3 class="text-lg font-medium">${activity.description}</h3>
          <div class="text-sm text-gray-500 mt-1">
            <div class="flex items-center space-x-4">
              <span><i class="ri-time-line mr-1"></i>${formatDateTime(activity.timestamp)}</span>
              <span><i class="ri-computer-line mr-1"></i>${activity.device}</span>
              <span><i class="ri-global-line mr-1"></i>${activity.ip_address}</span>
            </div>
          </div>
        </div>
      </div>
    `;
  });
  
  activitiesListElement.innerHTML = html;
}

/**
 * Lấy ID người dùng từ URL
 */
function getUserIdFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('id') || '1'; // Mặc định là 1 nếu không có ID
}

/**
 * Format thời gian dạng ISO sang dạng DD/MM/YYYY HH:MM
 */
function formatDateTime(isoDateString) {
  if (!isoDateString) return 'N/A';
  
  const date = new Date(isoDateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  
  return `${day}/${month}/${year} ${hours}:${minutes}`;
}

/**
 * Format thời lượng tham gia (minutes) sang dạng giờ:phút
 */
function formatDuration(minutes) {
  if (!minutes && minutes !== 0) return 'N/A';
  
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours > 0) {
    return `${hours} giờ ${mins} phút`;
  } else {
    return `${mins} phút`;
  }
} 