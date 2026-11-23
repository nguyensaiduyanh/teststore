
"use client";

import { Product } from "@/lib/types/models";
import ProductForm from "@/features/admin/components/ProductForm";
import { useEffect, useState } from "react";
import adminApi from "@/features/admin/api/adminApi";
import { getToken } from "@/lib/http/client";

export default function ProductsPage() {
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [isFormOpen, setIsFormOpen] = useState<boolean>(false);

    const [products, setProducts] = useState<Product[]>([]);

    // Pagination
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [hasMore, setHasMore] = useState<boolean>(false);

    // Loading and error
    const [isLoadingProducts, setIsLoadingProducts] = useState<boolean>(true);
    const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
    const [productError, setProductError] = useState<string | null>(null);

    const PAGE_SIZE = 10;

    // Load first page
    const loadProducts = async () => {
        setIsLoadingProducts(true);
        setProductError(null);

        try {
            const result = await adminApi.getProducts(0, PAGE_SIZE);

            setProducts(result.items);
            setCurrentPage(result.page + 1);
            setHasMore(result.page + 1 < result.totalPages);

        } catch (error) {
            console.error("Lỗi tải danh sách sản phẩm:", error);
            setProductError("Không thể tải danh sách sản phẩm.");
        } finally {
            setIsLoadingProducts(false);
        }
    };

    // Load next page
    const loadMoreProducts = async () => {
        if (isLoadingMore || !hasMore) {
            return;
        }

        setIsLoadingMore(true);
        setProductError(null);

        try {
            const result = await adminApi.getProducts(
                currentPage,
                PAGE_SIZE
            );

            setProducts((prev) => [
                ...prev,
                ...result.items
            ]);

            setCurrentPage(result.page + 1);
            setHasMore(result.page + 1 < result.totalPages);

        } catch (error) {
            console.error("Lỗi tải thêm sản phẩm:", error);
            setProductError("Không thể tải thêm sản phẩm.");
        } finally {
            setIsLoadingMore(false);
        }
    };

    useEffect(() => {
        loadProducts();
    }, []);

    const handleCreate = () => {
        console.log("Token hiện tại:", !!getToken());
        setSelectedProduct(null);
        setIsFormOpen(true);
    };

    const handleEdit = (product: Product) => {
        setSelectedProduct(product);
        setIsFormOpen(true);
    };

    const handleDelete = async (product: Product) => {
        const confirmed = confirm(
            `Bạn có chắc muốn ngừng kinh doanh sản phẩm "${product.name}" không?`
        );

        if (!confirmed) return;

        try {
            await adminApi.deleteProduct(product.id);
            await loadProducts();
        } catch (error) {
            console.error(error);
            alert("Không thể ngừng kinh doanh sản phẩm");
        }
    };

    return (
        <div className="admin-products-page">
            <h1>Quản lý sản phẩm</h1>

            <button
                className="products-create-button"
                onClick={handleCreate}
            >
                Thêm sản phẩm
            </button>

            {isLoadingProducts ? (
                <p>Đang tải danh sách sản phẩm...</p>
            ) : productError && products.length === 0 ? (
                <p>{productError}</p>
            ) : products.length === 0 ? (
                <p className="products-empty">
                    Chưa có sản phẩm nào.
                </p>
            ) : (
                <>
                    <div className="products-list">
                        {products.map((product) => (
                            <div
                                className="product-card"
                                key={product.id}
                            >
                                <h3>{product.name}</h3>

                                <p>SKU: {product.sku}</p>
                                <p>Giá: {product.price}</p>
                                <p>Tồn kho: {product.stockQuantity}</p>
                                <p>Trạng thái: {product.status}</p>

                                <div className="product-actions">
                                    <button
                                        className="product-edit-button"
                                        onClick={() => handleEdit(product)}
                                    >
                                        Sửa
                                    </button>

                                    <button
                                        className="product-delete-button"
                                        onClick={() => handleDelete(product)}
                                    >
                                        Ngừng kinh doanh
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {productError && (
                        <p>{productError}</p>
                    )}

                    {hasMore && (
                        <button
                            className="products-load-more"
                            onClick={loadMoreProducts}
                            disabled={isLoadingMore}
                        >
                            {isLoadingMore ? "Đang tải..." : "Xem thêm"}
                        </button>
                    )}
                </>
            )}

            {isFormOpen && (
                <ProductForm
                    product={selectedProduct}
                    onClose={() => {
                        setIsFormOpen(false);
                        setSelectedProduct(null);
                    }}
                    onSubmit={async (data) => {
                        try {
                            if ("sku" in data) {
                                await adminApi.createProduct(data);
                            } else {
                                if (selectedProduct === null) {
                                    return;
                                }

                                await adminApi.updateProduct(
                                    selectedProduct.id,
                                    data
                                );
                            }

                            await loadProducts();
                            setIsFormOpen(false);
                            setSelectedProduct(null);

                        } catch (error) {
                            console.error(error);
                            alert("Không thể lưu sản phẩm");
                        }
                    }}
                />
            )}
        </div>
    );
}
