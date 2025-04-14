// Khởi tạo AOS (Animate on Scroll)
AOS.init();

// Biến trạng thái
let allSpeakers = []; // Tất cả diễn giả
let filteredSpeakers = []; // Diễn giả sau khi lọc
let currentPage = 1;
let itemsPerPage = 10;
let totalPages = 1;

// Xử lý toggle sidebar
document.addEventListener('DOMContentLoaded', function () {
  // Sự kiện mở sidebar (mobile)
  const sidebarOpen = document.getElementById('sidebar-open');
  const sidebar = document.getElementById('sidebar');
  const sidebarBackdrop = document.getElementById('sidebar-backdrop');
  const sidebarClose = document.getElementById('sidebar-close');

  sidebarOpen?.addEventListener('click', function () {
    sidebar.classList.remove('-translate-x-full');
    sidebarBackdrop.classList.remove('hidden');
  });

  // Sự kiện đóng sidebar (mobile)
  function closeSidebar() {
    sidebar.classList.add('-translate-x-full');
    sidebarBackdrop.classList.add('hidden');
  }

  sidebarClose?.addEventListener('click', closeSidebar);
  sidebarBackdrop?.addEventListener('click', closeSidebar);

  // Xử lý modal diễn giả
  const createSpeakerBtn = document.getElementById('create-speaker-btn');
  const speakerModal = document.getElementById('speaker-modal');
  const speakerForm = document.getElementById('speaker-form');

  // Mở modal khi click vào nút tạo diễn giả mới
  createSpeakerBtn?.addEventListener('click', function () {
    openSpeakerModal();
  });

  // Xử lý submit form diễn giả
  speakerForm?.addEventListener('submit', function (e) {
    e.preventDefault();
    
    // Giả lập thêm diễn giả mới
    const formData = new FormData(speakerForm);
    const newSpeaker = {
      id: allSpeakers.length + 1,
      ten_dien_gia: formData.get('ten_dien_gia'),
      chuc_danh: formData.get('chuc_danh'),
      to_chuc: formData.get('to_chuc'),
      email: formData.get('email'),
      dien_thoai: formData.get('dien_thoai'),
      chuyen_mon: formData.get('chuyen_mon'),
      gioi_thieu: formData.get('gioi_thieu'),
      thanh_tuu: formData.get('thanh_tuu'),
      trang_thai: formData.get('trang_thai'),
      website: formData.get('website'),
      facebook: formData.get('facebook'),
      linkedin: formData.get('linkedin'),
      twitter: formData.get('twitter'),
      hinh_anh: 'https://i.pravatar.cc/150?img=' + (Math.floor(Math.random() * 70) + 1)
    };

    // Thêm diễn giả mới vào danh sách và hiển thị
    allSpeakers.unshift(newSpeaker);
    applyFilters();
    
    // Hiển thị thông báo thành công (có thể thay bằng toast notification)
    alert('Đã thêm diễn giả mới thành công!');
    
    // Đóng modal và reset form
    closeSpeakerModal();
    speakerForm.reset();
  });

  // Khởi tạo dữ liệu mẫu và hiển thị danh sách diễn giả
  initSpeakersData();
  applyFilters();

  // Xử lý sự kiện lọc diễn giả
  const filterForm = document.getElementById('filter-form');
  const resetFilterBtn = document.getElementById('reset-filter-btn');

  filterForm?.addEventListener('submit', function (e) {
    e.preventDefault();
    currentPage = 1; // Reset về trang đầu tiên khi lọc
    applyFilters();
  });

  resetFilterBtn?.addEventListener('click', function () {
    setTimeout(() => {
      currentPage = 1;
      applyFilters();
    }, 0);
  });

  // Xử lý phân trang
  setupPagination();
});

// Mở modal thêm/sửa diễn giả
function openSpeakerModal(speaker = null) {
  const modal = document.getElementById('speaker-modal');
  const form = document.getElementById('speaker-form');
  const modalTitle = modal.querySelector('h3');

  if (speaker) {
    // Chế độ sửa
    modalTitle.textContent = 'Cập nhật thông tin diễn giả';
    
    // Điền dữ liệu vào form
    form.elements['ten_dien_gia'].value = speaker.ten_dien_gia;
    form.elements['chuc_danh'].value = speaker.chuc_danh || '';
    form.elements['to_chuc'].value = speaker.to_chuc;
    form.elements['email'].value = speaker.email;
    form.elements['dien_thoai'].value = speaker.dien_thoai || '';
    form.elements['chuyen_mon'].value = speaker.chuyen_mon;
    form.elements['gioi_thieu'].value = speaker.gioi_thieu || '';
    form.elements['thanh_tuu'].value = speaker.thanh_tuu || '';
    form.elements['trang_thai'].value = speaker.trang_thai;
    form.elements['website'].value = speaker.website || '';
    form.elements['facebook'].value = speaker.facebook || '';
    form.elements['linkedin'].value = speaker.linkedin || '';
    form.elements['twitter'].value = speaker.twitter || '';
    
    // Thêm id cho việc cập nhật
    form.dataset.speakerId = speaker.id;
  } else {
    // Chế độ thêm mới
    modalTitle.textContent = 'Thêm diễn giả mới';
    form.reset();
    delete form.dataset.speakerId;
  }

  modal.classList.remove('hidden');
}

// Đóng modal diễn giả
function closeSpeakerModal() {
  const modal = document.getElementById('speaker-modal');
  modal.classList.add('hidden');
}

// Tạo dữ liệu mẫu cho 20 diễn giả
function initSpeakersData() {
  const organizations = [
    'Đại học Bách Khoa Hà Nội', 
    'Đại học Quốc gia Hà Nội', 
    'Đại học FPT', 
    'Đại học Kinh tế Quốc dân',
    'Viettel Group', 
    'FPT Software', 
    'VNG Corporation', 
    'VinGroup', 
    'Viện Nghiên cứu Ứng dụng Khoa học và Công nghệ',
    'Tổng công ty Viễn thông MobiFone'
  ];
  
  const expertise = [
    'Trí tuệ nhân tạo', 
    'Phát triển phần mềm', 
    'Kinh tế số', 
    'Marketing trực tuyến',
    'Khoa học dữ liệu', 
    'Blockchain', 
    'IoT', 
    'Quản trị kinh doanh',
    'Tài chính ngân hàng', 
    'An ninh mạng', 
    'Thương mại điện tử',
    'Chuyển đổi số'
  ];
  
  const positions = [
    'Giáo sư', 
    'Phó giáo sư', 
    'Tiến sĩ', 
    'Thạc sĩ',
    'Giám đốc điều hành', 
    'Chuyên gia', 
    'Giám đốc kỹ thuật', 
    'Trưởng phòng nghiên cứu',
    'Nghiên cứu viên', 
    'Quản lý cấp cao'
  ];
  
  const firstNames = ['Minh', 'Hùng', 'Thắng', 'Nam', 'Anh', 'Tuấn', 'Hà', 'Lan', 'Thảo', 'Linh'];
  const lastNames = ['Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Huỳnh', 'Vũ', 'Võ', 'Phan', 'Đặng'];
  
  allSpeakers = Array.from({ length: 20 }, (_, i) => {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const fullName = `${lastName} ${firstName}`;
    const org = organizations[Math.floor(Math.random() * organizations.length)];
    const exp = Array.from(
      { length: Math.floor(Math.random() * 3) + 1 },
      () => expertise[Math.floor(Math.random() * expertise.length)]
    ).join(', ');
    const pos = positions[Math.floor(Math.random() * positions.length)];
    
    return {
      id: i + 1,
      ten_dien_gia: fullName,
      chuc_danh: pos,
      to_chuc: org,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
      dien_thoai: `0${Math.floor(Math.random() * 900000000) + 100000000}`,
      chuyen_mon: exp,
      gioi_thieu: `Chuyên gia hàng đầu trong lĩnh vực ${exp.split(',')[0]}`,
      thanh_tuu: `Có nhiều công trình nghiên cứu và dự án trong lĩnh vực ${exp}`,
      trang_thai: Math.random() > 0.2 ? '1' : '0', // 80% hoạt động, 20% không hoạt động
      website: Math.random() > 0.5 ? `https://www.${firstName.toLowerCase()}${lastName.toLowerCase()}.com` : '',
      facebook: Math.random() > 0.4 ? `https://facebook.com/${firstName.toLowerCase()}.${lastName.toLowerCase()}` : '',
      linkedin: Math.random() > 0.3 ? `https://linkedin.com/in/${firstName.toLowerCase()}-${lastName.toLowerCase()}` : '',
      twitter: Math.random() > 0.7 ? `https://twitter.com/${firstName.toLowerCase()}${lastName.toLowerCase()}` : '',
      hinh_anh: `https://i.pravatar.cc/150?img=${i+1}`
    };
  });
}

// Lọc danh sách diễn giả theo bộ lọc
function applyFilters() {
  const nameFilter = document.getElementById('filter-name').value.toLowerCase();
  const organizationFilter = document.getElementById('filter-organization').value;
  const expertiseFilter = document.getElementById('filter-expertise').value.toLowerCase();
  const statusFilter = document.getElementById('filter-status').value;
  
  filteredSpeakers = allSpeakers.filter(speaker => {
    // Lọc theo tên
    if (nameFilter && !speaker.ten_dien_gia.toLowerCase().includes(nameFilter)) {
      return false;
    }
    
    // Lọc theo tổ chức
    if (organizationFilter) {
      let matchesOrg = false;
      switch(organizationFilter) {
        case 'university':
          matchesOrg = speaker.to_chuc.toLowerCase().includes('đại học') || 
                      speaker.to_chuc.toLowerCase().includes('university');
          break;
        case 'company':
          matchesOrg = !speaker.to_chuc.toLowerCase().includes('đại học') && 
                      !speaker.to_chuc.toLowerCase().includes('viện') &&
                      !speaker.to_chuc.toLowerCase().includes('university') &&
                      !speaker.to_chuc.toLowerCase().includes('institute');
          break;
        case 'institute':
          matchesOrg = speaker.to_chuc.toLowerCase().includes('viện') || 
                      speaker.to_chuc.toLowerCase().includes('institute');
          break;
      }
      if (!matchesOrg) return false;
    }
    
    // Lọc theo chuyên môn
    if (expertiseFilter && !speaker.chuyen_mon.toLowerCase().includes(expertiseFilter)) {
      return false;
    }
    
    // Lọc theo trạng thái
    if (statusFilter && speaker.trang_thai !== statusFilter) {
      return false;
    }
    
    return true;
  });
  
  // Cập nhật phân trang và hiển thị
  totalPages = Math.ceil(filteredSpeakers.length / itemsPerPage);
  if (currentPage > totalPages && totalPages > 0) {
    currentPage = totalPages;
  }
  
  renderSpeakers();
  updatePagination();
}

// Hiển thị danh sách diễn giả
function renderSpeakers() {
  const tableBody = document.getElementById('speakers-table-body');
  
  // Tính toán chỉ mục bắt đầu và kết thúc cho trang hiện tại
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filteredSpeakers.length);
  
  // Nếu không có diễn giả nào
  if (filteredSpeakers.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="6" class="px-6 py-4 text-center text-gray-500">
          Không tìm thấy diễn giả nào phù hợp với bộ lọc
        </td>
      </tr>
    `;
    return;
  }
  
  // Tạo các hàng trong bảng
  tableBody.innerHTML = filteredSpeakers.slice(startIndex, endIndex).map(speaker => {
    return `
      <tr class="hover:bg-gray-50 transition-colors duration-200">
        <td class="px-6 py-4 whitespace-nowrap">
          <div class="flex items-center">
            <div class="flex-shrink-0 h-10 w-10">
              <img class="h-10 w-10 rounded-full object-cover" src="${speaker.hinh_anh}" alt="${speaker.ten_dien_gia}">
            </div>
            <div class="ml-4">
              <div class="text-sm font-medium text-gray-900">${speaker.ten_dien_gia}</div>
              <div class="text-sm text-gray-500">${speaker.chuc_danh || ''}</div>
            </div>
          </div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
          <div class="text-sm text-gray-900"><i class="ri-mail-line mr-1"></i> ${speaker.email}</div>
          ${speaker.dien_thoai ? `<div class="text-sm text-gray-500"><i class="ri-phone-line mr-1"></i> ${speaker.dien_thoai}</div>` : ''}
        </td>
        <td class="px-6 py-4">
          <div class="text-sm text-gray-900">${speaker.chuyen_mon}</div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
          <div class="text-sm text-gray-900">${speaker.to_chuc}</div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
          ${speaker.trang_thai === '1' 
            ? '<span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Hoạt động</span>'
            : '<span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Không hoạt động</span>'
          }
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
          <div class="flex justify-end space-x-2">
            <button onclick="viewSpeaker(${speaker.id})" class="text-blue-600 hover:text-blue-900" title="Xem chi tiết">
              <i class="ri-eye-line"></i>
            </button>
            <button onclick="editSpeaker(${speaker.id})" class="text-indigo-600 hover:text-indigo-900" title="Chỉnh sửa">
              <i class="ri-edit-line"></i>
            </button>
            <button onclick="deleteSpeaker(${speaker.id})" class="text-red-600 hover:text-red-900" title="Xóa">
              <i class="ri-delete-bin-line"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
  
  // Cập nhật tổng số diễn giả hiển thị
  const totalItemsCount = document.getElementById('total-items-count');
  totalItemsCount.textContent = filteredSpeakers.length;
}

// Cập nhật các điều khiển phân trang
function updatePagination() {
  const totalItemsElement = document.getElementById('total-items-count');
  const totalPagesElement = document.getElementById('total-pages-count');
  const currentPageInput = document.getElementById('current-page-input');
  const btnFirst = document.querySelector('.btn-first');
  const btnPrev = document.querySelector('.btn-prev');
  const btnNext = document.querySelector('.btn-next');
  const btnLast = document.querySelector('.btn-last');
  
  // Cập nhật thông tin
  totalItemsElement.textContent = filteredSpeakers.length;
  totalPagesElement.textContent = totalPages;
  currentPageInput.value = currentPage;
  currentPageInput.max = totalPages;
  
  // Cập nhật trạng thái nút phân trang
  btnFirst.disabled = currentPage === 1;
  btnPrev.disabled = currentPage === 1;
  btnNext.disabled = currentPage === totalPages || totalPages === 0;
  btnLast.disabled = currentPage === totalPages || totalPages === 0;
}

// Thiết lập các sự kiện cho phân trang
function setupPagination() {
  const itemsPerPageSelect = document.getElementById('items-per-page');
  const currentPageInput = document.getElementById('current-page-input');
  const btnFirst = document.querySelector('.btn-first');
  const btnPrev = document.querySelector('.btn-prev');
  const btnNext = document.querySelector('.btn-next');
  const btnLast = document.querySelector('.btn-last');
  
  // Thay đổi số lượng mục trên mỗi trang
  itemsPerPageSelect?.addEventListener('change', function () {
    itemsPerPage = parseInt(this.value);
    currentPage = 1;
    totalPages = Math.ceil(filteredSpeakers.length / itemsPerPage);
    renderSpeakers();
    updatePagination();
  });
  
  // Nhập trực tiếp số trang
  currentPageInput?.addEventListener('change', function () {
    let page = parseInt(this.value);
    if (isNaN(page) || page < 1) {
      page = 1;
    } else if (page > totalPages) {
      page = totalPages;
    }
    currentPage = page;
    this.value = page;
    renderSpeakers();
    updatePagination();
  });
  
  // Các nút điều hướng phân trang
  btnFirst?.addEventListener('click', function () {
    if (currentPage !== 1) {
      currentPage = 1;
      renderSpeakers();
      updatePagination();
    }
  });
  
  btnPrev?.addEventListener('click', function () {
    if (currentPage > 1) {
      currentPage--;
      renderSpeakers();
      updatePagination();
    }
  });
  
  btnNext?.addEventListener('click', function () {
    if (currentPage < totalPages) {
      currentPage++;
      renderSpeakers();
      updatePagination();
    }
  });
  
  btnLast?.addEventListener('click', function () {
    if (currentPage !== totalPages) {
      currentPage = totalPages;
      renderSpeakers();
      updatePagination();
    }
  });
}

// Xem chi tiết diễn giả
function viewSpeaker(id) {
  const speaker = allSpeakers.find(s => s.id === id);
  if (!speaker) return;
  
  // Hiển thị thông tin chi tiết (có thể thay bằng modal hoặc chuyển hướng trang)
  alert(`Thông tin chi tiết diễn giả: ${speaker.ten_dien_gia}\n- Chức danh: ${speaker.chuc_danh || 'Không có'}\n- Tổ chức: ${speaker.to_chuc}\n- Email: ${speaker.email}\n- Điện thoại: ${speaker.dien_thoai || 'Không có'}\n- Chuyên môn: ${speaker.chuyen_mon}\n- Trạng thái: ${speaker.trang_thai === '1' ? 'Hoạt động' : 'Không hoạt động'}`);
}

// Chỉnh sửa diễn giả
function editSpeaker(id) {
  const speaker = allSpeakers.find(s => s.id === id);
  if (!speaker) return;
  
  // Mở modal chỉnh sửa
  openSpeakerModal(speaker);
}

// Xóa diễn giả
function deleteSpeaker(id) {
  if (confirm('Bạn có chắc chắn muốn xóa diễn giả này không?')) {
    allSpeakers = allSpeakers.filter(s => s.id !== id);
    applyFilters();
    alert('Đã xóa diễn giả thành công!');
  }
}
