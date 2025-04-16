/**
 * Module xem chi tiết cài đặt
 * 
 * Sử dụng phong cách lập trình hàm (functional programming)
 * Hiển thị thông tin chi tiết của một cài đặt hệ thống
 */

// Khởi tạo AOS
AOS.init();

// Biến trạng thái
let currentSetting = null;
let settingId = null;

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
const settingForm = document.getElementById('setting-form');
const settingTitle = document.getElementById('setting-title');
const settingDetailContainer = document.getElementById('setting-detail-container');
const loadingIndicator = document.getElementById('loading-indicator');
const alertContainer = document.getElementById('alert-container');
const deleteBtnContainer = document.getElementById('delete-btn-container');
const backBtn = document.getElementById('back-button');
const editBtn = document.getElementById('edit-button');
const deleteBtn = document.getElementById('delete-button');

/**
 * Hiển thị thông báo
 * @param {string} message - Nội dung thông báo
 * @param {string} type - Loại thông báo (success, error, warning, info)
 */
const showAlert = (message, type = 'info') => {
    if (!alertContainer) return;
    
    // Xóa thông báo cũ
    alertContainer.innerHTML = '';
    
    // Thiết lập class dựa trên loại thông báo
    let alertClass = '';
    let icon = '';
    
    switch (type) {
        case 'success':
            alertClass = 'bg-green-50 border-green-400 text-green-700';
            icon = '<i class="ri-checkbox-circle-line"></i>';
            break;
        case 'error':
            alertClass = 'bg-red-50 border-red-400 text-red-700';
            icon = '<i class="ri-error-warning-line"></i>';
            break;
        case 'warning':
            alertClass = 'bg-yellow-50 border-yellow-400 text-yellow-700';
            icon = '<i class="ri-alert-line"></i>';
            break;
        default:
            alertClass = 'bg-blue-50 border-blue-400 text-blue-700';
            icon = '<i class="ri-information-line"></i>';
    }
    
    // Tạo thông báo
    const alert = document.createElement('div');
    alert.className = `border-l-4 p-4 ${alertClass} relative`;
    alert.innerHTML = `
        <div class="flex items-start">
            <div class="flex-shrink-0 mt-0.5">
                ${icon}
            </div>
            <div class="ml-3">
                <p class="text-sm">${message}</p>
            </div>
            <button type="button" class="ml-auto -mx-1.5 -my-1.5 rounded-lg focus:ring-2 focus:ring-gray-400 p-1.5 inline-flex h-8 w-8 ${alertClass} hover:bg-opacity-75" data-dismiss-target="#alert-container" aria-label="Close">
                <span class="sr-only">Đóng</span>
                <i class="ri-close-line"></i>
            </button>
        </div>
    `;
    
    // Thêm vào container
    alertContainer.appendChild(alert);
    alertContainer.classList.remove('hidden');
    
    // Xử lý sự kiện đóng
    const closeBtn = alert.querySelector('button');
    closeBtn.addEventListener('click', () => {
        alertContainer.classList.add('hidden');
    });
    
    // Tự động ẩn sau 5 giây
    setTimeout(() => {
        if (alertContainer.contains(alert)) {
            alertContainer.classList.add('hidden');
        }
    }, 5000);
};

/**
 * Định dạng giá trị cài đặt dựa trên kiểu dữ liệu
 * @param {any} value - Giá trị cần định dạng
 * @param {string} type - Kiểu dữ liệu của giá trị
 * @returns {string} Giá trị đã được định dạng
 */
const formatSettingValue = (value, type) => {
    if (value === null || value === undefined) return '';
    
    switch (type.toLowerCase()) {
        case 'boolean':
            return value === '1' || value === 'true' || value === true ? 'true' : 'false';
        case 'json':
            try {
                const jsonObj = typeof value === 'string' ? JSON.parse(value) : value;
                return JSON.stringify(jsonObj, null, 2);
            } catch (e) {
                return value;
            }
        case 'array':
            try {
                const arr = typeof value === 'string' ? JSON.parse(value) : value;
                return JSON.stringify(arr, null, 2);
            } catch (e) {
                return value;
            }
        default:
            return value.toString();
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
 * Lấy tham số từ URL
 * @param {string} name - Tên tham số
 * @returns {string|null} Giá trị của tham số
 */
const getUrlParam = (name) => {
    const params = new URLSearchParams(window.location.search);
    return params.get(name);
};

/**
 * Định dạng thời gian
 * @param {string} dateTimeStr - Chuỗi thời gian cần định dạng
 * @returns {string} Thời gian đã được định dạng
 */
const formatDateTime = (dateTimeStr) => {
    if (!dateTimeStr) return 'N/A';
    
    const date = new Date(dateTimeStr);
    if (isNaN(date.getTime())) return dateTimeStr;
    
    return date.toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
};

/**
 * Bật/tắt trạng thái đang tải
 * @param {boolean} show - Trạng thái đang tải
 */
const toggleLoader = (show) => {
    if (loadingIndicator) {
        loadingIndicator.style.display = show ? 'flex' : 'none';
    }
    
    if (settingDetailContainer) {
        settingDetailContainer.style.display = show ? 'none' : 'block';
    }
};

/**
 * Lấy thông tin chi tiết cài đặt từ API hoặc dữ liệu mẫu
 * @param {number} id - ID của cài đặt
 * @returns {Promise<Object>} Thông tin cài đặt
 */
const fetchSettingDetail = async (id) => {
    toggleLoader(true);
    
    try {
        // Mô phỏng API call
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Trong môi trường thực, đây sẽ là API call
        // const response = await fetch(`/api/settings/${id}`);
        // const data = await response.json();
        
        // Sử dụng dữ liệu mẫu
        const setting = settingsMockData.find(s => s.id === parseInt(id));
        
        if (!setting) {
            throw new Error('Không tìm thấy cài đặt với ID đã cho');
        }
        
        return setting;
    } catch (error) {
        console.error('Lỗi khi lấy thông tin cài đặt:', error);
        showAlert('Không thể tải thông tin cài đặt. ' + error.message, 'error');
        throw error;
    } finally {
        toggleLoader(false);
    }
};

/**
 * Xóa cài đặt
 * @param {number} id - ID của cài đặt cần xóa
 */
const deleteSetting = async (id) => {
    if (!confirm('Bạn có chắc chắn muốn xóa cài đặt này?')) {
        return;
    }
    
    toggleLoader(true);
    
    try {
        // Mô phỏng API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Trong môi trường thực, đây sẽ là API call
        // await fetch(`/api/settings/${id}`, { method: 'DELETE' });
        
        showAlert('Đã xóa cài đặt thành công.', 'success');
        
        // Chuyển về trang danh sách sau 1 giây
        setTimeout(() => {
            window.location.href = 'settings.html';
        }, 1000);
    } catch (error) {
        console.error('Lỗi khi xóa cài đặt:', error);
        showAlert('Không thể xóa cài đặt. ' + error.message, 'error');
    } finally {
        toggleLoader(false);
    }
};

/**
 * Hiển thị thông tin chi tiết cài đặt
 * @param {Object} setting - Thông tin cài đặt
 */
const renderSettingDetail = (setting) => {
    if (!settingForm || !setting) return;
    
    currentSetting = setting;
    
    // Cập nhật tiêu đề
    if (settingTitle) {
        settingTitle.textContent = `Chi tiết cài đặt: ${setting.key}`;
    }
    
    // Cập nhật các nút
    if (editBtn) {
        editBtn.href = `setting-edit.html?id=${setting.id}`;
    }
    
    if (deleteBtn) {
        deleteBtn.dataset.id = setting.id;
    }
    
    // Render form (dù là readOnly)
    settingForm.innerHTML = `
        <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">ID</label>
            <div class="mt-1 p-2 bg-gray-50 border border-gray-200 rounded-md text-gray-900">${setting.id}</div>
        </div>
        
        <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Khóa (Key)</label>
            <div class="mt-1 p-2 bg-gray-50 border border-gray-200 rounded-md text-gray-900">${setting.key}</div>
        </div>
        
        <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Nhóm (Class)</label>
            <div class="mt-1 p-2 bg-gray-50 border border-gray-200 rounded-md text-gray-900">${setting.class || 'N/A'}</div>
        </div>
        
        <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Loại dữ liệu</label>
            <div class="mt-1 p-2 bg-gray-50 border border-gray-200 rounded-md text-gray-900">${setting.type}</div>
        </div>
        
        <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Giá trị</label>
            <pre class="mt-1 p-2 bg-gray-50 border border-gray-200 rounded-md text-gray-900 overflow-auto max-h-48">${formatSettingValue(setting.value, setting.type)}</pre>
        </div>
        
        <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Ghi chú</label>
            <div class="mt-1 p-2 bg-gray-50 border border-gray-200 rounded-md text-gray-900">${setting.context || 'Không có ghi chú'}</div>
        </div>
        
        <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
            <div class="mt-1">${getStatusBadge(setting.status)}</div>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Ngày tạo</label>
                <div class="mt-1 p-2 bg-gray-50 border border-gray-200 rounded-md text-gray-900">${formatDateTime(setting.created_at)}</div>
            </div>
            
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Cập nhật lần cuối</label>
                <div class="mt-1 p-2 bg-gray-50 border border-gray-200 rounded-md text-gray-900">${formatDateTime(setting.updated_at)}</div>
            </div>
        </div>
    `;
};

/**
 * Thiết lập event listeners
 */
const setupEventListeners = () => {
    // Nút quay lại
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            history.back();
        });
    }
    
    // Nút xóa
    if (deleteBtn) {
        deleteBtn.addEventListener('click', (e) => {
            const id = e.currentTarget.dataset.id;
            if (id) {
                deleteSetting(id);
            }
        });
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
 * Khởi tạo trang chi tiết cài đặt
 */
const initializeSettingDetailPage = async () => {
    try {
        // Thiết lập UI cơ bản
        setupSidebar();
        setupUserMenu();
        setupEventListeners();
        
        // Lấy ID từ URL
        settingId = getUrlParam('id');
        
        if (!settingId) {
            showAlert('Không tìm thấy ID cài đặt trong URL.', 'error');
            return;
        }
        
        // Lấy thông tin chi tiết cài đặt
        const setting = await fetchSettingDetail(settingId);
        
        // Hiển thị thông tin
        renderSettingDetail(setting);
    } catch (error) {
        console.error('Lỗi khởi tạo trang:', error);
        showAlert('Có lỗi xảy ra khi khởi tạo trang. Vui lòng thử lại sau.', 'error');
    }
};

// Khởi chạy khi trang đã tải xong
document.addEventListener('DOMContentLoaded', initializeSettingDetailPage); 