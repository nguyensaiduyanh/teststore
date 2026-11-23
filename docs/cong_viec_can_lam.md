Danh sách công việc Pha 2 – Hệ thống mua hàng online
1. Cải tiến xử lý tranh chấp tồn kho: Xử lý nhiều khách hàng cùng mua một sản phẩm, tránh bán vượt số lượng tồn kho; so sánh các cơ chế khóa dữ liệu để lựa chọn phương án hiệu quả.

2. Cải tiến xử lý đơn hàng đồng thời: Ngăn tạo đơn trùng khi người dùng nhấn mua nhiều lần hoặc gửi lại yêu cầu do lỗi mạng; bảo đảm tính nhất quán của đơn hàng.

3. Cải tiến hiệu năng truy vấn cơ sở dữ liệu: Tối ưu câu lệnh SQL, bổ sung chỉ mục, giải quyết truy vấn N+1 và tối ưu phân trang, tìm kiếm sản phẩm, đơn hàng.

4. Cải tiến khả năng chịu tải: Tối ưu connection pool, xử lý request đồng thời và quản lý tài nguyên CPU, RAM để tăng số lượng người dùng hệ thống có thể phục vụ.

5. Cải tiến tốc độ truy xuất dữ liệu bằng Cache: Áp dụng cơ chế cache cho dữ liệu sản phẩm, giảm số lần truy vấn database, đồng thời bảo đảm dữ liệu được cập nhật chính xác.

6. Cải tiến quản lý giao dịch (Transaction): Bảo đảm việc tạo đơn hàng, trừ kho, hoàn kho và ghi lịch sử được thực hiện nguyên tử; xử lý rollback, deadlock và transaction timeout.

7. Cải tiến bảo mật và độ ổn định: Hoàn thiện xác thực JWT, phân quyền, giới hạn tần suất request, kiểm tra dữ liệu đầu vào và xử lý lỗi hệ thống.

8. Cải tiến kiến trúc backend: Hoàn thiện Modular Monolith kết hợp Clean Architecture, phân chia rõ các module quản lý sản phẩm, giỏ hàng, đơn hàng, tồn kho và tài khoản.

9. Xây dựng giao diện khách hàng: Phát triển frontend bằng Next.js, gồm trang chủ, danh sách sản phẩm, tìm kiếm, chi tiết sản phẩm, đăng ký và đăng nhập.

10. Xây dựng giao diện mua hàng: Thiết kế giỏ hàng, trang đặt hàng, xác nhận đơn, lịch sử mua hàng, theo dõi trạng thái và hủy đơn.

11. Xây dựng giao diện quản trị: Quản lý sản phẩm, cập nhật tồn kho, xem lịch sử xuất nhập kho, quản lý đơn hàng và cập nhật trạng thái giao hàng.

12. Tích hợp frontend với backend: Kết nối REST API, xử lý xác thực, quản lý trạng thái, thông báo lỗi và bảo đảm giao diện hoạt động trên máy tính, điện thoại.

13. Xây dựng bộ kiểm thử chức năng và đồng thời: Kiểm thử các tình huống tranh mua, hết hàng, đặt đơn trùng, lỗi giao dịch, hoàn kho và truy cập trái phép.

14. Đánh giá hiệu năng trước và sau cải tiến: Sử dụng Locust đo throughput (RPS), p95/p99, tỷ lệ lỗi, CPU và RAM trên cùng cấu hình Kaggle CPU.

15. So sánh và lựa chọn kiến trúc phù hợp: Đánh giá ưu nhược điểm, hiệu năng và chi phí tài nguyên của từng giải pháp; giải thích lý do lựa chọn dựa trên kết quả thực nghiệm.

16. Hoàn thiện tài liệu và báo cáo Pha 2: Xây dựng sơ đồ kiến trúc trước/sau, biểu đồ hiệu năng, kết quả kiểm thử, tổng kết cải tiến và chuẩn bị demo sản phẩm.



Phân cụm toàn bộ 16 công việc
Cụm A — Backend: Đơn hàng và tính nhất quán
- 1. Cải tiến xử lý tranh chấp tồn kho.
- 2. Cải tiến xử lý đơn hàng đồng thời.
- 6. Cải tiến quản lý Transaction.
- 13. Kiểm thử chức năng và xử lý đồng thời.
Phụ trách: Thành viên 1


Cụm B — Backend: Hiệu năng và khả năng mở rộng
- 3. Cải tiến hiệu năng truy vấn database.
- 4. Cải tiến khả năng chịu tải.
- 5. Cải tiến tốc độ truy xuất bằng Cache.
- 14. Đánh giá hiệu năng trước/sau trên Kaggle.
Phụ trách: Thành viên 2


Cụm C — Frontend: Khách hàng và mua sắm
- 9. Xây dựng giao diện khách hàng.
- 10. Xây dựng giao diện mua hàng.
Phụ trách: Thành viên 3


Cụm D — Frontend: Quản trị và tích hợp
- 11. Xây dựng giao diện quản trị.
- 12. Tích hợp frontend với backend.
Phụ trách: Thành viên 4


Cụm E — Kiến trúc, bảo mật và báo cáo chung
- 7. Cải tiến bảo mật và độ ổn định.
- 8. Cải tiến kiến trúc backend.
- 15. So sánh và lựa chọn kiến trúc phù hợp.
- 16. Hoàn thiện tài liệu và báo cáo Pha 2.