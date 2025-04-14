// Khởi tạo AOS
AOS.init();

// Dữ liệu người dùng hiện tại 
const currentUser = {
    AccountId: 'A12345',
    UserName: 'nguyen.van.a',
    LastName: 'Nguyễn',
    MiddleName: 'Văn',
    FirstName: 'A',
    FullName: 'Nguyễn Văn A',
    Email: 'nguyenvana@hub.edu.vn',
    MobilePhone: '0901234567',
    Avatar: 'https://ui-avatars.com/api/?name=Nguyen+Van+A&background=0D8ABC&color=fff',
    AccountType: 'Admin',
    CreatedAt: '2023-01-15',
    LastLogin: '2023-10-25 14:30',
    Department: {
        Id: 1,
        Name: 'Phòng Đào tạo'
    },
    Major: {
        Id: 1,
        Name: 'Công nghệ thông tin'
    },
    EducationLevel: {
        Id: 1,
        Name: 'Đại học'
    },
    TrainingSystem: {
        Id: 1,
        Name: 'Chính quy'
    },
    AcademicYear: {
        Id: 1,
        Name: '2023-2024'
    }
};

// Dữ liệu cho dropdown
const departments = [
    { id: 1, name: 'Phòng Đào tạo' },
    { id: 2, name: 'Khoa Công nghệ thông tin' },
    { id: 3, name: 'Khoa Kinh tế' },
    { id: 4, name: 'Phòng Công tác sinh viên' }
];

const majors = [
    { id: 1, name: 'Công nghệ thông tin' },
    { id: 2, name: 'Quản trị kinh doanh' },
    { id: 3, name: 'Kế toán' },
    { id: 4, name: 'Marketing' }
];

const educationLevels = [
    { id: 1, name: 'Đại học' },
    { id: 2, name: 'Cao đẳng' },
    { id: 3, name: 'Thạc sĩ' },
    { id: 4, name: 'Tiến sĩ' }
];

const trainingSystems = [
    { id: 1, name: 'Chính quy' },
    { id: 2, name: 'Liên thông' },
    { id: 3, name: 'Vừa làm vừa học' }
];

const academicYears = [
    { id: 1, name: '2023-2024' },
    { id: 2, name: '2022-2023' },
    { id: 3, name: '2021-2022' }
];

// Khởi tạo sau khi DOM đã sẵn sàng
document.addEventListener('DOMContentLoaded', () => {
    // Thiết lập sidebar
    setupSidebar();
    
    // Thiết lập menu người dùng
    setupUserMenu();
    
    // Hiển thị thông tin người dùng
    displayUserProfile();
    
    // Thiết lập modal chỉnh sửa thông tin
    setupEditProfileModal();
    
    // Thiết lập modal đổi mật khẩu
    setupChangePasswordModal();
});

// Hàm thiết lập sidebar cho giao diện mobile
const setupSidebar = () => {
    const sidebar = document.getElementById('sidebar');
    const sidebarOpen = document.getElementById('sidebar-open');
    const sidebarClose = document.getElementById('sidebar-close');
    const sidebarBackdrop = document.getElementById('sidebar-backdrop');
    
    // Mở sidebar
    sidebarOpen.addEventListener('click', () => {
        sidebar.classList.remove('-translate-x-full');
        sidebarOpen.classList.add('hidden');
        sidebarClose.classList.remove('hidden');
        sidebarBackdrop.classList.remove('hidden');
        document.body.classList.add('overflow-hidden');
    });
    
    // Đóng sidebar
    const closeSidebar = () => {
        sidebar.classList.add('-translate-x-full');
        sidebarOpen.classList.remove('hidden');
        sidebarClose.classList.add('hidden');
        sidebarBackdrop.classList.add('hidden');
        document.body.classList.remove('overflow-hidden');
    };
    
    sidebarClose.addEventListener('click', closeSidebar);
    sidebarBackdrop.addEventListener('click', closeSidebar);
};

// Hàm thiết lập menu người dùng
const setupUserMenu = () => {
    const userMenuButton = document.getElementById('user-menu-button');
    const userMenu = document.getElementById('user-menu');
    const headerAvatar = document.getElementById('header-avatar');
    const headerFullname = document.getElementById('header-fullname');
    
    // Cập nhật avatar và tên trên header
    if (headerAvatar) {
        headerAvatar.src = currentUser.Avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.FullName || '?')}&background=0D8ABC&color=fff`;
        headerAvatar.alt = currentUser.FullName || 'User Avatar';
    }
    if (headerFullname) {
        headerFullname.textContent = currentUser.FullName || 'User';
    }
    
    // Loại bỏ cập nhật các phần tử không còn tồn tại trong dropdown
    // document.getElementById('user-fullname').textContent = currentUser.FullName;
    // document.getElementById('user-username').textContent = '@' + currentUser.UserName;
    // document.getElementById('user-type').textContent = currentUser.AccountType;
    
    // Xử lý sự kiện đóng/mở menu (Giữ nguyên)
    if (userMenuButton && userMenu) { // Check if elements exist
        userMenuButton.addEventListener('click', (event) => {
            event.stopPropagation(); // Ngăn sự kiện click lan ra document
            userMenu.classList.toggle('opacity-0');
            userMenu.classList.toggle('invisible');
            userMenu.classList.toggle('group-hover:opacity-100');
            userMenu.classList.toggle('group-hover:visible');
        });
    }
    
    // Đóng menu khi click ra ngoài (Giữ nguyên, có điều chỉnh kiểm tra)
    document.addEventListener('click', (e) => {
        if (userMenuButton && userMenu && !userMenu.classList.contains('invisible')) { // Chỉ đóng nếu menu đang mở
            if (!userMenuButton.contains(e.target) && !userMenu.contains(e.target)) {
                userMenu.classList.add('opacity-0', 'invisible');
                userMenu.classList.remove('group-hover:opacity-100', 'group-hover:visible');
            }
        }
    });
};

// Hàm hiển thị thông tin người dùng
const displayUserProfile = () => {
    // Cập nhật thông tin cá nhân
    const profileAvatar = document.getElementById('profile-avatar');
    const profileFullname = document.getElementById('profile-fullname');
    const profileFullnameInfo = document.getElementById('profile-fullname-info');
    const profileUsername = document.getElementById('profile-username');
    const profileEmail = document.getElementById('profile-email');
    const profilePhone = document.getElementById('profile-phone');
    const profileLastLogin = document.getElementById('profile-last-login');

    if (profileAvatar) {
        profileAvatar.src = currentUser.Avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.FullName || '?')}&background=0D8ABC&color=fff`;
        profileAvatar.alt = currentUser.FullName || 'User Avatar';
    }
    if (profileFullname) profileFullname.textContent = currentUser.FullName || 'N/A';
    if (profileFullnameInfo) profileFullnameInfo.textContent = currentUser.FullName || 'N/A'; // Update info section too
    if (profileUsername) profileUsername.textContent = currentUser.UserName || 'N/A';
    if (profileEmail) profileEmail.textContent = currentUser.Email || 'N/A';
    if (profilePhone) profilePhone.textContent = currentUser.MobilePhone || 'N/A';
    if (profileLastLogin) profileLastLogin.textContent = currentUser.LastLogin ? formatDateTime(currentUser.LastLogin) : 'N/A';

    // Cập nhật thông tin tài khoản
    const profileAccountType = document.getElementById('profile-account-type');
    const profileDepartment = document.getElementById('profile-department');
    const profileMajor = document.getElementById('profile-major');
    const profileEducationLevel = document.getElementById('profile-education-level');
    const profileTrainingSystem = document.getElementById('profile-training-system');
    const profileAcademicYear = document.getElementById('profile-academic-year');
    const profileCreatedAt = document.getElementById('profile-created-at');

    if (profileAccountType) profileAccountType.textContent = currentUser.AccountType || 'N/A';
    if (profileDepartment) profileDepartment.textContent = currentUser.Department?.Name || 'N/A'; // Use optional chaining
    if (profileMajor) profileMajor.textContent = currentUser.Major?.Name || 'N/A';
    if (profileEducationLevel) profileEducationLevel.textContent = currentUser.EducationLevel?.Name || 'N/A';
    if (profileTrainingSystem) profileTrainingSystem.textContent = currentUser.TrainingSystem?.Name || 'N/A';
    if (profileAcademicYear) profileAcademicYear.textContent = currentUser.AcademicYear?.Name || 'N/A';
    if (profileCreatedAt) profileCreatedAt.textContent = currentUser.CreatedAt ? formatDate(currentUser.CreatedAt) : 'N/A';
};

// Hàm thiết lập modal chỉnh sửa thông tin
const setupEditProfileModal = () => {
    const editProfileBtn = document.getElementById('edit-profile-btn');
    const editProfileModal = document.getElementById('edit-profile-modal');
    const closeEditProfileModal = document.getElementById('close-edit-profile-modal');
    const cancelEditProfile = document.getElementById('cancel-edit-profile');
    const editProfileForm = document.getElementById('edit-profile-form');
    
    // Điền dữ liệu vào form chỉnh sửa
    const fillEditForm = () => {
        document.getElementById('edit-LastName').value = currentUser.LastName;
        document.getElementById('edit-MiddleName').value = currentUser.MiddleName;
        document.getElementById('edit-FirstName').value = currentUser.FirstName;
        document.getElementById('edit-Email').value = currentUser.Email;
        document.getElementById('edit-MobilePhone').value = currentUser.MobilePhone;
        
        // Thiết lập các dropdown
        document.getElementById('edit-phong_khoa_id').value = currentUser.Department.Id;
        document.getElementById('edit-nganh_id').value = currentUser.Major.Id;
        document.getElementById('edit-bac_hoc_id').value = currentUser.EducationLevel.Id;
        document.getElementById('edit-he_dao_tao_id').value = currentUser.TrainingSystem.Id;
        document.getElementById('edit-nam_hoc_id').value = currentUser.AcademicYear.Id;
    };
    
    // Mở modal
    editProfileBtn.addEventListener('click', () => {
        fillEditForm();
        editProfileModal.classList.remove('hidden');
        document.body.classList.add('overflow-hidden');
    });
    
    // Đóng modal
    const closeModal = () => {
        editProfileModal.classList.add('hidden');
        document.body.classList.remove('overflow-hidden');
    };
    
    closeEditProfileModal.addEventListener('click', closeModal);
    cancelEditProfile.addEventListener('click', closeModal);
    
    // Xử lý sự kiện submit form
    editProfileForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Cập nhật dữ liệu người dùng từ form
        currentUser.LastName = document.getElementById('edit-LastName').value;
        currentUser.MiddleName = document.getElementById('edit-MiddleName').value;
        currentUser.FirstName = document.getElementById('edit-FirstName').value;
        currentUser.FullName = `${currentUser.LastName} ${currentUser.MiddleName} ${currentUser.FirstName}`;
        currentUser.Email = document.getElementById('edit-Email').value;
        currentUser.MobilePhone = document.getElementById('edit-MobilePhone').value;
        
        // Cập nhật dữ liệu từ dropdown
        const departmentId = parseInt(document.getElementById('edit-phong_khoa_id').value);
        const majorId = parseInt(document.getElementById('edit-nganh_id').value);
        const educationLevelId = parseInt(document.getElementById('edit-bac_hoc_id').value);
        const trainingSystemId = parseInt(document.getElementById('edit-he_dao_tao_id').value);
        const academicYearId = parseInt(document.getElementById('edit-nam_hoc_id').value);
        
        // Cập nhật dữ liệu object
        currentUser.Department = departments.find(d => d.id === departmentId) || currentUser.Department;
        currentUser.Major = majors.find(m => m.id === majorId) || currentUser.Major;
        currentUser.EducationLevel = educationLevels.find(e => e.id === educationLevelId) || currentUser.EducationLevel;
        currentUser.TrainingSystem = trainingSystems.find(t => t.id === trainingSystemId) || currentUser.TrainingSystem;
        currentUser.AcademicYear = academicYears.find(a => a.id === academicYearId) || currentUser.AcademicYear;
        
        // Cập nhật lại avatar
        currentUser.Avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.FullName)}&background=0D8ABC&color=fff`;
        
        // Cập nhật giao diện
        displayUserProfile();
        setupUserMenu();
        
        // Hiển thị thông báo thành công
        alert('Cập nhật thông tin thành công!');
        
        // Đóng modal
        closeModal();
    });
};

// Hàm thiết lập modal đổi mật khẩu
const setupChangePasswordModal = () => {
    const changePasswordBtn = document.getElementById('change-password-btn');
    const changePasswordModal = document.getElementById('change-password-modal');
    const closeChangePasswordModal = document.getElementById('close-change-password-modal');
    const cancelChangePassword = document.getElementById('cancel-change-password');
    const changePasswordForm = document.getElementById('change-password-form');
    
    // Mở modal
    changePasswordBtn.addEventListener('click', () => {
        // Reset form
        changePasswordForm.reset();
        
        // Hiển thị modal
        changePasswordModal.classList.remove('hidden');
        document.body.classList.add('overflow-hidden');
    });
    
    // Đóng modal
    const closeModal = () => {
        changePasswordModal.classList.add('hidden');
        document.body.classList.remove('overflow-hidden');
    };
    
    closeChangePasswordModal.addEventListener('click', closeModal);
    cancelChangePassword.addEventListener('click', closeModal);
    
    // Xử lý sự kiện submit form
    changePasswordForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const currentPassword = document.getElementById('current-password').value;
        const newPassword = document.getElementById('new-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        
        // Kiểm tra mật khẩu hiện tại (mô phỏng)
        if (currentPassword !== 'password') {
            alert('Mật khẩu hiện tại không đúng!');
            return;
        }
        
        // Kiểm tra mật khẩu mới khớp với xác nhận
        if (newPassword !== confirmPassword) {
            alert('Mật khẩu mới và xác nhận mật khẩu không khớp!');
            return;
        }
        
        // Kiểm tra mật khẩu mới đủ mạnh
        if (newPassword.length < 6) {
            alert('Mật khẩu mới phải có ít nhất 6 ký tự!');
            return;
        }
        
        // Hiển thị thông báo thành công
        alert('Đổi mật khẩu thành công!');
        
        // Đóng modal
        closeModal();
    });
};

// Hàm định dạng ngày tháng
const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    } catch (error) {
        console.error('Error formatting date:', error);
        return dateString; // Trả về chuỗi gốc nếu lỗi
    }
};

// Hàm định dạng ngày giờ
const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return 'N/A';
    try {
        const date = new Date(dateTimeString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${day}/${month}/${year} ${hours}:${minutes}`;
    } catch (error) {
        console.error('Error formatting date time:', error);
        return dateTimeString; // Trả về chuỗi gốc nếu lỗi
    }
}; 