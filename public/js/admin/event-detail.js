// Khởi tạo biến toàn cục
let eventId = null;
let event = null;

// Khởi tạo khi trang được load
document.addEventListener('DOMContentLoaded', function() {
    // Khởi tạo AOS Animation
    AOS.init();

    // Lấy event ID từ URL
    const urlParams = new URLSearchParams(window.location.search);
    eventId = urlParams.get('id');

    if (!eventId) {
        showError('Không tìm thấy ID sự kiện');
        return;
    }

    // Load thông tin sự kiện
    loadEventDetails();

    // Xử lý nút xóa sự kiện
    const deleteBtn = document.getElementById('delete-event-btn');
    if (deleteBtn) {
        deleteBtn.addEventListener('click', handleDeleteEvent);
    }

    // Xử lý nút quay lại
    const backBtn = document.getElementById('back-btn');
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            window.location.href = 'events.html';
        });
    }

    // Xử lý nút chỉnh sửa
    const editBtn = document.getElementById('edit-event-btn');
    if (editBtn) {
        editBtn.addEventListener('click', () => {
            window.location.href = `event-detail-update.html?id=${eventId}`;
        });
    }

    // Xử lý user menu dropdown
    const userMenuButton = document.getElementById('user-menu-button');
    const userMenu = document.getElementById('user-menu');
    
    if (userMenuButton && userMenu) {
        userMenuButton.addEventListener('click', () => {
            const arrow = userMenuButton.querySelector('.ri-arrow-down-s-line');
            userMenu.classList.toggle('opacity-0');
            userMenu.classList.toggle('scale-95');
            userMenu.classList.toggle('invisible');
            arrow.style.transform = userMenu.classList.contains('invisible') ? '' : 'rotate(180deg)';
        });
    }
});

// Hàm load thông tin chi tiết sự kiện
async function loadEventDetails() {
    try {
        const response = await fetch(`/api/events/${eventId}`);
        if (!response.ok) throw new Error('Không thể tải thông tin sự kiện');
        
        event = await response.json();
        renderEventDetails();
    } catch (error) {
        console.error('Lỗi:', error);
        showError('Có lỗi xảy ra khi tải thông tin sự kiện');
    }
}

// Hàm render thông tin chi tiết sự kiện
function renderEventDetails() {
    if (!event) return;

    // Cập nhật tiêu đề
    document.title = `Chi tiết sự kiện - ${event.ten_su_kien}`;
    
    // Cập nhật breadcrumb
    const breadcrumbTitle = document.querySelector('.breadcrumb-title');
    if (breadcrumbTitle) {
        breadcrumbTitle.textContent = event.ten_su_kien;
    }

    // Cập nhật thông tin cơ bản
    document.getElementById('event-name').textContent = event.ten_su_kien;
    document.getElementById('event-organizer').textContent = event.don_vi_to_chuc;
    document.getElementById('event-type').textContent = event.loai_su_kien || 'Chưa phân loại';
    document.getElementById('event-format').textContent = formatEventFormat(event.hinh_thuc);
    
    // Cập nhật thời gian
    document.getElementById('event-start-time').textContent = formatDateTime(event.thoi_gian_bat_dau);
    document.getElementById('event-end-time').textContent = formatDateTime(event.thoi_gian_ket_thuc);
    
    // Cập nhật địa điểm
    document.getElementById('event-location').textContent = event.dia_diem;
    document.getElementById('event-address').textContent = event.dia_chi_cu_the || 'Không có';
    
    // Cập nhật mô tả
    const descriptionElement = document.getElementById('event-description');
    if (descriptionElement) {
        descriptionElement.innerHTML = event.mo_ta || 'Không có mô tả';
    }

    // Cập nhật hình ảnh
    const eventImage = document.getElementById('event-image');
    if (eventImage) {
        eventImage.src = event.hinh_anh || 'https://via.placeholder.com/800x400';
        eventImage.alt = event.ten_su_kien;
    }

    // Cập nhật thông tin đăng ký
    const registrationInfo = document.getElementById('registration-info');
    if (registrationInfo) {
        registrationInfo.innerHTML = `
            <div class="flex items-center space-x-2">
                <i class="ri-user-line text-gray-500"></i>
                <span>${event.tong_dang_ky || 0}/${event.so_luong_tham_gia || 'Không giới hạn'}</span>
            </div>
        `;
    }

    // Cập nhật trạng thái
    const statusElement = document.getElementById('event-status');
    if (statusElement) {
        const status = getEventStatus(event);
        statusElement.innerHTML = `
            <span class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${status.class}">
                ${status.text}
            </span>
        `;
    }
}

// Hàm xử lý xóa sự kiện
async function handleDeleteEvent() {
    if (!confirm('Bạn có chắc chắn muốn xóa sự kiện này?')) return;

    try {
        const response = await fetch(`/api/events/${eventId}`, {
            method: 'DELETE'
        });

        if (!response.ok) throw new Error('Không thể xóa sự kiện');

        showSuccess('Xóa sự kiện thành công');
        window.location.href = 'events.html';
    } catch (error) {
        console.error('Lỗi:', error);
        showError('Có lỗi xảy ra khi xóa sự kiện');
    }
}

// Các hàm tiện ích
function formatDateTime(dateStr) {
    if (!dateStr) return 'Chưa cập nhật';
    const date = new Date(dateStr);
    return date.toLocaleString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function formatEventFormat(format) {
    const formats = {
        'offline': 'Trực tiếp',
        'online': 'Trực tuyến',
        'hybrid': 'Kết hợp'
    };
    return formats[format] || format || 'Chưa cập nhật';
}

function getEventStatus(event) {
    const now = new Date();
    const startDate = new Date(event.thoi_gian_bat_dau);
    const endDate = new Date(event.thoi_gian_ket_thuc);

    if (now < startDate) {
        return {
            text: 'Sắp diễn ra',
            class: 'bg-blue-100 text-blue-800'
        };
    } else if (now >= startDate && now <= endDate) {
        return {
            text: 'Đang diễn ra',
            class: 'bg-green-100 text-green-800'
        };
    } else {
        return {
            text: 'Đã kết thúc',
            class: 'bg-gray-100 text-gray-800'
        };
    }
}

function showSuccess(message) {
    // Implement toast notification
    alert(message);
}

function showError(message) {
    // Implement toast notification
    alert(message);
} 