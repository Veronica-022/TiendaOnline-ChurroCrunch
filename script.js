        // Cart functionality
        let cart = [];
        let cartCount = 0;
        let cartTotal = 0;

        // DOM Elements
        const cartIcon = document.getElementById('cart-icon');
        const cartModal = document.getElementById('cart-modal');
        const cartClose = document.getElementById('cart-close');
        const cartItems = document.getElementById('cart-items');
        const cartCountElement = document.getElementById('cart-count');
        const totalPriceElement = document.getElementById('total-price');
        const cartTotalSection = document.getElementById('cart-total');

        // Loading Screen
        window.addEventListener('load', function() {
            const loading = document.getElementById('loading');
            setTimeout(() => {
                loading.classList.add('hidden');
            }, 1000);
        });

        // Header Scroll Effect
        const header = document.getElementById('header');
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });

        // Mobile Menu Toggle
        const hamburger = document.getElementById('hamburger');
        const navMenu = document.getElementById('nav-menu');

        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close mobile menu when clicking on a link
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });

        // Hero Swiper
        const heroSwiper = new Swiper('.hero-swiper', {
            slidesPerView: 1,
            spaceBetween: 0,
            loop: true,
            autoplay: {
                delay: 5000,
                disableOnInteraction: false,
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            effect: 'fade',
            fadeEffect: {
                crossFade: true
            }
        });

        // Tab Functionality
        const tabButtons = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');

        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetTab = button.getAttribute('data-tab');
                
                // Remove active class from all buttons and contents
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));
                
                // Add active class to clicked button and corresponding content
                button.classList.add('active');
                document.getElementById(targetTab).classList.add('active');
            });
        });

        // Cart Modal Functions
        cartIcon.addEventListener('click', () => {
            cartModal.classList.add('active');
            updateCartDisplay();
        });

        cartClose.addEventListener('click', () => {
            cartModal.classList.remove('active');
        });

        cartModal.addEventListener('click', (e) => {
            if (e.target === cartModal) {
                cartModal.classList.remove('active');
            }
        });

        // Add to Cart Functionality
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', function() {
                const name = this.getAttribute('data-name');
                const price = parseInt(this.getAttribute('data-price'));
                
                addToCart(name, price);
                showNotification('¡Producto agregado al carrito!', 'success');
                
                // Button animation
                const originalHTML = this.innerHTML;
                this.innerHTML = '<i class="fas fa-check"></i> ¡Agregado!';
                this.style.background = '#28a745';
                
                setTimeout(() => {
                    this.innerHTML = originalHTML;
                    this.style.background = '';
                }, 2000);
            });
        });

        // Add to Cart Function
        function addToCart(name, price) {
            const existingItem = cart.find(item => item.name === name);
            
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({
                    name: name,
                    price: price,
                    quantity: 1
                });
            }
            
            updateCartCount();
        }

        // Update Cart Count
        function updateCartCount() {
            cartCount = cart.reduce((total, item) => total + item.quantity, 0);
            cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
            
            cartCountElement.textContent = cartCount;
            
            if (cartCount > 0) {
                cartCountElement.style.display = 'flex';
            } else {
                cartCountElement.style.display = 'none';
            }
        }

        // Update Cart Display
        function updateCartDisplay() {
            if (cart.length === 0) {
                cartItems.innerHTML = `
                    <div class="cart-empty">
                        <p>Tu carrito está vacío</p>
                        <p>¡Agrega algunos churros deliciosos!</p>
                    </div>
                `;
                cartTotalSection.style.display = 'none';
            } else {
                cartItems.innerHTML = cart.map(item => `
                    <div class="cart-item">
                        <div class="cart-item-info">
                            <div class="cart-item-name">${item.name}</div>
                            <div class="cart-item-price">${item.price.toLocaleString()}</div>
                        </div>
                        <div class="cart-item-controls">
                            <button class="quantity-btn" onclick="decreaseQuantity('${item.name}')">-</button>
                            <span>${item.quantity}</span>
                            <button class="quantity-btn" onclick="increaseQuantity('${item.name}')">+</button>
                            <button class="quantity-btn" onclick="removeFromCart('${item.name}')" style="background: #dc3545; margin-left: 10px;">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                `).join('');
                
                cartTotalSection.style.display = 'block';
                totalPriceElement.textContent = cartTotal.toLocaleString();
            }
        }

        // Cart Item Controls
        window.increaseQuantity = function(name) {
            const item = cart.find(item => item.name === name);
            if (item) {
                item.quantity += 1;
                updateCartCount();
                updateCartDisplay();
            }
        }

        window.decreaseQuantity = function(name) {
            const item = cart.find(item => item.name === name);
            if (item && item.quantity > 1) {
                item.quantity -= 1;
                updateCartCount();
                updateCartDisplay();
            }
        }

        window.removeFromCart = function(name) {
            cart = cart.filter(item => item.name !== name);
            updateCartCount();
            updateCartDisplay();
            showNotification('Producto eliminado del carrito', 'info');
        }

        // WhatsApp Integration
        function openWhatsApp(message) {
            const url = `https://wa.me/56933841993?text=${encodeURIComponent(message)}`;
            window.open(url, '_blank');
        }

        // WhatsApp Order
        document.getElementById('checkout-btn').addEventListener('click', function(e) {
            e.preventDefault();
            
            if (cart.length === 0) return;
            
            let message = "¡Hola Churros Crunch! Me gustaría hacer el siguiente pedido:\n\n";
            
            cart.forEach(item => {
                message += `• ${item.name} (x${item.quantity}) - ${(item.price * item.quantity).toLocaleString()}\n`;
            });
            
            message += `\nTotal: ${cartTotal.toLocaleString()}\n\n`;
            message += "¿Podrían confirmar disponibilidad y tiempo de entrega? ¡Gracias!";
            
            openWhatsApp(message);
        });

        // WhatsApp Buttons
        document.querySelectorAll('.whatsapp-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const message = "¡Hola! Me interesa conocer más sobre los churros de Churros Crunch. ¿Podrían darme más información?";
                openWhatsApp(message);
            });
        });

        // Smooth Scrolling for Navigation Links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    const headerHeight = header.offsetHeight;
                    const targetPosition = target.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });

        // Notification Function
        function showNotification(message, type = 'success') {
            const notification = document.createElement('div');
            notification.className = 'notification';
            notification.textContent = message;
            
            if (type === 'success') {
                notification.style.background = '#28a745';
            } else if (type === 'error') {
                notification.style.background = '#dc3545';
            } else if (type === 'info') {
                notification.style.background = '#17a2b8';
            }
            
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.classList.add('show');
            }, 100);
            
            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => {
                    if (document.body.contains(notification)) {
                        document.body.removeChild(notification);
                    }
                }, 300);
            }, 3000);
        }

        // Intersection Observer for Animation on Scroll
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observe elements for animation
        document.querySelectorAll('.product-card, .contact-card, .info-text, .info-image').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });

        // Add keyboard navigation support
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                cartModal.classList.remove('active');
            }
        });

        console.log('Churros Crunch Website Loaded Successfully!');