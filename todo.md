# Danh sách công việc - Hệ thống quản lý sự kiện cho sinh viên Đại học Ngân hàng TP.HCM

## Phân tích và chuẩn bị
- [x] Phân tích yêu cầu từ người dùng
- [x] Kiểm tra cấu trúc cơ sở dữ liệu (hanet.sql)
- [x] Xem xét các file template HTML hiện có
- [x] Tạo danh sách công việc chi tiết

## Hệ thống xác thực người dùng
- [x] Tạo trang đăng nhập (login.html)
  - [x] Thiết kế form đăng nhập với email và mật khẩu
  - [x] Thêm xác thực form client-side
  - [x] Tạo API xử lý đăng nhập
  - [x] Xử lý lưu trữ phiên đăng nhập (session/token)
- [x] Tạo trang đăng ký (register.html)
  - [x] Thiết kế form đăng ký với thông tin cá nhân
  - [x] Thêm xác thực form client-side
  - [x] Tạo API xử lý đăng ký
  - [x] Xử lý xác nhận email (nếu cần)
- [x] Tạo middleware kiểm tra xác thực cho các trang yêu cầu đăng nhập
- [x] Tạo chức năng đăng xuất

## Trang chủ và thông tin trường
- [x] Cập nhật trang chủ (index.html)
  - [x] Thêm thông tin giới thiệu về trường Đại học Ngân hàng TP.HCM
  - [x] Hiển thị các sự kiện nổi bật
  - [x] Thêm phần cảm nhận của người tham gia sự kiện

## Danh sách sự kiện và phân trang
- [x] Tạo trang danh sách sự kiện (events.html)
  - [x] Thiết kế giao diện hiển thị danh sách sự kiện
  - [x] Thêm chức năng phân trang (10 sự kiện/trang)
  - [x] Thêm bộ lọc sự kiện (theo loại, thời gian, v.v.)
  - [x] Tạo API lấy danh sách sự kiện từ cơ sở dữ liệu
  - [x] Xử lý hiển thị sự kiện theo phân trang

## Chi tiết sự kiện và đăng ký
- [x] Tạo trang chi tiết sự kiện (event-detail.html)
  - [x] Thiết kế giao diện hiển thị thông tin chi tiết sự kiện
  - [x] Hiển thị thời gian sự kiện dựa trên dữ liệu từ cơ sở dữ liệu
  - [x] Thêm chức năng đăng ký nhanh cho sinh viên
  - [x] Tạo API xử lý đăng ký sự kiện
  - [x] Thêm kiểm tra điều kiện thời gian đăng ký
  - [x] Hiển thị thông báo đăng ký thành công

## Trang quản lý sự kiện của sinh viên
- [x] Tạo trang quản lý sự kiện (student-dashboard.html)
  - [x] Thiết kế giao diện trang quản lý
  - [x] Tạo tab danh sách sự kiện đã đăng ký
  - [x] Tạo tab danh sách sự kiện đang và sắp được tổ chức
  - [x] Tạo tab lịch sử tham gia sự kiện
  - [x] Tạo API lấy dữ liệu sự kiện của sinh viên
  - [x] Xử lý hiển thị dữ liệu theo từng tab

## Trang quản lý thông tin cá nhân
- [x] Tạo trang quản lý thông tin cá nhân (profile.html)
  - [x] Thiết kế giao diện hiển thị thông tin cá nhân
  - [x] Thêm chức năng chỉnh sửa thông tin (trừ email)
  - [x] Tạo API cập nhật thông tin cá nhân
  - [x] Xử lý xác thực và lưu trữ thông tin cập nhật

## Tích hợp và kiểm thử
- [x] Tích hợp các thành phần
  - [x] Liên kết các trang với nhau
  - [x] Đảm bảo tính nhất quán của giao diện
- [x] Kiểm thử chức năng
  - [x] Kiểm tra đăng nhập/đăng ký
  - [x] Kiểm tra hiển thị danh sách sự kiện và phân trang
  - [x] Kiểm tra đăng ký sự kiện
  - [x] Kiểm tra quản lý sự kiện của sinh viên
  - [x] Kiểm tra quản lý thông tin cá nhân
- [x] Kiểm thử giao diện trên các thiết bị khác nhau
  - [x] Desktop
  - [x] Tablet
  - [x] Mobile

## Triển khai
- [ ] Chuẩn bị tài liệu hướng dẫn
- [ ] Đóng gói và giao nộp mã nguồn
- [ ] Triển khai hệ thống (nếu cần)
