/**
 * Module quản lý trang tạo mới màn hình
 * Cho phép thêm màn hình mới vào hệ thống
 */

// IIFE để đóng gói module
(function() {
    'use strict';

    // --- Constants and API Endpoints ---
    const API_BASE_URL = '/api/admin';
    const SCREENS_API_URL = `${API_BASE_URL}/screens`;
    const CAMERAS_API_URL = `${API_BASE_URL}/cameras`;
    const TEMPLATES_API_URL = `${API_BASE_URL}/templates`;

    // --- DOM Elements Cache ---
    const $elements = {
        // Form and loading elements
        createForm: document.getElementById('create-screen-form'),
        submitButton: document.querySelector('#create-screen-form button[type="submit"]'),
        
        // Input fields
        nameInput: document.getElementById('screen-name'),
        codeInput: document.getElementById('screen-code'),
        descriptionInput: document.getElementById('screen-description'),
        locationInput: document.getElementById('screen-location'),
        cameraSelect: document.getElementById('camera-id'),
        templateSelect: document.getElementById('template-id'),
        statusSelect: document.getElementById('screen-status'),
        
        // Sidebar and header elements
        sidebar: document.getElementById('sidebar'),
        sidebarBackdrop: document.getElementById('sidebar-backdrop'),
        sidebarOpen: document.getElementById('sidebar-open'),
        sidebarClose: document.getElementById('sidebar-close'),
        userMenuButton: document.getElementById('user-menu-button'),
        userMenu: document.getElementById('user-menu')
    };

    // --- Initialization Function ---
    function init() {
        // Khởi tạo animation cho trang
        AOS.init();
        
        // Thiết lập các event listeners
        setupEventListeners();
        
        // Tải dữ liệu danh sách cameras và templates
        fetchCameraOptions();
        fetchTemplateOptions();
    }

    // --- Event Listeners Setup ---
    function setupEventListeners() {
        // Xử lý mobile sidebar toggle
        if ($elements.sidebarOpen) {
            $elements.sidebarOpen.addEventListener('click', openSidebar);
        }
        
        if ($elements.sidebarClose) {
            $elements.sidebarClose.addEventListener('click', closeSidebar);
        }
        
        if ($elements.sidebarBackdrop) {
            $elements.sidebarBackdrop.addEventListener('click', closeSidebar);
        }
        
        // Xử lý user menu dropdown
        if ($elements.userMenuButton) {
            $elements.userMenuButton.addEventListener('click', toggleUserMenu);
        }
        
        // Đóng user menu khi click ra ngoài
        document.addEventListener('click', function(event) {
            const isClickInside = $elements.userMenuButton?.contains(event.target);
            if (!isClickInside && $elements.userMenu) {
                $elements.userMenu.classList.add('invisible', 'opacity-0', 'scale-95');
            }
        });
        
        // Form submission
        if ($elements.createForm) {
            $elements.createForm.addEventListener('submit', handleFormSubmit);
        }
    }

    // --- UI Functions ---
    function openSidebar() {
        if ($elements.sidebar && $elements.sidebarBackdrop) {
            $elements.sidebar.classList.remove('-translate-x-full');
            $elements.sidebarBackdrop.classList.remove('hidden');
            setTimeout(() => {
                $elements.sidebarBackdrop.classList.add('opacity-100');
            }, 50);
        }
    }

    function closeSidebar() {
        if ($elements.sidebar && $elements.sidebarBackdrop) {
            $elements.sidebar.classList.add('-translate-x-full');
            $elements.sidebarBackdrop.classList.remove('opacity-100');
            setTimeout(() => {
                $elements.sidebarBackdrop.classList.add('hidden');
            }, 300);
        }
    }

    function toggleUserMenu() {
        if ($elements.userMenu) {
            $elements.userMenu.classList.toggle('invisible');
            $elements.userMenu.classList.toggle('opacity-0');
            $elements.userMenu.classList.toggle('scale-95');
        }
    }

    // --- Data Fetching Functions ---
    async function fetchCameraOptions() {
        try {
            // Mô phỏng việc lấy dữ liệu từ API
            const cameras = generateSampleCameras();
            populateCameraOptions(cameras);
        } catch (error) {
            console.error('Lỗi khi tải danh sách camera:', error);
            showNotification('Không thể tải danh sách camera. Vui lòng thử lại sau.', 'error');
        }
    }

    async function fetchTemplateOptions() {
        try {
            // Mô phỏng việc lấy dữ liệu từ API
            const templates = generateSampleTemplates();
            populateTemplateOptions(templates);
        } catch (error) {
            console.error('Lỗi khi tải danh sách template:', error);
            showNotification('Không thể tải danh sách template. Vui lòng thử lại sau.', 'error');
        }
    }

    // --- Helper Functions ---
    function populateCameraOptions(cameras) {
        if (!$elements.cameraSelect) return;
        
        // Xóa các options hiện tại ngoại trừ option mặc định
        const defaultOption = $elements.cameraSelect.querySelector('option[value=""]');
        $elements.cameraSelect.innerHTML = '';
        if (defaultOption) {
            $elements.cameraSelect.appendChild(defaultOption);
        }
        
        // Thêm các camera vào select dropdown
        cameras.forEach(camera => {
            const option = document.createElement('option');
            option.value = camera.camera_id;
            option.textContent = `${camera.ten_camera} (${camera.ma_camera})`;
            $elements.cameraSelect.appendChild(option);
        });
    }

    function populateTemplateOptions(templates) {
        if (!$elements.templateSelect) return;
        
        // Xóa các options hiện tại ngoại trừ option mặc định
        const defaultOption = $elements.templateSelect.querySelector('option[value=""]');
        $elements.templateSelect.innerHTML = '';
        if (defaultOption) {
            $elements.templateSelect.appendChild(defaultOption);
        }
        
        // Thêm các template vào select dropdown
        templates.forEach(template => {
            const option = document.createElement('option');
            option.value = template.template_id;
            option.textContent = template.ten_template;
            $elements.templateSelect.appendChild(option);
        });
    }

    // --- Form Handling ---
    async function handleFormSubmit(event) {
        event.preventDefault();
        
        // Validate form before submission
        if (!validateForm()) {
            return;
        }
        
        // Disable submit button to prevent double submission
        toggleLoadingState(true);
        
        try {
            // Collect form data
            const formData = {
                ten_man_hinh: $elements.nameInput.value.trim(),
                ma_man_hinh: $elements.codeInput.value.trim(),
                mo_ta: $elements.descriptionInput ? $elements.descriptionInput.value.trim() : '',
                vi_tri: $elements.locationInput ? $elements.locationInput.value.trim() : '',
                camera_id: $elements.cameraSelect.value ? parseInt($elements.cameraSelect.value) : null,
                template_id: $elements.templateSelect.value ? parseInt($elements.templateSelect.value) : null,
                status: parseInt($elements.statusSelect.value)
            };
            
            // Simulate API call
            // In a real application, replace with actual API call:
            // const response = await fetch(SCREENS_API_URL, {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(formData)
            // });
            
            // if (!response.ok) throw new Error('API request failed');
            
            console.log('Đã gửi dữ liệu màn hình mới:', formData);
            
            // Hiển thị thông báo thành công
            showNotification('Màn hình mới đã được tạo thành công!', 'success');
            
            // Redirect to screens list after successful creation
            setTimeout(() => {
                window.location.href = 'screens.html';
            }, 1500);
            
        } catch (error) {
            console.error('Lỗi khi tạo màn hình mới:', error);
            showNotification('Không thể tạo màn hình mới. Vui lòng thử lại.', 'error');
            toggleLoadingState(false);
        }
    }

    function validateForm() {
        let isValid = true;
        
        // Validate required fields
        if (!$elements.nameInput.value.trim()) {
            showFieldError($elements.nameInput, 'Vui lòng nhập tên màn hình');
            isValid = false;
        } else {
            clearFieldError($elements.nameInput);
        }
        
        // Add additional validation as needed
        
        return isValid;
    }

    function showFieldError(inputElement, message) {
        // Remove existing error message if any
        clearFieldError(inputElement);
        
        // Add error class to input
        inputElement.classList.add('border-red-500', 'focus:border-red-500', 'focus:ring-red-500');
        
        // Create and insert error message
        const errorElement = document.createElement('p');
        errorElement.className = 'mt-1 text-xs text-red-600';
        errorElement.textContent = message;
        errorElement.setAttribute('data-error-for', inputElement.id);
        
        inputElement.parentNode.appendChild(errorElement);
    }

    function clearFieldError(inputElement) {
        // Remove error class
        inputElement.classList.remove('border-red-500', 'focus:border-red-500', 'focus:ring-red-500');
        
        // Remove error message if exists
        const errorElement = inputElement.parentNode.querySelector(`[data-error-for="${inputElement.id}"]`);
        if (errorElement) {
            errorElement.remove();
        }
    }

    function toggleLoadingState(isLoading) {
        if (!$elements.submitButton) return;
        
        if (isLoading) {
            $elements.submitButton.disabled = true;
            $elements.submitButton.innerHTML = '<svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Đang xử lý...';
        } else {
            $elements.submitButton.disabled = false;
            $elements.submitButton.innerHTML = 'Tạo màn hình mới';
        }
    }

    // --- Notification Function ---
    function showNotification(message, type = 'info') {
        // Check if notification container exists, create if not
        let notificationContainer = document.getElementById('notification-container');
        if (!notificationContainer) {
            notificationContainer = document.createElement('div');
            notificationContainer.id = 'notification-container';
            notificationContainer.className = 'fixed top-4 right-4 z-50 flex flex-col space-y-2';
            document.body.appendChild(notificationContainer);
        }
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `${getNotificationColorClass(type)} p-4 rounded-md shadow-md flex items-start transition-all transform translate-x-full opacity-0 max-w-md`;
        
        // Set notification content
        notification.innerHTML = `
            <div class="flex-shrink-0 mr-2">
                ${getNotificationIcon(type)}
            </div>
            <div class="flex-1">
                <p class="text-sm font-medium text-white">${message}</p>
            </div>
            <button class="ml-4 flex-shrink-0 text-white focus:outline-none">
                <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                </svg>
            </button>
        `;
        
        // Add to container
        notificationContainer.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.classList.remove('translate-x-full', 'opacity-0');
        }, 10);
        
        // Add click listener to close button
        const closeButton = notification.querySelector('button');
        closeButton.addEventListener('click', () => {
            removeNotification(notification);
        });
        
        // Auto remove after timeout
        setTimeout(() => {
            removeNotification(notification);
        }, 5000);
    }

    function removeNotification(notification) {
        notification.classList.add('opacity-0', 'translate-x-full');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }

    function getNotificationColorClass(type) {
        switch (type) {
            case 'success': return 'bg-green-500';
            case 'error': return 'bg-red-500';
            case 'warning': return 'bg-yellow-500';
            default: return 'bg-blue-500';
        }
    }

    function getNotificationIcon(type) {
        switch (type) {
            case 'success':
                return '<svg class="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>';
            case 'error':
                return '<svg class="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path></svg>';
            case 'warning':
                return '<svg class="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg>';
            default:
                return '<svg class="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path></svg>';
        }
    }

    // --- Sample Data Generators ---
    function generateSampleCameras() {
        return [
            { camera_id: 1, ten_camera: 'Camera Chính Sảnh', ma_camera: 'CAM-001', status: 1 },
            { camera_id: 2, ten_camera: 'Camera Tầng 1', ma_camera: 'CAM-002', status: 1 },
            { camera_id: 3, ten_camera: 'Camera Tầng 2', ma_camera: 'CAM-003', status: 1 },
            { camera_id: 4, ten_camera: 'Camera Phòng Họp', ma_camera: 'CAM-004', status: 1 },
            { camera_id: 5, ten_camera: 'Camera Khu Vực A', ma_camera: 'CAM-005', status: 0 }
        ];
    }

    function generateSampleTemplates() {
        return [
            { template_id: 1, ten_template: 'Template Mặc định', status: 1 },
            { template_id: 2, ten_template: 'Template Sự kiện', status: 1 },
            { template_id: 3, ten_template: 'Template Thông báo', status: 1 },
            { template_id: 4, ten_template: 'Template Multimedia', status: 1 },
            { template_id: 5, ten_template: 'Template Thời gian thực', status: 0 }
        ];
    }

    // --- Initialize ---
    document.addEventListener('DOMContentLoaded', init);
})(); 