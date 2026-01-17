# E-Ticaret Stok Yönetim Sistemi

Node.js ve Express kullanılarak geliştirilmiş RESTful API tabanlı e-ticaret stok yönetim sistemi.

![GitHub](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)

## 📋 Proje Açıklaması

Bu proje, ürün ve sipariş yönetimi için **MVC mimarisine** uygun olarak geliştirilmiş bir backend uygulamasıdır. Stok kontrolü ve minimum sipariş tutarı gibi iş kurallarını içerir.

## 🎯 Senaryo

E-ticaret platformu için stok yönetimi ve sipariş işlemleri:
- Ürünler stoklarıyla birlikte yönetilir
- Müşteriler sipariş oluşturabilir
- Sistem otomatik stok kontrolü yapar
- Minimum sipariş tutarı kontrolü yapılır

## 🔒 İş Kuralları

### 1. Stok Yetersizse Sipariş Verilemez
Bir ürünün stoğu, sipariş edilen miktardan az ise sipariş oluşturulamaz ve hata mesajı döner.

**Örnek:**
```json
{
  "success": false,
  "message": "Webcam ürünü için yetersiz stok! Mevcut: 0, İstenen: 1"
}
```

### 2. Minimum Sipariş Tutarı 500 TL
Sepet toplamı 500 TL'den az olan siparişler kabul edilmez.

**Örnek:**
```json
{
  "success": false,
  "message": "Minimum sipariş tutarı 500 TL'dir. Sepet toplamı: 250.00 TL"
}
```

## 🛠️ Teknolojiler

- **Node.js** (v14+) - Runtime environment
- **Express.js** - Web framework
- **MySQL/MariaDB** - Veritabanı
- **mysql2** - MySQL driver
- **dotenv** - Environment variables
- **cors** - CORS middleware
- **nodemon** - Development tool

## 📁 Proje Yapısı
```
sunucu_odev/
├── config/
│   └── database.js          # Veritabanı bağlantısı
├── controllers/
│   ├── productController.js # Ürün controller
│   └── orderController.js   # Sipariş controller
├── models/
│   ├── init.js              # Tablo oluşturma
│   ├── Product.js           # Ürün model
│   └── Order.js             # Sipariş model
├── routes/
│   ├── productRoutes.js     # Ürün rotaları
│   └── orderRoutes.js       # Sipariş rotaları
├── public/
│   ├── index.html           # Web arayüzü
│   └── app.js               # Frontend JavaScript
├── .env                     # Ortam değişkenleri (GİT'E EKLENMEMELİ)
├── .env.example             # Örnek config dosyası
├── .gitignore               # Git ignore dosyası
├── package.json             # Bağımlılıklar
├── server.js                # Ana sunucu dosyası
└── README.md                # Dokümantasyon
```

## 🚀 Kurulum

### Gereksinimler

- Node.js (v14 veya üzeri)
- MySQL (v5.7 veya üzeri) / MariaDB
- npm veya yarn

### Adımlar

1. **Projeyi klonlayın:**
```bash
git clone https://github.com/elifozer88/Sunucu_Donem_Odevi_2026.git
cd Sunucu_Donem_Odevi_2026
```

2. **Bağımlılıkları yükleyin:**
```bash
npm install
```

3. **`.env` dosyasını oluşturun:**
```bash
cp .env.example .env
```

4. **`.env` dosyasını düzenleyin:**
```env
DB_HOST=127.0.0.1
DB_USER=root
DB_PASSWORD=
DB_NAME=odev_db
DB_PORT=3306
PORT=3000
```

5. **MySQL veritabanını oluşturun:**
```sql
CREATE DATABASE odev_db;
```

6. **Uygulamayı başlatın:**
```bash
npm run dev
```

7. **Web arayüzünü açın:**
```
http://localhost:3000
```

8. **API'yi test edin:**
```
http://localhost:3000/api/products
```

## 📡 API Endpoints

### Ürün İşlemleri

| Method | Endpoint | Açıklama |
|--------|----------|----------|
| GET | `/api/products` | Tüm ürünleri listele |
| GET | `/api/products/:id` | Belirli bir ürünü getir |
| GET | `/api/products/low-stock` | Düşük stoklu ürünleri listele |
| POST | `/api/products` | Yeni ürün ekle |
| PUT | `/api/products/:id` | Ürün güncelle |
| DELETE | `/api/products/:id` | Ürün sil |

### Sipariş İşlemleri

| Method | Endpoint | Açıklama |
|--------|----------|----------|
| GET | `/api/orders` | Tüm siparişleri listele |
| GET | `/api/orders/:id` | Belirli bir siparişi getir |
| POST | `/api/orders` | Yeni sipariş oluştur |
| PATCH | `/api/orders/:id/status` | Sipariş durumu güncelle |
| DELETE | `/api/orders/:id` | Sipariş sil |

## 📝 Örnek İstekler

### Yeni Ürün Ekle
```bash
POST /api/products
Content-Type: application/json

{
  "name": "Laptop",
  "description": "High performance laptop",
  "price": 15000.00,
  "stock": 10,
  "min_stock": 3
}
```

**Yanıt:**
```json
{
  "success": true,
  "message": "Ürün başarıyla eklendi",
  "data": {
    "id": 1,
    "name": "Laptop",
    "description": "High performance laptop",
    "price": 15000.00,
    "stock": 10,
    "min_stock": 3
  }
}
```

### Sipariş Oluştur (Başarılı)
```bash
POST /api/orders
Content-Type: application/json

{
  "customer_name": "Elif Özer",
  "customer_email": "elif@example.com",
  "items": [
    {
      "product_id": 1,
      "quantity": 1
    },
    {
      "product_id": 2,
      "quantity": 2
    }
  ]
}
```

**Yanıt:**
```json
{
  "success": true,
  "message": "Sipariş başarıyla oluşturuldu",
  "data": {
    "order_id": 1,
    "customer_name": "Elif Özer",
    "customer_email": "elif@example.com",
    "total_amount": "15500.00",
    "items": [...],
    "status": "pending"
  }
}
```

### Sipariş Oluştur - Minimum Tutar Hatası (İş Kuralı 2)
```bash
POST /api/orders
Content-Type: application/json

{
  "customer_name": "Ali Yılmaz",
  "customer_email": "ali@example.com",
  "items": [
    {
      "product_id": 2,
      "quantity": 1
    }
  ]
}
```

**Yanıt:**
```json
{
  "success": false,
  "message": "Minimum sipariş tutarı 500 TL'dir. Sepet toplamı: 250.00 TL"
}
```

### Sipariş Oluştur - Stok Yetersiz (İş Kuralı 1)
```bash
POST /api/orders
Content-Type: application/json

{
  "customer_name": "Ayşe Kaya",
  "customer_email": "ayse@example.com",
  "items": [
    {
      "product_id": 5,
      "quantity": 1
    }
  ]
}
```

**Yanıt:**
```json
{
  "success": false,
  "message": "Webcam ürünü için yetersiz stok! Mevcut: 0, İstenen: 1"
}
```

### Sipariş Durumu Güncelle
```bash
PATCH /api/orders/1/status
Content-Type: application/json

{
  "status": "confirmed"
}
```

**Geçerli durumlar:** `pending`, `confirmed`, `shipped`, `delivered`, `cancelled`

## 🗄️ Veritabanı Yapısı

### ER Diyagramı
```
┌─────────────┐       ┌──────────────┐       ┌─────────────┐
│  products   │       │ order_items  │       │   orders    │
├─────────────┤       ├──────────────┤       ├─────────────┤
│ id (PK)     │───┐   │ id (PK)      │   ┌───│ id (PK)     │
│ name        │   └──<│ product_id   │   │   │ customer_   │
│ description │       │ order_id     │>──┘   │   name      │
│ price       │       │ quantity     │       │ customer_   │
│ stock       │       │ price        │       │   email     │
│ min_stock   │       │ subtotal     │       │ total_      │
│ created_at  │       └──────────────┘       │   amount    │
│ updated_at  │                              │ status      │
└─────────────┘                              │ created_at  │
                                             │ updated_at  │
                                             └─────────────┘
```

### Tablolar

**products** - Ürün bilgileri
- `id`: Primary key
- `name`: Ürün adı
- `description`: Açıklama
- `price`: Fiyat
- `stock`: Stok miktarı
- `min_stock`: Minimum stok seviyesi

**orders** - Sipariş bilgileri
- `id`: Primary key
- `customer_name`: Müşteri adı
- `customer_email`: Müşteri e-postası
- `total_amount`: Toplam tutar
- `status`: Sipariş durumu

**order_items** - Sipariş kalemleri
- `id`: Primary key
- `order_id`: Foreign key (orders)
- `product_id`: Foreign key (products)
- `quantity`: Miktar
- `price`: Birim fiyat
- `subtotal`: Alt toplam

## 🖥️ Web Arayüzü

Proje, kullanıcı dostu bir web arayüzü içerir:

- **Ürünler Sekmesi:** Tüm ürünleri görüntüleme
- **Siparişler Sekmesi:** Siparişleri listeleme
- **Yeni Sipariş:** Sepet sistemi ile sipariş oluşturma
- **Yeni Ürün:** Ürün ekleme formu

![Web Arayüzü](https://via.placeholder.com/800x400.png?text=E-Ticaret+Stok+Yönetim+Arayüzü)

## 🧪 Test

Postman, Thunder Client veya cURL ile API'yi test edebilirsiniz:
```bash
# Tüm ürünleri listele
curl http://localhost:3000/api/products

# Yeni ürün ekle
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","price":100,"stock":10}'

# Sipariş oluştur
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{"customer_name":"Test","customer_email":"test@test.com","items":[{"product_id":1,"quantity":1}]}'
```

## 📦 Bağımlılıklar
```json
{
  "dependencies": {
    "cors": "^2.8.5",
    "dotenv": "^17.2.3",
    "express": "^5.2.1",
    "mysql2": "^3.16.1"
  },
  "devDependencies": {
    "nodemon": "^3.1.11"
  }
}
```

## 👨‍💻 Geliştirici

**Elif Özer**
- GitHub: [@elifozer88](https://github.com/elifozer88)
- Proje: Sunucu Tabanlı Programlama Dönem Ödevi



---

⭐ Beğendiyseniz yıldız vermeyi unutmayın!
