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
  const formTitle = document.getElementById('form-title');
  const editYearForm = document.getElementById('edit-year-form');
  const yearIdInput = document.getElementById('year-id');
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

  // Hiển thị thông tin năm học trong form
  const populateForm = (year) => {
    if (!year) {
      console.error('Không tìm thấy thông tin năm học');
      return;
    }

    // Cập nhật tiêu đề form
    formTitle.textContent = `Chỉnh sửa năm học: ${year.TenNH}`;

    // Điền thông tin vào form
    yearIdInput.value = year.MaNH;
    yearNameInput.value = year.TenNH;
    yearStartInput.value = year.NamBatDau;
    yearEndInput.value = year.NamKetThuc;
    yearStatusSelect.value = year.TrangThai;
  };

  // Cập nhật năm học
  const updateYear = (formData) => {
    // Lấy thông tin từ form
    const yearId = parseInt(formData.get('year-id'), 10) || currentYearId;
    const yearData = {
      MaNH: yearId,
      TenNH: formData.get('year-name'),
      NamBatDau: parseInt(formData.get('year-start'), 10),
      NamKetThuc: parseInt(formData.get('year-end'), 10),
      TrangThai: parseInt(formData.get('year-status'), 10),
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

    // Cập nhật dữ liệu
    const index = academicYearsMockData.findIndex(y => y.MaNH === yearId);
    if (index !== -1) {
      academicYearsMockData[index] = { ...academicYearsMockData[index], ...yearData };
      console.log('Đã cập nhật năm học:', academicYearsMockData[index]);
      return true;
    } else {
      console.error('Không tìm thấy năm học để cập nhật');
      return false;
    }
  };

  // --- Event Listeners ---

  // Form submit handler
  if (editYearForm) {
    editYearForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const formData = new FormData(editYearForm);
      const success = updateYear(formData);
      
      if (success) {
        alert('Cập nhật năm học thành công!');
        
        // Chuyển về trang chi tiết
        const yearId = currentYearId || parseInt(yearIdInput.value, 10);
        window.location.href = `academic-year-detail.html?id=${yearId}`;
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
  
  // Lấy ID năm học từ URL và hiển thị thông tin
  const init = () => {
    currentYearId = getYearIdFromUrl();
    
    if (!currentYearId) {
      console.error('Không tìm thấy ID năm học trong URL');
      alert('Lỗi: Không tìm thấy thông tin năm học để chỉnh sửa.');
      // Chuyển về trang danh sách
      window.location.href = 'academic-years.html';
      return;
    }
    
    currentYear = getYearById(currentYearId);
    
    if (!currentYear) {
      console.error('Không tìm thấy thông tin năm học với ID:', currentYearId);
      alert('Lỗi: Không tìm thấy thông tin năm học để chỉnh sửa.');
      // Chuyển về trang danh sách
      window.location.href = 'academic-years.html';
      return;
    }
    
    populateForm(currentYear);
  };
  
  init();
}); 