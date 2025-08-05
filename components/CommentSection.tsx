
'use client';

import { useState, useRef, useEffect } from 'react';
import { Post, User } from '../lib/models/Post';
import { generateRandomComment } from '../lib/api/gemini';

interface Comment {
  id: string;
  user: User;
  content: string;
  media?: {
    type: 'image' | 'video';
    url: string;
  };
  timestamp: Date;
  likes: number;
  liked: boolean;
  replies?: Comment[];
}

interface CommentSectionProps {
  post: Post;
  isOpen: boolean;
  onClose: () => void;
}

export default function CommentSection({ post, isOpen, onClose }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [commentMedia, setCommentMedia] = useState<File | null>(null);
  const [commentMediaPreview, setCommentMediaPreview] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeneratingComments, setIsGeneratingComments] = useState(false);
  const [commentInterval, setCommentInterval] = useState<NodeJS.Timeout | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const userProfiles = [
    {
      id: '4',
      username: 'alex_dev',
      displayName: 'Alex Rivera',
      avatar: 'https://readdy.ai/api/search-image?query=Professional%20headshot%20of%20developer%2C%20clean%20background%2C%20professional%20lighting%2C%20high%20quality%20portrait%20photography%2C%20casual%20tech%20attire%2C%20friendly%20expression%2C%20modern%20style&width=32&height=32&seq=commenter1&orientation=squarish',
      verified: false
    },
    {
      id: '5',
      username: 'lisa_ux',
      displayName: 'Lisa Park',
      avatar: 'https://readdy.ai/api/search-image?query=Professional%20headshot%20of%20UX%20designer%20woman%2C%20clean%20background%2C%20professional%20lighting%2C%20high%20quality%20portrait%20photography%2C%20creative%20casual%20attire%2C%20innovative%20expression%2C%20modern%20style&width=32&height=32&seq=commenter2&orientation=squarish',
      verified: true
    },
    {
      id: '6',
      username: 'mike_photo',
      displayName: 'Mike Johnson',
      avatar: 'https://readdy.ai/api/search-image?query=Professional%20headshot%20of%20photographer%20man%2C%20clean%20background%2C%20professional%20lighting%2C%20high%20quality%20portrait%20photography%2C%20artistic%20casual%20attire%2C%20creative%20expression%2C%20modern%20style&width=32&height=32&seq=commenter3&orientation=squarish',
      verified: false
    },
    {
      id: '7',
      username: 'sarah_writer',
      displayName: 'Sarah Chen',
      avatar: 'https://readdy.ai/api/search-image?query=Professional%20headshot%20of%20writer%20woman%2C%20clean%20background%2C%20professional%20lighting%2C%20high%20quality%20portrait%20photography%2C%20intellectual%20casual%20attire%2C%20thoughtful%20expression%2C%20modern%20style&width=32&height=32&seq=commenter4&orientation=squarish',
      verified: true
    },
    {
      id: '8',
      username: 'david_chef',
      displayName: 'David Rodriguez',
      avatar: 'https://readdy.ai/api/search-image?query=Professional%20headshot%20of%20chef%20man%2C%20clean%20background%2C%20professional%20lighting%2C%20high%20quality%20portrait%20photography%2C%20culinary%20attire%2C%20passionate%20expression%2C%20modern%20style&width=32&height=32&seq=commenter5&orientation=squarish',
      verified: false
    },
    {
      id: '9',
      username: 'emma_artist',
      displayName: 'Emma Wilson',
      avatar: 'https://readdy.ai/api/search-image?query=Professional%20headshot%20of%20artist%20woman%2C%20clean%20background%2C%20professional%20lighting%2C%20high%20quality%20portrait%20photography%2C%20creative%20artistic%20attire%2C%20inspired%20expression%2C%20modern%20style&width=32&height=32&seq=commenter6&orientation=squarish',
      verified: false
    },
    {
      id: '10',
      username: 'tom_fitness',
      displayName: 'Tom Anderson',
      avatar: 'https://readdy.ai/api/search-image?query=Professional%20headshot%20of%20fitness%20trainer%20man%2C%20clean%20background%2C%20professional%20lighting%2C%20high%20quality%20portrait%20photography%2C%20athletic%20casual%20attire%2C%20energetic%20expression%2C%20modern%20style&width=32&height=32&seq=commenter7&orientation=squarish',
      verified: true
    },
    {
      id: '11',
      username: 'nina_travel',
      displayName: 'Nina Martinez',
      avatar: 'https://readdy.ai/api/search-image?query=Professional%20headshot%20of%20travel%20blogger%20woman%2C%20clean%20background%2C%20professional%20lighting%2C%20high%20quality%20portrait%20photography%2C%20adventurous%20casual%20attire%2C%20wanderlust%20expression%2C%20modern%20style&width=32&height=32&seq=commenter8&orientation=squarish',
      verified: false
    }
  ];

  const fallbackComments = [
    "Amazing post! Really love this content ",
    "This is so inspiring, thank you for sharing!",
    "Absolutely beautiful, great work!",
    "Love the creativity here ",
    "This made my day better, thanks!",
    "Such a great perspective on this topic",
    "Wow, this is incredible! Keep it up ",
    "Perfect timing for this post, needed to see this",
    "You always share the best content",
    "This deserves more attention!",
    "Fantastic work as always ",
    "Really thought-provoking, thanks for posting",
    "This is exactly what I was looking for",
    "Your content never disappoints!",
    "So well done, impressed by this",
    "This speaks to me on so many levels",
    "Brilliant as usual! ",
    "Thanks for always keeping it real",
    "This is why I follow you!",
    "Pure gold right here "
  ];

  const generateContextualComment = async (postContent: string): Promise<string> => {
    try {
      const contextualComment = await generateRandomComment(postContent);
      return contextualComment;
    } catch (error) {
      console.error('Error generating contextual comment:', error);
      return fallbackComments[Math.floor(Math.random() * fallbackComments.length)];
    }
  };

  const startCommentGeneration = () => {
    const interval = setInterval(async () => {
      const nextInterval = Math.random() * 10000 + 5000;

      setTimeout(async () => {
        const randomUser = userProfiles[Math.floor(Math.random() * userProfiles.length)];
        const commentContent = await generateContextualComment(post.content || "");
        const minutesAgo = Math.floor(Math.random() * 5) + 1;

        const newComment: Comment = {
          id: `c${Date.now()}_${Math.random()}`,
          user: randomUser,
          content: commentContent,
          timestamp: new Date(Date.now() - (minutesAgo * 60000)),
          likes: Math.floor(Math.random() * 20),
          liked: Math.random() > 0.8,
          media: Math.random() > 0.9 ? {
            type: 'image',
            url: `https://readdy.ai/api/search-image?query=Beautiful%20lifestyle%20moment%2C%20natural%20authentic%20photography%2C%20candid%20shot%2C%20everyday%20beauty%2C%20modern%20aesthetic%2C%20relatable%20content&width=200&height=150&seq=live_comment${Date.now()}&orientation=landscape`
          } : undefined
        };

        setComments(prev => [newComment, ...prev]);
      }, nextInterval);
    }, Math.random() * 10000 + 5000);

    setCommentInterval(interval);
  };

  useEffect(() => {
    if (isOpen && comments.length === 0) {
      generateInitialComments();
      startCommentGeneration();
    } else if (!isOpen && commentInterval) {
      clearInterval(commentInterval);
      setCommentInterval(null);
    }

    return () => {
      if (commentInterval) {
        clearInterval(commentInterval);
      }
    };
  }, [isOpen]);

  const generateInitialComments = async () => {
    setIsGeneratingComments(true);

    const initialComments: Comment[] = [];
    const numComments = Math.floor(Math.random() * 2) + 1;

    for (let i = 0; i < numComments; i++) {
      try {
        const randomUser = userProfiles[Math.floor(Math.random() * userProfiles.length)];
        const commentContent = await generateContextualComment(post.content || "");
        const hoursAgo = Math.floor(Math.random() * 6) + 1;

        const comment: Comment = {
          id: `c${i + 1}_${Date.now()}`,
          user: randomUser,
          content: commentContent,
          timestamp: new Date(Date.now() - (hoursAgo * 3600000)),
          likes: Math.floor(Math.random() * 50),
          liked: Math.random() > 0.7,
          media: Math.random() > 0.85 ? {
            type: 'image',
            url: `https://readdy.ai/api/search-image?query=Beautiful%20lifestyle%20photo%2C%20natural%20lighting%2C%20casual%20moment%2C%20authentic%20photography%2C%20everyday%20beauty%2C%20modern%20aesthetic&width=200&height=150&seq=initial_comment${i}&orientation=landscape`
          } : undefined
        };

        initialComments.push(comment);

        if (i < numComments - 1) {
          await new Promise(resolve => setTimeout(resolve, 300));
        }
      } catch (error) {
        console.error('Error generating initial comment:', error);
      }
    }

    setComments(initialComments);
    setIsGeneratingComments(false);
  };

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

  const handleMediaSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCommentMedia(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setCommentMediaPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeCommentMedia = () => {
    setCommentMedia(null);
    setCommentMediaPreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim() && !commentMedia) return;

    setIsSubmitting(true);

    setTimeout(() => {
      const comment: Comment = {
        id: `c${Date.now()}`,
        user: {
          id: 'current_user',
          username: 'you',
          displayName: 'You',
          avatar: 'https://readdy.ai/api/search-image?query=Professional%20headshot%20of%20current%20user%2C%20clean%20background%2C%20professional%20lighting%2C%20high%20quality%20portrait%20photography%2C%20modern%20casual%20attire%2C%20confident%20expression%2C%20contemporary%20style&width=32&height=32&seq=currentuser&orientation=squarish',
          verified: false
        },
        content: newComment,
        media: commentMedia ? {
          type: commentMedia.type.startsWith('image/') ? 'image' : 'video',
          url: commentMediaPreview
        } : undefined,
        timestamp: new Date(),
        likes: 0,
        liked: false
      };

      setComments(prev => [comment, ...prev]);
      setNewComment('');
      setCommentMedia(null);
      setCommentMediaPreview('');
      setIsSubmitting(false);
    }, 500);
  };

  const handleLikeComment = (commentId: string) => {
    setComments(prev => prev.map(comment =>
      comment.id === commentId
        ? {
            ...comment,
            liked: !comment.liked,
            likes: comment.liked ? comment.likes - 1 : comment.likes + 1
          }
        : comment
    ));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
      <div className="w-full max-w-md mx-auto bg-white dark:bg-gray-900 rounded-t-2xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700">
          <h3 className="font-bold text-lg text-gray-900 dark:text-white">Comments</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <i className="ri-close-line text-gray-600 dark:text-gray-300"></i>
          </button>
        </div>

        {/* Comment Input */}
        <div className="p-4 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
              <img
                src="https://readdy.ai/api/search-image?query=Professional%20headshot%20of%20current%20user%2C%20clean%20background%2C%20professional%20lighting%2C%20high%20quality%20portrait%20photography%2C%20modern%20casual%20attire%2C%20confident%20expression%2C%20contemporary%20style&width=32&height=32&seq=currentuser&orientation=squarish"
                alt="Your avatar"
                className="w-full h-full object-cover object-top"
              />
            </div>
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="w-full resize-none border-none outline-none text-sm bg-gray-50 dark:bg-gray-800 dark:text-white rounded-2xl p-3 min-h-[60px]"
                maxLength={500}
              />

              {/* Comment Media Preview */}
              {commentMediaPreview && (
                <div className="mt-2 relative rounded-lg overflow-hidden">
                  {commentMedia?.type.startsWith('image/') ? (
                    <img
                      src={commentMediaPreview}
                      alt="Comment preview"
                      className="w-full h-auto max-h-32 object-cover object-top"
                    />
                  ) : (
                    <video
                      src={commentMediaPreview}
                      className="w-full h-auto max-h-32 object-cover"
                      controls
                    />
                  )}
                  <button
                    onClick={removeCommentMedia}
                    className="absolute top-1 right-1 w-6 h-6 bg-black/70 text-white rounded-full flex items-center justify-center hover:bg-black/80 transition-colors"
                  >
                    <i className="ri-close-line text-xs"></i>
                  </button>
                </div>
              )}

              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center space-x-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,video/*"
                    onChange={handleMediaSelect}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/30 text-blue-500 transition-colors"
                  >
                    <i className="ri-image-line text-sm"></i>
                  </button>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {newComment.length}/500
                  </span>
                </div>
                <button
                  onClick={handleSubmitComment}
                  disabled={(!newComment.trim() && !commentMedia) || isSubmitting}
                  className="px-4 py-2 bg-blue-500 text-white text-sm rounded-full hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors !rounded-button"
                >
                  {isSubmitting ? 'Posting...' : 'Post'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto">
          {isGeneratingComments ? (
            <div className="flex flex-col items-center justify-center py-16 px-4">
              <div className="w-8 h-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent mb-3"></div>
              <p className="text-gray-500 dark:text-gray-400 text-center text-sm">Loading comments...</p>
            </div>
          ) : comments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4">
              <div className="w-12 h-12 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-full mb-3">
                <i className="ri-chat-3-line text-xl text-gray-400"></i>
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-center text-sm">No comments yet</p>
            </div>
          ) : (
            <div className="space-y-4 p-4">
              {comments.map((comment) => (
                <div key={comment.id} className="flex items-start space-x-3">
                  <div className="w-8 h-8 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <img
                      src={comment.user.avatar}
                      alt={comment.user.displayName}
                      className="w-full h-full object-cover object-top"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-semibold text-sm text-gray-900 dark:text-white">
                        {comment.user.displayName}
                      </span>
                      {comment.user.verified && (
                        <div className="w-3 h-3 flex items-center justify-center">
                          <i className="ri-verified-badge-fill text-blue-500 text-xs"></i>
                        </div>
                      )}
                      <span className="text-gray-500 dark:text-gray-400 text-xs">
                        @{comment.user.username}
                      </span>
                      <span className="text-gray-500 dark:text-gray-400 text-xs">·</span>
                      <span className="text-gray-500 dark:text-gray-400 text-xs">
                        {formatTimestamp(comment.timestamp)}
                      </span>
                    </div>

                    {comment.content && (
                      <p className="text-gray-900 dark:text-white text-sm leading-relaxed mb-2">
                        {comment.content}
                      </p>
                    )}

                    {/* Comment Media */}
                    {comment.media && (
                      <div className="mb-2 rounded-lg overflow-hidden">
                        {comment.media.type === 'image' ? (
                          <img
                            src={comment.media.url}
                            alt="Comment media"
                            className="w-full h-auto max-h-32 object-cover object-top"
                          />
                        ) : (
                          <video
                            src={comment.media.url}
                            className="w-full h-auto max-h-32 object-cover"
                            controls
                          />
                        )}
                      </div>
                    )}

                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => handleLikeComment(comment.id)}
                        className={`flex items-center space-x-1 text-xs transition-colors group ${
                          comment.liked ? 'text-red-500' : 'text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-500'
                        }`}
                      >
                        <div
                          className={`w-6 h-6 flex items-center justify-center rounded-full transition-colors ${
                            comment.liked
                              ? 'bg-red-50 dark:bg-red-900/30'
                              : 'group-hover:bg-red-50 dark:group-hover:bg-red-900/30'
                          }`}
                        >
                          <i className={`${comment.liked ? 'ri-heart-fill' : 'ri-heart-line'} text-xs`}></i>
                        </div>
                        <span>{comment.likes}</span>
                      </button>

                      <button className="text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-500 text-xs transition-colors">
                        Reply
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
