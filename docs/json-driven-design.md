# JSON 驱动管理系统设计方案

## 1. 概述

本设计方案实现了一个基于 JSON 配置驱动的通用管理系统，通过声明式配置实现表格、表单、按钮、hooks 的统一管理。

## 2. 设计原则

| 原则 | 说明 |
|------|------|
| **零转换** | `component` 直接对应 Ant Design 组件名，透传所有 props |
| **类型一致** | `rules` 格式与 Ant Design 官方 API 完全一致 |
| **声明式** | 所有配置都是描述"是什么"，不描述"怎么做" |

## 3. 配置结构

### 3.1 目录结构

```
src/
├── config/
│   └── user.json           # 用户模块配置文件
├── components/
│   ├── DynamicRenderer.vue # 动态渲染入口
│   ├── DynamicTable.vue    # 动态表格组件
│   └── DynamicForm.vue     # 动态表单组件
├── composables/
│   ├── useConfigLoader.ts  # 配置加载 hook
│   └── useModuleHooks.ts    # 方法钩子注册
├── views/
│   └── ModulePage.vue       # 通用模块页面
└── main.ts
```

### 3.2 JSON Schema

```json
{
  "module": "user",
  "title": "用户管理",
  "description": "对系统中用户进行管理，包括新增、编辑、删除、查看等操作",
  
  "apis": {
    "list": { "path": "/api/users", "method": "GET" },
    "create": { "path": "/api/users", "method": "POST" },
    "update": { "path": "/api/users/{id}", "method": "PUT" },
    "delete": { "path": "/api/users/{id}", "method": "DELETE" }
  },

  "hooks": {
    "beforeLoad": "transformDateRange",
    "afterSubmit": "refreshList"
  },

  "columns": [
    { "dataIndex": "username", "title": "用户名", "width": 150 },
    { "dataIndex": "status", "title": "状态", "width": 80 }
  ],

  "fields": [
    {
      "group": "基本信息",
      "items": [
        { 
          "component": "a-input",
          "label": "用户名",
          "name": "username",
          "required": true,
          "placeholder": "请输入用户名",
          "rules": [
            { "required": true, "message": "请输入用户名" }
          ]
        },
        { 
          "component": "a-input",
          "label": "邮箱",
          "name": "email",
          "rules": [
            { "type": "email", "message": "邮箱格式不正确" }
          ]
        },
        { 
          "component": "a-select",
          "label": "状态",
          "name": "status",
          "options": [
            { "label": "启用", "value": 1 },
            { "label": "禁用", "value": 0 }
          ]
        }
      ]
    }
  ],

  "buttons": {
    "toolbar": [
      { "component": "a-button", "type": "primary", "text": "新增", "action": "create" },
      { "component": "a-button", "text": "导出", "action": "export" }
    ],
    "rowActions": [
      { "component": "a-button", "text": "编辑", "action": "edit" },
      { "component": "a-button", "text": "删除", "action": "delete", "danger": true }
    ]
  },

  "search": {
    "fields": [
      { "component": "a-input", "name": "username", "placeholder": "请输入用户名" },
      { "component": "a-range-picker", "name": "dateRange" }
    ]
  }
}
```

## 4. 配置说明

### 4.1 模块基础信息

| 字段 | 类型 | 说明 |
|------|------|------|
| module | string | 模块标识 |
| title | string | 页面标题 |
| description | string | 页面描述 |

### 4.2 API 配置 (apis)

定义模块的 CRUD 接口：

```typescript
{
  apis: {
    list: { path: string, method: 'GET' },
    create: { path: string, method: 'POST' },
    update: { path: string, method: 'PUT' },
    delete: { path: string, method: 'DELETE' }
  }
}
```

### 4.3 Hooks 配置 (hooks)

定义生命周期钩子方法：

```typescript
{
  hooks: {
    beforeLoad: string,   // 加载前
    afterSubmit: string,   // 提交后
    onError: string       // 错误处理
  }
}
```

### 4.4 表格列配置 (columns)

直接对应 Ant Design Table 的 columns API：

```typescript
{
  columns: Array<{
    dataIndex: string,
    title: string,
    width?: number,
    customRender?: string  // 引用 hooks 中的渲染方法
  }>
}
```

### 4.5 表单字段配置 (fields)

直接对应 Ant Design Form Item：

```typescript
{
  fields: Array<{
    group: string,
    items: Array<{
      component: string,    // 组件名，如 'a-input'
      name: string,         // 字段名
      label?: string,
      rules?: AntDesignRule[],  // 直接使用 Ant Design rules 格式
      required?: boolean,
      options?: Array<{ label, value }>  // select/radio/checkbox 选项
    }>
  }>
}
```

### 4.6 按钮配置 (buttons)

```typescript
{
  buttons: {
    toolbar: Array<{
      component: string,
      action: string,      // 触发的动作
      text?: string,
      type?: string
    }>,
    rowActions: Array<{
      component: string,
      action: string,
      text?: string,
      danger?: boolean
    }>
  }
}
```

### 4.7 搜索配置 (search)

```typescript
{
  search: {
    fields: Array<FieldConfig>  // 同 fields 配置
  }
}
```

## 5. 核心实现

### 5.1 零转换原则

组件直接读取 JSON 配置，无需适配层：

```vue
<template>
  <!-- columns 直接透传给 a-table -->
  <a-table :columns="config.columns" :data-source="tableData" />
  
  <!-- fields 中的 component 直接动态渲染 -->
  <component 
    v-for="field in fieldItems"
    :key="field.name"
    :is="field.component"
    v-model="formData[field.name]"
    v-bind="omit(field, ['component', 'name', 'label', 'rules'])"
    :rules="field.rules"
  />
</template>
```

### 5.2 Hooks 调用机制

```typescript
// src/composables/useModuleHooks.ts
const hooks = {
  transformDateRange: (params: any) => {
    if (params.dateRange) {
      params.startDate = params.dateRange[0];
      params.endDate = params.dateRange[1];
      delete params.dateRange;
    }
    return params;
  },
  refreshList: () => { /* 刷新逻辑 */ }
};

const executeHook = (hookName: string, params?: any) => {
  const fn = hooks[hookName];
  return fn ? fn(params) : params;
};
```

## 6. 优势

1. **配置与 UI 一致**：JSON Schema 与 Ant Design API 完全对应
2. **易于维护**：只需修改 JSON 文件即可调整页面
3. **可扩展**：支持自定义组件和 hooks
4. **类型安全**：完整的 TypeScript 类型定义
5. **零学习成本**：熟悉 Ant Design 即可上手

## 7. 示例

用户管理模块完整配置见 `src/config/user.json`
