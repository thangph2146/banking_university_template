/**
 * Module quản lý trang chi tiết Check-out
 */
const CheckoutDetailManager = (function() {
    'use strict';

    // Constants & API Endpoints (Adjust as needed)
    const API_URL = '/api/checkouts'; // Endpoint to get a single checkout
    const USER_TIMEZONE = 'Asia/Ho_Chi_Minh'; // Target timezone for display

    // Map ENUM values to Vietnamese text
    const checkoutTypeMap = {
        'face_id': 'Face ID',
        'manual': 'Thủ công (Admin)',
        'qr_code': 'QR Code',
        'auto': 'Tự động (Timeout)',
        'online': 'Online',
    };
    const hinhThucThamGiaMap = {
        'offline': 'Trực tiếp',
        'online': 'Trực tuyến',
    };
    const statusMap = {
        1: { text: 'Hoạt động', color: 'green' },
        0: { text: 'Đã hủy', color: 'red' },
        // Add other statuses if needed
    };

    // DOM elements
    const $elements = {
        loadingIndicator: document.getElementById('loading-indicator'),
        detailContainer: document.getElementById('detail-container'),
        errorAlert: document.getElementById('error-alert'),
        errorMessage: document.getElementById('error-message'),
        errorDetail: document.getElementById('error-detail'),
        checkoutIdDisplay: document.getElementById('checkout-id-display'),
        editButton: document.getElementById('edit-btn'),
        backButton: document.getElementById('back-to-list-btn'),
        // Detail fields
        detailCheckoutId: document.getElementById('detail-checkout-id'),
        detailEvent: document.getElementById('detail-event'),
        detailUser: document.getElementById('detail-user'),
        detailEmail: document.getElementById('detail-email'),
        detailCheckinId: document.getElementById('detail-checkin-id'),
        detailRegistrationId: document.getElementById('detail-registration-id'),
        detailCheckoutTime: document.getElementById('detail-checkout-time'),
        detailCheckoutType: document.getElementById('detail-checkout-type'),
        detailParticipationMode: document.getElementById('detail-participation-mode'),
        detailDeviceInfo: document.getElementById('detail-device-info'),
        detailLocationData: document.getElementById('detail-location-data'),
        detailIpAddress: document.getElementById('detail-ip-address'),
        detailAttendanceDuration: document.getElementById('detail-attendance-duration'),
        detailStatus: document.getElementById('detail-status'),
        detailNotes: document.getElementById('detail-notes'),
        detailFeedback: document.getElementById('detail-feedback'),
        detailRating: document.getElementById('detail-rating'),
        detailRatingContent: document.getElementById('detail-rating-content'),
        detailFaceVerified: document.getElementById('detail-face-verified'),
        detailFaceScore: document.getElementById('detail-face-score'),
        detailFaceImage: document.getElementById('detail-face-image'),
        detailCreatedAt: document.getElementById('detail-created-at'),
        detailUpdatedAt: document.getElementById('detail-updated-at'),
    };

    /**
     * Get checkout ID from URL query parameter
     * @returns {string|null} Checkout ID or null if not found
     */
    const getCheckoutIdFromUrl = () => {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('id');
    };

    /**
     * Format date/time string using Moment.js and timezone
     * @param {string} dateTimeString - ISO date string
     * @param {string} format - Moment.js format string
     * @returns {string} Formatted date/time or '-'
     */
    const formatDateTime = (dateTimeString, format = 'L LTS') => {
        if (!dateTimeString) return '-';
        try {
            return moment(dateTimeString).tz(USER_TIMEZONE).format(format);
        } catch (error) {
            console.error("Error formatting datetime:", dateTimeString, error);
            return '-';
        }
    };

    /**
    * Format boolean value for display
    * @param {boolean|null|undefined} value
    * @returns {string} 'Có' or 'Không' or '-'
    */
    const formatBoolean = (value) => {
        if (value === true) return 'Có';
        if (value === false) return 'Không';
        return '-';
    };

    /**
     * Get status badge HTML
     * @param {number|string} statusValue
     * @returns {string} HTML string for the badge
     */
    const getStatusBadge = (statusValue) => {
        const statusInfo = statusMap[statusValue] || { text: 'Không xác định', color: 'gray' };
        return `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${statusInfo.color}-100 text-${statusInfo.color}-800">${statusInfo.text}</span>`;
    };

     /**
     * Populate detail fields with data
     * @param {object} checkoutData - The checkout data object from API
     */
    const populateDetails = (checkoutData) => {
        if (!checkoutData) return;

        const safeText = (text) => text || '-'; // Helper for default value

        $elements.checkoutIdDisplay.textContent = checkoutData.checkout_sukien_id;
        $elements.detailCheckoutId.textContent = checkoutData.checkout_sukien_id;
        // Assuming Event and User data are nested or fetched separately
        $elements.detailEvent.textContent = checkoutData.Event?.ten_su_kien || `ID: ${checkoutData.su_kien_id}` || '-';
        $elements.detailUser.textContent = checkoutData.ho_ten || '-';
        $elements.detailEmail.textContent = checkoutData.email || '-';
        $elements.detailCheckinId.textContent = checkoutData.checkin_sukien_id || '-';
        $elements.detailRegistrationId.textContent = checkoutData.dangky_sukien_id || '-';
        $elements.detailCheckoutTime.textContent = formatDateTime(checkoutData.thoi_gian_check_out);
        $elements.detailCheckoutType.textContent = checkoutTypeMap[checkoutData.checkout_type] || safeText(checkoutData.checkout_type);
        $elements.detailParticipationMode.textContent = hinhThucThamGiaMap[checkoutData.hinh_thuc_tham_gia] || safeText(checkoutData.hinh_thuc_tham_gia);
        $elements.detailDeviceInfo.textContent = safeText(checkoutData.device_info);
        $elements.detailLocationData.textContent = safeText(checkoutData.location_data);
        $elements.detailIpAddress.textContent = safeText(checkoutData.ip_address);
        $elements.detailAttendanceDuration.textContent = checkoutData.attendance_duration_minutes ? `${checkoutData.attendance_duration_minutes} phút` : '-';
        $elements.detailStatus.innerHTML = getStatusBadge(checkoutData.status);
        $elements.detailNotes.textContent = safeText(checkoutData.ghi_chu);
        $elements.detailFeedback.textContent = safeText(checkoutData.feedback);
        $elements.detailRating.textContent = checkoutData.danh_gia ? `${checkoutData.danh_gia} sao` : '-';
        $elements.detailRatingContent.textContent = safeText(checkoutData.noi_dung_danh_gia);
        $elements.detailFaceVerified.textContent = formatBoolean(checkoutData.face_verified);
        $elements.detailFaceScore.textContent = checkoutData.face_match_score !== null ? checkoutData.face_match_score.toFixed(4) : '-';
        $elements.detailCreatedAt.textContent = formatDateTime(checkoutData.created_at);
        $elements.detailUpdatedAt.textContent = formatDateTime(checkoutData.updated_at);

        // Handle Face Image
        if (checkoutData.face_image_path) {
            $elements.detailFaceImage.innerHTML = `<img src="${checkoutData.face_image_path}" alt="Face ID Image" class="max-w-xs max-h-40 rounded border border-gray-200">`;
        } else {
            $elements.detailFaceImage.innerHTML = '<span class="text-gray-500 italic">Không có hình ảnh</span>';
        }

        // Update Edit button link
        if ($elements.editButton) {
            $elements.editButton.href = `checkout-edit.html?id=${checkoutData.checkout_sukien_id}`;
        }

        // Show the detail container and hide loading indicator
        $elements.detailContainer.classList.remove('hidden');
        $elements.loadingIndicator.classList.add('hidden');
    };

    /**
     * Show error message
     * @param {string} message
     * @param {string} detail
     */
    const showError = (message, detail = '') => {
        $elements.errorMessage.textContent = message;
        $elements.errorDetail.textContent = detail;
        $elements.errorAlert.classList.remove('hidden');
        $elements.loadingIndicator.classList.add('hidden');
        $elements.detailContainer.classList.add('hidden'); // Hide detail container on error
    };

    /**
     * Fetch checkout details from API
     * @param {string} checkoutId
     */
    const fetchCheckoutDetails = (checkoutId) => {
        $elements.loadingIndicator.classList.remove('hidden');
        $elements.detailContainer.classList.add('hidden');
        $elements.errorAlert.classList.add('hidden');

        // TODO: Replace with actual API call
        // Example: fetch(`${API_URL}/${checkoutId}`) // Use your API endpoint structure
        // --- Mock API Call --- 
         new Promise((resolve, reject) => {
            // Find the checkout in the sample data (from checkouts.js - you might need to import/copy it)
            const sampleCheckouts = generateSampleCheckouts(); // Assuming this function is available
            const checkout = sampleCheckouts.find(c => c.checkout_sukien_id === parseInt(checkoutId));
             setTimeout(() => {
                 if (checkout) {
                     // Simulate fetching related Event data (normally done by backend join)
                     const sampleEvents = [
                         { SuKienID: 1, TenSuKien: 'Hội thảo AI 2024' },
                         { SuKienID: 2, TenSuKien: 'Workshop Marketing Online' },
                         { SuKienID: 3, TenSuKien: 'Khóa học Lập trình Python' },
                     ];
                     checkout.Event = sampleEvents.find(e => e.SuKienID === checkout.su_kien_id);
                     resolve(checkout);
                 } else {
                     reject(new Error(`Không tìm thấy check-out với ID: ${checkoutId}`));
                 }
             }, 1000); // Simulate network delay
        })
        // --- End Mock API Call --- 

        /* --- Actual API Call Example --- 
        fetch(`${API_URL}/${checkoutId}`, {
             method: 'GET',
             headers: {
                 'Content-Type': 'application/json',
                 // 'Authorization': 'Bearer YOUR_TOKEN' // Add auth if needed
             }
        })
        .then(response => {
            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error(`Không tìm thấy check-out với ID: ${checkoutId}`);
                }
                throw new Error(`Lỗi ${response.status}: Không thể tải dữ liệu`);
            }
            return response.json();
        })
        */
        .then(data => {
            populateDetails(data);
        })
        .catch(error => {
            console.error('Error fetching checkout details:', error);
            showError('Lỗi tải dữ liệu', error.message);
        });
    };

    /**
     * Register event listeners
     */
    const registerEventListeners = () => {
        // Back button is a simple link, no JS needed unless extra confirmation required
        // Edit button is also a link, JS updates the href

        // === Sidebar and User Menu Setup ===
        setupSidebar();
        setupUserMenu();
        // ==================================
    };

    /**
     * Initialize the module
     */
    const init = () => {
        AOS.init(); // Initialize AOS animations
        const checkoutId = getCheckoutIdFromUrl();

        if (checkoutId) {
            registerEventListeners();
            fetchCheckoutDetails(checkoutId);
        } else {
            showError('ID Check-out không hợp lệ', 'Không tìm thấy ID trong URL.');
        }
    };

    // Initialize when the DOM is ready
    document.addEventListener('DOMContentLoaded', init);

    // Expose public methods if needed
    return {
        init: init
    };
})();

// Helper functions for Sidebar and User Menu (Include or ensure they are available globally)
// NOTE: You need the generateSampleCheckouts function from checkouts.js or fetch real data.
// Add a basic version here for the mock fetch to work:
const generateSampleCheckouts = () => {
    // Minimal sample data structure for detail page mock fetch
    const samples = [
        {
            checkout_sukien_id: 1, su_kien_id: 1, email: 'an.nv@example.com', ho_ten: 'Nguyễn Văn An', checkin_sukien_id: 101, dangky_sukien_id: 201,
            thoi_gian_check_out: '2024-07-27T10:30:00Z', checkout_type: 'manual', hinh_thuc_tham_gia: 'offline',
            device_info: 'Admin PC', location_data: 'Cổng chính', ip_address: '192.168.1.10', attendance_duration_minutes: 125,
            status: 1, ghi_chu: 'Check-out thủ công bởi admin.', feedback: 'Sự kiện rất bổ ích!', danh_gia: 5, noi_dung_danh_gia: 'Diễn giả trình bày hay, nội dung thực tế.',
            face_verified: null, face_match_score: null, face_image_path: null, created_at: '2024-07-27T10:30:10Z', updated_at: '2024-07-27T10:30:10Z'
        },
        {
            checkout_sukien_id: 2, su_kien_id: 2, email: 'binh.tt@example.com', ho_ten: 'Trần Thị Bình', checkin_sukien_id: 102, dangky_sukien_id: 202,
            thoi_gian_check_out: '2024-07-26T16:05:00Z', checkout_type: 'face_id', hinh_thuc_tham_gia: 'offline',
            device_info: 'Camera Cổng B', location_data: 'Cổng B', ip_address: '10.0.0.5', attendance_duration_minutes: 180,
            status: 1, ghi_chu: null, feedback: null, danh_gia: null, noi_dung_danh_gia: null,
            face_verified: true, face_match_score: 0.95, face_image_path: 'https://picsum.photos/seed/face2/100', created_at: '2024-07-26T16:05:15Z', updated_at: '2024-07-26T16:05:15Z'
        },
         {
            checkout_sukien_id: 3, su_kien_id: 1, email: 'cuong.lv@example.com', ho_ten: 'Lê Văn Cường', checkin_sukien_id: 103, dangky_sukien_id: 203,
            thoi_gian_check_out: '2024-07-27T11:00:00Z', checkout_type: 'online', hinh_thuc_tham_gia: 'online',
            device_info: 'Chrome/Win10', location_data: null, ip_address: '203.0.113.25', attendance_duration_minutes: 90,
            status: 1, ghi_chu: 'Tham gia online.', feedback: 'Good', danh_gia: 4, noi_dung_danh_gia: null,
            face_verified: false, face_match_score: null, face_image_path: null, created_at: '2024-07-27T11:00:30Z', updated_at: '2024-07-27T11:00:30Z'
        }
    ];
    return samples;
};

const setupSidebar = () => {
    const sidebar = document.getElementById('sidebar');
    const sidebarOpen = document.getElementById('sidebar-open');
    const sidebarClose = document.getElementById('sidebar-close');
    const sidebarBackdrop = document.getElementById('sidebar-backdrop');
    if (!sidebar || !sidebarOpen || !sidebarClose || !sidebarBackdrop) return;
    sidebarOpen.addEventListener('click', (e) => {
        e.stopPropagation();
        sidebar.classList.remove('-translate-x-full');
        sidebarBackdrop.classList.remove('hidden');
        sidebarBackdrop.classList.add('opacity-100');
    });
    const close = () => {
        sidebar.classList.add('-translate-x-full');
        sidebarBackdrop.classList.remove('opacity-100');
        setTimeout(() => { sidebarBackdrop.classList.add('hidden'); }, 300);
    };
    sidebarClose.addEventListener('click', close);
    sidebarBackdrop.addEventListener('click', close);
};

const setupUserMenu = () => {
    const userMenuButton = document.getElementById('user-menu-button');
    const userMenu = document.getElementById('user-menu');
    const headerAvatar = document.getElementById('header-avatar');
    const headerFullname = document.getElementById('header-fullname');
    const currentUser = { FullName: 'Admin User', Avatar: 'https://ui-avatars.com/api/?name=Admin+User&background=0D8ABC&color=fff' };
    if (headerAvatar && currentUser.Avatar) { headerAvatar.src = currentUser.Avatar; headerAvatar.alt = currentUser.FullName || 'User Avatar'; }
    if (headerFullname && currentUser.FullName) { headerFullname.textContent = currentUser.FullName; }
    if (userMenuButton && userMenu) {
        userMenuButton.addEventListener('click', (event) => {
            event.stopPropagation();
            const isVisible = !userMenu.classList.contains('invisible');
            if (isVisible) {
                 userMenu.classList.add('opacity-0', 'invisible', 'scale-95');
                 userMenu.classList.remove('opacity-100', 'visible', 'scale-100');
            } else {
                userMenu.classList.remove('opacity-0', 'invisible', 'scale-95');
                userMenu.classList.add('opacity-100', 'visible', 'scale-100');
            }
        });
        document.addEventListener('click', (e) => {
             if (!userMenu.classList.contains('invisible') && !userMenuButton.contains(e.target) && !userMenu.contains(e.target)) {
                userMenu.classList.add('opacity-0', 'invisible', 'scale-95');
                userMenu.classList.remove('opacity-100', 'visible', 'scale-100');
            }
        });
    }
}; 