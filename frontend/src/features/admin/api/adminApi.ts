import {
    AdjustmentRequest,
    CreateProductRequest, OrderResponse,
    PagedOrders, PagedProducts, ProductResponse,
    UpdateProductRequest,
    UpdateStockRequest
} from "@/lib/types/api";
import http from "@/lib/http/client";
import {InventoryMovement, OrderStatus} from "@/lib/types/models";

interface OrderSearchFilter {
    status?: OrderStatus;
    code?: string;
    page?: number;
    size?: number;
}

class AdminApi {
     createProduct(data: CreateProductRequest) {
        return  http.post<ProductResponse>("/api/products", data);
    }

    updateProduct(id:number, data: UpdateProductRequest) {
         return  http.put<ProductResponse>("/api/products/" + id, data);
    }

    updateProductStock(id:number, data: UpdateStockRequest) {
        return  http.patch<ProductResponse>("/api/products/" + id + "/stock", data);
    }

    deleteProduct(id:number) {
         return  http.delete("/api/products/" + id);
    }
    getProducts(page: number = 0, size: number = 10) {
        const params = new URLSearchParams();

        params.set("page", String(page));
        params.set("size", String(size));

        return http.get<PagedProducts>(
            "/api/products?" + params.toString()
        );
    }

    getInventory(productId: number) {
         return  http.get<InventoryMovement[]>("/api/admin/products/"+productId+"/inventory");
    }

    adjustInventory(productId: number, data: AdjustmentRequest) {
        return http.post<InventoryMovement>("/api/admin/products/"+ productId +"/inventory/adjustments", data);
    }

    getOrders(filters: OrderSearchFilter) {
        const params = new URLSearchParams();

        if (filters.status) {
            params.set("status", filters.status);
        }

        if (filters.code) {
            params.set("code", filters.code);
        }

        if (filters.page !== undefined) {
            params.set("page", String(filters.page));
        }

        if (filters.size !== undefined) {
            params.set("size", String(filters.size));
        }

        const query = params.toString();

        return http.get<PagedOrders>(
            "/api/admin/orders/search" + (query ? "?" + query : "")
        );
    }

    updateOrderStatus(id: number, status: OrderStatus) {
        return  http.patch<OrderResponse>("/api/admin/orders/" + id + "/status", {status});
    }




}
const adminApi = new AdminApi();

export default adminApi;