const db = require('../config/db');


/* Lấy toàn bộ dịch vụ, mới nhất lên đầu */
exports.getAll = async () => {
    const [rows] = await db.query('SELECT * FROM services ORDER BY id DESC');
    return rows;
};


/* Lấy 1 dịch vụ theo id */
/* Lấy một số dịch vụ mới nhất để hiển thị ở trang chủ */
exports.getLatest = async (limit = 4) => {
    // Giới hạn số lượng trong khoảng an toàn trước khi ghép vào câu SQL.
    const safeLimit = Math.max(1, Math.min(20, Number.parseInt(limit, 10) || 4));
    const [rows] = await db.query(
        `SELECT * FROM services ORDER BY id DESC LIMIT ${safeLimit}`
    );
    return rows;
};


exports.getById = async (id) => {
    const [rows] = await db.query(
        'SELECT * FROM services WHERE id = ?',
        [id]
    );

    return rows[0];
};


/* Tạo dịch vụ mới (dùng ở trang admin) */
exports.create = async (data) => {
    return db.query(
        'INSERT INTO services(name, description, price, image) VALUES(?, ?, ?, ?)',
        [data.name, data.description, data.price || 0, data.image || '']
    );
};


/* Cập nhật dịch vụ theo id */
exports.update = async (id, data) => {
    return db.query(
        'UPDATE services SET name = ?, description = ?, price = ?, image = ? WHERE id = ?',
        [data.name, data.description, data.price || 0, data.image || '', id]
    );
};


/* Xóa dịch vụ theo id */
exports.remove = async (id) => {
    return db.query('DELETE FROM services WHERE id = ?', [id]);
};
