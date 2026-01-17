const mysql = require('mysql2');
require('dotenv').config();

// Önce veritabanı olmadan bağlan
const initialConnection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT
});

// Veritabanını oluştur
initialConnection.connect((err) => {
  if (err) {
    console.error('MySQL bağlantı hatası:', err);
    return;
  }
  
  console.log('MySQL sunucusuna bağlanıldı!');
  
  const createDbQuery = `CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`;
  
  initialConnection.query(createDbQuery, (err, result) => {
    if (err) {
      console.error('Veritabanı oluşturma hatası:', err);
    } else {
      console.log(`✓ Veritabanı '${process.env.DB_NAME}' hazır!`);
    }
    initialConnection.end();
  });
});

// Artık veritabanı ile bağlantı
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});

connection.connect((err) => {
  if (err) {
    console.error('Veritabanına bağlanma hatası:', err);
    return;
  }
  console.log('✓ Veritabanına bağlandı!');
});

module.exports = connection;