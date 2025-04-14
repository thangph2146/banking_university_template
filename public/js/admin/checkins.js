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
const generateSampleCheckins = () => {
    const sampleUsers = [
        { AccountId: 'U001', FullName: 'Nguyễn Văn An', Email: 'an.nv@example.com', Avatar: 'https://ui-avatars.com/api/?name=An+NV&background=random' },
        { AccountId: 'U002', FullName: 'Trần Thị Bình', Email: 'binh.tt@example.com', Avatar: 'https://ui-avatars.com/api/?name=Binh+TT&background=random' },
        { AccountId: 'U003', FullName: 'Lê Văn Cường', Email: 'cuong.lv@example.com', Avatar: 'https://ui-avatars.com/api/?name=Cuong+LV&background=random' },
        { AccountId: 'U004', FullName: 'Phạm Thị Dung', Email: 'dung.pt@example.com', Avatar: 'https://ui-avatars.com/api/?name=Dung+PT&background=random' },
        { AccountId: 'U005', FullName: 'Hoàng Văn Em', Email: 'em.hv@example.com', Avatar: 'https://ui-avatars.com/api/?name=Em+HV&background=random' },
         { AccountId: 'U006', FullName: 'Vũ Thị Giang', Email: 'giang.vt@example.com', Avatar: 'https://ui-avatars.com/api/?name=Giang+VT&background=random' },
        { AccountId: 'U007', FullName: 'Đỗ Văn Hùng', Email: 'hung.dv@example.com', Avatar: 'https://ui-avatars.com/api/?name=Hung+DV&background=random' },
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

    for (let i = 1; i <= 20; i++) { // Generate 20 sample entries
        const user = sampleUsers[Math.floor(Math.random() * sampleUsers.length)];
        const event = sampleEvents[Math.floor(Math.random() * sampleEvents.length)];
        const device = sampleDevices[Math.floor(Math.random() * sampleDevices.length)];
        const location = sampleLocations[Math.floor(Math.random() * sampleLocations.length)];
        const checkinTime = new Date(now - Math.random() * 60 * 24 * 60 * 60 * 1000); // Random time within last 60 days

        checkins.push({
            ID: i,
            EventID: event.EventID,
            AccountID: user.AccountId,
            DeviceID: device.DeviceID,
            LocationID: location.LocationID,
            CheckInTime: checkinTime.toISOString(),
            HinhAnhCheckIn: `https://picsum.photos/seed/${i}/300/200`, // Sample image URL
            // Include related data
            User: user,
            Event: event,
            Device: device,
            Location: location,
        });
    }
    return checkins;
};

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
const refreshBtn = document.getElementById('refresh-btn');

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

// Core Functions
const applyFilters = () => {
    const searchTerm = filters.search.toLowerCase();
    const selectedEvent = filters.event;
    const { startDate, endDate } = filters.dateRange;

    const filtered = allCheckins.filter(checkin => {
        const userName = checkin.User?.FullName?.toLowerCase() || '';
        const userEmail = checkin.User?.Email?.toLowerCase() || '';
        const eventName = checkin.Event?.EventName?.toLowerCase() || '';
        const checkinTime = checkin.CheckInTime ? new Date(checkin.CheckInTime) : null;

        const matchesSearch = searchTerm === '' || userName.includes(searchTerm) || userEmail.includes(searchTerm) || eventName.includes(searchTerm);
        const matchesEvent = selectedEvent === '' || checkin.EventID === parseInt(selectedEvent);

        let matchesDate = true;
        if (startDate && endDate && checkinTime) {
            // Ensure comparison is done correctly (inclusive range)
            const checkinDateOnly = new Date(checkinTime.getFullYear(), checkinTime.getMonth(), checkinTime.getDate());
            const filterStartDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
            const filterEndDate = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
            matchesDate = checkinDateOnly >= filterStartDate && checkinDateOnly <= filterEndDate;
        }

        return matchesSearch && matchesEvent && matchesDate;
    });

    currentCheckins = filtered;
    totalPages = Math.ceil(currentCheckins.length / itemsPerPage);
    currentPage = 1; // Reset to first page after filtering
    renderTable();
    updatePagination();
};

const renderTable = () => {
    if (!checkinsTableBody) return;
    checkinsTableBody.innerHTML = ''; // Clear existing rows
    noDataPlaceholder.classList.add('hidden');

    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageItems = currentCheckins.slice(start, end);

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
                        <img class="h-10 w-10 rounded-full object-cover" src="${checkin.User?.Avatar || '#'}" alt="${checkin.User?.FullName || ''}">
                    </div>
                    <div class="ml-4">
                        <div class="text-sm font-medium text-gray-900">${checkin.User?.FullName || 'N/A'}</div>
                        <div class="text-sm text-gray-500">${checkin.User?.Email || 'N/A'}</div>
                    </div>
                </div>
            </td>
            <td class="px-4 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">${checkin.Event?.EventName || 'N/A'}</div>
                <div class="text-sm text-gray-500">Bắt đầu: ${formatDate(checkin.Event?.StartTime)}</div>
            </td>
            <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500">${formatDateTime(checkin.CheckInTime)}</td>
            <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900">${checkin.Device?.DeviceName || 'N/A'}</td>
            <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900">${checkin.Location?.LocationName || 'N/A'}</td>
            <td class="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex justify-end space-x-2">
                    <button class="text-blue-600 hover:text-blue-900 action-btn" title="Xem chi tiết" data-id="${checkin.ID}" data-action="view">
                        <i class="ri-eye-line"></i>
                    </button>
                    <button class="text-gray-500 hover:text-gray-700 action-btn" title="Xóa" data-id="${checkin.ID}" data-action="delete">
                        <i class="ri-delete-bin-line"></i>
                    </button>
                </div>
            </td>
        `;
        checkinsTableBody.appendChild(row);
    });

    // Add event listeners for action buttons
    document.querySelectorAll('.action-btn').forEach(button => {
        button.removeEventListener('click', handleActionClick);
        button.addEventListener('click', handleActionClick);
    });
};

const updatePagination = () => {
    if (!paginationControls) return;
    totalPages = Math.max(1, Math.ceil(currentCheckins.length / itemsPerPage));
    if (totalPagesCount) totalPagesCount.textContent = totalPages;
    if (totalItemsCount) totalItemsCount.textContent = currentCheckins.length;
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
    const uniqueEvents = [...new Map(allCheckins.map(item => [item.Event?.EventID, item.Event])).values()];
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
    const checkin = allCheckins.find(c => c.ID === id);

    if (!checkin) return;

    switch (action) {
        case 'view':
            // Implement view details logic, maybe show a modal or navigate
            alert(`Xem chi tiết Check-in ID: ${id}\nUser: ${checkin.User?.FullName}\nEvent: ${checkin.Event?.EventName}\nTime: ${formatDateTime(checkin.CheckInTime)}`);
            break;
        case 'delete':
            if (confirm('Bạn có chắc chắn muốn xóa lượt check-in này?')) {
                allCheckins = allCheckins.filter(c => c.ID !== id);
                // TODO: API call to delete
                applyFilters(); // Re-render after deletion
                alert('Đã xóa lượt check-in.');
            }
            break;
    }
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
        applyFilters();
    });

    // Handle cancellation (clear date range)
    $(filterDateInput).on('cancel.daterangepicker', function(ev, picker) {
        filters.dateRange.startDate = null;
        filters.dateRange.endDate = null;
        $(this).val('');
         // Automatically apply filters when date range is cleared
        applyFilters();
    });
};

// Initialize Page
const initializeCheckinsPage = () => {
    // Setup Sidebar & User Menu
    setupSidebar();
    setupUserMenu();

    allCheckins = generateSampleCheckins(); // Load sample data
    currentCheckins = [...allCheckins];
    populateSelectOptions();
    setupDateRangePicker(); // Initialize daterangepicker
    applyFilters(); // Initial render

    // Filter Event Listeners
    if (filterForm) {
        filterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            filters.search = filterSearchInput?.value || '';
            filters.event = filterEventSelect?.value || '';
            // Date range is updated by the daterangepicker's apply event
            applyFilters();
        });
    }

    if (resetFilterBtn) {
        resetFilterBtn.addEventListener('click', () => {
            if (filterForm) filterForm.reset();
            // Reset date range picker
            if(filterDateInput) $(filterDateInput).val('');
            filters = { search: '', event: '', dateRange: { startDate: null, endDate: null } };
            applyFilters();
        });
    }

    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
            allCheckins = generateSampleCheckins();
            if (filterForm) filterForm.reset();
            if(filterDateInput) $(filterDateInput).val('');
            filters = { search: '', event: '', dateRange: { startDate: null, endDate: null } };
            populateSelectOptions();
            applyFilters();
            alert('Dữ liệu Check-in đã được làm mới.');
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
document.addEventListener('DOMContentLoaded', initializeCheckinsPage);
