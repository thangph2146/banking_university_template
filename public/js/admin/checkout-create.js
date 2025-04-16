/**
 * Module quản lý tạo mới Check-out thủ công
 */
const CheckoutCreateManager = (function() {
    'use strict';

    // Constants
    const API_BASE_URL = '/api/admin'; // Base URL for Admin APIs
    const CHECKOUT_API_URL = `${API_BASE_URL}/checkouts`;
    const EVENTS_API_URL = `${API_BASE_URL}/events?limit=all`; // Get all events for selection
    // API to get checked-in users for an event who haven't checked out yet
    const EVENT_CHECKED_IN_USERS_API_URL = (eventId) => `${API_BASE_URL}/events/${eventId}/checkins?status=active&needs_checkout=true`;

    // DOM Elements Cache
    const $elements = {
        loadingIndicator: document.getElementById('loading-indicator'),
        createFormContainer: document.getElementById('create-form-container'),
        createForm: document.getElementById('checkout-create-form'),
        errorAlert: document.getElementById('error-alert'),
        errorMessage: document.getElementById('error-message'),
        errorDetail: document.getElementById('error-detail'),
        submitButton: document.getElementById('submit-btn'),
        submitSpinner: document.getElementById('submit-spinner'),
        resetButton: document.getElementById('reset-btn'),
        backToListButton: document.getElementById('back-to-list-btn'),

        // Form Fields
        eventSelect: document.getElementById('event'),
        userSelect: document.getElementById('user'), // Select for checked-in users
        userLoadingText: document.getElementById('user-loading-text'),
        checkoutTimeInput: document.getElementById('checkout-time'),
        checkoutNotesTextarea: document.getElementById('checkout-notes'),
        checkoutTypeInput: document.getElementById('checkout-type'), // Hidden input

        // Sidebar and Header elements (assuming IDs from checkouts.js)
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
            enableSubmitIfValid(); // Re-check validity before enabling
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

    const hideError = () => {
        $elements.errorAlert?.classList.add('hidden');
    };

    // API Functions (Placeholders with simulated data)
    const fetchData = async (url, errorMessage) => {
        try {
            console.log(`Fetching data from: ${url}`);
            await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network delay

            if (url.includes('/events')) {
                 // Simulate fetching events
                 return {
                     data: [
                        { id: 1, name: 'Hội thảo AI 2024' },
                        { id: 2, name: 'Workshop Marketing Online' },
                        { id: 3, name: 'Team Building 2024' }, // Event with potentially no checked-in users
                     ],
                     total: 3
                 };
            } else if (url.includes('/checkins')) {
                // Simulate fetching checked-in users for a specific event
                const eventId = url.split('/')[4]; // Extract event ID
                console.log("Simulating fetch checked-in users for event:", eventId);
                if (eventId === '1') return {
                    data: [
                        { checkin_id: 1, accountId: 'U001', fullname: 'Nguyễn Văn An', email: 'an.nv@example.com' },
                        // User U002 already checked out in checkouts.js sample
                        { checkin_id: 3, accountId: 'U003', fullname: 'Lê Văn Cường', email: 'cuong.lv@example.com' },
                    ],
                    total: 2
                };
                if (eventId === '2') return { data: [], total: 0 }; // No active checkins needing checkout
                if (eventId === '3') return {
                    data: [
                        { checkin_id: 4, accountId: 'U004', fullname: 'Phạm Thị Dung', email: 'dung.pt@example.com' },
                    ],
                     total: 1
                 };
                 return { data: [], total: 0 }; // Default empty
            }
            return { data: [], total: 0 };

            /* // Actual Fetch Structure:
            const response = await fetch(url);
            if (!response.ok) {
                const errorBody = await response.text();
                throw new Error(`${errorMessage}: ${response.statusText} - ${errorBody}`);
            }
            return await response.json(); // Expects { data: [], total: number } structure
            */
        } catch (error) {
            console.error(`Error fetching data from ${url}:`, error);
            showError(errorMessage, error.message);
            throw error;
        }
    };

    const createCheckout = async (data) => {
         console.log('Creating check-out with data:', data);
         // TODO: Replace with actual API POST call to CHECKOUT_API_URL
         await new Promise(resolve => setTimeout(resolve, 700)); // Simulate network delay
         // Simulate success
         console.log('Check-out created successfully (simulated)');
         // Check for potential conflicts (e.g., already checked out - backend should handle this)
         // if (data.CheckInID === 1) { // Simulate conflict
         //     throw new Error("Người dùng này đã được check-out rồi.");
         // }
         return { success: true, message: 'Check-out đã được tạo thành công!' };
         /* // Actual Fetch Structure:
         try {
            const response = await fetch(CHECKOUT_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // Add auth headers if needed
                },
                body: JSON.stringify(data)
            });
             const result = await response.json(); // Read body once
             if (!response.ok) {
                const errorMsg = result?.message || result?.error || `API create error: ${response.statusText}`;
                throw new Error(errorMsg);
            }
            return { success: true, message: result.message || 'Check-out đã được tạo thành công!', data: result.data };
         } catch (error) {
            console.error('API create error:', error);
            throw error;
         }
         */
    };

    // Initialization Functions
    const initializeSelect2 = () => {
        if (typeof $ !== 'undefined' && $.fn.select2) {
             const commonOptions = {
                 allowClear: true,
                 width: '100%', // Ensure select2 takes full width
                 theme: 'bootstrap-5' // Assuming you want a Bootstrap 5 theme (or remove/change)
             };

             // Initialize Event Select
             $($elements.eventSelect).select2({
                 ...commonOptions,
                 placeholder: 'Chọn sự kiện'
             });

             // Initialize User Select (initially disabled)
             $($elements.userSelect).select2({
                 ...commonOptions,
                 placeholder: 'Vui lòng chọn sự kiện trước', // Initial placeholder when disabled
                 language: {
                     searching: function() { return 'Đang tìm kiếm...'; },
                     noResults: function() { return 'Không tìm thấy kết quả'; },
                     loadingMore: function() { return 'Đang tải thêm kết quả...'; }
                 }
                 // Search will be implicitly enabled if the <select> has many options,
                 // or we can force it if needed, but Select2 usually handles this well.
             });
        } else {
            console.warn('jQuery or Select2 not loaded.');
        }
    };

    const populateSelect = (selectElement, data, valueField, textField, placeholderOption) => {
        if (!selectElement) return;
        selectElement.innerHTML = ''; // Clear existing options
        if (placeholderOption) {
             selectElement.appendChild(placeholderOption);
        }

        data.forEach(item => {
            const option = document.createElement('option');
            option.value = item[valueField]; // e.g., checkin_id
            option.textContent = typeof textField === 'function' ? textField(item) : item[textField];
            // Store additional data needed for submission
            if (item.accountId) option.dataset.accountId = item.accountId;
            if (item.email) option.dataset.email = item.email;
            if (item.fullname) option.dataset.fullname = item.fullname;
            selectElement.appendChild(option);
        });

        if (typeof $ !== 'undefined' && $.fn.select2) {
            $(selectElement).val(null).trigger('change.select2'); // Reset value and trigger Select2 update
        }
    };

    const loadInitialData = async () => {
        try {
             toggleLoading(true);
             const eventsResponse = await fetchData(EVENTS_API_URL, 'Lỗi tải danh sách sự kiện');
             const events = eventsResponse?.data || [];

            // Populate Events Select
            const eventPlaceholder = document.createElement('option');
            eventPlaceholder.value = '';
            eventPlaceholder.textContent = 'Chọn sự kiện';
            populateSelect($elements.eventSelect, events, 'id', 'name', eventPlaceholder);

            setDefaultCheckoutTime();

        } catch (error) {
             console.error("Error loading initial data:", error);
        } finally {
             toggleLoading(false);
        }
    };

    // Renamed function to reflect its purpose
    const loadCheckedInUsersForEvent = async (eventId) => {
        const userPlaceholderDefault = 'Vui lòng chọn sự kiện trước';
        const userPlaceholderLoading = 'Đang tải người dùng...';
        const userPlaceholderSelect = 'Chọn người dùng';
        const userPlaceholderNoUsers = 'Không có người dùng nào cần check-out';
        const userSelect = $elements.userSelect;
        // const userLoadingText = $elements.userLoadingText; // Removed as per HTML changes

        // Reset and disable user select, set loading placeholder
        userSelect.innerHTML = ''; // Clear existing options completely first
        userSelect.disabled = true;
        if (typeof $ !== 'undefined' && $.fn.select2) {
            // Set placeholder while disabled/loading
            $(userSelect).select2({
                 placeholder: eventId ? userPlaceholderLoading : userPlaceholderDefault,
                 allowClear: true,
                 width: '100%',
                 theme: 'bootstrap-5', // Match theme
                 language: { // Keep language settings
                     searching: function() { return 'Đang tìm kiếm...'; },
                     noResults: function() { return 'Không tìm thấy kết quả'; },
                     loadingMore: function() { return 'Đang tải thêm kết quả...'; }
                 }
            });
            $(userSelect).val(null).trigger('change.select2'); // Reset value
        }
        // userLoadingText?.classList.add('hidden'); // Removed

        if (!eventId) {
            enableSubmitIfValid(); // Re-check validity (will likely disable submit)
            return; // Exit if no eventId
        }

        // userLoadingText?.classList.remove('hidden'); // Removed

        try {
            const apiUrl = EVENT_CHECKED_IN_USERS_API_URL(eventId);
            const response = await fetchData(apiUrl, 'Lỗi tải danh sách người dùng đã check-in');
            const users = response?.data || [];

            if (users.length > 0) {
                // Populate users
                const userOptionPlaceholder = document.createElement('option');
                userOptionPlaceholder.value = '';
                userOptionPlaceholder.textContent = userPlaceholderSelect; // Placeholder for selection
                populateSelect(
                    userSelect,
                    users,
                    'checkin_id', // Value is the checkin_id
                    (user) => `${user.fullname} (${user.accountId || 'N/A'} - ${user.email || 'N/A'})`, // Display text
                    userOptionPlaceholder // Add the placeholder
                );
                userSelect.disabled = false; // Enable select
                 // Update Select2 config after populating and enabling
                 if (typeof $ !== 'undefined' && $.fn.select2) {
                    $(userSelect).select2('destroy'); // Important: Destroy before re-initializing
                    $(userSelect).select2({
                        placeholder: userPlaceholderSelect,
                        allowClear: true,
                        width: '100%',
                        theme: 'bootstrap-5',
                        language: {
                            searching: function() { return 'Đang tìm kiếm...'; },
                            noResults: function() { return 'Không tìm thấy kết quả'; },
                            loadingMore: function() { return 'Đang tải thêm kết quả...'; }
                        }
                    });
                    $(userSelect).val(null).trigger('change.select2'); // Ensure placeholder shows
                 }
            } else {
                // No users found, keep disabled, update placeholder
                userSelect.innerHTML = ''; // Clear just in case
                userSelect.disabled = true;
                if (typeof $ !== 'undefined' && $.fn.select2) {
                     $(userSelect).select2('destroy');
                     $(userSelect).select2({
                        placeholder: userPlaceholderNoUsers,
                        allowClear: false, // No point clearing if empty
                        width: '100%',
                        theme: 'bootstrap-5',
                        language: { noResults: function() { return 'Không tìm thấy kết quả'; } } // Keep relevant lang
                    });
                     $(userSelect).val(null).trigger('change.select2');
                }
            }
        } catch (error) {
            console.error("Error loading checked-in users:", error);
            showError('Lỗi tải người dùng', 'Không thể tải danh sách người dùng cho sự kiện này.');
            // Keep select disabled, show default placeholder
             userSelect.innerHTML = '';
             userSelect.disabled = true;
             if (typeof $ !== 'undefined' && $.fn.select2) {
                 $(userSelect).select2('destroy');
                 $(userSelect).select2({
                    placeholder: userPlaceholderDefault,
                    allowClear: true,
                    width: '100%',
                    theme: 'bootstrap-5',
                    language: { noResults: function() { return 'Không tìm thấy kết quả'; } }
                 });
                 $(userSelect).val(null).trigger('change.select2');
             }
        } finally {
            // userLoadingText?.classList.add('hidden'); // Removed
            enableSubmitIfValid(); // Re-evaluate submit button state
        }
    };

    const setDefaultCheckoutTime = () => {
        if (!$elements.checkoutTimeInput) return;
        const now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset()); // Adjust for local timezone
        try {
            $elements.checkoutTimeInput.value = now.toISOString().slice(0, 16);
        } catch (e) {
            console.error("Failed to set default checkout time", e);
            // Fallback or handle error
        }
    };

     // Form Validation and Submission
    const validateForm = () => {
        hideError();
        let isValid = true;
        const highlightClass = 'border-red-500'; // Class to highlight errors

        // Clear previous highlights
        $elements.eventSelect?.parentElement.querySelector('.select2-selection')?.classList.remove(highlightClass);
        $elements.userSelect?.parentElement.querySelector('.select2-selection')?.classList.remove(highlightClass);
        $elements.checkoutTimeInput?.classList.remove(highlightClass);

        if (!$elements.eventSelect.value) {
            showError('Thiếu thông tin', 'Vui lòng chọn sự kiện.');
            $($elements.eventSelect)?.select2('open');
            $elements.eventSelect?.parentElement.querySelector('.select2-selection')?.classList.add(highlightClass);
            isValid = false;
        }
        if (isValid && !$elements.userSelect.value) {
            showError('Thiếu thông tin', 'Vui lòng chọn người dùng đã check-in.');
            if (!$elements.userSelect.disabled) {
                $($elements.userSelect)?.select2('open');
                $elements.userSelect?.parentElement.querySelector('.select2-selection')?.classList.add(highlightClass);
            }
            isValid = false;
        }
         if (isValid && !$elements.checkoutTimeInput.value) {
            showError('Thiếu thông tin', 'Vui lòng chọn thời gian check-out.');
            $elements.checkoutTimeInput?.classList.add(highlightClass);
            $elements.checkoutTimeInput?.focus();
            isValid = false;
        }

        return isValid;
    };

    const enableSubmitIfValid = () => {
         const isEventSelected = !!$elements.eventSelect?.value;
         const isUserSelected = !!$elements.userSelect?.value;
         const isTimeEntered = !!$elements.checkoutTimeInput?.value;
         $elements.submitButton.disabled = !(isEventSelected && isUserSelected && isTimeEntered);
    };

    const collectFormData = () => {
        const selectedUserOption = $elements.userSelect.options[$elements.userSelect.selectedIndex];
        const checkinId = parseInt($elements.userSelect.value); // Assumes option value is checkin_id
        const accountId = selectedUserOption?.dataset.accountId;
        const email = selectedUserOption?.dataset.email;
        const hoTen = selectedUserOption?.dataset.fullname;

        let checkoutTimeUTC = null;
        try {
            const localTime = new Date($elements.checkoutTimeInput.value);
            if (!isNaN(localTime)) {
                 checkoutTimeUTC = localTime.toISOString();
            }
        } catch(e) {
             console.error("Error parsing checkout time:", e);
        }

        return {
            su_kien_id: parseInt($elements.eventSelect.value),
            checkin_sukien_id: checkinId, // Link to the specific check-in record
            // accountId: accountId, // Send accountId if backend needs it
            email: email, // Send email associated with the check-in
            ho_ten: hoTen, // Send name associated with the check-in
            thoi_gian_check_out: checkoutTimeUTC, // Send UTC time
            checkout_type: 'manual', // Type is fixed
            ghi_chu: $elements.checkoutNotesTextarea.value.trim() || null,
             // Add other fields if needed by the API, e.g., admin_id
            // device_info: "Manual Admin",
            // location_data: "Manual Admin"
        };
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        if (!validateForm()) {
            return;
        }

        const formData = collectFormData();
        if (!formData.thoi_gian_check_out) {
             showError('Lỗi định dạng thời gian', 'Thời gian check-out không hợp lệ.');
            return;
        }

        toggleSubmitSpinner(true);

        try {
            const result = await createCheckout(formData);
            if (result.success) {
                alert(result.message || 'Tạo check-out thành công!');
                window.location.href = 'checkouts.html'; // Redirect to the list page
            } else {
                 // showError is likely called within createCheckout on failure
                 toggleSubmitSpinner(false);
            }
        } catch (error) {
            console.error("Create failed:", error);
            // Use the error message from the caught error if available
            showError('Lỗi tạo Check-out', error.message || 'Có lỗi không xác định xảy ra.');
            toggleSubmitSpinner(false);
        }
    };

    // Event Listeners
    const registerEventListeners = () => {
        $elements.createForm?.addEventListener('submit', handleFormSubmit);

        // Load users when event changes, using Select2 event
        if (typeof $ !== 'undefined' && $.fn.select2) {
            $($elements.eventSelect).on('change.select2', function() {
                const eventId = $(this).val();
                loadCheckedInUsersForEvent(eventId);
                enableSubmitIfValid();
            });
             // Enable submit button logic when user or time changes
            $($elements.userSelect).on('change.select2', enableSubmitIfValid);
            $elements.checkoutTimeInput?.addEventListener('input', enableSubmitIfValid);
        } else {
            // Fallback for native selects
            $elements.eventSelect?.addEventListener('change', (e) => {
                 loadCheckedInUsersForEvent(e.target.value);
                 enableSubmitIfValid();
             });
             $elements.userSelect?.addEventListener('change', enableSubmitIfValid);
             $elements.checkoutTimeInput?.addEventListener('input', enableSubmitIfValid);
        }

        $elements.resetButton?.addEventListener('click', () => {
            $elements.createForm.reset();
            setDefaultCheckoutTime();
             if (typeof $ !== 'undefined' && $.fn.select2) {
                $($elements.eventSelect).val(null).trigger('change.select2'); // This will also reset user list
             } else {
                 // Reset native selects
                 $elements.userSelect.innerHTML = '<option value="">--- Chọn sự kiện trước ---</option>';
                 $elements.userSelect.disabled = true;
             }
             hideError();
             enableSubmitIfValid(); // Should disable submit button
        });
    };

    // Sidebar and User Menu Setup (Assume functions exist from checkouts.js or similar)
    const setupSidebar = () => {
        const { sidebar, sidebarOpen, sidebarClose, sidebarBackdrop } = $elements;
        if (!sidebar || !sidebarOpen || !sidebarClose || !sidebarBackdrop) return;
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
        // Placeholder user data
        const currentUser = { FullName: 'Admin User', Avatar: 'https://ui-avatars.com/api/?name=Admin+User&background=0D8ABC&color=fff' };
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
        initializeSelect2();
        await loadInitialData();
        registerEventListeners();
        // Initially disable submit button & hide loading
        $elements.submitButton.disabled = true;
        toggleLoading(false); // Ensure loading is hidden after init
    };

    // Initialize the module when the DOM is ready
    document.addEventListener('DOMContentLoaded', init);

})(); // End IIFE 