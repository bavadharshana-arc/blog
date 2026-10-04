import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  UserPlus,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  BookOpen,
  Loader2,
  CheckCircle2,
} from 'lucide-react';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { success, error } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const errors = {};
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters long';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters long';
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await register(formData);
      success('Account created successfully! Welcome to DevSphere.');
      navigate('/dashboard');
    } catch (err) {
      console.error('Registration error:', err);
      error(err.response?.data?.message || 'Failed to create account');
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
          <h2 className="text-2xl font-bold text-slate-900">Create your account</h2>
          <p className="text-sm text-slate-500">
            Join our community of developers, designers, and tech writers.
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-8 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label
                htmlFor="name"
                className="block text-xs font-bold uppercase tracking-wider text-slate-700"
              >
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Elena Rostova"
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border bg-slate-50/50 text-slate-900 placeholder-slate-400 text-sm focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                    formErrors.name
                      ? 'border-rose-400 focus:ring-rose-200'
                      : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'
                  }`}
                />
              </div>
              {formErrors.name && (
                <p className="text-xs font-semibold text-rose-600">
                  {formErrors.name}
                </p>
              )}
            </div>

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
                  placeholder="elena@example.com"
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
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="At least 6 characters"
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

            {/* Confirm Password Field */}
            <div className="space-y-1.5">
              <label
                htmlFor="confirmPassword"
                className="block text-xs font-bold uppercase tracking-wider text-slate-700"
              >
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter your password"
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border bg-slate-50/50 text-slate-900 placeholder-slate-400 text-sm focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                    formErrors.confirmPassword
                      ? 'border-rose-400 focus:ring-rose-200'
                      : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'
                  }`}
                />
              </div>
              {formErrors.confirmPassword && (
                <p className="text-xs font-semibold text-rose-600">
                  {formErrors.confirmPassword}
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
                <UserPlus className="w-4 h-4" />
              )}
              <span>Create Account</span>
            </button>
          </form>
        </div>

        {/* Footer Link */}
        <p className="text-center text-sm text-slate-500">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-bold text-indigo-600 hover:text-indigo-700"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
