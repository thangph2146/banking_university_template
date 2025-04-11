document.addEventListener('DOMContentLoaded', function() {
    // Lấy các phần tử DOM
    const eventsGrid = document.getElementById('eventsGrid');
    const eventTypeSelect = document.getElementById('eventType');
    const eventStatusSelect = document.getElementById('eventStatus');
    const eventDateInput = document.getElementById('eventDate');
    const searchEventInput = document.getElementById('searchEvent');

    // Biến để lưu trữ trạng thái hiện tại
    let currentFilters = {
        type: '',
        status: '',
        date: '',
        search: ''
    };

    // Hàm để tải danh sách sự kiện
    async function loadEvents(filters = {}) {
        try {
            // Hiển thị loading
            showLoading();

            // Gọi API để lấy danh sách sự kiện
            const response = await fetch('/api/events?' + new URLSearchParams(filters));
            const data = await response.json();

            if (response.ok) {
                // Xóa nội dung cũ
                eventsGrid.innerHTML = '';

                // Hiển thị danh sách sự kiện
                data.events.forEach(event => {
                    const eventCard = createEventCard(event);
                    eventsGrid.appendChild(eventCard);
                });

                // Cập nhật phân trang
                updatePagination(data.pagination);
            } else {
                showError('Không thể tải danh sách sự kiện. Vui lòng thử lại sau.');
            }
        } catch (error) {
            console.error('Error loading events:', error);
            showError('Đã xảy ra lỗi khi tải danh sách sự kiện.');
        } finally {
            // Ẩn loading
            hideLoading();
        }
    }

    // Hàm tạo card sự kiện
    function createEventCard(event) {
        const card = document.createElement('article');
        card.className = 'event-card';
        
        card.innerHTML = `
            <div class="event-image">
                <img src="${event.image}" alt="${event.title}">
                <span class="event-status ${event.status.toLowerCase()}">${getStatusText(event.status)}</span>
            </div>
            <div class="event-content">
                <h3 class="event-title">${event.title}</h3>
                <div class="event-info">
                    <span><i class="far fa-calendar"></i> ${formatDate(event.startDate)}</span>
                    <span><i class="far fa-clock"></i> ${formatTime(event.startTime)}</span>
                    <span><i class="fas fa-map-marker-alt"></i> ${event.location}</span>
                </div>
                <p class="event-description">${event.description}</p>
                <div class="event-footer">
                    <a href="event-detail.html?id=${event.id}" class="btn btn-primary">Xem chi tiết</a>
                    <span class="event-registrations">
                        <i class="fas fa-users"></i> ${event.registeredCount}/${event.maxParticipants}
                    </span>
                </div>
            </div>
        `;

        return card;
    }

    // Hàm cập nhật phân trang
    function updatePagination(pagination) {
        const paginationList = document.querySelector('.pagination-list');
        paginationList.innerHTML = '';

        // Nút Previous
        if (pagination.currentPage > 1) {
            paginationList.appendChild(createPageItem('prev', '<i class="fas fa-chevron-left"></i>'));
        }

        // Các nút số trang
        for (let i = 1; i <= pagination.totalPages; i++) {
            if (
                i === 1 || 
                i === pagination.totalPages || 
                (i >= pagination.currentPage - 2 && i <= pagination.currentPage + 2)
            ) {
                paginationList.appendChild(createPageItem(i, i));
            } else if (
                i === pagination.currentPage - 3 || 
                i === pagination.currentPage + 3
            ) {
                paginationList.appendChild(createPageItem('ellipsis', '...'));
            }
        }

        // Nút Next
        if (pagination.currentPage < pagination.totalPages) {
            paginationList.appendChild(createPageItem('next', '<i class="fas fa-chevron-right"></i>'));
        }
    }

    // Hàm tạo item phân trang
    function createPageItem(type, content) {
        const li = document.createElement('li');
        li.className = 'page-item';
        
        if (type === 'ellipsis') {
            li.innerHTML = `<span class="page-link">${content}</span>`;
        } else {
            const a = document.createElement('a');
            a.href = '#';
            a.className = 'page-link';
            if (type === parseInt(currentPage)) {
                a.classList.add('active');
            }
            a.innerHTML = content;
            
            a.addEventListener('click', (e) => {
                e.preventDefault();
                if (type === 'prev') {
                    currentPage--;
                } else if (type === 'next') {
                    currentPage++;
                } else {
                    currentPage = type;
                }
                loadEvents({ ...currentFilters, page: currentPage });
            });
            
            li.appendChild(a);
        }
        
        return li;
    }

    // Hàm hiển thị loading
    function showLoading() {
        const loading = document.createElement('div');
        loading.className = 'loading';
        loading.innerHTML = '<div class="spinner"></div>';
        document.body.appendChild(loading);
    }

    // Hàm ẩn loading
    function hideLoading() {
        const loading = document.querySelector('.loading');
        if (loading) {
            loading.remove();
        }
    }

    // Hàm hiển thị lỗi
    function showError(message) {
        const error = document.createElement('div');
        error.className = 'alert alert-danger';
        error.textContent = message;
        
        const container = document.querySelector('.container');
        container.insertBefore(error, container.firstChild);
        
        setTimeout(() => {
            error.remove();
        }, 5000);
    }

    // Hàm format ngày
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    // Hàm format giờ
    function formatTime(timeString) {
        return timeString.substring(0, 5);
    }

    // Hàm lấy text trạng thái
    function getStatusText(status) {
        const statusMap = {
            'UPCOMING': 'Sắp diễn ra',
            'ONGOING': 'Đang diễn ra',
            'ENDED': 'Đã kết thúc',
            'CANCELLED': 'Đã hủy'
        };
        return statusMap[status] || status;
    }

    // Thêm event listeners cho các bộ lọc
    eventTypeSelect.addEventListener('change', function() {
        currentFilters.type = this.value;
        loadEvents(currentFilters);
    });

    eventStatusSelect.addEventListener('change', function() {
        currentFilters.status = this.value;
        loadEvents(currentFilters);
    });

    eventDateInput.addEventListener('change', function() {
        currentFilters.date = this.value;
        loadEvents(currentFilters);
    });

    searchEventInput.addEventListener('input', debounce(function() {
        currentFilters.search = this.value;
        loadEvents(currentFilters);
    }, 500));

    // Hàm debounce để tránh gọi API quá nhiều khi search
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func.apply(this, args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Tải danh sách sự kiện khi trang được load
    loadEvents();
}); 