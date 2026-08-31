# Lộ trình quản trị thật cho LO VAN LAM AM NHAC THAI

`admin.html` hiện chỉ là công cụ chỉnh dữ liệu cục bộ. Không có đăng nhập giả và không có mật khẩu hard-code.

## Phương án khuyến nghị trên Cloudflare

1. Cloudflare Access hoặc nhà cung cấp OAuth để bảo vệ `/admin`.
2. Cloudflare Worker làm API và kiểm tra quyền ở phía máy chủ.
3. D1 lưu metadata beat, giấy phép, giá và đơn hàng.
4. R2 lưu cover và audio preview; file gốc/WAV/stems dùng URL ký có thời hạn.
5. Turnstile cho form công khai nếu bổ sung form gửi yêu cầu.

Không đưa API token, secret, thông tin ngân hàng hoặc file master vào JavaScript/repository. Trước khi triển khai backend cần chốt schema dữ liệu, quyền truy cập và quy trình sao lưu.
