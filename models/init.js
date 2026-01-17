const db = require('../config/database');

const createTables = () => {
  console.log('Tablolar oluşturuluyor...');

  // Products tablosu
  const createProductsTable = `
    CREATE TABLE IF NOT EXISTS products (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      price DECIMAL(10, 2) NOT NULL,
      stock INT NOT NULL DEFAULT 0,
      min_stock INT NOT NULL DEFAULT 5,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `;

  // Orders tablosu
  const createOrdersTable = `
    CREATE TABLE IF NOT EXISTS orders (
      id INT AUTO_INCREMENT PRIMARY KEY,
      customer_name VARCHAR(255) NOT NULL,
      customer_email VARCHAR(255) NOT NULL,
      total_amount DECIMAL(10, 2) NOT NULL,
      status ENUM('pending', 'confirmed', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `;

  // Order Items tablosu
  const createOrderItemsTable = `
    CREATE TABLE IF NOT EXISTS order_items (
      id INT AUTO_INCREMENT PRIMARY KEY,
      order_id INT NOT NULL,
      product_id INT NOT NULL,
      quantity INT NOT NULL,
      price DECIMAL(10, 2) NOT NULL,
      subtotal DECIMAL(10, 2) NOT NULL,
      FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    )
  `;

  // Products tablosunu oluştur
  db.query(createProductsTable, (err) => {
    if (err) {
      console.error('❌ Products tablosu hatası:', err.message);
    } else {
      console.log('✓ Products tablosu hazır');
    }
  });

  // Orders tablosunu oluştur
  db.query(createOrdersTable, (err) => {
    if (err) {
      console.error('❌ Orders tablosu hatası:', err.message);
    } else {
      console.log('✓ Orders tablosu hazır');
    }
  });

  // Order_items tablosunu oluştur
  db.query(createOrderItemsTable, (err) => {
    if (err) {
      console.error('❌ Order_items tablosu hatası:', err.message);
    } else {
      console.log('✓ Order_items tablosu hazır');
      // Tüm tablolar oluştuktan sonra örnek veri ekle
      setTimeout(insertSampleData, 500);
    }
  });
};

const insertSampleData = () => {
  const checkProducts = 'SELECT COUNT(*) as count FROM products';
  
  db.query(checkProducts, (err, results) => {
    if (err) {
      console.error('❌ Ürün kontrolü hatası:', err.message);
      return;
    }

    if (results[0].count === 0) {
      const sampleProducts = `
        INSERT INTO products (name, description, price, stock, min_stock) VALUES
        ('Laptop', 'High performance laptop', 15000.00, 10, 3),
        ('Mouse', 'Wireless mouse', 250.00, 50, 10),
        ('Keyboard', 'Mechanical keyboard', 800.00, 30, 5),
        ('Monitor', '27 inch 4K monitor', 5000.00, 5, 2),
        ('Webcam', 'HD webcam', 600.00, 0, 5)
      `;

      db.query(sampleProducts, (err) => {
        if (err) {
          console.error('❌ Örnek ürünler eklenemedi:', err.message);
        } else {
          console.log('✓ Örnek ürünler eklendi (5 adet)');
        }
      });
    } else {
      console.log('✓ Ürünler zaten mevcut');
    }
  });
};

module.exports = { createTables };
