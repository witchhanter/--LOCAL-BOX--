// Отметка, что страница загружена для анимаций
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Инициализация темы
const savedTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', savedTheme);

function updateThemeIcon(theme) {
    if (theme === 'dark') {
        document.querySelector('.sun-icon').style.display = 'none';
        document.querySelector('.moon-icon').style.display = 'block';
    } else {
        document.querySelector('.sun-icon').style.display = 'block';
        document.querySelector('.moon-icon').style.display = 'none';
    }
}
updateThemeIcon(savedTheme);

// Корзина
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let isModalOpen = false;
let scrollPosition = 0;
let activeSection = '';

// Параллакс эффект
let heroBackground = null;

// Сохранение корзины
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

// Обновление счетчика корзины
function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    document.getElementById('cartCount').textContent = count;
    document.getElementById('mobileCartCount').textContent = count;
    document.getElementById('cartCountFab').textContent = count;
}

// Обновление отображения корзины
function updateCartDisplay() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    const fullscreenCartItems = document.getElementById('fullscreenCartItems');
    const fullscreenCartTotal = document.getElementById('fullscreenCartTotal');
    const paymentItems = document.getElementById('paymentItems');
    const paymentTotal = document.getElementById('paymentTotal');
    const preorderItems = document.getElementById('preorderItems');
    const preorderTotal = document.getElementById('preorderTotal');

    let total = 0;

    if (cart.length === 0) {
        cartItems.innerHTML = '<div class="empty-cart">Корзина пуста</div>';
        if (fullscreenCartItems) {
            fullscreenCartItems.innerHTML = '<div class="empty-cart">Корзина пуста</div>';
        }
        if (paymentItems) {
            paymentItems.innerHTML = '<p>Нет товаров</p>';
        }
        if (preorderItems) {
            preorderItems.innerHTML = '<p>Нет товаров в корзине</p>';
        }
        if (preorderTotal) {
            preorderTotal.textContent = '0 ₽';
        }
    } else {
        cartItems.innerHTML = '';
        if (fullscreenCartItems) {
            fullscreenCartItems.innerHTML = '';
        }
        if (paymentItems) {
            paymentItems.innerHTML = '';
        }
        if (preorderItems) {
            preorderItems.innerHTML = '';
        }

        cart.forEach((item, index) => {
            total += item.price * item.quantity;

            // Десктопная корзина
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.setAttribute('data-item-index', index);
            cartItem.innerHTML = `
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}" onerror="this.src='images/box-starter.jpg'">
                </div>
                <div class="cart-item-info">
                    <h5>${item.name}</h5>
                    <div class="cart-item-price">${item.price} ₽ × ${item.quantity}</div>
                </div>
                <div class="cart-item-actions">
                    <button class="quantity-btn decrease-quantity" data-index="${index}">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn increase-quantity" data-index="${index}">+</button>
                    <button class="remove-item" data-index="${index}" data-item-id="${item.id}">✕</button>
                </div>
            `;
            cartItems.appendChild(cartItem);

            // Мобильная полностраничная корзина
            if (fullscreenCartItems) {
                const fullscreenCartItem = document.createElement('div');
                fullscreenCartItem.className = 'cart-item';
                fullscreenCartItem.setAttribute('data-item-index', index);
                fullscreenCartItem.innerHTML = `
                    <div class="cart-item-image">
                        <img src="${item.image}" alt="${item.name}" onerror="this.src='images/box-starter.jpg'">
                    </div>
                    <div class="cart-item-info">
                        <h5>${item.name}</h5>
                        <div class="cart-item-price">${item.price} ₽ × ${item.quantity}</div>
                    </div>
                    <div class="cart-item-actions">
                        <button class="quantity-btn decrease-quantity-fullscreen" data-index="${index}">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn increase-quantity-fullscreen" data-index="${index}">+</button>
                        <button class="remove-item remove-item-fullscreen" data-index="${index}" data-item-id="${item.id}">✕</button>
                    </div>
                `;
                fullscreenCartItems.appendChild(fullscreenCartItem);
            }

            // Корзина в окне оплаты
            if (paymentItems) {
                const paymentItem = document.createElement('div');
                paymentItem.className = 'payment-item';
                paymentItem.innerHTML = `
                    <span>${item.name} × ${item.quantity}</span>
                    <span>${item.price * item.quantity} ₽</span>
                `;
                paymentItems.appendChild(paymentItem);
            }

            // Корзина в окне предзаказа
            if (preorderItems) {
                const preorderItem = document.createElement('div');
                preorderItem.className = 'preorder-item';
                preorderItem.innerHTML = `
                    <span>${item.name} × ${item.quantity}</span>
                    <span>${item.price * item.quantity} ₽</span>
                `;
                preorderItems.appendChild(preorderItem);
            }
        });
    }

    cartTotal.textContent = `${total} ₽`;
    if (fullscreenCartTotal) {
        fullscreenCartTotal.textContent = `${total} ₽`;
    }
    if (paymentTotal) {
        paymentTotal.textContent = `${total} ₽`;
    }
    if (preorderTotal) {
        preorderTotal.textContent = `${total} ₽`;
    }

    saveCart();
}

// Добавление в корзину с анимацией
function addToCart(id, name, price, image) {
    const existingItem = cart.find(item => item.id === id);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id,
            name,
            price,
            image,
            quantity: 1
        });
    }

    updateCartDisplay();
    showNotification();

    // Анимация иконки корзины
    const cartIcon = document.querySelector('.cart-toggle i');
    if (cartIcon) {
        cartIcon.style.transform = 'scale(1.3)';
        setTimeout(() => {
            cartIcon.style.transform = 'scale(1)';
        }, 300);
    }
}

// Удаление из корзины
function removeFromCart(index) {
    if (index >= 0 && index < cart.length) {
        cart.splice(index, 1);
        updateCartDisplay();
    }
}

// Показать уведомление
function showNotification() {
    const notification = document.getElementById('notification');
    notification.classList.add('show');

    setTimeout(() => {
        notification.classList.remove('show');
    }, 2000);
}

// Блокировка скролла
function disableScroll() {
    if (isModalOpen) return;

    isModalOpen = true;
    scrollPosition = window.pageYOffset || document.documentElement.scrollTop;

    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollPosition}px`;
    document.body.style.width = '100%';

    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
        const header = document.querySelector('header');
        if (header) header.style.paddingRight = `${scrollbarWidth}px`;
    }
}

// Разблокировка скролла
function enableScroll() {
    if (!isModalOpen) return;

    isModalOpen = false;

    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    document.body.style.paddingRight = '';

    const header = document.querySelector('header');
    if (header) header.style.paddingRight = '';

    window.scrollTo(0, scrollPosition);
    scrollPosition = 0;
}

// Закрыть все модальные окна
function closeAllModals() {
    const cartDropdown = document.getElementById('cartDropdown');
    const paymentModal = document.getElementById('paymentModal');
    const fullscreenCartModal = document.getElementById('fullscreenCartModal');
    const preorderModal = document.getElementById('preorderModal');
    const mobileNav = document.getElementById('mobileNav');
    const mobileNavOverlay = document.getElementById('mobileNavOverlay');
    const menuToggle = document.getElementById('menuToggle');

    if (cartDropdown) cartDropdown.classList.remove('active');
    if (paymentModal) paymentModal.classList.remove('active');
    if (fullscreenCartModal) fullscreenCartModal.classList.remove('active');
    if (preorderModal) preorderModal.classList.remove('active');
    if (mobileNav) mobileNav.classList.remove('active');
    if (mobileNavOverlay) mobileNavOverlay.classList.remove('active');
    if (menuToggle) menuToggle.classList.remove('active');

    enableScroll();
}

// Плавный скролл к якорям
function smoothScrollTo(element, duration = 500) {
    const start = window.pageYOffset;
    const target = element.offsetTop - 70;
    const distance = target - start;
    let startTime = null;

    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);

        const ease = progress < 0.5
            ? 4 * progress * progress * progress
            : 1 - Math.pow(-2 * progress + 2, 3) / 2;

        window.scrollTo(0, start + distance * ease);

        if (timeElapsed < duration) {
            requestAnimationFrame(animation);
        }
    }

    requestAnimationFrame(animation);
}

// Включаем/выключаем плавный скролл на мобильных
function checkMobileAndDisableSmoothScroll() {
    if (window.innerWidth <= 768) {
        // Отключено на мобильных
    } else {
        // Включено на десктопе
    }
}

// Обновление активной секции
function updateActiveSection() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.scrollY + 80;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        const sectionId = section.getAttribute('id');

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            if (activeSection !== sectionId) {
                activeSection = sectionId;

                document.querySelectorAll('.nav-item[href^="#"]').forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });

                document.querySelectorAll('.mobile-nav-link[href^="#"]').forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        }
    });
}

// Мобильное меню
const menuToggle = document.getElementById('menuToggle');
const mobileNav = document.getElementById('mobileNav');
const mobileNavOverlay = document.getElementById('mobileNavOverlay');
const closeMenu = document.getElementById('closeMenu');

function toggleMobileMenu() {
    if (mobileNav.classList.contains('active')) {
        closeMobileMenu();
    } else {
        openMobileMenu();
    }
}

function openMobileMenu() {
    closeAllModals();
    mobileNav.classList.add('active');
    mobileNavOverlay.classList.add('active');
    menuToggle.classList.add('active');
    disableScroll();
}

function closeMobileMenu() {
    mobileNav.classList.remove('active');
    mobileNavOverlay.classList.remove('active');
    menuToggle.classList.remove('active');
    enableScroll();
}

if (menuToggle) menuToggle.addEventListener('click', toggleMobileMenu);
if (closeMenu) closeMenu.addEventListener('click', closeMobileMenu);
if (mobileNavOverlay) mobileNavOverlay.addEventListener('click', closeMobileMenu);

// Навигация по якорям
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            closeMobileMenu();
            smoothScrollTo(targetElement);
        }
    });
});

// Анимация появления элементов хедера
function animateHeaderElements() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach((item, index) => {
        setTimeout(() => {
            item.classList.add('visible');
        }, 600 + (index * 100));
    });
}

// Анимация появления главного блока hero
function animateHeroContent() {
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const heroBtn = document.querySelector('.hero-btn');

    if (heroTitle) {
        setTimeout(() => {
            heroTitle.style.opacity = '1';
            heroTitle.style.transform = 'translateY(0)';
        }, 800);
    }

    if (heroSubtitle) {
        setTimeout(() => {
            heroSubtitle.style.opacity = '1';
            heroSubtitle.style.transform = 'translateY(0)';
        }, 1000);
    }

    if (heroBtn) {
        setTimeout(() => {
            heroBtn.style.opacity = '1';
            heroBtn.style.transform = 'translateY(0)';
        }, 1200);
    }
}

// Переключение темы с анимацией иконки
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';

    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);

    // Анимация иконки темы
    const themeIcon = document.querySelector('.theme-toggle .theme-icon:not([style*="display: none"])');
    if (themeIcon) {
        themeIcon.style.transform = 'scale(1.3)';
        setTimeout(() => {
            themeIcon.style.transform = 'scale(1)';
        }, 300);
    }
}

const themeToggle = document.getElementById('themeToggle');
const mobileThemeToggle = document.getElementById('mobileThemeToggle');

if (themeToggle) themeToggle.addEventListener('click', toggleTheme);
if (mobileThemeToggle) mobileThemeToggle.addEventListener('click', (e) => {
    toggleTheme(e);
    closeMobileMenu();
});

// Корзина десктоп
const cartToggle = document.getElementById('cartToggle');
const cartDropdown = document.getElementById('cartDropdown');
const closeCart = document.getElementById('closeCart');

if (cartToggle) {
    cartToggle.addEventListener('click', (e) => {
        e.stopPropagation();

        if (cartDropdown.classList.contains('active')) {
            cartDropdown.classList.remove('active');
            enableScroll();
        } else {
            closeAllModals();
            cartDropdown.classList.add('active');
            disableScroll();
        }
    });
}

if (closeCart) {
    closeCart.addEventListener('click', () => {
        cartDropdown.classList.remove('active');
        enableScroll();
    });
}

// Мобильная корзина
const mobileCartBtn = document.getElementById('mobileCartBtn');
const mobileCartFab = document.getElementById('mobileCartFab');
const fullscreenCartModal = document.getElementById('fullscreenCartModal');
const closeFullscreenCart = document.getElementById('closeFullscreenCart');
const fullscreenCheckoutBtn = document.getElementById('fullscreenCheckoutBtn');

function openFullscreenCart() {
    closeAllModals();
    fullscreenCartModal.classList.add('active');
    disableScroll();
}

if (mobileCartBtn) {
    mobileCartBtn.addEventListener('click', (e) => {
        e.preventDefault();
        openFullscreenCart();
    });
}

if (mobileCartFab) {
    mobileCartFab.addEventListener('click', (e) => {
        e.preventDefault();
        openFullscreenCart();
    });
}

if (closeFullscreenCart) {
    closeFullscreenCart.addEventListener('click', () => {
        fullscreenCartModal.classList.remove('active');
        enableScroll();
    });
}

if (fullscreenCheckoutBtn) {
    fullscreenCheckoutBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            alert('Корзина пуста!');
            return;
        }
        fullscreenCartModal.classList.remove('active');
        const paymentModal = document.getElementById('paymentModal');
        if (paymentModal) paymentModal.classList.add('active');
    });
}

// Обработчик кликов вне корзины
document.addEventListener('click', (e) => {
    if (cartToggle && cartDropdown) {
        if (!cartToggle.contains(e.target) && !cartDropdown.contains(e.target)) {
            cartDropdown.classList.remove('active');
            enableScroll();
        }
    }
});

// Обработка Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeAllModals();
    }
});

// Делегирование событий для корзины
document.addEventListener('click', (e) => {
    // Добавление в корзину
    if (e.target.classList.contains('add-to-cart')) {
        const btn = e.target;
        const id = btn.dataset.id;
        const name = btn.dataset.name;
        const price = parseInt(btn.dataset.price);
        const image = btn.dataset.image || 'images/box-starter.jpg';

        addToCart(id, name, price, image);

        // На мобильных открываем полностраничную корзину
        if (window.innerWidth <= 768) {
            setTimeout(() => {
                openFullscreenCart();
            }, 200);
        } else {
            // На десктопе открываем выпадающую корзину
            if (cartDropdown) {
                cartDropdown.classList.add('active');
                disableScroll();
            }
        }
    }

    // Увеличение количества (десктоп)
    if (e.target.classList.contains('increase-quantity')) {
        const index = parseInt(e.target.dataset.index);
        cart[index].quantity += 1;
        updateCartDisplay();
    }

    // Уменьшение количества (десктоп)
    if (e.target.classList.contains('decrease-quantity')) {
        const index = parseInt(e.target.dataset.index);
        if (cart[index].quantity > 1) {
            cart[index].quantity -= 1;
        } else {
            removeFromCart(index);
        }
        updateCartDisplay();
    }

    // Удаление (десктоп)
    if (e.target.classList.contains('remove-item')) {
        const index = parseInt(e.target.dataset.index);
        removeFromCart(index);
    }

    // Увеличение количества (мобильная полностраничная)
    if (e.target.classList.contains('increase-quantity-fullscreen')) {
        const index = parseInt(e.target.dataset.index);
        cart[index].quantity += 1;
        updateCartDisplay();
    }

    // Уменьшение количества (мобильная полностраничная)
    if (e.target.classList.contains('decrease-quantity-fullscreen')) {
        const index = parseInt(e.target.dataset.index);
        if (cart[index].quantity > 1) {
            cart[index].quantity -= 1;
        } else {
            removeFromCart(index);
        }
        updateCartDisplay();
    }

    // Удаление (мобильная полностраничная)
    if (e.target.classList.contains('remove-item-fullscreen')) {
        const index = parseInt(e.target.dataset.index);
        removeFromCart(index);
    }

    // FAQ аккордеон
    if (e.target.classList.contains('faq-question') || e.target.closest('.faq-question')) {
        const faqItem = e.target.closest('.faq-item');
        if (faqItem) {
            faqItem.classList.toggle('active');

            // Закрываем другие открытые вопросы
            document.querySelectorAll('.faq-item').forEach(item => {
                if (item !== faqItem) {
                    item.classList.remove('active');
                }
            });
        }
    }
});

// Окно оплаты
const checkoutBtn = document.getElementById('checkoutBtn');
const paymentModal = document.getElementById('paymentModal');
const closePayment = document.getElementById('closePayment');
const processPayment = document.getElementById('processPayment');
const testPaymentModalBtn = document.getElementById('testPaymentModalBtn');

if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            alert('Корзина пуста!');
            return;
        }
        closeAllModals();
        if (paymentModal) paymentModal.classList.add('active');
        disableScroll();
    });
}

if (closePayment) {
    closePayment.addEventListener('click', () => {
        if (paymentModal) paymentModal.classList.remove('active');
        enableScroll();
    });
}

if (paymentModal) {
    paymentModal.addEventListener('click', (e) => {
        if (e.target === paymentModal) {
            paymentModal.classList.remove('active');
            enableScroll();
        }
    });
}

// Форматирование карты
const cardNumberInput = document.getElementById('cardNumber');
if (cardNumberInput) {
    cardNumberInput.addEventListener('input', function (e) {
        let value = e.target.value.replace(/\D/g, '');
        value = value.replace(/(.{4})/g, '$1 ').trim();
        e.target.value = value.substring(0, 19);
    });
}

const cardExpiryInput = document.getElementById('cardExpiry');
if (cardExpiryInput) {
    cardExpiryInput.addEventListener('input', function (e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length >= 2) {
            value = value.substring(0, 2) + '/' + value.substring(2, 4);
        }
        e.target.value = value.substring(0, 5);
    });
}

const cardCvvInput = document.getElementById('cardCvv');
if (cardCvvInput) {
    cardCvvInput.addEventListener('input', function (e) {
        e.target.value = e.target.value.replace(/\D/g, '').substring(0, 3);
    });
}

// Обработка оплаты
async function processRealPayment() {
    const cardNumber = document.getElementById('cardNumber').value.replace(/\s/g, '');
    const cardExpiry = document.getElementById('cardExpiry').value;
    const cardCvv = document.getElementById('cardCvv').value;
    const cardName = document.getElementById('cardName').value;

    if (!cardNumber || !cardExpiry || !cardCvv || !cardName) {
        alert('Пожалуйста, заполните все поля карты');
        return;
    }

    const originalText = processPayment.textContent;
    processPayment.textContent = 'Обработка...';
    processPayment.disabled = true;

    try {
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Симуляция успешной оплаты
        const orderId = 'ORD-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6).toUpperCase();
        const totalAmount = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

        const order = {
            id: orderId,
            items: [...cart],
            total: totalAmount,
            customerName: cardName,
            status: 'Оплачено',
            date: new Date().toLocaleString('ru-RU'),
        };

        // Отправляем в Telegram
        const telegramSent = await sendOrderToTelegram(order);

        // Очистка корзины
        cart = [];
        updateCartDisplay();

        // Закрытие модального окна
        if (paymentModal) paymentModal.classList.remove('active');
        enableScroll();

        // Очистка формы
        document.getElementById('cardNumber').value = '';
        document.getElementById('cardExpiry').value = '';
        document.getElementById('cardCvv').value = '';
        document.getElementById('cardName').value = '';

        // Успешное сообщение
        alert(`✅ Оплата прошла успешно!\n\nЗаказ №: ${orderId}\nСумма: ${totalAmount} ₽\n\nЗаказ будет отправлен в течение 2 рабочих дней.`);

    } catch (error) {
        console.error('Payment error:', error);
        alert('❌ Ошибка оплаты. Пожалуйста, попробуйте еще раз.');
    } finally {
        processPayment.textContent = originalText;
        processPayment.disabled = false;
    }
}

if (processPayment) {
    processPayment.addEventListener('click', processRealPayment);
}

// Функция для отправки тестового уведомления в Telegram
async function sendTestNotification() {
    try {
        const testOrder = {
            id: 'TEST-' + Date.now(),
            items: [
                { name: 'Тестовый товар 1', quantity: 2, price: 500 },
                { name: 'Тестовый товар 2', quantity: 1, price: 1000 }
            ],
            total: 2000,
            customerName: 'Тестовый Клиент',
            paymentMethod: 'Карта •••• 4242',
            status: 'Тестовый заказ',
            date: new Date().toLocaleString('ru-RU'),
        };

        const result = await sendOrderToTelegram(testOrder);

        if (result) {
            alert('✅ Тестовое уведомление отправлено в Telegram!');
        } else {
            alert('❌ Не удалось отправить уведомление.');
        }
    } catch (error) {
        console.error('Test notification error:', error);
        alert('❌ Ошибка при отправке тестового уведомления');
    }
}

if (testPaymentModalBtn) {
    testPaymentModalBtn.addEventListener('click', sendTestNotification);
}

// Функция для отправки заказа в Telegram
async function sendOrderToTelegram(order) {
    try {
        const TELEGRAM_BOT_TOKEN = window.TELEGRAM_CONFIG?.BOT_TOKEN || '';
        const TELEGRAM_CHAT_ID = window.TELEGRAM_CONFIG?.CHAT_ID || '';

        if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
            console.log('Telegram configuration not found');
            return true; // Возвращаем true для симуляции успешной отправки
        }

        const itemsList = order.items.map(item =>
            ` • ${item.name} × ${item.quantity} = ${item.price * item.quantity} ₽`
        ).join('\n');

        const message = `🛒 НОВЫЙ ЗАКАЗ LOKAL BOX
📦 Заказ №: ${order.id}
💰 Сумма: ${order.total} ₽
👤 Имя: ${order.customerName}
📅 Дата: ${order.date}
📊 Статус: ${order.status}

Товары:
${itemsList}`;

        const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: message,
                disable_web_page_preview: true
            })
        });

        const result = await response.json();
        return result.ok;

    } catch (error) {
        console.error('Telegram send error:', error);
        return false;
    }
}

// Параллакс эффект для hero секции
function initParallax() {
    heroBackground = document.querySelector('.hero-background');
    if (!heroBackground) return;

    window.addEventListener('scroll', () => {
        if (!heroBackground || isModalOpen) return;

        const scrolled = window.pageYOffset;
        const rate = scrolled * 0.4;
        heroBackground.style.transform = `translate3d(0, ${rate}px, 0)`;
    });
}

// Анимация при скролле - исправлена для карточек боксов
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                if (entry.target.classList.contains('step')) {
                    entry.target.classList.add('visible');
                }
                if (entry.target.classList.contains('section')) {
                    entry.target.classList.add('visible');
                }
            }, index * 100);
        }
    });
}, {
    threshold: 0.05,
    rootMargin: '0px 0px -100px 0px'
});

const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.classList.add('visible');
            }, index * 150);
        }
    });
}, {
    threshold: 0.05,
    rootMargin: '0px 0px -50px 0px'
});

const brandObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.classList.add('visible');
            }, index * 100);
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
});

// Наблюдатель для отзывов
const reviewsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');

            // Анимируем карточки отзывов
            const reviewCards = entry.target.querySelectorAll('.review-card');
            reviewCards.forEach((card, index) => {
                setTimeout(() => {
                    card.classList.add('visible');
                }, index * 150);
            });
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -80px 0px'
});

function observeElements() {
    if (isModalOpen) return;

    document.querySelectorAll('.section').forEach(el => {
        observer.observe(el);
    });

    document.querySelectorAll('.step').forEach((el, i) => {
        el.style.setProperty('--i', i);
        observer.observe(el);
    });

    document.querySelectorAll('.card').forEach((el, i) => {
        el.style.setProperty('--i', i);
        cardObserver.observe(el);
    });

    document.querySelectorAll('.brand').forEach((el, i) => {
        el.style.setProperty('--i', i);
        brandObserver.observe(el);
    });

    // Наблюдаем за секцией отзывов
    const reviewsSection = document.querySelector('.reviews');
    if (reviewsSection) {
        reviewsObserver.observe(reviewsSection);
    }
}

// Хедер при скролле
let lastScrollTop = 0;
const header = document.querySelector('header');

function handleHeaderScroll() {
    if (isModalOpen) return;

    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }

    updateActiveSection();
    updateScrollIndicator();
    lastScrollTop = scrollTop;
}

function throttle(func, limit) {
    let inThrottle;
    return function () {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Индикатор прокрутки
function updateScrollIndicator() {
    const scrollIndicator = document.getElementById('scrollIndicator');
    if (!scrollIndicator || scrollIndicator.classList.contains('initial-animation')) return;

    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    const scrolled = (scrollTop / (documentHeight - windowHeight)) * 100;
    scrollIndicator.style.width = Math.min(scrolled, 100) + '%';
}

// ===== ПРЕДЗАКАЗ =====
const preorderModal = document.getElementById('preorderModal');
const closePreorder = document.getElementById('closePreorder');
const preorderBtnDesktop = document.getElementById('preorderBtnDesktop');
const preorderBtnMobile = document.getElementById('preorderBtnMobile');
const submitPreorder = document.getElementById('submitPreorder');
const preorderForm = document.getElementById('preorderForm');
const preorderSuccess = document.getElementById('preorderSuccess');
const closePreorderSuccess = document.getElementById('closePreorderSuccess');
const testTelegramBtn = document.getElementById('testTelegramBtn');
const preorderFormContainer = document.getElementById('preorderFormContainer');

// Открытие модального окна предзаказа
function openPreorderModal() {
    if (cart.length === 0) {
        alert('Корзина пуста! Добавьте товары перед оформлением предзаказа.');
        return;
    }

    closeAllModals();
    if (preorderModal) preorderModal.classList.add('active');
    disableScroll();

    // Показываем форму, скрываем сообщение об успехе
    if (preorderFormContainer) preorderFormContainer.style.display = 'block';
    if (preorderSuccess) preorderSuccess.classList.remove('active');

    // Сбрасываем форму
    if (preorderForm) preorderForm.reset();

    // Фокус на первое поле
    setTimeout(() => {
        const preorderName = document.getElementById('preorderName');
        if (preorderName) preorderName.focus();
    }, 300);
}

// Закрытие модального окна предзаказа
function closePreorderModal() {
    if (preorderModal) preorderModal.classList.remove('active');
    enableScroll();
}

// Отправка формы предзаказа
async function submitPreorderForm(e) {
    e.preventDefault();

    const name = document.getElementById('preorderName').value.trim();
    const email = document.getElementById('preorderEmail').value.trim();
    const phone = document.getElementById('preorderPhone').value.trim();

    // Валидация
    if (!name || !email || !phone) {
        alert('Пожалуйста, заполните все обязательные поля');
        return;
    }

    if (!isValidEmail(email)) {
        alert('Пожалуйста, введите корректный email адрес');
        return;
    }

    if (!isValidPhone(phone)) {
        alert('Пожалуйста, введите корректный номер телефона');
        return;
    }

    const originalText = submitPreorder.textContent;
    submitPreorder.textContent = 'Отправка...';
    submitPreorder.disabled = true;

    try {
        // Создаем объект предзаказа
        const preorder = {
            id: 'PRE-' + Date.now(),
            name: name,
            email: email,
            phone: phone,
            items: [...cart],
            total: cart.reduce((total, item) => total + (item.price * item.quantity), 0),
            date: new Date().toLocaleString('ru-RU'),
            status: 'Предзаказ'
        };

        // Отправляем в Telegram
        const telegramSent = await sendPreorderToTelegram(preorder);

        // Показываем сообщение об успехе
        if (preorderFormContainer) preorderFormContainer.style.display = 'none';
        if (preorderSuccess) preorderSuccess.classList.add('active');

        // Очищаем корзину через 2 секунды
        setTimeout(() => {
            cart = [];
            updateCartDisplay();
        }, 2000);

        console.log('Preorder submitted:', preorder);

    } catch (error) {
        console.error('Preorder submission error:', error);
        alert('❌ Ошибка при отправке предзаказа. Пожалуйста, попробуйте еще раз.');
    } finally {
        submitPreorder.textContent = originalText;
        submitPreorder.disabled = false;
    }
}

// Функция для отправки предзаказа в Telegram
async function sendPreorderToTelegram(preorder) {
    try {
        const TELEGRAM_BOT_TOKEN = window.TELEGRAM_CONFIG?.BOT_TOKEN || '';
        const TELEGRAM_CHAT_ID = window.TELEGRAM_CONFIG?.CHAT_ID || '';

        if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
            console.log('Telegram configuration not found');
            return true; // Возвращаем true для симуляции успешной отправки
        }

        const itemsList = preorder.items.map(item =>
            ` • ${item.name} × ${item.quantity} = ${item.price * item.quantity} ₽`
        ).join('\n');

        const message = `📋 НОВЫЙ ПРЕДЗАКАЗ LOKAL BOX
📦 Предзаказ №: ${preorder.id}
💰 Сумма: ${preorder.total} ₽
👤 Имя: ${preorder.name}
📧 Email: ${preorder.email}
📞 Телефон: ${preorder.phone}
📅 Дата: ${preorder.date}
📊 Статус: ${preorder.status}

Товары:
${itemsList}

✅ ПРЕДЗАКАЗ ОФОРМЛЕН`;

        const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: message,
                disable_web_page_preview: true
            })
        });

        const result = await response.json();
        return result.ok;

    } catch (error) {
        console.error('Telegram send error:', error);
        return false;
    }
}

// Валидация email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Валидация телефона
function isValidPhone(phone) {
    const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
    return phoneRegex.test(phone.replace(/\D/g, ''));
}

// Тест отправки в Telegram из формы предзаказа
async function testTelegramFromPreorder() {
    try {
        const testPreorder = {
            id: 'TEST-PRE-' + Date.now(),
            name: 'Тестовый Клиент',
            email: 'test@example.com',
            phone: '+7 (999) 123-45-67',
            items: cart.length > 0 ? cart : [
                { name: 'Тестовый товар', quantity: 1, price: 1000 }
            ],
            total: cart.length > 0 ? cart.reduce((total, item) => total + (item.price * item.quantity), 0) : 1000,
            date: new Date().toLocaleString('ru-RU'),
            status: 'Тестовый предзаказ'
        };

        const result = await sendPreorderToTelegram(testPreorder);

        if (result) {
            alert('✅ Тестовый предзаказ отправлен в Telegram!');
        } else {
            alert('❌ Не удалось отправить тестовый предзаказ.');
        }
    } catch (error) {
        console.error('Test preorder notification error:', error);
        alert('❌ Ошибка при отправке тестового предзаказа');
    }
}

// События для предзаказа
if (preorderBtnDesktop) {
    preorderBtnDesktop.addEventListener('click', openPreorderModal);
}

if (preorderBtnMobile) {
    preorderBtnMobile.addEventListener('click', openPreorderModal);
}

if (closePreorder) {
    closePreorder.addEventListener('click', closePreorderModal);
}

if (preorderForm) {
    preorderForm.addEventListener('submit', submitPreorderForm);
}

if (closePreorderSuccess) {
    closePreorderSuccess.addEventListener('click', closePreorderModal);
}

if (testTelegramBtn) {
    testTelegramBtn.addEventListener('click', testTelegramFromPreorder);
}

if (preorderModal) {
    preorderModal.addEventListener('click', (e) => {
        if (e.target === preorderModal) {
            closePreorderModal();
        }
    });
}

// Форматирование телефона в предзаказе
const preorderPhoneInput = document.getElementById('preorderPhone');
if (preorderPhoneInput) {
    preorderPhoneInput.addEventListener('input', function (e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 0) {
            if (value[0] === '7' || value[0] === '8') {
                value = '+7 ' + value.substring(1);
            } else if (value[0] === '9') {
                value = '+7 (' + value.substring(0, 3) + ') ' + value.substring(3, 6) + '-' + value.substring(6, 8) + '-' + value.substring(8, 10);
                value = value.substring(0, 18);
            }
        }
        e.target.value = value;
    });
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', () => {
    updateCartDisplay();
    initParallax();

    // Анимация элементов хедера
    animateHeaderElements();

    // Анимация главного блока hero
    animateHeroContent();

    // Анимация hero секции
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        setTimeout(() => {
            heroSection.classList.add('visible');
        }, 300);
    }

    setTimeout(() => {
        observeElements();
        updateActiveSection();
    }, 300);

    window.addEventListener('scroll', throttle(handleHeaderScroll, 50));
    handleHeaderScroll();

    // Начальная анимация индикатора прокрутки
    const scrollIndicator = document.getElementById('scrollIndicator');
    if (scrollIndicator) {
        scrollIndicator.classList.add('initial-animation');
        setTimeout(() => {
            scrollIndicator.classList.remove('initial-animation');
        }, 1000);
    }

    // Закрываем все открытые FAQ при загрузке
    document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
    });

    // Анимация для FAQ
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';

        setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, 600 + (index * 100));
    });

    // Проверяем мобильное устройство
    checkMobileAndDisableSmoothScroll();
});

window.addEventListener('load', () => {
    setTimeout(() => {
        observeElements();
        updateActiveSection();
    }, 500);
});

window.addEventListener('scroll', () => {
    if (!isModalOpen) {
        observeElements();
    }
});

window.addEventListener('resize', () => {
    if (!isModalOpen) {
        setTimeout(() => {
            observeElements();
        }, 100);
    }
    checkMobileAndDisableSmoothScroll();
});

// Исправление для хедера - всегда черный текст в прозрачном состоянии
function fixHeaderTextColors() {
    const header = document.querySelector('header');
    const logo = document.querySelector('.logo');
    const navItems = document.querySelectorAll('.nav-item');

    if (!header.classList.contains('scrolled')) {
        // Прозрачный хедер - черный текст
        if (logo) logo.style.color = '#000000';
        navItems.forEach(item => {
            item.style.color = '#000000';
        });

        // Для темной темы - белый текст
        if (document.documentElement.getAttribute('data-theme') === 'dark') {
            if (logo) logo.style.color = '#ffffff';
            navItems.forEach(item => {
                item.style.color = '#ffffff';
            });
        }
    } else {
        // Белый/темный хедер - цвет из CSS переменных
        if (logo) logo.style.color = '';
        navItems.forEach(item => {
            item.style.color = '';
        });
    }
}

// Исправление для темной темы на мобильных
function fixDarkThemeMobile() {
    const heroSection = document.querySelector('.hero');
    const heroContent = document.querySelector('.hero-content');

    if (document.documentElement.getAttribute('data-theme') === 'dark') {
        // На мобильных устанавливаем черный фон
        if (window.innerWidth <= 768) {
            if (heroSection) {
                heroSection.style.backgroundColor = '#000000';
            }
            if (heroContent) {
                heroContent.style.backgroundColor = 'rgba(0, 0, 0, 0.85)';
            }
        } else {
            // На десктопе убираем лишние стили
            if (heroSection) {
                heroSection.style.backgroundColor = '';
            }
            if (heroContent) {
                heroContent.style.backgroundColor = '';
            }
        }
    } else {
        // Для светлой темы убираем все кастомные стили
        if (heroSection) {
            heroSection.style.backgroundColor = '';
        }
        if (heroContent) {
            heroContent.style.backgroundColor = '';
        }
    }
}

// Принудительно обновляем при смене темы
function forceThemeUpdate() {
    setTimeout(() => {
        fixHeaderTextColors();
        fixDarkThemeMobile();

        // Принудительный рефлоу для перерисовки
        if (document.querySelector('.hero')) {
            document.querySelector('.hero').style.display = 'none';
            document.querySelector('.hero').offsetHeight; // Принудительный reflow
            document.querySelector('.hero').style.display = '';
        }
    }, 50);
}

// Вызываем при смене темы и ресайзе
const themeObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.attributeName === 'data-theme') {
            forceThemeUpdate();
        }
    });
});

themeObserver.observe(document.documentElement, {
    attributes: true
});

window.addEventListener('resize', fixDarkThemeMobile);