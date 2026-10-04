import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  PenSquare,
  LayoutDashboard,
  LogOut,
  LogIn,
  UserPlus,
  Menu,
  X,
  BookOpen,
  Sparkles,
} from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { success } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    success('Logged out successfully');
    navigate('/');
    setMobileMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5 group focus:outline-none"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-slate-900 via-indigo-950 to-indigo-700 bg-clip-text text-transparent">
                DevSphere
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-600 -mt-1">
                Blog Platform
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              to="/"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/')
                  ? 'bg-indigo-50 text-indigo-600 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Explore
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to="/create-post"
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive('/create-post')
                      ? 'bg-indigo-50 text-indigo-600 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <PenSquare className="w-4 h-4" />
                  <span>Write Post</span>
                </Link>

                <Link
                  to="/dashboard"
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive('/dashboard')
                      ? 'bg-indigo-50 text-indigo-600 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Dashboard</span>
                </Link>
              </>
            ) : null}
          </nav>

          {/* Desktop Auth Controls */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 text-white flex items-center justify-center font-bold text-xs ring-2 ring-indigo-100">
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-full h-full object-cover rounded-full"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    ) : (
                      user?.name?.charAt(0).toUpperCase() || 'U'
                    )}
                  </div>
                  <span className="text-sm font-medium text-slate-700 max-w-[120px] truncate">
                    {user?.name}
                  </span>
                </div>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  title="Log out"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Login</span>
                </Link>
                <Link
                  to="/register"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm shadow-indigo-600/30 transition-all hover:shadow-indigo-600/40"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Get Started</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-6 space-y-2 animate-in slide-in-from-top-4 duration-200">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className={`block px-3 py-2 rounded-lg text-base font-medium ${
              isActive('/')
                ? 'bg-indigo-50 text-indigo-600 font-semibold'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            Explore
          </Link>

          {isAuthenticated ? (
            <>
              <Link
                to="/create-post"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-base font-medium ${
                  isActive('/create-post')
                    ? 'bg-indigo-50 text-indigo-600 font-semibold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <PenSquare className="w-5 h-5 text-indigo-600" />
                <span>Write Post</span>
              </Link>
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-base font-medium ${
                  isActive('/dashboard')
                    ? 'bg-indigo-50 text-indigo-600 font-semibold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <LayoutDashboard className="w-5 h-5 text-indigo-600" />
                <span>Dashboard</span>
              </Link>

              <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
                <div className="flex items-center gap-2 px-3 py-1 text-sm text-slate-500">
                  <span>Logged in as:</span>
                  <strong className="text-slate-800">{user?.name}</strong>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-base font-medium text-rose-600 hover:bg-rose-50 transition-colors text-left"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </div>
            </>
          ) : (
            <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-lg text-base font-medium text-slate-700 border border-slate-200 hover:bg-slate-50"
              >
                <LogIn className="w-5 h-5" />
                <span>Login</span>
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-lg text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <UserPlus className="w-5 h-5" />
                <span>Get Started</span>
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
