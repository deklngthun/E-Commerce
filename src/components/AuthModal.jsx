import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function AuthModal() {
    const { authModalOpen, setAuthModalOpen, signIn, signUp } = useAuth();
    const [mode, setMode] = useState('login'); // 'login' | 'register'
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [form, setForm] = useState({
        email: '',
        password: '',
        fullName: '',
        role: 'buyer',
    });

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError('');
    }

    function switchMode(newMode) {
        setMode(newMode);
        setError('');
        setSuccess('');
        setForm({ email: '', password: '', fullName: '', role: 'buyer' });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            if (mode === 'login') {
                await signIn({ email: form.email, password: form.password });
                setAuthModalOpen(false);
                resetForm();
            } else {
                if (!form.fullName.trim()) {
                    setError('Please enter your full name.');
                    setLoading(false);
                    return;
                }
                if (form.password.length < 6) {
                    setError('Password must be at least 6 characters.');
                    setLoading(false);
                    return;
                }
                await signUp({
                    email: form.email,
                    password: form.password,
                    fullName: form.fullName,
                    role: form.role,
                });
                setSuccess('Account created! Check your email to confirm, or sign in now.');
                switchMode('login');
            }
        } catch (err) {
            setError(err.message || 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    }

    function resetForm() {
        setForm({ email: '', password: '', fullName: '', role: 'buyer' });
        setError('');
        setSuccess('');
        setMode('login');
    }

    function handleClose() {
        setAuthModalOpen(false);
        resetForm();
    }

    if (!authModalOpen) return null;

    return (
        <div className="auth-overlay" onClick={handleClose}>
            <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
                {/* Close button */}
                <button className="auth-modal__close" onClick={handleClose} aria-label="Close">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                </button>

                {/* Logo */}
                <div className="auth-modal__logo">
                    LUX<span>E</span>
                </div>

                {/* Tabs */}
                <div className="auth-modal__tabs">
                    <button
                        className={`auth-modal__tab ${mode === 'login' ? 'auth-modal__tab--active' : ''}`}
                        onClick={() => switchMode('login')}
                    >
                        Sign In
                    </button>
                    <button
                        className={`auth-modal__tab ${mode === 'register' ? 'auth-modal__tab--active' : ''}`}
                        onClick={() => switchMode('register')}
                    >
                        Create Account
                    </button>
                </div>

                {/* Messages */}
                {error && (
                    <div className="auth-modal__message auth-modal__message--error">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" /><path d="M15 9l-6 6M9 9l6 6" />
                        </svg>
                        {error}
                    </div>
                )}
                {success && (
                    <div className="auth-modal__message auth-modal__message--success">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
                        </svg>
                        {success}
                    </div>
                )}

                {/* Form */}
                <form className="auth-modal__form" onSubmit={handleSubmit}>
                    {mode === 'register' && (
                        <div className="form-group">
                            <label htmlFor="auth-fullName">Full Name</label>
                            <input
                                id="auth-fullName"
                                name="fullName"
                                type="text"
                                value={form.fullName}
                                onChange={handleChange}
                                placeholder="John Doe"
                                required
                                autoComplete="name"
                            />
                        </div>
                    )}

                    <div className="form-group">
                        <label htmlFor="auth-email">Email Address</label>
                        <input
                            id="auth-email"
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="you@example.com"
                            required
                            autoComplete="email"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="auth-password">Password</label>
                        <input
                            id="auth-password"
                            name="password"
                            type="password"
                            value={form.password}
                            onChange={handleChange}
                            placeholder={mode === 'register' ? 'At least 6 characters' : 'Enter your password'}
                            required
                            minLength={6}
                            autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
                        />
                    </div>

                    {mode === 'register' && (
                        <div className="form-group">
                            <label>I want to</label>
                            <div className="auth-modal__role-selector">
                                <button
                                    type="button"
                                    className={`auth-modal__role-btn ${form.role === 'buyer' ? 'auth-modal__role-btn--active' : ''}`}
                                    onClick={() => setForm({ ...form, role: 'buyer' })}
                                >
                                    <span className="auth-modal__role-icon">🛒</span>
                                    <span className="auth-modal__role-label">Buy Products</span>
                                    <span className="auth-modal__role-desc">Browse & shop</span>
                                </button>
                                <button
                                    type="button"
                                    className={`auth-modal__role-btn ${form.role === 'seller' ? 'auth-modal__role-btn--active' : ''}`}
                                    onClick={() => setForm({ ...form, role: 'seller' })}
                                >
                                    <span className="auth-modal__role-icon">🏪</span>
                                    <span className="auth-modal__role-label">Sell Products</span>
                                    <span className="auth-modal__role-desc">List & manage</span>
                                </button>
                            </div>
                        </div>
                    )}

                    <button
                        type="submit"
                        className="btn btn--primary auth-modal__submit"
                        disabled={loading}
                    >
                        {loading
                            ? 'Please wait...'
                            : mode === 'login'
                                ? 'Sign In'
                                : 'Create Account'}
                    </button>
                </form>

                {/* Footer */}
                <div className="auth-modal__footer">
                    {mode === 'login' ? (
                        <p>
                            New to LUXE?{' '}
                            <button className="auth-modal__link" onClick={() => switchMode('register')}>
                                Create an account
                            </button>
                        </p>
                    ) : (
                        <p>
                            Already have an account?{' '}
                            <button className="auth-modal__link" onClick={() => switchMode('login')}>
                                Sign in
                            </button>
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
