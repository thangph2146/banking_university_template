/**
 * registration-detail.js
 * Module xử lý hiển thị thông tin chi tiết đăng ký sự kiện
 */

const RegistrationDetailManager = (function() {
  'use strict';

  // Các hằng số và biến
  const API_URL = '../api';
  let registrationData = null;
  
  // Các hằng số cho trạng thái
  const STATUS = {
    PENDING: 0,
    APPROVED: 1,
    CANCELLED: -1
  };

  const STATUS_CLASSES = {
    [STATUS.PENDING]: 'bg-yellow-100 text-yellow-800',
    [STATUS.APPROVED]: 'bg-green-100 text-green-800',
    [STATUS.CANCELLED]: 'bg-red-100 text-red-800'
  };

  const STATUS_LABELS = {
    [STATUS.PENDING]: 'Chờ xác nhận',
    [STATUS.APPROVED]: 'Đã xác nhận',
    [STATUS.CANCELLED]: 'Đã hủy'
  };
  
  const REGISTRANT_TYPE_LABELS = {
    'sinh_vien': 'Sinh viên',
    'giang_vien': 'Giảng viên',
    'khach': 'Khách',
    'doanh_nghiep': 'Doanh nghiệp'
  };
  
  const ATTENDANCE_STATUS_LABELS = {
    'full': 'Tham dự đầy đủ',
    'partial': 'Tham dự một phần',
    'not_attended': 'Không tham dự'
  };
  
  const ATTENDANCE_METHOD_LABELS = {
    'qr_code': 'Quét mã QR',
    'face_recognition': 'Nhận diện khuôn mặt',
    'manual': 'Điểm danh thủ công',
    'kiosk': 'Kiosk',
    'none': 'Chưa điểm danh'
  };
  
  const PARTICIPATION_TYPE_LABELS = {
    'offline': 'Trực tiếp',
    'online': 'Trực tuyến',
    'hybrid': 'Kết hợp'
  };
  
  // Cache DOM
  const DOM = {
    // Thông tin chung
    registrationId: document.querySelector('#registration-id span'),
    registrationStatus: document.getElementById('registration-status'),
    registrationDate: document.getElementById('registration-date'),
    registrationCode: document.getElementById('registration-code'),
    participationType: document.getElementById('participation-type'),
    registrationType: document.getElementById('registration-type'),
    registrationSource: document.getElementById('registration-source'),
    organizationUnit: document.getElementById('organization-unit'),
    
    // Thông tin người đăng ký
    registrantAvatar: document.getElementById('registrant-avatar'),
    registrantName: document.getElementById('registrant-name'),
    registrantEmail: document.getElementById('registrant-email'),
    registrantPhone: document.getElementById('registrant-phone'),
    faceVerification: document.getElementById('face-verification'),
    participationReason: document.getElementById('participation-reason'),
    feedbackContent: document.getElementById('feedback-content'),
    
    // Thông tin tham dự
    attendanceStatus: document.getElementById('attendance-status'),
    attendanceMinutes: document.getElementById('attendance-minutes'),
    attendanceMethod: document.getElementById('attendance-method'),
    checkinTime: document.getElementById('checkin-time'),
    checkoutTime: document.getElementById('checkout-time'),
    
    // Thông tin sự kiện
    eventLink: document.getElementById('event-link'),
    eventTime: document.getElementById('event-time'),
    eventLocation: document.getElementById('event-location'),
    
    // Thông tin bổ sung
    additionalInfoContainer: document.getElementById('additional-info-container'),
    
    // Lịch sử hoạt động
    activityLog: document.getElementById('activity-log'),
    
    // Các nút thao tác
    approveBtn: document.getElementById('approve-btn'),
    cancelBtn: document.getElementById('cancel-btn'),
    printBtn: document.getElementById('print-btn'),
    sendEmailBtn: document.getElementById('send-email-btn'),
    editRegistrationLink: document.querySelector('.edit-registration-link'),
    
    // Sidebar
    sidebarOpen: document.getElementById('sidebar-open'),
    sidebarClose: document.getElementById('sidebar-close'),
    sidebar: document.getElementById('sidebar'),
    sidebarBackdrop: document.getElementById('sidebar-backdrop')
  };
  
  // Các tiện ích
  /**
   * Định dạng ngày giờ
   * @param {string|Date} dateString - Chuỗi ngày hoặc đối tượng Date
   * @param {boolean} includeTime - Có hiển thị giờ không
   * @returns {string} Chuỗi ngày giờ đã định dạng
   */
  const formatDate = (dateString, includeTime = true) => {
    if (!dateString) return '-';
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '-';
    
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    
    if (!includeTime) {
      return `${day}/${month}/${year}`;
    }
    
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };
  
  /**
   * Tạo URL avatar từ tên
   * @param {string} name - Tên đầy đủ
   * @returns {string} URL avatar
   */
  const generateAvatarUrl = (name) => {
    if (!name) name = 'User';
    const formattedName = name.replace(/\s+/g, '+');
    return `https://ui-avatars.com/api/?name=${formattedName}&background=random&color=fff`;
  };
  
  /**
   * Lấy nhãn từ giá trị enum
   * @param {object} labelsObj - Đối tượng chứa các nhãn
   * @param {string|number} value - Giá trị enum
   * @param {string} defaultValue - Giá trị mặc định nếu không tìm thấy
   * @returns {string} Nhãn
   */
  const getLabelFromValue = (labelsObj, value, defaultValue = '-') => {
    return value !== null && value !== undefined && labelsObj[value] 
      ? labelsObj[value] 
      : defaultValue;
  };
  
  // API Handler
  const api = {
    /**
     * Lấy thông tin chi tiết đăng ký
     * @param {string} registrationId - ID đăng ký
     * @returns {Promise} Promise với dữ liệu
     */
    getRegistrationDetail: (registrationId) => {
      // Trong môi trường thực, đây sẽ là một cuộc gọi fetch thực sự
      // Hiện tại chúng ta mô phỏng với dữ liệu giả
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            dangky_sukien_id: registrationId,
            su_kien_id: '1',
            email: 'nguyenvansinh@gmail.com',
            ho_ten: 'Nguyễn Văn Sinh',
            dien_thoai: '0912345678',
            loai_nguoi_dang_ky: 'sinh_vien',
            ngay_dang_ky: '2023-07-22T09:15:30',
            ma_xac_nhan: 'REG' + registrationId.padStart(6, '0'),
            status: 1, // APPROVED
            hinh_thuc_tham_gia: 'offline',
            gop_y: 'Tôi mong rằng sự kiện sẽ có nhiều hoạt động thực hành hơn.',
            nguon_gioi_thieu: 'Facebook',
            ly_do_tham_du: 'Tôi muốn học hỏi thêm kiến thức về lĩnh vực này.',
            don_vi: 'Khoa Ngân hàng, UEH',
            thoi_gian_checkin: '2023-07-25T08:45:22',
            thoi_gian_checkout: '2023-07-25T16:15:30',
            checkin_status: 1,
            checkout_status: 1,
            face_verified: 1,
            phuong_thuc_diem_danh: 'kiosk',
            thoi_gian_duyet: '2023-07-22T10:30:15',
            thoi_gian_tham_du: 445, // Số phút tham dự
            ly_do_huy: null,
            thoi_gian_huy: null,
            // Thông tin bổ sung cho loại người dùng
            ma_sinh_vien: 'UEH20001234',
            lop: 'K45-TMDT',
            nganh_hoc: 'Thương mại điện tử',
            khoa: 'K45',
            // Thông tin sự kiện
            event: {
              ten_su_kien: 'Workshop Kỹ năng Giao tiếp Hiệu quả trong Lĩnh vực Tài chính',
              thoi_gian_bat_dau_su_kien: '2023-07-25T09:00:00',
              thoi_gian_ket_thuc_su_kien: '2023-07-25T16:30:00',
              dia_diem: 'Hội trường A, Campus B, UEH'
            },
            // Lịch sử hoạt động
            activity_logs: [
              {
                action: 'register',
                time: '2023-07-22T09:15:30',
                user: 'Nguyễn Văn Sinh',
                note: 'Đăng ký sự kiện'
              },
              {
                action: 'approve',
                time: '2023-07-22T10:30:15',
                user: 'Admin',
                note: 'Xác nhận đăng ký'
              },
              {
                action: 'checkin',
                time: '2023-07-25T08:45:22',
                user: 'System',
                note: 'Check-in tại Kiosk 1'
              },
              {
                action: 'checkout',
                time: '2023-07-25T16:15:30',
                user: 'System',
                note: 'Check-out tại Kiosk 1'
              }
            ]
          });
        }, 500);
      });
    },
    
    /**
     * Thay đổi trạng thái đăng ký
     * @param {string} registrationId - ID đăng ký
     * @param {number} status - Trạng thái mới
     * @param {string} reason - Lý do (tùy chọn)
     * @returns {Promise} Promise với kết quả
     */
    updateRegistrationStatus: (registrationId, status, reason = '') => {
      // Trong môi trường thực, đây sẽ là một cuộc gọi API post
      return new Promise((resolve) => {
        setTimeout(() => {
          console.log(`Updating registration ${registrationId} status to ${status} with reason: ${reason}`);
          resolve({ success: true });
        }, 500);
      });
    },
    
    /**
     * Gửi email đến người đăng ký
     * @param {string} registrationId - ID đăng ký
     * @param {string} template - Mẫu email
     * @returns {Promise} Promise với kết quả
     */
    sendEmail: (registrationId, template) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          console.log(`Sending ${template} email to registration ${registrationId}`);
          resolve({ success: true });
        }, 500);
      });
    }
  };
  
  /**
   * Hiển thị thông tin đăng ký
   * @param {Object} data - Dữ liệu đăng ký
   */
  const renderRegistrationDetail = (data) => {
    // Cập nhật thông tin chung
    DOM.registrationId.textContent = data.dangky_sukien_id;
    
    // Trạng thái
    DOM.registrationStatus.textContent = getLabelFromValue(STATUS_LABELS, data.status);
    DOM.registrationStatus.className = `px-3 py-1 text-sm font-medium rounded-full ${STATUS_CLASSES[data.status] || ''}`;
    
    // Thông tin đăng ký cơ bản
    DOM.registrationDate.textContent = formatDate(data.ngay_dang_ky);
    DOM.registrationCode.textContent = data.ma_xac_nhan || '-';
    DOM.participationType.textContent = getLabelFromValue(PARTICIPATION_TYPE_LABELS, data.hinh_thuc_tham_gia, 'Trực tiếp');
    DOM.registrationType.textContent = getLabelFromValue(REGISTRANT_TYPE_LABELS, data.loai_nguoi_dang_ky, 'Khách');
    DOM.registrationSource.textContent = data.nguon_gioi_thieu || '-';
    DOM.organizationUnit.textContent = data.don_vi || '-';
    
    // Thông tin người đăng ký
    DOM.registrantAvatar.src = generateAvatarUrl(data.ho_ten);
    DOM.registrantName.textContent = data.ho_ten;
    DOM.registrantEmail.textContent = data.email;
    DOM.registrantPhone.textContent = data.dien_thoai || '-';
    DOM.faceVerification.textContent = data.face_verified ? 'Đã xác thực' : 'Chưa xác thực';
    DOM.participationReason.textContent = data.ly_do_tham_du || '-';
    DOM.feedbackContent.textContent = data.gop_y || '-';
    
    // Thông tin tham dự
    let attendanceStatusText = 'Chưa tham dự';
    if (data.checkin_status && data.checkout_status) {
      attendanceStatusText = 'Tham dự đầy đủ';
    } else if (data.checkin_status) {
      attendanceStatusText = 'Đã check-in';
    }
    DOM.attendanceStatus.textContent = attendanceStatusText;
    DOM.attendanceMinutes.textContent = data.thoi_gian_tham_du ? `${data.thoi_gian_tham_du} phút` : '-';
    DOM.attendanceMethod.textContent = getLabelFromValue(ATTENDANCE_METHOD_LABELS, data.phuong_thuc_diem_danh, 'Chưa điểm danh');
    DOM.checkinTime.textContent = data.thoi_gian_checkin ? formatDate(data.thoi_gian_checkin) : 'Chưa check-in';
    DOM.checkoutTime.textContent = data.thoi_gian_checkout ? formatDate(data.thoi_gian_checkout) : 'Chưa check-out';
    
    // Thông tin sự kiện
    if (data.event) {
      DOM.eventLink.textContent = data.event.ten_su_kien;
      DOM.eventLink.href = `event-detail.html?id=${data.su_kien_id}`;
      
      const eventStartDate = formatDate(data.event.thoi_gian_bat_dau_su_kien);
      const eventEndDate = formatDate(data.event.thoi_gian_ket_thuc_su_kien);
      DOM.eventTime.textContent = `${eventStartDate} - ${eventEndDate}`;
      
      DOM.eventLocation.textContent = data.event.dia_diem || '-';
    }
    
    // Thông tin bổ sung dựa trên loại người đăng ký
    DOM.additionalInfoContainer.innerHTML = '';
    const additionalFields = [];
    
    switch (data.loai_nguoi_dang_ky) {
      case 'sinh_vien':
        additionalFields.push({ label: 'Mã sinh viên', value: data.ma_sinh_vien });
        additionalFields.push({ label: 'Lớp', value: data.lop });
        additionalFields.push({ label: 'Ngành học', value: data.nganh_hoc });
        additionalFields.push({ label: 'Khóa', value: data.khoa });
        break;
      case 'giang_vien':
        additionalFields.push({ label: 'Mã giảng viên', value: data.ma_giang_vien });
        additionalFields.push({ label: 'Khoa/Bộ môn', value: data.khoa_bo_mon });
        break;
      case 'doanh_nghiep':
      case 'khach':
        additionalFields.push({ label: 'Tổ chức', value: data.to_chuc });
        additionalFields.push({ label: 'Chức vụ', value: data.chuc_vu });
        break;
    }
    
    additionalFields.forEach(field => {
      const div = document.createElement('div');
      div.innerHTML = `
        <p class="text-sm font-medium text-gray-500">${field.label}</p>
        <p class="text-base text-gray-900">${field.value || '-'}</p>
      `;
      DOM.additionalInfoContainer.appendChild(div);
    });
    
    // Lịch sử hoạt động
    if (data.activity_logs && data.activity_logs.length > 0) {
      DOM.activityLog.innerHTML = '';
      
      data.activity_logs.forEach(log => {
        const li = document.createElement('li');
        li.className = 'border-l-2 border-gray-200 pl-4 py-1';
        
        let actionIcon = 'ri-information-line';
        let actionClass = 'text-blue-500';
        
        switch (log.action) {
          case 'register':
            actionIcon = 'ri-user-add-line';
            actionClass = 'text-blue-500';
            break;
          case 'approve':
            actionIcon = 'ri-check-line';
            actionClass = 'text-green-500';
            break;
          case 'cancel':
            actionIcon = 'ri-close-line';
            actionClass = 'text-red-500';
            break;
          case 'checkin':
            actionIcon = 'ri-login-box-line';
            actionClass = 'text-green-500';
            break;
          case 'checkout':
            actionIcon = 'ri-logout-box-line';
            actionClass = 'text-orange-500';
            break;
        }
        
        li.innerHTML = `
          <div class="flex items-start">
            <i class="${actionIcon} ${actionClass} text-lg mr-2"></i>
            <div class="flex-1">
              <div class="flex justify-between">
                <p class="text-sm font-medium text-gray-900">${log.note}</p>
                <span class="text-xs text-gray-500">${formatDate(log.time)}</span>
              </div>
              <p class="text-xs text-gray-500">Bởi: ${log.user}</p>
            </div>
          </div>
        `;
        
        DOM.activityLog.appendChild(li);
      });
    } else {
      DOM.activityLog.innerHTML = '<li class="text-sm text-gray-500">Không có hoạt động nào được ghi nhận</li>';
    }
    
    // Cập nhật URL chỉnh sửa
    DOM.editRegistrationLink.href = `registration-edit.html?id=${data.dangky_sukien_id}`;
    
    // Ẩn/hiện nút thay đổi trạng thái dựa trên trạng thái hiện tại
    if (data.status === STATUS.PENDING) {
      DOM.approveBtn.classList.remove('hidden');
      DOM.cancelBtn.classList.remove('hidden');
    } else if (data.status === STATUS.APPROVED) {
      DOM.approveBtn.classList.add('hidden');
      DOM.cancelBtn.textContent = 'Hủy đăng ký';
      DOM.cancelBtn.classList.remove('hidden');
    } else if (data.status === STATUS.CANCELLED) {
      DOM.approveBtn.textContent = 'Khôi phục đăng ký';
      DOM.approveBtn.classList.remove('hidden');
      DOM.cancelBtn.classList.add('hidden');
    }
  };
  
  /**
   * Xử lý phê duyệt đăng ký
   */
  const handleApprove = () => {
    if (!registrationData) return;
    
    // Xác nhận
    if (!confirm('Bạn có chắc chắn muốn xác nhận đăng ký này?')) return;
    
    const targetStatus = registrationData.status === STATUS.CANCELLED ? STATUS.PENDING : STATUS.APPROVED;
    
    // Cập nhật UI hiển thị đang tải
    DOM.approveBtn.disabled = true;
    DOM.approveBtn.innerHTML = '<i class="ri-loader-4-line animate-spin mr-1"></i> Đang xử lý...';
    
    // Gọi API
    api.updateRegistrationStatus(registrationData.dangky_sukien_id, targetStatus)
      .then(() => {
        // Cập nhật dữ liệu
        registrationData.status = targetStatus;
        
        if (targetStatus === STATUS.APPROVED) {
          registrationData.thoi_gian_duyet = new Date().toISOString();
          
          // Thêm log hoạt động mới
          if (!registrationData.activity_logs) registrationData.activity_logs = [];
          registrationData.activity_logs.unshift({
            action: 'approve',
            time: new Date().toISOString(),
            user: 'Admin',
            note: 'Xác nhận đăng ký'
          });
        }
        
        // Cập nhật UI
        renderRegistrationDetail(registrationData);
        
        // Hiển thị thông báo
        alert('Đã cập nhật trạng thái đăng ký thành công!');
      })
      .catch(error => {
        console.error('Error updating registration:', error);
        alert('Đã xảy ra lỗi khi cập nhật trạng thái đăng ký. Vui lòng thử lại.');
      })
      .finally(() => {
        // Khôi phục nút
        DOM.approveBtn.disabled = false;
        DOM.approveBtn.innerHTML = '<i class="ri-check-line mr-1"></i> Xác nhận đăng ký';
      });
  };
  
  /**
   * Xử lý hủy đăng ký
   */
  const handleCancel = () => {
    if (!registrationData) return;
    
    // Xác nhận và yêu cầu lý do
    const reason = prompt('Nhập lý do hủy đăng ký (tùy chọn):');
    if (reason === null) return; // Người dùng đã nhấn Cancel
    
    // Cập nhật UI hiển thị đang tải
    DOM.cancelBtn.disabled = true;
    DOM.cancelBtn.innerHTML = '<i class="ri-loader-4-line animate-spin mr-1"></i> Đang xử lý...';
    
    // Gọi API
    api.updateRegistrationStatus(registrationData.dangky_sukien_id, STATUS.CANCELLED, reason)
      .then(() => {
        // Cập nhật dữ liệu
        registrationData.status = STATUS.CANCELLED;
        registrationData.ly_do_huy = reason || null;
        registrationData.thoi_gian_huy = new Date().toISOString();
        
        // Thêm log hoạt động mới
        if (!registrationData.activity_logs) registrationData.activity_logs = [];
        registrationData.activity_logs.unshift({
          action: 'cancel',
          time: new Date().toISOString(),
          user: 'Admin',
          note: 'Hủy đăng ký' + (reason ? `: ${reason}` : '')
        });
        
        // Cập nhật UI
        renderRegistrationDetail(registrationData);
        
        // Hiển thị thông báo
        alert('Đã hủy đăng ký thành công!');
      })
      .catch(error => {
        console.error('Error cancelling registration:', error);
        alert('Đã xảy ra lỗi khi hủy đăng ký. Vui lòng thử lại.');
      })
      .finally(() => {
        // Khôi phục nút
        DOM.cancelBtn.disabled = false;
        DOM.cancelBtn.innerHTML = '<i class="ri-close-line mr-1"></i> Hủy đăng ký';
      });
  };
  
  /**
   * Xử lý in thông tin
   */
  const handlePrint = () => {
    window.print();
  };
  
  /**
   * Xử lý gửi email
   */
  const handleSendEmail = (e) => {
    e.preventDefault();
    
    if (!registrationData) return;
    
    // Hiển thị tùy chọn
    const options = ['confirmation', 'reminder', 'thank_you', 'custom'];
    const template = prompt(`Chọn mẫu email (${options.join(', ')}):`, 'confirmation');
    
    if (!template || !options.includes(template)) return;
    
    // Gọi API
    api.sendEmail(registrationData.dangky_sukien_id, template)
      .then(() => {
        alert('Đã gửi email thành công!');
      })
      .catch(error => {
        console.error('Error sending email:', error);
        alert('Đã xảy ra lỗi khi gửi email. Vui lòng thử lại.');
      });
  };
  
  /**
   * Khởi tạo trang
   */
  const init = () => {
    // Lấy ID đăng ký từ URL
    const urlParams = new URLSearchParams(window.location.search);
    const registrationId = urlParams.get('id');
    
    if (!registrationId) {
      alert('Không tìm thấy ID đăng ký trong URL');
      window.location.href = 'registrations.html';
      return;
    }
    
    // Hiển thị thông báo đang tải
    document.body.classList.add('cursor-wait');
    
    // Lấy dữ liệu đăng ký
    api.getRegistrationDetail(registrationId)
      .then(data => {
        // Lưu dữ liệu
        registrationData = data;
        
        // Hiển thị thông tin
        renderRegistrationDetail(data);
      })
      .catch(error => {
        console.error('Error fetching registration details:', error);
        alert('Đã xảy ra lỗi khi tải thông tin đăng ký. Vui lòng thử lại.');
      })
      .finally(() => {
        document.body.classList.remove('cursor-wait');
      });
    
    // Khởi tạo sự kiện
    if (DOM.approveBtn) DOM.approveBtn.addEventListener('click', handleApprove);
    if (DOM.cancelBtn) DOM.cancelBtn.addEventListener('click', handleCancel);
    if (DOM.printBtn) DOM.printBtn.addEventListener('click', handlePrint);
    if (DOM.sendEmailBtn) DOM.sendEmailBtn.addEventListener('click', handleSendEmail);
    
    // Xử lý sự kiện sidebar
    if (DOM.sidebarOpen) {
      DOM.sidebarOpen.addEventListener('click', () => {
        DOM.sidebar.classList.remove('-translate-x-full');
        DOM.sidebarBackdrop.classList.remove('hidden');
      });
    }
    
    if (DOM.sidebarClose) {
      DOM.sidebarClose.addEventListener('click', () => {
        DOM.sidebar.classList.add('-translate-x-full');
        DOM.sidebarBackdrop.classList.add('hidden');
      });
    }
    
    if (DOM.sidebarBackdrop) {
      DOM.sidebarBackdrop.addEventListener('click', () => {
        DOM.sidebar.classList.add('-translate-x-full');
        DOM.sidebarBackdrop.classList.add('hidden');
      });
    }
    
    // Khởi tạo AOS (Animate On Scroll)
    if (typeof AOS !== 'undefined') {
      AOS.init();
    }
  };
  
  // Khởi tạo khi DOM đã tải xong
  document.addEventListener('DOMContentLoaded', init);
  
  // API công khai của module
  return {
    // Có thể xuất các phương thức công khai nếu cần
  };
})();
