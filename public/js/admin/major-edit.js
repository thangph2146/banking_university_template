/**
 * Mô-đun xử lý chỉnh sửa thông tin ngành đào tạo
 * Sử dụng phong cách lập trình hàm (functional programming)
 * @module major-edit
 */
(function() {
    'use strict';

    // ======== Constants & State ========
    const API_BASE_URL = '/api/majors';
    let originalCourseData = null;
    let currentMajorId = null;

    // ======== Mock Data ========
    const mockMajors = [
        {
            ID_Nganh: 1,
            MaNganh: 'CNTT',
            TenNganh: 'Công nghệ thông tin',
            MoTa: 'Ngành học về khoa học máy tính, phát triển phần mềm và hệ thống thông tin.',
            ID_PhongKhoa: 1,
            TenPhongKhoa: 'Khoa Công nghệ thông tin',
            TrangThai: 1
        },
        {
            ID_Nganh: 2,
            MaNganh: 'KTPM',
            TenNganh: 'Kỹ thuật phần mềm',
            MoTa: 'Ngành học về quy trình phát triển, kiểm thử và bảo trì phần mềm.',
            ID_PhongKhoa: 1,
            TenPhongKhoa: 'Khoa Công nghệ thông tin',
            TrangThai: 1
        },
        {
            ID_Nganh: 3,
            MaNganh: 'KHMT',
            TenNganh: 'Khoa học máy tính',
            MoTa: 'Ngành học về lý thuyết máy tính, thuật toán và trí tuệ nhân tạo.',
            ID_PhongKhoa: 1,
            TenPhongKhoa: 'Khoa Công nghệ thông tin',
            TrangThai: 1
        },
        {
            ID_Nganh: 4,
            MaNganh: 'HTTT',
            TenNganh: 'Hệ thống thông tin',
            MoTa: 'Ngành học về thiết kế, triển khai và quản lý hệ thống thông tin trong tổ chức.',
            ID_PhongKhoa: 1,
            TenPhongKhoa: 'Khoa Công nghệ thông tin',
            TrangThai: 0
        },
        {
            ID_Nganh: 5,
            MaNganh: 'MMT',
            TenNganh: 'Mạng máy tính và truyền thông',
            MoTa: 'Ngành học về thiết kế, triển khai và bảo mật hệ thống mạng máy tính.',
            ID_PhongKhoa: 1,
            TenPhongKhoa: 'Khoa Công nghệ thông tin',
            TrangThai: 1
        },
        {
            ID_Nganh: 6,
            MaNganh: 'QTKD',
            TenNganh: 'Quản trị kinh doanh',
            MoTa: 'Ngành học về quản lý doanh nghiệp, chiến lược kinh doanh và ra quyết định.',
            ID_PhongKhoa: 2,
            TenPhongKhoa: 'Khoa Kinh tế',
            TrangThai: 1
        },
        {
            ID_Nganh: 7,
            MaNganh: 'KTDT',
            TenNganh: 'Kinh tế đối ngoại',
            MoTa: 'Ngành học về kinh tế quốc tế, thương mại toàn cầu và quan hệ kinh tế đối ngoại.',
            ID_PhongKhoa: 2,
            TenPhongKhoa: 'Khoa Kinh tế',
            TrangThai: 1
        }
    ];

    const mockDepartments = [
        {
            ID_PhongKhoa: 1,
            TenPhongKhoa: 'Khoa Công nghệ thông tin',
            DiaChi: 'Tòa nhà A, Lầu 5',
            Email: 'cntt@hub.edu.vn',
            SoDienThoai: '028.1234567',
            TrangThai: 1
        },
        {
            ID_PhongKhoa: 2,
            TenPhongKhoa: 'Khoa Kinh tế',
            DiaChi: 'Tòa nhà B, Lầu 3',
            Email: 'kinhte@hub.edu.vn',
            SoDienThoai: '028.7654321',
            TrangThai: 1
        },
        {
            ID_PhongKhoa: 3,
            TenPhongKhoa: 'Khoa Ngoại ngữ',
            DiaChi: 'Tòa nhà C, Lầu 2',
            Email: 'ngoaingu@hub.edu.vn',
            SoDienThoai: '028.9876543',
            TrangThai: 1
        },
        {
            ID_PhongKhoa: 4,
            TenPhongKhoa: 'Khoa Kỹ thuật',
            DiaChi: 'Tòa nhà D, Lầu 4',
            Email: 'kythuat@hub.edu.vn',
            SoDienThoai: '028.3456789',
            TrangThai: 1
        },
        {
            ID_PhongKhoa: 5,
            TenPhongKhoa: 'Khoa Luật',
            DiaChi: 'Tòa nhà E, Lầu 1',
            Email: 'luat@hub.edu.vn',
            SoDienThoai: '028.5678901',
            TrangThai: 0
        }
    ];

    // ======== DOM Elements ========
    const domElements = {
        // UI Components
        loadingIndicator: document.getElementById('loading-indicator'),
        errorContainer: document.getElementById('error-container'),
        errorMessage: document.getElementById('error-message'),
        formErrorAlert: document.getElementById('form-error-alert'),
        formErrorMessage: document.getElementById('form-error-message'),
        formContainer: document.getElementById('form-container'),
        
        // Form elements
        editForm: document.getElementById('major-edit-form'),
        tenNganhInput: document.getElementById('ten_nganh'),
        tenNganhError: document.getElementById('ten_nganh-error'),
        maNganhInput: document.getElementById('ma_nganh'),
        maNganhError: document.getElementById('ma_nganh-error'),
        phongKhoaSelect: document.getElementById('phong_khoa_id'),
        phongKhoaError: document.getElementById('phong_khoa_id-error'),
        statusSelect: document.getElementById('status'),
        
        // User menu components
        userMenuButton: document.getElementById('user-menu-button'),
        userMenu: document.getElementById('user-menu'),
        
        // Sidebar components
        sidebarOpen: document.getElementById('sidebar-open'),
        sidebarClose: document.getElementById('sidebar-close'),
        sidebar: document.getElementById('sidebar'),
        sidebarBackdrop: document.getElementById('sidebar-backdrop')
    };

    // ======== Helper Functions ========
    /**
     * Lấy ID ngành đào tạo từ tham số URL
     * @returns {number|null} ID ngành đào tạo hoặc null nếu không tìm thấy
     */
    const getMajorIdFromUrl = () => {
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');
        return id ? parseInt(id) : null;
    };

    /**
     * Điều khiển hiển thị trạng thái loading
     * @param {boolean} show - Trạng thái hiển thị loading
     */
    const toggleLoading = (show) => {
        if (!domElements.loadingIndicator) return;
        
        if (show) {
            domElements.loadingIndicator.classList.remove('hidden');
            if (domElements.formContainer) domElements.formContainer.classList.add('hidden');
            if (domElements.errorContainer) domElements.errorContainer.classList.add('hidden');
        } else {
            domElements.loadingIndicator.classList.add('hidden');
        }
    };

    /**
     * Hiển thị thông báo lỗi
     * @param {string} message - Nội dung thông báo lỗi
     */
    const showError = (message) => {
        if (!domElements.errorContainer || !domElements.errorMessage) return;
        
        domElements.errorMessage.textContent = message || 'Có lỗi xảy ra khi tải thông tin ngành đào tạo.';
        domElements.errorContainer.classList.remove('hidden');
        
        if (domElements.formContainer) {
            domElements.formContainer.classList.add('hidden');
        }
    };

    /**
     * Hiển thị lỗi form
     * @param {string} message - Nội dung thông báo lỗi
     */
    const showFormError = (message) => {
        if (!domElements.formErrorAlert || !domElements.formErrorMessage) return;
        
        domElements.formErrorMessage.textContent = message || 'Có lỗi xảy ra khi lưu thông tin ngành đào tạo.';
        domElements.formErrorAlert.classList.remove('hidden');
        
        // Tự động ẩn sau 5 giây
        setTimeout(() => {
            domElements.formErrorAlert.classList.add('hidden');
        }, 5000);
    };

    /**
     * Hiển thị lỗi cho từng trường
     * @param {HTMLElement} field - Trường input
     * @param {HTMLElement} errorElement - Element hiển thị lỗi
     * @param {string} message - Thông báo lỗi
     */
    const showFieldError = (field, errorElement, message) => {
        if (field && errorElement) {
            field.classList.add('border-red-500');
            errorElement.textContent = message;
            errorElement.classList.remove('hidden');
        }
    };

    /**
     * Xóa lỗi cho từng trường
     * @param {HTMLElement} field - Trường input
     * @param {HTMLElement} errorElement - Element hiển thị lỗi
     */
    const clearFieldError = (field, errorElement) => {
        if (field && errorElement) {
            field.classList.remove('border-red-500');
            errorElement.textContent = '';
            errorElement.classList.add('hidden');
        }
    };

    /**
     * Xóa tất cả lỗi trong form
     */
    const clearAllFieldErrors = () => {
        clearFieldError(domElements.tenNganhInput, domElements.tenNganhError);
        clearFieldError(domElements.maNganhInput, domElements.maNganhError);
        clearFieldError(domElements.phongKhoaSelect, domElements.phongKhoaError);
        
        if (domElements.formErrorAlert) {
            domElements.formErrorAlert.classList.add('hidden');
        }
    };

    /**
     * Điều khiển trạng thái của nút lưu
     * @param {boolean} enable - Bật/tắt nút lưu
     */
    const toggleSubmitButton = (enable = true) => {
        const submitBtn = document.querySelector('button[type="submit"]');
        if (!submitBtn) return;
        
        submitBtn.disabled = !enable;
        
        if (enable) {
            submitBtn.classList.remove('opacity-50', 'cursor-not-allowed');
        } else {
            submitBtn.classList.add('opacity-50', 'cursor-not-allowed');
        }
    };

    /**
     * Tải và hiển thị danh sách phòng khoa vào dropdown
     */
    const loadDepartments = () => {
        const departmentSelect = domElements.phongKhoaSelect;
        if (!departmentSelect) return;
        
        // Xóa các option hiện tại (trừ option mặc định)
        while (departmentSelect.options.length > 1) {
            departmentSelect.remove(1);
        }
        
        // Chỉ hiển thị các phòng khoa đang hoạt động
        const activeDepartments = mockDepartments.filter(dept => dept.TrangThai === 1);
        
        // Thêm các option mới
        activeDepartments.forEach(dept => {
            const option = document.createElement('option');
            option.value = dept.ID_PhongKhoa;
            option.textContent = dept.TenPhongKhoa;
            departmentSelect.appendChild(option);
        });
    };

    /**
     * Lấy thông tin chi tiết ngành đào tạo từ API/mock data
     * @throws {Error} Nếu có lỗi khi tải dữ liệu
     */
    const fetchMajorDetails = () => {
        toggleLoading(true);
        
        // Lấy ID từ URL
        currentMajorId = getMajorIdFromUrl();
        
        if (!currentMajorId) {
            toggleLoading(false);
            showError('Không tìm thấy ID ngành đào tạo trong URL.');
            return;
        }
        
        // Cập nhật URL quay lại chi tiết
        updateNavigationLinks(currentMajorId);
        
        // Mô phỏng API call với Promise để xử lý lỗi tốt hơn
        new Promise((resolve, reject) => {
            setTimeout(() => {
                try {
                    // Tìm ngành đào tạo trong mock data
                    const major = mockMajors.find(m => m.ID_Nganh === currentMajorId);
                    
                    if (major) {
                        resolve(major);
                    } else {
                        reject(new Error(`Không tìm thấy ngành đào tạo với ID: ${currentMajorId}`));
                    }
                } catch (error) {
                    reject(error);
                }
            }, 800); // Giả lập độ trễ API
        })
        .then(major => {
            originalCourseData = { ...major };
            loadDepartments();
            populateForm(major);
            toggleLoading(false);
            domElements.formContainer.classList.remove('hidden');
        })
        .catch(error => {
            console.error('Error fetching major details:', error);
            toggleLoading(false);
            showError(error.message || 'Có lỗi xảy ra khi tải thông tin ngành đào tạo.');
        });
    };

    /**
     * Cập nhật các liên kết điều hướng
     * @param {number} majorId - ID ngành đào tạo
     */
    const updateNavigationLinks = (majorId) => {
        // Không cần cập nhật liên kết quay lại chi tiết vì không có trong template
        console.log(`Cập nhật liên kết với ID: ${majorId}`);
    };

    /**
     * Cập nhật thông tin ngành đào tạo
     * @param {Object} majorData - Dữ liệu ngành đào tạo cần cập nhật
     */
    const updateMajor = (majorData) => {
        toggleSubmitButton(false);
        
        // Mô phỏng API call với Promise
        new Promise((resolve, reject) => {
            setTimeout(() => {
                try {
                    // Tìm index của ngành đào tạo trong mock data
                    const majorIndex = mockMajors.findIndex(m => m.ID_Nganh === parseInt(majorData.ID_Nganh));
                    
                    if (majorIndex === -1) {
                        reject(new Error('Không tìm thấy ngành đào tạo để cập nhật.'));
                        return;
                    }
                    
                    // Kiểm tra mã ngành đã tồn tại chưa (loại trừ ngành hiện tại)
                    const duplicateMajor = mockMajors.find(m => 
                        m.MaNganh === majorData.MaNganh && 
                        m.ID_Nganh !== parseInt(majorData.ID_Nganh)
                    );
                    
                    if (duplicateMajor) {
                        reject(new Error(`Mã ngành "${majorData.MaNganh}" đã tồn tại trong hệ thống.`));
                        return;
                    }
                    
                    // Lấy thông tin phòng khoa
                    const department = mockDepartments.find(d => d.ID_PhongKhoa === parseInt(majorData.ID_PhongKhoa));
                    
                    // Cập nhật dữ liệu
                    const updatedMajor = {
                        ...mockMajors[majorIndex],
                        ...majorData,
                        TenPhongKhoa: department ? department.TenPhongKhoa : ''
                    };
                    
                    mockMajors[majorIndex] = updatedMajor;
                    resolve(updatedMajor);
                } catch (error) {
                    reject(error);
                }
            }, 800); // Giả lập độ trễ API
        })
        .then(updatedMajor => {
            // Hiển thị thông báo thành công
            showToast('success', 'Cập nhật ngành đào tạo thành công!');
            
            // Cập nhật dữ liệu gốc
            originalCourseData = { ...updatedMajor };
            
            // Chuyển hướng về trang chi tiết sau 1.5 giây
            setTimeout(() => {
                window.location.href = `major-detail.html?id=${updatedMajor.ID_Nganh}`;
            }, 1500);
        })
        .catch(error => {
            console.error('Error updating major:', error);
            showToast('error', error.message || 'Có lỗi xảy ra khi cập nhật ngành đào tạo.');
            toggleSubmitButton(true);
        });
    };

    /**
     * Điền thông tin ngành đào tạo vào form
     * @param {Object} major - Đối tượng chứa thông tin ngành đào tạo
     */
    const populateForm = (major) => {
        if (!major) return;
        
        const { tenNganhInput, maNganhInput, phongKhoaSelect, statusSelect } = domElements;
        
        // Điền thông tin vào các trường nếu tồn tại
        if (tenNganhInput) tenNganhInput.value = major.TenNganh;
        if (maNganhInput) maNganhInput.value = major.MaNganh;
        if (phongKhoaSelect) phongKhoaSelect.value = major.ID_PhongKhoa;
        if (statusSelect) statusSelect.value = major.TrangThai;
    };

    /**
     * Lấy dữ liệu từ form
     * @returns {Object} Đối tượng chứa dữ liệu form
     */
    const getFormData = () => {
        const { tenNganhInput, maNganhInput, phongKhoaSelect, statusSelect } = domElements;
        
        return {
            ID_Nganh: currentMajorId,
            TenNganh: tenNganhInput.value.trim(),
            MaNganh: maNganhInput.value.trim(),
            ID_PhongKhoa: parseInt(phongKhoaSelect.value),
            TrangThai: parseInt(statusSelect.value),
            MoTa: null
        };
    };

    /**
     * Hiển thị thông báo toast
     * @param {string} type - Loại thông báo: 'success', 'error', 'warning', 'info'
     * @param {string} message - Nội dung thông báo
     * @param {number} duration - Thời gian hiển thị (ms)
     */
    const showToast = (type, message, duration = 3000) => {
        const toastContainer = document.getElementById('toast-container');
        if (!toastContainer) return;
        
        const icons = {
            success: 'ri-check-line',
            error: 'ri-error-warning-line',
            warning: 'ri-alert-line',
            info: 'ri-information-line'
        };
        
        // Tạo element toast
        const toast = document.createElement('div');
        toast.classList.add('toast', 'fade', 'show', `bg-${type}`);
        toast.setAttribute('role', 'alert');
        toast.setAttribute('aria-live', 'assertive');
        toast.setAttribute('aria-atomic', 'true');
        
        // Nội dung toast
        const toastContent = `
            <div class="toast-header bg-${type} text-white">
                <i class="${icons[type]} me-2"></i>
                <strong class="me-auto">Thông báo</strong>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
            <div class="toast-body text-white">
                ${message}
            </div>
        `;
        
        toast.innerHTML = toastContent;
        toastContainer.appendChild(toast);
        
        // Thiết lập timeout để ẩn toast
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                toastContainer.removeChild(toast);
            }, 300);
        }, duration);
    };

    /**
     * Xác thực dữ liệu form
     * @returns {boolean} Kết quả xác thực - true nếu hợp lệ, false nếu không hợp lệ
     */
    const validateForm = () => {
        const { maNganhInput, tenNganhInput, phongKhoaSelect } = domElements;
        const { maNganhError, tenNganhError, phongKhoaError } = domElements;
        
        // Kiểm tra mã ngành
        if (!maNganhInput.value.trim()) {
            showFieldError(maNganhInput, maNganhError, 'Vui lòng nhập mã ngành đào tạo.');
            maNganhInput.focus();
            return false;
        }
        
        // Kiểm tra tên ngành
        if (!tenNganhInput.value.trim()) {
            showFieldError(tenNganhInput, tenNganhError, 'Vui lòng nhập tên ngành đào tạo.');
            tenNganhInput.focus();
            return false;
        }
        
        // Kiểm tra phòng khoa
        if (!phongKhoaSelect.value) {
            showFieldError(phongKhoaSelect, phongKhoaError, 'Vui lòng chọn phòng khoa.');
            phongKhoaSelect.focus();
            return false;
        }
        
        return true;
    };

    /**
     * Xử lý sự kiện submit form
     * @param {Event} event - Sự kiện submit
     */
    const handleFormSubmit = (event) => {
        event.preventDefault();
        
        // Xóa các thông báo lỗi cũ
        clearAllFieldErrors();
        
        // Xác thực form trước khi xử lý
        if (!validateForm()) {
            return;
        }
        
        const formData = getFormData();
        updateMajor(formData);
    };

    /**
     * Thiết lập menu người dùng và xử lý sự kiện
     */
    const setupUserMenu = () => {
        const { userMenuButton, userMenu } = domElements;
        const userMenuContainer = document.getElementById('user-menu-container');
        
        if (!userMenuContainer || !userMenuButton || !userMenu) return;
        
        // Xử lý click vào nút menu người dùng
        userMenuButton.addEventListener('click', () => {
            userMenu.classList.toggle('opacity-0');
            userMenu.classList.toggle('invisible');
            userMenu.classList.toggle('scale-95');
            userMenu.classList.toggle('scale-100');
        });
        
        // Đóng menu khi click ra ngoài
        document.addEventListener('click', (event) => {
            if (userMenuContainer.contains(event.target)) return;
            userMenu.classList.add('opacity-0', 'invisible', 'scale-95');
            userMenu.classList.remove('scale-100');
        });
    };

    /**
     * Thiết lập sidebar và xử lý sự kiện
     */
    const setupSidebar = () => {
        const { sidebarOpen, sidebar, sidebarBackdrop, sidebarClose } = domElements;
        
        if (!sidebarOpen || !sidebar || !sidebarBackdrop) return;
        
        // Xử lý mở sidebar
        sidebarOpen.addEventListener('click', () => {
            sidebar.classList.remove('-translate-x-full');
            sidebarBackdrop.classList.remove('hidden');
        });
        
        // Hàm đóng sidebar
        const closeSidebar = () => {
            sidebar.classList.add('-translate-x-full');
            sidebarBackdrop.classList.add('hidden');
        };
        
        // Xử lý đóng sidebar khi click vào nút đóng
        if (sidebarClose) {
            sidebarClose.addEventListener('click', closeSidebar);
        }
        
        // Xử lý đóng sidebar khi click vào backdrop
        sidebarBackdrop.addEventListener('click', closeSidebar);
    };

    /**
     * Thiết lập các sự kiện cho các phần tử trong trang
     */
    const setupEventListeners = () => {
        // Xử lý sự kiện submit form
        if (domElements.editForm) {
            domElements.editForm.addEventListener('submit', handleFormSubmit);
        }
    };

    /**
     * Khởi tạo trang
     */
    const initPage = () => {
        // Thiết lập các thành phần UI
        setupUserMenu();
        setupSidebar();
        setupEventListeners();
        
        // Tải dữ liệu ngành đào tạo
        fetchMajorDetails();
        
        // Khởi tạo hiệu ứng AOS nếu có
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 800,
                easing: 'ease-in-out'
            });
        }
    };

    // Khởi chạy khi DOM đã sẵn sàng
    document.addEventListener('DOMContentLoaded', initPage);
})(); 