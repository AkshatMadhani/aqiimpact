import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Wind, User, LogOut, Shield, Menu, X, Sparkles, Calculator, Map, BarChart3 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

const Navbar = () => {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  // Base nav links - everyone sees these
  const baseNavLinks = [
    { to: '/', label: 'Home', icon: Wind },
  ];

  // Authenticated user links - only visible when logged in
  const authNavLinks = isAuthenticated ? [
    { to: '/exposure', label: 'Exposure', icon: Calculator },
    { to: '/routes', label: 'Routes', icon: Map },
  ] : [];

  // Admin-only links - only visible to admin users
  const adminNavLinks = isAdmin ? [
    { to: '/city-actions', label: 'City Actions', icon: BarChart3 },
  ] : [];

  // Combine all nav links
  const navLinks = [...baseNavLinks, ...authNavLinks, ...adminNavLinks];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="bg-white border-b-4 border-gray-900 sticky top-0 z-50 shadow-[0_4px_0px_0px_#111827]"
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <motion.div
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-br from-blue-500 to-purple-500 p-3 rounded-2xl border-2 border-gray-900 shadow-[2px_2px_0px_0px_#111827]"
            >
              <Wind className="w-6 h-6 text-white" />
            </motion.div>
            <span className="text-2xl font-black text-gray-900">
              Air<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">Impact</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-2">
            {navLinks.map((link) => (
              <Link key={link.to} to={link.to}>
                <motion.div
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 rounded-xl font-bold text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-all border-2 border-transparent hover:border-gray-900 flex items-center gap-2"
                >
                  {link.icon && <link.icon className="w-4 h-4" />}
                  {link.label}
                </motion.div>
              </Link>
            ))}
            {isAdmin && (
              <Link to="/admin">
                <motion.div
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 rounded-xl font-bold bg-yellow-300 text-gray-900 border-2 border-gray-900 shadow-[2px_2px_0px_0px_#111827] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all flex items-center gap-2"
                >
                  <Shield className="w-4 h-4" />
                  Admin
                </motion.div>
              </Link>
            )}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border-2 border-gray-900"
                >
                  <div className="bg-gradient-to-br from-blue-500 to-purple-500 p-2 rounded-lg border-2 border-gray-900">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-bold text-gray-900">{user?.name}</span>
                  {isAdmin && (
                    <span className="bg-yellow-300 text-gray-900 px-2 py-1 rounded-full text-xs font-black border border-gray-900">
                      ADMIN
                    </span>
                  )}
                </motion.div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white font-bold rounded-xl border-2 border-gray-900 shadow-[2px_2px_0px_0px_#111827] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </motion.button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-2 font-bold text-gray-900 rounded-xl border-2 border-gray-900 bg-white hover:bg-gray-50 shadow-[2px_2px_0px_0px_#111827] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                  >
                    Login
                  </motion.button>
                </Link>
                <Link to="/register">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-2 font-bold bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl border-2 border-gray-900 shadow-[2px_2px_0px_0px_#111827] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all flex items-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    Register
                  </motion.button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl border-2 border-gray-900 bg-white shadow-[2px_2px_0px_0px_#111827]"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </motion.button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden mt-4 pt-4 border-t-2 border-gray-900"
          >
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link key={link.to} to={link.to} onClick={() => setMobileMenuOpen(false)}>
                  <motion.div
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-3 rounded-xl font-bold text-gray-700 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 transition-all border-2 border-gray-900 flex items-center gap-2"
                  >
                    {link.icon && <link.icon className="w-4 h-4" />}
                    {link.label}
                  </motion.div>
                </Link>
              ))}
              {isAdmin && (
                <Link to="/admin" onClick={() => setMobileMenuOpen(false)}>
                  <motion.div
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-3 rounded-xl font-bold bg-yellow-300 text-gray-900 border-2 border-gray-900 shadow-[2px_2px_0px_0px_#111827] flex items-center gap-2"
                  >
                    <Shield className="w-4 h-4" />
                    Admin Dashboard
                  </motion.div>
                </Link>
              )}
              
              <div className="mt-4 pt-4 border-t-2 border-gray-900 flex flex-col gap-2">
                {isAuthenticated ? (
                  <>
                    <div className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border-2 border-gray-900">
                      <div className="bg-gradient-to-br from-blue-500 to-purple-500 p-2 rounded-lg border-2 border-gray-900">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <span className="font-bold text-gray-900">{user?.name}</span>
                      {isAdmin && (
                        <span className="bg-yellow-300 text-gray-900 px-2 py-1 rounded-full text-xs font-black border border-gray-900">
                          ADMIN
                        </span>
                      )}
                    </div>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={handleLogout}
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-red-500 text-white font-bold rounded-xl border-2 border-gray-900 shadow-[2px_2px_0px_0px_#111827]"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </motion.button>
                  </>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        className="w-full px-4 py-3 font-bold text-gray-900 rounded-xl border-2 border-gray-900 bg-white shadow-[2px_2px_0px_0px_#111827]"
                      >
                        Login
                      </motion.button>
                    </Link>
                    <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        className="w-full px-4 py-3 font-bold bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl border-2 border-gray-900 shadow-[2px_2px_0px_0px_#111827] flex items-center justify-center gap-2"
                      >
                        <Sparkles className="w-4 h-4" />
                        Register
                      </motion.button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
};

export default Navbar;