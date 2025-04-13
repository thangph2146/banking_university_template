document.addEventListener('DOMContentLoaded', function() {
  // Lấy tất cả các button tab và nội dung tab
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');
  
  // Biến để lưu trữ ID sự kiện từ URL
  const urlParams = new URLSearchParams(window.location.search);
  const eventId = urlParams.get('id');
  
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
      }, 300); // Đợi transition kết thúc
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
      // Kiểm tra nếu tab content đang ẩn, thì hiển thị lại
      if (currentContent.classList.contains('hidden')) {
        currentContent.classList.remove('hidden');
        // Cho phép layout tính toán trước khi bắt đầu transition
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
  
  // Gắn sự kiện click cho các tab button
  tabButtons.forEach(button => {
    button.addEventListener('click', function() {
      const tabId = this.getAttribute('data-tab');
      switchTab(tabId);
      
      // Lưu trạng thái tab hiện tại vào localStorage
      localStorage.setItem('currentEventTab', tabId);
    });
  });
  
  // Xử lý phím tắt
  document.addEventListener('keydown', function(event) {
    // Lấy danh sách tabs
    const tabIds = Array.from(tabButtons).map(button => button.getAttribute('data-tab'));
    
    // Alt + 1-7 để chuyển đến tab tương ứng
    if (event.altKey && event.key >= '1' && event.key <= '7') {
      const index = parseInt(event.key) - 1;
      if (index < tabIds.length) {
        switchTab(tabIds[index]);
        localStorage.setItem('currentEventTab', tabIds[index]);
        event.preventDefault();
      }
    }
    
    // Alt + Tab để chuyển đến tab tiếp theo
    if (event.altKey && event.key === 'Tab') {
      const activeTabButton = document.querySelector('.tab-btn[aria-selected="true"]');
      const activeTabId = activeTabButton.getAttribute('data-tab');
      const currentIndex = tabIds.indexOf(activeTabId);
      const nextIndex = (currentIndex + 1) % tabIds.length;
      switchTab(tabIds[nextIndex]);
      localStorage.setItem('currentEventTab', tabIds[nextIndex]);
      event.preventDefault();
    }
    
    // Alt + Left/Right để di chuyển giữa các tab
    if (event.altKey && (event.key === 'ArrowLeft' || event.key === 'ArrowRight')) {
      const activeTabButton = document.querySelector('.tab-btn[aria-selected="true"]');
      const activeTabId = activeTabButton.getAttribute('data-tab');
      const currentIndex = tabIds.indexOf(activeTabId);
      
      let nextIndex;
      if (event.key === 'ArrowLeft') {
        nextIndex = (currentIndex - 1 + tabIds.length) % tabIds.length;
      } else {
        nextIndex = (currentIndex + 1) % tabIds.length;
      }
      
      switchTab(tabIds[nextIndex]);
      localStorage.setItem('currentEventTab', tabIds[nextIndex]);
      event.preventDefault();
    }
  });
  
  // Khởi tạo thư viện AOS cho hiệu ứng scroll
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out'
    });
  }
  
  // Đặt opacity cho tab content ban đầu
  tabContents.forEach(content => {
    if (content.id === 'tab-basic-info') {
      content.style.opacity = '1';
    } else {
      content.style.opacity = '0';
    }
  });
  
  // Khôi phục tab đã chọn từ localStorage
  const savedTab = localStorage.getItem('currentEventTab');
  if (savedTab) {
    switchTab(savedTab);
  }
  
  // Xử lý nút quay lại
  const backButton = document.getElementById('back-btn');
  if (backButton) {
    backButton.addEventListener('click', function() {
      window.location.href = 'events.html';
    });
  }
  
  // Xử lý tải dữ liệu sự kiện
  if (eventId) {
    loadEventData(eventId);
  } else {
    // Ẩn loading overlay nếu không có ID sự kiện
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
      loadingOverlay.style.display = 'none';
    }
  }
  
  // Hàm tải dữ liệu sự kiện
  function loadEventData(id) {
    // Trong thực tế, đây sẽ là một API call để lấy dữ liệu sự kiện
    // Giả lập dữ liệu cho mục đích demo
    
    // Hiển thị loading overlay
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
      loadingOverlay.style.display = 'flex';
    }
    
    // Giả lập delay API
    setTimeout(() => {
      // Dữ liệu mẫu
      const eventData = {
        ten_su_kien: 'Workshop Kỹ năng mềm 2024',
        don_vi_to_chuc: 'Phòng Công tác Sinh viên',
        don_vi_phoi_hop: 'Đoàn Thanh niên, Hội Sinh viên',
        loai_su_kien: 'Workshop',
        hinh_thuc: 'Hybrid',
        doi_tuong_tham_gia: 'Sinh viên, Cán bộ',
        thoi_gian: '08:00 - 12:00, 15/05/2024',
        thoi_gian_dang_ky: '01/05/2024 - 14/05/2024',
        thoi_gian_checkin: '07:30 - 08:30, 15/05/2024',
        thoi_gian_checkout: '11:30 - 12:30, 15/05/2024',
        dia_diem: 'Hội trường A',
        dia_chi_cu_the: 'Tầng 5, Tòa nhà A, Trường Đại học Ngân hàng TP.HCM',
        toa_do_gps: '10.7758, 106.6704',
        link_online: 'https://meet.google.com/abc-defg-hij',
        mo_ta: 'Workshop đào tạo kỹ năng mềm thiết yếu cho sinh viên',
        mo_ta_su_kien: '<p>Chương trình đào tạo kỹ năng mềm cho sinh viên với các chủ đề:</p><ul><li>Kỹ năng giao tiếp hiệu quả</li><li>Kỹ năng thuyết trình</li><li>Kỹ năng làm việc nhóm</li><li>Kỹ năng quản lý thời gian</li></ul>',
        chi_tiet_su_kien: '<h3>Lịch trình chương trình</h3><p>08:00 - 08:30: Đón tiếp đại biểu</p><p>08:30 - 09:00: Khai mạc</p><p>09:00 - 10:30: Phần 1: Kỹ năng giao tiếp và thuyết trình</p><p>10:30 - 10:45: Giải lao</p><p>10:45 - 12:00: Phần 2: Kỹ năng làm việc nhóm và quản lý thời gian</p>',
        tu_khoa_su_kien: 'kỹ năng mềm, giao tiếp, thuyết trình',
        hashtag: '#kynangmem2024 #hubbank',
        so_luot_xem: '245',
        slug: 'workshop-ky-nang-mem-2024',
        version: '1.0',
        hinh_anh: 'https://via.placeholder.com/800x400?text=Ảnh+sự+kiện',
        hinh_anh_bg: 'https://via.placeholder.com/1920x1080?text=Background+sự+kiện',
        tong_dang_ky: '120',
        tong_check_in: '85',
        tong_check_out: '80',
        cho_phep_check_in: 'Có',
        cho_phep_check_out: 'Có',
        yeu_cau_face_id: 'Không',
        cho_phep_checkin_thu_cong: 'Có',
        thoi_gian_checkin_config: '07:30 - 08:30, 15/05/2024',
        thoi_gian_checkout_config: '11:30 - 12:30, 15/05/2024',
        qr_code_image: 'https://via.placeholder.com/200x200?text=QR+Code',
        so_luong_tham_gia: '200',
        so_luong_dien_gia: '3',
        han_huy_dang_ky: '14/05/2024, 18:00'
      };
      
      // Ẩn loading overlay
      if (loadingOverlay) {
        loadingOverlay.style.display = 'none';
      }
      
      // Cập nhật dữ liệu vào các trường
      document.getElementById('ten_su_kien').textContent = eventData.ten_su_kien;
      document.getElementById('don_vi_to_chuc').textContent = eventData.don_vi_to_chuc;
      document.getElementById('don_vi_phoi_hop').textContent = eventData.don_vi_phoi_hop;
      document.getElementById('loai_su_kien').textContent = eventData.loai_su_kien;
      document.getElementById('hinh_thuc').textContent = eventData.hinh_thuc;
      document.getElementById('doi_tuong_tham_gia').textContent = eventData.doi_tuong_tham_gia;
      document.getElementById('thoi_gian').textContent = eventData.thoi_gian;
      document.getElementById('thoi_gian_dang_ky').textContent = eventData.thoi_gian_dang_ky;
      document.getElementById('thoi_gian_checkin').textContent = eventData.thoi_gian_checkin;
      document.getElementById('thoi_gian_checkout').textContent = eventData.thoi_gian_checkout;
      document.getElementById('dia_diem').textContent = eventData.dia_diem;
      document.getElementById('dia_chi_cu_the').textContent = eventData.dia_chi_cu_the;
      document.getElementById('toa_do_gps').textContent = eventData.toa_do_gps;
      document.getElementById('link_online').textContent = eventData.link_online;
      document.getElementById('mo_ta').textContent = eventData.mo_ta;
      document.getElementById('mo_ta_su_kien').innerHTML = eventData.mo_ta_su_kien;
      document.getElementById('chi_tiet_su_kien').innerHTML = eventData.chi_tiet_su_kien;
      document.getElementById('tu_khoa_su_kien').textContent = eventData.tu_khoa_su_kien;
      document.getElementById('hashtag').textContent = eventData.hashtag;
      document.getElementById('so_luot_xem').textContent = eventData.so_luot_xem;
      document.getElementById('slug').textContent = eventData.slug;
      document.getElementById('version').textContent = eventData.version;
      
      // Cập nhật hình ảnh
      document.getElementById('hinh_anh').src = eventData.hinh_anh;
      document.getElementById('hinh_anh_bg').src = eventData.hinh_anh_bg;
      
      // Cập nhật thống kê
      document.getElementById('tong_dang_ky').textContent = eventData.tong_dang_ky;
      document.getElementById('tong_check_in').textContent = eventData.tong_check_in;
      document.getElementById('tong_check_out').textContent = eventData.tong_check_out;
      document.getElementById('tong_dang_ky_stat').textContent = eventData.tong_dang_ky;
      document.getElementById('tong_check_in_stat').textContent = eventData.tong_check_in;
      document.getElementById('tong_check_out_stat').textContent = eventData.tong_check_out;
      
      // Tính tỷ lệ tham gia
      const tyLeThamGia = Math.round((parseInt(eventData.tong_check_in) / parseInt(eventData.tong_dang_ky)) * 100);
      document.getElementById('ty_le_tham_gia').textContent = tyLeThamGia + '%';
      
      // Cập nhật thông tin cấu hình điểm danh
      document.getElementById('cho_phep_check_in').textContent = eventData.cho_phep_check_in;
      document.getElementById('cho_phep_check_out').textContent = eventData.cho_phep_check_out;
      document.getElementById('yeu_cau_face_id').textContent = eventData.yeu_cau_face_id;
      document.getElementById('cho_phep_checkin_thu_cong').textContent = eventData.cho_phep_checkin_thu_cong;
      document.getElementById('thoi_gian_checkin_config').textContent = eventData.thoi_gian_checkin_config;
      document.getElementById('thoi_gian_checkout_config').textContent = eventData.thoi_gian_checkout_config;
      document.getElementById('qr_code_image').src = eventData.qr_code_image;
      
      // Cập nhật thông tin bổ sung
      document.getElementById('so_luong_tham_gia').textContent = eventData.so_luong_tham_gia;
      document.getElementById('so_luong_dien_gia').textContent = eventData.so_luong_dien_gia;
      document.getElementById('han_huy_dang_ky').textContent = eventData.han_huy_dang_ky;
      
      // Tạo dữ liệu mẫu cho lịch trình
      renderSchedule();
      
      // Tạo dữ liệu mẫu cho người tham gia
      renderParticipants();
      
      // Tạo dữ liệu mẫu cho diễn giả
      renderSpeakers();
    }, 1000);
  }
  
  // Hàm render lịch trình
  function renderSchedule() {
    const lichTrinhContainer = document.getElementById('lich_trinh_container');
    if (!lichTrinhContainer) return;
    
    const lichTrinh = [
      { time: '08:00 - 08:30', activity: 'Đón tiếp đại biểu', person: 'Ban tổ chức' },
      { time: '08:30 - 09:00', activity: 'Khai mạc chương trình', person: 'MC: Nguyễn Thị B' },
      { time: '09:00 - 10:30', activity: 'Phần 1: Kỹ năng giao tiếp và thuyết trình', person: 'TS. Lê Văn A' },
      { time: '10:30 - 10:45', activity: 'Giải lao', person: 'Ban tổ chức' },
      { time: '10:45 - 12:00', activity: 'Phần 2: Kỹ năng làm việc nhóm và quản lý thời gian', person: 'ThS. Phạm Thị C' }
    ];
    
    let lichTrinhHTML = `
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">STT</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thời gian</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hoạt động</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Người phụ trách</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
    `;
    
    lichTrinh.forEach((item, index) => {
      lichTrinhHTML += `
        <tr class="${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}">
          <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${index + 1}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${item.time}</td>
          <td class="px-6 py-4 text-sm text-gray-500">${item.activity}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${item.person}</td>
        </tr>
      `;
    });
    
    lichTrinhHTML += `
          </tbody>
        </table>
      </div>
    `;
    
    lichTrinhContainer.innerHTML = lichTrinhHTML;
  }
  
  // Hàm render người tham gia
  function renderParticipants() {
    const participantsList = document.getElementById('participants_list');
    if (!participantsList) return;
    
    const participants = [
      { name: 'Nguyễn Văn X', email: 'nguyenx@example.com', phone: '0901234567', time: '01/05/2024 10:15', status: 'Đã check-in' },
      { name: 'Trần Thị Y', email: 'trany@example.com', phone: '0909876543', time: '01/05/2024 14:30', status: 'Đã check-in & check-out' },
      { name: 'Lê Văn Z', email: 'levanz@example.com', phone: '0907654321', time: '02/05/2024 09:45', status: 'Đã đăng ký' },
      { name: 'Phạm Thị W', email: 'phamw@example.com', phone: '0903456789', time: '03/05/2024 11:20', status: 'Đã check-in' },
      { name: 'Hoàng Văn V', email: 'hoangv@example.com', phone: '0905678901', time: '04/05/2024 16:10', status: 'Đã hủy đăng ký' }
    ];
    
    let participantsHTML = '';
    
    participants.forEach((participant) => {
      let statusClass = '';
      
      switch (participant.status) {
        case 'Đã check-in':
          statusClass = 'bg-green-100 text-green-800';
          break;
        case 'Đã check-in & check-out':
          statusClass = 'bg-purple-100 text-purple-800';
          break;
        case 'Đã đăng ký':
          statusClass = 'bg-blue-100 text-blue-800';
          break;
        case 'Đã hủy đăng ký':
          statusClass = 'bg-red-100 text-red-800';
          break;
        default:
          statusClass = 'bg-gray-100 text-gray-800';
      }
      
      participantsHTML += `
        <tr>
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="flex items-center">
              <div class="text-sm font-medium text-gray-900">${participant.name}</div>
            </div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="text-sm text-gray-500">${participant.email}</div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="text-sm text-gray-500">${participant.phone}</div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="text-sm text-gray-500">${participant.time}</div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClass}">
              ${participant.status}
            </span>
          </td>
        </tr>
      `;
    });
    
    participantsList.innerHTML = participantsHTML;
  }
  
  // Hàm render diễn giả
  function renderSpeakers() {
    const speakersList = document.getElementById('speakers_list');
    if (!speakersList) return;
    
    const speakers = [
      {
        name: 'TS. Lê Văn A',
        position: 'Giảng viên cao cấp',
        institution: 'Trường Đại học Ngân hàng TP.HCM',
        topic: 'Kỹ năng giao tiếp và thuyết trình',
        avatar: 'https://via.placeholder.com/150?text=TS.+Lê+Văn+A'
      },
      {
        name: 'ThS. Phạm Thị C',
        position: 'Chuyên gia đào tạo',
        institution: 'Viện Nghiên cứu Kỹ năng Mềm',
        topic: 'Kỹ năng làm việc nhóm',
        avatar: 'https://via.placeholder.com/150?text=ThS.+Phạm+Thị+C'
      },
      {
        name: 'TS. Trần Văn D',
        position: 'Giám đốc đào tạo',
        institution: 'Công ty ABC',
        topic: 'Kỹ năng quản lý thời gian',
        avatar: 'https://via.placeholder.com/150?text=TS.+Trần+Văn+D'
      }
    ];
    
    let speakersHTML = '';
    
    speakers.forEach((speaker) => {
      speakersHTML += `
        <div class="bg-white overflow-hidden shadow-sm rounded-lg">
          <div class="p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0 h-16 w-16">
                <img class="h-16 w-16 rounded-full object-cover" src="${speaker.avatar}" alt="${speaker.name}">
              </div>
              <div class="ml-4">
                <h3 class="text-lg font-medium text-gray-900">${speaker.name}</h3>
                <p class="text-sm text-gray-500">${speaker.position}</p>
                <p class="text-sm text-gray-500">${speaker.institution}</p>
              </div>
            </div>
            <div class="mt-4">
              <p class="text-sm font-medium text-gray-700">Chủ đề:</p>
              <p class="text-sm text-gray-900">${speaker.topic}</p>
            </div>
          </div>
        </div>
      `;
    });
    
    speakersList.innerHTML = speakersHTML;
  }
});
