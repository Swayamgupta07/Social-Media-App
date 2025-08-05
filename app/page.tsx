
'use client';

import { useEffect, useMemo, useState } from 'react';
import { FeedViewModel } from '../lib/viewmodels/FeedViewModel';
import { useObservable } from '../hooks/useViewModel';
import FeedItem from '../components/FeedItem';
import InfiniteScrollContainer from '../components/InfiniteScrollContainer';
import PullToRefresh from '../components/PullToRefresh';
import CreatePostModal from '../components/CreatePostModal';
import SettingsModal from '../components/SettingsModal';
import StoryViewer from '../components/StoryViewer';
import { Post } from '../lib/models/Post';

export default function Home() {
  // Create ViewModel instance (in real app, this would be injected)
  const viewModel = useMemo(() => new FeedViewModel(), []);
  
  // Observe ViewModel state
  const posts = useObservable(viewModel.posts$);
  const loading = useObservable(viewModel.loading$);
  const refreshing = useObservable(viewModel.refreshing$);
  const hasMore = useObservable(viewModel.hasMore$);
  const error = useObservable(viewModel.error$);

  // Modal states
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Apply dark mode on load
  useEffect(() => {
    const darkMode = localStorage.getItem('darkMode') === 'true';
    document.documentElement.classList.toggle('dark', darkMode);
    document.body.style.backgroundColor = darkMode ? '#000000' : '#f9fafb';
    
    // Listen for dark mode changes
    const handleDarkModeChange = () => {
      const isDark = document.documentElement.classList.contains('dark');
      document.body.style.backgroundColor = isDark ? '#000000' : '#f9fafb';
    };
    
    const observer = new MutationObserver(handleDarkModeChange);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    
    return () => observer.disconnect();
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => viewModel.dispose();
  }, [viewModel]);

  // Event handlers
  const handleRefresh = async () => {
    await viewModel.refreshPosts();
  };

  const handleLoadMore = () => {
    viewModel.loadMorePosts();
  };

  const handleLike = (postId: string) => {
    viewModel.likePost(postId);
  };

  const handleRetweet = (postId: string) => {
    viewModel.retweetPost(postId);
  };

  const handleReply = (postId: string) => {
    viewModel.incrementReplies(postId);
  };

  const handleCreatePost = async (content: string, media?: File) => {
    await viewModel.createPost(content, media);
  };

  return (
    <div className="max-w-md mx-auto h-screen bg-gray-50 dark:bg-black">
      {/* Header */}
      <div className="fixed top-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-white/95 dark:bg-black/95 backdrop-blur-sm border-b border-gray-100 dark:border-gray-800 z-20">
        <div className="flex items-center justify-between px-4 py-3">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Feed</h1>
          <button 
            onClick={() => setShowSettings(true)}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <i className="ri-settings-3-line text-gray-600 dark:text-gray-300"></i>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="pt-16 h-full">
        <PullToRefresh
          onRefresh={handleRefresh}
          refreshing={refreshing}
        >
          <InfiniteScrollContainer
            onLoadMore={handleLoadMore}
            hasMore={hasMore}
            loading={loading}
          >
            {/* Stories */}
            <StoryViewer stories={[]} />

            {/* Error state */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg mx-4 mt-4 p-4">
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 flex items-center justify-center">
                    <i className="ri-error-warning-line text-red-500"></i>
                  </div>
                  <span className="text-red-700 dark:text-red-300 text-sm">{error}</span>
                </div>
                <button
                  onClick={() => viewModel.loadInitialPosts()}
                  className="mt-2 px-3 py-1 bg-red-500 text-white text-sm rounded-md hover:bg-red-600 transition-colors !rounded-button"
                >
                  Retry
                </button>
              </div>
            )}

            {/* Empty state */}
            {!loading && !error && posts.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 px-4">
                <div className="w-16 h-16 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
                  <i className="ri-chat-3-line text-2xl text-gray-400"></i>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No posts yet</h3>
                <p className="text-gray-500 dark:text-gray-400 text-center text-sm">
                  Pull down to refresh and load some posts
                </p>
              </div>
            )}

            {/* Feed Items */}
            {posts.map((post) => (
              <FeedItem
                key={post.id}
                post={post}
                onLike={handleLike}
                onRetweet={handleRetweet}
                onReply={handleReply}
              />
            ))}
          </InfiniteScrollContainer>
        </PullToRefresh>
      </div>

      {/* Floating Action Button */}
      <button 
        onClick={() => setShowCreatePost(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg transition-all duration-200 hover:shadow-xl z-30 !rounded-button"
      >
        <div className="w-full h-full flex items-center justify-center">
          <i className="ri-add-line text-xl"></i>
        </div>
      </button>

      {/* Modals */}
      <CreatePostModal
        isOpen={showCreatePost}
        onClose={() => setShowCreatePost(false)}
        onPost={handleCreatePost}
      />

      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />
    </div>
  );
}