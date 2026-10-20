CREATE DATABASE IF NOT EXISTS chuyen_nha_NH
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE chuyen_nha_NH;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE services (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    price DECIMAL(12, 0) DEFAULT 0,
    image VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    total DECIMAL(12, 0) NOT NULL,
    from_address VARCHAR(255) NOT NULL,
    to_address VARCHAR(255) NOT NULL,
    phone VARCHAR(30) NOT NULL,
    move_date DATE NOT NULL,
    note TEXT,
    status VARCHAR(30) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    service_id INT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(12, 0) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (service_id) REFERENCES services(id)
);

INSERT INTO users (name, email, password, role)
VALUES (
    'Admin',
    'admin@gmail.com',
    '$2b$10$ss5Cx1OruXIKOOt8wf7rVuumNwqAAKR5TimPaPCZVNwDHrtMqYHXO',
    'admin'
);

INSERT INTO services (name, description, price, image)
VALUES
(
    'Chuyển nhà trọn gói',
    'Đóng gói, vận chuyển và sắp xếp đồ đạc tận nơi. Phù hợp gia đình chuyển nhà.',
    1200000,
    ''
),
(
    'Chuyển phòng trọ',
    'Gói tiết kiệm cho sinh viên và người thuê trọ, xử lý nhanh trong ngày.',
    500000,
    ''
),
(
    'Chuyển văn phòng',
    'Vận chuyển bàn ghế, máy móc và hồ sơ an toàn, có phân loại.',
    2500000,
    ''
),
(
    'Đóng gói đồ đạc',
    'Đóng thùng, chống sốc và phân loại đồ dùng trước khi vận chuyển.',
    300000,
    ''
);