const db = require('../config/database');

class Order {
  static getAll(callback) {
    const query = `
      SELECT o.*, 
             GROUP_CONCAT(CONCAT(p.name, ' (', oi.quantity, 'x)') SEPARATOR ', ') as items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN products p ON oi.product_id = p.id
      GROUP BY o.id
      ORDER BY o.created_at DESC
    `;
    db.query(query, callback);
  }

  static getById(id, callback) {
    const query = `
      SELECT o.*, 
             JSON_ARRAYAGG(
               JSON_OBJECT(
                 'product_id', p.id,
                 'product_name', p.name,
                 'quantity', oi.quantity,
                 'price', oi.price,
                 'subtotal', oi.subtotal
               )
             ) as items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN products p ON oi.product_id = p.id
      WHERE o.id = ?
      GROUP BY o.id
    `;
    db.query(query, [id], callback);
  }

  static create(orderData, callback) {
    const query = 'INSERT INTO orders (customer_name, customer_email, total_amount, status) VALUES (?, ?, ?, ?)';
    const values = [
      orderData.customer_name,
      orderData.customer_email,
      orderData.total_amount,
      orderData.status || 'pending'
    ];
    db.query(query, values, callback);
  }

  static updateStatus(id, status, callback) {
    const query = 'UPDATE orders SET status = ? WHERE id = ?';
    db.query(query, [status, id], callback);
  }

  static delete(id, callback) {
    const query = 'DELETE FROM orders WHERE id = ?';
    db.query(query, [id], callback);
  }
}

class OrderItem {
  static create(itemData, callback) {
    const query = 'INSERT INTO order_items (order_id, product_id, quantity, price, subtotal) VALUES (?, ?, ?, ?, ?)';
    const values = [
      itemData.order_id,
      itemData.product_id,
      itemData.quantity,
      itemData.price,
      itemData.subtotal
    ];
    db.query(query, values, callback);
  }
}

module.exports = { Order, OrderItem };