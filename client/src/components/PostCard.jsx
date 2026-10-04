import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Clock, Calendar, ArrowUpRight, User } from 'lucide-react';
import {
  formatDate,
  estimateReadingTime,
  truncateText,
  getCategoryColor,
} from '../utils/formatters';

const PostCard = ({ post }) => {
  if (!post) return null;

  const defaultCover =
    'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800&q=80';

  return (
    <article className="group bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-sm hover:shadow-xl hover:border-indigo-200 transition-all duration-300 flex flex-col h-full hover:-translate-y-1">
      {/* Cover Image Container */}
      <Link
        to={`/posts/${post._id}`}
        className="relative h-48 w-full overflow-hidden bg-slate-100 block"
      >
        <img
          src={post.coverImage || defaultCover}
          alt={post.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
          onError={(e) => {
            e.target.src = defaultCover;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Category Badge Pill */}
        <div className="absolute top-3 left-3">
          <span
            className={`inline-block px-2.5 py-1 text-xs font-semibold rounded-lg border backdrop-blur-md shadow-sm ${getCategoryColor(
              post.category
            )}`}
          >
            {post.category || 'General'}
          </span>
        </div>
      </Link>

      {/* Card Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div className="space-y-2.5">
          {/* Reading Time & Date */}
          <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              {formatDate(post.createdAt)}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              {estimateReadingTime(post.content)}
            </span>
          </div>

          {/* Title with Arrow Icon on Hover */}
          <Link to={`/posts/${post._id}`} className="block group/title">
            <h3 className="font-bold text-lg text-slate-900 group-hover/title:text-indigo-600 transition-colors line-clamp-2 leading-snug">
              {post.title}
            </h3>
          </Link>

          {/* Excerpt */}
          <p className="text-slate-600 text-sm line-clamp-2 leading-relaxed font-normal">
            {truncateText(post.content.replace(/[#*`_]/g, ''), 130)}
          </p>
        </div>

        {/* Card Footer: Author Info & Comments */}
        <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center shrink-0 overflow-hidden ring-1 ring-slate-200">
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
                <User className="w-4 h-4 text-slate-500" />
              )}
            </div>
            <span className="text-xs font-semibold text-slate-700 truncate max-w-[130px]">
              {post.author?.name || 'Anonymous'}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-200/60">
            <MessageSquare className="w-3.5 h-3.5 text-indigo-500" />
            <span>{post.commentCount ?? post.comments?.length ?? 0}</span>
          </div>
        </div>
      </div>
    </article>
  );
};

export default PostCard;
