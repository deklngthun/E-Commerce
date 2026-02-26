import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="footer" id="footer">
            {/* Back to top */}
            <button className="footer__back-top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                Back to top
            </button>

            <div className="footer__main">
                <div className="container">
                    <div className="footer__grid">
                        <div>
                            <h4 className="footer__heading">Get to Know Us</h4>
                            <a href="#" className="footer__link">About LUXE</a>
                            <a href="#" className="footer__link">Careers</a>
                            <a href="#" className="footer__link">Press Releases</a>
                            <a href="#" className="footer__link">Sustainability</a>
                        </div>

                        <div>
                            <h4 className="footer__heading">Make Money with Us</h4>
                            <Link to="/seller" className="footer__link">Sell on LUXE</Link>
                            <a href="#" className="footer__link">Become an Affiliate</a>
                            <a href="#" className="footer__link">Advertise Your Products</a>
                            <a href="#" className="footer__link">Seller Fulfilled Prime</a>
                        </div>

                        <div>
                            <h4 className="footer__heading">LUXE Payment</h4>
                            <a href="#" className="footer__link">LUXE Rewards Card</a>
                            <a href="#" className="footer__link">Shop with Points</a>
                            <a href="#" className="footer__link">Reload Your Balance</a>
                            <a href="#" className="footer__link">Currency Converter</a>
                        </div>

                        <div>
                            <h4 className="footer__heading">Let Us Help You</h4>
                            <a href="#" className="footer__link">Your Account</a>
                            <a href="#" className="footer__link">Your Orders</a>
                            <a href="#" className="footer__link">Shipping & Delivery</a>
                            <a href="#" className="footer__link">Returns & Refunds</a>
                            <a href="#" className="footer__link">Help Center</a>
                        </div>
                    </div>
                </div>
            </div>

            <div className="footer__bottom">
                <div className="container footer__bottom-inner">
                    <div className="footer__brand">
                        LUX<span>E</span>
                    </div>
                    <span className="footer__copyright">© 2026 LUXE Marketplace. All rights reserved.</span>
                </div>
            </div>
        </footer>
    );
}
