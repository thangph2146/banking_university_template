/**
 * Quản lý trang cập nhật thông tin người dùng
 */

// Hàm khởi tạo khi tài liệu đã sẵn sàng
document.addEventListener('DOMContentLoaded', () => {
  // Khởi tạo hiệu ứng AOS
  AOS.init();
  
  // Quản lý tabs
  initTabNavigation();
  
  // Quản lý hiển thị/ẩn mật khẩu
  initPasswordToggle();
  
  // Tự động điền họ tên đầy đủ
  initFullNameAutoFill();
  
  // Tải dữ liệu cho các select box
  initSelectBoxData();
  
  // Cấu hình form mật khẩu
  initPasswordSection();
  
  // Xử lý form
  initFormHandling();
  
  // Phím tắt
  initKeyboardShortcuts();
  
  // Sidebar
  initSidebar();
  
  // Tải dữ liệu người dùng
  loadUserData();
});

/**
 * Quản lý tabs và chuyển đổi tab
 */
const initTabNavigation = () => {
  const tabButtons = document.querySelectorAll('.tab-button');
  const tabContents = document.querySelectorAll('.tab-content');
  
  // Hàm chuyển tab
  const switchTab = (tabId) => {
    // Ẩn tất cả tab content với hiệu ứng fade
    tabContents.forEach(content => {
      content.style.opacity = '0';
      setTimeout(() => {
        if (content.id !== tabId) {
          content.classList.add('hidden');
          content.setAttribute('aria-hidden', 'true');
        }
      }, 300);
    });
    
    // Bỏ chọn tất cả tab buttons
    tabButtons.forEach(btn => {
      btn.classList.remove('border-primary', 'text-primary');
      btn.classList.add('border-transparent', 'text-gray-500');
      btn.setAttribute('aria-selected', 'false');
    });
    
    // Hiển thị tab content được chọn với hiệu ứng fade
    const selectedContent = document.getElementById(tabId);
    if (selectedContent) {
      if (selectedContent.classList.contains('hidden')) {
        selectedContent.classList.remove('hidden');
        // Cho phép layout tính toán trước khi bắt đầu transition
        setTimeout(() => {
          selectedContent.style.opacity = '1';
          selectedContent.setAttribute('aria-hidden', 'false');
        }, 10);
      } else {
        selectedContent.style.opacity = '1';
        selectedContent.setAttribute('aria-hidden', 'false');
      }
    }
    
    // Style cho tab button được chọn
    const activeTabButton = document.querySelector(`.tab-button[data-tab="${tabId}"]`);
    if (activeTabButton) {
      activeTabButton.classList.remove('border-transparent', 'text-gray-500');
      activeTabButton.classList.add('border-primary', 'text-primary');
      activeTabButton.setAttribute('aria-selected', 'true');
    }
    
    // Lưu tab hiện tại vào localStorage
    localStorage.setItem('currentUserTab', tabId);
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
    
    // Alt + 1-3 để chuyển đến tab tương ứng
    if (e.altKey && e.key >= '1' && e.key <= '3') {
      e.preventDefault();
      const tabIndex = parseInt(e.key) - 1;
      switchTabByIndex(tabIndex);
    }
  });
  
  // Khôi phục tab đã chọn từ localStorage
  const savedTab = localStorage.getItem('currentUserTab');
  if (savedTab) {
    switchTab(savedTab);
  }
};

/**
 * Quản lý hiển thị/ẩn mật khẩu
 */
const initPasswordToggle = () => {
  const toggleButtons = document.querySelectorAll('.toggle-password');
  
  toggleButtons.forEach(button => {
    button.addEventListener('click', () => {
      const passwordField = button.parentNode.querySelector('input');
      const icon = button.querySelector('i');
      
      if (passwordField.type === 'password') {
        passwordField.type = 'text';
        icon.classList.remove('ri-eye-off-line');
        icon.classList.add('ri-eye-line');
      } else {
        passwordField.type = 'password';
        icon.classList.remove('ri-eye-line');
        icon.classList.add('ri-eye-off-line');
      }
    });
  });
};

/**
 * Tự động điền họ tên đầy đủ
 */
const initFullNameAutoFill = () => {
  const hoInput = document.getElementById('ho');
  const tenDemInput = document.getElementById('ten_dem');
  const tenInput = document.getElementById('ten');
  const hoTenDayDuInput = document.getElementById('ho_ten_day_du');
  
  const updateFullName = () => {
    const ho = hoInput.value.trim();
    const tenDem = tenDemInput.value.trim();
    const ten = tenInput.value.trim();
    
    let fullName = '';
    if (ho) fullName += ho;
    if (tenDem) fullName += (fullName ? ' ' : '') + tenDem;
    if (ten) fullName += (fullName ? ' ' : '') + ten;
    
    hoTenDayDuInput.value = fullName;
  };
  
  // Đăng ký sự kiện
  hoInput.addEventListener('input', updateFullName);
  tenDemInput.addEventListener('input', updateFullName);
  tenInput.addEventListener('input', updateFullName);
};

/**
 * Tải dữ liệu cho các select box
 */
const initSelectBoxData = () => {
  // Mảng dữ liệu mẫu - trong thực tế sẽ được tải từ API
  const sampleUserTypes = [
    { id: 1, name: 'Sinh viên' },
    { id: 2, name: 'Giảng viên' },
    { id: 3, name: 'Cán bộ' },
    { id: 4, name: 'Khách' }
  ];
  
  const sampleDepartments = [
    { id: 1, name: 'Khoa Công nghệ thông tin' },
    { id: 2, name: 'Khoa Kinh tế' },
    { id: 3, name: 'Khoa Ngôn ngữ' },
    { id: 4, name: 'Phòng Đào tạo' },
    { id: 5, name: 'Phòng Công tác sinh viên' }
  ];
  
  const sampleAcademicYears = [
    { id: 1, name: 'Năm học 2023-2024' },
    { id: 2, name: 'Năm học 2022-2023' },
    { id: 3, name: 'Năm học 2021-2022' }
  ];
  
  const sampleAcademicLevels = [
    { id: 1, name: 'Đại học' },
    { id: 2, name: 'Cao đẳng' },
    { id: 3, name: 'Thạc sĩ' },
    { id: 4, name: 'Tiến sĩ' }
  ];
  
  const sampleEducationSystems = [
    { id: 1, name: 'Chính quy' },
    { id: 2, name: 'Liên thông' },
    { id: 3, name: 'Văn bằng 2' },
    { id: 4, name: 'Từ xa' }
  ];
  
  const sampleMajors = [
    { id: 1, name: 'Công nghệ thông tin', departmentId: 1 },
    { id: 2, name: 'Kỹ thuật phần mềm', departmentId: 1 },
    { id: 3, name: 'An toàn thông tin', departmentId: 1 },
    { id: 4, name: 'Kinh tế đối ngoại', departmentId: 2 },
    { id: 5, name: 'Tài chính ngân hàng', departmentId: 2 },
    { id: 6, name: 'Tiếng Anh', departmentId: 3 },
    { id: 7, name: 'Tiếng Nhật', departmentId: 3 }
  ];
  
  // Điền dữ liệu vào các dropdown
  const populateSelect = (selectId, data, placeholder = '-- Chọn --') => {
    const select = document.getElementById(selectId);
    if (!select) return;
    
    select.innerHTML = '';
    
    // Thêm option placeholder mặc định
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = placeholder;
    select.appendChild(defaultOption);
    
    // Thêm các options từ dữ liệu
    data.forEach(item => {
      const option = document.createElement('option');
      option.value = item.id;
      option.textContent = item.name;
      select.appendChild(option);
    });
  };
  
  // Điền dữ liệu cho các select
  populateSelect('loai_nguoi_dung', sampleUserTypes, '-- Chọn loại người dùng --');
  populateSelect('phong_khoa', sampleDepartments, '-- Chọn phòng/khoa --');
  populateSelect('nam_hoc', sampleAcademicYears, '-- Chọn năm học --');
  populateSelect('bac_hoc', sampleAcademicLevels, '-- Chọn bậc học --');
  populateSelect('he_dao_tao', sampleEducationSystems, '-- Chọn hệ đào tạo --');
  populateSelect('nganh', sampleMajors, '-- Chọn ngành đào tạo --');
  
  // Xử lý lọc ngành theo phòng khoa
  const filterMajorsByDepartment = () => {
    const phongKhoaSelect = document.getElementById('phong_khoa');
    const nganhSelect = document.getElementById('nganh');
    
    if (!phongKhoaSelect || !nganhSelect) return;
    
    const selectedDepartmentId = parseInt(phongKhoaSelect.value);
    
    if (!selectedDepartmentId) {
      // Nếu không chọn phòng khoa, hiển thị tất cả ngành
      populateSelect('nganh', sampleMajors, '-- Chọn ngành đào tạo --');
    } else {
      // Lọc ngành theo phòng khoa
      const filteredMajors = sampleMajors.filter(
        major => major.departmentId === selectedDepartmentId
      );
      populateSelect('nganh', filteredMajors, '-- Chọn ngành đào tạo --');
    }
  };
  
  // Đăng ký sự kiện thay đổi phòng khoa
  const phongKhoaSelect = document.getElementById('phong_khoa');
  if (phongKhoaSelect) {
    phongKhoaSelect.addEventListener('change', filterMajorsByDepartment);
  }
};

/**
 * Cấu hình phần mật khẩu
 */
const initPasswordSection = () => {
  const passwordSection = document.getElementById('password-section');
  if (!passwordSection) return;

  // Thêm checkbox thay đổi mật khẩu
  const passwordToggle = document.createElement('div');
  passwordToggle.className = 'md:col-span-2 mb-4';
  passwordToggle.innerHTML = `
    <div class="flex items-center">
      <input type="checkbox" id="change_password" class="text-primary focus:ring-primary h-4 w-4">
      <label for="change_password" class="ml-2 block text-sm text-gray-700 font-medium">
        Thay đổi mật khẩu
      </label>
    </div>
  `;
  
  // Chèn vào đầu phần mật khẩu
  passwordSection.insertBefore(passwordToggle, passwordSection.firstChild);
  
  // Ẩn các trường mật khẩu ban đầu
  const passwordFields = passwordSection.querySelectorAll('.form-group, div:not(:first-child)');
  passwordFields.forEach(field => {
    if (!field.classList.contains('md:col-span-2')) {
      field.classList.add('hidden');
    }
  });
  
  // Xử lý checkbox thay đổi mật khẩu
  const changePasswordCheckbox = document.getElementById('change_password');
  if (changePasswordCheckbox) {
    changePasswordCheckbox.addEventListener('change', () => {
      passwordFields.forEach(field => {
        if (!field.classList.contains('md:col-span-2') || field !== passwordToggle) {
          if (changePasswordCheckbox.checked) {
            field.classList.remove('hidden');
          } else {
            field.classList.add('hidden');
          }
        }
      });
    });
  }
  
  // Vô hiệu hóa trường mật khẩu khi không thay đổi
  const autoGenerateCheckbox = document.getElementById('auto_generate_password');
  const passwordField = document.getElementById('mat_khau');
  const confirmPasswordField = document.getElementById('nhap_lai_mat_khau');
  
  if (autoGenerateCheckbox && passwordField && confirmPasswordField) {
    autoGenerateCheckbox.addEventListener('change', () => {
      if (autoGenerateCheckbox.checked) {
        passwordField.disabled = true;
        confirmPasswordField.disabled = true;
        passwordField.value = '';
        confirmPasswordField.value = '';
      } else {
        passwordField.disabled = false;
        confirmPasswordField.disabled = false;
      }
    });
  }
};

/**
 * Xử lý gửi form
 */
const initFormHandling = () => {
  const userForm = document.getElementById('user-form');
  const cancelButton = document.getElementById('btn-cancel');
  
  if (!userForm) return;
  
  // Xử lý nút hủy
  if (cancelButton) {
    cancelButton.addEventListener('click', () => {
      if (confirm('Bạn có chắc chắn muốn hủy bỏ? Tất cả các thay đổi sẽ không được lưu.')) {
        window.location.href = 'users.html';
      }
    });
  }
  
  userForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Kiểm tra các trường bắt buộc
    const requiredFields = userForm.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
      if (!field.value.trim()) {
        field.classList.add('border-red-500');
        isValid = false;
      } else {
        field.classList.remove('border-red-500');
      }
    });
    
    // Kiểm tra mật khẩu (chỉ khi thay đổi mật khẩu được chọn)
    const changePasswordCheckbox = document.getElementById('change_password');
    const autoGenerateCheckbox = document.getElementById('auto_generate_password');
    const passwordField = document.getElementById('mat_khau');
    const confirmPasswordField = document.getElementById('nhap_lai_mat_khau');
    
    if (changePasswordCheckbox && changePasswordCheckbox.checked && !autoGenerateCheckbox.checked) {
      if (passwordField.value.length < 6) {
        passwordField.classList.add('border-red-500');
        isValid = false;
        showMessage('Mật khẩu phải có ít nhất 6 ký tự', 'error');
        return;
      }
      
      if (passwordField.value !== confirmPasswordField.value) {
        confirmPasswordField.classList.add('border-red-500');
        isValid = false;
        showMessage('Mật khẩu xác nhận không khớp', 'error');
        return;
      }
    }
    
    if (!isValid) {
      showMessage('Vui lòng điền đầy đủ thông tin bắt buộc', 'error');
      return;
    }
    
    // Xử lý gửi form (thường là gửi AJAX)
    showMessage('Đang cập nhật thông tin người dùng...', 'info');
    
    // Giả lập API call
    setTimeout(() => {
      showMessage('Cập nhật thông tin người dùng thành công!', 'success');
      
      // Chuyển hướng sau 1.5 giây
      setTimeout(() => {
        window.location.href = 'users.html';
      }, 1500);
    }, 1000);
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
  
  // Thêm phím tắt Esc để hủy
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      const cancelButton = document.getElementById('btn-cancel');
      if (cancelButton) cancelButton.click();
    }
  });
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
 * Tải dữ liệu người dùng
 */
const loadUserData = () => {
  // Lấy ID người dùng từ URL
  const urlParams = new URLSearchParams(window.location.search);
  const userId = urlParams.get('id');
  
  if (!userId) {
    showMessage('Không tìm thấy ID người dùng', 'error');
    setTimeout(() => {
      window.location.href = 'users.html';
    }, 2000);
    return;
  }
  
  // Thêm ID vào form dưới dạng trường ẩn
  const idField = document.createElement('input');
  idField.type = 'hidden';
  idField.id = 'nguoi_dung_id';
  idField.name = 'nguoi_dung_id';
  idField.value = userId;
  document.getElementById('user-form').appendChild(idField);
  
  // Hiển thị thông báo đang tải
  const loadingMessage = document.createElement('div');
  loadingMessage.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
  loadingMessage.innerHTML = `
    <div class="bg-white p-6 rounded-lg shadow-xl">
      <div class="flex items-center space-x-4">
        <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        <p class="text-gray-700">Đang tải dữ liệu người dùng...</p>
      </div>
    </div>
  `;
  document.body.appendChild(loadingMessage);
  
  // Giả lập API call để lấy dữ liệu người dùng
  setTimeout(() => {
    // Giả sử đây là dữ liệu người dùng từ API
    const userData = {
      nguoi_dung_id: userId,
      LastName: 'Nguyễn',
      MiddleName: 'Văn',
      FirstName: 'A',
      FullName: 'Nguyễn Văn A',
      Email: 'nguyenvana@example.com',
      MobilePhone: '0912345678',
      HomePhone: '0281234567',
      AccountId: 'nguyenvana',
      AccountType: 'local',
      loai_nguoi_dung_id: 1, // Sinh viên
      phong_khoa_id: 1, // Khoa CNTT
      nam_hoc_id: 1, // 2023-2024
      bac_hoc_id: 1, // Đại học
      he_dao_tao_id: 1, // Chính quy
      nganh_id: 1, // CNTT
      status: 1
    };
    
    // Điền dữ liệu vào form
    document.getElementById('ho').value = userData.LastName;
    document.getElementById('ten_dem').value = userData.MiddleName;
    document.getElementById('ten').value = userData.FirstName;
    document.getElementById('ho_ten_day_du').value = userData.FullName;
    document.getElementById('email').value = userData.Email;
    document.getElementById('dien_thoai').value = userData.MobilePhone;
    document.getElementById('dien_thoai_nha').value = userData.HomePhone;
    document.getElementById('account_id').value = userData.AccountId;
    
    // Chọn các giá trị trong select box
    const setSelectValue = (selectId, value) => {
      const select = document.getElementById(selectId);
      if (select && value) {
        select.value = value;
        // Trigger change event nếu cần
        const event = new Event('change');
        select.dispatchEvent(event);
      }
    };
    
    setSelectValue('loai_nguoi_dung', userData.loai_nguoi_dung_id);
    setSelectValue('account_type', userData.AccountType);
    setSelectValue('phong_khoa', userData.phong_khoa_id);
    setSelectValue('nam_hoc', userData.nam_hoc_id);
    setSelectValue('bac_hoc', userData.bac_hoc_id);
    setSelectValue('he_dao_tao', userData.he_dao_tao_id);
    
    // Thiết lập trạng thái
    const statusRadios = document.querySelectorAll('input[name="status"]');
    statusRadios.forEach(radio => {
      if (parseInt(radio.value) === userData.status) {
        radio.checked = true;
      }
    });
    
    // Đợi một chút để ngành được lọc theo phòng khoa
    setTimeout(() => {
      setSelectValue('nganh', userData.nganh_id);
    }, 100);
    
    // Xóa thông báo đang tải
    document.body.removeChild(loadingMessage);
    
    // Hiển thị thông báo thành công
    showMessage('Tải dữ liệu người dùng thành công!', 'success');
  }, 1500);
};
