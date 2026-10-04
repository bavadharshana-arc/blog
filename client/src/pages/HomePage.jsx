import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { postService } from '../services/api';
import PostCard from '../components/PostCard';
import { PostCardSkeleton } from '../components/SkeletonLoader';
import {
  Search,
  Filter,
  SlidersHorizontal,
  Sparkles,
  PenSquare,
  BookOpen,
  X,
  RefreshCw,
} from 'lucide-react';

const CATEGORIES = [
  'All',
  'Technology',
  'Web Development',
  'AI & Future',
  'Design & UI',
  'Tutorials',
  'Productivity',
];

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortOrder, setSortOrder] = useState('newest'); // 'newest' | 'oldest'

  // Debounced search trigger
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 350);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const loadPosts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = {
        sort: sortOrder,
      };
      if (debouncedSearch.trim()) {
        params.search = debouncedSearch.trim();
      }
      if (activeCategory !== 'All') {
        params.category = activeCategory;
      }

      const res = await postService.getAllPosts(params);
      if (res.success && res.data) {
        setPosts(res.data);
      }
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError(
        err.response?.data?.message ||
          'Unable to connect to the backend server. Make sure MongoDB and backend are running.'
      );
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearch, activeCategory, sortOrder]);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const clearFilters = () => {
    setSearchQuery('');
    setActiveCategory('All');
    setSortOrder('newest');
  };

  const isFiltered = searchQuery.trim() !== '' || activeCategory !== 'All' || sortOrder !== 'newest';

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-8 sm:p-12 md:p-16 shadow-2xl border border-slate-800">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold tracking-wide backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Discover Knowledge & Engineering Insights</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight sm:leading-none">
            Where Ideas, Code & Architecture Converge
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl font-normal">
            Explore in-depth articles on modern software engineering, web architectures, AI workflows, and design systems. Write your own stories and join the conversation.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              to="/create-post"
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all hover:scale-105"
            >
              <PenSquare className="w-4 h-4" />
              <span>Start Writing</span>
            </Link>
            <a
              href="#explore"
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm bg-white/10 hover:bg-white/15 text-white border border-white/10 transition-all backdrop-blur-md"
            >
              <BookOpen className="w-4 h-4" />
              <span>Browse Articles</span>
            </a>
          </div>
        </div>
      </section>

      {/* Search, Filter & Sort Controls */}
      <section id="explore" className="space-y-6 scroll-mt-24">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Search Input Bar */}
          <div className="relative flex-1 max-w-lg">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search posts by title, content, or tags..."
              className="w-full pl-11 pr-10 py-2.5 rounded-2xl bg-white border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sort Dropdown & Filter Count */}
          <div className="flex items-center gap-3 self-end md:self-auto">
            <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-2xl border border-slate-200 shadow-sm text-sm text-slate-600">
              <SlidersHorizontal className="w-4 h-4 text-slate-400" />
              <label htmlFor="sort" className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Sort:
              </label>
              <select
                id="sort"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="bg-transparent border-none text-sm font-semibold text-slate-700 focus:outline-none cursor-pointer pr-2"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>

            {isFiltered && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1.5 px-3 py-2 rounded-2xl text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 transition-colors"
                title="Reset all filters"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                activeCategory === cat
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30 ring-2 ring-indigo-600 ring-offset-2'
                  : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Posts Grid / States */}
      <section>
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <PostCardSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <div className="p-8 rounded-2xl bg-rose-50 border border-rose-200 text-center max-w-lg mx-auto space-y-3">
            <p className="text-rose-800 font-semibold">{error}</p>
            <button
              onClick={loadPosts}
              className="px-4 py-2 rounded-xl bg-rose-600 text-white text-sm font-semibold hover:bg-rose-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-16 px-4 rounded-3xl bg-white border border-slate-200 shadow-sm max-w-xl mx-auto space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
              <BookOpen className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-900">No Articles Found</h3>
              <p className="text-sm text-slate-500">
                {isFiltered
                  ? 'No posts matched your current search or category filters.'
                  : 'No posts have been published yet. Be the first author to publish!'}
              </p>
            </div>
            {isFiltered ? (
              <button
                onClick={clearFilters}
                className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors"
              >
                Clear Filters
              </button>
            ) : (
              <Link
                to="/create-post"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors"
              >
                <PenSquare className="w-4 h-4" />
                <span>Create First Post</span>
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default HomePage;
