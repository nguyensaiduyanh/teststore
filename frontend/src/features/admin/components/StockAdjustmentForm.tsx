"use client";

import { useState } from "react";
import { AdjustmentRequest } from "@/lib/types/api";

interface StockAdjustmentFormProps {
    productId: number;
    onSubmit: (data: AdjustmentRequest) => void;
}

export default function StockAdjustmentForm({
                                                productId,
                                                onSubmit
                                            }: StockAdjustmentFormProps) {
    const [quantityChange, setQuantityChange] = useState<string>("");
    const [note, setNote] = useState<string>("");

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (quantityChange.trim() === "") {
            alert("Vui lòng nhập số lượng thay đổi!");
            return;
        }

        const parsedQuantityChange = Number(quantityChange);

        if (!Number.isInteger(parsedQuantityChange)) {
            alert("Số lượng thay đổi phải là số nguyên!");
            return;
        }

        if (parsedQuantityChange === 0) {
            alert("Số lượng thay đổi phải khác 0!");
            return;
        }

        const data: AdjustmentRequest = {
            quantityChange: parsedQuantityChange,
            note: note.trim()
        };

        onSubmit(data);
    };

    return (
        <form className="stock-adjustment-form" onSubmit={handleSubmit}>
            <input
                type="hidden"
                name="productId"
                value={productId}
            />

            <div className="stock-adjustment-field">
                <label htmlFor="quantityChange">
                    Số lượng thay đổi
                </label>

                <input
                    id="quantityChange"
                    type="number"
                    step="1"
                    value={quantityChange}
                    onChange={(e) => setQuantityChange(e.target.value)}
                    required
                />
            </div>

            <div className="stock-adjustment-field">
                <label htmlFor="note">Ghi chú</label>

                <textarea
                    id="note"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                />
            </div>

            <button
                className="stock-adjustment-button"
                type="submit"
            >
                Điều chỉnh tồn kho
            </button>
        </form>
    );
}
