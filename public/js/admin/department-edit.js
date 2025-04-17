/**
 * Quản lý chỉnh sửa phòng khoa
 * 
 * File này xử lý các chức năng liên quan đến chỉnh sửa phòng khoa:
 * - Lấy thông tin phòng khoa từ ID trong URL
 * - Hiển thị thông tin lên form
 * - Xác thực dữ liệu nhập vào
 * - Cập nhật thông tin phòng khoa
 * - Hiển thị thông báo thành công/lỗi
 * 
 * Dữ liệu được cập nhật vào departmentsMockData và localStorage
 */

/**
 * department-edit.js - Xử lý chức năng chỉnh sửa Phòng khoa
 * Sử dụng phong cách lập trình hàm (functional programming)
 * Phạm vi: Trang chỉnh sửa phòng khoa (department-edit.html)
 */

// Khởi tạo AOS
AOS.init();

// Biến chứa thông tin phòng khoa đang được chỉnh sửa
let currentDepartment = null;

// Các phần tử DOM
const domElements = {
    // Form và các trường nhập liệu
    form: document.getElementById('department-edit-form'),
    tenPhongKhoa: document.getElementById('ten_phong_khoa'),
    maPhongKhoa: document.getElementById('ma_phong_khoa'),
    ghiChu: document.getElementById('ghi_chu'),
    status: document.getElementById('status'),
    
    // Thông báo lỗi
    formError: document.getElementById('form-error-alert'),
    formErrorMessage: document.getElementById('form-error-message'),
    tenPhongKhoaError: document.getElementById('ten_phong_khoa-error'),
    maPhongKhoaError: document.getElementById('ma_phong_khoa-error'),
    
    // Containers
    loadingIndicator: document.getElementById('loading-indicator'),
    errorContainer: document.getElementById('error-container'),
    errorMessage: document.getElementById('error-message'),
    formContainer: document.getElementById('form-container'),
    
    // Sidebar
    sidebar: document.getElementById('sidebar'),
    sidebarOpen: document.getElementById('sidebar-open'),
    sidebarClose: document.getElementById('sidebar-close'),
    sidebarBackdrop: document.getElementById('sidebar-backdrop')
};

/**
 * Lấy ID phòng khoa từ tham số URL
 * @returns {number|null} ID phòng khoa hoặc null nếu không tìm thấy
 */
const getDepartmentIdFromUrl = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    return id ? parseInt(id) : null;
};

/**
 * Tải thông tin phòng khoa
 */
const fetchDepartmentData = async () => {
    try {
        // Hiển thị loading
        toggleLoading(true);
        
        // Lấy ID từ URL
        const departmentId = getDepartmentIdFromUrl();
        
        if (!departmentId) {
            throw new Error('ID phòng khoa không hợp lệ');
        }
        
        // Giả lập delay khi gọi API
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Lấy dữ liệu phòng khoa từ window.departmentsMockData
        const departmentData = window.departmentsMockData.find(
            dept => dept.phong_khoa_id === departmentId
        );
        
        if (!departmentData) {
            throw new Error('Không tìm thấy thông tin phòng khoa');
        }
        
        // Lưu thông tin phòng khoa hiện tại
        currentDepartment = departmentData;
        
        // Fill form với dữ liệu
        fillFormData(departmentData);
        
        // Cập nhật tiêu đề trang
        document.title = `Chỉnh sửa phòng khoa ${departmentData.ten_phong_khoa} - HUB Admin`;
        
        // Ẩn loading
        toggleLoading(false);
    } catch (error) {
        console.error('Lỗi khi tải thông tin phòng khoa:', error);
        showError(error.message || 'Có lỗi xảy ra khi tải dữ liệu phòng khoa.');
    }
};

/**
 * Hiển thị/ẩn trạng thái loading
 * @param {boolean} isLoading - Trạng thái loading
 */
const toggleLoading = (isLoading) => {
    if (domElements.loadingIndicator) {
        domElements.loadingIndicator.classList.toggle('hidden', !isLoading);
    }
    
    if (domElements.formContainer) {
        domElements.formContainer.classList.toggle('hidden', isLoading);
    }
    
    if (domElements.errorContainer) {
        domElements.errorContainer.classList.add('hidden');
    }
};

/**
 * Hiển thị thông báo lỗi
 * @param {string} message - Thông báo lỗi
 */
const showError = (message) => {
    if (domElements.errorContainer && domElements.errorMessage) {
        domElements.errorMessage.textContent = message;
        domElements.errorContainer.classList.remove('hidden');
        
        if (domElements.loadingIndicator) {
            domElements.loadingIndicator.classList.add('hidden');
        }
        
        if (domElements.formContainer) {
            domElements.formContainer.classList.add('hidden');
        }
    }
};

/**
 * Điền dữ liệu vào form
 * @param {Object} department - Dữ liệu phòng khoa
 */
const fillFormData = (department) => {
    if (!domElements.form) return;
    
    if (domElements.tenPhongKhoa) {
        domElements.tenPhongKhoa.value = department.ten_phong_khoa || '';
    }
    
    if (domElements.maPhongKhoa) {
        domElements.maPhongKhoa.value = department.ma_phong_khoa || '';
    }
    
    if (domElements.ghiChu) {
        domElements.ghiChu.value = department.ghi_chu || '';
    }
    
    if (domElements.status) {
        domElements.status.value = department.status || '1';
    }
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
    } else if (
        domElements.maPhongKhoa.value.trim().toUpperCase() !== currentDepartment.ma_phong_khoa &&
        checkMaPhongKhoaExists(domElements.maPhongKhoa.value.trim())
    ) {
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
        dept => dept.phong_khoa_id !== currentDepartment.phong_khoa_id &&
               dept.ma_phong_khoa.toLowerCase() === code.toLowerCase()
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
            updated_at: new Date().toISOString().slice(0, 19).replace('T', ' ')
        };
        
        // Cập nhật phòng khoa
        const updatedDepartment = updateDepartment(currentDepartment.phong_khoa_id, formData);
        
        // Hiển thị thông báo thành công
        showToast('success', 'Cập nhật phòng khoa thành công!');
        
        // Chuyển hướng sau 2 giây
        setTimeout(() => {
            window.location.href = 'departments.html';
        }, 2000);
    } catch (error) {
        console.error('Lỗi khi cập nhật phòng khoa:', error);
        showFormError('Có lỗi xảy ra khi cập nhật phòng khoa. Vui lòng thử lại sau.');
    }
};

/**
 * Cập nhật phòng khoa
 * @param {number} id - ID phòng khoa cần cập nhật
 * @param {Object} data - Dữ liệu cập nhật
 * @returns {Object} Phòng khoa sau khi cập nhật
 */
const updateDepartment = (id, data) => {
    if (!id || !data) {
        throw new Error('Thiếu thông tin cần thiết để cập nhật');
    }
    
    // Lấy danh sách phòng khoa
    const departments = window.departmentsMockData || [];
    
    // Tìm vị trí phòng khoa cần cập nhật
    const index = departments.findIndex(dept => dept.phong_khoa_id === id);
    
    if (index === -1) {
        throw new Error('Không tìm thấy phòng khoa cần cập nhật');
    }
    
    // Cập nhật thông tin, giữ lại ID và thời gian tạo
    const updatedDepartment = {
        ...departments[index],
        ...data
    };
    
    // Cập nhật vào danh sách
    departments[index] = updatedDepartment;
    
    // Cập nhật danh sách vào biến toàn cục
    window.departmentsMockData = departments;
    
    // Lưu vào localStorage để thay đổi được lưu giữ giữa các phiên
    try {
        localStorage.setItem('departmentsMockData', JSON.stringify(departments));
    } catch (e) {
        console.warn('Không thể lưu dữ liệu vào localStorage:', e);
    }
    
    return updatedDepartment;
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
            
            // Kiểm tra trùng lặp nếu đã nhập đủ 2 ký tự và khác mã ban đầu
            if (
                domElements.maPhongKhoa.value.length >= 2 && 
                domElements.maPhongKhoa.value !== currentDepartment.ma_phong_khoa
            ) {
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
    
    // Tải dữ liệu phòng khoa
    fetchDepartmentData();
    
    // Khởi tạo hiệu ứng AOS
    AOS.init({
        duration: 800,
        easing: 'ease-in-out'
    });
};

// Khởi tạo khi DOM đã sẵn sàng
document.addEventListener('DOMContentLoaded', init); 