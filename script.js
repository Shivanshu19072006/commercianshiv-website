// ==========================================
// 1. HEADER LOGIC
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const header = document.getElementById('main-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
});

// ==========================================
// 2. FILTER LOGIC
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const checkboxes = document.querySelectorAll('.custom-checkbox input');
    const products = document.querySelectorAll('.product-card');
    const clearBtn = document.getElementById('clearFilters');

    if (checkboxes.length > 0) {
        function filterProducts() {
            const checkedValues = Array.from(checkboxes).filter(input => input.checked).map(input => input.value);
            if (checkedValues.length === 0) {
                products.forEach(product => {
                    product.style.display = 'flex';
                    product.style.animation = 'fadeIn 0.5s ease';
                });
                return;
            }
            products.forEach(product => {
                const productClasses = Array.from(product.classList);
                const matchesFilter = checkedValues.some(val => productClasses.includes(val));
                if (matchesFilter) {
                    product.style.display = 'flex';
                    product.style.animation = 'fadeIn 0.5s ease';
                } else {
                    product.style.display = 'none';
                }
            });
        }

        checkboxes.forEach(box => box.addEventListener('change', filterProducts));

        if (clearBtn) {
            clearBtn.addEventListener('click', (e) => {
                e.preventDefault();
                checkboxes.forEach(box => box.checked = false);
                filterProducts(); 
            });
        }
    }
});

// ==========================================
// 3. PRODUCT MODAL & CAROUSEL (FIXED SYNTAX)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('productModal');
    const closeBtn = document.querySelector('.close-modal');
    const productCards = document.querySelectorAll('.product-card');

    const modalImg = document.getElementById('modal-main-img');
    const modalTitle = document.getElementById('modal-title');
    const modalSubtitle = document.getElementById('modal-subtitle');
    const modalNewPrice = document.getElementById('modal-new-price');
    const modalOldPrice = document.getElementById('modal-old-price');
    const modalDiscount = document.getElementById('modal-discount');
    const modalBuyBtn = document.getElementById('modal-buy-btn');

    if (productCards.length > 0 && modal) {
        productCards.forEach(card => {
            card.addEventListener('click', () => {
                const imgSrc = card.querySelector('.img-box img').src;
                const title = card.querySelector('h3').innerText;
                const subtitle = card.querySelector('.subtitle').innerText;
                const newPrice = card.querySelector('.new-price').innerText;
                const oldPrice = card.querySelector('.old-price').innerText;
                const discountBadge = card.querySelector('.discount-badge');

                const slide2Img = card.getAttribute('data-slide2') || 'https://dummyimage.com/300x400/0056d2/fff&text=Preview';
                const slide3Img = card.getAttribute('data-slide3') || 'https://dummyimage.com/300x400/0056d2/fff&text=Index';
                const buyLink = card.getAttribute('data-buy-link') || '#';

                modalImg.src = imgSrc;
                document.getElementById('modal-slide-2').src = slide2Img;
                document.getElementById('modal-slide-3').src = slide3Img;
                if(modalBuyBtn) modalBuyBtn.href = buyLink;

                modalTitle.innerText = title;
                modalSubtitle.innerText = subtitle;
                modalNewPrice.innerText = newPrice;
                modalOldPrice.innerText = oldPrice;

                if (newPrice.trim().toUpperCase() === "FREE") {
                    modalNewPrice.style.color = "#27ae60";
                } else {
                    modalNewPrice.style.color = "#1a1a1a";
                }

                if (discountBadge) {
                    modalDiscount.innerText = discountBadge.innerText;
                    modalDiscount.style.display = "inline-block";
                } else {
                    modalDiscount.style.display = "none";
                }

                slideIndex = 0;
                showSlides(slideIndex);
                modal.style.display = 'flex';
                setTimeout(() => { modal.classList.add('show'); }, 10);
            });
        });
    } // <--- YAHAN MISSING THA BRACKET JO FIX KAR DIYA HAI

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    window.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

    function closeModal() {
        modal.classList.remove('show');
        setTimeout(() => { modal.style.display = 'none'; }, 300); 
    }

    let slideIndex = 0;
    window.moveSlide = function (n) { showSlides(slideIndex += n); }
    window.currentSlide = function (n) { showSlides(slideIndex = n); }

    function showSlides(n) {
        let i;
        let slides = document.querySelectorAll(".slide");
        let dots = document.querySelectorAll(".dot");
        if(slides.length === 0) return;

        if (n >= slides.length) { slideIndex = 0 }
        if (n < 0) { slideIndex = slides.length - 1 }

        for (i = 0; i < slides.length; i++) { slides[i].classList.remove("active"); }
        for (i = 0; i < dots.length; i++) { dots[i].classList.remove("active"); }

        slides[slideIndex].classList.add("active");
        if(dots[slideIndex]) dots[slideIndex].classList.add("active");
    }
});

// ==========================================
// 4. SCROLL REVEAL LOGIC
// ==========================================
const observerOptions = { root: null, rootMargin: '0px', threshold: 0.15 };
const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);
document.querySelectorAll('.hidden').forEach((el) => observer.observe(el));

// ==========================================
// 5. REVIEWS GOOGLE SHEETS LOGIC
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const reviewForm = document.getElementById('review-form');
    const reviewGrid = document.getElementById('review-grid');
    const scriptURL = 'https://script.google.com/macros/s/AKfycbzj8BfGsRTDJ0Il7GgtpWLeJ5Eb40FBmwIDv8uvf7Ci9mcdhRl1Hew_e5bJknPDjIrLUA/exec';

    if (reviewGrid) { reviewGrid.innerHTML = '<p style="text-align:center; color:#666;">Loading authentic reviews...</p>'; }

    function getStarsHTML(rating) {
        let stars = '';
        for (let i = 0; i < 5; i++) {
            if (i < rating) stars += '<i class="fas fa-star"></i>';
            else stars += '<i class="far fa-star"></i>';
        }
        return stars;
    }

    function renderReviews(reviews) {
        if (!reviewGrid) return;
        reviewGrid.innerHTML = ''; 
        if (!reviews || reviews.length === 0) {
            reviewGrid.innerHTML = '<p style="text-align:center; color:#666;">No reviews yet. Be the first to review!</p>';
            return;
        }

        for (let i = reviews.length - 1; i >= 0; i--) {
            const review = reviews[i];
            const initial = review.name ? review.name.charAt(0).toUpperCase() : 'U';
            let formattedDate = review.date;
            try {
                const dateObj = new Date(review.date);
                if (!isNaN(dateObj)) {
                    formattedDate = dateObj.toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
                }
            } catch (e) {}

            const reviewHTML = `
                <div class="user-review-card">
                    <div class="reviewer-header">
                        <div class="reviewer-info">
                            <div class="avatar">${initial}</div>
                            <div>
                                <div class="reviewer-name">${review.name}</div>
                                <div class="review-date"><i class="far fa-calendar-alt"></i> ${formattedDate}</div>
                            </div>
                        </div>
                        <div class="stars">${getStarsHTML(review.rating)}</div>
                    </div>
                    <div class="review-content">"${review.text}"</div>
                </div>
            `;
            reviewGrid.insertAdjacentHTML('beforeend', reviewHTML);
        }
    }

    if (reviewGrid) {
        fetch(scriptURL)
            .then(response => response.json())
            .then(data => renderReviews(data))
            .catch(error => {
                console.error('Error fetching reviews:', error);
                reviewGrid.innerHTML = '<p style="text-align:center; color:red;">Failed to load reviews. Please check your connection.</p>';
            });
    }

    if (reviewForm) {
        const submitBtn = reviewForm.querySelector('button[type="submit"]');
        reviewForm.addEventListener('submit', (e) => {
            e.preventDefault();
            submitBtn.innerText = "Posting...";
            submitBtn.disabled = true;

            const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
            const formData = new FormData();
            formData.append('name', document.getElementById('reviewer-name').value);
            formData.append('rating', document.getElementById('review-rating').value);
            formData.append('text', document.getElementById('review-text').value);
            formData.append('date', today);

            fetch(scriptURL, { method: 'POST', body: formData })
                .then(response => {
                    alert("Thanks! Your review is now live.");
                    reviewForm.reset();
                    submitBtn.innerText = "Post Review";
                    submitBtn.disabled = false;
                    reviewGrid.innerHTML = '<p style="text-align:center; color:#666;">Refreshing reviews...</p>';
                    return fetch(scriptURL);
                })
                .then(res => res.json())
                .then(data => renderReviews(data))
                .catch(error => {
                    console.error('Error posting review:', error);
                    alert("Thanks! Your review has been submitted.");
                    reviewForm.reset();
                    submitBtn.innerText = "Post Review";
                    submitBtn.disabled = false;
                });
        });
    }
});

// ==========================================
// 6. CONTACT FORM LOGIC (Web3Forms)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contact-form');
    const contactResult = document.getElementById('contact-result');
    const contactSubmitBtn = document.getElementById('contact-submit-btn');

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            contactSubmitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            contactSubmitBtn.disabled = true;
            contactResult.style.display = "none";

            const formData = new FormData(contactForm);
            const object = Object.fromEntries(formData);
            const json = JSON.stringify(object);

            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: json
            })
            .then(async (response) => {
                let jsonResponse = await response.json();
                if (response.status === 200) {
                    contactResult.innerHTML = "✅ Message sent successfully! We will get back to you soon.";
                    contactResult.style.color = "#27ae60";
                    contactForm.reset();
                } else {
                    contactResult.innerHTML = jsonResponse.message;
                    contactResult.style.color = "#dc3545";
                }
            })
            .catch(error => {
                contactResult.innerHTML = "❌ Something went wrong. Please try again later.";
                contactResult.style.color = "#dc3545";
            })
            .then(function () {
                contactResult.style.display = "block";
                contactSubmitBtn.innerHTML = '<i class="fas fa-paper-plane" style="margin-right: 8px;"></i> Send Message';
                contactSubmitBtn.disabled = false;
                setTimeout(() => { contactResult.style.display = "none"; }, 5000);
            });
        });
    }
});
