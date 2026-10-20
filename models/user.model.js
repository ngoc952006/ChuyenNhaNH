const db = require('../config/db');


/* Tìm người dùng theo email (dùng khi đăng nhập) */
exports.findByEmail = async (email) => {
    const [rows] = await db.query(
        'SELECT * FROM users WHERE email = ?',
        [email]
    );

    return rows[0];
};


/* Tạo tài khoản mới (mật khẩu truyền vào phải đã được hash) */
exports.create = async (name, email, hashedPassword) => {
    return db.query(
        'INSERT INTO users(name, email, password, role) VALUES(?, ?, ?, ?)',
        [name, email, hashedPassword, 'user']
    );
};
