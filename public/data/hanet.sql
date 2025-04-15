CREATE TABLE `users` (
  `u_id` int(11) UNSIGNED NOT NULL,
  `u_LastName` varchar(50) DEFAULT NULL,
  `u_MiddleName` varchar(50) DEFAULT NULL,
  `u_FirstName` varchar(50) DEFAULT NULL,
  `u_type` varchar(50) DEFAULT NULL,
  `u_username` varchar(50) NOT NULL,
  `u_email` varchar(255) NOT NULL,
  `u_password_hash` varchar(255) DEFAULT NULL,
  `u_status` tinyint(1) DEFAULT 1,
  `u_created_at` datetime DEFAULT NULL,
  `u_updated_at` datetime DEFAULT NULL,
  `u_deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


CREATE TABLE `roles` (
  `r_id` int(11) UNSIGNED NOT NULL,
  `r_name` varchar(128) DEFAULT NULL,
  `r_description` tinytext DEFAULT NULL,
  `r_status` tinyint(1) UNSIGNED NOT NULL DEFAULT 1,
  `r_created_at` datetime DEFAULT NULL,
  `r_updated_at` datetime DEFAULT NULL,
  `r_deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Table structure for table `roles_users`
--
CREATE TABLE `roles_users` (
  `ru_id` int(11) UNSIGNED NOT NULL,
  `user_id` int(11) UNSIGNED DEFAULT NULL,
  `role_id` int(11) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;



CREATE TABLE `permissions` (
  `p_id` int(11) UNSIGNED NOT NULL,
  `p_name` varchar(128) DEFAULT NULL,
  `p_display_name` varchar(128) DEFAULT NULL,
  `p_description` tinytext DEFAULT NULL,
  `p_status` tinyint(1) NOT NULL DEFAULT 1,
  `p_created_at` datetime DEFAULT NULL,
  `p_updated_at` datetime DEFAULT NULL,
  `p_deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Table structure for table `permission_roles`
--

CREATE TABLE `permission_roles` (
  `pr_id` int(11) UNSIGNED NOT NULL,
  `role_id` int(11) UNSIGNED NOT NULL,
  `permission_id` int(11) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table structure for table `settings`
--
CREATE TABLE `settings` (
  `id` int(9) NOT NULL,
  `class` varchar(255) NOT NULL,
  `key` varchar(255) NOT NULL,
  `value` text DEFAULT NULL,
  `type` varchar(31) NOT NULL DEFAULT 'string',
  `context` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- Bảng loại người dùng
CREATE TABLE loai_nguoi_dung (
    loai_nguoi_dung_id INT AUTO_INCREMENT PRIMARY KEY, 
    ten_loai VARCHAR(50) NOT NULL, 
    mo_ta TEXT NULL, 
    status TINYINT(1) DEFAULT 1, 
    created_at DATETIME NULL DEFAULT CURRENT_TIMESTAMP, 
    updated_at DATETIME NULL, 
    deleted_at DATETIME NULL, 
    INDEX idx_ten_loai (ten_loai) 
) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci 
  COMMENT='Bảng lưu trữ thông tin loại người dùng trong hệ thống';

-- Bảng phòng khoa
CREATE TABLE phong_khoa (
    phong_khoa_id INT AUTO_INCREMENT PRIMARY KEY, 
    ma_phong_khoa VARCHAR(20) NOT NULL, 
    ten_phong_khoa VARCHAR(100) NOT NULL, 
    ghi_chu TEXT NULL, 
    status TINYINT(1) DEFAULT 1, 
    created_at DATETIME NULL DEFAULT CURRENT_TIMESTAMP, 
    updated_at DATETIME NULL, 
    deleted_at DATETIME NULL, 
    INDEX idx_ma_phong_khoa (ma_phong_khoa), 
    INDEX idx_ten_phong_khoa (ten_phong_khoa), 
    UNIQUE KEY uk_ma_phong_khoa (ma_phong_khoa) 
) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci 
  COMMENT='Bảng lưu trữ thông tin phòng khoa trong trường';

-- Bảng năm học
CREATE TABLE nam_hoc (
    nam_hoc_id INT AUTO_INCREMENT PRIMARY KEY, 
    ten_nam_hoc VARCHAR(50) NOT NULL, 
    ngay_bat_dau DATE NULL, 
    ngay_ket_thuc DATE NULL, 
    status TINYINT(1) DEFAULT 1, 
    created_at DATETIME NULL DEFAULT CURRENT_TIMESTAMP, 
    updated_at DATETIME NULL, 
    deleted_at DATETIME NULL, 
    INDEX idx_ten_nam_hoc (ten_nam_hoc), 
    UNIQUE KEY uk_ten_nam_hoc (ten_nam_hoc) 
) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci 
  COMMENT='Bảng lưu trữ thông tin năm học';

-- Bảng bậc học
CREATE TABLE bac_hoc (
    bac_hoc_id INT AUTO_INCREMENT PRIMARY KEY, 
    ten_bac_hoc VARCHAR(100) NOT NULL, 
    ma_bac_hoc VARCHAR(20) NULL, 
    status TINYINT(1) DEFAULT 1, 
    created_at DATETIME NULL DEFAULT CURRENT_TIMESTAMP, 
    updated_at DATETIME NULL, 
    deleted_at DATETIME NULL, 
    INDEX idx_ten_bac_hoc (ten_bac_hoc), 
    UNIQUE KEY uk_ten_bac_hoc (ten_bac_hoc) 
) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci 
  COMMENT='Bảng lưu trữ thông tin bậc học (đại học, cao đẳng, trung cấp...)';

-- Bảng hệ đào tạo
CREATE TABLE he_dao_tao (
    he_dao_tao_id INT AUTO_INCREMENT PRIMARY KEY, 
    ten_he_dao_tao VARCHAR(100) NOT NULL, 
    ma_he_dao_tao VARCHAR(20) NULL, 
    status TINYINT(1) DEFAULT 1, 
    created_at DATETIME NULL DEFAULT CURRENT_TIMESTAMP, 
    updated_at DATETIME NULL, 
    deleted_at DATETIME NULL, 
    INDEX idx_ten_he_dao_tao (ten_he_dao_tao), 
    UNIQUE KEY uk_ten_he_dao_tao (ten_he_dao_tao) 
) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci 
  COMMENT='Bảng lưu trữ thông tin hệ đào tạo (chính quy, liên thông...)';

-- Bảng khóa học
CREATE TABLE khoa_hoc (
    khoa_hoc_id INT AUTO_INCREMENT PRIMARY KEY, 
    ten_khoa_hoc VARCHAR(100) NOT NULL, 
    nam_bat_dau INT NULL, 
    nam_ket_thuc INT NULL, 
    phong_khoa_id INT NULL, 
    status TINYINT(1) DEFAULT 1, 
    created_at DATETIME NULL DEFAULT CURRENT_TIMESTAMP, 
    updated_at DATETIME NULL, 
    deleted_at DATETIME NULL, 
    INDEX idx_ten_khoa_hoc (ten_khoa_hoc), 
    INDEX idx_phong_khoa_id (phong_khoa_id), 
    FOREIGN KEY (phong_khoa_id) REFERENCES phong_khoa(phong_khoa_id) ON DELETE SET NULL ON UPDATE CASCADE 
) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci 
  COMMENT='Bảng lưu trữ thông tin khóa học';

-- Bảng ngành đào tạo
CREATE TABLE nganh (
    nganh_id INT AUTO_INCREMENT PRIMARY KEY, 
    ten_nganh VARCHAR(200) NOT NULL, 
    ma_nganh VARCHAR(20) NOT NULL, 
    phong_khoa_id INT NULL, 
    status TINYINT(1) DEFAULT 1, 
    created_at DATETIME NULL DEFAULT CURRENT_TIMESTAMP, 
    updated_at DATETIME NULL, 
    deleted_at DATETIME NULL, 
    INDEX idx_ma_nganh (ma_nganh), 
    INDEX idx_ten_nganh (ten_nganh), 
    INDEX idx_phong_khoa_id (phong_khoa_id), 
    UNIQUE KEY uk_ma_nganh (ma_nganh), 
    FOREIGN KEY (phong_khoa_id) REFERENCES phong_khoa(phong_khoa_id) ON DELETE SET NULL ON UPDATE CASCADE 
) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci 
  COMMENT='Bảng lưu trữ thông tin ngành đào tạo';

-- Bảng camera
CREATE TABLE camera (
    camera_id INT AUTO_INCREMENT PRIMARY KEY, 
    ten_camera VARCHAR(255) NOT NULL, 
    ma_camera VARCHAR(20) NULL, 
    ip_camera VARCHAR(100) NULL, 
    port INT NULL, 
    username VARCHAR(50) NULL, 
    password VARCHAR(50) NULL, 
    status TINYINT(1) DEFAULT 1, 
    created_at DATETIME NULL DEFAULT CURRENT_TIMESTAMP, 
    updated_at DATETIME NULL, 
    deleted_at DATETIME NULL, 
    INDEX idx_ten_camera (ten_camera), 
    UNIQUE KEY uk_ten_camera (ten_camera) 
) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci 
  COMMENT='Bảng lưu trữ thông tin camera';

-- Bảng template
CREATE TABLE template (
    template_id INT AUTO_INCREMENT PRIMARY KEY, 
    ten_template VARCHAR(255) NOT NULL, 
    ma_template VARCHAR(20) NULL, 
    status TINYINT(1) DEFAULT 1, 
    created_at DATETIME NULL DEFAULT CURRENT_TIMESTAMP, 
    updated_at DATETIME NULL, 
    deleted_at DATETIME NULL, 
    INDEX idx_ten_template (ten_template), 
    UNIQUE KEY uk_ten_template (ten_template) 
) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci 
  COMMENT='Bảng lưu trữ thông tin template';

-- Bảng người dùng
CREATE TABLE nguoi_dung (
    nguoi_dung_id INT(8) UNSIGNED AUTO_INCREMENT PRIMARY KEY, 
    AccountId VARCHAR(50) NULL, 
    u_id INT(11) NULL, 
    LastName VARCHAR(100) NULL, 
    MiddleName VARCHAR(100) NULL, 
    FirstName VARCHAR(100) NULL, 
    AccountType VARCHAR(20) NULL, 
    FullName VARCHAR(100) NULL, 
    MobilePhone VARCHAR(20) NULL, 
    Email VARCHAR(100) NULL, 
    HomePhone1 VARCHAR(20) NULL, 
    PW VARCHAR(255) NULL, 
    HomePhone VARCHAR(20) NULL, 
    loai_nguoi_dung_id INT(11) NULL, 
    mat_khau_local VARCHAR(255) NULL, 
    nam_hoc_id INT(11) NULL, 
    bac_hoc_id INT(11) NULL, 
    he_dao_tao_id INT(11) NULL, 
    nganh_id INT(11) NULL, 
    phong_khoa_id INT(11) NULL, 
    status TINYINT(1) DEFAULT 1, 
    last_login DATETIME NULL, 
    created_at DATETIME NULL DEFAULT CURRENT_TIMESTAMP, 
    updated_at DATETIME NULL, 
    deleted_at DATETIME NULL, 
    INDEX idx_AccountId (AccountId), 
    INDEX idx_FullName (FullName), 
    INDEX idx_Email (Email), 
    INDEX idx_phong_khoa_id (phong_khoa_id), 
    INDEX idx_nganh_id (nganh_id), 
    INDEX idx_loai_nguoi_dung_id (loai_nguoi_dung_id), 
    INDEX idx_bac_hoc_id (bac_hoc_id), 
    INDEX idx_he_dao_tao_id (he_dao_tao_id), 
    INDEX idx_nam_hoc_id (nam_hoc_id), 
    UNIQUE KEY uk_AccountId (AccountId), 
    UNIQUE KEY uk_Email (Email), 
    FOREIGN KEY (loai_nguoi_dung_id) REFERENCES loai_nguoi_dung(loai_nguoi_dung_id) ON DELETE SET NULL ON UPDATE CASCADE, 
    FOREIGN KEY (nam_hoc_id) REFERENCES nam_hoc(nam_hoc_id) ON DELETE SET NULL ON UPDATE CASCADE, 
    FOREIGN KEY (bac_hoc_id) REFERENCES bac_hoc(bac_hoc_id) ON DELETE SET NULL ON UPDATE CASCADE, 
    FOREIGN KEY (he_dao_tao_id) REFERENCES he_dao_tao(he_dao_tao_id) ON DELETE SET NULL ON UPDATE CASCADE, 
    FOREIGN KEY (nganh_id) REFERENCES nganh(nganh_id) ON DELETE SET NULL ON UPDATE CASCADE, 
    FOREIGN KEY (phong_khoa_id) REFERENCES phong_khoa(phong_khoa_id) ON DELETE SET NULL ON UPDATE CASCADE 
) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci 
  COMMENT='Bảng lưu trữ thông tin người dùng trong hệ thống';

-- Bảng màn hình
CREATE TABLE man_hinh (
    man_hinh_id INT AUTO_INCREMENT PRIMARY KEY, 
    ten_man_hinh VARCHAR(255) NOT NULL, 
    ma_man_hinh VARCHAR(20) NULL, 
    camera_id INT NULL, 
    template_id INT NULL, 
    status TINYINT(1) DEFAULT 1, 
    created_at DATETIME NULL DEFAULT CURRENT_TIMESTAMP, 
    updated_at DATETIME NULL, 
    deleted_at DATETIME NULL, 
    INDEX idx_ten_man_hinh (ten_man_hinh), 
    INDEX idx_camera_id (camera_id), 
    INDEX idx_template_id (template_id), 
    UNIQUE KEY uk_ten_man_hinh (ten_man_hinh), 
    FOREIGN KEY (camera_id) REFERENCES camera(camera_id) ON DELETE SET NULL ON UPDATE CASCADE, 
    FOREIGN KEY (template_id) REFERENCES template(template_id) ON DELETE SET NULL ON UPDATE CASCADE 
) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci 
  COMMENT='Bảng lưu trữ thông tin màn hình';

-- Bảng loại sự kiện
CREATE TABLE loai_su_kien (
    loai_su_kien_id INT AUTO_INCREMENT PRIMARY KEY, 
    ten_loai_su_kien VARCHAR(100) NOT NULL, 
    ma_loai_su_kien VARCHAR(20) NULL, 
    status TINYINT(1) DEFAULT 1, 
    created_at DATETIME NULL DEFAULT CURRENT_TIMESTAMP, 
    updated_at DATETIME NULL, 
    deleted_at DATETIME NULL, 
    INDEX idx_ten_loai_su_kien (ten_loai_su_kien), 
    UNIQUE KEY uk_ten_loai_su_kien (ten_loai_su_kien) 
) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci 
  COMMENT='Bảng lưu trữ thông tin loại sự kiện';

-- Bảng sự kiện
CREATE TABLE su_kien (
    su_kien_id INT AUTO_INCREMENT PRIMARY KEY,
    ten_su_kien VARCHAR(255) NOT NULL,
    su_kien_poster JSON NULL COMMENT 'Lưu trữ thông tin về poster/hình ảnh sự kiện',
    mo_ta TEXT NULL COMMENT 'Mô tả ngắn gọn về sự kiện',
    mo_ta_su_kien TEXT NULL COMMENT 'Mô tả chi tiết về sự kiện',
    chi_tiet_su_kien TEXT NULL COMMENT 'Thông tin chi tiết của sự kiện',
    thoi_gian_bat_dau_su_kien DATETIME NULL COMMENT 'Giờ bắt đầu chính xác của sự kiện',
    thoi_gian_ket_thuc_su_kien DATETIME NULL COMMENT 'Giờ kết thúc chính xác của sự kiện',
    thoi_gian_bat_dau_dang_ky DATETIME  NULL COMMENT 'Giờ bắt đầu đăng ký của sự kiện',
    thoi_gian_ket_thuc_dang_ky DATETIME  NULL COMMENT 'Giờ bắt kết thúc đăng ký của sự kiện',
    thoi_gian_checkin_bat_dau DATETIME NULL COMMENT 'Thời gian bắt đầu cho phép check-in',
    thoi_gian_checkin_ket_thuc DATETIME NULL COMMENT 'Thời gian kết thúc cho phép check-in',
    thoi_gian_checkout_bat_dau DATETIME NULL COMMENT 'Thời gian bắt đầu cho phép check-out',
    thoi_gian_checkout_ket_thuc DATETIME NULL COMMENT 'Thời gian kết thúc cho phép check-out',
    don_vi_to_chuc VARCHAR(255) NULL COMMENT 'Đơn vị tổ chức sự kiện',
    don_vi_phoi_hop TEXT NULL COMMENT 'Các đơn vị phối hợp tổ chức',
    doi_tuong_tham_gia TEXT NULL COMMENT 'Đối tượng được phép tham gia sự kiện',
    dia_diem VARCHAR(255) NULL,
    dia_chi_cu_the VARCHAR(255) NULL,
    toa_do_gps VARCHAR(100) NULL COMMENT 'Tọa độ GPS để định vị địa điểm',
    loai_su_kien_id INT NULL,
    ma_qr_code VARCHAR(100) NULL COMMENT 'Mã QR dùng để điểm danh', 
    status TINYINT(1) DEFAULT 1 COMMENT '1: Hoạt động, 0: Không hoạt động',
    tong_dang_ky INT DEFAULT 0 COMMENT 'Tổng số người đăng ký tham gia',
    tong_check_in INT DEFAULT 0 COMMENT 'Tổng số người đã check-in',
    tong_check_out INT DEFAULT 0 COMMENT 'Tổng số người đã check-out',
    cho_phep_check_in BOOLEAN DEFAULT TRUE,
    cho_phep_check_out BOOLEAN DEFAULT TRUE,
    yeu_cau_face_id BOOLEAN DEFAULT FALSE COMMENT 'Yêu cầu xác thực khuôn mặt khi check-in/out',
    cho_phep_checkin_thu_cong BOOLEAN DEFAULT TRUE COMMENT 'Cho phép admin check-in thủ công',
    han_huy_dang_ky DATETIME NULL COMMENT 'Hạn chót hủy đăng ký',
    so_luong_tham_gia INT DEFAULT 0 COMMENT 'Giới hạn số người tham gia',
    so_luong_dien_gia INT DEFAULT 0 COMMENT 'Số lượng diễn giả',
    gioi_han_loai_nguoi_dung VARCHAR(255) NULL COMMENT 'Giới hạn loại người dùng được tham gia',
    tu_khoa_su_kien VARCHAR(255) NULL COMMENT 'Từ khóa tìm kiếm sự kiện',
    hashtag VARCHAR(255) NULL,
    slug VARCHAR(255) NULL COMMENT 'Đường dẫn thân thiện cho sự kiện',
    so_luot_xem INT DEFAULT 0,
    lich_trinh JSON NULL COMMENT 'Lịch trình chi tiết của sự kiện',
    hinh_thuc ENUM('offline', 'online', 'hybrid') DEFAULT 'offline' COMMENT 'Hình thức tổ chức sự kiện',
    link_online VARCHAR(255) NULL COMMENT 'Link tham gia nếu là sự kiện online',
    mat_khau_online VARCHAR(100) NULL COMMENT 'Mật khẩu tham gia online nếu có',
    version INT DEFAULT 1,
    created_at DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NULL,
    deleted_at DATETIME NULL,
    INDEX idx_ten_su_kien (ten_su_kien),
    INDEX idx_thoi_gian_bat_dau (thoi_gian_bat_dau),
    INDEX idx_thoi_gian_ket_thuc (thoi_gian_ket_thuc),
    INDEX idx_loai_su_kien_id (loai_su_kien_id),
    INDEX idx_sukien_slug (slug),
    INDEX idx_sukien_bat_dau (gio_bat_dau),
    INDEX idx_hinh_thuc (hinh_thuc),
    INDEX idx_don_vi_to_chuc (don_vi_to_chuc),
    INDEX idx_thoi_gian_checkin (thoi_gian_checkin_bat_dau, thoi_gian_checkin_ket_thuc),
    FOREIGN KEY (loai_su_kien_id) REFERENCES loai_su_kien(loai_su_kien_id) ON DELETE RESTRICT ON UPDATE CASCADE
) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci 
  COMMENT='Bảng lưu trữ thông tin sự kiện';

-- Bảng diễn giả
CREATE TABLE dien_gia (
    dien_gia_id INT PRIMARY KEY AUTO_INCREMENT,
    ten_dien_gia VARCHAR(255) NOT NULL,
    chuc_danh VARCHAR(255) NULL COMMENT 'Chức danh của diễn giả (Tiến sĩ, Giáo sư...)',
    to_chuc VARCHAR(255) NULL COMMENT 'Tổ chức/công ty của diễn giả',
    gioi_thieu TEXT NULL COMMENT 'Giới thiệu chi tiết về diễn giả',
    avatar VARCHAR(255) NULL COMMENT 'Đường dẫn đến ảnh đại diện',
    email VARCHAR(100) NULL COMMENT 'Email liên hệ',
    dien_thoai VARCHAR(20) NULL COMMENT 'Số điện thoại liên hệ',
    website VARCHAR(255) NULL COMMENT 'Website cá nhân nếu có',
    chuyen_mon TEXT NULL COMMENT 'Lĩnh vực chuyên môn',
    thanh_tuu TEXT NULL COMMENT 'Các thành tựu nổi bật',
    mang_xa_hoi JSON NULL COMMENT 'Thông tin mạng xã hội (JSON)',
    status TINYINT(1) DEFAULT 1 COMMENT '1: Hoạt động, 0: Không hoạt động',
    so_su_kien_tham_gia INT DEFAULT 0 COMMENT 'Số sự kiện đã tham gia',
    created_at DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NULL,
    deleted_at DATETIME NULL,
    INDEX idx_ten_dien_gia (ten_dien_gia),
    INDEX idx_to_chuc (to_chuc),    
    INDEX idx_email (email)
) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Bảng lưu trữ thông tin diễn giả';

-- Bảng check-in sự kiện (tạo trước để giải quyết tham chiếu vòng)
CREATE TABLE checkin_sukien (
    checkin_sukien_id INT PRIMARY KEY AUTO_INCREMENT,
    su_kien_id INT NOT NULL,
    email VARCHAR(100) NOT NULL COMMENT 'Email người check-in',
    ho_ten VARCHAR(255) NOT NULL COMMENT 'Họ tên người check-in',
    dangky_sukien_id INT NULL,
    thoi_gian_check_in DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    checkin_type ENUM('face_id', 'manual', 'qr_code', 'online') NOT NULL,
    face_image_path VARCHAR(255) NULL,
    face_match_score FLOAT NULL COMMENT 'Điểm số khớp khuôn mặt 0-1',
    face_verified BOOLEAN DEFAULT FALSE,
    ma_xac_nhan VARCHAR(20) NULL,
    status TINYINT DEFAULT 1,
    location_data VARCHAR(255) NULL COMMENT 'Dữ liệu vị trí khi check-in',
    device_info VARCHAR(255) NULL COMMENT 'Thiết bị dùng để check-in',
    hinh_thuc_tham_gia ENUM('offline', 'online') DEFAULT 'offline' COMMENT 'Hình thức tham gia',
    ip_address VARCHAR(45) NULL COMMENT 'Địa chỉ IP khi check-in',
    thong_tin_bo_sung JSON NULL,
    ghi_chu TEXT NULL,
    created_at DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NULL,
    deleted_at DATETIME NULL,
    INDEX idx_su_kien_id (su_kien_id),
    INDEX idx_email (email),
    INDEX idx_thoi_gian_check_in (thoi_gian_check_in),
    INDEX idx_checkin_type (checkin_type),
    INDEX idx_hinh_thuc_tham_gia (hinh_thuc_tham_gia),
    FOREIGN KEY (su_kien_id) REFERENCES su_kien(su_kien_id) ON DELETE CASCADE ON UPDATE CASCADE
) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Bảng lưu trữ thông tin check-in sự kiện';

-- Bảng checkout sự kiện (tạo trước để giải quyết tham chiếu vòng)
CREATE TABLE checkout_sukien (
    checkout_sukien_id INT PRIMARY KEY AUTO_INCREMENT,
    su_kien_id INT NOT NULL,
    email VARCHAR(100) NOT NULL COMMENT 'Email người check-out',
    ho_ten VARCHAR(255) NOT NULL COMMENT 'Họ tên người check-out',
    dangky_sukien_id INT NULL,
    checkin_sukien_id INT NULL,
    thoi_gian_check_out DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    checkout_type ENUM('face_id', 'manual', 'qr_code', 'auto', 'online') NOT NULL,
    face_image_path VARCHAR(255) NULL,
    face_match_score FLOAT NULL,
    face_verified BOOLEAN DEFAULT FALSE,
    ma_xac_nhan VARCHAR(20) NULL,
    status TINYINT DEFAULT 1,
    location_data VARCHAR(255) NULL,
    device_info VARCHAR(255) NULL,
    attendance_duration_minutes INT NULL COMMENT 'Thời gian tham dự tính bằng phút',
    hinh_thuc_tham_gia ENUM('offline', 'online') DEFAULT 'offline',
    ip_address VARCHAR(45) NULL COMMENT 'Địa chỉ IP khi check-out',
    thong_tin_bo_sung JSON NULL,
    ghi_chu TEXT NULL,
    feedback TEXT NULL COMMENT 'Phản hồi của người tham gia',
    danh_gia INT NULL COMMENT 'Điểm đánh giá 1-5 sao',
    noi_dung_danh_gia TEXT NULL COMMENT 'Nội dung đánh giá chi tiết',
    created_at DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NULL,
    deleted_at DATETIME NULL,
    INDEX idx_su_kien_id (su_kien_id),
    INDEX idx_email (email),
    INDEX idx_checkin_sukien_id (checkin_sukien_id),
    INDEX idx_thoi_gian_check_out (thoi_gian_check_out),
    INDEX idx_checkout_type (checkout_type),
    INDEX idx_hinh_thuc_tham_gia (hinh_thuc_tham_gia),
    FOREIGN KEY (su_kien_id) REFERENCES su_kien(su_kien_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (checkin_sukien_id) REFERENCES checkin_sukien(checkin_sukien_id) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT check_danh_gia CHECK (danh_gia BETWEEN 1 AND 5)
) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Bảng lưu trữ thông tin check-out sự kiện';

-- Bảng đăng ký sự kiện
CREATE TABLE dangky_sukien (
    dangky_sukien_id INT PRIMARY KEY AUTO_INCREMENT,
    su_kien_id INT NOT NULL,
    email VARCHAR(100) NOT NULL COMMENT 'Email người đăng ký',
    ho_ten VARCHAR(255) NOT NULL COMMENT 'Họ tên người đăng ký',
    dien_thoai VARCHAR(20) NULL COMMENT 'Số điện thoại liên hệ',
    loai_nguoi_dang_ky ENUM('khach', 'sinh_vien', 'giang_vien') DEFAULT 'khach',
    ngay_dang_ky DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
    ma_xac_nhan VARCHAR(20) NULL COMMENT 'Mã xác nhận đăng ký',
    status TINYINT DEFAULT 0 COMMENT '0: chờ xác nhận, 1: đã xác nhận, -1: đã hủy',
    noi_dung_gop_y TEXT NULL,
    nguon_gioi_thieu VARCHAR(255) NULL COMMENT 'Nguồn biết đến sự kiện',
    don_vi_to_chuc VARCHAR(255) NULL COMMENT 'Đơn vị/tổ chức của người đăng ký',
    face_image_path VARCHAR(255) NULL,
    face_verified BOOLEAN DEFAULT FALSE,
    da_check_in BOOLEAN DEFAULT FALSE,
    da_check_out BOOLEAN DEFAULT FALSE,
    checkin_sukien_id INT NULL,
    checkout_sukien_id INT NULL,
    thoi_gian_duyet DATETIME NULL,
    thoi_gian_huy DATETIME NULL,
    ly_do_huy TEXT NULL,
    hinh_thuc_tham_gia ENUM('offline', 'online', 'hybrid') DEFAULT 'offline' COMMENT 'Hình thức tham gia đăng ký',
    attendance_status ENUM('not_attended', 'partial', 'full') DEFAULT 'not_attended',
    attendance_minutes INT DEFAULT 0,
    diem_danh_bang ENUM('qr_code', 'face_id', 'manual', 'none') DEFAULT 'none',
    thong_tin_dang_ky JSON NULL COMMENT 'Thông tin bổ sung khi đăng ký',
    ly_do_tham_du TEXT NULL COMMENT 'Lý do muốn tham dự sự kiện',
    created_at DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NULL,
    deleted_at DATETIME NULL,
    INDEX idx_sukien_id (su_kien_id),
    INDEX idx_email (email),
    INDEX idx_ho_ten (ho_ten),
    INDEX idx_status (status),
    INDEX idx_da_check_in (da_check_in),
    INDEX idx_da_check_out (da_check_out),
    INDEX idx_hinh_thuc_tham_gia (hinh_thuc_tham_gia),
    INDEX idx_checkin_sukien_id (checkin_sukien_id),
    INDEX idx_checkout_sukien_id (checkout_sukien_id),
    UNIQUE INDEX idx_sukien_email (su_kien_id, email),
    FOREIGN KEY (su_kien_id) REFERENCES su_kien(su_kien_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (checkin_sukien_id) REFERENCES checkin_sukien(checkin_sukien_id) ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (checkout_sukien_id) REFERENCES checkout_sukien(checkout_sukien_id) ON DELETE SET NULL ON UPDATE CASCADE
) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Bảng lưu trữ thông tin đăng ký sự kiện';
