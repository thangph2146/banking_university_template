document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('registerForm');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const passwordStrengthBar = document.querySelector('.password-strength-bar');
    const togglePasswordButtons = document.querySelectorAll('.toggle-password');

    // Kiểm tra độ mạnh của mật khẩu
    passwordInput.addEventListener('input', function() {
        const password = this.value;
        const strength = checkPasswordStrength(password);
        updatePasswordStrengthBar(strength);
    });

    // Handle password visibility toggle
    togglePasswordButtons.forEach(button => {
        button.addEventListener('click', function() {
            const input = this.previousElementSibling;
            const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
            input.setAttribute('type', type);
            
            // Update icon (assuming we'll add these icons later)
            const img = this.querySelector('img');
            img.src = type === 'password' ? '../images/icons/eye.png' : '../images/icons/eye-slash.png';
        });
    });

    // Xử lý đăng ký
    registerForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const lastName = document.getElementById('lastName').value.trim();
        const firstName = document.getElementById('firstName').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const agreeTerms = document.getElementById('agreeTerms').checked;
        
        // Reset previous error states
        clearErrors();
        
        // Validation checks
        let isValid = true;
        
        if (!lastName) {
            showError('lastName', 'Vui lòng nhập họ');
            isValid = false;
        }
        
        if (!firstName) {
            showError('firstName', 'Vui lòng nhập tên');
            isValid = false;
        }
        
        if (!email) {
            showError('email', 'Vui lòng nhập email');
            isValid = false;
        } else if (!isValidEmail(email)) {
            showError('email', 'Email không hợp lệ');
            isValid = false;
        }
        
        if (!phone) {
            showError('phone', 'Vui lòng nhập số điện thoại');
            isValid = false;
        } else if (!isValidPhone(phone)) {
            showError('phone', 'Số điện thoại không hợp lệ');
            isValid = false;
        }
        
        if (!password) {
            showError('password', 'Vui lòng nhập mật khẩu');
            isValid = false;
        } else if (password.length < 6) {
            showError('password', 'Mật khẩu phải có ít nhất 6 ký tự');
            isValid = false;
        }
        
        if (!confirmPassword) {
            showError('confirmPassword', 'Vui lòng xác nhận mật khẩu');
            isValid = false;
        } else if (password !== confirmPassword) {
            showError('confirmPassword', 'Mật khẩu xác nhận không khớp');
            isValid = false;
        }
        
        if (!agreeTerms) {
            showError('agreeTerms', 'Vui lòng đồng ý với điều khoản sử dụng');
            isValid = false;
        }
        
        if (isValid) {
            // Here you would typically send the data to your server
            console.log('Form is valid, submitting...');
            // Simulate API call
            await submitForm({
                lastName,
                firstName,
                email,
                phone,
                password
            });
        }
    });

    // Kiểm tra độ mạnh của mật khẩu
    function checkPasswordStrength(password) {
        let strength = 0;
        
        // Kiểm tra độ dài
        if (password.length >= 8) strength++;
        
        // Kiểm tra có chữ hoa
        if (/[A-Z]/.test(password)) strength++;
        
        // Kiểm tra có chữ thường
        if (/[a-z]/.test(password)) strength++;
        
        // Kiểm tra có số
        if (/[0-9]/.test(password)) strength++;
        
        // Kiểm tra có ký tự đặc biệt
        if (/[^A-Za-z0-9]/.test(password)) strength++;
        
        return strength;
    }

    // Cập nhật thanh độ mạnh mật khẩu
    function updatePasswordStrengthBar(strength) {
        passwordStrengthBar.style.width = '0%';
        passwordStrengthBar.className = 'password-strength-bar';
        
        if (strength <= 2) {
            passwordStrengthBar.classList.add('weak');
            passwordStrengthBar.style.width = '33.33%';
        } else if (strength <= 4) {
            passwordStrengthBar.classList.add('medium');
            passwordStrengthBar.style.width = '66.66%';
        } else {
            passwordStrengthBar.classList.add('strong');
            passwordStrengthBar.style.width = '100%';
        }
    }

    // Helper functions
    function showError(fieldId, message) {
        const field = document.getElementById(fieldId);
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        errorDiv.style.color = '#dc3545';
        errorDiv.style.fontSize = '0.875rem';
        errorDiv.style.marginTop = '0.25rem';
        
        // Insert error message after the field
        field.parentNode.appendChild(errorDiv);
        field.style.borderColor = '#dc3545';
    }
    
    function clearErrors() {
        // Remove all error messages
        const errorMessages = document.querySelectorAll('.error-message');
        errorMessages.forEach(error => error.remove());
        
        // Reset field styles
        const fields = registerForm.querySelectorAll('input');
        fields.forEach(field => field.style.borderColor = '#ddd');
    }
    
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
    
    function isValidPhone(phone) {
        return /^[0-9]{10}$/.test(phone.replace(/\D/g, ''));
    }
    
    async function submitForm(data) {
        try {
            // Show loading state
            const submitButton = registerForm.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            submitButton.disabled = true;
            submitButton.textContent = 'Đang xử lý...';
            
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Show success message
            alert('Đăng ký thành công! Vui lòng kiểm tra email để xác nhận tài khoản.');
            registerForm.reset();
            
            // Reset button
            submitButton.disabled = false;
            submitButton.textContent = originalText;
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('Có lỗi xảy ra. Vui lòng thử lại sau.');
            
            // Reset button
            submitButton.disabled = false;
            submitButton.textContent = originalText;
        }
    }
}); 