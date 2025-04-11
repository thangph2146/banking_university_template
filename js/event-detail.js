document.addEventListener('DOMContentLoaded', function() {
    // Tab Switching
    const tabs = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs and contents
            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            // Add active class to clicked tab and corresponding content
            tab.classList.add('active');
            const contentId = tab.getAttribute('data-tab');
            document.getElementById(contentId).classList.add('active');
        });
    });

    // Form Submission
    const registrationForm = document.getElementById('eventRegistrationForm');
    if (registrationForm) {
        registrationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Show success modal
            showModal('registrationSuccessModal');
        });
    }

    // Share Functionality
    const shareButtons = document.querySelectorAll('.share-buttons .btn');
    shareButtons.forEach(button => {
        button.addEventListener('click', function() {
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
                    // Handle Apple sharing if needed
                    break;
                default:
                    showModal('shareModal');
                    return;
            }

            if (shareUrl) {
                window.open(shareUrl, '_blank', 'width=600,height=400');
            }
        });
    });

    // QR Code Download
    const qrDownloadBtn = document.querySelector('.share-section .btn-block');
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
            }
        });
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