document.addEventListener('DOMContentLoaded', () => {
  AOS.init();

  // --- State Variables ---
  let allAccounts = []; // Lưu trữ tất cả dữ liệu tài khoản
  let currentAccounts = []; // Lưu trữ dữ liệu tài khoản đã được lọc và phân trang
  let currentPage = 1;
  let itemsPerPage = 10;
  let totalPages = 1;
  let currentEditId = null; // Để theo dõi tài khoản nào đang được chỉnh sửa

  // --- DOM Elements ---
  const sidebar = document.getElementById('sidebar');
  const sidebarBackdrop = document.getElementById('sidebar-backdrop');
  const sidebarOpenBtn = document.getElementById('sidebar-open');
  const sidebarCloseBtn = document.getElementById('sidebar-close');
  const userMenuButton = document.getElementById('user-menu-button');
  const userMenu = document.getElementById('user-menu');

  const accountModal = document.getElementById('account-modal');
  const addAccountBtn = document.getElementById('add-account-btn');
  const closeAccountModalBtn = document.getElementById('close-account-modal');
  const cancelAccountBtn = document.getElementById('cancel-account-btn');
  const accountForm = document.getElementById('account-form');
  const accountIdInput = document.getElementById('account-id');
  const modalTitle = document.getElementById('modal-title');
  const passwordFields = document.getElementById('password-fields');

  const filterForm = document.getElementById('filter-form');
  const filterSearchInput = document.getElementById('filter-search');
  const filterRoleSelect = document.getElementById('filter-role');
  const filterStatusSelect = document.getElementById('filter-status');
  const filterDateInput = document.getElementById('filter-date');
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
  const refreshBtn = document.getElementById('refresh-btn');

  // --- Dữ liệu mẫu (dựa trên cấu trúc bảng users SQL) ---
  const generateSampleAccounts = (count) => {
    const roles = ['admin', 'manager', 'editor', 'moderator'];
    const roleLabels = {
      'admin': 'Quản trị viên',
      'manager': 'Quản lý', 
      'editor': 'Biên tập viên', 
      'moderator': 'Người kiểm duyệt'
    };
    const statuses = [1, 0]; // 1 = active, 0 = inactive
    const statusLabels = {
      1: 'Hoạt động',
      0: 'Tạm khóa'
    };
    const statusClasses = {
      1: 'bg-green-100 text-green-800',
      0: 'bg-red-100 text-red-800'
    };

    const sampleData = [];
    const firstNames = ['Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Huỳnh', 'Phan', 'Vũ', 'Võ', 'Đặng'];
    const middleNames = ['Văn', 'Thị', 'Đức', 'Minh', 'Hoàng', 'Thành', 'Quốc', 'Như', 'Thanh', 'Tuấn'];
    const lastNames = ['An', 'Bình', 'Cường', 'Dũng', 'Hà', 'Hùng', 'Lan', 'Mai', 'Nam', 'Phương'];
    
    const domains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hubadmin.edu.vn', 'hubtech.vn', 'example.com'];
    
    const generateUsername = (firstName, lastName) => {
      const normalizedLastName = lastName.toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
      const normalizedFirstName = firstName.toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
      return `${normalizedFirstName}.${normalizedLastName}${Math.floor(Math.random() * 100)}`;
    };

    for (let i = 1; i <= count; i++) {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const middleName = middleNames[Math.floor(Math.random() * middleNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const fullName = `${firstName} ${middleName} ${lastName}`;
      const username = generateUsername(firstName, lastName);
      const domain = domains[Math.floor(Math.random() * domains.length)];
      const email = `${username}@${domain}`;
      
      const role = roles[Math.floor(Math.random() * roles.length)];
      const status = Math.random() > 0.2 ? 1 : 0; // 80% chance to be active
      
      // Generate a random date within the past 2 years
      const now = new Date();
      const twoYearsAgo = new Date();
      twoYearsAgo.setFullYear(now.getFullYear() - 2);
      const randomTimestamp = twoYearsAgo.getTime() + Math.random() * (now.getTime() - twoYearsAgo.getTime());
      const createdDate = new Date(randomTimestamp);
      
      sampleData.push({
        id: i,
        username: username,
        email: email,
        fullname: fullName,
        password: 'password_hash',
        role: role,
        role_label: roleLabels[role],
        status: status,
        status_label: statusLabels[status],
        status_class: statusClasses[status],
        created_at: createdDate,
        avatar: `https://readdy.ai/api/search-image?query=professional%20headshot%20young%20vietnamese%20${Math.random() > 0.5 ? 'man' : 'woman'}%20minimal%20background&width=100&height=100&seq=${i}`
      });
    }
    
    return sampleData;
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

  const openAccountModal = (account = null) => {
    accountForm.reset();
    if (account) {
      modalTitle.textContent = 'Chỉnh sửa tài khoản admin';
      currentEditId = account.id;
      accountIdInput.value = account.id;
      document.getElementById('account-fullname').value = account.fullname || '';
      document.getElementById('account-username').value = account.username || '';
      document.getElementById('account-email').value = account.email || '';
      document.getElementById('account-role').value = account.role || '';
      
      // Khi chỉnh sửa, mật khẩu là tùy chọn
      document.getElementById('account-password').removeAttribute('required');
      document.getElementById('account-confirm-password').removeAttribute('required');
      passwordFields.classList.add('opacity-50');
    } else {
      modalTitle.textContent = 'Thêm tài khoản admin mới';
      currentEditId = null;
      accountIdInput.value = '';
      
      // Khi thêm mới, mật khẩu là bắt buộc
      document.getElementById('account-password').setAttribute('required', 'required');
      document.getElementById('account-confirm-password').setAttribute('required', 'required');
      passwordFields.classList.remove('opacity-50');
    }
    
    // Hiển thị modal với animation
    accountModal.classList.remove('hidden');
    accountModal.classList.add('flex');
    setTimeout(() => {
      accountModal.querySelector('.bg-white').classList.remove('opacity-0', 'scale-95');
      accountModal.querySelector('.bg-white').classList.add('opacity-100', 'scale-100');
    }, 10);
  };

  const closeAccountModal = () => {
    // Ẩn modal với animation
    accountModal.querySelector('.bg-white').classList.remove('opacity-100', 'scale-100');
    accountModal.querySelector('.bg-white').classList.add('opacity-0', 'scale-95');
    setTimeout(() => {
      accountModal.classList.remove('flex');
      accountModal.classList.add('hidden');
      accountForm.reset();
      currentEditId = null;
    }, 300);
  };

  // --- Data Handling Functions ---
  const applyFiltersAndPagination = () => {
    const searchFilter = filterSearchInput.value.toLowerCase();
    const roleFilter = filterRoleSelect.value;
    const statusFilter = filterStatusSelect.value;
    const dateFilter = filterDateInput.value;

    let filteredAccounts = allAccounts.filter(account => {
      const matchesSearch = 
        account.fullname.toLowerCase().includes(searchFilter) ||
        account.username.toLowerCase().includes(searchFilter) ||
        account.email.toLowerCase().includes(searchFilter);
      
      const matchesRole = !roleFilter || account.role === roleFilter;
      
      const matchesStatus = statusFilter === '' || account.status.toString() === statusFilter;
      
      let matchesDate = true;
      if (dateFilter) {
        const filterDate = new Date(dateFilter);
        const accountDate = new Date(account.created_at);
        matchesDate = 
          accountDate.getFullYear() === filterDate.getFullYear() &&
          accountDate.getMonth() === filterDate.getMonth() &&
          accountDate.getDate() === filterDate.getDate();
      }
      
      return matchesSearch && matchesRole && matchesStatus && matchesDate;
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
      const createdAt = new Date(account.created_at);
      const formattedDate = createdAt.toLocaleDateString('vi-VN');

      row.innerHTML = `
        <td class="px-4 py-3 whitespace-nowrap">
          <div class="flex items-center">
            <div class="flex-shrink-0 h-10 w-10">
              <img class="h-10 w-10 rounded-full object-cover" src="${account.avatar}" alt="${account.fullname}">
            </div>
            <div class="ml-4">
              <div class="text-sm font-medium text-gray-900">${account.fullname}</div>
              <div class="text-sm text-gray-500">@${account.username}</div>
            </div>
          </div>
        </td>
        <td class="px-4 py-3 whitespace-nowrap">
          <div class="text-sm text-gray-900">${account.email}</div>
        </td>
        <td class="px-4 py-3 whitespace-nowrap">
          <div class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            ${account.role_label}
          </div>
        </td>
        <td class="px-4 py-3 whitespace-nowrap">
          <div class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${account.status_class}">
            ${account.status_label}
          </div>
        </td>
        <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
          ${formattedDate}
        </td>
        <td class="px-4 py-3 text-right text-sm font-medium space-x-1 whitespace-nowrap">
          <button class="btn-edit p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded" title="Sửa" data-id="${account.id}">
            <i class="ri-pencil-line"></i>
          </button>
          <button class="btn-delete p-1 text-red-600 hover:text-red-800 hover:bg-red-100 rounded" title="Xóa" data-id="${account.id}">
            <i class="ri-delete-bin-line"></i>
          </button>
          <button class="btn-reset-password p-1 text-yellow-600 hover:text-yellow-800 hover:bg-yellow-100 rounded" title="Đặt lại mật khẩu" data-id="${account.id}">
            <i class="ri-key-line"></i>
          </button>
          <button class="btn-toggle-status p-1 ${account.status ? 'text-gray-600 hover:text-gray-800 hover:bg-gray-100' : 'text-green-600 hover:text-green-800 hover:bg-green-100'} rounded" 
                  title="${account.status ? 'Khóa tài khoản' : 'Kích hoạt'}" data-id="${account.id}" data-status="${account.status}">
            <i class="${account.status ? 'ri-lock-line' : 'ri-lock-unlock-line'}"></i>
          </button>
        </td>
      `;

      // Thêm event listeners cho các nút hành động
      row.querySelector('.btn-edit').addEventListener('click', () => handleEditAccount(account.id));
      row.querySelector('.btn-delete').addEventListener('click', () => handleDeleteAccount(account.id));
      row.querySelector('.btn-reset-password').addEventListener('click', () => handleResetPassword(account.id));
      row.querySelector('.btn-toggle-status').addEventListener('click', () => handleToggleStatus(account.id));

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
      paginationControls.classList.add('hidden');
    } else {
      paginationControls.classList.remove('hidden');
    }
  };

  const handleEditAccount = (id) => {
    const accountToEdit = allAccounts.find(a => a.id === id);
    if (accountToEdit) {
      openAccountModal(accountToEdit);
    } else {
      console.error('Không tìm thấy tài khoản với ID:', id);
      alert('Không tìm thấy tài khoản để chỉnh sửa.');
    }
  };

  const handleDeleteAccount = (id) => {
    if (confirm(`Bạn có chắc chắn muốn xóa tài khoản này không?`)) {
      const index = allAccounts.findIndex(a => a.id === id);
      if (index > -1) {
        allAccounts.splice(index, 1);
        applyFiltersAndPagination();
        alert('Tài khoản đã được xóa (mô phỏng).');
      } else {
        console.error('Không tìm thấy tài khoản với ID:', id);
        alert('Không tìm thấy tài khoản để xóa.');
      }
    }
  };

  const handleResetPassword = (id) => {
    if (confirm(`Bạn có chắc chắn muốn đặt lại mật khẩu cho tài khoản này không?`)) {
      // Trong thực tế, sẽ gửi yêu cầu API để đặt lại mật khẩu
      alert('Mật khẩu đã được đặt lại và gửi email thông báo cho người dùng (mô phỏng).');
    }
  };

  const handleToggleStatus = (id) => {
    const account = allAccounts.find(a => a.id === id);
    if (!account) {
      console.error('Không tìm thấy tài khoản với ID:', id);
      return;
    }

    const newStatus = account.status === 1 ? 0 : 1;
    const statusAction = newStatus === 1 ? 'kích hoạt' : 'khóa';
    
    if (confirm(`Bạn có chắc chắn muốn ${statusAction} tài khoản "${account.username}" không?`)) {
      account.status = newStatus;
      account.status_label = newStatus === 1 ? 'Hoạt động' : 'Tạm khóa';
      account.status_class = newStatus === 1 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
      
      applyFiltersAndPagination();
      alert(`Tài khoản đã được ${statusAction} (mô phỏng).`);
    }
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();

    const fullname = document.getElementById('account-fullname').value;
    const username = document.getElementById('account-username').value;
    const email = document.getElementById('account-email').value;
    const role = document.getElementById('account-role').value;
    const password = document.getElementById('account-password').value;
    const confirmPassword = document.getElementById('account-confirm-password').value;

    // Cơ bản validation
    if (!fullname || !username || !email || !role) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc.');
      return;
    }

    // Kiểm tra mật khẩu khi thêm mới hoặc khi có nhập mật khẩu
    if ((!currentEditId && (!password || !confirmPassword)) || 
        (password && !confirmPassword) || 
        (confirmPassword && !password)) {
      alert('Vui lòng nhập mật khẩu và xác nhận mật khẩu.');
      return;
    }

    if (password && confirmPassword && password !== confirmPassword) {
      alert('Mật khẩu và xác nhận mật khẩu không khớp.');
      return;
    }

    const roleLabels = {
      'admin': 'Quản trị viên',
      'manager': 'Quản lý', 
      'editor': 'Biên tập viên', 
      'moderator': 'Người kiểm duyệt'
    };

    if (currentEditId) {
      // Cập nhật tài khoản hiện có
      const index = allAccounts.findIndex(a => a.id === currentEditId);
      if (index > -1) {
        allAccounts[index].fullname = fullname;
        allAccounts[index].username = username;
        allAccounts[index].email = email;
        allAccounts[index].role = role;
        allAccounts[index].role_label = roleLabels[role];
        // Password would be updated in a real API call
        
        console.log('Tài khoản đã được cập nhật:', allAccounts[index]);
        alert('Tài khoản đã được cập nhật (mô phỏng).');
      } else {
        console.error('Không tìm thấy tài khoản để cập nhật:', currentEditId);
        alert('Lỗi: Không tìm thấy tài khoản để cập nhật.');
      }
    } else {
      // Thêm tài khoản mới
      const newAccount = {
        id: Date.now(), // Generate a unique ID
        fullname: fullname,
        username: username,
        email: email,
        role: role,
        role_label: roleLabels[role],
        status: 1,
        status_label: 'Hoạt động',
        status_class: 'bg-green-100 text-green-800',
        created_at: new Date(),
        avatar: `https://readdy.ai/api/search-image?query=professional%20headshot%20young%20vietnamese%20${Math.random() > 0.5 ? 'man' : 'woman'}%20minimal%20background&width=100&height=100&seq=${Date.now()}`
      };
      
      allAccounts.unshift(newAccount); // Add to the beginning
      console.log('Tài khoản đã được thêm:', newAccount);
      alert('Tài khoản đã được thêm (mô phỏng).');
    }

    closeAccountModal();
    applyFiltersAndPagination(); // Refresh the table
  };

  // --- Event Listeners ---
  sidebarOpenBtn?.addEventListener('click', toggleSidebar);
  sidebarCloseBtn?.addEventListener('click', toggleSidebar);
  sidebarBackdrop?.addEventListener('click', toggleSidebar);
  
  userMenuButton?.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleUserMenu();
  });

  document.addEventListener('click', (e) => {
    if (userMenu && !userMenu.classList.contains('invisible') && !userMenuButton.contains(e.target)) {
      toggleUserMenu();
    }
  });

  addAccountBtn?.addEventListener('click', () => openAccountModal());
  closeAccountModalBtn?.addEventListener('click', closeAccountModal);
  cancelAccountBtn?.addEventListener('click', closeAccountModal);
  accountForm?.addEventListener('submit', handleFormSubmit);

  // Lọc
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

  refreshBtn?.addEventListener('click', () => {
    console.log('Đang làm mới danh sách tài khoản (mô phỏng)...');
    applyFiltersAndPagination();
    alert('Danh sách tài khoản đã được làm mới (mô phỏng).');
  });

  // --- Khởi tạo ---
  allAccounts = generateSampleAccounts(20); // Tạo dữ liệu mẫu ban đầu
  itemsPerPage = parseInt(itemsPerPageSelect.value);
  applyFiltersAndPagination(); // Hiển thị ban đầu
}); 