import React from 'react';
import { BookOpen, Heart, Code2, ShieldCheck, Database, Layers } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-md">
                <BookOpen className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-white">
                DevSphere
              </span>
            </Link>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              A complete, production-grade full-stack blogging platform. Engineered with React, Node.js, Express, MongoDB, and secure JWT authentication.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-800 text-indigo-400 border border-slate-700">
                <Code2 className="w-3.5 h-3.5" /> React + Vite
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-800 text-emerald-400 border border-slate-700">
                <Layers className="w-3.5 h-3.5" /> Express REST API
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-800 text-amber-400 border border-slate-700">
                <Database className="w-3.5 h-3.5" /> MongoDB Mongoose
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-800 text-rose-400 border border-slate-700">
                <ShieldCheck className="w-3.5 h-3.5" /> JWT & Bcrypt
              </span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Platform
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  Explore Articles
                </Link>
              </li>
              <li>
                <Link to="/create-post" className="hover:text-white transition-colors">
                  Publish Post
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-white transition-colors">
                  Author Dashboard
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-white transition-colors">
                  Sign In
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Topics
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <span className="text-slate-400">Web Development</span>
              </li>
              <li>
                <span className="text-slate-400">Distributed Systems</span>
              </li>
              <li>
                <span className="text-slate-400">Artificial Intelligence</span>
              </li>
              <li>
                <span className="text-slate-400">Design Systems & UI</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 mt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} DevSphere Blog Platform. Built for submission & production deployment.</p>
          <p className="flex items-center gap-1">
            Built with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> and precision.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
