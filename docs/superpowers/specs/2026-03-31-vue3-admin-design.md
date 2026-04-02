# Vue 3 + Vite + TypeScript + Element Plus 管理系统设计文档

## 1. 项目概述

本项目是一个基于 Vite + Vue 3 + TypeScript + Element Plus 的管理系统，主要功能为管理多个菜单，每个菜单包含增删改查操作。系统将表单和表格抽离为可复用组件，通过 JSON 格式数据配置即可渲染表单和列表。

## 2. 技术栈

- **前端框架**：Vue 3
- **构建工具**：Vite
- **编程语言**：TypeScript
- **UI 库**：Element Plus
- **状态管理**：Pinia
- **路由管理**：Vue Router

## 3. 系统架构

### 3.1 目录结构

```
src/
├── assets/            # 静态资源
├── components/        # 组件
│   ├── BaseForm/      # 基础表单组件
│   ├── BaseTable/     # 基础表格组件
│   └── layout/        # 布局组件
├── views/             # 页面
│   └── menus/         # 菜单页面
├── router/            # 路由配置
├── store/             # 状态管理
├── types/             # 类型定义
├── utils/             # 工具函数
├── api/               # API 接口
├── App.vue            # 根组件
└── main.ts            # 入口文件
```

### 3.2 核心组件

#### 3.2.1 BaseForm 组件

- **功能**：根据 JSON 配置动态生成表单
- **特性**：
  - 支持多种表单控件类型（输入框、选择器、日期选择器、富文本编辑器、图片上传等）
  - 支持富文本编辑（使用 Tinymce 或 Quill 等编辑器）
  - 支持单张/多张图片上传
  - 支持表单验证
  - 支持表单联动（链式渲染，一个字段控制另一个字段的显示/隐藏）
  - 隐藏字段值自动过滤，不包含在请求参数中
  - 支持自定义表单控件

#### 3.2.2 BaseTable 组件

- **功能**：根据 JSON 配置动态生成表格
- **特性**：
  - 支持表格列配置
  - 支持分页
  - 支持排序
  - 支持筛选
  - 支持图片展示（缩略图 + 点击放大预览）
  - 支持富文本展示（HTML 渲染，支持摘要显示）
  - 支持行操作（编辑、删除）

### 3.3 状态管理

使用 Pinia 管理应用状态，主要包括：
- 菜单列表状态
- 表单数据状态
- 表格数据状态
- 加载状态

### 3.4 路由设计

- 采用嵌套路由结构
- 菜单路由动态生成
- 支持权限控制

## 4. 数据结构设计

### 4.1 菜单配置结构

```typescript
interface MenuConfig {
  id: string;            // 菜单ID
  name: string;          // 菜单名称
  path: string;          // 菜单路径
  component: string;     // 组件路径
  icon?: string;         // 菜单图标
  formConfig: FormConfig; // 表单配置
  tableConfig: TableConfig; // 表格配置
}
```

### 4.2 表单配置结构

```typescript
interface FormConfig {
  fields: FormField[];   // 表单字段
  rules?: FormRule[];    // 表单验证规则
  layout?: 'horizontal' | 'vertical'; // 表单布局
}

interface FormField {
  name: string;          // 字段名称
  label: string;         // 字段标签
  type: string;          // 字段类型（input、select、date、rich-text、image-upload等）
  defaultValue?: any;    // 默认值
  options?: Option[];    // 选择器选项
  props?: Record<string, any>; // 字段属性
  rules?: FormRule[];    // 字段验证规则
  dependencies?: string[]; // 依赖字段
  visible?: boolean | ((formData: any) => boolean); // 可见性
  showWhen?: ShowWhenCondition; // 条件渲染（更灵活的链式控制）
  // 富文本编辑器配置
  richTextConfig?: {
    height?: number;     // 编辑器高度
    toolbar?: string[];  // 工具栏按钮配置
    placeholder?: string; // 占位符
    contentStyle?: string; // 内容样式
  };
  // 图片上传配置
  imageConfig?: {
    multiple?: boolean;   // 是否支持多张图片
    limit?: number;       // 最大上传数量
    maxSize?: number;     // 单张图片最大大小（字节）
    accept?: string;      // 接受的文件类型
    listType?: 'text' | 'picture' | 'picture-card'; // 列表类型
  };
}

interface ShowWhenCondition {
  field: string;         // 依赖的字段名
  operator: 'eq' | 'ne' | 'gt' | 'lt' | 'gte' | 'lte' | 'includes' | 'notIncludes' | 'in' | 'notIn';
  value: any;            // 比较的值
  children?: ShowWhenCondition[]; // 子条件（支持 && 逻辑）
  relation?: 'and' | 'or'; // 条件关系，默认为 'and'
}

interface Option {
  label: string;         // 选项标签
  value: any;            // 选项值
}

interface FormRule {
  required?: boolean;    // 是否必填
  message?: string;      // 错误信息
  trigger?: 'blur' | 'change'; // 触发方式
  validator?: (rule: any, value: any, callback: any) => void; // 自定义验证
}

// 表单数据处理工具类型
interface FormSubmitParams {
  // 过滤掉隐藏字段后的表单数据
  getVisibleFields(): Record<string, any>;
  // 获取所有表单数据（包括隐藏字段）
  getAllFields(): Record<string, any>;
}
```

### 4.3 表格配置结构

```typescript
interface TableConfig {
  columns: TableColumn[]; // 表格列
  pagination?: boolean;   // 是否显示分页
  actions?: TableAction[]; // 操作按钮
  sortable?: boolean;     // 是否支持排序
  filterable?: boolean;   // 是否支持筛选
}

interface TableColumn {
  prop: string;          // 字段名
  label: string;         // 列标签
  width?: string | number; // 列宽度
  sortable?: boolean;    // 是否支持排序
  formatter?: (row: any, column: any, cellValue: any) => any; // 格式化函数
  align?: 'left' | 'center' | 'right'; // 对齐方式
  // 列类型配置
  type?: 'default' | 'image' | 'rich-text' | 'tag' | 'date';
  // 图片列配置
  imageConfig?: {
    width?: number | string;  // 图片宽度
    height?: number | string; // 图片高度
    fit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down'; // 图片填充方式
    preview?: boolean;        // 是否支持点击放大预览
    placeholder?: string;     // 占位图
  };
  // 富文本列配置
  richTextConfig?: {
    showSummary?: boolean;   // 是否显示摘要
    summaryLength?: number;  // 摘要长度
    showExpand?: boolean;    // 是否显示展开/收起按钮
  };
}

interface TableAction {
  name: string;          // 操作名称
  type: 'edit' | 'delete' | 'custom'; // 操作类型
  label: string;         // 操作标签
  icon?: string;         // 操作图标
  handler?: (row: any) => void; // 操作处理函数
}
```

## 5. 实现细节

### 5.1 动态菜单生成

- 通过 API 获取菜单配置
- 根据菜单配置动态生成路由
- 渲染侧边栏菜单

### 5.2 表单组件实现

- 接收 formConfig 作为 props
- 根据配置动态生成表单控件
- 处理表单验证和提交
- 支持表单数据的双向绑定
- **表单联动（链式渲染）**：
  - 实现 `showWhen` 条件判断逻辑
  - 监听依赖字段值变化，动态更新字段可见性
  - 支持复杂条件组合（&&、|| 逻辑）
- **参数过滤**：
  - 表单提交时，自动过滤隐藏字段的值
  - 仅将可见字段数据包含在请求参数中
  - 提供 `getVisibleFields()` 和 `getAllFields()` 方法

### 5.3 表格组件实现

- 接收 tableConfig 作为 props
- 根据配置动态生成表格列
- 处理表格数据的加载和分页
- 支持行操作的事件触发

### 5.4 增删改查操作

- **新增**：打开表单模态框，填写表单后提交
- **修改**：打开表单模态框，预填数据后修改提交
- **删除**：打开确认对话框，确认后删除
- **查询**：表格支持分页和筛选

## 6. 示例配置

### 6.1 菜单配置示例（含表单联动）

```json
{
  "id": "user",
  "name": "用户管理",
  "path": "/user",
  "component": "User.vue",
  "icon": "User",
  "formConfig": {
    "fields": [
      {
        "name": "name",
        "label": "用户名",
        "type": "input",
        "rules": [
          { "required": true, "message": "请输入用户名", "trigger": "blur" }
        ]
      },
      {
        "name": "userType",
        "label": "用户类型",
        "type": "select",
        "options": [
          { "label": "普通用户", "value": "normal" },
          { "label": "VIP用户", "value": "vip" },
          { "label": "管理员", "value": "admin" }
        ],
        "rules": [
          { "required": true, "message": "请选择用户类型", "trigger": "change" }
        ]
      },
      {
        "name": "vipLevel",
        "label": "VIP等级",
        "type": "select",
        "options": [
          { "label": "黄金会员", "value": "gold" },
          { "label": "白金会员", "value": "platinum" },
          { "label": "钻石会员", "value": "diamond" }
        ],
        "showWhen": {
          "field": "userType",
          "operator": "eq",
          "value": "vip"
        }
      },
      {
        "name": "adminPermissions",
        "label": "管理员权限",
        "type": "checkbox-group",
        "options": [
          { "label": "用户管理", "value": "userManage" },
          { "label": "角色管理", "value": "roleManage" },
          { "label": "系统配置", "value": "systemConfig" }
        ],
        "showWhen": {
          "field": "userType",
          "operator": "eq",
          "value": "admin"
        }
      },
      {
        "name": "age",
        "label": "年龄",
        "type": "input-number",
        "props": {
          "min": 0,
          "max": 150
        },
        "showWhen": {
          "field": "userType",
          "operator": "in",
          "value": ["normal", "vip"]
        }
      },
      {
        "name": "gender",
        "label": "性别",
        "type": "select",
        "options": [
          { "label": "男", "value": "male" },
          { "label": "女", "value": "female" }
        ]
      },
      {
        "name": "emergencyContact",
        "label": "紧急联系人",
        "type": "input",
        "showWhen": {
          "relation": "and",
          "children": [
            {
              "field": "age",
              "operator": "gt",
              "value": 60
            },
            {
              "field": "userType",
              "operator": "ne",
              "value": "admin"
            }
          ]
        }
      },
      {
        "name": "avatar",
        "label": "用户头像",
        "type": "image-upload",
        "imageConfig": {
          "multiple": false,
          "limit": 1,
          "maxSize": 2097152,
          "accept": "image/jpeg,image/png,image/gif",
          "listType": "picture-card"
        }
      },
      {
        "name": "description",
        "label": "个人简介",
        "type": "rich-text",
        "richTextConfig": {
          "height": 300,
          "toolbar": [
            "bold", "italic", "underline", "strikeThrough",
            "|", "undo", "redo",
            "|", "formatBlock", "fontSize", "fontColor", "backColor",
            "|", "justifyLeft", "justifyCenter", "justifyRight",
            "|", "bullist", "numlist", "outdent", "indent",
            "|", "link", "unlink", "image", "code", "blockquote"
          ],
          "placeholder": "请输入个人简介..."
        }
      }
    ]
  },
  "tableConfig": {
    "columns": [
      {
        "prop": "avatar",
        "label": "头像",
        "type": "image",
        "width": 80,
        "align": "center",
        "imageConfig": {
          "width": 48,
          "height": 48,
          "fit": "cover",
          "preview": true
        }
      },
      {
        "prop": "name",
        "label": "用户名"
      },
      {
        "prop": "userType",
        "label": "用户类型",
        "formatter": (row) => {
          const map = { normal: '普通用户', vip: 'VIP用户', admin: '管理员' };
          return map[row.userType] || row.userType;
        }
      },
      {
        "prop": "age",
        "label": "年龄"
      },
      {
        "prop": "gender",
        "label": "性别",
        "formatter": (row) => row.gender === 'male' ? '男' : '女'
      },
      {
        "prop": "description",
        "label": "个人简介",
        "type": "rich-text",
        "width": 300,
        "richTextConfig": {
          "showSummary": true,
          "summaryLength": 50,
          "showExpand": true
        }
      },
      {
        "prop": "action",
        "label": "操作",
        "width": 150,
        "fixed": "right"
      }
    ],
    "actions": [
      {
        "name": "edit",
        "type": "edit",
        "label": "编辑",
        "icon": "Edit"
      },
      {
        "name": "delete",
        "type": "delete",
        "label": "删除",
        "icon": "Delete"
      }
    ]
  }
}
```

### 6.2 表单联动说明

#### 示例场景说明：
1. **VIP等级**：仅当用户类型选择"VIP用户"时显示
2. **管理员权限**：仅当用户类型选择"管理员"时显示
3. **年龄**：仅当用户类型选择"普通用户"或"VIP用户"时显示
4. **紧急联系人**：仅当年龄 > 60 且用户类型不为"管理员"时显示

#### 参数过滤逻辑：
- 提交表单时，自动判断字段可见性
- 隐藏字段（如 userType=normal 时的 vipLevel）不会包含在请求参数中
- 开发者可通过 `getVisibleFields()` 获取过滤后的数据，`getAllFields()` 获取完整数据

## 7. 表单联动与参数过滤实现

### 7.1 条件判断引擎

实现通用的条件判断函数，支持多种操作符：

```typescript
// 工具函数：判断字段是否可见
function evaluateCondition(condition: ShowWhenCondition, formData: Record<string, any>): boolean {
  const { field, operator, value, children, relation = 'and' } = condition;
  
  // 如果有子条件，递归判断
  if (children && children.length > 0) {
    const results = children.map(child => evaluateCondition(child, formData));
    return relation === 'and' 
      ? results.every(res => res) 
      : results.some(res => res);
  }
  
  // 单条件判断
  const currentValue = formData[field];
  
  switch (operator) {
    case 'eq':
      return currentValue === value;
    case 'ne':
      return currentValue !== value;
    case 'gt':
      return currentValue > value;
    case 'lt':
      return currentValue < value;
    case 'gte':
      return currentValue >= value;
    case 'lte':
      return currentValue <= value;
    case 'includes':
      return Array.isArray(currentValue) && currentValue.includes(value);
    case 'notIncludes':
      return Array.isArray(currentValue) && !currentValue.includes(value);
    case 'in':
      return Array.isArray(value) && value.includes(currentValue);
    case 'notIn':
      return Array.isArray(value) && !value.includes(currentValue);
    default:
      return true;
  }
}

// 判断字段是否可见
function isFieldVisible(field: FormField, formData: Record<string, any>): boolean {
  // 优先使用 showWhen 条件
  if (field.showWhen) {
    return evaluateCondition(field.showWhen, formData);
  }
  // 其次使用 visible 配置
  if (typeof field.visible === 'function') {
    return field.visible(formData);
  }
  // 默认显示
  return field.visible !== false;
}
```

### 7.2 链式渲染实现

表单组件使用 watchEffect 监听表单数据变化，动态更新字段可见性：

```typescript
// 响应式可见性状态
const visibleFields = ref<Set<string>>(new Set());

// 监听表单数据变化，更新可见性
watchEffect(() => {
  const newVisibleFields = new Set<string>();
  formConfig.fields.forEach(field => {
    if (isFieldVisible(field, formData)) {
      newVisibleFields.add(field.name);
    }
  });
  visibleFields.value = newVisibleFields;
});

// 模板中根据可见性渲染
<template>
  <el-form :model="formData" :rules="formRules" ref="formRef">
    <template v-for="field in formConfig.fields" :key="field.name">
      <el-form-item
        v-if="visibleFields.has(field.name)"
        :label="field.label"
        :prop="field.name"
      >
        <!-- 根据字段类型渲染不同的控件 -->
        <FormFieldRenderer :field="field" v-model="formData[field.name]" />
      </el-form-item>
    </template>
  </el-form>
</template>
```

### 7.3 参数过滤实现

表单提交时，自动过滤隐藏字段：

```typescript
// 获取可见字段的数据
function getVisibleFields(): Record<string, any> {
  const result: Record<string, any> = {};
  formConfig.fields.forEach(field => {
    if (isFieldVisible(field, formData) && formData[field.name] !== undefined) {
      result[field.name] = formData[field.name];
    }
  });
  return result;
}

// 获取所有字段的数据（包括隐藏字段）
function getAllFields(): Record<string, any> {
  return { ...formData };
}

// 表单提交方法
async function handleSubmit() {
  try {
    await formRef.value?.validate();
    // 只提交可见字段
    const params = getVisibleFields();
    await api.submit(params);
    ElMessage.success('提交成功');
  } catch (error) {
    console.error('提交失败:', error);
  }
}
```

### 7.4 支持的操作符说明

| 操作符 | 说明 | 示例 |
|--------|------|------|
| `eq` | 等于 | `{ field: 'type', operator: 'eq', value: 'vip' }` |
| `ne` | 不等于 | `{ field: 'type', operator: 'ne', value: 'admin' }` |
| `gt` | 大于 | `{ field: 'age', operator: 'gt', value: 18 }` |
| `lt` | 小于 | `{ field: 'age', operator: 'lt', value: 60 }` |
| `gte` | 大于等于 | `{ field: 'age', operator: 'gte', value: 18 }` |
| `lte` | 小于等于 | `{ field: 'age', operator: 'lte', value: 60 }` |
| `includes` | 包含（数组包含值） | `{ field: 'tags', operator: 'includes', value: 'active' }` |
| `notIncludes` | 不包含 | `{ field: 'tags', operator: 'notIncludes', value: 'inactive' }` |
| `in` | 在...之中（值在数组中） | `{ field: 'type', operator: 'in', value: ['normal', 'vip'] }` |
| `notIn` | 不在...之中 | `{ field: 'type', operator: 'notIn', value: ['admin'] }` |

### 7.5 复杂条件组合示例

```typescript
// 条件：年龄 > 18 且 (类型是 vip 或 normal) 且 不包含黑名单标签
{
  "relation": "and",
  "children": [
    { "field": "age", "operator": "gt", "value": 18 },
    { 
      "relation": "or", 
      "children": [
        { "field": "type", "operator": "eq", "value": "vip" },
        { "field": "type", "operator": "eq", "value": "normal" }
      ]
    },
    { "field": "tags", "operator": "notIncludes", "value": "blacklist" }
  ]
}
```

## 8. 性能优化

- **组件懒加载**：使用 Vue Router 的动态导入
- **虚拟滚动**：大数据表格使用虚拟滚动
- **防抖节流**：表单输入和搜索操作使用防抖节流
- **缓存策略**：合理使用缓存减少 API 请求

## 9. 扩展能力

- **自定义表单控件**：支持注册自定义表单控件
- **主题定制**：支持 Element Plus 主题定制
- **国际化**：支持多语言配置
- **权限控制**：支持基于角色的权限控制

## 10. 开发计划

1. 初始化项目，配置基础依赖
2. 实现布局组件和路由配置
3. 开发 BaseForm 和 BaseTable 组件（含表单联动和参数过滤功能）
4. 实现动态菜单生成
5. 开发增删改查功能
6. 优化性能和用户体验
7. 编写文档和测试

## 11. UI 设计系统

### 11.1 设计理念

**设计方向：工业精英主义（Industrial Elitism）**

本系统采用独特的工业精英主义设计风格，结合了现代极简主义与精密工程美学。我们拒绝使用千篇一律的 AI 设计模板，而是创造出独特、专业、令人难忘的视觉体验。

**核心设计原则：**
- **材质感**：强调层次和深度，拒绝扁平化
- **精准性**：每一个像素都经过精心计算
- **功能性**：美学服务于功能，每一个设计决策都有其目的
- **独特性**：避免常见的设计模式，创造记忆点

### 11.2 色彩系统

#### 11.2.1 主色调：深蓝工业风

我们选择深邃的蓝色系作为主色调，传达出专业、可信赖和精密的感觉。

| 颜色名称 | 十六进制值 | 应用场景 |
|---------|-----------|---------|
| **深蓝主色** | `#1a4d8f` | 主要按钮、链接、强调元素 |
| **浅蓝变体** | `#2e6bc0` | 悬停状态、渐变过渡 |
| **深蓝变体** | `#0f3360` | 深色背景、次级文本 |
| **蓝渐变** | `linear-gradient(135deg, #1a4d8f 0%, #2e6bc0 100%)` | 按钮背景、强调元素 |

#### 11.2.2 强调色：橙棕色

使用温暖的橙棕色作为强调色，与深蓝色形成完美对比，创造出视觉张力。

| 颜色名称 | 十六进制值 | 应用场景 |
|---------|-----------|---------|
| **主强调色** | `#d4763a` | 图标、边框、交互反馈 |
| **浅强调色** | `#e8965b` | 悬停状态 |
| **深强调色** | `#a85520` | 深色变体 |

#### 11.2.3 中性色系统

精心设计的中性色系统，创造出层次感和深度。

| 颜色名称 | 十六进制值 | 应用场景 |
|---------|-----------|---------|
| **最暗背景** | `#0d1521` | 页面背景 |
| **深色背景** | `#141e2e` | 侧边栏、头部 |
| **中色背景** | `#1c2a3d` | 卡片背景、面板 |
| **亮色背景** | `#24344d` | 悬停状态、输入框 |
| **主文本** | `#f0f4f8` | 标题、主要内容 |
| **次级文本** | `#94a3b8` | 描述、标签 |
| **辅助文本** | `#64748b` | 占位符、时间戳 |
| **边框色** | `#334155` | 卡片边框、分隔线 |
| **浅边框** | `#475569` | 输入框边框 |

### 11.3 字体系统

我们选择独特而优雅的字体组合，避免使用过于常见的字体（如 Inter、Roboto）。

#### 11.3.1 字体层级

| 用途 | 字体 | 字重 | 字号 | 行高 |
|-----|------|------|------|------|
| **页面标题** | Georgia, 'Times New Roman', serif | 700 | 32px | 1.2 |
| **卡片标题** | Georgia, 'Times New Roman', serif | 600 | 24px | 1.3 |
| **次级标题** | 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif | 600 | 18px | 1.4 |
| **正文文本** | 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif | 400 | 16px | 1.6 |
| **辅助文本** | 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif | 400 | 14px | 1.5 |
| **代码/数字** | 'JetBrains Mono', 'Fira Code', monospace | 400 | 14px | 1.5 |

**设计考量：**
- 使用 Georgia 作为标题字体，创造独特、经典的感觉
- 使用系统字体作为正文字体，确保跨平台的一致性和可读性
- 使用等宽字体展示代码和数字，增加精确感

### 11.4 间距系统

基于 8px 栅格的精确间距系统，确保视觉一致性。

| 名称 | 像素值 | 用途 |
|-----|--------|------|
| XS | 4px | 内部微调 |
| SM | 8px | 元素间距 |
| MD | 16px | 卡片内边距、组件间距 |
| LG | 24px | 区域间距、大组件间距 |
| XL | 32px | 页面边距、大区域间距 |
| 2XL | 48px | 主要区域分隔 |

### 11.5 圆角系统

克制使用圆角，保持工业风格的锐利感。

| 名称 | 像素值 | 用途 |
|-----|--------|------|
| None | 0px | 强调锐利感的元素 |
| SM | 2px | 小型控件、图标按钮 |
| MD | 4px | 按钮、输入框 |
| LG | 8px | 卡片、面板 |
| Full | 9999px | 头像、圆形按钮 |

### 11.6 阴影系统

多层次的阴影系统，创造深度和层次感。

| 名称 | 值 | 用途 |
|-----|-----|------|
| SM | `0 1px 2px rgba(0, 0, 0, 0.3)` | 输入框、小型元素 |
| MD | `0 4px 6px -1px rgba(0, 0, 0, 0.4)` | 卡片、按钮 |
| LG | `0 10px 15px -3px rgba(0, 0, 0, 0.5)` | 模态框、下拉菜单 |
| Glow | `0 0 20px rgba(212, 118, 58, 0.3)` | 强调元素、悬停状态 |

### 11.7 组件设计

#### 11.7.1 卡片组件

**设计特点：**
- 深蓝色背景配合微妙的边框
- 悬停时边框变为蓝色主色
- 精心设计的内边距和阴影

```scss
.card {
  background: $color-bg-card;
  border-radius: $radius-lg;
  border: 1px solid $color-border;
  box-shadow: $shadow-md;
  overflow: hidden;
  transition: all $transition-base;

  &:hover {
    border-color: $color-primary;
    box-shadow: $shadow-lg;
  }
}
```

#### 11.7.2 按钮组件

**设计特点：**
- 渐变背景配合光泽效果
- 按下时的微缩放反馈
- 精心设计的悬停效果

**按钮变体：**

1. **主按钮**
   - 蓝色渐变背景
   - 发光悬停效果

2. **强调按钮**
   - 橙棕色背景
   - 温暖的视觉暗示

3. **幽灵按钮**
   - 透明背景
   - 边框强调

```scss
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: $spacing-sm;
  padding: $spacing-sm $spacing-lg;
  font-family: $font-body;
  font-size: $font-size-sm;
  font-weight: 500;
  border: none;
  border-radius: $radius-md;
  cursor: pointer;
  transition: all $transition-base;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
    transition: left $transition-slow;
  }

  &:hover::before {
    left: 100%;
  }

  &:active {
    transform: scale(0.98);
  }
}
```

#### 11.7.3 输入框组件

**设计特点：**
- 深色背景与浅色边框的对比
- 聚焦时的蓝色光晕效果
- 精心设计的占位符颜色

```scss
.input-field {
  background: $color-bg-medium;
  border: 1px solid $color-border;
  border-radius: $radius-md;
  padding: $spacing-sm $spacing-md;
  color: $color-text-primary;
  font-size: $font-size-base;
  transition: all $transition-fast;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: $color-primary;
    box-shadow: 0 0 0 3px rgba(46, 107, 192, 0.2);
  }

  &::placeholder {
    color: $color-text-muted;
  }
}
```

#### 11.7.4 表格组件

**设计特点：**
- 斑马纹行样式，增加可读性
- 悬停时的行高亮
- 固定表头，便于浏览
- 精心设计的分隔线

```scss
.table-container {
  background: $color-bg-card;
  border-radius: $radius-lg;
  border: 1px solid $color-border;
  overflow: hidden;
}

.el-table {
  background: transparent;
  
  th {
    background: $color-bg-medium !important;
    color: $color-text-primary;
    font-weight: 600;
    border-bottom: 1px solid $color-border;
  }
  
  tr {
    transition: background $transition-fast;
    
    &:hover {
      background: $color-bg-light !important;
    }
  }
  
  td {
    border-bottom: 1px solid $color-border;
  }
}
```

#### 11.7.5 模态框组件

**设计特点：**
- 居中定位，带有微妙的入场动画
- 半透明黑色背景
- 精心设计的圆角和阴影

```scss
.modal-enter-active {
  animation: fadeIn 0.3s ease-out;
}

.modal-leave-active {
  animation: fadeIn 0.3s ease-out reverse;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(-10px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}
```

### 11.8 布局设计

#### 11.8.1 主布局结构

```
┌─────────────────────────────────────────────────────────┐
│  Header (固定顶部)                                     │
├──────────┬──────────────────────────────────────────────┤
│          │                                              │
│  Sidebar │          Main Content Area                  │
│          │                                              │
│          │                                              │
│          │                                              │
│          │                                              │
└──────────┴──────────────────────────────────────────────┘
```

**设计特点：**
- 固定顶部 Header，高度 64px
- 可折叠侧边栏，宽度 240px（折叠后 64px）
- 主要内容区域带有左右 24px 边距
- 卡片网格布局，间距 24px

#### 11.8.2 页面布局示例

**列表页面：**
```
┌─────────────────────────────────────────────────────────┐
│  [卡片标题]                    [+ 新增按钮]          │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  [搜索栏] [筛选器]                                     │
│                                                         │
│  ┌─────────────────────────────────────────────────┐  │
│  │  表格数据...                                   │  │
│  │                                                 │  │
│  │                                                 │  │
│  └─────────────────────────────────────────────────┘  │
│  [分页器]                                               │
└─────────────────────────────────────────────────────────┘
```

**表单弹窗：**
```
┌─────────────────────────────────┐
│  新增/编辑 [菜单名]      [×]   │
├─────────────────────────────────┤
│                                 │
│  [表单字段...]                 │
│                                 │
│  [表单字段...]                 │
│                                 │
│  [表单字段...]                 │
│                                 │
├─────────────────────────────────┤
│           [取消]  [保存]        │
└─────────────────────────────────┘
```

### 11.9 动画与微交互

#### 11.9.1 页面入场动画

使用错开的入场动画，创造优雅的页面加载体验：

```scss
.stagger-enter {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.4s ease, transform 0.4s ease;
}

.stagger-enter-active {
  opacity: 1;
  transform: translateY(0);
}

// 使用 animation-delay 错开每个元素的入场时间
.stagger-enter:nth-child(1) { transition-delay: 0ms; }
.stagger-enter:nth-child(2) { transition-delay: 100ms; }
.stagger-enter:nth-child(3) { transition-delay: 200ms; }
.stagger-enter:nth-child(4) { transition-delay: 300ms; }
```

#### 11.9.2 按钮微交互

- **悬停时**：轻微上浮 + 发光效果
- **按下时**：0.98 倍缩放
- **光泽扫过**：悬停时的光泽扫过效果

#### 11.9.3 表单字段交互

- **聚焦时**：蓝色边框 + 光晕效果
- **验证错误**：红色边框 + 抖动动画
- **成功状态**：绿色边框 + 勾选图标

### 11.10 可访问性设计

- **颜色对比度**：确保文本与背景的对比度符合 WCAG AA 标准
- **键盘导航**：所有交互元素支持键盘操作
- **焦点可见性**：清晰的焦点状态，便于键盘用户
- **语义化 HTML**：使用适当的 HTML 标签，提高屏幕阅读器的可用性
- **文本大小**：支持缩放，确保不同视力的用户都能正常使用

### 11.11 响应式设计

| 断点 | 设备类型 | 布局调整 |
|-----|---------|---------|
| < 640px | 手机 | 侧边栏完全折叠，单列布局 |
| 640px - 1024px | 平板 | 侧边栏可折叠，单列或双列布局 |
| > 1024px | 桌面 | 完整侧边栏，多列网格布局 |

## 12. 结论

本设计方案采用完全组件化的方式，通过 JSON 配置动态生成表单和表格，实现了高度的代码复用和灵活性。使用 Pinia 进行状态管理，保证了应用状态的可预测性和可维护性。

UI 设计方面，我们采用独特的工业精英主义风格，精心设计了色彩系统、字体层级、间距系统和组件样式，创造出专业、独特、令人难忘的视觉体验。该方案适用于需要快速开发多个管理菜单的场景，能够大大提高开发效率和代码质量。
