import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  LogIn,
  Mail,
  Lock,
  Eye,
  EyeOff,
  BookOpen,
  Loader2,
  Sparkles,
} from 'lucide-react';

const DEMO_USERS = [
  {
    name: 'Alex Rivera',
    email: 'alex@example.com',
    role: 'Full Stack Dev',
  },
  {
    name: 'Sophia Chen',
    email: 'sophia@example.com',
    role: 'UI/UX Designer',
  },
  {
    name: 'Marcus Vance',
    email: 'marcus@example.com',
    role: 'AI Researcher',
  },
];

const LoginPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();
  const { success, error } = useToast();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const redirectPath = searchParams.get('redirect') || '/dashboard';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleDemoFill = (email) => {
    setFormData({
      email,
      password: 'Password123!',
    });
    setFormErrors({});
  };

  const validate = () => {
    const errors = {};
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await login(formData);
      success('Welcome back!');
      navigate(redirectPath);
    } catch (err) {
      console.error('Login error:', err);
      error(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-6">
        {/* Brand Card Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md">
              <BookOpen className="w-5 h-5" />
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-slate-900">
              DevSphere
            </span>
          </Link>
          <h2 className="text-2xl font-bold text-slate-900">Sign in to your account</h2>
          <p className="text-sm text-slate-500">
            Enter your credentials to manage your articles and join discussions.
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-8 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="block text-xs font-bold uppercase tracking-wider text-slate-700"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border bg-slate-50/50 text-slate-900 placeholder-slate-400 text-sm focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                    formErrors.email
                      ? 'border-rose-400 focus:ring-rose-200'
                      : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'
                  }`}
                />
              </div>
              {formErrors.email && (
                <p className="text-xs font-semibold text-rose-600">
                  {formErrors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label
                htmlFor="password"
                className="block text-xs font-bold uppercase tracking-wider text-slate-700"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-10 py-2.5 rounded-xl border bg-slate-50/50 text-slate-900 placeholder-slate-400 text-sm focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                    formErrors.password
                      ? 'border-rose-400 focus:ring-rose-200'
                      : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {formErrors.password && (
                <p className="text-xs font-semibold text-rose-600">
                  {formErrors.password}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/20 disabled:opacity-50 transition-all hover:scale-[1.01]"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <LogIn className="w-4 h-4" />
              )}
              <span>Sign In</span>
            </button>
          </form>

          {/* Quick Demo Credentials */}
          <div className="pt-4 border-t border-slate-100 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Quick Demo Sign-In:</span>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {DEMO_USERS.map((demo) => (
                <button
                  key={demo.email}
                  type="button"
                  onClick={() => handleDemoFill(demo.email)}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-indigo-50 hover:border-indigo-200 border border-slate-200 text-left transition-all text-xs group"
                >
                  <div className="font-semibold text-slate-700 group-hover:text-indigo-600">
                    {demo.name} <span className="font-normal text-slate-400">({demo.role})</span>
                  </div>
                  <span className="text-[10px] font-semibold text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    Fill &rarr;
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Link */}
        <p className="text-center text-sm text-slate-500">
          Don't have an account yet?{' '}
          <Link
            to="/register"
            className="font-bold text-indigo-600 hover:text-indigo-700"
          >
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
