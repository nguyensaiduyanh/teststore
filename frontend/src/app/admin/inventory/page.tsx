
"use client";

import { useEffect, useState } from "react";

import adminApi from "@/features/admin/api/adminApi";
import StockAdjustmentForm from "@/features/admin/components/StockAdjustmentForm";

import { AdjustmentRequest } from "@/lib/types/api";
import { Product, InventoryMovement } from "@/lib/types/models";

export default function InventoryPage() {
    // Danh sách sản phẩm
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoadingProducts, setIsLoadingProducts] = useState<boolean>(true);
    const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
    const [productError, setProductError] = useState<string | null>(null);

    // Sản phẩm đang được chọn
    const [selectedProductId, setSelectedProductId] = useState<string>("");

    // Phân trang sản phẩm
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [hasMore, setHasMore] = useState<boolean>(true);

    // Lịch sử tồn kho
    const [movements, setMovements] = useState<InventoryMovement[]>([]);
    const [isLoadingMovements, setIsLoadingMovements] = useState<boolean>(false);
    const [movementError, setMovementError] = useState<string | null>(null);

    // Trạng thái điều chỉnh tồn kho
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    // Tải danh sách sản phẩm lần đầu
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setIsLoadingProducts(true);
                setProductError(null);

                const response = await adminApi.getProducts(0, 10);

                setProducts(response.items);
                setCurrentPage(response.page + 1);
                setHasMore(response.page + 1 < response.totalPages);

            } catch (error) {
                console.error("Lỗi khi tải danh sách sản phẩm:", error);
                setProductError("Không thể tải danh sách sản phẩm.");
            } finally {
                setIsLoadingProducts(false);
            }
        };

        fetchProducts();
    }, []);

    // Tải thêm sản phẩm
    const loadMoreProducts = async () => {
        if (isLoadingMore || !hasMore) {
            return;
        }

        try {
            setIsLoadingMore(true);
            setProductError(null);

            const response = await adminApi.getProducts(currentPage, 10);

            setProducts((prevProducts) => [
                ...prevProducts,
                ...response.items
            ]);

            setCurrentPage(response.page + 1);
            setHasMore(response.page + 1 < response.totalPages);

        } catch (error) {
            console.error("Lỗi khi tải thêm sản phẩm:", error);
            setProductError("Không thể tải thêm sản phẩm.");
        } finally {
            setIsLoadingMore(false);
        }
    };

    // Tìm sản phẩm đang được chọn
    const selectedProduct = products.find(
        (product) => product.id === Number(selectedProductId)
    );

    // Tải lịch sử tồn kho khi thay đổi sản phẩm
    useEffect(() => {
        if (!selectedProductId) {
            setMovements([]);
            setMovementError(null);
            return;
        }

        const fetchMovementHistory = async () => {
            try {
                setIsLoadingMovements(true);
                setMovementError(null);

                const response = await adminApi.getInventory(
                    Number(selectedProductId)
                );

                setMovements(response);

            } catch (error) {
                console.error("Lỗi khi tải lịch sử tồn kho:", error);
                setMovementError("Không thể tải lịch sử tồn kho.");
            } finally {
                setIsLoadingMovements(false);
            }
        };

        fetchMovementHistory();
    }, [selectedProductId]);

    // Xử lý điều chỉnh tồn kho
    const handleAdjustment = async (data: AdjustmentRequest) => {
        if (!selectedProductId) {
            alert("Vui lòng chọn sản phẩm!");
            return;
        }

        try {
            setIsSubmitting(true);

            const productId = Number(selectedProductId);

            const newMovement = await adminApi.adjustInventory(
                productId,
                data
            );

            // Cập nhật số lượng tồn kho của sản phẩm
            setProducts((prevProducts) =>
                prevProducts.map((product) =>
                    product.id === productId
                        ? {
                            ...product,
                            stockQuantity: newMovement.stockAfter
                        }
                        : product
                )
            );

            // Cập nhật lịch sử tồn kho
            setMovements((prevMovements) => [
                ...prevMovements,
                newMovement
            ]);

            alert("Điều chỉnh tồn kho thành công!");

        } catch (error) {
            console.error("Lỗi khi điều chỉnh tồn kho:", error);
            alert("Không thể điều chỉnh tồn kho. Vui lòng thử lại!");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Hiển thị danh sách sản phẩm
    const renderInventory = () => {
        if (isLoadingProducts) {
            return <p>Đang tải danh sách sản phẩm...</p>;
        }

        if (productError && products.length === 0) {
            return <p>{productError}</p>;
        }

        return (
            <>
                <div className="inventory-product-select">
                    <label htmlFor="product">
                        Chọn sản phẩm
                    </label>

                    <select
                        id="product"
                        value={selectedProductId}
                        onChange={(e) => setSelectedProductId(e.target.value)}
                    >
                        <option value="">
                            -- Chọn sản phẩm --
                        </option>

                        {products.map((product) => (
                            <option
                                key={product.id}
                                value={product.id}
                            >
                                {product.name} ({product.sku})
                            </option>
                        ))}
                    </select>

                    {hasMore && (
                        <button
                            type="button"
                            onClick={loadMoreProducts}
                            disabled={isLoadingMore}
                        >
                            {isLoadingMore ? "Đang tải..." : "Xem thêm"}
                        </button>
                    )}
                </div>

                {productError && (
                    <p>{productError}</p>
                )}

                {selectedProduct && (
                    <div className="inventory-product-info">
                        <h2>{selectedProduct.name}</h2>
                        <p>SKU: {selectedProduct.sku}</p>
                        <p>
                            Số lượng tồn kho: {selectedProduct.stockQuantity}
                        </p>
                    </div>
                )}

                {products.length === 0 && (
                    <p>Chưa có sản phẩm nào.</p>
                )}
            </>
        );
    };

    // Hiển thị lịch sử nhập/xuất/điều chỉnh
    const renderMovementHistory = () => {
        if (!selectedProductId) {
            return <p>Vui lòng chọn sản phẩm để xem lịch sử tồn kho.</p>;
        }

        if (isLoadingMovements) {
            return <p>Đang tải lịch sử tồn kho...</p>;
        }

        if (movementError) {
            return <p>{movementError}</p>;
        }

        if (movements.length === 0) {
            return <p>Sản phẩm chưa có lịch sử tồn kho.</p>;
        }

        return (
            <div className="inventory-history">
                <h2>Lịch sử tồn kho</h2>

                <table>
                    <thead>
                    <tr>
                        <th>Thời gian</th>
                        <th>Loại giao dịch</th>
                        <th>Thay đổi</th>
                        <th>Tồn trước</th>
                        <th>Tồn sau</th>
                        <th>Ghi chú</th>
                    </tr>
                    </thead>

                    <tbody>
                    {movements.map((movement) => (
                        <tr key={movement.id}>
                            <td>
                                {movement.createdAt.replace("T", " ")}
                            </td>

                            <td>{movement.type}</td>

                            <td>
                                {movement.quantityChange > 0
                                    ? `+${movement.quantityChange}`
                                    : movement.quantityChange}
                            </td>

                            <td>{movement.stockBefore}</td>

                            <td>{movement.stockAfter}</td>

                            <td>{movement.note || "Không có"}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <div className="admin-inventory-page">
            <h1>Quản lý tồn kho</h1>

            {renderInventory()}

            {selectedProduct && (
                <>
                    <section className="inventory-adjustment">
                        <h2>Điều chỉnh tồn kho</h2>

                        <StockAdjustmentForm
                            productId={selectedProduct.id}
                            onSubmit={handleAdjustment}
                        />

                        {isSubmitting && (
                            <p>Đang xử lý điều chỉnh tồn kho...</p>
                        )}
                    </section>

                    <section className="inventory-movement-history">
                        {renderMovementHistory()}
                    </section>
                </>
            )}
        </div>
    );
}
