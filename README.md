# VolunteerHub Fullstack Application

Ứng dụng web full-stack để quản lý hoạt động tình nguyện với React frontend và Spring Boot backend.

## 🏗️ Kiến trúc hệ thống

```
VolunteerHub-Fullstack/
├── frontend/          # React + Vite frontend
├── backend/           # Spring Boot backend  
└── README.md         # Hướng dẫn này
```

## 🚀 Cài đặt và chạy ứng dụng

### Yêu cầu hệ thống

- **Node.js** >= 18.0.0
- **Java** >= 17
- **Maven** >= 3.6
- **MySQL** >= 8.0

### 1. Cài đặt Database (MySQL)

```sql
-- Tạo database
CREATE DATABASE volunteerhub;

-- Tạo user (tuỳ chọn)
CREATE USER 'volunteerhub'@'localhost' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON volunteerhub.* TO 'volunteerhub'@'localhost';
FLUSH PRIVILEGES;
```

### 2. Cấu hình Backend

**File: `backend/src/main/resources/application.yml`**

```yaml
server:
  port: 8081

spring:
  datasource:
    url: jdbc:mysql://localhost:3306/volunteerhub
    username: root
    password: # Để trống nếu MySQL không có password
    driver-class-name: com.mysql.cj.jdbc.Driver
  
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true
    properties:
      hibernate:
        dialect: org.hibernate.dialect.MySQLDialect
```

### 3. Cấu hình Frontend

**File: `frontend/.env`**

```env
# API Configuration
VITE_API_URL=http://localhost:8081

# Development Configuration  
PORT=5173
```

### 4. Chạy ứng dụng

#### Backend (Terminal 1):
```bash
cd backend
mvn spring-boot:run
```

#### Frontend (Terminal 2):
```bash
cd frontend
npm install
npm run dev
```

### 5. Truy cập ứng dụng

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8081
- **Test Authentication**: http://localhost:5173 (sử dụng AuthExample component)

## 🔧 Cấu hình Environment Variables

### Frontend (.env)

| Biến | Mô tả | Ví dụ |
|------|-------|-------|
| `VITE_API_URL` | URL backend API | `http://localhost:8081` |
| `PORT` | Port cho frontend dev server | `5173` |

### Backend (application.yml)

| Thuộc tính | Mô tả | Ví dụ |
|------------|-------|-------|
| `server.port` | Port cho backend | `8081` |
| `spring.datasource.url` | MySQL connection URL | `jdbc:mysql://localhost:3306/volunteerhub` |
| `spring.datasource.username` | MySQL username | `root` |
| `spring.datasource.password` | MySQL password | `` (trống) |

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - Đăng ký tài khoản
- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/logout` - Đăng xuất
- `GET /api/auth/me` - Lấy thông tin user hiện tại

### Request Format

**Register:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Login:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

## 🧪 Testing

### Test Authentication với AuthExample

1. Mở browser: http://localhost:5173
2. Nhập thông tin:
   - Email: `test@example.com`
   - Password: `123456`
   - Full Name: `John Doe`
3. Click "Register" để tạo tài khoản
4. Click "Login" để đăng nhập

### Kiểm tra Database

```sql
-- Xem users đã tạo
SELECT * FROM users;

-- Xem volunteer opportunities
SELECT * FROM volunteer_opportunities;
```

## 🛠️ Cấu trúc dự án

### Frontend
```
frontend/src/
├── assets/
│   ├── Hook/              # Custom React hooks
│   ├── Layouts/           # Layout components
│   ├── Providers/         # Context providers
│   └── Routes/            # Route definitions
├── config/
│   └── api.config.js      # API configuration
├── examples/
│   └── AuthExample.jsx    # Authentication test component
└── services/
    └── httpClient.js      # Axios HTTP client
```

### Backend
```
backend/src/main/java/com/volunteerhub/
├── config/                # Configuration classes
├── controller/            # REST controllers
├── dto/                   # Data Transfer Objects
├── model/                 # JPA entities
├── repository/            # JPA repositories
└── service/               # Business logic services
```

## 🐛 Troubleshooting

### Lỗi thường gặp

1. **Connection refused trên port 5000**
   - Kiểm tra `VITE_API_URL` trong `.env`
   - Restart frontend server sau khi thay đổi `.env`

2. **403 Forbidden**
   - Kiểm tra CORS configuration
   - Đảm bảo request data đúng format

3. **Database connection failed**
   - Kiểm tra MySQL service đang chạy
   - Xác nhận database `volunteerhub` đã được tạo
   - Kiểm tra username/password trong `application.yml`

### Debug logs

**Frontend:**
```javascript
// Kiểm tra API configuration
console.log('API_BASE_URL:', import.meta.env.VITE_API_URL);
```

**Backend:**
```yaml
# Enable debug logging
logging:
  level:
    org.springframework.security: DEBUG
    org.springframework.web: DEBUG
```

## 📝 Development Notes

- Frontend sử dụng JWT token authentication
- Backend tự động tạo database tables qua Hibernate
- CORS đã được cấu hình cho development
- Password được mã hóa bằng BCrypt

## 🤝 Contributing

1. Fork repository
2. Tạo feature branch
3. Commit changes
4. Push và tạo Pull Request

## 📄 License

MIT License