import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

const CATEGORIES = ['Electronics', 'Accessories', 'Home', 'Eyewear', 'Bags', 'Audio', 'Tech', 'Essentials', 'Fashion', 'General'];

export default function SellerDashboard() {
    const { user, profile, isSeller, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [toast, setToast] = useState('');

    const [form, setForm] = useState({
        name: '',
        description: '',
        price: '',
        category: 'General',
        image_url: '',
    });

    useEffect(() => {
        if (!authLoading && (!user || !isSeller)) {
            navigate('/');
        }
    }, [user, isSeller, authLoading, navigate]);

    useEffect(() => {
        if (user && isSeller) {
            fetchMyProducts();
        }
    }, [user, isSeller]);

    async function fetchMyProducts() {
        try {
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .eq('seller_id', user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setProducts(data || []);
        } catch (err) {
            console.error('Error fetching products:', err);
        } finally {
            setLoading(false);
        }
    }

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    function handleEdit(product) {
        setForm({
            name: product.name,
            description: product.description || '',
            price: product.price.toString(),
            category: product.category || 'General',
            image_url: product.image_url || '',
        });
        setEditingId(product.id);
        setShowForm(true);
    }

    function handleCancel() {
        setForm({ name: '', description: '', price: '', category: 'General', image_url: '' });
        setEditingId(null);
        setShowForm(false);
    }

    function showToast(msg) {
        setToast(msg);
        setTimeout(() => setToast(''), 3000);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setSubmitting(true);

        const productData = {
            name: form.name,
            description: form.description,
            price: parseFloat(form.price),
            category: form.category,
            image_url: form.image_url || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80',
            seller_id: user.id,
        };

        try {
            if (editingId) {
                const { error } = await supabase
                    .from('products')
                    .update(productData)
                    .eq('id', editingId)
                    .eq('seller_id', user.id);
                if (error) throw error;
                showToast('Product updated successfully!');
            } else {
                const { error } = await supabase
                    .from('products')
                    .insert(productData);
                if (error) throw error;
                showToast('Product added successfully!');
            }
            handleCancel();
            await fetchMyProducts();
        } catch (err) {
            showToast('Error: ' + (err.message || 'Something went wrong'));
        } finally {
            setSubmitting(false);
        }
    }

    async function handleDelete(id) {
        if (!confirm('Are you sure you want to delete this product?')) return;
        try {
            const { error } = await supabase
                .from('products')
                .delete()
                .eq('id', id)
                .eq('seller_id', user.id);
            if (error) throw error;
            showToast('Product deleted.');
            await fetchMyProducts();
        } catch (err) {
            showToast('Error deleting product: ' + err.message);
        }
    }

    if (authLoading || loading) {
        return (
            <div className="seller-dashboard">
                <div className="container">
                    <div className="spinner">
                        <div className="spinner__dot"></div>
                        <div className="spinner__dot"></div>
                        <div className="spinner__dot"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="seller-dashboard">
            <div className="container">
                {/* Header */}
                <div className="seller-dashboard__header">
                    <div>
                        <h1 className="seller-dashboard__title">Seller Dashboard</h1>
                        <p className="seller-dashboard__subtitle">
                            Welcome back, <strong>{profile?.full_name || 'Seller'}</strong> — manage your product listings below.
                        </p>
                    </div>
                    <button
                        className="btn btn--primary"
                        onClick={() => { setShowForm(true); setEditingId(null); }}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 5v14M5 12h14" />
                        </svg>
                        Add Product
                    </button>
                </div>

                {/* Stats */}
                <div className="seller-dashboard__stats">
                    <div className="seller-stat">
                        <span className="seller-stat__number">{products.length}</span>
                        <span className="seller-stat__label">Total Products</span>
                    </div>
                    <div className="seller-stat">
                        <span className="seller-stat__number">{new Set(products.map(p => p.category)).size}</span>
                        <span className="seller-stat__label">Categories</span>
                    </div>
                    <div className="seller-stat">
                        <span className="seller-stat__number">
                            ${products.reduce((sum, p) => sum + Number(p.price), 0).toFixed(0)}
                        </span>
                        <span className="seller-stat__label">Total Inventory Value</span>
                    </div>
                </div>

                {/* Add/Edit Form */}
                {showForm && (
                    <div className="seller-form-card">
                        <h2 className="seller-form-card__title">
                            {editingId ? 'Edit Product' : 'Add New Product'}
                        </h2>
                        <form onSubmit={handleSubmit}>
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="prod-name">Product Name</label>
                                    <input
                                        id="prod-name"
                                        name="name"
                                        type="text"
                                        value={form.name}
                                        onChange={handleChange}
                                        placeholder="e.g. Wireless Bluetooth Headphones"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="prod-price">Price ($)</label>
                                    <input
                                        id="prod-price"
                                        name="price"
                                        type="number"
                                        step="0.01"
                                        min="0.01"
                                        value={form.price}
                                        onChange={handleChange}
                                        placeholder="29.99"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="prod-desc">Description</label>
                                <textarea
                                    id="prod-desc"
                                    name="description"
                                    value={form.description}
                                    onChange={handleChange}
                                    placeholder="Describe your product..."
                                    rows={3}
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="prod-category">Category</label>
                                    <select
                                        id="prod-category"
                                        name="category"
                                        value={form.category}
                                        onChange={handleChange}
                                    >
                                        {CATEGORIES.map((cat) => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="prod-image">Image URL</label>
                                    <input
                                        id="prod-image"
                                        name="image_url"
                                        type="url"
                                        value={form.image_url}
                                        onChange={handleChange}
                                        placeholder="https://images.unsplash.com/..."
                                    />
                                </div>
                            </div>

                            <div className="seller-form-card__actions">
                                <button type="button" className="btn btn--secondary" onClick={handleCancel}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn--primary" disabled={submitting}>
                                    {submitting ? 'Saving...' : editingId ? 'Update Product' : 'Add Product'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Products Table */}
                {products.length === 0 && !showForm ? (
                    <div className="seller-dashboard__empty">
                        <div className="seller-dashboard__empty-icon">📦</div>
                        <h3>No products yet</h3>
                        <p>Start selling by adding your first product.</p>
                        <button className="btn btn--primary" onClick={() => setShowForm(true)}>
                            Add Your First Product
                        </button>
                    </div>
                ) : products.length > 0 && (
                    <div className="seller-products-table-wrap">
                        <table className="seller-products-table">
                            <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>Category</th>
                                    <th>Price</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((product) => (
                                    <tr key={product.id}>
                                        <td>
                                            <div className="seller-product-cell">
                                                <img
                                                    src={product.image_url || 'https://via.placeholder.com/48'}
                                                    alt={product.name}
                                                    className="seller-product-cell__img"
                                                />
                                                <div>
                                                    <div className="seller-product-cell__name">{product.name}</div>
                                                    <div className="seller-product-cell__desc">
                                                        {product.description?.slice(0, 60)}
                                                        {product.description?.length > 60 ? '...' : ''}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <span className="seller-category-badge">{product.category}</span>
                                        </td>
                                        <td className="seller-price">${Number(product.price).toFixed(2)}</td>
                                        <td>
                                            <div className="seller-actions">
                                                <button
                                                    className="seller-actions__btn seller-actions__btn--edit"
                                                    onClick={() => handleEdit(product)}
                                                    title="Edit"
                                                >
                                                    ✏️
                                                </button>
                                                <button
                                                    className="seller-actions__btn seller-actions__btn--delete"
                                                    onClick={() => handleDelete(product.id)}
                                                    title="Delete"
                                                >
                                                    🗑️
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Toast */}
            {toast && <div className="toast">{toast}</div>}
        </div>
    );
}
