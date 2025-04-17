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
  
  const cameraTitle = document.getElementById('camera-title');
  const cameraIdEl = document.getElementById('camera-id');
  const cameraNameEl = document.getElementById('camera-name');
  const cameraIpEl = document.getElementById('camera-ip');
  const cameraPortEl = document.getElementById('camera-port');
  const cameraDepartmentEl = document.getElementById('camera-department');
  const cameraStatusContainer = document.getElementById('camera-status-container');
  const cameraStatusEl = document.getElementById('camera-status');
  const createdDateEl = document.getElementById('created-date');
  const updatedDateEl = document.getElementById('updated-date');
  const pingStatusEl = document.getElementById('ping-status');
  const streamPreviewPlaceholder = document.getElementById('stream-preview-placeholder');
  const streamPreviewImage = document.getElementById('stream-preview-image');

  const editCameraBtn = document.getElementById('edit-camera-btn');
  const deleteBtn = document.getElementById('delete-btn');

  // --- Mock Data ---
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

  // Hiển thị thông tin camera
  const displayCameraDetails = (camera) => {
    if (!camera) {
      console.error('Không tìm thấy thông tin camera');
      if (cameraTitle) cameraTitle.textContent = 'Lỗi - Không tìm thấy camera';
      // Hide details or show error message
      return;
    }

    // Cập nhật tiêu đề và các trường thông tin
    if (cameraTitle) cameraTitle.textContent = `Chi tiết Camera: ${camera.name}`;
    if (cameraIdEl) cameraIdEl.textContent = camera.id;
    if (cameraNameEl) cameraNameEl.textContent = camera.name;
    if (cameraIpEl) cameraIpEl.textContent = camera.ip_address;
    if (cameraPortEl) cameraPortEl.textContent = camera.port;
    if (cameraDepartmentEl) cameraDepartmentEl.textContent = camera.phong_khoa_id !== null ? camera.phong_khoa_id : 'N/A';

    // Cập nhật trạng thái
    if (cameraStatusEl) {
        if (camera.status === 1) {
            cameraStatusEl.textContent = 'Hoạt động';
            cameraStatusEl.className = 'px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800';
        } else {
            cameraStatusEl.textContent = 'Không hoạt động';
            cameraStatusEl.className = 'px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800';
        }
    }

    // Cập nhật ngày tạo/cập nhật
    if (createdDateEl) createdDateEl.textContent = formatDateTime(camera.created_at);
    if (updatedDateEl) updatedDateEl.textContent = camera.updated_at ? formatDateTime(camera.updated_at) : 'Chưa cập nhật';

    // Cập nhật nút chỉnh sửa
    if (editCameraBtn) editCameraBtn.href = `camera-edit.html?id=${camera.id}`;
    
    // Mô phỏng kiểm tra ping
    simulatePingCheck(camera.ip_address);
    
    // Mô phỏng stream preview (có thể thay bằng ảnh tĩnh hoặc logic khác)
    simulateStreamPreview(camera.ip_address);
  };
  
  // Mô phỏng kiểm tra ping
  const simulatePingCheck = (ip) => {
      if (!pingStatusEl) return;
      pingStatusEl.textContent = 'Đang kiểm tra...';
      pingStatusEl.className = 'font-medium text-gray-500'; // Reset class
      
      setTimeout(() => {
          const isOnline = Math.random() > 0.2; // 80% chance online
          if (isOnline) {
              pingStatusEl.textContent = 'Online';
              pingStatusEl.className = 'font-medium text-green-600';
          } else {
              pingStatusEl.textContent = 'Offline';
              pingStatusEl.className = 'font-medium text-red-600';
          }
      }, 1500);
  };
  
  // Mô phỏng stream preview
  const simulateStreamPreview = (ip) => {
      if (!streamPreviewPlaceholder || !streamPreviewImage) return;
      
      // Giả sử có một ảnh preview dựa trên IP hoặc ID
      const previewImageUrl = `https://via.placeholder.com/320x180.png?text=Preview+${ip}`;
      
      streamPreviewImage.src = previewImageUrl;
      streamPreviewImage.classList.remove('hidden');
      streamPreviewPlaceholder.classList.add('hidden');
      
      streamPreviewImage.onerror = () => {
          // Nếu ảnh lỗi, hiển thị lại placeholder
          streamPreviewImage.classList.add('hidden');
          streamPreviewPlaceholder.classList.remove('hidden');
          streamPreviewPlaceholder.textContent = 'Không thể tải xem trước';
      };
  };

  // Xử lý xóa camera
  const handleDeleteCamera = () => {
    if (!currentCamera) return;
    
    if (confirm(`Bạn có chắc chắn muốn xóa camera "${currentCamera.name}" (ID: ${currentCamera.id}) không?`)) {
      // Thêm logic xóa API ở đây
      alert('Đã xóa camera thành công (mô phỏng)!');
      window.location.href = 'cameras.html'; // Chuyển về trang danh sách
    }
  };

  // --- Helper Functions ---
  
  // Định dạng ngày giờ
  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return '-';
    try {
      const date = new Date(dateTimeString.replace(' ', 'T') + 'Z'); // Assume UTC or handle timezone
      if (isNaN(date)) return dateTimeString; // Return original if invalid

      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');
      
      return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
    } catch (e) {
        console.error("Error formatting date:", dateTimeString, e);
        return dateTimeString; // Return original on error
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
  
  deleteBtn?.addEventListener('click', handleDeleteCamera);

  // --- Initialization ---
  
  // Lấy ID camera từ URL và hiển thị thông tin
  const init = () => {
    currentCameraId = getCameraIdFromUrl();
    
    if (!currentCameraId) {
      console.error('Không tìm thấy ID camera trong URL');
      alert('Lỗi: Không tìm thấy thông tin camera.');
      if (cameraTitle) cameraTitle.textContent = 'Lỗi';
      // Có thể chuyển hướng người dùng về trang danh sách
       window.location.href = 'cameras.html';
      return;
    }
    
    currentCamera = getCameraById(currentCameraId);
    
    if (!currentCamera) {
      console.error('Không tìm thấy thông tin camera với ID:', currentCameraId);
      alert('Lỗi: Không tìm thấy thông tin camera.');
      if (cameraTitle) cameraTitle.textContent = 'Lỗi';
       window.location.href = 'cameras.html';
      return;
    }
    
    displayCameraDetails(currentCamera);
  };
  
  init();
}); 