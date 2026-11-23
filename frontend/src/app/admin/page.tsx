"use client";

import { useEffect, useState } from "react";
import http from "@/lib/http/client";
import adminApi from "@/features/admin/api/adminApi";


interface OrderResponse {
    id: number;
    orderCode: string;
    recipientName: string;
    recipientPhone: string;
    shippingAddress: string;
    status: string;
    totalAmount: number;
    createdAt: string;
    updatedAt: string;
}

interface PagedOrders {
    items: OrderResponse[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
}

export default function AdminDashboard() {
    const [orders, setOrders] = useState<OrderResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchRecentOrders() {
            try {
                setIsLoading(true);
                setError(null);

                const response = await adminApi.getOrders({
                    page: 0,
                    size: 5,
                });

                setOrders(response.items);
            } catch (err) {
                setError(
                    err instanceof Error
                        ? err.message
                        : "Không thể tải danh sách đơn hàng"
                );
            } finally {
                setIsLoading(false);
            }
        }

        fetchRecentOrders();
    }, []);

    function renderStatistics() {
        return (
            <section className="dashboardSection">
                <h2 className="sectionTitle">Thống kê</h2>

                <div className="statisticsGrid">
                    <div className="statisticsCard">
                        <h3>Tổng sản phẩm</h3>
                        <p>--</p>
                    </div>

                    <div className="statisticsCard">
                        <h3>Tổng đơn hàng</h3>
                        <p>--</p>
                    </div>

                    <div className="statisticsCard">
                        <h3>Doanh thu</h3>
                        <p>--</p>
                    </div>

                    <div className="statisticsCard">
                        <h3>Đơn chờ xử lý</h3>
                        <p>--</p>
                    </div>
                </div>
            </section>
        );
    }

    function renderRecentOrders() {
        return (
            <section className="dashboardSection">
                <h2 className="sectionTitle">Đơn hàng gần đây</h2>

                <div className="recentOrdersTable">
                    <table>
                        <thead>
                        <tr>
                            <th>Mã đơn hàng</th>
                            <th>Người nhận</th>
                            <th>Ngày đặt</th>
                            <th>Tổng tiền</th>
                            <th>Trạng thái</th>
                        </tr>
                        </thead>

                        <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan={5}>Đang tải dữ liệu...</td>
                            </tr>
                        ) : error ? (
                            <tr>
                                <td colSpan={5}>{error}</td>
                            </tr>
                        ) : orders.length === 0 ? (
                            <tr>
                                <td colSpan={5}>
                                    Chưa có dữ liệu đơn hàng
                                </td>
                            </tr>
                        ) : (
                            orders.map((order) => (
                                <tr key={order.id}>
                                    <td>{order.orderCode}</td>
                                    <td>{order.recipientName}</td>
                                    <td>
                                        {new Date(
                                            order.createdAt
                                        ).toLocaleString("vi-VN")}
                                    </td>
                                    <td>
                                        {order.totalAmount.toLocaleString(
                                            "vi-VN"
                                        )}{" "}
                                        ₫
                                    </td>
                                    <td>{order.status}</td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>
            </section>
        );
    }

    return (
        <main className="adminDashboard">
            <h1 className="dashboardTitle">Admin Dashboard</h1>

            {renderStatistics()}
            {renderRecentOrders()}
        </main>
    );
}