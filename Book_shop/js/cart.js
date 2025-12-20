// ======================
// SHOPPING CART FUNCTIONALITY
// ======================

// Cart storage in localStorage
let cart = JSON.parse(localStorage.getItem('cart')) || [];

document.addEventListener('DOMContentLoaded', function() {
    // Add to Cart functionality
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const bookItem = this.closest('.book-item');
            const bookName = bookItem.getAttribute('data-book');
            const bookTitle = bookItem.querySelector('h4').textContent;
            const bookPrice = bookItem.querySelector('.price').textContent;
            const bookImage = bookItem.querySelector('img').src;
            
            // Parse price to number
            const priceValue = parseInt(bookPrice.replace(/\D/g, ''));
            
            // Check if item already in cart
            const existingItem = cart.find(item => item.name === bookName);
            
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({
                    name: bookName,
                    title: bookTitle,
                    price: priceValue,
                    image: bookImage,
                    quantity: 1
                });
            }
            
            // Save to localStorage
            localStorage.setItem('cart', JSON.stringify(cart));
            
            // Show feedback
            alert('Đã thêm "' + bookTitle + '" vào giỏ hàng!');
        });
    });
});

// ======================
// CART PAGE FUNCTIONALITY
// ======================

document.addEventListener('DOMContentLoaded', function() {
    // Only run on cart page
    if (document.getElementById('cartTableBody')) {
        loadCart();
        
        // Clear cart button
        const clearCartBtn = document.getElementById('clearCartBtn');
        if (clearCartBtn) {
            clearCartBtn.addEventListener('click', function() {
                if (confirm('Bạn có chắc muốn xóa toàn bộ giỏ hàng?')) {
                    cart = [];
                    localStorage.setItem('cart', JSON.stringify(cart));
                    loadCart();
                }
            });
        }
        
        // Checkout button
        const checkoutBtn = document.getElementById('checkoutBtn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', function() {
                if (cart.length === 0) {
                    alert('Giỏ hàng của bạn đang trống!');
                    return;
                }
                alert('Chức năng thanh toán đang được phát triển!');
            });
        }
    }
});

function loadCart() {
    cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    const cartEmpty = document.getElementById('cartEmpty');
    const cartContent = document.getElementById('cartContent');
    const cartTableBody = document.getElementById('cartTableBody');
    
    if (cart.length === 0) {
        cartEmpty.style.display = 'block';
        cartContent.style.display = 'none';
        return;
    }
    
    cartEmpty.style.display = 'none';
    cartContent.style.display = 'block';
    
    // Clear table
    cartTableBody.innerHTML = '';
    
    // Add items to table
    cart.forEach((item, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td data-label="Hình ảnh">
                <img src="${item.image}" alt="${item.title}">
            </td>
            <td data-label="Tên sách">${item.title}</td>
            <td data-label="Giá">${formatPrice(item.price)}</td>
            <td data-label="Số lượng">
                <input type="number" class="quantity-input" value="${item.quantity}" min="1" data-index="${index}">
            </td>
            <td data-label="Tổng">${formatPrice(item.price * item.quantity)}</td>
            <td data-label="Xóa">
                <button class="remove-btn" data-index="${index}">Xóa</button>
            </td>
        `;
        cartTableBody.appendChild(row);
    });
    
    // Add event listeners for quantity change
    const quantityInputs = document.querySelectorAll('.quantity-input');
    quantityInputs.forEach(input => {
        input.addEventListener('change', function() {
            const index = parseInt(this.getAttribute('data-index'));
            const newQuantity = parseInt(this.value);
            
            if (newQuantity > 0) {
                cart[index].quantity = newQuantity;
                localStorage.setItem('cart', JSON.stringify(cart));
                loadCart();
            }
        });
    });
    
    // Add event listeners for remove buttons
    const removeButtons = document.querySelectorAll('.remove-btn');
    removeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            cart.splice(index, 1);
            localStorage.setItem('cart', JSON.stringify(cart));
            loadCart();
        });
    });
    
    // Update summary
    updateCartSummary();
}

function updateCartSummary() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = 30000;
    const total = subtotal + shipping;
    
    document.getElementById('subtotal').textContent = formatPrice(subtotal);
    document.getElementById('total').textContent = formatPrice(total);
}

function formatPrice(price) {
    return price.toLocaleString('vi-VN') + ' VNĐ';
}
