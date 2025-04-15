/**
 * Quản lý trang chi tiết diễn giả
 */

// Biến lưu trữ dữ liệu diễn giả
let currentSpeaker = {};
let socialLinks = {};

// Hàm khởi tạo khi tài liệu đã sẵn sàng
document.addEventListener('DOMContentLoaded', () => {
  // Gọi hàm khởi tạo chính
  init();
});

/**
 * Khởi tạo điều hướng tab
 */
const initTabs = () => {
  // Lấy tất cả các button tab và nội dung tab
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');
  
  // Hàm chuyển đổi tab
  const switchTab = (tabId) => {
    // Bỏ active tất cả các tab button
    tabButtons.forEach(button => {
      button.classList.remove('active', 'text-primary', 'border-primary');
      button.classList.add('text-gray-500', 'border-transparent');
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
      currentButton.classList.remove('text-gray-500', 'border-transparent');
      currentButton.classList.add('active', 'text-primary', 'border-primary');
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
    
    // Lưu tab hiện tại vào localStorage
    localStorage.setItem('selectedSpeakerTab', tabId);
  };
  
  // Khởi tạo event listeners cho tab
  const savedTab = localStorage.getItem('selectedSpeakerTab');
  
  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const tabId = button.getAttribute('data-tab');
      switchTab(tabId);
    });
  });
  
  // Khởi tạo tab mặc định hoặc tab đã lưu
  if (savedTab && document.querySelector(`.tab-btn[data-tab="${savedTab}"]`)) {
    switchTab(savedTab);
  } else if (tabButtons.length > 0) {
    const defaultTab = tabButtons[0].getAttribute('data-tab');
    switchTab(defaultTab);
  }
  
  // Đặt opacity cho tab content ban đầu
  tabContents.forEach(content => {
    content.style.opacity = content.id === 'tab-basic-info' ? '1' : '0';
  });
  
  // Hàm chuyển tab theo index
  const switchTabByIndex = (index) => {
    if (index >= 0 && index < tabButtons.length) {
      const tabId = tabButtons[index].getAttribute('data-tab');
      switchTab(tabId);
    }
  };
  
  // Thêm phím tắt để điều hướng tab
  window.addEventListener('keydown', (e) => {
    // Alt + số để chuyển tab
    if (e.altKey && e.key >= '1' && e.key <= `${tabButtons.length}`) {
      e.preventDefault();
      const tabIndex = parseInt(e.key) - 1;
      switchTabByIndex(tabIndex);
    }
  });
};

/**
 * Khởi tạo nút quay lại
 */
const initBackButton = () => {
  const backButton = document.getElementById('back-btn');
  if (backButton) {
    backButton.addEventListener('click', () => window.location.href = 'speakers.html');
  }
};

/**
 * Khởi tạo modal xóa diễn giả
 */
const initDeleteModal = () => {
  const deleteButtons = document.querySelectorAll('#delete-button, #delete-button-sidebar');
  const deleteModal = document.getElementById('delete-modal');
  const cancelButton = document.getElementById('cancel-delete');
  const confirmButton = document.getElementById('confirm-delete');
  
  // Hàm mở modal xóa
  const openDeleteModal = () => {
    if (deleteModal) {
      deleteModal.classList.remove('hidden');
      deleteModal.classList.add('flex');
    }
  };
  
  // Hàm đóng modal xóa
  const closeDeleteModal = () => {
    if (deleteModal) {
      deleteModal.classList.add('hidden');
      deleteModal.classList.remove('flex');
    }
  };
  
  // Đăng ký sự kiện cho các nút
  deleteButtons.forEach(button => {
    if (button) {
      button.addEventListener('click', openDeleteModal);
    }
  });
  
  if (cancelButton) {
    cancelButton.addEventListener('click', closeDeleteModal);
  }
  
  // Xử lý xóa diễn giả
  if (confirmButton) {
    confirmButton.addEventListener('click', () => {
      // Lấy ID diễn giả từ URL
      const urlParams = new URLSearchParams(window.location.search);
      const speakerId = urlParams.get('id');
      
      if (speakerId) {
        // Hiển thị thông báo đang xử lý
        showNotification('Đang xóa diễn giả...', 'info');
        
        // Giả lập API call xóa diễn giả
        setTimeout(() => {
          closeDeleteModal();
          
          // Hiển thị thông báo thành công
          showNotification('Xóa diễn giả thành công!', 'success');
          
          // Chuyển hướng sau 1.5 giây
          setTimeout(() => {
            window.location.href = 'speakers.html';
          }, 1500);
        }, 800);
      }
    });
  }
};

/**
 * Khởi tạo sidebar
 */
const initSidebar = () => {
  const sidebar = document.getElementById('sidebar');
  const sidebarOpen = document.getElementById('sidebar-open');
  const sidebarClose = document.getElementById('sidebar-close');
  const sidebarBackdrop = document.getElementById('sidebar-backdrop');
  
  // Hàm mở sidebar
  const openSidebar = () => {
    if (sidebar && sidebarBackdrop) {
      sidebar.classList.remove('-translate-x-full');
      sidebarBackdrop.classList.remove('hidden');
      setTimeout(() => {
        sidebarBackdrop.classList.add('opacity-100');
      }, 100);
    }
  };
  
  // Hàm đóng sidebar
  const closeSidebar = () => {
    if (sidebar && sidebarBackdrop) {
      sidebar.classList.add('-translate-x-full');
      sidebarBackdrop.classList.remove('opacity-100');
      setTimeout(() => {
        sidebarBackdrop.classList.add('hidden');
      }, 300);
    }
  };
  
  // Đăng ký sự kiện
  if (sidebarOpen) sidebarOpen.addEventListener('click', openSidebar);
  if (sidebarClose) sidebarClose.addEventListener('click', closeSidebar);
  if (sidebarBackdrop) sidebarBackdrop.addEventListener('click', closeSidebar);
};

/**
 * Ẩn loading overlay
 */
const hideLoadingOverlay = () => {
  const loadingOverlay = document.getElementById('loading-overlay');
  if (loadingOverlay) {
    setTimeout(() => {
      loadingOverlay.style.opacity = '0';
      setTimeout(() => {
        loadingOverlay.style.display = 'none';
      }, 300);
    }, 500);
  }
};

/**
 * Hiển thị thông báo
 */
const showNotification = (message, type = 'success') => {
  const notification = document.getElementById('notification');
  const notificationMessage = document.getElementById('notification-message');
  
  // Kiểm tra xem có phần tử thông báo trong DOM không
  if (!notification || !notificationMessage) {
    // Tạo thông báo nếu không có sẵn
    const newNotification = document.createElement('div');
    newNotification.id = 'notification';
    newNotification.className = 'fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg transform transition-transform duration-300 translate-x-full';
    
    const newMessage = document.createElement('div');
    newMessage.id = 'notification-message';
    
    // Thêm icon tùy thuộc vào loại thông báo
    let icon = '';
    switch (type) {
      case 'success':
        icon = '<i class="ri-check-line mr-2"></i>';
        break;
      case 'error':
        icon = '<i class="ri-error-warning-line mr-2"></i>';
        break;
      case 'warning':
        icon = '<i class="ri-alert-line mr-2"></i>';
        break;
      default:
        icon = '<i class="ri-information-line mr-2"></i>';
    }
    
    newMessage.innerHTML = icon + message;
    newNotification.appendChild(newMessage);
    document.body.appendChild(newNotification);
    
    // Áp dụng màu sắc dựa trên loại thông báo
    switch (type) {
      case 'success':
        newNotification.classList.add('bg-green-500', 'text-white');
        break;
      case 'error':
        newNotification.classList.add('bg-red-500', 'text-white');
        break;
      case 'warning':
        newNotification.classList.add('bg-yellow-500', 'text-white');
        break;
      default:
        newNotification.classList.add('bg-blue-500', 'text-white');
    }
    
    // Hiển thị thông báo
    setTimeout(() => {
      newNotification.classList.remove('translate-x-full');
      newNotification.classList.add('translate-x-0');
      
      // Tự động ẩn thông báo sau 3 giây
      setTimeout(() => {
        newNotification.classList.remove('translate-x-0');
        newNotification.classList.add('translate-x-full');
        
        // Xóa thông báo sau khi ẩn
        setTimeout(() => {
          document.body.removeChild(newNotification);
        }, 300);
      }, 3000);
    }, 10);
    
    return;
  }
  
  // Cập nhật thông báo hiện có
  notificationMessage.textContent = message;
  
  // Thay đổi màu sắc thông báo dựa trên loại
  notification.className = 'fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg transform transition-transform duration-300';
  
  switch(type) {
    case 'success':
      notification.classList.add('bg-green-500', 'text-white');
      break;
    case 'error':
      notification.classList.add('bg-red-500', 'text-white');
      break;
    case 'warning':
      notification.classList.add('bg-yellow-500', 'text-white');
      break;
    default:
      notification.classList.add('bg-blue-500', 'text-white');
  }
  
  // Hiển thị thông báo
  notification.classList.remove('translate-x-full');
  notification.classList.add('translate-x-0');
  
  // Tự động ẩn thông báo sau 3 giây
  setTimeout(() => {
    notification.classList.remove('translate-x-0');
    notification.classList.add('translate-x-full');
  }, 3000);
};

/**
 * Tải dữ liệu diễn giả từ ID trong URL
 */
const loadSpeakerData = () => {
  // Lấy ID diễn giả từ URL
  const urlParams = new URLSearchParams(window.location.search);
  const speakerId = urlParams.get('id');
  
  if (!speakerId) {
    // Nếu không có ID, chuyển hướng về trang danh sách
    window.location.href = 'speakers.html';
    return;
  }
  
  // Hiển thị loading overlay
  const loadingOverlay = document.getElementById('loading-overlay');
  if (loadingOverlay) {
    loadingOverlay.style.display = 'flex';
    loadingOverlay.style.opacity = '1';
  }
  
  // Giả lập API call để lấy thông tin diễn giả
  // Trong thực tế, đây sẽ là một API call thực sự
  setTimeout(() => {
    // Dữ liệu mẫu diễn giả dựa trên cấu trúc bảng dien_gia
    const speakerData = {
      dien_gia_id: speakerId,
      ten_dien_gia: 'GS.TS. Nguyễn Văn A',
      chuc_danh: 'Giáo sư, Tiến sĩ',
      to_chuc: 'Đại học Ngân hàng TP.HCM',
      gioi_thieu: 'Chuyên gia hàng đầu trong lĩnh vực tài chính ngân hàng với hơn 20 năm kinh nghiệm trong ngành. Giảng dạy tại Đại học Ngân hàng TP.HCM và nhiều trường đại học uy tín khác.',
      chuyen_mon: 'Tài chính - Ngân hàng, Blockchain, Fintech, Quản trị rủi ro',
      thanh_tuu: `
        <ul>
          <li>Giáo sư xuất sắc tại Đại học Ngân hàng TP.HCM từ năm 2015</li>
          <li>Tác giả của 5 cuốn sách chuyên ngành về Tài chính Ngân hàng</li>
          <li>Hơn 30 bài báo nghiên cứu trên các tạp chí quốc tế</li>
          <li>Giải thưởng Nhà nghiên cứu xuất sắc năm 2020</li>
          <li>Thành viên Hội đồng Khoa học và Công nghệ quốc gia</li>
          <li>Tư vấn cho nhiều tổ chức tài chính lớn trong và ngoài nước</li>
          <li>Diễn giả tại hơn 50 hội nghị và hội thảo quốc tế</li>
        </ul>
      `,
      avatar: 'https://i.pravatar.cc/300?img=8',
      email: 'nguyenvana@example.com',
      dien_thoai: '0123456789',
      website: 'https://example.com',
      mang_xa_hoi: JSON.stringify({
        facebook: 'https://facebook.com/example',
        linkedin: 'https://linkedin.com/in/example',
        twitter: 'https://twitter.com/example',
        youtube: 'https://youtube.com/c/example',
        instagram: 'https://instagram.com/example'
      }),
      status: '1',
      so_su_kien_tham_gia: 15,
      created_at: '2023-01-15 09:30:00',
      updated_at: '2023-06-22 14:45:00',
      events: [
        {
          id: 101,
          ten_su_kien: 'Hội thảo Fintech và Tương lai ngành Ngân hàng',
          ngay: '15/03/2023',
          vai_tro: 'Diễn giả chính',
          trang_thai: 'Đã diễn ra'
        },
        {
          id: 102,
          ten_su_kien: 'Tọa đàm Blockchain và Ứng dụng trong Ngân hàng',
          ngay: '22/05/2023',
          vai_tro: 'Diễn giả chính',
          trang_thai: 'Đã diễn ra'
        },
        {
          id: 103,
          ten_su_kien: 'Hội nghị Khoa học Quốc tế về Tài chính Bền vững',
          ngay: '10/11/2023',
          vai_tro: 'Khách mời',
          trang_thai: 'Sắp diễn ra'
        },
        {
          id: 104,
          ten_su_kien: 'Workshop Đầu tư Chứng khoán cho Sinh viên',
          ngay: '25/09/2023',
          vai_tro: 'Diễn giả',
          trang_thai: 'Đã diễn ra'
        },
        {
          id: 105,
          ten_su_kien: 'Seminar Kỹ năng Quản lý Tài chính Cá nhân',
          ngay: '08/12/2023',
          vai_tro: 'Điều phối viên',
          trang_thai: 'Sắp diễn ra'
        }
      ]
    };
    
    // Lưu dữ liệu vào biến global
    currentSpeaker = speakerData;
    try {
      socialLinks = JSON.parse(speakerData.mang_xa_hoi);
    } catch (e) {
      console.error('Lỗi khi phân tích dữ liệu mạng xã hội:', e);
      socialLinks = {};
    }
    
    // Điền dữ liệu vào trang
    populateSpeakerData(speakerData);
    
    // Ẩn loading overlay
    hideLoadingOverlay();
    
    // Hiển thị thông báo thành công
    showNotification('Tải dữ liệu diễn giả thành công!', 'success');
  }, 800);
};

/**
 * Điền dữ liệu diễn giả vào trang
 */
const populateSpeakerData = (data) => {
  // Cập nhật tiêu đề
  document.title = `${data.ten_dien_gia} | HUB - Đại học Ngân hàng TP.HCM`;
  
  // Cập nhật breadcrumb
  const breadcrumbName = document.getElementById('speaker-name-breadcrumb');
  if (breadcrumbName) {
    breadcrumbName.textContent = data.ten_dien_gia;
  }
  
  // Cập nhật nút chỉnh sửa
  const editButtons = document.querySelectorAll('#edit-button, #edit-button-sidebar');
  editButtons.forEach(button => {
    if (button) {
      button.href = `speaker-edit.html?id=${data.dien_gia_id}`;
    }
  });
  
  // Cập nhật phần thông tin cơ bản
  updateElementText('ten-dien-gia', data.ten_dien_gia);
  updateElementText('to-chuc', data.to_chuc);
  updateElementText('chuyen-mon', data.chuyen_mon);
  
  // Cập nhật avatar
  const avatarDisplay = document.getElementById('avatar-display');
  if (avatarDisplay) {
    if (data.avatar) {
      avatarDisplay.src = data.avatar;
      avatarDisplay.alt = data.ten_dien_gia;
    } else {
      // Sử dụng ảnh dự phòng nếu không có ảnh đại diện
      avatarDisplay.src = '../../images/logo/logo-white.png';
      avatarDisplay.alt = 'Ảnh đại diện mặc định';
    }
  }
  
  // Cập nhật trạng thái 
  const statusBadge = document.getElementById('status-badge');
  if (statusBadge) {
    const isActive = data.status === '1';
    const statusText = isActive ? 'Hoạt động' : 'Không hoạt động';
    const statusClass = isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
    
    statusBadge.textContent = statusText;
    statusBadge.className = `px-2 py-1 text-xs rounded-full ${statusClass}`;
  }
  
  // Cập nhật thông tin liên hệ
  updateElementText('email-display', data.email);
  const emailLink = document.getElementById('email-link');
  if (emailLink && data.email) {
    emailLink.href = `mailto:${data.email}`;
  }
  
  updateElementText('phone-display', data.dien_thoai);
  const phoneLink = document.getElementById('phone-link');
  if (phoneLink && data.dien_thoai) {
    phoneLink.href = `tel:${data.dien_thoai}`;
  }
  
  updateElementText('website-display', data.website || 'Website');
  const websiteLink = document.getElementById('website-link');
  if (websiteLink && data.website) {
    websiteLink.href = data.website.startsWith('http') ? data.website : `https://${data.website}`;
  }
  
  // Cập nhật tab thông tin cơ bản
  updateElementText('ten_dien_gia', data.ten_dien_gia);
  updateElementText('chuc_danh', data.chuc_danh);
  updateElementText('to_chuc', data.to_chuc);
  updateElementText('email', data.email);
  updateElementText('dien_thoai', data.dien_thoai);
  updateElementText('website', data.website || '');
  
  // Cập nhật giới thiệu
  const gioiThieuElement = document.getElementById('gioi_thieu');
  if (gioiThieuElement) {
    if (gioiThieuElement.tagName.toLowerCase() === 'div') {
      gioiThieuElement.innerHTML = data.gioi_thieu || '';
    } else {
      gioiThieuElement.textContent = data.gioi_thieu || '';
    }
  }
  
  // Cập nhật chuyên môn
  updateElementText('chuyen_mon', data.chuyen_mon);
  
  // Cập nhật link mạng xã hội từ JSON
  try {
    const socialMedia = typeof data.mang_xa_hoi === 'string' 
      ? JSON.parse(data.mang_xa_hoi) 
      : data.mang_xa_hoi;
    updateSocialLinks(socialMedia);
  } catch (e) {
    console.error('Lỗi khi phân tích dữ liệu mạng xã hội:', e);
  }
  
  // Cập nhật tab thành tựu
  const thanhTuuElement = document.getElementById('thanh_tuu');
  if (thanhTuuElement && data.thanh_tuu) {
    thanhTuuElement.innerHTML = data.thanh_tuu;
  }
  
  // Cập nhật tab sự kiện
  updateEventsList(data.events);
  
  // Cập nhật thông tin bên sidebar
  updateElementText('so-su-kien', `${data.so_su_kien_tham_gia || 0} sự kiện`);
  updateElementText('display-chuc-danh', data.chuc_danh);
  updateElementText('display-to-chuc', data.to_chuc);
  updateElementText('display-chuyen-mon', data.chuyen_mon);
  
  // Định dạng ngày cập nhật
  let updatedDate = '';
  if (data.updated_at) {
    try {
      const dateObj = new Date(data.updated_at);
      updatedDate = dateObj.toLocaleDateString('vi-VN');
    } catch (e) {
      updatedDate = data.updated_at;
    }
  }
  updateElementText('display-updated-at', updatedDate);
  
  // Hiển thị trạng thái
  const sidebarStatus = document.getElementById('sidebar-status');
  if (sidebarStatus) {
    const statusText = data.status === '1' ? 'Hoạt động' : 'Không hoạt động';
    const statusClass = data.status === '1' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
    
    sidebarStatus.textContent = statusText;
    sidebarStatus.className = `px-2 py-0.5 rounded-full text-xs ${statusClass}`;
  }
};

/**
 * Cập nhật nội dung phần tử theo ID
 * @param {string} elementId - ID của phần tử
 * @param {string} text - Nội dung cần cập nhật
 */
const updateElementText = (elementId, text) => {
  const element = document.getElementById(elementId);
  if (element) {
    element.textContent = text || '';
  }
};

/**
 * Cập nhật danh sách sự kiện
 * @param {Array} events - Mảng các sự kiện
 */
const updateEventsList = (events) => {
  const maxDisplayEvents = 5; // Số sự kiện tối đa hiển thị ban đầu
  const eventsContainer = document.querySelector('.events-list');
  if (!eventsContainer) return;
  
  if (!events || events.length === 0) {
    eventsContainer.innerHTML = '<p class="text-gray-500 text-center py-4">Diễn giả chưa tham gia sự kiện nào</p>';
    return;
  }
  
  // Giới hạn số sự kiện hiển thị ban đầu
  const displayEvents = events.slice(0, maxDisplayEvents);
  
  let html = '';
  displayEvents.forEach(event => {
    html += `
      <div class="bg-white rounded-lg shadow p-4 mb-3">
        <div class="flex justify-between items-start">
          <div>
            <h4 class="font-medium text-gray-900">${event.ten_su_kien}</h4>
            <div class="mt-1 text-sm text-gray-500">
              <p>Ngày: ${event.ngay}</p>
              <p>Vai trò: ${event.vai_tro || 'Không xác định'}</p>
              <div class="mt-1">
                <span class="px-2 py-1 text-xs rounded-full ${event.trang_thai === 'Đã kết thúc' ? 'bg-gray-200 text-gray-700' : 'bg-green-100 text-green-800'}">
                  ${event.trang_thai || 'Sắp diễn ra'}
                </span>
              </div>
            </div>
          </div>
          <button class="remove-from-event-btn text-red-600 hover:text-red-800" data-event-id="${event.id}">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    `;
  });
  
  // Thêm nút xem tất cả nếu có nhiều hơn số sự kiện tối đa
  if (events.length > maxDisplayEvents) {
    html += `
      <div class="text-center mt-2">
        <button id="view-all-events-btn" class="text-blue-600 hover:text-blue-800 font-medium">
          Xem tất cả (${events.length})
        </button>
      </div>
    `;
  }
  
  eventsContainer.innerHTML = html;
  
  // Thêm event listener cho nút xem tất cả
  const viewAllBtn = document.getElementById('view-all-events-btn');
  if (viewAllBtn) {
    viewAllBtn.addEventListener('click', () => {
      updateEventsList_ShowAll(events);
    });
  }
};

/**
 * Hàm hiển thị tất cả sự kiện
 */
const updateEventsList_ShowAll = (events) => {
  const eventsContainer = document.querySelector('.events-list');
  if (!eventsContainer) return;
  
  let html = '';
  events.forEach(event => {
    html += `
      <div class="bg-white rounded-lg shadow p-4 mb-3">
        <div class="flex justify-between items-start">
          <div>
            <h4 class="font-medium text-gray-900">${event.ten_su_kien}</h4>
            <div class="mt-1 text-sm text-gray-500">
              <p>Ngày: ${event.ngay}</p>
              <p>Vai trò: ${event.vai_tro || 'Không xác định'}</p>
              <div class="mt-1">
                <span class="px-2 py-1 text-xs rounded-full ${event.trang_thai === 'Đã kết thúc' ? 'bg-gray-200 text-gray-700' : 'bg-green-100 text-green-800'}">
                  ${event.trang_thai || 'Sắp diễn ra'}
                </span>
              </div>
            </div>
          </div>
          <button class="remove-from-event-btn text-red-600 hover:text-red-800" data-event-id="${event.id}">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    `;
  });
  
  // Thêm nút thu gọn
  html += `
    <div class="text-center mt-2">
      <button id="collapse-events-btn" class="text-blue-600 hover:text-blue-800 font-medium">
        Thu gọn
      </button>
    </div>
  `;
  
  eventsContainer.innerHTML = html;
  
  // Thêm event listener cho nút thu gọn
  const collapseBtn = document.getElementById('collapse-events-btn');
  if (collapseBtn) {
    collapseBtn.addEventListener('click', () => {
      updateEventsList(events);
    });
  }
};

/**
 * Cập nhật link mạng xã hội
 * @param {Object} socialData - Dữ liệu mạng xã hội
 */
const updateSocialLinks = (socialData) => {
  if (!socialData) return;
  
  // Danh sách các mạng xã hội cần cập nhật
  const socialPlatforms = [
    { id: 'facebook-link', key: 'facebook', icon: 'ri-facebook-fill text-blue-600' },
    { id: 'linkedin-link', key: 'linkedin', icon: 'ri-linkedin-fill text-blue-700' },
    { id: 'twitter-link', key: 'twitter', icon: 'ri-twitter-x-fill' },
    { id: 'youtube-link', key: 'youtube', icon: 'ri-youtube-fill text-red-600' },
    { id: 'instagram-link', key: 'instagram', icon: 'ri-instagram-line text-purple-600' }
  ];
  
  // Cập nhật từng mạng xã hội
  socialPlatforms.forEach(platform => {
    updateSocialLink(platform.id, socialData[platform.key], platform.icon);
  });
  
  // Hiển thị container nếu có ít nhất một liên kết
  const socialContainer = document.getElementById('social-links-container');
  if (socialContainer) {
    const hasAnyLink = socialPlatforms.some(platform => socialData[platform.key]);
    socialContainer.style.display = hasAnyLink ? 'flex' : 'none';
  }
};

/**
 * Cập nhật link mạng xã hội đơn lẻ
 * @param {string} linkId - ID của phần tử liên kết
 * @param {string} url - URL của mạng xã hội
 * @param {string} iconClass - Class của icon
 */
const updateSocialLink = (linkId, url, iconClass) => {
  const link = document.getElementById(linkId);
  if (link) {
    if (url) {
      link.href = url;
      link.style.display = 'inline-flex';
      
      // Cập nhật icon nếu cần
      if (iconClass) {
        const icon = link.querySelector('i');
        if (icon) {
          icon.className = iconClass;
        } else {
          const newIcon = document.createElement('i');
          newIcon.className = iconClass;
          link.appendChild(newIcon);
        }
      }
    } else {
      link.style.display = 'none';
    }
  }
};

/**
 * Khởi tạo phím tắt
 */
const initKeyboardShortcuts = () => {
  // Thêm phím tắt Esc để quay lại
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      history.back();
    }
  });
  
  // Thêm phím tắt Ctrl+E để chỉnh sửa
  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
      e.preventDefault();
      const editButton = document.getElementById('edit-button');
      if (editButton) {
        editButton.click();
      }
    }
  });
};

/**
 * Khởi tạo tính năng thêm diễn giả vào sự kiện
 */
const initAddToEventFeature = () => {
  const addToEventBtn = document.getElementById('add-to-event-btn');
  const addToEventModal = document.getElementById('add-to-event-modal');
  
  if (!addToEventBtn || !addToEventModal) return;
  
  // Mở modal khi click nút thêm vào sự kiện
  addToEventBtn.addEventListener('click', () => {
    addToEventModal.classList.remove('hidden');
  });
  
  // Đóng modal khi click nút đóng
  const closeModalButtons = addToEventModal.querySelectorAll('[data-modal-close]');
  if (closeModalButtons) {
    closeModalButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        addToEventModal.classList.add('hidden');
      });
    });
  }
  
  // Đóng modal khi click bên ngoài
  addToEventModal.addEventListener('click', (e) => {
    if (e.target === addToEventModal) {
      addToEventModal.classList.add('hidden');
    }
  });
  
  // Tải danh sách sự kiện từ API
  loadEventOptions();
  
  // Khởi tạo chức năng tìm kiếm sự kiện
  initEventSearch();
  
  // Xử lý form thêm diễn giả vào sự kiện
  const addToEventForm = document.getElementById('add-to-event-form');
  if (addToEventForm) {
    addToEventForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const eventId = document.getElementById('event-select').value;
      const role = document.getElementById('speaker-role').value;
      
      if (!eventId || eventId === 'default') {
        alert('Vui lòng chọn sự kiện');
        return;
      }
      
      if (!role || role.trim() === '') {
        alert('Vui lòng nhập vai trò của diễn giả');
        return;
      }
      
      // Gọi API để thêm diễn giả vào sự kiện
      addSpeakerToEvent(eventId, role);
    });
  }
};

/**
 * Tải danh sách sự kiện có thể thêm diễn giả
 */
const loadEventOptions = () => {
  const eventSelect = document.getElementById('event-select');
  if (!eventSelect) return;
  
  // Xóa các option hiện tại
  eventSelect.innerHTML = '<option value="default">Chọn sự kiện</option>';
  
  // Mô phỏng dữ liệu từ API
  const events = [
    { id: 1, name: 'Hội thảo Fintech 2023' },
    { id: 2, name: 'Ngày hội công nghệ số trong ngành tài chính' },
    { id: 3, name: 'Workshop: Blockhain và ứng dụng trong ngân hàng' },
    { id: 4, name: 'Tiếp cận dữ liệu khách hàng trong kỷ nguyên số' },
    { id: 5, name: 'Seminar: Chuyển đổi số trong ngân hàng thương mại' }
  ];
  
  // Kiểm tra các sự kiện diễn giả đã tham gia để loại bỏ
  const existingEventIds = currentSpeaker.events ? currentSpeaker.events.map(e => e.id) : [];
  
  // Thêm các option từ dữ liệu
  events.forEach(event => {
    // Chỉ hiển thị sự kiện mà diễn giả chưa tham gia
    if (!existingEventIds.includes(event.id)) {
      const option = document.createElement('option');
      option.value = event.id;
      option.textContent = event.name;
      eventSelect.appendChild(option);
    }
  });
};

/**
 * Khởi tạo chức năng tìm kiếm sự kiện
 */
const initEventSearch = () => {
  const searchInput = document.getElementById('event-search');
  if (!searchInput) return;
  
  searchInput.addEventListener('input', (e) => {
    const searchValue = e.target.value.toLowerCase();
    const eventSelect = document.getElementById('event-select');
    const options = eventSelect.querySelectorAll('option');
    
    options.forEach(option => {
      if (option.value === 'default') return;
      
      const eventName = option.textContent.toLowerCase();
      if (eventName.includes(searchValue)) {
        option.style.display = '';
      } else {
        option.style.display = 'none';
      }
    });
  });
};

/**
 * Thêm diễn giả vào sự kiện
 * @param {string} eventId - ID của sự kiện
 * @param {string} role - Vai trò của diễn giả
 */
const addSpeakerToEvent = (eventId, role) => {
  const speakerId = currentSpeaker.dien_gia_id;
  
  // Mô phỏng việc gọi API
  console.log(`Thêm diễn giả ID ${speakerId} vào sự kiện ID ${eventId} với vai trò: ${role}`);
  
  // Giả lập thêm sự kiện thành công
  const eventSelect = document.getElementById('event-select');
  const selectedOption = eventSelect.options[eventSelect.selectedIndex];
  const eventName = selectedOption.textContent;
  
  const newEvent = {
    id: parseInt(eventId),
    ten_su_kien: eventName,
    ngay: '15/11/2023',
    trang_thai: 'Sắp diễn ra',
    vai_tro: role
  };
  
  // Thêm sự kiện mới vào danh sách
  if (!currentSpeaker.events) {
    currentSpeaker.events = [];
  }
  currentSpeaker.events.push(newEvent);
  
  // Cập nhật UI
  updateEventsList(currentSpeaker.events);
  
  // Đóng modal
  const addToEventModal = document.getElementById('add-to-event-modal');
  if (addToEventModal) {
    addToEventModal.classList.add('hidden');
  }
  
  // Reset form
  const speakerRoleInput = document.getElementById('speaker-role');
  if (speakerRoleInput) {
    speakerRoleInput.value = '';
  }
  
  // Hiển thị thông báo thành công
  showToast('Thêm diễn giả vào sự kiện thành công', 'success');
  
  // Cập nhật lại danh sách sự kiện có thể chọn
  loadEventOptions();
};

/**
 * Khởi tạo chức năng xem thêm sự kiện
 */
const initViewAllEventsFeature = () => {
  const viewAllEventsLink = document.getElementById('view-all-events');
  if (!viewAllEventsLink) return;
  
  viewAllEventsLink.addEventListener('click', (e) => {
    e.preventDefault();
    
    // Chuyển đến tab sự kiện nếu không ở đó
    const tabButton = document.querySelector('.tab-btn[data-tab="events"]');
    if (tabButton) {
      tabButton.click();
    }
  });
};

/**
 * Khởi tạo chức năng xóa diễn giả khỏi sự kiện
 */
const initRemoveFromEventFeature = () => {
  // Lắng nghe sự kiện click cho các nút xóa diễn giả khỏi sự kiện
  // Sử dụng event delegation để bắt sự kiện từ các nút có thể được thêm vào sau
  const eventsContainer = document.querySelector('.events-list');
  if (!eventsContainer) return;
  
  eventsContainer.addEventListener('click', (e) => {
    const removeBtn = e.target.closest('.remove-from-event-btn');
    if (!removeBtn) return;
    
    // Lấy ID sự kiện từ data attribute
    const eventId = removeBtn.dataset.eventId;
    if (!eventId) return;
    
    // Hiển thị dialog xác nhận
    if (confirm('Bạn có chắc chắn muốn xóa diễn giả khỏi sự kiện này?')) {
      removeSpeakerFromEvent(eventId);
    }
  });
};

/**
 * Xóa diễn giả khỏi sự kiện
 * @param {string} eventId - ID của sự kiện cần xóa
 */
const removeSpeakerFromEvent = (eventId) => {
  const speakerId = currentSpeaker.dien_gia_id;
  const numericEventId = parseInt(eventId);
  
  // Mô phỏng việc gọi API
  console.log(`Xóa diễn giả ID ${speakerId} khỏi sự kiện ID ${eventId}`);
  
  // Xóa sự kiện khỏi danh sách
  if (currentSpeaker.events && currentSpeaker.events.length > 0) {
    currentSpeaker.events = currentSpeaker.events.filter(event => event.id !== numericEventId);
    
    // Cập nhật UI
    updateEventsList(currentSpeaker.events);
    
    // Hiển thị thông báo thành công
    showToast('Đã xóa diễn giả khỏi sự kiện', 'success');
    
    // Cập nhật lại danh sách sự kiện có thể chọn
    loadEventOptions();
  }
};

/**
 * Mô phỏng dữ liệu diễn giả
 * Được sử dụng khi không có API thực
 */
const simulateSpeakerData = () => {
  // Hàm này đã được thực hiện bởi loadSpeakerData()
  // Giữ trống để tương thích với hàm init()
};

/**
 * Hiển thị thông tin diễn giả
 * Được sử dụng khi không có API thực
 */
const renderSpeakerInfo = () => {
  // Hàm này đã được thực hiện bởi populateSpeakerData()
  // Giữ trống để tương thích với hàm init()
};

/**
 * Khởi tạo tất cả các chức năng
 */
const init = () => {
  // Khởi tạo hiệu ứng AOS
  initAOS();
  
  // Khởi tạo tabs
  initTabs();
  
  // Xử lý nút quay lại
  initBackButton();
  
  // Xử lý modal xóa diễn giả
  initDeleteModal();
  
  // Xử lý sidebar
  initSidebar();
  
  // Tải dữ liệu diễn giả
  loadSpeakerData();
  
  // Ẩn loading overlay sau khi trang đã tải xong
  hideLoadingOverlay();
  
  // Khởi tạo phím tắt
  initKeyboardShortcuts();
  
  // Khởi tạo thêm diễn giả vào sự kiện
  initAddToEventFeature();
  
  // Khởi tạo xem thêm sự kiện
  initViewAllEventsFeature();
  
  // Khởi tạo chức năng xóa diễn giả khỏi sự kiện
  initRemoveFromEventFeature();
}; 