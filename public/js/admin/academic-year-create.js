// Initialize AOS
AOS.init({
  duration: 800,
  once: true
});

document.addEventListener('DOMContentLoaded', function() {
  // DOM Elements
  const sidebar = document.getElementById('sidebar');
  const sidebarBackdrop = document.getElementById('sidebar-backdrop');
  const sidebarOpenBtn = document.getElementById('sidebar-open');
  const sidebarCloseBtn = document.getElementById('sidebar-close');
  const userMenuButton = document.getElementById('user-menu-button');
  const userMenu = document.getElementById('user-menu');
  const createYearForm = document.getElementById('create-year-form');
  const yearNameInput = document.getElementById('year-name');
  const yearStartInput = document.getElementById('year-start');
  const yearEndInput = document.getElementById('year-end');
  const yearStatusSelect = document.getElementById('year-status');

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

  // Tự động điền năm kết thúc khi người dùng nhập năm bắt đầu
  const autoFillEndYear = () => {
    const startYear = parseInt(yearStartInput.value, 10);
    if (!isNaN(startYear)) {
      yearEndInput.value = startYear + 1;
      
      // Cập nhật tên năm học nếu chưa nhập
      if (!yearNameInput.value) {
        yearNameInput.value = `Năm học ${startYear}-${startYear + 1}`;
      }
    }
  };

  // Tạo năm học mới
  const createNewYear = (formData) => {
    // Lấy thông tin từ form
    const yearData = {
      TenNH: formData.get('year-name'),
      NamBatDau: parseInt(formData.get('year-start'), 10),
      NamKetThuc: parseInt(formData.get('year-end'), 10),
      TrangThai: parseInt(formData.get('year-status'), 10),
      NgayTao: new Date().toISOString().split('T')[0], // Ngày hiện tại
      NgayCapNhat: new Date().toISOString().split('T')[0] // Ngày hiện tại
    };

    // Kiểm tra dữ liệu
    if (!yearData.TenNH || !yearData.NamBatDau || !yearData.NamKetThuc) {
      alert('Vui lòng nhập đầy đủ Tên Năm học, Năm bắt đầu và Năm kết thúc.');
      return false;
    }
    
    if (yearData.NamBatDau >= yearData.NamKetThuc) {
      alert('Năm bắt đầu phải nhỏ hơn Năm kết thúc.');
      return false;
    }

    // Kiểm tra tên năm học đã tồn tại chưa
    const nameExists = academicYearsMockData.some(year => 
      year.TenNH.toLowerCase() === yearData.TenNH.toLowerCase()
    );
    
    if (nameExists) {
      alert('Tên năm học đã tồn tại. Vui lòng chọn tên khác.');
      return false;
    }

    // Tạo ID mới
    yearData.MaNH = academicYearsMockData.length > 0 
      ? Math.max(...academicYearsMockData.map(y => y.MaNH)) + 1 
      : 1;

    // Thêm vào dữ liệu
    academicYearsMockData.push(yearData);
    console.log('Đã thêm năm học mới:', yearData);
    return yearData.MaNH;
  };

  // --- Event Listeners ---

  // Auto-fill năm kết thúc khi nhập năm bắt đầu
  if (yearStartInput) {
    yearStartInput.addEventListener('change', autoFillEndYear);
    yearStartInput.addEventListener('blur', autoFillEndYear);
  }

  // Form submit handler
  if (createYearForm) {
    createYearForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const formData = new FormData(createYearForm);
      const newYearId = createNewYear(formData);
      
      if (newYearId) {
        alert('Thêm năm học mới thành công!');
        
        // Chuyển về trang danh sách
        window.location.href = 'academic-years.html';
      }
    });
  }

  // --- Validation ---
  
  // Kiểm tra quan hệ năm bắt đầu và năm kết thúc
  if (yearStartInput && yearEndInput) {
    const validateYears = () => {
      const startYear = parseInt(yearStartInput.value, 10);
      const endYear = parseInt(yearEndInput.value, 10);
      
      if (startYear && endYear && startYear >= endYear) {
        yearEndInput.setCustomValidity('Năm kết thúc phải lớn hơn năm bắt đầu');
      } else {
        yearEndInput.setCustomValidity('');
      }
    };
    
    yearStartInput.addEventListener('change', validateYears);
    yearEndInput.addEventListener('change', validateYears);
  }

  // --- Initialization ---
  
  // Điền giá trị mặc định: năm hiện tại và năm tiếp theo
  const init = () => {
    const currentYear = new Date().getFullYear();
    yearStartInput.value = currentYear;
    yearEndInput.value = currentYear + 1;
    yearNameInput.value = `Năm học ${currentYear}-${currentYear + 1}`;
    yearStatusSelect.value = "1"; // Mặc định là hoạt động
  };
  
  init();
}); 