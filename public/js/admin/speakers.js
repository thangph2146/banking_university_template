// ============= KHỞI TẠO BIẾN VÀ HẰNG SỐ =============
// Khởi tạo AOS
AOS.init();

// Biến trạng thái dữ liệu
const speakerState = {
  allSpeakers: [],         // Tất cả diễn giả
  filteredSpeakers: [],    // Diễn giả sau khi lọc
  currentPage: 1,          // Trang hiện tại
  itemsPerPage: 10,        // Số mục trên mỗi trang
  totalPages: 1            // Tổng số trang
};

// ============= XỬ LÝ UI CHUNG VÀ SIDEBAR =============
// Xử lý DOM khi tải trang
document.addEventListener('DOMContentLoaded', function () {
  // Khởi tạo các sự kiện UI
  initSidebarHandlers();
  initModalHandlers();
  
  // Khởi tạo dữ liệu và hiển thị
  initSpeakersData();
  applyFilters();
  
  // Thiết lập sự kiện cho filter
  setupFilterHandlers();
  
  // Thiết lập sự kiện cho phân trang
  setupPaginationHandlers();
});

// Xử lý sidebar
function initSidebarHandlers() {
  const sidebarOpen = document.getElementById('sidebar-open');
  const sidebar = document.getElementById('sidebar');
  const sidebarBackdrop = document.getElementById('sidebar-backdrop');
  const sidebarClose = document.getElementById('sidebar-close');

  // Mở sidebar trên mobile
  sidebarOpen?.addEventListener('click', function () {
    sidebar.classList.remove('-translate-x-full');
    sidebarBackdrop.classList.remove('hidden');
  });

  // Đóng sidebar trên mobile
  const closeSidebar = () => {
    sidebar.classList.add('-translate-x-full');
    sidebarBackdrop.classList.add('hidden');
  };

  sidebarClose?.addEventListener('click', closeSidebar);
  sidebarBackdrop?.addEventListener('click', closeSidebar);
}

// ============= XỬ LÝ MODAL DIỄN GIẢ =============
// Khởi tạo sự kiện cho modal
function initModalHandlers() {
  const createSpeakerBtn = document.getElementById('create-speaker-btn');
  const speakerForm = document.getElementById('speaker-form');
  
  // Sự kiện khi click nút thêm diễn giả
  createSpeakerBtn?.addEventListener('click', () => openSpeakerModal());
  
  // Xử lý khi gửi form
  speakerForm?.addEventListener('submit', handleSpeakerFormSubmit);
}

// Mở modal thêm/sửa diễn giả
function openSpeakerModal(speaker = null) {
  const modal = document.getElementById('speaker-modal');
  const form = document.getElementById('speaker-form');
  const modalTitle = modal.querySelector('h3');

  if (speaker) {
    // Chế độ sửa diễn giả
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
    
    // Lưu ID của diễn giả đang chỉnh sửa
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

// Xử lý submit form diễn giả
function handleSpeakerFormSubmit(e) {
  e.preventDefault();
  
  const form = e.target;
  const formData = new FormData(form);
  const speakerId = form.dataset.speakerId;
  
  // Xây dựng đối tượng diễn giả từ form
  const speakerData = {
    id: speakerId ? parseInt(speakerId) : speakerState.allSpeakers.length + 1,
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

  if (speakerId) {
    // Cập nhật diễn giả đã tồn tại
    const index = speakerState.allSpeakers.findIndex(s => s.id === parseInt(speakerId));
    if (index !== -1) {
      speakerState.allSpeakers[index] = speakerData;
      alert('Đã cập nhật thông tin diễn giả thành công!');
    }
  } else {
    // Thêm diễn giả mới
    speakerState.allSpeakers.unshift(speakerData);
    alert('Đã thêm diễn giả mới thành công!');
  }
  
  // Cập nhật hiển thị danh sách
  applyFilters();
  
  // Đóng modal và reset form
  closeSpeakerModal();
  form.reset();
}

// ============= KHỞI TẠO VÀ XỬ LÝ DỮ LIỆU =============
// Tạo dữ liệu mẫu cho diễn giả
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
  
  // Tạo mảng 20 diễn giả mẫu
  speakerState.allSpeakers = Array.from({ length: 20 }, (_, i) => {
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

// ============= XỬ LÝ BỘ LỌC VÀ TÌM KIẾM =============
// Thiết lập sự kiện cho bộ lọc
function setupFilterHandlers() {
  const filterForm = document.getElementById('filter-form');
  const resetFilterBtn = document.getElementById('reset-filter-btn');

  // Sự kiện khi submit form lọc
  filterForm?.addEventListener('submit', function (e) {
    e.preventDefault();
    speakerState.currentPage = 1; // Reset về trang đầu tiên khi lọc
    applyFilters();
  });

  // Sự kiện khi reset bộ lọc
  resetFilterBtn?.addEventListener('click', function () {
    setTimeout(() => {
      speakerState.currentPage = 1;
      applyFilters();
    }, 0);
  });
}

// Lọc danh sách diễn giả theo bộ lọc
function applyFilters() {
  const nameFilter = document.getElementById('filter-name')?.value.toLowerCase() || '';
  const organizationFilter = document.getElementById('filter-organization')?.value || '';
  const expertiseFilter = document.getElementById('filter-expertise')?.value.toLowerCase() || '';
  const statusFilter = document.getElementById('filter-status')?.value || '';
  
  // Áp dụng các bộ lọc lên danh sách diễn giả
  speakerState.filteredSpeakers = speakerState.allSpeakers.filter(speaker => {
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
  updatePagination();
  renderSpeakers();
}

// ============= XỬ LÝ PHÂN TRANG =============
// Cập nhật thông tin phân trang
function updatePagination() {
  const totalItems = speakerState.filteredSpeakers.length;
  speakerState.totalPages = Math.max(1, Math.ceil(totalItems / speakerState.itemsPerPage));
  
  // Đảm bảo trang hiện tại không vượt quá tổng số trang
  if (speakerState.currentPage > speakerState.totalPages) {
    speakerState.currentPage = Math.max(1, speakerState.totalPages);
  }
  
  // Cập nhật UI phân trang
  const totalItemsElement = document.getElementById('total-items-count');
  const totalPagesElement = document.getElementById('total-pages-count');
  const currentPageInput = document.getElementById('current-page-input');
  const btnFirst = document.querySelector('.btn-first');
  const btnPrev = document.querySelector('.btn-prev');
  const btnNext = document.querySelector('.btn-next');
  const btnLast = document.querySelector('.btn-last');
  
  if (totalItemsElement) totalItemsElement.textContent = totalItems;
  if (totalPagesElement) totalPagesElement.textContent = speakerState.totalPages;
  if (currentPageInput) currentPageInput.value = speakerState.currentPage;
  
  // Cập nhật trạng thái các nút điều hướng
  if (btnFirst) btnFirst.disabled = speakerState.currentPage === 1;
  if (btnPrev) btnPrev.disabled = speakerState.currentPage === 1;
  if (btnNext) btnNext.disabled = speakerState.currentPage === speakerState.totalPages || speakerState.totalPages === 0;
  if (btnLast) btnLast.disabled = speakerState.currentPage === speakerState.totalPages || speakerState.totalPages === 0;
}

// Thiết lập các sự kiện cho phân trang
function setupPaginationHandlers() {
  const itemsPerPageSelect = document.getElementById('items-per-page');
  const currentPageInput = document.getElementById('current-page-input');
  const btnFirst = document.querySelector('.btn-first');
  const btnPrev = document.querySelector('.btn-prev');
  const btnNext = document.querySelector('.btn-next');
  const btnLast = document.querySelector('.btn-last');
  
  // Thay đổi số lượng item trên mỗi trang
  itemsPerPageSelect?.addEventListener('change', function () {
    speakerState.itemsPerPage = parseInt(this.value);
    speakerState.currentPage = 1;
    updatePagination();
    renderSpeakers();
  });
  
  // Thay đổi trang hiện tại
  currentPageInput?.addEventListener('change', function () {
    let page = parseInt(this.value);
    if (isNaN(page) || page < 1) {
      page = 1;
    } else if (page > speakerState.totalPages) {
      page = speakerState.totalPages;
    }
    speakerState.currentPage = page;
    this.value = page;
    renderSpeakers();
    updatePagination();
  });
  
  // Điều hướng đến trang đầu tiên
  btnFirst?.addEventListener('click', function () {
    if (speakerState.currentPage !== 1) {
      speakerState.currentPage = 1;
      renderSpeakers();
      updatePagination();
    }
  });
  
  // Điều hướng đến trang trước
  btnPrev?.addEventListener('click', function () {
    if (speakerState.currentPage > 1) {
      speakerState.currentPage--;
      renderSpeakers();
      updatePagination();
    }
  });
  
  // Điều hướng đến trang tiếp theo
  btnNext?.addEventListener('click', function () {
    if (speakerState.currentPage < speakerState.totalPages) {
      speakerState.currentPage++;
      renderSpeakers();
      updatePagination();
    }
  });
  
  // Điều hướng đến trang cuối cùng
  btnLast?.addEventListener('click', function () {
    if (speakerState.currentPage !== speakerState.totalPages) {
      speakerState.currentPage = speakerState.totalPages;
      renderSpeakers();
      updatePagination();
    }
  });
}

// Hiển thị danh sách diễn giả
function renderSpeakers() {
  const tableBody = document.getElementById('speakers-table-body');
  if (!tableBody) return;
  
  // Tính toán chỉ mục bắt đầu và kết thúc cho trang hiện tại
  const startIndex = (speakerState.currentPage - 1) * speakerState.itemsPerPage;
  const endIndex = Math.min(startIndex + speakerState.itemsPerPage, speakerState.filteredSpeakers.length);
  
  // Nếu không có dữ liệu
  if (speakerState.filteredSpeakers.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="6" class="px-6 py-4 text-center text-gray-500">
          Không tìm thấy diễn giả nào phù hợp với bộ lọc
        </td>
      </tr>
    `;
    return;
  }
  
  // Render từng dòng dữ liệu
  tableBody.innerHTML = speakerState.filteredSpeakers.slice(startIndex, endIndex).map(speaker => {
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
}

// ============= CÁC HÀM TƯƠNG TÁC =============
// Xem chi tiết diễn giả
function viewSpeaker(id) {
  const speaker = speakerState.allSpeakers.find(s => s.id === id);
  if (!speaker) return;
  
  // Chuyển tới trang chi tiết diễn giả
  window.location.href = `speaker-detail.html?id=${id}`;
}

// Chỉnh sửa diễn giả
function editSpeaker(id) {
  const speaker = speakerState.allSpeakers.find(s => s.id === id);
  if (!speaker) return;
  
  // Chuyển tới trang chỉnh sửa diễn giả
  window.location.href = `speaker-edit.html?id=${id}`;
}

// Xóa diễn giả
function deleteSpeaker(id) {
  if (confirm('Bạn có chắc chắn muốn xóa diễn giả này không?')) {
    speakerState.allSpeakers = speakerState.allSpeakers.filter(s => s.id !== id);
    applyFilters();
    alert('Đã xóa diễn giả thành công!');
  }
}
