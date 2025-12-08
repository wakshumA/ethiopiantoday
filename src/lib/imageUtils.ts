// Utility functions for handling images in news feeds

export async function validateImageUrl(url: string): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch(url, { 
      method: 'HEAD', 
      signal: controller.signal 
    });
    
    clearTimeout(timeoutId);
    const contentType = response.headers.get('content-type');
    return response.ok && (contentType?.startsWith('image/') ?? false);
  } catch {
    return false;
  }
}

export function getReliableImageUrl(originalUrl: string | undefined): string | undefined {
  if (!originalUrl) return undefined;
  
  // Skip obviously problematic URLs
  if (originalUrl.includes('gravatar.com') || 
      originalUrl.includes('facebook.com') ||
      originalUrl.includes('twitter.com') ||
      originalUrl.includes('instagram.com') ||
      originalUrl.includes('youtube.com') ||
      originalUrl.includes('linkedin.com') ||
      originalUrl.endsWith('.svg') ||
      originalUrl.endsWith('.gif') ||
      originalUrl.includes('placeholder') ||
      originalUrl.includes('logo')) {
    return undefined;
  }
  
  try {
    const url = new URL(originalUrl);
    
    // For Unsplash images, ensure they have proper query parameters
    if (url.hostname.includes('unsplash.com')) {
      // Check if the URL looks malformed or has missing ID
      if (!url.pathname.includes('photo-') || url.pathname.length < 20) {
        return undefined;
      }
      return originalUrl;
    }
    
    // For other domains, validate they look like proper image URLs
    if (!originalUrl.match(/\.(jpg|jpeg|png|webp)(\?.*)?$/i)) {
      return undefined;
    }
    
    return originalUrl;
  } catch {
    return undefined;
  }
}

export const fallbackImages = [
  'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=400&q=80',  // Telecom/communication
  'https://images.unsplash.com/photo-1611224923853-80b023f02d71?auto=format&fit=crop&w=400&q=80',  // Business/finance  
  'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?auto=format&fit=crop&w=400&q=80',  // Africa/Ethiopia
  'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=400&q=80',  // Business meeting
  'https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?auto=format&fit=crop&w=400&q=80',  // News/media
];

export function getRandomFallbackImage(): string {
  return fallbackImages[Math.floor(Math.random() * fallbackImages.length)];
}
