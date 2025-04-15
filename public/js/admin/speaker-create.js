/**
 * Quản lý trang tạo diễn giả mới
 */

// Hàm khởi tạo khi tài liệu đã sẵn sàng
document.addEventListener('DOMContentLoaded', () => {
  // Khởi tạo hiệu ứng AOS
  AOS.init();
  
  // Quản lý tabs
  initTabNavigation();
  
  // Quản lý Avatar
  initAvatarUpload();
  
  // Khởi tạo dữ liệu mẫu cho select box
  initSelectBoxData();
  
  // Xử lý form
  initFormHandling();
  
  // Phím tắt
  initKeyboardShortcuts();
  
  // Sidebar
  initSidebar();
  
  // Kiểm tra xem là tạo mới hay chỉnh sửa (nếu có ID trong URL)
  initSpeakerDataLoad();
});

/**
 * Quản lý tabs và chuyển đổi tab
 */
const initTabNavigation = () => {
  const tabButtons = document.querySelectorAll('.tab-button');
  const tabContents = document.querySelectorAll('[data-tab-content]');
  
  // Hàm chuyển tab với hiệu ứng
  const switchTab = (tabId) => {
    // Ẩn tất cả tab content trước với hiệu ứng fade
    tabContents.forEach(content => {
      if (!content.classList.contains('hidden')) {
        content.style.opacity = '0';
        content.style.transform = 'translateY(10px)';
        
        setTimeout(() => {
          content.classList.add('hidden');
          
          // Hiển thị tab được chọn sau đó
          const selectedContent = document.querySelector(`[data-tab-content="${tabId}"]`);
          if (selectedContent) {
            selectedContent.classList.remove('hidden');
            
            // Đặt lại vị trí và hiệu ứng
            selectedContent.style.transform = 'translateY(10px)';
            selectedContent.style.opacity = '0';
            
            // Trigger reflow
            void selectedContent.offsetWidth;
            
            // Animate in
            setTimeout(() => {
              selectedContent.style.opacity = '1';
              selectedContent.style.transform = 'translateY(0)';
            }, 10);
          }
        }, 200);
      }
    });
    
    // Nếu tất cả các tab đều đang ẩn
    if (Array.from(tabContents).every(content => content.classList.contains('hidden'))) {
      const selectedContent = document.querySelector(`[data-tab-content="${tabId}"]`);
      if (selectedContent) {
        selectedContent.classList.remove('hidden');
        selectedContent.style.opacity = '0';
        selectedContent.style.transform = 'translateY(10px)';
        
        setTimeout(() => {
          selectedContent.style.opacity = '1';
          selectedContent.style.transform = 'translateY(0)';
        }, 10);
      }
    }
    
    // Bỏ chọn tất cả tab buttons
    tabButtons.forEach(btn => {
      btn.classList.remove('border-primary', 'text-primary');
      btn.classList.add('border-transparent', 'text-gray-500');
      btn.setAttribute('aria-selected', 'false');
    });
    
    // Style cho tab button được chọn
    const activeTabButton = document.querySelector(`.tab-button[data-tab="${tabId}"]`);
    if (activeTabButton) {
      activeTabButton.classList.remove('border-transparent', 'text-gray-500');
      activeTabButton.classList.add('border-primary', 'text-primary');
      activeTabButton.setAttribute('aria-selected', 'true');
    }
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
  
  // Khởi tạo tab mặc định
  if (tabButtons.length > 0) {
    const defaultTabId = tabButtons[0].getAttribute('data-tab');
    switchTab(defaultTabId);
  }
};

/**
 * Quản lý upload ảnh đại diện
 */
const initAvatarUpload = () => {
  const avatarInput = document.getElementById('hinh_anh');
  const avatarPreview = document.getElementById('avatar_preview');
  const defaultAvatar = document.getElementById('default_avatar');
  const customAvatar = document.getElementById('custom_avatar');
  const dropZone = document.querySelector('.avatar-drop-zone');
  
  if (!avatarInput || !dropZone) return;
  
  // Thêm hiệu ứng ripple khi click vào dropzone
  dropZone.addEventListener('click', function(e) {
    // Kích hoạt input file khi click vào drop zone
    avatarInput.click();
    
    const rect = dropZone.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const ripple = document.createElement('span');
    ripple.classList.add('ripple');
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    
    dropZone.appendChild(ripple);
    
    setTimeout(() => {
      ripple.remove();
    }, 600);
  });
  
  // Xử lý khi chọn file
  avatarInput.addEventListener('change', (e) => {
    handleAvatarFileSelection(e.target.files[0]);
  });
  
  // Hàm xử lý file ảnh đã chọn
  const handleAvatarFileSelection = (file) => {
    if (!file) return;
    
    // Kiểm tra kích thước file (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      showMessage('Kích thước file không được vượt quá 2MB', 'error');
      avatarInput.value = '';
      return;
    }
    
    // Kiểm tra loại file
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      showMessage('Chỉ chấp nhận file JPG, JPEG hoặc PNG', 'error');
      avatarInput.value = '';
      return;
    }
    
    // Hiển thị thông báo đang tải
    showMessage('Đang xử lý ảnh...', 'info');
    
    const reader = new FileReader();
    reader.onload = (event) => {
      // Ẩn avatar mặc định và hiển thị avatar tùy chỉnh
      if (defaultAvatar) defaultAvatar.classList.add('hidden');
      if (customAvatar) customAvatar.classList.remove('hidden');
      
      // Xử lý hiển thị ảnh
      if (customAvatar) {
        let img = customAvatar.querySelector('img');
        if (!img) {
          img = document.createElement('img');
          img.className = 'h-full w-full object-cover rounded-full';
          img.alt = 'Ảnh đại diện';
          customAvatar.appendChild(img);
        }
        img.src = event.target.result;
      }
      
      // Thêm hiệu ứng khi ảnh được tải
      const avatarContainer = customAvatar?.parentElement;
      if (avatarContainer) {
        avatarContainer.classList.add('ring', 'ring-primary', 'ring-opacity-50');
        setTimeout(() => {
          avatarContainer.classList.remove('ring', 'ring-primary', 'ring-opacity-50');
        }, 800);
      }
      
      // Tạo hiệu ứng pulse trên avatar
      if (customAvatar) customAvatar.classList.add('animate-pulse');
      setTimeout(() => {
        if (customAvatar) customAvatar.classList.remove('animate-pulse');
        showMessage('Ảnh đã được tải lên thành công', 'success');
      }, 1000);
    };
    
    // Xử lý lỗi đọc file
    reader.onerror = () => {
      showMessage('Có lỗi khi đọc file. Vui lòng thử lại.', 'error');
      avatarInput.value = '';
    };
    
    reader.readAsDataURL(file);
  };
  
  // Xóa avatar với animation
  window.removeAvatar = () => {
    if (customAvatar && !customAvatar.classList.contains('hidden')) {
      customAvatar.classList.add('scale-0');
      setTimeout(() => {
        avatarInput.value = '';
        if (defaultAvatar) defaultAvatar.classList.remove('hidden');
        if (customAvatar) {
          customAvatar.classList.add('hidden');
          customAvatar.classList.remove('scale-0');
          
          // Xóa ảnh hiện tại
          const img = customAvatar.querySelector('img');
          if (img) img.remove();
        }
        
        showMessage('Đã xóa ảnh đại diện', 'info');
      }, 300);
    }
  };
  
  // Xử lý kéo thả với hiệu ứng tốt hơn
  dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropZone.classList.add('border-primary', 'bg-primary/5');
  });
  
  dropZone.addEventListener('dragleave', (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropZone.classList.remove('border-primary', 'bg-primary/5');
  });
  
  dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropZone.classList.remove('border-primary', 'bg-primary/5');
    
    if (e.dataTransfer.files.length) {
      handleAvatarFileSelection(e.dataTransfer.files[0]);
    }
  });
};

/**
 * Khởi tạo dữ liệu cho các select box
 */
const initSelectBoxData = () => {
  // Dữ liệu mẫu lĩnh vực chuyên môn
  const expertiseAreas = [
    { id: 'banking', name: 'Ngân hàng' },
    { id: 'finance', name: 'Tài chính' },
    { id: 'economics', name: 'Kinh tế học' },
    { id: 'investment', name: 'Đầu tư' },
    { id: 'fintech', name: 'Công nghệ tài chính' },
    { id: 'blockchain', name: 'Blockchain' },
    { id: 'ai', name: 'Trí tuệ nhân tạo' },
    { id: 'data_science', name: 'Khoa học dữ liệu' },
    { id: 'digital_marketing', name: 'Marketing số' },
    { id: 'ecommerce', name: 'Thương mại điện tử' }
  ];
  
  // Dữ liệu mẫu chức danh
  const positions = [
    { id: 'giao_su', name: 'Giáo sư' },
    { id: 'pho_giao_su', name: 'Phó giáo sư' },
    { id: 'tien_si', name: 'Tiến sĩ' },
    { id: 'thac_si', name: 'Thạc sĩ' },
    { id: 'giam_doc', name: 'Giám đốc điều hành' },
    { id: 'chuyen_gia', name: 'Chuyên gia' },
    { id: 'giam_doc_ky_thuat', name: 'Giám đốc kỹ thuật' },
    { id: 'truong_phong', name: 'Trưởng phòng' },
    { id: 'nghien_cuu_vien', name: 'Nghiên cứu viên' },
    { id: 'quan_ly', name: 'Quản lý cấp cao' }
  ];
  
  // Hàm điền dữ liệu vào select box
  const populateSelect = (selectId, data, placeholder = '-- Chọn --') => {
    const select = document.getElementById(selectId);
    if (!select) return;
    
    // Xóa tất cả option hiện có
    select.innerHTML = '';
    
    // Thêm placeholder option
    const placeholderOption = document.createElement('option');
    placeholderOption.value = '';
    placeholderOption.textContent = placeholder;
    select.appendChild(placeholderOption);
    
    // Thêm các option từ dữ liệu
    data.forEach(item => {
      const option = document.createElement('option');
      option.value = item.id;
      option.textContent = item.name;
      select.appendChild(option);
    });
  };
  
  // Điền dữ liệu vào các select box
  populateSelect('expertise', expertiseAreas, '-- Chọn lĩnh vực chuyên môn --');
  populateSelect('chuc_danh', positions, '-- Chọn chức danh --');
  
  // Điền thêm data vào các select box khác nếu cần
};

/**
 * Xử lý form - mở rộng với xử lý dữ liệu diễn giả
 */
const initFormHandling = () => {
  const speakerForm = document.getElementById('speaker-form');
  
  if (!speakerForm) return;
  
  speakerForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Kiểm tra các trường bắt buộc
    const requiredFields = [
      'ten_dien_gia', 
      'to_chuc', 
      'email',
      'expertise'
    ];
    
    let hasError = false;
    
    requiredFields.forEach(field => {
      const element = document.getElementById(field);
      if (!element || !element.value.trim()) {
        hasError = true;
        // Thêm animation lỗi
        element.classList.add('border-red-500', 'animate-shake');
        setTimeout(() => {
          element.classList.remove('animate-shake');
        }, 500);
      } else {
        element.classList.remove('border-red-500');
      }
    });
    
    if (hasError) {
      showMessage('Vui lòng điền đầy đủ thông tin bắt buộc', 'error');
      return;
    }
    
    // Thu thập dữ liệu diễn giả
    const speakerData = {
      basic: {
        id: getSpeakerId(),
        name: document.getElementById('ten_dien_gia').value,
        title: document.getElementById('chuc_danh').value,
        organization: document.getElementById('to_chuc').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('dien_thoai').value,
        website: document.getElementById('website').value,
        bio: document.getElementById('gioi_thieu').value,
        status: Number(document.getElementById('status').value)
      },
      professional: {
        expertise: document.getElementById('expertise').value,
        achievements: document.getElementById('achievements').value,
        experience: document.getElementById('experience').value,
        eventCount: Number(document.getElementById('eventCount').value)
      },
      socials: {
        linkedin: document.getElementById('linkedin').value,
        facebook: document.getElementById('facebook').value,
        twitter: document.getElementById('twitter').value,
        youtube: document.getElementById('youtube').value,
        instagram: document.getElementById('instagram').value
      },
      avatar: {
        url: document.getElementById('custom_avatar').style.backgroundImage 
          ? document.getElementById('custom_avatar').style.backgroundImage.replace('url("', '').replace('")', '') 
          : ''
      }
    };
    
    console.log('Dữ liệu diễn giả:', speakerData);
    
    // Cập nhật trạng thái nút submit
    const submitButton = document.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    submitButton.disabled = true;
    submitButton.innerHTML = `
      <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      Đang xử lý...
    `;
    
    // Mô phỏng API call
    setTimeout(() => {
      const isNewSpeaker = !getSpeakerId();
      
      // Hiển thị thông báo thành công
      if (isNewSpeaker) {
        showMessage('Đã tạo diễn giả thành công!', 'success');
      } else {
        showMessage('Đã cập nhật thông tin diễn giả thành công!', 'success');
      }
      // Khôi phục trạng thái nút
      submitButton.disabled = false;
      submitButton.innerHTML = originalText;
      
      // Chuyển hướng sau 1.5 giây
      setTimeout(() => {
        window.location.href = 'speakers.html';
      }, 1500);
    }, 1500);
  });
  
  // Xử lý nút hủy
  const cancelButton = document.querySelector('button[onclick="history.back()"]');
  if (cancelButton) {
    cancelButton.onclick = function(e) {
      e.preventDefault();
      if (confirm('Bạn có chắc muốn hủy các thay đổi không?')) {
        window.location.href = 'speakers.html';
      }
    };
  }
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
 * Khởi tạo phím tắt
 */
const initKeyboardShortcuts = () => {
  // Phím tắt đã được xử lý trong initTabNavigation
};

/**
 * Khởi tạo sidebar
 */
const initSidebar = () => {
  const sidebar = document.getElementById('sidebar');
  const sidebarOpen = document.getElementById('sidebar-open');
  const sidebarClose = document.getElementById('sidebar-close');
  const sidebarBackdrop = document.getElementById('sidebar-backdrop');
  
  // Mở sidebar (mobile)
  sidebarOpen?.addEventListener('click', () => {
    sidebar.classList.remove('-translate-x-full');
    sidebarBackdrop.classList.remove('hidden');
  });
  
  // Đóng sidebar (mobile)
  const closeSidebar = () => {
    sidebar.classList.add('-translate-x-full');
    sidebarBackdrop.classList.add('hidden');
  };
  
  sidebarClose?.addEventListener('click', closeSidebar);
  sidebarBackdrop?.addEventListener('click', closeSidebar);
};

/**
 * Kiểm tra và tải dữ liệu diễn giả nếu là chế độ chỉnh sửa
 */
const initSpeakerDataLoad = () => {
  // Kiểm tra xem có tham số id trong URL không
  const urlParams = new URLSearchParams(window.location.search);
  const speakerId = urlParams.get('id');
  
  if (speakerId) {
    // Đây là chế độ chỉnh sửa, tải dữ liệu diễn giả
    loadSpeakerData(speakerId);
    
    // Cập nhật tiêu đề trang và nút submit
    const pageTitle = document.querySelector('h1');
    if (pageTitle) {
      pageTitle.textContent = 'Chỉnh sửa diễn giả';
    }
    
    const submitButton = document.querySelector('button[type="submit"]');
    if (submitButton) {
      submitButton.innerHTML = '<i class="ri-save-line mr-1"></i> Cập nhật diễn giả';
    }
  }
};

/**
 * Tải dữ liệu diễn giả theo ID
 */
const loadSpeakerData = (speakerId) => {
  showMessage('Đang tải thông tin diễn giả...', 'info');
  
  // Giả lập API call để lấy dữ liệu diễn giả
  setTimeout(() => {
    // Dữ liệu mẫu
    const speakerData = {
      id: speakerId,
      ten_dien_gia: 'Nguyễn Văn A',
      chuc_danh: 'tien_si',
      to_chuc: 'Đại học Ngân hàng TP.HCM',
      email: 'nguyenvana@example.com',
      dien_thoai: '0123456789',
      chuyen_mon: 'finance',
      gioi_thieu: 'Chuyên gia hàng đầu trong lĩnh vực tài chính ngân hàng',
      thanh_tuu: 'Đã xuất bản nhiều công trình nghiên cứu về tài chính',
      trang_thai: '1',
      website: 'https://example.com',
      facebook: 'https://facebook.com/example',
      linkedin: 'https://linkedin.com/in/example',
      twitter: '',
      hinh_anh: 'https://i.pravatar.cc/150?img=30'
    };
    
    // Điền dữ liệu vào form
    fillSpeakerForm(speakerData);
    
    showMessage('Đã tải thông tin diễn giả', 'success');
  }, 1000);
};

/**
 * Điền dữ liệu diễn giả vào form
 */
const fillSpeakerForm = (data) => {
  const form = document.getElementById('speaker-form');
  if (!form) return;
  
  // Đặt ID diễn giả vào form
  form.setAttribute('data-speaker-id', data.id);
  
  // Điền dữ liệu cơ bản
  const setFieldValue = (fieldId, value) => {
    const field = document.getElementById(fieldId);
    if (field) field.value = value || '';
  };
  
  // Điền thông tin cơ bản
  setFieldValue('ten_dien_gia', data.ten_dien_gia);
  setFieldValue('chuc_danh', data.chuc_danh);
  setFieldValue('to_chuc', data.to_chuc);
  setFieldValue('email', data.email);
  setFieldValue('dien_thoai', data.dien_thoai);
  setFieldValue('gioi_thieu', data.gioi_thieu);
  setFieldValue('status', data.trang_thai);
  setFieldValue('website', data.website);
  
  // Điền thông tin chuyên môn
  setFieldValue('expertise', data.chuyen_mon);
  setFieldValue('achievements', data.thanh_tuu);
  
  // Điền mạng xã hội
  setFieldValue('facebook', data.facebook);
  setFieldValue('linkedin', data.linkedin);
  setFieldValue('twitter', data.twitter);
  setFieldValue('instagram', data.instagram);
  setFieldValue('youtube', data.youtube);
  
  // Xử lý ảnh đại diện
  if (data.hinh_anh) {
    const defaultAvatar = document.getElementById('default_avatar');
    const customAvatar = document.getElementById('custom_avatar');
    
    defaultAvatar?.classList.add('hidden');
    customAvatar?.classList.remove('hidden');
    
    if (customAvatar) {
      if (customAvatar.querySelector('img')) {
        customAvatar.querySelector('img').src = data.hinh_anh;
      } else {
        const img = document.createElement('img');
        img.src = data.hinh_anh;
        img.className = 'h-full w-full object-cover rounded-full';
        img.alt = 'Ảnh đại diện';
        customAvatar.appendChild(img);
      }
    }
  }
};
