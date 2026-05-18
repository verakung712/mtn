document.addEventListener("DOMContentLoaded", function() {
    
    // 1. MINI-BOOK INTERNAL PAGE FLIP SYSTEM
    window.flipBook = function(button) {
        const bookContainer = button.closest('.mini-book');
        const pages = bookContainer.querySelectorAll('.book-page');
        let activeIndex = 0;

        pages.forEach((page, index) => {
            if(page.classList.contains('active')) {
                activeIndex = index;
            }
        });

        pages[activeIndex].classList.remove('active');
        let nextIndex = (activeIndex + 1) % pages.length;
        pages[nextIndex].classList.add('active');
    };

    // 2. STEPHEN SCAFF WIPE SLIDER INTERACTION ENGINE
    const slides = document.querySelectorAll(".slide");
    const navLinks = document.querySelectorAll(".nav-link");
    
    let currentIdx = 0;
    let isAnimating = false;
    const totalSlides = slides.length;

    function transitionToSlide(targetIdx) {
        if (targetIdx < 0 || targetIdx >= totalSlides || targetIdx === currentIdx) return;
        
        isAnimating = true;
        
        slides.forEach((slide, idx) => {
            slide.classList.remove("active", "previous");
            
            if (idx === targetIdx) {
                slide.classList.add("active");
            } else if (idx < targetIdx) {
                slide.classList.add("previous");
            }
        });

        navLinks.forEach(link => {
            link.classList.remove("active");
            if (parseInt(link.getAttribute("data-index")) === targetIdx) {
                link.classList.add("active");
            }
        });

        currentIdx = targetIdx;

        setTimeout(() => {
            isAnimating = false;
        }, 1100);
    }

    // CONNECTING ALTERNATE PREV / NEXT NAV BUTTONS
    document.getElementById("global-prev").addEventListener("click", function() {
        if (!isAnimating) {
            transitionToSlide(currentIdx - 1);
        }
    });

    document.getElementById("global-next").addEventListener("click", function() {
        if (!isAnimating) {
            transitionToSlide(currentIdx + 1);
        }
    });

    window.addEventListener("wheel", function(event) {
        if (isAnimating) return;

        if (event.deltaY > 0) {
            transitionToSlide(currentIdx + 1);
        } else if (event.deltaY < 0) {
            transitionToSlide(currentIdx - 1);
        }
    }, { passive: true });

    navLinks.forEach(link => {
        link.addEventListener("click", function(e) {
            e.preventDefault();
            if (isAnimating) return;
            
            const targetIndex = parseInt(this.getAttribute("data-index"));
            transitionToSlide(targetIndex);
        });
    });

    let touchStartY = 0;
    window.addEventListener("touchstart", function(e) {
        touchStartY = e.touches[0].clientY;
    }, { passive: true });

    window.addEventListener("touchend", function(e) {
        if (isAnimating) return;
        let touchEndY = e.changedTouches[0].clientY;
        
        if (touchStartY - touchEndY > 50) {
            transitionToSlide(currentIdx + 1);
        } else if (touchEndY - touchStartY > 50) {
            transitionToSlide(currentIdx - 1);
        }
    }, { passive: true });
});