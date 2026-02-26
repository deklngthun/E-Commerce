import React from 'react';
import { useCart } from '../context/CartContext';

function StarRating({ rating = 0, reviews = 0 }) {
    const fullStars = Math.floor(rating);
    const hasHalf = rating - fullStars >= 0.25;
    const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);

    return (
        <div className="stars">
            {[...Array(fullStars)].map((_, i) => (
                <span key={`full-${i}`} className="stars__star stars__star--full">★</span>
            ))}
            {hasHalf && <span className="stars__star stars__star--half">★</span>}
            {[...Array(emptyStars)].map((_, i) => (
                <span key={`empty-${i}`} className="stars__star stars__star--empty">★</span>
            ))}
            <span className="stars__count">{reviews?.toLocaleString()}</span>
        </div>
    );
}

export default function ProductCard({ product }) {
    const { addToCart } = useCart();

    const [rating, reviews] = React.useMemo(() => {
        // Simple hash of the ID to get a stable pseudo-random number
        let hash = 0;
        const hashStr = product.id.toString();
        for (let i = 0; i < hashStr.length; i++) {
            hash = (hash << 5) - hash + hashStr.charCodeAt(i);
            hash |= 0;
        }
        const pseudoRand1 = Math.abs(hash) % 100 / 100; // 0 to 0.99
        const pseudoRand2 = Math.abs(hash * 31) % 100 / 100; // 0 to 0.99

        return [
            product.rating || (3.5 + pseudoRand1 * 1.5),
            product.reviews || Math.floor(100 + pseudoRand2 * 3000)
        ];
    }, [product.rating, product.reviews, product.id]);

    return (
        <article className="product-card" id={`product-${product.id}`}>
            <div className="product-card__image-wrap">
                <img
                    className="product-card__image"
                    src={product.image_url}
                    alt={product.name}
                    loading="lazy"
                />
                <span className="product-card__category">{product.category}</span>
                <div className="product-card__badge">LUXE Choice</div>
            </div>
            <div className="product-card__body">
                <h3 className="product-card__name">{product.name}</h3>
                <StarRating rating={rating} reviews={reviews} />
                <p className="product-card__desc">{product.description}</p>
                <div className="product-card__footer">
                    <div className="product-card__pricing">
                        <span className="product-card__price">
                            ${Number(product.price || 0).toFixed(2)}
                        </span>
                        <span className="product-card__delivery">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="1" y="3" width="15" height="13" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
                            </svg>
                            FREE Delivery
                        </span>
                    </div>
                    <button
                        className="product-card__add-btn"
                        onClick={() => addToCart(product)}
                        aria-label={`Add ${product.name} to cart`}
                    >
                        Add to Cart
                    </button>
                </div>
            </div>
        </article>
    );
}
