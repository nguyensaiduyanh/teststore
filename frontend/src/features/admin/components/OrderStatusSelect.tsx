
"use client";

import { OrderStatus } from "@/lib/types/models";

interface OrderStatusSelectProps {
    currentStatus: OrderStatus;
    onChange: (status: OrderStatus) => void;
    disabled?: boolean;
}

const statusLabels: Record<OrderStatus, string> = {
    PENDING: "Chờ xác nhận",
    CONFIRMED: "Đã xác nhận",
    SHIPPING: "Đang giao",
    COMPLETED: "Hoàn thành",
    CANCELLED: "Đã hủy"
};

const statusTransitions: Record<OrderStatus, OrderStatus[]> = {
    PENDING: ["CONFIRMED", "CANCELLED"],
    CONFIRMED: ["SHIPPING", "CANCELLED"],
    SHIPPING: ["COMPLETED"],
    COMPLETED: [],
    CANCELLED: []
};

export default function OrderStatusSelect({
                                              currentStatus,
                                              onChange,
                                              disabled = false,
                                          }: OrderStatusSelectProps) {
    const allowedStatuses = statusTransitions[currentStatus];

    return (
        <div className="order-status-control">
            <select
                className={`order-status-select status-${currentStatus.toLowerCase()}`}
                value={currentStatus}
                disabled={disabled || allowedStatuses.length === 0}
                onChange={(e) => {
                    onChange(e.target.value as OrderStatus);
                }}
            >
                <option value={currentStatus}>
                    {statusLabels[currentStatus]}
                </option>

                {allowedStatuses.map((status) => (
                    <option key={status} value={status}>
                        {statusLabels[status]}
                    </option>
                ))}
            </select>
        </div>
    );
}
