# 项目分析报告

生成时间: 2026/5/14 02:47:10

---

## 1. 依赖关系分析

### 1.1 统计概览

| 指标 | 数值 |
|------|------|
| 模块总数 | 99 |
| 依赖总数 | 108 |
| 平均依赖数 | 1.09 |
| 最大依赖数 | 11 |

### 1.2 依赖最多的模块

| 排名 | 模块路径 |
|------|----------|
| 1 | `src/main.ts` |
| 2 | `src/router/guards.ts` |
| 3 | `src/services/index.ts` |
| 4 | `src/stores/tableStore.ts` |
| 5 | `src/stores/modules/index.ts` |

### 1.3 循环依赖检测

✓ 未发现循环依赖

### 1.4 依赖矩阵

**`src/api/dynamicApi.ts`** 依赖:

- `src/api/request.ts`
- `src/types/MenuConfig.ts`

**`src/api/menu.ts`** 依赖:

- `src/api/request.ts`
- `src/types/MenuConfig.ts`

**`src/api/uploadApi.ts`** 依赖:

- `src/api/request.ts`

**`src/composables/useApi.ts`** 依赖:

- `src/services/apiService.ts`
- `src/services/notificationService.ts`

**`src/composables/useMenuNav.ts`** 依赖:

- `src/stores/menuStore.ts`
- `src/utils/message.ts`
- `src/types/MenuConfig.ts`

**`src/composables/useModuleActions.ts`** 依赖:

- `src/plugins/core/plugin-registry.ts`
- `src/config/schema/types.ts`
- `src/api/dynamicApi.ts`

**`src/composables/useModuleConfig.ts`** 依赖:

- `src/config/schema/config-manager.ts`
- `src/config/schema/types.ts`

**`src/composables/useResponsive.ts`** 依赖:

- `src/utils/debounceThrottle.ts`

**`src/composables/useTable.ts`** 依赖:

- `src/stores/menuStore.ts`
- `src/stores/tableStore.ts`
- `src/types/TableConfig.ts`

**`src/composables/useUser.ts`** 依赖:

- `src/stores/userStore.ts`
- `src/services/authService.ts`

**`src/config/modules/index.ts`** 依赖:

- `src/config/modules/user.ts`
- `src/config/modules/product.ts`
- `src/config/modules/order.ts`

**`src/config/modules/order.ts`** 依赖:

- `src/config/schema/types.ts`

**`src/config/modules/product.ts`** 依赖:

- `src/config/schema/types.ts`

**`src/config/modules/user.ts`** 依赖:

- `src/config/schema/types.ts`

**`src/config/schema/config-manager.ts`** 依赖:

- `src/config/schema/types.ts`
- `src/config/schema/validator.ts`

**`src/config/schema/types.ts`** 依赖:

- `src/types/FormConfig.ts`
- `src/types/TableConfig.ts`

**`src/config/schema/validator.ts`** 依赖:

- `src/config/schema/types.ts`

**`src/main.ts`** 依赖:

- `src/router/index.ts`
- `src/locales/index.ts`
- `src/mock/index.ts`
- `src/utils/keyboardShortcuts.ts`
- `src/stores/cacheStore.ts`
- `src/utils/errorHandler.ts`
- `src/utils/performance/index.ts`
- `src/services/index.ts`
- `src/components/registry.ts`
- `src/config/schema/config-manager.ts`
- `src/config/modules/index.ts`

**`src/mock/index.ts`** 依赖:

- `src/mock/menu.ts`

**`src/mock/menu.ts`** 依赖:

- `src/mock/utils.ts`
- `src/stores/modules/index.ts`
- `src/mock/modules/index.ts`

**`src/plugins/core/plugin-registry.ts`** 依赖:

- `src/config/schema/types.ts`

**`src/plugins/example.ts`** 依赖:

- `src/plugins/validation/index.ts`
- `src/plugins/dataProcessing/index.ts`
- `src/plugins/formBehavior/index.ts`

**`src/router/dynamic-router.ts`** 依赖:

- `src/config/schema/types.ts`
- `src/config/schema/config-manager.ts`

**`src/router/guards.ts`** 依赖:

- `src/stores/userStore.ts`
- `src/stores/routeCacheStore.ts`
- `src/utils/performance/index.ts`
- `src/router/preload.ts`
- `src/router/routes.ts`

**`src/router/index.ts`** 依赖:

- `src/router/routes.ts`
- `src/router/guards.ts`

**`src/router/preload.ts`** 依赖:

- `src/router/types.ts`

**`src/router/routes.ts`** 依赖:

- `src/router/types.ts`

**`src/services/apiService.ts`** 依赖:

- `src/api/request.ts`

**`src/services/authService.ts`** 依赖:

- `src/services/apiService.ts`

**`src/services/index.ts`** 依赖:

- `src/services/authService.ts`
- `src/services/apiService.ts`
- `src/services/notificationService.ts`
- `src/services/loadingService.ts`
- `src/services/container.ts`

**`src/services/notificationService.ts`** 依赖:

- `src/utils/message.ts`

**`src/stores/menuStore.ts`** 依赖:

- `src/types/MenuConfig.ts`
- `src/services/apiService.ts`
- `src/utils/errorHandler.ts`

**`src/stores/modules/content/module.ts`** 依赖:

- `src/types/MenuConfig.ts`

**`src/stores/modules/finance/module.ts`** 依赖:

- `src/types/MenuConfig.ts`

**`src/stores/modules/index.ts`** 依赖:

- `src/stores/modules/content/module.ts`
- `src/stores/modules/finance/module.ts`
- `src/stores/modules/order/module.ts`
- `src/stores/modules/product/module.ts`
- `src/stores/modules/user/module.ts`

**`src/stores/modules/order/module.ts`** 依赖:

- `src/types/MenuConfig.ts`

**`src/stores/modules/product/module.ts`** 依赖:

- `src/types/MenuConfig.ts`

**`src/stores/modules/user/module.ts`** 依赖:

- `src/types/MenuConfig.ts`

**`src/stores/tableStore.ts`** 依赖:

- `src/types/TableConfig.ts`
- `src/services/apiService.ts`
- `src/types/MenuConfig.ts`
- `src/utils/errorHandler.ts`
- `src/utils/message.ts`

**`src/stores/userStore.ts`** 依赖:

- `src/services/apiService.ts`

**`src/types/MenuConfig.ts`** 依赖:

- `src/types/FormConfig.ts`
- `src/types/TableConfig.ts`

**`src/utils/cache/Cache.ts`** 依赖:

- `src/utils/cache/types.ts`

**`src/utils/cache/cacheUtils.ts`** 依赖:

- `src/utils/cache/Cache.ts`

**`src/utils/cache/instances.ts`** 依赖:

- `src/utils/cache/Cache.ts`

**`src/utils/errorHandler.ts`** 依赖:

- `src/utils/message.ts`

**`src/utils/keyboardShortcuts.ts`** 依赖:

- `src/utils/performance/index.ts`

**`src/utils/performance/index.ts`** 依赖:

- `src/utils/performance/monitor.ts`
- `src/utils/performance/types.ts`

**`src/utils/performance/monitor.ts`** 依赖:

- `src/utils/performance/types.ts`
- `src/utils/performance/navigation.ts`
- `src/utils/performance/paint.ts`
- `src/utils/performance/webVitals.ts`
- `src/utils/performance/resource.ts`

**`src/utils/performance/navigation.ts`** 依赖:

- `src/utils/performance/types.ts`

**`src/utils/performance/paint.ts`** 依赖:

- `src/utils/performance/types.ts`

**`src/utils/performance/resource.ts`** 依赖:

- `src/utils/performance/types.ts`

**`src/utils/performance/webVitals.ts`** 依赖:

- `src/utils/performance/types.ts`

**`src/utils/validationRules.ts`** 依赖:

- `src/plugins/validation/index.ts`

---

## 2. 关键组件分析

### 2.1 统计概览

| 类别 | 数量 |
|------|------|
| Vue组件 | 17 |
| Composables | 13 |
| Stores | 6 |
| Services | 4 |
| 平均复杂度 | 11.1 |

### 2.2 Vue组件

| 组件名称 | 文件路径 | 复杂度 | 行数 |
|----------|----------|--------|------|
| App | `src/App.vue` | 2 | 52 |
| OrderStatusChart | `src/components/charts/OrderStatusChart.vue` | 8 | 131 |
| SalesChart | `src/components/charts/SalesChart.vue` | 10 | 172 |
| UserGrowthChart | `src/components/charts/UserGrowthChart.vue` | 8 | 142 |
| EmptyState | `src/components/common/EmptyState.vue` | 2 | 30 |
| StatCard | `src/components/common/StatCard.vue` | 9 | 62 |
| FormComponent | `src/components/form/FormComponent.vue` | 73 | 378 |
| Breadcrumb | `src/components/layout/Breadcrumb.vue` | 3 | 29 |
| MainLayout | `src/components/layout/MainLayout.vue` | 6 | 146 |
| Sidebar | `src/components/layout/Sidebar.vue` | 8 | 123 |
| TopNav | `src/components/layout/TopNav.vue` | 12 | 159 |
| TableComponent | `src/components/table/TableComponent.vue` | 48 | 382 |
| Dashboard | `src/views/Dashboard.vue` | 19 | 395 |
| Login | `src/views/Login.vue` | 19 | 147 |
| MenuPage | `src/views/MenuPage.vue` | 31 | 348 |
| ModulePage | `src/views/ModulePage.vue` | 29 | 276 |
| NotFound | `src/views/NotFound.vue` | 1 | 24 |

### 2.3 Composables

| 名称 | 文件路径 | 复杂度 | 行数 |
|------|----------|--------|------|
| useAccessibility | `src/composables/useAccessibility.ts` | 18 | 155 |
| useApi | `src/composables/useApi.ts` | 10 | 144 |
| useMenuNav | `src/composables/useMenuNav.ts` | 7 | 136 |
| useModuleActions | `src/composables/useModuleActions.ts` | 20 | 192 |
| useModuleConfig | `src/composables/useModuleConfig.ts` | 9 | 85 |
| useResponsive | `src/composables/useResponsive.ts` | 2 | 95 |
| useTable | `src/composables/useTable.ts` | 11 | 171 |
| useUser | `src/composables/useUser.ts` | 4 | 98 |
| user | `src/config/modules/user.ts` | 9 | 137 |
| user | `src/mock/modules/user.ts` | 0 | 13 |
| userStore | `src/stores/userStore.ts` | 5 | 132 |
| useApi.test | `tests/unit/useApi.test.ts` | 21 | 214 |
| userStore.test | `tests/unit/userStore.test.ts` | 2 | 174 |

### 2.4 最复杂的组件

| 排名 | 组件名称 |
|------|----------|
| 1 | FormComponent |
| 2 | TableComponent |
| 3 | MenuPage |
| 4 | ModulePage |
| 5 | useApi.test |

### 2.5 组件调用关系

**App**

- 依赖: themeStore

**OrderStatusChart**

- 依赖: lazyLoad

**SalesChart**

- 依赖: lazyLoad

**UserGrowthChart**

- 依赖: lazyLoad

**StatCard**

- 被依赖: Dashboard

**FormComponent**

- 依赖: FormConfig, debounceThrottle, validationRules
- 被依赖: MenuPage, ModulePage

**MainLayout**

- 依赖: Sidebar.vue, TopNav.vue, routeCacheStore, debounceThrottle

**Sidebar**

- 依赖: menuStore
- 被依赖: MainLayout

**TopNav**

- 被依赖: MainLayout

**TableComponent**

- 依赖: lazyLoad, message, TableConfig
- 被依赖: MenuPage, ModulePage

**Dashboard**

- 依赖: lazyLoad, themeStore, StatCard.vue

**MenuPage**

- 依赖: menuStore, tableStore, useTable, FormComponent.vue, TableComponent.vue

**ModulePage**

- 依赖: useModuleConfig, useModuleActions, FormComponent.vue, TableComponent.vue

**useApi**

- 依赖: apiService, notificationService
- 被依赖: useApi.test

**useMenuNav**

- 依赖: menuStore, message

**useModuleActions**

- 依赖: plugin-registry, dynamicApi
- 被依赖: ModulePage

**useModuleConfig**

- 依赖: config-manager
- 被依赖: ModulePage

**useResponsive**

- 依赖: debounceThrottle

**useTable**

- 依赖: menuStore, tableStore, TableConfig
- 被依赖: MenuPage

**useUser**

- 依赖: userStore, authService

**user**

- 依赖: types

**userStore**

- 依赖: apiService
- 被依赖: useUser

**useApi.test**

- 依赖: useApi, apiService, notificationService

**menuStore**

- 依赖: MenuConfig, apiService, errorHandler
- 被依赖: Sidebar, MenuPage, useMenuNav, useTable

**routeCacheStore**

- 被依赖: MainLayout

**tableStore**

- 依赖: TableConfig, apiService, MenuConfig, errorHandler, message
- 被依赖: MenuPage, useTable

**themeStore**

- 被依赖: App, Dashboard

**userStore**

- 依赖: apiService

**apiService**

- 依赖: request
- 被依赖: useApi, userStore, useApi.test, menuStore, tableStore, authService

**authService**

- 依赖: apiService
- 被依赖: useUser

**notificationService**

- 依赖: message
- 被依赖: useApi, useApi.test

---

## 3. 代码编码风格分析

### 3.1 统计概览

| 指标 | 数值 |
|------|------|
| 分析文件数 | 129 |
| 问题总数 | 265 |
| 错误数 | 0 |
| 警告数 | 163 |
| 提示数 | 102 |
| 注释覆盖率 | 0.26% |
| 平均行长度 | 120 |
| 合规率 | 97.95% |

### 3.2 问题详情

#### 注释覆盖率

| 文件 | 行 | 列 | 消息 |
|------|----|----|------|
| `scripts/analyze-project.ts` | 1 | 1 | ℹ️ 注释覆盖率低于5% (当前: 0.0%) |
| `src/api/dynamicApi.ts` | 1 | 1 | ℹ️ 注释覆盖率低于5% (当前: 1.3%) |
| `src/api/menu.ts` | 1 | 1 | ℹ️ 注释覆盖率低于5% (当前: 0.0%) |
| `src/api/request.ts` | 1 | 1 | ℹ️ 注释覆盖率低于5% (当前: 3.9%) |
| `src/api/uploadApi.ts` | 1 | 1 | ℹ️ 注释覆盖率低于5% (当前: 0.0%) |
| `src/components/registry.ts` | 1 | 1 | ℹ️ 注释覆盖率低于5% (当前: 0.0%) |
| `src/composables/useModuleActions.ts` | 1 | 1 | ℹ️ 注释覆盖率低于5% (当前: 0.0%) |
| `src/composables/useModuleConfig.ts` | 1 | 1 | ℹ️ 注释覆盖率低于5% (当前: 0.0%) |
| `src/config/index.ts` | 1 | 1 | ℹ️ 注释覆盖率低于5% (当前: 0.0%) |
| `src/config/modules/index.ts` | 1 | 1 | ℹ️ 注释覆盖率低于5% (当前: 0.0%) |
| `src/config/modules/order.ts` | 1 | 1 | ℹ️ 注释覆盖率低于5% (当前: 0.0%) |
| `src/config/modules/product.ts` | 1 | 1 | ℹ️ 注释覆盖率低于5% (当前: 0.0%) |
| `src/config/modules/user.ts` | 1 | 1 | ℹ️ 注释覆盖率低于5% (当前: 0.0%) |
| `src/config/schema/config-manager.ts` | 1 | 1 | ℹ️ 注释覆盖率低于5% (当前: 0.0%) |
| `src/config/schema/index.ts` | 1 | 1 | ℹ️ 注释覆盖率低于5% (当前: 0.0%) |
| `src/config/schema/types.ts` | 1 | 1 | ℹ️ 注释覆盖率低于5% (当前: 0.0%) |
| `src/config/schema/validator.ts` | 1 | 1 | ℹ️ 注释覆盖率低于5% (当前: 0.0%) |
| `src/locales/en-US.ts` | 1 | 1 | ℹ️ 注释覆盖率低于5% (当前: 0.0%) |
| `src/locales/index.ts` | 1 | 1 | ℹ️ 注释覆盖率低于5% (当前: 0.0%) |
| `src/locales/zh-CN.ts` | 1 | 1 | ℹ️ 注释覆盖率低于5% (当前: 0.0%) |
| `src/main.ts` | 1 | 1 | ℹ️ 注释覆盖率低于5% (当前: 0.0%) |
| `src/mock/index.ts` | 1 | 1 | ℹ️ 注释覆盖率低于5% (当前: 0.0%) |
| `src/mock/menu.ts` | 1 | 1 | ℹ️ 注释覆盖率低于5% (当前: 0.0%) |
| `src/mock/modules/content.ts` | 1 | 1 | ℹ️ 注释覆盖率低于5% (当前: 0.0%) |
| `src/mock/modules/finance.ts` | 1 | 1 | ℹ️ 注释覆盖率低于5% (当前: 0.0%) |
| `src/mock/modules/index.ts` | 1 | 1 | ℹ️ 注释覆盖率低于5% (当前: 0.0%) |
| `src/mock/modules/order.ts` | 1 | 1 | ℹ️ 注释覆盖率低于5% (当前: 0.0%) |
| `src/mock/modules/product.ts` | 1 | 1 | ℹ️ 注释覆盖率低于5% (当前: 0.0%) |
| `src/mock/modules/user.ts` | 1 | 1 | ℹ️ 注释覆盖率低于5% (当前: 0.0%) |
| `src/mock/utils.ts` | 1 | 1 | ℹ️ 注释覆盖率低于5% (当前: 0.0%) |
| `src/plugins/core/index.ts` | 1 | 1 | ℹ️ 注释覆盖率低于5% (当前: 0.0%) |
| `src/plugins/core/plugin-registry.ts` | 1 | 1 | ℹ️ 注释覆盖率低于5% (当前: 0.0%) |
| `src/router/dynamic-router.ts` | 1 | 1 | ℹ️ 注释覆盖率低于5% (当前: 0.0%) |
| `src/router/routes.ts` | 1 | 1 | ℹ️ 注释覆盖率低于5% (当前: 0.0%) |
| `src/router/types.ts` | 1 | 1 | ℹ️ 注释覆盖率低于5% (当前: 0.0%) |
| `src/services/container.ts` | 1 | 1 | ℹ️ 注释覆盖率低于5% (当前: 0.0%) |
| `src/services/index.ts` | 1 | 1 | ℹ️ 注释覆盖率低于5% (当前: 0.0%) |
| `src/stores/cacheStore.ts` | 1 | 1 | ℹ️ 注释覆盖率低于5% (当前: 0.0%) |
| `src/stores/menuStore.ts` | 1 | 1 | ℹ️ 注释覆盖率低于5% (当前: 0.0%) |
| `src/stores/modules/content/module.ts` | 1 | 1 | ℹ️ 注释覆盖率低于5% (当前: 0.0%) |
| `src/stores/modules/finance/module.ts` | 1 | 1 | ℹ️ 注释覆盖率低于5% (当前: 0.0%) |
| `src/stores/modules/order/module.ts` | 1 | 1 | ℹ️ 注释覆盖率低于5% (当前: 0.0%) |
| `src/stores/modules/product/module.ts` | 1 | 1 | ℹ️ 注释覆盖率低于5% (当前: 0.0%) |
| `src/stores/modules/user/module.ts` | 1 | 1 | ℹ️ 注释覆盖率低于5% (当前: 0.0%) |
| `src/stores/routeCacheStore.ts` | 1 | 1 | ℹ️ 注释覆盖率低于5% (当前: 0.0%) |
| `src/stores/tableStore.ts` | 1 | 1 | ℹ️ 注释覆盖率低于5% (当前: 0.0%) |
| `src/stores/themeStore.ts` | 1 | 1 | ℹ️ 注释覆盖率低于5% (当前: 0.0%) |
| `src/types/FormConfig.ts` | 1 | 1 | ℹ️ 注释覆盖率低于5% (当前: 0.0%) |
| `src/types/MenuConfig.ts` | 1 | 1 | ℹ️ 注释覆盖率低于5% (当前: 0.0%) |
| `src/types/RouterConfig.ts` | 1 | 1 | ℹ️ 注释覆盖率低于5% (当前: 0.0%) |
| `src/types/TableConfig.ts` | 1 | 1 | ℹ️ 注释覆盖率低于5% (当前: 0.0%) |
| `src/types/analysis.ts` | 1 | 1 | ℹ️ 注释覆盖率低于5% (当前: 0.0%) |
| `src/utils/analysis/componentAnalyzer.ts` | 1 | 1 | ℹ️ 注释覆盖率低于5% (当前: 0.0%) |
| `src/utils/analysis/dependencyAnalyzer.ts` | 1 | 1 | ℹ️ 注释覆盖率低于5% (当前: 0.0%) |
| `src/utils/analysis/index.ts` | 1 | 1 | ℹ️ 注释覆盖率低于5% (当前: 0.0%) |
| `src/utils/analysis/projectAnalyzer.ts` | 1 | 1 | ℹ️ 注释覆盖率低于5% (当前: 0.0%) |
| `src/utils/analysis/reportGenerator.ts` | 1 | 1 | ℹ️ 注释覆盖率低于5% (当前: 0.0%) |
| `src/utils/analysis/styleAnalyzer.ts` | 1 | 1 | ℹ️ 注释覆盖率低于5% (当前: 0.0%) |
| `src/utils/cache/Cache.ts` | 1 | 1 | ℹ️ 注释覆盖率低于5% (当前: 0.0%) |
| `src/utils/cache/cacheUtils.ts` | 1 | 1 | ℹ️ 注释覆盖率低于5% (当前: 0.0%) |
| `src/utils/cache/index.ts` | 1 | 1 | ℹ️ 注释覆盖率低于5% (当前: 0.0%) |
| `src/utils/cache/instances.ts` | 1 | 1 | ℹ️ 注释覆盖率低于5% (当前: 0.0%) |
| `src/utils/cache/types.ts` | 1 | 1 | ℹ️ 注释覆盖率低于5% (当前: 0.0%) |
| `src/utils/cache.ts` | 1 | 1 | ℹ️ 注释覆盖率低于5% (当前: 0.0%) |
| `src/utils/componentRegistry.ts` | 1 | 1 | ℹ️ 注释覆盖率低于5% (当前: 0.0%) |
| `src/utils/debounceThrottle.ts` | 1 | 1 | ℹ️ 注释覆盖率低于5% (当前: 4.8%) |
| `src/utils/expressionParser.ts` | 1 | 1 | ℹ️ 注释覆盖率低于5% (当前: 0.0%) |
| `src/utils/loading.ts` | 1 | 1 | ℹ️ 注释覆盖率低于5% (当前: 0.0%) |
| `src/utils/message.ts` | 1 | 1 | ℹ️ 注释覆盖率低于5% (当前: 0.0%) |
| `src/utils/performance/index.ts` | 1 | 1 | ℹ️ 注释覆盖率低于5% (当前: 0.0%) |
| `src/utils/performance/monitor.ts` | 1 | 1 | ℹ️ 注释覆盖率低于5% (当前: 0.0%) |
| `src/utils/performance/navigation.ts` | 1 | 1 | ℹ️ 注释覆盖率低于5% (当前: 0.0%) |
| `src/utils/performance/paint.ts` | 1 | 1 | ℹ️ 注释覆盖率低于5% (当前: 0.0%) |
| `src/utils/performance/resource.ts` | 1 | 1 | ℹ️ 注释覆盖率低于5% (当前: 0.0%) |
| `src/utils/performance/types.ts` | 1 | 1 | ℹ️ 注释覆盖率低于5% (当前: 0.0%) |
| `src/utils/performance/webVitals.ts` | 1 | 1 | ℹ️ 注释覆盖率低于5% (当前: 4.9%) |
| `src/utils/validationRules.ts` | 1 | 1 | ℹ️ 注释覆盖率低于5% (当前: 0.0%) |
| `src/vite-env.d.ts` | 1 | 1 | ℹ️ 注释覆盖率低于5% (当前: 3.6%) |
| `tests/unit/cache.test.ts` | 1 | 1 | ℹ️ 注释覆盖率低于5% (当前: 0.0%) |
| `tests/unit/debounceThrottle.test.ts` | 1 | 1 | ℹ️ 注释覆盖率低于5% (当前: 0.0%) |
| `tests/unit/errorHandler.test.ts` | 1 | 1 | ℹ️ 注释覆盖率低于5% (当前: 0.0%) |
| `tests/unit/useApi.test.ts` | 1 | 1 | ℹ️ 注释覆盖率低于5% (当前: 1.9%) |
| `tests/unit/validationRules.test.ts` | 1 | 1 | ℹ️ 注释覆盖率低于5% (当前: 0.0%) |
| `uno.config.ts` | 1 | 1 | ℹ️ 注释覆盖率低于5% (当前: 0.0%) |
| `vitest.config.ts` | 1 | 1 | ℹ️ 注释覆盖率低于5% (当前: 0.0%) |
| `src/App.vue` | 1 | 1 | ℹ️ 注释覆盖率低于5% (当前: 0.0%) |
| `src/components/charts/OrderStatusChart.vue` | 1 | 1 | ℹ️ 注释覆盖率低于5% (当前: 0.0%) |
| `src/components/charts/SalesChart.vue` | 1 | 1 | ℹ️ 注释覆盖率低于5% (当前: 0.0%) |
| `src/components/charts/UserGrowthChart.vue` | 1 | 1 | ℹ️ 注释覆盖率低于5% (当前: 0.0%) |
| `src/components/common/EmptyState.vue` | 1 | 1 | ℹ️ 注释覆盖率低于5% (当前: 0.0%) |
| `src/components/common/StatCard.vue` | 1 | 1 | ℹ️ 注释覆盖率低于5% (当前: 0.0%) |
| `src/components/form/FormComponent.vue` | 1 | 1 | ℹ️ 注释覆盖率低于5% (当前: 2.1%) |
| `src/components/layout/Breadcrumb.vue` | 1 | 1 | ℹ️ 注释覆盖率低于5% (当前: 0.0%) |
| `src/components/layout/MainLayout.vue` | 1 | 1 | ℹ️ 注释覆盖率低于5% (当前: 4.0%) |
| `src/components/layout/Sidebar.vue` | 1 | 1 | ℹ️ 注释覆盖率低于5% (当前: 0.0%) |
| `src/components/layout/TopNav.vue` | 1 | 1 | ℹ️ 注释覆盖率低于5% (当前: 0.0%) |
| `src/components/table/TableComponent.vue` | 1 | 1 | ℹ️ 注释覆盖率低于5% (当前: 0.3%) |
| `src/views/Dashboard.vue` | 1 | 1 | ℹ️ 注释覆盖率低于5% (当前: 0.0%) |
| `src/views/Login.vue` | 1 | 1 | ℹ️ 注释覆盖率低于5% (当前: 0.0%) |
| `src/views/MenuPage.vue` | 1 | 1 | ℹ️ 注释覆盖率低于5% (当前: 0.0%) |
| `src/views/ModulePage.vue` | 1 | 1 | ℹ️ 注释覆盖率低于5% (当前: 0.0%) |
| `src/views/NotFound.vue` | 1 | 1 | ℹ️ 注释覆盖率低于5% (当前: 0.0%) |

#### 行尾空格

| 文件 | 行 | 列 | 消息 |
|------|----|----|------|
| `src/composables/useAccessibility.ts` | 7 | 3 | ⚠️ 行尾存在多余空格 |
| `src/composables/useAccessibility.ts` | 108 | 81 | ⚠️ 行尾存在多余空格 |
| `src/composables/useApi.ts` | 27 | 3 | ⚠️ 行尾存在多余空格 |
| `src/composables/useMenuNav.ts` | 34 | 3 | ⚠️ 行尾存在多余空格 |
| `src/composables/useResponsive.ts` | 10 | 3 | ⚠️ 行尾存在多余空格 |
| `src/composables/useTable.ts` | 53 | 3 | ⚠️ 行尾存在多余空格 |
| `src/composables/useUser.ts` | 11 | 3 | ⚠️ 行尾存在多余空格 |
| `src/config/modules/order.ts` | 9 | 2 | ⚠️ 行尾存在多余空格 |
| `src/config/modules/order.ts` | 17 | 2 | ⚠️ 行尾存在多余空格 |
| `src/config/modules/order.ts` | 43 | 2 | ⚠️ 行尾存在多余空格 |
| `src/config/modules/order.ts` | 99 | 2 | ⚠️ 行尾存在多余空格 |
| `src/config/modules/order.ts` | 120 | 2 | ⚠️ 行尾存在多余空格 |
| `src/config/modules/order.ts` | 129 | 2 | ⚠️ 行尾存在多余空格 |
| `src/config/modules/product.ts` | 9 | 2 | ⚠️ 行尾存在多余空格 |
| `src/config/modules/product.ts` | 17 | 2 | ⚠️ 行尾存在多余空格 |
| `src/config/modules/product.ts` | 41 | 2 | ⚠️ 行尾存在多余空格 |
| `src/config/modules/product.ts` | 87 | 2 | ⚠️ 行尾存在多余空格 |
| `src/config/modules/product.ts` | 100 | 2 | ⚠️ 行尾存在多余空格 |
| `src/config/modules/product.ts` | 109 | 2 | ⚠️ 行尾存在多余空格 |
| `src/config/modules/user.ts` | 9 | 2 | ⚠️ 行尾存在多余空格 |
| `src/config/modules/user.ts` | 17 | 2 | ⚠️ 行尾存在多余空格 |
| `src/config/modules/user.ts` | 24 | 8 | ⚠️ 行尾存在多余空格 |
| `src/config/modules/user.ts` | 25 | 24 | ⚠️ 行尾存在多余空格 |
| `src/config/modules/user.ts` | 26 | 25 | ⚠️ 行尾存在多余空格 |
| `src/config/modules/user.ts` | 49 | 2 | ⚠️ 行尾存在多余空格 |
| `src/config/modules/user.ts` | 100 | 2 | ⚠️ 行尾存在多余空格 |
| `src/config/modules/user.ts` | 118 | 2 | ⚠️ 行尾存在多余空格 |
| `src/config/modules/user.ts` | 127 | 2 | ⚠️ 行尾存在多余空格 |
| `src/config/modules/user.ts` | 131 | 2 | ⚠️ 行尾存在多余空格 |
| `src/config/schema/types.ts` | 83 | 2 | ⚠️ 行尾存在多余空格 |
| `src/config/schema/types.ts` | 90 | 2 | ⚠️ 行尾存在多余空格 |
| `src/types/analysis.ts` | 95 | 24 | ⚠️ 行尾存在多余空格 |
| `src/utils/analysis/componentAnalyzer.ts` | 44 | 4 | ⚠️ 行尾存在多余空格 |
| `src/utils/analysis/componentAnalyzer.ts` | 48 | 6 | ⚠️ 行尾存在多余空格 |
| `src/utils/analysis/componentAnalyzer.ts` | 70 | 4 | ⚠️ 行尾存在多余空格 |
| `src/utils/analysis/componentAnalyzer.ts` | 75 | 6 | ⚠️ 行尾存在多余空格 |
| `src/utils/analysis/componentAnalyzer.ts` | 90 | 4 | ⚠️ 行尾存在多余空格 |
| `src/utils/analysis/componentAnalyzer.ts` | 95 | 6 | ⚠️ 行尾存在多余空格 |
| `src/utils/analysis/componentAnalyzer.ts` | 110 | 4 | ⚠️ 行尾存在多余空格 |
| `src/utils/analysis/componentAnalyzer.ts` | 115 | 6 | ⚠️ 行尾存在多余空格 |
| `src/utils/analysis/componentAnalyzer.ts` | 171 | 4 | ⚠️ 行尾存在多余空格 |
| `src/utils/analysis/componentAnalyzer.ts` | 182 | 6 | ⚠️ 行尾存在多余空格 |
| `src/utils/analysis/componentAnalyzer.ts` | 213 | 4 | ⚠️ 行尾存在多余空格 |
| `src/utils/analysis/componentAnalyzer.ts` | 223 | 4 | ⚠️ 行尾存在多余空格 |
| `src/utils/analysis/componentAnalyzer.ts` | 230 | 4 | ⚠️ 行尾存在多余空格 |
| `src/utils/analysis/componentAnalyzer.ts` | 232 | 82 | ⚠️ 行尾存在多余空格 |
| `src/utils/analysis/componentAnalyzer.ts` | 237 | 4 | ⚠️ 行尾存在多余空格 |
| `src/utils/analysis/componentAnalyzer.ts` | 243 | 4 | ⚠️ 行尾存在多余空格 |
| `src/utils/analysis/componentAnalyzer.ts` | 246 | 54 | ⚠️ 行尾存在多余空格 |
| `src/utils/analysis/componentAnalyzer.ts` | 249 | 8 | ⚠️ 行尾存在多余空格 |
| `src/utils/analysis/componentAnalyzer.ts` | 260 | 4 | ⚠️ 行尾存在多余空格 |
| `src/utils/analysis/componentAnalyzer.ts` | 263 | 54 | ⚠️ 行尾存在多余空格 |
| `src/utils/analysis/componentAnalyzer.ts` | 266 | 8 | ⚠️ 行尾存在多余空格 |
| `src/utils/analysis/componentAnalyzer.ts` | 300 | 4 | ⚠️ 行尾存在多余空格 |
| `src/utils/analysis/dependencyAnalyzer.ts` | 38 | 63 | ⚠️ 行尾存在多余空格 |
| `src/utils/analysis/dependencyAnalyzer.ts` | 115 | 48 | ⚠️ 行尾存在多余空格 |
| `src/utils/analysis/dependencyAnalyzer.ts` | 154 | 6 | ⚠️ 行尾存在多余空格 |
| `src/utils/analysis/dependencyAnalyzer.ts` | 188 | 6 | ⚠️ 行尾存在多余空格 |
| `src/utils/analysis/dependencyAnalyzer.ts` | 206 | 4 | ⚠️ 行尾存在多余空格 |
| `src/utils/analysis/dependencyAnalyzer.ts` | 221 | 55 | ⚠️ 行尾存在多余空格 |
| `src/utils/analysis/dependencyAnalyzer.ts` | 222 | 71 | ⚠️ 行尾存在多余空格 |
| `src/utils/analysis/projectAnalyzer.ts` | 19 | 4 | ⚠️ 行尾存在多余空格 |
| `src/utils/analysis/reportGenerator.ts` | 180 | 6 | ⚠️ 行尾存在多余空格 |
| `src/utils/analysis/styleAnalyzer.ts` | 22 | 4 | ⚠️ 行尾存在多余空格 |
| `src/utils/analysis/styleAnalyzer.ts` | 168 | 4 | ⚠️ 行尾存在多余空格 |
| `src/utils/analysis/styleAnalyzer.ts` | 178 | 4 | ⚠️ 行尾存在多余空格 |
| `src/utils/analysis/styleAnalyzer.ts` | 188 | 4 | ⚠️ 行尾存在多余空格 |
| `src/utils/analysis/styleAnalyzer.ts` | 198 | 4 | ⚠️ 行尾存在多余空格 |
| `src/utils/analysis/styleAnalyzer.ts` | 208 | 4 | ⚠️ 行尾存在多余空格 |
| `src/utils/analysis/styleAnalyzer.ts` | 267 | 4 | ⚠️ 行尾存在多余空格 |
| `src/utils/analysis/styleAnalyzer.ts` | 268 | 42 | ⚠️ 行尾存在多余空格 |
| `src/utils/analysis/styleAnalyzer.ts` | 287 | 4 | ⚠️ 行尾存在多余空格 |
| `src/utils/analysis/styleAnalyzer.ts` | 289 | 4 | ⚠️ 行尾存在多余空格 |
| `src/utils/analysis/styleAnalyzer.ts` | 296 | 4 | ⚠️ 行尾存在多余空格 |
| `src/utils/analysis/styleAnalyzer.ts` | 303 | 4 | ⚠️ 行尾存在多余空格 |
| `src/utils/analysis/styleAnalyzer.ts` | 305 | 4 | ⚠️ 行尾存在多余空格 |
| `src/utils/analysis/styleAnalyzer.ts` | 312 | 4 | ⚠️ 行尾存在多余空格 |
| `src/utils/debounceThrottle.ts` | 13 | 3 | ⚠️ 行尾存在多余空格 |
| `src/utils/debounceThrottle.ts` | 62 | 3 | ⚠️ 行尾存在多余空格 |
| `src/utils/debounceThrottle.ts` | 112 | 3 | ⚠️ 行尾存在多余空格 |
| `src/utils/debounceThrottle.ts` | 116 | 3 | ⚠️ 行尾存在多余空格 |
| `src/utils/debounceThrottle.ts` | 198 | 3 | ⚠️ 行尾存在多余空格 |
| `src/utils/errorHandler.ts` | 36 | 3 | ⚠️ 行尾存在多余空格 |
| `src/utils/errorHandler.ts` | 227 | 3 | ⚠️ 行尾存在多余空格 |
| `src/utils/errorHandler.ts` | 262 | 3 | ⚠️ 行尾存在多余空格 |
| `src/utils/errorHandler.ts` | 285 | 3 | ⚠️ 行尾存在多余空格 |
| `src/utils/keyboardShortcuts.ts` | 22 | 3 | ⚠️ 行尾存在多余空格 |
| `src/utils/keyboardShortcuts.ts` | 27 | 3 | ⚠️ 行尾存在多余空格 |
| `src/utils/keyboardShortcuts.ts` | 131 | 3 | ⚠️ 行尾存在多余空格 |
| `tests/unit/useApi.test.ts` | 24 | 4 | ⚠️ 行尾存在多余空格 |
| `tests/unit/useApi.test.ts` | 36 | 4 | ⚠️ 行尾存在多余空格 |
| `tests/unit/useApi.test.ts` | 41 | 4 | ⚠️ 行尾存在多余空格 |
| `tests/unit/useApi.test.ts` | 43 | 4 | ⚠️ 行尾存在多余空格 |
| `tests/unit/useApi.test.ts` | 58 | 4 | ⚠️ 行尾存在多余空格 |
| `tests/unit/useApi.test.ts` | 62 | 4 | ⚠️ 行尾存在多余空格 |
| `tests/unit/useApi.test.ts` | 64 | 4 | ⚠️ 行尾存在多余空格 |
| `tests/unit/useApi.test.ts` | 78 | 4 | ⚠️ 行尾存在多余空格 |
| `tests/unit/useApi.test.ts` | 83 | 4 | ⚠️ 行尾存在多余空格 |
| `tests/unit/useApi.test.ts` | 85 | 4 | ⚠️ 行尾存在多余空格 |
| `tests/unit/useApi.test.ts` | 98 | 4 | ⚠️ 行尾存在多余空格 |
| `tests/unit/useApi.test.ts` | 100 | 4 | ⚠️ 行尾存在多余空格 |
| `tests/unit/useApi.test.ts` | 114 | 4 | ⚠️ 行尾存在多余空格 |
| `tests/unit/useApi.test.ts` | 118 | 30 | ⚠️ 行尾存在多余空格 |
| `tests/unit/useApi.test.ts` | 119 | 25 | ⚠️ 行尾存在多余空格 |
| `tests/unit/useApi.test.ts` | 122 | 4 | ⚠️ 行尾存在多余空格 |
| `tests/unit/useApi.test.ts` | 124 | 4 | ⚠️ 行尾存在多余空格 |
| `tests/unit/useApi.test.ts` | 134 | 4 | ⚠️ 行尾存在多余空格 |
| `tests/unit/useApi.test.ts` | 138 | 30 | ⚠️ 行尾存在多余空格 |
| `tests/unit/useApi.test.ts` | 141 | 4 | ⚠️ 行尾存在多余空格 |
| `tests/unit/useApi.test.ts` | 143 | 4 | ⚠️ 行尾存在多余空格 |
| `tests/unit/useApi.test.ts` | 153 | 4 | ⚠️ 行尾存在多余空格 |
| `tests/unit/useApi.test.ts` | 158 | 4 | ⚠️ 行尾存在多余空格 |
| `tests/unit/useApi.test.ts` | 160 | 4 | ⚠️ 行尾存在多余空格 |
| `tests/unit/useApi.test.ts` | 170 | 4 | ⚠️ 行尾存在多余空格 |
| `tests/unit/useApi.test.ts` | 175 | 4 | ⚠️ 行尾存在多余空格 |
| `tests/unit/useApi.test.ts` | 177 | 4 | ⚠️ 行尾存在多余空格 |
| `tests/unit/useApi.test.ts` | 183 | 4 | ⚠️ 行尾存在多余空格 |
| `tests/unit/useApi.test.ts` | 188 | 4 | ⚠️ 行尾存在多余空格 |
| `tests/unit/useApi.test.ts` | 191 | 4 | ⚠️ 行尾存在多余空格 |
| `tests/unit/useApi.test.ts` | 203 | 4 | ⚠️ 行尾存在多余空格 |
| `tests/unit/useApi.test.ts` | 207 | 4 | ⚠️ 行尾存在多余空格 |
| `tests/unit/useApi.test.ts` | 209 | 4 | ⚠️ 行尾存在多余空格 |
| `tests/unit/userStore.test.ts` | 30 | 4 | ⚠️ 行尾存在多余空格 |
| `tests/unit/userStore.test.ts` | 33 | 4 | ⚠️ 行尾存在多余空格 |
| `src/components/form/FormComponent.vue` | 130 | 2 | ⚠️ 行尾存在多余空格 |
| `src/components/form/FormComponent.vue` | 133 | 2 | ⚠️ 行尾存在多余空格 |
| `src/components/form/FormComponent.vue` | 140 | 2 | ⚠️ 行尾存在多余空格 |
| `src/components/form/FormComponent.vue` | 147 | 2 | ⚠️ 行尾存在多余空格 |
| `src/components/form/FormComponent.vue` | 152 | 2 | ⚠️ 行尾存在多余空格 |
| `src/components/form/FormComponent.vue` | 352 | 2 | ⚠️ 行尾存在多余空格 |
| `src/components/form/FormComponent.vue` | 359 | 2 | ⚠️ 行尾存在多余空格 |
| `src/views/MenuPage.vue` | 26 | 28 | ⚠️ 行尾存在多余空格 |
| `src/views/MenuPage.vue` | 55 | 23 | ⚠️ 行尾存在多余空格 |
| `src/views/MenuPage.vue` | 122 | 4 | ⚠️ 行尾存在多余空格 |
| `src/views/MenuPage.vue` | 125 | 4 | ⚠️ 行尾存在多余空格 |
| `src/views/MenuPage.vue` | 140 | 4 | ⚠️ 行尾存在多余空格 |
| `src/views/MenuPage.vue` | 143 | 4 | ⚠️ 行尾存在多余空格 |
| `src/views/MenuPage.vue` | 162 | 6 | ⚠️ 行尾存在多余空格 |
| `src/views/MenuPage.vue` | 168 | 4 | ⚠️ 行尾存在多余空格 |
| `src/views/MenuPage.vue` | 174 | 4 | ⚠️ 行尾存在多余空格 |

#### 行长度

| 文件 | 行 | 列 | 消息 |
|------|----|----|------|
| `src/mock/modules/content.ts` | 13 | 121 | ⚠️ 行长度超过120字符 (当前: 134) |
| `src/mock/modules/content.ts` | 14 | 121 | ⚠️ 行长度超过120字符 (当前: 133) |
| `src/mock/modules/content.ts` | 15 | 121 | ⚠️ 行长度超过120字符 (当前: 128) |
| `src/mock/modules/content.ts` | 18 | 121 | ⚠️ 行长度超过120字符 (当前: 139) |
| `src/mock/modules/content.ts` | 19 | 121 | ⚠️ 行长度超过120字符 (当前: 136) |
| `src/mock/modules/content.ts` | 20 | 121 | ⚠️ 行长度超过120字符 (当前: 136) |
| `src/mock/modules/finance.ts` | 13 | 121 | ⚠️ 行长度超过120字符 (当前: 132) |
| `src/mock/modules/finance.ts` | 14 | 121 | ⚠️ 行长度超过120字符 (当前: 132) |
| `src/mock/modules/finance.ts` | 15 | 121 | ⚠️ 行长度超过120字符 (当前: 128) |
| `src/mock/modules/order.ts` | 3 | 121 | ⚠️ 行长度超过120字符 (当前: 130) |
| `src/mock/modules/order.ts` | 4 | 121 | ⚠️ 行长度超过120字符 (当前: 130) |
| `src/mock/modules/order.ts` | 5 | 121 | ⚠️ 行长度超过120字符 (当前: 130) |
| `src/mock/modules/order.ts` | 13 | 121 | ⚠️ 行长度超过120字符 (当前: 132) |
| `src/mock/modules/order.ts` | 14 | 121 | ⚠️ 行长度超过120字符 (当前: 129) |
| `src/mock/modules/order.ts` | 15 | 121 | ⚠️ 行长度超过120字符 (当前: 131) |
| `src/types/FormConfig.ts` | 53 | 121 | ⚠️ 行长度超过120字符 (当前: 173) |
| `src/components/common/StatCard.vue` | 19 | 121 | ⚠️ 行长度超过120字符 (当前: 166) |
| `src/components/layout/MainLayout.vue` | 4 | 121 | ⚠️ 行长度超过120字符 (当前: 158) |
| `src/components/layout/TopNav.vue` | 83 | 121 | ⚠️ 行长度超过120字符 (当前: 161) |
| `src/views/Login.vue` | 9 | 121 | ⚠️ 行长度超过120字符 (当前: 122) |
| `src/views/Login.vue` | 20 | 121 | ⚠️ 行长度超过120字符 (当前: 173) |
| `src/views/Login.vue` | 38 | 121 | ⚠️ 行长度超过120字符 (当前: 121) |

#### 驼峰命名

| 文件 | 行 | 列 | 消息 |
|------|----|----|------|
| `src/utils/errorHandler.ts` | 236 | 1 | ⚠️ 函数名应使用驼峰命名: ErrorBoundary |

---

## 4. 总结与建议

### 4.1 发现的问题

- ⚠️ 部分模块依赖过多（最大 11 个）
- ⚠️ 注释覆盖率较低（0.26%）

### 4.2 优化建议

1. 建议拆分大型模块，降低耦合度
2. 建议为核心函数和复杂逻辑添加注释

### 4.3 核心指标汇总

| 类别 | 指标 | 数值 |
|------|------|------|
| 依赖 | 模块总数 | 99 |
| 依赖 | 循环依赖 | 0 |
| 组件 | Vue组件数 | 17 |
| 组件 | Composables数 | 13 |
| 风格 | 合规率 | 97.95% |
| 风格 | 注释覆盖率 | 0.26% |
