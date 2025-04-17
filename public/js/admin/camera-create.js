document.addEventListener('DOMContentLoaded', () => {
    // Initialize AOS
    AOS.init({
        duration: 800,
        once: false, // animations repeat on scroll up
    });

    // State
    const state = {
        cameras: camerasMockData // Use mock data
    };

    // DOM Elements
    const sidebarOpenBtn = document.getElementById('sidebar-open');
    const sidebarCloseBtn = document.getElementById('sidebar-close');
    const sidebar = document.getElementById('sidebar');
    const sidebarBackdrop = document.getElementById('sidebar-backdrop');
    const userMenuButton = document.getElementById('user-menu-button');
    const userMenu = document.getElementById('user-menu');
    const createCameraForm = document.getElementById('create-camera-form');
    const cameraNameInput = document.getElementById('camera-name');
    const cameraIpInput = document.getElementById('camera-ip');
    const cameraPortInput = document.getElementById('camera-port');
    const cameraStatusSelect = document.getElementById('camera-status');
    const cameraDepartmentInput = document.getElementById('camera-department');
    const saveButton = document.getElementById('save-camera-btn');

    // --- UI Interaction --- //
    function toggleSidebar() {
        sidebar.classList.toggle('-translate-x-full');
        sidebar.classList.toggle('md:translate-x-0');
        sidebarBackdrop.classList.toggle('hidden');
    }

    function toggleUserMenu() {
        userMenu.classList.toggle('opacity-0');
        userMenu.classList.toggle('invisible');
        userMenu.classList.toggle('scale-95');
        userMenu.classList.toggle('group-hover:opacity-100');
        userMenu.classList.toggle('group-hover:visible');
        userMenu.classList.toggle('group-hover:scale-100');
    }

    // --- Event Listeners --- //
    if (sidebarOpenBtn && sidebarCloseBtn && sidebar && sidebarBackdrop) {
        sidebarOpenBtn.addEventListener('click', toggleSidebar);
        sidebarCloseBtn.addEventListener('click', toggleSidebar);
        sidebarBackdrop.addEventListener('click', toggleSidebar);
    }

    // Toggle user menu (consider if hover is enough or click is needed)
    // userMenuButton?.addEventListener('click', toggleUserMenu);

    // --- Form Handling --- //
    createCameraForm?.addEventListener('submit', (e) => {
        e.preventDefault();

        // Basic validation - HTML5 required and pattern attributes handle some validation
        const name = cameraNameInput.value.trim();
        const ipAddress = cameraIpInput.value.trim();
        const port = parseInt(cameraPortInput.value, 10);
        const status = parseInt(cameraStatusSelect.value, 10);
        const departmentId = cameraDepartmentInput.value ? parseInt(cameraDepartmentInput.value, 10) : null;

        if (!name || !ipAddress || !port) {
            alert('Vui lòng điền đầy đủ các trường bắt buộc (*)');
            return;
        }

        // Validate IP address format (already handled by pattern, but good for JS fallback)
        const ipRegex = /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
        if (!ipRegex.test(ipAddress)) {
            alert('Địa chỉ IP không hợp lệ.');
            return;
        }

        // Validate Port range
        if (port < 1 || port > 65535) {
            alert('Port phải nằm trong khoảng từ 1 đến 65535.');
            return;
        }
        
        // Simulate adding data (replace with actual API call)
        const newCamera = {
            id: state.cameras.length > 0 ? Math.max(...state.cameras.map(c => c.id)) + 1 : 1, // Simple ID generation
            name: name,
            ip_address: ipAddress,
            port: port,
            status: status,
            phong_khoa_id: departmentId,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };

        // In a real application, you'd send this `newCamera` object to your backend API.
        // For now, we'll just log it and simulate success.
        console.log('Thêm camera mới:', newCamera);
        
        // Simulate adding to the mock data (for potential future use on the list page if navigating back)
        // Note: This state won't persist across page loads without local storage or similar
        state.cameras.push(newCamera);
        console.log('Danh sách camera sau khi thêm:', state.cameras);

        // Display success message (optional, could be a toast notification)
        alert('Đã thêm camera thành công!');

        // Redirect back to the list page after a short delay
        setTimeout(() => {
            window.location.href = 'cameras.html';
        }, 500);
    });

    // --- Initial Setup --- //
    // No initial data fetching needed for create page
    console.log('Trang thêm camera đã sẵn sàng.');

});

// Mock data (same as cameras.js for consistency)
const camerasMockData = [
    { id: 1, name: 'Camera Sảnh Chính', ip_address: '192.168.1.101', port: 8080, status: 1, phong_khoa_id: 1, created_at: '2023-10-01T10:00:00Z', updated_at: '2023-10-25T14:30:00Z' },
    { id: 2, name: 'Camera Phòng Học A101', ip_address: '192.168.1.102', port: 8080, status: 1, phong_khoa_id: 2, created_at: '2023-10-01T10:05:00Z', updated_at: '2023-10-26T09:15:00Z' },
    { id: 3, name: 'Camera Thư Viện Tầng 2', ip_address: '192.168.2.50', port: 80, status: 0, phong_khoa_id: 3, created_at: '2023-10-02T11:00:00Z', updated_at: '2023-10-22T16:00:00Z' },
    { id: 4, name: 'Camera Hành Lang B', ip_address: '192.168.1.104', port: 8000, status: 1, phong_khoa_id: 1, created_at: '2023-10-03T15:20:00Z', updated_at: '2023-10-25T11:00:00Z' },
    { id: 5, name: 'Camera Hội Trường', ip_address: '172.16.0.10', port: 8081, status: 1, phong_khoa_id: 4, created_at: '2023-10-04T09:00:00Z', updated_at: '2023-10-26T10:00:00Z' },
    { id: 6, name: 'Camera Khoa CNTT', ip_address: '192.168.3.15', port: 8080, status: 1, phong_khoa_id: 2, created_at: '2023-10-05T14:00:00Z', updated_at: '2023-10-25T18:00:00Z' },
    { id: 7, name: 'Camera Phòng Thí Nghiệm', ip_address: '192.168.3.16', port: 8080, status: 0, phong_khoa_id: 2, created_at: '2023-10-06T16:30:00Z', updated_at: '2023-10-23T12:00:00Z' },
    { id: 8, name: 'Camera Bãi Xe Khu A', ip_address: '10.0.0.5', port: 9000, status: 1, phong_khoa_id: 5, created_at: '2023-10-07T08:00:00Z', updated_at: '2023-10-26T07:45:00Z' },
    { id: 9, name: 'Camera Cổng Sau', ip_address: '10.0.0.6', port: 9000, status: 1, phong_khoa_id: 5, created_at: '2023-10-08T10:10:00Z', updated_at: '2023-10-26T08:20:00Z' },
    { id: 10, name: 'Camera Khoa Kinh Tế', ip_address: '192.168.4.20', port: 8080, status: 1, phong_khoa_id: 6, created_at: '2023-10-09T11:30:00Z', updated_at: '2023-10-25T15:00:00Z' },
    { id: 11, name: 'Camera Phòng Giáo Vụ', ip_address: '192.168.1.10', port: 80, status: 1, phong_khoa_id: 1, created_at: '2023-10-10T13:00:00Z', updated_at: '2023-10-26T11:10:00Z' },
    { id: 12, name: 'Camera Sân Thượng', ip_address: '192.168.1.105', port: 8888, status: 0, phong_khoa_id: 1, created_at: '2023-10-11T17:00:00Z', updated_at: '2023-10-24T09:00:00Z' },
    { id: 13, name: 'Camera Phòng Server', ip_address: '192.168.0.2', port: 8080, status: 1, phong_khoa_id: 1, created_at: '2023-10-12T09:45:00Z', updated_at: '2023-10-26T13:00:00Z' },
    { id: 14, name: 'Camera KTX Khu C', ip_address: '10.10.10.100', port: 8000, status: 1, phong_khoa_id: 7, created_at: '2023-10-13T10:00:00Z', updated_at: '2023-10-25T10:30:00Z' },
    { id: 15, name: 'Camera Nhà Ăn', ip_address: '192.168.1.200', port: 80, status: 1, phong_khoa_id: 8, created_at: '2023-10-14T12:00:00Z', updated_at: '2023-10-26T12:15:00Z' },
    { id: 16, name: 'Camera Phòng Học B205', ip_address: '192.168.1.110', port: 8080, status: 1, phong_khoa_id: 2, created_at: '2023-10-15T14:30:00Z', updated_at: '2023-10-25T16:45:00Z' },
    { id: 17, name: 'Camera Khoa Ngoại Ngữ', ip_address: '192.168.5.30', port: 8080, status: 0, phong_khoa_id: 9, created_at: '2023-10-16T09:00:00Z', updated_at: '2023-10-22T10:00:00Z' },
    { id: 18, name: 'Camera Phòng Y Tế', ip_address: '192.168.1.15', port: 80, status: 1, phong_khoa_id: 1, created_at: '2023-10-17T11:00:00Z', updated_at: '2023-10-26T09:30:00Z' },
    { id: 19, name: 'Camera Sân Vận Động', ip_address: '172.16.1.50', port: 8082, status: 1, phong_khoa_id: 10, created_at: '2023-10-18T16:00:00Z', updated_at: '2023-10-25T17:00:00Z' },
    { id: 20, name: 'Camera Giảng Đường Lớn', ip_address: '172.16.0.11', port: 8081, status: 1, phong_khoa_id: 4, created_at: '2023-10-19T08:30:00Z', updated_at: '2023-10-26T14:00:00Z' },
]; 