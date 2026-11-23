
"use client";

import { Product } from "@/lib/types/models";
import {
    CreateProductRequest,
    UpdateProductRequest
} from "@/lib/types/api";
import { useState, FormEvent } from "react";

interface ProductFormProps {
    product: Product | null;
    onSubmit: (
        data: CreateProductRequest | UpdateProductRequest
    ) => void;
    onClose: () => void;
}

export default function ProductForm({
                                        product,
                                        onSubmit,
                                        onClose
                                    }: ProductFormProps) {
    const [sku, setSku] = useState<string>(product?.sku ?? "");
    const [name, setName] = useState<string>(product?.name ?? "");
    const [description, setDescription] = useState<string>(
        product?.description ?? ""
    );
    const [price, setPrice] = useState<string>(
        product?.price?.toString() ?? ""
    );
    const [stockQuantity, setStockQuantity] = useState<string>(
        product?.stockQuantity?.toString() ?? ""
    );

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const parsedPrice = Number(price);
        const parsedStockQuantity = Number(stockQuantity);

        if (!name.trim()) {
            alert("Tên sản phẩm không được để trống");
            return;
        }

        if (product === null && !sku.trim()) {
            alert("SKU không được để trống");
            return;
        }

        if (
            price.trim() === "" ||
            !Number.isFinite(parsedPrice) ||
            parsedPrice < 0.01 ||
            parsedPrice > 9999999999999.99
        ) {
            alert("Giá phải từ 0.01 đến 9999999999999.99 và tối đa 2 chữ số thập phân");
            return;
        }

        const decimalPart = price.split(".")[1];

        if (decimalPart && decimalPart.length > 2) {
            alert("Giá chỉ được có tối đa 2 chữ số thập phân");
            return;
        }

        if (
            stockQuantity.trim() === "" ||
            !Number.isInteger(parsedStockQuantity) ||
            parsedStockQuantity < 0
        ) {
            alert("Số lượng sản phẩm phải là số nguyên không âm");
            return;
        }

        if (description.trim().length > 1000) {
            alert("Mô tả không được vượt quá 1000 ký tự");
            return;
        }

        if (sku.trim().length > 64 && product === null) {
            alert("SKU không được vượt quá 64 ký tự");
            return;
        }

        if (name.trim().length > 160) {
            alert("Tên sản phẩm không được vượt quá 160 ký tự");
            return;
        }

        if (product === null) {
            const data: CreateProductRequest = {
                sku: sku.trim(),
                name: name.trim(),
                description: description.trim() || null,
                price: parsedPrice,
                stockQuantity: parsedStockQuantity
            };

            onSubmit(data);
        } else {
            const data: UpdateProductRequest = {
                name: name.trim(),
                description: description.trim() || null,
                price: parsedPrice,
                stockQuantity: parsedStockQuantity
            };

            onSubmit(data);
        }
    };

    return (
        <div
            className="product-modal-overlay"
            onClick={onClose}
        >
            <div
                className="product-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="product-modal-title"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="product-modal-header">
                    <div>
                        <h2 id="product-modal-title">
                            {product === null
                                ? "Thêm sản phẩm mới"
                                : "Cập nhật sản phẩm"}
                        </h2>
                        <p>
                            {product === null
                                ? "Nhập thông tin để tạo sản phẩm mới"
                                : "Chỉnh sửa thông tin sản phẩm"}
                        </p>
                    </div>

                    <button
                        type="button"
                        className="product-modal-close"
                        onClick={onClose}
                        aria-label="Đóng"
                    >
                        &times;
                    </button>
                </div>

                <form
                    className="product-form"
                    onSubmit={handleSubmit}
                >
                    {product === null && (
                        <div className="product-form-group">
                            <label htmlFor="sku">SKU</label>
                            <input
                                id="sku"
                                type="text"
                                value={sku}
                                onChange={(e) => setSku(e.target.value)}
                                placeholder="Nhập SKU sản phẩm"
                                maxLength={64}
                                required
                            />
                        </div>
                    )}

                    <div className="product-form-group">
                        <label htmlFor="name">Tên sản phẩm</label>
                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Nhập tên sản phẩm"
                            maxLength={160}
                            required
                        />
                    </div>

                    <div className="product-form-group">
                        <label htmlFor="description">Mô tả</label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Nhập mô tả sản phẩm"
                            maxLength={1000}
                        />
                    </div>

                    <div className="product-form-row">
                        <div className="product-form-group">
                            <label htmlFor="price">Giá sản phẩm</label>
                            <input
                                id="price"
                                type="number"
                                min="0.01"
                                max="9999999999999.99"
                                step="0.01"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                placeholder="Nhập giá sản phẩm"
                                required
                            />
                        </div>

                        <div className="product-form-group">
                            <label htmlFor="stockQuantity">Số lượng</label>
                            <input
                                id="stockQuantity"
                                type="number"
                                min="0"
                                step="1"
                                value={stockQuantity}
                                onChange={(e) => setStockQuantity(e.target.value)}
                                placeholder="Nhập số lượng"
                                required
                            />
                        </div>
                    </div>

                    <div className="product-form-actions">
                        <button
                            type="button"
                            className="product-form-cancel"
                            onClick={onClose}
                        >
                            Hủy
                        </button>

                        <button
                            type="submit"
                            className="product-form-submit"
                        >
                            {product === null
                                ? "Tạo sản phẩm"
                                : "Cập nhật sản phẩm"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
