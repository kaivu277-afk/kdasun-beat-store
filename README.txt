KDASUN MUSIC LIGHT + ADMIN

- index.html: website dành cho khách hàng.
- admin.html: giao diện quản trị cục bộ.
- data.js: dữ liệu beat mặc định dùng chung.
- style.css / app.js: giao diện và chức năng trang khách hàng.
- admin.css / admin.js: giao diện và chức năng quản trị cục bộ.
- assets/images: ảnh cover công khai, ưu tiên WebP.
- assets/audio: audio nghe thử MP3 đã gắn producer tag; không để WAV/stems đầy đủ tại đây.

THÊM ẢNH VÀ AUDIO:
- Chép cover vào assets/images và bản nghe thử vào assets/audio.
- Trong data.js, điền coverUrl: "assets/images/ten-beat.webp".
- Điền previewUrl: "assets/audio/ten-beat-preview.mp3".
- Có thể thử đường dẫn trong admin.html, nhưng dữ liệu admin chỉ lưu trên trình duyệt hiện tại.

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
