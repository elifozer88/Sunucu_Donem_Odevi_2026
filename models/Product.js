const db = require('../config/database');

class Product {
  static getAll(callback) {
    const query = 'SELECT * FROM products ORDER BY created_at DESC';
    db.query(query, callback);
  }

  static getById(id, callback) {
    const query = 'SELECT * FROM products WHERE id = ?';
    db.query(query, [id], callback);
  }

  static create(productData, callback) {
    const query = 'INSERT INTO products (name, description, price, stock, min_stock) VALUES (?, ?, ?, ?, ?)';
    const values = [
      productData.name,
      productData.description,
      productData.price,
      productData.stock,
      productData.min_stock || 5
    ];
    db.query(query, values, callback);
  }

  static update(id, productData, callback) {
    const query = 'UPDATE products SET name = ?, description = ?, price = ?, stock = ?, min_stock = ? WHERE id = ?';
    const values = [
      productData.name,
      productData.description,
      productData.price,
      productData.stock,
      productData.min_stock,
      id
    ];
    db.query(query, values, callback);
  }

  static delete(id, callback) {
    const query = 'DELETE FROM products WHERE id = ?';
    db.query(query, [id], callback);
  }

  static updateStock(id, quantity, callback) {
    const query = 'UPDATE products SET stock = stock + ? WHERE id = ?';
    db.query(query, [quantity, id], callback);
  }

  static getLowStock(callback) {
    const query = 'SELECT * FROM products WHERE stock <= min_stock';
    db.query(query, callback);
  }
}

module.exports = Product;