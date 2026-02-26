import { useCart } from '../context/CartContext';

export default function CartDrawer({ onCheckout }) {
    const {
        cartItems,
        isCartOpen,
        setIsCartOpen,
        updateQty,
        removeItem,
        cartCount,
        cartTotal,
    } = useCart();

    return (
        <>
            {/* Overlay */}
            <div
                className={`cart-overlay ${isCartOpen ? 'cart-overlay--open' : ''}`}
                onClick={() => setIsCartOpen(false)}
            />

            {/* Drawer */}
            <aside className={`cart-drawer ${isCartOpen ? 'cart-drawer--open' : ''}`}>
                <div className="cart-drawer__header">
                    <h2 className="cart-drawer__title">
                        Your Cart{' '}
                        <span className="cart-drawer__count">({cartCount} items)</span>
                    </h2>
                    <button
                        className="cart-drawer__close"
                        onClick={() => setIsCartOpen(false)}
                        aria-label="Close cart"
                    >
                        ✕
                    </button>
                </div>

                <div className="cart-drawer__body">
                    {cartItems.length === 0 ? (
                        <div className="cart-drawer__empty">
                            <span className="cart-drawer__empty-icon">🛒</span>
                            <p className="cart-drawer__empty-text">Your cart is empty</p>
                            <p>Discover our curated collection</p>
                        </div>
                    ) : (
                        cartItems.map((item) => (
                            <div className="cart-item" key={item.id}>
                                <img
                                    className="cart-item__image"
                                    src={item.image_url}
                                    alt={item.name}
                                />
                                <div className="cart-item__info">
                                    <span className="cart-item__name">{item.name}</span>
                                    <span className="cart-item__price">
                                        ${(item.price * item.qty).toFixed(2)}
                                    </span>
                                    <div className="cart-item__controls">
                                        <button
                                            className="cart-item__qty-btn"
                                            onClick={() => updateQty(item.id, -1)}
                                            aria-label="Decrease quantity"
                                        >
                                            −
                                        </button>
                                        <span className="cart-item__qty">{item.qty}</span>
                                        <button
                                            className="cart-item__qty-btn"
                                            onClick={() => updateQty(item.id, 1)}
                                            aria-label="Increase quantity"
                                        >
                                            +
                                        </button>
                                        <button
                                            className="cart-item__remove"
                                            onClick={() => removeItem(item.id)}
                                            aria-label="Remove item"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {cartItems.length > 0 && (
                    <div className="cart-drawer__footer">
                        <div className="cart-drawer__totals">
                            <span className="cart-drawer__totals-label">Subtotal</span>
                            <span className="cart-drawer__totals-value">
                                ${cartTotal.toFixed(2)}
                            </span>
                        </div>
                        <button
                            className="btn btn--primary cart-drawer__checkout-btn"
                            onClick={() => {
                                setIsCartOpen(false);
                                onCheckout();
                            }}
                        >
                            Proceed to Checkout
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                )}
            </aside>
        </>
    );
}
