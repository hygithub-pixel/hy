import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ErrorHandler, withErrorHandling, setupGlobalErrorHandler } from '@/utils/errorHandler';

vi.mock('@/utils/message', () => ({
  showMessage: {
    error: vi.fn(),
    success: vi.fn(),
    warning: vi.fn(),
    info: vi.fn(),
  },
}));

describe('errorHandler', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('ErrorHandler.normalizeError', () => {
    it('should normalize Error instance', () => {
      const error = new Error('Test error');
      const result = ErrorHandler['normalizeError'](error);
      expect(result.message).toBe('Test error');
      expect(result.stack).toBeDefined();
    });

    it('should normalize string error', () => {
      const result = ErrorHandler['normalizeError']('String error');
      expect(result.message).toBe('String error');
    });

    it('should normalize object error', () => {
      const error = { code: 'ERR001', message: 'Object error', data: { key: 'value' } };
      const result = ErrorHandler['normalizeError'](error);
      expect(result.code).toBe('ERR001');
      expect(result.message).toBe('Object error');
      expect(result.data).toEqual({ key: 'value' });
    });
  });

  describe('ErrorHandler.handle', () => {
    it('should handle error and return AppError', () => {
      const error = new Error('Test error');
      const result = ErrorHandler.handle(error, { showMessage: false });
      expect(result.message).toBe('Test error');
    });

    it('should handle error with fallback', () => {
      const error = new Error('Test error');
      const fallback = vi.fn();
      ErrorHandler.handle(error, { showMessage: false, fallback });
      expect(fallback).toHaveBeenCalled();
    });
  });

  describe('ErrorHandler.handleApiError', () => {
    it('should handle response error with status code', () => {
      const error = {
        response: {
          status: 404,
          data: {
            message: '自定义错误消息',
          },
        },
      };

      const result = ErrorHandler.handleApiError(error, { showMessage: false });
      expect(result.code).toBe('404');
      expect(result.message).toBe('自定义错误消息');
    });

    it('should handle response error without custom message', () => {
      const error = {
        response: {
          status: 404,
          data: {},
        },
      };

      const result = ErrorHandler.handleApiError(error, { showMessage: false });
      expect(result.code).toBe('404');
      expect(result.message).toBe('请求失败 (404)');
    });

    it('should handle request error', () => {
      const error = {
        request: {},
      };

      const result = ErrorHandler.handleApiError(error, { showMessage: false });
      expect(result.message).toBe('服务器无响应，请稍后重试');
    });

    it('should handle other errors', () => {
      const error = {
        message: '其他错误',
      };

      const result = ErrorHandler.handleApiError(error, { showMessage: false });
      expect(result.message).toBe('其他错误');
    });

    it('should handle cancel error', () => {
      const error = {
        __CANCEL__: true,
        message: '请求被取消',
      };

      const result = ErrorHandler.handleApiError(error, { showMessage: false });
      expect(result.code).toBe('ERR_CANCELED');
    });
  });

  describe('ErrorHandler.handleValidationError', () => {
    it('should handle validation errors', () => {
      const errors = {
        field1: ['错误1', '错误2'],
        field2: ['错误3'],
      };

      const result = ErrorHandler.handleValidationError(errors, { showMessage: false });
      expect(result.message).toBe('错误1');
      expect(result.data).toEqual(errors);
    });
  });

  describe('withErrorHandling', async () => {
    it('should return result on success', async () => {
      const fn = vi.fn().mockResolvedValue('success');
      const result = await withErrorHandling(fn, { showMessage: false });
      expect(result).toBe('success');
    });

    it('should return null on error', async () => {
      const fn = vi.fn().mockRejectedValue(new Error('Test error'));
      const result = await withErrorHandling(fn, { showMessage: false });
      expect(result).toBeNull();
    });
  });

  describe('setupGlobalErrorHandler', () => {
    it('should setup global error handlers', () => {
      const addEventListenerSpy = vi.spyOn(window, 'addEventListener');
      setupGlobalErrorHandler();
      expect(addEventListenerSpy).toHaveBeenCalledWith('unhandledrejection', expect.any(Function));
      expect(addEventListenerSpy).toHaveBeenCalledWith('error', expect.any(Function));
      addEventListenerSpy.mockRestore();
    });
  });
});
