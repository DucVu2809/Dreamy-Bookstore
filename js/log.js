          document.addEventListener('DOMContentLoaded', () => {
            renderHistory();
        });

        function renderHistory() {
            const history = JSON.parse(localStorage.getItem('viewedBooks')) || [];
            const tbody = document.getElementById('historyList');
            const emptyState = document.getElementById('emptyHistory');

            // Reset bảng
            tbody.innerHTML = '';

            if (history.length === 0) {
                // Nếu không có lịch sử -> Ẩn bảng, hiện thông báo trống
                document.querySelector('.table-responsive').style.display = 'none';
                document.querySelector('.btn-outline-danger').style.display = 'none'; // Ẩn nút xóa
                emptyState.classList.remove('d-none');
                return;
            }

            // Nếu có dữ liệu -> Vẽ ra
            history.forEach((book, index) => {
                const row = `
                    <tr>
                        <td class="ps-4">
                            <div class="d-flex align-items-center">
                                <img src="${book.img}" alt="${book.title}" 
                                     class="rounded-3 shadow-sm" style="width: 60px; height: 80px; object-fit: cover;">
                                <div class="ms-3">
                                    <h6 class="mb-1 brand-font text-dark">${book.title}</h6>
                                    <span class="text-muted small fst-italic">Tiểu thuyết</span>
                                </div>
                            </div>
                        </td>
                        <td class="fw-bold text-secondary">${parseInt(book.price).toLocaleString('vi-VN')} đ</td>
                        <td class="text-end pe-4">
                            <button onclick="addToCartFromHistory(${book.id})" class="btn btn-sm btn-dark rounded-pill px-3">
                                Thêm vào giỏ
                            </button>
                            <button onclick="removeFromHistory(${index})" class="btn btn-sm btn-link text-muted p-0 ms-2">
                                <i class="bi bi-x-lg"></i>
                            </button>
                        </td>
                    </tr>
                `;
                tbody.innerHTML += row;
            });
        }

        // Hàm xóa 1 cuốn khỏi lịch sử
        function removeFromHistory(index) {
            let history = JSON.parse(localStorage.getItem('viewedBooks')) || [];
            history.splice(index, 1); // Xóa phần tử tại vị trí index
            localStorage.setItem('viewedBooks', JSON.stringify(history));
            renderHistory(); // Vẽ lại bảng
        }

        // Hàm xóa tất cả
        function clearHistory() {
            localStorage.removeItem('viewedBooks');
            renderHistory();
            // Có thể thêm hiệu ứng reload trang nếu muốn: location.reload();
        }

        // Hàm giả lập thêm vào giỏ (Bạn kết nối với logic giỏ hàng thật của bạn nhé)
        function addToCartFromHistory(id) {
            alert("Đã thêm sách ID: " + id + " vào giỏ hàng!");
            // Gọi hàm addToCart(id) thật của bạn ở đây
        }