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
        
        // Format date and time
        const formattedDate = formatDate(event.startDate);
        const formattedTime = formatTime(event.startTime);
        
        // Calculate registration percentage
        const registrationPercentage = Math.round((event.registeredCount / event.maxParticipants) * 100);
        
        card.innerHTML = `
            <div class="event-image">
                <img src="${event.image || '../images/event-placeholder.jpg'}" alt="${event.title}">
                <span class="event-status ${event.status.toLowerCase()}">${getStatusText(event.status)}</span>
            </div>
            <div class="event-content">
                <div class="event-meta">
                    <span><i class="far fa-calendar"></i> ${formattedDate}</span>
                    <span><i class="far fa-clock"></i> ${formattedTime}</span>
                    <span><i class="fas fa-map-marker-alt"></i> ${event.location}</span>
                </div>
                <h3 class="event-title">${event.title}</h3>
                <p class="event-description">${event.description}</p>
                <div class="event-stats">
                    <span class="participants">
                        <i class="fas fa-users"></i> 
                        <span class="registration-count">${event.registeredCount}/${event.maxParticipants}</span>
                        <div class="registration-progress">
                            <div class="progress-bar" style="width: ${registrationPercentage}%"></div>
                        </div>
                    </span>
                    <span class="format ${event.format.toLowerCase()}">
                        <i class="fas ${getFormatIcon(event.format)}"></i> ${event.format}
                    </span>
                </div>
                <div class="event-footer">
                    <div class="event-views">
                        <i class="far fa-eye"></i> ${formatNumber(event.views)} lượt xem
                        <span class="dot">•</span>
                        <i class="fas fa-user-check"></i> ${formatNumber(event.registeredCount)} đã đăng ký
                    </div>
                    <div class="event-actions">
                        <a href="event-detail.html?id=${event.id}" class="btn-view">
                            Xem chi tiết <i class="fas fa-arrow-right"></i>
                        </a>
                        <a href="#" class="btn-register" data-event-id="${event.id}">
                            ${isUserLoggedIn() ? 'Đăng ký ngay' : 'Đăng nhập để đăng ký'}
                        </a>
                    </div>
                </div>
            </div>
        `;
        
        // Add event listeners
        const registerBtn = card.querySelector('.btn-register');
        registerBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (isUserLoggedIn()) {
                registerForEvent(event.id);
            } else {
                redirectToLogin();
            }
        });
        
        return card;
    }

    // Helper function to get format icon
    function getFormatIcon(format) {
        const formatIcons = {
            'Online': 'fa-video',
            'Offline': 'fa-map-marker-alt',
            'Hybrid': 'fa-laptop'
        };
        return formatIcons[format] || 'fa-calendar';
    }

    // Helper function to format numbers with commas
    function formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    // Helper function to check if user is logged in
    function isUserLoggedIn() {
        // This should be replaced with your actual authentication check
        return localStorage.getItem('userToken') !== null;
    }

    // Function to handle event registration
    function registerForEvent(eventId) {
        // Show loading state
        const registerBtn = document.querySelector(`.btn-register[data-event-id="${eventId}"]`);
        const originalText = registerBtn.textContent;
        registerBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang xử lý...';
        registerBtn.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            // Reset button state
            registerBtn.innerHTML = originalText;
            registerBtn.disabled = false;
            
            // Show success message
            showNotification('Đăng ký sự kiện thành công!', 'success');
        }, 1500);
    }

    // Function to redirect to login page
    function redirectToLogin() {
        // Store the current URL to redirect back after login
        localStorage.setItem('redirectAfterLogin', window.location.href);
        window.location.href = '/login.html';
    }

    // Function to show notification
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-info-circle'}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close"><i class="fas fa-times"></i></button>
        `;
        
        document.body.appendChild(notification);
        
        // Add event listener to close button
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            notification.classList.add('fade-out');
            setTimeout(() => {
                notification.remove();
            }, 300);
        });
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (document.body.contains(notification)) {
                notification.classList.add('fade-out');
                setTimeout(() => {
                    notification.remove();
                }, 300);
            }
        }, 5000);
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