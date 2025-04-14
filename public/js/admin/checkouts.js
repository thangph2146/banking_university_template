// Initialize AOS
AOS.init();

// State variables
let allCheckouts = []; // Store all checkouts (from API or sample)
let currentCheckouts = []; // Store checkouts for the current page
let currentPage = 1;
let itemsPerPage = 10;
let totalPages = 1;
let filters = {
    search: '',
    event: '',
    dateRange: { startDate: null, endDate: null } // For daterangepicker
};

// Sample Data (Based on checkin_sukien with CheckOutTime)
const generateSampleCheckouts = () => {
    // Reuse checkin data generation but filter for those with checkout times
    const sampleCheckins = generateSampleCheckinsBaseData(); // Use a base generator
    return sampleCheckins.filter(c => c.CheckOutTime);
};

// Base generator function (can be shared or duplicated)
const generateSampleCheckinsBaseData = () => {
    const sampleUsers = [
        { AccountId: 'U001', FullName: 'Nguyễn Văn An', Email: 'an.nv@example.com', Avatar: 'https://ui-avatars.com/api/?name=An+NV&background=random' },
        { AccountId: 'U002', FullName: 'Trần Thị Bình', Email: 'binh.tt@example.com', Avatar: 'https://ui-avatars.com/api/?name=Binh+TT&background=random' },
        { AccountId: 'U003', FullName: 'Lê Văn Cường', Email: 'cuong.lv@example.com', Avatar: 'https://ui-avatars.com/api/?name=Cuong+LV&background=random' },
        { AccountId: 'U004', FullName: 'Phạm Thị Dung', Email: 'dung.pt@example.com', Avatar: 'https://ui-avatars.com/api/?name=Dung+PT&background=random' },
        { AccountId: 'U005', FullName: 'Hoàng Văn Em', Email: 'em.hv@example.com', Avatar: 'https://ui-avatars.com/api/?name=Em+HV&background=random' },
        { AccountId: 'U006', FullName: 'Vũ Thị Giang', Email: 'giang.vt@example.com', Avatar: 'https://ui-avatars.com/api/?name=Giang+VT&background=random' },
        { AccountId: 'U007', FullName: 'Đỗ Văn Hùng', Email: 'hung.dv@example.com', Avatar: 'https://ui-avatars.com/api/?name=Hung+DV&background=random' },
         { AccountId: 'U008', FullName: 'Bùi Thị Lan', Email: 'lan.bt@example.com', Avatar: 'https://ui-avatars.com/api/?name=Lan+BT&background=random' },
        { AccountId: 'U009', FullName: 'Ngô Văn Minh', Email: 'minh.nv@example.com', Avatar: 'https://ui-avatars.com/api/?name=Minh+NV&background=random' },
    ];
    const sampleEvents = [
        { EventID: 1, EventName: 'Hội thảo AI 2024', StartTime: '2024-09-15T09:00:00Z' },
        { EventID: 2, EventName: 'Workshop Marketing Online', StartTime: '2024-10-20T14:00:00Z' },
        { EventID: 3, EventName: 'Khóa học Lập trình Python', StartTime: '2024-11-01T18:30:00Z' },
    ];
    const sampleDevices = [
        { DeviceID: 'DVC001', DeviceName: 'Thiết bị Check-in Cổng 1' },
        { DeviceID: 'DVC002', DeviceName: 'Thiết bị Check-in Cổng 2' },
        { DeviceID: 'SCAN01', DeviceName: 'Máy quét QR Hội trường A' },
    ];
    const sampleLocations = [
        { LocationID: 'LOC01', LocationName: 'Cổng chính' },
        { LocationID: 'LOC02', LocationName: 'Hội trường A' },
        { LocationID: 'LOC03', LocationName: 'Sảnh B' },
    ];
    const checkins = [];
    const now = Date.now();

    for (let i = 1; i <= 30; i++) { // Generate more base data
        const user = sampleUsers[Math.floor(Math.random() * sampleUsers.length)];
        const event = sampleEvents[Math.floor(Math.random() * sampleEvents.length)];
        const device = sampleDevices[Math.floor(Math.random() * sampleDevices.length)];
        const location = sampleLocations[Math.floor(Math.random() * sampleLocations.length)];
        const checkinTime = new Date(now - Math.random() * 60 * 24 * 60 * 60 * 1000);
        const hasCheckout = Math.random() > 0.4; // ~60% chance of having checkout
        const checkoutTime = hasCheckout ? new Date(checkinTime.getTime() + (Math.random() * 5 + 1) * 60 * 60 * 1000) : null; // Checkout 1-6 hours after checkin

        checkins.push({
            ID: i,
            EventID: event.EventID,
            AccountID: user.AccountId,
            DeviceID: device.DeviceID,
            LocationID: location.LocationID,
            CheckInTime: checkinTime.toISOString(),
            CheckOutTime: checkoutTime?.toISOString(), // May be null
            HinhAnhCheckIn: `https://picsum.photos/seed/in${i}/300/200`, // Sample image URL
            HinhAnhCheckOut: checkoutTime ? `https://picsum.photos/seed/out${i}/300/200` : null,
            User: user,
            Event: event,
            Device: device,
            Location: location,
        });
    }
    return checkins;
}

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
const filterDateInput = document.getElementById('filter-date'); // Daterangepicker input
const resetFilterBtn = document.getElementById('reset-filter-btn');
const refreshBtn = document.getElementById('refresh-btn');

// Helper Functions
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

// Core Functions
const applyFilters = () => {
    const searchTerm = filters.search.toLowerCase();
    const selectedEvent = filters.event;
    const { startDate, endDate } = filters.dateRange;

    // Start with all records that have a CheckOutTime
    const baseCheckouts = allCheckouts.filter(c => c.CheckOutTime);

    const filtered = baseCheckouts.filter(checkout => {
        const userName = checkout.User?.FullName?.toLowerCase() || '';
        const userEmail = checkout.User?.Email?.toLowerCase() || '';
        const eventName = checkout.Event?.EventName?.toLowerCase() || '';
        const checkoutTime = checkout.CheckOutTime ? new Date(checkout.CheckOutTime) : null;

        const matchesSearch = searchTerm === '' || userName.includes(searchTerm) || userEmail.includes(searchTerm) || eventName.includes(searchTerm);
        const matchesEvent = selectedEvent === '' || checkout.EventID === parseInt(selectedEvent);

        let matchesDate = true;
        if (startDate && endDate && checkoutTime) {
            const checkoutDateOnly = new Date(checkoutTime.getFullYear(), checkoutTime.getMonth(), checkoutTime.getDate());
            const filterStartDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
            const filterEndDate = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
            matchesDate = checkoutDateOnly >= filterStartDate && checkoutDateOnly <= filterEndDate;
        }

        return matchesSearch && matchesEvent && matchesDate;
    });

    currentCheckouts = filtered;
    totalPages = Math.ceil(currentCheckouts.length / itemsPerPage);
    currentPage = 1; // Reset to first page after filtering
    renderTable();
    updatePagination();
};

const renderTable = () => {
    if (!checkoutsTableBody) return;
    checkoutsTableBody.innerHTML = ''; // Clear existing rows
    noDataPlaceholder.classList.add('hidden');

    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageItems = currentCheckouts.slice(start, end);

    if (pageItems.length === 0) {
        noDataPlaceholder.classList.remove('hidden');
        return;
    }

    pageItems.forEach(checkout => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="px-4 py-4 whitespace-nowrap">
                <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10">
                        <img class="h-10 w-10 rounded-full object-cover" src="${checkout.User?.Avatar || '#'}" alt="${checkout.User?.FullName || ''}">
                    </div>
                    <div class="ml-4">
                        <div class="text-sm font-medium text-gray-900">${checkout.User?.FullName || 'N/A'}</div>
                        <div class="text-sm text-gray-500">${checkout.User?.Email || 'N/A'}</div>
                    </div>
                </div>
            </td>
            <td class="px-4 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">${checkout.Event?.EventName || 'N/A'}</div>
                <div class="text-sm text-gray-500">Bắt đầu: ${formatDate(checkout.Event?.StartTime)}</div>
            </td>
            <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500">${formatDateTime(checkout.CheckOutTime)}</td>
            <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900">${checkout.Device?.DeviceName || 'N/A'}</td>
            <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900">${checkout.Location?.LocationName || 'N/A'}</td>
            <td class="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex justify-end space-x-2">
                    <button class="text-blue-600 hover:text-blue-900 action-btn" title="Xem chi tiết" data-id="${checkout.ID}" data-action="view">
                        <i class="ri-eye-line"></i>
                    </button>
                    <button class="text-gray-500 hover:text-gray-700 action-btn" title="Xóa" data-id="${checkout.ID}" data-action="delete">
                        <i class="ri-delete-bin-line"></i>
                    </button>
                </div>
            </td>
        `;
        checkoutsTableBody.appendChild(row);
    });

    // Add event listeners for action buttons
    document.querySelectorAll('.action-btn').forEach(button => {
        button.removeEventListener('click', handleActionClick);
        button.addEventListener('click', handleActionClick);
    });
};

const updatePagination = () => {
    if (!paginationControls) return;
    totalPages = Math.max(1, Math.ceil(currentCheckouts.length / itemsPerPage));
    if (totalPagesCount) totalPagesCount.textContent = totalPages;
    if (totalItemsCount) totalItemsCount.textContent = currentCheckouts.length;
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
    currentPage = Math.max(1, Math.min(page, totalPages));
    renderTable();
    updatePagination();
};

// Populate Select Options
const populateSelectOptions = () => {
    // Use allCheckouts (base data) to get all possible events for the filter
    const uniqueEvents = [...new Map(allCheckouts.map(item => [item.Event?.EventID, item.Event])).values()];
    if (filterEventSelect) {
        const currentEventFilterValue = filterEventSelect.value;
        filterEventSelect.innerHTML = '<option value="">Tất cả sự kiện</option>';
        uniqueEvents.forEach(event => {
            if (event) {
                filterEventSelect.innerHTML += `<option value="${event.EventID}">${event.EventName}</option>`;
            }
        });
        filterEventSelect.value = currentEventFilterValue;
    }
};

// Event Handlers
const handleActionClick = (event) => {
    const button = event.currentTarget;
    const id = parseInt(button.dataset.id);
    const action = button.dataset.action;
    // Find in the base data (allCheckouts) as currentCheckouts is filtered
    const checkout = allCheckouts.find(c => c.ID === id);

    if (!checkout) return;

    switch (action) {
        case 'view':
            alert(`Xem chi tiết Check-out ID: ${id}\nUser: ${checkout.User?.FullName}\nEvent: ${checkout.Event?.EventName}\nTime: ${formatDateTime(checkout.CheckOutTime)}`);
            break;
        case 'delete':
            if (confirm('Bạn có chắc chắn muốn xóa lượt check-out này? (Thao tác này chỉ xóa bản ghi check-out, không xóa check-in)')) {
                // Find the original check-in record and set CheckOutTime to null
                const originalCheckinIndex = allCheckouts.findIndex(c => c.ID === id);
                if (originalCheckinIndex !== -1) {
                    allCheckouts[originalCheckinIndex].CheckOutTime = null;
                     // TODO: API call to update CheckOutTime to null for this checkin record
                }
                applyFilters(); // Re-filter and re-render
                alert('Đã xóa lượt check-out.');
            }
            break;
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
        applyFilters();
    });

    $(filterDateInput).on('cancel.daterangepicker', function(ev, picker) {
        filters.dateRange.startDate = null;
        filters.dateRange.endDate = null;
        $(this).val('');
        applyFilters();
    });
};

// Initialize Page
const initializeCheckoutsPage = () => {
    setupSidebar();
    setupUserMenu();

    allCheckouts = generateSampleCheckinsBaseData(); // Get base data including checkouts
    currentCheckouts = allCheckouts.filter(c => c.CheckOutTime); // Initially filter for checkouts

    populateSelectOptions();
    setupDateRangePicker();
    applyFilters(); // Initial render based on checkouts only

    // Filter Event Listeners
    if (filterForm) {
        filterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            filters.search = filterSearchInput?.value || '';
            filters.event = filterEventSelect?.value || '';
            applyFilters();
        });
    }

    if (resetFilterBtn) {
        resetFilterBtn.addEventListener('click', () => {
            if (filterForm) filterForm.reset();
            if(filterDateInput) $(filterDateInput).val('');
            filters = { search: '', event: '', dateRange: { startDate: null, endDate: null } };
            applyFilters();
        });
    }

    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
            allCheckouts = generateSampleCheckinsBaseData();
            if (filterForm) filterForm.reset();
            if(filterDateInput) $(filterDateInput).val('');
            filters = { search: '', event: '', dateRange: { startDate: null, endDate: null } };
            populateSelectOptions();
            applyFilters();
            alert('Dữ liệu Check-out đã được làm mới.');
        });
    }

    // Pagination Event Listeners
    if (itemsPerPageSelect) {
        itemsPerPageSelect.addEventListener('change', (e) => {
            itemsPerPage = parseInt(e.target.value);
            goToPage(1);
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

// Add setupSidebar and setupUserMenu functions
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

    const currentUser = { // Replace with actual data
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
            userMenu.classList.toggle('opacity-0');
            userMenu.classList.toggle('invisible');
            userMenu.classList.toggle('group-hover:opacity-100');
            userMenu.classList.toggle('group-hover:visible');
        });

        document.addEventListener('click', (e) => {
             if (!userMenu.classList.contains('invisible') && !userMenuButton.contains(e.target) && !userMenu.contains(e.target)) {
                userMenu.classList.add('opacity-0', 'invisible');
                userMenu.classList.remove('group-hover:opacity-100', 'group-hover:visible');
            }
        });
    }
};

// Initialize the page
document.addEventListener('DOMContentLoaded', initializeCheckoutsPage);
