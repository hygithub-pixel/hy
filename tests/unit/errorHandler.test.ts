import { describe, it, expect, vi, beforeEach } from 'vitest';
import { handleApiError, getErrorMessageByStatus, showError, showSuccess, showWarning, showInfo, handleError } from '@/utils/errorHandler';
import { ElMessage, ElNotification } from 'element-plus';

// 模拟Element Plus的消息组件
vi.mock('element-plus', () => ({
  ElMessage: {
    error: vi.fn(),
    success: vi.fn(),
    warning: vi.fn(),
    info: vi.fn()
  },
  ElNotification: {
    error: vi.fn(),
    success: vi.fn(),
    warning: vi.fn(),
    info: vi.fn()
  }
}));

describe('errorHandler', () => {
  beforeEach(() => {
    // 清空所有模拟函数的调用记录
    vi.clearAllMocks();
  });

  describe('getErrorMessageByStatus', () => {
    it('should return correct error message for status 404', () => {
      const message = getErrorMessageByStatus(404);
      expect(message).toBe('请求地址不存在');
    });

    it('should return correct error message for status 500', () => {
      const message = getErrorMessageByStatus(500);
      expect(message).toBe('服务器内部错误');
    });

    it('should return default message for unknown status', () => {
      const message = getErrorMessageByStatus(999);
      expect(message).toBe('未知错误 (999)');
    });
  });

  describe('handleApiError', () => {
    it('should handle response error with status code', () => {
      const error = {
        response: {
          status: 404,
          data: {
            message: '自定义错误消息'
          }
        }
      };

      const result = handleApiError(error);
      expect(result.code).toBe(404);
      expect(result.message).toBe('自定义错误消息');
    });

    it('should handle response error without custom message', () => {
      const error = {
        response: {
          status: 404,
          data: {}
        }
      };

      const result = handleApiError(error);
      expect(result.code).toBe(404);
      expect(result.message).toBe('请求地址不存在');
    });

    it('should handle request error', () => {
      const error = {
        request: {}
      };

      const result = handleApiError(error);
      expect(result.code).toBe(0);
      expect(result.message).toBe('网络错误，服务器无响应');
    });

    it('should handle other errors', () => {
      const error = {
        message: '其他错误'
      };

      const result = handleApiError(error);
      expect(result.code).toBe(0);
      expect(result.message).toBe('其他错误');
    });
  });

  describe('showError', () => {
    it('should show error message', () => {
      showError('测试错误消息');
      expect(ElMessage.error).toHaveBeenCalledWith({
        message: '测试错误消息',
        duration: 3000,
        showClose: true
      });
    });

    it('should show error notification', () => {
      showError('测试错误消息', {
        type: 'notification'
      });
      expect(ElNotification.error).toHaveBeenCalledWith({
        title: '错误',
        message: '测试错误消息',
        duration: 3000,
        showClose: true
      });
    });
  });

  describe('showSuccess', () => {
    it('should show success message', () => {
      showSuccess('测试成功消息');
      expect(ElMessage.success).toHaveBeenCalledWith({
        message: '测试成功消息',
        duration: 3000,
        showClose: true
      });
    });
  });

  describe('showWarning', () => {
    it('should show warning message', () => {
      showWarning('测试警告消息');
      expect(ElMessage.warning).toHaveBeenCalledWith({
        message: '测试警告消息',
        duration: 3000,
        showClose: true
      });
    });
  });

  describe('showInfo', () => {
    it('should show info message', () => {
      showInfo('测试信息消息');
      expect(ElMessage.info).toHaveBeenCalledWith({
        message: '测试信息消息',
        duration: 3000,
        showClose: true
      });
    });
  });

  describe('handleError', () => {
    it('should handle error and show message', () => {
      const error = {
        response: {
          status: 404,
          data: {}
        }
      };

      const result = handleError(error);
      expect(result.code).toBe(404);
      expect(result.message).toBe('请求地址不存在');
      expect(ElMessage.error).toHaveBeenCalled();
    });

    it('should handle error without showing message', () => {
      const error = {
        response: {
          status: 404,
          data: {}
        }
      };

      const result = handleError(error, {
        showError: false
      });
      expect(result.code).toBe(404);
      expect(result.message).toBe('请求地址不存在');
      expect(ElMessage.error).not.toHaveBeenCalled();
    });
  });
});
