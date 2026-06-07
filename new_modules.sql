CREATE TABLE IF NOT EXISTS health_records (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type VARCHAR(50) NOT NULL, -- 'waste_management', 'vaccination', 'disease_report'
    details TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'Pending',
    reported_by VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS marketplace_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    seller_name VARCHAR(100) NOT NULL,
    item_type VARCHAR(50) NOT NULL, -- 'crop', 'service', 'goods'
    title VARCHAR(150) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    contact_number VARCHAR(20) NOT NULL,
    status VARCHAR(50) DEFAULT 'Active', -- 'Active', 'Sold', 'Hidden'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS digital_payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_name VARCHAR(100) NOT NULL,
    payment_type VARCHAR(50) NOT NULL, -- 'property_tax', 'water_tax', 'trade_license'
    amount DECIMAL(10,2) NOT NULL,
    transaction_id VARCHAR(100) UNIQUE NOT NULL,
    status VARCHAR(50) DEFAULT 'Success',
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
