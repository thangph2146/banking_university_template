// Khởi tạo AOS
AOS.init();

// Khởi tạo các biến trạng thái
let allMajors = [];
let filteredMajors = [];

// Biến pagination
const paginationState = {
  currentPage: 1,
  itemsPerPage: 10,
  totalPages: 1
};

// Sự kiện khi DOM đã tải
document.addEventListener('DOMContentLoaded', function() {
  // Xử lý sidebar
  const sidebarOpen = document.getElementById('sidebar-open');
  const sidebarClose = document.getElementById('sidebar-close');
  const sidebar = document.getElementById('sidebar');
  const sidebarBackdrop = document.getElementById('sidebar-backdrop');

  if (sidebarOpen) {
    sidebarOpen.addEventListener('click', () => {
      sidebar.classList.remove('-translate-x-full');
      sidebarBackdrop.classList.remove('hidden');
    });
  }

  if (sidebarClose) {
    sidebarClose.addEventListener('click', () => {
      sidebar.classList.add('-translate-x-full');
      sidebarBackdrop.classList.add('hidden');
    });
  }

  if (sidebarBackdrop) {
    sidebarBackdrop.addEventListener('click', () => {
      sidebar.classList.add('-translate-x-full');
      sidebarBackdrop.classList.add('hidden');
    });
  }

  // User Menu Toggle
  const userMenu = document.querySelector('.group button');
  const userMenuDropdown = document.querySelector('.group div.hidden');

  if (userMenu && userMenuDropdown) {
    userMenu.addEventListener('click', () => {
      userMenuDropdown.classList.toggle('hidden');
    });

    document.addEventListener('click', (e) => {
      if (!userMenu.contains(e.target) && !userMenuDropdown.contains(e.target)) {
        userMenuDropdown.classList.add('hidden');
      }
    });
  }

  // Modal xử lý
  const createMajorBtn = document.getElementById('create-major-btn');

  function openMajorModal() {
    const modal = document.getElementById('major-modal');
    if (modal) {
      modal.classList.remove('hidden');
    }
  }

  window.closeMajorModal = function() {
    const modal = document.getElementById('major-modal');
    if (modal) {
      modal.classList.add('hidden');
      // Reset form
      document.getElementById('major-form').reset();
    }
  };

  if (createMajorBtn) {
    createMajorBtn.addEventListener('click', openMajorModal);
  }

  // Form xử lý
  const majorForm = document.getElementById('major-form');
  if (majorForm) {
    majorForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Lấy dữ liệu từ form
      const tenNganh = document.getElementById('ten_nganh').value;
      const maNganh = document.getElementById('ma_nganh').value;
      const phongKhoaId = document.getElementById('phong_khoa_id').value;
      const status = document.getElementById('status').value;
      
      // Kiểm tra mã ngành đã tồn tại chưa
      if (allMajors.some(m => m.ma_nganh === maNganh)) {
        alert('Mã ngành đã tồn tại! Vui lòng chọn mã khác.');
        return;
      }
      
      // Thêm ngành mới vào danh sách
      const newMajor = {
        nganh_id: allMajors.length + 1,
        ten_nganh: tenNganh,
        ma_nganh: maNganh,
        phong_khoa_id: phongKhoaId,
        phong_khoa_ten: getPhongKhoaName(phongKhoaId),
        status: status,
        created_at: new Date().toISOString().slice(0, 19).replace('T', ' ')
      };
      
      allMajors.unshift(newMajor);
      applyFilters();
      
      alert('Ngành đào tạo đã được thêm thành công!');
      closeMajorModal();
    });
  }

  // Lấy tên phòng khoa từ ID
  function getPhongKhoaName(id) {
    const phongKhoa = {
      '1': 'Công nghệ thông tin',
      '2': 'Kế toán - Quản trị',
      '3': 'Ngôn ngữ học',
      '4': 'Tài chính - Ngân hàng'
    };
    return phongKhoa[id] || 'Chưa phân công';
  }

  // Dữ liệu mẫu cho 20 ngành đào tạo
  allMajors = [
    {
      nganh_id: 1,
      ten_nganh: "Công nghệ thông tin",
      ma_nganh: "7480201",
      phong_khoa_id: "1",
      phong_khoa_ten: "Công nghệ thông tin",
      status: "1",
      created_at: "2023-01-15 08:30:00"
    },
    {
      nganh_id: 2,
      ten_nganh: "Kỹ thuật phần mềm",
      ma_nganh: "7480103",
      phong_khoa_id: "1",
      phong_khoa_ten: "Công nghệ thông tin",
      status: "1",
      created_at: "2023-01-16 09:15:00"
    },
    {
      nganh_id: 3,
      ten_nganh: "Hệ thống thông tin",
      ma_nganh: "7480104",
      phong_khoa_id: "1",
      phong_khoa_ten: "Công nghệ thông tin",
      status: "1",
      created_at: "2023-01-17 10:45:00"
    },
    {
      nganh_id: 4,
      ten_nganh: "Khoa học máy tính",
      ma_nganh: "7480101",
      phong_khoa_id: "1",
      phong_khoa_ten: "Công nghệ thông tin",
      status: "0",
      created_at: "2023-01-18 11:30:00"
    },
    {
      nganh_id: 5,
      ten_nganh: "Kế toán",
      ma_nganh: "7340301",
      phong_khoa_id: "2",
      phong_khoa_ten: "Kế toán - Quản trị",
      status: "1",
      created_at: "2023-02-01 09:00:00"
    },
    {
      nganh_id: 6,
      ten_nganh: "Kiểm toán",
      ma_nganh: "7340302",
      phong_khoa_id: "2",
      phong_khoa_ten: "Kế toán - Quản trị",
      status: "1",
      created_at: "2023-02-02 09:30:00"
    },
    {
      nganh_id: 7,
      ten_nganh: "Quản trị kinh doanh",
      ma_nganh: "7340101",
      phong_khoa_id: "2",
      phong_khoa_ten: "Kế toán - Quản trị",
      status: "1",
      created_at: "2023-02-03 10:15:00"
    },
    {
      nganh_id: 8,
      ten_nganh: "Marketing",
      ma_nganh: "7340115",
      phong_khoa_id: "2",
      phong_khoa_ten: "Kế toán - Quản trị",
      status: "0",
      created_at: "2023-02-04 11:00:00"
    },
    {
      nganh_id: 9,
      ten_nganh: "Tiếng Anh",
      ma_nganh: "7220201",
      phong_khoa_id: "3",
      phong_khoa_ten: "Ngôn ngữ học",
      status: "1",
      created_at: "2023-03-01 08:45:00"
    },
    {
      nganh_id: 10,
      ten_nganh: "Tiếng Nhật",
      ma_nganh: "7220209",
      phong_khoa_id: "3",
      phong_khoa_ten: "Ngôn ngữ học",
      status: "1",
      created_at: "2023-03-02 09:00:00"
    },
    {
      nganh_id: 11,
      ten_nganh: "Tiếng Hàn",
      ma_nganh: "7220210",
      phong_khoa_id: "3",
      phong_khoa_ten: "Ngôn ngữ học",
      status: "1",
      created_at: "2023-03-03 10:30:00"
    },
    {
      nganh_id: 12,
      ten_nganh: "Tiếng Trung",
      ma_nganh: "7220204",
      phong_khoa_id: "3",
      phong_khoa_ten: "Ngôn ngữ học",
      status: "0",
      created_at: "2023-03-04 11:15:00"
    },
    {
      nganh_id: 13,
      ten_nganh: "Tài chính - Ngân hàng",
      ma_nganh: "7340201",
      phong_khoa_id: "4",
      phong_khoa_ten: "Tài chính - Ngân hàng",
      status: "1",
      created_at: "2023-04-01 08:00:00"
    },
    {
      nganh_id: 14,
      ten_nganh: "Bảo hiểm",
      ma_nganh: "7340204",
      phong_khoa_id: "4",
      phong_khoa_ten: "Tài chính - Ngân hàng",
      status: "1",
      created_at: "2023-04-02 09:30:00"
    },
    {
      nganh_id: 15,
      ten_nganh: "Quản trị rủi ro tài chính",
      ma_nganh: "7340205",
      phong_khoa_id: "4",
      phong_khoa_ten: "Tài chính - Ngân hàng",
      status: "1",
      created_at: "2023-04-03 10:45:00"
    },
    {
      nganh_id: 16,
      ten_nganh: "Phân tích đầu tư tài chính",
      ma_nganh: "7340208",
      phong_khoa_id: "4",
      phong_khoa_ten: "Tài chính - Ngân hàng",
      status: "0",
      created_at: "2023-04-04 11:30:00"
    },
    {
      nganh_id: 17,
      ten_nganh: "An toàn thông tin",
      ma_nganh: "7480202",
      phong_khoa_id: "1",
      phong_khoa_ten: "Công nghệ thông tin",
      status: "1",
      created_at: "2023-05-01 08:15:00"
    },
    {
      nganh_id: 18,
      ten_nganh: "Thương mại điện tử",
      ma_nganh: "7340122",
      phong_khoa_id: "2",
      phong_khoa_ten: "Kế toán - Quản trị",
      status: "1",
      created_at: "2023-05-02 09:20:00"
    },
    {
      nganh_id: 19,
      ten_nganh: "Ngôn ngữ học",
      ma_nganh: "7229020",
      phong_khoa_id: "3",
      phong_khoa_ten: "Ngôn ngữ học",
      status: "1",
      created_at: "2023-05-03 10:45:00"
    },
    {
      nganh_id: 20,
      ten_nganh: "Đầu tư chứng khoán",
      ma_nganh: "7340207",
      phong_khoa_id: "4",
      phong_khoa_ten: "Tài chính - Ngân hàng",
      status: "1",
      created_at: "2023-05-04 11:30:00"
    }
  ];

  // Hàm lọc ngành đào tạo
  function applyFilters() {
    const searchInput = document.getElementById('filter-search').value.toLowerCase();
    const departmentFilter = document.getElementById('filter-department').value;
    const statusFilter = document.getElementById('filter-status').value;
    
    filteredMajors = allMajors.filter(major => {
      // Kiểm tra tìm kiếm
      const searchMatch = 
        major.ten_nganh.toLowerCase().includes(searchInput) || 
        major.ma_nganh.toLowerCase().includes(searchInput);
        
      // Kiểm tra phòng khoa
      const departmentMatch = !departmentFilter || major.phong_khoa_id === departmentFilter;
      
      // Kiểm tra trạng thái
      const statusMatch = !statusFilter || major.status === statusFilter;
      
      return searchMatch && departmentMatch && statusMatch;
    });
    
    // Cập nhật phân trang
    paginationState.currentPage = 1;
    updatePagination();
    
    // Render bảng với dữ liệu đã lọc
    renderTable();
  }

  // Cập nhật trạng thái phân trang
  function updatePagination() {
    const totalItems = filteredMajors.length;
    paginationState.totalPages = Math.max(1, Math.ceil(totalItems / paginationState.itemsPerPage));
    
    // Điều chỉnh trang hiện tại nếu vượt quá tổng số trang
    if (paginationState.currentPage > paginationState.totalPages) {
      paginationState.currentPage = paginationState.totalPages;
    }
    
    // Cập nhật UI phân trang
    const currentPageInput = document.getElementById('current-page-input');
    const totalPagesCount = document.getElementById('total-pages-count');
    const totalItemsCount = document.getElementById('total-items-count');
    const btnFirst = document.querySelector('.btn-first');
    const btnPrev = document.querySelector('.btn-prev');
    const btnNext = document.querySelector('.btn-next');
    const btnLast = document.querySelector('.btn-last');
    
    if (currentPageInput) currentPageInput.value = paginationState.currentPage;
    if (totalPagesCount) totalPagesCount.textContent = paginationState.totalPages;
    if (totalItemsCount) totalItemsCount.textContent = totalItems;
    
    // Cập nhật trạng thái nút
    if (btnFirst) btnFirst.disabled = paginationState.currentPage === 1;
    if (btnPrev) btnPrev.disabled = paginationState.currentPage === 1;
    if (btnNext) btnNext.disabled = paginationState.currentPage === paginationState.totalPages;
    if (btnLast) btnLast.disabled = paginationState.currentPage === paginationState.totalPages;
  }

  // Render dữ liệu vào bảng
  function renderTable() {
    const tableBody = document.getElementById('majors-table-body');
    if (!tableBody) return;
    
    const startIndex = (paginationState.currentPage - 1) * paginationState.itemsPerPage;
    const endIndex = Math.min(startIndex + paginationState.itemsPerPage, filteredMajors.length);
    const displayedMajors = filteredMajors.slice(startIndex, endIndex);
    
    // Kiểm tra nếu không có dữ liệu
    if (displayedMajors.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="6" class="px-6 py-4 text-center text-gray-500">
            Không tìm thấy ngành đào tạo nào phù hợp với bộ lọc
          </td>
        </tr>
      `;
      return;
    }
    
    // Nhóm ngành theo phòng khoa
    const majorsByDepartment = {};
    displayedMajors.forEach(major => {
      const deptId = major.phong_khoa_id;
      if (!majorsByDepartment[deptId]) {
        majorsByDepartment[deptId] = {
          name: major.phong_khoa_ten || 'Chưa phân công',
          majors: []
        };
      }
      majorsByDepartment[deptId].majors.push(major);
    });

    // Render dữ liệu theo nhóm
    let html = '';
    
    Object.keys(majorsByDepartment).forEach(deptId => {
      const department = majorsByDepartment[deptId];
      
      // Header cho mỗi phòng khoa
      html += `
        <tr class="bg-gray-50">
          <td colspan="6" class="px-6 py-3">
            <div class="flex items-center font-semibold text-gray-700">
              <i class="ri-building-line mr-2 text-primary"></i>
              Phòng/Khoa: ${department.name}
              <span class="ml-2 text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                ${department.majors.length} ngành
              </span>
            </div>
          </td>
        </tr>
      `;
      
      // Dữ liệu của các ngành trong phòng khoa
      department.majors.forEach(major => {
        html += `
          <tr>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm font-medium text-gray-900">${major.ma_nganh}</div>
            </td>
            <td class="px-6 py-4">
              <div class="text-sm font-medium text-gray-900">${major.ten_nganh}</div>
            </td>
            <td class="px-6 py-4">
              <div class="text-sm text-gray-900">${major.phong_khoa_ten || 'Chưa phân công'}</div>
            </td>
            <td class="px-6 py-4">
              <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                ${major.status === '1' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
                ${major.status === '1' ? 'Hoạt động' : 'Không hoạt động'}
              </span>
            </td>
            <td class="px-6 py-4 text-sm text-gray-500">
              ${formatDate(major.created_at)}
            </td>
            <td class="px-6 py-4 text-right text-sm font-medium">
              <div class="flex justify-end space-x-2">
                <button onclick="viewMajor(${major.nganh_id})" class="text-blue-600 hover:text-blue-900" title="Xem chi tiết">
                  <i class="ri-eye-line"></i>
                </button>
                <button onclick="editMajor(${major.nganh_id})" class="text-green-600 hover:text-green-900" title="Chỉnh sửa">
                  <i class="ri-edit-line"></i>
                </button>
                <button onclick="deleteMajor(${major.nganh_id})" class="text-red-600 hover:text-red-900" title="Xóa">
                  <i class="ri-delete-bin-line"></i>
                </button>
              </div>
            </td>
          </tr>
        `;
      });
    });
    
    tableBody.innerHTML = html;
  }

  // Định dạng ngày
  function formatDate(dateString) {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('vi-VN', options);
  }
  
  // Các hàm xử lý ngành đào tạo
  window.viewMajor = function(majorId) {
    const major = allMajors.find(m => m.nganh_id === majorId);
    if (major) {
      alert(`Xem chi tiết ngành đào tạo: ${major.ten_nganh} (${major.ma_nganh})`);
      // Thực hiện chuyển hướng hoặc hiển thị modal chi tiết
    }
  };
  
  window.editMajor = function(majorId) {
    const major = allMajors.find(m => m.nganh_id === majorId);
    if (major) {
      // Cập nhật tiêu đề modal
      document.querySelector('#major-modal h3').textContent = 'Cập nhật ngành đào tạo';
      
      // Điền dữ liệu vào form
      document.getElementById('ten_nganh').value = major.ten_nganh;
      document.getElementById('ma_nganh').value = major.ma_nganh;
      document.getElementById('phong_khoa_id').value = major.phong_khoa_id;
      document.getElementById('status').value = major.status;
      
      // Thêm ID ngành vào form để xác định khi submit
      const form = document.getElementById('major-form');
      form.dataset.majorId = majorId;
      
      // Mở modal
      openMajorModal();
      
      // Ghi đè sự kiện submit form
      form.onsubmit = function(e) {
        e.preventDefault();
        
        // Cập nhật thông tin ngành
        const index = allMajors.findIndex(m => m.nganh_id === majorId);
        if (index !== -1) {
          allMajors[index].ten_nganh = document.getElementById('ten_nganh').value;
          allMajors[index].ma_nganh = document.getElementById('ma_nganh').value;
          allMajors[index].phong_khoa_id = document.getElementById('phong_khoa_id').value;
          allMajors[index].phong_khoa_ten = getPhongKhoaName(document.getElementById('phong_khoa_id').value);
          allMajors[index].status = document.getElementById('status').value;
          
          // Cập nhật danh sách và đóng modal
          applyFilters();
          alert('Cập nhật ngành đào tạo thành công!');
          closeMajorModal();
          
          // Khôi phục sự kiện mặc định
          form.onsubmit = null;
        }
      };
    }
  };
  
  window.deleteMajor = function(majorId) {
    const major = allMajors.find(m => m.nganh_id === majorId);
    if (major) {
      if (confirm(`Bạn có chắc chắn muốn xóa ngành "${major.ten_nganh}" (${major.ma_nganh})?`)) {
        const index = allMajors.findIndex(m => m.nganh_id === majorId);
        if (index !== -1) {
          allMajors.splice(index, 1);
          applyFilters();
          alert('Đã xóa ngành đào tạo thành công!');
        }
      }
    }
  };

  // Thiết lập các event listeners cho phân trang
  const itemsPerPageSelect = document.getElementById('items-per-page');
  const currentPageInput = document.getElementById('current-page-input');
  const btnFirst = document.querySelector('.btn-first');
  const btnPrev = document.querySelector('.btn-prev');
  const btnNext = document.querySelector('.btn-next');
  const btnLast = document.querySelector('.btn-last');
  
  if (itemsPerPageSelect) {
    itemsPerPageSelect.addEventListener('change', function() {
      paginationState.itemsPerPage = Number(this.value);
      paginationState.currentPage = 1;
      updatePagination();
      renderTable();
    });
  }
  
  if (currentPageInput) {
    currentPageInput.addEventListener('change', function() {
      let newPage = Number(this.value);
      if (newPage < 1) newPage = 1;
      if (newPage > paginationState.totalPages) newPage = paginationState.totalPages;
      
      paginationState.currentPage = newPage;
      updatePagination();
      renderTable();
    });
  }
  
  if (btnFirst) {
    btnFirst.addEventListener('click', function() {
      if (paginationState.currentPage > 1) {
        paginationState.currentPage = 1;
        updatePagination();
        renderTable();
      }
    });
  }
  
  if (btnPrev) {
    btnPrev.addEventListener('click', function() {
      if (paginationState.currentPage > 1) {
        paginationState.currentPage--;
        updatePagination();
        renderTable();
      }
    });
  }
  
  if (btnNext) {
    btnNext.addEventListener('click', function() {
      if (paginationState.currentPage < paginationState.totalPages) {
        paginationState.currentPage++;
        updatePagination();
        renderTable();
      }
    });
  }
  
  if (btnLast) {
    btnLast.addEventListener('click', function() {
      if (paginationState.currentPage < paginationState.totalPages) {
        paginationState.currentPage = paginationState.totalPages;
        updatePagination();
        renderTable();
      }
    });
  }

  // Thiết lập các event listeners cho bộ lọc
  const filterForm = document.getElementById('filter-form');
  const resetFilterBtn = document.getElementById('reset-filter-btn');
  const refreshBtn = document.getElementById('refresh-btn');
  
  if (filterForm) {
    filterForm.addEventListener('submit', function(e) {
      e.preventDefault();
      applyFilters();
    });
  }
  
  if (resetFilterBtn) {
    resetFilterBtn.addEventListener('click', function() {
      document.getElementById('filter-search').value = '';
      document.getElementById('filter-department').value = '';
      document.getElementById('filter-status').value = '';
      applyFilters();
    });
  }
  
  if (refreshBtn) {
    refreshBtn.addEventListener('click', function() {
      // Reset lại dữ liệu từ nguồn (trong trường hợp thực tế sẽ gọi API)
      filteredMajors = [...allMajors];
      document.getElementById('filter-search').value = '';
      document.getElementById('filter-department').value = '';
      document.getElementById('filter-status').value = '';
      paginationState.currentPage = 1;
      updatePagination();
      renderTable();
      updateDashboardCards();
      
      // Thông báo làm mới thành công
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg z-50';
      notification.innerHTML = '<i class="ri-check-line mr-2"></i> Đã làm mới dữ liệu thành công!';
      document.body.appendChild(notification);
      
      // Tự động xóa thông báo sau 3 giây
      setTimeout(() => {
        notification.classList.add('opacity-0', 'transition-opacity', 'duration-500');
        setTimeout(() => {
          document.body.removeChild(notification);
        }, 500);
      }, 3000);
    });
  }

  // Cập nhật thông tin tổng quan
  function updateDashboardCards() {
    // Tổng số ngành
    const totalMajors = allMajors.length;
    document.getElementById('total-majors-count').textContent = totalMajors;
    
    // Số ngành đang hoạt động
    const activeMajors = allMajors.filter(major => major.status === '1').length;
    document.getElementById('active-majors-count').textContent = activeMajors;
    
    // Số ngành ngưng hoạt động
    const inactiveMajors = allMajors.filter(major => major.status === '0').length;
    document.getElementById('inactive-majors-count').textContent = inactiveMajors;
    
    // Số khoa/phòng có ngành
    const departmentsWithMajors = new Set(allMajors.map(major => major.phong_khoa_id));
    document.getElementById('departments-count').textContent = departmentsWithMajors.size;
  }

  // Khởi tạo ban đầu
  filteredMajors = [...allMajors];
  updatePagination();
  renderTable();
  updateDashboardCards();
});
