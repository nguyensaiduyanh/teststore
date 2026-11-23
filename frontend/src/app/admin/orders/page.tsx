"use client";

import { useEffect, useState } from "react";

import { Order, OrderStatus } from "@/lib/types/models";
import adminApi from "@/features/admin/api/adminApi";
import OrderStatusSelect from "@/features/admin/components/OrderStatusSelect";

const PAGE_SIZE = 10;

const STATUS_LABELS: Record<OrderStatus, string> = {
    PENDING: "Chờ xác nhận",
    CONFIRMED: "Đã xác nhận",
    SHIPPING: "Đang giao",
    COMPLETED: "Hoàn thành",
    CANCELLED: "Đã hủy"
};

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);

    // Filter
    const [selectedStatus, setSelectedStatus] = useState<
        OrderStatus | ""
    >("");
    const [searchCode, setSearchCode] = useState<string>("");

    // Pagination
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [hasMore, setHasMore] = useState<boolean>(false);

    // Loading and error
    const [isLoadingOrders, setIsLoadingOrders] = useState<boolean>(true);
    const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
    const [orderError, setOrderError] = useState<string | null>(null);

    // Updating status
    const [updatingOrderId, setUpdatingOrderId] = useState<number | null>(
        null
    );

    // Load orders
    const loadOrders = async (
        status: OrderStatus | "" = selectedStatus,
        code: string = searchCode
    ) => {
        setIsLoadingOrders(true);
        setOrderError(null);

        try {
            const result = await adminApi.getOrders({
                status: status || undefined,
                code: code.trim() || undefined,
                page: 0,
                size: PAGE_SIZE
            });

            setOrders(result.items);
            setCurrentPage(result.page + 1);
            setHasMore(result.page + 1 < result.totalPages);

        } catch (error) {
            console.error("Lỗi tải danh sách đơn hàng:", error);
            setOrderError("Không thể tải danh sách đơn hàng.");
            setOrders([]);
            setHasMore(false);

        } finally {
            setIsLoadingOrders(false);
        }
    };

    // Initial load
    useEffect(() => {
        loadOrders("", "");
    }, []);

    // Filter by status
    const handleFilter = (status: OrderStatus | "") => {
        setSelectedStatus(status);
        loadOrders(status, searchCode);
    };

    // Search by order code
    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        loadOrders(selectedStatus, searchCode);
    };

    // Load next page
    const loadMoreOrders = async () => {
        if (isLoadingMore || !hasMore) {
            return;
        }

        setIsLoadingMore(true);
        setOrderError(null);

        try {
            const result = await adminApi.getOrders({
                status: selectedStatus || undefined,
                code: searchCode.trim() || undefined,
                page: currentPage,
                size: PAGE_SIZE
            });

            setOrders((prev) => [
                ...prev,
                ...result.items
            ]);

            setCurrentPage(result.page + 1);
            setHasMore(result.page + 1 < result.totalPages);

        } catch (error) {
            console.error("Lỗi tải thêm đơn hàng:", error);
            setOrderError("Không thể tải thêm đơn hàng.");

        } finally {
            setIsLoadingMore(false);
        }
    };

    // Update order status
    const handleUpdateStatus = async (
        orderId: number,
        status: OrderStatus
    ) => {
        const confirmed = confirm(
            `Bạn có chắc muốn chuyển trạng thái đơn hàng sang "${STATUS_LABELS[status]}" không?`
        );

        if (!confirmed) {
            return;
        }

        setUpdatingOrderId(orderId);

        try {
            const updatedOrder = await adminApi.updateOrderStatus(
                orderId,
                status
            );

            setOrders((prev) =>
                prev.map((order) =>
                    order.id === orderId
                        ? { ...order, ...updatedOrder }
                        : order
                )
            );

        } catch (error) {
            console.error("Lỗi cập nhật trạng thái đơn hàng:", error);
            alert("Không thể cập nhật trạng thái đơn hàng.");

        } finally {
            setUpdatingOrderId(null);
        }
    };

    // Format currency
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND"
        }).format(amount);
    };

    // Format date
    const formatDate = (date: string) => {
        return new Date(date).toLocaleString("vi-VN");
    };

    return (
        <div className="admin-orders-page">
            <h1>Quản lý đơn hàng</h1>

            {/* Search and filter */}
            <form
                className="orders-filter"
                onSubmit={handleSearch}
            >
                <div className="orders-search">
                    <input
                        type="text"
                        value={searchCode}
                        onChange={(e) => setSearchCode(e.target.value)}
                        placeholder="Nhập mã đơn hàng..."
                        maxLength={32}
                    />

                    <button type="submit">
                        Tìm kiếm
                    </button>
                </div>

                <div className="orders-status-filter">
                    <label htmlFor="orderStatusFilter">
                        Lọc theo trạng thái
                    </label>

                    <select
                        id="orderStatusFilter"
                        value={selectedStatus}
                        onChange={(e) =>
                            handleFilter(e.target.value as OrderStatus | "")
                        }
                    >
                        <option value="">Tất cả trạng thái</option>

                        {Object.entries(STATUS_LABELS).map(
                            ([status, label]) => (
                                <option key={status} value={status}>
                                    {label}
                                </option>
                            )
                        )}
                    </select>
                </div>
            </form>

            {/* Order list */}
            {isLoadingOrders ? (
                <p className="orders-message">
                    Đang tải danh sách đơn hàng...
                </p>
            ) : orderError && orders.length === 0 ? (
                <p className="orders-error">
                    {orderError}
                </p>
            ) : orders.length === 0 ? (
                <p className="orders-empty">
                    Không tìm thấy đơn hàng nào.
                </p>
            ) : (
                <>
                    <div className="orders-list">
                        {orders.map((order) => (
                            <div
                                className="order-card"
                                key={order.id}
                            >
                                <div className="order-card-header">
                                    <div>
                                        <h3>{order.orderCode}</h3>
                                        <p>
                                            Ngày đặt: {formatDate(order.createdAt)}
                                        </p>
                                    </div>

                                    <span
                                        className={`order-status order-status-${order.status.toLowerCase()}`}
                                    >
                                        {STATUS_LABELS[order.status]}
                                    </span>
                                </div>

                                <div className="order-information">
                                    <p>
                                        <strong>Người nhận:</strong>{" "}
                                        {order.recipientName}
                                    </p>

                                    <p>
                                        <strong>Số điện thoại:</strong>{" "}
                                        {order.recipientPhone}
                                    </p>

                                    <p>
                                        <strong>Địa chỉ:</strong>{" "}
                                        {order.shippingAddress}
                                    </p>

                                    <p>
                                        <strong>Tổng tiền:</strong>{" "}
                                        <span className="order-total">
                                            {formatCurrency(order.totalAmount)}
                                        </span>
                                    </p>
                                </div>

                                <div className="order-items">
                                    <h4>Sản phẩm trong đơn</h4>

                                    {order.items.map((item) => (
                                        <div
                                            className="order-item"
                                            key={item.id}
                                        >
                                            <span>{item.productName}</span>

                                            <span>
                                                {item.quantity} x{" "}
                                                {formatCurrency(item.unitPrice)}
                                            </span>

                                            <strong>
                                                {formatCurrency(item.lineTotal)}
                                            </strong>
                                        </div>
                                    ))}
                                </div>

                                <div className="order-card-footer">
                                    <div className="order-status-control">
                                        <label>
                                            Cập nhật trạng thái
                                        </label>

                                        <OrderStatusSelect
                                            currentStatus={order.status}
                                            disabled={updatingOrderId === order.id}
                                            onChange={(status) =>
                                                handleUpdateStatus(
                                                    order.id,
                                                    status
                                                )
                                            }
                                        />
                                    </div>

                                    {updatingOrderId === order.id && (
                                        <span className="order-updating">
                                            Đang cập nhật...
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {orderError && (
                        <p className="orders-error">
                            {orderError}
                        </p>
                    )}

                    {hasMore && (
                        <button
                            className="orders-load-more"
                            onClick={loadMoreOrders}
                            disabled={isLoadingMore}
                        >
                            {isLoadingMore
                                ? "Đang tải..."
                                : "Xem thêm"}
                        </button>
                    )}
                </>
            )}
        </div>
    );
}
