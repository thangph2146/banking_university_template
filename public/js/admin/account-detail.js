document.addEventListener('DOMContentLoaded', () => {
  // Khởi tạo AOS (Animation On Scroll)
  AOS.init({
    duration: 800,
    easing: 'ease-in-out',
    once: true,
    mirror: false
  });

  // DOM Elements
  const loadingOverlay = document.getElementById('loading-overlay');
  const noDataMessage = document.getElementById('no-data-message');
  const userIdElement = document.getElementById('user-id');
  const usernameElement = document.getElementById('username');
  const emailElement = document.getElementById('email');
  const lastNameElement = document.getElementById('lastName');
  const middleNameElement = document.getElementById('middleName');
  const firstNameElement = document.getElementById('firstName');
  const typeElement = document.getElementById('type');
  const statusElement = document.getElementById('status');
  const createdAtElement = document.getElementById('created-at');
  const updatedAtElement = document.getElementById('updated-at');
  const deletedAtElement = document.getElementById('deleted-at');
  
  // Sidebar functionality for mobile
  const sidebarOpen = document.getElementById('sidebar-open');
  const sidebarClose = document.getElementById('sidebar-close');
  const sidebar = document.getElementById('sidebar');
  const sidebarBackdrop = document.getElementById('sidebar-backdrop');

  // Hàm hiển thị/ẩn sidebar trên mobile
  function toggleSidebar() {
    sidebar.classList.toggle('-translate-x-full');
    sidebarBackdrop.classList.toggle('hidden');
    document.body.classList.toggle('overflow-hidden');
  }

  // Thêm event listeners cho sidebar
  if (sidebarOpen && sidebarClose && sidebarBackdrop) {
    sidebarOpen.addEventListener('click', toggleSidebar);
    sidebarClose.addEventListener('click', toggleSidebar);
    sidebarBackdrop.addEventListener('click', toggleSidebar);
  }

  // Lấy ID tài khoản từ URL
  const urlParams = new URLSearchParams(window.location.search);
  const accountId = urlParams.get('id');

  // Hàm định dạng thời gian
  function formatDateTime(dateString) {
    if (!dateString) return '--/--/---- --:--:--';
    
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  }

  // Hàm hiển thị trạng thái
  function renderStatus(status) {
    if (status) {
      return `<div class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <span class="w-2 h-2 mr-1 rounded-full bg-green-500"></span>
                Đang hoạt động
              </div>`;
    } else {
      return `<div class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                <span class="w-2 h-2 mr-1 rounded-full bg-gray-500"></span>
                Vô hiệu hóa
              </div>`;
    }
  }

  // Hàm tải dữ liệu tài khoản
  async function loadAccountData() {
    try {
      // Hiển thị loading overlay
      loadingOverlay.classList.remove('hidden');
      
      // Mô phỏng API call để lấy dữ liệu tài khoản
      // Trong thực tế, đây sẽ là một API call đến server
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mô phỏng dữ liệu - có thể null nếu không tìm thấy
      let accountData = null;
      
      // Nếu có ID và tìm thấy dữ liệu
      if (accountId) {
        // Dữ liệu mẫu - sẽ được thay thế bằng dữ liệu thực từ API
        accountData = {
          u_id: accountId,
          u_LastName: 'Nguyễn',
          u_MiddleName: 'Văn',
          u_FirstName: 'A',
          u_type: 'admin',
          u_username: 'admin',
          u_email: 'admin@example.com',
          u_status: true,
          u_created_at: '2023-03-15T08:30:00Z',
          u_updated_at: '2023-05-20T14:45:00Z',
          u_deleted_at: null
        };
      }
      
      if (accountData) {
        // Ẩn thông báo không có dữ liệu
        noDataMessage.classList.add('hidden');
        
        // Cập nhật giao diện với dữ liệu
        userIdElement.textContent = accountData.u_id || '--';
        usernameElement.textContent = accountData.u_username || '--';
        emailElement.textContent = accountData.u_email || '--';
        lastNameElement.textContent = accountData.u_LastName || '--';
        middleNameElement.textContent = accountData.u_MiddleName || '--';
        firstNameElement.textContent = accountData.u_FirstName || '--';
        typeElement.textContent = accountData.u_type || '--';
        statusElement.innerHTML = renderStatus(accountData.u_status);
        createdAtElement.textContent = formatDateTime(accountData.u_created_at);
        updatedAtElement.textContent = formatDateTime(accountData.u_updated_at);
        deletedAtElement.textContent = formatDateTime(accountData.u_deleted_at);
        
        // Đặt tiêu đề trang
        document.title = `${accountData.u_username} - Chi tiết Tài khoản Admin - HUB Admin`;
      } else {
        // Hiển thị thông báo không tìm thấy dữ liệu
        noDataMessage.classList.remove('hidden');
        
        // Đặt tiêu đề trang mặc định
        document.title = `Chi tiết Tài khoản Admin - HUB Admin`;
      }
      
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu tài khoản:', error);
      // Hiển thị thông báo không có dữ liệu
      noDataMessage.classList.remove('hidden');
    } finally {
      // Ẩn loading overlay
      loadingOverlay.classList.add('hidden');
    }
  }
  
  // Tải dữ liệu khi trang được tải
  loadAccountData();
}); 