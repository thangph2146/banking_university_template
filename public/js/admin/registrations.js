// Initialize AOS
AOS.init();

// State variables
let allRegistrations = []; // Store all registrations (from API or sample)
let currentRegistrations = []; // Store registrations for the current page
let currentPage = 1;
let itemsPerPage = 10;
let totalPages = 1;
let filters = {
    search: '',
    event: '',
    status: '',
    date: ''
};

// Sample Data (Based on dang_ky_su_kien structure)
const generateSampleRegistrations = () => {
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
        { AccountId: 'U010', FullName: 'Dương Thị Nga', Email: 'nga.dt@example.com', Avatar: 'https://ui-avatars.com/api/?name=Nga+DT&background=random' },
        { AccountId: 'U011', FullName: 'Trịnh Văn Phúc', Email: 'phuc.tv@example.com', Avatar: 'https://ui-avatars.com/api/?name=Phuc+TV&background=random' },
        { AccountId: 'U012', FullName: 'Mai Thị Quyên', Email: 'quyen.mt@example.com', Avatar: 'https://ui-avatars.com/api/?name=Quyen+MT&background=random' },
        { AccountId: 'U013', FullName: 'Lý Văn Sang', Email: 'sang.lv@example.com', Avatar: 'https://ui-avatars.com/api/?name=Sang+LV&background=random' },
        { AccountId: 'U014', FullName: 'Hồ Thị Thảo', Email: 'thao.ht@example.com', Avatar: 'https://ui-avatars.com/api/?name=Thao+HT&background=random' },
        { AccountId: 'U015', FullName: 'Phan Văn Toàn', Email: 'toan.pv@example.com', Avatar: 'https://ui-avatars.com/api/?name=Toan+PV&background=random' },
        { AccountId: 'U016', FullName: 'Đặng Thị Uyên', Email: 'uyen.dt@example.com', Avatar: 'https://ui-avatars.com/api/?name=Uyen+DT&background=random' },
        { AccountId: 'U017', FullName: 'Vương Văn Việt', Email: 'viet.vv@example.com', Avatar: 'https://ui-avatars.com/api/?name=Viet+VV&background=random' },
        { AccountId: 'U018', FullName: 'Tạ Thị Xuân', Email: 'xuan.tt@example.com', Avatar: 'https://ui-avatars.com/api/?name=Xuan+TT&background=random' },
        { AccountId: 'U019', FullName: 'Châu Văn Yến', Email: 'yen.cv@example.com', Avatar: 'https://ui-avatars.com/api/?name=Yen+CV&background=random' },
        { AccountId: 'U020', FullName: 'Giang Văn Kiên', Email: 'kien.gv@example.com', Avatar: 'https://ui-avatars.com/api/?name=Kien+GV&background=random' },
    ];
    const sampleEvents = [
        { EventID: 1, EventName: 'Hội thảo AI 2024', StartTime: '2024-09-15T09:00:00Z' },
        { EventID: 2, EventName: 'Workshop Marketing Online', StartTime: '2024-10-20T14:00:00Z' },
        { EventID: 3, EventName: 'Khóa học Lập trình Python', StartTime: '2024-11-01T18:30:00Z' },
        { EventID: 4, EventName: 'Hội nghị Khởi nghiệp Quốc gia', StartTime: '2024-08-25T08:00:00Z' },
        { EventID: 5, EventName: 'Talkshow Kỹ năng mềm', StartTime: '2024-09-30T19:00:00Z' },
    ];
    const statuses = ['pending', 'approved', 'rejected', 'cancelled'];
    const registrations = [];

    for (let i = 1; i <= 25; i++) { // Generate 25 sample entries
        const user = sampleUsers[Math.floor(Math.random() * sampleUsers.length)];
        const event = sampleEvents[Math.floor(Math.random() * sampleEvents.length)];
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        const registrationTime = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000); // Random time within last 30 days
        const checkInTime = status === 'approved' && Math.random() > 0.3 ? new Date(new Date(event.StartTime).getTime() - Math.random() * 60 * 60 * 1000) : null; // Random check-in before event
        const checkOutTime = checkInTime && Math.random() > 0.5 ? new Date(new Date(event.StartTime).getTime() + (Math.random() * 4 + 1) * 60 * 60 * 1000) : null; // Random check-out after event

        registrations.push({
            ID: i,
            EventID: event.EventID,
            AccountID: user.AccountId,
            RegistrationTime: registrationTime.toISOString(),
            Status: status,
            Notes: Math.random() > 0.7 ? `Ghi chú mẫu ${i}` : '',
            CheckInTime: checkInTime?.toISOString(),
            CheckOutTime: checkOutTime?.toISOString(),
            // Include related data for easy access
            User: user,
            Event: event,
        });
    }
    return registrations;
};

// DOM Elements
const registrationsTableBody = document.getElementById('registrationsTableBody');
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
const filterStatusSelect = document.getElementById('filter-status');
const filterDateInput = document.getElementById('filter-date');
const resetFilterBtn = document.getElementById('reset-filter-btn');
const refreshBtn = document.getElementById('refresh-btn');

// Modal Elements
const registrationModal = document.getElementById('registration-modal');
const createRegistrationBtn = document.getElementById('create-registration-btn');
const closeRegistrationModalBtn = document.getElementById('close-registration-modal');
const cancelRegistrationBtn = document.getElementById('cancel-registration');
const registrationForm = document.getElementById('registration-form');
const modalTitle = document.getElementById('modal-title');
const registrationIdInput = document.getElementById('registration-id');
const modalEventSelect = document.getElementById('modal-event-id');
const modalUserSelect = document.getElementById('modal-user-id');
const modalStatusSelect = document.getElementById('modal-status');
const modalNotesTextarea = document.getElementById('modal-notes');

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

const getStatusClass = (status) => {
  switch (status) {
    case 'approved': return 'bg-green-100 text-green-800';
    case 'pending': return 'bg-yellow-100 text-yellow-800';
    case 'rejected': return 'bg-red-100 text-red-800';
    case 'cancelled': return 'bg-gray-100 text-gray-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getStatusText = (status) => {
  switch (status) {
    case 'approved': return 'Đã duyệt';
    case 'pending': return 'Chờ duyệt';
    case 'rejected': return 'Từ chối';
    case 'cancelled': return 'Đã hủy';
    default: return 'Không xác định';
  }
};

// Core Functions
const applyFilters = () => {
    const searchTerm = filters.search.toLowerCase();
    const selectedEvent = filters.event;
    const selectedStatus = filters.status;
    const selectedDate = filters.date; // YYYY-MM-DD format

    const filtered = allRegistrations.filter(reg => {
        const userName = reg.User?.FullName?.toLowerCase() || '';
        const userEmail = reg.User?.Email?.toLowerCase() || '';
        const eventName = reg.Event?.EventName?.toLowerCase() || '';
        const registrationDate = reg.RegistrationTime ? reg.RegistrationTime.split('T')[0] : ''; // Extract YYYY-MM-DD

        const matchesSearch = searchTerm === '' || userName.includes(searchTerm) || userEmail.includes(searchTerm) || eventName.includes(searchTerm);
        const matchesEvent = selectedEvent === '' || reg.EventID === parseInt(selectedEvent);
        const matchesStatus = selectedStatus === '' || reg.Status === selectedStatus;
        const matchesDate = selectedDate === '' || registrationDate === selectedDate;

        return matchesSearch && matchesEvent && matchesStatus && matchesDate;
    });

    currentRegistrations = filtered;
    totalPages = Math.ceil(currentRegistrations.length / itemsPerPage);
    currentPage = 1; // Reset to first page after filtering
    renderTable();
    updatePagination();
};

const renderTable = () => {
    registrationsTableBody.innerHTML = ''; // Clear existing rows
    noDataPlaceholder.classList.add('hidden');

    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageItems = currentRegistrations.slice(start, end);

    if (pageItems.length === 0 && registrationsTableBody) { // Check if tbody exists
        noDataPlaceholder.classList.remove('hidden');
        return;
    }

    if (!registrationsTableBody) return; // Exit if tbody doesn't exist

    pageItems.forEach(reg => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="px-4 py-4 whitespace-nowrap">
        <div class="flex items-center">
          <div class="flex-shrink-0 h-10 w-10">
                        <img class="h-10 w-10 rounded-full object-cover" src="${reg.User?.Avatar || '#'}" alt="${reg.User?.FullName || ''}">
          </div>
          <div class="ml-4">
                        <div class="text-sm font-medium text-gray-900">${reg.User?.FullName || 'N/A'}</div>
                        <div class="text-sm text-gray-500">${reg.User?.Email || 'N/A'}</div>
          </div>
        </div>
      </td>
            <td class="px-4 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">${reg.Event?.EventName || 'N/A'}</div>
                <div class="text-sm text-gray-500">${formatDate(reg.Event?.StartTime)}</div>
      </td>
            <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500">${formatDateTime(reg.RegistrationTime)}</td>
            <td class="px-4 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(reg.Status)}">
                    ${getStatusText(reg.Status)}
        </span>
      </td>
            <td class="px-4 py-4 whitespace-nowrap text-sm">
                <div class="text-green-600"> ${reg.CheckInTime ? `<i class="ri-login-box-line mr-1"></i> ${formatDateTime(reg.CheckInTime)}` : '-'}</div>
                <div class="text-blue-600"> ${reg.CheckOutTime ? `<i class="ri-logout-box-line mr-1"></i> ${formatDateTime(reg.CheckOutTime)}` : '-'}</div>
      </td>
            <td class="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex justify-end space-x-2">
                    <button class="text-green-600 hover:text-green-900 action-btn" title="Duyệt" data-id="${reg.ID}" data-action="approve" ${reg.Status !== 'pending' ? 'disabled class="opacity-50 cursor-not-allowed"' : ''}>
                        <i class="ri-check-line"></i>
                    </button>
                    <button class="text-red-600 hover:text-red-900 action-btn" title="Từ chối" data-id="${reg.ID}" data-action="reject" ${reg.Status !== 'pending' ? 'disabled class="opacity-50 cursor-not-allowed"' : ''}>
                        <i class="ri-close-line"></i>
          </button>
                    <button class="text-blue-600 hover:text-blue-900 action-btn" title="Xem/Sửa" data-id="${reg.ID}" data-action="edit">
            <i class="ri-edit-line"></i>
          </button>
                    <button class="text-gray-500 hover:text-gray-700 action-btn" title="Xóa" data-id="${reg.ID}" data-action="delete">
            <i class="ri-delete-bin-line"></i>
          </button>
        </div>
      </td>
        `;
        registrationsTableBody.appendChild(row);
    });

    // Add event listeners for action buttons after rendering
    document.querySelectorAll('.action-btn').forEach(button => {
        button.removeEventListener('click', handleActionClick); // Remove existing listener to prevent duplicates
        button.addEventListener('click', handleActionClick);
    });
};

const updatePagination = () => {
    if (!paginationControls) return; // Exit if pagination controls don't exist
    totalPages = Math.max(1, Math.ceil(currentRegistrations.length / itemsPerPage));
    if(totalPagesCount) totalPagesCount.textContent = totalPages;
    if(totalItemsCount) totalItemsCount.textContent = currentRegistrations.length;
    if(currentPageInput) {
      currentPageInput.value = currentPage;
      currentPageInput.max = totalPages;
    }

    // Enable/disable buttons
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

// Modal Functions
const openModal = (registration = null) => {
    if (!registrationModal) return;
    registrationForm.reset();
    populateSelectOptions(); // Repopulate in case options changed

    if (registration) {
        modalTitle.textContent = 'Sửa thông tin đăng ký';
        registrationIdInput.value = registration.ID;
        modalEventSelect.value = registration.EventID;
        modalUserSelect.value = registration.AccountID;
        modalStatusSelect.value = registration.Status;
        modalNotesTextarea.value = registration.Notes || '';
        // Optionally disable event/user selection when editing
        // modalEventSelect.disabled = true;
        // modalUserSelect.disabled = true;
    } else {
        modalTitle.textContent = 'Thêm đăng ký mới';
        registrationIdInput.value = '';
        // modalEventSelect.disabled = false;
        // modalUserSelect.disabled = false;
    }
    registrationModal.classList.remove('hidden');
    document.body.classList.add('overflow-hidden');
};

const closeModal = () => {
    if (!registrationModal) return;
    registrationModal.classList.add('hidden');
    document.body.classList.remove('overflow-hidden');
};

// Populate Select Options
const populateSelectOptions = () => {
    // Populate Event Filter & Modal Select
    const uniqueEvents = [...new Map(allRegistrations.map(item => [item.Event?.EventID, item.Event])).values()];
    if (filterEventSelect) {
        const currentEventFilterValue = filterEventSelect.value; // Preserve filter selection
        filterEventSelect.innerHTML = '<option value="">Tất cả sự kiện</option>';
        uniqueEvents.forEach(event => {
            if (event) { // Ensure event is not null/undefined
                filterEventSelect.innerHTML += `<option value="${event.EventID}">${event.EventName}</option>`;
            }
        });
        filterEventSelect.value = currentEventFilterValue; // Restore filter selection
    }
    if (modalEventSelect) {
        modalEventSelect.innerHTML = '<option value="">Chọn sự kiện</option>';
        uniqueEvents.forEach(event => {
            if (event) {
                modalEventSelect.innerHTML += `<option value="${event.EventID}">${event.EventName}</option>`;
            }
        });
    }

    // Populate User Modal Select
    const uniqueUsers = [...new Map(allRegistrations.map(item => [item.User?.AccountId, item.User])).values()];
    if (modalUserSelect) {
        modalUserSelect.innerHTML = '<option value="">Chọn người dùng</option>';
        uniqueUsers.forEach(user => {
            if (user) {
               modalUserSelect.innerHTML += `<option value="${user.AccountId}">${user.FullName} (${user.Email})</option>`;
            }
        });
    }
};

// Event Handlers
const handleActionClick = (event) => {
    const button = event.currentTarget;
    const id = parseInt(button.dataset.id);
    const action = button.dataset.action;
    const registration = allRegistrations.find(r => r.ID === id);

    if (!registration) return;

    switch (action) {
        case 'approve':
        case 'reject':
            if (confirm(`Bạn có chắc muốn ${action === 'approve' ? 'duyệt' : 'từ chối'} đăng ký này?`)) {
                registration.Status = action === 'approve' ? 'approved' : 'rejected';
                // TODO: API call to update status
                applyFilters(); // Re-render with updated status
            }
            break;
        case 'edit':
            openModal(registration);
            break;
        case 'delete':
            if (confirm('Bạn có chắc chắn muốn xóa đăng ký này?')) {
                allRegistrations = allRegistrations.filter(r => r.ID !== id);
                // TODO: API call to delete
                applyFilters(); // Re-render after deletion
            }
            break;
    }
};

// Initialize
const initializeRegistrationsPage = () => {
    // Setup Sidebar & User Menu
    setupSidebar();
    setupUserMenu();

    allRegistrations = generateSampleRegistrations(); // Use sample data for now
    currentRegistrations = [...allRegistrations]; // Initially show all
    populateSelectOptions();
    applyFilters(); // Initial render

    // Filter Event Listeners
    if (filterForm) {
        filterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            filters.search = filterSearchInput?.value || '';
            filters.event = filterEventSelect?.value || '';
            filters.status = filterStatusSelect?.value || '';
            filters.date = filterDateInput?.value || '';
            applyFilters();
        });
    }

    if (resetFilterBtn) {
        resetFilterBtn.addEventListener('click', () => {
            if(filterForm) filterForm.reset();
            filters = { search: '', event: '', status: '', date: '' };
            applyFilters();
        });
    }

    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
            // TODO: Fetch data from API again if implemented
            allRegistrations = generateSampleRegistrations(); // For now, just regenerate sample data
            filters = { search: '', event: '', status: '', date: '' }; // Reset filters on refresh
            if (filterForm) filterForm.reset();
            populateSelectOptions();
            applyFilters();
            alert('Dữ liệu đã được làm mới.');
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
        currentPageInput.addEventListener('change', (e) => {
            goToPage(parseInt(e.target.value));
        });
        currentPageInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                goToPage(parseInt(e.target.value));
            }
        });
    }

    if (paginationControls) {
        paginationControls.querySelector('.btn-first')?.addEventListener('click', () => goToPage(1));
        paginationControls.querySelector('.btn-prev')?.addEventListener('click', () => goToPage(currentPage - 1));
        paginationControls.querySelector('.btn-next')?.addEventListener('click', () => goToPage(currentPage + 1));
        paginationControls.querySelector('.btn-last')?.addEventListener('click', () => goToPage(totalPages));
    }

    // Modal Event Listeners
    if (createRegistrationBtn) {
        createRegistrationBtn.addEventListener('click', () => openModal());
    }
    if (closeRegistrationModalBtn) {
        closeRegistrationModalBtn.addEventListener('click', closeModal);
    }
    if (cancelRegistrationBtn) {
        cancelRegistrationBtn.addEventListener('click', closeModal);
    }
    if (registrationModal) {
        registrationModal.addEventListener('click', (e) => {
            if (e.target === registrationModal) closeModal();
        });
    }

    if (registrationForm) {
        registrationForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const id = parseInt(registrationIdInput.value);
            const formData = new FormData(registrationForm);
            const data = Object.fromEntries(formData.entries());

            // Find related data from existing allRegistrations (or fetch if needed)
            const eventData = [...new Map(allRegistrations.map(item => [item.Event?.EventID, item.Event])).values()].find(ev => ev?.EventID === parseInt(data.event_id));
            const userData = [...new Map(allRegistrations.map(item => [item.User?.AccountId, item.User])).values()].find(u => u?.AccountId === data.user_id);

            if (!eventData || !userData) {
                alert('Sự kiện hoặc người dùng không hợp lệ.');
                return;
            }

            const newRegData = {
                EventID: parseInt(data.event_id),
                AccountID: data.user_id,
                RegistrationTime: new Date().toISOString(), // Set registration time to now
                Status: data.status,
                Notes: data.notes || '',
                CheckInTime: null, // Default to null for new/edited
                CheckOutTime: null,
                User: userData, // Link the found user object
                Event: eventData // Link the found event object
            };

            if (id) { // Editing existing registration
                const index = allRegistrations.findIndex(r => r.ID === id);
                if (index !== -1) {
                     // Keep original checkin/out times unless status changes significantly?
                     newRegData.CheckInTime = allRegistrations[index].CheckInTime;
                     newRegData.CheckOutTime = allRegistrations[index].CheckOutTime;
                     newRegData.RegistrationTime = allRegistrations[index].RegistrationTime; // Keep original reg time
                     allRegistrations[index] = { ...allRegistrations[index], ...newRegData };
                    // TODO: API call to update
                    alert('Cập nhật đăng ký thành công!');
                }
            } else { // Adding new registration
                newRegData.ID = Math.max(0, ...allRegistrations.map(r => r.ID)) + 1; // Simple ID generation
                allRegistrations.unshift(newRegData); // Add to beginning
                 // TODO: API call to create
                alert('Thêm đăng ký thành công!');
            }
            closeModal();
            populateSelectOptions(); // Repopulate selects in case new users/events were involved
            applyFilters(); // Refresh the table
        });
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
        document.body.classList.add('overflow-hidden', 'md:overflow-auto'); // Prevent body scroll on mobile
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

    // Assume currentUser data is available globally or fetched
    const currentUser = {
        FullName: 'Admin User', // Replace with actual user data
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


// Initialize the page on DOMContentLoaded
document.addEventListener('DOMContentLoaded', initializeRegistrationsPage); 