// IIFE to encapsulate the module
(function() {
    'use strict';

    // Initialize AOS
    AOS.init();

    // --- Constants and API Endpoints ---
    const API_BASE_URL = '/api/admin';
    const SCREENS_API_URL = `${API_BASE_URL}/screens`;

    // --- State Variables ---
    let allScreens = []; // Store all screen data from the API
    let currentPage = 1;
    let itemsPerPage = 10;
    let totalPages = 1;
    let filters = {
        name: '',
        code: '',
        status: '',
        cameraId: '',
        templateId: ''
    };

    // --- DOM Elements Cache ---
    const $elements = {
        sidebar: document.getElementById('sidebar'),
        sidebarBackdrop: document.getElementById('sidebar-backdrop'),
        sidebarOpen: document.getElementById('sidebar-open'),
        sidebarClose: document.getElementById('sidebar-close'),
        userMenuButton: document.getElementById('user-menu-button'),
        userMenu: document.getElementById('user-menu'),
        headerAvatar: document.getElementById('header-avatar'),
        headerFullname: document.getElementById('header-fullname'),

        filterForm: document.getElementById('filter-form'),
        filterNameInput: document.getElementById('filter-name'),
        filterCodeInput: document.getElementById('filter-code'),
        filterStatusInput: document.getElementById('filter-status'),
        filterCameraIdInput: document.getElementById('filter-camera-id'),
        filterTemplateIdInput: document.getElementById('filter-template-id'),
        resetFilterBtn: document.getElementById('reset-filter-btn'),
        applyFilterBtn: document.getElementById('apply-filter-btn'),

        screensTableBody: document.getElementById('screensTableBody'),
        noDataPlaceholder: document.getElementById('no-data-placeholder'),
        paginationControls: document.getElementById('pagination-controls'),
        totalItemsCountEl: document.getElementById('total-items-count'),
        totalPagesCountEl: document.getElementById('total-pages-count'),
        currentPageInput: document.getElementById('current-page-input'),
        itemsPerPageSelect: document.getElementById('items-per-page'),
        btnFirst: document.getElementById('pagination-controls')?.querySelector('.btn-first'),
        btnPrev: document.getElementById('pagination-controls')?.querySelector('.btn-prev'),
        btnNext: document.getElementById('pagination-controls')?.querySelector('.btn-next'),
        btnLast: document.getElementById('pagination-controls')?.querySelector('.btn-last'),
    };

    // --- Helper Functions ---
    const formatDateTime = (dateTimeString) => {
        if (!dateTimeString) return '-';
        try {
            // Use moment.js if available
            if (typeof moment !== 'undefined') {
                 return moment(dateTimeString).format('DD/MM/YYYY HH:mm');
            }
            // Basic formatting fallback
            const date = new Date(dateTimeString);
            return date.toLocaleString('vi-VN');
        } catch (error) {
            console.error("Error formatting date:", error);
            return 'Invalid Date';
        }
    };

    const getStatusBadge = (statusValue) => {
        const isActive = statusValue === 1 || statusValue === '1';
        const text = isActive ? 'Hoạt động' : 'Không hoạt động';
        const colorClass = isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
        return `<span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${colorClass}">${text}</span>`;
    };

    // --- API Functions (with Simulated Data) ---
    const fetchScreens = async (currentFilters) => {
        console.log('Fetching screens with filters:', currentFilters);
        const params = new URLSearchParams();
        params.append('page', currentFilters.page || 1);
        params.append('limit', currentFilters.limit || 10);
        if (currentFilters.name) params.append('ten_man_hinh', currentFilters.name);
        if (currentFilters.code) params.append('ma_man_hinh', currentFilters.code);
        if (currentFilters.status !== '') params.append('status', currentFilters.status);
        if (currentFilters.cameraId) params.append('camera_id', currentFilters.cameraId);
        if (currentFilters.templateId) params.append('template_id', currentFilters.templateId);
        
        const url = `${SCREENS_API_URL}?${params.toString()}`;
        console.log(`Simulating API call to: ${url}`);

        try {
            // Simulate API call and data generation
            await new Promise(resolve => setTimeout(resolve, 400));

            // Generate sample data based on man_hinh structure
            const generateSampleScreens = (totalCount) => {
                const data = [];
                const baseTime = Date.now() - 10 * 24 * 60 * 60 * 1000; // 10 days ago
                for (let i = 1; i <= totalCount; i++) {
                    const status = Math.random() > 0.3 ? 1 : 0;
                    const hasCode = Math.random() > 0.2;
                    const hasCamera = Math.random() > 0.4;
                    const hasTemplate = Math.random() > 0.5;
                    const createdAt = new Date(baseTime + Math.random() * 10 * 24 * 60 * 60 * 1000);
                    const updatedAt = status === 1 && Math.random() > 0.5 ? new Date() : null;

                    data.push({
                        man_hinh_id: i + 1000, // Start IDs higher
                        ten_man_hinh: `Màn hình ${String.fromCharCode(65 + (i % 5))}-${Math.floor(i / 5) + 1}`,
                        ma_man_hinh: hasCode ? `MH${String(i + 1000).padStart(4, '0')}` : null,
                        camera_id: hasCamera ? (10 + (i % 10)) : null,
                        template_id: hasTemplate ? (1 + (i % 5)) : null,
                        status: status,
                        created_at: createdAt.toISOString(),
                        updated_at: updatedAt?.toISOString() || null,
                        deleted_at: null
                    });
                }
                return data;
            };

            const allGeneratedScreens = generateSampleScreens(55); // Generate a base set

            // Apply filtering simulation
            const filtered = allGeneratedScreens.filter(screen => {
                const nameMatch = !currentFilters.name || screen.ten_man_hinh.toLowerCase().includes(currentFilters.name.toLowerCase());
                const codeMatch = !currentFilters.code || (screen.ma_man_hinh && screen.ma_man_hinh.toLowerCase().includes(currentFilters.code.toLowerCase()));
                const statusMatch = currentFilters.status === '' || screen.status.toString() === currentFilters.status;
                const cameraMatch = !currentFilters.cameraId || (screen.camera_id && screen.camera_id.toString() === currentFilters.cameraId);
                const templateMatch = !currentFilters.templateId || (screen.template_id && screen.template_id.toString() === currentFilters.templateId);
                return nameMatch && codeMatch && statusMatch && cameraMatch && templateMatch;
            });

            // Apply pagination simulation
            const totalItems = filtered.length;
            const startIndex = (currentFilters.page - 1) * currentFilters.limit;
            const endIndex = startIndex + currentFilters.limit;
            const paginatedData = filtered.slice(startIndex, endIndex);

            return { data: paginatedData, total: totalItems };
            
            /* Structure for actual API call
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`API Error: ${response.statusText}`);
            }
            const result = await response.json();
            return { data: result.data || [], total: result.total || 0 };
            */
        } catch (error) {
            console.error("Error fetching screens:", error);
            throw error; // Re-throw to be handled by the caller
        }
    };

    const deleteScreen = async (id) => {
        console.log(`Attempting to delete screen with ID: ${id}`);
        try {
            // Simulate API call
            const url = `${SCREENS_API_URL}/${id}`;
            await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network delay
            
            console.log(`Screen ${id} deleted (simulated).`);
            return true; // Simulate success
            
            /* Structure for actual API call
            const response = await fetch(url, { method: 'DELETE' });
            if (!response.ok) {
                if (response.status === 404) return false; // Not found
                throw new Error(`API delete error: ${response.statusText}`);
            }
            return true; // Success
            */
        } catch (error) {
            console.error("Error deleting screen:", error);
            throw error;
        }
    };

    // --- Core Functions ---
    const applyFiltersAndLoadData = async () => {
        // Show loading state
        $elements.screensTableBody.innerHTML = `<tr><td colspan="7" class="text-center py-10 text-gray-500">Đang tải dữ liệu...</td></tr>`;
        $elements.noDataPlaceholder?.classList.add('hidden');

        // Get current filter values
        filters.name = $elements.filterNameInput?.value || '';
        filters.code = $elements.filterCodeInput?.value || '';
        filters.status = $elements.filterStatusInput?.value || '';
        filters.cameraId = $elements.filterCameraIdInput?.value || '';
        filters.templateId = $elements.filterTemplateIdInput?.value || '';

        try {
            const response = await fetchScreens({
                ...filters,
                page: currentPage,
                limit: itemsPerPage
            });

            allScreens = response.data || []; // Store the data for the current page
            const totalItems = response.total || 0;

            totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
            // Adjust currentPage if it's out of bounds after filtering/deletion
            if (currentPage > totalPages) {
                currentPage = totalPages;
            }

            renderTable();
            updatePagination(totalItems);
        } catch (error) {
            console.error("Error loading screens:", error);
            $elements.screensTableBody.innerHTML = `<tr><td colspan="7" class="text-center py-10 text-red-500">Lỗi tải dữ liệu. Vui lòng thử lại.</td></tr>`;
            $elements.noDataPlaceholder?.classList.add('hidden');
            updatePagination(0); // Reset pagination display on error
        }
    };

    const loadData = () => {
        currentPage = 1; // Reset to page 1 when applying filters manually
        applyFiltersAndLoadData();
    };

    const renderTable = () => {
        if (!$elements.screensTableBody) return;
        $elements.screensTableBody.innerHTML = ''; // Clear existing rows
        $elements.noDataPlaceholder?.classList.add('hidden');

        if (allScreens.length === 0) {
            $elements.noDataPlaceholder?.classList.remove('hidden');
            return;
        }

        allScreens.forEach(screen => {
            const row = document.createElement('tr');
            row.classList.add('hover:bg-gray-50');

            const cameraDisplay = screen.camera_id !== null ? screen.camera_id : '-';
            const templateDisplay = screen.template_id !== null ? screen.template_id : '-';
            const codeDisplay = screen.ma_man_hinh || '-';

            row.innerHTML = `
                <td class="px-4 py-3 text-sm text-gray-700 font-medium">${screen.man_hinh_id}</td>
                <td class="px-4 py-3 text-sm text-gray-600">${screen.ten_man_hinh}</td>
                <td class="px-4 py-3 text-sm text-gray-500">${codeDisplay}</td>
                <td class="px-4 py-3 text-sm text-gray-500">${cameraDisplay}</td>
                <td class="px-4 py-3 text-sm text-gray-500">${templateDisplay}</td>
                <td class="px-4 py-3 text-sm">${getStatusBadge(screen.status)}</td>
                <td class="px-4 py-3 text-right text-sm font-medium space-x-1 whitespace-nowrap">
                <a href="screen-detail.html?id=${screen.man_hinh_id}" class="btn-detail p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded" title="Xem chi tiết">
                    <i class="ri-eye-line"></i>
                </a>
                <a href="screen-edit.html?id=${screen.man_hinh_id}" class="btn-edit p-1 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-100 rounded" title="Sửa">
                    <i class="ri-pencil-line"></i>
                </a>
                <button class="btn-delete p-1 text-red-600 hover:text-red-800 hover:bg-red-100 rounded" title="Xóa" data-id="${screen.man_hinh_id}">
                    <i class="ri-delete-bin-line"></i>
                </button>
                </td>
            `;

            // Add event listeners for action buttons
            row.querySelector('.btn-delete').addEventListener('click', () => handleDeleteScreen(screen.man_hinh_id));

            $elements.screensTableBody.appendChild(row);
        });
    };

    const updatePagination = (totalItems) => {
        if (!$elements.paginationControls) return;
        // totalPages calculated in applyFiltersAndLoadData
        if ($elements.totalItemsCountEl) $elements.totalItemsCountEl.textContent = totalItems;
        if ($elements.totalPagesCountEl) $elements.totalPagesCountEl.textContent = totalPages;
        if ($elements.currentPageInput) {
            $elements.currentPageInput.value = currentPage;
            $elements.currentPageInput.max = totalPages;
        }

        // Enable/disable buttons
        if ($elements.btnFirst) $elements.btnFirst.disabled = currentPage === 1;
        if ($elements.btnPrev) $elements.btnPrev.disabled = currentPage === 1;
        if ($elements.btnNext) $elements.btnNext.disabled = currentPage === totalPages;
        if ($elements.btnLast) $elements.btnLast.disabled = currentPage === totalPages;

        // Hide pagination if only one page
        if (totalPages <= 1) {
            $elements.paginationControls.classList.add('hidden');
        } else {
            $elements.paginationControls.classList.remove('hidden');
        }
    };

    const goToPage = (page) => {
        const targetPage = Math.max(1, Math.min(page, totalPages));
        if (targetPage !== currentPage) {
            currentPage = targetPage;
            applyFiltersAndLoadData(); // Fetch data for the new page
        }
    };

    const handleDeleteScreen = async (id) => {
        if (confirm(`Bạn có chắc chắn muốn xóa màn hình có ID ${id} không?`)) {
            try {
                const success = await deleteScreen(id);
                if (success) {
                    alert('Màn hình đã được xóa thành công.');
                    // Reload data, check if the current page becomes empty
                    applyFiltersAndLoadData(); // Let this handle page adjustment
                } else {
                    alert('Xóa màn hình thất bại. Màn hình không tồn tại hoặc có lỗi.');
                }
            } catch (error) {
                console.error("Error deleting screen:", error);
                alert('Có lỗi xảy ra khi xóa màn hình.');
            }
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

    // --- Event Listener Registration ---
    const registerEventListeners = () => {
        // Filter form events
        $elements.filterForm?.addEventListener('submit', (e) => {
            e.preventDefault();
            loadData();
        });
        
        $elements.resetFilterBtn?.addEventListener('click', () => {
            $elements.filterForm.reset();
            loadData();
        });

        // Pagination events
        $elements.itemsPerPageSelect?.addEventListener('change', (e) => {
            itemsPerPage = parseInt(e.target.value);
            goToPage(1); // Go to first page when changing items per page
        });
        
        $elements.currentPageInput?.addEventListener('change', (e) => {
            goToPage(parseInt(e.target.value));
        });
        
        $elements.currentPageInput?.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                goToPage(parseInt(e.target.value));
            }
        });
        
        $elements.btnFirst?.addEventListener('click', () => goToPage(1));
        $elements.btnPrev?.addEventListener('click', () => goToPage(currentPage - 1));
        $elements.btnNext?.addEventListener('click', () => goToPage(currentPage + 1));
        $elements.btnLast?.addEventListener('click', () => goToPage(totalPages));
    };

    // --- Main Initialization ---
    const init = () => {
        // Set up UI
        setupSidebar();
        setupUserMenu();
        
        // Initialize animation library
        AOS.init();
        
        // Set initial values
        itemsPerPage = parseInt($elements.itemsPerPageSelect?.value || '10');
        
        // Register event listeners
        registerEventListeners();
        
        // Initial data load
        applyFiltersAndLoadData();
    };

    // Initialize when DOM is ready
    document.addEventListener('DOMContentLoaded', init);
})(); 