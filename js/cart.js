function renderCartPage() {
    const container = document.getElementById('cart-items-container');
    if (!container) return; // Nếu không có khung chứa thì dừng

    const cart = getCart(); // Gọi hàm từ common.js
    const countInfo = document.getElementById('cart-count-info');
    
    // Cập nhật text thông báo
    if(countInfo) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        countInfo.textContent = `Bạn đang có ${totalItems} sản phẩm trong túi.`;
    }

    container.innerHTML = ''; 

    // Header bảng
    container.innerHTML += `
        <div class="d-none d-md-flex row border-bottom pb-3 mb-4 text-uppercase small text-muted spacing-wide">
            <div class="col-6">Sản phẩm</div>
            <div class="col-2 text-center">Số lượng</div>
            <div class="col-2 text-end">Giá</div>
            <div class="col-2 text-end">Tổng</div>
        </div>
    `;

    // Giỏ trống
    if (cart.length === 0) {
        container.innerHTML += `
            <div class="text-center py-5 text-muted">
                <i class="bi bi-cart-x fs-1 mb-3 d-block"></i>
                <p>Giỏ hàng chưa có sản phẩm nào.</p>
                <a href="book.html" class="btn btn-dark rounded-0 mt-2">Đi mua sách ngay</a>
            </div>`;
        updateOrderSummary(0);
        return;
    }

    // Vẽ sản phẩm
    cart.forEach((item, index) => {
        const html = `
        <div class="row align-items-center border-bottom py-4 cart-item">
            <div class="col-md-6 d-flex align-items-center gap-3">
                <div class="ratio ratio-1x1 bg-light" style="width: 80px; flex-shrink: 0;">
                    <img src="${item.img}" alt="${item.title}" class="object-fit-cover w-100 h-100">
                </div>
                <div>
                    <h5 class="brand-font mb-1 fs-6">${item.title}</h5>
                    <p class="text-muted small mb-0">${item.author || 'Tác giả'}</p>
                    <a href="javascript:void(0)" onclick="removeItem(${index})" class="text-danger small text-decoration-none mt-1 d-inline-block">Xóa</a>
                </div>
            </div>
            
            <div class="col-md-2 mt-3 mt-md-0 text-center">
                <div class="input-group input-group-sm w-75 mx-auto">
                    <button class="btn btn-outline-secondary border-0" onclick="updateQuantity(${index}, -1)">-</button>
                    <input type="text" class="form-control text-center border-0 bg-transparent" value="${item.quantity}" readonly>
                    <button class="btn btn-outline-secondary border-0" onclick="updateQuantity(${index}, 1)">+</button>
                </div>
            </div>

            <div class="col-md-2 text-md-end mt-2 mt-md-0 text-muted small">
                ${formatCurrency(item.price)}
            </div>

            <div class="col-md-2 text-md-end mt-2 mt-md-0 fw-bold">
                ${formatCurrency(item.price * item.quantity)}
            </div>
        </div>`;
        container.innerHTML += html;
    });

    // Nút tiếp tục
    container.innerHTML += `
        <div class="mt-4">
            <a href="book.html" class="text-decoration-none text-dark small fw-bold">
                <i class="bi bi-arrow-left me-2"></i> TIẾP TỤC MUA SẮM
            </a>
        </div>
    `;

    // Tính tổng
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    updateOrderSummary(total);
}

function updateOrderSummary(total) {
    const subTotalEl = document.getElementById('cart-subtotal');
    const totalEl = document.getElementById('cart-total');
    if (subTotalEl) subTotalEl.textContent = formatCurrency(total);
    if (totalEl) totalEl.textContent = formatCurrency(total);
}

// Hàm Xóa (Chỉ trang Cart mới dùng)
window.removeItem = function(index) {
    if(confirm("Bạn chắc chắn muốn xóa sách này?")) {
        let cart = getCart(); // Gọi từ common.js
        cart.splice(index, 1);
        saveCart(cart); // Gọi từ common.js (nó sẽ tự update Badge luôn)
        renderCartPage(); // Vẽ lại bảng
    }
};

// Hàm Sửa số lượng
window.updateQuantity = function(index, change) {
    let cart = getCart();
    if (cart[index]) {
        cart[index].quantity += change;
        if (cart[index].quantity < 1) {
            if(confirm("Xóa sản phẩm này?")) {
                cart.splice(index, 1);
            } else {
                cart[index].quantity = 1;
            }
        }
    }
    saveCart(cart);
    renderCartPage();
};

// Chỉ chạy render khi vào trang Cart
document.addEventListener("DOMContentLoaded", function() {
    renderCartPage();
});
// --- 1. HÀM MỞ MODAL THANH TOÁN ---
function processCheckout() {
    // A. Lấy dữ liệu giỏ hàng (sửa tên biến cho đúng 'dreamy_cart')
    const cartKey = 'dreamy_cart'; // <-- Đảm bảo dùng đúng tên này
    const cart = JSON.parse(localStorage.getItem(cartKey)) || [];

    // B. Kiểm tra giỏ hàng
    if (cart.length === 0) {
        alert("Giỏ hàng đang trống!");
        return;
    }

    // C. Kiểm tra đăng nhập
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        alert("Vui lòng đăng nhập để thanh toán!");
        const authModal = document.getElementById('authModal');
        if(authModal) new bootstrap.Modal(authModal).show();
        return;
    }

    // D. Tính toán tiền và điền vào Modal
    const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Cập nhật số tiền lên giao diện Modal
    document.getElementById('checkoutModalTotal').innerText = totalAmount.toLocaleString() + 'đ';
    document.getElementById('checkoutModalFinalTotal').innerText = totalAmount.toLocaleString() + 'đ';

    // Tự động điền tên/sđt nếu có (Optional)
    if(currentUser.name) document.getElementById('inputName').value = currentUser.name;
    // Giả sử user có lưu sđt
    if(currentUser.phone) document.getElementById('inputPhone').value = currentUser.phone;

    // E. Mở Modal
    const checkoutModal = new bootstrap.Modal(document.getElementById('checkoutModal'));
    checkoutModal.show();
}

// --- 2. HÀM XỬ LÝ KHI ẤN NÚT "XÁC NHẬN" TRONG MODAL ---
function handleConfirmPayment() {
    // A. Lấy dữ liệu từ Form
    const name = document.getElementById('inputName').value;
    const phone = document.getElementById('inputPhone').value;
    const address = document.getElementById('inputAddress').value;
    
    // Lấy phương thức thanh toán đang chọn
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;

    // B. Validate (Kiểm tra dữ liệu nhập vào)
    if (!name || !phone || !address) {
        alert("Vui lòng điền đầy đủ thông tin giao hàng!");
        return;
    }

    // C. Chuẩn bị dữ liệu đơn hàng
    const cartKey = 'dreamy_cart';
    const cart = JSON.parse(localStorage.getItem(cartKey)) || [];
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const orderId = '#ORD-' + Math.floor(10000 + Math.random() * 90000); // Mã đơn 5 số
    
    const newOrder = {
        id: orderId,
        date: new Date().toLocaleDateString('vi-VN'),
        items: cart,
        total: totalAmount,
        status: 'Đang xử lý', // Trạng thái mặc định
        userEmail: currentUser.email,
        // Lưu thêm thông tin giao hàng
        customerInfo: {
            name: name,
            phone: phone,
            address: address,
            paymentMethod: paymentMethod
        }
    };

    // D. Lưu đơn hàng
    const allOrders = JSON.parse(localStorage.getItem('allOrders')) || [];
    allOrders.unshift(newOrder);
    localStorage.setItem('allOrders', JSON.stringify(allOrders));

    // E. Xóa giỏ hàng an toàn
    localStorage.setItem(cartKey, '[]'); // Set về mảng rỗng

    // F. Cập nhật giao diện bên ngoài (để không bị lỗi hiển thị)
    try {
        if (typeof updateCartCount === 'function') updateCartCount(); // Nếu có hàm này
        if (typeof updateCartBadge === 'function') updateCartBadge(); // Hoặc hàm này
        if (typeof renderCartPage === 'function') renderCartPage();
    } catch (e) { console.log('Update UI skip'); }

    // G. Ẩn modal và chuyển trang
    // Lấy instance modal đang mở để ẩn nó đi
    const modalEl = document.getElementById('checkoutModal');
    const modal = bootstrap.Modal.getInstance(modalEl);
    modal.hide();

    alert(`Đặt hàng thành công!\nMã đơn: ${orderId}\nPhương thức: ${paymentMethod}`);
    window.location.href = 'orders.html';
}

// Hàm phụ trợ tính tổng tiền
function calculateTotal(cart) {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}


function autoFillUserData() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) return;

    // Ví dụ: Tìm các ô input có id là 'customerName', 'customerEmail'
    const nameInput = document.getElementById('customerName');
    const emailInput = document.getElementById('customerEmail');

    if (nameInput) nameInput.value = currentUser.name;
    if (emailInput) emailInput.value = currentUser.email;
}

// Gọi hàm này mỗi khi tải trang hoặc mở Modal thanh toán
document.addEventListener('DOMContentLoaded', autoFillUserData);

document.addEventListener("DOMContentLoaded", function () {
    // --- CẤU HÌNH ---
    const itemsPerPage = 8; 
    const container = document.getElementById('book-list'); 
    const paginationContainer = document.getElementById('pagination');
    const searchInput = document.getElementById('searchInput');

    // Kiểm tra nếu thiếu ID thì dừng luôn để tránh lỗi
    if (!container || !paginationContainer) return;

    // --- TRẠNG THÁI (STATE) ---
    let currentFilter = 'all'; // 'all', 'odd', 'even'
    let currentSearch = '';
    let currentPage = 1;

    // Lấy danh sách sách ban đầu
    const allBooks = Array.from(container.querySelectorAll('.col-6, .col-md-4, .col-lg-3'));

    // --- HÀM XỬ LÝ CHÍNH (UPDATE UI) ---
    function updateDisplay() {
        // BƯỚC 1: LỌC THEO LOẠI
        let processedBooks = allBooks.filter(book => {
            // Tìm thẻ có chứa data-id 
            const elementWithId = book.querySelector('[data-id]') || book;
            const id = parseInt(elementWithId.getAttribute('data-id'));
            
            if (isNaN(id)) return true; // Nếu không có ID thì cứ hiện

            if (currentFilter === 'odd') return id % 2 !== 0; // Lấy số lẻ
            if (currentFilter === 'even') return id % 2 === 0; // Lấy số chẵn
            return true; // 'all'
        });

        // BƯỚC 2: LỌC THEO TỪ KHÓA TÌM KIẾM
        if (currentSearch !== '') {
            processedBooks = processedBooks.filter(book => {
                return book.innerText.toLowerCase().includes(currentSearch);
            });
        }

        // BƯỚC 3: PHÂN TRANG
        const totalPages = Math.ceil(processedBooks.length / itemsPerPage);
        
        // Xử lý trường hợp trang hiện tại lớn hơn tổng trang mới 
        if (currentPage > totalPages) currentPage = 1;
        if (totalPages === 0) currentPage = 1;

        // Ẩn tất cả trước khi vẽ lại
        allBooks.forEach(book => book.style.setProperty('display', 'none', 'important'));

        // Tính toán sách cần hiện
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        
        // Hiện sách
        processedBooks.slice(start, end).forEach(book => {
            book.style.removeProperty('display');
            // Animation nhẹ
            book.style.opacity = '0';
            setTimeout(() => book.style.opacity = '1', 50);
        });

        // Cập nhật thanh phân trang
        renderPagination(totalPages);
        
        // Hiện thanh phân trang nếu có nhiều hơn 1 trang
        paginationContainer.style.display = totalPages > 1 ? 'flex' : 'none';
    }

    // --- HÀM VẼ THANH PHÂN TRANG ---
    function renderPagination(totalPages) {
        paginationContainer.innerHTML = '';
        if (totalPages <= 1) return;

        // Nút Trước
        paginationContainer.innerHTML += `
            <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
                <a class="page-link text-dark" href="javascript:void(0)" onclick="window.changePage(${currentPage - 1})">Trước</a>
            </li>`;

        // Các nút số
        for (let i = 1; i <= totalPages; i++) {
            const activeClass = i === currentPage ? 'active' : '';
            const styleClass = i === currentPage ? 'bg-dark border-dark text-white' : 'text-dark';
            paginationContainer.innerHTML += `
                <li class="page-item ${activeClass}">
                    <a class="page-link ${styleClass}" href="javascript:void(0)" onclick="window.changePage(${i})">${i}</a>
                </li>`;
        }

        // Nút Sau
        paginationContainer.innerHTML += `
            <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
                <a class="page-link text-dark" href="javascript:void(0)" onclick="window.changePage(${currentPage + 1})">Sau</a>
            </li>`;
    }

    // --- ĐƯA CÁC HÀM RA NGOÀI (GLOBAL) ĐỂ HTML GỌI ĐƯỢC ---
    
    // 1. Hàm gọi khi bấm nút Lọc
    window.setFilter = function(type) {
        currentFilter = type;
        currentPage = 1; // Reset về trang 1 khi lọc
        updateDisplay();
    };

    // 2. Hàm gọi khi chuyển trang
    window.changePage = function(page) {
        if (page < 1) return;
        currentPage = page;
        updateDisplay();
        container.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    // 3. Lắng nghe sự kiện tìm kiếm
    if (searchInput) {
        searchInput.addEventListener('keyup', function() {
            currentSearch = this.value.toLowerCase().trim();
            currentPage = 1; 
            updateDisplay();
        });
    }

    // Khởi chạy lần đầu
    updateDisplay();
});