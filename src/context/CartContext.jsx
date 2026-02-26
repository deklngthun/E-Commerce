import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export function useCart() {
    return useContext(CartContext);
}

export function CartProvider({ children }) {
    const [cartItems, setCartItems] = useState(() => {
        try {
            const saved = localStorage.getItem('luxe-cart');
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });
    const [isCartOpen, setIsCartOpen] = useState(false);

    useEffect(() => {
        try {
            localStorage.setItem('luxe-cart', JSON.stringify(cartItems));
        } catch {
            // ignore
        }
    }, [cartItems]);

    const addToCart = (product) => {
        setCartItems((prev) => {
            const existing = prev.find((item) => item.id === product.id);
            if (existing) {
                return prev.map((item) =>
                    item.id === product.id ? { ...item, qty: item.qty + 1 } : item
                );
            }
            return [...prev, { ...product, qty: 1 }];
        });
        setIsCartOpen(true);
    };

    const updateQty = (id, delta) => {
        setCartItems((prev) =>
            prev
                .map((item) =>
                    item.id === id ? { ...item, qty: item.qty + delta } : item
                )
                .filter((item) => item.qty > 0)
        );
    };

    const removeItem = (id) => {
        setCartItems((prev) => prev.filter((item) => item.id !== id));
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const cartCount = cartItems.reduce((sum, item) => sum + item.qty, 0);
    const cartTotal = cartItems.reduce(
        (sum, item) => sum + item.price * item.qty,
        0
    );

    return (
        <CartContext.Provider
            value={{
                cartItems,
                isCartOpen,
                setIsCartOpen,
                addToCart,
                updateQty,
                removeItem,
                clearCart,
                cartCount,
                cartTotal,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}
