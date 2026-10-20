// Các hàm dùng chung để tính toán thông tin giỏ hàng.
exports.calculateTotal = (items = []) => items.reduce(
    (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0),
    0
);

// Tính tổng số lượng dịch vụ trong giỏ hàng.
exports.getCartCount = (items = []) => items.reduce(
    (sum, item) => sum + Number(item.quantity || 0),
    0
);
