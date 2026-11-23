package vn.edu.sales.domain.model;

import vn.edu.sales.domain.exception.IdempotencyConflictException;

import java.time.LocalDateTime;
import java.util.Objects;

public record IdempotencyRecord(
        Long userId,
        IdempotencyOperation operation,
        String requestKey,
        String requestHash,
        Long orderId,
        LocalDateTime createdAt
) {
    public IdempotencyRecord(Long userId, String requestKey, String requestHash, Long orderId, LocalDateTime createdAt) {
        this(userId, null, requestKey, requestHash, orderId, createdAt);
    }

    public void ensureSameRequest(String hash) {
        if (!Objects.equals(this.requestHash, hash)) {
            throw new IdempotencyConflictException(
                    "Idempotency conflict: Khóa request '" + requestKey + "' đã được sử dụng với dữ liệu khác."
            );
        }
    }
}
