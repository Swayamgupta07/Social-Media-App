
'use client';

import { useState, useRef } from 'react';

interface Story {
  id: string;
  user: {
    id: string;
    username: string;
    displayName: string;
    avatar: string;
  };
  media: string;
  timestamp: Date;
  viewed: boolean;
}

interface StoryViewerProps {
  stories: Story[];
}

export default function StoryViewer({ stories }: StoryViewerProps) {
  const [currentStoryIndex, setCurrentStoryIndex] = useState<number | null>(null);
  const [viewedStories, setViewedStories] = useState<string[]>([]);
  const [showCreateStory, setShowCreateStory] = useState(false);
  const [storyText, setStoryText] = useState('');
  const [storyMedia, setStoryMedia] = useState<File | null>(null);
  const [storyMediaPreview, setStoryMediaPreview] = useState<string>('');
  const [userStories, setUserStories] = useState<Story[]>([]);
  const [selectedBackground, setSelectedBackground] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const backgroundColors = [
    'bg-gradient-to-br from-pink-400 via-red-500 to-yellow-500',
    'bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500',
    'bg-gradient-to-br from-green-400 via-blue-500 to-purple-600',
    'bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500',
    'bg-gradient-to-br from-indigo-400 via-purple-500 to-pink-500',
    'bg-gradient-to-br from-teal-400 via-cyan-500 to-blue-500'
  ];

  // Static mock stories with consistent URLs
  const mockStories: Story[] = [
    {
      id: '1',
      user: {
        id: '1',
        username: 'john_doe',
        displayName: 'John Doe',
        avatar: `https://readdy.ai/api/search-image?query=Professional%20headshot%20young%20man%20smiling%20clean%20background&width=64&height=64&seq=story_avatar_1&orientation=squarish`
      },
      media: `https://readdy.ai/api/search-image?query=Beautiful%20coffee%20shop%20interior%20warm%20lighting%20cozy%20atmosphere%20modern%20cafe%20design&width=300&height=500&seq=story_media_1&orientation=portrait`,
      timestamp: new Date(Date.now() - 3600000),
      viewed: viewedStories.includes('1')
    },
    {
      id: '2',
      user: {
        id: '2',
        username: 'sarah_tech',
        displayName: 'Sarah Chen',
        avatar: `https://readdy.ai/api/search-image?query=Professional%20headshot%20woman%20glasses%20confident%20expression&width=64&height=64&seq=story_avatar_2&orientation=squarish`
      },
      media: `https://readdy.ai/api/search-image?query=Sunset%20over%20mountains%20golden%20hour%20lighting%20breathtaking%20landscape&width=300&height=500&seq=story_media_2&orientation=portrait`,
      timestamp: new Date(Date.now() - 7200000),
      viewed: viewedStories.includes('2')
    },
    {
      id: '3',
      user: {
        id: '3',
        username: 'mike_design',
        displayName: 'Mike Johnson',
        avatar: `https://readdy.ai/api/search-image?query=Professional%20headshot%20creative%20man%20artistic%20expression&width=64&height=64&seq=story_avatar_3&orientation=squarish`
      },
      media: `https://readdy.ai/api/search-image?query=Creative%20workspace%20design%20tools%20colorful%20sketches%20modern%20office&width=300&height=500&seq=story_media_3&orientation=portrait`,
      timestamp: new Date(Date.now() - 10800000),
      viewed: viewedStories.includes('3')
    },
    {
      id: '4',
      user: {
        id: '4',
        username: 'emma_travel',
        displayName: 'Emma Wilson',
        avatar: `https://readdy.ai/api/search-image?query=Professional%20headshot%20travel%20blogger%20woman%20adventurous%20casual&width=64&height=64&seq=story_avatar_4&orientation=squarish`
      },
      media: `https://readdy.ai/api/search-image?query=Beautiful%20beach%20scene%20sunset%20tropical%20paradise%20crystal%20clear%20water&width=300&height=500&seq=story_media_4&orientation=portrait`,
      timestamp: new Date(Date.now() - 14400000),
      viewed: viewedStories.includes('4')
    },
    {
      id: '5',
      user: {
        id: '5',
        username: 'alex_fitness',
        displayName: 'Alex Thompson',
        avatar: `https://readdy.ai/api/search-image?query=Professional%20headshot%20fitness%20trainer%20athletic%20casual%20energetic&width=64&height=64&seq=story_avatar_5&orientation=squarish`
      },
      media: `https://readdy.ai/api/search-image?query=Modern%20gym%20interior%20fitness%20equipment%20motivational%20atmosphere%20workout%20space&width=300&height=500&seq=story_media_5&orientation=portrait`,
      timestamp: new Date(Date.now() - 18000000),
      viewed: viewedStories.includes('5')
    }
  ];

  const allStories = [...userStories, ...mockStories];

  const openStoryViewer = (storyIndex: number) => {
    setCurrentStoryIndex(storyIndex);
    const storyId = allStories[storyIndex].id;
    if (!viewedStories.includes(storyId)) {
      setViewedStories(prev => [...prev, storyId]);
    }
  };

  const closeStoryViewer = () => {
    setCurrentStoryIndex(null);
  };

  const nextStory = () => {
    if (currentStoryIndex !== null && currentStoryIndex < allStories.length - 1) {
      openStoryViewer(currentStoryIndex + 1);
    } else {
      closeStoryViewer();
    }
  };

  const prevStory = () => {
    if (currentStoryIndex !== null && currentStoryIndex > 0) {
      openStoryViewer(currentStoryIndex - 1);
    }
  };

  const handleCreateStory = () => {
    setShowCreateStory(true);
  };

  const handleMediaSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setStoryMedia(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setStoryMediaPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeStoryMedia = () => {
    setStoryMedia(null);
    setStoryMediaPreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handlePostStory = () => {
    if (!storyText.trim() && !storyMedia) return;

    const newStory: Story = {
      id: `user_story_${Date.now()}`,
      user: {
        id: 'current_user',
        username: 'you',
        displayName: 'You',
        avatar: `https://readdy.ai/api/search-image?query=Professional%20headshot%20current%20user%20clean%20background%20confident%20expression&width=64&height=64&seq=user_story_avatar&orientation=squarish`
      },
      media: storyMedia ? storyMediaPreview : `https://readdy.ai/api/search-image?query=Beautiful%20social%20media%20story%20background%20colorful%20gradient%20modern%20design%20engaging%20visual&width=300&height=500&seq=user_story_${Date.now()}&orientation=portrait`,
      timestamp: new Date(),
      viewed: false
    };

    setUserStories(prev => [newStory, ...prev]);
    
    // Reset form
    setStoryText('');
    setStoryMedia(null);
    setStoryMediaPreview('');
    setSelectedBackground(0);
    setShowCreateStory(false);
  };

  return (
    <>
      <div className="bg-white dark:bg-black p-4 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center space-x-4 overflow-x-auto pb-2">
          {/* Add Story Button */}
          <div className="flex flex-col items-center space-y-1 flex-shrink-0">
            <button 
              onClick={handleCreateStory}
              className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full p-0.5"
            >
              <div className="w-full h-full bg-white dark:bg-black rounded-full flex items-center justify-center">
                <div className="w-6 h-6 flex items-center justify-center">
                  <i className="ri-add-line text-blue-500 text-xl"></i>
                </div>
              </div>
            </button>
            <span className="text-xs text-gray-600 dark:text-gray-300 font-medium">Your Story</span>
          </div>

          {/* User Stories */}
          {userStories.map((story, index) => (
            <div 
              key={story.id} 
              className="flex flex-col items-center space-y-1 flex-shrink-0 cursor-pointer"
              onClick={() => openStoryViewer(index)}
            >
              <div className={`w-16 h-16 rounded-full p-0.5 ${
                story.viewed 
                  ? 'bg-gray-300 dark:bg-gray-600' 
                  : 'bg-gradient-to-br from-pink-400 via-red-500 to-yellow-500'
              }`}>
                <div className="w-full h-full bg-white dark:bg-black rounded-full p-0.5">
                  <img 
                    src={story.user.avatar}
                    alt={story.user.displayName}
                    className="w-full h-full object-cover object-top rounded-full"
                    suppressHydrationWarning={true}
                  />
                </div>
              </div>
              <span className="text-xs text-gray-600 dark:text-gray-300 font-medium truncate w-16 text-center">
                {story.user.username}
              </span>
            </div>
          ))}

          {/* Mock Stories */}
          {mockStories.map((story, index) => (
            <div 
              key={story.id} 
              className="flex flex-col items-center space-y-1 flex-shrink-0 cursor-pointer"
              onClick={() => openStoryViewer(index + userStories.length)}
            >
              <div className={`w-16 h-16 rounded-full p-0.5 ${
                story.viewed 
                  ? 'bg-gray-300 dark:bg-gray-600' 
                  : 'bg-gradient-to-br from-pink-400 via-red-500 to-yellow-500'
              }`}>
                <div className="w-full h-full bg-white dark:bg-black rounded-full p-0.5">
                  <img 
                    src={story.user.avatar}
                    alt={story.user.displayName}
                    className="w-full h-full object-cover object-top rounded-full"
                    suppressHydrationWarning={true}
                  />
                </div>
              </div>
              <span className="text-xs text-gray-600 dark:text-gray-300 font-medium truncate w-16 text-center">
                {story.user.username}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Create Story Modal */}
      {showCreateStory && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
          <div className="w-full max-w-md mx-auto bg-white dark:bg-black rounded-t-2xl max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800">
              <button
                onClick={() => setShowCreateStory(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              >
                Cancel
              </button>
              <h3 className="font-bold text-lg text-gray-900 dark:text-white">Create Story</h3>
              <button
                onClick={handlePostStory}
                disabled={!storyText.trim() && !storyMedia}
                className="px-4 py-2 bg-blue-500 text-white text-sm rounded-full hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors !rounded-button"
              >
                Share
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {/* Background Selection */}
              {!storyMedia && (
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Choose Background</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {backgroundColors.map((bg, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedBackground(index)}
                        className={`w-full h-16 rounded-lg ${bg} ${
                          selectedBackground === index ? 'ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-black' : ''
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Story Preview */}
              <div className={`w-full h-80 rounded-2xl overflow-hidden mb-4 ${
                storyMedia ? 'bg-black' : backgroundColors[selectedBackground]
              } flex items-center justify-center relative`}>
                {storyMediaPreview ? (
                  <>
                    {storyMedia?.type.startsWith('image/') ? (
                      <img 
                        src={storyMediaPreview}
                        alt="Story preview"
                        className="w-full h-full object-cover object-top"
                      />
                    ) : (
                      <video 
                        src={storyMediaPreview}
                        className="w-full h-full object-cover"
                        controls
                      />
                    )}
                    <button
                      onClick={removeStoryMedia}
                      className="absolute top-2 right-2 w-8 h-8 bg-black/70 text-white rounded-full flex items-center justify-center hover:bg-black/80 transition-colors"
                    >
                      <i className="ri-close-line text-sm"></i>
                    </button>
                  </>
                ) : (
                  <div className="text-center p-4">
                    <div className="w-12 h-12 flex items-center justify-center bg-white/20 rounded-full mx-auto mb-3">
                      <i className="ri-camera-line text-white text-xl"></i>
                    </div>
                    <p className="text-white text-sm">Add photo or video</p>
                  </div>
                )}
                
                {/* Text Overlay */}
                {storyText && (
                  <div className="absolute inset-0 flex items-center justify-center p-4">
                    <p className="text-white text-lg font-bold text-center bg-black/30 rounded-lg p-3">
                      {storyText}
                    </p>
                  </div>
                )}
              </div>

              {/* Text Input */}
              <textarea
                value={storyText}
                onChange={(e) => setStoryText(e.target.value)}
                placeholder="Add text to your story..."
                className="w-full resize-none border-none outline-none text-base bg-gray-50 dark:bg-gray-800 dark:text-white rounded-2xl p-3 mb-4 min-h-[80px]"
                maxLength={200}
              />

              {/* Media Button */}
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
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-500 transition-colors"
                  >
                    <i className="ri-image-line text-xl"></i>
                  </button>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {storyText.length}/200
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Story Modal - Single story per user */}
      {currentStoryIndex !== null && (
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
          {/* Story Content */}
          <div className="relative w-full h-full max-w-md mx-auto">
            {/* Single Progress bar per user */}
            <div className="absolute top-4 left-4 right-4 z-10">
              <div className="w-full h-0.5 bg-white/30 rounded-full">
                <div className="h-full bg-white rounded-full w-full"></div>
              </div>
            </div>

            {/* Header */}
            <div className="absolute top-8 left-4 right-4 flex items-center justify-between z-10">
              <div className="flex items-center space-x-3">
                <img 
                  src={allStories[currentStoryIndex].user.avatar}
                  alt={allStories[currentStoryIndex].user.displayName}
                  className="w-10 h-10 object-cover object-top rounded-full border-2 border-white"
                  suppressHydrationWarning={true}
                />
                <div>
                  <p className="text-white font-semibold text-sm">
                    {allStories[currentStoryIndex].user.displayName}
                  </p>
                  <p className="text-white/70 text-xs" suppressHydrationWarning={true}>
                    {Math.floor((Date.now() - allStories[currentStoryIndex].timestamp.getTime()) / 3600000)}h ago
                  </p>
                </div>
              </div>
              <button
                onClick={closeStoryViewer}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-black/30 text-white"
              >
                <i className="ri-close-line"></i>
              </button>
            </div>

            {/* Story Image */}
            <img 
              src={allStories[currentStoryIndex].media}
              alt="Story"
              className="w-full h-full object-cover object-top"
              suppressHydrationWarning={true}
            />

            {/* Navigation */}
            <button
              onClick={prevStory}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-black/30 text-white"
            >
              <i className="ri-arrow-left-line"></i>
            </button>
            <button
              onClick={nextStory}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-black/30 text-white"
            >
              <i className="ri-arrow-right-line"></i>
            </button>

            {/* Tap areas for navigation */}
            <div className="absolute inset-0 flex">
              <div className="w-1/2 h-full" onClick={prevStory}></div>
              <div className="w-1/2 h-full" onClick={nextStory}></div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
