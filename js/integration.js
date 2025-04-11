// Tích hợp các thành phần và kiểm thử chức năng
document.addEventListener('DOMContentLoaded', function() {
    // Kiểm tra trạng thái đăng nhập
    checkLoginStatus();
    
    // Khởi tạo các thành phần chung
    initializeCommonComponents();
    
    // Khởi tạo các thành phần trang cụ thể
    initializePageSpecificComponents();
    
    // Khởi tạo các sự kiện
    initializeEvents();
});

// Kiểm tra trạng thái đăng nhập
function checkLoginStatus() {
    const user = JSON.parse(localStorage.getItem('user'));
    const authButtons = document.querySelector('.unified-auth-buttons');
    const mobileAuthButtons = document.querySelector('.mobile-nav .unified-auth-buttons');
    
    if (user) {
        // Người dùng đã đăng nhập
        const authContent = `
            <div class="user-dropdown">
                <button class="user-dropdown-toggle">
                    <div class="user-avatar-small">
                        <img src="${user.avatar || 'https://placehold.co/150x150'}" alt="Avatar">
                    </div>
                    <span>${user.name || 'Người dùng'}</span>
                    <i class="fas fa-chevron-down"></i>
                </button>
                <div class="user-dropdown-menu">
                    <a href="/pages/student-dashboard.html"><i class="fas fa-tachometer-alt"></i> Tổng quan</a>
                    <a href="/pages/profile.html"><i class="fas fa-user"></i> Hồ sơ cá nhân</a>
                    <a href="/pages/student-events.html"><i class="fas fa-calendar-check"></i> Sự kiện của tôi</a>
                    <a href="/pages/student-certificates.html"><i class="fas fa-certificate"></i> Chứng chỉ</a>
                    <a href="/pages/student-settings.html"><i class="fas fa-cog"></i> Cài đặt</a>
                    <div class="dropdown-divider"></div>
                    <a href="#" id="headerLogoutBtn"><i class="fas fa-sign-out-alt"></i> Đăng xuất</a>
                </div>
            </div>
        `;
        
        if (authButtons) {
            authButtons.innerHTML = authContent;
        }
        
        if (mobileAuthButtons) {
            mobileAuthButtons.innerHTML = authContent;
        }
        
        // Thêm sự kiện đăng xuất
        const headerLogoutBtn = document.getElementById('headerLogoutBtn');
        if (headerLogoutBtn) {
            headerLogoutBtn.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Xóa dữ liệu người dùng
                localStorage.removeItem('user');
                
                // Hiển thị thông báo thành công
                showToast('success', 'Đăng xuất thành công', 'Bạn đã đăng xuất khỏi hệ thống.');
                
                // Chuyển hướng về trang chủ sau 1 giây
                setTimeout(function() {
                    window.location.href = '/index.html';
                }, 1000);
            });
        }
        
        // Kiểm tra các trang yêu cầu đăng nhập
        const restrictedPages = [
            '/pages/student-dashboard.html',
            '/pages/profile.html',
            '/pages/student-events.html',
            '/pages/student-certificates.html',
            '/pages/student-settings.html'
        ];
        
        const currentPath = window.location.pathname;
        
        // Nếu đang ở trang đăng nhập hoặc đăng ký, chuyển hướng về trang chủ
        if (currentPath === '/pages/login.html' || currentPath === '/pages/register.html') {
            window.location.href = '/index.html';
        }
    } else {
        // Người dùng chưa đăng nhập
        const authContent = `
            <a href="/pages/login.html" class="btn btn-outline">Đăng nhập</a>
            <a href="/pages/register.html" class="btn btn-primary">Đăng ký</a>
        `;
        
        if (authButtons) {
            authButtons.innerHTML = authContent;
        }
        
        if (mobileAuthButtons) {
            mobileAuthButtons.innerHTML = authContent;
        }
        
        // Kiểm tra các trang yêu cầu đăng nhập
        const restrictedPages = [
            '/pages/student-dashboard.html',
            '/pages/profile.html',
            '/pages/student-events.html',
            '/pages/student-certificates.html',
            '/pages/student-settings.html'
        ];
        
        const currentPath = window.location.pathname;
        
        // Nếu đang ở trang yêu cầu đăng nhập, chuyển hướng về trang đăng nhập
        if (restrictedPages.includes(currentPath)) {
            window.location.href = '/pages/login.html';
        }
    }
}

// Khởi tạo các thành phần chung
function initializeCommonComponents() {
    // Hamburger menu
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const mobileNav = document.querySelector('.mobile-nav');
    
    if (hamburgerMenu && mobileNav) {
        hamburgerMenu.addEventListener('click', function() {
            mobileNav.classList.toggle('active');
            document.body.classList.toggle('mobile-nav-open');
        });
    }
    
    // Back to top button
    const backToTopButton = document.getElementById('backToTop');
    
    if (backToTopButton) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTopButton.classList.add('active');
            } else {
                backToTopButton.classList.remove('active');
            }
        });
        
        backToTopButton.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // User dropdown
    const userDropdownToggle = document.querySelector('.user-dropdown-toggle');
    
    if (userDropdownToggle) {
        userDropdownToggle.addEventListener('click', function() {
            this.parentElement.classList.toggle('active');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            const dropdown = document.querySelector('.user-dropdown');
            if (dropdown && !dropdown.contains(e.target)) {
                dropdown.classList.remove('active');
            }
        });
    }
}

// Khởi tạo các thành phần trang cụ thể
function initializePageSpecificComponents() {
    const currentPath = window.location.pathname;
    
    // Trang chủ
    if (currentPath === '/' || currentPath === '/index.html') {
        initializeHomePage();
    }
    
    // Trang danh sách sự kiện
    else if (currentPath === '/pages/events.html') {
        initializeEventsPage();
    }
    
    // Trang chi tiết sự kiện
    else if (currentPath === '/pages/event-detail.html') {
        initializeEventDetailPage();
    }
    
    // Trang đăng nhập
    else if (currentPath === '/pages/login.html') {
        initializeLoginPage();
    }
    
    // Trang đăng ký
    else if (currentPath === '/pages/register.html') {
        initializeRegisterPage();
    }
    
    // Trang quản lý sự kiện
    else if (currentPath === '/pages/student-dashboard.html') {
        initializeStudentDashboardPage();
    }
    
    // Trang hồ sơ cá nhân
    else if (currentPath === '/pages/profile.html') {
        initializeProfilePage();
    }
}

// Khởi tạo các sự kiện
function initializeEvents() {
    // Xử lý các form
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            // Ngăn chặn hành vi mặc định của form
            e.preventDefault();
            
            // Xử lý form dựa trên ID
            if (form.id === 'loginForm') {
                handleLoginForm(form);
            } else if (form.id === 'registerForm') {
                handleRegisterForm(form);
            } else if (form.id === 'eventRegistrationForm') {
                handleEventRegistrationForm(form);
            } else if (form.id === 'personalInfoForm') {
                handlePersonalInfoForm(form);
            } else if (form.id === 'academicInfoForm') {
                handleAcademicInfoForm(form);
            } else if (form.id === 'securityForm') {
                handleSecurityForm(form);
            }
        });
    });
    
    // Xử lý các modal
    const modalTriggers = document.querySelectorAll('[data-modal]');
    
    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', function() {
            const modalId = this.getAttribute('data-modal');
            showModal(modalId);
        });
    });
    
    // Đóng modal khi nhấp vào nút đóng hoặc bên ngoài modal
    document.querySelectorAll('.modal-close, .modal-close-btn').forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal');
            hideModal(modal.id);
        });
    });
    
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                hideModal(this.id);
            }
        });
    });
}

// Khởi tạo trang chủ
function initializeHomePage() {
    // Slider sự kiện nổi bật
    const featuredEventsSlider = document.querySelector('.featured-events-slider');
    
    if (featuredEventsSlider) {
        // Trong một ứng dụng thực tế, bạn sẽ sử dụng một thư viện slider như Swiper.js
        // Đây là một triển khai đơn giản cho mục đích demo
        const slides = featuredEventsSlider.querySelectorAll('.featured-event');
        const prevButton = featuredEventsSlider.querySelector('.slider-prev');
        const nextButton = featuredEventsSlider.querySelector('.slider-next');
        let currentSlide = 0;
        
        function showSlide(index) {
            slides.forEach((slide, i) => {
                slide.style.display = i === index ? 'block' : 'none';
            });
        }
        
        function nextSlide() {
            currentSlide = (currentSlide + 1) % slides.length;
            showSlide(currentSlide);
        }
        
        function prevSlide() {
            currentSlide = (currentSlide - 1 + slides.length) % slides.length;
            showSlide(currentSlide);
        }
        
        if (prevButton) {
            prevButton.addEventListener('click', prevSlide);
        }
        
        if (nextButton) {
            nextButton.addEventListener('click', nextSlide);
        }
        
        // Tự động chuyển slide
        setInterval(nextSlide, 5000);
        
        // Hiển thị slide đầu tiên
        showSlide(0);
    }
    
    // Hiệu ứng đếm số
    const statsNumbers = document.querySelectorAll('.stats-number');
    
    if (statsNumbers.length > 0) {
        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.5
        };
        
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = entry.target;
                    const targetValue = parseInt(target.getAttribute('data-target'));
                    let currentValue = 0;
                    const duration = 2000; // 2 seconds
                    const increment = targetValue / (duration / 16);
                    
                    const counter = setInterval(() => {
                        currentValue += increment;
                        
                        if (currentValue >= targetValue) {
                            target.textContent = targetValue.toLocaleString();
                            clearInterval(counter);
                        } else {
                            target.textContent = Math.floor(currentValue).toLocaleString();
                        }
                    }, 16);
                    
                    observer.unobserve(target);
                }
            });
        }, options);
        
        statsNumbers.forEach(number => {
            observer.observe(number);
        });
    }
}

// Khởi tạo trang danh sách sự kiện
function initializeEventsPage() {
    // Xử lý phân trang
    const paginationLinks = document.querySelectorAll('.pagination-link');
    
    if (paginationLinks.length > 0) {
        paginationLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Xóa lớp active khỏi tất cả các liên kết
                paginationLinks.forEach(l => l.classList.remove('active'));
                
                // Thêm lớp active cho liên kết được nhấp
                this.classList.add('active');
                
                // Trong một ứng dụng thực tế, bạn sẽ tải dữ liệu trang mới từ API
                // Đây là một triển khai đơn giản cho mục đích demo
                const page = this.getAttribute('data-page');
                
                // Hiển thị thông báo
                showToast('info', 'Chuyển trang', `Đã chuyển đến trang ${page}`);
            });
        });
    }
    
    // Xử lý bộ lọc sự kiện
    const filterForm = document.getElementById('eventFilterForm');
    
    if (filterForm) {
        filterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Trong một ứng dụng thực tế, bạn sẽ lấy giá trị từ form và gửi yêu cầu lọc đến API
            // Đây là một triển khai đơn giản cho mục đích demo
            
            // Hiển thị thông báo
            showToast('info', 'Lọc sự kiện', 'Đã áp dụng bộ lọc sự kiện');
        });
    }
}

// Khởi tạo trang chi tiết sự kiện
function initializeEventDetailPage() {
    // Xử lý đăng ký sự kiện
    const registrationForm = document.getElementById('eventRegistrationForm');
    
    if (registrationForm) {
        registrationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Kiểm tra đăng nhập
            const user = JSON.parse(localStorage.getItem('user'));
            
            if (!user) {
                // Chuyển hướng đến trang đăng nhập
                window.location.href = '/pages/login.html';
                return;
            }
            
            // Lấy ID sự kiện từ URL
            const urlParams = new URLSearchParams(window.location.search);
            const eventId = parseInt(urlParams.get('id'));
            
            if (!eventId) {
                showToast('error', 'Lỗi', 'Không tìm thấy thông tin sự kiện');
                return;
            }
            
            // Hiển thị spinner
            showSpinner();
            
            // Mô phỏng API call
            setTimeout(function() {
                // Ẩn spinner
                hideSpinner();
                
                // Lấy danh sách đăng ký từ localStorage
                let registrations = JSON.parse(localStorage.getItem('registrations')) || [];
                
                // Kiểm tra xem người dùng đã đăng ký sự kiện này chưa
                const existingRegistration = registrations.find(reg => reg.eventId === eventId && reg.userId === user.id);
                
                if (existingRegistration) {
                    showToast('warning', 'Đã đăng ký', 'Bạn đã đăng ký tham gia sự kiện này rồi');
                    return;
                }
                
                // Thêm đăng ký mới
                registrations.push({
                    id: Date.now(),
                    eventId: eventId,
                    userId: user.id,
                    registrationDate: new Date().toISOString(),
                    status: 'registered'
                });
                
                // Lưu vào localStorage
                localStorage.setItem('registrations', JSON.stringify(registrations));
                
                // Hiển thị modal thành công
                showModal('registrationSuccessModal');
            }, 1500);
        });
    }
    
    // Đếm ngược thời gian
    const countdownElement = document.getElementById('eventCountdown');
    
    if (countdownElement) {
        const eventDate = new Date(countdownElement.getAttribute('data-date'));
        
        function updateCountdown() {
            const now = new Date();
            const diff = eventDate - now;
            
            if (diff <= 0) {
                countdownElement.innerHTML = '<div class="countdown-expired">Sự kiện đã diễn ra</div>';
                return;
            }
            
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);
            
            countdownElement.innerHTML = `
                <div class="countdown-item">
                    <div class="countdown-value">${days}</div>
                    <div class="countdown-label">Ngày</div>
                </div>
                <div class="countdown-item">
                    <div class="countdown-value">${hours}</div>
                    <div class="countdown-label">Giờ</div>
                </div>
                <div class="countdown-item">
                    <div class="countdown-value">${minutes}</div>
                    <div class="countdown-label">Phút</div>
                </div>
                <div class="countdown-item">
                    <div class="countdown-value">${seconds}</div>
                    <div class="countdown-label">Giây</div>
                </div>
            `;
        }
        
        // Cập nhật đếm ngược mỗi giây
        updateCountdown();
        setInterval(updateCountdown, 1000);
    }
}

// Khởi tạo trang đăng nhập
function initializeLoginPage() {
    const loginForm = document.getElementById('loginForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Lấy giá trị từ form
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            // Xác thực form
            let isValid = true;
            
            // Xác thực email
            if (!validateEmail(email)) {
                showError(document.getElementById('email'), 'emailError', 'Vui lòng nhập email hợp lệ');
                isValid = false;
            } else {
                hideError(document.getElementById('email'), 'emailError');
            }
            
            // Xác thực mật khẩu
            if (password.trim() === '') {
                showError(document.getElementById('password'), 'passwordError', 'Vui lòng nhập mật khẩu');
                isValid = false;
            } else {
                hideError(document.getElementById('password'), 'passwordError');
            }
            
            if (isValid) {
                // Hiển thị spinner
                showSpinner();
                
                // Mô phỏng API call
                setTimeout(function() {
                    // Ẩn spinner
                    hideSpinner();
                    
                    // Trong một ứng dụng thực tế, bạn sẽ gửi yêu cầu đăng nhập đến API
                    // Đây là một triển khai đơn giản cho mục đích demo
                    
                    // Kiểm tra xem người dùng đã đăng ký chưa
                    const users = JSON.parse(localStorage.getItem('users')) || [];
                    const user = users.find(u => u.email === email);
                    
                    if (!user) {
                        document.getElementById('loginError').style.display = 'flex';
                        document.getElementById('loginError').querySelector('p').textContent = 'Email không tồn tại. Vui lòng đăng ký tài khoản.';
                        return;
                    }
                    
                    // Trong một ứng dụng thực tế, bạn sẽ kiểm tra mật khẩu bằng cách an toàn hơn
                    if (user.password !== password) {
                        document.getElementById('loginError').style.display = 'flex';
                        document.getElementById('loginError').querySelector('p').textContent = 'Mật khẩu không chính xác. Vui lòng thử lại.';
                        return;
                    }
                    
                    // Lưu thông tin người dùng vào localStorage
                    localStorage.setItem('user', JSON.stringify({
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        avatar: user.avatar || null
                    }));
                    
                    // Hiển thị thông báo thành công
                    showToast('success', 'Đăng nhập thành công', 'Chào mừng bạn quay trở lại!');
                    
                    // Chuyển hướng đến trang chủ sau 1 giây
                    setTimeout(function() {
                        window.location.href = '/index.html';
                    }, 1000);
                }, 1500);
            }
        });
    }
}

// Khởi tạo trang đăng ký
function initializeRegisterPage() {
    const registerForm = document.getElementById('registerForm');
    
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Lấy giá trị từ form
            const name = document.getElementById('fullName').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            
            // Xác thực form
            let isValid = true;
            
            // Xác thực họ tên
            if (name.trim() === '') {
                showError(document.getElementById('fullName'), 'fullNameError', 'Vui lòng nhập họ và tên');
                isValid = false;
            } else {
                hideError(document.getElementById('fullName'), 'fullNameError');
            }
            
            // Xác thực email
            if (!validateEmail(email)) {
                showError(document.getElementById('email'), 'emailError', 'Vui lòng nhập email hợp lệ');
                isValid = false;
            } else {
                hideError(document.getElementById('email'), 'emailError');
            }
            
            // Xác thực mật khẩu
            if (password.length < 8) {
                showError(document.getElementById('password'), 'passwordError', 'Mật khẩu phải có ít nhất 8 ký tự');
                isValid = false;
            } else if (!validatePassword(password)) {
                showError(document.getElementById('password'), 'passwordError', 'Mật khẩu phải bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt');
                isValid = false;
            } else {
                hideError(document.getElementById('password'), 'passwordError');
            }
            
            // Xác thực xác nhận mật khẩu
            if (confirmPassword !== password) {
                showError(document.getElementById('confirmPassword'), 'confirmPasswordError', 'Mật khẩu xác nhận không khớp');
                isValid = false;
            } else {
                hideError(document.getElementById('confirmPassword'), 'confirmPasswordError');
            }
            
            if (isValid) {
                // Hiển thị spinner
                showSpinner();
                
                // Mô phỏng API call
                setTimeout(function() {
                    // Ẩn spinner
                    hideSpinner();
                    
                    // Trong một ứng dụng thực tế, bạn sẽ gửi yêu cầu đăng ký đến API
                    // Đây là một triển khai đơn giản cho mục đích demo
                    
                    // Kiểm tra xem email đã tồn tại chưa
                    const users = JSON.parse(localStorage.getItem('users')) || [];
                    const existingUser = users.find(u => u.email === email);
                    
                    if (existingUser) {
                        document.getElementById('registerError').style.display = 'flex';
                        document.getElementById('registerError').querySelector('p').textContent = 'Email đã tồn tại. Vui lòng sử dụng email khác hoặc đăng nhập.';
                        return;
                    }
                    
                    // Thêm người dùng mới
                    const newUser = {
                        id: Date.now(),
                        name: name,
                        email: email,
                        password: password // Trong một ứng dụng thực tế, bạn sẽ mã hóa mật khẩu
                    };
                    
                    users.push(newUser);
                    
                    // Lưu vào localStorage
                    localStorage.setItem('users', JSON.stringify(users));
                    
                    // Lưu thông tin người dùng vào localStorage
                    localStorage.setItem('user', JSON.stringify({
                        id: newUser.id,
                        name: newUser.name,
                        email: newUser.email
                    }));
                    
                    // Hiển thị thông báo thành công
                    showToast('success', 'Đăng ký thành công', 'Tài khoản của bạn đã được tạo thành công!');
                    
                    // Chuyển hướng đến trang chủ sau 1 giây
                    setTimeout(function() {
                        window.location.href = '/index.html';
                    }, 1000);
                }, 1500);
            }
        });
        
        // Cập nhật độ mạnh mật khẩu
        document.getElementById('password').addEventListener('input', function() {
            updatePasswordStrength(this.value);
        });
    }
}

// Khởi tạo trang quản lý sự kiện
function initializeStudentDashboardPage() {
    // Xử lý chuyển tab
    const tabs = document.querySelectorAll('.dashboard-tab');
    const tabContents = document.querySelectorAll('.dashboard-tab-content');
    
    if (tabs.length > 0 && tabContents.length > 0) {
        tabs.forEach(tab => {
            tab.addEventListener('click', function() {
                // Xóa lớp active khỏi tất cả các tab
                tabs.forEach(t => t.classList.remove('active'));
                
                // Thêm lớp active cho tab được nhấp
                this.classList.add('active');
                
                // Ẩn tất cả nội dung tab
                tabContents.forEach(content => content.classList.remove('active'));
                
                // Hiển thị nội dung tab tương ứng
                const tabId = this.getAttribute('data-tab');
                document.getElementById(tabId).classList.add('active');
            });
        });
    }
    
    // Xử lý hủy đăng ký
    const confirmCancelBtn = document.getElementById('confirmCancelBtn');
    
    if (confirmCancelBtn) {
        confirmCancelBtn.addEventListener('click', function() {
            const eventId = parseInt(this.getAttribute('data-event-id'));
            
            // Hiển thị spinner
            showSpinner();
            
            // Mô phỏng API call
            setTimeout(function() {
                // Ẩn spinner
                hideSpinner();
                
                // Xóa đăng ký khỏi localStorage
                let registrations = JSON.parse(localStorage.getItem('registrations')) || [];
                registrations = registrations.filter(reg => reg.eventId !== eventId);
                localStorage.setItem('registrations', JSON.stringify(registrations));
                
                // Ẩn modal
                hideModal('cancelRegistrationModal');
                
                // Hiển thị thông báo thành công
                showToast('success', 'Hủy đăng ký thành công', 'Bạn đã hủy đăng ký tham gia sự kiện thành công.');
                
                // Tải lại trang sau 1 giây
                setTimeout(function() {
                    window.location.reload();
                }, 1000);
            }, 1500);
        });
    }
}

// Khởi tạo trang hồ sơ cá nhân
function initializeProfilePage() {
    // Xử lý chuyển tab
    const tabs = document.querySelectorAll('.profile-tab');
    const tabContents = document.querySelectorAll('.profile-tab-content');
    
    if (tabs.length > 0 && tabContents.length > 0) {
        tabs.forEach(tab => {
            tab.addEventListener('click', function() {
                // Xóa lớp active khỏi tất cả các tab
                tabs.forEach(t => t.classList.remove('active'));
                
                // Thêm lớp active cho tab được nhấp
                this.classList.add('active');
                
                // Ẩn tất cả nội dung tab
                tabContents.forEach(content => content.classList.remove('active'));
                
                // Hiển thị nội dung tab tương ứng
                const tabId = this.getAttribute('data-tab');
                document.getElementById(tabId).classList.add('active');
            });
        });
    }
    
    // Cập nhật chuyên ngành dựa trên khoa đã chọn
    const facultySelect = document.getElementById('faculty');
    
    if (facultySelect) {
        facultySelect.addEventListener('change', updateMajors);
    }
    
    // Cập nhật độ mạnh mật khẩu
    const newPasswordInput = document.getElementById('newPassword');
    
    if (newPasswordInput) {
        newPasswordInput.addEventListener('input', function() {
            updatePasswordStrength(this.value);
        });
    }
    
    // Xử lý hiển thị/ẩn mật khẩu
    const passwordToggles = document.querySelectorAll('.password-toggle');
    
    if (passwordToggles.length > 0) {
        passwordToggles.forEach(toggle => {
            toggle.addEventListener('click', function() {
                const passwordInput = this.previousElementSibling;
                const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
                passwordInput.setAttribute('type', type);
                
                // Chuyển đổi biểu tượng
                const icon = this.querySelector('i');
                if (type === 'text') {
                    icon.classList.remove('fa-eye');
                    icon.classList.add('fa-eye-slash');
                } else {
                    icon.classList.remove('fa-eye-slash');
                    icon.classList.add('fa-eye');
                }
            });
        });
    }
}

// Xử lý form đăng nhập
function handleLoginForm(form) {
    // Lấy giá trị từ form
    const email = form.querySelector('#email').value;
    const password = form.querySelector('#password').value;
    
    // Xác thực form
    let isValid = true;
    
    // Xác thực email
    if (!validateEmail(email)) {
        showError(form.querySelector('#email'), 'emailError', 'Vui lòng nhập email hợp lệ');
        isValid = false;
    } else {
        hideError(form.querySelector('#email'), 'emailError');
    }
    
    // Xác thực mật khẩu
    if (password.trim() === '') {
        showError(form.querySelector('#password'), 'passwordError', 'Vui lòng nhập mật khẩu');
        isValid = false;
    } else {
        hideError(form.querySelector('#password'), 'passwordError');
    }
    
    if (isValid) {
        // Hiển thị spinner
        showSpinner();
        
        // Mô phỏng API call
        setTimeout(function() {
            // Ẩn spinner
            hideSpinner();
            
            // Trong một ứng dụng thực tế, bạn sẽ gửi yêu cầu đăng nhập đến API
            // Đây là một triển khai đơn giản cho mục đích demo
            
            // Kiểm tra xem người dùng đã đăng ký chưa
            const users = JSON.parse(localStorage.getItem('users')) || [];
            const user = users.find(u => u.email === email);
            
            if (!user) {
                document.getElementById('loginError').style.display = 'flex';
                document.getElementById('loginError').querySelector('p').textContent = 'Email không tồn tại. Vui lòng đăng ký tài khoản.';
                return;
            }
            
            // Trong một ứng dụng thực tế, bạn sẽ kiểm tra mật khẩu bằng cách an toàn hơn
            if (user.password !== password) {
                document.getElementById('loginError').style.display = 'flex';
                document.getElementById('loginError').querySelector('p').textContent = 'Mật khẩu không chính xác. Vui lòng thử lại.';
                return;
            }
            
            // Lưu thông tin người dùng vào localStorage
            localStorage.setItem('user', JSON.stringify({
                id: user.id,
                name: user.name,
                email: user.email,
                avatar: user.avatar || null
            }));
            
            // Hiển thị thông báo thành công
            showToast('success', 'Đăng nhập thành công', 'Chào mừng bạn quay trở lại!');
            
            // Chuyển hướng đến trang chủ sau 1 giây
            setTimeout(function() {
                window.location.href = '/index.html';
            }, 1000);
        }, 1500);
    }
}

// Xử lý form đăng ký
function handleRegisterForm(form) {
    // Lấy giá trị từ form
    const name = form.querySelector('#fullName').value;
    const email = form.querySelector('#email').value;
    const password = form.querySelector('#password').value;
    const confirmPassword = form.querySelector('#confirmPassword').value;
    
    // Xác thực form
    let isValid = true;
    
    // Xác thực họ tên
    if (name.trim() === '') {
        showError(form.querySelector('#fullName'), 'fullNameError', 'Vui lòng nhập họ và tên');
        isValid = false;
    } else {
        hideError(form.querySelector('#fullName'), 'fullNameError');
    }
    
    // Xác thực email
    if (!validateEmail(email)) {
        showError(form.querySelector('#email'), 'emailError', 'Vui lòng nhập email hợp lệ');
        isValid = false;
    } else {
        hideError(form.querySelector('#email'), 'emailError');
    }
    
    // Xác thực mật khẩu
    if (password.length < 8) {
        showError(form.querySelector('#password'), 'passwordError', 'Mật khẩu phải có ít nhất 8 ký tự');
        isValid = false;
    } else if (!validatePassword(password)) {
        showError(form.querySelector('#password'), 'passwordError', 'Mật khẩu phải bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt');
        isValid = false;
    } else {
        hideError(form.querySelector('#password'), 'passwordError');
    }
    
    // Xác thực xác nhận mật khẩu
    if (confirmPassword !== password) {
        showError(form.querySelector('#confirmPassword'), 'confirmPasswordError', 'Mật khẩu xác nhận không khớp');
        isValid = false;
    } else {
        hideError(form.querySelector('#confirmPassword'), 'confirmPasswordError');
    }
    
    if (isValid) {
        // Hiển thị spinner
        showSpinner();
        
        // Mô phỏng API call
        setTimeout(function() {
            // Ẩn spinner
            hideSpinner();
            
            // Trong một ứng dụng thực tế, bạn sẽ gửi yêu cầu đăng ký đến API
            // Đây là một triển khai đơn giản cho mục đích demo
            
            // Kiểm tra xem email đã tồn tại chưa
            const users = JSON.parse(localStorage.getItem('users')) || [];
            const existingUser = users.find(u => u.email === email);
            
            if (existingUser) {
                document.getElementById('registerError').style.display = 'flex';
                document.getElementById('registerError').querySelector('p').textContent = 'Email đã tồn tại. Vui lòng sử dụng email khác hoặc đăng nhập.';
                return;
            }
            
            // Thêm người dùng mới
            const newUser = {
                id: Date.now(),
                name: name,
                email: email,
                password: password // Trong một ứng dụng thực tế, bạn sẽ mã hóa mật khẩu
            };
            
            users.push(newUser);
            
            // Lưu vào localStorage
            localStorage.setItem('users', JSON.stringify(users));
            
            // Lưu thông tin người dùng vào localStorage
            localStorage.setItem('user', JSON.stringify({
                id: newUser.id,
                name: newUser.name,
                email: newUser.email
            }));
            
            // Hiển thị thông báo thành công
            showToast('success', 'Đăng ký thành công', 'Tài khoản của bạn đã được tạo thành công!');
            
            // Chuyển hướng đến trang chủ sau 1 giây
            setTimeout(function() {
                window.location.href = '/index.html';
            }, 1000);
        }, 1500);
    }
}

// Xử lý form đăng ký sự kiện
function handleEventRegistrationForm(form) {
    // Kiểm tra đăng nhập
    const user = JSON.parse(localStorage.getItem('user'));
    
    if (!user) {
        // Chuyển hướng đến trang đăng nhập
        window.location.href = '/pages/login.html';
        return;
    }
    
    // Lấy ID sự kiện từ URL
    const urlParams = new URLSearchParams(window.location.search);
    const eventId = parseInt(urlParams.get('id'));
    
    if (!eventId) {
        showToast('error', 'Lỗi', 'Không tìm thấy thông tin sự kiện');
        return;
    }
    
    // Hiển thị spinner
    showSpinner();
    
    // Mô phỏng API call
    setTimeout(function() {
        // Ẩn spinner
        hideSpinner();
        
        // Lấy danh sách đăng ký từ localStorage
        let registrations = JSON.parse(localStorage.getItem('registrations')) || [];
        
        // Kiểm tra xem người dùng đã đăng ký sự kiện này chưa
        const existingRegistration = registrations.find(reg => reg.eventId === eventId && reg.userId === user.id);
        
        if (existingRegistration) {
            showToast('warning', 'Đã đăng ký', 'Bạn đã đăng ký tham gia sự kiện này rồi');
            return;
        }
        
        // Thêm đăng ký mới
        registrations.push({
            id: Date.now(),
            eventId: eventId,
            userId: user.id,
            registrationDate: new Date().toISOString(),
            status: 'registered'
        });
        
        // Lưu vào localStorage
        localStorage.setItem('registrations', JSON.stringify(registrations));
        
        // Hiển thị modal thành công
        showModal('registrationSuccessModal');
    }, 1500);
}

// Xử lý form thông tin cá nhân
function handlePersonalInfoForm(form) {
    // Lấy giá trị từ form
    const fullName = form.querySelector('#fullName').value;
    const phone = form.querySelector('#phone').value;
    const birthdate = form.querySelector('#birthdate').value;
    const gender = form.querySelector('#gender').value;
    const address = form.querySelector('#address').value;
    
    // Xác thực form
    let isValid = true;
    
    // Xác thực họ tên
    if (fullName.trim() === '') {
        showError(form.querySelector('#fullName'), 'fullNameError', 'Vui lòng nhập họ và tên');
        isValid = false;
    } else {
        hideError(form.querySelector('#fullName'), 'fullNameError');
    }
    
    // Xác thực số điện thoại
    if (!validatePhone(phone)) {
        showError(form.querySelector('#phone'), 'phoneError', 'Vui lòng nhập số điện thoại hợp lệ');
        isValid = false;
    } else {
        hideError(form.querySelector('#phone'), 'phoneError');
    }
    
    if (isValid) {
        // Hiển thị spinner
        showSpinner();
        
        // Mô phỏng API call
        setTimeout(function() {
            // Ẩn spinner
            hideSpinner();
            
            // Cập nhật dữ liệu người dùng trong localStorage
            const user = JSON.parse(localStorage.getItem('user'));
            
            user.name = fullName;
            user.phone = phone;
            user.birthdate = birthdate;
            user.gender = gender;
            user.address = address;
            
            localStorage.setItem('user', JSON.stringify(user));
            
            // Cập nhật tên người dùng hiển thị
            document.getElementById('userName').textContent = user.name;
            
            // Hiển thị thông báo thành công
            document.getElementById('personalInfoSuccess').style.display = 'flex';
            document.getElementById('personalInfoError').style.display = 'none';
            
            // Ẩn thông báo thành công sau 3 giây
            setTimeout(function() {
                document.getElementById('personalInfoSuccess').style.display = 'none';
            }, 3000);
            
            // Hiển thị toast
            showToast('success', 'Cập nhật thành công', 'Thông tin cá nhân của bạn đã được cập nhật.');
        }, 1500);
    }
}

// Xử lý form thông tin học tập
function handleAcademicInfoForm(form) {
    // Lấy giá trị từ form
    const studentId = form.querySelector('#studentId').value;
    const faculty = form.querySelector('#faculty').value;
    const major = form.querySelector('#major').value;
    const className = form.querySelector('#class').value;
    const enrollmentYear = form.querySelector('#enrollmentYear').value;
    const graduationYear = form.querySelector('#graduationYear').value;
    
    // Xác thực form
    let isValid = true;
    
    // Xác thực mã số sinh viên
    if (studentId.trim() === '') {
        showError(form.querySelector('#studentId'), 'studentIdError', 'Vui lòng nhập mã số sinh viên');
        isValid = false;
    } else {
        hideError(form.querySelector('#studentId'), 'studentIdError');
    }
    
    // Xác thực khoa
    if (faculty === '') {
        showError(form.querySelector('#faculty'), 'facultyError', 'Vui lòng chọn khoa');
        isValid = false;
    } else {
        hideError(form.querySelector('#faculty'), 'facultyError');
    }
    
    if (isValid) {
        // Hiển thị spinner
        showSpinner();
        
        // Mô phỏng API call
        setTimeout(function() {
            // Ẩn spinner
            hideSpinner();
            
            // Cập nhật dữ liệu người dùng trong localStorage
            const user = JSON.parse(localStorage.getItem('user'));
            
            user.studentId = studentId;
            user.faculty = faculty;
            user.major = major;
            user.class = className;
            user.enrollmentYear = enrollmentYear;
            user.graduationYear = graduationYear;
            
            localStorage.setItem('user', JSON.stringify(user));
            
            // Hiển thị thông báo thành công
            document.getElementById('academicInfoSuccess').style.display = 'flex';
            document.getElementById('academicInfoError').style.display = 'none';
            
            // Ẩn thông báo thành công sau 3 giây
            setTimeout(function() {
                document.getElementById('academicInfoSuccess').style.display = 'none';
            }, 3000);
            
            // Hiển thị toast
            showToast('success', 'Cập nhật thành công', 'Thông tin học tập của bạn đã được cập nhật.');
        }, 1500);
    }
}

// Xử lý form bảo mật
function handleSecurityForm(form) {
    // Lấy giá trị từ form
    const currentPassword = form.querySelector('#currentPassword').value;
    const newPassword = form.querySelector('#newPassword').value;
    const confirmPassword = form.querySelector('#confirmPassword').value;
    
    // Xác thực form
    let isValid = true;
    
    // Xác thực mật khẩu hiện tại
    if (currentPassword.trim() === '') {
        showError(form.querySelector('#currentPassword'), 'currentPasswordError', 'Vui lòng nhập mật khẩu hiện tại');
        isValid = false;
    } else {
        hideError(form.querySelector('#currentPassword'), 'currentPasswordError');
    }
    
    // Xác thực mật khẩu mới
    if (newPassword.length < 8) {
        showError(form.querySelector('#newPassword'), 'newPasswordError', 'Mật khẩu phải có ít nhất 8 ký tự');
        isValid = false;
    } else if (!validatePassword(newPassword)) {
        showError(form.querySelector('#newPassword'), 'newPasswordError', 'Mật khẩu phải bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt');
        isValid = false;
    } else {
        hideError(form.querySelector('#newPassword'), 'newPasswordError');
    }
    
    // Xác thực xác nhận mật khẩu
    if (confirmPassword !== newPassword) {
        showError(form.querySelector('#confirmPassword'), 'confirmPasswordError', 'Mật khẩu xác nhận không khớp');
        isValid = false;
    } else {
        hideError(form.querySelector('#confirmPassword'), 'confirmPasswordError');
    }
    
    if (isValid) {
        // Hiển thị spinner
        showSpinner();
        
        // Mô phỏng API call
        setTimeout(function() {
            // Ẩn spinner
            hideSpinner();
            
            // Trong một ứng dụng thực tế, bạn sẽ gửi yêu cầu đổi mật khẩu đến API
            // Đây là một triển khai đơn giản cho mục đích demo
            
            // Hiển thị thông báo thành công
            document.getElementById('securitySuccess').style.display = 'flex';
            document.getElementById('securityError').style.display = 'none';
            
            // Ẩn thông báo thành công sau 3 giây
            setTimeout(function() {
                document.getElementById('securitySuccess').style.display = 'none';
            }, 3000);
            
            // Đặt lại form
            form.reset();
            
            // Đặt lại đồng hồ đo độ mạnh mật khẩu
            updatePasswordStrength('');
            
            // Hiển thị toast
            showToast('success', 'Cập nhật thành công', 'Mật khẩu của bạn đã được cập nhật.');
        }, 1500);
    }
}

// Cập nhật chuyên ngành dựa trên khoa đã chọn
function updateMajors() {
    const faculty = document.getElementById('faculty').value;
    const majorSelect = document.getElementById('major');
    
    if (!majorSelect) return;
    
    // Xóa các tùy chọn hiện tại
    majorSelect.innerHTML = '<option value="">Chọn chuyên ngành</option>';
    
    // Thêm các tùy chọn dựa trên khoa đã chọn
    if (faculty === 'finance-banking') {
        addOption(majorSelect, 'banking', 'Ngân hàng');
        addOption(majorSelect, 'finance', 'Tài chính');
        addOption(majorSelect, 'investment', 'Đầu tư');
    } else if (faculty === 'accounting') {
        addOption(majorSelect, 'financial-accounting', 'Kế toán tài chính');
        addOption(majorSelect, 'management-accounting', 'Kế toán quản trị');
        addOption(majorSelect, 'auditing', 'Kiểm toán');
    } else if (faculty === 'management') {
        addOption(majorSelect, 'business-admin', 'Quản trị kinh doanh');
        addOption(majorSelect, 'marketing', 'Marketing');
        addOption(majorSelect, 'hrm', 'Quản trị nhân lực');
    } else if (faculty === 'it') {
        addOption(majorSelect, 'information-systems', 'Hệ thống thông tin');
        addOption(majorSelect, 'software-engineering', 'Kỹ thuật phần mềm');
        addOption(majorSelect, 'data-science', 'Khoa học dữ liệu');
    } else if (faculty === 'law') {
        addOption(majorSelect, 'business-law', 'Luật kinh doanh');
        addOption(majorSelect, 'banking-law', 'Luật ngân hàng');
        addOption(majorSelect, 'international-law', 'Luật quốc tế');
    }
}

// Thêm tùy chọn vào phần tử select
function addOption(selectElement, value, text) {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = text;
    selectElement.appendChild(option);
}

// Cập nhật đồng hồ đo độ mạnh mật khẩu
function updatePasswordStrength(password) {
    const strengthMeter = document.querySelector('.strength-meter-fill');
    const strengthText = document.querySelector('.strength-text span');
    
    if (!strengthMeter || !strengthText) return;
    
    let strength = 0;
    
    if (password.length >= 8) strength += 1;
    if (password.match(/[a-z]+/)) strength += 1;
    if (password.match(/[A-Z]+/)) strength += 1;
    if (password.match(/[0-9]+/)) strength += 1;
    if (password.match(/[@$!%*?&]+/)) strength += 1;
    
    strengthMeter.setAttribute('data-strength', strength);
    
    switch (strength) {
        case 0:
        case 1:
            strengthText.textContent = 'Yếu';
            strengthText.style.color = '#dc3545';
            break;
        case 2:
        case 3:
            strengthText.textContent = 'Trung bình';
            strengthText.style.color = '#ffc107';
            break;
        case 4:
            strengthText.textContent = 'Mạnh';
            strengthText.style.color = '#28a745';
            break;
        case 5:
            strengthText.textContent = 'Rất mạnh';
            strengthText.style.color = '#28a745';
            break;
    }
}

// Xác thực email
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}

// Xác thực số điện thoại
function validatePhone(phone) {
    const re = /^[0-9]{10,11}$/;
    return re.test(String(phone));
}

// Xác thực mật khẩu
function validatePassword(password) {
    // Mật khẩu phải chứa ít nhất một chữ hoa, một chữ thường, một số và một ký tự đặc biệt
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return re.test(String(password));
}

// Hiển thị thông báo lỗi
function showError(input, errorId, message) {
    input.classList.add('error');
    input.classList.remove('success');
    const errorElement = document.getElementById(errorId);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
}

// Ẩn thông báo lỗi
function hideError(input, errorId) {
    input.classList.remove('error');
    input.classList.add('success');
    const errorElement = document.getElementById(errorId);
    if (errorElement) {
        errorElement.style.display = 'none';
    }
}

// Hiển thị modal
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        document.body.classList.add('modal-open');
    }
}

// Ẩn modal
function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        document.body.classList.remove('modal-open');
    }
}

// Hiển thị spinner
function showSpinner() {
    const spinner = document.querySelector('.spinner-overlay');
    if (spinner) {
        spinner.classList.add('active');
    }
}

// Ẩn spinner
function hideSpinner() {
    const spinner = document.querySelector('.spinner-overlay');
    if (spinner) {
        spinner.classList.remove('active');
    }
}

// Hiển thị toast
function showToast(type, title, message) {
    const toastContainer = document.querySelector('.toast-container');
    
    if (!toastContainer) return;
    
    // Tạo phần tử toast
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    // Đặt biểu tượng dựa trên loại
    let icon = '';
    switch (type) {
        case 'success':
            icon = 'fa-check-circle';
            break;
        case 'error':
            icon = 'fa-exclamation-circle';
            break;
        case 'info':
            icon = 'fa-info-circle';
            break;
        case 'warning':
            icon = 'fa-exclamation-triangle';
            break;
    }
    
    // Tạo nội dung toast
    toast.innerHTML = `
        <div class="toast-icon">
            <i class="fas ${icon}"></i>
        </div>
        <div class="toast-content">
            <div class="toast-title">${title}</div>
            <div class="toast-message">${message}</div>
        </div>
        <button class="toast-close">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Thêm toast vào container
    toastContainer.appendChild(toast);
    
    // Thêm trình nghe sự kiện đóng
    toast.querySelector('.toast-close').addEventListener('click', function() {
        toast.style.animation = 'slideOut 0.3s forwards';
        setTimeout(function() {
            toast.remove();
        }, 300);
    });
    
    // Tự động xóa sau 5 giây
    setTimeout(function() {
        if (toast.parentNode) {
            toast.style.animation = 'slideOut 0.3s forwards';
            setTimeout(function() {
                toast.remove();
            }, 300);
        }
    }, 5000);
}
