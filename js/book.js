    function showQuickView(element) {
        // 1. Lấy dữ liệu (như cũ)
        const title = element.getAttribute('data-title');
        const author = element.getAttribute('data-author');
        const price = element.getAttribute('data-price');
        const img = element.getAttribute('data-img');
        const desc = element.getAttribute('data-desc');

        // Lấy ID và Giá dạng số
        const id = element.getAttribute('data-id') || '0'; 
        const rawPrice = price.replace(/\D/g, ''); // Chuyển "150.000 ₫" thành "150000"

        // --- [ĐOẠN MỚI THÊM VÀO ĐÂY] ---
        // Gọi hàm lưu lịch sử xem (Hàm này phải có trong script.js như bước trước đã làm)
        addToHistory({
            id: id,
            title: title,
            price: rawPrice, // Lưu giá gốc (số) để sau này dễ tính toán
            img: img,
            author: author
        });
        // -------------------------------

        // 2. Gán dữ liệu vào Modal
        document.getElementById('modal-title').innerText = title;
        document.getElementById('modal-author').innerText = "Tác giả: " + author;
        document.getElementById('modal-price').innerText = price;
        document.getElementById('modal-img').src = img;
        document.getElementById('modal-desc').innerHTML = desc ? desc : "Đang cập nhật mô tả...";

        // 3. Cập nhật dữ liệu cho nút "Thêm vào giỏ" trong Modal
        const modalBtn = document.getElementById('modal-add-btn');
        if (modalBtn) {
            modalBtn.setAttribute('data-id', id);
            modalBtn.setAttribute('data-title', title);
            modalBtn.setAttribute('data-price', rawPrice);
            modalBtn.setAttribute('data-img', img);
            modalBtn.setAttribute('data-author', author);
            
            modalBtn.onclick = function() { addToCart(this); };
        }

        // 4. Hiển thị Modal
        var myModal = new bootstrap.Modal(document.getElementById('bookDetailModal'));
        myModal.show();
    }

    function searchBooks() {
    // 1. Lấy từ khóa tìm kiếm và chuyển về chữ thường
    let input = document.getElementById('searchInput').value.toLowerCase();
    
    // 2. Lấy danh sách tất cả các thẻ sách (cần class .book-card-hover hoặc col tương ứng)
    let books = document.querySelectorAll('.col-6.col-md-4.col-lg-3'); 

    // 3. Duyệt qua từng cuốn sách
    books.forEach(book => {
        // Tìm thẻ chứa tiêu đề sách để lấy tên
        let titleElement = book.querySelector('.card-title');
        
        if (titleElement) {
            let titleText = titleElement.innerText.toLowerCase();
            
            // 4. Kiểm tra: Nếu tên sách chứa từ khóa -> Hiện, ngược lại -> Ẩn
            if (titleText.includes(input)) {
                book.classList.remove('d-none'); // Hiện
            } else {
                book.classList.add('d-none'); // Ẩn (dùng class d-none của Bootstrap)
            }
        }
    });
}

    function sortBooks(selectElement) {
    const sortType = selectElement.value;
    const bookList = document.getElementById('book-list');
    
    // Nếu chưa đặt ID cho row chứa sách thì báo lỗi để biết
    if (!bookList) {
        console.error("Lỗi: Bạn chưa thêm id='book-list' vào thẻ div class='row' chứa các cuốn sách!");
        return;
    }

    // 1. Lấy tất cả các thẻ sách (các thẻ con trực tiếp của #book-list)
    // Array.from dùng để chuyển NodeList sang Mảng để dùng hàm sort
    const books = Array.from(bookList.children);

    // 2. Thực hiện sắp xếp
    books.sort((a, b) => {
        // Tìm phần tử chứa dữ liệu (nút mua hàng hoặc thẻ a) để lấy giá và tên
        // Chúng ta tìm phần tử có thuộc tính data-price bên trong mỗi thẻ sách
        const dataA = a.querySelector('[data-price]');
        const dataB = b.querySelector('[data-price]');

        // Lấy giá trị tên và giá
        const titleA = dataA.getAttribute('data-title').toLowerCase();
        const titleB = dataB.getAttribute('data-title').toLowerCase();
        
        // Lấy giá (chuyển về số nguyên)
        const priceA = parseInt(dataA.getAttribute('data-price'));
        const priceB = parseInt(dataB.getAttribute('data-price'));

        // Logic so sánh
        if (sortType === 'name-asc') {
            // So sánh chuỗi (tiếng Việt ok)
            return titleA.localeCompare(titleB);
        } else if (sortType === 'price-asc') {
            // Giá thấp -> cao
            return priceA - priceB;
        } else if (sortType === 'price-desc') {
            // Giá cao -> thấp
            return priceB - priceA;
        }
    });

    // 3. Xóa danh sách cũ và thêm lại danh sách đã sắp xếp
    bookList.innerHTML = "";
    books.forEach(book => bookList.appendChild(book));
}

    // Hàm xử lý khi chọn một mục trong Dropdown mới
    function selectSort(element, sortType) {
        // 1. Ngăn thẻ a tải lại trang
        event.preventDefault();

        // 2. Cập nhật giao diện (đổi chữ trên nút bấm)
        let text = element.innerText;
        document.getElementById('currentSortLabel').innerText = text;

        // 3. Xử lý class 'active' (đánh dấu dòng đang chọn)
        // Xóa active cũ
        let items = document.querySelectorAll('.dropdown-item');
        items.forEach(item => item.classList.remove('active'));
        // Thêm active cho dòng mới bấm
        element.classList.add('active');

        // 4. Gọi hàm sắp xếp sách (Sử dụng lại logic cũ của bạn)
        // Chúng ta giả lập một object có thuộc tính value để hàm sortBooks cũ hiểu được
        sortBooks({ value: sortType });
    }


    
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
        // BƯỚC 1: LỌC THEO LOẠI (Logic Chẵn/Lẻ bạn cần)
        let processedBooks = allBooks.filter(book => {
            // Tìm thẻ có chứa data-id (thẻ a, button hoặc chính thẻ book)
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
        
        // Xử lý trường hợp trang hiện tại lớn hơn tổng trang mới (vd: đang trang 2 mà lọc xong chỉ còn 1 trang)
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
