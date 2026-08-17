# My Shop — Hướng dẫn chạy project

## 1. Cấu trúc thư mục
```
Products/
├─ index.html          ← Trang chủ (mở file này trước tiên)
├─ db.json              ← Dữ liệu sản phẩm giả lập cho json-server
├─ css/style.css
├─ js/
│  ├─ api.js            (fetch GET tới json-server)
│  ├─ common.js         (header, danh mục, tìm kiếm, số lượng giỏ hàng)
│  ├─ home.js            (carousel trang chủ, tự code JS thuần)
│  ├─ products.js        (danh sách sản phẩm, lọc/tìm kiếm)
│  ├─ detail.js          (chi tiết sản phẩm theo ID)
│  ├─ cart.js            (giỏ hàng, LocalStorage)
│  └─ auth.js            (đăng ký / đăng nhập / hồ sơ)
└─ html/
   ├─ products.html
   ├─ detail.html
   ├─ cart.html
   ├─ login.html
   ├─ sign.html
   ├─ forgot-password.html
   └─ profile.html
```

## 2. Chạy json-server (bắt buộc để trang Products/Detail hoạt động)
```bash
cd Products
npm install -g json-server      # nếu chưa cài
json-server --watch db.json --port 3000
```
API sẽ chạy tại: `http://localhost:3000/products`

## 3. Mở website
Vì có dùng `fetch()`, **không mở trực tiếp file `index.html` qua đường dẫn `file://`**
(một số trình duyệt sẽ chặn fetch). Hãy chạy 1 server tĩnh đơn giản, ví dụ:

- VS Code: cài extension **Live Server**, bấm "Go Live" ngay tại `index.html`
- Hoặc dùng Python: `cd Products && python3 -m http.server 8080` rồi mở
  `http://localhost:8080/index.html`

## 4. Ghi chú theo checklist đề bài
- **Carousel trang chủ**: tự code bằng JS thuần trong `js/home.js` (Next/Prev, dot,
  kéo chuột, auto-play) — không dùng thư viện ngoài.
- **Danh sách & chi tiết sản phẩm**: `js/products.js` và `js/detail.js` dùng
  `fetch()` GET tới `json-server`, trang chi tiết đọc đúng ID qua `?id=...`.
- **Giỏ hàng**: `js/cart.js` đọc/ghi LocalStorage, F5 không mất dữ liệu.
- **Đăng ký/Đăng nhập**: `js/auth.js` validate email bằng Regex, mật khẩu tối
  thiểu 6 ký tự, báo lỗi từng field, tài khoản lưu ở LocalStorage (`accounts`),
  người đăng nhập lưu ở `currentUser`.
- **Bonus**: lọc theo danh mục + tìm kiếm sản phẩm (`?category=`, `?search=` trên
  URL), tính tổng tiền giỏ hàng có giảm giá, trang hồ sơ cá nhân.
