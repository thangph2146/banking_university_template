// IIFE to encapsulate the module
(function() {
    'use strict';

    // --- Constants and API Endpoints ---
    const API_BASE_URL = '/api/admin';
    const SCREENS_API_URL = `${API_BASE_URL}/screens`;
    const CAMERAS_API_URL = `${API_BASE_URL}/cameras?limit=all`;
    const TEMPLATES_API_URL = `${API_BASE_URL}/templates?limit=all`;
    
    // Store original data to compare changes
    let originalData = null;

    // --- DOM Elements Cache ---
    const $elements = {
        // Loading and form container
        loadingIndicator: document.getElementById('loading-indicator'),
        editScreenForm: document.getElementById('edit-screen-form'),
        errorMessage: document.getElementById('error-message'),
        
        // Input fields
        screenIdInput: document.getElementById('screen-id'),
        screenNameInput: document.getElementById('screen-name'),
        screenCodeInput: document.getElementById('screen-code'),
        cameraIdSelect: document.getElementById('camera-id'),
        templateIdSelect: document.getElementById('template-id'),
        screenStatusSelect: document.getElementById('screen-status'),
        
        // Buttons
        submitButton: document.querySelector('#edit-screen-form button[type="submit"]'),
        
        // Sidebar and header elements
        sidebar: document.getElementById('sidebar'),
        sidebarOpen: document.getElementById('sidebar-open'),
        sidebarClose: document.getElementById('sidebar-close'),
        sidebarBackdrop: document.getElementById('sidebar-backdrop'),
        userMenuButton: document.getElementById('user-menu-button'),
        userMenu: document.getElementById('user-menu'),
        headerAvatar: document.getElementById('header-avatar'),
        headerFullname: document.getElementById('header-fullname'),
    };

    // --- Helper Functions ---
    const formatDateTime = (dateTimeString) => {
        if (!dateTimeString) return '-';
        try {
            // Use moment.js if available
            if (typeof moment !== 'undefined') {
                return moment(dateTimeString).format('DD/MM/YYYY HH:mm');
            }
            
            // Manual formatting fallback
            const date = new Date(dateTimeString);
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            return `${day}/${month}/${year} ${hours}:${minutes}`;
        } catch (error) {
            console.error("Error formatting date:", error);
            return dateTimeString || '-';
        }
    };

    const getScreenIdFromUrl = () => {
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');
        if (id && $elements.screenIdInput) {
            $elements.screenIdInput.value = id;
        }
        return id;
    };

    const toggleLoading = (show) => {
        if (show) {
            $elements.loadingIndicator?.classList.remove('hidden');
            $elements.editScreenForm?.classList.add('hidden');
            $elements.errorMessage?.classList.add('hidden');
        } else {
            $elements.loadingIndicator?.classList.add('hidden');
        }
    };

    const toggleSubmitSpinner = (show) => {
        const submitButton = $elements.submitButton;
        if (!submitButton) return;
        
        const isProcessing = submitButton.querySelector('.animate-spin');
        if (show && !isProcessing) {
            // Save original button content
            submitButton.dataset.originalContent = submitButton.innerHTML;
            submitButton.innerHTML = `<i class="ri-loader-4-line animate-spin mr-1"></i> Đang lưu...`;
            submitButton.disabled = true;
            submitButton.classList.add('opacity-75');
        } else if (!show && submitButton.dataset.originalContent) {
            // Restore original content
            submitButton.innerHTML = submitButton.dataset.originalContent;
            submitButton.classList.remove('opacity-75');
            // Only enable button if there are changes
            enableSubmitIfChanged();
        }
    };

    const showError = (message) => {
        if ($elements.errorMessage) {
            $elements.errorMessage.textContent = message || 'Có lỗi xảy ra. Vui lòng thử lại sau.';
            $elements.errorMessage.classList.remove('hidden');
        } else {
            alert(message || 'Có lỗi xảy ra. Vui lòng thử lại sau.');
        }
    };

    // --- API Functions (with Simulated Data) ---
    const fetchScreenDetails = async (id) => {
        console.log(`Fetching details for screen ID: ${id} for editing`);
        
        try {
            // Simulate API call with timeout
            await new Promise(resolve => setTimeout(resolve, 600));
            
            // Generate sample screen data
            const hasCode = Math.random() > 0.2;
            const hasCamera = Math.random() > 0.4;
            const hasTemplate = Math.random() > 0.3;
            const status = Math.random() > 0.3 ? 1 : 0;
            const createdAt = new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000);
            const updatedAt = status === 1 && Math.random() > 0.5 ? 
                              new Date(createdAt.getTime() + Math.random() * 30 * 24 * 60 * 60 * 1000) : null;
            
            // Create simulated data
            const screenData = {
                man_hinh_id: parseInt(id),
                ten_man_hinh: `Màn hình ${String.fromCharCode(65 + (parseInt(id) % 5))}-${Math.floor(parseInt(id) / 10)}`,
                ma_man_hinh: hasCode ? `MH${String(id).padStart(4, '0')}` : null,
                camera_id: hasCamera ? (10 + (parseInt(id) % 10)) : null,
                template_id: hasTemplate ? (1 + (parseInt(id) % 5)) : null,
                status: status,
                created_at: createdAt.toISOString(),
                updated_at: updatedAt?.toISOString() || null,
                deleted_at: null
            };
            
            console.log('Screen details for editing fetched (simulated):', screenData);
            
            // Simulate error if ID is 999
            if (id === '999') {
                throw new Error('Không tìm thấy màn hình');
            }
            
            // Store original data for comparing changes
            originalData = { ...screenData };
            
            return screenData;
            
            /* Structure for actual API call
            const response = await fetch(`${SCREENS_API_URL}/${id}`);
            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('Không tìm thấy màn hình');
                }
                throw new Error(`API error: ${response.statusText}`);
            }
            const data = await response.json();
            originalData = { ...data };
            return data;
            */
        } catch (error) {
            console.error(`Error fetching screen details:`, error);
            throw error;
        }
    };

    const fetchRelatedData = async () => {
        try {
            // Load cameras and templates
            const camerasPromise = fetch(CAMERAS_API_URL).then(response => {
                if (!response.ok) throw new Error('Không thể tải dữ liệu camera');
                return response.json();
            }).catch(() => {
                // Generate mock camera data if API fails
                return Array.from({ length: 10 }, (_, i) => ({
                    camera_id: i + 1,
                    ten_camera: `Camera ${i + 1}`
                }));
            });
            
            const templatesPromise = fetch(TEMPLATES_API_URL).then(response => {
                if (!response.ok) throw new Error('Không thể tải dữ liệu template');
                return response.json();
            }).catch(() => {
                // Generate mock template data if API fails
                return Array.from({ length: 5 }, (_, i) => ({
                    template_id: i + 1,
                    ten_template: `Template ${String.fromCharCode(65 + i)}`
                }));
            });
            
            // Wait for both requests to complete
            return await Promise.all([camerasPromise, templatesPromise]);
        } catch (error) {
            console.error('Error fetching related data:', error);
            return [[], []]; // Return empty arrays if error
        }
    };

    const updateScreen = async (id, updatedData) => {
        console.log(`Updating screen ID: ${id} with data:`, updatedData);
        
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 800));
            
            // Simulate updated data
            const updatedScreen = {
                ...originalData,
                ...updatedData,
                updated_at: new Date().toISOString()
            };
            
            console.log('Screen updated successfully (simulated):', updatedScreen);
            
            // Return simulated response
            return {
                success: true,
                message: 'Cập nhật màn hình thành công!',
                data: updatedScreen
            };
            
            /* Structure for actual API call
            const response = await fetch(`${SCREENS_API_URL}/${id}`, {
                method: 'PUT', // or 'PATCH' depending on API
                headers: {
                    'Content-Type': 'application/json',
                    // Authentication headers if needed
                },
                body: JSON.stringify(updatedData)
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Không thể cập nhật màn hình.');
            }
            
            return {
                success: true, 
                message: 'Cập nhật màn hình thành công!',
                data: await response.json()
            };
            */
        } catch (error) {
            console.error('Error updating screen:', error);
            throw new Error('Không thể cập nhật màn hình. ' + error.message);
        }
    };

    // --- Form Handling Functions ---
    const populateSelect = (selectElement, data, valueField, textField, selectedValue) => {
        if (!selectElement || !Array.isArray(data)) return;
        
        // Clear existing options
        selectElement.innerHTML = '';
        
        // Add empty option
        const emptyOption = document.createElement('option');
        emptyOption.value = '';
        emptyOption.textContent = `-- Chọn ${textField} --`;
        selectElement.appendChild(emptyOption);
        
        // Add options from data
        data.forEach(item => {
            const option = document.createElement('option');
            option.value = item[valueField];
            option.textContent = item[textField];
            if (selectedValue !== undefined && item[valueField] == selectedValue) {
                option.selected = true;
            }
            selectElement.appendChild(option);
        });
    };

    const populateForm = async (screenData) => {
        if (!screenData) return;
        
        // Fill basic input fields
        $elements.screenNameInput.value = screenData.ten_man_hinh || '';
        $elements.screenCodeInput.value = screenData.ma_man_hinh || '';
        $elements.screenStatusSelect.value = screenData.status;
        
        // Fetch and populate dropdown data
        try {
            const [cameras, templates] = await fetchRelatedData();
            
            // Populate camera dropdown
            populateSelect(
                $elements.cameraIdSelect, 
                cameras, 
                'camera_id', 
                'ten_camera', 
                screenData.camera_id
            );
            
            // Populate template dropdown
            populateSelect(
                $elements.templateIdSelect, 
                templates, 
                'template_id', 
                'ten_template', 
                screenData.template_id
            );
            
            // Show form after data is loaded
            $elements.editScreenForm.classList.remove('hidden');
            
            // Add event listeners to detect changes
            attachChangeListeners();
        } catch (error) {
            console.error('Error populating form:', error);
            showError('Không thể tải dữ liệu liên quan. ' + error.message);
        }
    };

    const collectFormData = () => {
        const formData = {};
        const currentName = $elements.screenNameInput.value.trim();
        const currentCode = $elements.screenCodeInput.value.trim();
        const currentCameraId = $elements.cameraIdSelect.value ? parseInt($elements.cameraIdSelect.value) : null;
        const currentTemplateId = $elements.templateIdSelect.value ? parseInt($elements.templateIdSelect.value) : null;
        const currentStatus = parseInt($elements.screenStatusSelect.value);
        
        // Only include fields that have changed
        if (originalData && currentName !== originalData.ten_man_hinh) {
            formData.ten_man_hinh = currentName;
        }
        
        if (originalData && currentCode !== (originalData.ma_man_hinh || '')) {
            formData.ma_man_hinh = currentCode || null;
        }
        
        if (originalData && currentCameraId !== originalData.camera_id) {
            formData.camera_id = currentCameraId;
        }
        
        if (originalData && currentTemplateId !== originalData.template_id) {
            formData.template_id = currentTemplateId;
        }
        
        if (originalData && currentStatus !== originalData.status) {
            formData.status = currentStatus;
        }
        
        return formData;
    };

    const validateForm = () => {
        const screenName = $elements.screenNameInput.value.trim();
        
        // Validate screen name (required)
        if (!screenName) {
            showError('Vui lòng nhập tên màn hình.');
            $elements.screenNameInput.focus();
            return false;
        }
        
        // Add more validations as needed
        
        return true;
    };

    const enableSubmitIfChanged = () => {
        if (!originalData || !$elements.submitButton) return;
        
        const currentData = {
            ten_man_hinh: $elements.screenNameInput.value.trim(),
            ma_man_hinh: $elements.screenCodeInput.value.trim() || null,
            camera_id: $elements.cameraIdSelect.value ? parseInt($elements.cameraIdSelect.value) : null,
            template_id: $elements.templateIdSelect.value ? parseInt($elements.templateIdSelect.value) : null,
            status: parseInt($elements.screenStatusSelect.value)
        };
        
        // Check if any field has changed
        const hasChanges = 
            currentData.ten_man_hinh !== originalData.ten_man_hinh ||
            currentData.ma_man_hinh !== originalData.ma_man_hinh ||
            currentData.camera_id !== originalData.camera_id ||
            currentData.template_id !== originalData.template_id ||
            currentData.status !== originalData.status;
        
        // Enable/disable submit button based on changes
        $elements.submitButton.disabled = !hasChanges;
    };

    const attachChangeListeners = () => {
        // Add event listeners to form inputs to detect changes
        [
            $elements.screenNameInput,
            $elements.screenCodeInput,
            $elements.cameraIdSelect,
            $elements.templateIdSelect,
            $elements.screenStatusSelect
        ].forEach(element => {
            if (element) {
                element.addEventListener('input', enableSubmitIfChanged);
                element.addEventListener('change', enableSubmitIfChanged);
            }
        });
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        
        // Validate form
        if (!validateForm()) {
            return;
        }
        
        // Collect changed data
        const updatedData = collectFormData();
        
        // Check if there are changes
        if (Object.keys(updatedData).length === 0) {
            alert('Không có thay đổi nào để lưu.');
            return;
        }
        
        // Show loading state
        toggleSubmitSpinner(true);
        
        try {
            // Get screen ID from hidden input
            const screenId = $elements.screenIdInput.value;
            
            // Send update request
            const result = await updateScreen(screenId, updatedData);
            
            if (result.success) {
                alert(result.message || 'Cập nhật thành công!');
                
                // Update originalData with new values
                originalData = { ...originalData, ...updatedData };
                
                // Disable submit button as changes are saved
                enableSubmitIfChanged();
                
                // Optionally redirect to detail page
                setTimeout(() => {
                    window.location.href = `screen-detail.html?id=${screenId}`;
                }, 1000);
            } else {
                showError(result.message || 'Không thể cập nhật màn hình.');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            showError(error.message || 'Có lỗi xảy ra khi cập nhật màn hình.');
        } finally {
            toggleSubmitSpinner(false);
        }
    };

    // --- UI Setup Functions ---
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
        
        // Mock user data - replace with actual data in production
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
        
        // Set up dropdown toggle behavior
        if (userMenuButton && userMenu) {
            userMenuButton.addEventListener('click', (e) => {
                e.stopPropagation();
                const isVisible = !userMenu.classList.contains('invisible');
                userMenu.classList.toggle('opacity-0', !isVisible);
                userMenu.classList.toggle('invisible', !isVisible);
                userMenu.classList.toggle('scale-95', !isVisible);
                userMenu.classList.toggle('scale-100', isVisible);
            });
            
            // Close on outside click
            document.addEventListener('click', (e) => {
                if (!userMenu.classList.contains('invisible') && 
                    !userMenuButton.contains(e.target) && 
                    !userMenu.contains(e.target)) {
                    userMenu.classList.add('opacity-0', 'invisible', 'scale-95');
                    userMenu.classList.remove('scale-100');
                }
            });
        }
    };

    // --- Main Initialization ---
    const init = async () => {
        // Set up UI
        setupSidebar();
        setupUserMenu();
        
        // Initialize animation library
        AOS.init();
        
        // Register form submit handler
        $elements.editScreenForm?.addEventListener('submit', handleFormSubmit);
        
        // Get screen ID from URL
        const screenId = getScreenIdFromUrl();
        if (!screenId) {
            showError('Không tìm thấy ID màn hình trong URL.');
            toggleLoading(false);
            return;
        }
        
        // Load screen details
        toggleLoading(true);
        try {
            const screenData = await fetchScreenDetails(screenId);
            await populateForm(screenData);
            
            // Initially disable submit button until changes are made
            if ($elements.submitButton) {
                $elements.submitButton.disabled = true;
            }
        } catch (error) {
            console.error("Failed to load screen details for editing:", error);
            showError(error.message === 'Không tìm thấy màn hình' 
                ? 'Không tìm thấy thông tin màn hình này.' 
                : 'Có lỗi xảy ra khi tải dữ liệu màn hình.');
        } finally {
            toggleLoading(false);
        }
    };

    // Initialize when DOM is ready
    document.addEventListener('DOMContentLoaded', init);
})(); 