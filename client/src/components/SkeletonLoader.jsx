import React from 'react';

export const PostCardSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm animate-pulse flex flex-col h-full">
      {/* Cover Image Skeleton */}
      <div className="h-48 bg-slate-200" />

      {/* Content Body Skeleton */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="h-5 w-20 bg-slate-200 rounded-full" />
            <div className="h-4 w-16 bg-slate-200 rounded" />
          </div>
          <div className="h-6 w-5/6 bg-slate-200 rounded" />
          <div className="h-4 w-full bg-slate-200 rounded" />
          <div className="h-4 w-4/6 bg-slate-200 rounded" />
        </div>

        {/* Footer Skeleton */}
        <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-slate-200" />
            <div className="h-4 w-24 bg-slate-200 rounded" />
          </div>
          <div className="h-4 w-12 bg-slate-200 rounded" />
        </div>
      </div>
    </div>
  );
};

export const PostDetailSkeleton = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-pulse space-y-6">
      <div className="h-8 w-28 bg-slate-200 rounded-full" />
      <div className="h-10 w-4/5 bg-slate-200 rounded" />
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-slate-200" />
        <div className="space-y-2">
          <div className="h-4 w-32 bg-slate-200 rounded" />
          <div className="h-3 w-24 bg-slate-200 rounded" />
        </div>
      </div>
      <div className="h-80 w-full bg-slate-200 rounded-2xl" />
      <div className="space-y-3 pt-4">
        <div className="h-4 w-full bg-slate-200 rounded" />
        <div className="h-4 w-full bg-slate-200 rounded" />
        <div className="h-4 w-5/6 bg-slate-200 rounded" />
        <div className="h-4 w-4/6 bg-slate-200 rounded" />
      </div>
    </div>
  );
};
