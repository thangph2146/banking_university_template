document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const googleLoginBtn = document.getElementById('googleLogin');
    const facebookLoginBtn = document.getElementById('facebookLogin');

    // Xử lý đăng nhập thông thường
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            });

            const data = await response.json();

            if (response.ok) {
                // Lưu token vào localStorage
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                
                // Chuyển hướng đến trang chủ
                window.location.href = '/';
            } else {
                showError(data.message || 'Đăng nhập thất bại. Vui lòng thử lại.');
            }
        } catch (error) {
            showError('Có lỗi xảy ra. Vui lòng thử lại sau.');
            console.error('Login error:', error);
        }
    });

    // Xử lý đăng nhập bằng Google
    googleLoginBtn.addEventListener('click', function() {
        // Lấy Google Client ID từ settings
        fetch('/api/settings/google-client-id')
            .then(response => response.json())
            .then(data => {
                const clientId = data.value;
                const redirectUri = window.location.origin + '/google-callback';
                
                // Mở cửa sổ đăng nhập Google
                const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=email profile&access_type=online`;
                window.location.href = googleAuthUrl;
            })
            .catch(error => {
                showError('Không thể kết nối với Google. Vui lòng thử lại sau.');
                console.error('Google login error:', error);
            });
    });

    // Xử lý đăng nhập bằng Facebook
    facebookLoginBtn.addEventListener('click', function() {
        // TODO: Implement Facebook login
        showError('Tính năng đăng nhập bằng Facebook đang được phát triển.');
    });

    // Hiển thị thông báo lỗi
    function showError(message) {
        // Tạo element thông báo lỗi
        const errorDiv = document.createElement('div');
        errorDiv.className = 'alert alert-danger';
        errorDiv.style.cssText = `
            background-color: var(--danger-color);
            color: white;
            padding: 1rem;
            border-radius: 0.5rem;
            margin-bottom: 1rem;
            text-align: center;
        `;
        errorDiv.textContent = message;

        // Thêm vào form
        loginForm.insertBefore(errorDiv, loginForm.firstChild);

        // Tự động ẩn sau 5 giây
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }
}); 