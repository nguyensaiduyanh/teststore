Ae check trong file cong_viec_can_lam.md là hiểu các cụm
Thành viên 
1 – Cụm A 1 → 2 
2 – Cụm B 14 (baseline) → 3 
3 – Cụm C 9 → 10 
4 – Cụm D 12 (nền tảng API) → 11 

Quy ước: `+` public, `-` private. Đường dẫn tính từ thư mục gốc `store_ktpm`. Các file ghi Sửa đã tồn tại; các file ghi Tạo là đề xuất mới.

## Thành viên 1(Duy Khánh) – Xử lý tranh chấp tồn kho và đơn hàng đồng thời (1, 2)

Tạo file:

```
domain/model/IdempotencyRecord.java
record IdempotencyRecord {
  + Long userId
  + String requestKey
  + String requestHash
  + Long orderId
  + LocalDateTime createdAt
  + ensureSameRequest(String hash): void
}

domain/model/IdempotencyOperation.java
enum IdempotencyOperation {
  CREATE_ORDER, CHECKOUT_CART
}

application/port/out/IdempotencyStore.java
interface IdempotencyStore {
  + findCompleted(userId, operation, key): Optional<IdempotencyRecord>
  + saveCompleted(record): void
}

application/port/out/CustomerCommandLock.java
interface CustomerCommandLock {
  + lock(userId): void
}

application/service/OrderCommandService.java
class OrderCommandService {
  - OrderService orders
  - CartService carts
  - IdempotencyStore idempotency
  - CustomerCommandLock locks
  - TransactionRunner transactions
  + createDirect(request, key): Order
  + checkoutCart(request, key): Order
  - executeOnce(...): Order
  - validateKey(key): void
}

application/service/OrderRequestFingerprint.java
class OrderRequestFingerprint {
  + forDirectOrder(request): String
  + forCartCheckout(request): String
  - sha256(payload): String
}

infrastructure/persistence/order/JdbcIdempotencyStore.java
class JdbcIdempotencyStore implements IdempotencyStore {
  - JdbcTemplate jdbc
  + findCompleted(...): Optional<IdempotencyRecord>
  + saveCompleted(record): void
}

infrastructure/persistence/order/JdbcCustomerCommandLock.java
class JdbcCustomerCommandLock implements CustomerCommandLock {
  - JdbcTemplate jdbc
  + lock(userId): void
}

domain/exception/IdempotencyConflictException.java
class IdempotencyConflictException {
  + IdempotencyConflictException(message)
}
```

Sửa file:

```
application/service/OrderService.java
  + create(...): Order
  + cancelMine(...): Order
  - restoreStock(...): void

application/service/CartService.java
  + put(...): List<CartLine>
  + remove(...): void
  + clear(...): void
  + checkout(...): Order

api/order/OrderController.java
  + create(request, idempotencyKey): OrderResponse

api/order/CartController.java
  + checkout(request, idempotencyKey): OrderResponse

api/common/ApiExceptionHandler.java
  + handleIdempotencyConflict(...): ResponseEntity

config/ApplicationBeanConfig.java
  + orderCommandService(...): OrderCommandService
```

Tạo thêm:

- `db/migration/V3__order_idempotency.sql`
- `test/.../OrderCommandServiceTest.java`
- `test/.../MySqlCheckoutConcurrencyIT.java`
- `test/.../OrderIdempotencyApiIT.java`

Sửa `schema-h2.sql` tương ứng.

## Thành viên 2(Nghĩa) – Tối ưu database và đánh giá hiệu năng (3, 14)

Tạo file:

```
application/port/out/ProductReadCache.java
interface ProductReadCache {
  + get(productId): Optional<Product>
  + put(product): void
  + evict(productId): void
  + clear(): void
}

infrastructure/cache/CaffeineProductCache.java
class CaffeineProductCache implements ProductReadCache {
  - Cache<Long, Product> cache
  + get(productId): Optional<Product>
  + put(product): void
  + evict(productId): void
  + clear(): void
}

config/CacheConfig.java
class CacheConfig {
  + productCache(): ProductReadCache
}

application/port/out/OrderReadStore.java
interface OrderReadStore {
  + findPage(userId, status, page, size): OrderPage
  + findByIds(ids): List<Order>
}

infrastructure/persistence/order/JdbcOrderReadStore.java
class JdbcOrderReadStore implements OrderReadStore {
  - JdbcTemplate jdbc
  + findPage(...): OrderPage
  + findByIds(ids): List<Order>
}

application/service/ProductQueryService.java
class ProductQueryService {
  - ProductRepository products
  - ProductReadCache cache
  + getById(id): Product
  + search(query, page, size): ProductPage
}

application/service/OrderQueryService.java
class OrderQueryService {
  - OrderReadStore orders
  + findMine(userId, page, size): OrderPage
  + findAll(status, page, size): OrderPage
}
```

Sửa file:

```
infrastructure/persistence/product/
SpringDataProductRepository.java
  + searchByStatus(...): Page<ProductJpaEntity>
  + findAllByStatusOrderByIdDesc(...): List<ProductJpaEntity>

infrastructure/persistence/product/
ProductRepositoryAdapter.java
  + searchActive(...): ProductPage

infrastructure/persistence/order/
JdbcOrderSearchStore.java
  + search(...): Result

application/service/ProductService.java
  + getById(id): Product
  + update(...): Product
  + delete(id): void

api/product/ProductController.java
  + getAll(...): PagedProducts
  + search(...): PagedProducts
  + getById(id): ProductResponse
```

Tạo thêm:

- `db/migration/V4__query_indexes.sql`
- `performance/hotspot_locustfile.py`
- `performance/compare_benchmarks.py`
- `performance/query-profile.sql`
- `test/.../ProductCacheTest.java`
- `test/.../OrderQueryPerformanceIT.java`

Sửa `performance/kaggle_run.py` và `performance/locustfile.py` để đo trước/sau trên cùng cấu hình.

## Thành viên 3(Bảo Long) – Frontend khách hàng và mua hàng (9, 10)

Thư mục gốc: `frontend/src/`

Tạo file:

```
app/(shop)/page.tsx
function HomePage() {
  + renderBanners()
  + renderFeaturedProducts()
}

app/(shop)/products/page.tsx
function ProductsPage() {
  + renderProducts()
  + handleSearch(query)
  + handlePagination(page)
}

app/(shop)/products/[id]/page.tsx
function ProductDetailPage() {
  + renderProduct(id)
  + handleAddToCart(productId, quantity)
}

app/(auth)/login/page.tsx
function LoginPage() {
  + handleLogin(credentials)
}

app/(auth)/register/page.tsx
function RegisterPage() {
  + handleRegister(formData)
}

app/(shop)/cart/page.tsx
function CartPage() {
  + renderCart()
  + handleUpdateQuantity(productId, quantity)
  + handleRemoveItem(productId)
}

app/(shop)/checkout/page.tsx
function CheckoutPage() {
  + renderCheckout()
  + handleSubmitOrder(data)
}

app/(shop)/orders/page.tsx
function OrdersPage() {
  + renderOrders()
  + handleFilter(status)
}

app/(shop)/orders/[id]/page.tsx
function OrderDetailPage() {
  + renderOrder(id)
  + handleCancelOrder(id)
}

features/catalog/components/ProductCard.tsx
function ProductCard {
  + product: Product
  + onAddToCart(productId)
}

features/catalog/components/ProductGrid.tsx
function ProductGrid {
  + products: Product[]
  + renderProducts()
}

features/cart/components/CartItem.tsx
function CartItem {
  + item: CartItemModel
  + onUpdateQuantity(quantity)
  + onRemove()
}

features/checkout/components/CheckoutForm.tsx
function CheckoutForm {
  + recipientName: string
  + recipientPhone: string
  + shippingAddress: string
  + onSubmit(data)
}

features/orders/components/OrderCard.tsx
function OrderCard {
  + order: Order
  + onViewDetails()
  + onCancel()
}
```

Tạo các API module:

```
features/catalog/api/catalogApi.ts
  + getProducts(query, page, size)
  + getProductById(id)

features/cart/api/cartApi.ts
  + getCart()
  + updateItem(productId, quantity)
  + removeItem(productId)
  + clearCart()

features/orders/api/orderApi.ts
  + checkout(data, idempotencyKey)
  + getMyOrders()
  + getOrderById(id)
  + cancelOrder(id)
```

Thành viên 3 dùng HTTP client và cơ chế đăng nhập do thành viên 4 xây dựng.

## Thành viên 4(Duy Anh) – Frontend quản trị và tích hợp hệ thống (11, 12)

Thư mục gốc: `frontend/src/`

Tạo các file nền tảng:

```
lib/http/client.ts
class ApiClient {
  - baseUrl: string
  + get(url): Promise<T>
  + post(url, data, options): Promise<T>
  + put(url, data): Promise<T>
  + patch(url, data): Promise<T>
  + delete(url): Promise<void>
}

features/auth/services/AuthService.ts
class AuthService {
  + login(email, password): Promise<AuthResult>
  + register(data): Promise<AuthResult>
  + logout(): void
  + getCurrentUser(): Promise<User>
}

features/auth/context/AuthContext.tsx
function AuthProvider {
  + user: User | null
  + isAuthenticated: boolean
  + login(credentials)
  + logout()
}

components/layout/Header.tsx
function Header {
  + renderNavigation()
  + renderUserMenu()
}

components/layout/Sidebar.tsx
function Sidebar {
  + items: MenuItem[]
  + renderMenu()
}

app/layout.tsx
function RootLayout {
  + renderProviders()
  + renderLayout()
}

app/providers.tsx
function Providers {
  + renderQueryClient()
  + renderAuthProvider()
}
```

Tạo giao diện quản trị:

```
app/admin/page.tsx
function AdminDashboard {
  + renderStatistics()
  + renderRecentOrders()
}

app/admin/products/page.tsx
function AdminProductsPage {
  + renderProducts()
  + handleCreate()
  + handleUpdate()
  + handleDelete()
}

app/admin/inventory/page.tsx
function InventoryPage {
  + renderInventory()
  + handleAdjustment()
  + renderMovementHistory()
}

app/admin/orders/page.tsx
function AdminOrdersPage {
  + renderOrders()
  + handleFilter(status)
  + handleUpdateStatus(orderId, status)
}

features/admin/components/ProductForm.tsx
function ProductForm {
  + product: Product | null
  + onSubmit(data)
  + validate()
}

features/admin/components/StockAdjustmentForm.tsx
function StockAdjustmentForm {
  + productId: number
  + quantityChange: number
  + note: string
  + onSubmit()
}

features/admin/components/OrderStatusSelect.tsx
function OrderStatusSelect {
  + currentStatus: OrderStatus
  + onChange(status)
}

features/admin/api/adminApi.ts
class AdminApi {
  + createProduct(data)
  + updateProduct(id, data)
  + deleteProduct(id)
  + getInventory(productId)
  + adjustInventory(productId, data)
  + getOrders(filters)
  + updateOrderStatus(id, status)
}
```

Tạo thêm:

- `frontend/package.json`
- `frontend/tsconfig.json`
- `frontend/next.config.ts`
- `frontend/.env.example`
- `frontend/src/lib/types/models.ts`
- `frontend/src/lib/types/api.ts`
- `frontend/src/components/ui/` – Các component giao diện dùng chung.
