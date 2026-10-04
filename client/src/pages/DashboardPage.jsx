import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { postService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import ConfirmModal from '../components/ConfirmModal';
import { formatDate, getCategoryColor } from '../utils/formatters';
import {
  LayoutDashboard,
  PenSquare,
  FileText,
  MessageSquare,
  Calendar,
  Eye,
  Edit,
  Trash2,
  Search,
  ExternalLink,
  Plus,
  Loader2,
  Sparkles,
} from 'lucide-react';

const DashboardPage = () => {
  const { user } = useAuth();
  const { success, error } = useToast();

  const [posts, setPosts] = useState([]);
  const [stats, setStats] = useState({ totalPosts: 0, totalCommentsReceived: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadUserPosts = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await postService.getUserPosts();
      if (res.success && res.data) {
        setPosts(res.data.posts || []);
        setStats(res.data.stats || { totalPosts: 0, totalCommentsReceived: 0 });
      }
    } catch (err) {
      console.error('Error fetching dashboard posts:', err);
      error(err.response?.data?.message || 'Failed to load dashboard posts');
    } finally {
      setIsLoading(false);
    }
  }, [error]);

  useEffect(() => {
    loadUserPosts();
  }, [loadUserPosts]);

  const openDeleteModal = (post) => {
    setPostToDelete(post);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!postToDelete) return;

    setIsDeleting(true);
    try {
      const res = await postService.deletePost(postToDelete._id);
      if (res.success) {
        setPosts((prev) => prev.filter((p) => p._id !== postToDelete._id));
        setStats((prev) => ({
          ...prev,
          totalPosts: Math.max(0, prev.totalPosts - 1),
          totalCommentsReceived: Math.max(
            0,
            prev.totalCommentsReceived - (postToDelete.commentCount || 0)
          ),
        }));
        setDeleteModalOpen(false);
        setPostToDelete(null);
        success('Post deleted successfully');
      }
    } catch (err) {
      error(err.response?.data?.message || 'Failed to delete post');
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredPosts = posts.filter(
    (p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.category && p.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 pb-20 space-y-8">
      {/* Top Banner & User Welcome */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center font-bold text-xl ring-4 ring-indigo-50 shadow-md">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-full h-full object-cover rounded-2xl"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            ) : (
              user?.name?.charAt(0).toUpperCase() || 'U'
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold text-slate-900">
                Welcome back, {user?.name}!
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                <Sparkles className="w-3 h-3" /> Author
              </span>
            </div>
            <p className="text-sm text-slate-500 mt-0.5">
              Manage your published articles, monitor comments, and write new posts.
            </p>
          </div>
        </div>

        <Link
          to="/create-post"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20 transition-all hover:scale-105"
        >
          <Plus className="w-4 h-4" />
          <span>New Article</span>
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Total Posts Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Total Articles
            </p>
            <h3 className="text-2xl font-extrabold text-slate-900 mt-0.5">
              {stats.totalPosts}
            </h3>
          </div>
        </div>

        {/* Total Comments Received */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Comments Received
            </p>
            <h3 className="text-2xl font-extrabold text-slate-900 mt-0.5">
              {stats.totalCommentsReceived}
            </h3>
          </div>
        </div>

        {/* Member Since Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Member Since
            </p>
            <h3 className="text-base font-bold text-slate-900 mt-1">
              {formatDate(user?.createdAt || new Date())}
            </h3>
          </div>
        </div>
      </div>

      {/* Your Posts Table Section */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        {/* Table Header Controls */}
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-600" />
              <span>Your Published Articles ({filteredPosts.length})</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              All articles written under your account.
            </p>
          </div>

          {/* Quick Search */}
          <div className="relative max-w-xs w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search your posts..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Posts Table Content */}
        {isLoading ? (
          <div className="p-16 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
            <p className="text-sm text-slate-500 font-medium">Loading your articles...</p>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-16 px-4 space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
              <PenSquare className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900">
                {searchQuery ? 'No matching articles found' : 'No articles published yet'}
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                {searchQuery
                  ? 'Try searching with different keywords.'
                  : 'Start sharing your insights with readers around the world.'}
              </p>
            </div>
            {!searchQuery && (
              <Link
                to="/create-post"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 shadow-sm transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Write First Post</span>
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/75 border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-3.5 px-6">Article</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4 text-center">Comments</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredPosts.map((post) => (
                  <tr
                    key={post._id}
                    className="hover:bg-slate-50/80 transition-colors group"
                  >
                    {/* Post Title & Thumbnail */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        {post.coverImage && (
                          <img
                            src={post.coverImage}
                            alt=""
                            className="w-12 h-10 object-cover rounded-lg border border-slate-200 shrink-0 hidden sm:block"
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        )}
                        <Link
                          to={`/posts/${post._id}`}
                          className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1 max-w-md"
                        >
                          {post.title}
                        </Link>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span
                        className={`inline-block px-2.5 py-0.5 text-xs font-semibold rounded-lg border ${getCategoryColor(
                          post.category
                        )}`}
                      >
                        {post.category || 'General'}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="py-4 px-4 whitespace-nowrap text-xs text-slate-500 font-medium">
                      {formatDate(post.createdAt)}
                    </td>

                    {/* Comments count */}
                    <td className="py-4 px-4 text-center whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full">
                        <MessageSquare className="w-3.5 h-3.5 text-indigo-500" />
                        {post.commentCount || 0}
                      </span>
                    </td>

                    {/* Action Controls (View, Edit, Delete) */}
                    <td className="py-4 px-6 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          to={`/posts/${post._id}`}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                          title="View Article"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          to={`/edit-post/${post._id}`}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                          title="Edit Article"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => openDeleteModal(post)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Delete Article"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        title="Delete Post"
        message={`Are you sure you want to permanently delete "${postToDelete?.title}"? All comments will also be removed.`}
        confirmText="Delete Post"
        confirmVariant="danger"
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteModalOpen(false)}
      />
    </div>
  );
};

export default DashboardPage;
