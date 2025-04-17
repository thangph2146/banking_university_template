// public/js/admin/academic-level-detail.js

// IIFE to encapsulate the module
(function() {
    'use strict';

    // Constants & Global Variables
    const API_BASE_URL = '/api/academic-levels'; // Placeholder for actual API endpoint
    let currentLevelData = null; // Store current level data
    let levelId = null; // Store the ID from URL

    // --- Mock Data (copied from academic-levels.js for self-containment) ---
    const academicLevelsMockData = [
        { bac_hoc_id: 1, ten_bac_hoc: 'Đại học', ma_bac_hoc: 'DH', status: 1 },
        { bac_hoc_id: 2, ten_bac_hoc: 'Cao đẳng', ma_bac_hoc: 'CD', status: 1 },
        { bac_hoc_id: 3, ten_bac_hoc: 'Sau đại học', ma_bac_hoc: 'SDH', status: 1 },
        { bac_hoc_id: 4, ten_bac_hoc: 'Trung cấp', ma_bac_hoc: 'TC', status: 0 }, // Example inactive
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
        detailsContainer: document.getElementById('level-details-container'),
        errorAlert: document.getElementById('error-alert'),
        errorTitle: document.getElementById('error-title'),
        errorMessage: document.getElementById('error-message'),
        editButton: document.getElementById('edit-level-btn'),
        deleteButton: document.getElementById('delete-level-btn'),
        backButton: document.getElementById('back-to-list-btn'),

        // Level Details Elements
        levelId: document.getElementById('level-id'),
        levelCode: document.getElementById('level-code'),
        levelName: document.getElementById('level-name'),
        levelStatus: document.getElementById('level-status'),

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

    const getStatusBadge = (status) => {
         const isActive = status === 1 || status === '1'; // Handle both number and string
        const text = isActive ? 'Hoạt động' : 'Không hoạt động';
        const bgColor = isActive ? 'bg-green-100' : 'bg-red-100';
        const textColor = isActive ? 'text-green-800' : 'text-red-800';
        const dotColor = isActive ? 'text-green-400' : 'text-red-400';

        return `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor} ${textColor}">
                    <svg class="-ml-0.5 mr-1.5 h-2 w-2 ${dotColor}" fill="currentColor" viewBox="0 0 8 8">
                        <circle cx="4" cy="4" r="3" />
                    </svg>
                    ${text}
                </span>`;
    };

    // UI Update Functions
    const toggleLoading = (show) => {
        $elements.loadingIndicator?.classList.toggle('hidden', !show);
        if (show) {
            $elements.detailsContainer?.classList.add('hidden');
            $elements.errorAlert?.classList.add('hidden');
        }
    };

    const showError = (title, message) => {
        $elements.errorTitle.textContent = title || 'Lỗi!';
        $elements.errorMessage.textContent = message || 'Không thể tải dữ liệu.';
        $elements.errorAlert?.classList.remove('hidden');
        $elements.detailsContainer?.classList.add('hidden'); // Hide details on error
    };

    // Data Fetching & Processing
    const fetchLevelDetails = async (id) => {
        console.log(`Fetching details for level ID: ${id}`);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 300));

        const level = academicLevelsMockData.find(l => l.bac_hoc_id === id);

        if (!level) {
            throw new Error('Academic level not found');
        }
        return level;
    };

    const displayLevelDetails = (data) => {
        if (!data) return;
        currentLevelData = data; // Store for delete action

        $elements.levelId.textContent = data.bac_hoc_id;
        $elements.levelCode.textContent = data.ma_bac_hoc || '-';
        $elements.levelName.textContent = data.ten_bac_hoc;
        $elements.levelStatus.innerHTML = getStatusBadge(data.status);

        // Update Edit button link
        $elements.editButton.href = `academic-level-edit.html?id=${data.bac_hoc_id}`;

        // Show the details container
        $elements.detailsContainer?.classList.remove('hidden');
    };

    // Delete Logic
    const handleDeleteClick = () => {
        if (!currentLevelData) return;
        const levelName = currentLevelData.ten_bac_hoc;
        const levelId = currentLevelData.bac_hoc_id;
        // Show confirmation toast (similar to list page)
        showConfirmationToast(`Bạn có chắc muốn xóa bậc học "${levelName}"?`, levelId);
    };

     const confirmDeleteLevel = async (id) => {
        console.log(`Deleting level with ID: ${id} from detail page`);
        // Simulate API call for deletion
        try {
            await new Promise(resolve => setTimeout(resolve, 500)); // Simulate delay

             // --- Mock Deletion --- (Actual API call needed)
            const index = academicLevelsMockData.findIndex(level => level.bac_hoc_id.toString() === id.toString());
            if (index === -1) {
                 throw new Error('Level not found in mock data during deletion');
            }
             console.log(`Simulating deletion of level ID: ${id}`);
             // --- End Mock Deletion ---

            showToast('Đã xóa bậc học thành công!', 'success');
            // Redirect back to the list page after successful deletion
            setTimeout(() => {
                 window.location.href = 'academic-levels.html';
            }, 1000); // Delay redirection slightly
        } catch (error) {
            console.error("Error deleting level:", error);
            showToast(`Lỗi khi xóa bậc học: ${error.message}`, 'error');
        }
    };

    // Toast Functions (copied from academic-levels.js)
    const showToast = (message, type = "info") => {
        const toastContainer = $elements.toastContainer;
        if (!toastContainer) {
            console.error("Toast container not found!");
            return;
        }

        const toastId = `toast-${Date.now()}`;
        const toast = document.createElement('div');
        toast.id = toastId;
        toast.className = `flex items-center p-4 mb-3 w-full max-w-xs rounded-lg shadow ${getToastBgColor(type)} transition-opacity duration-300 opacity-0`; // Start hidden
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

        // Force reflow to enable transition
        void toast.offsetWidth;
        toast.classList.remove('opacity-0');

        const closeButton = toast.querySelector('button');
        const removeToast = () => {
            toast.classList.add('opacity-0');
            setTimeout(() => toast.remove(), 300); // Wait for transition
        };

        closeButton.addEventListener('click', removeToast);
        setTimeout(removeToast, 5000); // Auto dismiss after 5 seconds
    };

     const showConfirmationToast = (message, idToDelete) => {
        const toastContainer = $elements.toastContainer;
        if (!toastContainer) return;

        const toastId = `confirm-toast-${Date.now()}`;
        const toast = document.createElement('div');
        toast.id = toastId;
        toast.className = 'p-4 w-full max-w-xs bg-white rounded-lg shadow ring-1 ring-black ring-opacity-5';
        toast.setAttribute('role', 'alert');

        toast.innerHTML = `
            <div class="flex items-start">
                <div class="flex-shrink-0 pt-0.5">
                    <i class="ri-error-warning-fill text-yellow-400 text-xl"></i>
                </div>
                <div class="ml-3 w-0 flex-1">
                    <p class="text-sm font-medium text-gray-900">Xác nhận xóa</p>
                    <p class="mt-1 text-sm text-gray-500">${message}</p>
                    <div class="mt-3 flex space-x-3">
                        <button type="button" class="confirm-delete-action px-3 py-1.5 bg-red-600 text-white text-xs font-medium rounded shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                            Xác nhận
                        </button>
                        <button type="button" class="cancel-delete-action px-3 py-1.5 bg-white text-gray-700 text-xs font-medium rounded shadow-sm border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            Hủy bỏ
                        </button>
                    </div>
                </div>
                <div class="ml-4 flex-shrink-0 flex">
                    <button type="button" class="close-toast-btn inline-flex text-gray-400 hover:text-gray-500">
                        <span class="sr-only">Close</span>
                        <i class="ri-close-line"></i>
                    </button>
                </div>
            </div>
        `;

        toastContainer.prepend(toast);

        const removeCurrentToast = () => toast.remove();

        toast.querySelector('.confirm-delete-action').addEventListener('click', () => {
            confirmDeleteLevel(idToDelete);
            removeCurrentToast();
        });
        toast.querySelector('.cancel-delete-action').addEventListener('click', removeCurrentToast);
        toast.querySelector('.close-toast-btn').addEventListener('click', removeCurrentToast);
    };

    // Helper functions for toast styling (copied)
    const getToastBgColor = (type) => {
        switch (type) {
            case 'success': return 'bg-green-50 text-green-800';
            case 'error': return 'bg-red-50 text-red-800';
            case 'warning': return 'bg-yellow-50 text-yellow-800';
            default: return 'bg-blue-50 text-blue-800';
        }
    };
    const getToastIconBgColor = (type) => {
        switch (type) {
            case 'success': return 'bg-green-100 text-green-500';
            case 'error': return 'bg-red-100 text-red-500';
            case 'warning': return 'bg-yellow-100 text-yellow-500';
            default: return 'bg-blue-100 text-blue-500';
        }
    };
    const getToastCloseButtonColor = (type) => {
        switch (type) {
            case 'success': return 'bg-green-50 text-green-500 hover:bg-green-100';
            case 'error': return 'bg-red-50 text-red-500 hover:bg-red-100';
            case 'warning': return 'bg-yellow-50 text-yellow-500 hover:bg-yellow-100';
            default: return 'bg-blue-50 text-blue-500 hover:bg-blue-100';
        }
    };
    const getToastIcon = (type) => {
        switch (type) {
            case 'success': return '<i class="ri-check-line"></i>';
            case 'error': return '<i class="ri-error-warning-line"></i>';
            case 'warning': return '<i class="ri-alert-line"></i>';
            default: return '<i class="ri-information-line"></i>';
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

        sidebarOpen.addEventListener('click', (e) => {
            e.stopPropagation();
            open();
        });
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
                const isVisible = !userMenu.classList.contains('hidden');
                userMenu.classList.toggle('hidden', isVisible);
            });
            document.addEventListener('click', (e) => {
                if (!userMenu.classList.contains('hidden') && !userMenuButton.contains(e.target) && !userMenu.contains(e.target)) {
                    userMenu.classList.add('hidden');
                }
            });
        }
    };

    // Initialization Function
    const initializePage = async () => {
        // Initialize AOS animations
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
            displayLevelDetails(levelData);
        } catch (error) {
            console.error("Failed to load level details:", error);
            showError('Lỗi tải dữ liệu', error.message === 'Academic level not found' ? 'Không tìm thấy bậc học này.' : 'Có lỗi xảy ra khi tải chi tiết.');
        } finally {
            toggleLoading(false);
        }

        // Add event listener for delete button
        $elements.deleteButton?.addEventListener('click', handleDeleteClick);
    };

    // Initialize the page when the DOM is ready
    document.addEventListener('DOMContentLoaded', initializePage);

})(); // End IIFE 