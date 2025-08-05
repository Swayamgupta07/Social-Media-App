
// Plugin system for custom feed items
import { Post } from '../../lib/models/Post';

export interface FeedItemPluginProps {
  post: Post;
  onLike: (postId: string) => void;
  onRetweet: (postId: string) => void;
  onReply: (postId: string) => void;
}

export interface FeedItemPlugin {
  type: string;
  component: React.ComponentType<FeedItemPluginProps>;
  canHandle: (post: Post) => boolean;
}

export class FeedItemPluginRegistry {
  private static instance: FeedItemPluginRegistry;
  private plugins: Map<string, FeedItemPlugin> = new Map();

  static getInstance(): FeedItemPluginRegistry {
    if (!FeedItemPluginRegistry.instance) {
      FeedItemPluginRegistry.instance = new FeedItemPluginRegistry();
    }
    return FeedItemPluginRegistry.instance;
  }

  registerPlugin(plugin: FeedItemPlugin) {
    this.plugins.set(plugin.type, plugin);
  }

  getPluginForPost(post: Post): FeedItemPlugin | null {
    for (const plugin of this.plugins.values()) {
      if (plugin.canHandle(post)) {
        return plugin;
      }
    }
    return null;
  }

  getAllPlugins(): FeedItemPlugin[] {
    return Array.from(this.plugins.values());
  }
}
