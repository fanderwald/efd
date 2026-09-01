const sliders = document.querySelectorAll('.impact-scroll');

sliders.forEach(slider => {
        const scroller = slider.querySelector('.impact-scroll-list-scroll');
        const prevButton = slider.querySelector('.scroll-arrow--prev');
        const nextButton = slider.querySelector('.scroll-arrow--next');
        const firstCard = slider.querySelector('.impact-card');
        
        // ✨ 1. Select the progress bar thumb element
        //const progressBarThumb = slider.querySelector('.progress-bar__thumb');

        if (!scroller || !prevButton || !nextButton || !firstCard) {
            return;
        }
        
        // --- Function to check scroll position and update buttons ---
        function updateButtonState() {
            const scrollLeft = scroller.scrollLeft;
            const scrollWidth = scroller.scrollWidth;
            const clientWidth = scroller.clientWidth;

            prevButton.disabled = scrollLeft < 1;
            nextButton.disabled = scrollLeft + clientWidth >= scrollWidth - 1;
        }
        
        // ✨ 2. Create a function to update the progress bar
        /* function updateProgressBar() {
            const scrollLeft = scroller.scrollLeft;
            const scrollableWidth = scroller.scrollWidth - scroller.clientWidth;

            if (scrollableWidth === 0) {
                progressBarThumb.style.width = '0%';
                return;
            }
            
            const progressPercent = (scrollLeft / scrollableWidth) * 100;
            progressBarThumb.style.width = `${progressPercent}%`;
        } */

        // ✨ 3. Call both update functions on scroll
        scroller.addEventListener('scroll', () => {
            updateButtonState();
            //updateProgressBar();
        });

        // ✨ 4. Initial check when the page loads for both functions
        updateButtonState();
        //updateProgressBar();

        // --- Button-click logic from your code ---
        const cardStyle = window.getComputedStyle(firstCard);
        const cardMarginRight = parseInt(cardStyle.marginRight) || 36;
        const cardWidth = firstCard.offsetWidth;
        const scrollAmount = cardWidth + cardMarginRight;

        nextButton.addEventListener('click', () => {
            scroller.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        });

        prevButton.addEventListener('click', () => {
            scroller.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        });
    });