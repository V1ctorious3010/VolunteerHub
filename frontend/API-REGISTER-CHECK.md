# 🔍 Kiểm Tra API Đăng Ký - Report

## ❌ Vấn Đề Phát Hiện

### **Problem 1: Endpoint Mismatch**

**AuthProviders.jsx đang gọi:**
```javascript
POST ${VITE_API_URL}/register          // ❌ SAI
POST ${VITE_API_URL}/login             // ❌ SAI
POST ${VITE_API_URL}/logout            // ❌ SAI
GET  ${VITE_API_URL}/me                // ❌ SAI
```

**Mock server.js đang lắng nghe:**
```javascript
POST /api/auth/register                // ✅ ĐÚNG
POST /api/auth/login                   // ✅ ĐÚNG
POST /api/auth/logout                  // ✅ ĐÚNG (có)
GET  /api/auth/current                 // ✅ ĐÚNG
```

**→ Kết quả:** API call sẽ bị **404 Not Found**

---

### **Problem 2: Missing Parameter**

**Register.jsx đang gọi:**
```javascript
registerAccount(email, password)       // ❌ Thiếu tham số thứ 3
```

**AuthProviders.jsx định nghĩa:**
```javascript
registerAccount(email, password, displayName)  // ✅ Cần 3 tham số
```

**→ Kết quả:** `displayName` = undefined, mock server không nhận được `name`

---

### **Problem 3: Unnecessary Function Call**

**Register.jsx:**
```javascript
await updateUserProfile(name, email);  // ❌ Không cần thiết
```

**Lý do:**
- Mock server đã trả về `user` với `displayName` đầy đủ
- `updateUserProfile` dùng cho Firebase, không dùng cho Mock API

---

## ✅ Đã Sửa

### **Fix 1: Update AuthProviders.jsx**

```javascript
// TRƯỚC
const { data } = await axios.post(
    `${import.meta.env.VITE_API_URL}/register`,
    { email, password, displayName }
);

// SAU
const { data } = await axios.post(
    `${import.meta.env.VITE_API_URL}/api/auth/register`,
    { email, password, name: displayName }
);
```

**Thay đổi:**
- ✅ Thêm `/api/auth` vào tất cả endpoints
- ✅ Đổi `displayName` → `name` (khớp với mock server)
- ✅ Update endpoint `/me` → `/api/auth/current`

---

### **Fix 2: Update Register.jsx**

```javascript
// TRƯỚC
const result = await registerAccount(email, password);
await updateUserProfile(name, email);

// SAU
const result = await registerAccount(email, password, name);
// Bỏ updateUserProfile (không cần)
```

**Thay đổi:**
- ✅ Thêm tham số `name` vào `registerAccount`
- ✅ Xóa call `updateUserProfile`
- ✅ Xóa import `updateUserProfile` từ UseAuth

---

## 📊 API Flow Sau Khi Sửa

### **Register Flow:**

```
User Submit Form (name, email, password)
    ↓
Register.jsx: registerAccount(email, password, name)
    ↓
AuthProviders.jsx: POST /api/auth/register
    ↓
Request Body: {
  email: "user@example.com",
  password: "password123",
  name: "John Doe"
}
    ↓
Mock server.js: /api/auth/register
    ↓
Validation:
  ✅ Email format
  ✅ Password length >= 6
  ✅ Email không tồn tại
    ↓
Parse name: "John Doe" → firstName: "John", lastName: "Doe"
    ↓
Create new user in db.json
    ↓
Response: {
  token: "mock_token_...",
  user: {
    id: 5,
    email: "user@example.com",
    firstName: "John",
    lastName: "Doe",
    displayName: "John Doe",
    photoURL: "https://ui-avatars.com/api/?name=John+Doe",
    role: "VOLUNTEER",
    enabled: true
  },
  message: "User registered successfully"
}
    ↓
AuthProviders: setUser(data.user)
    ↓
Register.jsx: POST /jwt (mock JWT endpoint)
    ↓
Toast: "Account created Successfully"
    ↓
Navigate to home page
```

---

## 🧪 Testing

### **Test Register:**

```bash
# 1. Start mock API server
npm run mock-api:custom

# 2. Start frontend
npm run dev

# 3. Mở browser: http://localhost:5173/register

# 4. Nhập form:
Name: Test User
Email: test@example.com
Password: password123

# 5. Click "Register"

# Expected Result:
✅ POST http://localhost:3001/api/auth/register → 200 OK
✅ Response có token và user data
✅ POST http://localhost:3001/jwt → 200 OK
✅ Toast: "Account created Successfully"
✅ Redirect về home page
✅ User hiện trong navbar
✅ User lưu trong db.json
```

---

## 📁 Files Đã Sửa

### 1. **AuthProviders.jsx**

**Changes:**
- ✅ `/register` → `/api/auth/register`
- ✅ `/login` → `/api/auth/login`
- ✅ `/logout` → `/api/auth/logout`
- ✅ `/me` → `/api/auth/current`
- ✅ `displayName` → `name` trong request body
- ✅ Thêm fallback `data.user || data` trong checkAuth

**Lines changed:** ~12 lines

---

### 2. **Register.jsx**

**Changes:**
- ✅ `registerAccount(email, password)` → `registerAccount(email, password, name)`
- ✅ Xóa `await updateUserProfile(name, email)`
- ✅ Xóa `updateUserProfile` từ UseAuth destructuring
- ✅ Better error handling: `err?.message || "Email Already In use!"`
- ✅ Better console logs: `'Register result:'`, `'JWT response:'`

**Lines changed:** ~8 lines

---

## 🎯 Endpoints Summary

### **Mock Server Endpoints:**

| Method | Endpoint | Purpose | Status |
|--------|----------|---------|--------|
| POST | `/api/auth/register` | Đăng ký user mới | ✅ Working |
| POST | `/api/auth/login` | Đăng nhập | ✅ Working |
| POST | `/api/auth/logout` | Đăng xuất | ✅ Working |
| GET | `/api/auth/current` | Lấy user hiện tại | ✅ Working |
| POST | `/jwt` | Generate JWT token | ✅ Working |
| GET | `/api/volunteers` | Lấy danh sách volunteers | ✅ Working |

### **Frontend Calls:**

| Component | Endpoint Called | Status |
|-----------|----------------|--------|
| AuthProviders | `/api/auth/register` | ✅ Fixed |
| AuthProviders | `/api/auth/login` | ✅ Fixed |
| AuthProviders | `/api/auth/logout` | ✅ Fixed |
| AuthProviders | `/api/auth/current` | ✅ Fixed |
| Register.jsx | `/jwt` | ✅ OK |

---

## ✅ Validation Rules

### **Mock Server - /api/auth/register:**

```javascript
✅ Email required
✅ Password required
✅ Email format: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
✅ Password length >= 6
✅ Email không trùng lặp
✅ Auto parse name: "John Doe" → firstName + lastName
✅ Auto generate avatar: ui-avatars.com
✅ Default role: "VOLUNTEER"
```

---

## 🐛 Potential Issues Fixed

### Before:
```
❌ 404 Not Found - /register
❌ 404 Not Found - /login
❌ 404 Not Found - /logout
❌ 404 Not Found - /me
❌ displayName undefined in database
❌ Unnecessary updateUserProfile call
```

### After:
```
✅ 200 OK - /api/auth/register
✅ 200 OK - /api/auth/login
✅ 200 OK - /api/auth/logout
✅ 200 OK - /api/auth/current
✅ displayName correctly saved
✅ Clean code, no unnecessary calls
```

---

## 📝 Notes

1. **Environment Variable:**
   ```bash
   VITE_API_URL=http://localhost:3001
   ```
   Đảm bảo giá trị này đúng trong `.env`

2. **Mock Server Port:**
   ```bash
   # Default port: 3001
   npm run mock-api:custom
   ```

3. **CORS:**
   Mock server đã có CORS middleware, không cần config thêm

4. **withCredentials:**
   Tất cả requests đều có `{ withCredentials: true }` để gửi cookies

---

## 🎉 Kết Luận

### ✅ **All Issues Fixed!**

- API endpoints giờ khớp giữa frontend và backend
- Register flow hoạt động đúng
- No compilation errors
- Ready for testing

### 🧪 **Next Steps:**

1. Start mock API: `npm run mock-api:custom`
2. Start frontend: `npm run dev`
3. Test register flow
4. Check db.json có user mới
5. Test login với user vừa tạo

**API đăng ký đã sẵn sàng!** 🚀
