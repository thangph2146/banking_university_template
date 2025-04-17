(function() {
    'use strict';

    // Constants
    const API_BASE_URL = '/api/courses';

    // Mock data
    const coursesMockData = [
        {
            ID_KhoaHoc: 1,
            MaKhoaHoc: 'CS101',
            TenKhoaHoc: 'Nhập môn Lập trình',
            MoTa: 'Khóa học giới thiệu về lập trình cơ bản, các khái niệm về thuật toán và cấu trúc dữ liệu.',
            SoTinChi: 3,
            ID_BacHoc: 1,
            TenBacHoc: 'Đại học',
            TrangThai: 1
        },
        {
            ID_KhoaHoc: 2,
            MaKhoaHoc: 'CS201',
            TenKhoaHoc: 'Cấu trúc dữ liệu và Giải thuật',
            MoTa: 'Khóa học nâng cao về các cấu trúc dữ liệu và thuật toán phổ biến.',
            SoTinChi: 4,
            ID_BacHoc: 1,
            TenBacHoc: 'Đại học',
            TrangThai: 1
        },
        {
            ID_KhoaHoc: 3,
            MaKhoaHoc: 'CS301',
            TenKhoaHoc: 'Trí tuệ nhân tạo',
            MoTa: 'Giới thiệu về AI, machine learning và deep learning.',
            SoTinChi: 4,
            ID_BacHoc: 2,
            TenBacHoc: 'Cao học',
            TrangThai: 1
        },
        {
            ID_KhoaHoc: 4,
            MaKhoaHoc: 'CS401',
            TenKhoaHoc: 'Phát triển ứng dụng Web',
            MoTa: 'Xây dựng ứng dụng web với các công nghệ hiện đại.',
            SoTinChi: 3,
            ID_BacHoc: 1,
            TenBacHoc: 'Đại học',
            TrangThai: 0
        },
        {
            ID_KhoaHoc: 5,
            MaKhoaHoc: 'CS501',
            TenKhoaHoc: 'Bảo mật thông tin',
            MoTa: 'Các nguyên tắc và kỹ thuật bảo mật trong hệ thống thông tin.',
            SoTinChi: 3,
            ID_BacHoc: 2,
            TenBacHoc: 'Cao học',
            TrangThai: 1
        }
    ];

    // Cache DOM Elements
    const elements = {
        createForm: document.getElementById('create-course-form'),
        
        // Form fields
        courseName: document.getElementById('course-name'),
        courseCode: document.getElementById('course-code'),
        courseCredits: document.getElementById('course-credits'),
        courseLevel: document.getElementById('course-level'),
        courseStatus: document.getElementById('course-status'),
        courseDescription: document.getElementById('course-description'),
        
        // Buttons
        submitBtn: document.getElementById('submit-btn'),
        cancelBtn: document.getElementById('cancel-btn'),
        resetBtn: document.getElementById('reset-btn'),
        
        // User menu
        userMenuButton: document.getElementById('user-menu-button'),
        userMenu: document.getElementById('user-menu'),
        
        // Sidebar
        sidebarOpen: document.getElementById('sidebar-open'),
        sidebarClose: document.getElementById('sidebar-close'),
        sidebar: document.getElementById('sidebar'),
        sidebarBackdrop: document.getElementById('sidebar-backdrop')
    };

    // Helper Functions
    function generateUniqueId() {
        // Tìm ID lớn nhất hiện tại và tăng thêm 1
        const maxId = coursesMockData.reduce((max, course) => Math.max(max, course.ID_KhoaHoc), 0);
        return maxId + 1;
    }

    function enableSubmitButton(enable = true) {
        if (elements.submitBtn) {
            elements.submitBtn.disabled = !enable;
            
            if (enable) {
                elements.submitBtn.classList.remove('opacity-50', 'cursor-not-allowed');
            } else {
                elements.submitBtn.classList.add('opacity-50', 'cursor-not-allowed');
            }
        }
    }

    // API Functions
    function createCourse(courseData) {
        enableSubmitButton(false);
        
        // Mô phỏng call API
        setTimeout(() => {
            try {
                // Kiểm tra mã khóa học đã tồn tại chưa
                const existingCourse = coursesMockData.find(c => c.MaKhoaHoc === courseData.MaKhoaHoc);
                if (existingCourse) {
                    showToast('error', `Mã khóa học "${courseData.MaKhoaHoc}" đã tồn tại trong hệ thống.`);
                    enableSubmitButton(true);
                    return;
                }
                
                // Thêm ID mới và thêm vào mock data
                const newCourse = {
                    ID_KhoaHoc: generateUniqueId(),
                    ...courseData
                };
                
                // Thêm thông tin bậc học
                if (newCourse.ID_BacHoc === 1) {
                    newCourse.TenBacHoc = 'Đại học';
                } else if (newCourse.ID_BacHoc === 2) {
                    newCourse.TenBacHoc = 'Cao học';
                }
                
                // Thêm vào mock data
                coursesMockData.push(newCourse);
                
                showToast('success', 'Tạo khóa học mới thành công!');
                
                // Chuyển hướng về trang danh sách sau khi tạo thành công
                setTimeout(() => {
                    window.location.href = 'courses.html';
                }, 1500);
            } catch (error) {
                showToast('error', 'Có lỗi xảy ra khi tạo khóa học mới.');
                console.error('Error creating course:', error);
                enableSubmitButton(true);
            }
        }, 800);
    }

    // Form Handling
    function getFormData() {
        return {
            TenKhoaHoc: elements.courseName.value.trim(),
            MaKhoaHoc: elements.courseCode.value.trim(),
            SoTinChi: parseInt(elements.courseCredits.value),
            ID_BacHoc: parseInt(elements.courseLevel.value),
            TrangThai: parseInt(elements.courseStatus.value),
            MoTa: elements.courseDescription.value.trim() || null
        };
    }

    function validateForm() {
        let isValid = true;
        
        // Kiểm tra mã khóa học
        if (!elements.courseCode.value.trim()) {
            showToast('error', 'Vui lòng nhập mã khóa học.');
            elements.courseCode.focus();
            isValid = false;
            return false;
        }
        
        // Kiểm tra tên khóa học
        if (!elements.courseName.value.trim()) {
            showToast('error', 'Vui lòng nhập tên khóa học.');
            elements.courseName.focus();
            isValid = false;
            return false;
        }
        
        // Kiểm tra số tín chỉ
        const credits = parseInt(elements.courseCredits.value);
        if (isNaN(credits) || credits < 1 || credits > 10) {
            showToast('error', 'Số tín chỉ phải là số từ 1-10.');
            elements.courseCredits.focus();
            isValid = false;
            return false;
        }
        
        // Kiểm tra bậc học
        if (!elements.courseLevel.value) {
            showToast('error', 'Vui lòng chọn bậc học.');
            elements.courseLevel.focus();
            isValid = false;
            return false;
        }
        
        return isValid;
    }

    function handleFormSubmit(e) {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        const formData = getFormData();
        createCourse(formData);
    }

    // Toast notifications
    function showToast(type, message, duration = 3000) {
        const toastContainer = document.getElementById('toast-container');
        if (!toastContainer) return;
        
        const toast = document.createElement('div');
        
        let bgColor, iconClass;
        
        switch (type) {
            case 'success':
                bgColor = 'bg-green-500';
                iconClass = 'ri-check-line';
                break;
            case 'error':
                bgColor = 'bg-red-500';
                iconClass = 'ri-error-warning-line';
                break;
            case 'warning':
                bgColor = 'bg-yellow-500';
                iconClass = 'ri-alert-line';
                break;
            default:
                bgColor = 'bg-blue-500';
                iconClass = 'ri-information-line';
        }
        
        toast.classList.add('mb-3', bgColor, 'text-white', 'p-3', 'rounded-lg', 'shadow-md', 'flex', 'items-center', 'animate-fade-in-up');
        toast.style.minWidth = '300px';
        toast.innerHTML = `
            <i class="${iconClass} mr-2 text-lg"></i>
            <span class="flex-1">${message}</span>
            <button class="ml-2 text-white focus:outline-none">
                <i class="ri-close-line"></i>
            </button>
        `;
        
        toastContainer.appendChild(toast);
        
        // Xử lý sự kiện đóng
        const closeButton = toast.querySelector('button');
        closeButton.addEventListener('click', () => {
            closeToast(toast);
        });
        
        // Tự động đóng sau thời gian nhất định
        setTimeout(() => {
            closeToast(toast);
        }, duration);
    }

    function closeToast(toast) {
        toast.classList.add('animate-fade-out-down');
        
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }

    // Setup User Menu
    function setupUserMenu() {
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
    }

    // Setup Sidebar
    function setupSidebar() {
        if (elements.sidebarOpen && elements.sidebar && elements.sidebarBackdrop) {
            elements.sidebarOpen.addEventListener('click', () => {
                elements.sidebar.classList.remove('-translate-x-full');
                elements.sidebarBackdrop.classList.remove('hidden');
            });
            
            const closeSidebar = () => {
                elements.sidebar.classList.add('-translate-x-full');
                elements.sidebarBackdrop.classList.add('hidden');
            };
            
            if (elements.sidebarClose) {
                elements.sidebarClose.addEventListener('click', closeSidebar);
            }
            
            elements.sidebarBackdrop.addEventListener('click', closeSidebar);
        }
    }

    // Setup Event Listeners
    function setupEventListeners() {
        // Form submit
        if (elements.createForm) {
            elements.createForm.addEventListener('submit', handleFormSubmit);
        }
        
        // Cancel button
        if (elements.cancelBtn) {
            elements.cancelBtn.addEventListener('click', () => {
                window.location.href = 'courses.html';
            });
        }
        
        // Reset button
        if (elements.resetBtn) {
            elements.resetBtn.addEventListener('click', () => {
                // Đặt mặc định cho trạng thái
                if (elements.courseStatus) {
                    elements.courseStatus.value = '1';
                }
                
                // Đặt mặc định cho số tín chỉ
                if (elements.courseCredits) {
                    elements.courseCredits.value = '3';
                }
            });
        }
    }

    // Initialize
    function init() {
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
    }

    // On DOM ready
    document.addEventListener('DOMContentLoaded', init);
})(); 