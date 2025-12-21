      document.addEventListener("DOMContentLoaded", function() {
        const loader = document.querySelector('.page-loader');
        if (loader) {
            setTimeout(() => {
                loader.classList.add('hidden'); 
            }, 100);
        }
        const animatedElements = document.querySelectorAll('.animate-up, .animate-down, .horizontal-fade-banner');
        animatedElements.forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
            el.style.visibility = 'visible';
        });

        if (typeof renderHistory === 'function') {
            renderHistory();
        }
    });