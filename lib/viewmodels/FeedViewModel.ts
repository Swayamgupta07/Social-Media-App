
// ViewModel layer - Business logic and state management
import { BehaviorSubject, Subject } from '../reactive';
import { Post, FeedState } from '../models/Post';
import { PostService } from '../services/PostService';

export class FeedViewModel {
  private postService: PostService;
  private currentPage = 0;
  private readonly pageSize = 10;

  // Observable state
  private _feedState = new BehaviorSubject<FeedState>({
    posts: [],
    loading: false,
    refreshing: false,
    hasMore: true,
    error: undefined
  });

  // Public observables
  public readonly feedState$ = this._feedState;
  public readonly posts$ = this._feedState.map(state => state.posts);
  public readonly loading$ = this._feedState.map(state => state.loading);
  public readonly refreshing$ = this._feedState.map(state => state.refreshing);
  public readonly hasMore$ = this._feedState.map(state => state.hasMore);
  public readonly error$ = this._feedState.map(state => state.error);

  constructor() {
    this.postService = PostService.getInstance();
    this.loadInitialPosts();
  }

  // Actions
  async loadInitialPosts() {
    this.updateState({ loading: true, error: undefined });
    
    try {
      const posts = await this.postService.fetchPosts(0, this.pageSize);
      this.currentPage = 0;
      
      this.updateState({
        posts,
        loading: false,
        hasMore: posts.length === this.pageSize
      });
    } catch (error) {
      this.updateState({
        loading: false,
        error: 'Failed to load posts'
      });
    }
  }

  async refreshPosts() {
    if (this._feedState.value.refreshing) return;
    
    this.updateState({ refreshing: true, error: undefined });
    
    try {
      const posts = await this.postService.refreshPosts(this.pageSize);
      this.currentPage = 0;
      
      this.updateState({
        posts,
        refreshing: false,
        hasMore: posts.length === this.pageSize
      });
    } catch (error) {
      this.updateState({
        refreshing: false,
        error: 'Failed to refresh posts'
      });
    }
  }

  async loadMorePosts() {
    const currentState = this._feedState.value;
    if (currentState.loading || !currentState.hasMore) return;
    
    this.updateState({ loading: true });
    
    try {
      const newPosts = await this.postService.fetchPosts(
        this.currentPage + 1,
        this.pageSize
      );
      
      this.currentPage++;
      
      this.updateState({
        posts: [...currentState.posts, ...newPosts],
        loading: false,
        hasMore: newPosts.length === this.pageSize
      });
    } catch (error) {
      this.updateState({
        loading: false,
        error: 'Failed to load more posts'
      });
    }
  }

  async createPost(content: string, media?: File) {
    const currentState = this._feedState.value;
    
    // Create new post
    const newPost: Post = {
      id: `post_${Date.now()}`,
      user: {
        id: 'current_user',
        username: 'you',
        displayName: 'You',
        avatar: 'https://readdy.ai/api/search-image?query=Professional%20headshot%20of%20current%20user%2C%20clean%20background%2C%20professional%20lighting%2C%20high%20quality%20portrait%20photography%2C%20modern%20casual%20attire%2C%20confident%20expression%2C%20contemporary%20style&width=48&height=48&seq=currentuser&orientation=squarish',
        verified: false
      },
      type: media ? 'image' : 'text',
      content,
      media: media ? [{
        type: media.type.startsWith('image/') ? 'image' : 'video',
        url: URL.createObjectURL(media)
      }] : [],
      timestamp: new Date(),
      likes: 0,
      retweets: 0,
      replies: 0,
      liked: false,
      retweeted: false
    };
    
    // Add to top of posts
    this.updateState({
      posts: [newPost, ...currentState.posts]
    });
  }

  async likePost(postId: string) {
    const currentState = this._feedState.value;
    const postIndex = currentState.posts.findIndex(p => p.id === postId);
    
    if (postIndex === -1) return;
    
    // Optimistic update
    const updatedPosts = [...currentState.posts];
    const post = updatedPosts[postIndex];
    
    updatedPosts[postIndex] = {
      ...post,
      liked: !post.liked,
      likes: post.liked ? post.likes - 1 : post.likes + 1
    };
    
    this.updateState({ posts: updatedPosts });
    
    try {
      await this.postService.likePost(postId);
    } catch (error) {
      // Revert optimistic update
      this.updateState({ posts: currentState.posts });
    }
  }

  async retweetPost(postId: string) {
    const currentState = this._feedState.value;
    const postIndex = currentState.posts.findIndex(p => p.id === postId);
    
    if (postIndex === -1) return;
    
    // Optimistic update
    const updatedPosts = [...currentState.posts];
    const post = updatedPosts[postIndex];
    
    updatedPosts[postIndex] = {
      ...post,
      retweeted: !post.retweeted,
      retweets: post.retweeted ? post.retweets - 1 : post.retweets + 1
    };
    
    this.updateState({ posts: updatedPosts });
    
    try {
      await this.postService.retweetPost(postId);
    } catch (error) {
      // Revert optimistic update
      this.updateState({ posts: currentState.posts });
    }
  }

  incrementReplies(postId: string) {
    const currentState = this._feedState.value;
    const postIndex = currentState.posts.findIndex(p => p.id === postId);
    
    if (postIndex === -1) return;
    
    const updatedPosts = [...currentState.posts];
    const post = updatedPosts[postIndex];
    
    updatedPosts[postIndex] = {
      ...post,
      replies: post.replies + 1
    };
    
    this.updateState({ posts: updatedPosts });
  }

  private updateState(partialState: Partial<FeedState>) {
    const currentState = this._feedState.value;
    this._feedState.next({ ...currentState, ...partialState });
  }

  // Cleanup
  dispose() {
    // Clean up subscriptions if needed
  }
}
