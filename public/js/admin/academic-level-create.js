// public/js/admin/academic-level-create.js

// IIFE to encapsulate the module
(function() {
    'use strict';

    // Constants & Global Variables
    const API_BASE_URL = '/api/academic-levels'; // Placeholder for actual API endpoint
    let nextMockId = 13; // Variable to simulate auto-incrementing ID for mock data

    // --- Mock Data (copied from academic-levels.js for consistency) ---
    const academicLevelsMockData = [
        { bac_hoc_id: 1, ten_bac_hoc: 'Đại học', ma_bac_hoc: 'DH', status: 1 },
        { bac_hoc_id: 2, ten_bac_hoc: 'Cao đẳng', ma_bac_hoc: 'CD', status: 1 },
        { bac_hoc_id: 3, ten_bac_hoc: 'Sau đại học', ma_bac_hoc: 'SDH', status: 1 },
        { bac_hoc_id: 4, ten_bac_hoc: 'Trung cấp', ma_bac_hoc: 'TC', status: 0 },
        { bac_hoc_id: 5, ten_bac_hoc: 'Liên thông', ma_bac_hoc: 'LT', status: 1 },
        { bac_hoc_id: 6, ten_bac_hoc: 'Văn bằng 2', ma_bac_hoc: 'VB2', status: 1 },
        { bac_hoc_id: 7, ten_bac_hoc: 'Từ xa', ma_bac_hoc: 'TX', status: 1 },
        { bac_hoc_id: 8, ten_bac_hoc: 'Dự bị đại học', ma_bac_hoc: 'DBDH', status: 0 },
        { bac_hoc_id: 9, ten_bac_hoc: 'Chứng chỉ', ma_bac_hoc: 'CC', status: 1 },
        { bac_hoc_id: 10, ten_bac_hoc: 'Nghiên cứu sinh', ma_bac_hoc: 'NCS', status: 1 },
        { bac_hoc_id: 11, ten_bac_hoc: 'Thạc sĩ', ma_bac_hoc: 'ThS', status: 1 },
        { bac_hoc_id: 12, ten_bac_hoc: 'Tiến sĩ', ma_bac_hoc: 'TS', status: 1 },
    ];

    // DOM Elements Cache
    const $elements = {
        createForm: document.getElementById('level-create-form'),
        errorAlert: document.getElementById('error-alert'),
        errorTitle: document.getElementById('error-title'),
        errorMessage: document.getElementById('error-message'),
        submitButton: document.getElementById('submit-btn'),
        submitSpinner: document.getElementById('submit-spinner'),
        resetButton: document.getElementById('reset-btn'),
        levelNameInput: document.getElementById('name'),
        levelCodeInput: document.getElementById('code'),
        levelStatusSelect: document.getElementById('status'),
        // Toast container
        toastContainer: document.getElementById('toast-container'),
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
    const toggleSubmitSpinner = (show) => {
        $elements.submitSpinner?.classList.toggle('hidden', !show);
        $elements.submitButton?.classList.toggle('opacity-75', show);
        $elements.submitButton.disabled = show || !isFormValid(); // Disable if showing spinner OR form invalid
    };

    const showError = (title, message) => {
        $elements.errorTitle.textContent = title || 'Lỗi!';
        $elements.errorMessage.textContent = message || 'Không thể thực hiện yêu cầu.';
        $elements.errorAlert?.classList.remove('hidden');
    };

    // API Functions (Placeholders using Mock Data)
    const createLevel = async (newData) => {
        console.log('Creating new level with data:', newData);
        await new Promise(resolve => setTimeout(resolve, 700)); // Simulate delay

        // --- Mock Create Logic ---
        // Basic validation (check if ma_bac_hoc already exists)
        const codeExists = academicLevelsMockData.some(level => level.ma_bac_hoc === newData.ma_bac_hoc);
        if (codeExists) {
            throw new Error(`Mã bậc học "${newData.ma_bac_hoc}" đã tồn tại.`);
        }

        const newLevel = {
            bac_hoc_id: nextMockId++, // Simulate auto-increment ID
            ...newData
        };
        academicLevelsMockData.push(newLevel);
        console.log('Mock creation successful', newLevel);
        // --- End Mock Create Logic ---

        // Simulate API success response
        return { success: true, message: 'Tạo bậc học mới thành công!', data: newLevel };

        // Simulate potential error
        // if (Math.random() < 0.2) throw new Error('Failed to create level. Server error.');
    };

     // Form Validation
    const isFormValid = () => {
        const name = $elements.levelNameInput.value.trim();
        const code = $elements.levelCodeInput.value.trim();
        return name.length > 0 && code.length > 0;
    };

    const validateAndToggleButton = () => {
         $elements.submitButton.disabled = !isFormValid();
    };

    // Form Handling Functions
    const resetForm = () => {
        $elements.createForm?.reset();
        $elements.levelStatusSelect.value = "1"; // Reset status to default (Active)
        $elements.errorAlert?.classList.add('hidden');
        $elements.submitButton.disabled = true; // Disable submit after reset
        $elements.levelNameInput.focus(); // Focus on the first input field
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        if (!isFormValid()) {
            showToast('Vui lòng điền đầy đủ Tên và Mã bậc học.', 'warning');
            return;
        }

        const formData = {
            ten_bac_hoc: $elements.levelNameInput.value.trim(),
            ma_bac_hoc: $elements.levelCodeInput.value.trim().toUpperCase(), // Standardize code to uppercase
            status: parseInt($elements.levelStatusSelect.value)
        };

        toggleSubmitSpinner(true);
        $elements.errorAlert?.classList.add('hidden');

        try {
            const result = await createLevel(formData);
            if (result.success) {
                showToast(result.message || 'Tạo mới thành công!', 'success');
                resetForm(); // Clear the form after successful creation
                // Optional: Redirect to the list or detail page after a short delay
                // setTimeout(() => {
                //      window.location.href = `academic-levels.html`;
                // }, 1500);
            } else {
                showError('Tạo mới thất bại', result.message || 'Không thể tạo bậc học.');
            }
        } catch (error) {
            console.error("Create failed:", error);
            showError('Lỗi tạo mới', error.message || 'Có lỗi xảy ra khi tạo bậc học.');
        } finally {
            toggleSubmitSpinner(false);
        }
    };

    // Toast Functions (copied)
    const showToast = (message, type = "info") => {
        const toastContainer = $elements.toastContainer;
        if (!toastContainer) {
            console.error("Toast container not found!");
            return;
        }
        const toastId = `toast-${Date.now()}`;
        const toast = document.createElement('div');
        toast.id = toastId;
        toast.className = `flex items-center p-4 mb-3 w-full max-w-xs rounded-lg shadow ${getToastBgColor(type)} transition-opacity duration-300 opacity-0`;
        toast.setAttribute('role', 'alert');
        toast.innerHTML = `
            <div class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 ${getToastIconBgColor(type)} rounded-lg">
                ${getToastIcon(type)}
            </div>
            <div class="ml-3 text-sm font-normal">${message}</div>
            <button type="button" class="ml-auto -mx-1.5 -my-1.5 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 inline-flex h-8 w-8 ${getToastCloseButtonColor(type)}" data-dismiss-target="#${toastId}" aria-label="Close">
                <span class="sr-only">Đóng</span>
                <i class="ri-close-line"></i>
            </button>
        `;
        toastContainer.prepend(toast);
        void toast.offsetWidth;
        toast.classList.remove('opacity-0');
        const closeButton = toast.querySelector('button');
        const removeToast = () => {
            toast.classList.add('opacity-0');
            setTimeout(() => toast.remove(), 300);
        };
        closeButton.addEventListener('click', removeToast);
        setTimeout(removeToast, 5000);
    };
    const getToastBgColor=(t)=>{switch(t){case"success":return"bg-green-50 text-green-800";case"error":return"bg-red-50 text-red-800";case"warning":return"bg-yellow-50 text-yellow-800";default:return"bg-blue-50 text-blue-800"}};
    const getToastIconBgColor=(t)=>{switch(t){case"success":return"bg-green-100 text-green-500";case"error":return"bg-red-100 text-red-500";case"warning":return"bg-yellow-100 text-yellow-500";default:return"bg-blue-100 text-blue-500"}};
    const getToastCloseButtonColor=(t)=>{switch(t){case"success":return"bg-green-50 text-green-500 hover:bg-green-100";case"error":return"bg-red-50 text-red-500 hover:bg-red-100";case"warning":return"bg-yellow-50 text-yellow-500 hover:bg-yellow-100";default:return"bg-blue-50 text-blue-500 hover:bg-blue-100"}};
    const getToastIcon=(t)=>{switch(t){case"success":return'<i class="ri-check-line"></i>';case"error":return'<i class="ri-error-warning-line"></i>';case"warning":return'<i class="ri-alert-line"></i>';default:return'<i class="ri-information-line"></i>'}};

    // Sidebar and User Menu Setup (copied)
    const setupSidebar = () => {
        const { sidebar, sidebarOpen, sidebarClose, sidebarBackdrop } = $elements;
        if (!sidebar || !sidebarOpen || !sidebarClose || !sidebarBackdrop) return;
        const open = () => {
            sidebar.classList.remove('-translate-x-full');
            sidebarBackdrop.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        };
        const close = () => {
            sidebar.classList.add('-translate-x-full');
            sidebarBackdrop.classList.add('hidden');
            document.body.style.overflow = '';
        };
        sidebarOpen.addEventListener('click', (e) => { e.stopPropagation(); open(); });
        sidebarClose.addEventListener('click', close);
        sidebarBackdrop.addEventListener('click', close);
    };

    const setupUserMenu = () => {
        const { userMenuButton, userMenu, headerAvatar, headerFullname } = $elements;
        const currentUser = { FullName: 'Admin User', Avatar: 'https://ui-avatars.com/api/?name=A+U&background=0D8ABC&color=fff' }; // Placeholder
        if (headerAvatar) headerAvatar.src = currentUser.Avatar;
        if (headerFullname) headerFullname.textContent = currentUser.FullName;
        if (userMenuButton && userMenu) {
            userMenuButton.addEventListener('click', (event) => {
                event.stopPropagation();
                userMenu.classList.toggle('hidden');
            });
            document.addEventListener('click', (e) => {
                if (!userMenu.classList.contains('hidden') && !userMenuButton.contains(e.target) && !userMenu.contains(e.target)) {
                    userMenu.classList.add('hidden');
                }
            });
        }
    };

    /**
     * Initialize the page
     */
    const initializePage = () => {
        if (typeof AOS !== 'undefined') AOS.init();
        else console.warn('AOS library not found.');

        setupSidebar();
        setupUserMenu();

        // Add form submit listener
        $elements.createForm?.addEventListener('submit', handleFormSubmit);

        // Add reset listener
        $elements.resetButton?.addEventListener('click', resetForm);

        // Add input listeners for validation
        [$elements.levelNameInput, $elements.levelCodeInput].forEach(input => {
            input?.addEventListener('input', validateAndToggleButton);
        });

        // Initial validation check
        validateAndToggleButton();
        $elements.levelNameInput?.focus(); // Set focus on the first field
    };

    // Initialize the module when the DOM is ready
    document.addEventListener('DOMContentLoaded', initializePage);

})(); // End IIFE 