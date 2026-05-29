const db = require('./config/db');
db.query(`
CREATE TABLE IF NOT EXISTS talukas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  taluka_code VARCHAR(20) UNIQUE NOT NULL,
  taluka_name VARCHAR(100) NOT NULL,
  district_id INT NOT NULL,
  is_active TINYINT(1) DEFAULT 1
)
`).then(() => {
  console.log('talukas table created');
  process.exit(0);
}).catch(console.error);
