// Initialize AOS
AOS.init();

// Initialize TinyMCE
tinymce.init({
  selector: '#mo_ta_su_kien, #chi_tiet_su_kien',
  plugins: 'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount',
  toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat',
});

// Handle sidebar toggle
const sidebarToggle = document.getElementById('sidebar-toggle');
const sidebar = document.getElementById('sidebar');

if (sidebarToggle) {
  sidebarToggle.addEventListener('click', () => {
    sidebar.classList.toggle('-translate-x-full');
  });
}

// Get event ID from URL
const urlParams = new URLSearchParams(window.location.search);
const eventId = urlParams.get('id');

// Load event types
async function loadEventTypes() {
  try {
    const response = await fetch('/api/event-types');
    if (!response.ok) throw new Error('Không thể lấy danh sách loại sự kiện');
    const data = await response.json();
    
    const select = document.getElementById('loai_su_kien_id');
    data.forEach(type => {
      const option = document.createElement('option');
      option.value = type.loai_su_kien_id;
      option.textContent = type.ten_loai_su_kien;
      select.appendChild(option);
    });
  } catch (error) {
    console.error('Lỗi khi lấy danh sách loại sự kiện:', error);
    alert('Có lỗi xảy ra khi tải danh sách loại sự kiện');
  }
}

// Load event details
async function loadEventDetails() {
  try {
    const response = await fetch(`/api/events/${eventId}`);
    if (!response.ok) throw new Error('Không thể lấy thông tin sự kiện');
    const data = await response.json();
    
    // Update form fields
    document.getElementById('ten_su_kien').value = data.ten_su_kien;
    document.getElementById('don_vi_to_chuc').value = data.don_vi_to_chuc;
    document.getElementById('don_vi_phoi_hop').value = data.don_vi_phoi_hop;
    document.getElementById('loai_su_kien_id').value = data.loai_su_kien_id;
    document.getElementById('hinh_thuc').value = data.hinh_thuc;
    
    document.getElementById('thoi_gian_bat_dau_su_kien').value = formatDateTime(data.thoi_gian_bat_dau_su_kien);
    document.getElementById('thoi_gian_ket_thuc_su_kien').value = formatDateTime(data.thoi_gian_ket_thuc_su_kien);
    document.getElementById('thoi_gian_bat_dau_dang_ky').value = formatDateTime(data.thoi_gian_bat_dau_dang_ky);
    document.getElementById('thoi_gian_ket_thuc_dang_ky').value = formatDateTime(data.thoi_gian_ket_thuc_dang_ky);
    
    document.getElementById('thoi_gian_checkin_bat_dau').value = formatDateTime(data.thoi_gian_checkin_bat_dau);
    document.getElementById('thoi_gian_checkin_ket_thuc').value = formatDateTime(data.thoi_gian_checkin_ket_thuc);
    document.getElementById('thoi_gian_checkout_bat_dau').value = formatDateTime(data.thoi_gian_checkout_bat_dau);
    document.getElementById('thoi_gian_checkout_ket_thuc').value = formatDateTime(data.thoi_gian_checkout_ket_thuc);
    
    document.getElementById('dia_diem').value = data.dia_diem;
    document.getElementById('dia_chi_cu_the').value = data.dia_chi_cu_the;
    document.getElementById('toa_do_gps').value = data.toa_do_gps;
    document.getElementById('link_online').value = data.link_online;
    document.getElementById('mat_khau_online').value = data.mat_khau_online;
    
    document.getElementById('mo_ta').value = data.mo_ta;
    tinymce.get('mo_ta_su_kien').setContent(data.mo_ta_su_kien || '');
    tinymce.get('chi_tiet_su_kien').setContent(data.chi_tiet_su_kien || '');
    
    document.getElementById('doi_tuong_tham_gia').value = data.doi_tuong_tham_gia;
    
    document.getElementById('cho_phep_check_in').checked = data.cho_phep_check_in;
    document.getElementById('cho_phep_check_out').checked = data.cho_phep_check_out;
    document.getElementById('yeu_cau_face_id').checked = data.yeu_cau_face_id;
    document.getElementById('cho_phep_checkin_thu_cong').checked = data.cho_phep_checkin_thu_cong;
    
    document.getElementById('so_luong_tham_gia').value = data.so_luong_tham_gia;
    document.getElementById('so_luong_dien_gia').value = data.so_luong_dien_gia;
    document.getElementById('han_huy_dang_ky').value = formatDateTime(data.han_huy_dang_ky);
    document.getElementById('gioi_han_loai_nguoi_dung').value = data.gioi_han_loai_nguoi_dung;
    document.getElementById('tu_khoa_su_kien').value = data.tu_khoa_su_kien;
    document.getElementById('hashtag').value = data.hashtag;

    // Hiển thị phần online nếu cần
    if (data.hinh_thuc === 'online' || data.hinh_thuc === 'hybrid') {
      document.getElementById('online_section').classList.remove('hidden');
    }

    // Hiển thị poster nếu có
    if (data.su_kien_poster) {
      const preview = document.getElementById('poster_preview');
      preview.querySelector('img').src = data.su_kien_poster;
      preview.classList.remove('hidden');
    }

  } catch (error) {
    console.error('Lỗi khi lấy thông tin sự kiện:', error);
    alert('Có lỗi xảy ra khi tải thông tin sự kiện');
  }
}

// Helper function to format date time for input fields
function formatDateTime(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toISOString().slice(0, 16);
}

// Validate form data
function validateFormData(formData) {
  // Check required fields
  const requiredFields = ['ten_su_kien', 'don_vi_to_chuc', 'loai_su_kien_id', 'hinh_thuc', 
    'thoi_gian_bat_dau', 'thoi_gian_ket_thuc', 'thoi_gian_bat_dau_dang_ky', 
    'thoi_gian_ket_thuc_dang_ky', 'dia_diem', 'mo_ta'];
    
  for (const field of requiredFields) {
    if (!formData[field]) {
      alert(`Vui lòng điền ${field.replace(/_/g, ' ')}`);
      return false;
    }
  }
  
  // Check date time logic
  const startTime = new Date(formData.thoi_gian_bat_dau);
  const endTime = new Date(formData.thoi_gian_ket_thuc);
  const regStartTime = new Date(formData.thoi_gian_bat_dau_dang_ky);
  const regEndTime = new Date(formData.thoi_gian_ket_thuc_dang_ky);
  
  if (endTime <= startTime) {
    alert('Thời gian kết thúc phải sau thời gian bắt đầu');
    return false;
  }
  
  if (regEndTime <= regStartTime) {
    alert('Thời gian kết thúc đăng ký phải sau thời gian bắt đầu đăng ký');
    return false;
  }
  
  if (regEndTime >= startTime) {
    alert('Thời gian kết thúc đăng ký phải trước thời gian bắt đầu sự kiện');
    return false;
  }
  
  return true;
}

// Save event
async function saveEvent() {
  try {
    const formData = new FormData();
    
    // Thông tin cơ bản
    formData.append('ten_su_kien', document.getElementById('ten_su_kien').value);
    formData.append('don_vi_to_chuc', document.getElementById('don_vi_to_chuc').value);
    formData.append('don_vi_phoi_hop', document.getElementById('don_vi_phoi_hop').value);
    formData.append('loai_su_kien_id', document.getElementById('loai_su_kien_id').value);
    formData.append('hinh_thuc', document.getElementById('hinh_thuc').value);
    
    // Xử lý file poster
    const posterFile = document.getElementById('su_kien_poster').files[0];
    if (posterFile) {
      formData.append('su_kien_poster', posterFile);
    }
    
    // Thời gian
    formData.append('thoi_gian_bat_dau_su_kien', document.getElementById('thoi_gian_bat_dau_su_kien').value);
    formData.append('thoi_gian_ket_thuc_su_kien', document.getElementById('thoi_gian_ket_thuc_su_kien').value);
    formData.append('thoi_gian_bat_dau_dang_ky', document.getElementById('thoi_gian_bat_dau_dang_ky').value);
    formData.append('thoi_gian_ket_thuc_dang_ky', document.getElementById('thoi_gian_ket_thuc_dang_ky').value);
    formData.append('thoi_gian_checkin_bat_dau', document.getElementById('thoi_gian_checkin_bat_dau').value);
    formData.append('thoi_gian_checkin_ket_thuc', document.getElementById('thoi_gian_checkin_ket_thuc').value);
    formData.append('thoi_gian_checkout_bat_dau', document.getElementById('thoi_gian_checkout_bat_dau').value);
    formData.append('thoi_gian_checkout_ket_thuc', document.getElementById('thoi_gian_checkout_ket_thuc').value);
    
    // Địa điểm
    formData.append('dia_diem', document.getElementById('dia_diem').value);
    formData.append('dia_chi_cu_the', document.getElementById('dia_chi_cu_the').value);
    formData.append('toa_do_gps', document.getElementById('toa_do_gps').value);
    formData.append('link_online', document.getElementById('link_online').value);
    formData.append('mat_khau_online', document.getElementById('mat_khau_online').value);
    
    // Mô tả
    formData.append('mo_ta', document.getElementById('mo_ta').value);
    formData.append('mo_ta_su_kien', tinymce.get('mo_ta_su_kien').getContent());
    formData.append('chi_tiet_su_kien', tinymce.get('chi_tiet_su_kien').getContent());
    formData.append('doi_tuong_tham_gia', document.getElementById('doi_tuong_tham_gia').value);
    
    // Cấu hình điểm danh
    formData.append('cho_phep_check_in', document.getElementById('cho_phep_check_in').checked);
    formData.append('cho_phep_check_out', document.getElementById('cho_phep_check_out').checked);
    formData.append('yeu_cau_face_id', document.getElementById('yeu_cau_face_id').checked);
    formData.append('cho_phep_checkin_thu_cong', document.getElementById('cho_phep_checkin_thu_cong').checked);
    
    // Cấu hình khác
    formData.append('so_luong_tham_gia', document.getElementById('so_luong_tham_gia').value);
    formData.append('so_luong_dien_gia', document.getElementById('so_luong_dien_gia').value);
    formData.append('han_huy_dang_ky', document.getElementById('han_huy_dang_ky').value);
    formData.append('gioi_han_loai_nguoi_dung', document.getElementById('gioi_han_loai_nguoi_dung').value);
    formData.append('tu_khoa_su_kien', document.getElementById('tu_khoa_su_kien').value);
    formData.append('hashtag', document.getElementById('hashtag').value);
    
    // Gửi request
    const url = eventId ? `/api/events/${eventId}` : '/api/events';
    const method = eventId ? 'PUT' : 'POST';
    
    const response = await fetch(url, {
      method: method,
      body: formData
    });
    
    if (!response.ok) throw new Error('Không thể lưu thông tin sự kiện');
    
    showToast('success', 'Đã lưu thông tin sự kiện thành công');
    setTimeout(() => {
      window.location.href = '/admin/events';
    }, 1500);
    
  } catch (error) {
    console.error('Lỗi khi lưu thông tin sự kiện:', error);
    showToast('error', 'Không thể lưu thông tin sự kiện');
  }
}

// Xử lý hiển thị/ẩn phần online khi thay đổi hình thức tổ chức
document.getElementById('hinh_thuc').addEventListener('change', function(e) {
  const onlineSection = document.getElementById('online_section');
  if (e.target.value === 'online' || e.target.value === 'hybrid') {
    onlineSection.classList.remove('hidden');
  } else {
    onlineSection.classList.add('hidden');
  }
});

// Xử lý preview ảnh poster
document.getElementById('su_kien_poster').addEventListener('change', function(e) {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      const preview = document.getElementById('poster_preview');
      preview.querySelector('img').src = e.target.result;
      preview.classList.remove('hidden');
    };
    reader.readAsDataURL(file);
  }
});

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
  if (!eventId) {
    alert('Không tìm thấy ID sự kiện');
    window.location.href = 'events.html';
    return;
  }
  
  loadEventTypes();
  loadEventDetails();
});

// Hiển thị thông báo
function showToast(type, message) {
  // Implement toast notification
  console.log(`${type}: ${message}`);
} 