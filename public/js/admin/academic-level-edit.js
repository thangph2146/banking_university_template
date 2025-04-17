// public/js/admin/academic-level-edit.js

// IIFE to encapsulate the module
(function() {
    'use strict';

    // Constants & Global Variables
    const API_BASE_URL = '/api/academic-levels'; // Placeholder for actual API endpoint
    let originalData = null; // Store original data to compare changes
    let levelId = null;

    // --- Mock Data (copied from academic-levels.js for self-containment) ---
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
        loadingIndicator: document.getElementById('loading-indicator'),
        editFormContainer: document.getElementById('edit-form-container'),
        editForm: document.getElementById('level-edit-form'),
        errorAlert: document.getElementById('error-alert'),
        errorTitle: document.getElementById('error-title'),
        errorMessage: document.getElementById('error-message'),
        submitButton: document.getElementById('submit-btn'),
        submitSpinner: document.getElementById('submit-spinner'),
        cancelButton: document.getElementById('cancel-btn'),
        backToDetailButton: document.getElementById('back-to-detail-btn'),
        breadcrumbDetailLink: document.getElementById('breadcrumb-detail-link'),
        levelNameBreadcrumb: document.getElementById('level-name-breadcrumb'),
        levelIdDisplay: document.getElementById('level-id-display'),
        levelIdInput: document.getElementById('level-id'), // Hidden input
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
    const getLevelIdFromUrl = () => {
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');
        return id ? parseInt(id) : null;
    };

    const toggleLoading = (show) => {
        $elements.loadingIndicator?.classList.toggle('hidden', !show);
        if (show) {
            $elements.editFormContainer?.classList.add('hidden');
            $elements.errorAlert?.classList.add('hidden');
        }
    };

    const toggleSubmitSpinner = (show) => {
        $elements.submitSpinner?.classList.toggle('hidden', !show);
        $elements.submitButton?.classList.toggle('opacity-75', show);
        // Disable button while spinner is active, re-enable based on changes otherwise
        if (show) {
            $elements.submitButton.disabled = true;
        } else {
             enableSubmitIfChanged(); // Re-evaluate button state
        }
    };

    const showError = (title, message) => {
        $elements.errorTitle.textContent = title || 'Lỗi!';
        $elements.errorMessage.textContent = message || 'Không thể thực hiện yêu cầu.';
        $elements.errorAlert?.classList.remove('hidden');
        $elements.editFormContainer?.classList.add('hidden'); // Hide form on error
    };

    // API Functions (Placeholders using Mock Data)
    const fetchLevelDetails = async (id) => {
        console.log(`Fetching details for level ID: ${id}`);
        await new Promise(resolve => setTimeout(resolve, 300)); // Simulate delay
        const level = academicLevelsMockData.find(l => l.bac_hoc_id === id);
        if (!level) throw new Error('Academic level not found');
        originalData = { ...level }; // Store original data
        return level;
    };

    const updateLevel = async (id, updatedData) => {
        console.log(`Updating level ID: ${id} with data:`, updatedData);
        await new Promise(resolve => setTimeout(resolve, 700)); // Simulate delay

        // --- Mock Update Logic ---
        const index = academicLevelsMockData.findIndex(l => l.bac_hoc_id === id);
        if (index === -1) throw new Error('Level not found for update');

        // Merge updated data with existing data
        academicLevelsMockData[index] = { ...academicLevelsMockData[index], ...updatedData };
        console.log('Mock update successful', academicLevelsMockData[index]);
        // --- End Mock Update Logic ---

        // Simulate API success response
        return { success: true, message: 'Cập nhật bậc học thành công!', data: academicLevelsMockData[index] };

        // Simulate potential error
        // if (Math.random() < 0.2) throw new Error('Failed to update level. Please try again.');
    };

    // Form Handling Functions
    const populateForm = (data) => {
        if (!data) return;

        const detailUrl = `academic-level-detail.html?id=${data.bac_hoc_id}`;

        // Update breadcrumb and back button links
        $elements.backToDetailButton.href = detailUrl;
        $elements.breadcrumbDetailLink.href = detailUrl;
        if ($elements.levelNameBreadcrumb) $elements.levelNameBreadcrumb.textContent = `: ${data.ten_bac_hoc}`;
        if ($elements.levelIdDisplay) $elements.levelIdDisplay.textContent = data.bac_hoc_id;
        if ($elements.cancelButton) $elements.cancelButton.onclick = () => window.location.href = detailUrl;

        // Populate form fields
        $elements.levelIdInput.value = data.bac_hoc_id;
        $elements.levelNameInput.value = data.ten_bac_hoc;
        $elements.levelCodeInput.value = data.ma_bac_hoc || '';
        $elements.levelStatusSelect.value = data.status.toString(); // Ensure value matches option value (string)

        // Show the form
        $elements.editFormContainer?.classList.remove('hidden');

        // Add input listeners to enable/disable submit button
        [$elements.levelNameInput, $elements.levelCodeInput, $elements.levelStatusSelect].forEach(el => {
            el.addEventListener('input', enableSubmitIfChanged);
            el.addEventListener('change', enableSubmitIfChanged);
        });
    };

    const collectFormData = () => {
        const formData = {};
        const currentName = $elements.levelNameInput.value.trim();
        const currentCode = $elements.levelCodeInput.value.trim();
        const currentStatus = parseInt($elements.levelStatusSelect.value); // Parse to number for comparison

        // Only include fields that have changed
        if (originalData && currentName !== originalData.ten_bac_hoc) {
            formData.ten_bac_hoc = currentName;
        }
        if (originalData && currentCode !== (originalData.ma_bac_hoc || '')) { // Handle potentially null ma_bac_hoc
            formData.ma_bac_hoc = currentCode;
        }
        if (originalData && currentStatus !== originalData.status) {
            formData.status = currentStatus;
        }

        return formData;
    };

    const enableSubmitIfChanged = () => {
        if (!originalData || !$elements.submitButton) {
            if ($elements.submitButton) $elements.submitButton.disabled = true;
             return;
        }
        const currentName = $elements.levelNameInput.value.trim();
        const currentCode = $elements.levelCodeInput.value.trim();
        const currentStatus = $elements.levelStatusSelect.value; // Compare as string initially

        const hasChanged = currentName !== originalData.ten_bac_hoc ||
                           currentCode !== (originalData.ma_bac_hoc || '') ||
                           currentStatus !== originalData.status.toString();

        // Also check if required fields are filled
        const isValid = currentName.length > 0 && currentCode.length > 0;

        $elements.submitButton.disabled = !hasChanged || !isValid;
    };


    const handleFormSubmit = async (event) => {
        event.preventDefault();
        if ($elements.submitButton.disabled) return; // Prevent submission if no changes or invalid

        const updatedData = collectFormData();

        if (Object.keys(updatedData).length === 0) {
            showToast('Không có thay đổi nào để lưu.', 'info');
            return;
        }

        toggleSubmitSpinner(true);
        $elements.errorAlert?.classList.add('hidden'); // Hide previous errors

        try {
            const result = await updateLevel(levelId, updatedData);
            if (result.success) {
                showToast(result.message || 'Cập nhật thành công!', 'success');
                // Update originalData to reflect saved changes
                originalData = { ...originalData, ...updatedData };
                // Update breadcrumb if name changed
                 if (updatedData.ten_bac_hoc && $elements.levelNameBreadcrumb) {
                    $elements.levelNameBreadcrumb.textContent = `: ${updatedData.ten_bac_hoc}`;
                 }
                enableSubmitIfChanged(); // Disable submit button again as changes are saved
                // Optionally redirect back to detail page after a delay
                setTimeout(() => {
                     window.location.href = `academic-level-detail.html?id=${levelId}`;
                }, 1500);
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

    // Toast Functions
    const showToast = (message, type = "info", title = "") => {
        const toastContainer = document.getElementById('toast-container');
        if (!toastContainer) {
            console.error("Toast container not found!");
            return;
        }

        // Determine which template to use
        let templateId;
        switch (type) {
            case "success":
                templateId = "toast-success-template";
                break;
            case "error":
                templateId = "toast-error-template";
                break;
            case "warning":
                templateId = "toast-warning-template";
                break;
            default:
                // Fallback to success if no matching template
                templateId = "toast-success-template";
        }

        // Get the template
        const template = document.getElementById(templateId);
        if (!template) {
            console.error(`Toast template ${templateId} not found!`);
            return;
        }

        // Clone the template
        const toast = document.importNode(template.content, true).firstElementChild;
        const toastId = `toast-${Date.now()}`;
        toast.id = toastId;

        // Set toast content
        const titleElement = toast.querySelector(".toast-title");
        const messageElement = toast.querySelector(".toast-message");
        const progressElement = toast.querySelector(".toast-progress");
        
        if (titleElement) titleElement.textContent = title || getDefaultTitle(type);
        if (messageElement) messageElement.textContent = message;
        
        // Add to container
        toastContainer.appendChild(toast);
        
        // Animation timing
        const displayDuration = 5000; // 5 seconds
        
        // Trigger entrance animation after a small delay
        setTimeout(() => {
            toast.classList.remove('opacity-0', 'translate-x-full');
        }, 10);
        
        // Setup progress bar animation
        if (progressElement) {
            progressElement.style.width = "100%";
            progressElement.style.transition = `width ${displayDuration}ms linear`;
            setTimeout(() => {
                progressElement.style.width = "0%";
            }, 50);
        }
        
        // Register close button event
        const closeButton = toast.querySelector('.toast-close');
        if (closeButton) {
            closeButton.addEventListener('click', () => {
                removeToast(toast);
            });
        }
        
        // Auto remove after duration
        setTimeout(() => {
            removeToast(toast);
        }, displayDuration);
        
        return toast;
    };
    
    const removeToast = (toast) => {
        // Apply exit animation
        toast.classList.add('opacity-0', 'translate-x-full');
        
        // Remove from DOM after animation
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300); // Match the CSS transition duration
    };
    
    const getDefaultTitle = (type) => {
        switch (type) {
            case "success": return "Thành công!";
            case "error": return "Lỗi!";
            case "warning": return "Cảnh báo!";
            default: return "Thông báo";
        }
    };

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
    const initializePage = async () => {
        if (typeof AOS !== 'undefined') AOS.init();
        else console.warn('AOS library not found.');

        setupSidebar();
        setupUserMenu();

        levelId = getLevelIdFromUrl();
        if (!levelId) {
            showError('Thiếu ID', 'Không tìm thấy ID Bậc học trong URL.');
            toggleLoading(false);
            return;
        }

        toggleLoading(true);
        try {
            const levelData = await fetchLevelDetails(levelId);
            populateForm(levelData);
            // Initially disable submit button until changes are made
            $elements.submitButton.disabled = true;
        } catch (error) {
            console.error("Failed to load level details for editing:", error);
            showError('Lỗi tải dữ liệu', error.message === 'Academic level not found' ? 'Không tìm thấy bậc học này.' : 'Có lỗi xảy ra khi tải dữ liệu.');
        } finally {
            toggleLoading(false);
        }

        // Add form submit listener
        $elements.editForm?.addEventListener('submit', handleFormSubmit);
    };

    // Initialize the module when the DOM is ready
    document.addEventListener('DOMContentLoaded', initializePage);

})(); // End IIFE 