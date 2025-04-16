/**
 * Module quản lý chỉnh sửa Check-out
 */
const CheckoutEditManager = (function() {
    'use strict';

    // Constants & API Endpoints (Adjust as needed)
    const API_URL_BASE = '/api/checkouts'; // Base endpoint for checkouts
    // No need for EVENT or CHECKIN APIs here usually, as they are read-only
    const USER_TIMEZONE = 'Asia/Ho_Chi_Minh'; // Target timezone

    // DOM elements
    const $elements = {
        form: document.getElementById('checkout-edit-form'),
        checkoutIdInput: document.getElementById('checkout-id'), // Hidden input for ID
        checkoutIdDisplay: document.getElementById('checkout-id-display'), // Display span in header
        eventDisplay: document.getElementById('event-display'),
        checkinDisplay: document.getElementById('checkin-display'),
        checkinIdInput: document.getElementById('checkin-id'), // Hidden input if needed
        checkoutTimeInput: document.getElementById('checkout-time'),
        checkoutTypeSelect: document.getElementById('checkout-type'),
        faceImagePreview: document.getElementById('face-image-preview'),
        faceVerifiedSelect: document.getElementById('face-verified'),
        faceScoreInput: document.getElementById('face-score'),
        deviceInfoInput: document.getElementById('device-info'),
        locationDataInput: document.getElementById('location-data'),
        checkoutStatusSelect: document.getElementById('checkout-status'),
        checkoutNotesTextarea: document.getElementById('checkout-notes'),
        feedbackTextarea: document.getElementById('feedback'),
        ratingInput: document.getElementById('rating'),
        ratingContentTextarea: document.getElementById('rating-content'),
        attendanceDurationInput: document.getElementById('attendance-duration'),
        submitButton: document.getElementById('submit-btn'),
        deleteButton: document.getElementById('delete-btn'),
        submitSpinner: document.getElementById('submit-spinner'),
        backButton: document.getElementById('back-to-list-btn'),
        loadingIndicator: document.getElementById('loading-indicator'),
        formContainer: document.getElementById('edit-form-container'),
        errorAlert: document.getElementById('error-alert'),
        errorMessage: document.getElementById('error-message'),
        errorDetail: document.getElementById('error-detail'),
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
     * Initialize Select2 components if needed (only for editable selects)
     */
    const initSelect2 = () => {
        // Example: If checkout-type was Select2, initialize it here
        // if (jQuery().select2) {
        //     $($elements.checkoutTypeSelect).select2({
        //         minimumResultsForSearch: Infinity, // Disable search for simple selects
        //         theme: 'bootstrap-5'
        //     });
        // } else {
        //     console.warn('Select2 library not found.');
        // }
    };

    /**
     * Hiển thị/ẩn loading indicator
     */
    const toggleLoadingIndicator = (show) => {
        if ($elements.loadingIndicator && $elements.formContainer) {
            $elements.loadingIndicator.classList.toggle('hidden', !show);
            $elements.formContainer.classList.toggle('hidden', show);
        }
    };

    /**
     * Hiển thị/ẩn loading spinner trên nút submit
     */
    const toggleSubmitSpinner = (show) => {
        if ($elements.submitSpinner && $elements.submitButton) {
            $elements.submitSpinner.classList.toggle('hidden', !show);
            $elements.submitButton.disabled = show;
            if ($elements.deleteButton) $elements.deleteButton.disabled = show; // Disable delete too
        }
    };

    /**
     * Hiển thị thông báo lỗi
     */
    const showError = (message, detail) => {
        if ($elements.errorAlert && $elements.errorMessage && $elements.errorDetail) {
            $elements.errorMessage.textContent = message || 'Có lỗi xảy ra!';
            $elements.errorDetail.textContent = detail || 'Vui lòng kiểm tra lại thông tin và thử lại.';
            $elements.errorAlert.classList.remove('hidden');
        }
    };

    /**
     * Ẩn thông báo lỗi
     */
    const hideError = () => {
        if ($elements.errorAlert) {
            $elements.errorAlert.classList.add('hidden');
        }
    };

    /**
     * Populate form fields with existing checkout data
     * @param {object} data - Checkout data object
     */
    const populateForm = (data) => {
        if (!data) return;

        $elements.checkoutIdInput.value = data.checkout_sukien_id;
        $elements.checkoutIdDisplay.textContent = `#${data.checkout_sukien_id}`;
        // Display non-editable info (assuming Event/Checkin data is fetched with the checkout detail)
        $elements.eventDisplay.value = data.Event?.ten_su_kien || `ID: ${data.su_kien_id}` || 'N/A';
        $elements.checkinDisplay.value = `${data.ho_ten} (${data.email})` || `ID: ${data.checkin_sukien_id}` || 'N/A';
        $elements.checkinIdInput.value = data.checkin_sukien_id; // Store if needed for update logic

        // Set editable fields
        if (data.thoi_gian_check_out) {
             // Convert UTC ISO string back to local datetime-local format
             try {
                const localTime = moment.utc(data.thoi_gian_check_out).tz(USER_TIMEZONE).format('YYYY-MM-DDTHH:mm');
                $elements.checkoutTimeInput.value = localTime;
             } catch (e) {
                 console.error("Error parsing checkout time:", data.thoi_gian_check_out, e);
                 $elements.checkoutTimeInput.value = '';
             }
        } else {
             $elements.checkoutTimeInput.value = '';
        }

        $elements.checkoutTypeSelect.value = data.checkout_type || 'manual';
        $elements.faceVerifiedSelect.value = data.face_verified === true ? 'true' : 'false';
        $elements.faceScoreInput.value = data.face_match_score !== null ? data.face_match_score : '';
        $elements.deviceInfoInput.value = data.device_info || '';
        $elements.locationDataInput.value = data.location_data || '';
        $elements.checkoutStatusSelect.value = data.status !== null ? data.status : 1; // Default to 1 if null
        $elements.checkoutNotesTextarea.value = data.ghi_chu || '';
        $elements.feedbackTextarea.value = data.feedback || '';
        $elements.ratingInput.value = data.danh_gia || '';
        $elements.ratingContentTextarea.value = data.noi_dung_danh_gia || '';
        $elements.attendanceDurationInput.value = data.attendance_duration_minutes !== null ? data.attendance_duration_minutes : '';

        // Display Face Image Preview
        if (data.face_image_path) {
             $elements.faceImagePreview.innerHTML = `<img src="${data.face_image_path}" alt="Face ID Image" class="max-w-xs max-h-40 rounded border border-gray-200">`;
        } else {
             $elements.faceImagePreview.innerHTML = '<span class="text-gray-500 italic">Không có hình ảnh</span>';
        }

        // Trigger change for Select2 if needed
        if (jQuery().select2) {
            // $($elements.checkoutTypeSelect).trigger('change');
            // $($elements.checkoutStatusSelect).trigger('change');
        }
        toggleLoadingIndicator(false);
         $elements.submitButton.disabled = false; // Enable submit button after loading
    };

    /**
     * Fetch existing checkout data
     * @param {string} checkoutId
     */
    const fetchCheckoutData = (checkoutId) => {
        toggleLoadingIndicator(true);
        hideError();
        $elements.submitButton.disabled = true; // Disable submit while loading

        // TODO: Replace with actual API call GET /api/checkouts/{checkoutId}
        fetch(`${API_URL_BASE}/${checkoutId}`)
            .then(response => {
                if (!response.ok) {
                     if (response.status === 404) {
                        throw new Error(`Không tìm thấy check-out với ID: ${checkoutId}`);
                    }
                    throw new Error(`Lỗi ${response.status}: Không thể tải dữ liệu check-out.`);
                }
                return response.json();
            })
            .then(data => {
                populateForm(data);
            })
            .catch(error => {
                console.error('Error fetching checkout data:', error);
                showError('Lỗi tải dữ liệu', error.message);
                toggleLoadingIndicator(false);
                 // Optionally disable form elements if loading fails
                 $($elements.form).find('input, select, textarea, button').prop('disabled', true);
            });
         // --- Mock fetch --- 
         /*
         new Promise((resolve, reject) => {
             const sampleCheckouts = generateSampleCheckoutsForEdit(); // Use dedicated sample data
             const checkout = sampleCheckouts.find(c => c.checkout_sukien_id === parseInt(checkoutId));
             setTimeout(() => {
                 if (checkout) {
                     resolve(checkout);
                 } else {
                     reject(new Error(`Mock Error: Không tìm thấy check-out với ID: ${checkoutId}`));
                 }
             }, 500); 
         })
         .then(data => {
            populateForm(data);
         })
         .catch(error => {
             console.error('Error fetching checkout data:', error);
             showError('Lỗi tải dữ liệu', error.message);
             toggleLoadingIndicator(false);
         });
         */
         // ---
    };
    
    // Mock data generation specifically for edit form population (includes relations)
    const generateSampleCheckoutsForEdit = () => {
        const samples = [
            {
                checkout_sukien_id: 1, su_kien_id: 1, email: 'an.nv@example.com', ho_ten: 'Nguyễn Văn An', checkin_sukien_id: 101, dangky_sukien_id: 201,
                thoi_gian_check_out: '2024-07-27T10:30:00Z', checkout_type: 'manual', hinh_thuc_tham_gia: 'offline',
                device_info: 'Admin PC', location_data: 'Cổng chính', ip_address: '192.168.1.10', attendance_duration_minutes: 125,
                status: 1, ghi_chu: 'Check-out thủ công bởi admin.', feedback: 'Sự kiện rất bổ ích!', danh_gia: 5, noi_dung_danh_gia: 'Diễn giả trình bày hay, nội dung thực tế.',
                face_verified: null, face_match_score: null, face_image_path: null, created_at: '2024-07-27T10:30:10Z', updated_at: '2024-07-27T10:30:10Z',
                Event: { su_kien_id: 1, ten_su_kien: 'Hội thảo AI 2024' } // Include related data
            },
             {
                checkout_sukien_id: 2, su_kien_id: 2, email: 'binh.tt@example.com', ho_ten: 'Trần Thị Bình', checkin_sukien_id: 102, dangky_sukien_id: 202,
                thoi_gian_check_out: '2024-07-26T16:05:00Z', checkout_type: 'face_id', hinh_thuc_tham_gia: 'offline',
                device_info: 'Camera Cổng B', location_data: 'Cổng B', ip_address: '10.0.0.5', attendance_duration_minutes: 180,
                status: 1, ghi_chu: null, feedback: null, danh_gia: null, noi_dung_danh_gia: null,
                face_verified: true, face_match_score: 0.95, face_image_path: 'https://picsum.photos/seed/face2/100', created_at: '2024-07-26T16:05:15Z', updated_at: '2024-07-26T16:05:15Z',
                Event: { su_kien_id: 2, ten_su_kien: 'Workshop Marketing Online' }
            },
        ];
        return samples;
    };

    /**
     * Validate form data
     * @returns {boolean} - True if valid, false otherwise
     */
    const validateForm = () => {
        hideError();
        let isValid = true;

        if (!$elements.checkoutTimeInput.value) {
            showError('Thiếu thông tin', 'Vui lòng nhập thời gian check-out.');
            $elements.checkoutTimeInput.classList.add('border-red-500');
            $elements.checkoutTimeInput.focus();
            isValid = false;
        } else {
            $elements.checkoutTimeInput.classList.remove('border-red-500');
        }

        // Validate rating if entered
        if (isValid && $elements.ratingInput.value) {
            const rating = parseInt($elements.ratingInput.value);
            if (isNaN(rating) || rating < 1 || rating > 5) {
                 showError('Đánh giá không hợp lệ', 'Vui lòng nhập số từ 1 đến 5.');
                 $elements.ratingInput.classList.add('border-red-500');
                 $elements.ratingInput.focus();
                 isValid = false;
            } else {
                 $elements.ratingInput.classList.remove('border-red-500');
            }
        }
        
         // Validate face score if entered
         if (isValid && $elements.faceScoreInput.value) {
            const score = parseFloat($elements.faceScoreInput.value);
            if (isNaN(score) || score < 0 || score > 1) {
                 showError('Điểm khớp Face ID không hợp lệ', 'Vui lòng nhập số từ 0 đến 1.');
                 $elements.faceScoreInput.classList.add('border-red-500');
                 $elements.faceScoreInput.focus();
                 isValid = false;
            } else {
                 $elements.faceScoreInput.classList.remove('border-red-500');
            }
        }

        // Add more validation rules as needed for other fields

        return isValid;
    };

    /**
     * Collect form data for submission
     * @returns {Object|null} - Form data object or null if ID missing
     */
    const collectFormData = () => {
        const checkoutId = $elements.checkoutIdInput.value;
        if (!checkoutId) {
             showError('Lỗi', 'Không tìm thấy ID Check-out để cập nhật.');
             return null;
        }

        // Convert local datetime-local value to UTC ISO string
        const localCheckoutTime = $elements.checkoutTimeInput.value;
        const utcCheckoutTime = localCheckoutTime ? moment(localCheckoutTime).utc().toISOString() : null;

        return {
            // Include only fields that should be updated
            // checkout_sukien_id: parseInt(checkoutId), // ID is usually in the URL for PUT/PATCH
            thoi_gian_check_out: utcCheckoutTime,
            checkout_type: $elements.checkoutTypeSelect.value,
            face_verified: $elements.faceVerifiedSelect.value === 'true',
            face_match_score: $elements.faceScoreInput.value !== '' ? parseFloat($elements.faceScoreInput.value) : null,
            device_info: $elements.deviceInfoInput.value.trim() || null,
            location_data: $elements.locationDataInput.value.trim() || null,
            status: parseInt($elements.checkoutStatusSelect.value),
            ghi_chu: $elements.checkoutNotesTextarea.value.trim() || null,
            feedback: $elements.feedbackTextarea.value.trim() || null,
            danh_gia: $elements.ratingInput.value ? parseInt($elements.ratingInput.value) : null,
            noi_dung_danh_gia: $elements.ratingContentTextarea.value.trim() || null,
            attendance_duration_minutes: $elements.attendanceDurationInput.value !== '' ? parseInt($elements.attendanceDurationInput.value) : null,
             // Fields usually NOT updated: su_kien_id, checkin_sukien_id, email, ho_ten, dangky_sukien_id, ip_address, hinh_thuc_tham_gia
        };
    };

    /**
     * Handle form submission for update
     * @param {Event} e - Submit event
     */
    const handleFormSubmit = (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        const formData = collectFormData();
        const checkoutId = $elements.checkoutIdInput.value;
        if (!formData || !checkoutId) return; // Errors shown

        console.log('Updating checkout data:', checkoutId, formData);
        toggleSubmitSpinner(true);
        hideError();

        // TODO: Replace with actual API call PUT or PATCH /api/checkouts/{checkoutId}
        fetch(`${API_URL_BASE}/${checkoutId}`, {
            method: 'PUT', // Or 'PATCH' if only sending changed fields
            headers: {
                'Content-Type': 'application/json',
                // 'Authorization': 'Bearer YOUR_TOKEN'
            },
            body: JSON.stringify(formData)
        })
        .then(response => {
             if (!response.ok) {
                 return response.json().then(err => {
                     throw new Error(err.message || `HTTP error! status: ${response.status}`);
                 }).catch(() => {
                     throw new Error(`HTTP error! status: ${response.status}`);
                 });
             }
             return response.json(); // Or handle 204 No Content if API returns that
        })
        .then(data => {
            console.log('Checkout updated successfully:', data);
            alert('Cập nhật Check-out thành công!');
            // Optionally redirect back to detail page or list page
            window.location.href = `checkout-detail.html?id=${checkoutId}`; // Redirect to detail
        })
        .catch(error => {
            console.error('Error updating checkout:', error);
            showError('Lỗi cập nhật Check-out', error.message || 'Đã có lỗi xảy ra. Vui lòng thử lại.');
            toggleSubmitSpinner(false);
        });

        // --- Mock Success --- 
        /*
        setTimeout(() => {
            toggleSubmitSpinner(false);
            alert('Check-out đã được cập nhật thành công! (Giả lập)');
            window.location.href = `checkout-detail.html?id=${checkoutId}`;
        }, 1000);
        */
       // ---
    };

    /**
     * Handle delete button click
     */
    const handleDeleteClick = () => {
         const checkoutId = $elements.checkoutIdInput.value;
         if (!checkoutId) {
              showError('Lỗi', 'Không tìm thấy ID Check-out để xóa.');
              return;
         }

         if (confirm(`Bạn có chắc chắn muốn xóa vĩnh viễn Check-out ID: ${checkoutId}? Thao tác này không thể hoàn tác.`)) {
             console.log('Deleting checkout:', checkoutId);
             toggleSubmitSpinner(true); // Disable buttons during delete
             hideError();

             // TODO: Replace with actual API call DELETE /api/checkouts/{checkoutId}
             fetch(`${API_URL_BASE}/${checkoutId}`, {
                 method: 'DELETE',
                 headers: {
                      // 'Authorization': 'Bearer YOUR_TOKEN'
                 }
             })
             .then(response => {
                 if (!response.ok) {
                     // Handle specific errors like 404 or 403
                     return response.json().then(err => {
                         throw new Error(err.message || `HTTP error! status: ${response.status}`);
                     }).catch(() => {
                         throw new Error(`HTTP error! status: ${response.status}`);
                     });
                 }
                  // Check for 204 No Content or other success statuses
                  if (response.status === 204 || response.ok) {
                      return; // Success
                  } else {
                      // Should not happen if response.ok is true, but include for robustness
                      throw new Error(`Unexpected success status: ${response.status}`);
                  }
             })
             .then(() => {
                 alert(`Check-out ID: ${checkoutId} đã được xóa thành công!`);
                 window.location.href = 'checkouts.html'; // Redirect to list page
             })
             .catch(error => {
                 console.error('Error deleting checkout:', error);
                 showError('Lỗi xóa Check-out', error.message || 'Không thể xóa bản ghi. Vui lòng thử lại.');
                 toggleSubmitSpinner(false);
             });
              // --- Mock Success --- 
             /*
             setTimeout(() => {
                 toggleSubmitSpinner(false);
                 alert(`Check-out ID: ${checkoutId} đã được xóa! (Giả lập)`);
                 window.location.href = 'checkouts.html';
             }, 1000);
             */
            // ---
         }
    };

    /**
     * Register event listeners
     */
    const registerEventListeners = () => {
        if ($elements.form) {
            $elements.form.addEventListener('submit', handleFormSubmit);
        }

        if ($elements.deleteButton) {
            $elements.deleteButton.addEventListener('click', handleDeleteClick);
        }

        if ($elements.backButton) {
            // Use a regular link href, or add JS for complex back logic/confirmation
            // $elements.backButton.addEventListener('click', () => { window.history.back(); });
        }

        // === Sidebar and User Menu Setup ===
        setupSidebar();
        setupUserMenu();
        // ==================================
    };

    /**
     * Initialize the module
     */
    const init = () => {
        AOS.init();
        const checkoutId = getCheckoutIdFromUrl();

        if (checkoutId) {
            initSelect2(); // Init Select2 if needed for editable selects
            registerEventListeners();
            fetchCheckoutData(checkoutId); // Load data into the form
        } else {
            showError('ID Check-out không hợp lệ', 'Không tìm thấy ID trong URL.');
            toggleLoadingIndicator(false);
             // Disable form if no ID
             $($elements.form).find('input, select, textarea, button').prop('disabled', true);
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