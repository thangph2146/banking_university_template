document.addEventListener('DOMContentLoaded', function() {
  // Lấy tất cả các button tab và nội dung tab
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');
  
  // Hàm chuyển đổi tab
  function switchTab(tabId) {
    // Bỏ active tất cả các tab button
    tabButtons.forEach(button => {
      button.classList.remove('active', 'border-primary', 'text-primary');
      button.classList.add('border-transparent', 'text-gray-500');
      button.setAttribute('aria-selected', 'false');
    });
    
    // Ẩn tất cả nội dung tab
    tabContents.forEach(content => {
      content.style.opacity = '0';
      setTimeout(() => {
        if (content.id !== `tab-${tabId}`) {
          content.classList.add('hidden');
          content.setAttribute('aria-hidden', 'true');
        }
      }, 100);
    });
    
    // Active tab hiện tại
    const currentButton = document.querySelector(`.tab-btn[data-tab="${tabId}"]`);
    if (currentButton) {
      currentButton.classList.remove('border-transparent', 'text-gray-500');
      currentButton.classList.add('active', 'border-primary', 'text-primary');
      currentButton.setAttribute('aria-selected', 'true');
    }
    
    // Hiển thị nội dung tab hiện tại với animation
    const currentContent = document.getElementById(`tab-${tabId}`);
    if (currentContent) {
      if (currentContent.classList.contains('hidden')) {
        currentContent.classList.remove('hidden');
        setTimeout(() => {
          currentContent.style.opacity = '1';
          currentContent.setAttribute('aria-hidden', 'false');
        }, 10);
      } else {
        currentContent.style.opacity = '1';
        currentContent.setAttribute('aria-hidden', 'false');
      }
    }
  }
  
  // Khởi tạo event listeners cho tab
  function initTabs() {
    const savedTab = localStorage.getItem('selectedEventTab');
    
    tabButtons.forEach(button => {
      button.addEventListener('click', () => {
        const tabId = button.getAttribute('data-tab');
        switchTab(tabId);
        localStorage.setItem('selectedEventTab', tabId);
      });
    });
    
    // Khởi tạo tab mặc định hoặc tab đã lưu
    if (savedTab && document.querySelector(`.tab-btn[data-tab="${savedTab}"]`)) {
      switchTab(savedTab);
    } else if (tabButtons.length > 0) {
      const defaultTab = tabButtons[0].getAttribute('data-tab');
      switchTab(defaultTab);
      localStorage.setItem('selectedEventTab', defaultTab);
    }
  }
  
  // Đặt opacity cho tab content ban đầu
  tabContents.forEach(content => {
    content.style.opacity = content.id === 'tab-basic-info' ? '1' : '0';
  });
  
  // Khởi tạo tabs
  initTabs();
  
  // Xử lý nút quay lại
  const backButton = document.getElementById('back-btn');
  if (backButton) {
    backButton.addEventListener('click', () => window.location.href = 'events.html');
  }

  // Ẩn loading overlay
  const loadingOverlay = document.getElementById('loading-overlay');
  if (loadingOverlay) {
    setTimeout(() => {
      loadingOverlay.style.display = 'none';
    }, 500);
  }

  // --- Mobile Sidebar Toggle --- 
  const sidebar = document.getElementById('sidebar');
  const sidebarOpenBtn = document.getElementById('sidebar-open');
  const sidebarCloseBtn = document.getElementById('sidebar-close');
  const sidebarBackdrop = document.getElementById('sidebar-backdrop');

  function openSidebar() {
      if (sidebar && sidebarBackdrop) {
          sidebar.classList.remove('-translate-x-full');
          sidebarBackdrop.classList.remove('hidden');
          sidebarBackdrop.classList.add('opacity-100'); // Fade in backdrop
      }
  }

  function closeSidebar() {
      if (sidebar && sidebarBackdrop) {
          sidebar.classList.add('-translate-x-full');
          sidebarBackdrop.classList.add('hidden');
          sidebarBackdrop.classList.remove('opacity-100'); // Fade out backdrop
      }
  }

  if (sidebarOpenBtn) sidebarOpenBtn.addEventListener('click', openSidebar);
  if (sidebarCloseBtn) sidebarCloseBtn.addEventListener('click', closeSidebar);
  if (sidebarBackdrop) sidebarBackdrop.addEventListener('click', closeSidebar);
  // --- End Mobile Sidebar Toggle ---
});
