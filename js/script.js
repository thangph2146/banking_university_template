// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Form validation
    const registrationForm = document.getElementById('event-registration');
    if (registrationForm) {
        registrationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const fullname = document.getElementById('fullname').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const event = document.getElementById('event').value;
            const terms = document.getElementById('terms').checked;
            
            // Simple validation
            if (!fullname || !email || !phone || !event) {
                alert('Vui lòng điền đầy đủ thông tin bắt buộc!');
                return;
            }
            
            if (!terms) {
                alert('Vui lòng đồng ý với điều khoản và điều kiện!');
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Vui lòng nhập đúng định dạng email!');
                return;
            }
            
            // Phone validation (Vietnamese phone number)
            const phoneRegex = /^(0|\+84)(\s|\.)?((3[2-9])|(5[689])|(7[06-9])|(8[1-689])|(9[0-46-9]))(\d)(\s|\.)?(\d{3})(\s|\.)?(\d{3})$/;
            if (!phoneRegex.test(phone)) {
                alert('Vui lòng nhập đúng định dạng số điện thoại!');
                return;
            }
            
            // If validation passes
            alert('Đăng ký thành công! Chúng tôi sẽ liên hệ với bạn sớm.');
            registrationForm.reset();
        });
    }
    
    // Add smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                // Add smooth scroll with easing effect
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
                const startPosition = window.pageYOffset;
                const distance = targetPosition - startPosition;
                const duration = 800; // ms
                let start = null;
                
                window.requestAnimationFrame(step);
                
                function step(timestamp) {
                    if (!start) start = timestamp;
                    const progress = timestamp - start;
                    const easeInOutQuad = t => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
                    
                    window.scrollTo({
                        top: startPosition + distance * easeInOutQuad(Math.min(progress / duration, 1)),
                        behavior: 'auto'
                    });
                    
                    if (progress < duration) {
                        window.requestAnimationFrame(step);
                    }
                }
            }
        });
    });
    
    // Add active class to nav links based on current section
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.main-nav a');
    
        window.addEventListener('scroll', function() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
    
    // Add counter animation for stats
    const statItems = document.querySelectorAll('.stat-item h3');
    let hasAnimated = false;
    
    function animateStats() {
        if (hasAnimated) return;
        
        statItems.forEach(item => {
            const target = parseInt(item.textContent);
            let count = 0;
            const duration = 2000; // 2 seconds
            const frameDuration = 1000 / 60; // 60fps
            const totalFrames = Math.round(duration / frameDuration);
            const increment = target / totalFrames;
            
            const counter = setInterval(() => {
                count += increment;
                
                if (count >= target) {
                    item.textContent = target + (item.textContent.includes('+') ? '+' : '');
                    clearInterval(counter);
            } else {
                    item.textContent = Math.floor(count) + (item.textContent.includes('+') ? '+' : '');
                }
            }, frameDuration);
        });
        
        hasAnimated = true;
    }
    
    // Check if stats section is visible
    const statsSection = document.querySelector('.stats-section');
    if (statsSection) {
        window.addEventListener('scroll', function() {
            const statsSectionTop = statsSection.offsetTop;
            const statsSectionHeight = statsSection.clientHeight;
            
            if (pageYOffset > (statsSectionTop - statsSectionHeight / 2)) {
                animateStats();
            }
        });
    }
    
    // Add event filter functionality
    const searchInput = document.querySelector('.search-box input');
    const eventCards = document.querySelectorAll('.event-card');
    
    if (searchInput && eventCards.length > 0) {
        searchInput.addEventListener('input', function() {
            const searchValue = this.value.toLowerCase();
            
            eventCards.forEach(card => {
                const title = card.querySelector('h3').textContent.toLowerCase();
                const description = card.querySelector('p').textContent.toLowerCase();
                
                if (title.includes(searchValue) || description.includes(searchValue)) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }
    
    // Mobile menu toggle
    const menuToggle = document.createElement('div');
    menuToggle.className = 'menu-toggle';
    menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
    
    const header = document.querySelector('header');
    const mainNav = document.querySelector('.main-nav');
    
    if (header && mainNav) {
        header.insertBefore(menuToggle, mainNav);
        
        menuToggle.addEventListener('click', function() {
            mainNav.classList.toggle('show');
            this.innerHTML = mainNav.classList.contains('show') ? 
                '<i class="fas fa-times"></i>' : 
                '<i class="fas fa-bars"></i>';
        });
    }
    
    // Add CSS for mobile menu
    if (window.innerWidth <= 768) {
        const style = document.createElement('style');
        style.textContent = `
            .menu-toggle {
                display: block;
                font-size: 1.5rem;
                cursor: pointer;
                color: var(--primary);
            }
            .main-nav {
                display: none;
                width: 100%;
            }
            .main-nav.show {
                display: block;
            }
            .main-nav ul {
                flex-direction: column;
                align-items: center;
            }
            .main-nav li {
                margin: 10px 0;
                width: 100%;
                text-align: center;
            }
        `;
        document.head.appendChild(style);
    }

    // Event Detail Page Functionality
    // Save event functionality
    const btnSave = document.getElementById('btnSave');
    if (btnSave) {
        btnSave.addEventListener('click', function() {
            const icon = this.querySelector('i');
            if (icon.classList.contains('far')) {
                icon.classList.remove('far');
                icon.classList.add('fas');
                this.classList.add('saved');
                this.title = 'Đã lưu sự kiện';
                
                // Hiển thị thông báo
                showToast('Đã lưu sự kiện vào danh sách yêu thích');
            } else {
                icon.classList.remove('fas');
                icon.classList.add('far');
                this.classList.remove('saved');
                this.title = 'Lưu sự kiện';
                
                // Hiển thị thông báo
                showToast('Đã xóa sự kiện khỏi danh sách yêu thích');
            }
        });
    }
    
    // Countdown timer
    const countdownElement = document.getElementById('countdown');
    if (countdownElement) {
        function updateCountdown() {
            // Lấy ngày sự kiện từ data attribute hoặc mặc định
            const eventDateElement = document.querySelector('[data-event-date]');
            const eventDateString = eventDateElement ? eventDateElement.dataset.eventDate : '2023-06-15T09:00:00';
            const eventDate = new Date(eventDateString).getTime();
            const now = new Date().getTime();
            const distance = eventDate - now;
            
            if (distance > 0) {
                const days = Math.floor(distance / (1000 * 60 * 60 * 24));
                const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((distance % (1000 * 60)) / 1000);
                
                const daysElement = document.getElementById('days');
                const hoursElement = document.getElementById('hours');
                const minutesElement = document.getElementById('minutes');
                const secondsElement = document.getElementById('seconds');
                
                if (daysElement) daysElement.innerText = String(days).padStart(2, '0');
                if (hoursElement) hoursElement.innerText = String(hours).padStart(2, '0');
                if (minutesElement) minutesElement.innerText = String(minutes).padStart(2, '0');
                if (secondsElement) secondsElement.innerText = String(seconds).padStart(2, '0');
            } else {
                clearInterval(countdownInterval);
                countdownElement.innerHTML = '<p>Sự kiện đã diễn ra</p>';
            }
        }
        
        updateCountdown();
        const countdownInterval = setInterval(updateCountdown, 1000);
    }
    
    // Event registration form
    const eventRegistrationForm = document.getElementById('event-registration-form');
    if (eventRegistrationForm) {
        const successMessage = document.getElementById('registration-success');
        const errorMessage = document.getElementById('registration-error');
        
        eventRegistrationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Simulate form submission
            const formData = new FormData(this);
            const data = Object.fromEntries(formData.entries());
            
            // Simple validation
            if (!data.fullname || !data.email || !data.phone || !data.role || !data.terms) {
                errorMessage.style.display = 'block';
                successMessage.style.display = 'none';
                return;
            }
            
            // Email validation
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(data.email)) {
                errorMessage.style.display = 'block';
                successMessage.style.display = 'none';
                return;
            }
            
            // Phone validation (Vietnamese phone number)
            const phonePattern = /^(0|\+84)[3|5|7|8|9][0-9]{8}$/;
            if (!phonePattern.test(data.phone)) {
                errorMessage.style.display = 'block';
                successMessage.style.display = 'none';
                return;
            }
            
            // Simulate successful submission
            setTimeout(() => {
                successMessage.style.display = 'block';
                errorMessage.style.display = 'none';
                eventRegistrationForm.reset();
            }, 1000);
        });
    }
    
    // Event category filter functionality
    const categoryListings = document.querySelector('.category-events');
    if (categoryListings) {
        const filterButtons = document.querySelectorAll('.category-filter button');
        const eventItems = document.querySelectorAll('.event-card');
        
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                // Add active class to current button
                this.classList.add('active');
                
                const filter = this.dataset.filter;
                
                // Filter the events
                eventItems.forEach(item => {
                    if (filter === 'all' || item.dataset.type === filter) {
                        item.style.display = 'flex';
            } else {
                        item.style.display = 'none';
                    }
                });
            });
        });
    }
    
    // Back to top button
    const backToTopButton = document.getElementById('backToTop');
    if (backToTopButton) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTopButton.classList.add('visible');
            } else {
                backToTopButton.classList.remove('visible');
            }
        });
        
        backToTopButton.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // Copy to clipboard functionality
    const copyLinkButton = document.getElementById('copyLink');
    if (copyLinkButton) {
        copyLinkButton.addEventListener('click', function(e) {
            e.preventDefault();
            
            const currentUrl = window.location.href;
            
            // Create a temporary input element
            const tempInput = document.createElement('input');
            tempInput.value = currentUrl;
            document.body.appendChild(tempInput);
            
            // Select and copy the text
            tempInput.select();
            document.execCommand('copy');
            
            // Remove the temporary element
            document.body.removeChild(tempInput);
            
            // Show success toast
            showToast('Đã sao chép link vào clipboard!');
        });
    }
    
    // Toast notification function
    function showToast(message) {
        // Check if toast container exists, if not create it
        let toastContainer = document.querySelector('.toast-container');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.className = 'toast-container';
            document.body.appendChild(toastContainer);
            
            // Add toast container styles
            const style = document.createElement('style');
            style.textContent = `
                .toast-container {
                    position: fixed;
                    bottom: 20px;
                    left: 20px;
                    z-index: 9999;
                }
                .toast {
                    background-color: rgba(0, 0, 0, 0.8);
                    color: white;
                    padding: 12px 20px;
                    border-radius: 4px;
                    margin-top: 10px;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
                    display: flex;
                    align-items: center;
                    animation: fadeInUp 0.3s, fadeOut 0.3s 2.7s forwards;
                    max-width: 300px;
                }
                .toast i {
                    margin-right: 10px;
                    font-size: 18px;
                }
                @keyframes fadeOut {
                    from { opacity: 1; }
                    to { opacity: 0; transform: translateY(20px); }
                }
            `;
            document.head.appendChild(style);
        }
        
        // Create toast element
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
        
        // Add to container
        toastContainer.appendChild(toast);
        
        // Remove after animation
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }
    
    // Animate elements when they enter viewport
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.event-detail-section, .event-speaker, .schedule-item, .event-info-item');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementPosition < windowHeight * 0.9) {
                element.classList.add('animate-in');
            }
        });
    };
    
    // Add animation classes
    if (document.querySelector('.event-detail-content')) {
        // Add animation CSS
        const animationStyle = document.createElement('style');
        animationStyle.textContent = `
            .event-detail-section, .event-speaker, .schedule-item, .event-info-item {
                opacity: 0;
                transform: translateY(20px);
                transition: opacity 0.6s ease, transform 0.6s ease;
            }
            .animate-in {
                opacity: 1;
                transform: translateY(0);
            }
            .event-detail-section:nth-child(1) { transition-delay: 0.1s; }
            .event-detail-section:nth-child(2) { transition-delay: 0.2s; }
            .event-detail-section:nth-child(3) { transition-delay: 0.3s; }
            .event-speaker:nth-child(1) { transition-delay: 0.1s; }
            .event-speaker:nth-child(2) { transition-delay: 0.2s; }
            .event-speaker:nth-child(3) { transition-delay: 0.3s; }
            .schedule-item:nth-child(odd) { transition-delay: 0.1s; }
            .schedule-item:nth-child(even) { transition-delay: 0.2s; }
            .event-info-item:nth-child(1) { transition-delay: 0.1s; }
            .event-info-item:nth-child(2) { transition-delay: 0.2s; }
            .event-info-item:nth-child(3) { transition-delay: 0.3s; }
            .event-info-item:nth-child(4) { transition-delay: 0.4s; }
        `;
        document.head.appendChild(animationStyle);
        
        // Initialize animation on first load
        animateOnScroll();
        
        // Listen for scroll to animate elements
        window.addEventListener('scroll', animateOnScroll);
    }
});

/* ======================================
   EVENT DETAIL PAGE SCRIPTS
====================================== */

// Toggle save event functionality
document.addEventListener('DOMContentLoaded', function() {
    const saveButton = document.querySelector('.btn-save');
    const shareButton = document.querySelector('.btn-share');
    const copyLinks = document.querySelectorAll('.copy-link');
    const faqItems = document.querySelectorAll('.faq-item');
    const registerForm = document.querySelector('#registerForm');
    
    // Event saving functionality
    if (saveButton) {
        saveButton.addEventListener('click', function() {
            const isSaved = saveButton.classList.contains('saved');
            const saveIcon = saveButton.querySelector('i');
            
            if (!isSaved) {
                saveButton.classList.add('saved');
                saveIcon.classList.remove('far', 'fa-bookmark');
                saveIcon.classList.add('fas', 'fa-bookmark');
                saveButton.querySelector('span').textContent = 'Đã lưu';
                showToast('Sự kiện đã được lưu thành công!');
                    } else {
                saveButton.classList.remove('saved');
                saveIcon.classList.remove('fas', 'fa-bookmark');
                saveIcon.classList.add('far', 'fa-bookmark');
                saveButton.querySelector('span').textContent = 'Lưu sự kiện';
                showToast('Đã xóa sự kiện khỏi danh sách đã lưu.', 'info');
            }
        });
    }
    
    // Copy link functionality
    if (copyLinks.length > 0) {
        copyLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                const type = this.getAttribute('data-type');
                const url = window.location.href;
                
                navigator.clipboard.writeText(url).then(() => {
                    showToast(`Đã sao chép liên kết ${type}!`);
                }).catch(err => {
                    console.error('Lỗi khi sao chép: ', err);
                });
            });
        });
    }
    
    // FAQ accordion functionality
    if (faqItems.length > 0) {
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            
            question.addEventListener('click', function() {
                const isActive = item.classList.contains('active');
                
                // Close all other items
                faqItems.forEach(faq => {
                    faq.classList.remove('active');
                });
                
                // Toggle current item
                if (!isActive) {
                    item.classList.add('active');
                }
            });
        });
    }
    
    // Registration form validation and submission
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const fullname = document.getElementById('fullname');
            const email = document.getElementById('email');
            const phone = document.getElementById('phone');
            const role = document.getElementById('role');
            const terms = document.getElementById('terms');
            
            const successAlert = document.querySelector('.alert-success');
            const errorAlert = document.querySelector('.alert-danger');
            
            // Reset alerts
            successAlert.style.display = 'none';
            errorAlert.style.display = 'none';
            
            // Reset validation errors
            document.querySelectorAll('.is-invalid').forEach(el => {
                el.classList.remove('is-invalid');
            });
            
            // Validate inputs
            let hasError = false;
            
            if (!fullname.value.trim()) {
                fullname.classList.add('is-invalid');
                hasError = true;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!email.value.trim() || !emailRegex.test(email.value.trim())) {
                email.classList.add('is-invalid');
                hasError = true;
            }
            
            // Phone validation (Vietnamese phone number format)
            const phoneRegex = /^(0|\+84)(\d{9,10})$/;
            if (!phone.value.trim() || !phoneRegex.test(phone.value.trim())) {
                phone.classList.add('is-invalid');
                hasError = true;
            }
            
            if (role.value === '') {
                role.classList.add('is-invalid');
                hasError = true;
            }
            
            if (!terms.checked) {
                terms.classList.add('is-invalid');
                hasError = true;
            }
            
            if (hasError) {
                errorAlert.style.display = 'block';
                errorAlert.textContent = 'Vui lòng điền đầy đủ thông tin và kiểm tra lại các trường đã nhập.';
                return;
            }
            
            // Submit form - in a real app, you would send to server
            registerForm.classList.add('was-validated');
            successAlert.style.display = 'block';
            successAlert.textContent = 'Đăng ký tham gia sự kiện thành công!';
            
            // Reset form after successful submission
            setTimeout(() => {
                registerForm.reset();
                registerForm.classList.remove('was-validated');
            }, 3000);
        });
    }
    
    // Initialize countdown timer
    initCountdown();
});

// Countdown timer function
function initCountdown() {
    const countdownElement = document.querySelector('.countdown-timer');
    if (!countdownElement) return;
    
    const eventDateElement = document.querySelector('[data-event-date]');
    if (!eventDateElement) return;
    
    const eventDateStr = eventDateElement.getAttribute('data-event-date');
    const eventDate = new Date(eventDateStr);
    
    function updateCountdown() {
        const now = new Date();
        const distance = eventDate - now;
        
        // If event date is in the past
        if (distance < 0) {
            countdownElement.innerHTML = '<div class="expired">Sự kiện đã kết thúc</div>';
            return;
        }
        
        // Calculate time units
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        // Display countdown
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
    
    // Update countdown immediately
    updateCountdown();
    
    // Update countdown every second
    setInterval(updateCountdown, 1000);
}

// Toast notification function
function showToast(message, type = 'success') {
    // Create toast container if it doesn't exist
    let toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container';
        document.body.appendChild(toastContainer);
    }
    
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    // Set icon based on type
    let icon = 'fa-check-circle';
    let iconColor = '#28a745';
    
    if (type === 'info') {
        icon = 'fa-info-circle';
        iconColor = '#17a2b8';
    } else if (type === 'warning') {
        icon = 'fa-exclamation-triangle';
        iconColor = '#ffc107';
    } else if (type === 'error') {
        icon = 'fa-times-circle';
        iconColor = '#dc3545';
    }
    
    // Set toast content
    toast.innerHTML = `
        <div class="toast-content">
            <i class="fas ${icon}" style="color: ${iconColor}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add toast to container
    toastContainer.appendChild(toast);
    
    // Remove after animation
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    // Remove toast after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        
        // Remove element after animation completes
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

// Handle fixed registration button for mobile
function handleMobileRegistration() {
    const registrationElement = document.querySelector('.event-registration');
    const floatingBtn = document.querySelector('.floating-registration-btn');
    
    if (!registrationElement || !floatingBtn) return;
    
    floatingBtn.querySelector('.btn').addEventListener('click', function(e) {
        e.preventDefault();
        registrationElement.scrollIntoView({behavior: 'smooth'});
    });
}

// Initialize mobile functions
if (window.innerWidth < 768) {
    handleMobileRegistration();
}

// Update available spots counter
function updateAvailableSpots() {
    const spotsElement = document.querySelector('.available-spots');
    if (!spotsElement) return;
    
    const currentSpots = parseInt(spotsElement.textContent);
    
    // Simulate spots being taken at random intervals
    if (currentSpots > 0) {
        const randomInterval = Math.floor(Math.random() * 60000) + 30000; // 30s to 90s
        
        setTimeout(() => {
            spotsElement.textContent = currentSpots - 1;
            updateAvailableSpots();
        }, randomInterval);
    }
}

// Initialize when document is ready
document.addEventListener('DOMContentLoaded', function() {
    updateAvailableSpots();
});

// ----- CATEGORY PAGE FUNCTIONALITY -----
function initCategoryPage() {
    // Check if we're on the category page
    const categoryContent = document.querySelector('.category-content');
    if (!categoryContent) return;

    // Elements
    const timeFilter = document.getElementById('timeFilter');
    const yearFilter = document.getElementById('yearFilter');
    const sortByFilter = document.getElementById('sortBy');
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.querySelector('.search-container .btn');
    const eventsGrid = document.querySelector('.events-grid');
    const eventCards = document.querySelectorAll('.event-card');
    
    // Store original order of events
    const originalEvents = Array.from(eventCards);
    
    // Filter events based on current filter settings
    function filterEvents() {
        const searchTerm = searchInput.value.toLowerCase();
        const timeValue = timeFilter.value;
        const yearValue = yearFilter.value;
        const sortValue = sortByFilter.value;
        
        // Clear grid
        eventsGrid.innerHTML = '';
        
        // Filter and sort events
        let filteredEvents = originalEvents.filter(card => {
            const title = card.querySelector('.event-title').textContent.toLowerCase();
            const description = card.querySelector('.event-desc').textContent.toLowerCase();
            const dateText = card.querySelector('.event-date').textContent;
            const eventYear = dateText.includes('Th') ? 
                              '20' + dateText.split('Th')[1].trim().substring(2) : 
                              new Date().getFullYear().toString();
            
            // Search term filter
            const matchesSearch = searchTerm === '' || 
                                title.includes(searchTerm) || 
                                description.includes(searchTerm);
            
            // Year filter
            const matchesYear = yearValue === 'all' || eventYear === yearValue;
            
            // Time filter (simplified - would use actual date comparison in real implementation)
            let matchesTime = true;
            if (timeValue === 'upcoming') {
                // For demo, assume all displayed events are upcoming
                matchesTime = true;
            } else if (timeValue === 'past') {
                // For demo, toggle visibility of the past events section
                document.querySelector('.past-events-section').style.display = 'block';
                document.querySelector('.events-section').style.display = 'none';
                return false;
            }
            
            return matchesSearch && matchesYear && matchesTime;
        });
        
        // Sort events
        filteredEvents.sort((a, b) => {
            const titleA = a.querySelector('.event-title').textContent;
            const titleB = b.querySelector('.event-title').textContent;
            const dateA = a.querySelector('.event-date .day').textContent;
            const dateB = b.querySelector('.event-date .day').textContent;
            
            if (sortValue === 'name-asc') return titleA.localeCompare(titleB);
            if (sortValue === 'name-desc') return titleB.localeCompare(titleA);
            if (sortValue === 'date-asc') return parseInt(dateA) - parseInt(dateB);
            if (sortValue === 'date-desc') return parseInt(dateB) - parseInt(dateA);
            
            return 0;
        });
        
        // Check if no events match filters
        if (filteredEvents.length === 0) {
            const noEventsMessage = document.createElement('div');
            noEventsMessage.className = 'no-events-message';
            noEventsMessage.innerHTML = `
                <div class="no-events-icon">
                    <i class="far fa-calendar-times"></i>
                </div>
                <h3>Không tìm thấy sự kiện nào</h3>
                <p>Hiện không có sự kiện nào phù hợp với tiêu chí tìm kiếm của bạn.</p>
                <button class="btn btn-primary reset-filters">Xóa bộ lọc</button>
            `;
            eventsGrid.appendChild(noEventsMessage);
            
            // Add event listener to reset button
            const resetButton = noEventsMessage.querySelector('.reset-filters');
            resetButton.addEventListener('click', resetFilters);
            } else {
            // Add filtered events back to grid
            filteredEvents.forEach(event => {
                eventsGrid.appendChild(event);
            });
        }
    }
    
    // Reset all filters
    function resetFilters() {
        searchInput.value = '';
        timeFilter.value = 'upcoming';
        yearFilter.value = 'all';
        sortByFilter.value = 'date-desc';
        
        // Reset sections visibility
        document.querySelector('.past-events-section').style.display = 'block';
        document.querySelector('.events-section').style.display = 'block';
        
        filterEvents();
    }
    
    // Add event listeners
    if (searchButton) {
        searchButton.addEventListener('click', filterEvents);
    }
    
    if (searchInput) {
        searchInput.addEventListener('keyup', function(e) {
            if (e.key === 'Enter') {
                filterEvents();
            }
        });
    }
    
    if (timeFilter) {
        timeFilter.addEventListener('change', function() {
            if (this.value === 'past') {
                // When "past" is selected, show past events section and hide upcoming
                document.querySelector('.past-events-section').style.display = 'block';
                document.querySelector('.events-section').style.display = 'none';
                } else {
                // Otherwise show both or just upcoming
                document.querySelector('.past-events-section').style.display = 'block';
                document.querySelector('.events-section').style.display = 'block';
                filterEvents();
                }
            });
        }
    
    if (yearFilter) {
        yearFilter.addEventListener('change', filterEvents);
    }
    
    if (sortByFilter) {
        sortByFilter.addEventListener('change', filterEvents);
    }
    
    // Past event hover effects
    const pastEventSlides = document.querySelectorAll('.past-event-slide');
    pastEventSlides.forEach(slide => {
        slide.addEventListener('mouseenter', function() {
            this.classList.add('hover');
        });
        
        slide.addEventListener('mouseleave', function() {
            this.classList.remove('hover');
        });
    });
    
    // Back to top button
    const backToTopBtn = document.querySelector('.back-to-top-btn');
    if (backToTopBtn) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        });
        
        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// Initialize category page functionality
document.addEventListener('DOMContentLoaded', function() {
    initCategoryPage();
});

// ----- EVENT DETAIL PAGE FUNCTIONALITY -----

// Countdown timer for event detail page
function initCountdown() {
    // Check if countdown elements exist
    if (!document.getElementById('countdown-days') || !document.getElementById('countdown-hours') || 
        !document.getElementById('countdown-minutes') || !document.getElementById('countdown-seconds')) {
        return;
    }

    const countdownDays = document.getElementById('countdown-days');
    const countdownHours = document.getElementById('countdown-hours');
    const countdownMinutes = document.getElementById('countdown-minutes');
    const countdownSeconds = document.getElementById('countdown-seconds');
    
    // Update countdown every second
    const countdownTimer = setInterval(function() {
        // Get today's date and time
        const now = new Date().getTime();
        
        // Find the distance between now and the event date
        const distance = eventDate - now;
        
        if (distance < 0) {
            // Event has passed
            clearInterval(countdownTimer);
            countdownDays.innerHTML = '00';
            countdownHours.innerHTML = '00';
            countdownMinutes.innerHTML = '00';
            countdownSeconds.innerHTML = '00';
            
            const countdownContainer = document.getElementById('countdown');
            if (countdownContainer) {
                const eventStatusMessage = document.createElement('div');
                eventStatusMessage.className = 'event-status-message';
                eventStatusMessage.innerHTML = '<i class="fas fa-info-circle"></i> Sự kiện đã kết thúc';
                countdownContainer.parentNode.insertBefore(eventStatusMessage, countdownContainer.nextSibling);
            }
            return;
        }
        
        // Time calculations for days, hours, minutes and seconds
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        // Display the result
        countdownDays.innerHTML = days < 10 ? '0' + days : days;
        countdownHours.innerHTML = hours < 10 ? '0' + hours : hours;
        countdownMinutes.innerHTML = minutes < 10 ? '0' + minutes : minutes;
        countdownSeconds.innerHTML = seconds < 10 ? '0' + seconds : seconds;
    }, 1000);
}

// Save event functionality
function initSaveEvent() {
    const saveEventBtn = document.getElementById('saveEventBtn');
    if (!saveEventBtn) return;
    
    saveEventBtn.addEventListener('click', function() {
        const icon = this.querySelector('i');
        const text = this.querySelector('span');
        
        if (icon.classList.contains('far')) {
            // Save the event
            icon.classList.remove('far');
            icon.classList.add('fas');
            text.textContent = 'Đã lưu';
            showToast('Đã lưu sự kiện!', 'success');
        } else {
            // Unsave the event
            icon.classList.remove('fas');
            icon.classList.add('far');
            text.textContent = 'Lưu sự kiện';
            showToast('Đã xóa sự kiện khỏi danh sách đã lưu!', 'info');
        }
    });
}

// Share popup functionality
function initSharePopup() {
    const shareBtn = document.getElementById('shareEventBtn');
    const sharePopup = document.getElementById('sharePopup');
    const closeSharePopup = document.getElementById('closeSharePopup');
    const copyLinkBtn = document.getElementById('copyLinkBtn');
    
    if (!shareBtn || !sharePopup) return;
    
    // Open share popup
    shareBtn.addEventListener('click', function() {
        sharePopup.style.display = 'flex';
    });
    
    // Close share popup
    if (closeSharePopup) {
        closeSharePopup.addEventListener('click', function() {
            sharePopup.style.display = 'none';
        });
    }
    
    // Click outside to close popup
    window.addEventListener('click', function(event) {
        if (event.target === sharePopup) {
            sharePopup.style.display = 'none';
        }
    });
    
    // Copy link button
    if (copyLinkBtn) {
        copyLinkBtn.addEventListener('click', function() {
            const shareLink = document.getElementById('shareLink');
            shareLink.select();
            shareLink.setSelectionRange(0, 99999); // For mobile devices
            document.execCommand('copy');
            
            // Change button text temporarily
            const originalText = this.textContent;
            this.textContent = 'Đã sao chép!';
            
            showToast('Đã sao chép liên kết vào clipboard!', 'success');
            
            setTimeout(() => {
                this.textContent = originalText;
            }, 2000);
        });
    }
    
    // Social share buttons
    const socialButtons = document.querySelectorAll('.share-button');
    socialButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const url = document.getElementById('shareLink').value;
            const title = document.title;
            let shareUrl = '';
            
            if (this.classList.contains('facebook')) {
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
            } else if (this.classList.contains('twitter')) {
                shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
            } else if (this.classList.contains('linkedin')) {
                shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
            } else if (this.classList.contains('email')) {
                shareUrl = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent('Tôi nghĩ bạn sẽ thích sự kiện này: ' + url)}`;
            }
            
            if (shareUrl) {
                window.open(shareUrl, '_blank');
            }
        });
    });
}

// FAQ accordion functionality
function initFaqAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    if (!faqItems.length) return;
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        
        question.addEventListener('click', function() {
            // Toggle active class
            item.classList.toggle('active');
            
            // Toggle icon
            const icon = this.querySelector('i');
            if (icon) {
                if (item.classList.contains('active')) {
                    icon.classList.remove('fa-chevron-down');
                    icon.classList.add('fa-chevron-up');
                } else {
                    icon.classList.remove('fa-chevron-up');
                    icon.classList.add('fa-chevron-down');
                }
            }
            
            // Toggle answer visibility
            if (item.classList.contains('active')) {
                answer.style.maxHeight = answer.scrollHeight + 'px';
            } else {
                answer.style.maxHeight = '0';
            }
        });
    });
}

// Form validation
function initFormValidation() {
    const eventRegistrationForm = document.getElementById('eventRegistrationForm');
    if (!eventRegistrationForm) return;
    
    eventRegistrationForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        let isValid = true;
        const fullname = document.getElementById('fullname');
        const email = document.getElementById('email');
        const phone = document.getElementById('phone');
        const role = document.getElementById('role');
        const terms = document.getElementById('terms');
        const studentId = document.getElementById('student_id');
        
        // Clear previous error messages
        document.querySelectorAll('.error-message').forEach(el => {
            el.textContent = '';
        });
        
        // Validate fullname
        if (!fullname.value.trim()) {
            document.getElementById('fullname-error').textContent = 'Vui lòng nhập họ và tên';
            isValid = false;
        }
        
        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.value.trim() || !emailRegex.test(email.value.trim())) {
            document.getElementById('email-error').textContent = 'Vui lòng nhập email hợp lệ';
            isValid = false;
        }
        
        // Validate phone (Vietnamese phone number format)
        const phoneRegex = /^(0|\+84)(\d{9,10})$/;
        if (!phone.value.trim() || !phoneRegex.test(phone.value.trim())) {
            document.getElementById('phone-error').textContent = 'Vui lòng nhập số điện thoại hợp lệ';
            isValid = false;
        }
        
        // Validate role
        if (!role.value) {
            document.getElementById('role-error').textContent = 'Vui lòng chọn vai trò của bạn';
            isValid = false;
        }
        
        // Validate student ID if role is student
        if (role.value === 'student' && (!studentId.value.trim())) {
            document.getElementById('student-id-error').textContent = 'Vui lòng nhập mã số sinh viên';
            isValid = false;
        }
        
        // Validate terms
        if (!terms.checked) {
            document.getElementById('terms-error').textContent = 'Bạn phải đồng ý với điều khoản và điều kiện';
            isValid = false;
        }
        
        if (isValid) {
            // Hide form and show success message
            eventRegistrationForm.style.display = 'none';
            const successMessage = document.querySelector('.registration-success');
            if (successMessage) {
                successMessage.style.display = 'block';
            }
            
            // Generate random registration code
            const registrationCode = document.querySelector('.registration-code');
            if (registrationCode) {
                const date = new Date();
                const day = date.getDate().toString().padStart(2, '0');
                const month = (date.getMonth() + 1).toString().padStart(2, '0');
                const year = date.getFullYear();
                const random = Math.floor(1000 + Math.random() * 9000);
                registrationCode.textContent = `EVT-${year}${month}${day}-${random}`;
            }
            
            // Show toast notification
            showToast('Đăng ký thành công!', 'success');
            
            // Update available spots
            const availableSpots = document.getElementById('availableSpots');
            if (availableSpots) {
                const currentSpots = parseInt(availableSpots.textContent);
                if (currentSpots > 0) {
                    availableSpots.textContent = currentSpots - 1;
                }
            }
        }
    });
}

// Back to top button
function initBackToTop() {
    const backToTopBtn = document.getElementById('backToTopBtn');
    if (!backToTopBtn) return;
    
    // Show button when scrolling down
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });
    
    // Scroll to top when button clicked
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Show toast notification
function showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) return;
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let icon = '';
    switch (type) {
        case 'success':
            icon = '<i class="fas fa-check-circle"></i>';
            break;
        case 'error':
            icon = '<i class="fas fa-exclamation-circle"></i>';
            break;
        case 'warning':
            icon = '<i class="fas fa-exclamation-triangle"></i>';
            break;
        default:
            icon = '<i class="fas fa-info-circle"></i>';
    }
    
    toast.innerHTML = `
        <div class="toast-content">
            <div class="toast-icon">${icon}</div>
            <div class="toast-message">${message}</div>
        </div>
        <button class="toast-close"><i class="fas fa-times"></i></button>
    `;
    
    toastContainer.appendChild(toast);
    
    // Add active class after a small delay to trigger animation
    setTimeout(() => {
        toast.classList.add('active');
    }, 10);
    
    // Close button
    toast.querySelector('.toast-close').addEventListener('click', function() {
        closeToast(toast);
    });
    
    // Auto close after 5 seconds
    setTimeout(() => {
        closeToast(toast);
    }, 5000);
}

// Close toast
function closeToast(toast) {
    toast.classList.remove('active');
    
    // Remove from DOM after animation
    setTimeout(() => {
        if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
        }
            }, 300);
        }

// Simulate spot updates
function initSpotUpdates() {
    const availableSpots = document.getElementById('availableSpots');
    if (!availableSpots) return;
    
    // Update spots randomly
    setInterval(() => {
        // 20% chance of updating
        if (Math.random() < 0.2) {
            const currentSpots = parseInt(availableSpots.textContent);
            if (currentSpots > 1) {
                availableSpots.textContent = currentSpots - 1;
                
                // Show toast about a spot being taken
                showToast('Vừa có người đăng ký tham gia, hãy nhanh tay!', 'info');
            }
        }
    }, 30000); // Check every 30 seconds
}

// Event listing page functionality
function initEventListing() {
    const categoryButtons = document.querySelectorAll('.filter-btn');
    const eventCards = document.querySelectorAll('.event-card');
    const noEvents = document.querySelector('.no-events');
    const eventsGrid = document.querySelector('.events-grid');
    const searchInput = document.getElementById('eventSearch');
    const sortSelect = document.getElementById('eventSort');

    if (!categoryButtons.length || !eventCards.length) return;

    // Filter function
    function filterEvents() {
        const searchValue = searchInput.value.toLowerCase();
        const activeCategory = document.querySelector('.filter-btn.active').dataset.category;
        
        let visibleCount = 0;
        
        eventCards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const description = card.querySelector('p').textContent.toLowerCase();
            const category = card.dataset.category;
            
            const matchesSearch = title.includes(searchValue) || description.includes(searchValue);
            const matchesCategory = activeCategory === 'all' || category === activeCategory;
            
            if (matchesSearch && matchesCategory) {
                card.style.display = 'flex';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });
        
        // Show/hide no events message
        if (visibleCount === 0) {
            noEvents.style.display = 'block';
            eventsGrid.style.display = 'none';
        } else {
            noEvents.style.display = 'none';
            eventsGrid.style.display = 'grid';
        }
    }
    
    // Category filter
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            categoryButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
            filterEvents();
        });
    });
    
    // Search filter
    if (searchInput) {
        searchInput.addEventListener('input', filterEvents);
    }
    
    // Sort events
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            const value = this.value;
            const cards = Array.from(eventCards);
            
            // Sort cards
            cards.sort((a, b) => {
                if (value === 'newest') {
                    const dateA = new Date(a.querySelector('.event-date .day').textContent + ' ' + a.querySelector('.event-date .month').textContent);
                    const dateB = new Date(b.querySelector('.event-date .day').textContent + ' ' + b.querySelector('.event-date .month').textContent);
                    return dateB - dateA;
                } else if (value === 'oldest') {
                    const dateA = new Date(a.querySelector('.event-date .day').textContent + ' ' + a.querySelector('.event-date .month').textContent);
                    const dateB = new Date(b.querySelector('.event-date .day').textContent + ' ' + b.querySelector('.event-date .month').textContent);
                    return dateA - dateB;
                } else if (value === 'name-asc') {
                    return a.querySelector('h3').textContent.localeCompare(b.querySelector('h3').textContent);
                } else if (value === 'name-desc') {
                    return b.querySelector('h3').textContent.localeCompare(a.querySelector('h3').textContent);
                }
                return 0;
            });
            
            // Reappend sorted cards
            cards.forEach(card => {
                eventsGrid.appendChild(card);
        });
    });
}

    // Save event functionality
    const saveButtons = document.querySelectorAll('.event-save');
    if (saveButtons.length) {
        saveButtons.forEach(button => {
            button.addEventListener('click', function() {
                const icon = this.querySelector('i');
                if (icon.classList.contains('far')) {
                    icon.classList.remove('far');
                    icon.classList.add('fas');
                    this.classList.add('saved');
                    this.title = 'Đã lưu sự kiện này';
                    showToast('Đã lưu sự kiện vào danh sách yêu thích', 'success');
                } else {
                    icon.classList.remove('fas');
                    icon.classList.add('far');
                    this.classList.remove('saved');
                    this.title = 'Lưu sự kiện này';
                    showToast('Đã xóa sự kiện khỏi danh sách yêu thích', 'info');
                }
            });
        });
    }
    
    // Pagination (for demonstration)
    const paginationButtons = document.querySelectorAll('.event-pagination button');
    if (paginationButtons.length) {
        paginationButtons.forEach(button => {
            if (!button.classList.contains('disabled')) {
                button.addEventListener('click', function() {
                    document.querySelectorAll('.event-pagination button').forEach(btn => {
                        btn.classList.remove('active');
                    });
                    this.classList.add('active');
                    // In a real application, this would load a new page of events
                    showToast('Đang tải trang ' + (this.textContent || '...'), 'info');
                });
            }
        });
    }
}

// Initialize all functions when the document is ready
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all page-specific functionality
    initEventListing();
    
    // If there are other initialization functions, call them here
    // For example:
    // initCountdown();
    // initSaveEvent();
    // etc.
});

// Authentication forms functionality
function initAuthForms() {
    // Login form validation and submission
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        const emailError = document.getElementById('email-error');
        const passwordError = document.getElementById('password-error');
        const errorMessage = document.getElementById('error-message');
        const successMessage = document.getElementById('success-message');
        
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Reset errors
            if (emailError) emailError.style.display = 'none';
            if (passwordError) passwordError.style.display = 'none';
            if (errorMessage) errorMessage.style.display = 'none';
            
            let isValid = true;
            
            // Validate email
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (emailInput && !emailPattern.test(emailInput.value)) {
                if (emailError) emailError.style.display = 'block';
                isValid = false;
            }
            
            // Validate password
            if (passwordInput && passwordInput.value.length < 6) {
                if (passwordError) passwordError.style.display = 'block';
                isValid = false;
            }
            
            if (isValid) {
                // In a real application, you would send the data to a server for authentication
                // For demo purposes, we'll simulate a successful login
                setTimeout(() => {
                    if (successMessage) successMessage.style.display = 'block';
                    
                    // Redirect after a brief delay
                    setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 2000);
                }, 1000);
            }
        });
    }
    
    // Registration form validation and submission
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        const firstNameInput = document.getElementById('first-name');
        const lastNameInput = document.getElementById('last-name');
        const emailInput = document.getElementById('email');
        const phoneInput = document.getElementById('phone');
        const passwordInput = document.getElementById('password');
        const confirmPasswordInput = document.getElementById('confirm-password');
        const roleSelect = document.getElementById('role');
        const termsCheckbox = document.getElementById('terms');
        
        const firstNameError = document.getElementById('first-name-error');
        const lastNameError = document.getElementById('last-name-error');
        const emailError = document.getElementById('email-error');
        const phoneError = document.getElementById('phone-error');
        const passwordError = document.getElementById('password-error');
        const confirmPasswordError = document.getElementById('confirm-password-error');
        const roleError = document.getElementById('role-error');
        const termsError = document.getElementById('terms-error');
        
        const errorMessage = document.getElementById('error-message');
        const successMessage = document.getElementById('success-message');
        
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Reset errors
            const errorElements = document.querySelectorAll('.validation-error');
            errorElements.forEach(el => el.style.display = 'none');
            if (errorMessage) errorMessage.style.display = 'none';
            
            let isValid = true;
            
            // Validate first name
            if (firstNameInput && firstNameInput.value.trim() === '') {
                if (firstNameError) firstNameError.style.display = 'block';
                isValid = false;
            }
            
            // Validate last name
            if (lastNameInput && lastNameInput.value.trim() === '') {
                if (lastNameError) lastNameError.style.display = 'block';
                isValid = false;
            }
            
            // Validate email
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (emailInput && !emailPattern.test(emailInput.value)) {
                if (emailError) emailError.style.display = 'block';
                isValid = false;
            }
            
            // Validate phone
            const phonePattern = /^(0|\+84)[3|5|7|8|9][0-9]{8}$/;
            if (phoneInput && !phonePattern.test(phoneInput.value)) {
                if (phoneError) phoneError.style.display = 'block';
                isValid = false;
            }
            
            // Validate password
            if (!passwordInput.value || passwordInput.value.length < 6) {
                if (passwordError) passwordError.style.display = 'block';
                isValid = false;
            } else {
                document.getElementById('password-error').style.display = 'none';
            }
            
            // Validate confirm password
            if (passwordInput.value !== confirmPasswordInput.value) {
                if (confirmPasswordError) confirmPasswordError.style.display = 'block';
                isValid = false;
            } else {
                document.getElementById('confirm-password-error').style.display = 'none';
            }
            
            // Validate role
            if (roleSelect && roleSelect.value === '') {
                if (roleError) roleError.style.display = 'block';
                isValid = false;
            }
            
            // Validate terms
            if (termsCheckbox && !termsCheckbox.checked) {
                if (termsError) termsError.style.display = 'block';
                isValid = false;
            }
            
            if (isValid) {
                // In a real application, you would send the data to a server for registration
                // For demo purposes, we'll simulate a successful registration
                setTimeout(() => {
                    if (successMessage) successMessage.style.display = 'block';
                    registerForm.reset();
                    
                    // Redirect after a brief delay
                    setTimeout(() => {
                        window.location.href = 'login.html';
                    }, 3000);
                }, 1000);
            }
        });
    }
    
    // Social login buttons
    const googleBtn = document.querySelector('.btn-google');
    if (googleBtn) {
        googleBtn.addEventListener('click', function() {
            showToast('Đăng nhập bằng Google sẽ được xử lý tại đây', 'info');
        });
    }
    
    const facebookBtn = document.querySelector('.btn-facebook');
    if (facebookBtn) {
        facebookBtn.addEventListener('click', function() {
            showToast('Đăng nhập bằng Facebook sẽ được xử lý tại đây', 'info');
        });
    }
}

/**
 * Khởi tạo tính năng đồng bộ cho header và footer
 */
function initUnifiedLayout() {
    // Header scroll
    const header = document.querySelector('.unified-header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // Menu di động
    const hamburgerBtn = document.querySelector('.hamburger-menu');
    const mobileNav = document.querySelector('.mobile-nav');
    
    if (hamburgerBtn && mobileNav) {
        hamburgerBtn.addEventListener('click', () => {
            mobileNav.classList.toggle('open');
            const isOpen = mobileNav.classList.contains('open');
            hamburgerBtn.innerHTML = isOpen ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
        });
    }

    // Nút back-to-top
    const backToTopBtn = document.querySelector('.back-to-top');
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Newsletter form
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailInput = newsletterForm.querySelector('input[type="email"]');
            if (emailInput && emailInput.value) {
                showToast('Đăng ký nhận thông báo thành công!', 'success');
                emailInput.value = '';
            }
        });
    }

    // Hiệu ứng phóng to ảnh khi hover
    const imageZoomElements = document.querySelectorAll('.image-zoom');
    if (imageZoomElements.length > 0) {
        imageZoomElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                element.classList.add('zoomed');
            });
            element.addEventListener('mouseleave', () => {
                element.classList.remove('zoomed');
            });
        });
    }

    // Thêm active class vào menu hiện tại
    setActiveMenuItem();
}

/**
 * Thiết lập trạng thái active cho menu dựa vào URL hiện tại
 */
function setActiveMenuItem() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.unified-nav-list a, .mobile-nav-list a');
    
    if (navLinks.length > 0) {
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            // Kiểm tra nếu href là trang hiện tại hoặc trang hiện tại là con của href
            if (currentPath === href || 
                (href !== 'index.html' && href !== '/' && currentPath.includes(href))) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
}

/**
 * Xử lý đăng nhập và đăng ký
 */
function handleAuthForms() {
    // Xử lý form đăng nhập
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const emailInput = document.getElementById('email');
            const passwordInput = document.getElementById('password');
            let isValid = true;
            
            // Validate email
            if (!emailInput.value || !validateEmail(emailInput.value)) {
                document.getElementById('email-error').style.display = 'block';
                isValid = false;
            } else {
                document.getElementById('email-error').style.display = 'none';
            }
            
            // Validate password
            if (!passwordInput.value || passwordInput.value.length < 6) {
                document.getElementById('password-error').style.display = 'block';
                isValid = false;
            } else {
                document.getElementById('password-error').style.display = 'none';
            }
            
            if (isValid) {
                // Giả lập đăng nhập thành công
                document.getElementById('error-message').style.display = 'none';
                document.getElementById('success-message').style.display = 'block';
                
                // Chuyển hướng sau khi đăng nhập
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 2000);
            }
        });
    }
    
    // Xử lý form đăng ký
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const firstNameInput = document.getElementById('first-name');
            const lastNameInput = document.getElementById('last-name');
            const emailInput = document.getElementById('email');
            const phoneInput = document.getElementById('phone');
            const passwordInput = document.getElementById('password');
            const confirmPasswordInput = document.getElementById('confirm-password');
            const roleInput = document.getElementById('role');
            const termsInput = document.getElementById('terms');
            
            let isValid = true;
            
            // Validate first name
            if (!firstNameInput.value.trim()) {
                document.getElementById('first-name-error').style.display = 'block';
                isValid = false;
            } else {
                document.getElementById('first-name-error').style.display = 'none';
            }
            
            // Validate last name
            if (!lastNameInput.value.trim()) {
                document.getElementById('last-name-error').style.display = 'block';
                isValid = false;
            } else {
                document.getElementById('last-name-error').style.display = 'none';
            }
            
            // Validate email
            if (!emailInput.value || !validateEmail(emailInput.value)) {
                document.getElementById('email-error').style.display = 'block';
                isValid = false;
            } else {
                document.getElementById('email-error').style.display = 'none';
            }
            
            // Validate phone
            if (!phoneInput.value || !validateVietnamesePhone(phoneInput.value)) {
                document.getElementById('phone-error').style.display = 'block';
                isValid = false;
            } else {
                document.getElementById('phone-error').style.display = 'none';
            }
            
            // Validate password
            if (!passwordInput.value || passwordInput.value.length < 6) {
                document.getElementById('password-error').style.display = 'block';
                isValid = false;
            } else {
                document.getElementById('password-error').style.display = 'none';
            }
            
            // Validate confirm password
            if (passwordInput.value !== confirmPasswordInput.value) {
                document.getElementById('confirm-password-error').style.display = 'block';
                isValid = false;
            } else {
                document.getElementById('confirm-password-error').style.display = 'none';
            }
            
            // Validate role
            if (!roleInput.value) {
                document.getElementById('role-error').style.display = 'block';
                isValid = false;
            } else {
                document.getElementById('role-error').style.display = 'none';
            }
            
            // Validate terms
            if (!termsInput.checked) {
                document.getElementById('terms-error').style.display = 'block';
                isValid = false;
            } else {
                document.getElementById('terms-error').style.display = 'none';
            }
            
            if (isValid) {
                // Giả lập đăng ký thành công
                document.getElementById('error-message').style.display = 'none';
                document.getElementById('success-message').style.display = 'block';
                
                // Chuyển hướng sau khi đăng ký
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 2000);
            }
        });
    }
}

/**
 * Kiểm tra định dạng email
 */
function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

/**
 * Kiểm tra định dạng số điện thoại Việt Nam
 */
function validateVietnamesePhone(phone) {
    const re = /^(0|\+84)(\s|\.)?((3[2-9])|(5[689])|(7[06-9])|(8[1-689])|(9[0-46-9]))(\d)(\s|\.)?(\d{3})(\s|\.)?(\d{3})$/;
    return re.test(phone);
}

/**
 * Khởi tạo bộ lọc sự kiện cho trang events
 */
function initEventFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const searchInput = document.getElementById('eventSearch');
    const sortSelect = document.getElementById('eventSort');
    const eventCards = document.querySelectorAll('.event-card');
    const noEvents = document.querySelector('.no-events');
    
    if (filterButtons.length > 0 && eventCards.length > 0) {
        // Khởi tạo bộ lọc danh mục
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const category = button.getAttribute('data-category');
                
                // Active class cho nút
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                // Lọc sự kiện
                filterEvents();
            });
        });
        
        // Khởi tạo tìm kiếm
        if (searchInput) {
            searchInput.addEventListener('input', filterEvents);
        }
        
        // Khởi tạo sắp xếp
        if (sortSelect) {
            sortSelect.addEventListener('change', sortEvents);
        }
        
        // Hàm lọc sự kiện
        function filterEvents() {
            const activeCategory = document.querySelector('.filter-btn.active').getAttribute('data-category');
            const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
            
            let visibleCount = 0;
            
            eventCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                const cardTitle = card.querySelector('h3').textContent.toLowerCase();
                const cardDesc = card.querySelector('p').textContent.toLowerCase();
                
                const matchesCategory = activeCategory === 'all' || cardCategory === activeCategory;
                const matchesSearch = searchTerm === '' || 
                                    cardTitle.includes(searchTerm) || 
                                    cardDesc.includes(searchTerm);
                
                if (matchesSearch && matchesCategory) {
                    card.style.display = 'flex';
                    visibleCount++;
                } else {
                    card.style.display = 'none';
                }
            });
            
            // Hiển thị thông báo không có sự kiện
            if (noEvents) {
                if (visibleCount === 0) {
                    noEvents.style.display = 'flex';
                } else {
                    noEvents.style.display = 'none';
                }
            }
            
            // Sắp xếp sau khi lọc
            if (sortSelect) {
                sortEvents();
            }
        }
        
        // Hàm sắp xếp sự kiện
        function sortEvents() {
            if (!sortSelect) return;
            
            const sortValue = sortSelect.value;
            const eventsContainer = document.querySelector('.events-grid');
            const visibleEvents = Array.from(eventCards).filter(card => 
                card.style.display !== 'none'
            );
            
            visibleEvents.sort((a, b) => {
                const aTitle = a.querySelector('h3').textContent;
                const bTitle = b.querySelector('h3').textContent;
                
                const aDate = new Date(a.querySelector('.event-date .day').textContent + 
                                ' ' + a.querySelector('.event-date .month').textContent);
                const bDate = new Date(b.querySelector('.event-date .day').textContent + 
                                ' ' + b.querySelector('.event-date .month').textContent);
                
                switch(sortValue) {
                    case 'newest':
                        return bDate - aDate;
                    case 'oldest':
                        return aDate - bDate;
                    case 'name-asc':
                        return aTitle.localeCompare(bTitle);
                    case 'name-desc':
                        return bTitle.localeCompare(aTitle);
                    default:
                        return 0;
                }
            });
            
            // Sắp xếp lại các phần tử
            visibleEvents.forEach(card => {
                eventsContainer.appendChild(card);
            });
        }
    }
}

// Khởi chạy tất cả các hàm khi trang đã tải xong
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all page-specific functionality
    initEventListing();
    initAuthForms();
    initEventFilters();
    
    // If there are other initialization functions, call them here
    // For example:
    // initCountdown();
    // initSaveEvent();
    // etc.
});

// Khởi tạo hiệu ứng animation khi cuộn trang
function initAnimations() {
    const animatedElements = document.querySelectorAll('.fade-in, .fade-in-up, .fade-in-down, .fade-in-left, .fade-in-right, .zoom-in');
    
    // Observer cho các phần tử hiệu ứng
    const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                const element = entry.target;
                // Thêm độ trễ nếu phần tử có thuộc tính data-delay
                const delay = element.getAttribute('data-delay');
                
                if (delay) {
                    setTimeout(() => {
                        element.classList.add('animated');
                    }, parseInt(delay));
                } else {
                    element.classList.add('animated');
                }
                
                // Dừng quan sát phần tử sau khi đã hiển thị hiệu ứng
                observer.unobserve(element);
            }
        });
    }, {
        threshold: 0.1, // Hiện hiệu ứng khi phần tử hiển thị ít nhất 10%
        rootMargin: '0px 0px -50px 0px' // Hiện sớm hơn một chút trước khi scroll đến
    });
    
    // Bắt đầu quan sát các phần tử
    animatedElements.forEach(element => {
        observer.observe(element);
    });
    
    // Xử lý hiệu ứng password toggle
    const togglePasswordButtons = document.querySelectorAll('.toggle-password');
    togglePasswordButtons.forEach(button => {
        button.addEventListener('click', function() {
            const passwordInput = this.previousElementSibling;
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            
            // Thay đổi icon
            const icon = this.querySelector('i');
            if (type === 'password') {
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            } else {
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            }
        });
    });
    
    // Hiệu ứng ripple cho buttons
    const rippleButtons = document.querySelectorAll('.btn-ripple');
    rippleButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Xử lý hiệu ứng hover cho images
    const zoomImages = document.querySelectorAll('.image-zoom');
    zoomImages.forEach(container => {
        container.addEventListener('mouseenter', () => {
            container.classList.add('zoomed');
        });
        
        container.addEventListener('mouseleave', () => {
            container.classList.remove('zoomed');
        });
    });
    
    // Xử lý animation counter cho số liệu thống kê
    const counters = document.querySelectorAll('.counter');
    counters.forEach(counter => {
                    const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000; // 2 giây
        const stepTime = 20; // Cập nhật mỗi 20ms
        const increment = target / (duration / stepTime);
        let current = 0;
        
                    const updateCounter = () => {
            current += increment;
            
            if (current < target) {
                counter.textContent = Math.floor(current);
                setTimeout(updateCounter, stepTime);
                        } else {
                            counter.textContent = target;
                        }
                    };
        
        // Bắt đầu đếm khi phần tử xuất hiện trong viewport
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    updateCounter();
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        counterObserver.observe(counter);
    });
}

// Khởi tạo tất cả các chức năng khi trang đã load xong
document.addEventListener('DOMContentLoaded', function() {
    // Khởi tạo layout đồng bộ
    initUnifiedLayout();
    
    // Xác định trang hiện tại và khởi tạo các chức năng tương ứng
    const currentPage = window.location.pathname;
    
    if (currentPage.includes('index.html') || currentPage === '/' || currentPage.endsWith('/')) {
        // Trang chủ
        console.log('Trang chủ đã được tải');
        // Các hàm khởi tạo cho trang chủ
    } else if (currentPage.includes('events.html')) {
        // Trang danh sách sự kiện
        console.log('Trang sự kiện đã được tải');
        initEventListing();
    } else if (currentPage.includes('event-detail.html')) {
        // Trang chi tiết sự kiện
        console.log('Trang chi tiết sự kiện đã được tải');
        initCountdown();
        initSaveEvent();
        initSharePopup();
        initFaqAccordion();
        initFormValidation();
        initSpotUpdates();
    } else if (currentPage.includes('event-category.html')) {
        // Trang danh mục sự kiện
        console.log('Trang danh mục sự kiện đã được tải');
        initCategoryPage();
    } else if (currentPage.includes('login.html') || currentPage.includes('register.html')) {
        // Trang đăng nhập/đăng ký
        console.log('Trang xác thực đã được tải');
        initAuthForms();
    }
    
    // Khởi tạo hiệu ứng animations chung cho tất cả các trang
    initAnimations();
    
    // Các chức năng chung cho tất cả các trang
    setActiveMenuItem();
    initBackToTop();
});

/**
 * Khởi tạo chức năng cho trang danh mục sự kiện
 */
function initCategoryPage() {
    // Chỉ thực hiện nếu đang ở trang danh mục sự kiện
    if (!document.querySelector('.categories-grid')) return;
    
    console.log('Initializing category page features...');
    
    // Xử lý hiệu ứng xuất hiện lần lượt cho các phần tử
    animateCategories();
    
    // Xử lý nút lưu sự kiện
    initSaveEventButtons();
    
    // Xử lý nếu có URL có tham số category
    handleCategoryParam();
    
    // Khởi tạo hiệu ứng smooth scroll khi click vào danh mục
    initSmoothScroll();
}

/**
 * Tạo hiệu ứng xuất hiện lần lượt cho các phần tử trong trang danh mục
 */
function animateCategories() {
    const fadeElements = document.querySelectorAll('.fade-in, .fade-in-up, .fade-in-down, .fade-in-left, .fade-in-right');
    
    // Thêm class animated cho từng phần tử sau một khoảng thời gian
    fadeElements.forEach(element => {
        const delay = element.dataset.delay ? parseInt(element.dataset.delay) : 0;
        
        setTimeout(() => {
            element.classList.add('animated');
        }, delay);
    });
}

/**
 * Xử lý tham số danh mục trong URL
 */
function handleCategoryParam() {
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');
    
    if (category) {
        // Nếu có tham số category, tìm và scroll đến phần tương ứng
        const categorySection = document.getElementById(category);
        if (categorySection) {
            setTimeout(() => {
                categorySection.scrollIntoView({ behavior: 'smooth' });
            }, 500);
        }
        
        // Highlight danh mục được chọn
        const categoryCards = document.querySelectorAll('.category-card');
        categoryCards.forEach(card => {
            if (card.getAttribute('href') === `#${category}`) {
                card.classList.add('active');
            }
        });
    }
}

/**
 * Khởi tạo hiệu ứng smooth scroll khi click vào danh mục
 */
function initSmoothScroll() {
    const categoryLinks = document.querySelectorAll('.category-card');
    
    categoryLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                // Xóa class active khỏi tất cả các card
                categoryLinks.forEach(card => card.classList.remove('active'));
                
                // Thêm class active cho card hiện tại
                this.classList.add('active');
                
                // Scroll đến phần tương ứng
                targetElement.scrollIntoView({ behavior: 'smooth' });
                
                // Cập nhật URL không làm refresh trang
                const url = new URL(window.location);
                url.searchParams.set('category', targetId);
                window.history.pushState({}, '', url);
            }
        });
    });
}

/**
 * Khởi tạo chức năng lọc và tìm kiếm sự kiện trong danh mục
 */
function initCategorySearch() {
    const searchInput = document.querySelector('.unified-search input');
    if (!searchInput) return;
    
    const searchButton = document.querySelector('.unified-search button');
    const eventCards = document.querySelectorAll('.event-card');
    
    // Xử lý khi click nút tìm kiếm
    searchButton.addEventListener('click', performSearch);
    
    // Xử lý khi nhấn Enter trong ô tìm kiếm
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
    
    function performSearch() {
        const query = searchInput.value.toLowerCase().trim();
        
        if (query === '') {
            // Nếu query rỗng, hiển thị tất cả sự kiện
            eventCards.forEach(card => {
                card.style.display = 'flex';
            });
                return;
            }
            
        let foundCount = 0;
        
        // Lọc sự kiện theo từ khóa tìm kiếm
        eventCards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const description = card.querySelector('p').textContent.toLowerCase();
            
            if (title.includes(query) || description.includes(query)) {
                card.style.display = 'flex';
                foundCount++;
            } else {
                card.style.display = 'none';
            }
        });
        
        // Hiển thị thông báo nếu không tìm thấy sự kiện nào
        if (foundCount === 0) {
            showToast('Không tìm thấy sự kiện nào phù hợp với từ khóa tìm kiếm.', 'info');
        } else {
            showToast(`Đã tìm thấy ${foundCount} sự kiện phù hợp.`, 'success');
        }
    }
}

// Khởi tạo các chức năng khi trang đã tải xong
document.addEventListener('DOMContentLoaded', function() {
    // ... existing code ...
    
    // Khởi tạo chức năng cho trang danh mục sự kiện
    initCategoryPage();
    
    // Khởi tạo chức năng tìm kiếm cho trang danh mục
    initCategorySearch();
});

/**
 * Khởi tạo chức năng cho trang chi tiết sự kiện
 */
function initEventDetailPage() {
    // Chỉ thực hiện nếu đang ở trang chi tiết sự kiện
    if (!document.querySelector('.event-hero')) return;
    
    console.log('Initializing event detail page features...');
    
    // Xử lý hiệu ứng xuất hiện cho các phần tử
    animateElements();
    
    // Xử lý đăng ký sự kiện
    initRegistrationForm();
    
    // Xử lý bộ đếm ngược
    initCountdown();
    
    // Xử lý FAQ accordion
    initFaqAccordion();
    
    // Xử lý nút lưu sự kiện
    initSaveEventButtons();
    
    // Xử lý chia sẻ sự kiện
    initShareEvent();
    
    // Xử lý nút đăng ký mobile
    initMobileRegisterButton();
    
    // Cập nhật số lượng chỗ còn trống
    updateAvailableSpots();
}

/**
 * Tạo hiệu ứng xuất hiện cho các phần tử trong trang
 */
function animateElements() {
    const fadeElements = document.querySelectorAll('.fade-in, .fade-in-up, .fade-in-down, .fade-in-left, .fade-in-right');
    
    // Thêm class animated cho từng phần tử sau một khoảng thời gian
    fadeElements.forEach(element => {
        const delay = element.dataset.delay ? parseInt(element.dataset.delay) : 0;
        
        setTimeout(() => {
            element.classList.add('animated');
        }, delay);
    });
}

/**
 * Xử lý đăng ký sự kiện
 */
function initRegistrationForm() {
    const form = document.getElementById('eventRegistrationForm');
    if (!form) return;
    
    const roleSelect = document.getElementById('role');
    const studentIdGroup = document.getElementById('student-id-group');
    
    // Hiển thị trường mã số sinh viên khi chọn vai trò là sinh viên
    if (roleSelect && studentIdGroup) {
        roleSelect.addEventListener('change', function() {
            if (this.value === 'student') {
                studentIdGroup.style.display = 'block';
                document.getElementById('student_id').setAttribute('required', 'required');
            } else {
                studentIdGroup.style.display = 'none';
                document.getElementById('student_id').removeAttribute('required');
            }
        });
    }
    
    // Xử lý submit form
    form.addEventListener('submit', function(e) {
            e.preventDefault();
            
        // Kiểm tra các trường dữ liệu
        let isValid = true;
        
        // Họ tên
        const fullname = document.getElementById('fullname');
        if (!fullname.value.trim()) {
            showError(fullname, 'Vui lòng nhập họ tên');
            isValid = false;
        } else {
            clearError(fullname);
        }
        
        // Email
        const email = document.getElementById('email');
        if (!email.value.trim()) {
            showError(email, 'Vui lòng nhập email');
            isValid = false;
        } else if (!isValidEmail(email.value.trim())) {
            showError(email, 'Email không hợp lệ');
            isValid = false;
        } else {
            clearError(email);
        }
        
        // Số điện thoại
        const phone = document.getElementById('phone');
        if (!phone.value.trim()) {
            showError(phone, 'Vui lòng nhập số điện thoại');
            isValid = false;
        } else if (!isValidVietnamesePhone(phone.value.trim())) {
            showError(phone, 'Số điện thoại không hợp lệ');
            isValid = false;
        } else {
            clearError(phone);
        }
        
        // Vai trò
        const role = document.getElementById('role');
        if (!role.value) {
            showError(role, 'Vui lòng chọn vai trò');
            isValid = false;
        } else {
            clearError(role);
        }
        
        // Mã số sinh viên nếu là sinh viên
        if (role.value === 'student') {
            const studentId = document.getElementById('student_id');
            if (!studentId.value.trim()) {
                showError(studentId, 'Vui lòng nhập mã số sinh viên');
                isValid = false;
            } else {
                clearError(studentId);
            }
        }
        
        // Điều khoản
        const terms = document.getElementById('terms');
        if (!terms.checked) {
            document.getElementById('terms-error').textContent = 'Bạn phải đồng ý với điều khoản và điều kiện';
            isValid = false;
        } else {
            document.getElementById('terms-error').textContent = '';
        }
        
        // Nếu form hợp lệ, hiển thị thông báo thành công
        if (isValid) {
            form.style.display = 'none';
            document.querySelector('.registration-success').style.display = 'block';
            
            // Tạo mã đăng ký ngẫu nhiên
            const registrationCode = 'EVT-' + new Date().toISOString().slice(0, 10).replace(/-/g, '') + '-' + Math.floor(1000 + Math.random() * 9000);
            document.querySelector('.registration-code').textContent = registrationCode;
            
            // Hiển thị toast thành công
            showToast('Đăng ký tham gia sự kiện thành công!', 'success');
            
            // Cập nhật số lượng chỗ còn trống
            const availableSpots = document.getElementById('availableSpots');
            if (availableSpots) {
                const currentSpots = parseInt(availableSpots.textContent);
                if (currentSpots > 0) {
                    availableSpots.textContent = currentSpots - 1;
                }
            }
        }
    });
    
    // Hàm hiển thị lỗi
    function showError(input, message) {
        const errorElement = document.getElementById(input.id + '-error');
        if (errorElement) {
            errorElement.textContent = message;
        }
        input.classList.add('is-invalid');
    }
    
    // Hàm xóa lỗi
    function clearError(input) {
        const errorElement = document.getElementById(input.id + '-error');
        if (errorElement) {
            errorElement.textContent = '';
        }
        input.classList.remove('is-invalid');
    }
}

/**
 * Xử lý bộ đếm ngược
 */
function initCountdown() {
    const countdownElement = document.getElementById('countdown');
    if (!countdownElement) return;
    
    const daysElement = document.getElementById('countdown-days');
    const hoursElement = document.getElementById('countdown-hours');
    const minutesElement = document.getElementById('countdown-minutes');
    const secondsElement = document.getElementById('countdown-seconds');
    
    // Đặt ngày đích (ví dụ: 15/12/2023 08:30:00)
    const targetDate = new Date('2023-12-15T08:30:00').getTime();
    
    // Cập nhật đếm ngược mỗi giây
    const countdownInterval = setInterval(function() {
        // Lấy thời gian hiện tại
        const now = new Date().getTime();
        
        // Tính khoảng cách giữa hiện tại và ngày đích
        const distance = targetDate - now;
        
        // Nếu đã qua ngày đích
        if (distance < 0) {
            clearInterval(countdownInterval);
            daysElement.textContent = '00';
            hoursElement.textContent = '00';
            minutesElement.textContent = '00';
            secondsElement.textContent = '00';
            
            // Hiển thị thông báo sự kiện đã bắt đầu
            const countdownSection = document.querySelector('.countdown-section');
            if (countdownSection) {
                countdownSection.innerHTML = '<div class="container">' +
                    '<h2>Sự kiện đã bắt đầu!</h2>' +
                    '<p>Hãy nhanh chân đến tham dự hoặc theo dõi trực tuyến.</p>' +
                    '<a href="#" class="btn btn-primary btn-ripple">Xem trực tuyến</a>' +
                    '</div>';
            }
            return;
        }
        
        // Tính toán ngày, giờ, phút, giây
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        // Hiển thị kết quả
        daysElement.textContent = String(days).padStart(2, '0');
        hoursElement.textContent = String(hours).padStart(2, '0');
        minutesElement.textContent = String(minutes).padStart(2, '0');
        secondsElement.textContent = String(seconds).padStart(2, '0');
            }, 1000);
}

/**
 * Xử lý FAQ accordion
 */
function initFaqAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        const icon = item.querySelector('i');
        
        question.addEventListener('click', function() {
            // Toggle hiển thị câu trả lời
            const isOpen = item.classList.contains('active');
            
            // Đóng tất cả các FAQ item khác
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                    otherItem.querySelector('.faq-answer').style.maxHeight = '0px';
                    otherItem.querySelector('i').classList.remove('fa-chevron-up');
                    otherItem.querySelector('i').classList.add('fa-chevron-down');
                }
            });
            
            // Toggle FAQ item hiện tại
            if (isOpen) {
                item.classList.remove('active');
                answer.style.maxHeight = '0px';
                icon.classList.remove('fa-chevron-up');
                icon.classList.add('fa-chevron-down');
    } else {
                item.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + 'px';
                icon.classList.remove('fa-chevron-down');
                icon.classList.add('fa-chevron-up');
            }
        });
    });
}

/**
 * Xử lý nút chia sẻ sự kiện
 */
function initShareEvent() {
    const shareBtn = document.getElementById('shareEventBtn');
    const sharePopup = document.getElementById('sharePopup');
    const closeSharePopup = document.getElementById('closeSharePopup');
    const copyLinkBtn = document.getElementById('copyLinkBtn');
    const shareLinkInput = document.getElementById('shareLink');
    
    if (!shareBtn || !sharePopup) return;
    
    // Hiển thị popup khi click nút chia sẻ
    shareBtn.addEventListener('click', function() {
        sharePopup.classList.add('active');
    });
    
    // Đóng popup khi click nút đóng
    if (closeSharePopup) {
        closeSharePopup.addEventListener('click', function() {
            sharePopup.classList.remove('active');
        });
    }
    
    // Click bên ngoài popup để đóng
    window.addEventListener('click', function(e) {
        if (e.target === sharePopup) {
            sharePopup.classList.remove('active');
        }
    });
    
    // Copy link khi click nút sao chép
    if (copyLinkBtn && shareLinkInput) {
        copyLinkBtn.addEventListener('click', function() {
            shareLinkInput.select();
            document.execCommand('copy');
            
            // Hiển thị thông báo đã sao chép
            copyLinkBtn.textContent = 'Đã sao chép';
            setTimeout(() => {
                copyLinkBtn.textContent = 'Sao chép';
            }, 2000);
            
            showToast('Đã sao chép liên kết vào clipboard!', 'success');
        });
    }
    
    // Xử lý nút chia sẻ mạng xã hội
    const shareButtons = document.querySelectorAll('.share-buttons a');
    
    shareButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const url = shareLinkInput.value;
            const text = 'Tham gia cùng tôi tại ' + document.querySelector('.event-title').textContent;
            
            let shareUrl = '';
            
            if (this.classList.contains('facebook')) {
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
            } else if (this.classList.contains('twitter')) {
                shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
            } else if (this.classList.contains('linkedin')) {
                shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
            } else if (this.classList.contains('email')) {
                shareUrl = `mailto:?subject=${encodeURIComponent(text)}&body=${encodeURIComponent(url)}`;
            }
            
            if (shareUrl) {
                window.open(shareUrl, '_blank');
            }
        });
    });
}

/**
 * Xử lý nút đăng ký mobile
 */
function initMobileRegisterButton() {
    const mobileBtn = document.getElementById('mobileRegisterBtn');
    const registrationForm = document.getElementById('registrationForm');
    
    if (!mobileBtn || !registrationForm) return;
    
    mobileBtn.addEventListener('click', function() {
        registrationForm.scrollIntoView({ behavior: 'smooth' });
    });
}

/**
 * Cập nhật số lượng chỗ còn trống
 */
function updateAvailableSpots() {
    const availableSpots = document.getElementById('availableSpots');
    if (!availableSpots) return;
    
    // Giá trị ban đầu
    let spots = parseInt(availableSpots.textContent);
    
    // Cập nhật ngẫu nhiên số chỗ còn trống mỗi 30-60 giây
    setInterval(function() {
        // Chỉ giảm số chỗ còn trống nếu còn chỗ
        if (spots > 0) {
            // Giảm ngẫu nhiên 1-3 chỗ
            const decrease = Math.floor(Math.random() * 3) + 1;
            spots = Math.max(0, spots - decrease);
            
            // Cập nhật hiển thị với hiệu ứng
            availableSpots.classList.add('update-pulse');
            availableSpots.textContent = spots;
            
            setTimeout(() => {
                availableSpots.classList.remove('update-pulse');
            }, 1000);
            
            // Hiển thị thông báo nếu chỗ còn ít
            if (spots <= 50) {
                showToast(`Chỉ còn ${spots} chỗ trống! Đăng ký ngay!`, 'warning');
            }
        }
        
        // Nếu hết chỗ, hiển thị thông báo
        if (spots === 0) {
            showToast('Đã hết chỗ! Vui lòng liên hệ BTC để biết thêm thông tin.', 'error');
            clearInterval(this);
        }
    }, Math.floor(Math.random() * 30000) + 30000); // 30-60 giây
}

// Khởi tạo các chức năng khi trang đã tải xong
document.addEventListener('DOMContentLoaded', function() {
    // ... existing code ...
    
    // Khởi tạo chức năng cho trang chi tiết sự kiện
    initEventDetailPage();
}); 