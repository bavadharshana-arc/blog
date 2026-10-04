import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { postService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { PostDetailSkeleton } from '../components/SkeletonLoader';
import CommentSection from '../components/CommentSection';
import ConfirmModal from '../components/ConfirmModal';
import {
  formatDate,
  estimateReadingTime,
  getCategoryColor,
} from '../utils/formatters';
import {
  Calendar,
  Clock,
  Edit,
  Trash2,
  ArrowLeft,
  Tag,
  Share2,
  Check,
  User,
  MessageSquare,
} from 'lucide-react';

const PostDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { success, error } = useToast();

  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  // Delete Post Modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadPost = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await postService.getPostById(id);
      if (res.success && res.data) {
        setPost(res.data);
      }
    } catch (err) {
      console.error('Error fetching post:', err);
      error(err.response?.data?.message || 'Article not found');
      navigate('/');
    } finally {
      setIsLoading(false);
    }
  }, [id, navigate, error]);

  useEffect(() => {
    loadPost();
  }, [loadPost]);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      success('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDeletePost = async () => {
    setIsDeleting(true);
    try {
      const res = await postService.deletePost(id);
      if (res.success) {
        setDeleteModalOpen(false);
        success('Post deleted successfully');
        navigate('/dashboard');
      }
    } catch (err) {
      error(err.response?.data?.message || 'Failed to delete post');
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return <PostDetailSkeleton />;
  }

  if (!post) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-bold text-slate-800">Post not found</h2>
        <Link to="/" className="text-indigo-600 font-semibold mt-4 inline-block">
          Return to home
        </Link>
      </div>
    );
  }

  const isAuthor =
    user &&
    post.author &&
    (post.author._id === user._id ||
      post.author === user._id ||
      post.author.id === user._id);

  const defaultCover =
    'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80';

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 py-8 pb-20 space-y-8">
      {/* Top Navigation & Actions */}
      <div className="flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Articles</span>
        </Link>

        {/* Action Controls for Author & Share */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 bg-white hover:bg-slate-100 border border-slate-200 transition-colors shadow-sm"
            title="Share article link"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <Share2 className="w-3.5 h-3.5" />
            )}
            <span>{copied ? 'Copied' : 'Share'}</span>
          </button>

          {isAuthor && (
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <Link
                to={`/edit-post/${post._id}`}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-colors"
              >
                <Edit className="w-3.5 h-3.5" />
                <span>Edit Post</span>
              </Link>
              <button
                onClick={() => setDeleteModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Post Header */}
      <header className="space-y-4">
        <div className="flex items-center gap-2.5">
          <span
            className={`inline-block px-3 py-1 text-xs font-semibold rounded-lg border ${getCategoryColor(
              post.category
            )}`}
          >
            {post.category || 'General'}
          </span>
          <span className="text-xs text-slate-400">•</span>
          <span className="flex items-center gap-1 text-xs text-slate-500 font-medium">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            {estimateReadingTime(post.content)}
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
          {post.title}
        </h1>

        {/* Author Bio Bar */}
        <div className="flex items-center gap-4 py-4 border-y border-slate-200/80">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden ring-2 ring-indigo-100 shrink-0">
            {post.author?.avatar ? (
              <img
                src={post.author.avatar}
                alt={post.author.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            ) : (
              <User className="w-6 h-6 text-slate-400" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-slate-900 text-sm sm:text-base">
              {post.author?.name || 'Anonymous Author'}
            </h4>
            <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                Published {formatDate(post.createdAt)}
              </span>
              {post.author?.bio && (
                <>
                  <span className="hidden sm:inline">•</span>
                  <span className="hidden sm:inline truncate max-w-sm">
                    {post.author.bio}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Featured Cover Image */}
      <div className="rounded-3xl overflow-hidden shadow-lg border border-slate-200 bg-slate-100 max-h-[460px] w-full">
        <img
          src={post.coverImage || defaultCover}
          alt={post.title}
          className="w-full h-full object-cover max-h-[460px]"
          onError={(e) => {
            e.target.src = defaultCover;
          }}
        />
      </div>

      {/* Post Main Body Content */}
      <div className="prose prose-slate lg:prose-lg max-w-none text-slate-800 leading-relaxed space-y-6 pt-2">
        {post.content.split('\n\n').map((paragraph, index) => {
          if (paragraph.startsWith('### ')) {
            return (
              <h3 key={index} className="text-xl sm:text-2xl font-bold text-slate-900 mt-8 mb-4">
                {paragraph.replace('### ', '')}
              </h3>
            );
          }
          if (paragraph.startsWith('## ')) {
            return (
              <h2 key={index} className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-10 mb-4">
                {paragraph.replace('## ', '')}
              </h2>
            );
          }
          if (paragraph.startsWith('- ') || paragraph.startsWith('* ')) {
            const listItems = paragraph.split('\n').filter(Boolean);
            return (
              <ul key={index} className="list-disc pl-6 space-y-2 text-slate-700">
                {listItems.map((li, liIdx) => (
                  <li key={liIdx}>{li.replace(/^[-*]\s+/, '')}</li>
                ))}
              </ul>
            );
          }
          return (
            <p key={index} className="text-base sm:text-lg text-slate-700 leading-relaxed">
              {paragraph}
            </p>
          );
        })}
      </div>

      {/* Tags Section */}
      {post.tags && post.tags.length > 0 && (
        <div className="pt-6 border-t border-slate-200">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-slate-400 mr-1">
              <Tag className="w-3.5 h-3.5" /> Tags:
            </span>
            {post.tags.map((tag, idx) => (
              <span
                key={idx}
                className="px-3 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200/80 hover:bg-slate-200 transition-colors"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Comment Section with real-time updates */}
      <CommentSection
        postId={post._id}
        initialComments={post.comments || []}
        onCommentUpdated={loadPost}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        title="Delete Blog Post"
        message="Are you sure you want to delete this article? All associated comments and discussions will also be permanently deleted."
        confirmText="Delete Post"
        confirmVariant="danger"
        isLoading={isDeleting}
        onConfirm={handleDeletePost}
        onCancel={() => setDeleteModalOpen(false)}
      />
    </article>
  );
};

export default PostDetailPage;
