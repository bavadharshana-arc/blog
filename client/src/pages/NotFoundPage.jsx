import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Home, ArrowLeft } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 text-center">
      <div className="max-w-md w-full space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto shadow-sm">
          <BookOpen className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h1 className="text-6xl font-extrabold text-slate-900 tracking-tight">404</h1>
          <h2 className="text-2xl font-bold text-slate-800">Page Not Found</h2>
          <p className="text-sm text-slate-500 max-w-sm mx-auto">
            The article or page you are looking for might have been moved, deleted, or does not exist.
          </p>
        </div>
        <div className="pt-2 flex items-center justify-center gap-3">
          <Link
            to="/"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/20 transition-all"
          >
            <Home className="w-4 h-4" />
            <span>Go to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
