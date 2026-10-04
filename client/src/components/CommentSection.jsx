import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { commentService } from '../services/api';
import { formatRelativeTime } from '../utils/formatters';
import ConfirmModal from './ConfirmModal';
import {
  MessageSquare,
  Send,
  Edit2,
  Trash2,
  Check,
  X,
  User,
  LogIn,
  Loader2,
} from 'lucide-react';

const CommentSection = ({ postId, initialComments = [], onCommentUpdated }) => {
  const { user, isAuthenticated } = useAuth();
  const { success, error } = useToast();

  const [comments, setComments] = useState(initialComments);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Edit state
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Add Comment Handler
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await commentService.addComment(postId, newComment.trim());
      if (res.success && res.data) {
        setComments((prev) => [res.data, ...prev]);
        setNewComment('');
        success('Comment posted successfully!');
        if (onCommentUpdated) onCommentUpdated();
      }
    } catch (err) {
      error(err.response?.data?.message || 'Failed to post comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Start Editing Handler
  const handleStartEdit = (comment) => {
    setEditingCommentId(comment._id);
    setEditContent(comment.content);
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditContent('');
  };

  // Save Edited Comment
  const handleSaveEdit = async (commentId) => {
    if (!editContent.trim()) {
      error('Comment cannot be empty');
      return;
    }

    setIsUpdating(true);
    try {
      const res = await commentService.updateComment(commentId, editContent.trim());
      if (res.success && res.data) {
        setComments((prev) =>
          prev.map((c) => (c._id === commentId ? res.data : c))
        );
        setEditingCommentId(null);
        setEditContent('');
        success('Comment updated successfully!');
      }
    } catch (err) {
      error(err.response?.data?.message || 'Failed to update comment');
    } finally {
      setIsUpdating(false);
    }
  };

  // Open Delete Modal
  const openDeleteModal = (comment) => {
    setCommentToDelete(comment);
    setDeleteModalOpen(true);
  };

  // Confirm Delete Comment
  const handleConfirmDelete = async () => {
    if (!commentToDelete) return;

    setIsDeleting(true);
    try {
      const res = await commentService.deleteComment(commentToDelete._id);
      if (res.success) {
        setComments((prev) => prev.filter((c) => c._id !== commentToDelete._id));
        setDeleteModalOpen(false);
        setCommentToDelete(null);
        success('Comment deleted successfully.');
        if (onCommentUpdated) onCommentUpdated();
      }
    } catch (err) {
      error(err.response?.data?.message || 'Failed to delete comment');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <section className="mt-12 pt-8 border-t border-slate-200" id="comments">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-indigo-600" />
          <span>Discussion ({comments.length})</span>
        </h2>
      </div>

      {/* Add Comment Box */}
      {isAuthenticated ? (
        <form onSubmit={handleAddComment} className="mb-8">
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 text-white flex items-center justify-center font-bold text-xs shrink-0 overflow-hidden ring-1 ring-indigo-200">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                ) : (
                  user?.name?.charAt(0).toUpperCase() || 'U'
                )}
              </div>
              <div className="flex-1">
                <textarea
                  rows={3}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Share your thoughts or ask a question..."
                  className="w-full resize-none border-0 p-0 text-slate-800 placeholder-slate-400 focus:ring-0 text-sm leading-relaxed"
                  disabled={isSubmitting}
                />
              </div>
            </div>
            <div className="flex items-center justify-between pt-3 mt-2 border-t border-slate-100">
              <span className="text-xs text-slate-400 font-medium">
                Markdown supported
              </span>
              <button
                type="submit"
                disabled={isSubmitting || !newComment.trim()}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:pointer-events-none transition-all shadow-sm shadow-indigo-600/20"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                <span>Post Comment</span>
              </button>
            </div>
          </div>
        </form>
      ) : (
        <div className="mb-8 p-6 rounded-2xl bg-indigo-50/70 border border-indigo-100 text-center flex flex-col items-center justify-center gap-3">
          <p className="text-sm font-medium text-slate-700">
            Join the conversation. Log in or create an account to leave a comment.
          </p>
          <Link
            to={`/login?redirect=/posts/${postId}`}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-all"
          >
            <LogIn className="w-4 h-4" />
            <span>Sign in to Comment</span>
          </Link>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <div className="text-center py-12 px-4 rounded-2xl bg-slate-50 border border-dashed border-slate-200">
            <MessageSquare className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700">
              No comments yet
            </p>
            <p className="text-xs text-slate-500 mt-0.5">
              Be the first to share your thoughts on this article!
            </p>
          </div>
        ) : (
          comments.map((comment) => {
            const isCommentOwner =
              user &&
              comment.author &&
              (comment.author._id === user._id ||
                comment.author === user._id ||
                comment.author.id === user._id);

            const isEditingThis = editingCommentId === comment._id;

            return (
              <div
                key={comment._id}
                className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm transition-all"
              >
                {/* Header: Author & Date & Actions */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden ring-1 ring-slate-200 text-slate-600 font-bold text-xs">
                      {comment.author?.avatar ? (
                        <img
                          src={comment.author.avatar}
                          alt={comment.author?.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      ) : (
                        comment.author?.name?.charAt(0).toUpperCase() || (
                          <User className="w-4 h-4 text-slate-400" />
                        )
                      )}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 leading-tight">
                        {comment.author?.name || 'Anonymous User'}
                      </h4>
                      <p className="text-xs text-slate-400 font-medium">
                        {formatRelativeTime(comment.createdAt)}
                      </p>
                    </div>
                  </div>

                  {/* Owner Controls (Edit & Delete) */}
                  {isCommentOwner && !isEditingThis && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleStartEdit(comment)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                        title="Edit Comment"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openDeleteModal(comment)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Delete Comment"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Comment Content / Edit Form */}
                {isEditingThis ? (
                  <div className="space-y-3 pt-1">
                    <textarea
                      rows={3}
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="w-full rounded-xl border border-indigo-300 p-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                      disabled={isUpdating}
                    />
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        disabled={isUpdating}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Cancel</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSaveEdit(comment._id)}
                        disabled={isUpdating || !editContent.trim()}
                        className="flex items-center gap-1 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors disabled:opacity-50"
                      >
                        {isUpdating ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Check className="w-3.5 h-3.5" />
                        )}
                        <span>Save</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-line pl-11">
                    {comment.content}
                  </p>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        title="Delete Comment"
        message="Are you sure you want to permanently delete this comment? This action cannot be undone."
        confirmText="Delete Comment"
        confirmVariant="danger"
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteModalOpen(false)}
      />
    </section>
  );
};

export default CommentSection;
