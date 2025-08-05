'use client';

import { useState, useRef, ReactNode, TouchEvent } from 'react';

interface PullToRefreshProps {
  children: ReactNode;
  onRefresh: () => Promise<void>;
  refreshing: boolean;
  threshold?: number;
}

export default function PullToRefresh({
  children,
  onRefresh,
  refreshing,
  threshold = 80
}: PullToRefreshProps) {
  const [pullDistance, setPullDistance] = useState(0);
  const [pulling, setPulling] = useState(false);
  const startY = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = (e: TouchEvent) => {
    const container = containerRef.current;
    if (!container || container.scrollTop > 0) return;
    
    startY.current = e.touches[0].clientY;
    setPulling(true);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!pulling || refreshing) return;
    
    const container = containerRef.current;
    if (!container || container.scrollTop > 0) return;

    const currentY = e.touches[0].clientY;
    const distance = Math.max(0, (currentY - startY.current) * 0.5);
    
    if (distance > 0) {
      e.preventDefault();
      setPullDistance(Math.min(distance, threshold * 1.5));
    }
  };

  const handleTouchEnd = async () => {
    if (!pulling) return;
    
    setPulling(false);
    
    if (pullDistance >= threshold && !refreshing) {
      await onRefresh();
    }
    
    setPullDistance(0);
  };

  const getRefreshText = () => {
    if (refreshing) return 'Refreshing...';
    if (pullDistance >= threshold) return 'Release to refresh';
    return 'Pull to refresh';
  };

  const getRotation = () => {
    if (refreshing) return 0;
    return Math.min((pullDistance / threshold) * 180, 180);
  };

  return (
    <div className="relative h-full overflow-hidden">
      {/* Pull indicator */}
      <div 
        className="absolute top-0 left-0 right-0 z-10 flex flex-col items-center justify-end bg-gradient-to-b from-blue-50 to-transparent transition-all duration-200"
        style={{ 
          height: Math.max(pullDistance, refreshing ? 60 : 0),
          opacity: pullDistance > 20 || refreshing ? 1 : 0 
        }}
      >
        <div className="flex items-center space-x-2 pb-4">
          {refreshing ? (
            <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <div 
              className="w-5 h-5 flex items-center justify-center transition-transform duration-200"
              style={{ transform: `rotate(${getRotation()}deg)` }}
            >
              <i className="ri-arrow-down-line text-blue-500"></i>
            </div>
          )}
          <span className="text-blue-500 text-sm font-medium">
            {getRefreshText()}
          </span>
        </div>
      </div>
      
      {/* Content */}
      <div
        ref={containerRef}
        className="h-full overflow-y-auto transition-transform duration-200"
        style={{ transform: `translateY(${pullDistance}px)` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {children}
      </div>
    </div>
  );
}