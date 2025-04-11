document.addEventListener('DOMContentLoaded', function() {
    // Tab Switching
    const tabs = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    // Get tab from URL hash or default to 'chi-tiet'
    const setActiveTab = (tabId) => {
        // Remove active class from all tabs and contents
        tabs.forEach(tab => {
            const isActive = tab.getAttribute('data-tab') === tabId;
            tab.classList.toggle('active', isActive);
            tab.setAttribute('aria-selected', isActive);
        });
        tabContents.forEach(content => {
            const isActive = content.id === tabId;
            content.classList.toggle('active', isActive);
            content.setAttribute('aria-hidden', !isActive);
        });
        // Update URL hash without scrolling
        history.replaceState(null, null, `#${tabId}`);
    };

    // Set initial active tab
    const initialTab = window.location.hash.slice(1) || 'chi-tiet';
    setActiveTab(initialTab);

    // Handle tab clicks
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabId = tab.getAttribute('data-tab');
            setActiveTab(tabId);
        });
    });

    // Form Submission
    const registrationForm = document.getElementById('eventRegistrationForm');
    if (registrationForm) {
        registrationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Show success message
            const formContent = document.querySelector('.registration-form');
            formContent.innerHTML = `
                <div class="success-message">
                    <div class="success-icon">
                        <i class="fas fa-check-circle"></i>
                    </div>
                    <div class="success-text">
                        <h3>Bạn đã đăng ký tham gia sự kiện này</h3>
                        <div class="event-info">
                            <div class="info-item">
                                <i class="far fa-calendar"></i>
                                <span>Thời gian: 10/04/2023 09:00</span>
                            </div>
                            <div class="info-item">
                                <i class="fas fa-map-marker-alt"></i>
                                <span>Địa điểm: CS Tân Thới Kiệm</span>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });
    }

    // Share Functionality
    const shareButtons = document.querySelectorAll('.share-buttons .btn');
    shareButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const platform = this.getAttribute('data-platform');
            const url = window.location.href;
            const title = document.title;

            let shareUrl;
            switch (platform) {
                case 'facebook':
                    shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
                    break;
                case 'reddit':
                    shareUrl = `https://reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`;
                    break;
                case 'apple':
                    // Handle Apple sharing
                    shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
                    break;
                default:
                    // Copy to clipboard
                    navigator.clipboard.writeText(url).then(() => {
                        const tooltip = document.createElement('div');
                        tooltip.className = 'copy-tooltip';
                        tooltip.textContent = 'Đã sao chép liên kết!';
                        this.appendChild(tooltip);
                        setTimeout(() => tooltip.remove(), 2000);
                    });
                    return;
            }

            if (shareUrl) {
                window.open(shareUrl, '_blank', 'width=600,height=400');
            }
        });
    });

    // QR Code Download
    const qrDownloadBtn = document.querySelector('.share-section .btn-outline');
    if (qrDownloadBtn) {
        qrDownloadBtn.addEventListener('click', function() {
            const qrImage = document.querySelector('.qr-code img');
            if (qrImage && qrImage.src) {
                const link = document.createElement('a');
                link.href = qrImage.src;
                link.download = 'event-qr-code.png';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                // Show download confirmation
                const tooltip = document.createElement('div');
                tooltip.className = 'download-tooltip';
                tooltip.textContent = 'Đã tải mã QR!';
                this.appendChild(tooltip);
                setTimeout(() => tooltip.remove(), 2000);
            }
        });
    }

    // Timeline Animation
    const timelineItems = document.querySelectorAll('.timeline-item');
    if (timelineItems.length) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                }
            });
        }, { threshold: 0.5 });

        timelineItems.forEach(item => observer.observe(item));
    }

    // Handle Registration Status
    const registrationStatus = document.querySelector('.registration-status');
    if (registrationStatus) {
        const progressBar = registrationStatus.querySelector('.progress-bar');
        const totalSlots = 250;
        const registeredSlots = 14;
        if (progressBar) {
            const percentage = (registeredSlots / totalSlots) * 100;
            progressBar.style.width = `${percentage}%`;
        }
    }

    // Copy Share Link
    const copyLinkBtn = document.getElementById('copyLinkBtn');
    const shareLinkInput = document.getElementById('shareLink');
    if (copyLinkBtn && shareLinkInput) {
        copyLinkBtn.addEventListener('click', function() {
            shareLinkInput.select();
            document.execCommand('copy');
            copyLinkBtn.textContent = 'Đã sao chép';
            setTimeout(() => {
                copyLinkBtn.textContent = 'Sao chép';
            }, 2000);
        });
    }

    // Modal Functions
    function showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'block';
        }
    }

    function hideModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
        }
    }

    // Close Modal
    const closeButtons = document.querySelectorAll('.modal-close');
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                modal.style.display = 'none';
            }
        });
    });

    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });
}); 