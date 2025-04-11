# Hướng dẫn sử dụng hệ thống quản lý sự kiện cho sinh viên Đại học Ngân hàng TP.HCM

## Giới thiệu

Hệ thống quản lý sự kiện cho sinh viên Đại học Ngân hàng TP.HCM là một nền tảng web giúp sinh viên dễ dàng tìm kiếm, đăng ký và quản lý các sự kiện của trường. Hệ thống cung cấp giao diện thân thiện với người dùng, tương thích với nhiều thiết bị và đầy đủ các chức năng cần thiết.

## Cài đặt và triển khai

### Yêu cầu hệ thống
- Máy chủ web (Apache, Nginx, etc.)
- PHP 7.4 trở lên (cho phần backend API)
- MySQL 5.7 trở lên (cho cơ sở dữ liệu)
- Trình duyệt web hiện đại (Chrome, Firefox, Safari, Edge)

### Các bước cài đặt
1. Giải nén tệp tin `banking_university_template.zip` vào thư mục gốc của máy chủ web
2. Nhập cơ sở dữ liệu từ tệp `hanet.sql` vào MySQL
3. Cấu hình kết nối cơ sở dữ liệu trong tệp `config.php` (nếu cần)
4. Truy cập trang web qua trình duyệt để bắt đầu sử dụng

## Cấu trúc thư mục

```
banking_university_template/
├── css/                  # Các tệp CSS
│   ├── styles.css        # Styles chính
│   └── vảiables.css          # Biến CSS và reset
├── js/                   # Các tệp JavaScript
│   ├── script.js         # Script chính
│   └── integration.js    # Script tích hợp các thành phần
├── images/               # Thư mục chứa hình ảnh
│   └── logo/             # Logo trường
├── pages/                # Các trang HTML
│   ├── login.html        # Trang đăng nhập
│   ├── register.html     # Trang đăng ký
│   ├── events.html       # Trang danh sách sự kiện
│   ├── event-detail.html # Trang chi tiết sự kiện
│   ├── student-dashboard.html # Trang quản lý sự kiện của sinh viên
│   └── profile.html      # Trang quản lý thông tin cá nhân
├── favicon.svg           # Favicon
└── index.html            # Trang chủ
```

## Hướng dẫn sử dụng

### 1. Đăng ký tài khoản
1. Truy cập trang chủ và nhấp vào nút "Đăng ký"
2. Điền đầy đủ thông tin vào form đăng ký
3. Nhấp vào nút "Đăng ký" để hoàn tất

### 2. Đăng nhập
1. Truy cập trang chủ và nhấp vào nút "Đăng nhập"
2. Nhập email và mật khẩu
3. Nhấp vào nút "Đăng nhập" để truy cập hệ thống

### 3. Tìm kiếm và lọc sự kiện
1. Truy cập trang "Sự kiện" từ menu chính
2. Sử dụng thanh tìm kiếm để tìm sự kiện theo tên
3. Sử dụng bộ lọc để lọc sự kiện theo loại, thời gian, v.v.
4. Sử dụng phân trang để xem thêm sự kiện

### 4. Xem chi tiết và đăng ký sự kiện
1. Nhấp vào sự kiện để xem chi tiết
2. Đọc thông tin chi tiết về sự kiện
3. Nhấp vào nút "Đăng ký tham gia" để đăng ký
4. Xác nhận đăng ký khi được yêu cầu

### 5. Quản lý sự kiện đã đăng ký
1. Truy cập trang "Quản lý sự kiện" từ menu người dùng
2. Xem danh sách sự kiện đã đăng ký
3. Xem danh sách sự kiện sắp diễn ra
4. Xem lịch sử tham gia sự kiện
5. Hủy đăng ký sự kiện nếu cần

### 6. Quản lý thông tin cá nhân
1. Truy cập trang "Hồ sơ cá nhân" từ menu người dùng
2. Cập nhật thông tin cá nhân
3. Cập nhật thông tin học tập
4. Đổi mật khẩu nếu cần

## Các tính năng chính

### Trang chủ
- Giới thiệu về trường Đại học Ngân hàng TP.HCM
- Hiển thị các sự kiện nổi bật
- Hiển thị cảm nhận của người tham gia sự kiện

### Danh sách sự kiện
- Hiển thị danh sách sự kiện với phân trang (10 sự kiện/trang)
- Tìm kiếm sự kiện theo tên
- Lọc sự kiện theo loại, thời gian, v.v.

### Chi tiết sự kiện
- Hiển thị thông tin chi tiết về sự kiện
- Hiển thị thời gian sự kiện
- Đăng ký tham gia sự kiện
- Kiểm tra điều kiện thời gian đăng ký

### Quản lý sự kiện của sinh viên
- Xem danh sách sự kiện đã đăng ký
- Xem danh sách sự kiện sắp diễn ra
- Xem lịch sử tham gia sự kiện
- Hủy đăng ký tham gia sự kiện
- Xem chứng chỉ tham gia sự kiện

### Quản lý thông tin cá nhân
- Xem và cập nhật thông tin cá nhân
- Xem và cập nhật thông tin học tập
- Đổi mật khẩu

## Tùy chỉnh và mở rộng

### Thay đổi giao diện
- Chỉnh sửa tệp `css/styles.css` để thay đổi giao diện
- Chỉnh sửa tệp `css/root.css` để thay đổi màu sắc, font chữ, v.v.

### Thêm tính năng mới
- Thêm trang HTML mới vào thư mục `pages/`
- Thêm script JavaScript mới vào thư mục `js/`
- Cập nhật menu và liên kết trong các trang HTML

## Hỗ trợ và liên hệ

Nếu bạn gặp vấn đề hoặc có câu hỏi, vui lòng liên hệ:
- Email: support@buh.edu.vn
- Điện thoại: (028) 3829 1901
- Địa chỉ: 36 Tôn Thất Đạm, Phường Nguyễn Thái Bình, Quận 1, TP.HCM

## Phiên bản

Phiên bản hiện tại: 1.0.0 (Tháng 4/2025)
#   b a n k i n g _ u n i v e r s i t y _ t e m p l a t e  
 #   b a n k i n g _ u n i v e r s i t y _ t e m p l a t e  
 