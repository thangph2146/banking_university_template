// Initialize AOS
AOS.init({
  duration: 800,
  once: true
});

document.addEventListener('DOMContentLoaded', function() {
  // State variables
  let currentCameraId = null;
  let currentCamera = null;

  // DOM Elements
  const sidebar = document.getElementById('sidebar');
  const sidebarBackdrop = document.getElementById('sidebar-backdrop');
  const sidebarOpenBtn = document.getElementById('sidebar-open');
  const sidebarCloseBtn = document.getElementById('sidebar-close');
  const userMenuButton = document.getElementById('user-menu-button');
  const userMenu = document.getElementById('user-menu');
  const formTitle = document.getElementById('form-title');
  const editCameraForm = document.getElementById('edit-camera-form');
  const cameraIdInput = document.getElementById('camera-id');
  const cameraIdHiddenInput = document.getElementById('camera-id-hidden'); // Hidden input for submission
  const cameraNameInput = document.getElementById('camera-name');
  const cameraIpInput = document.getElementById('camera-ip');
  const cameraPortInput = document.getElementById('camera-port');
  const cameraStatusSelect = document.getElementById('camera-status');
  const cameraDepartmentInput = document.getElementById('camera-department');
  const cancelEditBtn = document.getElementById('cancel-edit-btn');
  const cancelBtnForm = document.getElementById('cancel-btn-form');

  // --- Mock Data ---
  // Note: In a real application, you might fetch this or have it available globally
  const camerasMockData = [
    { id: 1, name: 'Camera Cổng Chính', ip_address: '192.168.1.101', port: 8080, status: 1, phong_khoa_id: null, created_at: '2023-01-15 09:00:00', updated_at: '2024-07-28 10:30:00' },
    { id: 2, name: 'Camera Hành lang A1', ip_address: '192.168.1.102', port: 554, status: 1, phong_khoa_id: 1, created_at: '2023-01-15 09:05:00', updated_at: '2024-07-28 10:30:00' },
    { id: 3, name: 'Camera Hội trường B', ip_address: '192.168.2.50', port: 8080, status: 0, phong_khoa_id: 2, created_at: '2023-02-10 14:00:00', updated_at: '2024-05-15 11:00:00' },
    { id: 4, name: 'Camera Thư viện Tầng 1', ip_address: '10.0.0.15', port: 554, status: 1, phong_khoa_id: 3, created_at: '2023-03-01 08:30:00', updated_at: '2024-07-20 15:00:00' },
    { id: 5, name: 'Camera Sân Vận Động', ip_address: '192.168.1.200', port: 8080, status: 1, phong_khoa_id: null, created_at: '2023-04-20 11:00:00', updated_at: '2024-06-30 16:45:00' },
    { id: 6, name: 'Camera Phòng Lab C1', ip_address: '192.168.3.10', port: 554, status: 0, phong_khoa_id: 4, created_at: '2023-05-05 10:15:00', updated_at: '2024-04-22 09:00:00' },
    { id: 7, name: 'Camera Nhà xe NV', ip_address: '192.168.1.110', port: 8080, status: 1, phong_khoa_id: null, created_at: '2023-06-12 13:00:00', updated_at: '2024-07-28 10:35:00' },
    { id: 8, name: 'Camera Phòng Học D201', ip_address: '192.168.4.25', port: 554, status: 1, phong_khoa_id: 5, created_at: '2023-07-18 07:50:00', updated_at: '2024-07-10 14:20:00' },
    { id: 9, name: 'Camera Khoa CNTT', ip_address: '10.1.1.5', port: 8080, status: 1, phong_khoa_id: 1, created_at: '2023-08-01 16:00:00', updated_at: '2024-07-25 17:00:00' },
    { id: 10, name: 'Camera Khoa Kế Toán', ip_address: '10.1.2.5', port: 554, status: 1, phong_khoa_id: 2, created_at: '2023-08-01 16:05:00', updated_at: '2024-07-25 17:05:00' },
    { id: 11, name: 'Camera Lối vào Thư Viện', ip_address: '10.0.0.16', port: 8080, status: 1, phong_khoa_id: 3, created_at: '2023-09-05 08:00:00', updated_at: '2024-07-27 10:00:00' },
    { id: 12, name: 'Camera Phòng Server', ip_address: '192.168.0.2', port: 22, status: 1, phong_khoa_id: 1, created_at: '2023-10-10 00:00:00', updated_at: '2024-07-01 09:00:00' },
    { id: 13, name: 'Camera Văn phòng Khoa QTKD', ip_address: '10.1.3.5', port: 554, status: 1, phong_khoa_id: 4, created_at: '2023-11-11 11:11:11', updated_at: '2024-06-28 14:30:00' },
    { id: 14, name: 'Camera Phòng họp E3', ip_address: '192.168.5.100', port: 8080, status: 0, phong_khoa_id: 5, created_at: '2023-12-01 15:30:00', updated_at: '2024-03-10 10:00:00' },
    { id: 15, name: 'Camera Giảng đường F1', ip_address: '192.168.6.20', port: 554, status: 1, phong_khoa_id: null, created_at: '2024-01-10 08:45:00', updated_at: '2024-07-28 11:00:00' },
    { id: 16, name: 'Camera Khu tự học', ip_address: '10.0.0.30', port: 8080, status: 1, phong_khoa_id: 3, created_at: '2024-02-14 09:20:00', updated_at: '2024-07-15 16:00:00' },
    { id: 17, name: 'Camera Phòng thực hành Mạng', ip_address: '192.168.3.11', port: 554, status: 1, phong_khoa_id: 1, created_at: '2024-03-10 10:00:00', updated_at: '2024-07-28 11:05:00' },
    { id: 18, name: 'Camera Sảnh chính', ip_address: '192.168.1.5', port: 8080, status: 1, phong_khoa_id: null, created_at: '2024-04-01 07:30:00', updated_at: '2024-07-26 08:00:00' },
    { id: 19, name: 'Camera Phòng Kế toán', ip_address: '10.1.2.6', port: 554, status: 1, phong_khoa_id: 2, created_at: '2024-05-15 14:45:00', updated_at: '2024-07-28 11:10:00' },
    { id: 20, name: 'Camera Bãi giữ xe GV', ip_address: '192.168.1.111', port: 8080, status: 0, phong_khoa_id: null, created_at: '2024-06-20 17:00:00', updated_at: '2024-07-20 09:30:00' },
];

  // --- UI Interactions ---
  const toggleSidebar = () => {
    sidebar?.classList.toggle('-translate-x-full');
    sidebarBackdrop?.classList.toggle('hidden');
  };

  const toggleUserMenu = () => {
    userMenu?.classList.toggle('opacity-0');
    userMenu?.classList.toggle('invisible');
    userMenu?.classList.toggle('group-hover:opacity-100');
    userMenu?.classList.toggle('group-hover:visible');
  };

  // --- Functions ---

  // Lấy ID từ query parameter
  const getCameraIdFromUrl = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    return id ? parseInt(id, 10) : null;
  };

  // Lấy thông tin camera từ ID
  const getCameraById = (id) => {
    return camerasMockData.find(camera => camera.id === id);
  };

  // Hiển thị thông tin camera trong form
  const populateForm = (camera) => {
    if (!camera) {
      console.error('Không tìm thấy thông tin camera để chỉnh sửa');
      return;
    }

    // Cập nhật tiêu đề form
    if (formTitle) formTitle.textContent = `Chỉnh sửa Camera: ${camera.name}`;

    // Điền thông tin vào form
    if (cameraIdInput) cameraIdInput.value = camera.id;
    if (cameraIdHiddenInput) cameraIdHiddenInput.value = camera.id; // Store ID for submission
    if (cameraNameInput) cameraNameInput.value = camera.name || '';
    if (cameraIpInput) cameraIpInput.value = camera.ip_address || '';
    if (cameraPortInput) cameraPortInput.value = camera.port || '';
    if (cameraStatusSelect) cameraStatusSelect.value = camera.status !== undefined ? camera.status.toString() : '1';
    if (cameraDepartmentInput) cameraDepartmentInput.value = camera.phong_khoa_id || '';

    // Set the cancel button links to go back to the detail page
    const detailUrl = `camera-detail.html?id=${camera.id}`;
    if (cancelEditBtn) cancelEditBtn.href = detailUrl;
    if (cancelBtnForm) cancelBtnForm.href = detailUrl;
  };

  // Cập nhật camera (mô phỏng)
  const updateCamera = (formData) => {
    // Lấy thông tin từ form
    const cameraId = parseInt(formData.get('camera-id-hidden'), 10) || currentCameraId;
    const cameraData = {
      id: cameraId,
      name: formData.get('camera-name'),
      ip_address: formData.get('camera-ip'),
      port: parseInt(formData.get('camera-port'), 10),
      status: parseInt(formData.get('camera-status'), 10),
      phong_khoa_id: formData.get('camera-department') ? parseInt(formData.get('camera-department'), 10) : null,
      updated_at: new Date().toISOString().slice(0, 19).replace('T', ' '), // Cập nhật thời gian
    };

    // Validation (basic)
    if (!cameraData.name || !cameraData.ip_address || !cameraData.port) {
      alert('Vui lòng điền đầy đủ Tên Camera, Địa chỉ IP và Port.');
      return false;
    }
    
    // IP Address validation using pattern is handled by the browser
    // Port range validation using min/max is handled by the browser

    // Cập nhật dữ liệu (mô phỏng - trong ứng dụng thực tế sẽ gọi API)
    const index = camerasMockData.findIndex(c => c.id === cameraId);
    if (index !== -1) {
      // Giữ lại ngày tạo ban đầu
      cameraData.created_at = camerasMockData[index].created_at;
      camerasMockData[index] = cameraData;
      console.log('Đã cập nhật camera (mô phỏng):', camerasMockData[index]);
      return true;
    } else {
      console.error('Không tìm thấy camera để cập nhật');
      alert('Lỗi: Không tìm thấy camera để cập nhật.');
      return false;
    }
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
    if (userMenu && !userMenu.classList.contains('invisible') && !userMenuButton?.contains(e.target)) {
      toggleUserMenu();
    }
  });

  // Form submit handler
  editCameraForm?.addEventListener('submit', (e) => {
    e.preventDefault(); // Ngăn chặn form submit mặc định
    
    const formData = new FormData(editCameraForm);
    const success = updateCamera(formData);
    
    if (success) {
      alert('Cập nhật camera thành công (mô phỏng)!');
      // Chuyển về trang chi tiết
      window.location.href = `camera-detail.html?id=${currentCameraId}`;
    }
  });

  // --- Initialization ---
  
  // Lấy ID camera từ URL và hiển thị thông tin
  const init = () => {
    currentCameraId = getCameraIdFromUrl();
    
    if (!currentCameraId) {
      console.error('Không tìm thấy ID camera trong URL');
      alert('Lỗi: Không tìm thấy camera để chỉnh sửa.');
      window.location.href = 'cameras.html'; // Chuyển về trang danh sách
      return;
    }
    
    currentCamera = getCameraById(currentCameraId);
    
    if (!currentCamera) {
      console.error('Không tìm thấy thông tin camera với ID:', currentCameraId);
      alert('Lỗi: Không tìm thấy camera để chỉnh sửa.');
      window.location.href = 'cameras.html';
      return;
    }
    
    populateForm(currentCamera);
  };
  
  init();
}); 