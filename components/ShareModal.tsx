'use client';

import { useState } from 'react';
import { Post } from '../lib/models/Post';

interface ShareModalProps {
  post: Post;
  isOpen: boolean;
  onClose: () => void;
}

export default function ShareModal({ post, isOpen, onClose }: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  
  const shareOptions = [
    {
      id: 'twitter',
      name: 'Twitter',
      icon: 'ri-twitter-x-line',
      color: 'text-black hover:bg-gray-100',
      action: () => {
        const text = encodeURIComponent(post.content.substring(0, 200) + '...');
        const url = encodeURIComponent(window.location.href);
        window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
      }
    },
    {
      id: 'facebook',
      name: 'Facebook',
      icon: 'ri-facebook-line',
      color: 'text-blue-600 hover:bg-blue-50',
      action: () => {
        const url = encodeURIComponent(window.location.href);
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
      }
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      icon: 'ri-linkedin-line',
      color: 'text-blue-700 hover:bg-blue-50',
      action: () => {
        const url = encodeURIComponent(window.location.href);
        const title = encodeURIComponent(post.content.substring(0, 100));
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}&title=${title}`, '_blank');
      }
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      icon: 'ri-whatsapp-line',
      color: 'text-green-600 hover:bg-green-50',
      action: () => {
        const text = encodeURIComponent(`${post.content}\n\n${window.location.href}`);
        window.open(`https://wa.me/?text=${text}`, '_blank');
      }
    },
    {
      id: 'telegram',
      name: 'Telegram',
      icon: 'ri-telegram-line',
      color: 'text-blue-500 hover:bg-blue-50',
      action: () => {
        const text = encodeURIComponent(post.content);
        const url = encodeURIComponent(window.location.href);
        window.open(`https://t.me/share/url?url=${url}&text=${text}`, '_blank');
      }
    },
    {
      id: 'email',
      name: 'Email',
      icon: 'ri-mail-line',
      color: 'text-gray-600 hover:bg-gray-100',
      action: () => {
        const subject = encodeURIComponent('Check out this post');
        const body = encodeURIComponent(`${post.content}\n\n${window.location.href}`);
        window.open(`mailto:?subject=${subject}&body=${body}`);
      }
    }
  ];

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link');
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Check out this post',
          text: post.content,
          url: window.location.href
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
      <div className="w-full max-w-md mx-auto bg-white rounded-t-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h3 className="font-bold text-lg">Share Post</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            <i className="ri-close-line text-gray-600"></i>
          </button>
        </div>

        {/* Post Preview */}
        <div className="p-4 border-b border-gray-100 bg-gray-50">
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-full overflow-hidden">
              <img 
                src={post.user.avatar}
                alt={post.user.displayName}
                className="w-full h-full object-cover object-top"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <span className="font-semibold text-sm text-gray-900">
                  {post.user.displayName}
                </span>
                {post.user.verified && (
                  <div className="w-3 h-3 flex items-center justify-center">
                    <i className="ri-verified-badge-fill text-blue-500 text-xs"></i>
                  </div>
                )}
                <span className="text-gray-500 text-xs">@{post.user.username}</span>
              </div>
              <p className="text-gray-900 text-sm line-clamp-3">
                {post.content}
              </p>
            </div>
          </div>
        </div>

        {/* Share Options */}
        <div className="p-4">
          <div className="space-y-3">
            {/* Native Share (if available) */}
            {navigator.share && (
              <button
                onClick={handleNativeShare}
                className="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <div className="w-12 h-12 flex items-center justify-center bg-blue-100 rounded-full">
                  <i className="ri-share-line text-blue-600 text-lg"></i>
                </div>
                <div className="flex-1 text-left">
                  <div className="font-semibold text-gray-900">More Options</div>
                  <div className="text-sm text-gray-500">Use device sharing</div>
                </div>
              </button>
            )}

            {/* Social Media Options */}
            <div className="grid grid-cols-3 gap-3">
              {shareOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={option.action}
                  className={`flex flex-col items-center space-y-2 p-3 rounded-xl transition-colors ${option.color}`}
                >
                  <div className="w-12 h-12 flex items-center justify-center rounded-full bg-current/10">
                    <i className={`${option.icon} text-lg`}></i>
                  </div>
                  <span className="text-xs font-medium">{option.name}</span>
                </button>
              ))}
            </div>

            {/* Copy Link */}
            <button
              onClick={handleCopyLink}
              className="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <div className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded-full">
                <i className={`${copied ? 'ri-check-line text-green-600' : 'ri-link text-gray-600'} text-lg`}></i>
              </div>
              <div className="flex-1 text-left">
                <div className="font-semibold text-gray-900">
                  {copied ? 'Link Copied!' : 'Copy Link'}
                </div>
                <div className="text-sm text-gray-500 truncate">
                  {window.location.href}
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}