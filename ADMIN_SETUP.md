# Thiết lập quản trị KDASUN Music

Repository hiện là website tĩnh và chưa có backend. Vì vậy không tạo `/admin` với mật khẩu hard-code, không lưu tài khoản trong JavaScript và không giả lập đăng nhập.

## Phương án đề xuất

### Supabase

Phù hợp khi cần triển khai nhanh:

- Supabase Auth cho tài khoản quản trị.
- PostgreSQL cho beat, giấy phép và đơn hàng.
- Supabase Storage cho cover và audio preview.
- Row Level Security giới hạn quyền thêm/sửa/xóa theo tài khoản quản trị.
- Edge Functions để xác nhận đơn hoặc webhook thanh toán.

### Cloudflare D1 + R2

Phù hợp khi muốn giữ toàn bộ hạ tầng trên Cloudflare:

- Cloudflare Access hoặc nhà cung cấp OAuth cho xác thực quản trị.
- D1 lưu beat, giá, trạng thái độc quyền và đơn hàng.
- R2 lưu cover, audio, WAV/stems.
- Pages Functions/Workers làm API có kiểm tra quyền.
- Signed URL cho file khách đã mua.

## Mô hình dữ liệu tối thiểu

### `beats`

- `id`, `slug`, `title`, `producer`.
- `cover_url`, `preview_url`.
- `genre`, `mood`, `bpm`, `musical_key`, `duration`.
- `release_date`, `play_count`.
- `featured`, `is_new`, `popular`, `is_free`, `exclusive_available`.
- `tags`, `description`, `status`.

### `licenses`

- `id`, `beat_id`, `type`, `price`.
- `terms_version`, `active`.

### `orders`

- `id`, `order_code`, thông tin khách.
- `items`, `subtotal`, `payment_method`.
- `status`: `new`, `confirmed`, `paid`, `delivered`, `cancelled`.
- `created_at`, `updated_at`.

## Yêu cầu bảo mật

- Không đưa service-role key hoặc secret vào mã frontend.
- Bật RLS cho mọi bảng Supabase.
- Kiểm tra MIME type, dung lượng và quyền sở hữu khi upload.
- Không dùng URL công khai cho WAV/stems đã mua.
- Ghi audit log cho thao tác đổi giá, xóa beat và xác nhận độc quyền.
- Xác minh webhook thanh toán ở server.
- Không tin giá hoặc tổng tiền gửi từ trình duyệt; tính lại ở backend.

## Lộ trình

1. Chọn Supabase hoặc Cloudflare.
2. Tạo schema và storage.
3. Import dữ liệu từ `data/beats.js`.
4. Tạo API chỉ đọc cho storefront.
5. Thêm Auth và giao diện admin.
6. Thêm quản lý upload, giá và trạng thái độc quyền.
7. Thêm đơn hàng và gửi thông báo.
8. Chỉ tích hợp thanh toán sau khi có thông tin merchant thật và quy trình đối soát.
