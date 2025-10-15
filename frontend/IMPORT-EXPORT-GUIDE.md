# 🐛 Lỗi Import/Export - UseAuth

## ❌ **Lỗi gặp phải:**

```
Uncaught SyntaxError: The requested module '/src/components/Hook/UseAuth.jsx' 
does not provide an export named 'UseAuth' (at Login.jsx:10:10)
```

---

## 🔍 **Nguyên nhân:**

### **Trong `UseAuth.jsx`:**
```jsx
const UseAuth = () => {
    // ...code
};

export default UseAuth;  // ← DEFAULT EXPORT
```

### **Trong `Login.jsx` (SAI):**
```jsx
import { UseAuth } from '../Hook/UseAuth';  // ← NAMED IMPORT
                                            // ❌ Tìm named export nhưng không có!
```

---

## 📚 **Giải thích Export/Import trong JavaScript**

### **1. Default Export** (Mỗi file chỉ có 1)

#### **Export:**
```jsx
// Cách 1: Inline
export default function MyComponent() { }

// Cách 2: Separate
const MyComponent = () => { };
export default MyComponent;
```

#### **Import:**
```jsx
import MyComponent from './MyComponent';  // ✅ KHÔNG có {}
import AnyName from './MyComponent';      // ✅ Có thể đổi tên tùy ý
```

### **2. Named Export** (Có thể có nhiều)

#### **Export:**
```jsx
// Cách 1: Inline
export const myFunction = () => { };
export const myVariable = 10;

// Cách 2: Separate
const myFunction = () => { };
const myVariable = 10;
export { myFunction, myVariable };
```

#### **Import:**
```jsx
import { myFunction } from './myFile';           // ✅ CÓ {}
import { myFunction, myVariable } from './myFile'; // ✅ Import nhiều
import { myFunction as fn } from './myFile';     // ✅ Rename với 'as'
```

### **3. Mix (Default + Named)**

#### **Export:**
```jsx
const MainComponent = () => { };
export const helperFunction = () => { };
export default MainComponent;
```

#### **Import:**
```jsx
import MainComponent, { helperFunction } from './myFile';  // ✅ Cả 2
```

---

## ✅ **Giải pháp cho UseAuth:**

### **Option 1: Sửa Import (Recommended) ✅**

**File: `Login.jsx`**
```jsx
// TRƯỚC (SAI):
import { UseAuth } from '../Hook/UseAuth';  // ❌

// SAU (ĐÚNG):
import UseAuth from '../Hook/UseAuth';      // ✅ Bỏ dấu {}
```

**Ưu điểm:**
- Không cần sửa file UseAuth.jsx
- Các file khác (NavBars.jsx, Register.jsx) đã đúng
- Chỉ sửa 1 chỗ

### **Option 2: Sửa Export (Không khuyến khích)**

**File: `UseAuth.jsx`**
```jsx
// TRƯỚC:
export default UseAuth;

// SAU:
export { UseAuth };  // Named export
// hoặc
export const UseAuth = () => { ... };
```

**Nhược điểm:**
- Phải sửa tất cả files import (NavBars.jsx, Register.jsx, v.v.)
- Nhiều code changes hơn

---

## 🎯 **Quy tắc nhớ nhanh:**

| Export Type | Export Syntax | Import Syntax |
|-------------|---------------|---------------|
| **Default** | `export default X` | `import X from '...'` |
| **Named** | `export { X }` hoặc `export const X` | `import { X } from '...'` |
| **Both** | Cả 2 | `import Default, { Named } from '...'` |

### **Nhớ:**
- `{}` = Named export/import
- Không `{}` = Default export/import

---

## 🔧 **Tất cả files cần kiểm tra:**

### **✅ Files đã ĐÚNG:**
```jsx
// NavBars.jsx
import UseAuth from "./../Hook/UseAuth";  ✅

// Register.jsx  
import UseAuth from "../Hook/UseAuth";    ✅
```

### **❌ File đã SAI (đã sửa):**
```jsx
// Login.jsx (TRƯỚC)
import { UseAuth } from '../Hook/UseAuth';  ❌

// Login.jsx (SAU)
import UseAuth from '../Hook/UseAuth';      ✅
```

---

## 📝 **Ví dụ thực tế:**

### **React Router:**
```jsx
// Default exports
import { BrowserRouter } from 'react-router-dom';  ❌ SAI
import BrowserRouter from 'react-router-dom';      ❌ SAI

// Named exports (đúng)
import { BrowserRouter, Route, Link } from 'react-router-dom';  ✅
```

### **React:**
```jsx
// Default export
import React from 'react';  ✅

// Named exports
import { useState, useEffect } from 'react';  ✅

// Both
import React, { useState, useEffect } from 'react';  ✅
```

### **Custom hooks:**
```jsx
// Thường dùng default export
const useCustomHook = () => { ... };
export default useCustomHook;

// Import
import useCustomHook from './hooks/useCustomHook';  ✅
```

---

## 🚨 **Lỗi thường gặp:**

### **1. Export default nhưng import named:**
```jsx
// File: utils.js
export default function myFunc() { }

// WRONG ❌
import { myFunc } from './utils';

// CORRECT ✅
import myFunc from './utils';
```

### **2. Export named nhưng import default:**
```jsx
// File: utils.js
export const myFunc = () => { };

// WRONG ❌
import myFunc from './utils';

// CORRECT ✅
import { myFunc } from './utils';
```

### **3. Quên dấu {} khi import nhiều:**
```jsx
// WRONG ❌
import useState, useEffect from 'react';

// CORRECT ✅
import { useState, useEffect } from 'react';
```

### **4. Thêm {} cho default export:**
```jsx
// File có: export default App;

// WRONG ❌
import { App } from './App';

// CORRECT ✅
import App from './App';
```

---

## 🎓 **Best Practices:**

### **1. Naming convention:**
```jsx
// Default export: Component/Class - PascalCase
export default MyComponent;

// Named export: functions/variables - camelCase
export const myFunction = () => { };
export const MY_CONSTANT = 100;
```

### **2. Một file một component:**
```jsx
// ✅ GOOD: Button.jsx
const Button = () => { };
export default Button;

// ❌ BAD: components.jsx
export const Button = () => { };
export const Input = () => { };
export const Select = () => { };
```

### **3. Index files:**
```jsx
// components/index.js
export { default as Button } from './Button';
export { default as Input } from './Input';
export { default as Select } from './Select';

// Usage
import { Button, Input, Select } from './components';  ✅
```

### **4. Re-exporting:**
```jsx
// utils/index.js
export { default as formatDate } from './formatDate';
export { default as validateEmail } from './validateEmail';

// Import tất cả utils từ 1 file
import { formatDate, validateEmail } from './utils';
```

---

## ✅ **Checklist khi gặp lỗi import:**

- [ ] Check xem file có `export` chưa?
- [ ] `export default` hay `export { }`?
- [ ] Import có match với export type không?
- [ ] Có dùng đúng `{}` chưa?
- [ ] Path import có đúng không?
- [ ] File có tồn tại không?
- [ ] Extension (.js, .jsx) có cần không?

---

## 🔗 **Tài liệu tham khảo:**

- [MDN: export](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export)
- [MDN: import](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import)
- [JavaScript.info: Modules](https://javascript.info/modules-intro)

---

**✅ Lỗi đã được sửa trong Login.jsx!**

Bây giờ bạn có thể chạy `npm run dev` lại và lỗi sẽ biến mất. 🚀
