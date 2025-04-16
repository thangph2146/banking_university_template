document.addEventListener('DOMContentLoaded', () => {
  AOS.init();

  // --- State Variables ---
  let allAccounts = []; // Lưu trữ tất cả dữ liệu tài khoản
  let currentAccounts = []; // Lưu trữ dữ liệu tài khoản đã được lọc và phân trang
  let currentPage = 1;
  let itemsPerPage = 10;
  let totalPages = 1;

  // --- DOM Elements ---
  const sidebar = document.getElementById('sidebar');
  const sidebarBackdrop = document.getElementById('sidebar-backdrop');
  const sidebarOpenBtn = document.getElementById('sidebar-open');
  const sidebarCloseBtn = document.getElementById('sidebar-close');
  const userMenuButton = document.getElementById('user-menu-button');
  const userMenu = document.getElementById('user-menu');

  const filterForm = document.getElementById('filter-form');
  const filterSearchInput = document.getElementById('filter-search');
  const filterTypeSelect = document.getElementById('filter-type');
  const filterStatusSelect = document.getElementById('filter-status');
  const resetFilterBtn = document.getElementById('reset-filter-btn');

  const accountsTableBody = document.getElementById('accountsTableBody');
  const noDataPlaceholder = document.getElementById('no-data-placeholder');
  const paginationControls = document.getElementById('pagination-controls');
  const totalItemsCountEl = document.getElementById('total-items-count');
  const totalPagesCountEl = document.getElementById('total-pages-count');
  const currentPageInput = document.getElementById('current-page-input');
  const itemsPerPageSelect = document.getElementById('items-per-page');
  const btnFirst = paginationControls.querySelector('.btn-first');
  const btnPrev = paginationControls.querySelector('.btn-prev');
  const btnNext = paginationControls.querySelector('.btn-next');
  const btnLast = paginationControls.querySelector('.btn-last');

  // Dữ liệu tài khoản mẫu (dựa trên cấu trúc bảng users)
  const generateSampleAccounts = (count) => {
    const accounts = [];
    
    const firstNames = ['An', 'Bình', 'Cường', 'Dũng', 'Hà', 'Hùng', 'Lan', 'Mai', 'Nam', 'Phương'];
    const middleNames = ['Văn', 'Thị', 'Đức', 'Minh', 'Hoàng', 'Thành', 'Quốc', 'Như', 'Thanh', 'Tuấn'];
    const lastNames = ['Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Huỳnh', 'Phan', 'Vũ', 'Võ', 'Đặng'];
    
    const domains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hubadmin.edu.vn', 'hubtech.vn', 'example.com'];
    
    const generateUsername = (firstName, lastName, index) => {
      const normalizedFirstName = firstName.toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
      const normalizedLastName = lastName.toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .charAt(0);
      return `${normalizedFirstName}.${normalizedLastName}${index}`;
    };

    for (let i = 1; i <= count; i++) {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const middleName = middleNames[Math.floor(Math.random() * middleNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      
      const username = generateUsername(firstName, lastName, i);
      const domain = domains[Math.floor(Math.random() * domains.length)];
      const email = `${username}@${domain}`;
      
      const userType = Math.random() > 0.7 ? 'admin' : (Math.random() > 0.5 ? 'manager' : 'user');
      const status = Math.random() > 0.2 ? 1 : 0; // 80% chance to be active
      
      // Generate a random date within the past 2 years
      const now = new Date();
      const twoYearsAgo = new Date();
      twoYearsAgo.setFullYear(now.getFullYear() - 2);
      const randomTimestamp = twoYearsAgo.getTime() + Math.random() * (now.getTime() - twoYearsAgo.getTime());
      const createdDate = new Date(randomTimestamp);
      
      const updatedDate = Math.random() > 0.6 ? new Date(createdDate.getTime() + Math.random() * (now.getTime() - createdDate.getTime())) : null;
      
      accounts.push({
        u_id: i,
        u_LastName: lastName,
        u_MiddleName: middleName,
        u_FirstName: firstName,
        u_type: userType,
        u_username: username,
        u_email: email,
        u_password_hash: 'password_hash',
        u_status: status,
        u_created_at: createdDate,
        u_updated_at: updatedDate,
        u_deleted_at: null
      });
    }
    
    return accounts;
  };

  // --- Khởi tạo dữ liệu và giao diện ---
  const init = () => {
    // Tạo dữ liệu tài khoản mẫu
    allAccounts = generateSampleAccounts(20);
    
    // Hiển thị dữ liệu
    itemsPerPage = parseInt(itemsPerPageSelect.value);
    applyFiltersAndPagination();
  };

  // --- UI Interaction Functions ---
  const toggleSidebar = () => {
    sidebar.classList.toggle('-translate-x-full');
    sidebarBackdrop.classList.toggle('hidden');
  };

  const toggleUserMenu = () => {
    userMenu.classList.toggle('opacity-0');
    userMenu.classList.toggle('invisible');
  };

  // --- Data Handling Functions ---
  const applyFiltersAndPagination = () => {
    const searchFilter = filterSearchInput.value.toLowerCase();
    const typeFilter = filterTypeSelect.value;
    const statusFilter = filterStatusSelect.value;

    let filteredAccounts = allAccounts.filter(account => {
      const fullName = `${account.u_LastName} ${account.u_MiddleName} ${account.u_FirstName}`.toLowerCase();
      
      const matchesSearch = 
        fullName.includes(searchFilter) ||
        (account.u_username && account.u_username.toLowerCase().includes(searchFilter)) ||
        (account.u_email && account.u_email.toLowerCase().includes(searchFilter));
      
      const matchesType = !typeFilter || account.u_type === typeFilter;
      
      const matchesStatus = statusFilter === '' || account.u_status?.toString() === statusFilter;
      
      return matchesSearch && matchesType && matchesStatus;
    });

    totalPages = Math.ceil(filteredAccounts.length / itemsPerPage);
    if (totalPages < 1) totalPages = 1;
    if (currentPage > totalPages) currentPage = totalPages;

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    currentAccounts = filteredAccounts.slice(startIndex, endIndex);

    renderTable();
    updatePagination(filteredAccounts.length);
  };

  const renderTable = () => {
    accountsTableBody.innerHTML = ''; // Xóa các hàng hiện có

    if (currentAccounts.length === 0) {
      noDataPlaceholder.classList.remove('hidden');
      return;
    }

    noDataPlaceholder.classList.add('hidden');

    currentAccounts.forEach(account => {
      const row = document.createElement('tr');
      row.classList.add('hover:bg-gray-50');
      
      // Format date
      const createdAt = new Date(account.u_created_at);
      const formattedCreatedDate = createdAt.toLocaleDateString('vi-VN');
      
      // Format updated date if exists
      let updatedText = 'Chưa cập nhật';
      if (account.u_updated_at) {
        const updatedAt = new Date(account.u_updated_at);
        updatedText = updatedAt.toLocaleDateString('vi-VN') + ' ' + 
          updatedAt.toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'});
      }
      
      // Tạo avatar từ tên người dùng
      const fullName = `${account.u_LastName} ${account.u_MiddleName} ${account.u_FirstName}`;
      const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=random&color=fff&size=128`;
      
      // Chuẩn bị hiển thị loại tài khoản
      let typeClass = '';
      let typeLabel = '';
      
      switch(account.u_type) {
        case 'admin':
          typeClass = 'bg-purple-100 text-purple-800';
          typeLabel = 'Admin';
          break;
        case 'manager':
          typeClass = 'bg-blue-100 text-blue-800';
          typeLabel = 'Manager';
          break;
        default:
          typeClass = 'bg-gray-100 text-gray-800';
          typeLabel = 'User';
      }
      
      row.innerHTML = `
        <td class="px-4 py-3">
          <div class="flex items-center">
            <div class="flex-shrink-0 h-10 w-10">
              <img class="h-10 w-10 rounded-full object-cover" src="${avatarUrl}" alt="${fullName}">
            </div>
            <div class="ml-4">
              <div class="text-sm font-medium text-gray-900">${account.u_username}</div>
              <div class="text-sm text-gray-500">${account.u_email}</div>
              <div class="text-xs text-gray-400">Tạo: ${formattedCreatedDate}</div>
            </div>
          </div>
        </td>
        <td class="px-4 py-3">
          <div class="text-sm text-gray-900">${fullName}</div>
          <div class="text-xs text-gray-400">Cập nhật: ${updatedText}</div>
        </td>
        <td class="px-4 py-3">
          <div class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${typeClass}">
            ${typeLabel}
          </div>
        </td>
        <td class="px-4 py-3">
          <div class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${account.u_status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
            ${account.u_status ? 'Hoạt động' : 'Tạm khóa'}
          </div>
        </td>
        <td class="px-4 py-3 text-right text-sm font-medium space-x-1">
          <a href="account-detail.html?id=${account.u_id}" class="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded" title="Xem chi tiết">
            <i class="ri-eye-line"></i>
          </a>
          <a href="account-edit.html?id=${account.u_id}" class="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded" title="Sửa">
            <i class="ri-pencil-line"></i>
          </a>
          <button class="btn-delete p-1 text-red-600 hover:text-red-800 hover:bg-red-100 rounded" title="Xóa" data-id="${account.u_id}">
            <i class="ri-delete-bin-line"></i>
          </button>
          <button class="btn-reset-password p-1 text-yellow-600 hover:text-yellow-800 hover:bg-yellow-100 rounded" title="Đặt lại mật khẩu" data-id="${account.u_id}">
            <i class="ri-key-line"></i>
          </button>
          <button class="btn-toggle-status p-1 ${account.u_status ? 'text-gray-600 hover:text-gray-800 hover:bg-gray-100' : 'text-green-600 hover:text-green-800 hover:bg-green-100'} rounded" 
                  title="${account.u_status ? 'Khóa tài khoản' : 'Kích hoạt'}" data-id="${account.u_id}" data-status="${account.u_status}">
            <i class="${account.u_status ? 'ri-lock-line' : 'ri-lock-unlock-line'}"></i>
          </button>
        </td>
      `;

      // Thêm event listeners cho các nút hành động
      row.querySelector('.btn-delete').addEventListener('click', () => handleDeleteAccount(account.u_id));
      row.querySelector('.btn-reset-password').addEventListener('click', () => handleResetPassword(account.u_id));
      row.querySelector('.btn-toggle-status').addEventListener('click', () => handleToggleStatus(account.u_id));

      accountsTableBody.appendChild(row);
    });
  };

  const updatePagination = (totalItems) => {
    totalItemsCountEl.textContent = totalItems;
    totalPagesCountEl.textContent = totalPages;
    currentPageInput.value = currentPage;
    currentPageInput.max = totalPages;

    // Bật/tắt các nút phân trang
    btnFirst.disabled = currentPage === 1;
    btnPrev.disabled = currentPage === 1;
    btnNext.disabled = currentPage === totalPages;
    btnLast.disabled = currentPage === totalPages;

    // Ẩn phân trang nếu chỉ có một trang
    if (totalPages <= 1) {
      paginationControls.classList.add('opacity-50');
    } else {
      paginationControls.classList.remove('opacity-50');
    }
  };

  const handleDeleteAccount = (id) => {
    const account = allAccounts.find(a => a.u_id === id);
    if (!account) {
      console.error('Không tìm thấy tài khoản với ID:', id);
      return;
    }

    const fullName = `${account.u_LastName} ${account.u_MiddleName} ${account.u_FirstName}`;
    if (confirm(`Bạn có chắc chắn muốn xóa tài khoản "${fullName}" không? Hành động này không thể hoàn tác.`)) {
      // Trong thực tế, gửi yêu cầu API để xóa
      const index = allAccounts.findIndex(a => a.u_id === id);
      if (index > -1) {
        allAccounts.splice(index, 1);
        applyFiltersAndPagination();
        alert('Tài khoản đã được xóa thành công (mô phỏng).');
      }
    }
  };

  const handleResetPassword = (id) => {
    const account = allAccounts.find(a => a.u_id === id);
    if (!account) {
      console.error('Không tìm thấy tài khoản với ID:', id);
      return;
    }

    const fullName = `${account.u_LastName} ${account.u_MiddleName} ${account.u_FirstName}`;
    if (confirm(`Bạn có chắc chắn muốn đặt lại mật khẩu cho tài khoản "${fullName}" không?`)) {
      // Trong thực tế, sẽ gửi yêu cầu API để đặt lại mật khẩu
      alert('Mật khẩu đã được đặt lại và gửi email thông báo cho người dùng (mô phỏng).');
    }
  };

  const handleToggleStatus = (id) => {
    const account = allAccounts.find(a => a.u_id === id);
    if (!account) {
      console.error('Không tìm thấy tài khoản với ID:', id);
      return;
    }

    const fullName = `${account.u_LastName} ${account.u_MiddleName} ${account.u_FirstName}`;
    const newStatus = account.u_status === 1 ? 0 : 1;
    const statusAction = newStatus === 1 ? 'kích hoạt' : 'khóa';
    
    if (confirm(`Bạn có chắc chắn muốn ${statusAction} tài khoản "${fullName}" không?`)) {
      // Trong thực tế, gửi yêu cầu API để cập nhật trạng thái
      account.u_status = newStatus;
      applyFiltersAndPagination();
      alert(`Tài khoản đã được ${statusAction} thành công (mô phỏng).`);
    }
  };

  // --- Event Listeners ---
  // Sidebar toggle
  sidebarOpenBtn?.addEventListener('click', toggleSidebar);
  sidebarCloseBtn?.addEventListener('click', toggleSidebar);
  sidebarBackdrop?.addEventListener('click', toggleSidebar);
  
  // User menu toggle
  userMenuButton?.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleUserMenu();
  });

  document.addEventListener('click', (e) => {
    if (userMenu && !userMenu.classList.contains('invisible') && !userMenuButton.contains(e.target)) {
      toggleUserMenu();
    }
  });

  // Lọc và phân trang
  filterForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    currentPage = 1;
    applyFiltersAndPagination();
  });

  resetFilterBtn?.addEventListener('click', () => {
    filterForm.reset();
    currentPage = 1;
    applyFiltersAndPagination();
  });

  // Phân trang
  itemsPerPageSelect?.addEventListener('change', (e) => {
    itemsPerPage = parseInt(e.target.value);
    currentPage = 1;
    applyFiltersAndPagination();
  });

  btnFirst?.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage = 1;
      applyFiltersAndPagination();
    }
  });

  btnPrev?.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      applyFiltersAndPagination();
    }
  });

  btnNext?.addEventListener('click', () => {
    if (currentPage < totalPages) {
      currentPage++;
      applyFiltersAndPagination();
    }
  });

  btnLast?.addEventListener('click', () => {
    if (currentPage < totalPages) {
      currentPage = totalPages;
      applyFiltersAndPagination();
    }
  });

  currentPageInput?.addEventListener('change', (e) => {
    let newPage = parseInt(e.target.value);
    if (newPage >= 1 && newPage <= totalPages) {
      currentPage = newPage;
      applyFiltersAndPagination();
    } else {
      e.target.value = currentPage;
    }
  });

  // Khởi tạo
  init();
}); 