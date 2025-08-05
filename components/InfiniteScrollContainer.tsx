'use client';

import { useEffect, useRef, ReactNode } from 'react';

interface InfiniteScrollContainerProps {
  children: ReactNode;
  onLoadMore: () => void;
  hasMore: boolean;
  loading: boolean;
  threshold?: number;
}

export default function InfiniteScrollContainer({
  children,
  onLoadMore,
  hasMore,
  loading,
  threshold = 200
}: InfiniteScrollContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const loadingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (loading || !hasMore) return;

      const { scrollTop, scrollHeight, clientHeight } = container;
      const distanceFromBottom = scrollHeight - scrollTop - clientHeight;

      if (distanceFromBottom < threshold) {
        onLoadMore();
      }
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [loading, hasMore, threshold, onLoadMore]);

  return (
    <div 
      ref={containerRef}
      className="h-full overflow-y-auto scrollbar-hide"
      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
    >
      {children}
      
      {/* Loading indicator */}
      {loading && hasMore && (
        <div ref={loadingRef} className="flex justify-center items-center py-4">
          <div className="flex space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      )}
      
      {/* No more content */}
      {!loading && !hasMore && (
        <div className="text-center py-4 text-gray-500 text-sm">
          No more posts to load
        </div>
      )}
    </div>
  );
}