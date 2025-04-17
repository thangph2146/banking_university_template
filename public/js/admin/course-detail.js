(function() {
    'use strict';

    // Constants
    const API_BASE_URL = '/api/courses';
    let courseId = null;

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
        courseDetailsContainer: document.getElementById('course-details-container'),
        loadingIndicator: document.getElementById('loading-indicator'),
        errorAlert: document.getElementById('error-alert'),
        errorMessage: document.getElementById('error-message'),
        retryBtn: document.getElementById('retry-btn'),
        
        // Course detail elements
        courseId: document.getElementById('course-id'),
        courseCode: document.getElementById('course-code'),
        courseName: document.getElementById('course-name'),
        courseCredits: document.getElementById('course-credits'),
        courseLevel: document.getElementById('course-level'),
        courseStatus: document.getElementById('course-status'),
        courseDescription: document.getElementById('course-description'),
        
        // Action buttons
        editCourseBtn: document.getElementById('edit-course-btn'),
        deleteCourseBtn: document.getElementById('delete-course-btn'),
        
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
    function getCourseIdFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('id');
    }

    function createStatusBadge(status) {
        if (status === 1) {
            return `
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Hoạt động
                </span>
            `;
        } else {
            return `
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                    Không hoạt động
                </span>
            `;
        }
    }

    function toggleLoading(show) {
        if (show) {
            elements.loadingIndicator.classList.remove('hidden');
            elements.courseDetailsContainer.classList.add('hidden');
            elements.errorAlert.classList.add('hidden');
        } else {
            elements.loadingIndicator.classList.add('hidden');
        }
    }

    function showError(message) {
        elements.errorMessage.textContent = message || 'Có lỗi xảy ra khi tải thông tin khóa học.';
        elements.errorAlert.classList.remove('hidden');
        elements.courseDetailsContainer.classList.add('hidden');
        elements.loadingIndicator.classList.add('hidden');
    }

    function showToast(message, type = 'info', duration = 3000) {
        const toastContainer = document.getElementById('toast-container');
        if (!toastContainer) return;
        
        const toast = document.createElement('div');
        
        // Xác định màu sắc và biểu tượng dựa trên loại thông báo
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
        
        // Tạo cấu trúc toast
        toast.classList.add('mb-3', bgColor, 'text-white', 'p-3', 'rounded-lg', 'shadow-md', 'flex', 'items-center', 'animate-fade-in-up');
        toast.style.minWidth = '300px';
        toast.innerHTML = `
            <i class="${iconClass} mr-2 text-lg"></i>
            <span class="flex-1">${message}</span>
            <button class="ml-2 text-white focus:outline-none">
                <i class="ri-close-line"></i>
            </button>
        `;
        
        // Thêm toast vào container
        toastContainer.appendChild(toast);
        
        // Xử lý sự kiện đóng
        const closeButton = toast.querySelector('button');
        closeButton.addEventListener('click', () => closeToast(toast));
        
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

    // API Functions
    function fetchCourseDetail() {
        toggleLoading(true);
        
        // Mô phỏng call API
        setTimeout(() => {
            try {
                // Tìm khóa học trong mock data
                const course = coursesMockData.find(c => c.ID_KhoaHoc === parseInt(courseId));
                
                if (course) {
                    displayCourseDetail(course);
                    elements.courseDetailsContainer.classList.remove('hidden');
                    
                    // Cập nhật URL cho nút chỉnh sửa
                    if (elements.editCourseBtn) {
                        elements.editCourseBtn.href = `course-edit.html?id=${course.ID_KhoaHoc}`;
                    }
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
    }

    function displayCourseDetail(course) {
        // Hiển thị thông tin chi tiết khóa học
        elements.courseId.textContent = course.ID_KhoaHoc;
        elements.courseCode.textContent = course.MaKhoaHoc;
        elements.courseName.textContent = course.TenKhoaHoc;
        elements.courseCredits.textContent = course.SoTinChi;
        elements.courseLevel.textContent = course.TenBacHoc;
        
        // Hiển thị trạng thái với badge
        if (elements.courseStatus) {
            elements.courseStatus.innerHTML = createStatusBadge(course.TrangThai);
        }
        
        // Hiển thị mô tả (nếu có)
        elements.courseDescription.textContent = course.MoTa || 'Không có mô tả cho khóa học này.';
    }

    function openDeleteModal(id, name) {
        // Tạo modal xác nhận xóa
        const modalContainer = document.createElement('div');
        modalContainer.id = 'delete-modal';
        modalContainer.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50';
        modalContainer.innerHTML = `
            <div class="bg-white rounded-lg shadow-lg max-w-md w-full">
                <div class="p-4 border-b">
                    <h3 class="text-lg font-medium text-gray-900">Xác nhận xóa</h3>
                </div>
                <div class="p-4">
                    <p class="text-gray-700">Bạn có chắc chắn muốn xóa khóa học "<span class="font-semibold">${name}</span>"?</p>
                    <p class="mt-2 text-sm text-red-600">Hành động này không thể hoàn tác.</p>
                </div>
                <div class="px-4 py-3 bg-gray-50 flex justify-end space-x-3 rounded-b-lg">
                    <button id="cancel-delete" class="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">Hủy</button>
                    <button id="confirm-delete" class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">Xóa</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modalContainer);
        
        // Xử lý các sự kiện của modal
        document.getElementById('cancel-delete').addEventListener('click', closeDeleteModal);
        document.getElementById('confirm-delete').addEventListener('click', () => {
            closeDeleteModal();
            deleteCourse(id);
        });
    }

    function closeDeleteModal() {
        const modal = document.getElementById('delete-modal');
        if (modal) {
            modal.remove();
        }
    }

    function deleteCourse(id) {
        toggleLoading(true);
        
        // Mô phỏng call API
        setTimeout(() => {
            try {
                // Tìm index của khóa học trong mock data
                const index = coursesMockData.findIndex(c => c.ID_KhoaHoc === parseInt(id));
                
                if (index !== -1) {
                    // Xóa khóa học
                    coursesMockData.splice(index, 1);
                    
                    showToast('Xóa khóa học thành công!', 'success');
                    
                    // Chuyển hướng về trang danh sách sau khi xóa thành công
                    setTimeout(() => {
                        window.location.href = 'courses.html';
                    }, 1500);
                } else {
                    showError('Không tìm thấy khóa học để xóa.');
                    toggleLoading(false);
                }
            } catch (error) {
                showError('Có lỗi xảy ra khi xóa khóa học.');
                console.error('Error deleting course:', error);
                toggleLoading(false);
            }
        }, 800);
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

    function setupEventListeners() {
        // Xử lý nút retry khi có lỗi
        if (elements.retryBtn) {
            elements.retryBtn.addEventListener('click', fetchCourseDetail);
        }
        
        // Xử lý nút xóa khóa học
        if (elements.deleteCourseBtn) {
            elements.deleteCourseBtn.addEventListener('click', () => {
                // Tìm khóa học trong mock data
                const course = coursesMockData.find(c => c.ID_KhoaHoc === parseInt(courseId));
                
                if (course) {
                    openDeleteModal(course.ID_KhoaHoc, course.TenKhoaHoc);
                } else {
                    showToast('Không tìm thấy thông tin khóa học.', 'error');
                }
            });
        }
    }

    // Initialize
    function init() {
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
        fetchCourseDetail();
        
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