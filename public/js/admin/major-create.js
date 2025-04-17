(function() {
    'use strict';

    // Constants
    const API_BASE_URL = '/api/majors';

    // Đối tượng DOM
    const $elements = {
        // Form elements
        majorForm: document.getElementById('major-create-form'),
        tenNganhInput: document.getElementById('ten_nganh'),
        maNganhInput: document.getElementById('ma_nganh'),
        phongKhoaSelect: document.getElementById('phong_khoa_id'),
        statusSelect: document.getElementById('status'),
        
        // Error elements
        formErrorAlert: document.getElementById('form-error-alert'),
        formErrorMessage: document.getElementById('form-error-message'),
        tenNganhError: document.getElementById('ten_nganh-error'),
        maNganhError: document.getElementById('ma_nganh-error'),
        phongKhoaError: document.getElementById('phong_khoa_id-error'),
        
        // Sidebar elements
        sidebar: document.getElementById('sidebar'),
        sidebarOpen: document.getElementById('sidebar-open'),
        sidebarClose: document.getElementById('sidebar-close'),
        sidebarBackdrop: document.getElementById('sidebar-backdrop')
    };
    
    // Data mẫu cho phòng khoa
    const departmentsMockData = [
        { phong_khoa_id: 1, ten_phong_khoa: 'Khoa Công nghệ thông tin', ma_phong_khoa: 'CNTT', status: 1 },
        { phong_khoa_id: 2, ten_phong_khoa: 'Khoa Kế toán - Quản trị', ma_phong_khoa: 'KTQT', status: 1 },
        { phong_khoa_id: 3, ten_phong_khoa: 'Khoa Ngôn ngữ học', ma_phong_khoa: 'NNH', status: 1 },
        { phong_khoa_id: 4, ten_phong_khoa: 'Khoa Tài chính - Ngân hàng', ma_phong_khoa: 'TCNH', status: 1 }
    ];
    
    /**
     * Hiển thị thông báo lỗi
     * @param {string} message - Thông báo lỗi
     */
    const showFormError = (message) => {
        if ($elements.formErrorAlert && $elements.formErrorMessage) {
            $elements.formErrorMessage.textContent = message;
            $elements.formErrorAlert.classList.remove('hidden');
            
            // Tự động ẩn sau 5 giây
            setTimeout(() => {
                $elements.formErrorAlert.classList.add('hidden');
            }, 5000);
        }
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
        clearFieldError($elements.tenNganhInput, $elements.tenNganhError);
        clearFieldError($elements.maNganhInput, $elements.maNganhError);
        clearFieldError($elements.phongKhoaSelect, $elements.phongKhoaError);
        
        if ($elements.formErrorAlert) {
            $elements.formErrorAlert.classList.add('hidden');
        }
    };
    
    /**
     * Kiểm tra form trước khi gửi
     * @returns {boolean} - Kết quả kiểm tra
     */
    const validateForm = () => {
        let isValid = true;
        clearAllFieldErrors();
        
        // Kiểm tra tên ngành
        if (!$elements.tenNganhInput.value.trim()) {
            showFieldError(
                $elements.tenNganhInput, 
                $elements.tenNganhError, 
                'Vui lòng nhập tên ngành đào tạo'
            );
            isValid = false;
        }
        
        // Kiểm tra mã ngành
        const maNganhValue = $elements.maNganhInput.value.trim();
        if (!maNganhValue) {
            showFieldError(
                $elements.maNganhInput, 
                $elements.maNganhError, 
                'Vui lòng nhập mã ngành'
            );
            isValid = false;
        } else if (!/^\d{7}$/.test(maNganhValue)) {
            showFieldError(
                $elements.maNganhInput, 
                $elements.maNganhError, 
                'Mã ngành phải có đúng 7 chữ số'
            );
            isValid = false;
        }
        
        // Kiểm tra phòng khoa
        if (!$elements.phongKhoaSelect.value) {
            showFieldError(
                $elements.phongKhoaSelect, 
                $elements.phongKhoaError, 
                'Vui lòng chọn phòng/khoa'
            );
            isValid = false;
        }
        
        return isValid;
    };
    
    /**
     * Kiểm tra mã ngành có tồn tại hay không
     * @param {string} maNganh - Mã ngành cần kiểm tra
     * @returns {Promise<boolean>} - Kết quả kiểm tra
     */
    const checkMaNganhExists = async (maNganh) => {
        try {
            // TODO: Thay thế bằng API call thực tế
            console.log(`Checking if mã ngành exists: ${maNganh}`);
            
            // Giả lập delay khi gọi API
            await new Promise(resolve => setTimeout(resolve, 300));
            
            // Mã ngành mẫu đã tồn tại để test
            const existingMaNganh = ['7480201', '7340201', '7340301'];
            
            return existingMaNganh.includes(maNganh);
        } catch (error) {
            console.error('Error checking ma_nganh:', error);
            return false;
        }
    };
    
    /**
     * Gửi form tạo mới ngành đào tạo
     * @param {object} formData - Dữ liệu form
     * @returns {Promise<object>} - Kết quả từ API
     */
    const submitMajorForm = async (formData) => {
        try {
            // TODO: Thay thế bằng API call thực tế
            console.log('Submitting form data:', formData);
            
            // Giả lập delay khi gọi API
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Giả lập phản hồi thành công
            return {
                success: true,
                data: {
                    nganh_id: Math.floor(Math.random() * 1000),
                    ...formData,
                    created_at: new Date().toISOString()
                },
                message: 'Tạo ngành đào tạo mới thành công!'
            };
        } catch (error) {
            console.error('Error submitting form:', error);
            throw new Error('Có lỗi xảy ra khi tạo ngành đào tạo mới. Vui lòng thử lại sau.');
        }
    };
    
    /**
     * Lấy dữ liệu phòng khoa cho dropdown
     * @returns {Promise<Array>} - Danh sách phòng khoa
     */
    const fetchDepartments = async () => {
        try {
            // TODO: Thay thế bằng API call thực tế
            console.log('Fetching departments');
            
            // Giả lập delay khi gọi API
            await new Promise(resolve => setTimeout(resolve, 300));
            
            return departmentsMockData;
        } catch (error) {
            console.error('Error fetching departments:', error);
            showFormError('Không thể tải danh sách phòng/khoa. Vui lòng thử lại sau.');
            return [];
        }
    };
    
    /**
     * Điền dữ liệu phòng khoa vào dropdown
     */
    const populateDepartments = async () => {
        try {
            const departments = await fetchDepartments();
            
            if ($elements.phongKhoaSelect && departments.length > 0) {
                // Xóa options cũ (giữ lại option đầu tiên)
                while ($elements.phongKhoaSelect.options.length > 1) {
                    $elements.phongKhoaSelect.remove(1);
                }
                
                // Thêm options mới
                departments.forEach(dept => {
                    const option = document.createElement('option');
                    option.value = dept.phong_khoa_id;
                    option.textContent = dept.ten_phong_khoa;
                    $elements.phongKhoaSelect.appendChild(option);
                });
            }
        } catch (error) {
            console.error('Error populating departments:', error);
        }
    };
    
    /**
     * Hiển thị thông báo
     * @param {string} type - Loại thông báo (success, error, warning, info)
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
     * Đóng thông báo
     * @param {HTMLElement} toast - Element thông báo
     */
    const closeToast = (toast) => {
        toast.classList.add('animate-fade-out-down');
        
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    };

    /**
     * Xử lý sự kiện submit form
     * @param {Event} e - Sự kiện
     */
    const handleFormSubmit = (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        // Lấy dữ liệu từ form
        const formData = {
            ten_nganh: $elements.tenNganhInput.value.trim(),
            ma_nganh: $elements.maNganhInput.value.trim(),
            phong_khoa_id: parseInt($elements.phongKhoaSelect.value),
            status: parseInt($elements.statusSelect.value)
        };
        
        // Gọi API tạo ngành
        submitMajorForm(formData)
            .then(response => {
                if (response.success) {
                    // Hiển thị thông báo thành công
                    showToast('success', response.message);
                    
                    // Chuyển hướng về trang danh sách
                    setTimeout(() => {
                        window.location.href = '/admin/majors';
                    }, 1500);
                }
            })
            .catch(error => {
                showToast('error', error.message || 'Có lỗi xảy ra khi tạo ngành đào tạo mới.');
            });
    };

    // Setup User Menu
    /**
     * Thiết lập menu người dùng
     */
    const setupUserMenu = () => {
        const userMenuContainer = document.getElementById('user-menu-container');
        const userMenuButton = document.getElementById('user-menu-button');
        const userMenu = document.getElementById('user-menu');
        
        if (userMenuContainer && userMenuButton && userMenu) {
            // Không cần toggle khi hover vì đã xử lý bằng CSS
            // Nhưng cần xử lý cho mobile
            userMenuButton.addEventListener('click', () => {
                userMenu.classList.toggle('opacity-0');
                userMenu.classList.toggle('invisible');
                userMenu.classList.toggle('scale-95');
                userMenu.classList.toggle('scale-100');
            });
            
            // Đóng menu khi click ra ngoài
            document.addEventListener('click', (e) => {
                if (userMenuContainer.contains(e.target)) return;
                userMenu.classList.add('opacity-0', 'invisible', 'scale-95');
                userMenu.classList.remove('scale-100');
            });
        }
    };

    // Setup Sidebar
    /**
     * Thiết lập sidebar
     */
    const setupSidebar = () => {
        if ($elements.sidebarOpen && $elements.sidebar && $elements.sidebarBackdrop) {
            $elements.sidebarOpen.addEventListener('click', () => {
                $elements.sidebar.classList.remove('-translate-x-full');
                $elements.sidebarBackdrop.classList.remove('hidden');
            });
            
            const closeSidebar = () => {
                $elements.sidebar.classList.add('-translate-x-full');
                $elements.sidebarBackdrop.classList.add('hidden');
            };
            
            if ($elements.sidebarClose) {
                $elements.sidebarClose.addEventListener('click', closeSidebar);
            }
            
            $elements.sidebarBackdrop.addEventListener('click', closeSidebar);
        }
    };

    // Setup Event Listeners
    /**
     * Thiết lập các sự kiện
     */
    const setupEventListeners = () => {
        // Form submit
        if ($elements.majorForm) {
            $elements.majorForm.addEventListener('submit', handleFormSubmit);
        }
        
        // Cancel button
        if ($elements.cancelBtn) {
            $elements.cancelBtn.addEventListener('click', () => {
                window.location.href = 'majors.html';
            });
        }
        
        // Reset button
        if ($elements.resetBtn) {
            $elements.resetBtn.addEventListener('click', () => {
                // Đặt mặc định cho trạng thái
                if ($elements.statusSelect) {
                    $elements.statusSelect.value = '1';
                }
            });
        }
    };

    // Initialize
    /**
     * Khởi tạo
     */
    const init = () => {
        // Tải danh sách phòng khoa
        populateDepartments();
        
        // Khởi tạo components
        setupUserMenu();
        setupSidebar();
        setupEventListeners();
        
        // Khởi tạo AOS animation
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 800,
                easing: 'ease-in-out'
            });
        }
    };

    // On DOM ready
    document.addEventListener('DOMContentLoaded', init);
})(); 