// Telegram Bot Configuration
window.TELEGRAM_CONFIG = {
    BOT_TOKEN: '8279089726:AAEgvJvTumogTomlK8_KF4Hmap0_xSjDY80', // Add your bot token here
    CHAT_ID: '5419768999'    // Add your chat ID here
};

// Site Configuration
window.SITE_CONFIG = {
    name: 'LOKAL BOX',
    email: 'hello@lokalbox.ru',
    phone: '8 800 123-45-67',
    address: 'г. Петрозаводск'
};

// Products Configuration
window.PRODUCTS_CONFIG = {
    boxes: {
        standard: {
            id: 1,
            name: 'Стандарт',
            price: 990,
            image: 'images/box-starter.jpg',
            features: ['4-5 товаров', 'Базовые локальные бренды', 'Открытка с историей']
        },
        premium: {
            id: 2,
            name: 'Премиум',
            price: 1790,
            image: 'images/box-premium.jpg',
            features: ['6-7 товаров', 'Премиум бренды', 'Эксклюзивные вещи', 'Подарочная упаковка']
        },
        vip: {
            id: 3,
            name: 'VIP',
            price: 2990,
            image: 'images/box-vip.jpg',
            features: ['8+ товаров', 'Люкс бренды', 'Ручная работа', 'VIP упаковка + сюрприз']
        }
    },
    
    subscription_discounts: {
        '3_months': 0.10, // 10%
        '6_months': 0.15  // 15%
    }
};

// Animation Configuration
window.ANIMATION_CONFIG = {
    enabled: true,
    mobile_threshold: 0.05,
    desktop_threshold: 0.1,
    scroll_delay: 100
};

// Cart Configuration
window.CART_CONFIG = {
    max_items: 20,
    localStorage_key: 'lokalbox_cart',
    save_delay: 500
};

// Payment Configuration
window.PAYMENT_CONFIG = {
    currency: 'RUB',
    test_mode: true,
    test_cards: {
        success: '4242424242424242',
        insufficient_funds: '4000000000000002',
        expired: '4000000000000069'
    }
};

// Analytics Configuration (for future use)
window.ANALYTICS_CONFIG = {
    enabled: false,
    google_analytics_id: '',
    yandex_metrika_id: ''
};

// Feature Flags
window.FEATURE_FLAGS = {
    dark_mode: true,
    animations: true,
    cart: true,
    payment: true,
    telegram_notifications: false
};

// Development Flags
window.DEVELOPMENT = {
    debug: false,
    log_events: false,
    test_notifications: true
};

// Layout Configuration
window.LAYOUT_CONFIG = {
    brand_cards: {
        min_width: 180,
        max_width: 250,
        gap: 30
    },
    header_buttons: {
        desktop_size: 42,
        mobile_size: 38
    },
    hero_section: {
        use_transparent_background: true,
        text_shadow_enabled: true
    }
};