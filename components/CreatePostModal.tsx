
'use client';

import { useState, useRef } from 'react';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPost: (content: string, media?: File) => void;
}

export default function CreatePostModal({ isOpen, onClose, onPost }: CreatePostModalProps) {
  const [content, setContent] = useState('');
  const [media, setMedia] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleMediaSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMedia(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setMediaPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!content.trim() && !media) return;
    
    setIsSubmitting(true);
    await onPost(content, media || undefined);
    
    // Reset form
    setContent('');
    setMedia(null);
    setMediaPreview('');
    setIsSubmitting(false);
    onClose();
  };

  const removeMedia = () => {
    setMedia(null);
    setMediaPreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
      <div className="w-full max-w-md mx-auto bg-white dark:bg-gray-900 rounded-t-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700">
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            Cancel
          </button>
          <h3 className="font-bold text-lg text-gray-900 dark:text-white">Create Post</h3>
          <button
            onClick={handleSubmit}
            disabled={(!content.trim() && !media) || isSubmitting}
            className="px-4 py-2 bg-blue-500 text-white text-sm rounded-full hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors !rounded-button"
          >
            {isSubmitting ? 'Posting...' : 'Post'}
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="flex items-start space-x-3">
            <div className="w-12 h-12 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
              <img 
                src="https://readdy.ai/api/search-image?query=Professional%20headshot%20of%20current%20user%2C%20clean%20background%2C%20professional%20lighting%2C%20high%20quality%20portrait%20photography%2C%20modern%20casual%20attire%2C%20confident%20expression%2C%20contemporary%20style&width=48&height=48&seq=currentuser&orientation=squarish"
                alt="Your avatar"
                className="w-full h-full object-cover object-top"
              />
            </div>
            <div className="flex-1">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What's happening?"
                className="w-full resize-none border-none outline-none text-lg bg-transparent dark:text-white min-h-[120px] placeholder-gray-500 dark:placeholder-gray-400"
                maxLength={280}
              />
              
              {/* Media Preview */}
              {mediaPreview && (
                <div className="mt-3 relative rounded-2xl overflow-hidden">
                  {media?.type.startsWith('image/') ? (
                    <img 
                      src={mediaPreview}
                      alt="Preview"
                      className="w-full h-auto max-h-64 object-cover object-top"
                    />
                  ) : (
                    <video 
                      src={mediaPreview}
                      className="w-full h-auto max-h-64 object-cover"
                      controls
                    />
                  )}
                  <button
                    onClick={removeMedia}
                    className="absolute top-2 right-2 w-8 h-8 bg-black/70 text-white rounded-full flex items-center justify-center hover:bg-black/80 transition-colors"
                  >
                    <i className="ri-close-line text-sm"></i>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*"
                onChange={handleMediaSelect}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/30 text-blue-500 transition-colors"
              >
                <i className="ri-image-line text-xl"></i>
              </button>
              <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/30 text-blue-500 transition-colors">
                <i className="ri-gif-line text-xl"></i>
              </button>
              <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/30 text-blue-500 transition-colors">
                <i className="ri-emotion-line text-xl"></i>
              </button>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {content.length}/280
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
