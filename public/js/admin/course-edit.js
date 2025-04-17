/**
 * File: course-edit.js
 * Mô tả: Xử lý chức năng chỉnh sửa khóa học
 * Sử dụng phong cách lập trình hàm (functional programming)
 */

// Khởi tạo module bằng IIFE để tránh ô nhiễm global scope
(function() {
    'use strict';

    // Hằng số và biến trạng thái
    const API_BASE_URL = '/api/courses';
    let originalCourseData = null;
    let courseId = null;

    // Dữ liệu mẫu cho khóa học
    const mockCourses = [
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

    // Cache DOM Elements để tránh truy vấn DOM lặp lại
    const domElements = {
        loadingIndicator: document.getElementById('loading-indicator'),
        errorContainer: document.getElementById('error-container'),
        errorMessage: document.getElementById('error-message'),
        editFormContainer: document.getElementById('edit-form-container'),
        courseEditForm: document.getElementById('course-edit-form'),
        
        // Form fields
        courseId: document.getElementById('course-id'),
        courseName: document.getElementById('course-name'),
        courseCode: document.getElementById('course-code'),
        courseCredits: document.getElementById('course-credits'),
        courseLevel: document.getElementById('course-level'),
        courseStatus: document.getElementById('course-status'),
        courseDescription: document.getElementById('course-description'),
        
        // Error messages
        codeError: document.getElementById('code-error'),
        nameError: document.getElementById('name-error'),
        creditsError: document.getElementById('credits-error'),
        levelError: document.getElementById('level-error'),
        
        // Buttons
        submitButton: document.getElementById('submit-button'),
        cancelButton: document.getElementById('cancel-button'),
        backToDetailBtn: document.getElementById('back-to-detail-btn'),
        retryButton: document.getElementById('retry-button'),
        
        // User menu
        userMenuButton: document.getElementById('user-menu-button'),
        userMenu: document.getElementById('user-menu'),
        
        // Sidebar
        sidebarOpen: document.getElementById('sidebar-open'),
        sidebarClose: document.getElementById('sidebar-close'),
        sidebar: document.getElementById('sidebar'),
        sidebarBackdrop: document.getElementById('sidebar-backdrop')
    };

    /**
     * Lấy ID khóa học từ URL
     * @returns {string|null} ID khóa học hoặc null nếu không tìm thấy
     */
    const getCourseIdFromUrl = () => {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('id');
    };

    /**
     * Hiển thị/ẩn trạng thái đang tải
     * @param {boolean} show - True để hiển thị, False để ẩn
     */
    const toggleLoading = (show) => {
        if (show) {
            domElements.loadingIndicator.classList.remove('hidden');
            domElements.courseEditForm.classList.add('hidden');
            domElements.errorContainer.classList.add('hidden');
        } else {
            domElements.loadingIndicator.classList.add('hidden');
            domElements.courseEditForm.classList.remove('hidden');
        }
    };

    /**
     * Hiển thị thông báo lỗi
     * @param {string} message - Thông báo lỗi cần hiển thị
     */
    const showError = (message) => {
        domElements.errorMessage.textContent = message || 'Có lỗi xảy ra khi tải thông tin khóa học.';
        domElements.errorContainer.classList.remove('hidden');
        domElements.courseEditForm.classList.add('hidden');
        domElements.loadingIndicator.classList.add('hidden');
    };

    /**
     * Bật/tắt nút Submit
     * @param {boolean} enable - True để bật, False để tắt
     */
    const toggleSubmitButton = (enable = true) => {
        if (domElements.submitButton) {
            domElements.submitButton.disabled = !enable;
            
            if (enable) {
                domElements.submitButton.classList.remove('opacity-50', 'cursor-not-allowed');
            } else {
                domElements.submitButton.classList.add('opacity-50', 'cursor-not-allowed');
            }
        }
    };

    /**
     * Ẩn tất cả thông báo lỗi form
     */
    const hideAllFormErrors = () => {
        domElements.codeError.classList.add('hidden');
        domElements.nameError.classList.add('hidden');
        domElements.creditsError.classList.add('hidden');
        domElements.levelError.classList.add('hidden');
    };

    /**
     * Lấy thông tin khóa học từ API
     */
    const fetchCourseDetails = () => {
        toggleLoading(true);
        
        // Mô phỏng call API
        setTimeout(() => {
            try {
                // Tìm khóa học trong mock data
                const course = mockCourses.find(c => c.ID_KhoaHoc === parseInt(courseId));
                
                if (course) {
                    // Tạo bản sao để sử dụng khi reset form
                    originalCourseData = JSON.parse(JSON.stringify(course));
                    
                    // Điền thông tin vào form
                    populateForm(course);
                    
                    // Cập nhật URL trên nút quay lại và breadcrumb
                    updateNavigationLinks(course.ID_KhoaHoc);
                } else {
                    showError('Không tìm thấy thông tin khóa học với ID đã cung cấp.');
                }
            } catch (error) {
                showError('Có lỗi xảy ra khi tải thông tin khóa học.');
                console.error('Error fetching course details:', error);
            } finally {
                toggleLoading(false);
            }
        }, 800);
    };

    /**
     * Cập nhật các đường dẫn điều hướng (back button, breadcrumb)
     * @param {number} courseId - ID khóa học
     */
    const updateNavigationLinks = (courseId) => {
        if (domElements.backToDetailBtn) {
            domElements.backToDetailBtn.href = `course-detail.html?id=${courseId}`;
        }
        
        const courseDetailLink = document.getElementById('course-detail-link');
        if (courseDetailLink) {
            courseDetailLink.href = `course-detail.html?id=${courseId}`;
        }
    };

    /**
     * Cập nhật thông tin khóa học
     * @param {Object} courseData - Dữ liệu khóa học cần cập nhật
     */
    const updateCourse = (courseData) => {
        toggleSubmitButton(false);
        toggleLoading(true);
        
        // Mô phỏng call API
        setTimeout(() => {
            try {
                // Cập nhật vào mock data
                const index = mockCourses.findIndex(c => c.ID_KhoaHoc === parseInt(courseId));
                
                if (index !== -1) {
                    // Cập nhật thông tin khóa học
                    mockCourses[index] = {
                        ...mockCourses[index],
                        ...courseData
                    };
                    
                    // Cập nhật tên bậc học tương ứng
                    mockCourses[index].TenBacHoc = courseData.ID_BacHoc === 1 ? 'Đại học' : 'Cao học';
                    
                    showToast('success', 'Cập nhật khóa học thành công!');
                    
                    // Cập nhật originalData
                    originalCourseData = JSON.parse(JSON.stringify(mockCourses[index]));
                    
                    // Quay lại trang chi tiết sau khi cập nhật thành công
                    setTimeout(() => {
                        window.location.href = `course-detail.html?id=${courseId}`;
                    }, 1500);
                } else {
                    showError('Không tìm thấy khóa học để cập nhật.');
                    toggleSubmitButton(true);
                    toggleLoading(false);
                }
            } catch (error) {
                showError('Có lỗi xảy ra khi cập nhật khóa học.');
                console.error('Error updating course:', error);
                toggleSubmitButton(true);
                toggleLoading(false);
            }
        }, 800);
    };

    /**
     * Điền thông tin khóa học vào form
     * @param {Object} course - Dữ liệu khóa học
     */
    const populateForm = (course) => {
        domElements.courseId.value = course.ID_KhoaHoc;
        domElements.courseName.value = course.TenKhoaHoc;
        domElements.courseCode.value = course.MaKhoaHoc;
        domElements.courseCredits.value = course.SoTinChi;
        domElements.courseLevel.value = course.ID_BacHoc;
        domElements.courseStatus.value = course.TrangThai;
        domElements.courseDescription.value = course.MoTa || '';
    };

    /**
     * Lấy dữ liệu từ form
     * @returns {Object} Dữ liệu khóa học từ form
     */
    const getFormData = () => {
        return {
            ID_KhoaHoc: parseInt(domElements.courseId.value),
            TenKhoaHoc: domElements.courseName.value.trim(),
            MaKhoaHoc: domElements.courseCode.value.trim(),
            SoTinChi: parseInt(domElements.courseCredits.value),
            ID_BacHoc: parseInt(domElements.courseLevel.value),
            TrangThai: parseInt(domElements.courseStatus.value),
            MoTa: domElements.courseDescription.value.trim() || null
        };
    };

    /**
     * Kiểm tra tính hợp lệ của form
     * @returns {boolean} True nếu form hợp lệ, False nếu ngược lại
     */
    const validateForm = () => {
        // Ẩn tất cả thông báo lỗi
        hideAllFormErrors();
        
        let isValid = true;
        
        // Kiểm tra mã khóa học
        if (!domElements.courseCode.value.trim()) {
            domElements.codeError.classList.remove('hidden');
            domElements.courseCode.focus();
            isValid = false;
        }
        
        // Kiểm tra tên khóa học
        if (!domElements.courseName.value.trim()) {
            domElements.nameError.classList.remove('hidden');
            if (isValid) domElements.courseName.focus();
            isValid = false;
        }
        
        // Kiểm tra số tín chỉ
        const credits = parseInt(domElements.courseCredits.value);
        if (isNaN(credits) || credits < 1 || credits > 10) {
            domElements.creditsError.classList.remove('hidden');
            if (isValid) domElements.courseCredits.focus();
            isValid = false;
        }
        
        // Kiểm tra bậc học
        if (!domElements.courseLevel.value) {
            domElements.levelError.classList.remove('hidden');
            if (isValid) domElements.courseLevel.focus();
            isValid = false;
        }
        
        return isValid;
    };

    /**
     * Xử lý sự kiện submit form
     * @param {Event} e - Đối tượng sự kiện
     */
    const handleFormSubmit = (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        const formData = getFormData();
        updateCourse(formData);
    };

    /**
     * Hiển thị thông báo toast
     * @param {string} type - Loại thông báo (success, error, warning, info)
     * @param {string} message - Nội dung thông báo
     * @param {number} duration - Thời gian hiển thị (ms)
     */
    const showToast = (type, message, duration = 3000) => {
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
    };

    /**
     * Đóng thông báo toast
     * @param {HTMLElement} toast - Phần tử DOM của toast
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
     * Thiết lập menu người dùng
     */
    const setupUserMenu = () => {
        if (domElements.userMenuButton && domElements.userMenu) {
            domElements.userMenuButton.addEventListener('click', () => {
                domElements.userMenu.classList.toggle('opacity-0');
                domElements.userMenu.classList.toggle('invisible');
                domElements.userMenu.classList.toggle('scale-95');
                domElements.userMenu.classList.toggle('scale-100');
            });
            
            // Đóng menu khi click ra ngoài
            document.addEventListener('click', (event) => {
                if (!domElements.userMenuButton.contains(event.target) && 
                    !domElements.userMenu.contains(event.target)) {
                    domElements.userMenu.classList.add('opacity-0', 'invisible', 'scale-95');
                    domElements.userMenu.classList.remove('scale-100');
                }
            });
        }
    };

    /**
     * Thiết lập thanh sidebar
     */
    const setupSidebar = () => {
        if (domElements.sidebarOpen && domElements.sidebar && domElements.sidebarBackdrop) {
            // Mở sidebar
            domElements.sidebarOpen.addEventListener('click', () => {
                domElements.sidebar.classList.remove('-translate-x-full');
                domElements.sidebarBackdrop.classList.remove('hidden');
            });
            
            // Đóng sidebar
            const closeSidebar = () => {
                domElements.sidebar.classList.add('-translate-x-full');
                domElements.sidebarBackdrop.classList.add('hidden');
            };
            
            if (domElements.sidebarClose) {
                domElements.sidebarClose.addEventListener('click', closeSidebar);
            }
            
            domElements.sidebarBackdrop.addEventListener('click', closeSidebar);
        }
    };

    /**
     * Thiết lập các sự kiện
     */
    const setupEventListeners = () => {
        // Form submit
        if (domElements.courseEditForm) {
            domElements.courseEditForm.addEventListener('submit', handleFormSubmit);
        }
        
        // Cancel button
        if (domElements.cancelButton) {
            domElements.cancelButton.addEventListener('click', () => {
                window.location.href = `course-detail.html?id=${courseId}`;
            });
        }
        
        // Retry button
        if (domElements.retryButton) {
            domElements.retryButton.addEventListener('click', fetchCourseDetails);
        }
    };

    /**
     * Khởi tạo trang
     */
    const initPage = () => {
        // Lấy ID khóa học từ URL
        courseId = getCourseIdFromUrl();
        
        // Kiểm tra nếu không có courseId
        if (!courseId) {
            showError('Không tìm thấy ID khóa học trong URL.');
            return;
        }
        
        // Khởi tạo components
        setupUserMenu();
        setupSidebar();
        setupEventListeners();
        
        // Tải dữ liệu khóa học
        fetchCourseDetails();
        
        // Khởi tạo AOS animation
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 800,
                easing: 'ease-in-out'
            });
        }
    };

    // Khởi tạo trang khi DOM đã sẵn sàng
    document.addEventListener('DOMContentLoaded', initPage);
})(); 