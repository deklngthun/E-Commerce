import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { supabase } from '../lib/supabase';

const STEPS = ['Shipping', 'Payment', 'Confirmation'];

export default function Checkout({ isOpen, onClose }) {
    const { cartItems, cartTotal, clearCart } = useCart();
    const [step, setStep] = useState(0);
    const [submitting, setSubmitting] = useState(false);
    const [orderId, setOrderId] = useState(null);

    // Form state
    const [form, setForm] = useState({
        name: '',
        email: '',
        address: '',
        city: '',
        zip: '',
        cardNumber: '',
        expiry: '',
        cvv: '',
    });

    const [errors, setErrors] = useState({});

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: '' });
    }

    function validateShipping() {
        const errs = {};
        if (!form.name.trim()) errs.name = true;
        if (!form.email.trim() || !form.email.includes('@')) errs.email = true;
        if (!form.address.trim()) errs.address = true;
        if (!form.city.trim()) errs.city = true;
        if (!form.zip.trim()) errs.zip = true;
        setErrors(errs);
        return Object.keys(errs).length === 0;
    }

    function validatePayment() {
        const errs = {};
        if (!form.cardNumber.trim() || form.cardNumber.replace(/\s/g, '').length < 13)
            errs.cardNumber = true;
        if (!form.expiry.trim()) errs.expiry = true;
        if (!form.cvv.trim() || form.cvv.length < 3) errs.cvv = true;
        setErrors(errs);
        return Object.keys(errs).length === 0;
    }

    async function handleNext() {
        if (step === 0) {
            if (!validateShipping()) return;
            setStep(1);
        } else if (step === 1) {
            if (!validatePayment()) return;
            setSubmitting(true);

            try {
                // Attempt to save order to Supabase
                const { data: order, error: orderError } = await supabase
                    .from('orders')
                    .insert({
                        customer_name: form.name,
                        email: form.email,
                        address: form.address,
                        city: form.city,
                        zip: form.zip,
                        total: cartTotal,
                        status: 'confirmed',
                    })
                    .select()
                    .single();

                if (!orderError && order) {
                    // Save order items
                    const items = cartItems.map((item) => ({
                        order_id: order.id,
                        product_id: item.id,
                        quantity: item.qty,
                        price: item.price,
                    }));

                    await supabase.from('order_items').insert(items);
                    setOrderId(order.id);
                } else {
                    // Supabase not configured — simulate order ID
                    setOrderId('LUXE-' + Date.now().toString(36).toUpperCase());
                }
            } catch {
                // Supabase not available — fallback
                setOrderId('LUXE-' + Date.now().toString(36).toUpperCase());
            }

            clearCart();
            setSubmitting(false);
            setStep(2);
        }
    }

    function handleBack() {
        if (step > 0 && step < 2) setStep(step - 1);
    }

    function handleClose() {
        setStep(0);
        setForm({
            name: '',
            email: '',
            address: '',
            city: '',
            zip: '',
            cardNumber: '',
            expiry: '',
            cvv: '',
        });
        setErrors({});
        setOrderId(null);
        onClose();
    }

    return (
        <div className={`checkout-overlay ${isOpen ? 'checkout-overlay--open' : ''}`}>
            <div className="checkout">
                {/* Header */}
                <div className="checkout__header">
                    <h2 className="checkout__title">
                        {step === 2 ? 'Order Confirmed' : 'Checkout'}
                    </h2>
                    <button
                        className="checkout__close"
                        onClick={handleClose}
                        aria-label="Close checkout"
                    >
                        ✕
                    </button>
                </div>

                {/* Steps indicator */}
                {step < 2 && (
                    <div className="checkout__steps">
                        {STEPS.slice(0, 2).map((label, i) => (
                            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <div
                                    className={`checkout__step ${i === step ? 'checkout__step--active' : ''
                                        } ${i < step ? 'checkout__step--done' : ''}`}
                                >
                                    <span className="checkout__step-number">
                                        {i < step ? '✓' : i + 1}
                                    </span>
                                    {label}
                                </div>
                                {i < 1 && (
                                    <span
                                        className={`checkout__step-divider ${step > 0 ? 'checkout__step-divider--done' : ''
                                            }`}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* Step 0: Shipping */}
                {step === 0 && (
                    <div className="checkout__body">
                        <div className="form-group">
                            <label htmlFor="name">Full Name</label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                value={form.name}
                                onChange={handleChange}
                                placeholder="John Doe"
                                className={errors.name ? 'error' : ''}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email Address</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="john@example.com"
                                className={errors.email ? 'error' : ''}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="address">Shipping Address</label>
                            <input
                                id="address"
                                name="address"
                                type="text"
                                value={form.address}
                                onChange={handleChange}
                                placeholder="123 Main Street"
                                className={errors.address ? 'error' : ''}
                            />
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="city">City</label>
                                <input
                                    id="city"
                                    name="city"
                                    type="text"
                                    value={form.city}
                                    onChange={handleChange}
                                    placeholder="New York"
                                    className={errors.city ? 'error' : ''}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="zip">ZIP Code</label>
                                <input
                                    id="zip"
                                    name="zip"
                                    type="text"
                                    value={form.zip}
                                    onChange={handleChange}
                                    placeholder="10001"
                                    className={errors.zip ? 'error' : ''}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 1: Payment */}
                {step === 1 && (
                    <div className="checkout__body">
                        <div className="form-group">
                            <label htmlFor="cardNumber">Card Number</label>
                            <input
                                id="cardNumber"
                                name="cardNumber"
                                type="text"
                                value={form.cardNumber}
                                onChange={handleChange}
                                placeholder="4242 4242 4242 4242"
                                className={errors.cardNumber ? 'error' : ''}
                            />
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="expiry">Expiry Date</label>
                                <input
                                    id="expiry"
                                    name="expiry"
                                    type="text"
                                    value={form.expiry}
                                    onChange={handleChange}
                                    placeholder="MM/YY"
                                    className={errors.expiry ? 'error' : ''}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="cvv">CVV</label>
                                <input
                                    id="cvv"
                                    name="cvv"
                                    type="text"
                                    value={form.cvv}
                                    onChange={handleChange}
                                    placeholder="123"
                                    className={errors.cvv ? 'error' : ''}
                                />
                            </div>
                        </div>

                        {/* Order summary */}
                        <div
                            style={{
                                background: 'var(--bg)',
                                borderRadius: 'var(--radius-md)',
                                padding: 'var(--space-lg)',
                                marginTop: 'var(--space-md)',
                            }}
                        >
                            <div
                                style={{
                                    fontSize: 'var(--fs-sm)',
                                    fontWeight: 600,
                                    marginBottom: 'var(--space-md)',
                                }}
                            >
                                Order Summary
                            </div>
                            {cartItems.map((item) => (
                                <div
                                    key={item.id}
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        fontSize: 'var(--fs-sm)',
                                        color: 'var(--text-secondary)',
                                        marginBottom: 'var(--space-sm)',
                                    }}
                                >
                                    <span>
                                        {item.name} × {item.qty}
                                    </span>
                                    <span>${(item.price * item.qty).toFixed(2)}</span>
                                </div>
                            ))}
                            <div
                                style={{
                                    borderTop: '1px solid var(--border)',
                                    paddingTop: 'var(--space-md)',
                                    marginTop: 'var(--space-sm)',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    fontWeight: 700,
                                }}
                            >
                                <span>Total</span>
                                <span>${cartTotal.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 2: Confirmation */}
                {step === 2 && (
                    <div className="checkout__confirmation">
                        <div className="checkout__confirmation-icon">✓</div>
                        <h2>Thank You!</h2>
                        <p>
                            Your order <strong>{orderId}</strong> has been placed
                            successfully. We will send a confirmation to your email.
                        </p>
                        <button className="btn btn--primary" onClick={handleClose}>
                            Continue Shopping
                        </button>
                    </div>
                )}

                {/* Navigation buttons */}
                {step < 2 && (
                    <div className="checkout__footer">
                        {step > 0 ? (
                            <button className="btn btn--secondary" onClick={handleBack}>
                                Back
                            </button>
                        ) : (
                            <div />
                        )}
                        <button
                            className="btn btn--primary"
                            onClick={handleNext}
                            disabled={submitting}
                        >
                            {submitting
                                ? 'Processing...'
                                : step === 1
                                    ? `Pay $${cartTotal.toFixed(2)}`
                                    : 'Continue to Payment'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
