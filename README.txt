KDASUN MUSIC LIGHT + ADMIN

- index.html: website dành cho khách hàng.
- admin.html: giao diện quản trị cục bộ.
- data.js: dữ liệu beat mặc định dùng chung.
- style.css / app.js: giao diện và chức năng trang khách hàng.
- admin.css / admin.js: giao diện và chức năng quản trị cục bộ.

CHẠY LOCAL:
python -m http.server 8080
Mở http://localhost:8080 và http://localhost:8080/admin.html

CLOUDFLARE PAGES:
- Framework preset: None.
- Build command: để trống.
- Build output directory: / (thư mục gốc).
- Production branch: main.

LƯU Ý BẢO MẬT:
Trang admin hiện lưu bằng localStorage, chỉ dùng để xem giao diện và thử thao tác trên thiết bị.
Muốn dùng thật cần Cloudflare Access/Auth + Worker API + D1 + R2.
Không đặt mật khẩu quản trị hoặc secret trong JavaScript.
