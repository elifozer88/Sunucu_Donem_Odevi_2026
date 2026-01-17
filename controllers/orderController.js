const { Order, OrderItem } = require('../models/Order');
const Product = require('../models/Product');
const db = require('../config/database');

// Tüm siparişleri listele
exports.getAllOrders = (req, res) => {
  Order.getAll((err, results) => {
    if (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
    res.json({ success: true, data: results });
  });
};

// Tek sipariş getir
exports.getOrder = (req, res) => {
  const id = req.params.id;
  
  Order.getById(id, (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ success: false, message: 'Sipariş bulunamadı' });
    }
    res.json({ success: true, data: results[0] });
  });
};

// Yeni sipariş oluştur (İŞ KURALLARI)
exports.createOrder = async (req, res) => {
  const { customer_name, customer_email, items } = req.body;

  if (!customer_name || !customer_email || !items || items.length === 0) {
    return res.status(400).json({ 
      success: false, 
      message: 'Müşteri bilgileri ve ürünler zorunludur' 
    });
  }

  try {
    db.beginTransaction((err) => {
      if (err) {
        return res.status(500).json({ success: false, error: err.message });
      }

      let total_amount = 0;
      let orderDetails = [];

      let stockCheckPromises = items.map((item) => {
        return new Promise((resolve, reject) => {
          Product.getById(item.product_id, (err, results) => {
            if (err) return reject(err);
            if (results.length === 0) {
              return reject(new Error(`Ürün bulunamadı: ${item.product_id}`));
            }

            const product = results[0];

            if (product.stock < item.quantity) {
              return reject(new Error(
                `"${product.name}" ürünü için yetersiz stok! Mevcut: ${product.stock}, İstenen: ${item.quantity}`
              ));
            }

            const subtotal = product.price * item.quantity;
            total_amount += subtotal;

            orderDetails.push({
              product_id: item.product_id,
              product_name: product.name,
              quantity: item.quantity,
              price: product.price,
              subtotal: subtotal
            });

            resolve();
          });
        });
      });

      Promise.all(stockCheckPromises)
        .then(() => {
          if (total_amount < 500) {
            db.rollback();
            return res.status(400).json({
              success: false,
              message: `Minimum sipariş tutarı 500 TL'dir. Sepet toplamı: ${total_amount.toFixed(2)} TL`
            });
          }

          const orderData = {
            customer_name,
            customer_email,
            total_amount,
            status: 'pending'
          };

          Order.create(orderData, (err, orderResult) => {
            if (err) {
              db.rollback();
              return res.status(500).json({ success: false, error: err.message });
            }

            const orderId = orderResult.insertId;

            let itemPromises = orderDetails.map((detail) => {
              return new Promise((resolve, reject) => {
                const itemData = {
                  order_id: orderId,
                  product_id: detail.product_id,
                  quantity: detail.quantity,
                  price: detail.price,
                  subtotal: detail.subtotal
                };

                OrderItem.create(itemData, (err) => {
                  if (err) return reject(err);

                  Product.updateStock(detail.product_id, -detail.quantity, (err) => {
                    if (err) return reject(err);
                    resolve();
                  });
                });
              });
            });

            Promise.all(itemPromises)
              .then(() => {
                db.commit((err) => {
                  if (err) {
                    db.rollback();
                    return res.status(500).json({ success: false, error: err.message });
                  }

                  res.status(201).json({
                    success: true,
                    message: 'Sipariş başarıyla oluşturuldu',
                    data: {
                      order_id: orderId,
                      customer_name,
                      customer_email,
                      total_amount: total_amount.toFixed(2),
                      items: orderDetails,
                      status: 'pending'
                    }
                  });
                });
              })
              .catch((err) => {
                db.rollback();
                res.status(500).json({ success: false, error: err.message });
              });
          });
        })
        .catch((err) => {
          db.rollback();
          res.status(400).json({ success: false, message: err.message });
        });
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Sipariş durumu güncelle
exports.updateOrderStatus = (req, res) => {
  const id = req.params.id;
  const { status } = req.body;

  const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
  
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ 
      success: false, 
      message: 'Geçersiz durum. Geçerli durumlar: ' + validStatuses.join(', ')
    });
  }

  Order.updateStatus(id, status, (err, result) => {
    if (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Sipariş bulunamadı' });
    }
    res.json({ 
      success: true, 
      message: 'Sipariş durumu güncellendi',
      new_status: status
    });
  });
};

// Sipariş sil
exports.deleteOrder = (req, res) => {
  const id = req.params.id;

  Order.delete(id, (err, result) => {
    if (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Sipariş bulunamadı' });
    }
    res.json({ 
      success: true, 
      message: 'Sipariş başarıyla silindi' 
    });
  });
};
