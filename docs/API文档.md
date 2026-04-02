# API 文档

## 1. 通用请求 API

### 1.1 commonRequest

**功能**：发送通用的 POST 请求

**参数**：
- `tradeName`：交易名称，用于构建 API 路径
- `params`：请求参数
- `showLoading`：是否显示加载动画，默认 `true`
- `debounce`：防抖延迟时间（毫秒）
- `throttle`：节流时间间隔（毫秒）
- `cache`：是否使用缓存，默认 `false`
- `cacheExpiry`：缓存过期时间（毫秒）

**返回值**：Promise<ApiResponse<T>>

**示例**：
```typescript
import { commonRequest } from '@/api/request';

const response = await commonRequest({
  tradeName: 'user/login',
  params: { username: 'admin', password: '123456' },
  showLoading: true,
  cache: true,
  cacheExpiry: 5 * 60 * 1000 // 5分钟
});
```

### 1.2 commonRequestDo

**功能**：发送包含文件上传的 POST 请求

**参数**：
- `tradeName`：交易名称，用于构建 API 路径
- `params`：请求参数
- `file`：文件对象或文件数组
- `fileFieldName`：文件字段名，默认 `file`
- `showLoading`：是否显示加载动画，默认 `true`
- `debounce`：防抖延迟时间（毫秒）
- `throttle`：节流时间间隔（毫秒）
- `cache`：是否使用缓存，默认 `false`
- `cacheExpiry`：缓存过期时间（毫秒）

**返回值**：Promise<ApiResponse<T>>

**示例**：
```typescript
import { commonRequestDo } from '@/api/request';

const file = document.querySelector('input[type="file"]').files[0];

const response = await commonRequestDo({
  tradeName: 'upload/image',
  params: { type: 'avatar' },
  file: file,
  fileFieldName: 'image',
  showLoading: true
});
```

## 2. 动态 API

### 2.1 dynamicApi

**功能**：动态构建 API 请求

**方法**：
- `getList`：获取列表数据
- `create`：创建数据
- `update`：更新数据
- `delete`：删除数据
- `getDefaultApiConfig`：获取默认 API 配置

**示例**：
```typescript
import { dynamicApi } from '@/api/dynamicApi';

// 获取列表数据
const listResponse = await dynamicApi.getList(apiConfig, { page: 1, pageSize: 10 });

// 创建数据
const createResponse = await dynamicApi.create(apiConfig, { name: '测试' });

// 更新数据
const updateResponse = await dynamicApi.update(apiConfig, '1', { name: '更新测试' });

// 删除数据
const deleteResponse = await dynamicApi.delete(apiConfig, '1');
```

## 3. 文件上传 API

### 3.1 uploadApi

**功能**：处理文件上传相关操作

**方法**：
- `uploadFile`：上传单个文件
- `uploadFiles`：上传多个文件
- `deleteFile`：删除文件
- `listFiles`：获取文件列表

**示例**：
```typescript
import { uploadApi } from '@/api/uploadApi';

// 上传单个文件
const file = document.querySelector('input[type="file"]').files[0];
const uploadResponse = await uploadApi.uploadFile(file);

// 上传多个文件
const files = document.querySelector('input[type="file"][multiple]').files;
const uploadsResponse = await uploadApi.uploadFiles(Array.from(files));

// 删除文件
await uploadApi.deleteFile('file-id');

// 获取文件列表
const filesResponse = await uploadApi.listFiles({ page: 1, pageSize: 10 });
```

## 4. 菜单 API

### 4.1 menuApi

**功能**：获取菜单配置和菜单数据

**方法**：
- `getMenuConfig`：获取菜单配置
- `getMenuByPath`：根据路径获取菜单
- `getMenuById`：根据 ID 获取菜单

**示例**：
```typescript
import { menuApi } from '@/api/menu';

// 获取菜单配置
const menuConfigResponse = await menuApi.getMenuConfig();

// 根据路径获取菜单
const menuByPathResponse = await menuApi.getMenuByPath('/dashboard');

// 根据 ID 获取菜单
const menuByIdResponse = await menuApi.getMenuById('menu-1');
```
