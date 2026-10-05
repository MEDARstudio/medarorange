/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Utility helpers to handle media URLs, Instagram post links, and CDN images
 */

/**
 * Extracts the Instagram shortcode from a post, reel, or IGTV URL
 * Example: https://www.instagram.com/p/C-xyz123/ -> C-xyz123
 */
export function getInstagramShortcode(url?: string): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  const match = trimmed.match(/(?:instagram\.com|instagr\.am)\/(?:p|reel|tv)\/([a-zA-Z0-9_-]+)/i);
  return match ? match[1] : null;
}

/**
 * Checks whether a URL is an Instagram post or reel web link
 */
export function isInstagramUrl(url?: string): boolean {
  return !!getInstagramShortcode(url);
}

/**
 * Gets the official Instagram embed URL for iframe rendering
 */
export function getInstagramEmbedUrl(urlOrShortcode?: string, captioned: boolean = false): string | null {
  if (!urlOrShortcode) return null;
  const shortcode = getInstagramShortcode(urlOrShortcode) || (urlOrShortcode.length < 30 && !urlOrShortcode.includes('/') ? urlOrShortcode : null);
  if (!shortcode) return null;
  return `https://www.instagram.com/p/${shortcode}/embed/${captioned ? 'captioned/' : ''}`;
}

/**
 * Checks if a string is a base64 data URL or blob
 */
export function isLocalDataUrl(url?: string): boolean {
  if (!url) return false;
  return url.startsWith('data:') || url.startsWith('blob:');
}

/**
 * Checks if a URL points directly to an image file
 */
export function isDirectImageUrl(url?: string): boolean {
  if (!url) return false;
  if (isLocalDataUrl(url)) return url.startsWith('data:image/');
  const cleanUrl = url.split('?')[0].toLowerCase();
  return /\.(jpg|jpeg|png|webp|gif|svg|avif)$/.test(cleanUrl) || url.includes('images.unsplash.com');
}

/**
 * Checks if a URL points directly to a video file
 */
export function isDirectVideoUrl(url?: string): boolean {
  if (!url) return false;
  if (isLocalDataUrl(url)) return url.startsWith('data:video/');
  const cleanUrl = url.split('?')[0].toLowerCase();
  return /\.(mp4|webm|ogg|mov)$/.test(cleanUrl);
}
