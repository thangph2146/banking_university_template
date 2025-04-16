// Initialize AOS
AOS.init();

// State variables
let allCheckouts = []; // Store all checkouts
let currentPage = 1;
let itemsPerPage = 10;
let totalPages = 1;
let filters = {
    search: '',
    event: '',
    checkoutType: '', // Added filter for checkout type
    dateRange: { startDate: null, endDate: null } // For daterangepicker (filtering by checkout time)
};

// DOM Elements
const checkoutsTableBody = document.getElementById('checkoutsTableBody');
const paginationControls = document.getElementById('pagination-controls');
const currentPageInput = document.getElementById('current-page-input');
const totalPagesCount = document.getElementById('total-pages-count');
const totalItemsCount = document.getElementById('total-items-count');
const itemsPerPageSelect = document.getElementById('items-per-page');
const noDataPlaceholder = document.getElementById('no-data-placeholder');

// Filter Elements
const filterForm = document.getElementById('filter-form');
const filterSearchInput = document.getElementById('filter-search');
const filterEventSelect = document.getElementById('filter-event');
const filterCheckoutTypeSelect = document.getElementById('filter-checkout-type'); // Added
const filterDateInput = document.getElementById('filter-date'); // Daterangepicker input (for checkout time)
const resetFilterBtn = document.getElementById('reset-filter-btn');
const refreshBtn = document.getElementById('refresh-btn'); // Assuming a refresh button exists like in checkins

// Helper Functions (assuming these are globally available or copy them here)
const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return '-';
    try {
        // Using moment.js for robust formatting, ensure it's loaded
        if (typeof moment !== 'undefined') {
            return moment(dateTimeString).format('DD/MM/YYYY HH:mm');
        }
        // Fallback basic formatter
        const date = new Date(dateTimeString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${day}/${month}/${year} ${hours}:${minutes}`;
    } catch (error) {
        console.error("Error formatting date:", dateTimeString, error);
        return 'Invalid Date';
    }
};

// Calculates duration in minutes between two date strings
const calculateDurationMinutes = (start, end) => {
    if (!start || !end) return '-';
    try {
        const startDate = new Date(start);
        const endDate = new Date(end);
        if (isNaN(startDate) || isNaN(endDate) || endDate < startDate) return '-'; // Invalid dates or end before start
        const diffMs = endDate - startDate;
        return Math.round(diffMs / (1000 * 60)); // Difference in minutes
    } catch (error) {
        console.error("Error calculating duration:", start, end, error);
        return '-';
    }
};

// Maps checkout type codes to readable names
const getCheckoutTypeName = (type) => {
    const types = {
        'face_id': 'Face ID',
        'manual': 'Thủ công',
        'qr_code': 'QR Code',
        'auto': 'Tự động (Timeout)',
        'online': 'Online'
    };
    return types[type] || type || '-'; // Return readable name or the type code itself or '-'
};

// Gets participation type (Assuming it's stored or can be derived)
const getParticipationType = (checkout) => {
    // Placeholder: Derive from event type or registration data if available
    // Example: Check if Event object has a type property
    if (checkout?.Event?.Type === 'Online') return 'Online';
    if (checkout?.Event?.Type === 'Offline') return 'Offline';
    // Or based on Registration data if linked
    if (checkout?.Registration?.ParticipationType) return checkout.Registration.ParticipationType;
    return 'N/A'; // Default if cannot determine
};


// API Function (Placeholder)
const fetchCheckouts = async (currentFilters) => {
    // TODO: Replace with actual API call to fetch checkouts
    console.log('Fetching checkouts with filters:', currentFilters);
    const apiUrl = '/api/admin/checkouts'; // Adjust API endpoint if needed
    const params = new URLSearchParams();

    params.append('page', currentFilters.page || 1);
    params.append('limit', currentFilters.limit || 10);
    if (currentFilters.search) params.append('search', currentFilters.search);
    if (currentFilters.event) params.append('eventId', currentFilters.event);
    if (currentFilters.checkoutType) params.append('checkoutType', currentFilters.checkoutType);
    if (currentFilters.dateRange?.startDate) params.append('checkout_start_time', currentFilters.dateRange.startDate.toISOString());
    if (currentFilters.dateRange?.endDate) params.append('checkout_end_time', currentFilters.dateRange.endDate.toISOString());
    // Add sorting params if needed, e.g., params.append('sort', 'thoi_gian_check_out_desc');

    console.log(`API Request URL (simulated): ${apiUrl}?${params.toString()}`);

    // --- Sample Data Generation (Reflecting checkout_sukien + related data) ---
    const sampleDataFromAPI = [
        {
            checkout_sukien_id: 101,
            su_kien_id: 1,
            checkin_sukien_id: 1,
            email: 'an.nv@example.com',
            ho_ten: 'Nguyễn Văn An',
            thoi_gian_check_out: '2024-07-28T11:35:00Z',
            checkout_type: 'face_id',
            face_image_path: 'https://picsum.photos/seed/101/300/200', // Added checkout image path
            ghi_chu: 'Checked out via Face Recognition.',
            attendance_duration_minutes: 95,
            hinh_thuc_tham_gia: 'offline',
            User: { AccountId: 'U001', FullName: 'Nguyễn Văn An', Email: 'an.nv@example.com', Avatar: 'https://ui-avatars.com/api/?name=An+NV&background=random' },
            Event: { EventID: 1, EventName: 'Hội thảo AI 2024', Type: 'Offline' },
            CheckInTime: '2024-07-28T10:00:00Z'
        },
        {
            checkout_sukien_id: 102,
            su_kien_id: 2,
            checkin_sukien_id: 2,
            email: 'binh.tt@example.com',
            ho_ten: 'Trần Thị Bình',
            thoi_gian_check_out: '2024-07-27T16:05:00Z',
            checkout_type: 'manual',
            face_image_path: null, // Manual checkout might not have image
            ghi_chu: 'Admin manually checked out user.',
            attendance_duration_minutes: 95,
            hinh_thuc_tham_gia: 'online',
            User: { AccountId: 'U002', FullName: 'Trần Thị Bình', Email: 'binh.tt@example.com', Avatar: 'https://ui-avatars.com/api/?name=Binh+TT&background=random' },
            Event: { EventID: 2, EventName: 'Workshop Marketing Online', Type: 'Online' },
            CheckInTime: '2024-07-27T14:30:00Z'
        },
        {
            checkout_sukien_id: 103,
            su_kien_id: 1,
            checkin_sukien_id: 3,
            email: 'cuong.lv@example.com',
            ho_ten: 'Lê Văn Cường',
            thoi_gian_check_out: '2024-07-28T11:00:00Z',
            checkout_type: 'auto',
            face_image_path: 'https://picsum.photos/seed/103/300/200', // Auto checkout might have image
            ghi_chu: 'User timed out or left venue area.',
            attendance_duration_minutes: 45,
            hinh_thuc_tham_gia: 'offline',
            User: { AccountId: 'U003', FullName: 'Lê Văn Cường', Email: 'cuong.lv@example.com', Avatar: 'https://ui-avatars.com/api/?name=Cuong+LV&background=random' },
            Event: { EventID: 1, EventName: 'Hội thảo AI 2024', Type: 'Offline' },
            CheckInTime: '2024-07-28T10:15:00Z'
        },
        // Record for user not checked out removed as it won't appear in checkout list
    ];

    // Filter sample data based on provided filters (using API field names)
    let filteredData = sampleDataFromAPI.filter(co => {
         // Filter only actual checkout records for the list view
         if (!co.checkout_sukien_id) return false;

        const checkoutMoment = co.thoi_gian_check_out ? moment(co.thoi_gian_check_out) : null;
        const nameMatch = !currentFilters.search || (co.ho_ten || '').toLowerCase().includes(currentFilters.search.toLowerCase());
        const emailMatch = !currentFilters.search || (co.email || '').toLowerCase().includes(currentFilters.search.toLowerCase());
        const userCodeMatch = !currentFilters.search || (co.User?.AccountId || '').toLowerCase().includes(currentFilters.search.toLowerCase()); // Use joined data if available for search
        const eventMatch = !currentFilters.event || co.su_kien_id == currentFilters.event;
        const typeMatch = !currentFilters.checkoutType || co.checkout_type === currentFilters.checkoutType;
        const dateMatch = !checkoutMoment || (
            (!currentFilters.dateRange?.startDate || checkoutMoment.isSameOrAfter(currentFilters.dateRange.startDate, 'day')) &&
            (!currentFilters.dateRange?.endDate || checkoutMoment.isSameOrBefore(currentFilters.dateRange.endDate, 'day'))
        );
        return (nameMatch || emailMatch || userCodeMatch) && eventMatch && typeMatch && dateMatch;
    });

    // Map filtered data to the structure renderTable expects (PascalCase/camelCase)
    // This mapping assumes the frontend JS prefers this casing.
    // If API returns this structure directly, this map isn't needed.
     const mappedFilteredData = filteredData.map(item => ({
        ID: item.checkout_sukien_id,
        CheckInID: item.checkin_sukien_id,
        AccountID: item.User?.AccountId, // From joined data
        EventID: item.su_kien_id,
        CheckInTime: item.CheckInTime, // From joined data
        CheckOutTime: item.thoi_gian_check_out,
        CheckoutType: item.checkout_type,
        CheckoutImagePath: item.face_image_path, // Add image path
        Notes: item.ghi_chu,
        User: item.User, // Pass joined User object
        Event: item.Event, // Pass joined Event object
        // Duration and Participation Type will be calculated/derived in renderTable
        // Original hinh_thuc_tham_gia is available if needed: item.hinh_thuc_tham_gia
    }));

    // Simulate pagination on the mapped filtered data
    const totalItems = mappedFilteredData.length;
    const startIndex = (currentFilters.page - 1) * currentFilters.limit;
    const endIndex = startIndex + currentFilters.limit;
    const paginatedData = mappedFilteredData.slice(startIndex, endIndex);


    return { data: paginatedData, total: totalItems }; // Return structure { data: [], total: number }

    /*
    // Actual fetch structure (assuming API returns data ready for renderTable)
    try {
        const response = await fetch(`${apiUrl}?${params.toString()}`);
        if (!response.ok) {
            throw new Error(`API error: ${response.statusText}`);
        }
        const result = await response.json();
        return { data: result.data || [], total: result.total || 0 };
    } catch (error) {
        console.error("Error fetching checkouts:", error);
        throw error; // Re-throw to be handled by caller
    }
    */
};

const fetchEventsForFilter = async () => {
    // Reuse function from checkins.js logic if available, otherwise implement here
    // TODO: API call to fetch list of events for filter dropdown
    console.log('Fetching events for filter...');
    const apiUrl = '/api/admin/events?limit=all'; // Example endpoint
    try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 150));
         return [
            { EventID: 1, EventName: 'Hội thảo AI 2024' },
            { EventID: 2, EventName: 'Workshop Marketing Online' },
            { EventID: 3, EventName: 'Team Building 2024' },
        ];
        /* // Actual fetch
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error(`API error: ${response.statusText}`);
        const result = await response.json();
        return result.data || []; // Assuming API returns { data: [...] }
        */
    } catch (error) {
        console.error("Error fetching events for filter:", error);
        return []; // Return empty array on error
    }
}

const deleteCheckout = async (id) => {
    // TODO: API call to delete checkout with the given ID
    console.log(`Deleting checkout with ID: ${id}`);
    const apiUrl = `/api/admin/checkouts/${id}`; // Adjust endpoint
    try {
        // Simulate API Call
        await new Promise(resolve => setTimeout(resolve, 400));
        // Check if ID exists in sample data (for simulation)
        const index = allCheckouts.findIndex(co => co.ID === id);
        if (index === -1 && !sampleData.some(co => co.ID === id)) { // Check original sample too
            console.warn(`Checkout ID ${id} not found for deletion (simulation).`);
            // throw new Error("Checkout not found"); // Or return false
            return false;
        }
        console.log(`Checkout ${id} deleted (simulated).`);
        return true; // Simulate success
        /* // Actual fetch
         const response = await fetch(apiUrl, { method: 'DELETE' });
         if (!response.ok) {
             if (response.status === 404) return false; // Not found
             throw new Error(`API delete error: ${response.statusText}`);
         }
         return true; // Success
        */
    } catch (error) {
        console.error("Error deleting checkout:", error);
        throw error;
    }
}

// Core Functions
const applyFiltersAndLoadData = async () => {
    // TODO: Add loading indicator if needed
    checkoutsTableBody.innerHTML = '<tr><td colspan="8" class="text-center py-4 text-gray-500">Đang tải dữ liệu...</td></tr>'; // Update colspan
    noDataPlaceholder.classList.add('hidden');

    try {
        // Get current filters
        filters.search = filterSearchInput?.value || '';
        filters.event = filterEventSelect?.value || '';
        filters.checkoutType = filterCheckoutTypeSelect?.value || '';
        // filters.dateRange is updated by daterangepicker events

        const apiParams = {
            ...filters,
            page: currentPage,
            limit: itemsPerPage,
            // Add sorting params if needed
        };

        const response = await fetchCheckouts(apiParams);
        allCheckouts = response.data || []; // Store fetched data
        const totalItems = response.total || 0;

        totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
        if (currentPage > totalPages) currentPage = totalPages; // Adjust currentPage if out of bounds

        renderTable();
        updatePagination(totalItems);

    } catch (error) {
        console.error("Error loading checkouts:", error);
        checkoutsTableBody.innerHTML = '<tr><td colspan="8" class="text-center py-4 text-red-500">Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại.</td></tr>'; // Update colspan
        noDataPlaceholder.classList.add('hidden');
        updatePagination(0); // Reset pagination
    } finally {
        // TODO: Hide loading indicator
    }
};

// Renamed function for clarity
const loadData = () => {
    currentPage = 1; // Reset to page 1 when applying filters manually
    applyFiltersAndLoadData();
}

const renderTable = () => {
    if (!checkoutsTableBody) return;
    checkoutsTableBody.innerHTML = ''; // Clear existing rows
    noDataPlaceholder.classList.add('hidden');

    if (allCheckouts.length === 0) {
        noDataPlaceholder.classList.remove('hidden');
        // Update colspan to 8 based on the final table structure
        checkoutsTableBody.innerHTML = '<tr><td colspan="8" class="text-center py-10 text-gray-500">Không có dữ liệu check-out nào phù hợp.</td></tr>';
        return;
    }

    allCheckouts.forEach(checkout => {
        const row = document.createElement('tr');
        const duration = calculateDurationMinutes(checkout.CheckInTime, checkout.CheckOutTime);
        const participationType = getParticipationType(checkout);
        const checkoutImageUrl = checkout.CheckoutImagePath; // Get image URL from mapped data

        row.innerHTML = `
            <td class="px-4 py-4 whitespace-nowrap">
                <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10">
                         <img class="h-10 w-10 rounded-full object-cover border" src="${checkout.User?.Avatar || 'https://ui-avatars.com/api/?name=?&background=gray&color=fff'}" alt="${checkout.User?.FullName || ''}">
                    </div>
                    <div class="ml-4">
                        <div class="text-sm font-medium text-gray-900">${checkout.User?.FullName || 'N/A'} (${checkout.AccountID || 'N/A'})</div>
                        <div class="text-sm text-gray-500">${checkout.User?.Email || 'N/A'}</div>
                    </div>
                </div>
            </td>
            <td class="px-4 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">${checkout.Event?.EventName || 'N/A'}</div>
                <div class="text-sm text-gray-500">ID: ${checkout.EventID || 'N/A'}</div>
            </td>
            <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500">${formatDateTime(checkout.CheckOutTime)}</td>
            <td class="px-4 py-4 whitespace-nowrap text-sm text-center text-gray-700">${duration !== '-' ? `${duration} phút` : '-'}</td>
            <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-700">${getCheckoutTypeName(checkout.CheckoutType)}</td>
             <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                 <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${participationType === 'Online' ? 'bg-blue-100 text-blue-800' : (participationType === 'Offline' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800')}">
                    ${participationType}
                 </span>
            </td>
            <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                 ${checkoutImageUrl ? `
                    <a href="${checkoutImageUrl}" target="_blank" title="Xem ảnh gốc">
                        <img src="${checkoutImageUrl}" alt="Ảnh Check-out" class="h-10 w-auto rounded object-cover hover:opacity-80 transition-opacity">
                    </a>
                 ` : '-'}
            </td>
            <td class="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex justify-end space-x-2">
                    <a href="checkout-detail.html?id=${checkout.ID}" class="text-blue-600 hover:text-blue-900" title="Xem chi tiết">
                        <i class="ri-eye-line"></i>
                    </a>
                     <a href="checkout-edit.html?id=${checkout.ID}" class="text-indigo-600 hover:text-indigo-900" title="Sửa">
                        <i class="ri-pencil-line"></i>
                    </a>
                    <button class="text-red-600 hover:text-red-900 action-btn" title="Xóa" data-id="${checkout.ID}" data-action="delete">
                        <i class="ri-delete-bin-line"></i>
                    </button>
                </div>
            </td>
        `;
        checkoutsTableBody.appendChild(row);
    });

    // Add event listeners for action buttons
    document.querySelectorAll('.action-btn[data-action="delete"]').forEach(button => {
        button.removeEventListener('click', handleActionClick); // Prevent duplicates
        button.addEventListener('click', handleActionClick);
    });
};

const updatePagination = (totalItems) => {
    if (!paginationControls) return;
    // totalPages calculated in applyFiltersAndLoadData
    if (totalPagesCount) totalPagesCount.textContent = totalPages;
    if (totalItemsCount) totalItemsCount.textContent = totalItems;
    if (currentPageInput) {
        currentPageInput.value = currentPage;
        currentPageInput.max = totalPages;
    }
    const btnFirst = paginationControls.querySelector('.btn-first');
    const btnPrev = paginationControls.querySelector('.btn-prev');
    const btnNext = paginationControls.querySelector('.btn-next');
    const btnLast = paginationControls.querySelector('.btn-last');

    if (btnFirst) btnFirst.disabled = currentPage === 1;
    if (btnPrev) btnPrev.disabled = currentPage === 1;
    if (btnNext) btnNext.disabled = currentPage === totalPages;
    if (btnLast) btnLast.disabled = currentPage === totalPages;
};

const goToPage = (page) => {
    const targetPage = Math.max(1, Math.min(page, totalPages));
    if (targetPage !== currentPage) {
        currentPage = targetPage;
        applyFiltersAndLoadData(); // Fetch data for the new page
    }
};

// Populate Select Options
const populateSelectOptions = async () => {
    try {
        const events = await fetchEventsForFilter();
        if (filterEventSelect) {
            const currentEventFilterValue = filterEventSelect.value; // Preserve selection
            filterEventSelect.innerHTML = '<option value="">Tất cả sự kiện</option>';
            events.forEach(event => {
                if (event && event.EventID && event.EventName) {
                    filterEventSelect.innerHTML += `<option value="${event.EventID}">${event.EventName}</option>`;
                }
            });
            filterEventSelect.value = currentEventFilterValue; // Restore selection
        }
        // No need to populate checkout types dynamically unless they come from API
    } catch (error) {
        console.error("Error populating event filter:", error);
        if (filterEventSelect) {
             filterEventSelect.innerHTML = '<option value="">Lỗi tải sự kiện</option>';
        }
    }
};

// Event Handlers
const handleActionClick = async (event) => {
    const button = event.currentTarget;
    const id = parseInt(button.dataset.id);
    const action = button.dataset.action;

    if (action === 'delete') {
        if (confirm(`Bạn có chắc chắn muốn xóa lượt check-out ID: ${id}?`)) {
            button.disabled = true; // Disable button during operation
            try {
                const success = await deleteCheckout(id);
                if (success) {
                    alert('Đã xóa lượt check-out.');
                    // Reload data on the current page. Check if page becomes empty.
                    const remainingItems = allCheckouts.length - 1;
                    if (remainingItems === 0 && currentPage > 1) {
                        currentPage -= 1; // Go to previous page if current one is empty
                    }
                    applyFiltersAndLoadData(); // Reload data
                } else {
                    alert('Xóa không thành công. Lượt check-out không tồn tại hoặc có lỗi xảy ra.');
                    button.disabled = false;
                }
            } catch (error) {
                 console.error("Error deleting checkout:", error);
                 alert('Có lỗi xảy ra khi xóa. Vui lòng thử lại.');
                 button.disabled = false;
            }
        }
    }
};

// Daterangepicker Initialization
const setupDateRangePicker = () => {
    if (!filterDateInput) return;
    $(filterDateInput).daterangepicker({
        autoUpdateInput: false,
        opens: 'left',
        locale: {
            format: 'DD/MM/YYYY',
            separator: ' - ',
            applyLabel: 'Áp dụng',
            cancelLabel: 'Xóa',
            fromLabel: 'Từ',
            toLabel: 'Đến',
            customRangeLabel: 'Tùy chỉnh',
            daysOfWeek: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'],
            monthNames: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'],
            firstDay: 1
        },
        ranges: {
           'Hôm nay': [moment(), moment()],
           'Hôm qua': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
           '7 ngày qua': [moment().subtract(6, 'days'), moment()],
           '30 ngày qua': [moment().subtract(29, 'days'), moment()],
           'Tháng này': [moment().startOf('month'), moment().endOf('month')],
           'Tháng trước': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
        }
    });

    $(filterDateInput).on('apply.daterangepicker', function(ev, picker) {
        filters.dateRange.startDate = picker.startDate.toDate();
        filters.dateRange.endDate = picker.endDate.toDate();
        $(this).val(picker.startDate.format('DD/MM/YYYY') + ' - ' + picker.endDate.format('DD/MM/YYYY'));
        loadData(); // Reload data when date range changes
    });

    $(filterDateInput).on('cancel.daterangepicker', function(ev, picker) {
        filters.dateRange.startDate = null;
        filters.dateRange.endDate = null;
        $(this).val('');
        loadData(); // Reload data when date range is cleared
    });
};

// Initialize Page
const initializeCheckoutsPage = async () => {
    // Setup common UI elements
    setupSidebar(); // Assuming function exists
    setupUserMenu(); // Assuming function exists

    setupDateRangePicker();

    await populateSelectOptions(); // Populate event filter dropdown

    applyFiltersAndLoadData(); // Initial data load

    // Filter Event Listeners
    if (filterForm) {
        filterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            loadData();
        });
    }

    if (resetFilterBtn) {
        resetFilterBtn.addEventListener('click', () => {
            if (filterForm) filterForm.reset();
            // Reset date range picker
            if (filterDateInput) $(filterDateInput).val('');
            // Reset filters state object
            filters = { search: '', event: '', checkoutType: '', dateRange: { startDate: null, endDate: null } };
            loadData();
        });
    }

    // Refresh button listener (if exists)
    if (refreshBtn) {
        refreshBtn.addEventListener('click', async () => {
            console.log('Refreshing checkout data...');
             await populateSelectOptions(); // Update event list
            applyFiltersAndLoadData(); // Reload data with current filters
            // Optionally show a success message
            // alert('Dữ liệu Check-out đã được làm mới.');
        });
    }

    // Pagination Event Listeners
    if (itemsPerPageSelect) {
        itemsPerPageSelect.addEventListener('change', (e) => {
            itemsPerPage = parseInt(e.target.value);
            goToPage(1); // Go to first page when changing items per page
        });
    }
    if (currentPageInput) {
        currentPageInput.addEventListener('change', (e) => goToPage(parseInt(e.target.value)));
        currentPageInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') goToPage(parseInt(e.target.value)); });
    }
    if (paginationControls) {
        paginationControls.querySelector('.btn-first')?.addEventListener('click', () => goToPage(1));
        paginationControls.querySelector('.btn-prev')?.addEventListener('click', () => goToPage(currentPage - 1));
        paginationControls.querySelector('.btn-next')?.addEventListener('click', () => goToPage(currentPage + 1));
        paginationControls.querySelector('.btn-last')?.addEventListener('click', () => goToPage(totalPages));
    }
};

// Add setupSidebar and setupUserMenu functions (Copy or ensure they are globally available)
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
    const userMenuButton = document.getElementById('user-menu-button');
    const userMenu = document.getElementById('user-menu');
    const headerAvatar = document.getElementById('header-avatar');
    const headerFullname = document.getElementById('header-fullname');

    // TODO: Replace with actual user data from API or session
    const currentUser = {
        FullName: 'Admin User', // Placeholder
        Avatar: 'https://ui-avatars.com/api/?name=Admin+User&background=0D8ABC&color=fff' // Placeholder
    };

    if (headerAvatar) {
        headerAvatar.src = currentUser.Avatar;
        headerAvatar.alt = currentUser.FullName;
    }
    if (headerFullname) {
        headerFullname.textContent = currentUser.FullName;
    }

    if (userMenuButton && userMenu) {
        // Toggle logic (ensure group-hover classes are handled if necessary)
         userMenuButton.addEventListener('click', (event) => {
            event.stopPropagation();
            const isVisible = !userMenu.classList.contains('invisible');
            userMenu.classList.toggle('opacity-0', !isVisible);
            userMenu.classList.toggle('invisible', !isVisible);
            userMenu.classList.toggle('scale-95', !isVisible);
            userMenu.classList.toggle('scale-100', isVisible);
        });

        // Click outside to close
        document.addEventListener('click', (e) => {
             if (!userMenu.classList.contains('invisible') && !userMenuButton.contains(e.target) && !userMenu.contains(e.target)) {
                 userMenu.classList.add('opacity-0', 'invisible', 'scale-95');
                 userMenu.classList.remove('scale-100');
            }
        });
    }
};

// Initialize the page
document.addEventListener('DOMContentLoaded', initializeCheckoutsPage);

// Sample data needed for simulation in fetchCheckouts (defined outside to be accessible)
// Removed the global sampleData definition as it's now inside fetchCheckouts simulation
