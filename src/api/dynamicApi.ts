import { commonRequest } from './request';
import { ApiConfig } from '../types/MenuConfig';

export interface TableDataResponse {
  data: any[];
  pagination: {
    currentPage: number;
    pageSize: number;
    total: number;
  };
}

export interface CreateDataResponse {
  id: string;
}

export interface UpdateDataResponse {
  success: boolean;
}

export interface DeleteDataResponse {
  success: boolean;
}

const getTradeNameFromUrl = (url: string): string => {
  // 移除开头的斜杠
  return url.replace(/^\//, '');
};

export const dynamicApi = {
  getList: (apiConfig: ApiConfig, params?: { page?: number; pageSize?: number }) => {
    const url = apiConfig.list || '';
    const tradeName = getTradeNameFromUrl(url);
    return commonRequest<TableDataResponse>({
      tradeName,
      params
    });
  },

  create: (apiConfig: ApiConfig, data: any) => {
    const url = apiConfig.create || '';
    const tradeName = getTradeNameFromUrl(url);
    return commonRequest<CreateDataResponse>({
      tradeName,
      params: data
    });
  },

  update: (apiConfig: ApiConfig, id: string, data: any) => {
    const url = apiConfig.update || '';
    const tradeName = getTradeNameFromUrl(url).replace('/:id', '/update');
    return commonRequest<UpdateDataResponse>({
      tradeName,
      params: { id, ...data }
    });
  },

  delete: (apiConfig: ApiConfig, id: string) => {
    const url = apiConfig.delete || '';
    const tradeName = getTradeNameFromUrl(url).replace('/:id', '/delete');
    return commonRequest<DeleteDataResponse>({
      tradeName,
      params: { id }
    });
  },

  getDefaultApiConfig: (menuId: string): ApiConfig => ({
    list: `/menu/${menuId}/data`,
    create: `/menu/${menuId}/data`,
    update: `/menu/${menuId}/data`,
    delete: `/menu/${menuId}/data`
  })
};
