import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ onSearch }) {
    const { cartCount, setIsCartOpen } = useCart();
    const { user, profile, isSeller, signOut, setAuthModalOpen } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);
    const [accountOpen, setAccountOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const accountRef = useRef(null);
    const navigate = useNavigate();

    // Close account dropdown on outside click
    useEffect(() => {
        function handleClick(e) {
            if (accountRef.current && !accountRef.current.contains(e.target)) {
                setAccountOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    function handleSearch(e) {
        e.preventDefault();
        if (onSearch) onSearch(searchQuery);
        navigate('/');
    }

    async function handleSignOut() {
        try {
            await signOut();
            setAccountOpen(false);
            navigate('/');
        } catch (err) {
            console.error('Sign out error:', err);
        }
    }

    return (
        <nav className="navbar">
            {/* Top Bar */}
            <div className="navbar__top">
                <div className="container navbar__top-inner">
                    {/* Logo */}
                    <Link to="/" className="navbar__logo" onClick={() => setMenuOpen(false)}>
                        LUX<span>E</span>
                    </Link>

                    {/* Search Bar */}
                    <form className="navbar__search" onSubmit={handleSearch}>
                        <input
                            type="text"
                            className="navbar__search-input"
                            placeholder="Search products, categories, brands..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            aria-label="Search products"
                        />
                        <button type="submit" className="navbar__search-btn" aria-label="Search">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
                            </svg>
                        </button>
                    </form>

                    {/* Right Actions */}
                    <div className="navbar__actions">
                        {/* Account */}
                        <div className="navbar__account" ref={accountRef}>
                            {user ? (
                                <>
                                    <button
                                        className="navbar__account-btn"
                                        onClick={() => setAccountOpen(!accountOpen)}
                                    >
                                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                            <circle cx="12" cy="7" r="4" />
                                        </svg>
                                        <div className="navbar__account-info">
                                            <span className="navbar__account-greeting">Hello, {profile?.full_name?.split(' ')[0] || 'User'}</span>
                                            <span className="navbar__account-label">Account & Lists</span>
                                        </div>
                                    </button>

                                    {accountOpen && (
                                        <div className="navbar__dropdown">
                                            <div className="navbar__dropdown-header">
                                                <strong>{profile?.full_name || 'User'}</strong>
                                                <span className={`navbar__role-badge navbar__role-badge--${profile?.role}`}>
                                                    {profile?.role === 'seller' ? '🏪 Seller' : '🛒 Buyer'}
                                                </span>
                                            </div>
                                            <div className="navbar__dropdown-divider" />
                                            {isSeller && (
                                                <Link
                                                    to="/seller"
                                                    className="navbar__dropdown-item"
                                                    onClick={() => setAccountOpen(false)}
                                                >
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
                                                    </svg>
                                                    Seller Dashboard
                                                </Link>
                                            )}
                                            <button className="navbar__dropdown-item navbar__dropdown-item--signout" onClick={handleSignOut}>
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
                                                </svg>
                                                Sign Out
                                            </button>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <button
                                    className="navbar__account-btn"
                                    onClick={() => setAuthModalOpen(true)}
                                >
                                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                        <circle cx="12" cy="7" r="4" />
                                    </svg>
                                    <div className="navbar__account-info">
                                        <span className="navbar__account-greeting">Hello, Sign in</span>
                                        <span className="navbar__account-label">Account & Lists</span>
                                    </div>
                                </button>
                            )}
                        </div>

                        {/* Cart */}
                        <button
                            className="navbar__cart-btn"
                            onClick={() => setIsCartOpen(true)}
                            aria-label="Open cart"
                        >
                            <svg className="navbar__cart-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="9" cy="21" r="1" />
                                <circle cx="20" cy="21" r="1" />
                                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                            </svg>
                            <span className="navbar__cart-label">Cart</span>
                            {cartCount > 0 && (
                                <span className="navbar__cart-badge" key={cartCount}>
                                    {cartCount}
                                </span>
                            )}
                        </button>

                        {/* Mobile Hamburger */}
                        <button
                            className="navbar__hamburger"
                            onClick={() => setMenuOpen(!menuOpen)}
                            aria-label="Toggle menu"
                        >
                            <span></span>
                            <span></span>
                            <span></span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Bottom Category Bar */}
            <div className={`navbar__bottom ${menuOpen ? 'navbar__bottom--open' : ''}`}>
                <div className="container navbar__bottom-inner">
                    <Link to="/" className="navbar__cat-link" onClick={() => { setMenuOpen(false); if (onSearch) onSearch(''); }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
                        </svg>
                        All
                    </Link>
                    {['Electronics', 'Accessories', 'Home', 'Audio', 'Fashion', 'Bags', 'Deals'].map((cat) => (
                        <button
                            key={cat}
                            className="navbar__cat-link"
                            onClick={() => {
                                if (onSearch) onSearch(cat === 'Deals' ? '' : cat);
                                setMenuOpen(false);
                                navigate('/');
                            }}
                        >
                            {cat}
                        </button>
                    ))}
                    {isSeller && (
                        <Link to="/seller" className="navbar__cat-link navbar__cat-link--seller" onClick={() => setMenuOpen(false)}>
                            🏪 Seller Hub
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}
