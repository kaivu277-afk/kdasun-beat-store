# LO VAN LAM AM NHAC THAI

Website tĩnh của **LO VAN LAM AM NHAC THAI**, giới thiệu studio âm nhạc Thái Tây Bắc, các dự án đã phát hành, dịch vụ sáng tác/phối khí, kho beat và liên hệ trực tiếp qua Zalo. Dự án không dùng framework nặng và triển khai trực tiếp trên Cloudflare Pages tại `https://kdasun.pages.dev/`.

## Cấu trúc

- `index.html`, `style.css`, `app.js`: website khách hàng.
- `config.js`: link Zalo, YouTube, email và domain.
- Kênh chính thức: YouTube, TikTok và Facebook được cấu hình tập trung trong `config.js`.
- `data.js`: dự án YouTube và dữ liệu beat mặc định.
- `admin.html`, `admin.css`, `admin.js`: công cụ chỉnh beat **cục bộ** bằng localStorage.
- `assets/images/projects`: thumbnail dự án từ kênh YouTube của chủ website.
- `assets/images/kdasun-social-card.jpg`: ảnh chia sẻ mạng xã hội.
- `assets/audio`: bản nghe thử MP3 đã gắn producer tag; không đưa WAV/stems đầy đủ lên repository công khai.
- `manifest.webmanifest`, `robots.txt`, `_headers`: PWA cơ bản, crawler và header Cloudflare.
- `tests/static-check.mjs`: kiểm tra đường dẫn, mã hóa và cấu trúc tĩnh.

## Việc bắt buộc trước khi công bố

Mở `config.js` và điền:

```js
zaloUrl: "https://zalo.me/0335212405"
```

Không dùng số giả. Khi trường này trống, nút Zalo mở thông báo cấu hình thay vì đưa khách sang sai tài khoản. Khi có domain chính thức, điền `siteUrl` rồi bổ sung canonical và URL sitemap.

## Thêm beat mới

1. Chép cover WebP vào `assets/images/`.
2. Chép bản nghe thử MP3 vào `assets/audio/`.
3. Sao chép một object trong `KDASUN_BEATS` ở `data.js`.
4. Đổi `id` thành giá trị duy nhất và cập nhật `title`, `genre`, `mood`, `bpm`, `key`, `price`.
5. Điền `coverUrl` và `previewUrl` bằng đường dẫn tương đối, ví dụ `assets/audio/ten-beat-preview.mp3`.

Nếu chưa có audio thật, để `previewUrl` trống. Website sẽ hiện “Chưa có bản nghe thử”, không chạy bộ đếm giả.

## Quản trị cục bộ

Mở `/admin.html` để thử thêm/sửa beat trên trình duyệt hiện tại. Dữ liệu được lưu ở key `kd_admin` trong localStorage và không đồng bộ cho khách truy cập khác. Xem `ADMIN_SETUP.md` để nâng cấp quản trị thật.

Xóa dữ liệu thử trong DevTools:

```js
localStorage.removeItem("kd_admin");
localStorage.removeItem("kd_f");
localStorage.removeItem("kd_c");
```

## Chạy và kiểm tra

```powershell
python -m http.server 8080
node --check app.js
node --check admin.js
node tests/static-check.mjs
```

Mở `http://localhost:8080/` và `http://localhost:8080/admin.html`.

## Cloudflare Pages

- Framework preset: `None`.
- Build command: để trống.
- Build output directory: `/` (thư mục gốc).
- Production branch: `main`.
- Không cần biến môi trường cho bản website tĩnh.

## TODO

- Zalo chính thức đã cấu hình: `0335212405`.
- Thêm cover/audio preview thật cho kho beat.
- Xác nhận bảng giá và nội dung giấy phép trước khi công bố.
- Tích hợp backend bảo mật nếu cần quản trị, upload file và quản lý đơn hàng cho nhiều thiết bị.
