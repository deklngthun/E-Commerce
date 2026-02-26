import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductGallery from './components/ProductGallery';
import Features from './components/Features';
import CartDrawer from './components/CartDrawer';
import Checkout from './components/Checkout';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import SellerDashboard from './components/SellerDashboard';

function HomePage({ searchQuery, onSearch, onCategoryClick }) {
  return (
    <>
      <Hero onCategoryClick={onCategoryClick} />
      <Features />
      <ProductGallery searchQuery={searchQuery} />
    </>
  );
}

export default function App() {
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  function handleSearch(query) {
    setSearchQuery(query);
  }

  function handleCategoryClick(category) {
    setSearchQuery(category);
  }

  return (
    <>
      <Navbar onSearch={handleSearch} />
      <main>
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                searchQuery={searchQuery}
                onSearch={handleSearch}
                onCategoryClick={handleCategoryClick}
              />
            }
          />
          <Route path="/seller" element={<SellerDashboard />} />
        </Routes>
      </main>
      <Footer />

      {/* Overlays */}
      <CartDrawer onCheckout={() => setCheckoutOpen(true)} />
      <Checkout isOpen={checkoutOpen} onClose={() => setCheckoutOpen(false)} />
      <AuthModal />
    </>
  );
}
