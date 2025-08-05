
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

// Rate limiting
let requestCount = 0;
let lastResetTime = Date.now();
const MAX_REQUESTS_PER_MINUTE = 10;

function checkRateLimit() {
  const now = Date.now();
  if (now - lastResetTime > 60000) {
    requestCount = 0;
    lastResetTime = now;
  }
  
  if (requestCount >= MAX_REQUESTS_PER_MINUTE) {
    throw new Error('Rate limit exceeded');
  }
  
  requestCount++;
}

export async function generateRandomComment(postContent?: string): Promise<string> {
  try {
    checkRateLimit();
    
    const contextPrompt = postContent 
      ? `Write a short, natural comment (1-2 sentences) responding to this social media post: "${postContent}". Make it engaging, positive, and authentic like a real person would write. Use casual language and maybe an emoji. Don't use hashtags or mentions.`
      : `Write a short, natural comment (1-2 sentences) for a social media post. Make it engaging, positive, and authentic like a real person would write. Use casual language and maybe an emoji. Don't use hashtags or mentions.`;

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: contextPrompt
          }]
        }],
        generationConfig: {
          temperature: 0.9,
          topK: 1,
          topP: 1,
          maxOutputTokens: 100,
        }
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!generatedText) {
      throw new Error('No text generated');
    }

    return generatedText.trim();
  } catch (error) {
    console.error('Error generating comment:', error);
    
    // Fallback comments that are contextual
    const fallbackComments = [
      "Love this! 😍",
      "This is amazing! 🔥",
      "So beautiful! ✨",
      "Perfect timing for this post! 👌",
      "This made my day better 💕",
      "Absolutely stunning work! 🙌",
      "This is so inspiring! 💫",
      "Wow, this is incredible! 😱",
      "You never disappoint! 🌟",
      "This speaks to me! 💯",
      "Beautiful capture! 📸",
      "Love the vibes here! ✌️",
      "This is pure gold! ⭐",
      "Amazing as always! 🎯",
      "This is everything! 🔥",
      "So good! Love it! 💖",
      "This is so well done! 👏",
      "Perfect! Just perfect! ✨",
      "This hits different! 💪",
      "Absolutely love this! 🥰"
    ];
    
    return fallbackComments[Math.floor(Math.random() * fallbackComments.length)];
  }
}
