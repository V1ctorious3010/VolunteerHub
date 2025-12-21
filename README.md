# WEB quản lí tình nguyện viên

## 1. Mã nguồn và cơ sở dữ liệu
Repo bao gồm:
- Toàn bộ mã nguồn của dự án (Frontend + Backend).
- File backup cơ sở dữ liệu dạng `.sql`.


---

## 2. Danh sách thành viên nhóm và phân công công việc

| STT | Thành viên | MSSV | Nhiệm vụ | Tỷ lệ đóng góp|
|:---:|:---|:---:|:---|:---:|
| 1 | **Đầu Hồng Quang** | 23020135 | **Frontend Developer**<br>| **33.33%** |
| 2 | **Đỗ Trung Kiên** | 23020085 | **Backend Developer**<br>  | **33.33%** |
| 3 | **Đỗ Đức Thắng** | 23020158 | **Backend Developer**<br>  | **33.33%** |

---

## 3. Hướng dẫn chạy dự án (Local)

### 3.1. Yêu cầu môi trường
- Node.js 
- Java 
### 3.2. Chuẩn bị cơ sở dữ liệu
1. Mở MySQL.
2. Import dữ liệu mẫu từ file `.sql` đi kèm trong dự án.

### 3.3. Khởi động Message Queue bằng Docker
Mở terminal tại thư mục gốc của dự án (chứa file `docker-compose.yml`) và chạy:

```bash
docker compose up -d
```

Để dừng container khi cần:
```bash
docker compose down
```

### 3.4. Chạy Backend (Spring Boot)
Mở terminal, di chuyển vào thư mục `backend` và chạy:

```bash
cd backend
mvn spring-boot:run
```
> Backend mặc định chạy tại cổng `5000`.

### 3.5. Chạy Frontend
Mở terminal khác, di chuyển vào thư mục `frontend` và chạy:

```bash
cd frontend
npm install
npm run dev
```

### 3.6. Truy cập hệ thống
- **Frontend:** `http://localhost:5173`
- **Backend API:** `http://localhost:5000`.

### 3.7. Thứ tự khởi động khuyến nghị
1. Khởi động MySQL và import database.
2. Chạy Docker Compose để mở Message Queue.
3. Chạy Backend.
4. Chạy Frontend.
