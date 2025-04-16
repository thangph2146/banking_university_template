/**
 * Module quản lý trang danh sách cài đặt hệ thống
 * 
 * Sử dụng phong cách lập trình hàm (functional programming)
 * Quản lý danh sách, lọc, sắp xếp và phân trang các cài đặt
 */

// Khởi tạo AOS
AOS.init();

// Biến trạng thái
let allSettings = []; // Lưu trữ tất cả cài đặt (từ API hoặc dữ liệu mẫu)
let currentPage = 1;
let itemsPerPage = 10;
let totalPages = 1;
let filters = {
    key: '',
    class: '',
    type: '',
    status: ''
};
let sortField = 'id';
let sortDirection = 'asc';

// Dữ liệu mẫu dựa trên cấu trúc bảng settings trong hanet.sql
const settingsMockData = [
  {
    "id": 1,
    "class": "Config\\App",
    "key": "GOOGLE_CLIENT_ID",
    "value": "YOUR_GOOGLE_CLIENT_ID_PLACEHOLDER",
    "type": "string",
    "context": null,
    "status": 1,
    "created_at": "2024-03-11 11:01:10",
    "updated_at": "2024-03-11 11:01:10",
    "deleted_at": null
  },
  {
    "id": 2,
    "class": "Config\\App",
    "key": "GOOGLE_CLIENT_SECRET",
    "value": "YOUR_GOOGLE_CLIENT_SECRET_PLACEHOLDER",
    "type": "string",
    "context": null,
    "status": 1,
    "created_at": "2024-03-11 11:01:23",
    "updated_at": "2024-03-11 11:01:23",
    "deleted_at": null
  },
  {
    "id": 3,
    "class": "Config\\App",
    "key": "GOOGLE_REDIRECT_URI",
    "value": "YOUR_GOOGLE_REDIRECT_URI_PLACEHOLDER",
    "type": "string",
    "context": null,
    "status": 1,
    "created_at": "2024-03-11 11:01:33",
    "updated_at": "2024-03-11 11:01:33",
    "deleted_at": null
  },
  {
    "id": 4,
    "class": "Config\\App",
    "key": "resetPassWord",
    "value": "123456",
    "type": "string",
    "context": null,
    "status": 1,
    "created_at": "2024-03-12 08:32:41",
    "updated_at": "2024-03-12 08:34:31",
    "deleted_at": null
  },
  {
    "id": 5,
    "class": "Config\\App",
    "key": "classTable",
    "value": "table_id",
    "type": "string",
    "context": null,
    "status": 1,
    "created_at": "2024-03-12 11:11:09",
    "updated_at": "2024-03-12 11:14:15",
    "deleted_at": null
  },
  {
    "id": 6,
    "class": "Config\\App",
    "key": "table_id",
    "value": "example2_wrapper",
    "type": "string",
    "context": null,
    "status": 1,
    "created_at": "2024-03-12 11:14:46",
    "updated_at": "2024-03-12 11:14:46",
    "deleted_at": null
  },
  {
    "id": 7,
    "class": "Config\\Email",
    "key": "fromEmail",
    "value": "noreply@buh.edu.vn",
    "type": "string",
    "context": null,
    "status": 1,
    "created_at": "2024-03-13 09:15:20",
    "updated_at": "2024-03-13 09:15:20",
    "deleted_at": null
  },
  {
    "id": 8,
    "class": "Config\\Email",
    "key": "fromName",
    "value": "HUB - Trường Đại học Ngân hàng TP.HCM",
    "type": "string",
    "context": null,
    "status": 1, 
    "created_at": "2024-03-13 09:16:10",
    "updated_at": "2024-03-13 09:16:10",
    "deleted_at": null
  },
  {
    "id": 9,
    "class": "Config\\App",
    "key": "maintenance_mode",
    "value": "false",
    "type": "boolean",
    "context": null,
    "status": 1,
    "created_at": "2024-03-14 10:20:30",
    "updated_at": "2024-03-14 10:20:30",
    "deleted_at": null
  },
  {
    "id": 10,
    "class": "Config\\App",
    "key": "site_name",
    "value": "HUB - Trường Đại học Ngân hàng TP.HCM",
    "type": "string",
    "context": null,
    "status": 1,
    "created_at": "2024-03-14 10:25:00",
    "updated_at": "2024-03-14 10:25:00",
    "deleted_at": null
  },
  {
    "id": 11,
    "class": "Config\\App",
    "key": "site_description",
    "value": "Hệ thống quản lý sự kiện của Trường Đại học Ngân hàng TP.HCM",
    "type": "string",
    "context": null,
    "status": 1,
    "created_at": "2024-03-14 10:26:15",
    "updated_at": "2024-03-14 10:26:15",
    "deleted_at": null
  },
  {
    "id": 12,
    "class": "Config\\Security",
    "key": "min_password_length",
    "value": "8",
    "type": "number",
    "context": null,
    "status": 1,
    "created_at": "2024-03-15 14:30:00",
    "updated_at": "2024-03-15 14:30:00",
    "deleted_at": null
  },
  {
    "id": 13,
    "class": "Config\\Security",
    "key": "password_policy",
    "value": "{\"require_uppercase\":true,\"require_number\":true,\"require_special\":true}",
    "type": "json",
    "context": null,
    "status": 1,
    "created_at": "2024-03-15 14:32:00",
    "updated_at": "2024-03-15 14:32:00",
    "deleted_at": null
  },
  {
    "id": 14,
    "class": "Config\\Event",
    "key": "max_attendees",
    "value": "500",
    "type": "number",
    "context": null,
    "status": 1,
    "created_at": "2024-03-16 09:00:00",
    "updated_at": "2024-03-16 09:00:00",
    "deleted_at": null
  },
  {
    "id": 15,
    "class": "Config\\Event",
    "key": "checkin_window",
    "value": "30",
    "type": "number",
    "context": "Thời gian (phút) cho phép check-in trước khi sự kiện diễn ra",
    "status": 1,
    "created_at": "2024-03-16 09:05:00",
    "updated_at": "2024-03-16 09:05:00",
    "deleted_at": null
  },
  {
    "id": 16,
    "class": "Config\\Media",
    "key": "allowed_file_types",
    "value": "[\"jpg\",\"jpeg\",\"png\",\"pdf\",\"doc\",\"docx\"]",
    "type": "json",
    "context": null,
    "status": 1,
    "created_at": "2024-03-17 11:20:00",
    "updated_at": "2024-03-17 11:20:00",
    "deleted_at": null
  },
  {
    "id": 17,
    "class": "Config\\Media",
    "key": "max_file_size",
    "value": "10485760",
    "type": "number",
    "context": "Kích thước tối đa cho phép tải lên (byte)",
    "status": 1,
    "created_at": "2024-03-17 11:25:00",
    "updated_at": "2024-03-17 11:25:00",
    "deleted_at": null
  },
  {
    "id": 18,
    "class": "Config\\Social",
    "key": "facebook_url",
    "value": "https://facebook.com/buh.edu.vn",
    "type": "string",
    "context": null,
    "status": 1,
    "created_at": "2024-03-18 13:00:00",
    "updated_at": "2024-03-18 13:00:00",
    "deleted_at": null
  },
  {
    "id": 19,
    "class": "Config\\Social",
    "key": "youtube_url",
    "value": "https://youtube.com/buh_edu_vn",
    "type": "string",
    "context": null,
    "status": 1,
    "created_at": "2024-03-18 13:05:00",
    "updated_at": "2024-03-18 13:05:00",
    "deleted_at": null
  },
  {
    "id": 20,
    "class": "Config\\App",
    "key": "debug_mode",
    "value": "false",
    "type": "boolean",
    "context": null,
    "status": 0,
    "created_at": "2024-03-19 09:30:00",
    "updated_at": "2024-03-19 09:30:00",
    "deleted_at": null
  }
];

// DOM Elements
const settingsTableBody = document.getElementById('settingsTableBody');
const paginationControls = document.getElementById('pagination-controls');
const currentPageInput = document.getElementById('current-page-input');
const totalPagesCount = document.getElementById('total-pages-count');
const totalItemsCount = document.getElementById('total-items-count');
const itemsPerPageSelect = document.getElementById('items-per-page');
const noDataPlaceholder = document.getElementById('no-data-placeholder');
const settingsCount = document.getElementById('settings-count');
const loadingIndicator = document.getElementById('loading-indicator');

// Filter Elements
const filterForm = document.getElementById('filter-form');
const filterKey = document.getElementById('filter-key');
const filterClass = document.getElementById('filter-class');
const filterType = document.getElementById('filter-type');
const filterStatus = document.getElementById('filter-status');
const resetFilterBtn = document.getElementById('reset-filter-btn');
const exportBtn = document.getElementById('export-btn');
const refreshBtn = document.getElementById('refresh-btn');

/**
 * Hiển thị thông báo toast
 * @param {string} message - Nội dung thông báo
 * @param {string} type - Loại thông báo (success, error, warning, info)
 */
const showToast = (message, type = 'info') => {
    // Tạo phần tử toast
    const toast = document.createElement('div');
    toast.className = `fixed bottom-4 right-4 z-50 p-4 rounded-md shadow-lg flex items-center space-x-3 transition-all transform translate-y-0 opacity-100`;
    
    // Thiết lập màu sắc dựa trên loại thông báo
    switch (type) {
        case 'success':
            toast.classList.add('bg-green-50', 'border', 'border-green-200', 'text-green-800');
            break;
        case 'error':
            toast.classList.add('bg-red-50', 'border', 'border-red-200', 'text-red-800');
            break;
        case 'warning':
            toast.classList.add('bg-yellow-50', 'border', 'border-yellow-200', 'text-yellow-800');
            break;
        default:
            toast.classList.add('bg-blue-50', 'border', 'border-blue-200', 'text-blue-800');
    }
    
    // Thiết lập biểu tượng
    let icon = '';
    switch (type) {
        case 'success':
            icon = '<i class="ri-check-line"></i>';
            break;
        case 'error':
            icon = '<i class="ri-error-warning-line"></i>';
            break;
        case 'warning':
            icon = '<i class="ri-alert-line"></i>';
            break;
        default:
            icon = '<i class="ri-information-line"></i>';
    }
    
    // Thiết lập nội dung
    toast.innerHTML = `
      <div class="flex-shrink-0">${icon}</div>
      <div class="flex-grow">${message}</div>
      <button class="flex-shrink-0 focus:outline-none">
        <i class="ri-close-line"></i>
      </button>
    `;
    
    // Thêm toast vào body
    document.body.appendChild(toast);
    
    // Xử lý sự kiện đóng toast
    const closeButton = toast.querySelector('button');
    closeButton.addEventListener('click', () => {
      toast.classList.replace('translate-y-0', 'translate-y-12');
      toast.classList.replace('opacity-100', 'opacity-0');
      
      // Xóa toast sau khi hoàn thành animation
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 300);
    });
    
    // Tự động đóng toast sau 5 giây
    setTimeout(() => {
      if (document.body.contains(toast)) {
        toast.classList.replace('translate-y-0', 'translate-y-12');
        toast.classList.replace('opacity-100', 'opacity-0');
        
        setTimeout(() => {
          if (document.body.contains(toast)) {
            document.body.removeChild(toast);
          }
        }, 300);
      }
    }, 5000);
};

/**
 * Định dạng giá trị cài đặt dựa trên kiểu dữ liệu
 * @param {any} value - Giá trị cần định dạng
 * @param {string} type - Kiểu dữ liệu của giá trị (text, number, boolean, json, array)
 * @returns {string} Giá trị đã được định dạng
 */
const formatSettingValue = (value, type) => {
    switch (type.toLowerCase()) {
        case 'boolean':
            return value === '1' || value === 'true' || value === true 
              ? '<span class="text-green-600">true</span>' 
              : '<span class="text-red-600">false</span>';
        case 'json':
            try {
                const jsonObj = typeof value === 'string' ? JSON.parse(value) : value;
                return `<span class="font-mono text-xs">${JSON.stringify(jsonObj).substring(0, 30)}${JSON.stringify(jsonObj).length > 30 ? '...' : ''}</span>`;
            } catch (e) {
                return `<span class="text-red-500">${value}</span>`;
            }
        case 'array':
            try {
                const arr = typeof value === 'string' ? JSON.parse(value) : value;
                return `<span class="font-mono text-xs">[${arr.length} items]</span>`;
            } catch (e) {
                return `<span class="text-red-500">${value}</span>`;
            }
        case 'number':
            return `<span class="font-mono">${value}</span>`;
        default:
            return value && value.toString().length > 50 
                ? value.toString().substring(0, 50) + '...'
                : value ? value.toString() : '';
    }
};

/**
 * Tạo badge hiển thị trạng thái
 * @param {number} status - Trạng thái (1: kích hoạt, 0: vô hiệu hóa)
 * @returns {string} HTML cho badge trạng thái
 */
const getStatusBadge = (status) => {
    return status === 1
        ? '<span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">Kích hoạt</span>'
        : '<span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">Vô hiệu hóa</span>';
};

/**
 * Định dạng thời gian
 * @param {string} dateTimeStr - Chuỗi thời gian cần định dạng
 * @returns {string} Thời gian đã được định dạng
 */
const formatDateTime = (dateTimeStr) => {
    if (!dateTimeStr) return 'N/A';
    
    try {
        const date = new Date(dateTimeStr);
        if (isNaN(date.getTime())) return dateTimeStr;
        
        return date.toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch (error) {
        return dateTimeStr;
    }
};

/**
 * Bật/tắt trạng thái đang tải
 * @param {boolean} show - Trạng thái đang tải
 */
const toggleLoader = (show) => {
    if (loadingIndicator) {
        loadingIndicator.style.display = show ? 'flex' : 'none';
    }
};

/**
 * Cập nhật giao diện sắp xếp
 * @param {string} field - Trường đang được sắp xếp
 */
const updateSortUI = (field) => {
    // Xóa tất cả biểu tượng sắp xếp hiện tại
    document.querySelectorAll('th .sort-icon').forEach(icon => {
        icon.innerHTML = '<i class="ri-sort-line text-gray-400"></i>';
    });
    
    // Nếu có trường đang sắp xếp, cập nhật biểu tượng tương ứng
    if (field) {
        const headerCell = document.querySelector(`th [data-sort="${field}"]`);
        if (headerCell) {
            const sortIcon = headerCell.querySelector('.sort-icon');
            if (sortIcon) {
                if (sortDirection === 'asc') {
                    sortIcon.innerHTML = '<i class="ri-sort-asc text-primary"></i>';
                } else {
                    sortIcon.innerHTML = '<i class="ri-sort-desc text-primary"></i>';
                }
            }
        }
    }
};

/**
 * Lấy dữ liệu cài đặt từ API hoặc dữ liệu mẫu
 * @returns {Promise<Object[]>} Mảng các cài đặt hệ thống
 */
const fetchSettings = async () => {
    toggleLoader(true);
    
    try {
        // Mô phỏng API call
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Sử dụng trực tiếp dữ liệu mẫu từ settingsMockData
        const data = [...settingsMockData];
        
        // Cập nhật state với dữ liệu
        allSettings = data || [];
        
        // Lọc dữ liệu theo các bộ lọc
        const filteredData = filterSettings();
        
        // Sắp xếp dữ liệu
        const sortedData = sortSettings(filteredData);
        
        // Tính toán tổng số trang
        totalPages = Math.max(1, Math.ceil(sortedData.length / itemsPerPage));
        
        // Đảm bảo trang hiện tại hợp lệ
        if (currentPage > totalPages) {
            currentPage = totalPages;
        }
        
        // Phân trang dữ liệu
        const paginatedData = paginateSettings(sortedData);
        
        // Cập nhật UI
        renderTable(paginatedData);
        updatePagination(sortedData.length);
        
        return allSettings;
    } catch (error) {
        console.error('Lỗi khi tải dữ liệu cài đặt:', error);
        showToast('Có lỗi xảy ra khi tải dữ liệu cài đặt. Vui lòng thử lại sau.', 'error');
        renderTable([]);
        updatePagination(0);
        return [];
    } finally {
        toggleLoader(false);
    }
};

/**
 * Lọc dữ liệu cài đặt dựa trên bộ lọc
 * @returns {Array} Mảng dữ liệu đã lọc
 */
const filterSettings = () => {
    return allSettings.filter(setting => {
        // Lọc theo khóa
        if (filters.key && !setting.key.toLowerCase().includes(filters.key.toLowerCase())) {
            return false;
        }
        
        // Lọc theo nhóm (class)
        if (filters.class && setting.class !== filters.class) {
            return false;
        }
        
        // Lọc theo loại dữ liệu
        if (filters.type && setting.type !== filters.type) {
            return false;
        }
        
        // Lọc theo trạng thái
        if (filters.status !== '' && setting.status.toString() !== filters.status) {
            return false;
        }
        
        return true;
    });
};

/**
 * Sắp xếp dữ liệu cài đặt
 * @param {Array} data - Dữ liệu cần sắp xếp
 * @returns {Array} Mảng dữ liệu đã sắp xếp
 */
const sortSettings = (data) => {
    return [...data].sort((a, b) => {
        let valueA = a[sortField];
        let valueB = b[sortField];
        
        // Xử lý các kiểu dữ liệu khác nhau
        if (sortField === 'created_at' || sortField === 'updated_at') {
            valueA = new Date(valueA || 0);
            valueB = new Date(valueB || 0);
        } else if (typeof valueA === 'string') {
            valueA = valueA.toLowerCase();
            valueB = (valueB || '').toLowerCase();
        }
        
        // Thực hiện so sánh
        if (valueA < valueB) {
            return sortDirection === 'asc' ? -1 : 1;
        }
        if (valueA > valueB) {
            return sortDirection === 'asc' ? 1 : -1;
        }
        return 0;
    });
};

/**
 * Lấy dữ liệu cho trang hiện tại
 * @param {Array} data - Mảng dữ liệu đã lọc và sắp xếp
 * @returns {Array} Mảng dữ liệu đã phân trang
 */
const paginateSettings = (data) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex);
};

/**
 * Hiển thị danh sách cài đặt
 * @param {Array} settings - Mảng cài đặt cần hiển thị
 */
const renderTable = (settings) => {
    if (!settingsTableBody) return;
    
    // Kiểm tra và hiển thị thông báo nếu không có dữ liệu
    if (!settings || settings.length === 0) {
        settingsTableBody.innerHTML = '';
        if (noDataPlaceholder) noDataPlaceholder.classList.remove('hidden');
        return;
    } else {
        if (noDataPlaceholder) noDataPlaceholder.classList.add('hidden');
    }
    
    // Xóa dữ liệu cũ
    settingsTableBody.innerHTML = '';
    
    // Render từng cài đặt
    settings.forEach(setting => {
        const row = document.createElement('tr');
        row.className = 'hover:bg-gray-50';
        row.dataset.id = setting.id;
        
        row.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${setting.id}</td>
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">${setting.key}</div>
                <div class="text-xs text-gray-500">${setting.class || 'N/A'}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${setting.type}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                ${formatSettingValue(setting.value, setting.type)}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                ${setting.context ? setting.context : '-'}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                ${getStatusBadge(setting.status)}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                ${formatDateTime(setting.updated_at)}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex items-center space-x-2 justify-end">
                    <a href="setting-detail.html?id=${setting.id}" class="text-blue-600 hover:text-blue-900" title="Xem chi tiết">
                        <i class="ri-eye-line"></i>
                    </a>
                    <a href="setting-edit.html?id=${setting.id}" class="text-indigo-600 hover:text-indigo-900" title="Chỉnh sửa">
                        <i class="ri-edit-line"></i>
                    </a>
                    <button type="button" class="delete-setting text-red-600 hover:text-red-900" data-id="${setting.id}" title="Xóa">
                        <i class="ri-delete-bin-line"></i>
                    </button>
                    <button type="button" class="toggle-status ${setting.status === 1 ? 'text-green-600 hover:text-green-800' : 'text-gray-400 hover:text-gray-600'}" data-id="${setting.id}" data-status="${setting.status}" title="${setting.status === 1 ? 'Vô hiệu hóa' : 'Kích hoạt'}">
                        <i class="ri-toggle-${setting.status === 1 ? 'line' : 'fill'}"></i>
                    </button>
                </div>
            </td>
        `;
        
        settingsTableBody.appendChild(row);
    });
    
    // Thêm event listeners cho các action button
    setupActionButtons();
};

/**
 * Cập nhật UI phân trang
 * @param {number} totalItems - Tổng số mục
 */
const updatePagination = (totalItems) => {
    // Cập nhật UI
    if (currentPageInput) currentPageInput.value = currentPage;
    if (totalPagesCount) totalPagesCount.textContent = totalPages;
    if (totalItemsCount) totalItemsCount.textContent = totalItems;
    
    // Cập nhật trạng thái nút chuyển trang
    const btnFirst = document.querySelector('.btn-first');
    const btnPrev = document.querySelector('.btn-prev');
    const btnNext = document.querySelector('.btn-next');
    const btnLast = document.querySelector('.btn-last');
    
    if (btnFirst) btnFirst.disabled = currentPage <= 1;
    if (btnPrev) btnPrev.disabled = currentPage <= 1;
    if (btnNext) btnNext.disabled = currentPage >= totalPages;
    if (btnLast) btnLast.disabled = currentPage >= totalPages;
    
    // Thiết lập các lớp CSS cho trạng thái disabled
    [btnFirst, btnPrev, btnNext, btnLast].forEach(button => {
        if (button) {
            if (button.disabled) {
                button.classList.add('opacity-50', 'cursor-not-allowed');
            } else {
                button.classList.remove('opacity-50', 'cursor-not-allowed');
            }
        }
    });
    
    // Cập nhật số lượng hiển thị
    if (settingsCount) {
        settingsCount.innerHTML = `
            Hiển thị ${totalItems ? (currentPage - 1) * itemsPerPage + 1 : 0} 
            đến ${Math.min(currentPage * itemsPerPage, totalItems)} 
            trên tổng số ${totalItems} cài đặt
        `;
    }
};

/**
 * Chuyển đến trang mới
 * @param {number} page - Trang cần chuyển đến
 */
const goToPage = (page) => {
    // Đảm bảo trang mới nằm trong khoảng hợp lệ
    if (page < 1 || page > totalPages) {
        return;
    }
    
    currentPage = page;
    applyFiltersAndLoadData();
};

/**
 * Thiết lập event listeners cho các nút thao tác (xóa, toggle)
 */
const setupActionButtons = () => {
    // Xử lý nút toggle status
    document.querySelectorAll('.toggle-status').forEach(button => {
        button.addEventListener('click', async (e) => {
            const id = parseInt(e.currentTarget.dataset.id);
            const currentStatus = parseInt(e.currentTarget.dataset.status);
            
            try {
                // Mô phỏng gọi API
                await new Promise(resolve => setTimeout(resolve, 300));
                
                // Cập nhật trạng thái trong dữ liệu
                const settingIndex = allSettings.findIndex(s => s.id === id);
                if (settingIndex !== -1) {
                    allSettings[settingIndex].status = currentStatus === 1 ? 0 : 1;
                    
                    // Hiển thị thông báo thành công
                    const statusText = allSettings[settingIndex].status === 1 ? 'kích hoạt' : 'vô hiệu hóa';
                    showToast(`Đã ${statusText} cài đặt "${allSettings[settingIndex].key}" thành công`, 'success');
                    
                    // Cập nhật lại UI
                    applyFiltersAndLoadData();
                }
            } catch (error) {
                console.error('Lỗi khi thay đổi trạng thái:', error);
                showToast('Có lỗi xảy ra khi cập nhật trạng thái cài đặt', 'error');
            }
        });
    });
    
    // Xử lý nút xóa
    document.querySelectorAll('.delete-setting').forEach(button => {
        button.addEventListener('click', async (e) => {
            const id = parseInt(e.currentTarget.dataset.id);
            const settingIndex = allSettings.findIndex(s => s.id === id);
            
            if (settingIndex !== -1) {
                if (confirm(`Bạn có chắc chắn muốn xóa cài đặt "${allSettings[settingIndex].key}"?`)) {
                    try {
                        // Mô phỏng gọi API
                        await new Promise(resolve => setTimeout(resolve, 300));
                        
                        // Xóa cài đặt khỏi dữ liệu
                        allSettings.splice(settingIndex, 1);
                        
                        // Hiển thị thông báo thành công
                        showToast('Đã xóa cài đặt thành công', 'success');
                        
                        // Cập nhật lại UI
                        applyFiltersAndLoadData();
                    } catch (error) {
                        console.error('Lỗi khi xóa cài đặt:', error);
                        showToast('Có lỗi xảy ra khi xóa cài đặt', 'error');
                    }
                }
            }
        });
    });
};

/**
 * Xử lý sự kiện lọc dữ liệu
 * @param {Event} event - Sự kiện submit form
 */
const handleFilter = (event) => {
    event.preventDefault();
    
    // Cập nhật bộ lọc
    filters.key = filterKey.value.trim();
    filters.class = filterClass.value;
    filters.type = filterType.value;
    filters.status = filterStatus.value;
    
    // Reset trang về 1 khi thay đổi bộ lọc
    currentPage = 1;
    
    // Cập nhật lại UI
    applyFiltersAndLoadData();
};

/**
 * Đặt lại các bộ lọc
 */
const resetFilter = () => {
    // Đặt lại form
    if (filterForm) filterForm.reset();
    
    // Đặt lại trạng thái bộ lọc
    filters.key = '';
    filters.class = '';
    filters.type = '';
    filters.status = '';
    
    // Reset trang về 1 khi thay đổi bộ lọc
    currentPage = 1;
    
    // Cập nhật lại UI
    applyFiltersAndLoadData();
};

/**
 * Xử lý sự kiện thay đổi số lượng item trên trang
 */
const handlePerPageChange = () => {
    if (!itemsPerPageSelect) return;
    
    const newPerPage = parseInt(itemsPerPageSelect.value);
    if (isNaN(newPerPage) || newPerPage < 1) {
        return;
    }
    
    // Lưu vị trí hiện tại để cố gắng duy trì khi thay đổi kích thước trang
    const currentPosition = (currentPage - 1) * itemsPerPage;
    
    // Cập nhật số lượng item trên trang
    itemsPerPage = newPerPage;
    
    // Tính toán trang mới dựa trên vị trí cũ
    currentPage = Math.floor(currentPosition / newPerPage) + 1;
    
    // Cập nhật UI
    applyFiltersAndLoadData();
};

/**
 * Xử lý sự kiện sắp xếp dữ liệu
 * @param {Event} event - Sự kiện click 
 */
const handleSort = (event) => {
    const clickedElement = event.target.closest('[data-sort]');
    if (!clickedElement) return;
    
    const field = clickedElement.dataset.sort;
    
    // Nếu click vào cùng một trường, đảo ngược hướng sắp xếp
    if (field === sortField) {
        sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
        // Nếu click vào trường khác, thiết lập trường sắp xếp mới và hướng mặc định (asc)
        sortField = field;
        sortDirection = 'asc';
    }
    
    // Cập nhật UI và dữ liệu
    updateSortUI(sortField);
    applyFiltersAndLoadData();
};

/**
 * Xử lý sự kiện làm mới dữ liệu
 */
const handleRefresh = async () => {
    try {
        await fetchSettings();
        showToast('Đã làm mới dữ liệu thành công', 'success');
    } catch (error) {
        console.error('Lỗi khi làm mới dữ liệu:', error);
        showToast('Có lỗi xảy ra khi làm mới dữ liệu', 'error');
    }
};


/**
 * Áp dụng tất cả bộ lọc và tải lại dữ liệu
 */
const applyFiltersAndLoadData = () => {
    toggleLoader(true);
    
    try {
        // Lọc dữ liệu
        const filteredData = filterSettings();
        
        // Sắp xếp dữ liệu
        const sortedData = sortSettings(filteredData);
        
        // Cập nhật tổng số trang
        totalPages = Math.max(1, Math.ceil(sortedData.length / itemsPerPage));
        
        // Đảm bảo trang hiện tại hợp lệ
        if (currentPage > totalPages) {
            currentPage = totalPages;
        }
        
        // Phân trang dữ liệu
        const paginatedData = paginateSettings(sortedData);
        
        // Cập nhật UI
        renderTable(paginatedData);
        updatePagination(sortedData.length);
    } catch (error) {
        console.error('Lỗi khi áp dụng bộ lọc:', error);
        showToast('Có lỗi xảy ra khi lọc dữ liệu', 'error');
    } finally {
        toggleLoader(false);
    }
};

/**
 * Thiết lập sidebar
 */
const setupSidebar = () => {
    const sidebar = document.getElementById('sidebar');
    const sidebarBackdrop = document.getElementById('sidebar-backdrop');
    const sidebarOpenBtn = document.getElementById('sidebar-open');
    const sidebarCloseBtn = document.getElementById('sidebar-close');
    
    if (!sidebar || !sidebarOpenBtn) return;
    
    // Mở sidebar (trên mobile)
    sidebarOpenBtn.addEventListener('click', () => {
        sidebar.classList.replace('-translate-x-full', 'translate-x-0');
        sidebarBackdrop.classList.remove('hidden');
        setTimeout(() => {
            sidebarBackdrop.classList.replace('opacity-0', 'opacity-100');
        }, 50);
    });
    
    // Đóng sidebar (trên mobile)
    const closeSidebar = () => {
        sidebar.classList.replace('translate-x-0', '-translate-x-full');
        sidebarBackdrop.classList.replace('opacity-100', 'opacity-0');
        setTimeout(() => {
            sidebarBackdrop.classList.add('hidden');
        }, 300);
    };
    
    if (sidebarCloseBtn) sidebarCloseBtn.addEventListener('click', closeSidebar);
    if (sidebarBackdrop) sidebarBackdrop.addEventListener('click', closeSidebar);
};

/**
 * Thiết lập menu người dùng
 */
const setupUserMenu = () => {
    const userMenuButton = document.getElementById('user-menu-button');
    const userMenu = document.getElementById('user-menu');
    
    if (!userMenuButton || !userMenu) return;
    
    userMenuButton.addEventListener('click', (e) => {
        e.stopPropagation();
        userMenu.classList.toggle('hidden');
    });
    
    // Đóng menu người dùng khi click ra ngoài
    document.addEventListener('click', (e) => {
        if (!userMenuButton.contains(e.target) && !userMenu.contains(e.target)) {
            userMenu.classList.add('hidden');
        }
    });
};

/**
 * Lấy danh sách loại cài đặt độc đáo (class) từ dữ liệu
 * @returns {Array} Mảng các loại cài đặt
 */
const getUniqueClasses = () => {
    const classes = [...new Set(allSettings.map(s => s.class))].filter(c => c);
    return classes.sort();
};

/**
 * Lấy danh sách loại dữ liệu độc đáo (type) từ dữ liệu
 * @returns {Array} Mảng các loại dữ liệu
 */
const getUniqueTypes = () => {
    const types = [...new Set(allSettings.map(s => s.type))].filter(t => t);
    return types.sort();
};

/**
 * Tạo options cho dropdown bộ lọc
 */
const populateFilterOptions = () => {
    // Tạo options cho select class
    if (filterClass) {
        const classOptions = getUniqueClasses();
        filterClass.innerHTML = '<option value="">-- Tất cả nhóm --</option>';
        classOptions.forEach(cls => {
            filterClass.innerHTML += `<option value="${cls}">${cls}</option>`;
        });
    }
    
    // Tạo options cho select type
    if (filterType) {
        const typeOptions = getUniqueTypes();
        filterType.innerHTML = '<option value="">-- Tất cả loại --</option>';
        typeOptions.forEach(type => {
            filterType.innerHTML += `<option value="${type}">${type}</option>`;
        });
    }
};

/**
 * Thiết lập các sự kiện cho bảng và dropdown
 */
const setupEventListeners = () => {
    // Phân trang
    document.querySelector('.btn-first')?.addEventListener('click', () => goToPage(1));
    document.querySelector('.btn-prev')?.addEventListener('click', () => goToPage(currentPage - 1));
    document.querySelector('.btn-next')?.addEventListener('click', () => goToPage(currentPage + 1));
    document.querySelector('.btn-last')?.addEventListener('click', () => goToPage(totalPages));
    
    // Đổi trang
    currentPageInput?.addEventListener('change', (e) => {
        const newPage = parseInt(e.target.value);
        if (!isNaN(newPage) && newPage >= 1 && newPage <= totalPages) {
            goToPage(newPage);
        } else {
            e.target.value = currentPage;
        }
    });
    
    // Lọc dữ liệu
    filterForm?.addEventListener('submit', handleFilter);
    resetFilterBtn?.addEventListener('click', resetFilter);
    
    // Đổi số lượng item trên trang
    itemsPerPageSelect?.addEventListener('change', handlePerPageChange);
    
    // Sắp xếp
    document.querySelectorAll('[data-sort]').forEach(el => {
        el.addEventListener('click', handleSort);
    });
    
    // Làm mới
    refreshBtn?.addEventListener('click', handleRefresh);
    
};

/**
 * Khởi tạo trang quản lý cài đặt
 */
const initializeSettingsPage = async () => {
    try {
        // Khởi tạo UI cơ bản
        setupSidebar();
        setupUserMenu();
        
        // Tải dữ liệu ban đầu
        await fetchSettings();
        
        // Tạo options cho dropdown bộ lọc
        populateFilterOptions();
        
        // Thiết lập các sự kiện
        setupEventListeners();
        
        // Cập nhật UI sắp xếp ban đầu
        updateSortUI(sortField);
    } catch (error) {
        console.error('Lỗi khởi tạo trang:', error);
        showToast('Có lỗi xảy ra khi khởi tạo trang. Vui lòng thử lại sau.', 'error');
    }
};

// Khởi chạy khi trang đã tải xong
document.addEventListener('DOMContentLoaded', initializeSettingsPage); 