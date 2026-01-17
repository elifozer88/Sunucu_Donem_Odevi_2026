const Product = require('../models/Product');

// Tüm ürünleri listele
exports.getAllProducts = (req, res) => {
  Product.getAll((err, results) => {
    if (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
    res.json({ success: true, data: results });
  });
};

// Tek ürün getir
exports.getProduct = (req, res) => {
  const id = req.params.id;
  
  Product.getById(id, (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ success: false, message: 'Ürün bulunamadı' });
    }
    res.json({ success: true, data: results[0] });
  });
};

// Yeni ürün ekle
exports.createProduct = (req, res) => {
  const { name, description, price, stock, min_stock } = req.body;

  if (!name || !price || stock === undefined) {
    return res.status(400).json({ 
      success: false, 
      message: 'Ürün adı, fiyat ve stok zorunludur' 
    });
  }

  if (price < 0) {
    return res.status(400).json({ 
      success: false, 
      message: 'Fiyat negatif olamaz' 
    });
  }

  if (stock < 0) {
    return res.status(400).json({ 
      success: false, 
      message: 'Stok negatif olamaz' 
    });
  }

  const productData = { name, description, price, stock, min_stock };

  Product.create(productData, (err, result) => {
    if (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
    res.status(201).json({ 
      success: true, 
      message: 'Ürün başarıyla eklendi',
      data: { id: result.insertId, ...productData }
    });
  });
};

// Ürün güncelle
exports.updateProduct = (req, res) => {
  const id = req.params.id;
  const { name, description, price, stock, min_stock } = req.body;

  if (!name || !price || stock === undefined) {
    return res.status(400).json({ 
      success: false, 
      message: 'Ürün adı, fiyat ve stok zorunludur' 
    });
  }

  const productData = { name, description, price, stock, min_stock };

  Product.update(id, productData, (err, result) => {
    if (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Ürün bulunamadı' });
    }
    res.json({ 
      success: true, 
      message: 'Ürün başarıyla güncellendi' 
    });
  });
};

// Ürün sil
exports.deleteProduct = (req, res) => {
  const id = req.params.id;

  Product.delete(id, (err, result) => {
    if (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Ürün bulunamadı' });
    }
    res.json({ 
      success: true, 
      message: 'Ürün başarıyla silindi' 
    });
  });
};

// Düşük stoklu ürünler
exports.getLowStockProducts = (req, res) => {
  Product.getLowStock((err, results) => {
    if (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
    res.json({ 
      success: true, 
      message: `${results.length} adet düşük stoklu ürün bulundu`,
      data: results 
    });
  });
};