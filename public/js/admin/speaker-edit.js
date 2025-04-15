/**
 * Quản lý trang cập nhật thông tin diễn giả
 */

// Biến lưu trữ dữ liệu diễn giả
let currentSpeaker = {};
let socialLinks = {};
let isAvatarChanged = false;
let avatarFile = null;
let formChanged = false;
let currentSpeakerId = null;
let lastActiveTab = 'basic-info';
const defaultAvatar = '../../../public/img/user/default-avatar.jpg';

// Hàm khởi tạo khi tài liệu đã sẵn sàng
document.addEventListener('DOMContentLoaded', () => {
  // Khởi tạo hiệu ứng AOS
  AOS.init();
  
  // Quản lý tabs
  initTabNavigation();
  
  // Khởi tạo trình soạn thảo (nếu cần)
  initTinyMCE();
  
  // Sidebar
  initSidebar();
  
  // Phím tắt
  initKeyboardShortcuts();
  
  // Xử lý form
  initFormHandling();
  
  // Xử lý upload ảnh đại diện
  initAvatarUpload();
  
  // Lấy ID diễn giả từ URL
  const urlParams = new URLSearchParams(window.location.search);
  currentSpeakerId = parseInt(urlParams.get('id')) || null;
  
  // Tải dữ liệu diễn giả
  if (currentSpeakerId) {
    loadSpeakerData(currentSpeakerId);
    document.getElementById('page-title').textContent = 'Cập nhật thông tin diễn giả';
  } else {
    document.getElementById('page-title').textContent = 'Thêm diễn giả mới';
  }
  
  // Theo dõi thay đổi form
  trackFormChanges();
  
  // Thêm xác nhận khi rời trang mà chưa lưu
  addUnsavedChangesWarning();
});

/**
 * Quản lý tabs và chuyển đổi tab
 */
const initTabNavigation = () => {
  const tabButtons = document.querySelectorAll('.tab-button');
  const tabContents = document.querySelectorAll('[data-tab-content]');
  
  // Hàm chuyển tab
  const switchTab = (tabId) => {
    // Ẩn tất cả tab content
    tabContents.forEach(content => {
      content.classList.add('hidden');
    });
    
    // Bỏ chọn tất cả tab buttons
    tabButtons.forEach(btn => {
      btn.classList.remove('border-primary', 'text-primary');
      btn.classList.add('border-transparent', 'text-gray-500');
      btn.setAttribute('aria-selected', 'false');
    });
    
    // Hiển thị tab content được chọn
    const selectedContent = document.querySelector(`[data-tab-content="${tabId}"]`);
    if (selectedContent) {
      selectedContent.classList.remove('hidden');
    }
    
    // Style cho tab button được chọn
    const activeTabButton = document.querySelector(`.tab-button[data-tab="${tabId}"]`);
    if (activeTabButton) {
      activeTabButton.classList.remove('border-transparent', 'text-gray-500');
      activeTabButton.classList.add('border-primary', 'text-primary');
      activeTabButton.setAttribute('aria-selected', 'true');
    }
    
    // Lưu tab hiện tại vào localStorage
    localStorage.setItem('currentSpeakerTab', tabId);
  };
  
  // Đăng ký sự kiện cho các tab button
  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const tabId = button.getAttribute('data-tab');
      switchTab(tabId);
    });
  });
  
  // Chức năng chuyển tab bằng phím tắt
  const switchTabByIndex = (index) => {
    if (index >= 0 && index < tabButtons.length) {
      const tabId = tabButtons[index].getAttribute('data-tab');
      switchTab(tabId);
    }
  };
  
  // Chuyển đến tab tiếp theo
  const switchToNextTab = () => {
    const activeTabIndex = Array.from(tabButtons).findIndex(
      tab => tab.getAttribute('aria-selected') === 'true'
    );
    const nextTabIndex = (activeTabIndex + 1) % tabButtons.length;
    switchTabByIndex(nextTabIndex);
  };
  
  // Chuyển đến tab trước đó
  const switchToPrevTab = () => {
    const activeTabIndex = Array.from(tabButtons).findIndex(
      tab => tab.getAttribute('aria-selected') === 'true'
    );
    const prevTabIndex = (activeTabIndex - 1 + tabButtons.length) % tabButtons.length;
    switchTabByIndex(prevTabIndex);
  };
  
  // Thêm sự kiện phím tắt cho điều hướng tab
  window.addEventListener('keydown', (e) => {
    // Alt + Tab chuyển đến tab tiếp theo
    if (e.altKey && e.key === 'Tab') {
      e.preventDefault();
      switchToNextTab();
    }
    
    // Alt + Arrow Right chuyển đến tab tiếp theo
    if (e.altKey && e.key === 'ArrowRight') {
      e.preventDefault();
      switchToNextTab();
    }
    
    // Alt + Arrow Left chuyển đến tab trước đó
    if (e.altKey && e.key === 'ArrowLeft') {
      e.preventDefault();
      switchToPrevTab();
    }
    
    // Alt + 1-4 để chuyển đến tab tương ứng
    if (e.altKey && e.key >= '1' && e.key <= '4') {
      e.preventDefault();
      const tabIndex = parseInt(e.key) - 1;
      switchTabByIndex(tabIndex);
    }
  });
  
  // Khôi phục tab đã chọn từ localStorage
  const savedTab = localStorage.getItem('currentSpeakerTab');
  if (savedTab) {
    switchTab(savedTab);
  }
};

/**
 * Khởi tạo trình soạn thảo TinyMCE nếu cần
 */
const initTinyMCE = () => {
  if (typeof tinymce !== 'undefined') {
    tinymce.init({
      selector: '#gioi_thieu, #thanh_tuu',
      height: 250,
      menubar: false,
      plugins: 'lists link autolink',
      toolbar: 'undo redo | formatselect | bold italic | bullist numlist | link',
      content_style: 'body { font-family: -apple-system, BlinkMacSystemFont, San Francisco, Segoe UI, Roboto, Helvetica Neue, sans-serif; font-size: 14px }'
    });
  }
};

/**
 * Xử lý sidebar trên mobile
 */
const initSidebar = () => {
  const sidebar = document.getElementById('sidebar');
  const sidebarOpen = document.getElementById('sidebar-open');
  const sidebarClose = document.getElementById('sidebar-close');
  const sidebarBackdrop = document.getElementById('sidebar-backdrop');
  
  if (!sidebar || !sidebarOpen || !sidebarClose || !sidebarBackdrop) return;
  
  // Mở sidebar (mobile)
  sidebarOpen.addEventListener('click', () => {
    sidebar.classList.remove('-translate-x-full');
    sidebarBackdrop.classList.remove('hidden');
    setTimeout(() => {
      sidebarBackdrop.classList.add('opacity-100');
    }, 100);
  });
  
  // Đóng sidebar (mobile)
  const closeSidebar = () => {
    sidebar.classList.add('-translate-x-full');
    sidebarBackdrop.classList.remove('opacity-100');
    setTimeout(() => {
      sidebarBackdrop.classList.add('hidden');
    }, 300);
  };
  
  sidebarClose.addEventListener('click', closeSidebar);
  sidebarBackdrop.addEventListener('click', closeSidebar);
};

/**
 * Khởi tạo chức năng upload ảnh đại diện
 */
const initAvatarUpload = () => {
  const avatarInput = document.getElementById('avatar-input');
  const avatarPreview = document.getElementById('avatar-preview');
  const avatarUploadButton = document.getElementById('avatar-upload-button');
  const avatarContainer = document.getElementById('avatar-container');
  const avatarDeleteButton = document.getElementById('avatar-delete-button');
  const avatarInnerContainer = document.getElementById('avatar-inner-container');
  
  if (!avatarInput || !avatarPreview || !avatarUploadButton) {
    return;
  }
  
  // Click vào nút upload sẽ mở hộp thoại chọn tệp
  avatarUploadButton.addEventListener('click', () => {
    avatarInput.click();
  });
  
  // Cho phép kéo thả tệp vào container
  if (avatarContainer) {
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
      avatarContainer.addEventListener(eventName, preventDefaults, false);
    });
    
    function preventDefaults(e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    // Hiệu ứng khi kéo vào
    ['dragenter', 'dragover'].forEach(eventName => {
      avatarContainer.addEventListener(eventName, () => {
        avatarContainer.classList.add('border-blue-500', 'bg-blue-50');
      });
    });
    
    // Hiệu ứng khi kéo ra hoặc thả
    ['dragleave', 'drop'].forEach(eventName => {
      avatarContainer.addEventListener(eventName, () => {
        avatarContainer.classList.remove('border-blue-500', 'bg-blue-50');
      });
    });
    
    // Xử lý khi thả tệp
    avatarContainer.addEventListener('drop', (e) => {
      const dt = e.dataTransfer;
      const files = dt.files;
      
      if (files.length > 0) {
        handleFile(files[0]);
      }
    });
  }
  
  // Xử lý khi chọn tệp
  avatarInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  });
  
  // Xóa ảnh đại diện
  if (avatarDeleteButton) {
    avatarDeleteButton.addEventListener('click', () => {
      // Hiển thị xác nhận trước khi xóa
      if (confirm('Bạn có chắc chắn muốn xóa ảnh đại diện không?')) {
        resetAvatar();
        isAvatarChanged = true;
        avatarFile = null;
        formChanged = true;
      }
    });
  }
  
  // Cho phép click vào ảnh để chọn tệp
  if (avatarInnerContainer) {
    avatarInnerContainer.addEventListener('click', () => {
      avatarInput.click();
    });
  }
  
  /**
   * Xử lý tệp ảnh được chọn
   */
  function handleFile(file) {
    // Kiểm tra loại tệp
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      showMessage('Chỉ chấp nhận tệp ảnh định dạng JPG, PNG, GIF hoặc WebP', 'error');
      return;
    }
    
    // Kiểm tra kích thước tệp (giới hạn 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      showMessage('Kích thước ảnh không được vượt quá 5MB', 'error');
      return;
    }
    
    // Đọc tệp và hiển thị xem trước
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        // Kiểm tra kích thước ảnh (tối thiểu 200x200 pixels)
        if (img.width < 200 || img.height < 200) {
          showMessage('Ảnh đại diện phải có kích thước tối thiểu 200x200 pixels', 'error');
          return;
        }
        
        // Hiển thị xem trước
        avatarPreview.src = e.target.result;
        avatarPreview.style.display = 'block';
        
        // Hiển thị nút xóa
        if (avatarDeleteButton) {
          avatarDeleteButton.style.display = 'block';
        }
        
        // Thay đổi trạng thái ảnh
        isAvatarChanged = true;
        avatarFile = file;
        formChanged = true;
        
        showMessage('Ảnh đại diện đã được cập nhật', 'success');
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }
  
  /**
   * Đặt lại ảnh đại diện về mặc định
   */
  function resetAvatar() {
    // Đặt lại ảnh xem trước
    avatarPreview.src = 'https://via.placeholder.com/200x200?text=No+Image';
    
    // Ẩn nút xóa
    if (avatarDeleteButton) {
      avatarDeleteButton.style.display = 'none';
    }
    
    showMessage('Đã xóa ảnh đại diện', 'info');
  }
};

/**
 * Xử lý gửi form
 */
const initFormHandling = () => {
  const speakerForm = document.getElementById('speaker-form');
  
  if (!speakerForm) return;
  
  speakerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Kiểm tra các trường bắt buộc và validation
    if (!validateForm()) {
      return;
    }
    
    // Thu thập dữ liệu form
    const formData = new FormData(speakerForm);
    
    // Ghi đè dữ liệu từ TinyMCE (nếu có)
    if (typeof tinymce !== 'undefined') {
      if (tinymce.get('gioi_thieu')) {
        formData.set('gioi_thieu', tinymce.get('gioi_thieu').getContent());
      }
      if (tinymce.get('thanh_tuu')) {
        formData.set('thanh_tuu', tinymce.get('thanh_tuu').getContent());
      }
    }
    
    // Tạo đối tượng thông tin mạng xã hội JSON
    const socialMedia = {};
    ['facebook', 'linkedin', 'twitter', 'youtube', 'instagram'].forEach(platform => {
      const value = formData.get(platform);
      if (value) {
        socialMedia[platform] = value;
      }
    });
    formData.set('mang_xa_hoi', JSON.stringify(socialMedia));
    
    // Hiển thị thông báo đang xử lý
    showMessage('Đang cập nhật thông tin diễn giả...', 'info');
    
    // Mô phỏng API call
    setTimeout(() => {
      showMessage('Cập nhật thông tin diễn giả thành công!', 'success');
      
      // Đặt lại trạng thái form
      formChanged = false;
      
      // Chuyển hướng sau 1.5 giây
      setTimeout(() => {
        window.location.href = 'speakers.html';
      }, 1500);
    }, 1000);
  });
};

/**
 * Kiểm tra dữ liệu form
 * @returns {boolean} Kết quả kiểm tra
 */
const validateForm = () => {
  const errors = [];
  const speakerName = document.getElementById("speaker-name").value.trim();
  const speakerEmail = document.getElementById("speaker-email").value.trim();
  const speakerPhone = document.getElementById("speaker-phone").value.trim();

  if (!speakerName) {
    errors.push("Vui lòng nhập tên diễn giả");
  }

  if (speakerEmail && !isValidEmail(speakerEmail)) {
    errors.push("Email không đúng định dạng");
  }

  if (speakerPhone && !isValidPhone(speakerPhone)) {
    errors.push("Số điện thoại không đúng định dạng");
  }

  if (errors.length > 0) {
    showErrors(errors);
    return false;
  }

  return true;
};

/**
 * Kiểm tra định dạng email
 * @param {string} email - Địa chỉ email cần kiểm tra
 * @returns {boolean} Kết quả kiểm tra
 */
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Kiểm tra định dạng số điện thoại Việt Nam
 * @param {string} phone - Số điện thoại cần kiểm tra
 * @returns {boolean} Kết quả kiểm tra
 */
const isValidPhone = (phone) => {
  // Cho phép các định dạng như: 0912345678, 091-234-5678, +84912345678
  const phoneRegex = /^(\+\d{1,3})?[- ]?\d{3}[- ]?\d{3}[- ]?\d{3,4}$/;
  return phoneRegex.test(phone);
};

/**
 * Kiểm tra URL hợp lệ
 */
const isValidURL = (url) => {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
};

/**
 * Theo dõi thay đổi form
 */
const trackFormChanges = () => {
  const form = document.getElementById('speaker-form');
  
  if (!form) return;
  
  // Theo dõi thay đổi trên các input, select và textarea
  const formElements = form.querySelectorAll('input, select, textarea');
  formElements.forEach(element => {
    element.addEventListener('change', () => {
      formChanged = true;
    });
    
    if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
      element.addEventListener('keyup', () => {
        formChanged = true;
      });
    }
  });
  
  // Theo dõi thay đổi trong TinyMCE
  if (typeof tinymce !== 'undefined') {
    setTimeout(() => {
      if (tinymce.get('gioi_thieu')) {
        tinymce.get('gioi_thieu').on('change', () => {
          formChanged = true;
        });
      }
      
      if (tinymce.get('thanh_tuu')) {
        tinymce.get('thanh_tuu').on('change', () => {
          formChanged = true;
        });
      }
    }, 1000);
  }
};

/**
 * Thêm xác nhận khi rời trang mà chưa lưu
 */
const addUnsavedChangesWarning = () => {
  window.addEventListener('beforeunload', (e) => {
    if (formChanged) {
      // Tin nhắn tiêu chuẩn sẽ hiển thị, không thể tùy chỉnh trong hầu hết các trình duyệt
      const message = 'Bạn có thay đổi chưa được lưu. Bạn có chắc chắn muốn rời khỏi trang này?';
      e.returnValue = message;
      return message;
    }
  });
};

/**
 * Tải dữ liệu diễn giả từ API hoặc local storage
 * @param {number|null} speakerId - ID của diễn giả cần tải
 */
const loadSpeakerData = (speakerId = null) => {
  if (!speakerId) {
    // Trường hợp thêm mới
    fillFormWithData({
      ten_dien_gia: '',
      chuc_danh: '',
      to_chuc: '',
      email: '',
      dien_thoai: '',
      website: '',
      gioi_thieu: '',
      chuyen_mon: '',
      thanh_tuu: '',
      facebook: '',
      twitter: '',
      linkedin: '',
      instagram: '',
      trang_thai: 1
    });
    return;
  }
  
  // Hiển thị loading
  showLoading(true);
  
  // Mô phỏng gọi API
  setTimeout(() => {
    try {
      // Trong môi trường thực tế, sẽ gọi API để lấy dữ liệu
      // Ở đây chúng ta mô phỏng bằng localStorage
      const allSpeakers = JSON.parse(localStorage.getItem('speakers') || '[]');
      const speaker = allSpeakers.find(s => s.id === speakerId);
      
      if (speaker) {
        fillFormWithData(speaker);
        showSuccess('Tải dữ liệu diễn giả thành công');
      } else {
        showError('Không tìm thấy thông tin diễn giả');
        setTimeout(() => {
          window.location.href = 'speakers.html';
        }, 2000);
      }
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu diễn giả:', error);
      showError('Đã xảy ra lỗi khi tải dữ liệu diễn giả');
    } finally {
      showLoading(false);
    }
  }, 800);
};

/**
 * Điền dữ liệu diễn giả vào form
 * @param {Object} data - Dữ liệu diễn giả
 */
const fillFormWithData = (data) => {
  try {
    // Thông tin cơ bản
    document.getElementById('speakerName').value = data.ten_dien_gia || '';
    document.getElementById('speakerTitle').value = data.chuc_danh || '';
    document.getElementById('speakerOrganization').value = data.to_chuc || '';
    document.getElementById('speakerEmail').value = data.email || '';
    document.getElementById('speakerPhone').value = data.dien_thoai || '';
    document.getElementById('speakerWebsite').value = data.website || '';
    document.getElementById('speakerIntro').value = data.gioi_thieu || '';
    
    // Thông tin chuyên môn
    document.getElementById('speakerExpertise').value = data.chuyen_mon || '';
    document.getElementById('speakerAchievements').value = data.thanh_tuu || '';
    
    // Mạng xã hội
    document.getElementById('speakerFacebook').value = data.facebook || '';
    document.getElementById('speakerTwitter').value = data.twitter || '';
    document.getElementById('speakerLinkedIn').value = data.linkedin || '';
    document.getElementById('speakerInstagram').value = data.instagram || '';
    
    // Trạng thái
    document.getElementById('speakerStatus').checked = data.trang_thai === 1;
    
    // Avatar
    if (data.avatar) {
      document.getElementById('avatarPreview').src = data.avatar;
    }
    
    // Cập nhật biến toàn cục
    currentSpeaker = data;
  } catch (error) {
    console.error('Lỗi khi điền dữ liệu vào form:', error);
    showError('Có lỗi khi điền dữ liệu vào form');
  }
};

/**
 * Khởi tạo phím tắt
 */
const initKeyboardShortcuts = () => {
  // Phím tắt đã được xử lý trong initTabNavigation
  
  // Thêm phím tắt Ctrl+S để lưu
  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      document.querySelector('button[type="submit"]').click();
    }
  });
  
  // Thêm phím tắt Esc để quay lại
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      history.back();
    }
  });
};

/**
 * Hiển thị thông báo
 */
const showMessage = (message, type = 'info') => {
  const existingToast = document.querySelector('.toast-notification');
  if (existingToast) {
    existingToast.remove();
  }
  
  const toast = document.createElement('div');
  toast.className = 'toast-notification fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg animate-fade-in';
  
  let bgColor, icon;
  switch (type) {
    case 'success':
      bgColor = 'bg-green-500';
      icon = 'ri-check-line';
      break;
    case 'error':
      bgColor = 'bg-red-500';
      icon = 'ri-error-warning-line';
      break;
    case 'warning':
      bgColor = 'bg-yellow-500';
      icon = 'ri-alert-line';
      break;
    default:
      bgColor = 'bg-blue-500';
      icon = 'ri-information-line';
  }
  
  toast.classList.add(bgColor);
  
  toast.innerHTML = `
    <div class="flex items-center text-white">
      <i class="${icon} mr-2 text-lg"></i>
      <span>${message}</span>
    </div>
  `;
  
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.classList.remove('animate-fade-in');
    toast.classList.add('animate-fade-out');
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3000);
};

/**
 * Khởi tạo chức năng chuyển tab
 */
const initTabs = () => {
  const tabButtons = document.querySelectorAll('[data-tab]');
  const tabContents = document.querySelectorAll('[data-tab-content]');
  
  // Ẩn tất cả tab content trừ tab đầu tiên
  tabContents.forEach((content, index) => {
    if (index !== 0) {
      content.classList.add('hidden');
    }
  });
  
  // Đặt trạng thái active cho tab đầu tiên
  if (tabButtons.length > 0) {
    tabButtons[0].classList.add('active-tab');
  }
  
  // Thêm sự kiện click cho các tab button
  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const target = button.getAttribute('data-tab');
      
      // Ẩn tất cả tab content
      tabContents.forEach(content => {
        content.classList.add('hidden');
      });
      
      // Bỏ active từ tất cả các tab button
      tabButtons.forEach(btn => {
        btn.classList.remove('active-tab');
      });
      
      // Hiển thị tab content được chọn
      document.querySelector(`[data-tab-content="${target}"]`).classList.remove('hidden');
      
      // Đánh dấu tab button đang active
      button.classList.add('active-tab');
      
      // Lưu tab hiện tại
      lastActiveTab = target;
    });
  });
};

/**
 * Khởi tạo theo dõi các thay đổi form
 */
const initFormChangeTracking = () => {
  // Theo dõi thay đổi trên tất cả các input và textarea
  const formInputs = document.querySelectorAll('input, textarea, select');
  formInputs.forEach(input => {
    input.addEventListener('change', () => {
      formChanged = true;
    });
    
    // Thêm theo dõi cho keyup trên input text và textarea
    if (input.type !== 'file' && input.type !== 'checkbox' && input.type !== 'radio') {
      input.addEventListener('keyup', () => {
        formChanged = true;
      });
    }
  });
  
  // Thêm xác nhận khi người dùng rời trang nếu có thay đổi chưa lưu
  window.addEventListener('beforeunload', (e) => {
    if (formChanged) {
      // Chuẩn bị thông báo
      const message = 'Bạn có thay đổi chưa được lưu. Bạn có chắc chắn muốn rời trang không?';
      e.returnValue = message;
      return message;
    }
  });
};

/**
 * Lưu dữ liệu form
 * @param {boolean} silent - Có hiển thị thông báo khi lưu thành công hay không
 * @returns {Promise<boolean>} - Kết quả của thao tác lưu
 */
const saveForm = async (silent = false) => {
  // Kiểm tra dữ liệu trước khi lưu
  const { isValid, errors } = validateForm();
  
  if (!isValid) {
    showErrors(errors);
    return false;
  }
  
  try {
    const speakerData = collectFormData();
    console.log('Đang lưu dữ liệu:', speakerData);
    
    // Giả lập gọi API để lưu dữ liệu
    return new Promise((resolve) => {
      setTimeout(() => {
        // Giả lập lưu thành công
        formChanged = false;
        avatarChanged = false;
        
        if (!silent) {
          showMessage('Lưu thông tin diễn giả thành công', 'success');
        }
        
        resolve(true);
      }, 1000);
    });
  } catch (error) {
    console.error('Lỗi khi lưu dữ liệu:', error);
    showMessage(`Lỗi khi lưu: ${error.message || 'Đã xảy ra lỗi không xác định'}`, 'error');
    return false;
  }
};

/**
 * Thu thập dữ liệu từ form
 * @returns {Object} Dữ liệu diễn giả
 */
const collectFormData = () => {
  // Lấy dữ liệu từ form
  return {
    id: currentSpeakerId,
    ten_dien_gia: document.getElementById('speakerName').value.trim(),
    chuc_danh: document.getElementById('speakerTitle').value.trim(),
    to_chuc: document.getElementById('speakerOrganization').value.trim(),
    email: document.getElementById('speakerEmail').value.trim(),
    dien_thoai: document.getElementById('speakerPhone').value.trim(),
    website: document.getElementById('speakerWebsite').value.trim(),
    gioi_thieu: document.getElementById('speakerIntro').value.trim(),
    chuyen_mon: document.getElementById('speakerExpertise').value.trim(),
    thanh_tuu: document.getElementById('speakerAchievements').value.trim(),
    facebook: document.getElementById('speakerFacebook').value.trim(),
    twitter: document.getElementById('speakerTwitter').value.trim(),
    linkedin: document.getElementById('speakerLinkedIn').value.trim(),
    instagram: document.getElementById('speakerInstagram').value.trim(),
    trang_thai: document.getElementById('speakerStatus').checked ? 1 : 0,
    avatar: isAvatarChanged ? document.getElementById('avatarPreview').src : null
  };
};

/**
 * Hàm khởi tạo trang
 */
const initPage = () => {
  AOS.init();
  initTabs();
  initEventListeners();
  initAvatarUpload();
  initFormChangeTracking();
  
  // Tải dữ liệu mẫu
  loadSampleData();
  
  // Đặt lại trạng thái form sau khi tải
  setTimeout(() => {
    formChanged = false;
  }, 100);
};

/**
 * Khởi tạo các sự kiện lắng nghe
 */
const initEventListeners = () => {
  // Khởi tạo nút lưu
  const saveButton = document.getElementById('save-button');
  if (saveButton) {
    saveButton.addEventListener('click', (e) => {
      e.preventDefault();
      saveForm();
    });
  }
  
  // Khởi tạo nút quay lại
  const backButton = document.getElementById('back-button');
  if (backButton) {
    backButton.addEventListener('click', (e) => {
      e.preventDefault();
      
      if (formChanged) {
        if (confirm('Bạn có thay đổi chưa được lưu. Bạn có chắc chắn muốn quay lại không?')) {
          window.location.href = 'speakers.html';
        }
      } else {
        window.location.href = 'speakers.html';
      }
    });
  }
  
  // Theo dõi nhập liệu và xóa lỗi khi người dùng chỉnh sửa
  document.querySelectorAll('input, textarea, select').forEach(field => {
    field.addEventListener('input', () => {
      field.classList.remove('border-red-500');
      const errorElement = field.parentNode.querySelector('.validation-error');
      if (errorElement) {
        errorElement.remove();
      }
    });
  });
};

/**
 * Lưu thay đổi thông tin diễn giả
 */
const saveChanges = () => {
  // Hiển thị trạng thái đang tải
  showLoading(true);
  
  // Thu thập dữ liệu từ form
  const formData = collectFormData();
  
  // Xác thực dữ liệu
  const validationErrors = validateFormData(formData);
  
  if (validationErrors.length > 0) {
    // Hiển thị lỗi
    showErrors(validationErrors);
    showLoading(false);
    return;
  }
  
  // Mô phỏng API call để lưu dữ liệu
  setTimeout(() => {
    try {
      // Trong môi trường thực tế, sẽ gọi API để lưu dữ liệu
      // Ở đây mô phỏng bằng localStorage
      const allSpeakers = JSON.parse(localStorage.getItem('speakers') || '[]');
      
      if (currentSpeakerId) {
        // Cập nhật
        const speakerIndex = allSpeakers.findIndex(s => s.id === currentSpeakerId);
        
        if (speakerIndex !== -1) {
          // Giữ lại avatar cũ nếu không thay đổi
          if (!isAvatarChanged && allSpeakers[speakerIndex].avatar) {
            formData.avatar = allSpeakers[speakerIndex].avatar;
          }
          
          allSpeakers[speakerIndex] = { ...allSpeakers[speakerIndex], ...formData };
        } else {
          showError('Không tìm thấy diễn giả để cập nhật');
          showLoading(false);
          return;
        }
      } else {
        // Thêm mới
        formData.id = Date.now(); // Tạo ID tạm thời
        formData.avatar = formData.avatar || defaultAvatar;
        allSpeakers.push(formData);
      }
      
      // Lưu vào localStorage
      localStorage.setItem('speakers', JSON.stringify(allSpeakers));
      
      // Đánh dấu form không còn thay đổi
      formChanged = false;
      
      // Hiển thị thông báo thành công
      showSuccess('Thông tin diễn giả đã được lưu thành công');
      
      // Chuyển về trang danh sách sau 1.5s
      setTimeout(() => {
        window.location.href = 'speakers.html';
      }, 1500);
    } catch (error) {
      console.error('Lỗi khi lưu dữ liệu:', error);
      showError('Đã xảy ra lỗi khi lưu dữ liệu');
    } finally {
      showLoading(false);
    }
  }, 1000);
};

/**
 * Hiển thị thông báo thành công
 * @param {string} message - Nội dung thông báo
 */
const showSuccess = (message) => {
  // Sử dụng thư viện thông báo (như toastr hoặc sweetalert2)
  if (typeof Swal !== 'undefined') {
    Swal.fire({
      icon: 'success',
      title: 'Thành công',
      text: message,
      timer: 2000,
      showConfirmButton: false
    });
  } else if (typeof toastr !== 'undefined') {
    toastr.success(message);
  } else {
    alert(message);
  }
};

/**
 * Hiển thị thông báo lỗi
 * @param {string} message - Nội dung thông báo lỗi
 */
const showError = (message) => {
  if (typeof Swal !== 'undefined') {
    Swal.fire({
      icon: 'error',
      title: 'Lỗi',
      text: message
    });
  } else if (typeof toastr !== 'undefined') {
    toastr.error(message);
  } else {
    alert('Lỗi: ' + message);
  }
};

/**
 * Hiển thị hoặc ẩn trạng thái đang tải
 * @param {boolean} show - True để hiển thị, False để ẩn
 */
const showLoading = (show) => {
  const loadingElement = document.getElementById('loading-overlay');
  
  if (!loadingElement) {
    // Tạo element nếu chưa tồn tại
    const overlay = document.createElement('div');
    overlay.id = 'loading-overlay';
    overlay.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    overlay.innerHTML = `
      <div class="bg-white p-6 rounded-lg shadow-xl">
        <div class="flex items-center space-x-4">
          <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          <p class="text-gray-700">Đang xử lý...</p>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
    
    if (!show) {
      overlay.style.display = 'none';
    }
  } else {
    loadingElement.style.display = show ? 'flex' : 'none';
  }
};

/**
 * Hiển thị danh sách lỗi
 * @param {string[]} errors - Danh sách các thông báo lỗi
 */
const showErrors = (errors) => {
  if (errors.length === 0) return;
  
  // Tạo nội dung HTML cho danh sách lỗi
  const errorList = errors.map(error => `<li class="text-sm">${error}</li>`).join('');
  
  if (typeof Swal !== 'undefined') {
    Swal.fire({
      icon: 'error',
      title: 'Lỗi dữ liệu',
      html: `<ul class="text-left list-disc pl-5">${errorList}</ul>`,
      confirmButtonText: 'Đồng ý'
    });
  } else if (typeof toastr !== 'undefined') {
    toastr.error(`<ul class="pl-3">${errorList}</ul>`, 'Lỗi dữ liệu', { timeOut: 5000 });
  } else {
    alert('Có lỗi trong dữ liệu:\n - ' + errors.join('\n - '));
  }
};

const validateFormData = (formData) => {
  const errors = [];
  
  // Kiểm tra các trường bắt buộc
  if (!formData.ten_dien_gia.trim()) {
    errors.push('Họ tên diễn giả không được để trống');
  }
  
  if (!formData.chuc_danh.trim()) {
    errors.push('Chức danh không được để trống');
  }
  
  if (!formData.to_chuc.trim()) {
    errors.push('Tổ chức không được để trống');
  }
  
  // Kiểm tra email nếu có
  if (formData.email && !isValidEmail(formData.email)) {
    errors.push('Email không đúng định dạng');
  }
  
  // Kiểm tra số điện thoại nếu có
  if (formData.dien_thoai && !isValidPhone(formData.dien_thoai)) {
    errors.push('Số điện thoại không đúng định dạng');
  }
  
  // Kiểm tra URL website nếu có
  if (formData.website) {
    try {
      new URL(formData.website);
    } catch (e) {
      errors.push('URL website không hợp lệ');
    }
  }
  
  return errors;
};

const updateSpeaker = () => {
  // Lấy dữ liệu từ form
  const formData = {
    id: currentSpeakerId,
    ten_dien_gia: document.getElementById('speakerName').value,
    chuc_danh: document.getElementById('speakerTitle').value,
    to_chuc: document.getElementById('speakerOrganization').value,
    email: document.getElementById('speakerEmail').value,
    dien_thoai: document.getElementById('speakerPhone').value,
    website: document.getElementById('speakerWebsite').value,
    gioi_thieu: document.getElementById('speakerIntro').value,
    chuyen_mon: document.getElementById('speakerExpertise').value,
    thanh_tuu: document.getElementById('speakerAchievements').value,
    facebook: document.getElementById('speakerFacebook').value,
    twitter: document.getElementById('speakerTwitter').value,
    linkedin: document.getElementById('speakerLinkedIn').value,
    instagram: document.getElementById('speakerInstagram').value,
    trang_thai: document.getElementById('speakerStatus').checked ? 1 : 0
  };

  // Xác thực dữ liệu
  const validationErrors = validateFormData(formData);
  
  if (validationErrors.length > 0) {
    // Hiển thị lỗi cho người dùng
    showNotification('error', 'Lỗi xác thực dữ liệu', validationErrors.join('<br>'));
    return;
  }

  // Mô phỏng API call
  setTimeout(() => {
    // Trong môi trường thực tế, sẽ gửi dữ liệu lên server
    console.log('Dữ liệu diễn giả đã được cập nhật:', formData);
    
    // Cập nhật dữ liệu vào localStorage để mô phỏng
    const allSpeakers = JSON.parse(localStorage.getItem('speakers') || '[]');
    const speakerIndex = allSpeakers.findIndex(s => s.id === currentSpeakerId);
    
    if (speakerIndex !== -1) {
      allSpeakers[speakerIndex] = {...allSpeakers[speakerIndex], ...formData};
    } else {
      // Trường hợp thêm mới
      formData.id = Date.now(); // Tạo ID tạm thời
      formData.avatar = defaultAvatar; // Sử dụng avatar mặc định
      allSpeakers.push(formData);
    }
    
    localStorage.setItem('speakers', JSON.stringify(allSpeakers));
    
    // Thông báo thành công
    showNotification('success', 'Thành công', 'Thông tin diễn giả đã được cập nhật');
    
    // Chuyển về trang danh sách sau 2 giây
    setTimeout(() => {
      window.location.href = 'speakers.html';
    }, 2000);
  }, 1000);
};

/**
 * Hiển thị thông báo cho người dùng
 * @param {string} type - Loại thông báo (success, error, warning, info)
 * @param {string} title - Tiêu đề thông báo
 * @param {string} message - Nội dung thông báo
 */
const showNotification = (type, title, message) => {
  // Kiểm tra xem thư viện Toastr đã được tải chưa
  if (typeof toastr !== 'undefined') {
    toastr.options = {
      closeButton: true,
      progressBar: true,
      positionClass: "toast-top-right",
      timeOut: 5000
    };
    
    switch(type) {
      case 'success':
        toastr.success(message, title);
        break;
      case 'error':
        toastr.error(message, title);
        break;
      case 'warning':
        toastr.warning(message, title);
        break;
      case 'info':
        toastr.info(message, title);
        break;
      default:
        toastr.info(message, title);
    }
  } else {
    // Fallback khi không có thư viện Toastr
    alert(`${title}: ${message}`);
  }
};

// Xử lý sự kiện khi trang được tải
document.addEventListener('DOMContentLoaded', () => {
  AOS.init();
  
  // Khởi tạo tab
  initTabs();
  
  // Lấy ID diễn giả từ URL
  const urlParams = new URLSearchParams(window.location.search);
  currentSpeakerId = parseInt(urlParams.get('id')) || null;
  
  // Nếu có ID, tải dữ liệu diễn giả
  if (currentSpeakerId) {
    loadSpeakerData(currentSpeakerId);
    document.getElementById('pageTitle').textContent = 'Cập nhật thông tin diễn giả';
  } else {
    document.getElementById('pageTitle').textContent = 'Thêm diễn giả mới';
  }
  
  // Xử lý nút cập nhật
  document.getElementById('updateButton').addEventListener('click', updateSpeaker);
  
  // Xử lý nút hủy
  document.getElementById('cancelButton').addEventListener('click', () => {
    window.location.href = 'speakers.html';
  });
  
  // Xử lý xem trước avatar
  const avatarInput = document.getElementById('avatarUpload');
  const previewImage = document.getElementById('avatarPreview');
  
  avatarInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        previewImage.src = e.target.result;
        avatarChanged = true;
      };
      reader.readAsDataURL(file);
    }
  });

  // Xử lý nút reset avatar
  document.getElementById('resetAvatar').addEventListener('click', () => {
    previewImage.src = defaultAvatar;
    avatarInput.value = '';
    avatarChanged = true;
  });
}); 