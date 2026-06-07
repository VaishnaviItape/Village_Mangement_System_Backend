CREATE TABLE utility_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    request_type ENUM('Water Connection', 'Building NOC', 'Repair Request') NOT NULL,
    description TEXT,
    location VARCHAR(255) NOT NULL,
    asset_id VARCHAR(255) NULL,
    document_url VARCHAR(255),
    status ENUM('Pending', 'Approved', 'Rejected') DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
