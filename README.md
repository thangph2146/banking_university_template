# Hệ thống Quản lý Sự kiện Đại học Ngân hàng TP.HCM

Hệ thống quản lý sự kiện cho sinh viên Đại học Ngân hàng TP.HCM là nền tảng web được thiết kế để kết nối sinh viên với các hoạt động học thuật và ngoại khóa, đồng thời cung cấp thông tin hữu ích về trường và các tin tức mới nhất.

## Nội dung

- [Tính năng](#tính-năng)
- [Yêu cầu hệ thống](#yêu-cầu-hệ-thống)
- [Cài đặt](#cài-đặt)
- [Hướng dẫn sử dụng](#hướng-dẫn-sử-dụng)
  - [Đăng ký tài khoản](#đăng-ký-tài-khoản)
  - [Đăng nhập](#đăng-nhập)
  - [Xem và đăng ký sự kiện](#xem-và-đăng-ký-sự-kiện)
  - [Quản lý tài khoản](#quản-lý-tài-khoản)
  - [Đọc bài viết blog](#đọc-bài-viết-blog)
- [Luồng hoạt động của website](#luồng-hoạt-động-của-website)
  - [Luồng đăng ký và xác thực](#luồng-đăng-ký-và-xác-thực)
  - [Luồng tham gia sự kiện](#luồng-tham-gia-sự-kiện)
  - [Luồng đọc tin tức và blog](#luồng-đọc-tin-tức-và-blog)
  - [Luồng quản lý tài khoản](#luồng-quản-lý-tài-khoản)
- [Cấu trúc thư mục](#cấu-trúc-thư-mục)
- [Công nghệ sử dụng](#công-nghệ-sử-dụng)
- [Liên hệ hỗ trợ](#liên-hệ-hỗ-trợ)

## Tính năng

- **Hệ thống xác thực người dùng**: Đăng ký, đăng nhập, quản lý tài khoản
- **Quản lý sự kiện**: Xem danh sách sự kiện, lọc theo nhiều tiêu chí, đăng ký tham gia
- **Blog thông tin**: Cập nhật tin tức, kiến thức và hoạt động mới nhất tại trường
- **Hồ sơ cá nhân**: Cập nhật thông tin cá nhân, xem lịch sử tham gia sự kiện
- **Giao diện thân thiện**: Thiết kế responsive cho mọi thiết bị (desktop, tablet, mobile)

## Yêu cầu hệ thống

- Trình duyệt web hiện đại (Chrome, Firefox, Safari, Edge phiên bản mới nhất)
- Kết nối internet ổn định
- JavaScript được bật trong trình duyệt

## Cài đặt

Hệ thống này là một ứng dụng web, không yêu cầu cài đặt phức tạp. Để chạy hệ thống trên máy chủ web cục bộ:

1. Clone repository về máy:
```bash
git clone <repository-url>
```

2. Mở thư mục dự án và khởi chạy web server đơn giản (nếu cần):
```bash
# Sử dụng Python để tạo server đơn giản
python -m http.server
# Hoặc sử dụng Node.js với gói http-server
npx http-server
```

3. Truy cập trang web tại địa chỉ `http://localhost:8000` (hoặc cổng được chỉ định)

## Hướng dẫn sử dụng

### Đăng ký tài khoản

1. Truy cập trang chủ và nhấn vào nút "Đăng ký" ở góc trên bên phải
2. Điền đầy đủ thông tin cá nhân vào biểu mẫu đăng ký
3. Xác nhận email (nếu được yêu cầu)
4. Đăng nhập với tài khoản vừa tạo

### Đăng nhập

1. Nhấn vào nút "Đăng nhập" ở góc trên bên phải của trang
2. Nhập email và mật khẩu đã đăng ký
3. Nhấn "Đăng nhập" để truy cập vào tài khoản

### Xem và đăng ký sự kiện

1. Truy cập trang "Sự kiện" từ menu chính
2. Sử dụng bộ lọc để tìm sự kiện phù hợp (theo loại, thời gian, v.v.)
3. Nhấn vào tên sự kiện để xem chi tiết
4. Nhấn nút "Đăng ký" để tham gia sự kiện (yêu cầu đăng nhập)
5. Xác nhận thông tin đăng ký và hoàn tất quá trình

### Quản lý tài khoản

1. Sau khi đăng nhập, nhấn vào tên người dùng ở góc trên bên phải
2. Chọn "Hồ sơ cá nhân" để xem và chỉnh sửa thông tin
3. Xem danh sách sự kiện đã đăng ký tại trang "Sự kiện đã đăng ký"
4. Cập nhật mật khẩu và thông tin cá nhân theo nhu cầu

### Đọc bài viết blog

1. Truy cập trang "Blog" từ menu chính
2. Xem các bài viết nổi bật hoặc mới nhất
3. Sử dụng các danh mục ở sidebar để lọc bài viết theo chủ đề
4. Nhấn vào tiêu đề bài viết để đọc nội dung đầy đủ

## Luồng hoạt động của website

### Luồng đăng ký và xác thực

```
Truy cập trang chủ (index.html)
    ↓
Nhấn nút "Đăng ký" → Chuyển đến trang đăng ký (register.html)
    ↓
Điền thông tin → Kiểm tra hợp lệ (client-side validation)
    ↓                ↓
Gửi thông tin → Xác thực → Tạo tài khoản → Chuyển đến trang đăng nhập
    ↓
Nhập thông tin đăng nhập → Xác thực → Đăng nhập thành công 
    ↓
Chuyển đến trang chủ với trạng thái đã đăng nhập
```

### Luồng tham gia sự kiện

```
Truy cập trang sự kiện (events.html)
    ↓
Lọc sự kiện theo tiêu chí (tùy chọn)
    ↓
Chọn sự kiện → Xem chi tiết sự kiện (event-detail.html)
    ↓
Nhấn "Đăng ký tham gia" → Kiểm tra trạng thái đăng nhập
    ↓                         ↓
(Đã đăng nhập) → Xác nhận tham gia → Đăng ký thành công → Cập nhật danh sách sự kiện của người dùng
    ↓
(Chưa đăng nhập) → Chuyển đến trang đăng nhập (login.html) → Sau khi đăng nhập, quay lại trang sự kiện
```

### Luồng đọc tin tức và blog

```
Truy cập trang blog (blog.html)
    ↓
Xem các bài viết nổi bật
    ↓
Lọc bài viết theo danh mục/chủ đề (tùy chọn)
    ↓
Chọn bài viết → Xem chi tiết bài viết (blog-detail.html)
    ↓
Đọc nội dung bài viết → Tương tác (bình luận, chia sẻ - nếu đã đăng nhập)
```

### Luồng quản lý tài khoản

```
Đăng nhập thành công
    ↓
Truy cập trang hồ sơ cá nhân (profile.html)
    ↓
Xem/Chỉnh sửa thông tin cá nhân → Lưu thay đổi
    ↓
Xem danh sách sự kiện đã đăng ký (registered-events.html)
    ↓
Quản lý tham gia sự kiện (hủy đăng ký, xem chi tiết, v.v.)
```

## Cấu trúc thư mục

- `pages/`: Chứa các trang HTML của ứng dụng
- `public/`: Chứa tài nguyên tĩnh
  - `css/`: File CSS và styles
  - `js/`: JavaScript và các thư viện
  - `data/`: Dữ liệu mẫu (nếu có)
  - `assets/`: Các tài nguyên khác
- `images/`: Chứa hình ảnh và logo

## Công nghệ sử dụng

- HTML5, CSS3, JavaScript
- Tailwind CSS (Framework CSS)
- Remix Icon (Thư viện biểu tượng)
- AOS (Animation On Scroll)
- Font Google API

