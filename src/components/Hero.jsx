import { useState, useEffect } from 'react';

const SLIDES = [
    {
        title: 'New Season Arrivals',
        subtitle: 'Discover the latest in premium lifestyle essentials. Free shipping on orders over $75.',
        cta: 'Shop Now',
        bg: 'linear-gradient(135deg, #232f3e 0%, #37475a 50%, #131921 100%)',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
    },
    {
        title: 'Up to 40% Off Electronics',
        subtitle: 'Premium headphones, chargers, and accessories at unbeatable prices.',
        cta: 'See Deals',
        bg: 'linear-gradient(135deg, #0f1b2d 0%, #1a3a5c 50%, #0d2137 100%)',
        image: 'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=800&q=80',
    },
    {
        title: 'Timeless Accessories',
        subtitle: 'Watches, sunglasses, and bags crafted for the modern individual.',
        cta: 'Explore',
        bg: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f0f23 100%)',
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
    },
];

const QUICK_CATEGORIES = [
    { icon: '🎧', label: 'Audio', query: 'Audio' },
    { icon: '⌚', label: 'Accessories', query: 'Accessories' },
    { icon: '👜', label: 'Bags', query: 'Bags' },
    { icon: '🏠', label: 'Home', query: 'Home' },
    { icon: '🔌', label: 'Tech', query: 'Tech' },
    { icon: '👓', label: 'Eyewear', query: 'Eyewear' },
];

export default function Hero({ onCategoryClick }) {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % SLIDES.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    const slide = SLIDES[current];

    return (
        <section className="hero" id="hero">
            {/* Carousel */}
            <div className="hero__carousel" style={{ background: slide.bg }}>
                <div className="container hero__carousel-inner">
                    <div className="hero__carousel-content">
                        <h1 className="hero__carousel-title">{slide.title}</h1>
                        <p className="hero__carousel-subtitle">{slide.subtitle}</p>
                        <a href="#products" className="btn btn--primary hero__carousel-cta">
                            {slide.cta}
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                        </a>
                    </div>
                    <div className="hero__carousel-image">
                        <img src={slide.image} alt={slide.title} />
                    </div>
                </div>

                {/* Dots */}
                <div className="hero__dots">
                    {SLIDES.map((_, i) => (
                        <button
                            key={i}
                            className={`hero__dot ${i === current ? 'hero__dot--active' : ''}`}
                            onClick={() => setCurrent(i)}
                            aria-label={`Go to slide ${i + 1}`}
                        />
                    ))}
                </div>
            </div>

            {/* Quick Categories */}
            <div className="hero__categories">
                <div className="container">
                    <div className="hero__categories-grid">
                        {QUICK_CATEGORIES.map((cat) => (
                            <button
                                key={cat.label}
                                className="hero__category-card"
                                onClick={() => onCategoryClick && onCategoryClick(cat.query)}
                            >
                                <span className="hero__category-icon">{cat.icon}</span>
                                <span className="hero__category-label">{cat.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
