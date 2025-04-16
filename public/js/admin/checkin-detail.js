// IIFE to encapsulate the module
(function() {
    'use strict';

    // Constants
    const API_BASE_URL = '/api/checkins'; // TODO: Update with actual API endpoint

    // DOM Elements Cache
    const $elements = {
        loadingIndicator: document.getElementById('loading-indicator'),
        detailsContainer: document.getElementById('checkin-details-container'),
        errorAlert: document.getElementById('error-alert'),
        errorMessage: document.getElementById('error-message'),
        errorDetail: document.getElementById('error-detail'),
        editButton: document.getElementById('edit-checkin-btn'),
        backButton: document.getElementById('back-to-list-btn'),

        // User Info
        userAvatar: document.getElementById('user-avatar'),
        userFullname: document.getElementById('user-fullname'),
        userEmail: document.getElementById('user-email'),
        userAccountId: document.getElementById('user-account-id'),
        viewUserDetailLink: document.getElementById('view-user-detail'),

        // Event Info
        eventName: document.getElementById('event-name'),
        eventId: document.getElementById('event-id'),
        viewEventDetailLink: document.getElementById('view-event-detail'),

        // Check-in Info
        checkinTime: document.getElementById('checkin-time'),
        deviceInfo: document.getElementById('device-info'),
        locationInfo: document.getElementById('location-info'),
        checkinStatus: document.getElementById('checkin-status'), // Assuming status exists
        checkinNotes: document.getElementById('checkin-notes'),     // Assuming notes exists

        // Check-in Image
        checkinImage: document.getElementById('checkin-image'),
        noImageText: document.getElementById('no-image-text'),

        // Sidebar and Header elements (copied from checkins.js)
        sidebar: document.getElementById('sidebar'),
        sidebarOpen: document.getElementById('sidebar-open'),
        sidebarClose: document.getElementById('sidebar-close'),
        sidebarBackdrop: document.getElementById('sidebar-backdrop'),
        userMenuButton: document.getElementById('user-menu-button'),
        userMenu: document.getElementById('user-menu'),
        headerAvatar: document.getElementById('header-avatar'),
        headerFullname: document.getElementById('header-fullname'),
    };

    // Helper Functions (copied or adapted from checkins.js)
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
            console.error("Error formatting date:", error);
            return '-';
        }
    };

    /**
     * Get Check-in ID from URL query parameters
     * @returns {string|null} Check-in ID or null if not found
     */
    const getCheckinIdFromUrl = () => {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('id');
    };

    /**
     * Show/hide loading indicator
     * @param {boolean} show - True to show, false to hide
     */
    const toggleLoading = (show) => {
        if (show) {
            $elements.loadingIndicator?.classList.remove('hidden');
            $elements.detailsContainer?.classList.add('hidden');
            $elements.errorAlert?.classList.add('hidden');
        } else {
            $elements.loadingIndicator?.classList.add('hidden');
        }
    };

    /**
     * Show error message
     * @param {string} message - Main error message
     * @param {string} detail - Detailed error message
     */
    const showError = (message, detail) => {
        $elements.errorMessage.textContent = message || 'Lỗi!';
        $elements.errorDetail.textContent = detail || 'Không thể thực hiện yêu cầu.';
        $elements.errorAlert?.classList.remove('hidden');
        $elements.detailsContainer?.classList.add('hidden'); // Hide details on error
    };

    /**
     * Fetch check-in details from API (Placeholder)
     * @param {string} id - Check-in ID
     * @returns {Promise<object>} - Promise resolving with check-in data
     */
    const fetchCheckinDetails = async (id) => {
        // TODO: Replace with actual API call
        console.log(`Fetching details for check-in ID: ${id}`);
        const url = `${API_BASE_URL}/${id}`;

        // --- Sample Data --- Replace with fetch() call
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
        const sampleData = {
            ID: parseInt(id),
            EventID: 1,
            AccountID: 'U001',
            DeviceID: 'DVC001',
            LocationID: 'LOC01',
            CheckInTime: '2024-07-28T10:00:00Z',
            HinhAnhCheckIn: 'https://picsum.photos/seed/1/600/400',
            Status: 'Success', // Example Status
            Notes: 'Check-in thành công tại cổng chính.', // Example Notes
            User: { AccountId: 'U001', FullName: 'Nguyễn Văn An', Email: 'an.nv@example.com', Avatar: 'https://ui-avatars.com/api/?name=An+NV&background=random' },
            Event: { EventID: 1, EventName: 'Hội thảo AI 2024', StartTime: '2024-09-15T09:00:00Z' },
            Device: { DeviceID: 'DVC001', DeviceName: 'Thiết bị Check-in Cổng 1' },
            Location: { LocationID: 'LOC01', LocationName: 'Cổng chính' }
        };
        // Simulate not found
        if (id === '999') {
             throw new Error('Check-in not found');
        }
        return sampleData;
        // --- End Sample Data ---

        /*
        // Actual fetch call structure:
        try {
            const response = await fetch(url);
            if (!response.ok) {
                if (response.status === 404) {
                     throw new Error('Check-in not found');
                }
                throw new Error(`API error: ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            console.error("API fetch error:", error);
            throw error; // Re-throw to be caught by the caller
        }
        */
    };

    /**
     * Display check-in details on the page
     * @param {object} data - Check-in data object
     */
    const displayCheckinDetails = (data) => {
        if (!data) return;

        // User Info
        $elements.userAvatar.src = data.User?.Avatar || 'https://ui-avatars.com/api/?name=?&background=gray&color=fff';
        $elements.userAvatar.alt = data.User?.FullName || '';
        $elements.userFullname.textContent = data.User?.FullName || 'N/A';
        $elements.userEmail.textContent = data.User?.Email || 'N/A';
        $elements.userAccountId.textContent = data.User?.AccountId || 'N/A';
        // Update link to user detail page (adjust href based on actual user detail page)
        $elements.viewUserDetailLink.href = data.User?.AccountId ? `user-detail.html?id=${data.User.AccountId}` : '#';

        // Event Info
        $elements.eventName.textContent = data.Event?.EventName || 'N/A';
        $elements.eventId.textContent = data.Event?.EventID || 'N/A';
        // Update link to event detail page
        $elements.viewEventDetailLink.href = data.Event?.EventID ? `event-detail.html?id=${data.Event.EventID}` : '#';

        // Check-in Info
        $elements.checkinTime.textContent = formatDateTime(data.CheckInTime);
        $elements.deviceInfo.textContent = data.Device?.DeviceName ? `${data.Device.DeviceName} (ID: ${data.DeviceID})` : (data.DeviceID || 'N/A');
        $elements.locationInfo.textContent = data.Location?.LocationName ? `${data.Location.LocationName} (ID: ${data.LocationID})` : (data.LocationID || 'N/A');
        $elements.checkinStatus.textContent = data.Status || '-'; // Display Status if available
        $elements.checkinNotes.textContent = data.Notes || '-';   // Display Notes if available

        // Check-in Image
        if (data.HinhAnhCheckIn) {
            $elements.checkinImage.src = data.HinhAnhCheckIn;
            $elements.checkinImage.alt = `Ảnh Check-in cho ${data.User?.FullName || 'người dùng'} tại ${data.Event?.EventName || 'sự kiện'}`;
            $elements.checkinImage.classList.remove('hidden');
            $elements.noImageText.classList.add('hidden');
        } else {
            $elements.checkinImage.classList.add('hidden');
            $elements.noImageText.classList.remove('hidden');
        }

        // Update Edit button link
        $elements.editButton.href = `checkin-edit.html?id=${data.ID}`;

        // Show the details container
        $elements.detailsContainer?.classList.remove('hidden');
    };

     // --- Sidebar and User Menu Setup (Copied from checkins.js) ---
    const setupSidebar = () => {
        const { sidebar, sidebarOpen, sidebarClose, sidebarBackdrop } = $elements;
        if (!sidebar || !sidebarOpen || !sidebarClose || !sidebarBackdrop) return;

        sidebarOpen.addEventListener('click', (e) => {
            e.stopPropagation();
            sidebar.classList.remove('-translate-x-full');
            sidebarBackdrop.classList.remove('hidden');
            document.body.classList.add('overflow-hidden', 'md:overflow-auto');
        });

        const closeSidebar = () => {
            sidebar.classList.add('-translate-x-full');
            sidebarBackdrop.classList.add('hidden');
            document.body.classList.remove('overflow-hidden', 'md:overflow-auto');
        };

        sidebarClose.addEventListener('click', closeSidebar);
        sidebarBackdrop.addEventListener('click', closeSidebar);
    };

    const setupUserMenu = () => {
        const { userMenuButton, userMenu, headerAvatar, headerFullname } = $elements;

        // TODO: Replace with actual user data from API or session
        const currentUser = {
            FullName: 'Admin User',
            Avatar: 'https://ui-avatars.com/api/?name=Admin+User&background=0D8ABC&color=fff'
        };

        if (headerAvatar) {
            headerAvatar.src = currentUser.Avatar;
            headerAvatar.alt = currentUser.FullName;
        }
        if (headerFullname) {
            headerFullname.textContent = currentUser.FullName;
        }

        if (userMenuButton && userMenu) {
             userMenuButton.addEventListener('click', (event) => {
                event.stopPropagation();
                const isVisible = !userMenu.classList.contains('invisible');
                if (isVisible) {
                    userMenu.classList.add('opacity-0', 'invisible', 'scale-95');
                    userMenu.classList.remove('group-hover:opacity-100', 'group-hover:visible', 'scale-100');
                } else {
                    userMenu.classList.remove('opacity-0', 'invisible', 'scale-95');
                    userMenu.classList.add('group-hover:opacity-100', 'group-hover:visible', 'scale-100');
                }
            });

            // Click outside to close
            document.addEventListener('click', (e) => {
                if (!userMenu.classList.contains('invisible') && !userMenuButton.contains(e.target) && !userMenu.contains(e.target)) {
                    userMenu.classList.add('opacity-0', 'invisible', 'scale-95');
                    userMenu.classList.remove('group-hover:opacity-100', 'group-hover:visible', 'scale-100');
                }
            });
        }
    };
     // --- End Sidebar and User Menu Setup ---


    /**
     * Initialize the page
     */
    const init = async () => {
        setupSidebar();
        setupUserMenu();
        AOS.init(); // Initialize AOS if used

        const checkinId = getCheckinIdFromUrl();

        if (!checkinId) {
            showError('Lỗi', 'Không tìm thấy ID của Check-in trong URL.');
            toggleLoading(false);
            return;
        }

        toggleLoading(true);

        try {
            const checkinData = await fetchCheckinDetails(checkinId);
            displayCheckinDetails(checkinData);
        } catch (error) {
            console.error("Failed to load check-in details:", error);
            showError('Lỗi tải dữ liệu', error.message === 'Check-in not found' ? 'Không tìm thấy thông tin check-in này.' : 'Có lỗi xảy ra khi tải chi tiết check-in.');
        } finally {
            toggleLoading(false);
        }
    };

    // Initialize the module when the DOM is ready
    document.addEventListener('DOMContentLoaded', init);

})(); // End IIFE 