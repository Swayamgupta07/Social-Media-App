
// Service layer for API calls and data management
import { Post, User } from '../models/Post';
import { generateRandomComment } from '../api/gemini';

export class PostService {
  private static instance: PostService;
  private usedImageSeqs = new Set<string>();
  
  static getInstance(): PostService {
    if (!PostService.instance) {
      PostService.instance = new PostService();
    }
    return PostService.instance;
  }

  // Generate unique image sequence
  private getUniqueSeq(): string {
    let seq: string;
    do {
      seq = `img_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
    } while (this.usedImageSeqs.has(seq));
    
    this.usedImageSeqs.add(seq);
    return seq;
  }

  // Generate diverse posts using Gemini API
  private async generateDiverseContent(): Promise<{content: string, hasImage: boolean, imagePrompt?: string}> {
    try {
      const contentTypes = ['funny_joke', 'motivational', 'life_update', 'random_thought', 'sad_moment', 'achievement', 'food', 'travel', 'work', 'weekend'];
      const contentType = contentTypes[Math.floor(Math.random() * contentTypes.length)];
      
      let prompt = '';
      let needsImage = false;
      let imagePrompt = '';
      
      switch (contentType) {
        case 'funny_joke':
          prompt = 'Write a short, funny social media post with a clean joke or humorous observation. Keep it light and entertaining, 1-2 sentences max.';
          break;
        case 'motivational':
          prompt = 'Write an inspiring and motivational social media post about overcoming challenges or personal growth. Keep it positive and uplifting, 1-2 sentences max.';
          needsImage = Math.random() > 0.5;
          imagePrompt = 'Motivational sunrise landscape, inspiring mountain view, golden hour lighting, peaceful nature, uplifting atmosphere, high quality photography';
          break;
        case 'life_update':
          prompt = 'Write a casual life update post about something good happening in your day. Make it relatable and positive, 1-2 sentences max.';
          needsImage = Math.random() > 0.6;
          imagePrompt = 'Daily life moment, cozy home setting, natural lighting, lifestyle photography, warm and inviting atmosphere';
          break;
        case 'sad_moment':
          prompt = 'Write a thoughtful, slightly melancholic post about missing someone or reflecting on life. Keep it gentle and relatable, 1-2 sentences max.';
          needsImage = Math.random() > 0.7;
          imagePrompt = 'Rainy day through window, melancholic atmosphere, soft lighting, contemplative mood, artistic photography';
          break;
        case 'achievement':
          prompt = 'Write an excited post about completing a project or achieving a small goal. Show enthusiasm but stay humble, 1-2 sentences max.';
          needsImage = Math.random() > 0.4;
          imagePrompt = 'Success celebration, workspace achievement, completed project, professional accomplishment, modern office setting';
          break;
        case 'food':
          prompt = 'Write a delicious food post about trying something new or cooking at home. Make it mouth-watering, 1-2 sentences max.';
          needsImage = true;
          imagePrompt = 'Delicious food photography, appetizing meal presentation, restaurant quality, colorful ingredients, food styling';
          break;
        case 'travel':
          prompt = 'Write an exciting travel post about discovering a new place or beautiful scenery. Capture the wonder, 1-2 sentences max.';
          needsImage = true;
          imagePrompt = 'Beautiful travel destination, scenic landscape, vacation vibes, natural beauty, travel photography';
          break;
        default:
          prompt = 'Write a casual, relatable social media post about daily life. Make it engaging and authentic, 1-2 sentences max.';
          needsImage = Math.random() > 0.5;
          imagePrompt = 'Casual lifestyle moment, everyday life, natural setting, candid photography, relatable scene';
      }

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyBKut3K_8lpVZWdC4jDSE_vIyb4yBaiZNE`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.9, maxOutputTokens: 100 }
        })
      });

      if (response.ok) {
        const data = await response.json();
        const generatedContent = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
        
        if (generatedContent) {
          return {
            content: generatedContent,
            hasImage: needsImage,
            imagePrompt: needsImage ? imagePrompt : undefined
          };
        }
      }
    } catch (error) {
      console.error('Gemini API error:', error);
    }

    // Fallback content
    const fallbackPosts = [
      { content: "Just had the best coffee ever! ☕ Sometimes it's the little things that make your day perfect ✨", hasImage: true, imagePrompt: "Perfect cup of coffee, cozy cafe atmosphere, warm lighting, artisanal coffee art" },
      { content: "Why do they call it rush hour when nobody's moving? 😂 Traffic has its own sense of humor!", hasImage: false },
      { content: "Missing those summer nights when everything felt possible 🌙 Time really does fly when you're not looking", hasImage: true, imagePrompt: "Summer night sky, nostalgic atmosphere, warm evening glow, peaceful scenery" },
      { content: "Finally finished that project I've been working on for weeks! 🎉 Nothing beats the feeling of checking something off your list", hasImage: false },
      { content: "Tried making pasta from scratch today... let's just say the kitchen survived 😅 Practice makes perfect, right?", hasImage: true, imagePrompt: "Homemade pasta cooking, messy kitchen, cooking process, culinary adventure" }
    ];
    
    const fallback = fallbackPosts[Math.floor(Math.random() * fallbackPosts.length)];
    return fallback;
  }

  // Mock data generator with Gemini-powered content
  private async generateMockPosts(count: number = 10, offset: number = 0): Promise<Post[]> {
    const users: User[] = [
      {
        id: '1',
        username: 'john_doe',
        displayName: 'John Doe',
        avatar: `https://readdy.ai/api/search-image?query=Professional%20headshot%20young%20man%20smiling%20clean%20background&width=48&height=48&seq=${this.getUniqueSeq()}&orientation=squarish`,
        verified: true
      },
      {
        id: '2',
        username: 'sarah_tech',
        displayName: 'Sarah Chen',
        avatar: `https://readdy.ai/api/search-image?query=Professional%20headshot%20woman%20glasses%20confident%20expression&width=48&height=48&seq=${this.getUniqueSeq()}&orientation=squarish`,
        verified: false
      },
      {
        id: '3',
        username: 'mike_design',
        displayName: 'Mike Johnson',
        avatar: `https://readdy.ai/api/search-image?query=Professional%20headshot%20creative%20man%20artistic%20expression&width=48&height=48&seq=${this.getUniqueSeq()}&orientation=squarish`,
        verified: true
      },
      {
        id: '4',
        username: 'emily_writer',
        displayName: 'Emily Rodriguez',
        avatar: `https://readdy.ai/api/search-image?query=Professional%20headshot%20female%20writer%20thoughtful%20expression&width=48&height=48&seq=${this.getUniqueSeq()}&orientation=squarish`,
        verified: false
      },
      {
        id: '5',
        username: 'alex_photo',
        displayName: 'Alex Kim',
        avatar: `https://readdy.ai/api/search-image?query=Professional%20headshot%20photographer%20creative%20casual&width=48&height=48&seq=${this.getUniqueSeq()}&orientation=squarish`,
        verified: true
      },
      {
        id: '6',
        username: 'lisa_dev',
        displayName: 'Lisa Wang',
        avatar: `https://readdy.ai/api/search-image?query=Professional%20headshot%20software%20developer%20woman%20confident&width=48&height=48&seq=${this.getUniqueSeq()}&orientation=squarish`,
        verified: false
      }
    ];

    const posts: Post[] = [];
    
    for (let i = 0; i < count; i++) {
      const userIndex = (i + offset) % users.length;
      const user = users[userIndex];
      
      // Generate diverse content
      const { content, hasImage, imagePrompt } = await this.generateDiverseContent();
      const postType = hasImage ? (Math.random() > 0.8 ? 'video' : 'image') : 'text';
      
      const post: Post = {
        id: `post_${offset + i}_${Date.now()}_${Math.random()}`,
        user,
        content,
        media: hasImage ? [{
          type: postType === 'video' ? 'video' : 'image',
          url: `https://readdy.ai/api/search-image?query=$%7BimagePrompt%7D&width=400&height=300&seq=${this.getUniqueSeq()}&orientation=landscape`,
          thumbnail: postType === 'video' ? `https://readdy.ai/api/search-image?query=$%7BimagePrompt%7D&width=400&height=300&seq=${this.getUniqueSeq()}&orientation=landscape` : undefined,
          width: 400,
          height: 300
        }] : undefined,
        timestamp: new Date(Date.now() - Math.random() * 86400000 * 7),
        likes: Math.floor(Math.random() * 1000),
        retweets: Math.floor(Math.random() * 200),
        replies: Math.floor(Math.random() * 50),
        liked: Math.random() > 0.7,
        retweeted: Math.random() > 0.8,
        type: postType
      };
      
      posts.push(post);
    }
    
    return posts;
  }

  async fetchPosts(page: number = 0, limit: number = 10): Promise<Post[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 500));
    
    return this.generateMockPosts(limit, page * limit);
  }

  async refreshPosts(limit: number = 10): Promise<Post[]> {
    // Simulate refresh delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return this.generateMockPosts(limit, Math.floor(Date.now() / 1000));
  }

  async likePost(postId: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return true;
  }

  async retweetPost(postId: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return true;
  }
}
