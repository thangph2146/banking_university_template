/**
 * Module quản lý tạo mới đăng ký sự kiện
 */
const RegistrationCreateManager = (function() {
    'use strict';

    // Constants
    const API_URL = '/api/registrations';
    const EVENT_API_URL = '/api/events';
    
    // DOM elements
    const $elements = {
        form: document.getElementById('registration-form'),
        event: document.getElementById('event'),
        participationType: document.getElementById('participation-type'),
        fullname: document.getElementById('fullname'),
        email: document.getElementById('email'),
        phone: document.getElementById('phone'),
        gender: document.getElementById('gender'),
        organization: document.getElementById('organization'),
        position: document.getElementById('position'),
        notes: document.getElementById('notes'),
        status: document.getElementById('status'),
        backButton: document.getElementById('back-to-list-btn'),
        loadingIndicator: document.getElementById('loading-indicator'),
        formContainer: document.getElementById('registration-form-container'),
        errorAlert: document.querySelector('.alert-danger'),
        errorMessage: document.getElementById('error-message'),
        errorDetail: document.getElementById('error-detail')
    };

    /**
     * Hiển thị/ẩn loading indicator
     * @param {boolean} show - True để hiển thị, false để ẩn
     */
    const toggleLoading = function(show) {
        if (show) {
            $elements.loadingIndicator.classList.remove('hidden');
            $elements.formContainer.classList.add('hidden');
        } else {
            $elements.loadingIndicator.classList.add('hidden');
            $elements.formContainer.classList.remove('hidden');
        }
    };

    /**
     * Hiển thị thông báo lỗi
     * @param {string} message - Tiêu đề lỗi
     * @param {string} detail - Chi tiết lỗi
     */
    const showError = function(message, detail) {
        $elements.errorMessage.textContent = message || 'Có lỗi xảy ra!';
        $elements.errorDetail.textContent = detail || 'Vui lòng kiểm tra lại thông tin và thử lại.';
        $elements.errorAlert.classList.remove('hidden');
        
        // Tự động ẩn sau 5 giây
        setTimeout(() => {
            $elements.errorAlert.classList.add('hidden');
        }, 5000);
    };

    /**
     * Đăng ký các sự kiện
     */
    const registerEvents = function() {
        // Sự kiện submit form
        $elements.form.addEventListener('submit', function(e) {
            e.preventDefault();
            createRegistration();
        });

        // Sự kiện quay lại trang danh sách
        $elements.backButton.addEventListener('click', function() {
            window.location.href = 'registrations.html';
        });

        // Sự kiện thay đổi loại người tham gia
        $elements.participationType.addEventListener('change', function() {
            toggleParticipantFields();
        });
        
        // === BỔ SUNG CODE CHO MOBILE MENU ===
        const sidebarOpenBtn = document.getElementById('sidebar-open');
        const sidebarCloseBtn = document.getElementById('sidebar-close');
        const sidebarBackdrop = document.getElementById('sidebar-backdrop');
        const sidebar = document.getElementById('sidebar');

        if (sidebarOpenBtn && sidebar && sidebarBackdrop) {
            sidebarOpenBtn.addEventListener('click', function() {
                sidebar.classList.remove('-translate-x-full');
                sidebarBackdrop.classList.remove('hidden');
            });
        }

        if (sidebarCloseBtn && sidebar && sidebarBackdrop) {
            sidebarCloseBtn.addEventListener('click', function() {
                sidebar.classList.add('-translate-x-full');
                sidebarBackdrop.classList.add('hidden');
            });
        }
        
        if (sidebarBackdrop && sidebar) {
            sidebarBackdrop.addEventListener('click', function() {
                sidebar.classList.add('-translate-x-full');
                sidebarBackdrop.classList.add('hidden');
            });
        }
        // === KẾT THÚC BỔ SUNG CODE ===
    };

    /**
     * Hiển thị/ẩn các trường thông tin dựa vào loại người tham gia
     */
    const toggleParticipantFields = function() {
        const participationType = $elements.participationType.value;
        
        // Hiển thị/ẩn trường tổ chức
        if (['doanh_nghiep', 'giang_vien'].includes(participationType)) {
            $elements.organization.parentElement.style.display = 'block';
            $elements.position.parentElement.style.display = 'block';
        } else {
            $elements.organization.parentElement.style.display = 'none';
            $elements.position.parentElement.style.display = 'none';
        }
    };

    /**
     * Xác thực dữ liệu form
     * @returns {boolean} - True nếu dữ liệu hợp lệ, ngược lại là false
     */
    const validateForm = function() {
        // Xác thực sự kiện đã được chọn
        if (!$elements.event.value) {
            showError('Thiếu thông tin', 'Vui lòng chọn sự kiện');
            $elements.event.focus();
            return false;
        }
        
        // Xác thực loại người tham gia
        if (!$elements.participationType.value) {
            showError('Thiếu thông tin', 'Vui lòng chọn đối tượng tham gia');
            $elements.participationType.focus();
            return false;
        }
        
        // Xác thực họ tên
        if (!$elements.fullname.value.trim()) {
            showError('Thiếu thông tin', 'Vui lòng nhập họ tên');
            $elements.fullname.focus();
            return false;
        }
        
        // Xác thực email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test($elements.email.value.trim())) {
            showError('Email không hợp lệ', 'Vui lòng nhập đúng định dạng email');
            $elements.email.focus();
            return false;
        }
        
        // Xác thực số điện thoại
        const phoneRegex = /^0\d{9}$/;
        if (!phoneRegex.test($elements.phone.value.trim())) {
            showError('Số điện thoại không hợp lệ', 'Vui lòng nhập đúng định dạng số điện thoại (10 số, bắt đầu bằng số 0)');
            $elements.phone.focus();
            return false;
        }
        
        return true;
    };

    /**
     * Thu thập dữ liệu từ form
     * @returns {Object} - Dữ liệu đăng ký
     */
    const collectFormData = function() {
        return {
            event_id: parseInt($elements.event.value),
            participation_type: $elements.participationType.value,
            fullname: $elements.fullname.value.trim(),
            email: $elements.email.value.trim(),
            phone: $elements.phone.value.trim(),
            gender: $elements.gender.value,
            organization: $elements.organization.value.trim(),
            position: $elements.position.value.trim(),
            notes: $elements.notes.value.trim(),
            status: parseInt($elements.status.value),
            registration_date: new Date().toISOString(),
            attended: false
        };
    };

    /**
     * Tạo mới đăng ký
     */
    const createRegistration = function() {
        // Xác thực form
        if (!validateForm()) {
            return;
        }
        
        // Thu thập dữ liệu
        const formData = collectFormData();
        
        // Hiển thị loading
        toggleLoading(true);
        
        // Gửi yêu cầu tạo mới
        console.log('Dữ liệu đăng ký:', formData);
        
        // TODO: Gửi API request thực tế
        // Giả lập API call thành công
        setTimeout(() => {
            toggleLoading(false);
            alert('Đăng ký thành công!');
            window.location.href = 'registrations.html';
        }, 1000);
        
        /* 
        // Mã tham khảo cho việc gọi API thực tế
        fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Lỗi khi tạo đăng ký');
            }
            return response.json();
        })
        .then(data => {
            alert('Đăng ký thành công!');
            window.location.href = 'registrations.html';
        })
        .catch(error => {
            showError('Lỗi khi tạo đăng ký', error.message);
        })
        .finally(() => {
            toggleLoading(false);
        });
        */
    };

    /**
     * Tải danh sách sự kiện
     */
    const loadEvents = function() {
        toggleLoading(true);
        
        // TODO: Gọi API thực tế để lấy danh sách sự kiện
        // Mock data cho phát triển
        const mockEvents = [
            { id: 1, name: 'Hội thảo Tài chính 2023', start_date: '2023-12-15T08:00:00Z' },
            { id: 2, name: 'Workshop Blockchain cho sinh viên', start_date: '2023-12-20T13:30:00Z' },
            { id: 3, name: 'Tọa đàm về Ngân hàng số', start_date: '2024-01-05T09:00:00Z' },
            { id: 4, name: 'Ngày hội việc làm Tài chính Ngân hàng', start_date: '2024-01-15T08:30:00Z' }
        ];
        
        // Điền danh sách sự kiện vào dropdown
        mockEvents.forEach(event => {
            const option = document.createElement('option');
            option.value = event.id;
            
            // Format date để hiển thị
            const eventDate = new Date(event.start_date);
            const formattedDate = `${eventDate.getDate()}/${eventDate.getMonth() + 1}/${eventDate.getFullYear()}`;
            
            option.textContent = `${event.name} (${formattedDate})`;
            $elements.event.appendChild(option);
        });
        
        toggleLoading(false);
        
        /* 
        // Mã tham khảo cho việc gọi API thực tế
        fetch(EVENT_API_URL)
        .then(response => {
            if (!response.ok) {
                throw new Error('Lỗi khi tải danh sách sự kiện');
            }
            return response.json();
        })
        .then(events => {
            events.forEach(event => {
                const option = document.createElement('option');
                option.value = event.id;
                
                // Format date để hiển thị
                const eventDate = new Date(event.start_date);
                const formattedDate = `${eventDate.getDate()}/${eventDate.getMonth() + 1}/${eventDate.getFullYear()}`;
                
                option.textContent = `${event.name} (${formattedDate})`;
                $elements.event.appendChild(option);
            });
        })
        .catch(error => {
            showError('Lỗi khi tải danh sách sự kiện', error.message);
        })
        .finally(() => {
            toggleLoading(false);
        });
        */
    };

    /**
     * Khởi tạo module
     */
    const init = function() {
        cacheDOMElements();
        registerEvents();
        loadEvents();
        toggleParticipantFields(); // Chạy lần đầu để ẩn các trường không cần thiết
        toggleLoading(false); // Mặc định ẩn loading
    };

    // Hàm cache DOM elements
    const cacheDOMElements = function() {
        $elements.form = document.getElementById('registration-form');
        $elements.event = document.getElementById('event');
        $elements.participationType = document.getElementById('participation-type');
        $elements.fullname = document.getElementById('registrant-name'); // Sửa ID
        $elements.email = document.getElementById('registrant-email'); // Sửa ID
        $elements.phone = document.getElementById('registrant-phone'); // Sửa ID
        $elements.gender = document.getElementById('gender'); // Thêm ID nếu cần
        $elements.organization = document.getElementById('organization'); // Giữ nguyên nếu đúng
        $elements.position = document.getElementById('position'); // Giữ nguyên nếu đúng
        $elements.notes = document.getElementById('feedback'); // Sửa ID
        $elements.status = document.getElementById('registration-status'); // Sửa ID
        $elements.backButton = document.querySelector('a[href="registrations.html"]'); // Sửa selector
        $elements.loadingIndicator = document.getElementById('loading-indicator'); // Thêm ID nếu cần
        $elements.formContainer = document.querySelector('.bg-white.rounded-lg.shadow.overflow-hidden'); // Sửa selector
        $elements.errorAlert = document.querySelector('.alert-danger'); // Thêm class nếu cần
        $elements.errorMessage = document.getElementById('error-message'); // Thêm ID nếu cần
        $elements.errorDetail = document.getElementById('error-detail'); // Thêm ID nếu cần
    };

    // Add event listener for DOMContentLoaded to initialize the module
    document.addEventListener('DOMContentLoaded', init);

    // Expose public methods (if any)
    return {
        init: init
    };
})();

// Thêm xử lý cho menu mobile khi DOM đã sẵn sàng
document.addEventListener('DOMContentLoaded', function() {
    const sidebarOpenButton = document.getElementById('sidebar-open');
    const sidebarCloseButton = document.getElementById('sidebar-close');
    const sidebar = document.getElementById('sidebar');
    const sidebarBackdrop = document.getElementById('sidebar-backdrop');

    if (sidebarOpenButton && sidebar && sidebarBackdrop) {
        sidebarOpenButton.addEventListener('click', () => {
            sidebar.classList.remove('-translate-x-full');
            sidebar.classList.add('translate-x-0');
            sidebarBackdrop.classList.remove('hidden');
            sidebarBackdrop.classList.remove('opacity-0'); // Transition effect
            sidebarBackdrop.classList.add('opacity-100'); // Transition effect
        });
    }

    const closeSidebar = () => {
        if (sidebar && sidebarBackdrop) {
           sidebar.classList.add('-translate-x-full');
           sidebar.classList.remove('translate-x-0');
           sidebarBackdrop.classList.remove('opacity-100'); // Transition effect
           sidebarBackdrop.classList.add('opacity-0'); // Transition effect
           // Wait for transition to finish before hiding
           setTimeout(() => {
               sidebarBackdrop.classList.add('hidden');
           }, 300); // Match transition duration
       }
    };

    if (sidebarCloseButton) {
        sidebarCloseButton.addEventListener('click', closeSidebar);
    }

    if (sidebarBackdrop) {
        sidebarBackdrop.addEventListener('click', closeSidebar);
    }
}); 