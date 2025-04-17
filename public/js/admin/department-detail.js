/**
 * Quản lý chi tiết phòng khoa
 * 
 * File này xử lý các chức năng liên quan đến xem chi tiết phòng khoa:
 * - Lấy thông tin phòng khoa từ ID trong URL
 * - Hiển thị chi tiết phòng khoa
 * - Cung cấp nút chuyển đến trang chỉnh sửa
 * 
 * Dữ liệu được lấy từ departmentsMockData trong localStorage
 */

/**
 * department-detail.js - Xử lý chức năng hiển thị chi tiết Phòng khoa
 * Sử dụng phong cách lập trình hàm (functional programming)
 * Phạm vi: Trang chi tiết phòng khoa (department-detail.html)
 */

// Khởi tạo AOS
AOS.init();

// Các phần tử DOM
const domElements = {
    // Containers
    loadingIndicator: document.getElementById('loading-indicator'),
    errorContainer: document.getElementById('error-container'),
    errorMessage: document.getElementById('error-message'),
    departmentDetailContainer: document.getElementById('department-detail-container'),
    
    // Thông tin phòng khoa
    departmentName: document.getElementById('department-name'),
    departmentCode: document.getElementById('department-code'),
    departmentNote: document.getElementById('department-note'),
    statusBadge: document.getElementById('status-badge'),
    createdAt: document.getElementById('created-at'),
    updatedAt: document.getElementById('updated-at'),
    
    // Nút hành động
    editButton: document.getElementById('edit-button'),
    backButton: document.getElementById('back-button'),
    
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
 * Lấy dữ liệu phòng khoa từ localStorage
 * @returns {Array} Danh sách phòng khoa
 */
const getDepartmentsMockData = () => {
    try {
        const data = localStorage.getItem('departmentsMockData');
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('Lỗi khi lấy dữ liệu phòng khoa từ localStorage:', error);
        return [];
    }
};

/**
 * Tải thông tin chi tiết phòng khoa
 */
const fetchDepartmentDetails = async () => {
    try {
        // Hiển thị loading
        toggleLoading(true);
        
        // Lấy ID từ URL
        const departmentId = getDepartmentIdFromUrl();
        
        if (!departmentId) {
            throw new Error('ID phòng khoa không hợp lệ');
        }
        
        // Giả lập delay khi gọi API
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Lấy dữ liệu phòng khoa từ localStorage
        const departmentsData = getDepartmentsMockData();
        
        // Tìm phòng khoa theo ID
        const departmentData = departmentsData.find(
            department => department.phong_khoa_id === departmentId
        );
        
        if (!departmentData) {
            throw new Error('Không tìm thấy thông tin phòng khoa');
        }
        
        // Hiển thị thông tin phòng khoa
        renderDepartmentDetails(departmentData);
        
        // Cập nhật tiêu đề trang
        document.title = `${departmentData.ten_phong_khoa} - Chi tiết phòng khoa | HUB Admin`;
        
        // Thiết lập nút chỉnh sửa
        setupEditButton(departmentId);
        
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
    
    if (domElements.departmentDetailContainer) {
        domElements.departmentDetailContainer.classList.toggle('hidden', isLoading);
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
        
        if (domElements.departmentDetailContainer) {
            domElements.departmentDetailContainer.classList.add('hidden');
        }
    }
};

/**
 * Định dạng ngày giờ theo định dạng Việt Nam
 * @param {string} dateString - Chuỗi ngày giờ cần định dạng
 * @returns {string} Chuỗi ngày giờ đã định dạng
 */
const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    const options = { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    
    return new Date(dateString).toLocaleDateString('vi-VN', options);
};

/**
 * Hiển thị thông tin chi tiết phòng khoa
 * @param {Object} department - Thông tin phòng khoa
 */
const renderDepartmentDetails = (department) => {
    // Hiển thị tên và mã phòng khoa
    if (domElements.departmentName) {
        domElements.departmentName.textContent = department.ten_phong_khoa || 'N/A';
    }
    
    if (domElements.departmentCode) {
        domElements.departmentCode.textContent = department.ma_phong_khoa || 'N/A';
    }
    
    // Hiển thị ghi chú
    if (domElements.departmentNote) {
        domElements.departmentNote.textContent = department.ghi_chu || 'Không có ghi chú';
    }
    
    // Hiển thị trạng thái
    if (domElements.statusBadge) {
        const isActive = department.status === '1';
        domElements.statusBadge.textContent = isActive ? 'Hoạt động' : 'Không hoạt động';
        domElements.statusBadge.className = `px-2 py-1 text-xs font-semibold rounded-full ${
            isActive 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
        }`;
    }
    
    // Hiển thị thời gian tạo và cập nhật
    if (domElements.createdAt) {
        domElements.createdAt.textContent = formatDate(department.created_at);
    }
    
    if (domElements.updatedAt) {
        domElements.updatedAt.textContent = formatDate(department.updated_at) || 'Chưa cập nhật';
    }
};

/**
 * Thiết lập nút chỉnh sửa
 * @param {number} departmentId - ID phòng khoa
 */
const setupEditButton = (departmentId) => {
    if (domElements.editButton) {
        domElements.editButton.href = `department-edit.html?id=${departmentId}`;
    }
    
    if (domElements.backButton) {
        domElements.backButton.addEventListener('click', () => {
            window.location.href = 'departments.html';
        });
    }
};

/**
 * Thiết lập sidebar
 */
const setupSidebar = () => {
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
 * Khởi tạo trang
 */
const init = () => {
    // Thiết lập sidebar
    setupSidebar();
    
    // Tải thông tin chi tiết phòng khoa
    fetchDepartmentDetails();
};

// Khởi chạy khi DOM đã tải xong
document.addEventListener('DOMContentLoaded', init); 