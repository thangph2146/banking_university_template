// IIFE to encapsulate the module
(function() {
    'use strict';

    // --- Constants and API Endpoints ---
    const API_BASE_URL = '/api/admin'; // Gia định URL cơ sở cho API admin
    const SCREENS_API_URL = `${API_BASE_URL}/screens`; // API quản lý màn hình

    // --- State Variables ---
    let screenData = null;

    // --- DOM Elements Cache ---
    const $elements = {
        loadingIndicator: document.getElementById('loading-indicator'),
        screenDetailsContent: document.getElementById('screen-details-content'),
        errorMessage: document.getElementById('error-message'),
        editScreenLink: document.getElementById('edit-screen-link'),

        // Basic information display fields
        detailScreenName: document.getElementById('detail-screen-name'),
        detailScreenId: document.getElementById('detail-screen-id'),
        detailScreenCode: document.getElementById('detail-screen-code'),
        detailScreenStatus: document.getElementById('detail-screen-status'),
        detailCreatedAt: document.getElementById('detail-created-at'),
        detailUpdatedAt: document.getElementById('detail-updated-at'),
        
        // Camera information
        detailCameraInfo: document.getElementById('detail-camera-info'),
        detailCameraIp: document.getElementById('detail-camera-ip'),
        detailCameraStatus: document.getElementById('detail-camera-status'),
        cameraIpContainer: document.getElementById('camera-ip-container'),
        cameraStatusContainer: document.getElementById('camera-status-container'),
        
        // Template information
        detailTemplateInfo: document.getElementById('detail-template-info'),
        detailTemplateDescription: document.getElementById('detail-template-description'),
        templateDescContainer: document.getElementById('template-desc-container'),

        // Sidebar and header
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

    const getStatusBadge = (statusValue) => {
        const isActive = Number(statusValue) === 1;
        const text = isActive ? 'Hoạt động' : 'Không hoạt động';
        const colorClass = isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
        return `<span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${colorClass}">${text}</span>`;
    };

    const getScreenIdFromUrl = () => {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('id');
    };

    const toggleLoading = (show) => {
        if (show) {
            $elements.loadingIndicator?.classList.remove('hidden');
            $elements.screenDetailsContent?.classList.add('hidden');
            $elements.errorMessage?.classList.add('hidden');
        } else {
            $elements.loadingIndicator?.classList.add('hidden');
        }
    };

    const showError = (message) => {
        if ($elements.errorMessage) {
            $elements.errorMessage.textContent = message || 'Có lỗi xảy ra. Vui lòng thử lại sau.';
            $elements.errorMessage.classList.remove('hidden');
        } else {
            alert(message || 'Có lỗi xảy ra. Vui lòng thử lại sau.');
        }
        $elements.screenDetailsContent?.classList.add('hidden');
    };

    // --- API Functions (with Simulated Data) ---
    const fetchScreenDetails = async (id) => {
        console.log(`Fetching details for screen ID: ${id}`);
        try {
            // Simulate API call with timeout
            await new Promise(resolve => setTimeout(resolve, 500));
            
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
                deleted_at: null,
                
                // Additional simulated data
                camera: hasCamera ? {
                    camera_id: 10 + (parseInt(id) % 10),
                    ten_camera: `Camera ${10 + (parseInt(id) % 10)}`,
                    dia_chi_ip: `192.168.1.${10 + (parseInt(id) % 10)}`,
                    status: Math.random() > 0.2 ? 1 : 0
                } : null,
                template: hasTemplate ? {
                    template_id: 1 + (parseInt(id) % 5),
                    ten_template: `Template ${String.fromCharCode(65 + (parseInt(id) % 5))}`,
                    mo_ta: `Mẫu giao diện ${String.fromCharCode(65 + (parseInt(id) % 5))} cho màn hình hiển thị thông tin ${Math.random() > 0.5 ? 'sự kiện' : 'check-in'}.`
                } : null
            };
            
            console.log('Screen details fetched (simulated):', screenData);
            
            // Simulate error if ID is 999
            if (id === '999') {
                throw new Error('Không tìm thấy màn hình');
            }
            
            return screenData;
            
            /* Structure for actual API call
            const response = await fetch(`${SCREENS_API_URL}/${id}`);
            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('Không tìm thấy màn hình');
                }
                throw new Error(`API error: ${response.statusText}`);
            }
            return await response.json();
            */
        } catch (error) {
            console.error(`Error fetching screen details:`, error);
            throw error;
        }
    };

    // --- Data Display Function ---
    const displayScreenDetails = (data) => {
        if (!data) return;
        
        // Display basic information
        $elements.detailScreenName.textContent = data.ten_man_hinh || 'Không có tên';
        $elements.detailScreenId.textContent = data.man_hinh_id || '-';
        $elements.detailScreenCode.textContent = data.ma_man_hinh || '-';
        
        // Display screen status
        $elements.detailScreenStatus.innerHTML = getStatusBadge(data.status);
        
        // Display timestamps
        $elements.detailCreatedAt.textContent = formatDateTime(data.created_at);
        $elements.detailUpdatedAt.textContent = data.updated_at ? formatDateTime(data.updated_at) : '-';
        
        // Display camera information (if exists)
        if (data.camera_id && data.camera) {
            $elements.detailCameraInfo.textContent = `${data.camera.ten_camera} (ID: ${data.camera_id})`;
            
            // Display Camera IP
            if ($elements.detailCameraIp && $elements.cameraIpContainer) {
                $elements.detailCameraIp.textContent = data.camera.dia_chi_ip || '-';
                $elements.cameraIpContainer.classList.remove('hidden');
            }
            
            // Display Camera Status
            if ($elements.detailCameraStatus && $elements.cameraStatusContainer) {
                $elements.detailCameraStatus.innerHTML = getStatusBadge(data.camera.status);
                $elements.cameraStatusContainer.classList.remove('hidden');
            }
        } else {
            $elements.detailCameraInfo.textContent = 'Không có camera liên kết';
            
            // Hide camera detail fields when no camera is linked
            if ($elements.cameraIpContainer) $elements.cameraIpContainer.classList.add('hidden');
            if ($elements.cameraStatusContainer) $elements.cameraStatusContainer.classList.add('hidden');
        }
        
        // Display template information (if exists)
        if (data.template_id && data.template) {
            $elements.detailTemplateInfo.textContent = `${data.template.ten_template} (ID: ${data.template_id})`;
            
            // Display template description
            if ($elements.detailTemplateDescription && $elements.templateDescContainer) {
                $elements.detailTemplateDescription.textContent = data.template.mo_ta || '-';
                $elements.templateDescContainer.classList.remove('hidden');
            }
        } else {
            $elements.detailTemplateInfo.textContent = 'Không có template liên kết';
            
            // Hide template description when no template is linked
            if ($elements.templateDescContainer) $elements.templateDescContainer.classList.add('hidden');
        }
        
        // Update edit link
        if ($elements.editScreenLink) {
            $elements.editScreenLink.href = `screen-edit.html?id=${data.man_hinh_id}`;
        }
        
        // Show the content container
        $elements.screenDetailsContent?.classList.remove('hidden');
    };

    // --- Event Listeners and UI Setup ---
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
            
            // Click outside to close
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
        // Set up UI controls
        setupSidebar();
        setupUserMenu();
        
        // Initialize animation library
        AOS.init();
        
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
            screenData = await fetchScreenDetails(screenId);
            displayScreenDetails(screenData);
        } catch (error) {
            console.error("Failed to load screen details:", error);
            showError(error.message === 'Không tìm thấy màn hình' 
                ? 'Không tìm thấy thông tin màn hình này.' 
                : 'Có lỗi xảy ra khi tải dữ liệu màn hình.');
        } finally {
            toggleLoading(false);
        }
    };

    // Initialize the module when DOM is ready
    document.addEventListener('DOMContentLoaded', init);
})(); 