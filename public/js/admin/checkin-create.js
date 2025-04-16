// IIFE to encapsulate the module
(function() {
    'use strict';

    // Constants
    const API_BASE_URL = '/api'; // Base URL for APIs
    const CHECKIN_API_URL = `${API_BASE_URL}/checkins`;
    const EVENTS_API_URL = `${API_BASE_URL}/events`;
    const DEVICES_API_URL = `${API_BASE_URL}/devices`; // TODO: Adjust endpoint if needed
    const LOCATIONS_API_URL = `${API_BASE_URL}/locations`; // TODO: Adjust endpoint if needed
    const EVENT_REGISTRANTS_API_URL = (eventId) => `${API_BASE_URL}/events/${eventId}/registrants`; // API to get registrants for an event

    // DOM Elements Cache
    const $elements = {
        loadingIndicator: document.getElementById('loading-indicator'),
        createFormContainer: document.getElementById('create-form-container'),
        createForm: document.getElementById('checkin-create-form'),
        errorAlert: document.getElementById('error-alert'),
        errorMessage: document.getElementById('error-message'),
        errorDetail: document.getElementById('error-detail'),
        submitButton: document.getElementById('submit-btn'),
        submitSpinner: document.getElementById('submit-spinner'),
        resetButton: document.getElementById('reset-btn'),
        backToListButton: document.getElementById('back-to-list-btn'),

        // Form Fields
        eventSelect: document.getElementById('event'),
        userSelect: document.getElementById('user'),
        userLoadingText: document.getElementById('user-loading-text'),
        checkinTimeInput: document.getElementById('checkin-time'),
        deviceSelect: document.getElementById('device'),
        locationSelect: document.getElementById('location'),
        checkinStatusSelect: document.getElementById('checkin-status'),
        checkinNotesTextarea: document.getElementById('checkin-notes'),

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
    const toggleLoading = (show) => {
        if (show) {
            $elements.loadingIndicator?.classList.remove('hidden');
            $elements.createFormContainer?.classList.add('hidden');
            $elements.errorAlert?.classList.add('hidden');
        } else {
            $elements.loadingIndicator?.classList.add('hidden');
             $elements.createFormContainer?.classList.remove('hidden');
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
            $elements.submitButton.disabled = false; // Re-enable after operation
        }
    };

    const showError = (message, detail) => {
        $elements.errorMessage.textContent = message || 'Lỗi!';
        $elements.errorDetail.textContent = detail || 'Không thể thực hiện yêu cầu.';
        $elements.errorAlert?.classList.remove('hidden');
         // Auto-hide after 5 seconds
        setTimeout(() => {
            $elements.errorAlert?.classList.add('hidden');
        }, 5000);
    };

    // API Functions (Placeholders)
    const fetchData = async (url, errorMessage) => {
        try {
            // TODO: Replace with actual fetch call
            console.log(`Fetching data from: ${url}`);
            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 300));

            if (url.includes('/events') && !url.includes('/registrants')) {
                 return [
                    { id: 1, name: 'Hội thảo AI 2024', start_date: '2024-09-15T09:00:00Z' },
                    { id: 2, name: 'Workshop Marketing Online', start_date: '2024-10-20T14:00:00Z' },
                    { id: 3, name: 'Sự kiện không có người đăng ký', start_date: '2024-11-01T18:30:00Z' },
                 ];
            } else if (url.includes('/registrants')) {
                const eventId = url.split('/')[3]; // Extract event ID
                 if (eventId === '1') return [
                    { accountId: 'U001', fullname: 'Nguyễn Văn An', email: 'an.nv@example.com' },
                    { accountId: 'U002', fullname: 'Trần Thị Bình', email: 'binh.tt@example.com' },
                 ];
                 if (eventId === '2') return [
                     { accountId: 'U003', fullname: 'Lê Văn Cường', email: 'cuong.lv@example.com' },
                 ];
                 return []; // No registrants for other events
            } else if (url.includes('/devices')) {
                 return [
                    { id: 'DVC001', name: 'Thiết bị Check-in Cổng 1' },
                    { id: 'DVC002', name: 'Thiết bị Check-in Cổng 2' },
                    { id: 'SCAN01', name: 'Máy quét QR Hội trường A' },
                 ];
            } else if (url.includes('/locations')) {
                 return [
                    { id: 'LOC01', name: 'Cổng chính' },
                    { id: 'LOC02', name: 'Hội trường A' },
                    { id: 'LOC03', name: 'Sảnh B' },
                 ];
            }
            return []; // Default empty array

            /* Actual fetch:
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`${errorMessage}: ${response.statusText}`);
            }
            return await response.json();
            */
        } catch (error) {
            console.error(`Error fetching data from ${url}:`, error);
            showError(errorMessage, error.message);
            throw error; // Re-throw to stop subsequent actions if needed
        }
    };

    const createCheckin = async (data) => {
         // TODO: Replace with actual API POST call
         console.log('Creating check-in with data:', data);
          await new Promise(resolve => setTimeout(resolve, 700)); // Simulate network delay
          // Simulate success
          console.log('Check-in created successfully (simulated)');
          return { success: true, message: 'Check-in đã được tạo thành công!' };
         /*
         try {
            const response = await fetch(CHECKIN_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // Add auth headers if needed
                },
                body: JSON.stringify(data)
            });
             if (!response.ok) {
                const errorBody = await response.text();
                throw new Error(`API create error: ${response.statusText} - ${errorBody}`);
            }
             const result = await response.json();
            return { success: true, message: 'Check-in đã được tạo thành công!', data: result };
         } catch (error) {
            console.error('API create error:', error);
            throw error;
         }
         */
    };

    // Initialization Functions
    const initializeSelect2 = () => {
        if (typeof $ !== 'undefined' && $.fn.select2) {
             $($elements.eventSelect).select2({ placeholder: 'Chọn sự kiện', allowClear: true });
             // Initialize user select2 but keep it disabled initially
             $($elements.userSelect).select2({ placeholder: '--- Chọn sự kiện trước ---', allowClear: true });
             $($elements.deviceSelect).select2({ placeholder: 'Không xác định / Thủ công', allowClear: true });
             $($elements.locationSelect).select2({ placeholder: 'Không xác định / Thủ công', allowClear: true });
        } else {
            console.warn('jQuery or Select2 not loaded.');
        }
    };

    const populateSelect = (selectElement, data, valueField, textField, placeholderOption) => {
        if (!selectElement) return;
        // Clear existing options (except the placeholder if provided)
        const firstOption = selectElement.options[0];
        selectElement.innerHTML = '';
        if (placeholderOption) {
             selectElement.appendChild(placeholderOption);
        }

        data.forEach(item => {
            const option = document.createElement('option');
            option.value = item[valueField];
            // Allow for complex text fields, e.g., combining name and email
            option.textContent = typeof textField === 'function' ? textField(item) : item[textField];
            selectElement.appendChild(option);
        });
         // Reset Select2 value if needed (especially for user dropdown)
        if (typeof $ !== 'undefined' && $.fn.select2) {
            $(selectElement).val(null).trigger('change');
        }
    };

    const loadInitialData = async () => {
        try {
             toggleLoading(true);
             // Fetch Events, Devices, Locations in parallel
            const [events, devices, locations] = await Promise.all([
                fetchData(EVENTS_API_URL, 'Lỗi tải danh sách sự kiện'),
                fetchData(DEVICES_API_URL, 'Lỗi tải danh sách thiết bị'),
                fetchData(LOCATIONS_API_URL, 'Lỗi tải danh sách vị trí')
            ]);

            // Populate Selects
            const eventPlaceholder = document.createElement('option');
            eventPlaceholder.value = '';
            eventPlaceholder.textContent = 'Chọn sự kiện';
            populateSelect($elements.eventSelect, events || [], 'id', 'name', eventPlaceholder);

             const devicePlaceholder = document.createElement('option');
             devicePlaceholder.value = '';
             devicePlaceholder.textContent = 'Không xác định / Thủ công';
             populateSelect($elements.deviceSelect, devices || [], 'id', 'name', devicePlaceholder);

             const locationPlaceholder = document.createElement('option');
             locationPlaceholder.value = '';
             locationPlaceholder.textContent = 'Không xác định / Thủ công';
             populateSelect($elements.locationSelect, locations || [], 'id', 'name', locationPlaceholder);

            // Set default check-in time to now
            setDefaultCheckinTime();

        } catch (error) {
             console.error("Error loading initial data:", error);
             // Error already shown by fetchData
        } finally {
             toggleLoading(false);
        }
    };

    const loadUsersForEvent = async (eventId) => {
        if (!eventId) {
            // Disable and clear user select if no event is selected
            $elements.userSelect.innerHTML = '<option value="">--- Chọn sự kiện trước ---</option>';
            $elements.userSelect.disabled = true;
            $elements.userLoadingText.classList.add('hidden');
             if (typeof $ !== 'undefined' && $.fn.select2) {
                 $($elements.userSelect).val(null).trigger('change');
                 $($elements.userSelect).select2({ placeholder: '--- Chọn sự kiện trước ---', allowClear: true });
             }
            return;
        }

        $elements.userLoadingText.classList.remove('hidden');
        $elements.userSelect.disabled = true;
         if (typeof $ !== 'undefined' && $.fn.select2) {
            $($elements.userSelect).val(null).trigger('change');
            $($elements.userSelect).select2({ placeholder: 'Đang tải người dùng...', allowClear: true });
         }

        try {
            const users = await fetchData(EVENT_REGISTRANTS_API_URL(eventId), 'Lỗi tải danh sách người dùng');
            const userPlaceholder = document.createElement('option');
            userPlaceholder.value = '';
            userPlaceholder.textContent = users.length > 0 ? 'Chọn người dùng' : 'Sự kiện này chưa có ai đăng ký';
            populateSelect($elements.userSelect, users || [], 'accountId', item => `${item.fullname} (${item.email})`, userPlaceholder);
            $elements.userSelect.disabled = users.length === 0;
             if (typeof $ !== 'undefined' && $.fn.select2) {
                $($elements.userSelect).select2({ placeholder: userPlaceholder.textContent, allowClear: true });
             }
        } catch (error) {
            console.error("Error loading users for event:", error);
            $elements.userSelect.innerHTML = '<option value="">Lỗi tải người dùng</option>';
             if (typeof $ !== 'undefined' && $.fn.select2) {
                 $($elements.userSelect).select2({ placeholder: 'Lỗi tải người dùng', allowClear: true });
             }
        } finally {
            $elements.userLoadingText.classList.add('hidden');
            enableSubmitIfValid(); // Check if form is now valid
        }
    };

    const setDefaultCheckinTime = () => {
        // Format: YYYY-MM-DDTHH:mm
        const now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset()); // Adjust for local timezone
        $elements.checkinTimeInput.value = now.toISOString().slice(0, 16);
    };

     // Form Validation and Submission
    const validateForm = () => {
        let isValid = true;
        $elements.errorAlert?.classList.add('hidden'); // Hide previous errors

        if (!$elements.eventSelect.value) {
            showError('Thiếu thông tin', 'Vui lòng chọn sự kiện.');
            // Highlight the select2 element if possible
            $($elements.eventSelect).select2('open');
            isValid = false;
        }
        if (isValid && !$elements.userSelect.value) {
            showError('Thiếu thông tin', 'Vui lòng chọn người dùng.');
            $($elements.userSelect).select2('open');
            isValid = false;
        }
         if (isValid && !$elements.checkinTimeInput.value) {
            showError('Thiếu thông tin', 'Vui lòng chọn thời gian check-in.');
            $elements.checkinTimeInput.focus();
            isValid = false;
        }

        return isValid;
    };

    const enableSubmitIfValid = () => {
         // Basic check: enable submit only if event and user are selected
         const isEventSelected = !!$elements.eventSelect.value;
         const isUserSelected = !!$elements.userSelect.value;
         const isTimeEntered = !!$elements.checkinTimeInput.value;
         $elements.submitButton.disabled = !(isEventSelected && isUserSelected && isTimeEntered);
    };

    const collectFormData = () => {
        // Format CheckInTime to ISO string (UTC)
        const localTime = new Date($elements.checkinTimeInput.value);
        const utcTime = localTime.toISOString();

        return {
            EventID: parseInt($elements.eventSelect.value),
            AccountID: $elements.userSelect.value, // Assuming value is AccountId
            CheckInTime: utcTime,
            DeviceID: $elements.deviceSelect.value || null,
            LocationID: $elements.locationSelect.value || null,
            Status: $elements.checkinStatusSelect.value,
            Notes: $elements.checkinNotesTextarea.value.trim(),
            // HinhAnhCheckIn is not included in manual creation for simplicity
        };
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        if (!validateForm()) {
            return;
        }

        const formData = collectFormData();
        toggleSubmitSpinner(true);

        try {
            const result = await createCheckin(formData);
            if (result.success) {
                alert(result.message || 'Tạo check-in thành công!');
                // Redirect to the check-ins list page
                 window.location.href = 'checkins.html';
            } else {
                 showError('Tạo thất bại', result.message || 'Không thể tạo check-in.');
                 toggleSubmitSpinner(false);
            }
        } catch (error) {
            console.error("Create failed:", error);
            showError('Lỗi tạo Check-in', error.message || 'Có lỗi xảy ra khi tạo check-in.');
            toggleSubmitSpinner(false);
        }
    };

    // Event Listeners
    const registerEventListeners = () => {
        $elements.createForm?.addEventListener('submit', handleFormSubmit);

        // Load users when event changes
        if (typeof $ !== 'undefined' && $.fn.select2) {
            $($elements.eventSelect).on('change', function() {
                const eventId = $(this).val();
                loadUsersForEvent(eventId);
                enableSubmitIfValid(); // Re-check validity
            });
            // Also enable submit button when user or time changes
             $($elements.userSelect).on('change', enableSubmitIfValid);
        } else {
            $elements.eventSelect?.addEventListener('change', (e) => {
                 loadUsersForEvent(e.target.value);
                 enableSubmitIfValid();
             });
             $elements.userSelect?.addEventListener('change', enableSubmitIfValid);
        }
         $elements.checkinTimeInput?.addEventListener('input', enableSubmitIfValid);

        $elements.resetButton?.addEventListener('click', () => {
            $elements.createForm.reset();
            setDefaultCheckinTime();
            // Reset Select2 elements
             if (typeof $ !== 'undefined' && $.fn.select2) {
                $($elements.eventSelect).val(null).trigger('change'); // This will also trigger user list reset
                $($elements.deviceSelect).val(null).trigger('change');
                $($elements.locationSelect).val(null).trigger('change');
                $($elements.checkinStatusSelect).val('Manual').trigger('change'); // Reset status to default
             } else {
                 // Reset native selects if Select2 is not used
                 $elements.userSelect.innerHTML = '<option value="">--- Chọn sự kiện trước ---</option>';
                 $elements.userSelect.disabled = true;
                 $elements.checkinStatusSelect.value = 'Manual';
             }
             $elements.errorAlert?.classList.add('hidden');
             enableSubmitIfValid(); // Disable submit after reset
        });
    };

    // Sidebar and User Menu Setup
    const setupSidebar = () => {
        const { sidebar, sidebarOpen, sidebarClose, sidebarBackdrop } = $elements;
        if (!sidebar || !sidebarOpen || !sidebarClose || !sidebarBackdrop) return;
        sidebarOpen.addEventListener('click', (e) => { /* ... */ });
        const closeSidebar = () => { /* ... */ };
        sidebarClose.addEventListener('click', closeSidebar);
        sidebarBackdrop.addEventListener('click', closeSidebar);
         // Implementation details omitted for brevity (copy from previous files)
         sidebarOpen.addEventListener('click', (e) => {
            e.stopPropagation();
            sidebar.classList.remove('-translate-x-full');
            sidebarBackdrop.classList.remove('hidden');
            document.body.classList.add('overflow-hidden', 'md:overflow-auto');
        });
        const close = () => {
            sidebar.classList.add('-translate-x-full');
            sidebarBackdrop.classList.add('hidden');
            document.body.classList.remove('overflow-hidden', 'md:overflow-auto');
        };
        sidebarClose.addEventListener('click', close);
        sidebarBackdrop.addEventListener('click', close);
    };

    const setupUserMenu = () => {
        const { userMenuButton, userMenu, headerAvatar, headerFullname } = $elements;
        const currentUser = { FullName: 'Admin User', Avatar: 'https://ui-avatars.com/api/?name=Admin+User&background=0D8ABC&color=fff' }; // Placeholder
        if (headerAvatar) { headerAvatar.src = currentUser.Avatar; headerAvatar.alt = currentUser.FullName; }
        if (headerFullname) { headerFullname.textContent = currentUser.FullName; }
        if (userMenuButton && userMenu) {
             userMenuButton.addEventListener('click', (event) => { /* ... */ });
             document.addEventListener('click', (e) => { /* ... */ });
             // Implementation details omitted for brevity (copy from previous files)
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
        initializeSelect2();
        await loadInitialData();
        registerEventListeners();
         // Initially disable submit button
         $elements.submitButton.disabled = true;
         // Hide loading indicator initially if it wasn't hidden by loadInitialData
         $elements.loadingIndicator?.classList.add('hidden');
         $elements.createFormContainer?.classList.remove('hidden');
    };

    // Initialize the module when the DOM is ready
    document.addEventListener('DOMContentLoaded', init);

})(); // End IIFE 