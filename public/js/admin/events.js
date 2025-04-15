// Sample event data based on su_kien table (20 items)
const allEvents = [
    // Existing 4 events remain the same
    {
        su_kien_id: 1, ten_su_kien: "Hội thảo Blockchain 101", imageUrl: "/images/event-placeholder.jpg",
        thoi_gian_bat_dau_su_kien: "2024-07-20T09:00:00", thoi_gian_ket_thuc_su_kien: "2024-07-20T12:00:00",
        hinh_thuc: "offline", formatClass: "bg-sky-100 text-sky-800", loai_su_kien_id: 1, typeValue: "hoi_thao",
        typeName: "Hội thảo", typeClass: "bg-green-100 text-green-800", dia_diem: "Hội trường A, HUB",
        tong_dang_ky: 150, so_luong_tham_gia: 200, status: 1,
    },
    {
        su_kien_id: 2, ten_su_kien: "Khóa học Lập trình Web Nâng cao", imageUrl: "/images/event-placeholder-2.jpg",
        thoi_gian_bat_dau_su_kien: "2024-08-01T18:00:00", thoi_gian_ket_thuc_su_kien: "2024-08-30T21:00:00",
        hinh_thuc: "offline", formatClass: "bg-sky-100 text-sky-800", loai_su_kien_id: 2, typeValue: "khoa_hoc",
        typeName: "Khoá học", typeClass: "bg-purple-100 text-purple-800", dia_diem: "Phòng Lab 301, HUB",
        tong_dang_ky: 45, so_luong_tham_gia: 50, status: 1,
    },
    {
        su_kien_id: 3, ten_su_kien: "Hội nghị Fintech Châu Á 2024", imageUrl: "/images/event-placeholder-3.jpg",
        thoi_gian_bat_dau_su_kien: "2023-09-15T08:30:00", thoi_gian_ket_thuc_su_kien: "2023-09-16T17:00:00",
        hinh_thuc: "hybrid", formatClass: "bg-indigo-100 text-indigo-800", loai_su_kien_id: 3, typeValue: "hoi_nghi",
        typeName: "Hội nghị", typeClass: "bg-blue-100 text-blue-800", dia_diem: "Trung tâm Hội nghị Quốc gia",
        tong_dang_ky: 870, so_luong_tham_gia: 1000, status: 0,
    },
    {
        su_kien_id: 4, ten_su_kien: "Workshop Thiết kế UI/UX Cơ bản", imageUrl: "/images/event-placeholder-4.jpg",
        thoi_gian_bat_dau_su_kien: "2024-07-25T14:00:00", thoi_gian_ket_thuc_su_kien: "2024-07-25T17:00:00",
        hinh_thuc: "online", formatClass: "bg-teal-100 text-teal-800", loai_su_kien_id: 4, typeValue: "workshop",
        typeName: "Workshop", typeClass: "bg-orange-100 text-orange-800", dia_diem: "Zoom Meeting",
        tong_dang_ky: 75, so_luong_tham_gia: 100, status: 1,
    },
    // Add 16 more events
    {
        su_kien_id: 5, ten_su_kien: "Talkshow Khởi nghiệp Công nghệ", imageUrl: "/images/event-placeholder.jpg",
        thoi_gian_bat_dau_su_kien: "2024-08-10T10:00:00", thoi_gian_ket_thuc_su_kien: "2024-08-10T12:00:00",
        hinh_thuc: "offline", formatClass: "bg-sky-100 text-sky-800", loai_su_kien_id: 5, typeValue: "talkshow",
        typeName: "Talkshow", typeClass: "bg-pink-100 text-pink-800", dia_diem: "Phòng Hội thảo B, HUB",
        tong_dang_ky: 90, so_luong_tham_gia: 150, status: 1,
    },
    {
        su_kien_id: 6, ten_su_kien: "Cuộc thi Lập trình ICPC HUB", imageUrl: "/images/event-placeholder-2.jpg",
        thoi_gian_bat_dau_su_kien: "2024-09-05T08:00:00", thoi_gian_ket_thuc_su_kien: "2024-09-05T17:00:00",
        hinh_thuc: "offline", formatClass: "bg-sky-100 text-sky-800", loai_su_kien_id: 6, typeValue: "cuoc_thi",
        typeName: "Cuộc thi", typeClass: "bg-red-100 text-red-800", dia_diem: "Nhà thi đấu HUB",
        tong_dang_ky: 120, so_luong_tham_gia: 150, status: 1,
    },
    {
        su_kien_id: 7, ten_su_kien: "Hội thảo Trí tuệ Nhân tạo ứng dụng", imageUrl: "/images/event-placeholder-3.jpg",
        thoi_gian_bat_dau_su_kien: "2024-10-20T13:30:00", thoi_gian_ket_thuc_su_kien: "2024-10-20T16:30:00",
        hinh_thuc: "online", formatClass: "bg-teal-100 text-teal-800", loai_su_kien_id: 1, typeValue: "hoi_thao",
        typeName: "Hội thảo", typeClass: "bg-green-100 text-green-800", dia_diem: "Google Meet",
        tong_dang_ky: 250, so_luong_tham_gia: 500, status: 1,
    },
    {
        su_kien_id: 8, ten_su_kien: "Khóa học An ninh mạng cơ bản", imageUrl: "/images/event-placeholder-4.jpg",
        thoi_gian_bat_dau_su_kien: "2024-11-01T09:00:00", thoi_gian_ket_thuc_su_kien: "2024-11-15T12:00:00",
        hinh_thuc: "hybrid", formatClass: "bg-indigo-100 text-indigo-800", loai_su_kien_id: 2, typeValue: "khoa_hoc",
        typeName: "Khoá học", typeClass: "bg-purple-100 text-purple-800", dia_diem: "Phòng Lab 302 & Zoom",
        tong_dang_ky: 30, so_luong_tham_gia: 40, status: 1,
    },
    {
        su_kien_id: 9, ten_su_kien: "Ngày hội Việc làm Công nghệ 2024", imageUrl: "/images/event-placeholder.jpg",
        thoi_gian_bat_dau_su_kien: "2024-08-15T08:00:00", thoi_gian_ket_thuc_su_kien: "2024-08-15T16:00:00",
        hinh_thuc: "offline", formatClass: "bg-sky-100 text-sky-800", loai_su_kien_id: 7, typeValue: "ngay_hoi",
        typeName: "Ngày hội", typeClass: "bg-lime-100 text-lime-800", dia_diem: "Sân trường HUB",
        tong_dang_ky: 500, so_luong_tham_gia: null, status: 1, // No capacity limit
    },
    {
        su_kien_id: 10, ten_su_kien: "Workshop Phân tích Dữ liệu với Python", imageUrl: "/images/event-placeholder-2.jpg",
        thoi_gian_bat_dau_su_kien: "2024-09-10T18:00:00", thoi_gian_ket_thuc_su_kien: "2024-09-10T21:00:00",
        hinh_thuc: "online", formatClass: "bg-teal-100 text-teal-800", loai_su_kien_id: 4, typeValue: "workshop",
        typeName: "Workshop", typeClass: "bg-orange-100 text-orange-800", dia_diem: "Microsoft Teams",
        tong_dang_ky: 60, so_luong_tham_gia: 80, status: 1,
    },
    {
        su_kien_id: 11, ten_su_kien: "Hội nghị Khoa học Sinh viên HUB", imageUrl: "/images/event-placeholder-3.jpg",
        thoi_gian_bat_dau_su_kien: "2024-11-25T08:30:00", thoi_gian_ket_thuc_su_kien: "2024-11-25T17:00:00",
        hinh_thuc: "offline", formatClass: "bg-sky-100 text-sky-800", loai_su_kien_id: 3, typeValue: "hoi_nghi",
        typeName: "Hội nghị", typeClass: "bg-blue-100 text-blue-800", dia_diem: "Hội trường lớn HUB",
        tong_dang_ky: 180, so_luong_tham_gia: 250, status: 1,
    },
    {
        su_kien_id: 12, ten_su_kien: "Talkshow Chuyển đổi số trong Ngân hàng", imageUrl: "/images/event-placeholder-4.jpg",
        thoi_gian_bat_dau_su_kien: "2024-07-30T15:00:00", thoi_gian_ket_thuc_su_kien: "2024-07-30T17:00:00",
        hinh_thuc: "hybrid", formatClass: "bg-indigo-100 text-indigo-800", loai_su_kien_id: 5, typeValue: "talkshow",
        typeName: "Talkshow", typeClass: "bg-pink-100 text-pink-800", dia_diem: "Hội trường A & Online",
        tong_dang_ky: 110, so_luong_tham_gia: 150, status: 1,
    },
     {
        su_kien_id: 13, ten_su_kien: "Sự kiện Demo Day Startup", imageUrl: "/images/event-placeholder.jpg",
        thoi_gian_bat_dau_su_kien: "2024-12-10T14:00:00", thoi_gian_ket_thuc_su_kien: "2024-12-10T18:00:00",
        hinh_thuc: "offline", formatClass: "bg-sky-100 text-sky-800", loai_su_kien_id: 8, typeValue: "demo_day",
        typeName: "Demo Day", typeClass: "bg-yellow-100 text-yellow-800", dia_diem: "Không gian khởi nghiệp HUB",
        tong_dang_ky: 40, so_luong_tham_gia: 60, status: 1,
    },
    {
        su_kien_id: 14, ten_su_kien: "Khóa học Marketing số căn bản", imageUrl: "/images/event-placeholder-2.jpg",
        thoi_gian_bat_dau_su_kien: "2024-08-05T09:00:00", thoi_gian_ket_thuc_su_kien: "2024-08-19T11:00:00",
        hinh_thuc: "online", formatClass: "bg-teal-100 text-teal-800", loai_su_kien_id: 2, typeValue: "khoa_hoc",
        typeName: "Khoá học", typeClass: "bg-purple-100 text-purple-800", dia_diem: "Nền tảng LMS",
        tong_dang_ky: 95, so_luong_tham_gia: 120, status: 1,
    },
    {
        su_kien_id: 15, ten_su_kien: "Hội thảo Xu hướng Thương mại Điện tử", imageUrl: "/images/event-placeholder-3.jpg",
        thoi_gian_bat_dau_su_kien: "2024-09-20T09:30:00", thoi_gian_ket_thuc_su_kien: "2024-09-20T12:00:00",
        hinh_thuc: "offline", formatClass: "bg-sky-100 text-sky-800", loai_su_kien_id: 1, typeValue: "hoi_thao",
        typeName: "Hội thảo", typeClass: "bg-green-100 text-green-800", dia_diem: "Khách sạn Grand Saigon",
        tong_dang_ky: 220, so_luong_tham_gia: 300, status: 1,
    },
    {
        su_kien_id: 16, ten_su_kien: "Cuộc thi Ý tưởng Kinh doanh Sáng tạo", imageUrl: "/images/event-placeholder-4.jpg",
        thoi_gian_bat_dau_su_kien: "2024-10-01T08:00:00", thoi_gian_ket_thuc_su_kien: "2024-10-30T17:00:00",
        hinh_thuc: "hybrid", formatClass: "bg-indigo-100 text-indigo-800", loai_su_kien_id: 6, typeValue: "cuoc_thi",
        typeName: "Cuộc thi", typeClass: "bg-red-100 text-red-800", dia_diem: "HUB & Online Platform",
        tong_dang_ky: 70, so_luong_tham_gia: 100, status: 1,
    },
    {
        su_kien_id: 17, ten_su_kien: "Workshop Kỹ năng Lãnh đạo hiệu quả", imageUrl: "/images/event-placeholder.jpg",
        thoi_gian_bat_dau_su_kien: "2024-11-18T13:00:00", thoi_gian_ket_thuc_su_kien: "2024-11-18T17:00:00",
        hinh_thuc: "offline", formatClass: "bg-sky-100 text-sky-800", loai_su_kien_id: 4, typeValue: "workshop",
        typeName: "Workshop", typeClass: "bg-orange-100 text-orange-800", dia_diem: "Phòng Hội thảo C, HUB",
        tong_dang_ky: 25, so_luong_tham_gia: 30, status: 1,
    },
    {
        su_kien_id: 18, ten_su_kien: "Hội nghị Quốc tế về Kinh tế số", imageUrl: "/images/event-placeholder-2.jpg",
        thoi_gian_bat_dau_su_kien: "2025-01-15T09:00:00", thoi_gian_ket_thuc_su_kien: "2025-01-16T17:00:00",
        hinh_thuc: "hybrid", formatClass: "bg-indigo-100 text-indigo-800", loai_su_kien_id: 3, typeValue: "hoi_nghi",
        typeName: "Hội nghị", typeClass: "bg-blue-100 text-blue-800", dia_diem: "Trung tâm Hội nghị Quốc gia & Online",
        tong_dang_ky: 450, so_luong_tham_gia: 600, status: 1,
    },
    {
        su_kien_id: 19, ten_su_kien: "Talkshow Quản lý Tài chính Cá nhân", imageUrl: "/images/event-placeholder-3.jpg",
        thoi_gian_bat_dau_su_kien: "2024-08-20T19:00:00", thoi_gian_ket_thuc_su_kien: "2024-08-20T21:00:00",
        hinh_thuc: "online", formatClass: "bg-teal-100 text-teal-800", loai_su_kien_id: 5, typeValue: "talkshow",
        typeName: "Talkshow", typeClass: "bg-pink-100 text-pink-800", dia_diem: "Facebook Live",
        tong_dang_ky: 300, so_luong_tham_gia: null, status: 1,
    },
    {
        su_kien_id: 20, ten_su_kien: "Khóa học Tiếng Anh Giao tiếp Thương mại", imageUrl: "/images/event-placeholder-4.jpg",
        thoi_gian_bat_dau_su_kien: "2024-09-02T18:30:00", thoi_gian_ket_thuc_su_kien: "2024-11-29T20:30:00",
        hinh_thuc: "offline", formatClass: "bg-sky-100 text-sky-800", loai_su_kien_id: 2, typeValue: "khoa_hoc",
        typeName: "Khoá học", typeClass: "bg-purple-100 text-purple-800", dia_diem: "Trung tâm Ngoại ngữ HUB",
        tong_dang_ky: 55, so_luong_tham_gia: 60, status: 1,
    }
];

// --- State Variables ---
let currentPage = 1;
let itemsPerPage = 10; // Default, will be updated from select
let filteredEvents = [];

// Function to determine conceptual status based on dates and actual status
function getConceptualStatus(event) {
    const now = moment();
    const start = moment(event.thoi_gian_bat_dau_su_kien);
    const end = moment(event.thoi_gian_ket_thuc_su_kien);

    if (event.status === 0) {
        return { text: "Không hoạt động", class: "bg-gray-100 text-gray-800", value: "0" };
    }
    if (now.isBefore(start)) {
        return { text: "Sắp diễn ra", class: "bg-yellow-100 text-yellow-800", value: "upcoming" };
    }
    if (now.isBetween(start, end)) {
        return { text: "Đang diễn ra", class: "bg-green-100 text-green-800", value: "ongoing" };
    }
    if (now.isAfter(end)) {
         return { text: "Đã kết thúc", class: "bg-gray-200 text-gray-600", value: "finished" }; // Slightly different finished color
    }
    return { text: "Hoạt động", class: "bg-blue-100 text-blue-800", value: "1" }; // Fallback if active but dates are weird
}

// Function to render the table (now handles pagination)
function renderTable() {
    const tableBody = document.getElementById('eventsTableBody');
    if (!tableBody) return;

    tableBody.innerHTML = ''; // Clear existing rows

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedEvents = filteredEvents.slice(startIndex, endIndex);

    if (paginatedEvents.length === 0 && filteredEvents.length === 0) {
         tableBody.innerHTML = `<tr><td colspan="7" class="text-center py-4 text-gray-500">Không có sự kiện nào.</td></tr>`;
    } else if (paginatedEvents.length === 0 && filteredEvents.length > 0) {
         tableBody.innerHTML = `<tr><td colspan="7" class="text-center py-4 text-gray-500">Không có sự kiện nào ở trang này.</td></tr>`;
    } else {
        paginatedEvents.forEach(event => {
            const row = document.createElement('tr');
            row.classList.add('bg-white', 'border-b', 'hover:bg-gray-50');
            row.setAttribute('data-event-id', event.su_kien_id);

            const eventDate = moment(event.thoi_gian_bat_dau_su_kien);
            const conceptualStatus = getConceptualStatus(event);

            row.innerHTML = `
              <td class="px-4 py-3">
                <div class="flex items-center gap-3">
                  <div class="h-12 w-12 rounded-md overflow-hidden flex-shrink-0">
                    <img src="${event.imageUrl || '/images/event-placeholder.jpg'}" alt="${event.ten_su_kien}" class="w-full h-full object-cover">
                  </div>
                  <div>
                    <p class="font-medium text-gray-900 truncate" title="${event.ten_su_kien}">${event.ten_su_kien}</p>
                    <p class="text-sm text-gray-500">${eventDate.format('DD [Thg] M, YYYY, HH:mm')}</p>
                  </div>
                </div>
              </td>
              <td class="px-4 py-3">
                <span class="px-2.5 py-0.5 inline-flex text-xs leading-5 font-medium rounded-full ${event.formatClass}">${event.hinh_thuc}</span>
              </td>
              <td class="px-4 py-3">
                <span class="px-2.5 py-0.5 inline-flex text-xs leading-5 font-medium rounded-full ${event.typeClass}">${event.typeName}</span>
              </td>
              <td class="px-4 py-3">
                <p class="font-medium text-sm text-gray-700">${event.dia_diem || 'N/A'}</p>
              </td>
              <td class="px-4 py-3">
                <p class="font-medium text-sm text-gray-700">${event.tong_dang_ky} / ${event.so_luong_tham_gia || '∞'}</p>
                <p class="text-xs text-gray-500">Đã đăng ký</p>
              </td>
              <td class="px-4 py-3">
                <span class="px-2.5 py-0.5 inline-flex text-xs leading-5 font-medium rounded-full ${conceptualStatus.class}">${conceptualStatus.text}</span>
              </td>
              <td class="px-4 py-3 text-right">
                <div class="flex items-center justify-end space-x-2">
                   <button class="btn-view text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-100" data-event-id="${event.su_kien_id}" title="Xem chi tiết" onclick="window.location.href='event-detail.html?id=${event.su_kien_id}'">
                     <i class="ri-eye-line w-5 h-5"></i>
                   </button>
                   <button class="btn-edit text-yellow-600 hover:text-yellow-900 p-1 rounded hover:bg-yellow-100" data-event-id="${event.su_kien_id}" title="Chỉnh sửa" onclick="window.location.href='event-edit.html?id=${event.su_kien_id}'">
                     <i class="ri-pencil-line w-5 h-5"></i>
                   </button>
                   <button class="btn-delete text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-100" data-event-id="${event.su_kien_id}" title="Xóa" onclick="confirmDelete(${event.su_kien_id})">
                     <i class="ri-delete-bin-line w-5 h-5"></i>
                   </button>
                </div>
              </td>
            `;
            tableBody.appendChild(row);
        });
    }
}

// Function to update pagination controls
function updatePagination() {
    const totalItemsCountEl = document.getElementById('total-items-count');
    const totalPagesCountEl = document.getElementById('total-pages-count');
    const currentPageInput = document.getElementById('current-page-input');
    const btnFirst = document.querySelector('.btn-first');
    const btnPrev = document.querySelector('.btn-prev');
    const btnNext = document.querySelector('.btn-next');
    const btnLast = document.querySelector('.btn-last');

    const totalItems = filteredEvents.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage) || 1; // Ensure at least 1 page

    // Update text displays
    if (totalItemsCountEl) totalItemsCountEl.textContent = totalItems;
    if (totalPagesCountEl) totalPagesCountEl.textContent = totalPages;

    // Update current page input
    if (currentPageInput) {
        currentPageInput.value = currentPage;
        currentPageInput.max = totalPages;
        currentPageInput.min = 1;
    }

    // Update button states
    if (btnFirst) btnFirst.disabled = currentPage === 1;
    if (btnPrev) btnPrev.disabled = currentPage === 1;
    if (btnNext) btnNext.disabled = currentPage === totalPages;
    if (btnLast) btnLast.disabled = currentPage === totalPages;
}

// Placeholder for delete confirmation
function confirmDelete(eventId) {
    console.log(`Attempting to delete event with ID: ${eventId}`);
    // Add actual delete confirmation logic here (e.g., show a modal)
    alert(`Bạn có chắc chắn muốn xóa sự kiện ID ${eventId} không? (Chức năng chưa hoàn thiện)`);
}

document.addEventListener('DOMContentLoaded', function() {
    const dateInput = document.getElementById('filter-date'); // Declare here

    // Initialize date range picker
    if (dateInput) {
        $(dateInput).daterangepicker({
            autoUpdateInput: false, // Don't auto-update the input value
            opens: 'left', // Open the picker to the left
            locale: {
                format: 'DD/MM/YYYY',
                separator: ' - ',
                applyLabel: 'Áp dụng',
                cancelLabel: 'Hủy',
                fromLabel: 'Từ',
                toLabel: 'Đến',
                customRangeLabel: 'Tùy chỉnh',
                weekLabel: 'T',
                daysOfWeek: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'],
                monthNames: [
                    'Tháng 1',
                    'Tháng 2',
                    'Tháng 3',
                    'Tháng 4',
                    'Tháng 5',
                    'Tháng 6',
                    'Tháng 7',
                    'Tháng 8',
                    'Tháng 9',
                    'Tháng 10',
                    'Tháng 11',
                    'Tháng 12'
                ],
                firstDay: 1 // Monday
            },
            ranges: {
               'Hôm nay': [moment(), moment()],
               'Hôm qua': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
               '7 ngày qua': [moment().subtract(6, 'days'), moment()],
               '30 ngày qua': [moment().subtract(29, 'days'), moment()],
               'Tháng này': [moment().startOf('month'), moment().endOf('month')],
               'Tháng trước': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
            },
            alwaysShowCalendars: true, // Show two calendars
        });

        // Event handler for applying the date range
        $(dateInput).on('apply.daterangepicker', function(ev, picker) {
            $(this).val(picker.startDate.format('DD/MM/YYYY') + ' - ' + picker.endDate.format('DD/MM/YYYY'));
            // Add logic here to trigger filtering based on the selected date range
            console.log('Date range selected:', $(this).val()); 
            applyFilters(); // Apply filters when date is selected
        });

        // Event handler for canceling/clearing the date range
        $(dateInput).on('cancel.daterangepicker', function(ev, picker) {
            $(this).val('');
             // Add logic here to clear date filter and reload data
            console.log('Date range cleared');
            applyFilters(); // Apply filters when date is cleared
        });
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
            sidebarBackdrop.classList.add('opacity-100'); // Ensure opacity transition starts correctly
        }
    }

    function closeSidebar() {
        if (sidebar && sidebarBackdrop) {
            sidebar.classList.add('-translate-x-full');
            sidebarBackdrop.classList.add('hidden');
            sidebarBackdrop.classList.remove('opacity-100');
        }
    }

    if (sidebarOpenBtn) {
        sidebarOpenBtn.addEventListener('click', openSidebar);
    }

    if (sidebarCloseBtn) {
        sidebarCloseBtn.addEventListener('click', closeSidebar);
    }

    if (sidebarBackdrop) {
        sidebarBackdrop.addEventListener('click', closeSidebar);
    }
    // --- End Mobile Sidebar Toggle --- 

    // --- Pagination and Filter Setup ---
    const itemsPerPageSelect = document.getElementById('items-per-page');
    const currentPageInput = document.getElementById('current-page-input');
    const btnFirst = document.querySelector('.btn-first');
    const btnPrev = document.querySelector('.btn-prev');
    const btnNext = document.querySelector('.btn-next');
    const btnLast = document.querySelector('.btn-last');
    const filterForm = document.getElementById('filter-form');
    const resetFilterBtn = document.getElementById('reset-filter-btn');

    // Initial setup
    itemsPerPage = parseInt(itemsPerPageSelect.value, 10);
    filteredEvents = [...allEvents]; // Start with all events
    updatePagination();
    renderTable();

    // --- Event Listeners ---

    // Filters
    if (filterForm) {
        filterForm.addEventListener('submit', function(event) {
            event.preventDefault();
            applyFilters();
        });
    }
    // Also apply filters immediately when type, status, or format change
    document.getElementById('filter-type')?.addEventListener('change', applyFilters);
    document.getElementById('filter-status')?.addEventListener('change', applyFilters);
    document.getElementById('filter-format')?.addEventListener('change', applyFilters);
    // Date picker applies filter on 'apply.daterangepicker' and 'cancel.daterangepicker' (already set up)


    // Filter Reset
    if (resetFilterBtn) {
        resetFilterBtn.addEventListener('click', function() {
            filterForm.reset();
            $(dateInput).val(''); // Clear date picker input
            // $(dateInput).trigger('cancel.daterangepicker'); // Optional: reset picker state
            applyFilters(); // Apply empty filters
        });
    }

    // Pagination: Items per page
    if (itemsPerPageSelect) {
        itemsPerPageSelect.addEventListener('change', function() {
            itemsPerPage = parseInt(this.value, 10);
            currentPage = 1; // Reset to first page
            updatePagination();
            renderTable();
        });
    }

    // Pagination: Page input
    if (currentPageInput) {
        currentPageInput.addEventListener('change', function() {
            let newPage = parseInt(this.value, 10);
            const totalPages = Math.ceil(filteredEvents.length / itemsPerPage) || 1;
            if (newPage < 1) newPage = 1;
            if (newPage > totalPages) newPage = totalPages;
            currentPage = newPage;
            // No need to call updatePagination here as it's just reflecting the change
            renderTable();
            this.value = currentPage; // Ensure input shows the validated page number
        });
         currentPageInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                 e.preventDefault(); // Prevent form submission if inside one
                 this.blur(); // Trigger change event
                 let newPage = parseInt(this.value, 10);
                 const totalPages = Math.ceil(filteredEvents.length / itemsPerPage) || 1;
                 if (newPage < 1) newPage = 1;
                 if (newPage > totalPages) newPage = totalPages;
                 currentPage = newPage;
                 renderTable();
                 this.value = currentPage;
            }
        });
    }

    // Pagination: Buttons
    if (btnFirst) {
        btnFirst.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage = 1;
                updatePagination();
                renderTable();
            }
        });
    }
    if (btnPrev) {
        btnPrev.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                updatePagination();
                renderTable();
            }
        });
    }
    if (btnNext) {
        btnNext.addEventListener('click', () => {
            const totalPages = Math.ceil(filteredEvents.length / itemsPerPage) || 1;
            if (currentPage < totalPages) {
                currentPage++;
                updatePagination();
                renderTable();
            }
        });
    }
    if (btnLast) {
        btnLast.addEventListener('click', () => {
            const totalPages = Math.ceil(filteredEvents.length / itemsPerPage) || 1;
            if (currentPage < totalPages) {
                currentPage = totalPages;
                updatePagination();
                renderTable();
            }
        });
    }

    // Function to apply filters (now triggers pagination update)
    function applyFilters() {
        const nameFilter = document.getElementById('filter-name').value.toLowerCase();
        const typeFilter = document.getElementById('filter-type').value;
        const statusFilter = document.getElementById('filter-status').value;
        const formatFilter = document.getElementById('filter-format').value;
        const dateFilter = document.getElementById('filter-date').value;

        let startDate = null;
        let endDate = null;
        if (dateFilter) {
            const dates = dateFilter.split(' - ');
            if (dates.length === 2) { // Basic validation
                 startDate = moment(dates[0], 'DD/MM/YYYY').startOf('day');
                 endDate = moment(dates[1], 'DD/MM/YYYY').endOf('day');
                 if (!startDate.isValid() || !endDate.isValid()) {
                     startDate = null;
                     endDate = null;
                 }
            }
        }

        // Perform filtering
        filteredEvents = allEvents.filter(event => {
            const eventStartDate = moment(event.thoi_gian_bat_dau_su_kien);
            const conceptualStatus = getConceptualStatus(event);

            const nameMatch = !nameFilter || event.ten_su_kien.toLowerCase().includes(nameFilter);
            const typeMatch = !typeFilter || event.typeValue === typeFilter;
            const statusMatch = !statusFilter ||
                                conceptualStatus.value === statusFilter ||
                                (statusFilter === '1' && event.status === 1) ||
                                (statusFilter === '0' && event.status === 0);
            const formatMatch = !formatFilter || event.hinh_thuc === formatFilter;
            const dateMatch = !startDate || (eventStartDate.isValid() && eventStartDate.isBetween(startDate, endDate, undefined, '[]'));

            return nameMatch && typeMatch && statusMatch && formatMatch && dateMatch;
        });

        // Reset to page 1 and update display
        currentPage = 1;
        updatePagination();
        renderTable();
    }

});
