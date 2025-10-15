# 🚀 Hướng dẫn chạy Mock API - VolunteerHub

## 📦 Đã cài đặt
✅ json-server đã được cài đặt
✅ Mock data đã sẵn sàng trong `public/json/`
✅ Scripts đã được thêm vào package.json

## 🎯 Cách chạy

### Option 1: Mock API đơn giản (Recommended)
```bash
# Terminal 1 - Chạy mock API server
npm run mock-api

# Terminal 2 - Chạy frontend
npm run dev
```

Mock API sẽ chạy tại: **http://localhost:3001**

### Option 2: Mock API với custom logic
```bash
# Terminal 1 - Chạy custom mock server
npm run mock-api:custom

# Terminal 2 - Chạy frontend  
npm run dev
```

Custom server có thêm:
- ✅ Authentication endpoints (/api/auth/login, /api/auth/register)
- ✅ Apply for opportunities
- ✅ Filter và search

## 🔧 Cấu hình

File `.env` đã được cập nhật:
```env
VITE_API_URL=http://localhost:3001
```

## 📋 Endpoints có sẵn

### Với `npm run mock-api`:
```
GET    http://localhost:3001/users
GET    http://localhost:3001/volunteers
GET    http://localhost:3001/applications
GET    http://localhost:3001/categories
```

### Với `npm run mock-api:custom`:
```
POST   http://localhost:3001/api/auth/login
POST   http://localhost:3001/api/auth/register
GET    http://localhost:3001/api/auth/current
GET    http://localhost:3001/api/volunteers
POST   http://localhost:3001/api/opportunities/:id/apply
```

## 🧪 Test API

### Test với browser:
Mở: http://localhost:3001/volunteers

### Test với curl:
```bash
# Get all volunteers
curl http://localhost:3001/volunteers

# Get by category
curl http://localhost:3001/volunteers?category=Environment

# Search
curl http://localhost:3001/volunteers?q=Beach
```

## 📂 Mock Data Files

1. **db.json** - Database chính
   - users (4 users)
   - volunteers (6 opportunities)
   - applications (3 applications)
   - categories (5 categories)

2. **auth.json** - Authentication responses
   - Login/Register success/error responses
   - JWT tokens (mock)

3. **opportunities.json** - Chi tiết opportunities
   - Thông tin đầy đủ
   - Requirements & benefits
   - Contact info

## 🔄 Workflow phát triển

1. **Chạy Mock API**
   ```bash
   npm run mock-api
   ```

2. **Chạy Frontend** (terminal khác)
   ```bash
   npm run dev
   ```

3. **Test trong browser**
   - Frontend: http://localhost:5175
   - API: http://localhost:3001

4. **Khi backend sẵn sàng**, đổi trong `.env`:
   ```env
   # VITE_API_URL=http://localhost:3001  # Comment dòng này
   VITE_API_URL=http://localhost:8081/api  # Uncomment dòng này
   ```

## 💡 Tips

### Thêm data mới:
Edit file `public/json/db.json` và save. Server tự động reload!

### Reset data:
Copy lại từ backup hoặc git reset file db.json

### CORS issues:
json-server tự động enable CORS, không cần config thêm

### View all data:
Mở http://localhost:3001/db để xem toàn bộ database

## 🐛 Troubleshooting

**Port 3001 đã được dùng:**
```bash
# Đổi port trong package.json
"mock-api": "json-server --watch public/json/db.json --port 3002"

# Và cập nhật .env
VITE_API_URL=http://localhost:3002
```

**Data không load:**
1. Check console: `console.log(import.meta.env.VITE_API_URL)`
2. Đảm bảo mock API đang chạy
3. Check network tab trong DevTools

**Lỗi module:**
```bash
npm install -D json-server --legacy-peer-deps
```

---
**Happy Coding! 🎉**
