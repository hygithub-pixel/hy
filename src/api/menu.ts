import { commonRequest } from './request';
import { MenuItem } from '../types/MenuConfig';

export interface MenuListResponse {
  items: MenuItem[];
}

export interface MenuDetailResponse {
  menu: MenuItem;
}

export interface TableDataResponse {
  data: any[];
  pagination: {
    currentPage: number;
    pageSize: number;
    total: number;
  };
}

export const menuApi = {
  getMenuConfig: () => 
    commonRequest<MenuListResponse>({
      tradeName: 'menu/config'
    }),
  
  getMenuByPath: (path: string) => 
    commonRequest<MenuDetailResponse>({
      tradeName: 'menu/detail',
      params: { path }
    }),
  
  getMenuById: (id: string) => 
    commonRequest<MenuDetailResponse>({
      tradeName: `menu/${id}`
    }),
  
  getTableData: (menuId: string, params?: { page?: number; pageSize?: number }) => 
    commonRequest<TableDataResponse>({
      tradeName: `menu/${menuId}/data`,
      params
    }),
  
  createData: (menuId: string, data: any) => 
    commonRequest<{ id: string }>({
      tradeName: `menu/${menuId}/data`,
      params: data
    }),
  
  updateData: (menuId: string, id: string, data: any) => 
    commonRequest<{ success: boolean }>({
      tradeName: `menu/${menuId}/data/update`,
      params: { id, ...data }
    }),
  
  deleteData: (menuId: string, id: string) => 
    commonRequest<{ success: boolean }>({
      tradeName: `menu/${menuId}/data/delete`,
      params: { id }
    })
};
