// Initialize AOS
AOS.init({
  duration: 800,
  once: true
});

document.addEventListener('DOMContentLoaded', function() {
  // State variables
  let currentYearId = null;
  let currentYear = null;

  // DOM Elements
  const sidebar = document.getElementById('sidebar');
  const sidebarBackdrop = document.getElementById('sidebar-backdrop');
  const sidebarOpenBtn = document.getElementById('sidebar-open');
  const sidebarCloseBtn = document.getElementById('sidebar-close');
  const userMenuButton = document.getElementById('user-menu-button');
  const userMenu = document.getElementById('user-menu');
  const yearTitle = document.getElementById('year-title');
  const yearId = document.getElementById('year-id');
  const yearStart = document.getElementById('year-start');
  const yearEnd = document.getElementById('year-end');
  const yearName = document.getElementById('year-name');
  const yearStatus = document.getElementById('year-status');
  const yearStatusContainer = document.getElementById('year-status-container');
  const editYearBtn = document.getElementById('edit-year-btn');
  const deleteBtn = document.getElementById('delete-btn');
  const semesterTableBody = document.getElementById('semester-table-body');
  const eventTableBody = document.getElementById('event-table-body');
  const semesterCount = document.getElementById('semester-count');
  const eventCount = document.getElementById('event-count');
  const createdDate = document.getElementById('created-date');
  const updatedDate = document.getElementById('updated-date');

  // --- Mock Data ---
  const academicYearsMockData = [
    { 
      MaNH: 1, 
      TenNH: 'Năm học 2023-2024', 
      NamBatDau: 2023, 
      NamKetThuc: 2024, 
      TrangThai: 1,
      NgayTao: '2023-05-10',
      NgayCapNhat: '2023-07-25'
    },
    { 
      MaNH: 2, 
      TenNH: 'Năm học 2022-2023', 
      NamBatDau: 2022, 
      NamKetThuc: 2023, 
      TrangThai: 1,
      NgayTao: '2022-05-15',
      NgayCapNhat: '2022-08-20'
    },
    { 
      MaNH: 3, 
      TenNH: 'Năm học 2021-2022', 
      NamBatDau: 2021, 
      NamKetThuc: 2022, 
      TrangThai: 1,
      NgayTao: '2021-05-12',
      NgayCapNhat: '2021-07-30'
    },
    { 
      MaNH: 4, 
      TenNH: 'Năm học 2020-2021', 
      NamBatDau: 2020, 
      NamKetThuc: 2021, 
      TrangThai: 0,
      NgayTao: '2020-05-10',
      NgayCapNhat: '2020-08-05'
    },
    { 
      MaNH: 5, 
      TenNH: 'Năm học 2019-2020', 
      NamBatDau: 2019, 
      NamKetThuc: 2020, 
      TrangThai: 0,
      NgayTao: '2019-05-15',
      NgayCapNhat: '2019-07-20'
    }
  ];

  // Dữ liệu mẫu về học kỳ
  const semestersMockData = [
    { MaHK: 1, TenHK: 'Học kỳ 1 (2023-2024)', NgayBatDau: '2023-08-15', NgayKetThuc: '2023-12-31', TrangThai: 1, MaNH: 1 },
    { MaHK: 2, TenHK: 'Học kỳ 2 (2023-2024)', NgayBatDau: '2024-01-15', NgayKetThuc: '2024-05-31', TrangThai: 0, MaNH: 1 },
    { MaHK: 3, TenHK: 'Học kỳ 1 (2022-2023)', NgayBatDau: '2022-08-15', NgayKetThuc: '2022-12-31', TrangThai: 0, MaNH: 2 },
    { MaHK: 4, TenHK: 'Học kỳ 2 (2022-2023)', NgayBatDau: '2023-01-15', NgayKetThuc: '2023-05-31', TrangThai: 0, MaNH: 2 },
    { MaHK: 5, TenHK: 'Học kỳ 1 (2021-2022)', NgayBatDau: '2021-08-15', NgayKetThuc: '2021-12-31', TrangThai: 0, MaNH: 3 },
    { MaHK: 6, TenHK: 'Học kỳ 2 (2021-2022)', NgayBatDau: '2022-01-15', NgayKetThuc: '2022-05-31', TrangThai: 0, MaNH: 3 }
  ];

  // Dữ liệu mẫu về sự kiện
  const eventsMockData = [
    { MaSK: 101, TenSK: 'Lễ khai giảng 2023-2024', ThoiGian: '2023-08-20 08:00', DiaDiem: 'Hội trường A', SoLuongThamGia: 500, MaNH: 1 },
    { MaSK: 102, TenSK: 'Hội nghị sinh viên 2023', ThoiGian: '2023-09-15 14:00', DiaDiem: 'Hội trường B', SoLuongThamGia: 300, MaNH: 1 },
    { MaSK: 103, TenSK: 'Chào tân sinh viên K23', ThoiGian: '2023-10-05 09:30', DiaDiem: 'Sân vận động', SoLuongThamGia: 450, MaNH: 1 },
    { MaSK: 104, TenSK: 'Lễ khai giảng 2022-2023', ThoiGian: '2022-08-22 08:00', DiaDiem: 'Hội trường A', SoLuongThamGia: 480, MaNH: 2 },
    { MaSK: 105, TenSK: 'Hội nghị sinh viên 2022', ThoiGian: '2022-09-18 14:00', DiaDiem: 'Hội trường B', SoLuongThamGia: 280, MaNH: 2 }
  ];

  // --- UI Interactions ---

  // Sidebar toggle
  if (sidebarOpenBtn && sidebar && sidebarBackdrop && sidebarCloseBtn) {
    sidebarOpenBtn.addEventListener('click', () => {
      sidebar.classList.remove('-translate-x-full');
      sidebarBackdrop.classList.remove('hidden');
    });
    sidebarCloseBtn.addEventListener('click', () => {
      sidebar.classList.add('-translate-x-full');
      sidebarBackdrop.classList.add('hidden');
    });
    sidebarBackdrop.addEventListener('click', () => {
      sidebar.classList.add('-translate-x-full');
      sidebarBackdrop.classList.add('hidden');
    });
  }

  // User menu toggle
  if (userMenuButton && userMenu) {
    function handleClickOutside(event) {
      if (userMenu && !userMenu.contains(event.target) && !userMenuButton.contains(event.target)) {
        userMenu.classList.add('opacity-0', 'invisible', 'scale-95');
        userMenu.classList.remove('opacity-100', 'visible', 'scale-100');
        document.removeEventListener('click', handleClickOutside);
      }
    }
    userMenuButton.addEventListener('click', (event) => {
      event.stopPropagation();
      const isVisible = userMenu.classList.contains('opacity-100');
      if (isVisible) {
        userMenu.classList.add('opacity-0', 'invisible', 'scale-95');
        userMenu.classList.remove('opacity-100', 'visible', 'scale-100');
        document.removeEventListener('click', handleClickOutside);
      } else {
        userMenu.classList.remove('opacity-0', 'invisible', 'scale-95');
        userMenu.classList.add('opacity-100', 'visible', 'scale-100');
        setTimeout(() => document.addEventListener('click', handleClickOutside), 0);
      }
    });
  }

  // --- Functions ---

  // Lấy ID từ query parameter
  const getYearIdFromUrl = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    return id ? parseInt(id, 10) : null;
  };

  // Lấy thông tin năm học từ ID
  const getYearById = (id) => {
    return academicYearsMockData.find(year => year.MaNH === id);
  };

  // Lấy danh sách học kỳ của năm học
  const getSemestersByYearId = (yearId) => {
    return semestersMockData.filter(semester => semester.MaNH === yearId);
  };

  // Lấy danh sách sự kiện của năm học
  const getEventsByYearId = (yearId) => {
    return eventsMockData.filter(event => event.MaNH === yearId);
  };

  // Hiển thị thông tin năm học
  const displayYearDetails = (year) => {
    if (!year) {
      console.error('Không tìm thấy thông tin năm học');
      return;
    }

    // Cập nhật tiêu đề và các trường thông tin
    yearName.textContent = `Chi tiết năm học: ${year.TenNH}`;
    yearTitle.textContent = year.TenNH;
    yearId.textContent = year.MaNH;
    yearStart.textContent = year.NamBatDau;
    yearEnd.textContent = year.NamKetThuc;

    // Cập nhật trạng thái
    if (year.TrangThai === 1) {
      yearStatus.textContent = 'Hoạt động';
      yearStatus.className = 'px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800';
    } else {
      yearStatus.textContent = 'Không hoạt động';
      yearStatus.className = 'px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800';
    }

    // Cập nhật nút chỉnh sửa
    editYearBtn.href = `academic-year-edit.html?id=${year.MaNH}`;

    // Cập nhật thông tin bổ sung
    const yearSemesters = getSemestersByYearId(year.MaNH);
    const yearEvents = getEventsByYearId(year.MaNH);
    
    semesterCount.textContent = yearSemesters.length;
    eventCount.textContent = yearEvents.length;
    
    createdDate.textContent = formatDate(year.NgayTao);
    updatedDate.textContent = formatDate(year.NgayCapNhat);

    // Hiển thị danh sách học kỳ
    displaySemesters(yearSemesters);
    
    // Hiển thị danh sách sự kiện
    displayEvents(yearEvents);
  };

  // Hiển thị danh sách học kỳ
  const displaySemesters = (semesters) => {
    semesterTableBody.innerHTML = '';
    
    if (!semesters || semesters.length === 0) {
      semesterTableBody.innerHTML = `
        <tr>
          <td colspan="5" class="text-center py-4 text-gray-500 text-sm">
            Không có dữ liệu học kỳ
          </td>
        </tr>
      `;
      return;
    }

    semesters.forEach(semester => {
      const row = document.createElement('tr');
      row.className = 'hover:bg-gray-50';
      
      // Định dạng trạng thái
      const statusClass = semester.TrangThai === 1 
        ? 'bg-green-100 text-green-800' 
        : 'bg-gray-100 text-gray-800';
      const statusText = semester.TrangThai === 1 
        ? 'Hoạt động' 
        : 'Không hoạt động';
      
      row.innerHTML = `
        <td class="px-4 py-3 text-sm text-gray-700">${semester.MaHK}</td>
        <td class="px-4 py-3 text-sm font-medium text-gray-900">${semester.TenHK}</td>
        <td class="px-4 py-3 text-sm text-gray-600">${formatDate(semester.NgayBatDau)}</td>
        <td class="px-4 py-3 text-sm text-gray-600">${formatDate(semester.NgayKetThuc)}</td>
        <td class="px-4 py-3 text-sm">
          <span class="px-2 py-1 rounded-full text-xs font-medium ${statusClass}">
            ${statusText}
          </span>
        </td>
      `;
      
      semesterTableBody.appendChild(row);
    });
  };

  // Hiển thị danh sách sự kiện
  const displayEvents = (events) => {
    eventTableBody.innerHTML = '';
    
    if (!events || events.length === 0) {
      eventTableBody.innerHTML = `
        <tr>
          <td colspan="5" class="text-center py-4 text-gray-500 text-sm">
            Không có dữ liệu sự kiện
          </td>
        </tr>
      `;
      return;
    }

    events.forEach(event => {
      const row = document.createElement('tr');
      row.className = 'hover:bg-gray-50';
      
      row.innerHTML = `
        <td class="px-4 py-3 text-sm text-gray-700">${event.MaSK}</td>
        <td class="px-4 py-3 text-sm font-medium text-gray-900">${event.TenSK}</td>
        <td class="px-4 py-3 text-sm text-gray-600">${formatDateTime(event.ThoiGian)}</td>
        <td class="px-4 py-3 text-sm text-gray-600">${event.DiaDiem}</td>
        <td class="px-4 py-3 text-sm text-gray-600">${event.SoLuongThamGia}</td>
      `;
      
      eventTableBody.appendChild(row);
    });
  };

  // Xử lý xóa năm học
  const handleDeleteYear = () => {
    if (!currentYear) return;
    
    if (confirm(`Bạn có chắc chắn muốn xóa năm học "${currentYear.TenNH}" không?`)) {
      alert('Đã xóa năm học thành công!');
      window.location.href = 'academic-years.html';
    }
  };

  // --- Helper Functions ---
  
  // Định dạng ngày tháng từ chuỗi YYYY-MM-DD
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    
    // Nếu chỉ có ngày, không có giờ
    if (dateString.length === 10) {
      const [year, month, day] = dateString.split('-');
      return `${day}/${month}/${year}`;
    }
    
    // Nếu có cả ngày và giờ
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    
    return `${day}/${month}/${year}`;
  };
  
  // Định dạng ngày giờ
  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return '-';
    
    // Xử lý trường hợp chuỗi đã định dạng sẵn (như "2023-08-20 08:00")
    const parts = dateTimeString.split(' ');
    if (parts.length === 2) {
      const datePart = formatDate(parts[0]);
      return `${datePart} ${parts[1]}`;
    }
    
    // Trường hợp chuỗi datetime thông thường
    const date = new Date(dateTimeString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  // --- Event Listeners ---
  
  if (deleteBtn) {
    deleteBtn.addEventListener('click', handleDeleteYear);
  }

  // --- Initialization ---
  
  // Lấy ID năm học từ URL và hiển thị thông tin
  const init = () => {
    currentYearId = getYearIdFromUrl();
    
    if (!currentYearId) {
      console.error('Không tìm thấy ID năm học trong URL');
      alert('Lỗi: Không tìm thấy thông tin năm học.');
      return;
    }
    
    currentYear = getYearById(currentYearId);
    
    if (!currentYear) {
      console.error('Không tìm thấy thông tin năm học với ID:', currentYearId);
      alert('Lỗi: Không tìm thấy thông tin năm học.');
      return;
    }
    
    displayYearDetails(currentYear);
  };
  
  init();
}); 