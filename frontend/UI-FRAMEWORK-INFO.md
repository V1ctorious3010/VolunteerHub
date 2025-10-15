# 🎨 UI Framework Information

## Navbar UI Source

Navbar component (`src/components/NavBars/NavBars.jsx`) hiện đang sử dụng **DaisyUI** - một component library cho TailwindCSS.

### DaisyUI Classes được sử dụng:

#### Layout Classes:
- `navbar` - Container chính của navbar
- `navbar-center` - Căn giữa các items
- `navbar-end` - Căn items về phía bên phải

#### Styling Classes:
- `bg-base-100` - Background color từ DaisyUI theme
- `menu` - Menu container
- `menu-horizontal` - Menu ngang
- `menu-sm` - Menu kích thước nhỏ

#### Component Classes:
- `dropdown` - Dropdown container
- `dropdown-end` - Dropdown hiển thị bên phải
- `dropdown-content` - Nội dung dropdown
- `btn` - Button component
- `btn-sm` - Button kích thước nhỏ
- `btn-secondary` - Button màu secondary

### UI Libraries trong dự án:

1. **DaisyUI** ✅ (ĐANG DÙNG)
   - Navbar, Buttons, Dropdown, Menu
   - Theme support (dark/light mode)
   
2. **TailwindCSS** ✅ (ĐANG DÙNG)
   - Utility classes (flex, gap, px-8, py-3, etc.)
   - Custom styling
   
3. **Material Tailwind** ⚠️ (CHƯA SỬ DỤNG)
   - Đã cài nhưng chưa được dùng trong navbar
   
4. **MUI (Material UI)** ⚠️ (CHƯA SỬ DỤNG)
   - Đã cài nhưng chưa được dùng trong navbar

5. **AOS (Animate On Scroll)** ✅ (ĐANG DÙNG)
   - Animation khi scroll: `data-aos="fade-down"`

### Tại sao UI không hiển thị đúng trước đây:

❌ **DaisyUI chưa được cài đặt** - Mặc dù code có sử dụng DaisyUI classes, nhưng package chưa được install nên các classes này không có CSS tương ứng.

✅ **Đã FIX bằng cách:**
```bash
npm install -D daisyui@latest --legacy-peer-deps
```

### Theme Configuration:

Navbar hỗ trợ dark/light mode thông qua:
- DaisyUI's `data-theme` attribute
- Custom theme switcher với checkbox

### Customization:

Để thay đổi màu sắc hoặc style, bạn có thể:

1. **Thay đổi DaisyUI theme** trong `tailwind.config.js`:
```javascript
module.exports = {
  plugins: [require('daisyui')],
  daisyui: {
    themes: ["light", "dark", "cupcake"], // thêm themes
  },
}
```

2. **Override styles** bằng Tailwind utilities:
```jsx
className="navbar bg-green-500" // thay vì bg-base-100
```

3. **Tạo custom theme colors** trong tailwind.config.js

---

**Lưu ý:** Hiện tại dự án có nhiều UI libraries được cài đặt. Nên cân nhắc chỉ giữ lại những thư viện đang thực sự sử dụng để giảm bundle size.
