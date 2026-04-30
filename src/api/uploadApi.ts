import { commonRequest, commonRequestDo } from './request';

interface UploadResponse {
  url: string;
  name: string;
  size: number;
  type: string;
}

export const uploadApi = {
  uploadFile: (file: File, params?: Record<string, any>) => {
    return commonRequestDo<UploadResponse>({
      tradeName: 'upload',
      file,
      params,
    });
  },

  uploadFiles: (files: File[], params?: Record<string, any>) => {
    return commonRequestDo<UploadResponse[]>({
      tradeName: 'upload/batch',
      file: files,
      params,
    });
  },

  deleteFile: (fileUrl: string) => {
    return commonRequest<{ success: boolean }>({
      tradeName: 'upload/delete',
      params: { url: fileUrl },
    });
  },

  getFileList: (params?: { page?: number; pageSize?: number; type?: string }) => {
    return commonRequest<{
      data: UploadResponse[];
      pagination: {
        currentPage: number;
        pageSize: number;
        total: number;
      };
    }>({
      tradeName: 'upload/list',
      params,
    });
  },
};
