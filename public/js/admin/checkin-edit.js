// IIFE to encapsulate the module
(function() {
    'use strict';

    // Constants
    const API_BASE_URL = '/api/checkins'; // TODO: Update with actual API endpoint
    let originalData = null; // Store original data to compare changes

    // DOM Elements Cache
    const $elements = {
        loadingIndicator: document.getElementById('loading-indicator'),
        editFormContainer: document.getElementById('edit-form-container'),
        editForm: document.getElementById('checkin-edit-form'),
        errorAlert: document.getElementById('error-alert'),
        errorMessage: document.getElementById('error-message'),
        errorDetail: document.getElementById('error-detail'),
        submitButton: document.getElementById('submit-btn'),
        submitSpinner: document.getElementById('submit-spinner'),
        cancelButton: document.getElementById('cancel-btn'),
        backToDetailButton: document.getElementById('back-to-detail-btn'),
        breadcrumbDetailLink: document.getElementById('breadcrumb-detail-link'),
        checkinIdDisplay: document.getElementById('checkin-id-display'),

        // Readonly Fields
        readonlyUser: document.getElementById('readonly-user'),
        readonlyEvent: document.getElementById('readonly-event'),
        readonlyCheckinTime: document.getElementById('readonly-checkin-time'),
        readonlyDevice: document.getElementById('readonly-device'),
        readonlyLocation: document.getElementById('readonly-location'),
        readonlyImageContainer: document.getElementById('readonly-image-container'),
        readonlyImage: document.getElementById('readonly-image'),
        readonlyNoImage: document.getElementById('readonly-no-image'),

        // Editable Fields
        checkinStatus: document.getElementById('checkin-status'),
        checkinNotes: document.getElementById('checkin-notes'),

        // Sidebar and Header elements
        sidebar: document.getElementById('sidebar'),
        sidebarOpen: document.getElementById('sidebar-open'),
        sidebarClose: document.getElementById('sidebar-close'),
        sidebarBackdrop: document.getElementById('sidebar-backdrop'),
        userMenuButton: document.getElementById('user-menu-button'),
        userMenu: document.getElementById('user-menu'),
        headerAvatar: document.getElementById('header-avatar'),
        headerFullname: document.getElementById('header-fullname'),
    };

    // Helper Functions
    const formatDateTime = (dateTimeString) => {
        if (!dateTimeString) return '-';
        try {
            const date = new Date(dateTimeString);
            // Sử dụng moment.js nếu đã import, nếu không dùng Date object
            if (typeof moment !== 'undefined') {
                 return moment(date).format('DD/MM/YYYY HH:mm');
            }
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

    const getCheckinIdFromUrl = () => {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('id');
    };

    const toggleLoading = (show) => {
        if (show) {
            $elements.loadingIndicator?.classList.remove('hidden');
            $elements.editFormContainer?.classList.add('hidden');
            $elements.errorAlert?.classList.add('hidden');
        } else {
            $elements.loadingIndicator?.classList.add('hidden');
        }
    };

     const toggleSubmitSpinner = (show) => {
        if (show) {
            $elements.submitSpinner?.classList.remove('hidden');
            $elements.submitButton?.classList.add('opacity-75');
            $elements.submitButton.disabled = true;
        } else {
            $elements.submitSpinner?.classList.add('hidden');
            $elements.submitButton?.classList.remove('opacity-75');
            // Re-enable submit button only if there are changes
            enableSubmitIfChanged();
        }
    };

    const showError = (message, detail) => {
        $elements.errorMessage.textContent = message || 'Lỗi!';
        $elements.errorDetail.textContent = detail || 'Không thể thực hiện yêu cầu.';
        $elements.errorAlert?.classList.remove('hidden');
        $elements.editFormContainer?.classList.add('hidden');
    };

    // API Functions (Placeholders)
    const fetchCheckinDetails = async (id) => {
        // TODO: Replace with actual API call
        console.log(`Fetching details for check-in ID: ${id} for editing`);
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
            Status: 'Success',
            Notes: 'Check-in thành công tại cổng chính.',
            User: { AccountId: 'U001', FullName: 'Nguyễn Văn An', Email: 'an.nv@example.com' },
            Event: { EventID: 1, EventName: 'Hội thảo AI 2024' },
            Device: { DeviceID: 'DVC001', DeviceName: 'Thiết bị Check-in Cổng 1' },
            Location: { LocationID: 'LOC01', LocationName: 'Cổng chính' }
        };
        if (id === '999') throw new Error('Check-in not found');
        originalData = { ...sampleData }; // Store original data
        return sampleData;
        // --- End Sample Data ---
    };

    const updateCheckin = async (id, updatedData) => {
        // TODO: Replace with actual API call (PATCH or PUT)
        console.log(`Updating check-in ID: ${id} with data:`, updatedData);
        const url = `${API_BASE_URL}/${id}`;

        // --- Simulate API Call --- Replace with fetch()
        await new Promise(resolve => setTimeout(resolve, 700)); // Simulate network delay
        // Simulate potential error
        // if (Math.random() < 0.2) { // 20% chance of error
        //     throw new Error('Failed to update check-in. Please try again.');
        // }
        console.log('Update successful (simulated)');
        return { success: true, message: 'Cập nhật thành công!', data: { ...originalData, ...updatedData } };
        // --- End Simulation ---

        /*
        // Actual fetch structure (PATCH example)
        try {
            const response = await fetch(url, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    // Add authentication headers if needed
                },
                body: JSON.stringify(updatedData)
            });
            if (!response.ok) {
                const errorBody = await response.text();
                throw new Error(`API update error: ${response.statusText} - ${errorBody}`);
            }
            const result = await response.json();
            return { success: true, message: 'Cập nhật thành công!', data: result };
        } catch (error) {
             console.error("API update error:", error);
             throw error;
        }
        */
    };


    // Form Handling Functions
    const populateForm = (data) => {
        if (!data) return;
        const checkinId = getCheckinIdFromUrl();
        const detailUrl = `checkin-detail.html?id=${checkinId}`;

        $elements.checkinIdDisplay.textContent = data.ID || 'N/A';

        // Update back button and breadcrumb links
        $elements.backToDetailButton.href = detailUrl;
        $elements.breadcrumbDetailLink.href = detailUrl;
        $elements.cancelButton.onclick = () => { window.location.href = detailUrl; };

        // Populate Readonly fields
        $elements.readonlyUser.textContent = `${data.User?.FullName || 'N/A'} (${data.User?.AccountId || 'N/A'})`;
        $elements.readonlyEvent.textContent = `${data.Event?.EventName || 'N/A'} (ID: ${data.Event?.EventID || 'N/A'})`;
        $elements.readonlyCheckinTime.textContent = formatDateTime(data.CheckInTime);
        $elements.readonlyDevice.textContent = data.Device?.DeviceName ? `${data.Device.DeviceName} (${data.DeviceID})` : (data.DeviceID || 'N/A');
        $elements.readonlyLocation.textContent = data.Location?.LocationName ? `${data.Location.LocationName} (${data.LocationID})` : (data.LocationID || 'N/A');

        if (data.HinhAnhCheckIn) {
            $elements.readonlyImage.src = data.HinhAnhCheckIn;
            $elements.readonlyImage.alt = `Ảnh Check-in cho ${data.User?.FullName || 'N/A'}`;
            $elements.readonlyImage.classList.remove('hidden');
            $elements.readonlyNoImage.classList.add('hidden');
        } else {
             $elements.readonlyImage.classList.add('hidden');
             $elements.readonlyNoImage.classList.remove('hidden');
        }

        // Populate Editable fields
        $elements.checkinStatus.value = data.Status || '';
        $elements.checkinNotes.value = data.Notes || '';

        // Show the form
        $elements.editFormContainer?.classList.remove('hidden');

        // Attach event listeners to editable fields to detect changes
        [$elements.checkinStatus, $elements.checkinNotes].forEach(el => {
            el.addEventListener('input', enableSubmitIfChanged);
            el.addEventListener('change', enableSubmitIfChanged);
        });
    };

     const collectFormData = () => {
        const formData = {};
        const currentStatus = $elements.checkinStatus.value;
        const currentNotes = $elements.checkinNotes.value.trim();

        // Only include fields that have changed
        if (originalData && currentStatus !== originalData.Status) {
            formData.Status = currentStatus;
        }
        if (originalData && currentNotes !== (originalData.Notes || '')) {
            formData.Notes = currentNotes;
        }

        return formData;
    };

     const enableSubmitIfChanged = () => {
         if (!originalData) {
             $elements.submitButton.disabled = true;
             return;
         }
         const currentStatus = $elements.checkinStatus.value;
         const currentNotes = $elements.checkinNotes.value.trim();
         const hasChanged = currentStatus !== originalData.Status || currentNotes !== (originalData.Notes || '');
         $elements.submitButton.disabled = !hasChanged;
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        const checkinId = getCheckinIdFromUrl();
        const updatedData = collectFormData();

        if (Object.keys(updatedData).length === 0) {
            // No changes detected, maybe show a message or do nothing
            console.log("No changes detected.");
            // Optionally redirect back to detail page
            // window.location.href = `checkin-detail.html?id=${checkinId}`;
            alert('Không có thay đổi nào để lưu.');
            return;
        }

        toggleSubmitSpinner(true);
        $elements.errorAlert?.classList.add('hidden'); // Hide previous errors

        try {
            const result = await updateCheckin(checkinId, updatedData);
            if (result.success) {
                alert(result.message || 'Cập nhật thành công!');
                // Update originalData in case user wants to make more changes
                originalData = { ...originalData, ...updatedData };
                enableSubmitIfChanged(); // Disable submit button again as changes are saved
                // Optionally redirect to detail page after a short delay
                setTimeout(() => {
                     window.location.href = `checkin-detail.html?id=${checkinId}`;
                }, 1000);
            } else {
                 showError('Cập nhật thất bại', result.message || 'Không thể lưu thay đổi.');
            }
        } catch (error) {
            console.error("Update failed:", error);
            showError('Lỗi cập nhật', error.message || 'Có lỗi xảy ra khi lưu thay đổi.');
        } finally {
            toggleSubmitSpinner(false);
        }
    };

    // Sidebar and User Menu Setup Functions (copied from checkin-detail.js)
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
        const currentUser = { FullName: 'Admin User', Avatar: 'https://ui-avatars.com/api/?name=Admin+User&background=0D8ABC&color=fff' }; // Placeholder
        if (headerAvatar) { headerAvatar.src = currentUser.Avatar; headerAvatar.alt = currentUser.FullName; }
        if (headerFullname) { headerFullname.textContent = currentUser.FullName; }
        if (userMenuButton && userMenu) {
             userMenuButton.addEventListener('click', (event) => {
                event.stopPropagation();
                const isVisible = !userMenu.classList.contains('invisible');
                userMenu.classList.toggle('opacity-0', !isVisible);
                userMenu.classList.toggle('invisible', !isVisible);
                userMenu.classList.toggle('scale-95', !isVisible);
                userMenu.classList.toggle('scale-100', isVisible);
            });
            document.addEventListener('click', (e) => {
                if (!userMenu.classList.contains('invisible') && !userMenuButton.contains(e.target) && !userMenu.contains(e.target)) {
                    userMenu.classList.add('opacity-0', 'invisible', 'scale-95');
                    userMenu.classList.remove('scale-100');
                }
            });
        }
    };

    /**
     * Initialize the page
     */
    const init = async () => {
        setupSidebar();
        setupUserMenu();
        AOS.init();

        const checkinId = getCheckinIdFromUrl();
        if (!checkinId) {
            showError('Lỗi', 'Không tìm thấy ID của Check-in trong URL.');
            return;
        }

        toggleLoading(true);
        try {
            const checkinData = await fetchCheckinDetails(checkinId);
            populateForm(checkinData);
            // Initially disable submit button until changes are made
            $elements.submitButton.disabled = true;
        } catch (error) {
            console.error("Failed to load check-in details for editing:", error);
            showError('Lỗi tải dữ liệu', error.message === 'Check-in not found' ? 'Không tìm thấy thông tin check-in này.' : 'Có lỗi xảy ra khi tải dữ liệu.');
        } finally {
            toggleLoading(false);
        }

        // Add form submit listener
        $elements.editForm?.addEventListener('submit', handleFormSubmit);
    };

    // Initialize the module when the DOM is ready
    document.addEventListener('DOMContentLoaded', init);

})(); // End IIFE 