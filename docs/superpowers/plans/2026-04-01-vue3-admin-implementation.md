# Vue 3 管理系统实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 构建一个基于 Vite + Vue 3 + TypeScript + Element Plus 的管理系统，支持通过 JSON 配置动态生成表单和表格，包含增删改查功能、表单联动、参数过滤、图片展示/上传、富文本编辑等功能。

**Architecture:** 完全组件化架构，BaseForm 和 BaseTable 作为可复用组件，通过 JSON 配置驱动，使用 Pinia 管理状态，Vue Router 处理路由。

**Tech Stack:** Vue 3, Vite, TypeScript, Element Plus, Pinia, Vue Router, SCSS

---

## 实现计划总览

### 文件结构规划

```
src/
├── assets/
│   └── styles/
│       ├── variables.scss
│       └── main.scss
├── components/
│   ├── BaseForm/
│   │   ├── index.vue
│   │   ├── FormFieldRenderer.vue
│   │   ├── RichTextEditor.vue
│   │   ├── ImageUploader.vue
│   │   └── utils.ts
│   ├── BaseTable/
│   │   ├── index.vue
│   │   ├── ImageColumn.vue
│   │   └── RichTextColumn.vue
│   └── layout/
│       ├── MainLayout.vue
│       ├── Sidebar.vue
│       └── Header.vue
├── views/
│   └── menus/
│       └── GenericMenuPage.vue
├── router/
│   └── index.ts
├── store/
│   ├── index.ts
│   └── modules/
│       └── menu.ts
├── types/
│   ├── form.ts
│   ├── table.ts
│   └── menu.ts
├── utils/
│   ├── condition-evaluator.ts
│   └── form-helpers.ts
├── api/
│   └── mock.ts
├── App.vue
└── main.ts
```

---

## 任务 1: 项目初始化与基础配置

**Files:**
- Create: `package.json`
- Create: `vite.config.ts`
- Create: `tsconfig.json`
- Create: `tsconfig.node.json`
- Create: `index.html`
- Create: `src/main.ts`
- Create: `src/App.vue`
- Create: `src/assets/styles/variables.scss`
- Create: `src/assets/styles/main.scss`

- [ ] **步骤 1: 创建 package.json**

```json
{
  "name": "vue3-admin-best-practice",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vue-tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "vue": "^3.4.0",
    "vue-router": "^4.3.0",
    "pinia": "^2.1.7",
    "element-plus": "^2.6.0",
    "@element-plus/icons-vue": "^2.3.0",
    "@tinymce/tinymce-vue": "^5.1.0",
    "sass": "^1.72.0"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^5.0.0",
    "typescript": "^5.4.0",
    "vite": "^5.2.0",
    "vue-tsc": "^2.0.0"
  }
}
```

- [ ] **步骤 2: 创建 vite.config.ts**

```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@/assets/styles/variables.scss" as *;`
      }
    }
  }
})
```

- [ ] **步骤 3: 创建 tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "module": "ESNext",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "preserve",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src/**/*.ts", "src/**/*.tsx", "src/**/*.vue"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

- [ ] **步骤 4: 创建 tsconfig.node.json**

```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true,
    "strict": true
  },
  "include": ["vite.config.ts"]
}
```

- [ ] **步骤 5: 创建 index.html**

```html
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Admin Dashboard</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
```

- [ ] **步骤 6: 创建样式变量文件 src/assets/styles/variables.scss**

```scss
// 色彩系统
$color-primary: #1a4d8f;
$color-primary-light: #2e6bc0;
$color-primary-dark: #0f3360;
$color-primary-gradient: linear-gradient(135deg, #1a4d8f 0%, #2e6bc0 100%);

$color-accent: #d4763a;
$color-accent-light: #e8965b;
$color-accent-dark: #a85520;

$color-bg-dark: #0d1521;
$color-bg-medium: #141e2e;
$color-bg-light: #1c2a3d;
$color-bg-card: #24344d;

$color-text-primary: #f0f4f8;
$color-text-secondary: #94a3b8;
$color-text-muted: #64748b;

$color-border: #334155;
$color-border-light: #475569;

// 字体
$font-display: Georgia, 'Times New Roman', serif;
$font-body: 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif;
$font-mono: 'JetBrains Mono', 'Fira Code', monospace;

// 间距
$spacing-xs: 0.25rem;
$spacing-sm: 0.5rem;
$spacing-md: 1rem;
$spacing-lg: 1.5rem;
$spacing-xl: 2rem;

// 圆角
$radius-none: 0;
$radius-sm: 2px;
$radius-md: 4px;
$radius-lg: 8px;
$radius-full: 9999px;

// 阴影
$shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.3);
$shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.4);
$shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.5);
$shadow-glow: 0 0 20px rgba(212, 118, 58, 0.3);

// 过渡
$transition-fast: 150ms ease;
$transition-base: 250ms ease;
$transition-slow: 350ms ease;
```

- [ ] **步骤 7: 创建主样式文件 src/assets/styles/main.scss**

```scss
@import './variables.scss';

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  height: 100%;
  font-family: $font-body;
  font-size: 16px;
  line-height: 1.6;
  color: $color-text-primary;
  background-color: $color-bg-dark;
}

#app {
  height: 100%;
}

::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: $color-bg-medium;
}

::-webkit-scrollbar-thumb {
  background: $color-border;
  border-radius: $radius-sm;
}

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

- [ ] **步骤 8: 创建 src/main.ts**

```typescript
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import router from './router'
import App from './App.vue'
import './assets/styles/main.scss'

const app = createApp(App)
const pinia = createPinia()

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(pinia)
app.use(router)
app.use(ElementPlus)

app.mount('#app')
```

- [ ] **步骤 9: 创建 src/App.vue**

```vue
<template>
  <router-view />
</template>

<script setup lang="ts">
</script>

<style scoped>
</style>
```

- [ ] **步骤 10: 安装依赖并验证项目启动**

```bash
npm install
npm run dev
```

Expected: Vite dev server starts successfully at http://localhost:5173

---

## 任务 2: 类型定义

**Files:**
- Create: `src/types/form.ts`
- Create: `src/types/table.ts`
- Create: `src/types/menu.ts`

- [ ] **步骤 1: 创建表单类型 src/types/form.ts**

```typescript
export interface Option {
  label: string
  value: any
}

export interface FormRule {
  required?: boolean
  message?: string
  trigger?: 'blur' | 'change'
  validator?: (rule: any, value: any, callback: any) => void
}

export interface ShowWhenCondition {
  field: string
  operator: 'eq' | 'ne' | 'gt' | 'lt' | 'gte' | 'lte' | 'includes' | 'notIncludes' | 'in' | 'notIn'
  value: any
  children?: ShowWhenCondition[]
  relation?: 'and' | 'or'
}

export interface RichTextConfig {
  height?: number
  toolbar?: string[]
  placeholder?: string
  contentStyle?: string
}

export interface ImageConfig {
  multiple?: boolean
  limit?: number
  maxSize?: number
  accept?: string
  listType?: 'text' | 'picture' | 'picture-card'
}

export interface FormField {
  name: string
  label: string
  type: string
  defaultValue?: any
  options?: Option[]
  props?: Record<string, any>
  rules?: FormRule[]
  dependencies?: string[]
  visible?: boolean | ((formData: any) => boolean)
  showWhen?: ShowWhenCondition
  richTextConfig?: RichTextConfig
  imageConfig?: ImageConfig
}

export interface FormConfig {
  fields: FormField[]
  rules?: FormRule[]
  layout?: 'horizontal' | 'vertical'
}
```

- [ ] **步骤 2: 创建表格类型 src/types/table.ts**

```typescript
export interface ImageColumnConfig {
  width?: number | string
  height?: number | string
  fit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down'
  preview?: boolean
  placeholder?: string
}

export interface RichTextColumnConfig {
  showSummary?: boolean
  summaryLength?: number
  showExpand?: boolean
}

export interface TableColumn {
  prop: string
  label: string
  width?: string | number
  sortable?: boolean
  formatter?: (row: any, column: any, cellValue: any) => any
  align?: 'left' | 'center' | 'right'
  type?: 'default' | 'image' | 'rich-text' | 'tag' | 'date'
  imageConfig?: ImageColumnConfig
  richTextConfig?: RichTextColumnConfig
}

export interface TableAction {
  name: string
  type: 'edit' | 'delete' | 'custom'
  label: string
  icon?: string
  handler?: (row: any) => void
}

export interface TableConfig {
  columns: TableColumn[]
  pagination?: boolean
  actions?: TableAction[]
  sortable?: boolean
  filterable?: boolean
}
```

- [ ] **步骤 3: 创建菜单类型 src/types/menu.ts**

```typescript
import type { FormConfig } from './form'
import type { TableConfig } from './table'

export interface MenuConfig {
  id: string
  name: string
  path: string
  component: string
  icon?: string
  formConfig: FormConfig
  tableConfig: TableConfig
}
```

---

## 任务 3: 工具函数实现

**Files:**
- Create: `src/utils/condition-evaluator.ts`
- Create: `src/utils/form-helpers.ts`

- [ ] **步骤 1: 创建条件判断引擎 src/utils/condition-evaluator.ts**

```typescript
import type { ShowWhenCondition, FormField } from '@/types/form'

export function evaluateCondition(condition: ShowWhenCondition, formData: Record<string, any>): boolean {
  const { field, operator, value, children, relation = 'and' } = condition

  if (children && children.length > 0) {
    const results = children.map(child => evaluateCondition(child, formData))
    return relation === 'and' 
      ? results.every(res => res) 
      : results.some(res => res)
  }

  const currentValue = formData[field]

  switch (operator) {
    case 'eq':
      return currentValue === value
    case 'ne':
      return currentValue !== value
    case 'gt':
      return currentValue > value
    case 'lt':
      return currentValue < value
    case 'gte':
      return currentValue >= value
    case 'lte':
      return currentValue <= value
    case 'includes':
      return Array.isArray(currentValue) && currentValue.includes(value)
    case 'notIncludes':
      return Array.isArray(currentValue) && !currentValue.includes(value)
    case 'in':
      return Array.isArray(value) && value.includes(currentValue)
    case 'notIn':
      return Array.isArray(value) && !value.includes(currentValue)
    default:
      return true
  }
}

export function isFieldVisible(field: FormField, formData: Record<string, any>): boolean {
  if (field.showWhen) {
    return evaluateCondition(field.showWhen, formData)
  }
  if (typeof field.visible === 'function') {
    return field.visible(formData)
  }
  return field.visible !== false
}
```

- [ ] **步骤 2: 创建表单辅助工具 src/utils/form-helpers.ts**

```typescript
import type { FormField } from '@/types/form'
import { isFieldVisible } from './condition-evaluator'

export function initializeFormData(fields: FormField[]): Record<string, any> {
  const data: Record<string, any> = {}
  fields.forEach(field => {
    if (field.defaultValue !== undefined) {
      data[field.name] = field.defaultValue
    } else if (field.type === 'checkbox-group') {
      data[field.name] = []
    } else if (field.type === 'image-upload' && field.imageConfig?.multiple) {
      data[field.name] = []
    }
  })
  return data
}

export function getVisibleFields(fields: FormField[], formData: Record<string, any>): Record<string, any> {
  const result: Record<string, any> = {}
  fields.forEach(field => {
    if (isFieldVisible(field, formData) && formData[field.name] !== undefined) {
      result[field.name] = formData[field.name]
    }
  })
  return result
}

export function getAllFields(formData: Record<string, any>): Record<string, any> {
  return { ...formData }
}

export function generateFormRules(fields: FormField[]): Record<string, any> {
  const rules: Record<string, any> = {}
  fields.forEach(field => {
    if (field.rules) {
      rules[field.name] = field.rules
    }
  })
  return rules
}
```

---

## 任务 4: 路由和状态管理

**Files:**
- Create: `src/router/index.ts`
- Create: `src/store/index.ts`
- Create: `src/store/modules/menu.ts`
- Create: `src/api/mock.ts`

- [ ] **步骤 1: 创建 Mock API 数据 src/api/mock.ts**

```typescript
import type { MenuConfig } from '@/types/menu'

export const mockMenus: MenuConfig[] = [
  {
    id: 'user',
    name: '用户管理',
    path: '/user',
    component: 'User',
    icon: 'User',
    formConfig: {
      fields: [
        {
          name: 'name',
          label: '用户名',
          type: 'input',
          rules: [
            { required: true, message: '请输入用户名', trigger: 'blur' }
          ]
        },
        {
          name: 'userType',
          label: '用户类型',
          type: 'select',
          options: [
            { label: '普通用户', value: 'normal' },
            { label: 'VIP用户', value: 'vip' },
            { label: '管理员', value: 'admin' }
          ],
          rules: [
            { required: true, message: '请选择用户类型', trigger: 'change' }
          ]
        },
        {
          name: 'vipLevel',
          label: 'VIP等级',
          type: 'select',
          options: [
            { label: '黄金会员', value: 'gold' },
            { label: '白金会员', value: 'platinum' },
            { label: '钻石会员', value: 'diamond' }
          ],
          showWhen: {
            field: 'userType',
            operator: 'eq',
            value: 'vip'
          }
        },
        {
          name: 'avatar',
          label: '用户头像',
          type: 'image-upload',
          imageConfig: {
            multiple: false,
            limit: 1,
            maxSize: 2097152,
            accept: 'image/jpeg,image/png,image/gif',
            listType: 'picture-card'
          }
        },
        {
          name: 'description',
          label: '个人简介',
          type: 'rich-text',
          richTextConfig: {
            height: 300,
            toolbar: [
              'bold', 'italic', 'underline', 'strikeThrough',
              '|', 'undo', 'redo',
              '|', 'formatBlock', 'fontSize', 'fontColor', 'backColor'
            ],
            placeholder: '请输入个人简介...'
          }
        }
      ]
    },
    tableConfig: {
      columns: [
        {
          prop: 'avatar',
          label: '头像',
          type: 'image',
          width: 80,
          align: 'center',
          imageConfig: {
            width: 48,
            height: 48,
            fit: 'cover',
            preview: true
          }
        },
        {
          prop: 'name',
          label: '用户名'
        },
        {
          prop: 'userType',
          label: '用户类型',
          formatter: (row: any) => {
            const map = { normal: '普通用户', vip: 'VIP用户', admin: '管理员' }
            return map[row.userType as keyof typeof map] || row.userType
          }
        },
        {
          prop: 'description',
          label: '个人简介',
          type: 'rich-text',
          width: 300,
          richTextConfig: {
            showSummary: true,
            summaryLength: 50,
            showExpand: true
          }
        },
        {
          prop: 'action',
          label: '操作',
          width: 150,
          fixed: 'right'
        }
      ],
      actions: [
        {
          name: 'edit',
          type: 'edit',
          label: '编辑',
          icon: 'Edit'
        },
        {
          name: 'delete',
          type: 'delete',
          label: '删除',
          icon: 'Delete'
        }
      ]
    }
  }
]

export const mockTableData: Record<string, any[]> = {
  user: [
    {
      id: 1,
      name: '张三',
      userType: 'normal',
      avatar: 'https://via.placeholder.com/100',
      description: '<p>这是一段富文本内容，包含<strong>粗体</strong>和<em>斜体</em>。</p>'
    },
    {
      id: 2,
      name: '李四',
      userType: 'vip',
      vipLevel: 'gold',
      avatar: 'https://via.placeholder.com/100',
      description: '<p>VIP用户的简介内容。</p>'
    }
  ]
}
```

- [ ] **步骤 2: 创建 Pinia Store src/store/index.ts**

```typescript
import { createPinia } from 'pinia'

const pinia = createPinia()

export default pinia
export * from './modules/menu'
```

- [ ] **步骤 3: 创建菜单模块 src/store/modules/menu.ts**

```typescript
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { MenuConfig } from '@/types/menu'
import { mockMenus, mockTableData } from '@/api/mock'

export const useMenuStore = defineStore('menu', () => {
  const menus = ref<MenuConfig[]>(mockMenus)
  const tableData = ref<Record<string, any[]>>(mockTableData)
  const currentMenu = ref<MenuConfig | null>(null)

  const currentMenuConfig = computed(() => currentMenu.value)

  function setCurrentMenu(menuId: string) {
    currentMenu.value = menus.value.find(m => m.id === menuId) || null
  }

  function getTableData(menuId: string): any[] {
    return tableData.value[menuId] || []
  }

  function addItem(menuId: string, item: any) {
    if (!tableData.value[menuId]) {
      tableData.value[menuId] = []
    }
    const newId = Math.max(...tableData.value[menuId].map(i => i.id || 0), 0) + 1
    tableData.value[menuId].push({ ...item, id: newId })
  }

  function updateItem(menuId: string, id: number, item: any) {
    const index = tableData.value[menuId]?.findIndex(i => i.id === id)
    if (index !== undefined && index > -1) {
      tableData.value[menuId][index] = { ...tableData.value[menuId][index], ...item }
    }
  }

  function deleteItem(menuId: string, id: number) {
    const index = tableData.value[menuId]?.findIndex(i => i.id === id)
    if (index !== undefined && index > -1) {
      tableData.value[menuId].splice(index, 1)
    }
  }

  return {
    menus,
    currentMenu,
    currentMenuConfig,
    getTableData,
    setCurrentMenu,
    addItem,
    updateItem,
    deleteItem
  }
})
```

- [ ] **步骤 4: 创建路由配置 src/router/index.ts**

```typescript
import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '@/components/layout/MainLayout.vue'
import GenericMenuPage from '@/views/menus/GenericMenuPage.vue'
import { mockMenus } from '@/api/mock'

const routes = [
  {
    path: '/',
    component: MainLayout,
    redirect: '/user',
    children: mockMenus.map(menu => ({
      path: menu.path,
      name: menu.name,
      component: GenericMenuPage,
      meta: { menuId: menu.id, menuName: menu.name }
    }))
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
```

---

## 任务 5: 布局组件

**Files:**
- Create: `src/components/layout/MainLayout.vue`
- Create: `src/components/layout/Sidebar.vue`
- Create: `src/components/layout/Header.vue`

- [ ] **步骤 1: 创建侧边栏组件 src/components/layout/Sidebar.vue**

```vue
<template>
  <aside class="sidebar">
    <div class="sidebar-logo">
      <h2>Admin</h2>
    </div>
    <el-menu
      :default-active="activeMenu"
      class="sidebar-menu"
      @select="handleMenuSelect"
    >
      <el-menu-item
        v-for="menu in menus"
        :key="menu.id"
        :index="menu.path"
      >
        <el-icon v-if="menu.icon">
          <component :is="menu.icon" />
        </el-icon>
        <template #title>{{ menu.name }}</template>
      </el-menu-item>
    </el-menu>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { mockMenus } from '@/api/mock'
import { useMenuStore } from '@/store'

const router = useRouter()
const route = useRoute()
const menuStore = useMenuStore()

const activeMenu = computed(() => route.path)
const menus = mockMenus

function handleMenuSelect(path: string) {
  const menu = menus.find(m => m.path === path)
  if (menu) {
    menuStore.setCurrentMenu(menu.id)
    router.push(path)
  }
}
</script>

<style scoped lang="scss">
.sidebar {
  width: 240px;
  height: 100%;
  background: $color-bg-medium;
  border-right: 1px solid $color-border;
  display: flex;
  flex-direction: column;
}

.sidebar-logo {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid $color-border;
  
  h2 {
    font-family: $font-display;
    color: $color-text-primary;
    font-size: 24px;
    font-weight: 700;
  }
}

.sidebar-menu {
  border: none;
  background: transparent;
  
  :deep(.el-menu-item) {
    color: $color-text-secondary;
    
    &:hover,
    &.is-active {
      background: $color-bg-light;
      color: $color-text-primary;
    }
    
    &.is-active {
      border-right: 3px solid $color-primary;
    }
  }
}
</style>
```

- [ ] **步骤 2: 创建头部组件 src/components/layout/Header.vue**

```vue
<template>
  <header class="header">
    <div class="header-left">
      <h3 class="page-title">{{ pageTitle }}</h3>
    </div>
    <div class="header-right">
      <el-button type="primary">
        <el-icon><User /></el-icon>
        管理员
      </el-button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { User } from '@element-plus/icons-vue'

const route = useRoute()

const pageTitle = computed(() => route.meta.menuName || '管理系统')
</script>

<style scoped lang="scss">
.header {
  height: 64px;
  background: $color-bg-medium;
  border-bottom: 1px solid $color-border;
  padding: 0 $spacing-lg;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.page-title {
  font-family: $font-display;
  color: $color-text-primary;
  font-size: 20px;
  font-weight: 600;
}
</style>
```

- [ ] **步骤 3: 创建主布局组件 src/components/layout/MainLayout.vue**

```vue
<template>
  <div class="main-layout">
    <Sidebar />
    <div class="main-content">
      <Header />
      <div class="content-area">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Sidebar from './Sidebar.vue'
import Header from './Header.vue'
</script>

<style scoped lang="scss">
.main-layout {
  display: flex;
  height: 100%;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.content-area {
  flex: 1;
  padding: $spacing-xl;
  overflow-y: auto;
  background: $color-bg-dark;
}
</style>
```

---

## 任务 6: 表单组件实现

**Files:**
- Create: `src/components/BaseForm/utils.ts`
- Create: `src/components/BaseForm/RichTextEditor.vue`
- Create: `src/components/BaseForm/ImageUploader.vue`
- Create: `src/components/BaseForm/FormFieldRenderer.vue`
- Create: `src/components/BaseForm/index.vue`

- [ ] **步骤 1: 创建表单工具 src/components/BaseForm/utils.ts**

```typescript
export function stripHtml(html: string): string {
  const tmp = document.createElement('div')
  tmp.innerHTML = html
  return tmp.textContent || tmp.innerText || ''
}

export function truncateText(text: string, length: number): string {
  if (text.length <= length) return text
  return text.slice(0, length) + '...'
}
```

- [ ] **步骤 2: 创建富文本编辑器组件 src/components/BaseForm/RichTextEditor.vue**

```vue
<template>
  <div class="rich-text-editor">
    <el-input
      v-if="!useTinymce"
      type="textarea"
      :rows="10"
      :model-value="modelValue"
      :placeholder="config?.placeholder || '请输入内容...'"
      @update:model-value="handleUpdate"
    />
    <div v-else class="tinymce-placeholder">
      <div class="tinymce-toolbar">
        <el-button-group>
          <el-button size="small"><b>B</b></el-button>
          <el-button size="small"><i>I</i></el-button>
          <el-button size="small"><u>U</u></el-button>
        </el-button-group>
      </div>
      <div 
        class="tinymce-content"
        contenteditable
        :innerHTML="modelValue"
        @input="handleContentInput"
        :placeholder="config?.placeholder"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { RichTextConfig } from '@/types/form'

interface Props {
  modelValue?: string
  config?: RichTextConfig
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  config: () => ({})
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const useTinymce = ref(false)
const contentRef = ref<HTMLElement>()

function handleUpdate(value: string) {
  emit('update:modelValue', value)
}

function handleContentInput(e: Event) {
  const target = e.target as HTMLElement
  emit('update:modelValue', target.innerHTML)
}

watch(() => props.modelValue, (newVal) => {
  if (contentRef.value && contentRef.value.innerHTML !== newVal) {
    contentRef.value.innerHTML = newVal || ''
  }
})
</script>

<style scoped lang="scss">
.rich-text-editor {
  width: 100%;
}

.tinymce-placeholder {
  border: 1px solid $color-border;
  border-radius: $radius-md;
  overflow: hidden;
}

.tinymce-toolbar {
  padding: $spacing-sm;
  background: $color-bg-medium;
  border-bottom: 1px solid $color-border;
}

.tinymce-content {
  min-height: 200px;
  padding: $spacing-md;
  background: $color-bg-card;
  color: $color-text-primary;
  
  &:focus {
    outline: none;
  }
  
  &:empty:before {
    content: attr(placeholder);
    color: $color-text-muted;
  }
}
</style>
```

- [ ] **步骤 3: 创建图片上传组件 src/components/BaseForm/ImageUploader.vue**

```vue
<template>
  <div class="image-uploader">
    <el-upload
      v-model:file-list="fileList"
      :action="uploadUrl"
      :multiple="config?.multiple"
      :limit="config?.limit"
      :accept="config?.accept"
      :list-type="config?.listType || 'picture-card'"
      :on-change="handleChange"
      :on-remove="handleRemove"
      :on-success="handleSuccess"
      :auto-upload="false"
    >
      <el-icon><Plus /></el-icon>
    </el-upload>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import type { UploadProps, UploadUserFile } from 'element-plus'
import type { ImageConfig } from '@/types/form'

interface Props {
  modelValue?: string | string[]
  config?: ImageConfig
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => [],
  config: () => ({})
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | string[]): void
}>()

const uploadUrl = '/api/upload'
const fileList = ref<UploadUserFile[]>([])

function initFileList(value: string | string[]) {
  if (Array.isArray(value)) {
    fileList.value = value.map((url, index) => ({
      name: `image-${index}`,
      url: url
    }))
  } else if (value) {
    fileList.value = [{
      name: 'image',
      url: value
    }]
  } else {
    fileList.value = []
  }
}

function handleChange(file: UploadUserFile) {
  const newFiles = fileList.value.map(f => f.url || URL.createObjectURL(f.raw!))
  updateValue(newFiles)
}

function handleRemove(file: UploadUserFile) {
  const index = fileList.value.indexOf(file)
  if (index > -1) {
    fileList.value.splice(index, 1)
    const newFiles = fileList.value.map(f => f.url || '')
    updateValue(newFiles)
  }
}

function handleSuccess(response: any, file: UploadUserFile) {
  file.url = response.url
}

function updateValue(files: string[]) {
  if (props.config?.multiple) {
    emit('update:modelValue', files)
  } else {
    emit('update:modelValue', files[0] || '')
  }
}

watch(() => props.modelValue, (newVal) => {
  initFileList(newVal)
}, { immediate: true })
</script>

<style scoped lang="scss">
.image-uploader {
  width: 100%;
}

:deep(.el-upload-list--picture-card .el-upload-list__item) {
  background: $color-bg-card;
  border-color: $color-border;
}

:deep(.el-upload--picture-card) {
  background: $color-bg-card;
  border-color: $color-border;
}
</style>
```

- [ ] **步骤 4: 创建表单字段渲染器 src/components/BaseForm/FormFieldRenderer.vue**

```vue
<template>
  <component
    :is="componentType"
    v-bind="fieldProps"
    v-model="fieldModel"
    @update:model-value="handleUpdate"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import RichTextEditor from './RichTextEditor.vue'
import ImageUploader from './ImageUploader.vue'
import type { FormField } from '@/types/form'

interface Props {
  field: FormField
  modelValue: any
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'update:modelValue', value: any): void
}>()

const fieldModel = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const componentType = computed(() => {
  switch (props.field.type) {
    case 'rich-text':
      return RichTextEditor
    case 'image-upload':
      return ImageUploader
    case 'select':
      return 'el-select'
    case 'input-number':
      return 'el-input-number'
    case 'date':
      return 'el-date-picker'
    case 'checkbox-group':
      return 'el-checkbox-group'
    case 'radio-group':
      return 'el-radio-group'
    default:
      return 'el-input'
  }
})

const fieldProps = computed(() => {
  const props: Record<string, any> = {
    ...props.field.props,
    placeholder: props.field.rules?.some(r => r.required) 
      ? `请输入${props.field.label}` 
      : undefined
  }
  
  if (props.field.type === 'rich-text') {
    props.config = props.field.richTextConfig
  }
  if (props.field.type === 'image-upload') {
    props.config = props.field.imageConfig
  }
  if (props.field.type === 'select' && props.field.options) {
    // Options will be rendered in the parent component
  }
  
  return props
})

function handleUpdate(value: any) {
  emit('update:modelValue', value)
}
</script>
```

- [ ] **步骤 5: 创建主表单组件 src/components/BaseForm/index.vue**

```vue
<template>
  <el-form
    ref="formRef"
    :model="formData"
    :rules="formRules"
    :label-width="labelWidth"
    class="base-form"
  >
    <template v-for="field in config.fields" :key="field.name">
      <el-form-item
        v-if="visibleFields.has(field.name)"
        :label="field.label"
        :prop="field.name"
        class="form-item"
      >
        <template v-if="field.type === 'select'">
          <el-select
            v-model="formData[field.name]"
            v-bind="field.props"
            style="width: 100%"
          >
            <el-option
              v-for="opt in field.options"
              :key="opt.value"
              :label="opt.label"
              :value="opt.value"
            />
          </el-select>
        </template>
        <template v-else-if="field.type === 'checkbox-group'">
          <el-checkbox-group v-model="formData[field.name]">
            <el-checkbox
              v-for="opt in field.options"
              :key="opt.value"
              :label="opt.value"
            >
              {{ opt.label }}
            </el-checkbox>
          </el-checkbox-group>
        </template>
        <template v-else>
          <FormFieldRenderer
            :field="field"
            v-model="formData[field.name]"
          />
        </template>
      </el-form-item>
    </template>
  </el-form>
</template>

<script setup lang="ts">
import { ref, computed, watchEffect } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import FormFieldRenderer from './FormFieldRenderer.vue'
import { isFieldVisible } from '@/utils/condition-evaluator'
import { initializeFormData, generateFormRules, getVisibleFields, getAllFields } from '@/utils/form-helpers'
import type { FormConfig } from '@/types/form'

interface Props {
  config: FormConfig
  modelValue?: Record<string, any>
  labelWidth?: string
}

const props = withDefaults(defineProps<Props>(), {
  labelWidth: '100px',
  modelValue: () => ({})
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: Record<string, any>): void
  (e: 'submit', value: Record<string, any>): void
}>()

const formRef = ref<FormInstance>()
const formData = ref<Record<string, any>>({})

const formRules = computed<FormRules>(() => generateFormRules(props.config.fields))

const visibleFields = computed(() => {
  const visible = new Set<string>()
  props.config.fields.forEach(field => {
    if (isFieldVisible(field, formData.value)) {
      visible.add(field.name)
    }
  })
  return visible
})

function initializeData() {
  const initial = initializeFormData(props.config.fields)
  formData.value = { ...initial, ...props.modelValue }
}

function validate(): Promise<boolean> {
  return formRef.value?.validate().then(() => true).catch(() => false) || Promise.resolve(false)
}

function getVisibleData(): Record<string, any> {
  return getVisibleFields(props.config.fields, formData.value)
}

function getAllData(): Record<string, any> {
  return getAllFields(formData.value)
}

function resetFields() {
  formRef.value?.resetFields()
  initializeData()
}

watchEffect(() => {
  emit('update:modelValue', { ...formData.value })
})

initializeData()

defineExpose({
  validate,
  getVisibleData,
  getAllData,
  resetFields
})
</script>

<style scoped lang="scss">
.base-form {
  padding: $spacing-md 0;
}

.form-item {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
```

---

## 任务 7: 表格组件实现

**Files:**
- Create: `src/components/BaseTable/ImageColumn.vue`
- Create: `src/components/BaseTable/RichTextColumn.vue`
- Create: `src/components/BaseTable/index.vue`

- [ ] **步骤 1: 创建图片列组件 src/components/BaseTable/ImageColumn.vue**

```vue
<template>
  <div class="image-column">
    <el-image
      v-if="value"
      :src="value"
      :style="imageStyle"
      :fit="config?.fit || 'cover'"
      :preview-src-list="config?.preview ? [value] : []"
      :preview-teleported="true"
      class="table-image"
    />
    <span v-else class="image-placeholder">-</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ImageColumnConfig } from '@/types/table'

interface Props {
  value?: string
  config?: ImageColumnConfig
}

const props = defineProps<Props>()

const imageStyle = computed(() => ({
  width: props.config?.width || 48,
  height: props.config?.height || 48
}))
</script>

<style scoped lang="scss">
.image-column {
  display: flex;
  align-items: center;
  justify-content: center;
}

.table-image {
  border-radius: $radius-md;
  border: 1px solid $color-border;
}

.image-placeholder {
  color: $color-text-muted;
}
</style>
```

- [ ] **步骤 2: 创建富文本列组件 src/components/BaseTable/RichTextColumn.vue**

```vue
<template>
  <div class="rich-text-column">
    <div 
      v-if="showExpand"
      class="rich-text-summary"
      :class="{ expanded: isExpanded }"
      @click="toggleExpand"
    >
      <div v-html="displayText" class="rich-text-content"></div>
      <span class="expand-btn">
        {{ isExpanded ? '收起' : '展开' }}
      </span>
    </div>
    <div v-else class="rich-text-summary">
      <div v-html="displayText" class="rich-text-content"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { RichTextColumnConfig } from '@/types/table'

interface Props {
  value?: string
  config?: RichTextColumnConfig
}

const props = withDefaults(defineProps<Props>(), {
  config: () => ({
    showSummary: true,
    summaryLength: 100,
    showExpand: false
  })
})

const isExpanded = ref(false)

function stripHtml(html: string): string {
  const tmp = document.createElement('div')
  tmp.innerHTML = html
  return tmp.textContent || tmp.innerText || ''
}

const showExpand = computed(() => {
  if (!props.config?.showExpand) return false
  const plainText = stripHtml(props.value || '')
  return plainText.length > (props.config.summaryLength || 100)
})

const displayText = computed(() => {
  if (!props.value) return ''
  if (isExpanded.value) return props.value
  if (!props.config?.showSummary) return props.value
  
  const plainText = stripHtml(props.value)
  const maxLength = props.config.summaryLength || 100
  
  if (plainText.length <= maxLength) {
    return props.value
  }
  
  return props.value.slice(0, maxLength * 2) + '...'
})

function toggleExpand() {
  isExpanded.value = !isExpanded.value
}
</script>

<style scoped lang="scss">
.rich-text-column {
  max-width: 100%;
}

.rich-text-summary {
  cursor: pointer;
  line-height: 1.5;
  
  &:hover {
    color: $color-primary-light;
  }
  
  &.expanded {
    white-space: normal;
  }
}

.rich-text-content {
  display: inline;
  color: $color-text-primary;
  
  :deep(p) {
    margin: 0;
    display: inline;
  }
  
  :deep(img) {
    max-width: 100%;
    height: auto;
  }
}

.expand-btn {
  color: $color-primary-light;
  margin-left: $spacing-xs;
  font-size: 12px;
}
</style>
```

- [ ] **步骤 3: 创建主表格组件 src/components/BaseTable/index.vue**

```vue
<template>
  <div class="base-table">
    <el-table
      :data="data"
      style="width: 100%"
      :stripe="true"
      class="data-table"
    >
      <template v-for="column in config.columns" :key="column.prop">
        <el-table-column
          :prop="column.prop"
          :label="column.label"
          :width="column.width"
          :sortable="column.sortable"
          :align="column.align || 'left'"
          :formatter="column.type !== 'image' && column.type !== 'rich-text' ? column.formatter : undefined"
        >
          <template #default="{ row }">
            <template v-if="column.type === 'image'">
              <ImageColumn
                :value="row[column.prop]"
                :config="column.imageConfig"
              />
            </template>
            <template v-else-if="column.type === 'rich-text'">
              <RichTextColumn
                :value="row[column.prop]"
                :config="column.richTextConfig"
              />
            </template>
            <template v-else-if="column.formatter">
              {{ column.formatter(row, column, row[column.prop]) }}
            </template>
            <template v-else>
              {{ row[column.prop] }}
            </template>
          </template>
        </el-table-column>
      </template>
      
      <el-table-column
        v-if="config.actions?.length"
        label="操作"
        :width="150"
        fixed="right"
      >
        <template #default="{ row }">
          <template v-for="action in config.actions" :key="action.name">
            <el-button
              v-if="action.type === 'edit'"
              type="primary"
              link
              @click="handleAction(action, row)"
            >
              <el-icon v-if="action.icon"><component :is="action.icon" /></el-icon>
              {{ action.label }}
            </el-button>
            <el-button
              v-else-if="action.type === 'delete'"
              type="danger"
              link
              @click="handleAction(action, row)"
            >
              <el-icon v-if="action.icon"><component :is="action.icon" /></el-icon>
              {{ action.label }}
            </el-button>
            <el-button
              v-else
              link
              @click="handleAction(action, row)"
            >
              <el-icon v-if="action.icon"><component :is="action.icon" /></el-icon>
              {{ action.label }}
            </el-button>
          </template>
        </template>
      </el-table-column>
    </el-table>
    
    <el-pagination
      v-if="config.pagination !== false"
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :total="total"
      :page-sizes="[10, 20, 50, 100]"
      layout="total, sizes, prev, pager, next, jumper"
      class="table-pagination"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ImageColumn from './ImageColumn.vue'
import RichTextColumn from './RichTextColumn.vue'
import type { TableConfig } from '@/types/table'

interface Props {
  config: TableConfig
  data: any[]
  total?: number
}

const props = withDefaults(defineProps<Props>(), {
  total: 0
})

const emit = defineEmits<{
  (e: 'action', action: any, row: any): void
  (e: 'page-change', page: number, pageSize: number): void
}>()

const currentPage = ref(1)
const pageSize = ref(10)

function handleAction(action: any, row: any) {
  emit('action', action, row)
}

function handleSizeChange(size: number) {
  pageSize.value = size
  emit('page-change', currentPage.value, size)
}

function handleCurrentChange(page: number) {
  currentPage.value = page
  emit('page-change', page, pageSize.value)
}

function refresh() {
  currentPage.value = 1
}

defineExpose({
  refresh
})
</script>

<style scoped lang="scss">
.base-table {
  width: 100%;
}

.data-table {
  background: $color-bg-card;
  border-radius: $radius-lg;
  overflow: hidden;
  
  :deep(.el-table__header-wrapper th) {
    background: $color-bg-medium !important;
    color: $color-text-primary;
    font-weight: 600;
    border-bottom: 1px solid $color-border;
  }
  
  :deep(.el-table__body-wrapper tr) {
    transition: background $transition-fast;
    
    &:hover {
      background: $color-bg-light !important;
    }
  }
  
  :deep(.el-table__body-wrapper td) {
    border-bottom: 1px solid $color-border;
  }
}

.table-pagination {
  margin-top: $spacing-lg;
  display: flex;
  justify-content: flex-end;
}
</style>
```

---

## 任务 8: 通用菜单页面

**Files:**
- Create: `src/views/menus/GenericMenuPage.vue`

- [ ] **步骤 1: 创建通用菜单页面 src/views/menus/GenericMenuPage.vue**

```vue
<template>
  <div class="generic-menu-page">
    <div class="page-header">
      <h2 class="page-title">{{ menuName }}</h2>
      <el-button type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon>
        新增
      </el-button>
    </div>
    
    <div class="page-content">
      <BaseTable
        v-if="menuConfig"
        ref="tableRef"
        :config="menuConfig.tableConfig"
        :data="tableData"
        :total="tableData.length"
        @action="handleTableAction"
      />
    </div>
    
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="600px"
      class="form-dialog"
      destroy-on-close
    >
      <BaseForm
        v-if="menuConfig"
        ref="formRef"
        :config="menuConfig.formConfig"
        v-model="formData"
      />
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">保存</el-button>
      </template>
    </el-dialog>
    
    <el-dialog
      v-model="deleteDialogVisible"
      title="确认删除"
      width="400px"
    >
      <p>确定要删除这条记录吗？此操作不可恢复。</p>
      <template #footer>
        <el-button @click="deleteDialogVisible = false">取消</el-button>
        <el-button type="danger" @click="confirmDelete">删除</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import BaseForm from '@/components/BaseForm/index.vue'
import BaseTable from '@/components/BaseTable/index.vue'
import { useMenuStore } from '@/store'
import type { FormInstance } from 'element-plus'

const route = useRoute()
const menuStore = useMenuStore()

const menuId = computed(() => route.meta.menuId as string)
const menuName = computed(() => route.meta.menuName as string)
const menuConfig = computed(() => menuStore.menus.find(m => m.id === menuId.value))

const tableData = computed(() => menuStore.getTableData(menuId.value))

const tableRef = ref()
const formRef = ref<FormInstance>()
const dialogVisible = ref(false)
const deleteDialogVisible = ref(false)
const isEdit = ref(false)
const editingId = ref<number | null>(null)
const formData = ref<Record<string, any>>({})

const dialogTitle = computed(() => isEdit.value ? '编辑' : '新增')

onMounted(() => {
  if (menuId.value) {
    menuStore.setCurrentMenu(menuId.value)
  }
})

function handleAdd() {
  isEdit.value = false
  editingId.value = null
  formData.value = {}
  dialogVisible.value = true
}

function handleTableAction(action: any, row: any) {
  if (action.type === 'edit') {
    isEdit.value = true
    editingId.value = row.id
    formData.value = { ...row }
    dialogVisible.value = true
  } else if (action.type === 'delete') {
    editingId.value = row.id
    deleteDialogVisible.value = true
  }
}

async function handleSubmit() {
  const valid = await formRef.value?.validate()
  if (!valid) return
  
  const visibleData = formRef.value?.getVisibleData() || {}
  
  if (isEdit.value && editingId.value) {
    menuStore.updateItem(menuId.value, editingId.value, visibleData)
    ElMessage.success('更新成功')
  } else {
    menuStore.addItem(menuId.value, visibleData)
    ElMessage.success('新增成功')
  }
  
  dialogVisible.value = false
}

function confirmDelete() {
  if (editingId.value) {
    menuStore.deleteItem(menuId.value, editingId.value)
    ElMessage.success('删除成功')
  }
  deleteDialogVisible.value = false
  editingId.value = null
}
</script>

<style scoped lang="scss">
.generic-menu-page {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: $spacing-xl;
}

.page-title {
  font-family: $font-display;
  font-size: 28px;
  font-weight: 700;
  color: $color-text-primary;
}

.page-content {
  flex: 1;
}

:deep(.form-dialog) {
  .el-dialog__header {
    background: $color-bg-medium;
    border-bottom: 1px solid $color-border;
  }
  
  .el-dialog__body {
    background: $color-bg-card;
  }
  
  .el-dialog__footer {
    background: $color-bg-medium;
    border-top: 1px solid $color-border;
  }
}
</style>
```

---

## 任务 9: 集成与测试

**Files:**
- Modify: `src/main.ts` (already created)
- Modify: `src/App.vue` (already created)

- [ ] **步骤 1: 运行完整项目测试**

```bash
npm run dev
```

Expected: 
- Dev server starts at http://localhost:5173
- Sidebar shows user menu
- Clicking user menu shows table with sample data
- Clicking "新增" opens form dialog
- Form works with conditional fields
- Table shows images and rich text
- Edit/delete operations work

- [ ] **步骤 2: 表单联动测试**

1. 选择"用户类型" = "VIP用户"
   Expected: "VIP等级"字段显示

2. 选择"用户类型" = "管理员"
   Expected: "管理员权限"字段显示，"年龄"字段隐藏

3. 选择"用户类型" = "普通用户"且年龄 > 60
   Expected: "紧急联系人"字段显示

- [ ] **步骤 3: 参数过滤测试**

1. 填写表单，选择用户类型=normal（VIP等级字段隐藏）
2. 点击保存
3. 验证提交的数据不包含vipLevel字段

Expected: Only visible fields are submitted

- [ ] **步骤 4: 图片和富文本测试**

1. 上传图片并保存
   Expected: Image shows in table, click to preview

2. 编辑富文本内容并保存
   Expected: Rich text shows in table with expand/collapse

---

## 最终审核检查

- [ ] **所有文件创建完成**
- [ ] **项目启动成功**
- [ ] **所有功能正常工作**
- [ ] **表单联动功能正常**
- [ ] **参数过滤功能正常**
- [ ] **图片上传/展示功能正常**
- [ ] **富文本编辑/展示功能正常**
- [ ] **UI样式符合设计规范**
- [ ] **代码无TypeScript错误**
- [ ] **文档完整**

---

## 总结

本实现计划按照模块化、组件化的方式，将整个系统拆分为9个主要任务：
1. 项目初始化与基础配置
2. 类型定义
3. 工具函数实现
4. 路由和状态管理
5. 布局组件
6. 表单组件（含富文本、图片上传、表单联动、参数过滤）
7. 表格组件（含图片、富文本展示）
8. 通用菜单页面
9. 集成与测试

每个任务都有明确的文件创建/修改清单和详细的实现步骤，确保代码能够按照设计文档的要求完成。
