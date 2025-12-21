        var swiper = new Swiper(".myBookSwiper", {
            slidesPerView: 2,
            spaceBetween: 20,
            loop: true,
            autoplay: {
                delay: 5000,
                disableOnInteraction: false,
            },
            navigation: {
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev",
            },
            breakpoints: {
                640: { slidesPerView: 2, spaceBetween: 20 },
                768: { slidesPerView: 3, spaceBetween: 30 },
                1024: { slidesPerView: 4, spaceBetween: 30 },
            },
        });
                document.addEventListener("DOMContentLoaded", function() {
            const revealElements = document.querySelectorAll('.reveal-item');

            const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('active');
                    } else {
                        entry.target.classList.remove('active');
                    }
                });
            }, {
                threshold: 0.2,
                rootMargin: "0px 0px -50px 0px"
            });

            revealElements.forEach((el) => observer.observe(el));

        });

        window.openBookDetailModal = function(element) {
            // 1. Lấy dữ liệu từ thẻ được click
            const id = element.getAttribute('data-id');
            const img = element.getAttribute('data-img');
            const title = element.getAttribute('data-title');
            const author = element.getAttribute('data-author');
            const price = element.getAttribute('data-price'); 
            const priceNum = element.getAttribute('data-price-num') || price.replace(/\D/g,''); 
            const desc = element.getAttribute('data-desc');

            // 2. Điền dữ liệu vào các thẻ Text/Ảnh
            const modalImg = document.getElementById('modalBookImg');
            const modalTitle = document.getElementById('modalBookTitle');
            const modalAuthor = document.getElementById('modalBookAuthor');
            const modalPrice = document.getElementById('modalBookPrice');
            const modalDesc = document.getElementById('modalBookDesc');

            if (modalImg) modalImg.src = img;
            if (modalTitle) modalTitle.innerText = title;
            if (modalAuthor) modalAuthor.innerText = author || '';
            if (modalPrice) modalPrice.innerText = price;
            if (modalDesc) modalDesc.innerText = desc || 'Chưa có mô tả.';

            // 3. Cập nhật dữ liệu cho nút "Thêm vào giỏ" trong Modal
            const modalBtn = document.getElementById('modalBookBtn');
            if (modalBtn) {
                modalBtn.setAttribute('data-id', id || 'unknown');
                modalBtn.setAttribute('data-title', title);
                modalBtn.setAttribute('data-price', priceNum); 
                modalBtn.setAttribute('data-img', img);
            }

            // 4. Hiện Modal
            const modalElement = document.getElementById('bookDetailModal');
            if (modalElement) {
                const myModal = new bootstrap.Modal(modalElement);
                myModal.show();
            }
        };
    
