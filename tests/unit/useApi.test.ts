import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { useApi } from '../../src/composables/useApi';
import { apiService } from '../../src/services/apiService';
import { notificationService } from '../../src/services/notificationService';

// Mock services
vi.mock('../../src/services/apiService');
vi.mock('../../src/services/notificationService');

const mockApiService = apiService as jest.Mocked<typeof apiService>;
const mockNotificationService = notificationService as jest.Mocked<typeof notificationService>;

describe('useApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should initialize with default values', () => {
    const { loading, error, data } = useApi();
    
    expect(loading.value).toBe(false);
    expect(error.value).toBeNull();
    expect(data.value).toBeNull();
  });

  it('should make successful post request', async () => {
    const mockResponse = {
      code: 0,
      data: { id: 1, name: 'Test' },
      message: 'Success'
    };
    
    mockApiService.post.mockResolvedValue(mockResponse);
    mockNotificationService.success.mockImplementation(() => {});

    const { loading, error, data, post } = useApi({ showSuccess: true });
    
    const result = await post('test/api', { name: 'Test' });
    
    expect(loading.value).toBe(false);
    expect(error.value).toBeNull();
    expect(data.value).toEqual({ id: 1, name: 'Test' });
    expect(result).toEqual({ id: 1, name: 'Test' });
    expect(mockApiService.post).toHaveBeenCalledWith('test/api', { name: 'Test' });
    expect(mockNotificationService.success).toHaveBeenCalledWith('操作成功');
  });

  it('should make successful get request', async () => {
    const mockResponse = {
      code: 0,
      data: { id: 1, name: 'Test' },
      message: 'Success'
    };
    
    mockApiService.get.mockResolvedValue(mockResponse);

    const { loading, error, data, get } = useApi();
    
    const result = await get('test/api', { id: 1 });
    
    expect(loading.value).toBe(false);
    expect(error.value).toBeNull();
    expect(data.value).toEqual({ id: 1, name: 'Test' });
    expect(result).toEqual({ id: 1, name: 'Test' });
    expect(mockApiService.get).toHaveBeenCalledWith('test/api', { id: 1 });
  });

  it('should handle business error', async () => {
    const mockResponse = {
      code: 1,
      data: null,
      message: 'Business error'
    };
    
    mockApiService.post.mockResolvedValue(mockResponse);
    mockNotificationService.error.mockImplementation(() => {});

    const { loading, error, data, post } = useApi();
    
    const result = await post('test/api', { name: 'Test' });
    
    expect(loading.value).toBe(false);
    expect(error.value).toBe('Business error');
    expect(data.value).toBeNull();
    expect(result).toBeNull();
    expect(mockNotificationService.error).toHaveBeenCalledWith('Business error');
  });

  it('should handle network error', async () => {
    mockApiService.post.mockRejectedValue(new Error('Network error'));
    mockNotificationService.error.mockImplementation(() => {});

    const { loading, error, data, post } = useApi();
    
    const result = await post('test/api', { name: 'Test' });
    
    expect(loading.value).toBe(false);
    expect(error.value).toBe('操作失败');
    expect(data.value).toBeNull();
    expect(result).toBeNull();
    expect(mockNotificationService.error).toHaveBeenCalledWith('操作失败');
  });

  it('should use custom success message', async () => {
    const mockResponse = {
      code: 0,
      data: { id: 1 },
      message: 'Success'
    };
    
    mockApiService.post.mockResolvedValue(mockResponse);
    mockNotificationService.success.mockImplementation(() => {});

    const { post } = useApi({ 
      showSuccess: true, 
      successMessage: 'Custom success'
    });
    
    await post('test/api', {});
    
    expect(mockNotificationService.success).toHaveBeenCalledWith('Custom success');
  });

  it('should use custom error message', async () => {
    const mockResponse = {
      code: 1,
      data: null,
      message: ''
    };
    
    mockApiService.post.mockResolvedValue(mockResponse);
    mockNotificationService.error.mockImplementation(() => {});

    const { post } = useApi({ 
      errorMessage: 'Custom error'
    });
    
    await post('test/api', {});
    
    expect(mockNotificationService.error).toHaveBeenCalledWith('Custom error');
  });

  it('should not show success notification when showSuccess is false', async () => {
    const mockResponse = {
      code: 0,
      data: { id: 1 },
      message: 'Success'
    };
    
    mockApiService.post.mockResolvedValue(mockResponse);
    mockNotificationService.success.mockImplementation(() => {});

    const { post } = useApi({ showSuccess: false });
    
    await post('test/api', {});
    
    expect(mockNotificationService.success).not.toHaveBeenCalled();
  });

  it('should not show error notification when showError is false', async () => {
    const mockResponse = {
      code: 1,
      data: null,
      message: 'Error'
    };
    
    mockApiService.post.mockResolvedValue(mockResponse);
    mockNotificationService.error.mockImplementation(() => {});

    const { post } = useApi({ showError: false });
    
    await post('test/api', {});
    
    expect(mockNotificationService.error).not.toHaveBeenCalled();
  });

  it('should reset state', () => {
    const { loading, error, data, reset } = useApi();
    
    // Set some values
    loading.value = true;
    error.value = 'Some error';
    (data as any).value = { id: 1 };
    
    // Reset
    reset();
    
    expect(loading.value).toBe(false);
    expect(error.value).toBeNull();
    expect(data.value).toBeNull();
  });

  it('should handle generic request method', async () => {
    const mockResponse = {
      code: 0,
      data: { id: 1 },
      message: 'Success'
    };
    
    mockApiService.get.mockResolvedValue(mockResponse);

    const { request } = useApi();
    
    const result = await request('test/api', { id: 1 }, 'get');
    
    expect(result).toEqual({ id: 1 });
    expect(mockApiService.get).toHaveBeenCalledWith('test/api', { id: 1 });
  });
});
