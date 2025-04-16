// IIFE to encapsulate the module
(function() {
    'use strict';

    // --- Constants and API Endpoints ---
    const API_BASE_URL = '/api/admin';
    const SCREENS_API_URL = `${API_BASE_URL}/screens`;
    const CAMERAS_API_URL = `${API_BASE_URL}/cameras?limit=all`;
    const TEMPLATES_API_URL = `${API_BASE_URL}/templates?limit=all`;

    // --- DOM Elements Cache ---
    const $elements = {
        // Form and loading elements
        createForm: document.getElementById('create-screen-form'),
        submitButton: document.querySelector('#create-screen-form button[type="submit"]'),
        
        // Input fields
        nameInput: document.getElementById('screen-name'),
        codeInput: document.getElementById('screen-code'),
        cameraSelect: document.getElementById('camera-id'),
        templateSelect: document.getElementById('template-id'),
        statusSelect: document.getElementById('screen-status'),
        
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
    const toggleSubmitSpinner = (show) => {
        const submitButton = $elements.submitButton;
        if (!submitButton) return;
        
        const spinner = submitButton.querySelector('i');
        if (!spinner) return;
        
        if (show) {
            spinner.classList.remove('ri-save-line');
            spinner.classList.add('ri-loader-4-line', 'animate-spin');
            submitButton.disabled = true;
            submitButton.classList.add('opacity-75');
        } else {
            spinner.classList.remove('ri-loader-4-line', 'animate-spin');
            spinner.classList.add('ri-save-line');
            submitButton.disabled = false;
            submitButton.classList.remove('opacity-75');
        }
    };

    const showError = (message) => {
        alert(message || 'Có lỗi xảy ra. Vui lòng thử lại sau.');
    };

    // --- API Functions (with Simulated Data) ---
    const fetchData = async (url, errorMessage) => {
        console.log(`Fetching data from: ${url}`);
        try {
            // Simulate API call with timeout
            await new Promise(resolve => setTimeout(resolve, 300));
            
            // Generate mock data based on API endpoint
            if (url.includes('cameras')) {
                return Array.from({ length: 10 }, (_, i) => ({
                    camera_id: i + 1,
                    ten_camera: `Camera ${i + 1}`,
                    dia_chi_ip: `192.168.1.${10 + i}`,
                    status: Math.random() > 0.3 ? 1 : 0
                }));
            }
            
            if (url.includes('templates')) {
                return Array.from({ length: 5 }, (_, i) => ({
                    template_id: i + 1,
                    ten_template: `Template ${String.fromCharCode(65 + i)}`,
                    mo_ta: `Mẫu giao diện ${String.fromCharCode(65 + i)} cho màn hình`,
                    status: Math.random() > 0.2 ? 1 : 0
                }));
            }
            
            return []; // Default empty array
            
            /* Structure for actual API call
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`API error: ${response.statusText}`);
            }
            return await response.json();
            */
        } catch (error) {
            console.error(`Error fetching data from ${url}:`, error);
            showError(errorMessage || 'Không thể tải dữ liệu. Vui lòng thử lại sau.');
            return [];
        }
    };

    const createScreen = async (data) => {
        console.log('Creating new screen with data:', data);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 800));
            
            // Log data for debugging
            console.log('Screen created successfully (simulated):', data);
            
            // Return simulated response
            return {
                success: true,
                message: 'Màn hình đã được tạo thành công!',
                data: {
                    man_hinh_id: Math.floor(1000 + Math.random() * 9000),
                    ...data,
                    created_at: new Date().toISOString(),
                    updated_at: null,
                    deleted_at: null
                }
            };
            
            /* Structure for actual API call
            const response = await fetch(SCREENS_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // Authentication headers if needed
                },
                body: JSON.stringify(data)
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Không thể tạo màn hình.');
            }
            
            return await response.json();
            */
        } catch (error) {
            console.error('Error creating screen:', error);
            throw new Error('Không thể tạo màn hình. ' + error.message);
        }
    };

    // --- Form Handling Functions ---
    const populateSelect = (selectElement, data, valueField, textField, placeholderOption = true) => {
        if (!selectElement || !Array.isArray(data)) return;
        
        // Clear existing options (keep placeholder if needed)
        const firstOption = placeholderOption ? selectElement.firstElementChild : null;
        selectElement.innerHTML = '';
        if (firstOption) {
            selectElement.appendChild(firstOption);
        }
        
        // Add new options from data
        data.forEach(item => {
            const option = document.createElement('option');
            option.value = item[valueField];
            option.textContent = item[textField];
            selectElement.appendChild(option);
        });
    };

    const loadInitialData = async () => {
        try {
            // Load cameras and templates for form dropdowns
            const [cameras, templates] = await Promise.all([
                fetchData(CAMERAS_API_URL, 'Không thể tải danh sách cameras.'),
                fetchData(TEMPLATES_API_URL, 'Không thể tải danh sách templates.')
            ]);
            
            // Update dropdown select elements
            populateSelect($elements.cameraSelect, cameras, 'camera_id', 'ten_camera');
            populateSelect($elements.templateSelect, templates, 'template_id', 'ten_template');
            
        } catch (error) {
            console.error('Error loading initial data:', error);
            showError('Không thể tải dữ liệu ban đầu. ' + error.message);
        }
    };

    const validateForm = () => {
        const screenName = $elements.nameInput.value.trim();
        
        // Validate screen name (required)
        if (!screenName) {
            showError('Vui lòng nhập tên màn hình.');
            $elements.nameInput.focus();
            return false;
        }
        
        // Add additional validation if needed
        
        return true;
    };

    const collectFormData = () => {
        return {
            ten_man_hinh: $elements.nameInput.value.trim(),
            ma_man_hinh: $elements.codeInput.value.trim() || null,
            camera_id: $elements.cameraSelect.value ? parseInt($elements.cameraSelect.value) : null,
            template_id: $elements.templateSelect.value ? parseInt($elements.templateSelect.value) : null,
            status: parseInt($elements.statusSelect.value)
        };
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        
        // Form validation
        if (!validateForm()) {
            return;
        }
        
        toggleSubmitSpinner(true);
        
        try {
            // Collect form data
            const formData = collectFormData();
            
            // Send create request
            const result = await createScreen(formData);
            
            if (result.success) {
                alert(result.message || 'Tạo màn hình thành công!');
                
                // Redirect to list or detail page
                setTimeout(() => {
                    if (result.data && result.data.man_hinh_id) {
                        window.location.href = `screen-detail.html?id=${result.data.man_hinh_id}`;
                    } else {
                        window.location.href = 'screens.html';
                    }
                }, 500);
            } else {
                showError(result.message || 'Không thể tạo màn hình.');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            showError(error.message || 'Có lỗi xảy ra khi tạo màn hình.');
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
        
        // Load dropdown data
        await loadInitialData();
        
        // Register event listeners
        $elements.createForm?.addEventListener('submit', handleFormSubmit);
    };

    // Initialize when DOM is ready
    document.addEventListener('DOMContentLoaded', init);
})(); 