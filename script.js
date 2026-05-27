// header=============================

document.addEventListener('DOMContentLoaded', () => {
    const header = document.getElementById('main-header');

    // Add shadow and shrink padding when user scrolls down
    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
});




document.addEventListener('DOMContentLoaded', () => {
    // ---- FILTER LOGIC ----
    const checkboxes = document.querySelectorAll('.custom-checkbox input');
    const products = document.querySelectorAll('.product-card');
    const clearBtn = document.getElementById('clearFilters');

    function filterProducts() {
        // Get all checked values
        const checkedValues = Array.from(checkboxes)
                                   .filter(input => input.checked)
                                   .map(input => input.value);

        if (checkedValues.length === 0) {
            // If no checkboxes are checked, show all products
            products.forEach(product => {
                product.style.display = 'flex';
                product.style.animation = 'fadeIn 0.5s ease';
            });
            return;
        }

        products.forEach(product => {
            // Check if the product has ANY of the classes matching the checked values
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

    // Attach event listeners to checkboxes
    checkboxes.forEach(box => {
        box.addEventListener('change', filterProducts);
    });

    // Clear Filters logic
    clearBtn.addEventListener('click', (e) => {
        e.preventDefault();
        checkboxes.forEach(box => box.checked = false);
        filterProducts(); // Reset view
    });
});




document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('productModal');
    const closeBtn = document.querySelector('.close-modal');
    const productCards = document.querySelectorAll('.product-card');
    
    // Elements to update dynamically
    const modalImg = document.getElementById('modal-main-img');
    const modalTitle = document.getElementById('modal-title');
    const modalSubtitle = document.getElementById('modal-subtitle');
    const modalNewPrice = document.getElementById('modal-new-price');
    const modalOldPrice = document.getElementById('modal-old-price');
    const modalDiscount = document.getElementById('modal-discount');
    
    // NAYA CODE: Buy button ko select kiya
    const modalBuyBtn = document.getElementById('modal-buy-btn');

    if(productCards.length > 0 && modal) {
        productCards.forEach(card => {
            card.addEventListener('click', () => {
                // Extract data
                const imgSrc = card.querySelector('.img-box img').src;
                const title = card.querySelector('h3').innerText;
                const subtitle = card.querySelector('.subtitle').innerText;
                const newPrice = card.querySelector('.new-price').innerText;
                const oldPrice = card.querySelector('.old-price').innerText;
                const discountBadge = card.querySelector('.discount-badge');

                // Get custom attributes
                const slide2Img = card.getAttribute('data-slide2') || 'https://dummyimage.com/300x400/0056d2/fff&text=Preview';
                const slide3Img = card.getAttribute('data-slide3') || 'https://dummyimage.com/300x400/0056d2/fff&text=Index';
                
                // NAYA CODE: Card se custom buy link nikalo (agar na ho toh default # rahega)
                const buyLink = card.getAttribute('data-buy-link') || '#';

                // Set data into Modal
                modalImg.src = imgSrc;
                document.getElementById('modal-slide-2').src = slide2Img;
                document.getElementById('modal-slide-3').src = slide3Img;
                
                // NAYA CODE: Modal ke button ka href update kar do
                modalBuyBtn.href = buyLink;
                
                modalTitle.innerText = title;
                modalSubtitle.innerText = subtitle;
                modalNewPrice.innerText = newPrice;
                modalOldPrice.innerText = oldPrice;
                
                if (newPrice.trim().toUpperCase() === "FREE") {
                    modalNewPrice.style.color = "#27ae60";
                } else {
                    modalNewPrice.style.color = "#1a1a1a";
                }

                if(discountBadge) {
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

        // ... baaki ka close modal aur carousel ka code same rahega ...

    // Close Modal
    closeBtn.addEventListener('click', closeModal);
    
    // Close Modal on clicking outside the box
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    function closeModal() {
        modal.classList.remove('show');
        setTimeout(() => { modal.style.display = 'none'; }, 300); // Wait for transition
    }

    // --- CAROUSEL SLIDE LOGIC ---
    let slideIndex = 0;
    
    // Global functions for inline HTML onclick attributes
    window.moveSlide = function(n) {
        showSlides(slideIndex += n);
    }
    
    window.currentSlide = function(n) {
        showSlides(slideIndex = n);
    }

    function showSlides(n) {
        let i;
        let slides = document.querySelectorAll(".slide");
        let dots = document.querySelectorAll(".dot");
        
        if (n >= slides.length) {slideIndex = 0}    
        if (n < 0) {slideIndex = slides.length - 1}
        
        for (i = 0; i < slides.length; i++) {
            slides[i].classList.remove("active");  
        }
        for (i = 0; i < dots.length; i++) {
            dots[i].classList.remove("active");
        }
        
        slides[slideIndex].classList.add("active");  
        dots[slideIndex].classList.add("active");
    }
});



// --- STANDARD SCROLL REVEAL LOGIC ---
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15 // Section visibility before trigger
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
            observer.unobserve(entry.target); // Stop observing after animation
        }
    });
}, observerOptions);

// Target all elements with '.hidden' class
document.querySelectorAll('.hidden').forEach((el) => observer.observe(el));






document.addEventListener('DOMContentLoaded', () => {
    // --- REVIEWS GOOGLE SHEETS LOGIC ---
    const reviewForm = document.getElementById('review-form');
    const reviewGrid = document.getElementById('review-grid');

    // Tumhara live Web App URL
    const scriptURL = 'https://script.google.com/macros/s/AKfycbxtPDjGrRlicUX7uFCW2Gdgh8T4C3SL4DmAGVFBRN29cBPj5NSXEu09xkGBtOlOp2HS/exec';

    // UI Loading state
    if(reviewGrid) {
        reviewGrid.innerHTML = '<p style="text-align:center; color:#666;">Loading authentic reviews...</p>';
    }

    // Function to Generate Stars HTML
    function getStarsHTML(rating) {
        let stars = '';
        for(let i=0; i<5; i++) {
            if(i < rating) stars += '<i class="fas fa-star"></i>';
            else stars += '<i class="far fa-star"></i>';
        }
        return stars;
    }

    // Function to Render Reviews
    function renderReviews(reviews) {
        if(!reviewGrid) return;
        reviewGrid.innerHTML = ''; // Clear loading text
        
        if (!reviews || reviews.length === 0) {
            reviewGrid.innerHTML = '<p style="text-align:center; color:#666;">No reviews yet. Be the first to review!</p>';
            return;
        }

        // Loop through reviews in reverse (newest on top)
        for (let i = reviews.length - 1; i >= 0; i--) {
            const review = reviews[i];
            const initial = review.name ? review.name.charAt(0).toUpperCase() : 'U';
            
            // Fix Date Format (Convert ISO string to readable date)
            let formattedDate = review.date;
            try {
                const dateObj = new Date(review.date);
                if (!isNaN(dateObj)) {
                    const options = { year: 'numeric', month: 'short', day: 'numeric' };
                    formattedDate = dateObj.toLocaleDateString('en-IN', options);
                }
            } catch(e) {
                // Keep original if parsing fails
            }
            
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
                    <div class="review-content">
                        "${review.text}"
                    </div>
                </div>
            `;
            reviewGrid.insertAdjacentHTML('beforeend', reviewHTML);
        }
    }



    

    // --- 1. GET REVIEWS ON PAGE LOAD ---
    if(reviewGrid) {
        fetch(scriptURL)
            .then(response => response.json())
            .then(data => {
                renderReviews(data);
            })
            .catch(error => {
                console.error('Error fetching reviews:', error);
                reviewGrid.innerHTML = '<p style="text-align:center; color:red;">Failed to load reviews. Please check your connection.</p>';
            });
    }

    // --- 2. POST NEW REVIEW TO GOOGLE SHEET ---
    if(reviewForm) {
        const submitBtn = reviewForm.querySelector('button[type="submit"]');

        reviewForm.addEventListener('submit', (e) => {
            e.preventDefault(); 
            submitBtn.innerText = "Posting...";
            submitBtn.disabled = true;

            // Generate Today's Date
            const options = { year: 'numeric', month: 'short', day: 'numeric' };
            const today = new Date().toLocaleDateString('en-US', options);

            // Prepare Data for Google Sheet
            const formData = new FormData();
            formData.append('name', document.getElementById('reviewer-name').value);
            formData.append('rating', document.getElementById('review-rating').value);
            formData.append('text', document.getElementById('review-text').value);
            formData.append('date', today);

            // Send to Apps Script
            fetch(scriptURL, { method: 'POST', body: formData })
                .then(response => {
                    alert("Thanks! Your review is now live.");
                    reviewForm.reset();
                    submitBtn.innerText = "Post Review";
                    submitBtn.disabled = false;
                    
                    // Reload reviews instantly after posting
                    reviewGrid.innerHTML = '<p style="text-align:center; color:#666;">Refreshing reviews...</p>';
                    return fetch(scriptURL);
                })
                .then(res => res.json())
                .then(data => {
                    renderReviews(data);
                })
                .catch(error => {
                    console.error('Error posting review:', error);
                    // Fallback for CORS mode 'no-cors' success (often Apps Script returns CORS error even on success)
                    alert("Thanks! Your review has been submitted (it might take a moment to appear).");
                    reviewForm.reset();
                    submitBtn.innerText = "Post Review";
                    submitBtn.disabled = false;
                });
        });
    }
});






document.addEventListener('DOMContentLoaded', () => {
    // --- CONTACT FORM LOGIC (Web3Forms) ---
    const contactForm = document.getElementById('contact-form');
    const contactResult = document.getElementById('contact-result');
    const contactSubmitBtn = document.getElementById('contact-submit-btn');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // UI Loading State
            contactSubmitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            contactSubmitBtn.disabled = true;
            contactResult.style.display = "none";

            const formData = new FormData(contactForm);
            const object = Object.fromEntries(formData);
            const json = JSON.stringify(object);

            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: json
            })
            .then(async (response) => {
                let jsonResponse = await response.json();
                if (response.status === 200) {
                    // Success
                    contactResult.innerHTML = "✅ Message sent successfully! We will get back to you soon.";
                    contactResult.style.color = "#27ae60";
                    contactForm.reset();
                } else {
                    // API Error
                    console.log(response);
                    contactResult.innerHTML = jsonResponse.message;
                    contactResult.style.color = "#dc3545";
                }
            })
            .catch(error => {
                // Network Error
                console.log(error);
                contactResult.innerHTML = "❌ Something went wrong. Please try again later.";
                contactResult.style.color = "#dc3545";
            })
            .then(function() {
                // Reset UI
                contactResult.style.display = "block";
                contactSubmitBtn.innerHTML = '<i class="fas fa-paper-plane" style="margin-right: 8px;"></i> Send Message';
                contactSubmitBtn.disabled = false;
                
                // Hide success message after 5 seconds
                setTimeout(() => {
                    contactResult.style.display = "none";
                }, 5000);
            });
        });
    }
});