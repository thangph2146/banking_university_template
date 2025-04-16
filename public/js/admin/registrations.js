/**
 * registrations.js
 * Module quản lý đăng ký sự kiện
 */

// Sử dụng mẫu IIFE để đóng gói mã và tránh ô nhiễm không gian tên toàn cục
const RegistrationManager = (function() {
  'use strict';

  // Các biến và hằng số
  const API_URL = '../api'; // URL gốc cho API
  let currentPage = 1;
  let totalPages = 1;
  let itemsPerPage = 10;
  let totalItems = 0;
  let registrationsData = [];
  let eventsData = [];

  // Các phần tử DOM thường được sử dụng
  const DOM = {
    registrationsTable: document.getElementById('registrations-table'),
    tableBody: document.getElementById('registrationsTableBody'),
    filterForm: document.getElementById('filter-form'),
    resetFilterBtn: document.getElementById('reset-filter-btn'),
    applyFilterBtn: document.getElementById('apply-filter-btn'),
    filterSearch: document.getElementById('filter-search'),
    filterEvent: document.getElementById('filter-event'),
    filterStatus: document.getElementById('filter-status'),
    filterDate: document.getElementById('filter-date'),
    itemsPerPage: document.getElementById('items-per-page'),
    currentPageInput: document.getElementById('current-page-input'),
    totalPagesCount: document.getElementById('total-pages-count'),
    totalItemsCount: document.getElementById('total-items-count'),
    noDataPlaceholder: document.getElementById('no-data-placeholder'),
    btnFirst: document.querySelector('.btn-first'),
    btnPrev: document.querySelector('.btn-prev'),
    btnNext: document.querySelector('.btn-next'),
    btnLast: document.querySelector('.btn-last'),
    sidebarOpen: document.getElementById('sidebar-open'),
    sidebarClose: document.getElementById('sidebar-close'),
    sidebar: document.getElementById('sidebar'),
    sidebarBackdrop: document.getElementById('sidebar-backdrop')
  };

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

  // Các hàm tiện ích
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
   * @param {string} value - Giá trị enum
   * @param {string} defaultValue - Giá trị mặc định nếu không tìm thấy
   * @returns {string} Nhãn
   */
  const getLabelFromValue = (labelsObj, value, defaultValue = '-') => {
    return value !== null && value !== undefined && labelsObj[value] 
      ? labelsObj[value] 
      : defaultValue;
  };

  /**
   * Mô-đun xử lý API
   */
  const api = {
    /**
     * Tải danh sách đăng ký với bộ lọc
     * @param {object} filters - Bộ lọc áp dụng
     * @returns {Promise} Promise chứa dữ liệu
     */
    fetchRegistrations: (filters = {}) => {
      // Trong thực tế, bạn sẽ gọi API thực, nhưng tạm thời chúng ta sẽ giả lập dữ liệu
      return new Promise((resolve) => {
        setTimeout(() => {
          // Fake data for testing
          const mockRegistrations = [
            {
              dangky_sukien_id: 1,
              su_kien_id: 1,
              ho_ten: 'Nguyễn Văn An',
              email: 'nguyenvanan@example.com',
              dien_thoai: '0901234567',
              loai_nguoi_dang_ky: 'sinh_vien',
              ngay_dang_ky: '2024-07-20T09:15:00',
              ma_xac_nhan: 'REG123456',
              status: STATUS.APPROVED,
              noi_dung_gop_y: 'Rất mong được tham gia sự kiện này',
              nguon_gioi_thieu: 'Facebook',
              don_vi_to_chuc: 'Khoa CNTT',
              face_verified: true,
              da_check_in: true,
              da_check_out: true,
              thoi_gian_duyet: '2024-07-21T10:30:00',
              hinh_thuc_tham_gia: 'offline',
              attendance_status: 'full',
              attendance_minutes: 120,
              diem_danh_bang: 'qr_code',
              thong_tin_dang_ky: JSON.stringify({ lop: '12A1', mssv: 'SV001' }),
              ly_do_tham_du: 'Muốn tìm hiểu thêm về lĩnh vực này',
              event: {
                ten_su_kien: 'Workshop Lập trình Web',
                thoi_gian_bat_dau_su_kien: '2024-08-10T08:00:00',
                thoi_gian_ket_thuc_su_kien: '2024-08-10T11:00:00',
                dia_diem: 'Hội trường A'
              },
              checkin: {
                thoi_gian_check_in: '2024-08-10T07:50:00'
              },
              checkout: {
                thoi_gian_check_out: '2024-08-10T11:05:00'
              }
            },
            {
              dangky_sukien_id: 2,
              su_kien_id: 1,
              ho_ten: 'Trần Thị Bình',
              email: 'tranthibinh@example.com',
              dien_thoai: '0912345678',
              loai_nguoi_dang_ky: 'giang_vien',
              ngay_dang_ky: '2024-07-21T14:20:00',
              ma_xac_nhan: 'REG789012',
              status: STATUS.PENDING,
              noi_dung_gop_y: '',
              nguon_gioi_thieu: 'Email',
              don_vi_to_chuc: 'Khoa Kinh tế',
              face_verified: false,
              da_check_in: false,
              da_check_out: false,
              hinh_thuc_tham_gia: 'online',
              attendance_status: 'not_attended',
              attendance_minutes: 0,
              diem_danh_bang: 'none',
              ly_do_tham_du: 'Phát triển kỹ năng chuyên môn',
              event: {
                ten_su_kien: 'Workshop Lập trình Web',
                thoi_gian_bat_dau_su_kien: '2024-08-10T08:00:00',
                thoi_gian_ket_thuc_su_kien: '2024-08-10T11:00:00',
                dia_diem: 'Hội trường A'
              }
            },
            {
              dangky_sukien_id: 3,
              su_kien_id: 2,
              ho_ten: 'Lê Văn Cường',
              email: 'levancuong@example.com',
              dien_thoai: '0923456789',
              loai_nguoi_dang_ky: 'khach',
              ngay_dang_ky: '2024-07-19T08:45:00',
              ma_xac_nhan: 'REG345678',
              status: STATUS.CANCELLED,
              noi_dung_gop_y: 'Tiếc là không thể tham gia',
              nguon_gioi_thieu: 'Bạn bè',
              don_vi_to_chuc: 'Công ty XYZ',
              face_verified: false,
              da_check_in: false,
              da_check_out: false,
              thoi_gian_huy: '2024-07-22T09:15:00',
              ly_do_huy: 'Bận công việc đột xuất',
              hinh_thuc_tham_gia: 'offline',
              attendance_status: 'not_attended',
              attendance_minutes: 0,
              diem_danh_bang: 'none',
              ly_do_tham_du: 'Mở rộng mạng lưới quan hệ',
              event: {
                ten_su_kien: 'Hội thảo Khởi nghiệp',
                thoi_gian_bat_dau_su_kien: '2024-08-15T13:30:00',
                thoi_gian_ket_thuc_su_kien: '2024-08-15T17:00:00',
                dia_diem: 'Hội trường B'
              }
            }
          ];
          
          // Lọc dữ liệu theo bộ lọc
          let filteredData = [...mockRegistrations];
          
          if (filters.search) {
            const searchTerm = filters.search.toLowerCase();
            filteredData = filteredData.filter(reg => 
              reg.ho_ten.toLowerCase().includes(searchTerm) || 
              reg.email.toLowerCase().includes(searchTerm) ||
              reg.event.ten_su_kien.toLowerCase().includes(searchTerm)
            );
          }
          
          if (filters.eventId) {
            filteredData = filteredData.filter(reg => reg.su_kien_id === parseInt(filters.eventId));
          }
          
          if (filters.status !== undefined && filters.status !== '') {
            filteredData = filteredData.filter(reg => reg.status === parseInt(filters.status));
          }
          
          if (filters.date) {
            const filterDate = new Date(filters.date).setHours(0, 0, 0, 0);
            filteredData = filteredData.filter(reg => {
              const regDate = new Date(reg.ngay_dang_ky).setHours(0, 0, 0, 0);
              return regDate === filterDate;
            });
          }
          
          // Tính toán phân trang
          const page = filters.page || 1;
          const perPage = filters.perPage || 10;
          const total = filteredData.length;
          const totalPages = Math.ceil(total / perPage);
          const start = (page - 1) * perPage;
          const end = start + perPage;
          const data = filteredData.slice(start, end);
          
          // Trả về dữ liệu phân trang
          resolve({
            data,
            pagination: {
              page,
              perPage,
              total,
              totalPages
            }
          });
        }, 500);
      });
    },
    
    /**
     * Tải danh sách sự kiện
     * @returns {Promise} Promise chứa dữ liệu
     */
    fetchEvents: () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          const mockEvents = [
            {
              su_kien_id: 1,
              ten_su_kien: 'Workshop Lập trình Web',
              thoi_gian_bat_dau_su_kien: '2024-08-10T08:00:00',
              thoi_gian_ket_thuc_su_kien: '2024-08-10T11:00:00',
              dia_diem: 'Hội trường A'
            },
            {
              su_kien_id: 2,
              ten_su_kien: 'Hội thảo Khởi nghiệp',
              thoi_gian_bat_dau_su_kien: '2024-08-15T13:30:00',
              thoi_gian_ket_thuc_su_kien: '2024-08-15T17:00:00',
              dia_diem: 'Hội trường B'
            },
            {
              su_kien_id: 3,
              ten_su_kien: 'Seminar Kinh tế Số',
              thoi_gian_bat_dau_su_kien: '2024-08-20T09:00:00',
              thoi_gian_ket_thuc_su_kien: '2024-08-20T12:00:00',
              dia_diem: 'Phòng hội thảo 1'
            }
          ];
          
          resolve(mockEvents);
        }, 300);
      });
    }
  };

  /**
   * Hiển thị danh sách đăng ký
   * @param {Array} registrations - Danh sách đăng ký
   */
  const renderRegistrations = (registrations) => {
    // Xóa nội dung hiện tại của bảng
    DOM.tableBody.innerHTML = '';
    
    // Hiển thị thông báo nếu không có dữ liệu
    if (!registrations || registrations.length === 0) {
      DOM.tableBody.style.display = 'none';
      DOM.noDataPlaceholder.classList.remove('hidden');
      return;
    }
    
    // Hiển thị bảng và ẩn thông báo nếu có dữ liệu
    DOM.tableBody.style.display = 'table-row-group';
    DOM.noDataPlaceholder.classList.add('hidden');
    
    // Hiển thị từng mục đăng ký
    registrations.forEach(registration => {
      const row = document.createElement('tr');
      
      // Định dạng nội dung cho các cột
      const statusClass = STATUS_CLASSES[registration.status] || '';
      const statusLabel = getLabelFromValue(STATUS_LABELS, registration.status);
      
      // Kiểm tra trạng thái check-in và check-out
      let checkInOutStatus = '';
      if (registration.da_check_in && registration.da_check_out) {
        checkInOutStatus = '<span class="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Đã check-in/out</span>';
      } else if (registration.da_check_in) {
        checkInOutStatus = '<span class="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">Đã check-in</span>';
      } else {
        checkInOutStatus = '<span class="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">Chưa check-in</span>';
      }
      
      // Tạo nội dung cho hàng
      row.innerHTML = `
        <td class="px-4 py-3">
          <div class="flex items-center">
            <img class="h-8 w-8 rounded-full mr-3" src="${generateAvatarUrl(registration.ho_ten)}" alt="${registration.ho_ten}">
            <div>
              <div class="font-medium text-gray-900">${registration.ho_ten}</div>
              <div class="text-sm text-gray-500">${registration.email}</div>
            </div>
          </div>
        </td>
        <td class="px-4 py-3">
          <div class="font-medium text-gray-900">${registration.event.ten_su_kien}</div>
          <div class="text-sm text-gray-500">${formatDate(registration.event.thoi_gian_bat_dau_su_kien, false)}</div>
        </td>
        <td class="px-4 py-3 text-sm text-gray-900">${formatDate(registration.ngay_dang_ky)}</td>
        <td class="px-4 py-3">
          <span class="px-2 py-1 text-xs rounded-full ${statusClass}">${statusLabel}</span>
        </td>
        <td class="px-4 py-3">
          ${checkInOutStatus}
        </td>
        <td class="px-4 py-3 text-right">
          <div class="flex items-center justify-end space-x-1">
            <a href="registration-detail.html?id=${registration.dangky_sukien_id}" class="view-registration-btn p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded" title="Xem chi tiết">
              <i class="ri-eye-line"></i>
            </a>
            <a href="registration-edit.html?id=${registration.dangky_sukien_id}" class="edit-registration-btn p-2 text-yellow-600 hover:text-yellow-800 hover:bg-yellow-100 rounded" title="Chỉnh sửa">
              <i class="ri-edit-line"></i>
            </a>
          </div>
        </td>
      `;
      
      // Thêm hàng vào bảng
      DOM.tableBody.appendChild(row);
    });
  };

  /**
   * Hiển thị danh sách sự kiện trong dropdown
   * @param {Array} events - Danh sách sự kiện 
   */
  const renderEventOptions = (events) => {
    const select = DOM.filterEvent;
    
    // Giữ lại tùy chọn mặc định
    const defaultOption = select.options[0];
    select.innerHTML = '';
    select.appendChild(defaultOption);
    
    // Thêm các tùy chọn sự kiện
    events.forEach(event => {
      const option = document.createElement('option');
      option.value = event.su_kien_id;
      option.textContent = event.ten_su_kien;
      select.appendChild(option);
    });
  };

  /**
   * Cập nhật phân trang
   * @param {object} pagination - Thông tin phân trang
   */
  const updatePagination = (pagination) => {
    // Cập nhật biến toàn cục
    currentPage = pagination.page;
    totalPages = pagination.totalPages;
    totalItems = pagination.total;
    itemsPerPage = pagination.perPage;
    
    // Cập nhật UI
    DOM.currentPageInput.value = currentPage;
    DOM.totalPagesCount.textContent = totalPages;
    DOM.totalItemsCount.textContent = totalItems;
    
    // Cập nhật trạng thái nút phân trang
    DOM.btnFirst.disabled = currentPage <= 1;
    DOM.btnPrev.disabled = currentPage <= 1;
    DOM.btnNext.disabled = currentPage >= totalPages;
    DOM.btnLast.disabled = currentPage >= totalPages;
  };

  /**
   * Tải danh sách đăng ký với bộ lọc hiện tại
   */
  const loadRegistrations = () => {
    // Hiển thị thông báo đang tải
    DOM.tableBody.innerHTML = `
      <tr>
        <td colspan="6" class="px-4 py-4 text-center text-gray-500">
          <i class="ri-loader-4-line animate-spin inline-block mr-2"></i> Đang tải dữ liệu...
        </td>
      </tr>
    `;
    
    // Lấy bộ lọc từ form
    const filters = {
      search: DOM.filterSearch.value.trim(),
      eventId: DOM.filterEvent.value,
      status: DOM.filterStatus.value,
      date: DOM.filterDate.value,
      page: currentPage,
      perPage: itemsPerPage
    };
    
    // Gọi API
    api.fetchRegistrations(filters)
      .then(response => {
        // Lưu dữ liệu
        registrationsData = response.data;
        
        // Hiển thị danh sách
        renderRegistrations(registrationsData);
        
        // Cập nhật phân trang
        updatePagination(response.pagination);
      })
      .catch(error => {
        console.error('Error loading registrations:', error);
        DOM.tableBody.innerHTML = `
          <tr>
            <td colspan="6" class="px-4 py-4 text-center text-red-500">
              Đã xảy ra lỗi khi tải dữ liệu. Vui lòng thử lại sau.
            </td>
          </tr>
        `;
      });
  };

  /**
   * Tải danh sách sự kiện
   */
  const loadEvents = () => {
    api.fetchEvents()
      .then(events => {
        // Lưu dữ liệu
        eventsData = events;
        
        // Hiển thị danh sách trong dropdown
        renderEventOptions(events);
      })
      .catch(error => {
        console.error('Error loading events:', error);
      });
  };

  /**
   * Khởi tạo trang đăng ký sự kiện
   */
  const init = () => {
    // Tải dữ liệu ban đầu
    loadRegistrations();
    loadEvents();
    
    // Xử lý sự kiện form lọc
    DOM.filterForm.addEventListener('submit', event => {
      event.preventDefault();
      currentPage = 1;
      loadRegistrations();
    });
    
    // Xử lý sự kiện reset form
    DOM.resetFilterBtn.addEventListener('click', () => {
      DOM.filterForm.reset();
      currentPage = 1;
      loadRegistrations();
    });
    
    // Xử lý sự kiện thay đổi số mục trên trang
    DOM.itemsPerPage.addEventListener('change', () => {
      itemsPerPage = parseInt(DOM.itemsPerPage.value);
      currentPage = 1;
      loadRegistrations();
    });
    
    // Xử lý sự kiện phân trang
    DOM.btnFirst.addEventListener('click', () => {
      if (currentPage > 1) {
        currentPage = 1;
        loadRegistrations();
      }
    });
    
    DOM.btnPrev.addEventListener('click', () => {
      if (currentPage > 1) {
        currentPage--;
        loadRegistrations();
      }
    });
    
    DOM.btnNext.addEventListener('click', () => {
      if (currentPage < totalPages) {
        currentPage++;
        loadRegistrations();
      }
    });
    
    DOM.btnLast.addEventListener('click', () => {
      if (currentPage < totalPages) {
        currentPage = totalPages;
        loadRegistrations();
      }
    });
    
    // Xử lý sự kiện nhập trang
    DOM.currentPageInput.addEventListener('change', () => {
      let page = parseInt(DOM.currentPageInput.value);
      
      if (isNaN(page) || page < 1) {
        page = 1;
      } else if (page > totalPages) {
        page = totalPages;
      }
      
      currentPage = page;
      DOM.currentPageInput.value = page;
      loadRegistrations();
    });
    
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
  };

  // Khởi tạo khi trang được tải
  document.addEventListener('DOMContentLoaded', init);

  // API công khai của module
  return {
    // Có thể xuất các phương thức công khai nếu cần
  };
})();
