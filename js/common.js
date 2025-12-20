// --- CẤU HÌNH & TIỆN ÍCH CHUNG ---
const CART_KEY = 'dreamy_cart';

function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
}

// Lấy giỏ hàng
function getCart() {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
}

// Lưu giỏ hàng & Cập nhật Badge ngay lập tức
function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    updateCartBadge(); 
}

// --- LOGIC DÙNG CHUNG (HEADER & NÚT MUA) ---

// 1. Cập nhật số lượng trên Icon Menu
function updateCartBadge() {
    const cart = getCart();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const badgeElement = document.getElementById('cart-badge');
    if (badgeElement) {
        badgeElement.textContent = totalItems;
    }
}

// 2. Hàm Thêm vào giỏ (Dùng ở Trang chủ, Trang chi tiết...)
window.addToCart = function(btn) {
    const product = {
        id: btn.getAttribute('data-id'),
        title: btn.getAttribute('data-title'),
        price: parseInt(btn.getAttribute('data-price')),
        img: btn.getAttribute('data-img'),
        author: btn.getAttribute('data-author'),
        quantity: 1
    };

    let cart = getCart();
    const existingItem = cart.find(item => item.id === product.id);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push(product);
    }

    saveCart(cart);
    alert(`Đã thêm "${product.title}" vào giỏ hàng!`);
};

// Tự động chạy cập nhật Badge khi load bất kỳ trang nào
document.addEventListener("DOMContentLoaded", function() {
    updateCartBadge();
});
