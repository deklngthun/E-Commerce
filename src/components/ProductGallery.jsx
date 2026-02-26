import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import ProductCard from './ProductCard';

// Fallback product data used when Supabase is not configured
const FALLBACK_PRODUCTS = [
    {
        id: '1',
        name: 'Matte Black Headphones',
        description: 'Premium wireless over-ear headphones with active noise cancellation and 30-hour battery life.',
        price: 249.00,
        image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80',
        category: 'Audio',
        rating: 4.5,
        reviews: 2847,
    },
    {
        id: '2',
        name: 'Minimalist Watch',
        description: 'Swiss-made quartz movement with sapphire crystal glass and Italian leather strap.',
        price: 189.00,
        image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80',
        category: 'Accessories',
        rating: 4.7,
        reviews: 1923,
    },
    {
        id: '3',
        name: 'Tortoiseshell Sunglasses',
        description: 'Hand-polished acetate frames with polarized UV400 lenses. Timeless style.',
        price: 129.00,
        image_url: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&q=80',
        category: 'Eyewear',
        rating: 4.3,
        reviews: 856,
    },
    {
        id: '4',
        name: 'Leather Backpack',
        description: 'Full-grain vegetable-tanned leather with padded 15" laptop compartment.',
        price: 319.00,
        image_url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80',
        category: 'Bags',
        rating: 4.8,
        reviews: 3201,
    },
    {
        id: '5',
        name: 'Ceramic Pour Over Set',
        description: 'Handcrafted ceramic dripper and server. Makes the perfect single cup every time.',
        price: 68.00,
        image_url: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=80',
        category: 'Home',
        rating: 4.6,
        reviews: 412,
    },
    {
        id: '6',
        name: 'Midnight Water Bottle',
        description: 'Double-wall vacuum insulated stainless steel. Keeps drinks cold 24h or hot 12h.',
        price: 42.00,
        image_url: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&q=80',
        category: 'Essentials',
        rating: 4.4,
        reviews: 1567,
    },
    {
        id: '7',
        name: 'Canvas Tote Bag',
        description: 'Organic cotton canvas with reinforced handles. Spacious everyday carry.',
        price: 54.00,
        image_url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&q=80',
        category: 'Bags',
        rating: 4.2,
        reviews: 689,
    },
    {
        id: '8',
        name: 'Wireless Charging Pad',
        description: 'Qi-certified fast wireless charger with soft-touch surface. Works through most cases.',
        price: 39.00,
        image_url: 'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=600&q=80',
        category: 'Tech',
        rating: 4.1,
        reviews: 2103,
    },
];

const SORT_OPTIONS = [
    { value: 'relevance', label: 'Relevance' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'newest', label: 'Newest Arrivals' },
    { value: 'rating', label: 'Avg. Customer Review' },
];

export default function ProductGallery({ searchQuery = '' }) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState('relevance');
    const [selectedCategory, setSelectedCategory] = useState('All');

    useEffect(() => {
        fetchProducts();
    }, []);

    // Set category from search
    useEffect(() => {
        if (searchQuery) {
            const cats = [...new Set(products.map(p => p.category))];
            const match = cats.find(c => c.toLowerCase() === searchQuery.toLowerCase());
            if (match) {
                setSelectedCategory(match);
            } else {
                setSelectedCategory('All');
            }
        }
    }, [searchQuery, products]);

    async function fetchProducts() {
        try {
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .order('created_at', { ascending: false });

            if (error || !data || data.length === 0) {
                setProducts(FALLBACK_PRODUCTS);
            } else {
                // Add fallback ratings for DB products
                const enhanced = data.map(p => ({
                    ...p,
                    rating: p.rating || (3.5 + Math.random() * 1.5),
                    reviews: p.reviews || Math.floor(100 + Math.random() * 3000),
                }));
                setProducts(enhanced);
            }
        } catch {
            setProducts(FALLBACK_PRODUCTS);
        } finally {
            setLoading(false);
        }
    }

    // Get categories from products
    const categories = ['All', ...new Set(products.map(p => p.category))];

    // Filter products
    let filtered = [...products];

    // Category filter
    if (selectedCategory !== 'All') {
        filtered = filtered.filter(p => p.category === selectedCategory);
    }

    // Search filter
    if (searchQuery && !categories.includes(searchQuery)) {
        const q = searchQuery.toLowerCase();
        filtered = filtered.filter(p =>
            p.name.toLowerCase().includes(q) ||
            p.description?.toLowerCase().includes(q) ||
            p.category?.toLowerCase().includes(q)
        );
    }

    // Sort
    switch (sortBy) {
        case 'price-asc':
            filtered.sort((a, b) => a.price - b.price);
            break;
        case 'price-desc':
            filtered.sort((a, b) => b.price - a.price);
            break;
        case 'newest':
            filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            break;
        case 'rating':
            filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
            break;
        default:
            break;
    }

    return (
        <section className="section" id="products">
            <div className="container">
                {/* Results Header */}
                <div className="gallery__header">
                    <div className="gallery__results-info">
                        {searchQuery && (
                            <p className="gallery__results-text">
                                {filtered.length} result{filtered.length !== 1 ? 's' : ''} for "<strong>{searchQuery}</strong>"
                            </p>
                        )}
                        {!searchQuery && (
                            <h2 className="gallery__title">All Products</h2>
                        )}
                    </div>
                    <div className="gallery__controls">
                        <select
                            className="gallery__sort"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            aria-label="Sort by"
                        >
                            {SORT_OPTIONS.map((opt) => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="gallery__layout">
                    {/* Category Sidebar */}
                    <aside className="gallery__sidebar">
                        <h3 className="gallery__sidebar-title">Category</h3>
                        <ul className="gallery__categories">
                            {categories.map((cat) => (
                                <li key={cat}>
                                    <button
                                        className={`gallery__category-btn ${selectedCategory === cat ? 'gallery__category-btn--active' : ''}`}
                                        onClick={() => setSelectedCategory(cat)}
                                    >
                                        {cat}
                                        <span className="gallery__category-count">
                                            {cat === 'All' ? products.length : products.filter(p => p.category === cat).length}
                                        </span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </aside>

                    {/* Products Grid */}
                    <div className="gallery__content">
                        {loading ? (
                            <div className="spinner">
                                <div className="spinner__dot"></div>
                                <div className="spinner__dot"></div>
                                <div className="spinner__dot"></div>
                            </div>
                        ) : filtered.length === 0 ? (
                            <div className="gallery__empty">
                                <span className="gallery__empty-icon">🔍</span>
                                <h3>No products found</h3>
                                <p>Try adjusting your search or filter criteria.</p>
                                <button
                                    className="btn btn--secondary"
                                    onClick={() => { setSelectedCategory('All'); }}
                                >
                                    Clear Filters
                                </button>
                            </div>
                        ) : (
                            <div className="products__grid">
                                {filtered.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
