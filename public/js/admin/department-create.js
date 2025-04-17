/**
 * Quản lý thêm mới phòng khoa
 * 
 * File này xử lý các chức năng liên quan đến thêm mới phòng khoa:
 * - Xác thực dữ liệu form
 * - Kiểm tra trùng lặp mã phòng khoa
 * - Thêm phòng khoa mới vào hệ thống
 * - Hiển thị thông báo thành công/lỗi
 * 
 * Dữ liệu được lưu vào departmentsMockData và localStorage
 */

// Khởi tạo AOS
AOS.init();

// Biến để lưu trữ các phần tử DOM
const domElements = {
    // Form và các trường nhập liệu
    form: document.getElementById('department-create-form'),
    tenPhongKhoa: document.getElementById('ten_phong_khoa'),
    maPhongKhoa: document.getElementById('ma_phong_khoa'),
    ghiChu: document.getElementById('ghi_chu'),
    status: document.getElementById('status'),
    
    // Thông báo lỗi
    formError: document.getElementById('form-error-alert'),
    formErrorMessage: document.getElementById('form-error-message'),
    tenPhongKhoaError: document.getElementById('ten_phong_khoa-error'),
    maPhongKhoaError: document.getElementById('ma_phong_khoa-error'),
    
    // Sidebar
    sidebar: document.getElementById('sidebar'),
    sidebarOpen: document.getElementById('sidebar-open'),
    sidebarClose: document.getElementById('sidebar-close'),
    sidebarBackdrop: document.getElementById('sidebar-backdrop')
};

/**
 * Hiển thị lỗi chung cho form
 * @param {string} message - Thông báo lỗi cần hiển thị
 */
const showFormError = (message) => {
    if (!domElements.formError || !domElements.formErrorMessage) return;
    
    domElements.formErrorMessage.textContent = message;
    domElements.formError.classList.remove('hidden');
    
    // Tự động ẩn sau 5 giây
    setTimeout(() => {
        hideFormError();
    }, 5000);
};

/**
 * Ẩn thông báo lỗi chung của form
 */
const hideFormError = () => {
    if (!domElements.formError) return;
    domElements.formError.classList.add('hidden');
};

/**
 * Hiển thị lỗi cho một trường cụ thể
 * @param {HTMLElement} field - Trường nhập liệu
 * @param {HTMLElement} errorElement - Phần tử hiển thị lỗi
 * @param {string} message - Thông báo lỗi
 */
const showFieldError = (field, errorElement, message) => {
    if (!field || !errorElement) return;
    
    // Thêm lớp CSS lỗi
    field.classList.add('border-red-500', 'focus:border-red-500', 'focus:ring-red-500');
    field.classList.remove('border-gray-300', 'focus:border-primary', 'focus:ring-primary');
    
    // Hiển thị thông báo lỗi
    errorElement.textContent = message;
    errorElement.classList.remove('hidden');
};

/**
 * Xóa lỗi cho một trường cụ thể
 * @param {HTMLElement} field - Trường nhập liệu
 * @param {HTMLElement} errorElement - Phần tử hiển thị lỗi
 */
const clearFieldError = (field, errorElement) => {
    if (!field || !errorElement) return;
    
    // Khôi phục lớp CSS bình thường
    field.classList.remove('border-red-500', 'focus:border-red-500', 'focus:ring-red-500');
    field.classList.add('border-gray-300', 'focus:border-primary', 'focus:ring-primary');
    
    // Ẩn thông báo lỗi
    errorElement.textContent = '';
    errorElement.classList.add('hidden');
};

/**
 * Xóa tất cả lỗi của form
 */
const clearAllFieldErrors = () => {
    hideFormError();
    
    const fieldErrorMap = [
        { field: domElements.tenPhongKhoa, error: domElements.tenPhongKhoaError },
        { field: domElements.maPhongKhoa, error: domElements.maPhongKhoaError }
    ];
    
    fieldErrorMap.forEach(item => {
        if (item.field && item.error) {
            clearFieldError(item.field, item.error);
        }
    });
};

/**
 * Xác thực dữ liệu form
 * @returns {boolean} Kết quả xác thực (true nếu hợp lệ)
 */
const validateForm = () => {
    clearAllFieldErrors();
    
    let isValid = true;
    
    // Kiểm tra tên phòng khoa
    if (!domElements.tenPhongKhoa.value.trim()) {
        showFieldError(
            domElements.tenPhongKhoa,
            domElements.tenPhongKhoaError,
            'Vui lòng nhập tên phòng khoa'
        );
        isValid = false;
    } else if (domElements.tenPhongKhoa.value.trim().length < 3) {
        showFieldError(
            domElements.tenPhongKhoa,
            domElements.tenPhongKhoaError,
            'Tên phòng khoa phải có ít nhất 3 ký tự'
        );
        isValid = false;
    } else if (domElements.tenPhongKhoa.value.trim().length > 200) {
        showFieldError(
            domElements.tenPhongKhoa,
            domElements.tenPhongKhoaError,
            'Tên phòng khoa không được vượt quá 200 ký tự'
        );
        isValid = false;
    }
    
    // Kiểm tra mã phòng khoa
    if (!domElements.maPhongKhoa.value.trim()) {
        showFieldError(
            domElements.maPhongKhoa,
            domElements.maPhongKhoaError,
            'Vui lòng nhập mã phòng khoa'
        );
        isValid = false;
    } else if (domElements.maPhongKhoa.value.trim().length < 2) {
        showFieldError(
            domElements.maPhongKhoa,
            domElements.maPhongKhoaError,
            'Mã phòng khoa phải có ít nhất 2 ký tự'
        );
        isValid = false;
    } else if (domElements.maPhongKhoa.value.trim().length > 20) {
        showFieldError(
            domElements.maPhongKhoa,
            domElements.maPhongKhoaError,
            'Mã phòng khoa không được vượt quá 20 ký tự'
        );
        isValid = false;
    } else if (checkMaPhongKhoaExists(domElements.maPhongKhoa.value.trim())) {
        showFieldError(
            domElements.maPhongKhoa,
            domElements.maPhongKhoaError,
            'Mã phòng khoa đã tồn tại trong hệ thống'
        );
        isValid = false;
    }
    
    return isValid;
};

/**
 * Kiểm tra mã phòng khoa đã tồn tại chưa
 * @param {string} code - Mã phòng khoa cần kiểm tra
 * @returns {boolean} Kết quả kiểm tra (true nếu đã tồn tại)
 */
const checkMaPhongKhoaExists = (code) => {
    // Lấy danh sách phòng khoa từ window.departmentsMockData
    const existingDepartments = window.departmentsMockData || [];
    
    // Kiểm tra trùng lặp (không phân biệt hoa thường)
    return existingDepartments.some(
        dept => dept.ma_phong_khoa.toLowerCase() === code.toLowerCase()
    );
};

/**
 * Xử lý sự kiện khi submit form
 * @param {Event} e - Sự kiện submit
 */
const handleFormSubmit = (e) => {
    e.preventDefault();
    
    // Xác thực form
    if (!validateForm()) {
        // Cuộn lên đầu trang nếu có lỗi
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
    }
    
    try {
        // Thu thập dữ liệu form
        const formData = {
            ten_phong_khoa: domElements.tenPhongKhoa.value.trim(),
            ma_phong_khoa: domElements.maPhongKhoa.value.trim().toUpperCase(),
            ghi_chu: domElements.ghiChu.value.trim(),
            status: domElements.status.value,
            created_at: new Date().toISOString().slice(0, 19).replace('T', ' '),
            updated_at: null
        };
        
        // Thêm phòng khoa mới
        const newDepartment = createDepartment(formData);
        
        // Hiển thị thông báo thành công
        showToast('success', 'Thêm phòng khoa mới thành công!');
        
        // Chuyển hướng sau 2 giây
        setTimeout(() => {
            window.location.href = 'departments.html';
        }, 2000);
    } catch (error) {
        console.error('Lỗi khi tạo phòng khoa:', error);
        showFormError('Có lỗi xảy ra khi tạo phòng khoa. Vui lòng thử lại sau.');
    }
};

/**
 * Thêm phòng khoa mới vào danh sách
 * @param {Object} data - Dữ liệu phòng khoa mới
 * @returns {Object} Phòng khoa mới đã được thêm
 */
const createDepartment = (data) => {
    // Lấy danh sách phòng khoa hiện tại
    const departments = window.departmentsMockData || [];
    
    // Tạo ID mới
    const newId = departments.length > 0
        ? Math.max(...departments.map(dept => dept.phong_khoa_id)) + 1
        : 1;
    
    // Tạo đối tượng phòng khoa mới
    const newDepartment = {
        phong_khoa_id: newId,
        ...data
    };
    
    // Thêm vào danh sách
    departments.unshift(newDepartment);
    
    // Cập nhật danh sách vào biến toàn cục
    window.departmentsMockData = departments;
    
    // Lưu vào localStorage để thay đổi được lưu giữ giữa các phiên
    try {
        localStorage.setItem('departmentsMockData', JSON.stringify(departments));
    } catch (e) {
        console.warn('Không thể lưu dữ liệu vào localStorage:', e);
    }
    
    return newDepartment;
};

/**
 * Hiển thị thông báo toast
 * @param {string} type - Loại thông báo (success, error, info)
 * @param {string} message - Nội dung thông báo
 * @param {number} duration - Thời gian hiển thị (ms)
 */
const showToast = (type, message, duration = 3000) => {
    const toastContainer = document.getElementById('toast-container');
    if (!toastContainer) return;
    
    const toast = document.createElement('div');
    toast.className = `animate-fade-in-up flex items-center p-4 mb-3 rounded-md shadow-md ${
        type === 'success' ? 'bg-green-50 text-green-800 border-l-4 border-green-500' : 
        type === 'error' ? 'bg-red-50 text-red-800 border-l-4 border-red-500' : 
        'bg-blue-50 text-blue-800 border-l-4 border-blue-500'
    }`;
    
    toast.innerHTML = `
        <div class="flex-shrink-0 mr-3">
            <i class="${
                type === 'success' ? 'ri-checkbox-circle-fill text-green-500' : 
                type === 'error' ? 'ri-error-warning-fill text-red-500' : 
                'ri-information-fill text-blue-500'
            } text-lg"></i>
        </div>
        <div class="flex-grow">
            <p class="text-sm font-medium">${message}</p>
        </div>
        <div class="flex-shrink-0 ml-3">
            <button type="button" class="text-gray-400 hover:text-gray-500 focus:outline-none" onclick="this.parentElement.parentElement.remove()">
                <i class="ri-close-line text-lg"></i>
            </button>
        </div>
    `;
    
    toastContainer.appendChild(toast);
    
    // Tự động ẩn
    setTimeout(() => {
        toast.classList.replace('animate-fade-in-up', 'animate-fade-out-down');
        setTimeout(() => toast.remove(), 300);
    }, duration);
};

/**
 * Thiết lập sidebar (đặc biệt là trên thiết bị di động)
 */
const setupSidebar = () => {
    // Xử lý hiển thị/ẩn sidebar trên mobile
    if (domElements.sidebarOpen) {
        domElements.sidebarOpen.addEventListener('click', () => {
            domElements.sidebar.classList.remove('-translate-x-full');
            domElements.sidebarBackdrop.classList.remove('hidden');
        });
    }

    if (domElements.sidebarClose) {
        domElements.sidebarClose.addEventListener('click', () => {
            domElements.sidebar.classList.add('-translate-x-full');
            domElements.sidebarBackdrop.classList.add('hidden');
        });
    }

    if (domElements.sidebarBackdrop) {
        domElements.sidebarBackdrop.addEventListener('click', () => {
            domElements.sidebar.classList.add('-translate-x-full');
            domElements.sidebarBackdrop.classList.add('hidden');
        });
    }
};

/**
 * Thiết lập các sự kiện
 */
const setupEventListeners = () => {
    // Xử lý sự kiện submit form
    if (domElements.form) {
        domElements.form.addEventListener('submit', handleFormSubmit);
    }
    
    // Xử lý sự kiện khi nhập mã phòng khoa
    if (domElements.maPhongKhoa) {
        domElements.maPhongKhoa.addEventListener('input', () => {
            // Tự động chuyển sang chữ hoa
            domElements.maPhongKhoa.value = domElements.maPhongKhoa.value.toUpperCase();
            
            // Kiểm tra trùng lặp nếu đã nhập đủ 2 ký tự
            if (domElements.maPhongKhoa.value.length >= 2) {
                if (checkMaPhongKhoaExists(domElements.maPhongKhoa.value)) {
                    showFieldError(
                        domElements.maPhongKhoa,
                        domElements.maPhongKhoaError,
                        'Mã phòng khoa đã tồn tại trong hệ thống'
                    );
                } else {
                    clearFieldError(domElements.maPhongKhoa, domElements.maPhongKhoaError);
                }
            }
        });
    }
};

/**
 * Khởi tạo trang
 */
const init = () => {
    // Thiết lập sidebar
    setupSidebar();
    
    // Thiết lập các sự kiện
    setupEventListeners();
    
    // Khởi tạo hiệu ứng AOS
    AOS.init({
        duration: 800,
        easing: 'ease-in-out'
    });
};

// Khởi tạo khi DOM đã sẵn sàng
document.addEventListener('DOMContentLoaded', init); 