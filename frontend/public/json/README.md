# 📋 Mock API Data - VolunteerHub

Thư mục này chứa các file JSON mock data để phát triển frontend mà không cần backend.

## 📁 Cấu trúc files

### 1. **db.json** - Database tổng hợp
File chính chứa toàn bộ data cho dự án:
- `users`: Danh sách người dùng (volunteers, organizations, admin)
- `volunteers`: Danh sách cơ hội tình nguyện
- `applications`: Đơn đăng ký tham gia
- `categories`: Các danh mục tình nguyện

### 2. **server.js** - Custom Mock Server ⭐ (Updated)
Mock API server với custom logic:
- `POST /api/auth/register` - Register với validation đầy đủ
- `POST /api/auth/login` - Login endpoint
- `POST /jwt` - Generate JWT token
- `GET /api/auth/current` - Get current user
- `GET /api/volunteers` - Get volunteers với filters
- `POST /api/opportunities/:id/apply` - Apply for opportunity

### 3. **auth.json** - Authentication responses
Mock responses cho các API authentication (reference only)

### 4. **opportunities.json** - Chi tiết volunteer opportunities
Thông tin đầy đủ về các cơ hội tình nguyện

### 5. **API-REGISTER-UPDATE.md** - Documentation
Chi tiết về các cải tiến mới cho Register API

## 🚀 Cách sử dụng

### ⭐ Option 1: Custom Server (RECOMMENDED)
Sử dụng custom server với logic authentication đầy đủ:

```bash
# Chạy custom mock server
npm run mock-api:custom

# Server chạy tại http://localhost:3001
```

**Endpoints có sẵn:**
```
POST   /api/auth/register   - Register new user (✨ Updated)
POST   /api/auth/login      - Login user (✨ Updated)
POST   /jwt                 - Generate JWT (🆕 New)
GET    /api/auth/current    - Get current user
GET    /api/volunteers      - Get volunteers list
POST   /api/opportunities/:id/apply - Apply for opportunity
```

### Option 2: Basic JSON Server
Chỉ dùng nếu không cần authentication logic:

```bash
# Chạy basic json-server
npm run mock-api

# API sẽ chạy tại http://localhost:3001
```

**Endpoints cơ bản:**
```
GET    /users
GET    /users/:id
POST   /users
PUT    /users/:id
DELETE /users/:id

GET    /volunteers
GET    /volunteers/:id
POST   /volunteers
PUT    /volunteers/:id
DELETE /volunteers/:id

GET    /applications
GET    /applications/:id
POST   /applications
PUT    /applications/:id
DELETE /applications/:id

GET    /categories
```

### Option 2: Import trực tiếp trong code

```javascript
// Import file JSON
import mockData from '../../public/json/db.json';
import authMock from '../../public/json/auth.json';

// Sử dụng data
const volunteers = mockData.volunteers;
const loginResponse = authMock.login.success;
```

### Option 3: Fetch từ public folder

```javascript
// Fetch JSON file
const response = await fetch('/json/db.json');
const data = await response.json();

// Sử dụng volunteers
setVolunteers(data.volunteers);
```

## 📊 Data Models

### User Model
```json
{
  "id": 1,
  "email": "user@example.com",
  "firstName": "Nguyen",
  "lastName": "Van A",
  "phoneNumber": "+84 123 456 789",
  "role": "VOLUNTEER | ORGANIZATION | ADMIN",
  "enabled": true,
  "createdAt": "2024-01-01T00:00:00",
  "updatedAt": "2024-01-01T00:00:00"
}
```

### Volunteer Opportunity Model
```json
{
  "_id": "vol001",
  "post_title": "Beach Cleanup Campaign",
  "thumbnail": "https://...",
  "category": "Environment",
  "deadline": "2024-12-31",
  "description": "...",
  "location": "Da Nang Beach",
  "max_volunteers": 50,
  "current_volunteers": 23,
  "status": "ACTIVE",
  "organization": {
    "id": 2,
    "name": "Green Earth Foundation"
  }
}
```

### Application Model
```json
{
  "id": 1,
  "userId": 3,
  "opportunityId": "vol001",
  "status": "APPROVED | PENDING | REJECTED",
  "appliedAt": "2024-10-01T10:00:00",
  "updatedAt": "2024-10-02T14:30:00"
}
```

## 🔧 Cấu hình trong Project

### Cập nhật .env file
```env
# Development với mock data
VITE_API_URL=http://localhost:3001

# Production với backend thật
# VITE_API_URL=http://localhost:8081/api
```

### Sử dụng trong components

#### VolunteerNeeds.jsx
```javascript
useEffect(() => {
  const getData = async () => {
    try {
      // Sẽ gọi đến http://localhost:3001/volunteers
      const { data } = await axios(
        `${import.meta.env.VITE_API_URL}/volunteers`
      );
      setVolunteers(data);
    } catch (error) {
      console.log(error);
    }
  };
  getData();
}, []);
```

#### Login.jsx
```javascript
const handleLogin = async (email, password) => {
  try {
    // Mock response from auth.json
    const { data } = await axios.post(
      `${import.meta.env.VITE_API_URL}/auth/login`,
      { email, password }
    );
    
    // Với json-server, bạn cần tự implement logic
    // Hoặc import trực tiếp authMock.login.success
  } catch (error) {
    console.error(error);
  }
};
```

## 🎯 Test Cases

### GET Volunteers
```bash
curl http://localhost:3001/volunteers
```

### GET Single Volunteer
```bash
curl http://localhost:3001/volunteers?_id=vol001
```

### Filter by Category
```bash
curl http://localhost:3001/volunteers?category=Environment
```

### Search
```bash
curl http://localhost:3001/volunteers?q=Beach
```

### Pagination
```bash
curl http://localhost:3001/volunteers?_page=1&_limit=3
```

## 📝 Notes

1. **Image URLs**: Sử dụng Unsplash placeholder images. Có thể thay bằng ảnh local trong `public/images/`.

2. **JWT Tokens**: Tokens trong auth.json chỉ là mock, không thực sự valid. Nếu cần validate token, sử dụng thư viện như `jsonwebtoken`.

3. **Relationships**: json-server hỗ trợ `_embed` và `_expand` cho relationships:
   ```bash
   # Get volunteer with applications
   curl http://localhost:3001/volunteers/vol001?_embed=applications
   ```

4. **Custom Routes**: Tạo `routes.json` nếu cần custom endpoints:
   ```json
   {
     "/api/*": "/$1",
     "/volunteers/:id": "/volunteers?_id=:id"
   }
   ```

## 🔄 Update Strategy

Khi backend sẵn sàng:
1. Thay đổi `VITE_API_URL` trong `.env`
2. Kiểm tra response format có khớp với mock data không
3. Cập nhật axios calls nếu cần (endpoints, request/response format)

## 🐛 Troubleshooting

**Lỗi: Cannot find module**
```bash
# Đảm bảo file JSON ở đúng vị치
ls public/json/
```

**CORS Error với json-server**
```bash
# Thêm CORS middleware
json-server --watch db.json --port 3001 --middlewares ./middleware.js
```

**Data không load**
```javascript
// Check console logs
console.log('API URL:', import.meta.env.VITE_API_URL);
console.log('Response:', data);
```

## 📚 Resources

- [JSON Server Documentation](https://github.com/typicode/json-server)
- [Unsplash Source](https://source.unsplash.com/) - Free placeholder images
- [Mockaroo](https://www.mockaroo.com/) - Generate mock data

---
**Created for VolunteerHub Frontend Development** 🚀
