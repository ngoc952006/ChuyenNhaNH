const db = require('../config/db');


/* Tạo đơn hàng + các dịch vụ trong đơn (dùng transaction để đảm bảo toàn vẹn dữ liệu) */
exports.create = async ({ userId, total, fromAddress, toAddress, phone, moveDate, note = '', items = [] }) => {
    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        const [order] = await connection.query(
            `INSERT INTO orders(user_id, total, from_address, to_address, phone, move_date, note, status)
             VALUES(?, ?, ?, ?, ?, ?, ?, ?)`,
            [userId, total, fromAddress, toAddress, phone, moveDate, note, 'pending']
        );

        for (const item of items) {
            await connection.query(
                'INSERT INTO order_items(order_id, service_id, quantity, price) VALUES(?, ?, ?, ?)',
                [order.insertId, item.id, item.quantity, item.price]
            );
        }

        await connection.commit();
        return order.insertId;
    } catch (e) {
        // Nếu một bước ghi đơn hoặc chi tiết đơn thất bại, hoàn tác toàn bộ giao dịch.
        await connection.rollback();
        throw e;
    } finally {
        connection.release();
    }
};


/* Lấy danh sách đơn hàng của 1 người dùng, kèm chi tiết từng dịch vụ trong đơn */
const getItems = async (orderIds) => {
    if (!orderIds.length) return [];
    const placeholders = orderIds.map(() => '?').join(', ');
    const [items] = await db.query(
        `SELECT oi.order_id, oi.quantity, oi.price, s.name
         FROM order_items oi
         JOIN services s ON s.id = oi.service_id
         WHERE oi.order_id IN (${placeholders})
         ORDER BY oi.order_id, oi.id`,
        orderIds
    );
    return items;
};


exports.getByUser = async (userId) => {
    const [orders] = await db.query(
        'SELECT * FROM orders WHERE user_id = ? ORDER BY id DESC',
        [userId]
    );
    const items = await getItems(orders.map(order => order.id));
    const itemsByOrder = new Map();
    for (const item of items) {
        if (!itemsByOrder.has(item.order_id)) itemsByOrder.set(item.order_id, []);
        itemsByOrder.get(item.order_id).push(item);
    }
    return orders.map(order => ({
        ...order,
        items: itemsByOrder.get(order.id) || []
    }));
};


/* [ADMIN] Lấy toàn bộ đơn hàng của mọi khách, kèm tên/email khách để hiển thị bảng quản lý
   Có thể truyền thêm `search` để lọc theo tên khách hàng đã đăng ký (LIKE, không phân biệt hoa/thường) */
exports.getAll = async (search) => {
    let sql = `SELECT o.*, u.name AS customer_name, u.email AS customer_email
               FROM orders o
               JOIN users u ON u.id = o.user_id`;

    const params = [];

    if (search && search.trim()) {
        sql += ' WHERE u.name LIKE ?';
        params.push(`%${search.trim()}%`);
    }

    sql += ' ORDER BY o.id DESC';

    const [orders] = await db.query(sql, params);
    return orders;
};


/* [ADMIN] Lấy chi tiết 1 đơn hàng theo id, kèm thông tin khách và danh sách dịch vụ trong đơn */
exports.getById = async (id) => {
    const [orders] = await db.query(
        `SELECT o.*, u.name AS customer_name, u.email AS customer_email
         FROM orders o
         JOIN users u ON u.id = o.user_id
         WHERE o.id = ?`,
        [id]
    );

    const order = orders[0];

    if (!order) {
        return null;
    }

    const items = await getItems([order.id]);
    order.items = items;
    return order;
};


/* [ADMIN] Cập nhật trạng thái đơn hàng: pending | confirmed | completed | cancelled */
exports.updateStatus = async (id, status) => {
    const allowedStatuses = ['pending', 'confirmed', 'completed', 'cancelled'];
    if (!allowedStatuses.includes(status)) {
        const error = new Error('Trạng thái đơn hàng không hợp lệ');
        error.status = 400;
        throw error;
    }
    return db.query(
        'UPDATE orders SET status = ? WHERE id = ?',
        [status, id]
    );
};


/* Xóa đơn hàng theo id (order_items sẽ tự xóa theo nhờ ON DELETE CASCADE) */
exports.remove = async (id) => {
    return db.query('DELETE FROM orders WHERE id = ?', [id]);
};
