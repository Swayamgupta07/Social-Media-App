// Model layer - Data structures
export interface User {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  verified: boolean;
}

export interface PostMedia {
  type: 'image' | 'video';
  url: string;
  thumbnail?: string;
  width?: number;
  height?: number;
}

export interface Post {
  id: string;
  user: User;
  content: string;
  media?: PostMedia[];
  timestamp: Date;
  likes: number;
  retweets: number;
  replies: number;
  liked: boolean;
  retweeted: boolean;
  type: 'text' | 'image' | 'video';
}

export interface FeedState {
  posts: Post[];
  loading: boolean;
  refreshing: boolean;
  hasMore: boolean;
  error?: string;
}