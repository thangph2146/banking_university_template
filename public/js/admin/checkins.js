// Initialize AOS
AOS.init();

// State variables
let allCheckins = []; // Store all checkins (from API or sample)
let currentCheckins = []; // Store checkins for the current page
let currentPage = 1;
let itemsPerPage = 10;
let totalPages = 1;
let filters = {
    search: '',
    event: '',
    dateRange: { startDate: null, endDate: null } // For daterangepicker
};

// Sample Data (Based on checkin_sukien structure)
// const generateSampleCheckins = () => { ... }; // Xóa toàn bộ hàm này

// DOM Elements
const checkinsTableBody = document.getElementById('checkinsTableBody');
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
const filterDateInput = document.getElementById('filter-date'); // Daterangepicker input
const resetFilterBtn = document.getElementById('reset-filter-btn');
const refreshBtn = document.getElementById('refresh-btn'); // Thêm nút refresh

// Helper Functions (assuming these are globally available or copy them here)
const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    } catch (error) {
        return '-';
    }
};

const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return '-';
    try {
        const date = new Date(dateTimeString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${day}/${month}/${year} ${hours}:${minutes}`;
    } catch (error) {
        return '-';
    }
};

// API Function (Placeholder)
const fetchCheckins = async (currentFilters) => {
    // TODO: API call to fetch checkins based on filters and pagination settings
    console.log('Fetching checkins with filters:', currentFilters);
    
    // Đợi một chút để giả lập API call
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Dữ liệu mẫu lớn hơn để test phân trang
    const allSampleData = [
        { ID: 1, EventID: 1, AccountID: 'U001', DeviceID: 'DVC001', LocationID: 'LOC01', CheckInTime: '2024-07-28T10:00:00Z', HinhAnhCheckIn: 'https://picsum.photos/seed/1/300/200', User: { AccountId: 'U001', FullName: 'Nguyễn Văn An', Email: 'an.nv@example.com', Avatar: 'https://ui-avatars.com/api/?name=An+NV&background=random' }, Event: { EventID: 1, EventName: 'Hội thảo AI 2024', StartTime: '2024-09-15T09:00:00Z' }, Device: { DeviceID: 'DVC001', DeviceName: 'Thiết bị Check-in Cổng 1' }, Location: { LocationID: 'LOC01', LocationName: 'Cổng chính' } },
        { ID: 2, EventID: 2, AccountID: 'U002', DeviceID: 'DVC002', LocationID: 'LOC02', CheckInTime: '2024-07-27T14:30:00Z', HinhAnhCheckIn: 'https://picsum.photos/seed/2/300/200', User: { AccountId: 'U002', FullName: 'Trần Thị Bình', Email: 'binh.tt@example.com', Avatar: 'https://ui-avatars.com/api/?name=Binh+TT&background=random' }, Event: { EventID: 2, EventName: 'Workshop Marketing Online', StartTime: '2024-10-20T14:00:00Z' }, Device: { DeviceID: 'DVC002', DeviceName: 'Thiết bị Check-in Cổng 2' }, Location: { LocationID: 'LOC02', LocationName: 'Hội trường A' } },
        { ID: 3, EventID: 3, AccountID: 'U003', DeviceID: 'DVC001', LocationID: 'LOC01', CheckInTime: '2024-07-26T09:15:00Z', HinhAnhCheckIn: 'https://picsum.photos/seed/3/300/200', User: { AccountId: 'U003', FullName: 'Lê Văn Cường', Email: 'cuong.lv@example.com', Avatar: 'https://ui-avatars.com/api/?name=Cuong+LV&background=random' }, Event: { EventID: 3, EventName: 'Khóa học Lập trình Python', StartTime: '2024-08-10T08:00:00Z' }, Device: { DeviceID: 'DVC001', DeviceName: 'Thiết bị Check-in Cổng 1' }, Location: { LocationID: 'LOC01', LocationName: 'Cổng chính' } },
        { ID: 4, EventID: 1, AccountID: 'U004', DeviceID: 'DVC003', LocationID: 'LOC03', CheckInTime: '2024-07-28T11:45:00Z', HinhAnhCheckIn: 'https://picsum.photos/seed/4/300/200', User: { AccountId: 'U004', FullName: 'Phạm Thị Dung', Email: 'dung.pt@example.com', Avatar: 'https://ui-avatars.com/api/?name=Dung+PT&background=random' }, Event: { EventID: 1, EventName: 'Hội thảo AI 2024', StartTime: '2024-09-15T09:00:00Z' }, Device: { DeviceID: 'DVC003', DeviceName: 'Thiết bị Check-in Cổng 3' }, Location: { LocationID: 'LOC03', LocationName: 'Hội trường B' } },
        { ID: 5, EventID: 2, AccountID: 'U005', DeviceID: 'DVC002', LocationID: 'LOC02', CheckInTime: '2024-07-27T15:00:00Z', HinhAnhCheckIn: 'https://picsum.photos/seed/5/300/200', User: { AccountId: 'U005', FullName: 'Hoàng Minh Đức', Email: 'duc.hm@example.com', Avatar: 'https://ui-avatars.com/api/?name=Duc+HM&background=random' }, Event: { EventID: 2, EventName: 'Workshop Marketing Online', StartTime: '2024-10-20T14:00:00Z' }, Device: { DeviceID: 'DVC002', DeviceName: 'Thiết bị Check-in Cổng 2' }, Location: { LocationID: 'LOC02', LocationName: 'Hội trường A' } },
        { ID: 6, EventID: 3, AccountID: 'U006', DeviceID: 'DVC001', LocationID: 'LOC01', CheckInTime: '2024-07-26T09:30:00Z', HinhAnhCheckIn: 'https://picsum.photos/seed/6/300/200', User: { AccountId: 'U006', FullName: 'Nguyễn Thị Giang', Email: 'giang.nt@example.com', Avatar: 'https://ui-avatars.com/api/?name=Giang+NT&background=random' }, Event: { EventID: 3, EventName: 'Khóa học Lập trình Python', StartTime: '2024-08-10T08:00:00Z' }, Device: { DeviceID: 'DVC001', DeviceName: 'Thiết bị Check-in Cổng 1' }, Location: { LocationID: 'LOC01', LocationName: 'Cổng chính' } },
    ];
    
    // Thực hiện filter dữ liệu dựa trên các điều kiện
    let filteredData = [...allSampleData];
    
    // Filter theo search term (tìm trong tên người dùng, email, và tên sự kiện)
    if (currentFilters.search) {
        const searchTerm = currentFilters.search.toLowerCase();
        filteredData = filteredData.filter(item => 
            (item.User?.FullName && item.User.FullName.toLowerCase().includes(searchTerm)) || 
            (item.User?.Email && item.User.Email.toLowerCase().includes(searchTerm)) ||
            (item.Event?.EventName && item.Event.EventName.toLowerCase().includes(searchTerm))
        );
    }
    
    // Filter theo event ID
    if (currentFilters.event) {
        filteredData = filteredData.filter(item => 
            item.EventID.toString() === currentFilters.event.toString()
        );
    }
    
    // Filter theo date range
    if (currentFilters.dateRange?.startDate && currentFilters.dateRange?.endDate) {
        const startDate = new Date(currentFilters.dateRange.startDate);
        const endDate = new Date(currentFilters.dateRange.endDate);
        // Đặt thời gian endDate về cuối ngày để bao gồm cả ngày cuối
        endDate.setHours(23, 59, 59, 999);
        
        filteredData = filteredData.filter(item => {
            const checkInDate = new Date(item.CheckInTime);
            return checkInDate >= startDate && checkInDate <= endDate;
        });
    }
    
    // Tính toán phân trang
    const totalItems = filteredData.length;
    const page = currentFilters.page || 1;
    const limit = currentFilters.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = Math.min(startIndex + limit, totalItems);
    
    // Trả về dữ liệu đã phân trang
    return { 
        data: filteredData.slice(startIndex, endIndex),
        total: totalItems 
    };
};

const fetchEventsForFilter = async () => {
    // TODO: API call to fetch list of events for filter dropdown
    console.log('Fetching events for filter...');
     // Trả về dữ liệu mẫu
    return [
        { EventID: 1, EventName: 'Hội thảo AI 2024' },
        { EventID: 2, EventName: 'Workshop Marketing Online' },
        { EventID: 3, EventName: 'Khóa học Lập trình Python' },
    ];
}

const deleteCheckin = async (id) => {
    // TODO: API call to delete checkin with the given ID
    console.log(`Deleting checkin with ID: ${id}`);
    // Giả lập thành công
    return true;
}

// Core Functions
const applyFiltersAndLoadData = async () => {
    console.log('===== BẮT ĐẦU LOAD DỮ LIỆU =====');
    console.log('Trang hiện tại:', currentPage);
    console.log('Items per page:', itemsPerPage);
    console.log('Các filter hiện tại:', filters);
    
    // TODO: Thêm loading indicator nếu cần
    try {
        // Lấy các filter hiện tại
        filters.search = filterSearchInput?.value || '';
        filters.event = filterEventSelect?.value || '';
        // Date range được cập nhật từ daterangepicker event

        // Tạo object chứa các tham số gửi đi (bao gồm cả phân trang)
        const apiParams = {
            ...filters,
            page: currentPage,
            limit: itemsPerPage,
            // Thêm các tham số sắp xếp nếu cần
        };

        console.log('Tham số gửi đi API:', apiParams);
        const response = await fetchCheckins(apiParams);
        console.log('Kết quả trả về:', response);
        
        allCheckins = response.data || []; // Lưu dữ liệu trả về
        const totalItems = response.total || 0;

        // Tính toán lại phân trang
        totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
        if (currentPage > totalPages) currentPage = totalPages; // Đảm bảo trang hiện tại hợp lệ

        console.log('Tổng số trang:', totalPages);
        console.log('Tổng số items:', totalItems);

        renderTable();
        updatePagination(totalItems); // Cập nhật tổng số item
        console.log('===== KẾT THÚC LOAD DỮ LIỆU =====');

    } catch (error) {
        console.error("Error loading checkins:", error);
        // TODO: Hiển thị lỗi cho người dùng
        checkinsTableBody.innerHTML = '<tr><td colspan="7" class="text-center py-4 text-red-500">Có lỗi xảy ra khi tải dữ liệu.</td></tr>'; // Cập nhật colspan
        noDataPlaceholder.classList.add('hidden');
        updatePagination(0); // Reset pagination
    } finally {
        // TODO: Ẩn loading indicator
    }
};

// Đổi tên hàm applyFilters thành loadData để rõ nghĩa hơn
const loadData = () => {
    // Reset to page 1 when applying filters manually
    currentPage = 1;
    console.log('loadData được gọi - Filter hiện tại:', {
        search: filterSearchInput?.value || '',
        event: filterEventSelect?.value || '',
        dateRange: filters.dateRange
    });
    applyFiltersAndLoadData();
}

const renderTable = () => {
    if (!checkinsTableBody) return;
    checkinsTableBody.innerHTML = ''; // Clear existing rows
    noDataPlaceholder.classList.add('hidden');

    // Lấy dữ liệu cho trang hiện tại (thay vì slice từ currentCheckins, vì API đã trả về đúng trang)
    const pageItems = allCheckins; // API đã trả về dữ liệu cho trang hiện tại

    if (pageItems.length === 0) {
        noDataPlaceholder.classList.remove('hidden');
        return;
    }

    pageItems.forEach(checkin => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="px-4 py-4 whitespace-nowrap">
                <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10">
                         <img class="h-10 w-10 rounded-full object-cover border" src="${checkin.User?.Avatar || 'https://ui-avatars.com/api/?name=?&background=gray&color=fff'}" alt="${checkin.User?.FullName || ''}">
                    </div>
                    <div class="ml-4">
                        <div class="text-sm font-medium text-gray-900">${checkin.User?.FullName || 'N/A'}</div>
                        <div class="text-sm text-gray-500">${checkin.User?.Email || 'N/A'}</div>
                    </div>
                </div>
            </td>
            <td class="px-4 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">${checkin.Event?.EventName || 'N/A'}</div>
                <div class="text-sm text-gray-500">ID: ${checkin.EventID || 'N/A'}</div>
            </td>
            <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500">${formatDateTime(checkin.CheckInTime)}</td>
            <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900">${checkin.Device?.DeviceName || checkin.DeviceID || 'N/A'}</td>
            <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900">${checkin.Location?.LocationName || checkin.LocationID || 'N/A'}</td>
            <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                 ${checkin.HinhAnhCheckIn ? `
                    <a href="${checkin.HinhAnhCheckIn}" target="_blank" title="Xem ảnh gốc">
                        <img src="${checkin.HinhAnhCheckIn}" alt="Ảnh Check-in" class="h-10 w-auto rounded object-cover hover:opacity-80 transition-opacity">
                    </a>
                 ` : '-'}
            </td>
            <td class="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex justify-end space-x-2">
                    <a href="checkin-detail.html?id=${checkin.ID}" class="text-blue-600 hover:text-blue-900" title="Xem chi tiết">
                        <i class="ri-eye-line"></i>
                    </a>
                     <a href="checkin-edit.html?id=${checkin.ID}" class="text-indigo-600 hover:text-indigo-900" title="Sửa">
                        <i class="ri-pencil-line"></i>
                    </a>
                    <button class="text-red-600 hover:text-red-900 action-btn" title="Xóa" data-id="${checkin.ID}" data-action="delete">
                        <i class="ri-delete-bin-line"></i>
                    </button>
                </div>
            </td>
        `;
        checkinsTableBody.appendChild(row);
    });

    // Add event listeners for action buttons (only delete now)
    document.querySelectorAll('.action-btn[data-action="delete"]').forEach(button => {
        button.removeEventListener('click', handleActionClick); // Tránh gắn nhiều lần
        button.addEventListener('click', handleActionClick);
    });
};

const updatePagination = (totalItems) => { // Thêm tham số totalItems
    if (!paginationControls) return;
    // totalPages đã được tính trong applyFiltersAndLoadData
    if (totalPagesCount) totalPagesCount.textContent = totalPages;
    if (totalItemsCount) totalItemsCount.textContent = totalItems; // Cập nhật tổng số item
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
        applyFiltersAndLoadData(); // Gọi lại API để lấy dữ liệu trang mới
    }
};

// Populate Select Options
const populateSelectOptions = async () => {
    try {
        const events = await fetchEventsForFilter();
        if (filterEventSelect) {
            const currentEventFilterValue = filterEventSelect.value;
            filterEventSelect.innerHTML = '<option value="">Tất cả sự kiện</option>';
            events.forEach(event => {
                if (event && event.EventID && event.EventName) { // Kiểm tra dữ liệu hợp lệ
                    filterEventSelect.innerHTML += `<option value="${event.EventID}">${event.EventName}</option>`;
                }
            });
            // Khôi phục giá trị đã chọn nếu có (quan trọng khi làm mới)
            filterEventSelect.value = currentEventFilterValue;
        }
    } catch (error) {
        console.error("Error populating event filter:", error);
        // Có thể hiển thị thông báo lỗi
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
        if (confirm(`Bạn có chắc chắn muốn xóa lượt check-in ID: ${id}?`)) {
            try {
                // TODO: Hiển thị loading indicator trên nút hoặc cả dòng
                button.disabled = true;
                const success = await deleteCheckin(id);
                if (success) {
                    // Xóa thành công, tải lại dữ liệu trang hiện tại
                    applyFiltersAndLoadData();
                    alert('Đã xóa lượt check-in.');
                } else {
                    alert('Xóa không thành công. Vui lòng thử lại.');
                    button.disabled = false;
                }
            } catch (error) {
                 console.error("Error deleting checkin:", error);
                 alert('Có lỗi xảy ra khi xóa. Vui lòng thử lại.');
                 button.disabled = false;
            }
        }
    }
    // Không xử lý view và edit ở đây nữa
};

// Daterangepicker Initialization
const setupDateRangePicker = () => {
    if (!filterDateInput) return;
    $(filterDateInput).daterangepicker({
        autoUpdateInput: false, // Don't automatically update the input field
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

    // Handle date range selection
    $(filterDateInput).on('apply.daterangepicker', function(ev, picker) {
        filters.dateRange.startDate = picker.startDate.toDate();
        filters.dateRange.endDate = picker.endDate.toDate();
        $(this).val(picker.startDate.format('DD/MM/YYYY') + ' - ' + picker.endDate.format('DD/MM/YYYY'));
        // Automatically apply filters when date range is applied
        loadData(); // Gọi hàm loadData mới
    });

    // Handle cancellation (clear date range)
    $(filterDateInput).on('cancel.daterangepicker', function(ev, picker) {
        filters.dateRange.startDate = null;
        filters.dateRange.endDate = null;
        $(this).val('');
         // Automatically apply filters when date range is cleared
        loadData(); // Gọi hàm loadData mới
    });
};

// Initialize Page
const initializeCheckinsPage = async () => { // Chuyển thành async
    // Setup Sidebar & User Menu
    setupSidebar();
    setupUserMenu();

    // allCheckins = generateSampleCheckins(); // --- XÓA ---
    // currentCheckins = [...allCheckins]; // --- XÓA ---

    setupDateRangePicker(); // Initialize daterangepicker trước khi load data lần đầu

    // Populate filter options first
    await populateSelectOptions(); // Đợi populate xong

    // Initial load
    applyFiltersAndLoadData(); // Load dữ liệu lần đầu

    // Filter Event Listeners
    if (filterForm) {
        console.log('Đã tìm thấy filterForm, đang đăng ký sự kiện submit');
        filterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Form submit được gọi');
            loadData(); // Gọi hàm loadData mới
        });
    } else {
        console.error('Không tìm thấy filterForm');
    }

    if (resetFilterBtn) {
        resetFilterBtn.addEventListener('click', () => {
            if (filterForm) filterForm.reset();
            // Reset date range picker
            if(filterDateInput) $(filterDateInput).val('');
            filters = { search: '', event: '', dateRange: { startDate: null, endDate: null } };
            console.log('Đã reset filter form');
            loadData(); // Gọi hàm loadData mới
        });
    }

    // Add event listener for the refresh button
    if (refreshBtn) {
        refreshBtn.addEventListener('click', async () => {
            console.log('Refreshing data...');
            await populateSelectOptions(); // Cập nhật lại danh sách event phòng trường hợp có thay đổi
            applyFiltersAndLoadData(); // Chỉ cần load lại data với filter hiện tại
            alert('Dữ liệu Check-in đã được làm mới.');
        });
    } else {
        console.error('Không tìm thấy refreshBtn');
    }

    // Pagination Event Listeners
    if (itemsPerPageSelect) {
        itemsPerPageSelect.addEventListener('change', (e) => {
            itemsPerPage = parseInt(e.target.value);
            goToPage(1); // Chuyển về trang 1 khi thay đổi số mục/trang
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

// Add setupSidebar and setupUserMenu functions (Copy from previous JS files)
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

    if (userMenuButton && userMenu) {
        userMenuButton.addEventListener('click', (event) => {
            event.stopPropagation();
            // Improved toggle logic to avoid potential conflicts
            const isVisible = !userMenu.classList.contains('invisible');
            if (isVisible) {
                 userMenu.classList.add('opacity-0', 'invisible');
                 userMenu.classList.remove('group-hover:opacity-100', 'group-hover:visible', 'scale-100');
                 userMenu.classList.add('scale-95'); // Reset transform origin effect
            } else {
                 userMenu.classList.remove('opacity-0', 'invisible', 'scale-95');
                 userMenu.classList.add('group-hover:opacity-100', 'group-hover:visible', 'scale-100');
            }
        });

        // Click outside to close
        document.addEventListener('click', (e) => {
             if (!userMenu.classList.contains('invisible') && !userMenuButton.contains(e.target) && !userMenu.contains(e.target)) {
                 userMenu.classList.add('opacity-0', 'invisible', 'scale-95');
                 userMenu.classList.remove('group-hover:opacity-100', 'group-hover:visible', 'scale-100');
            }
        });
    }
};

// Initialize the page
document.addEventListener('DOMContentLoaded', initializeCheckinsPage);
