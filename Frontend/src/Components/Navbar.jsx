import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, User, Menu } from 'lucide-react';

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'Shop', path: '/shop' },
  { label: 'Deals', path: '/deals' },
  { label: 'About', path: '/about' },
  { label: 'Contact', path: '/contact' },
];

const Navbar = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check login on mount
  useEffect(() => {
    const token = localStorage.getItem('token'); // or use cookie
    setIsLoggedIn(!!token);
  }, []);

  return (
    <div className="bg-gradient-to-r from-[#1a1a2e] to-[#16213e] text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold tracking-tight text-white">
          Trendy<span className="text-indigo-400">Cart</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex space-x-8">
          {navLinks.map((link) => (
            <motion.div
              key={link.label}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to={link.path}
                className={`text-sm font-medium transition-all ${
                  location.pathname === link.path
                    ? 'text-indigo-400'
                    : 'text-white hover:text-indigo-300'
                }`}
              >
                {link.label}
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Right Icons */}
        <div className="flex items-center gap-6">
          <Link to="/cart">
            <motion.div whileHover={{ scale: 1.2 }} className="cursor-pointer">
              <ShoppingBag className="h-5 w-5 text-white hover:text-indigo-400" />
            </motion.div>
          </Link>

          {isLoggedIn ? (
            <Link to="/account">
              <motion.div whileHover={{ scale: 1.2 }} className="cursor-pointer">
                <User className="h-5 w-5 text-white hover:text-indigo-400" />
              </motion.div>
            </Link>
          ) : (
            <>
              <Link to="/login" className="text-sm hover:text-indigo-400">
                Login
              </Link>
              <Link to="/signup" className="text-sm hover:text-indigo-400">
                Sign Up
              </Link>
            </>
          )}

          {/* Hamburger for mobile */}
          <motion.div
            whileHover={{ rotate: 90 }}
            className="md:hidden cursor-pointer"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="h-6 w-6 text-white" />
          </motion.div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#16213e] px-6 py-4 space-y-4">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.path}
              className={`block text-sm font-medium ${
                location.pathname === link.path
                  ? 'text-indigo-400'
                  : 'text-white hover:text-indigo-300'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}

        </div>
      )}
    </div>
  );
};

export default Navbar;
