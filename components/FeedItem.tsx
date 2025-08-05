
'use client';

import { Post } from '../lib/models/Post';
import { FeedItemPluginRegistry } from './ui/FeedItemPlugin';
import TextFeedItem from './ui/TextFeedItem';
import ImageFeedItem from './ui/ImageFeedItem';
import VideoFeedItem from './ui/VideoFeedItem';

interface FeedItemProps {
  post: Post;
  onLike: (postId: string) => void;
  onRetweet: (postId: string) => void;
  onReply: (postId: string) => void;
}

export default function FeedItem({ post, onLike, onRetweet, onReply }: FeedItemProps) {
  // Try to get plugin for post
  const pluginRegistry = FeedItemPluginRegistry.getInstance();
  const plugin = pluginRegistry.getPluginForPost(post);
  
  if (plugin) {
    const PluginComponent = plugin.component;
    return (
      <PluginComponent
        post={post}
        onLike={onLike}
        onRetweet={onRetweet}
        onReply={onReply}
      />
    );
  }
  
  // Default component selection based on post type
  switch (post.type) {
    case 'video':
      return (
        <VideoFeedItem
          post={post}
          onLike={onLike}
          onRetweet={onRetweet}
          onReply={onReply}
        />
      );
    case 'image':
      return (
        <ImageFeedItem
          post={post}
          onLike={onLike}
          onRetweet={onRetweet}
          onReply={onReply}
        />
      );
    default:
      return (
        <TextFeedItem
          post={post}
          onLike={onLike}
          onRetweet={onRetweet}
          onReply={onReply}
        />
      );
  }
}
