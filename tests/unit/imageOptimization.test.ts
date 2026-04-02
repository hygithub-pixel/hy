import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getWebPUrl, getResponsiveImageUrl, isWebPSupported, getOptimizedImageUrl, preloadImages } from '@/utils/imageOptimization';

// 模拟window对象
global.window = {} as any;
global.document = {
  createElement: vi.fn(() => ({
    getContext: vi.fn(() => ({
      toDataURL: vi.fn(() => 'data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAwA0JaQAA3AA/vuUAAA='
    }))
  }))
} as any;

describe('imageOptimization', () => {
  beforeEach(() => {
    // 清空所有模拟函数的调用记录
    vi.clearAllMocks();
  });

  describe('getWebPUrl', () => {
    it('should return the same URL if it already ends with .webp', () => {
      const url = 'https://example.com/image.webp';
      const result = getWebPUrl(url);
      expect(result).toBe(url);
    });

    it('should replace .jpg extension with .webp', () => {
      const url = 'https://example.com/image.jpg';
      const result = getWebPUrl(url);
      expect(result).toBe('https://example.com/image.webp');
    });

    it('should replace .jpeg extension with .webp', () => {
      const url = 'https://example.com/image.jpeg';
      const result = getWebPUrl(url);
      expect(result).toBe('https://example.com/image.webp');
    });

    it('should replace .png extension with .webp', () => {
      const url = 'https://example.com/image.png';
      const result = getWebPUrl(url);
      expect(result).toBe('https://example.com/image.webp');
    });

    it('should replace .gif extension with .webp', () => {
      const url = 'https://example.com/image.gif';
      const result = getWebPUrl(url);
      expect(result).toBe('https://example.com/image.webp');
    });

    it('should return empty string if url is empty', () => {
      const result = getWebPUrl('');
      expect(result).toBe('');
    });
  });

  describe('getResponsiveImageUrl', () => {
    it('should add width parameter to URL', () => {
      const url = 'https://example.com/image.jpg';
      const width = 800;
      const result = getResponsiveImageUrl(url, width);
      expect(result).toBe('https://example.com/image.jpg?w=800');
    });

    it('should return empty string if url is empty', () => {
      const result = getResponsiveImageUrl('', 800);
      expect(result).toBe('');
    });
  });

  describe('isWebPSupported', () => {
    it('should return true if WebP is supported', () => {
      const result = isWebPSupported();
      expect(result).toBe(true);
    });

    it('should return false if canvas is not supported', () => {
      // 模拟canvas不支持的情况
      const originalCreateElement = global.document.createElement;
      global.document.createElement = vi.fn(() => ({
        getContext: vi.fn(() => null)
      }));

      const result = isWebPSupported();
      expect(result).toBe(false);

      // 恢复原始函数
      global.document.createElement = originalCreateElement;
    });

    it('should return false if window is undefined', () => {
      // 模拟window未定义的情况
      const originalWindow = global.window;
      // @ts-ignore
      delete global.window;

      const result = isWebPSupported();
      expect(result).toBe(false);

      // 恢复原始window
      global.window = originalWindow;
    });
  });

  describe('getOptimizedImageUrl', () => {
    it('should return optimized URL with WebP and responsive width', () => {
      const url = 'https://example.com/image.jpg';
      const options = {
        width: 800,
        useWebP: true
      };
      const result = getOptimizedImageUrl(url, options);
      expect(result).toBe('https://example.com/image.webp?w=800');
    });

    it('should return URL without WebP if useWebP is false', () => {
      const url = 'https://example.com/image.jpg';
      const options = {
        width: 800,
        useWebP: false
      };
      const result = getOptimizedImageUrl(url, options);
      expect(result).toBe('https://example.com/image.jpg?w=800');
    });

    it('should return URL without responsive width if width is not provided', () => {
      const url = 'https://example.com/image.jpg';
      const result = getOptimizedImageUrl(url);
      expect(result).toBe('https://example.com/image.webp');
    });

    it('should return empty string if url is empty', () => {
      const result = getOptimizedImageUrl('');
      expect(result).toBe('');
    });
  });

  describe('preloadImages', () => {
    it('should preload multiple images', async () => {
      // 模拟Image对象
      const originalImage = global.Image;
      global.Image = vi.fn(() => ({
        onload: null,
        onerror: null,
        src: ''
      })) as any;

      const urls = ['https://example.com/image1.jpg', 'https://example.com/image2.jpg'];
      const result = await preloadImages(urls);
      expect(result).toEqual([undefined, undefined]);

      // 恢复原始Image
      global.Image = originalImage;
    });

    it('should handle empty urls array', async () => {
      const result = await preloadImages([]);
      expect(result).toEqual([]);
    });
  });
});
