
'use client';

import { useState } from 'react';
import { Post } from '../../lib/models/Post';
import CommentSection from '../CommentSection';
import ShareModal from '../ShareModal';

interface VideoFeedItemProps {
  post: Post;
  onLike: (postId: string) => void;
  onRetweet: (postId: string) => void;
  onReply: (postId: string) => void;
}

export default function VideoFeedItem({ post, onLike, onRetweet, onReply }: VideoFeedItemProps) {
  const [showComments, setShowComments] = useState(false);
  const [showShare, setShowShare] = useState(false);

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    return `${days}d`;
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const handleReply = () => {
    setShowComments(true);
    onReply(post.id);
  };

  return (
    <>
      <div className="bg-white dark:bg-gray-900 p-4 border-b border-gray-100 dark:border-gray-800">
        {/* User Info */}
        <div className="flex items-start space-x-3">
          <div className="w-12 h-12 flex items-center justify-center overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
            <img 
              src={post.user.avatar} 
              alt={post.user.displayName}
              className="w-full h-full object-cover object-top"
            />
          </div>
          
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-center space-x-2 mb-2">
              <span className="font-bold text-gray-900 dark:text-white truncate">
                {post.user.displayName}
              </span>
              {post.user.verified && (
                <div className="w-4 h-4 flex items-center justify-center">
                  <i className="ri-verified-badge-fill text-blue-500"></i>
                </div>
              )}
              <span className="text-gray-500 dark:text-gray-400 text-sm">@{post.user.username}</span>
              <span className="text-gray-500 dark:text-gray-400 text-sm">·</span>
              <span className="text-gray-500 dark:text-gray-400 text-sm">
                {formatTimestamp(post.timestamp)}
              </span>
            </div>
            
            {/* Content */}
            <div className="text-gray-900 dark:text-white text-base leading-relaxed mb-3">
              {post.content}
            </div>
            
            {/* Video Thumbnail */}
            {post.media && post.media.length > 0 && (
              <div className="mb-3 rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800 relative">
                <img 
                  src={post.media[0].thumbnail || post.media[0].url}
                  alt="Video thumbnail"
                  className="w-full h-auto object-cover object-top max-h-96"
                />
                {/* Play button overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 bg-black/70 rounded-full flex items-center justify-center">
                    <div className="w-8 h-8 flex items-center justify-center">
                      <i className="ri-play-fill text-white text-xl ml-1"></i>
                    </div>
                  </div>
                </div>
                {/* Video indicator */}
                <div className="absolute bottom-3 left-3 bg-black/70 text-white text-xs px-2 py-1 rounded-md">
                  Video
                </div>
              </div>
            )}
            
            {/* Actions */}
            <div className="flex items-center justify-between max-w-md">
              <button
                onClick={handleReply}
                className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-500 transition-colors group"
              >
                <div className="w-8 h-8 flex items-center justify-center rounded-full group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30 transition-colors">
                  <i className="ri-chat-3-line text-sm"></i>
                </div>
                <span className="text-sm">{formatNumber(post.replies)}</span>
              </button>
              
              <button
                onClick={() => onRetweet(post.id)}
                className={`flex items-center space-x-2 transition-colors group ${
                  post.retweeted ? 'text-green-500' : 'text-gray-500 hover:text-green-500 dark:text-gray-400 dark:hover:text-green-500'
                }`}
              >
                <div className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors ${
                  post.retweeted 
                    ? 'bg-green-50 dark:bg-green-900/30' 
                    : 'group-hover:bg-green-50 dark:group-hover:bg-green-900/30'
                }`}>
                  <i className="ri-repeat-line text-sm"></i>
                </div>
                <span className="text-sm">{formatNumber(post.retweets)}</span>
              </button>
              
              <button
                onClick={() => onLike(post.id)}
                className={`flex items-center space-x-2 transition-colors group ${
                  post.liked ? 'text-red-500' : 'text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-500'
                }`}
              >
                <div className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors ${
                  post.liked 
                    ? 'bg-red-50 dark:bg-red-900/30' 
                    : 'group-hover:bg-red-50 dark:group-hover:bg-red-900/30'
                }`}>
                  <i className={`${post.liked ? 'ri-heart-fill' : 'ri-heart-line'} text-sm`}></i>
                </div>
                <span className="text-sm">{formatNumber(post.likes)}</span>
              </button>
              
              <button 
                onClick={() => setShowShare(true)}
                className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-500 transition-colors group"
              >
                <div className="w-8 h-8 flex items-center justify-center rounded-full group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30 transition-colors">
                  <i className="ri-share-line text-sm"></i>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Comment Section */}
      <CommentSection 
        post={post}
        isOpen={showComments}
        onClose={() => setShowComments(false)}
      />

      {/* Share Modal */}
      <ShareModal 
        post={post}
        isOpen={showShare}
        onClose={() => setShowShare(false)}
      />
    </>
  );
}
