import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { postService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  PenSquare,
  ArrowLeft,
  Loader2,
  X,
} from 'lucide-react';

const CATEGORIES = [
  'Technology',
  'Web Development',
  'AI & Future',
  'Design & UI',
  'Tutorials',
  'Productivity',
  'General',
];

const EditPostPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { success, error } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    category: 'Technology',
    coverImage: '',
    content: '',
  });

  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const loadPost = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await postService.getPostById(id);
      if (res.success && res.data) {
        const post = res.data;

        // Verify ownership
        const isAuthor =
          user &&
          post.author &&
          (post.author._id === user._id ||
            post.author === user._id ||
            post.author.id === user._id);

        if (!isAuthor) {
          error('You are not authorized to edit this post.');
          navigate(`/posts/${id}`);
          return;
        }

        setFormData({
          title: post.title || '',
          category: post.category || 'General',
          coverImage: post.coverImage || '',
          content: post.content || '',
        });
        setTags(post.tags || []);
      }
    } catch (err) {
      console.error('Error fetching post for edit:', err);
      error(err.response?.data?.message || 'Failed to load post');
      navigate('/dashboard');
    } finally {
      setIsLoading(false);
    }
  }, [id, user, navigate, error]);

  useEffect(() => {
    loadPost();
  }, [loadPost]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleAddTag = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const cleaned = tagInput.replace(/,/g, '').trim();
      if (cleaned && !tags.includes(cleaned)) {
        if (tags.length >= 8) {
          error('Maximum 8 tags allowed');
          return;
        }
        setTags([...tags, cleaned]);
        setTagInput('');
      }
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.trim().length < 3) {
      newErrors.title = 'Title must be at least 3 characters long';
    }

    if (!formData.content.trim()) {
      newErrors.content = 'Content is required';
    } else if (formData.content.trim().length < 10) {
      newErrors.content = 'Content must be at least 10 characters long';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        tags,
      };

      const res = await postService.updatePost(id, payload);
      if (res.success && res.data) {
        success('Article updated successfully!');
        navigate(`/posts/${id}`);
      }
    } catch (err) {
      console.error('Error updating post:', err);
      error(err.response?.data?.message || 'Failed to update post');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
        <p className="text-sm text-slate-500 font-medium">Loading article data...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 pb-20">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between mb-6">
        <Link
          to={`/posts/${id}`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Cancel and Return to Post</span>
        </Link>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-10 space-y-8">
        {/* Header */}
        <div className="flex items-center gap-3 pb-6 border-b border-slate-100">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <PenSquare className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Edit Article
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Make changes to your published article and save.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Post Title */}
          <div className="space-y-2">
            <label
              htmlFor="title"
              className="block text-sm font-bold text-slate-800"
            >
              Article Title <span className="text-rose-500">*</span>
            </label>
            <input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              placeholder="Post title..."
              className={`w-full px-4 py-3 rounded-2xl border bg-slate-50/50 text-slate-900 text-base focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                errors.title
                  ? 'border-rose-400 focus:ring-rose-200'
                  : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'
              }`}
            />
            {errors.title && (
              <p className="text-xs font-semibold text-rose-600 mt-1">
                {errors.title}
              </p>
            )}
          </div>

          {/* Category & Tags Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label
                htmlFor="category"
                className="block text-sm font-bold text-slate-800"
              >
                Category <span className="text-rose-500">*</span>
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50/50 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all cursor-pointer text-sm font-medium"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-800">
                Tags <span className="text-xs font-normal text-slate-400">(Press Enter to add)</span>
              </label>
              <div className="flex flex-wrap items-center gap-1.5 p-2 rounded-2xl border border-slate-200 bg-slate-50/50 focus-within:bg-white focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100 min-h-[48px]">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-rose-600 rounded"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleAddTag}
                  placeholder={tags.length === 0 ? 'Type tag and press Enter...' : ''}
                  className="flex-1 bg-transparent border-none p-1 text-xs text-slate-800 placeholder-slate-400 focus:ring-0 min-w-[80px]"
                />
              </div>
            </div>
          </div>

          {/* Cover Image URL */}
          <div className="space-y-3">
            <label
              htmlFor="coverImage"
              className="block text-sm font-bold text-slate-800"
            >
              Cover Image URL <span className="text-xs font-normal text-slate-400">(Optional)</span>
            </label>
            <input
              id="coverImage"
              name="coverImage"
              type="url"
              value={formData.coverImage}
              onChange={handleChange}
              placeholder="https://images.unsplash.com/..."
              className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 bg-slate-50/50 text-slate-800 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all"
            />

            {formData.coverImage && (
              <div className="mt-3 relative rounded-2xl overflow-hidden border border-slate-200 h-44 bg-slate-100 max-w-md">
                <img
                  src={formData.coverImage}
                  alt="Cover Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, coverImage: '' }))
                  }
                  className="absolute top-2 right-2 p-1.5 rounded-xl bg-black/60 text-white hover:bg-black/80 transition-colors"
                  title="Remove image"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Content Body */}
          <div className="space-y-2">
            <label
              htmlFor="content"
              className="block text-sm font-bold text-slate-800"
            >
              Article Content <span className="text-rose-500">*</span>
            </label>
            <textarea
              id="content"
              name="content"
              rows={12}
              value={formData.content}
              onChange={handleChange}
              placeholder="Write your post content..."
              className={`w-full p-4 rounded-2xl border bg-slate-50/50 text-slate-900 text-sm leading-relaxed focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                errors.content
                  ? 'border-rose-400 focus:ring-rose-200'
                  : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'
              }`}
            />
            {errors.content && (
              <p className="text-xs font-semibold text-rose-600 mt-1">
                {errors.content}
              </p>
            )}
          </div>

          {/* Form Actions */}
          <div className="pt-6 border-t border-slate-100 flex items-center justify-end gap-3">
            <Link
              to={`/posts/${id}`}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/20 disabled:opacity-50 transition-all hover:scale-[1.02]"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <PenSquare className="w-4 h-4" />
              )}
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPostPage;
