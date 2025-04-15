// Biến toàn cục
let allMajors = [];
let filteredMajors = [];
let departments = [];
let currentPage = 1;
let pageSize = 10;
let totalPages = 1;
let currentMajorId = null;

// Khởi tạo khi tài liệu đã sẵn sàng
document.addEventListener('DOMContentLoaded', function() {
  // Khởi tạo các thư viện
  AOS.init();
  initializeToastr();
  
  // Thiết lập sự kiện
  setupEventListeners();
  
  // Lấy dữ liệu ngành học và khoa
  fetchData();
});

// Khởi tạo cấu hình Toastr
function initializeToastr() {
  toastr.options = {
    closeButton: true,
    progressBar: true,
    positionClass: 'toast-top-right',
    timeOut: 3000,
    extendedTimeOut: 1000,
    preventDuplicates: true
  };
}

// Thiết lập các sự kiện
function setupEventListeners() {
  // Sự kiện tìm kiếm
  document.getElementById('search').addEventListener('input', handleSearch);
  
  // Sự kiện lọc
  document.getElementById('filter-form').addEventListener('submit', function(e) {
    e.preventDefault();
    applyFilters();
  });
  
  // Nút đặt lại bộ lọc
  document.getElementById('reset-filter-btn').addEventListener('click', resetFilters);
  
  // Sự kiện số lượng hiển thị trên trang
  document.getElementById('items-per-page').addEventListener('change', function() {
    pageSize = parseInt(this.value);
    currentPage = 1;
    renderTable();
    setupPagination();
  });
  
  // Nút thêm ngành mới
  document.getElementById('addMajorBtn').addEventListener('click', openAddModal);
  
  // Sự kiện form thêm/sửa ngành
  document.getElementById('majorForm').addEventListener('submit', handleSubmit);
  
  // Sự kiện đóng modal
  document.getElementById('close-modal').addEventListener('click', closeModal);
  document.getElementById('cancel-button').addEventListener('click', closeModal);
  
  // Sự kiện xóa ngành
  document.getElementById('confirm-delete').addEventListener('click', confirmDelete);
  document.getElementById('cancel-delete').addEventListener('click', closeDeleteModal);
  
  // Xử lý sự kiện trong bảng
  setupTableEventListeners();
}

// Thiết lập sự kiện trong bảng
function setupTableEventListeners() {
  const table = document.getElementById('majorsTable');
  if (table) {
    table.addEventListener('click', function(e) {
      const target = e.target;
      
      // Nút sửa
      const editButton = target.closest('.edit-btn');
      if (editButton) {
        const majorId = editButton.dataset.id;
        openEditModal(majorId);
        return;
      }
      
      // Nút xóa
      const deleteButton = target.closest('.delete-btn');
      if (deleteButton) {
        const majorId = deleteButton.dataset.id;
        openDeleteModal(majorId);
        return;
      }
    });
  }
}

// Lấy dữ liệu từ server
function fetchData() {
  // Hiển thị loader
  document.getElementById('loading').classList.remove('hidden');
  
  // Giả lập API call để lấy dữ liệu ngành và khoa
  // Trong môi trường thật, thay thế bằng fetch đến API thật
  fetch('/admin/majors/data')
    .then(response => {
      if (!response.ok) {
        throw new Error('Không thể tải dữ liệu từ server');
      }
      return response.json();
    })
    .then(data => {
      // Lưu dữ liệu vào biến toàn cục
      allMajors = data.majors || [];
      departments = data.departments || [];
      
      // Chuẩn bị dữ liệu
      prepareDataForDisplay();
      
      // Cập nhật UI
      populateDepartmentDropdowns();
      renderTable();
      setupPagination();
      updateTotalCount();
      
      // Ẩn loader
      document.getElementById('loading').classList.add('hidden');
    })
    .catch(error => {
      console.error('Lỗi khi tải dữ liệu:', error);
      showToast('Không thể tải dữ liệu. Vui lòng thử lại sau.', 'error');
      document.getElementById('loading').classList.add('hidden');
      
      // Hiển thị dữ liệu mẫu nếu đang trong môi trường phát triển
      if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
        loadSampleData();
      }
    });
}

// Tải dữ liệu mẫu (chỉ dùng trong môi trường phát triển)
function loadSampleData() {
  console.log('Đang tải dữ liệu mẫu...');
  
  // Dữ liệu mẫu các khoa
  departments = [
    { phong_khoa_id: 1, ten_phong_khoa: 'Khoa Công nghệ thông tin', ma_phong_khoa: 'CNTT', status: 1 },
    { phong_khoa_id: 2, ten_phong_khoa: 'Khoa Tài chính - Ngân hàng', ma_phong_khoa: 'TCNH', status: 1 },
    { phong_khoa_id: 3, ten_phong_khoa: 'Khoa Quản trị kinh doanh', ma_phong_khoa: 'QTKD', status: 1 },
    { phong_khoa_id: 4, ten_phong_khoa: 'Khoa Kế toán', ma_phong_khoa: 'KT', status: 1 },
    { phong_khoa_id: 5, ten_phong_khoa: 'Khoa Kinh tế quốc tế', ma_phong_khoa: 'KTQT', status: 0 }
  ];
  
  // Dữ liệu mẫu các ngành
  allMajors = [
    { nganh_id: 1, ma_nganh: 'TH01', ten_nganh: 'Công nghệ thông tin', phong_khoa_id: 1, status: 1, created_at: '2023-01-05 08:30:00' },
    { nganh_id: 2, ma_nganh: 'TH02', ten_nganh: 'Khoa học máy tính', phong_khoa_id: 1, status: 1, created_at: '2023-01-06 09:45:00' },
    { nganh_id: 3, ma_nganh: 'TH03', ten_nganh: 'Kỹ thuật phần mềm', phong_khoa_id: 1, status: 1, created_at: '2023-01-10 10:15:00' },
    { nganh_id: 4, ma_nganh: 'TC01', ten_nganh: 'Tài chính', phong_khoa_id: 2, status: 1, created_at: '2023-01-15 11:20:00' },
    { nganh_id: 5, ma_nganh: 'TC02', ten_nganh: 'Ngân hàng', phong_khoa_id: 2, status: 1, created_at: '2023-01-20 13:10:00' },
    { nganh_id: 6, ma_nganh: 'TC03', ten_nganh: 'Tài chính doanh nghiệp', phong_khoa_id: 2, status: 0, created_at: '2023-02-01 14:30:00' },
    { nganh_id: 7, ma_nganh: 'KD01', ten_nganh: 'Quản trị kinh doanh', phong_khoa_id: 3, status: 1, created_at: '2023-02-05 15:45:00' },
    { nganh_id: 8, ma_nganh: 'KD02', ten_nganh: 'Marketing', phong_khoa_id: 3, status: 1, created_at: '2023-02-10 16:20:00' },
    { nganh_id: 9, ma_nganh: 'KD03', ten_nganh: 'Thương mại điện tử', phong_khoa_id: 3, status: 1, created_at: '2023-02-15 09:30:00' },
    { nganh_id: 10, ma_nganh: 'KT01', ten_nganh: 'Kế toán doanh nghiệp', phong_khoa_id: 4, status: 1, created_at: '2023-02-20 10:45:00' },
    { nganh_id: 11, ma_nganh: 'KT02', ten_nganh: 'Kiểm toán', phong_khoa_id: 4, status: 1, created_at: '2023-02-25 11:15:00' },
    { nganh_id: 12, ma_nganh: 'KT03', ten_nganh: 'Kế toán công', phong_khoa_id: 4, status: 0, created_at: '2023-03-01 13:30:00' },
    { nganh_id: 13, ma_nganh: 'QT01', ten_nganh: 'Kinh tế đối ngoại', phong_khoa_id: 5, status: 1, created_at: '2023-03-05 14:20:00' },
    { nganh_id: 14, ma_nganh: 'QT02', ten_nganh: 'Thương mại quốc tế', phong_khoa_id: 5, status: 1, created_at: '2023-03-10 15:40:00' },
    { nganh_id: 15, ma_nganh: 'QT03', ten_nganh: 'Quan hệ quốc tế', phong_khoa_id: 5, status: 0, created_at: '2023-03-15 16:10:00' },
    { nganh_id: 16, ma_nganh: 'TH04', ten_nganh: 'An toàn thông tin', phong_khoa_id: 1, status: 1, created_at: '2023-03-20 09:15:00' },
    { nganh_id: 17, ma_nganh: 'TC04', ten_nganh: 'Đầu tư chứng khoán', phong_khoa_id: 2, status: 1, created_at: '2023-03-25 10:30:00' },
    { nganh_id: 18, ma_nganh: 'KD04', ten_nganh: 'Quản trị nhân lực', phong_khoa_id: 3, status: 1, created_at: '2023-04-01 11:45:00' },
    { nganh_id: 19, ma_nganh: 'KT04', ten_nganh: 'Kế toán quốc tế', phong_khoa_id: 4, status: 1, created_at: '2023-04-05 13:20:00' },
    { nganh_id: 20, ma_nganh: 'QT04', ten_nganh: 'Kinh doanh quốc tế', phong_khoa_id: 5, status: 1, created_at: '2023-04-10 14:30:00' }
  ];
  
  // Chuẩn bị dữ liệu
  prepareDataForDisplay();
  
  // Cập nhật UI
  populateDepartmentDropdowns();
  renderTable();
  setupPagination();
  updateTotalCount();
}

// Chuẩn bị dữ liệu để hiển thị
function prepareDataForDisplay() {
  // Thêm tên khoa cho mỗi ngành
  allMajors.forEach(major => {
    const department = departments.find(dept => dept.phong_khoa_id == major.phong_khoa_id);
    major.ten_phong_khoa = department ? department.ten_phong_khoa : 'Chưa phân khoa';
  });
  
  // Cập nhật danh sách đã lọc
  filteredMajors = [...allMajors];
}

// Cập nhật tổng số lượng ngành
function updateTotalCount() {
  const totalCountElement = document.getElementById('totalCount');
  const totalItemsCountElement = document.getElementById('total-items-count');
  
  if (totalCountElement) {
    totalCountElement.textContent = filteredMajors.length;
  }
  
  if (totalItemsCountElement) {
    totalItemsCountElement.textContent = filteredMajors.length;
  }
}

// Điền dữ liệu khoa vào các dropdown
function populateDepartmentDropdowns() {
  // Dropdown trong form thêm/sửa
  const departmentSelect = document.getElementById('department');
  if (departmentSelect) {
    // Xóa tất cả các options trừ option đầu tiên
    while (departmentSelect.options.length > 1) {
      departmentSelect.remove(1);
    }
    
    // Thêm các khoa vào dropdown
    departments.forEach(dept => {
      const option = document.createElement('option');
      option.value = dept.phong_khoa_id;
      option.textContent = dept.ten_phong_khoa;
      departmentSelect.appendChild(option);
    });
  }
  
  // Dropdown trong bộ lọc
  const filterDepartmentSelect = document.getElementById('filter-department');
  if (filterDepartmentSelect) {
    // Xóa tất cả các options trừ option đầu tiên
    while (filterDepartmentSelect.options.length > 1) {
      filterDepartmentSelect.remove(1);
    }
    
    // Thêm các khoa vào dropdown
    departments.forEach(dept => {
      const option = document.createElement('option');
      option.value = dept.phong_khoa_id;
      option.textContent = dept.ten_phong_khoa;
      filterDepartmentSelect.appendChild(option);
    });
  }
}

// Mở modal thêm ngành
function openAddModal() {
  // Đặt tiêu đề modal
  document.getElementById('modal-title').textContent = 'Thêm ngành mới';
  
  // Reset form
  resetForm();
  
  // Đặt action là add
  document.getElementById('majorForm').dataset.action = 'add';
  
  // Hiển thị modal
  document.getElementById('majorModal').classList.remove('hidden');
}

// Mở modal sửa ngành
function openEditModal(majorId) {
  // Đặt tiêu đề modal
  document.getElementById('modal-title').textContent = 'Cập nhật ngành đào tạo';
  
  // Tìm ngành cần sửa
  const major = allMajors.find(m => m.nganh_id == majorId);
  if (!major) {
    showToast('Không tìm thấy thông tin ngành', 'error');
    return;
  }
  
  // Đặt action là edit
  const form = document.getElementById('majorForm');
  form.dataset.action = 'edit';
  
  // Điền dữ liệu vào form
  document.getElementById('majorId').value = major.nganh_id;
  document.getElementById('majorCode').value = major.ma_nganh;
  document.getElementById('majorName').value = major.ten_nganh;
  document.getElementById('department').value = major.phong_khoa_id || '0';
  document.getElementById('status').checked = major.status == 1;
  
  // Hiển thị modal
  document.getElementById('majorModal').classList.remove('hidden');
}

// Đóng modal thêm/sửa
function closeModal() {
  document.getElementById('majorModal').classList.add('hidden');
}

// Mở modal xác nhận xóa
function openDeleteModal(majorId) {
  currentMajorId = majorId;
  document.getElementById('deleteModal').classList.remove('hidden');
}

// Đóng modal xác nhận xóa
function closeDeleteModal() {
  document.getElementById('deleteModal').classList.add('hidden');
  currentMajorId = null;
}

// Reset form
function resetForm() {
  const form = document.getElementById('majorForm');
  form.reset();
  
  // Reset các trường hidden
  document.getElementById('majorId').value = '';
  
  // Reset select về giá trị mặc định
  document.getElementById('department').value = '0';
  
  // Mặc định status là checked (hoạt động)
  document.getElementById('status').checked = true;
}

// Xử lý submit form
function handleSubmit(event) {
  event.preventDefault();
  
  // Lấy form và action
  const form = event.target;
  const action = form.dataset.action;
  
  // Validate dữ liệu
  const majorId = document.getElementById('majorId').value;
  const majorCode = document.getElementById('majorCode').value.trim();
  const majorName = document.getElementById('majorName').value.trim();
  const departmentId = document.getElementById('department').value;
  const status = document.getElementById('status').checked ? 1 : 0;
  
  // Kiểm tra dữ liệu hợp lệ
  if (!majorCode) {
    showToast('Vui lòng nhập mã ngành', 'error');
    return;
  }
  
  if (!majorName) {
    showToast('Vui lòng nhập tên ngành', 'error');
    return;
  }
  
  if (departmentId === '0') {
    showToast('Vui lòng chọn khoa/phòng', 'error');
    return;
  }
  
  // Chuẩn bị dữ liệu gửi lên server
  const data = {
    ma_nganh: majorCode,
    ten_nganh: majorName,
    phong_khoa_id: departmentId,
    status: status
  };
  
  // Trong môi trường thực, gửi dữ liệu lên server
  if (action === 'add') {
    addMajor(data);
  } else if (action === 'edit') {
    updateMajor(majorId, data);
  }
}

// Thêm ngành mới
function addMajor(data) {
  // Hiển thị loading
  document.getElementById('loading').classList.remove('hidden');
  
  // Trong môi trường thực, sử dụng fetch để gửi dữ liệu lên server
  fetch('/admin/majors', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
    },
    body: JSON.stringify(data)
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Không thể thêm ngành đào tạo');
    }
    return response.json();
  })
  .then(result => {
    if (result.success) {
      showToast('Thêm ngành đào tạo thành công', 'success');
      closeModal();
      fetchData(); // Tải lại dữ liệu
    } else {
      showToast(result.message || 'Không thể thêm ngành đào tạo', 'error');
    }
  })
  .catch(error => {
    console.error('Lỗi khi thêm ngành:', error);
    showToast(error.message, 'error');
    
    // Trong môi trường dev, giả lập thêm thành công
    if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
      simulateAddMajor(data);
    }
  })
  .finally(() => {
    document.getElementById('loading').classList.add('hidden');
  });
}

// Giả lập thêm ngành (chỉ dùng trong môi trường phát triển)
function simulateAddMajor(data) {
  // Tạo một ID mới
  const newId = Math.max(...allMajors.map(m => m.nganh_id), 0) + 1;
  
  // Tạo ngành mới
  const newMajor = {
    nganh_id: newId,
    ma_nganh: data.ma_nganh,
    ten_nganh: data.ten_nganh,
    phong_khoa_id: data.phong_khoa_id,
    status: data.status,
    created_at: new Date().toISOString()
  };
  
  // Thêm vào danh sách
  allMajors.push(newMajor);
  
  // Cập nhật dữ liệu
  prepareDataForDisplay();
  renderTable();
  setupPagination();
  updateTotalCount();
  
  // Thông báo thành công
  showToast('Thêm ngành đào tạo thành công (Chế độ Development)', 'success');
  closeModal();
}

// Cập nhật ngành
function updateMajor(majorId, data) {
  // Hiển thị loading
  document.getElementById('loading').classList.remove('hidden');
  
  // Trong môi trường thực, sử dụng fetch để gửi dữ liệu lên server
  fetch(`/admin/majors/${majorId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
    },
    body: JSON.stringify(data)
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Không thể cập nhật ngành đào tạo');
    }
    return response.json();
  })
  .then(result => {
    if (result.success) {
      showToast('Cập nhật ngành đào tạo thành công', 'success');
      closeModal();
      fetchData(); // Tải lại dữ liệu
    } else {
      showToast(result.message || 'Không thể cập nhật ngành đào tạo', 'error');
    }
  })
  .catch(error => {
    console.error('Lỗi khi cập nhật ngành:', error);
    showToast(error.message, 'error');
    
    // Trong môi trường dev, giả lập cập nhật thành công
    if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
      simulateUpdateMajor(majorId, data);
    }
  })
  .finally(() => {
    document.getElementById('loading').classList.add('hidden');
  });
}

// Giả lập cập nhật ngành (chỉ dùng trong môi trường phát triển)
function simulateUpdateMajor(majorId, data) {
  // Tìm ngành cần cập nhật
  const index = allMajors.findIndex(m => m.nganh_id == majorId);
  if (index !== -1) {
    // Cập nhật thông tin
    allMajors[index].ma_nganh = data.ma_nganh;
    allMajors[index].ten_nganh = data.ten_nganh;
    allMajors[index].phong_khoa_id = data.phong_khoa_id;
    allMajors[index].status = data.status;
    allMajors[index].updated_at = new Date().toISOString();
    
    // Cập nhật dữ liệu
    prepareDataForDisplay();
    renderTable();
    setupPagination();
    
    // Thông báo thành công
    showToast('Cập nhật ngành đào tạo thành công (Chế độ Development)', 'success');
    closeModal();
  } else {
    showToast('Không tìm thấy ngành cần cập nhật', 'error');
  }
}

// Xác nhận xóa ngành
function confirmDelete() {
  if (!currentMajorId) {
    showToast('Không có ngành được chọn để xóa', 'error');
    closeDeleteModal();
    return;
  }
  
  // Hiển thị loading
  document.getElementById('loading').classList.remove('hidden');
  
  // Trong môi trường thực, sử dụng fetch để gửi yêu cầu xóa lên server
  fetch(`/admin/majors/${currentMajorId}`, {
    method: 'DELETE',
    headers: {
      'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
    }
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Không thể xóa ngành đào tạo');
    }
    return response.json();
  })
  .then(result => {
    if (result.success) {
      showToast('Xóa ngành đào tạo thành công', 'success');
      closeDeleteModal();
      fetchData(); // Tải lại dữ liệu
    } else {
      showToast(result.message || 'Không thể xóa ngành đào tạo', 'error');
    }
  })
  .catch(error => {
    console.error('Lỗi khi xóa ngành:', error);
    showToast(error.message, 'error');
    
    // Trong môi trường dev, giả lập xóa thành công
    if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
      simulateDeleteMajor(currentMajorId);
    }
  })
  .finally(() => {
    document.getElementById('loading').classList.add('hidden');
  });
}

// Giả lập xóa ngành (chỉ dùng trong môi trường phát triển)
function simulateDeleteMajor(majorId) {
  // Xóa ngành khỏi danh sách
  allMajors = allMajors.filter(m => m.nganh_id != majorId);
  
  // Cập nhật dữ liệu
  prepareDataForDisplay();
  renderTable();
  setupPagination();
  updateTotalCount();
  
  // Thông báo thành công
  showToast('Xóa ngành đào tạo thành công (Chế độ Development)', 'success');
  closeDeleteModal();
}

// Xử lý tìm kiếm
function handleSearch() {
  applyFilters();
}

// Áp dụng bộ lọc
function applyFilters() {
  const searchTerm = document.getElementById('search').value.toLowerCase().trim();
  const departmentId = document.getElementById('filter-department').value;
  const status = document.getElementById('filter-status').value;
  const dateFilter = document.getElementById('filter-date').value;
  
  // Lọc dữ liệu dựa trên các điều kiện
  filteredMajors = allMajors.filter(major => {
    let matchSearch = true;
    let matchDepartment = true;
    let matchStatus = true;
    let matchDate = true;
    
    // Kiểm tra điều kiện tìm kiếm
    if (searchTerm) {
      matchSearch = 
        major.ma_nganh.toLowerCase().includes(searchTerm) || 
        major.ten_nganh.toLowerCase().includes(searchTerm) ||
        major.ten_phong_khoa.toLowerCase().includes(searchTerm);
    }
    
    // Kiểm tra điều kiện khoa
    if (departmentId) {
      matchDepartment = major.phong_khoa_id == departmentId;
    }
    
    // Kiểm tra điều kiện trạng thái
    if (status !== '') {
      matchStatus = major.status == status;
    }
    
    // Kiểm tra điều kiện ngày tạo
    if (dateFilter) {
      const filterDate = new Date(dateFilter);
      const createdDate = new Date(major.created_at);
      
      matchDate = filterDate.getFullYear() === createdDate.getFullYear() &&
                  filterDate.getMonth() === createdDate.getMonth() &&
                  filterDate.getDate() === createdDate.getDate();
    }
    
    return matchSearch && matchDepartment && matchStatus && matchDate;
  });
  
  // Cập nhật hiển thị
  currentPage = 1;
  updateTotalCount();
  renderTable();
  setupPagination();
}

// Đặt lại bộ lọc
function resetFilters() {
  // Đặt lại các trường lọc
  document.getElementById('search').value = '';
  document.getElementById('filter-department').value = '';
  document.getElementById('filter-status').value = '';
  document.getElementById('filter-date').value = '';
  
  // Cập nhật lại danh sách đã lọc
  filteredMajors = [...allMajors];
  
  // Cập nhật hiển thị
  currentPage = 1;
  updateTotalCount();
  renderTable();
  setupPagination();
}

// Render bảng dữ liệu
function renderTable() {
  const tableBody = document.querySelector('#majorsTable tbody');
  if (!tableBody) return;
  
  // Xóa nội dung hiện tại
  tableBody.innerHTML = '';
  
  // Tính toán phân trang
  const start = (currentPage - 1) * pageSize;
  const end = Math.min(start + pageSize, filteredMajors.length);
  const paginatedData = filteredMajors.slice(start, end);
  
  // Kiểm tra nếu không có dữ liệu
  if (paginatedData.length === 0) {
    const emptyRow = document.createElement('tr');
    emptyRow.innerHTML = `
      <td colspan="7" class="px-6 py-10 text-center text-gray-500">
        <i class="ri-inbox-line text-4xl mb-3"></i>
        <p>Không tìm thấy dữ liệu ngành đào tạo.</p>
      </td>
    `;
    tableBody.appendChild(emptyRow);
    return;
  }
  
  // Render dữ liệu
  paginatedData.forEach((major, index) => {
    const row = document.createElement('tr');
    row.className = 'hover:bg-gray-50';
    
    // Format ngày tạo
    const createdDate = major.created_at ? formatDate(major.created_at) : 'N/A';
    
    // Trạng thái hiển thị
    const statusClass = major.status == 1 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
    const statusText = major.status == 1 ? 'Hoạt động' : 'Không hoạt động';
    
    row.innerHTML = `
      <td class="px-6 py-4 text-sm text-gray-900">${start + index + 1}</td>
      <td class="px-6 py-4 text-sm font-medium text-gray-900">${major.ma_nganh}</td>
      <td class="px-6 py-4 text-sm text-gray-900">${major.ten_nganh}</td>
      <td class="px-6 py-4 text-sm text-gray-900">${major.ten_phong_khoa}</td>
      <td class="px-6 py-4 text-sm">
        <span class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClass}">
          ${statusText}
        </span>
      </td>
      <td class="px-6 py-4 text-sm text-gray-500">${createdDate}</td>
      <td class="px-6 py-4 text-right text-sm font-medium">
        <button class="edit-btn text-blue-600 hover:text-blue-900 mr-3" data-id="${major.nganh_id}">
          <i class="ri-edit-line text-lg"></i>
        </button>
        <button class="delete-btn text-red-600 hover:text-red-900" data-id="${major.nganh_id}">
          <i class="ri-delete-bin-line text-lg"></i>
        </button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

// Thiết lập phân trang
function setupPagination() {
  const paginationElement = document.querySelector('.pagination ul');
  if (!paginationElement) return;
  
  // Tính tổng số trang
  totalPages = Math.ceil(filteredMajors.length / pageSize);
  
  // Xóa phân trang hiện tại
  paginationElement.innerHTML = '';
  
  // Không hiển thị phân trang nếu chỉ có 1 trang
  if (totalPages <= 1) return;
  
  // Nút First
  const firstButton = createPaginationButton('«', 1, currentPage === 1);
  firstButton.classList.add('btn-first');
  paginationElement.appendChild(firstButton);
  
  // Nút Previous
  const prevButton = createPaginationButton('‹', currentPage - 1, currentPage === 1);
  prevButton.classList.add('btn-prev');
  paginationElement.appendChild(prevButton);
  
  // Các nút số trang
  let startPage = Math.max(1, currentPage - 2);
  let endPage = Math.min(totalPages, startPage + 4);
  
  if (endPage - startPage < 4) {
    startPage = Math.max(1, endPage - 4);
  }
  
  for (let i = startPage; i <= endPage; i++) {
    const pageButton = createPaginationButton(i, i, false, i === currentPage);
    paginationElement.appendChild(pageButton);
  }
  
  // Nút Next
  const nextButton = createPaginationButton('›', currentPage + 1, currentPage === totalPages);
  nextButton.classList.add('btn-next');
  paginationElement.appendChild(nextButton);
  
  // Nút Last
  const lastButton = createPaginationButton('»', totalPages, currentPage === totalPages);
  lastButton.classList.add('btn-last');
  paginationElement.appendChild(lastButton);
}

// Tạo nút phân trang
function createPaginationButton(text, page, disabled = false, active = false) {
  const li = document.createElement('li');
  
  const button = document.createElement('button');
  button.textContent = text;
  button.dataset.page = page;
  
  button.className = 'px-3 py-1 rounded border';
  
  if (active) {
    button.className += ' bg-primary text-white border-primary';
  } else {
    button.className += ' bg-white text-gray-700 border-gray-300 hover:bg-gray-50';
  }
  
  if (disabled) {
    button.disabled = true;
    button.className += ' opacity-50 cursor-not-allowed';
  } else {
    button.addEventListener('click', function() {
      currentPage = parseInt(page);
      renderTable();
      setupPagination();
    });
  }
  
  li.appendChild(button);
  return li;
}

// Format date
function formatDate(dateString) {
  if (!dateString) return 'N/A';
  
  const options = { 
    year: 'numeric', 
    month: '2-digit', 
    day: '2-digit', 
    hour: '2-digit', 
    minute: '2-digit'
  };
  
  return new Date(dateString).toLocaleDateString('vi-VN', options);
}
