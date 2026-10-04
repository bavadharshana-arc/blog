/**
 * Format date to human readable string (e.g., "Oct 4, 2026")
 */
export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

/**
 * Format relative time (e.g. "2 hours ago", "just now")
 */
export const formatRelativeTime = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) {
    const mins = Math.floor(diffInSeconds / 60);
    return `${mins}m ago`;
  }
  if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours}h ago`;
  }
  if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days}d ago`;
  }
  return formatDate(dateString);
};

/**
 * Estimate reading time in minutes
 */
export const estimateReadingTime = (content) => {
  if (!content) return '1 min read';
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min read`;
};

/**
 * Truncate long text to a specific length with ellipsis
 */
export const truncateText = (text, maxLength = 120) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};

/**
 * Get category badge color scheme
 */
export const getCategoryColor = (category = '') => {
  const normalized = category.toLowerCase();
  switch (normalized) {
    case 'technology':
      return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'web development':
      return 'bg-indigo-50 text-indigo-700 border-indigo-200';
    case 'ai & future':
      return 'bg-purple-50 text-purple-700 border-purple-200';
    case 'design & ui':
      return 'bg-pink-50 text-pink-700 border-pink-200';
    case 'tutorials':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 'productivity':
      return 'bg-amber-50 text-amber-700 border-amber-200';
    default:
      return 'bg-slate-100 text-slate-700 border-slate-200';
  }
};
