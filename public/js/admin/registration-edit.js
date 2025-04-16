/**
 * Registration Edit JavaScript
 * Xử lý chức năng xem và chỉnh sửa đăng ký sự kiện
 */

const RegistrationEditManager = (function() {
  'use strict';

  // Constants
  const API_URL = '../api';
  const STATUS = {
    PENDING: 0,
    APPROVED: 1,
    CANCELLED: -1
  };
  
  const STATUS_LABELS = {
    [STATUS.PENDING]: 'Chờ xác nhận',
    [STATUS.APPROVED]: 'Đã xác nhận',
    [STATUS.CANCELLED]: 'Đã huỷ'
  };
  
  // Cache DOM elements
  const loadingIndicator = document.getElementById('loading-indicator');
  const registrationFormContainer = document.getElementById('registration-form-container');
  const errorMessage = document.getElementById('error-message');
  const errorDetail = document.getElementById('error-detail');
  const registrationForm = document.getElementById('registration-form');
  const viewDetailBtn = document.getElementById('view-detail-btn');
  const registrationIdSpan = document.querySelector('#registration-id span');
  
  // Form input elements
  const eventSelect = document.getElementById('event');
  const participationTypeSelect = document.getElementById('participation-type');
  const registrationSourceSelect = document.getElementById('registration-source');
  const organizationUnitInput = document.getElementById('organization-unit');
  const registrantNameInput = document.getElementById('registrant-name');
  const registrantEmailInput = document.getElementById('registrant-email');
  const registrantPhoneInput = document.getElementById('registrant-phone');
  const registrantTypeSelect = document.getElementById('registrant-type');
  const participationReasonTextarea = document.getElementById('participation-reason');
  const feedbackTextarea = document.getElementById('feedback');
  const registrationStatusSelect = document.getElementById('registration-status');
  
  // Form buttons
  const cancelBtn = document.getElementById('cancel-btn');
  const submitBtn = document.getElementById('submit-btn');
  
  // Registration data
  let registrationData = null;
  
  // Initialize module
  function init() {
    // Get registration ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const registrationId = urlParams.get('id');
    
    if (!registrationId) {
      showError('Không tìm thấy ID đăng ký trong URL');
      return;
    }
    
    // Set view detail button href
    viewDetailBtn.href = `registration-detail.html?id=${registrationId}`;
    
    // Fetch registration data
    loadRegistrationDetail(registrationId);
    
    // Add event listeners
    registrationForm.addEventListener('submit', handleFormSubmit);
    cancelBtn.addEventListener('click', handleCancel);
    registrantTypeSelect.addEventListener('change', toggleAdditionalFields);
    
    // Initialize UI
    UI.initEventListeners();
  }
  
  // Load registration detail
  function loadRegistrationDetail(registrationId) {
    showLoading();
    
    // For demo purposes, we'll simulate an API call with a timeout
    setTimeout(() => {
      fetchRegistrationData(registrationId)
        .then(data => {
          registrationData = data;
          return fetchEvents(); 
        })
        .then(events => {
          populateEvents(events);
          populateForm(registrationData);
          hideLoading();
          showForm();
        })
        .catch(error => {
          console.error('Error loading registration detail:', error);
          showError('Không thể tải thông tin đăng ký. Vui lòng thử lại sau.');
          hideLoading();
        });
    }, 800); // Giả lập độ trễ mạng
  }
  
  // Fetch registration data from API
  function fetchRegistrationData(registrationId) {
    // In a real application, this would be an API call
    // For demo purposes, we'll return mock data
    return getMockRegistrationData(registrationId);
  }
  
  // Fetch events from API
  function fetchEvents() {
    // In a real application, this would be an API call
    // For demo purposes, we'll return mock data
    return getMockEvents();
  }
  
  // Generate mock registration data
  function getMockRegistrationData(registrationId) {
    return new Promise((resolve) => {
      resolve({
        dangky_sukien_id: registrationId,
        su_kien_id: '1',
        email: 'nguyenvansinh@gmail.com',
        ho_ten: 'Nguyễn Văn Sinh',
        dien_thoai: '0912345678',
        loai_nguoi_dang_ky: 'sinh_vien',
        ngay_dang_ky: '2023-07-22 09:15:30',
        ma_xac_nhan: 'REG' + registrationId.padStart(6, '0'),
        status: 1, // APPROVED
        hinhthuc_thamgia: 'offline',
        gop_y: 'Tôi mong rằng sự kiện sẽ có nhiều hoạt động thực hành hơn.',
        nguon_gioi_thieu: 'Facebook',
        ly_do_tham_du: 'Tôi muốn học hỏi thêm kiến thức về lĩnh vực này.',
        don_vi: 'Khoa Ngân hàng, UEH',
        thoi_gian_checkin: '2023-07-25 08:45:22',
        thoi_gian_checkout: '2023-07-25 16:15:30',
        checkin_status: 1,
        checkout_status: 1,
        face_verified: 1,
        phuong_thuc_diem_danh: 'kiosk',
        thoi_gian_duyet: '2023-07-22 10:30:15',
        thoi_gian_tham_du: 445, // Số phút tham dự
        ly_do_huy: null,
        thoi_gian_huy: null,
        // Thông tin bổ sung cho loại người dùng
        ma_sinh_vien: 'UEH20001234',
        lop: 'K45-TMDT',
        nganh_hoc: 'Thương mại điện tử',
        khoa: 'K45'
      });
    });
  }
  
  // Generate mock events data
  function getMockEvents() {
    return new Promise((resolve) => {
      resolve([
        { su_kien_id: '1', ten_su_kien: 'Workshop Kỹ năng Giao tiếp Hiệu quả trong Lĩnh vực Tài chính' },
        { su_kien_id: '2', ten_su_kien: 'Hội thảo Blockchain và Ứng dụng trong Ngân hàng' },
        { su_kien_id: '3', ten_su_kien: 'Tọa đàm Cơ hội việc làm ngành Tài chính Ngân hàng 2023' },
        { su_kien_id: '4', ten_su_kien: 'Seminar Kỹ năng Phân tích Báo cáo Tài chính' }
      ]);
    });
  }
  
  // Populate events dropdown
  function populateEvents(events) {
    // Clear existing options except the first placeholder
    while (eventSelect.options.length > 1) {
      eventSelect.remove(1);
    }
    
    // Add new options
    events.forEach(event => {
      const option = document.createElement('option');
      option.value = event.su_kien_id;
      option.textContent = event.ten_su_kien;
      eventSelect.appendChild(option);
    });
  }
  
  // Populate form with registration data
  function populateForm(data) {
    // Update registration ID
    registrationIdSpan.textContent = data.ma_xac_nhan || data.dangky_sukien_id;
    
    // Basic registration info
    eventSelect.value = data.su_kien_id;
    participationTypeSelect.value = data.hinhthuc_thamgia || 'offline';
    registrationSourceSelect.value = data.nguon_gioi_thieu || '';
    organizationUnitInput.value = data.don_vi || '';
    
    // Registrant info
    registrantNameInput.value = data.ho_ten || '';
    registrantEmailInput.value = data.email || '';
    registrantPhoneInput.value = data.dien_thoai || '';
    registrantTypeSelect.value = data.loai_nguoi_dang_ky || '';
    
    // Show appropriate additional fields based on registrant type
    toggleAdditionalFields();
    
    // If we have additional fields data, populate them
    if (data.loai_nguoi_dang_ky === 'sinh_vien') {
      document.getElementById('student-id').value = data.ma_sinh_vien || '';
      document.getElementById('class').value = data.lop || '';
      document.getElementById('major').value = data.nganh_hoc || '';
      document.getElementById('course').value = data.khoa || '';
    } else if (data.loai_nguoi_dang_ky === 'giang_vien') {
      document.getElementById('teacher-id').value = data.ma_giang_vien || '';
      document.getElementById('department').value = data.khoa_bo_mon || '';
    } else if (['khach', 'doanh_nghiep'].includes(data.loai_nguoi_dang_ky)) {
      document.getElementById('organization').value = data.to_chuc || '';
      document.getElementById('position').value = data.chuc_vu || '';
    }
    
    // Additional info
    participationReasonTextarea.value = data.ly_do_tham_du || '';
    feedbackTextarea.value = data.gop_y || '';
    registrationStatusSelect.value = data.status.toString();
  }
  
  // Toggle additional fields based on registrant type
  function toggleAdditionalFields() {
    // Hide all additional fields first
    document.querySelectorAll('.student-field, .teacher-field, .guest-field').forEach(field => {
      field.classList.add('hidden');
    });
    
    // Show fields based on selected type
    const selectedType = registrantTypeSelect.value;
    
    if (selectedType === 'sinh_vien') {
      document.querySelectorAll('.student-field').forEach(field => {
        field.classList.remove('hidden');
      });
    } else if (selectedType === 'giang_vien') {
      document.querySelectorAll('.teacher-field').forEach(field => {
        field.classList.remove('hidden');
      });
    } else if (['khach', 'doanh_nghiep'].includes(selectedType)) {
      document.querySelectorAll('.guest-field').forEach(field => {
        field.classList.remove('hidden');
      });
    }
  }
  
  // Handle form submission
  function handleFormSubmit(e) {
    e.preventDefault();
    
    // Validate form (basic validation)
    if (!validateForm()) {
      return false;
    }
    
    // Show loading indicator
    showLoading();
    
    // Collect form data
    const formData = {
      dangky_sukien_id: registrationData.dangky_sukien_id,
      su_kien_id: eventSelect.value,
      hinhthuc_thamgia: participationTypeSelect.value,
      nguon_gioi_thieu: registrationSourceSelect.value,
      don_vi: organizationUnitInput.value,
      ho_ten: registrantNameInput.value,
      email: registrantEmailInput.value,
      dien_thoai: registrantPhoneInput.value,
      loai_nguoi_dang_ky: registrantTypeSelect.value,
      ly_do_tham_du: participationReasonTextarea.value,
      gop_y: feedbackTextarea.value,
      status: parseInt(registrationStatusSelect.value)
    };
    
    // Add additional fields based on registrant type
    if (formData.loai_nguoi_dang_ky === 'sinh_vien') {
      formData.ma_sinh_vien = document.getElementById('student-id').value;
      formData.lop = document.getElementById('class').value;
      formData.nganh_hoc = document.getElementById('major').value;
      formData.khoa = document.getElementById('course').value;
    } else if (formData.loai_nguoi_dang_ky === 'giang_vien') {
      formData.ma_giang_vien = document.getElementById('teacher-id').value;
      formData.khoa_bo_mon = document.getElementById('department').value;
    } else if (['khach', 'doanh_nghiep'].includes(formData.loai_nguoi_dang_ky)) {
      formData.to_chuc = document.getElementById('organization').value;
      formData.chuc_vu = document.getElementById('position').value;
    }
    
    // For demo purposes, simulate API call with a timeout
    setTimeout(() => {
      // In a real app, this would be an API call
      // const response = await fetch(`${API_URL}/registrations/${formData.dangky_sukien_id}`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData)
      // });
      
      console.log('Registration updated:', formData);
      
      // Show success notification
      showNotification('Cập nhật thông tin đăng ký thành công!', 'success');
      
      // Redirect to registration detail page after a delay
      setTimeout(() => {
        window.location.href = `registration-detail.html?id=${formData.dangky_sukien_id}`;
      }, 1500);
    }, 800);
    
    return false;
  }
  
  // Validate form before submission
  function validateForm() {
    let isValid = true;
    
    // Reset previous errors
    document.querySelectorAll('.error-message').forEach(el => el.remove());
    document.querySelectorAll('.border-red-500').forEach(el => {
      el.classList.remove('border-red-500');
    });
    
    // Required fields validation
    const requiredFields = [
      { field: eventSelect, name: 'Sự kiện' },
      { field: registrantNameInput, name: 'Họ và tên' },
      { field: registrantEmailInput, name: 'Email' },
      { field: registrantPhoneInput, name: 'Số điện thoại' },
      { field: registrantTypeSelect, name: 'Loại người đăng ký' }
    ];
    
    requiredFields.forEach(item => {
      if (!item.field.value.trim()) {
        showFieldError(item.field, `${item.name} không được để trống`);
        isValid = false;
      }
    });
    
    // Email validation
    if (registrantEmailInput.value && !isValidEmail(registrantEmailInput.value)) {
      showFieldError(registrantEmailInput, 'Email không hợp lệ');
      isValid = false;
    }
    
    // Phone validation
    if (registrantPhoneInput.value && !isValidPhone(registrantPhoneInput.value)) {
      showFieldError(registrantPhoneInput, 'Số điện thoại không hợp lệ');
      isValid = false;
    }
    
    return isValid;
  }
  
  // Helper function to validate email
  function isValidEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }
  
  // Helper function to validate phone number
  function isValidPhone(phone) {
    const re = /^[0-9]{10,11}$/;
    return re.test(String(phone).replace(/\s+/g, ''));
  }
  
  // Show field error
  function showFieldError(field, message) {
    field.classList.add('border-red-500');
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message text-red-500 text-xs mt-1';
    errorDiv.textContent = message;
    
    field.parentNode.appendChild(errorDiv);
  }
  
  // Handle cancel button
  function handleCancel() {
    // Go back to registrations list
    window.location.href = 'registrations.html';
  }
  
  // Show loading indicator
  function showLoading() {
    loadingIndicator.classList.remove('hidden');
    registrationFormContainer.classList.add('hidden');
    errorMessage.classList.add('hidden');
  }
  
  // Hide loading indicator
  function hideLoading() {
    loadingIndicator.classList.add('hidden');
  }
  
  // Show registration form
  function showForm() {
    registrationFormContainer.classList.remove('hidden');
  }
  
  // Show error message
  function showError(message) {
    errorMessage.classList.remove('hidden');
    errorDetail.textContent = message;
    registrationFormContainer.classList.add('hidden');
    hideLoading();
  }
  
  // Show notification
  function showNotification(message, type = 'info') {
    // Check if notification container exists
    let container = document.getElementById('notification-container');
    
    // If container doesn't exist, create it
    if (!container) {
      container = document.createElement('div');
      container.id = 'notification-container';
      container.className = 'fixed top-4 right-4 z-50 max-w-md';
      document.body.appendChild(container);
    }
    
    // Create notification element
    const notification = document.createElement('div');
    
    // Set appropriate classes based on notification type
    let bgColor, textColor, iconClass;
    switch (type) {
      case 'success':
        bgColor = 'bg-green-100';
        textColor = 'text-green-800';
        iconClass = 'ri-check-line';
        break;
      case 'error':
        bgColor = 'bg-red-100';
        textColor = 'text-red-800';
        iconClass = 'ri-error-warning-line';
        break;
      default:
        bgColor = 'bg-blue-100';
        textColor = 'text-blue-800';
        iconClass = 'ri-information-line';
    }
    
    notification.className = `${bgColor} ${textColor} p-4 rounded-md shadow-md mb-3 flex items-start transform transition-all duration-300 translate-x-full opacity-0`;
    notification.innerHTML = `
      <i class="${iconClass} mr-3 text-xl"></i>
      <div class="flex-1">${message}</div>
      <button class="text-gray-500 hover:text-gray-700 focus:outline-none">
        <i class="ri-close-line"></i>
      </button>
    `;
    
    // Add to container
    container.appendChild(notification);
    
    // Trigger animation to show
    setTimeout(() => {
      notification.classList.remove('translate-x-full', 'opacity-0');
    }, 10);
    
    // Add click event to close button
    const closeButton = notification.querySelector('button');
    closeButton.addEventListener('click', () => {
      closeNotification(notification);
    });
    
    // Auto-close after 5 seconds
    setTimeout(() => {
      closeNotification(notification);
    }, 5000);
  }
  
  // Close notification with animation
  function closeNotification(notification) {
    notification.classList.add('translate-x-full', 'opacity-0');
    
    // Remove from DOM after animation completes
    setTimeout(() => {
      notification.remove();
    }, 300);
  }
  
  // UI module - Handle DOM interactions
  const UI = {
    initEventListeners: function() {
      // Mobile menu toggle
      document.getElementById('sidebar-open').addEventListener('click', function() {
        document.getElementById('sidebar').classList.remove('-translate-x-full');
        document.getElementById('sidebar-backdrop').classList.remove('hidden');
      });
      
      document.getElementById('sidebar-close').addEventListener('click', function() {
        document.getElementById('sidebar').classList.add('-translate-x-full');
        document.getElementById('sidebar-backdrop').classList.add('hidden');
      });
      
      document.getElementById('sidebar-backdrop').addEventListener('click', function() {
        document.getElementById('sidebar').classList.add('-translate-x-full');
        document.getElementById('sidebar-backdrop').classList.add('hidden');
      });
    }
  };
  
  // Public methods
  return {
    init: function() {
      // Initialize UI event listeners
      
      // Initialize data
      init();
      
      // Initialize AOS
      AOS.init();
    }
  };
})();

// Initialize the application when the DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  RegistrationEditManager.init();
}); 