# KDASUN Music Platform

Website tĩnh bán beat, tiếp nhận phối nhạc theo yêu cầu và giới thiệu hệ sinh thái dịch vụ sáng tạo âm nhạc của KDASUN. Giao diện sử dụng hoàn toàn tiếng Việt, tối ưu cho máy tính và điện thoại, deploy trực tiếp lên Cloudflare Pages mà không cần build.

## Công nghệ

- HTML5 semantic.
- CSS thuần với biến màu, responsive và `prefers-reduced-motion`.
- JavaScript thuần, không framework và không dependency runtime.
- `HTMLAudioElement` cho audio preview.
- `localStorage` cho giỏ hàng và beat yêu thích.
- Hash URL dạng `#beat/ten-beat` cho chi tiết beat, tránh lỗi refresh trên hosting tĩnh.

## Cấu trúc

```text
/
├── index.html               # Giao diện và các dialog
├── style.css                # Hệ thống thiết kế + responsive
├── app.js                   # Player, bộ lọc, giỏ hàng, form và UI
├── config.js                # Liên hệ, thanh toán, domain, mạng xã hội
├── data/
│   └── beats.js             # Nguồn dữ liệu beat duy nhất
├── assets/
│   ├── images/              # Tạo khi thêm cover thật
│   ├── audio/               # Tạo khi thêm audio preview thật
│   └── ...                  # Logo, favicon, Open Graph
├── manifest.webmanifest
├── robots.txt
├── sitemap.xml
├── _headers                 # Header bảo mật/cache cho Cloudflare Pages
├── _redirects
└── ADMIN_SETUP.md           # Lộ trình quản trị an toàn
```

## Chạy local

Không mở trực tiếp bằng `file://` vì một số tính năng trình duyệt bị giới hạn. Chạy HTTP server tại thư mục gốc:

```powershell
python -m http.server 8080
```

Sau đó mở `http://localhost:8080`.

Nếu có Node.js:

```powershell
npx serve .
```

## Deploy Cloudflare Pages

Thiết lập dự án Pages với:

- Production branch: `main`.
- Framework preset: `None`.
- Build command: để trống.
- Build output directory: `/` hoặc thư mục gốc repository.
- Không cần biến môi trường và không có secret.

Cloudflare Pages sẽ đọc `index.html`, `_headers` và `_redirects` trực tiếp. Chi tiết beat dùng hash nên không tạo route 404.

## Thêm beat mới

1. Mở `data/beats.js`.
2. Sao chép một object beat.
3. Đổi `id` và `slug` thành giá trị duy nhất, chỉ dùng chữ thường, số và dấu gạch ngang.
4. Điền tiêu đề, producer, thể loại, mood, BPM, tone, ngày phát hành và các trạng thái.
5. Cập nhật `licensePrices` cho bốn gói: `mp3`, `wav`, `stems`, `exclusive`.
6. Dùng `null` nếu một gói không khả dụng, dùng `0` nếu miễn phí.

Dữ liệu không được hard-code ở `app.js` hoặc `index.html`.

## Thay cover

1. Tạo thư mục `assets/images` nếu chưa có.
2. Ưu tiên ảnh WebP/JPEG vuông, kích thước khoảng 1200×1200 px và dung lượng hợp lý.
3. Điền:

```js
cover: "assets/images/ten-beat.webp"
```

Khi `cover` để trống, website tự dùng cover chữ và màu từ `coverTheme`, không tạo request 404.

## Thêm audio preview

1. Tạo thư mục `assets/audio`.
2. Thêm file MP3 preview đã được phép sử dụng.
3. Điền:

```js
previewUrl: "assets/audio/ten-beat.mp3",
duration: 30
```

Khi `previewUrl` trống, player hiển thị “Chưa có bản nghe thử” và không chạy timer giả. Website không tự phát audio khi tải trang.

## Thay giá và nội dung giấy phép

- Giá từng beat nằm trong `licensePrices` của beat.
- Nội dung quyền lợi chung nằm trong biến `licenseCatalog` ở đầu `app.js`.
- Không ghi giới hạn pháp lý chưa được xác nhận.
- Dòng “Điều khoản chính thức sẽ được xác nhận trong giấy phép mua hàng” phải được giữ cho tới khi có văn bản pháp lý chính thức.

## Cấu hình Zalo, email, ngân hàng và domain

Mở `config.js` và điền các trường có `TODO`:

- `contact.phone`, `contact.zalo`, `contact.email`.
- `payment.bankName`, `payment.accountNumber`, `payment.accountName`.
- `payment.vietQrUrl`, `payment.momo`, `payment.zaloPay` khi có thông tin thật.
- `social.youtube`, `social.facebook`, `social.tiktok`.
- `domain`.

Không commit API key, access token, mật khẩu hoặc secret. Khi chưa điền, giao diện hiển thị trạng thái “Chưa cấu hình” hoặc “Liên hệ để nhận thông tin thanh toán”.

Sau khi có domain:

1. Điền `domain` trong `config.js`.
2. Thay `https://example.com/` trong `sitemap.xml`.
3. Bỏ comment và cập nhật URL sitemap trong `robots.txt`.
4. Cập nhật URL tuyệt đối cho ảnh Open Graph nếu công cụ chia sẻ yêu cầu.

## Kiểm thử localStorage

Mở DevTools → Console và chạy:

```js
localStorage.removeItem("kdasun_cart_v3");
localStorage.removeItem("kdasun_favorites_v3");
location.reload();
```

Giỏ hàng tự loại bỏ sản phẩm khi beat hoặc gói giấy phép không còn tồn tại trong dữ liệu.

## Quản trị và backend

Website không có trang đăng nhập/admin giả. Xem [ADMIN_SETUP.md](ADMIN_SETUP.md) để lựa chọn Supabase hoặc Cloudflare D1/R2, thiết kế xác thực, quản lý beat, file và đơn hàng.

## TODO trước khi vận hành thương mại

- Điền Zalo, điện thoại, email và mạng xã hội thật.
- Điền thông tin ngân hàng/VietQR thật hoặc tiếp tục xác nhận thủ công.
- Thêm domain và hoàn thiện sitemap/canonical.
- Thêm cover và audio preview có quyền sử dụng.
- Thay nội dung đánh giá minh họa bằng đánh giá đã xác minh.
- Hoàn thiện văn bản giấy phép, điều khoản và chính sách quyền riêng tư với tư vấn phù hợp.
- Tích hợp backend nếu cần lưu đơn, quản trị nội dung hoặc thanh toán tự động.
