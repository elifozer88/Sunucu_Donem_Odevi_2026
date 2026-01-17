const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { createTables } = require('./models/init');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Static dosyalar için

// Tabloları oluştur
setTimeout(() => {
  createTables();
}, 1000);

// Routes
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');

// Ana sayfa
app.get('/', (req, res) => {
  res.json({ 
    success: true,
    message: 'E-Ticaret Stok Yönetim API',
    endpoints: {
      products: {
        'GET /api/products': 'Tüm ürünleri listele',
        'GET /api/products/:id': 'Tek ürün getir',
        'GET /api/products/low-stock': 'Düşük stoklu ürünler',
        'POST /api/products': 'Yeni ürün ekle',
        'PUT /api/products/:id': 'Ürün güncelle',
        'DELETE /api/products/:id': 'Ürün sil'
      },
      orders: {
        'GET /api/orders': 'Tüm siparişleri listele',
        'GET /api/orders/:id': 'Tek sipariş getir',
        'POST /api/orders': 'Yeni sipariş oluştur',
        'PATCH /api/orders/:id/status': 'Sipariş durumu güncelle',
        'DELETE /api/orders/:id': 'Sipariş sil'
      },
      test: '/test-db'
    },
    business_rules: {
      rule1: 'Stok yetersizse sipariş verilemez',
      rule2: 'Minimum sipariş tutarı 500 TL'
    }
  });
});

// Veritabanı bağlantı testi
app.get('/test-db', (req, res) => {
  const db = require('./config/database');
  
  db.query('SELECT 1 + 1 AS solution', (err, results) => {
    if (err) {
      return res.status(500).json({ 
        success: false,
        error: err.message 
      });
    }
    res.json({ 
      success: true,
      message: 'MySQL bağlantısı başarılı!', 
      result: results[0].solution 
    });
  });
});

// API Routes
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`\n🚀 Sunucu http://localhost:${PORT} adresinde çalışıyor\n`);
});