const API_URL = 'http://localhost:3000/api';
let cart = [];
let products = [];

// Sayfa yüklendiğinde
window.onload = () => {
    loadProducts();
    loadOrders();
    setupForms();
};

// Tab değiştirme
function showTab(tabName) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    event.target.classList.add('active');
    document.getElementById(`${tabName}-tab`).classList.add('active');
    
    if (tabName === 'products') loadProducts();
    if (tabName === 'orders') loadOrders();
}

// Ürünleri yükle
async function loadProducts() {
    try {
        const response = await fetch(`${API_URL}/products`);
        const data = await response.json();
        products = data.data;
        
        displayProducts(products);
        updateProductSelect(products);
    } catch (error) {
        document.getElementById('products-container').innerHTML = 
            '<div class="error">Ürünler yüklenirken hata oluştu!</div>';
    }
}

// Ürünleri göster
function displayProducts(products) {
    const container = document.getElementById('products-container');
    
    if (products.length === 0) {
        container.innerHTML = '<p>Henüz ürün eklenmemiş.</p>';
        return;
    }
    
    container.innerHTML = `
        <div class="products-grid">
            ${products.map(product => `
                <div class="product-card">
                    <div class="product-name">${product.name}</div>
                    <p style="color: #666; margin: 10px 0;">${product.description || 'Açıklama yok'}</p>
                    <div class="product-price">${parseFloat(product.price).toFixed(2)} TL</div>
                    <div>
                        <span class="product-stock ${getStockClass(product)}">
                            Stok: ${product.stock} adet
                        </span>
                    </div>
                    ${product.stock <= product.min_stock ? 
                        '<p style="color: #f44336; margin-top: 10px; font-weight: bold;">⚠️ Düşük Stok!</p>' : ''}
                </div>
            `).join('')}
        </div>
    `;
}

function getStockClass(product) {
    if (product.stock === 0) return 'stock-out';
    if (product.stock <= product.min_stock) return 'stock-low';
    return 'stock-ok';
}

// Siparişleri yükle
async function loadOrders() {
    try {
        const response = await fetch(`${API_URL}/orders`);
        const data = await response.json();
        
        displayOrders(data.data);
    } catch (error) {
        document.getElementById('orders-container').innerHTML = 
            '<div class="error">Siparişler yüklenirken hata oluştu!</div>';
    }
}

// Siparişleri göster
function displayOrders(orders) {
    const container = document.getElementById('orders-container');
    
    if (orders.length === 0) {
        container.innerHTML = '<p>Henüz sipariş oluşturulmamış.</p>';
        return;
    }
    
    container.innerHTML = `
        <div class="orders-list">
            ${orders.map(order => `
                <div class="order-card">
                    <div class="order-header">
                        <div>
                            <h3>Sipariş #${order.id}</h3>
                            <p style="color: #666;">${order.customer_name} - ${order.customer_email}</p>
                        </div>
                        <span class="order-status status-${order.status}">${getStatusText(order.status)}</span>
                    </div>
                    <div class="order-items">
                        <strong>Ürünler:</strong> ${order.items || 'Yükleniyor...'}
                    </div>
                    <div style="margin-top: 15px; font-size: 1.2em; font-weight: bold; color: #667eea;">
                        Toplam: ${parseFloat(order.total_amount).toFixed(2)} TL
                    </div>
                    <div style="margin-top: 10px; color: #999; font-size: 0.9em;">
                        ${new Date(order.created_at).toLocaleString('tr-TR')}
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

function getStatusText(status) {
    const statusMap = {
        'pending': 'Beklemede',
        'confirmed': 'Onaylandı',
        'shipped': 'Kargoda',
        'delivered': 'Teslim Edildi',
        'cancelled': 'İptal'
    };
    return statusMap[status] || status;
}

// Ürün seçim listesini güncelle
function updateProductSelect(products) {
    const select = document.getElementById('product-select');
    select.innerHTML = '<option value="">Ürün seçin...</option>' + 
        products.filter(p => p.stock > 0).map(p => 
            `<option value="${p.id}">${p.name} - ${p.price} TL (Stok: ${p.stock})</option>`
        ).join('');
}

// Sepete ekle
function addToCart() {
    const productId = document.getElementById('product-select').value;
    const quantity = parseInt(document.getElementById('quantity').value);
    
    if (!productId || !quantity) {
        alert('Lütfen ürün ve miktar seçin!');
        return;
    }
    
    const product = products.find(p => p.id == productId);
    if (!product) return;
    
    if (quantity > product.stock) {
        alert(`Yetersiz stok! Maksimum ${product.stock} adet sipariş verebilirsiniz.`);
        return;
    }
    
    const existingItem = cart.find(item => item.product_id == productId);
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            product_id: parseInt(productId),
            product_name: product.name,
            price: product.price,
            quantity: quantity
        });
    }
    
    updateCartDisplay();
    document.getElementById('quantity').value = 1;
}

// Sepeti göster
function updateCartDisplay() {
    const cartDiv = document.getElementById('cart');
    
    if (cart.length === 0) {
        cartDiv.innerHTML = '';
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    cartDiv.innerHTML = `
        <h3>Sepet</h3>
        ${cart.map((item, index) => `
            <div class="cart-item">
                <span>${item.product_name} x ${item.quantity}</span>
                <span>${(item.price * item.quantity).toFixed(2)} TL</span>
                <button onclick="removeFromCart(${index})" style="padding: 5px 10px;">Sil</button>
            </div>
        `).join('')}
        <div class="cart-total">Toplam: ${total.toFixed(2)} TL</div>
    `;
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartDisplay();
}

// Form işlemleri
function setupForms() {
    // Ürün formu
    document.getElementById('product-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const productData = {
            name: document.getElementById('product-name').value,
            description: document.getElementById('product-description').value,
            price: parseFloat(document.getElementById('product-price').value),
            stock: parseInt(document.getElementById('product-stock').value),
            min_stock: parseInt(document.getElementById('product-min-stock').value)
        };
        
        try {
            const response = await fetch(`${API_URL}/products`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productData)
            });
            
            const data = await response.json();
            
            if (data.success) {
                document.getElementById('product-message').innerHTML = 
                    '<div class="success">Ürün başarıyla eklendi!</div>';
                e.target.reset();
                loadProducts();
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            document.getElementById('product-message').innerHTML = 
                `<div class="error">${error.message}</div>`;
        }
    });
    
    // Sipariş formu
    document.getElementById('order-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (cart.length === 0) {
            alert('Sepetiniz boş!');
            return;
        }
        
        const orderData = {
            customer_name: document.getElementById('customer-name').value,
            customer_email: document.getElementById('customer-email').value,
            items: cart.map(item => ({
                product_id: item.product_id,
                quantity: item.quantity
            }))
        };
        
        try {
            const response = await fetch(`${API_URL}/orders`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData)
            });
            
            const data = await response.json();
            
            if (data.success) {
                document.getElementById('order-message').innerHTML = 
                    '<div class="success">Sipariş başarıyla oluşturuldu!</div>';
                e.target.reset();
                cart = [];
                updateCartDisplay();
                loadProducts();
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            document.getElementById('order-message').innerHTML = 
                `<div class="error">${error.message}</div>`;
        }
    });
}