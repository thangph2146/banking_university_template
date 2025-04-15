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
  const backBtn = document.getElementById('back-btn');
  const tenLoaiSuKienElement = document.getElementById('ten_loai_su_kien');
  const maLoaiSuKienElement = document.getElementById('ma_loai_su_kien');
  const statusElement = document.getElementById('status');
  const createdAtElement = document.getElementById('created-at');
  const updatedAtElement = document.getElementById('updated-at');
  
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

  // Lấy ID loại sự kiện từ URL
  const urlParams = new URLSearchParams(window.location.search);
  const eventTypeId = urlParams.get('id');

  // Nếu không có ID, chuyển hướng về trang danh sách
  if (!eventTypeId) {
    window.location.href = 'event-types.html';
    return;
  }

  // Event Listeners
  backBtn.addEventListener('click', () => {
    window.location.href = 'event-types.html';
  });

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

  // Hàm tải dữ liệu loại sự kiện
  async function loadEventTypeData() {
    try {
      // Hiển thị loading overlay
      loadingOverlay.classList.remove('hidden');
      
      // Mô phỏng API call để lấy dữ liệu loại sự kiện
      // Trong thực tế, đây sẽ là một API call đến server
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Dữ liệu mẫu - sẽ được thay thế bằng dữ liệu thực từ API
      const eventTypeData = {
        loai_su_kien_id: eventTypeId,
        ten_loai_su_kien: 'Hội thảo khoa học',
        ma_loai_su_kien: 'HTKHCN',
        status: true,
        created_at: '2023-03-15T08:30:00Z',
        updated_at: '2023-05-20T14:45:00Z'
      };
      
      // Cập nhật giao diện với dữ liệu
      tenLoaiSuKienElement.textContent = eventTypeData.ten_loai_su_kien;
      maLoaiSuKienElement.textContent = eventTypeData.ma_loai_su_kien || 'Không có mã';
      statusElement.innerHTML = renderStatus(eventTypeData.status);
      createdAtElement.textContent = formatDateTime(eventTypeData.created_at);
      updatedAtElement.textContent = formatDateTime(eventTypeData.updated_at);
      
      // Đặt tiêu đề trang
      document.title = `${eventTypeData.ten_loai_su_kien} - Chi tiết Loại Sự Kiện - HUB Admin`;
      
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu loại sự kiện:', error);
      // Hiển thị thông báo lỗi
      alert('Đã có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại sau.');
    } finally {
      // Ẩn loading overlay
      loadingOverlay.classList.add('hidden');
    }
  }
  
  // Tải dữ liệu khi trang được tải
  loadEventTypeData();
}); 