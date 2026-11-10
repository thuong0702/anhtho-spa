# Anh Tho Spa — React + NestJS

Project gồm hai ứng dụng độc lập:

- `fe`: React, TypeScript và Vite (http://localhost:5173)
- `be`: NestJS, TypeORM và MySQL (http://localhost:3000)

## Khởi chạy

Yêu cầu Node.js và npm. Cài MySQL và tạo database tên `anhtho_spa`, sau đó sao chép `be/.env.example` thành `be/.env` và điền thông tin kết nối nếu cần.

Mở hai terminal tại thư mục dự án:

```sh
cd be
npm run start:dev
```

```sh
cd fe
npm run dev
```

Nếu thay đổi cấu hình database, cập nhật các biến `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` trong `be/.env`. Tự đồng bộ schema được bật trong môi trường development và tắt khi `NODE_ENV=production`.

## Chức năng trang chủ

- Thanh điều hướng cuộn đến từng khu vực; tìm kiếm lọc dịch vụ theo tên và từ khóa.
- Có thể đổi ngôn ngữ, bật độ tương phản cao, thêm dịch vụ vào giỏ và giữ giỏ hàng khi tải lại trang.
- Form đặt lịch gửi `POST /bookings` tới NestJS. Backend kiểm tra thông tin rồi lưu lịch hẹn vào bảng `bookings` trong MySQL.

Frontend mặc định gọi API tại `http://localhost:3000`. Để đổi địa chỉ, sao chép `fe/.env.example` thành `fe/.env` và cập nhật `VITE_API_URL`.
