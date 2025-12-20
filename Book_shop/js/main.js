// ======================
// BUTTON HOVER EFFECT - Mouse-following Radial Gradient
// ======================

document.addEventListener('DOMContentLoaded', function() {
    // Get all buttons with btn-custom class
    const buttons = document.querySelectorAll('.btn-custom');
    
    buttons.forEach(button => {
        button.addEventListener('mousemove', function(e) {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Calculate percentage position
            const xPercent = (x / rect.width) * 100;
            const yPercent = (y / rect.height) * 100;
            
            // Set CSS variables
            button.style.setProperty('--x', xPercent + '%');
            button.style.setProperty('--y', yPercent + '%');
        });
        
        button.addEventListener('mouseleave', function() {
            // Reset to center when mouse leaves
            button.style.setProperty('--x', '50%');
            button.style.setProperty('--y', '50%');
        });
    });
});

// ======================
// SEARCH FUNCTIONALITY
// ======================

document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    
    if (searchInput && searchBtn) {
        searchBtn.addEventListener('click', performSearch);
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }
    
    function performSearch() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        
        if (!searchTerm) {
            // Show all books if search is empty
            showAllBooks();
            return;
        }
        
        const bookItems = document.querySelectorAll('.book-item');
        let foundCount = 0;
        
        bookItems.forEach(item => {
            const bookName = item.getAttribute('data-book').toLowerCase();
            const bookTitle = item.querySelector('h4').textContent.toLowerCase();
            
            if (bookName.includes(searchTerm) || bookTitle.includes(searchTerm)) {
                item.style.display = 'block';
                foundCount++;
            } else {
                item.style.display = 'none';
            }
        });
        
        // Optional: Show message if no results
        if (foundCount === 0) {
            console.log('Không tìm thấy sách phù hợp');
        }
    }
    
    function showAllBooks() {
        const bookItems = document.querySelectorAll('.book-item');
        bookItems.forEach(item => {
            item.style.display = 'block';
        });
    }
});

// ======================
// CATEGORY FILTER
// ======================

document.addEventListener('DOMContentLoaded', function() {
    const categoryFilter = document.getElementById('categoryFilter');
    
    if (categoryFilter) {
        categoryFilter.addEventListener('change', function() {
            const selectedCategory = this.value;
            const categoryGroups = document.querySelectorAll('.category-group');
            
            categoryGroups.forEach(group => {
                const groupCategory = group.getAttribute('data-category');
                
                if (selectedCategory === 'all') {
                    group.style.display = 'block';
                } else if (groupCategory === selectedCategory) {
                    group.style.display = 'block';
                } else {
                    group.style.display = 'none';
                }
            });
        });
    }
});
