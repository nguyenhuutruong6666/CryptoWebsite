# CryptoWebsite - Nền tảng Theo dõi và Giao dịch Tiền Điện Tử

Dự án CryptoWebsite là một ứng dụng web Fullstack cho phép người dùng theo dõi giá trị các đồng tiền điện tử theo thời gian thực (real-time), quản lý danh mục yêu thích và thông tin cá nhân. Hệ thống được xây dựng trên nền tảng **Node.js/Express** ở Backend, **React/Vite** ở Frontend và sử dụng **PostgreSQL** làm cơ sở dữ liệu.

---

## 1. Yêu cầu hệ thống

### 1.1. Yêu cầu phần cứng
- **CPU:** Tối thiểu 2 cores, khuyến nghị 4 cores.
- **RAM:** Tối thiểu 4GB (Khuyến nghị 8GB để chạy mượt mà cả client, server và database cùng lúc).
- **Ổ cứng:** Còn trống ít nhất 1GB.

### 1.2. Yêu cầu phần mềm
- **Hệ điều hành:** Windows, macOS, hoặc Linux.
- **Node.js:** Phiên bản 18.x trở lên (Khuyến nghị Node 20.x LTS).
- **NPM:** Đi kèm với Node.js.
- **Cơ sở dữ liệu:** PostgreSQL (phiên bản 14 trở lên).
- **Trình duyệt web:** Chrome, Firefox, Safari, Edge (phiên bản mới nhất).
- **Git:** Để clone dự án từ repository.

---

## 2. Cài đặt môi trường

1. **Cài đặt Node.js:** Tải và cài đặt tại [https://nodejs.org/](https://nodejs.org/).
2. **Cài đặt PostgreSQL:** Tải và cài đặt tại [https://www.postgresql.org/](https://www.postgresql.org/). Nhớ lưu lại thông tin tài khoản (username và password) trong quá trình cài đặt.
3. **Cài đặt Git:** Tải và cài đặt tại [https://git-scm.com/](https://git-scm.com/).
4. (Tùy chọn) **Cài đặt pgAdmin hoặc DBeaver** để dễ dàng quản lý database thông qua giao diện đồ họa.

---

## 3. Clone dự án từ GitHub

Mở Terminal (hoặc Command Prompt / PowerShell) và chạy lệnh sau để tải mã nguồn về máy:

```bash
git clone <URL_CUA_REPO_GITHUB>
cd CryptoWebsite
```
*(Thay `<URL_CUA_REPO_GITHUB>` bằng link repository thực tế của dự án).*

Dự án bao gồm 2 thư mục chính:
- `/backend`: Mã nguồn cho máy chủ API và WebSocket.
- `/frontend`: Mã nguồn cho giao diện người dùng.

---

## 4. Cài đặt và cấu hình database

1. Mở PostgreSQL (hoặc dùng pgAdmin) và tạo một database mới có tên là `db_tcrypto`.
2. Truy cập vào thư mục `backend`:
   ```bash
   cd backend
   ```
3. Tạo file `.env` từ file mẫu hoặc tạo mới file `.env` với nội dung sau:
   ```env
   PORT=4000
   FRONTEND_URL=http://localhost:5173
   BINANCE_API_URL=https://api.binance.com/api/v3
   JWT_SECRET=super_secret_key_tcrypto_2025
   DATABASE_URL="postgresql://postgres:123456@localhost:5432/db_tcrypto?schema=public"
   ```
   *Lưu ý: Thay thế `postgres` và `123456` bằng username và password PostgreSQL thực tế trên máy của bạn.*

---

## 5. Cài đặt và chạy Backend

Đang ở trong thư mục `backend`, hãy thực hiện các bước sau:

1. **Cài đặt thư viện (dependencies):**
   ```bash
   npm install
   ```

2. **Khởi tạo Database với Prisma:**
   Tiến hành đồng bộ cấu trúc các bảng từ Prisma schema vào PostgreSQL database:
   ```bash
   npx prisma db push
   ```
   *(Lệnh này sẽ tự động tạo các bảng `User`, `Role`, `favorites` trong cơ sở dữ liệu `db_tcrypto`).*

3. **Khởi động server Backend:**
   Chạy chế độ phát triển (development mode với nodemon):
   ```bash
   npm run dev
   ```
   Nếu server khởi động thành công, bạn sẽ thấy thông báo:
   ```
   🚀 CryptoWebsite Backend Started
   📍 Server:    http://localhost:4000
   🔌 WebSocket: ws://localhost:4000
   ```

---

## 6. Cài đặt và chạy Frontend

Mở một cửa sổ Terminal/Command Prompt **mới**, chuyển tới thư mục `frontend` của dự án:

1. **Truy cập thư mục frontend:**
   ```bash
   cd frontend
   ```

2. **Cài đặt thư viện (dependencies):**
   ```bash
   npm install
   ```

3. **Cấu hình môi trường (nếu cần):**
   Trong thư mục `frontend`, đảm bảo có file `.env` với cấu hình trỏ về backend:
   ```env
   VITE_API_URL=http://localhost:4000
   ```

4. **Khởi động Frontend:**
   ```bash
   npm run dev
   ```
   Ứng dụng React/Vite sẽ chạy ở địa chỉ `http://localhost:5173`. Bạn hãy mở trình duyệt và truy cập vào đường dẫn này.

---

## 7. Hướng dẫn sử dụng cơ bản

1. **Trang chủ (Trang thị trường):** 
   - Sau khi truy cập `http://localhost:5173`, bạn sẽ thấy danh sách các đồng tiền điện tử với giá cả thay đổi theo thời gian thực (được cấp nhật tự động thông qua WebSocket).
2. **Đăng ký / Đăng nhập:** 
   - Nhấn vào nút Đăng nhập / Đăng ký ở góc trên bên phải để tạo tài khoản mới.
   - Khi đăng nhập thành công, bạn sẽ nhận được JWT Token và có thể sử dụng các chức năng yêu cầu quyền thành viên.
3. **Quản lý danh sách Yêu thích (Favorites):**
   - Click vào biểu tượng ngôi sao (☆) cạnh mỗi đồng coin để thêm hoặc loại bỏ khỏi danh sách theo dõi của cá nhân bạn.
   - Truy cập vào mục "Yêu thích" trên thanh điều hướng để xem lại danh sách này.
4. **Trang chi tiết đồng coin:**
   - Click vào một đồng coin bất kỳ để xem biểu đồ giá và các thông tin chi tiết khác.
5. **Thông tin cá nhân:**
   - Truy cập trang hồ sơ cá nhân để xem hoặc cập nhật thông tin tài khoản của mình.
