(function() {
    'use strict';

    // Constants
    const API_BASE_URL = '/api/majors';
    
    // Cache DOM Elements
    const $elements = {
        loadingIndicator: document.getElementById('loading-indicator'),
        errorContainer: document.getElementById('error-container'),
        errorMessage: document.getElementById('error-message'),
        detailContainer: document.getElementById('major-detail-container'),
        editButton: document.getElementById('edit-button'),
        
        // Sidebar
        sidebar: document.getElementById('sidebar'),
        sidebarOpen: document.getElementById('sidebar-open'),
        sidebarClose: document.getElementById('sidebar-close'),
        sidebarBackdrop: document.getElementById('sidebar-backdrop')
    };
    
    // Data mẫu cho ngành đào tạo
    const majorsMockData = [
        { nganh_id: 1, ten_nganh: 'Công nghệ thông tin', ma_nganh: '7480201', phong_khoa_id: 1, phong_khoa_ten: 'Khoa Công nghệ thông tin', status: 1, created_at: '2024-07-01 10:00:00', updated_at: null },
        { nganh_id: 2, ten_nganh: 'Kỹ thuật phần mềm', ma_nganh: '7480103', phong_khoa_id: 1, phong_khoa_ten: 'Khoa Công nghệ thông tin', status: 1, created_at: '2024-07-01 10:05:00', updated_at: '2024-07-10 14:30:00' },
        { nganh_id: 3, ten_nganh: 'Hệ thống thông tin', ma_nganh: '7480104', phong_khoa_id: 1, phong_khoa_ten: 'Khoa Công nghệ thông tin', status: 1, created_at: '2024-07-01 10:10:00', updated_at: null },
        { nganh_id: 4, ten_nganh: 'Tài chính - Ngân hàng', ma_nganh: '7340201', phong_khoa_id: 4, phong_khoa_ten: 'Khoa Tài chính - Ngân hàng', status: 1, created_at: '2024-07-01 10:15:00', updated_at: null },
        { nganh_id: 5, ten_nganh: 'Kế toán', ma_nganh: '7340301', phong_khoa_id: 2, phong_khoa_ten: 'Khoa Kế toán - Quản trị', status: 1, created_at: '2024-07-01 10:20:00', updated_at: null },
        { nganh_id: 6, ten_nganh: 'Kinh tế', ma_nganh: '7310101', phong_khoa_id: 2, phong_khoa_ten: 'Khoa Kế toán - Quản trị', status: 1, created_at: '2024-07-01 10:25:00', updated_at: null },
        { nganh_id: 7, ten_nganh: 'Quản trị kinh doanh', ma_nganh: '7340101', phong_khoa_id: 2, phong_khoa_ten: 'Khoa Kế toán - Quản trị', status: 1, created_at: '2024-07-01 10:30:00', updated_at: null },
        { nganh_id: 8, ten_nganh: 'Ngôn ngữ Anh', ma_nganh: '7220201', phong_khoa_id: 3, phong_khoa_ten: 'Khoa Ngôn ngữ học', status: 1, created_at: '2024-07-01 10:35:00', updated_at: null },
        { nganh_id: 9, ten_nganh: 'Ngôn ngữ Trung Quốc', ma_nganh: '7220204', phong_khoa_id: 3, phong_khoa_ten: 'Khoa Ngôn ngữ học', status: 0, created_at: '2024-07-01 10:40:00', updated_at: '2024-07-15 09:20:00' },
        { nganh_id: 10, ten_nganh: 'Luật kinh tế', ma_nganh: '7380107', phong_khoa_id: 4, phong_khoa_ten: 'Khoa Tài chính - Ngân hàng', status: 0, created_at: '2024-07-01 10:45:00', updated_at: null }
    ];
    
    /**
     * Format a date string to local format DD/MM/YYYY
     * @param {string} dateString - Date string to format
     * @returns {string} Formatted date
     */
    const formatDate = (dateString) => {
        if (!dateString) return '-';
        try {
            const date = new Date(dateString);
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            return `${day}/${month}/${year}`;
        } catch (error) {
            console.error("Error formatting date:", error);
            return '-';
        }
    };
    
    /**
     * Format a datetime string to local format DD/MM/YYYY HH:MM
     * @param {string} dateTimeString - Datetime string to format
     * @returns {string} Formatted datetime
     */
    const formatDateTime = (dateTimeString) => {
        if (!dateTimeString) return '-';
        try {
            const date = new Date(dateTimeString);
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            return `${day}/${month}/${year} ${hours}:${minutes}`;
        } catch (error) {
            console.error("Error formatting datetime:", error);
            return '-';
        }
    };
    
    /**
     * Hiện/ẩn loading indicator
     * @param {boolean} show - true để hiển thị, false để ẩn
     */
    const toggleLoading = (show) => {
        if ($elements.loadingIndicator) {
            $elements.loadingIndicator.classList.toggle('hidden', !show);
        }
        if ($elements.detailContainer) {
            $elements.detailContainer.classList.toggle('hidden', show);
        }
        if ($elements.errorContainer) {
            $elements.errorContainer.classList.add('hidden');
        }
    };
    
    /**
     * Hiển thị thông báo lỗi
     * @param {string} message - Thông báo lỗi
     */
    const showError = (message) => {
        if ($elements.errorContainer && $elements.errorMessage) {
            $elements.errorMessage.textContent = message || 'Đã xảy ra lỗi khi tải dữ liệu.';
            $elements.errorContainer.classList.remove('hidden');
            $elements.loadingIndicator.classList.add('hidden');
            $elements.detailContainer.classList.add('hidden');
        }
    };
    
    /**
     * Lấy ID ngành từ URL
     * @returns {number|null} ID ngành hoặc null nếu không tìm thấy
     */
    const getMajorIdFromUrl = () => {
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');
        return id ? parseInt(id) : null;
    };
    
    /**
     * Lấy thông tin ngành từ API
     * @param {number} id - ID ngành cần lấy thông tin
     * @returns {Promise<Object>} Thông tin ngành
     */
    const fetchMajorDetails = async (id) => {
        try {
            // TODO: Thay thế bằng API call thực tế
            console.log(`Fetching major details for ID: ${id}`);
            
            // Giả lập delay khi gọi API
            await new Promise(resolve => setTimeout(resolve, 800));
            
            // Tìm ngành theo ID
            const major = majorsMockData.find(m => m.nganh_id === id);
            
            if (!major) {
                throw new Error('Không tìm thấy ngành đào tạo với ID đã cung cấp.');
            }
            
            return major;
        } catch (error) {
            console.error('Error fetching major details:', error);
            throw error;
        }
    };
    
    /**
     * Hiển thị thông tin chi tiết ngành
     * @param {Object} major - Thông tin ngành
     */
    const renderMajorDetails = (major) => {
        // Tạo HTML cho thông tin chi tiết
        const detailsHTML = `
            <div class="bg-white rounded-lg shadow overflow-hidden">
                <div class="p-4 sm:p-6 border-b border-gray-200">
                    <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                        <div>
                            <h2 class="text-xl font-semibold text-gray-900">${major.ten_nganh}</h2>
                            <p class="mt-1 text-sm text-gray-500">
                                <span class="font-medium text-gray-700">Mã ngành:</span> ${major.ma_nganh}
                            </p>
                        </div>
                        <div class="mt-3 sm:mt-0">
                            ${major.status === 1 
                                ? '<span class="px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-green-100 text-green-800">Hoạt động</span>' 
                                : '<span class="px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">Không hoạt động</span>'
                            }
                        </div>
                    </div>
                </div>
                
                <div class="px-4 py-5 sm:p-6 border-b border-gray-200 bg-gray-50">
                    <dl class="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6">
                        <div class="sm:col-span-1">
                            <dt class="text-sm font-medium text-gray-500">ID Ngành</dt>
                            <dd class="mt-1 text-sm text-gray-900">${major.nganh_id}</dd>
                        </div>
                        
                        <div class="sm:col-span-1">
                            <dt class="text-sm font-medium text-gray-500">Mã ngành</dt>
                            <dd class="mt-1 text-sm text-gray-900">${major.ma_nganh}</dd>
                        </div>
                        
                        <div class="sm:col-span-1">
                            <dt class="text-sm font-medium text-gray-500">Tên ngành</dt>
                            <dd class="mt-1 text-sm text-gray-900">${major.ten_nganh}</dd>
                        </div>
                        
                        <div class="sm:col-span-1">
                            <dt class="text-sm font-medium text-gray-500">Phòng/Khoa</dt>
                            <dd class="mt-1 text-sm text-gray-900">${major.phong_khoa_ten || '-'}</dd>
                        </div>
                        
                        <div class="sm:col-span-1">
                            <dt class="text-sm font-medium text-gray-500">Trạng thái</dt>
                            <dd class="mt-1 text-sm text-gray-900">
                                ${major.status === 1 
                                    ? '<span class="px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Hoạt động</span>' 
                                    : '<span class="px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">Không hoạt động</span>'
                                }
                            </dd>
                        </div>
                        
                        <div class="sm:col-span-1">
                            <dt class="text-sm font-medium text-gray-500">Ngày tạo</dt>
                            <dd class="mt-1 text-sm text-gray-900">${formatDateTime(major.created_at)}</dd>
                        </div>
                        
                        <div class="sm:col-span-1">
                            <dt class="text-sm font-medium text-gray-500">Lần cập nhật cuối</dt>
                            <dd class="mt-1 text-sm text-gray-900">${major.updated_at ? formatDateTime(major.updated_at) : 'Chưa cập nhật'}</dd>
                        </div>
                    </dl>
                </div>
                
                <div class="px-4 py-5 sm:p-6 flex flex-col-reverse sm:flex-row sm:justify-between">
                    <a href="majors.html" class="w-full sm:w-auto mt-3 sm:mt-0 inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                        <i class="ri-arrow-left-line mr-2"></i>
                        Quay lại danh sách
                    </a>
                    <div class="flex space-x-3">
                        <a href="major-edit.html?id=${major.nganh_id}" class="w-full sm:w-auto inline-flex justify-center items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                            <i class="ri-edit-line mr-2"></i>
                            Chỉnh sửa
                        </a>
                    </div>
                </div>
            </div>
        `;
        
        // Cập nhật nội dung container
        $elements.detailContainer.innerHTML = detailsHTML;
        $elements.detailContainer.classList.remove('hidden');
        
        // Cập nhật nút chỉnh sửa ở header
        if ($elements.editButton) {
            $elements.editButton.href = `major-edit.html?id=${major.nganh_id}`;
        }
    };
    
    /**
     * Thiết lập sidebar
     */
    const setupSidebar = () => {
        const { sidebar, sidebarOpen, sidebarClose, sidebarBackdrop } = $elements;
        
        if (!sidebar || !sidebarOpen || !sidebarClose || !sidebarBackdrop) return;
        
        sidebarOpen.addEventListener('click', () => {
            sidebar.classList.remove('-translate-x-full');
            sidebarBackdrop.classList.remove('hidden');
        });
        
        sidebarClose.addEventListener('click', () => {
            sidebar.classList.add('-translate-x-full');
            sidebarBackdrop.classList.add('hidden');
        });
        
        sidebarBackdrop.addEventListener('click', () => {
            sidebar.classList.add('-translate-x-full');
            sidebarBackdrop.classList.add('hidden');
        });
    };
    
    /**
     * Tải và hiển thị thông tin chi tiết ngành
     */
    const loadMajorDetails = async () => {
        const majorId = getMajorIdFromUrl();
        
        if (!majorId) {
            showError('Không tìm thấy ID ngành đào tạo trong URL. Vui lòng truy cập từ trang danh sách ngành.');
            return;
        }
        
        try {
            toggleLoading(true);
            
            const majorDetails = await fetchMajorDetails(majorId);
            
            renderMajorDetails(majorDetails);
        } catch (error) {
            console.error('Error loading major details:', error);
            showError(error.message || 'Đã xảy ra lỗi khi tải thông tin ngành đào tạo.');
        } finally {
            toggleLoading(false);
        }
    };
    
    /**
     * Khởi tạo trang
     */
    const init = () => {
        // Thiết lập sidebar
        setupSidebar();
        
        // Tải thông tin chi tiết ngành
        loadMajorDetails();
    };
    
    // Khởi động khi DOM đã tải xong
    document.addEventListener('DOMContentLoaded', init);
})();