export default function Features() {
    const features = [
        { icon: '🚚', label: 'Free Shipping', sub: 'On orders over $75' },
        { icon: '🔄', label: '30-Day Returns', sub: 'No questions asked' },
        { icon: '🛡️', label: '2-Year Warranty', sub: 'On all products' },
        { icon: '💬', label: '24/7 Support', sub: 'We are here to help' },
    ];

    return (
        <section className="features" id="features">
            <div className="container">
                <div className="features__grid">
                    {features.map((f, i) => (
                        <div className="features__item" key={i}>
                            <div className="features__icon">{f.icon}</div>
                            <div className="features__label">{f.label}</div>
                            <div className="features__sublabel">{f.sub}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
