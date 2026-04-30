# mgmt-cli-ebank UI 设计审查报告

**审查日期:** 2026-04-30  
**项目技术栈:** Vue 3 + TypeScript + Ant Design Vue + Tailwind CSS  
**审查依据:** Vercel Web Interface Guidelines

---

## 执行摘要

本报告对 mgmt-cli-ebank 项目的 UI 代码进行了 Web Interface Guidelines 合规性审查。发现 **4 个可优化项** 和 **6 个建议改进**。整体项目遵循了大部分最佳实践，特别是在无障碍和动画方面表现良好。

---

## 详细审查结果

### ✅ 通过项目

| 类别 | 状态 | 说明 |
|------|------|------|
| 跳过链接 | ✅ | [MainLayout.vue:2-7](file:///workspace/mgmt-cli-ebank/src/components/layout/MainLayout.vue#L2-L7) 提供跳过导航 |
| 无障碍标签 | ✅ | 图标按钮使用 aria-label |
| 语义化 HTML | ✅ | 使用 `<button>`、`<router-link>` 而非 `<div onClick>` |
| 减少动画偏好 | ✅ | [Dashboard.vue:123-125](file:///workspace/mgmt-cli-ebank/src/views/Dashboard.vue#L123-L125) 尊重 `prefers-reduced-motion` |
| 页面过渡动画 | ✅ | [MainLayout.vue:112-123](file:///workspace/mgmt-cli-ebank/src/components/layout/MainLayout.vue#L112-L123) 处理 reduce 情况 |
| 数字排版 | ✅ | [Dashboard.vue:98,431](file:///workspace/mgmt-cli-ebank/src/views/Dashboard.vue#L98) 使用 `tabular-nums` |
| 图片懒加载 | ✅ | [Login.vue:22](file:///workspace/mgmt-cli-ebank/src/views/Login.vue#L22) 使用 `loading="lazy"` |
| 空状态处理 | ✅ | [ModulePage.vue:40-50](file:///workspace/mgmt-cli-ebank/src/views/ModulePage.vue#L40-L50) 正确处理空数据 |
| 安全区域 | ✅ | [MainLayout.vue:82-87](file:///workspace/mgmt-cli-ebank/src/components/layout/MainLayout.vue#L82-L87) 支持 iOS safe areas |

---

## 待改进项目

### 1. 表单缺少 autocomplete 属性

| 项目 | 详情 |
|------|------|
| **规则** | Forms - Inputs need `autocomplete` |
| **位置** | [Login.vue:53-71](file:///workspace/mgmt-cli-ebank/src/views/Login.vue#L53-L71) |
| **证据** | ```html<br><a-input v-model:value="loginForm.username" placeholder="请输入用户名" /><br><a-input-password v-model:value="loginForm.password" />``` |
| **影响** | 浏览器无法自动填充/建议用户名和密码，影响用户体验 |
| **修复建议** | ```html<br><a-input<br>  v-model:value="loginForm.username"<br>  placeholder="请输入用户名"<br>  name="username"<br>  autocomplete="username"<br>/><br><a-input-password<br>  v-model:value="loginForm.password"<br>  placeholder="请输入密码"<br>  name="password"<br>  autocomplete="current-password"<br>/>``` |

---

### 2. 图片缺少显式宽高

| 项目 | 详情 |
|------|------|
| **规则** | Images - explicit width/height (prevents CLS) |
| **位置** | [Login.vue:19-24](file:///workspace/mgmt-cli-ebank/src/views/Login.vue#L19-L24) |
| **证据** | ```html<br><img src="..." alt="..." loading="lazy" class="w-full h-64" />``` |
| **影响** | 图片加载时可能导致布局偏移 (CLS) |
| **修复建议** | ```html<br><img<br>  src="..."<br>  alt="..."<br>  loading="lazy"<br>  width="640"<br>  height="360"<br>  class="w-full h-64 object-cover rounded-xl shadow-lg"<br>/>``` |

---

### 3. 交互元素缺少焦点状态

| 项目 | 详情 |
|------|------|
| **规则** | Focus States - visible focus ring |
| **位置** | [TopNav.vue:71-78](file:///workspace/mgmt-cli-ebank/src/components/layout/TopNav.vue#L71-L78) |
| **证据** | ```html<br><a-button type="text" class="...hover:...">``` |
| **影响** | 键盘导航用户无法看清当前焦点位置 |
| **修复建议** | 添加 Tailwind focus ring 类：<br>```html<br><a-button<br>  type="text"<br>  class="...focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"<br>>``` |

---

### 4. 缺少 Date/Time 格式化

| 项目 | 详情 |
|------|------|
| **规则** | Locale & i18n - use Intl.DateTimeFormat |
| **位置** | [TableComponent.vue:223-229](file:///workspace/mgmt-cli-ebank/src/components/table/TableComponent.vue#L223-L229) |
| **证据** | ```typescript<br>const formatDate = (value: any): string => {<br>  if (!value) return '';<br>  if (value instanceof Date) {<br>    return value.toLocaleString();  // ← 硬编码格式<br>  }<br>  return String(value);<br>};``` |
| **影响** | 不同地区用户看到不同格式，且可能与后端格式不一致 |
| **修复建议** | ```typescript<br>const formatDate = (value: any, options?: Intl.DateTimeFormatOptions): string => {<br>  if (!value) return '';<br>  const date = value instanceof Date ? value : new Date(value);<br>  if (isNaN(date.getTime())) return String(value);<br>  return new Intl.DateTimeFormat('zh-CN', {<br>    year: 'numeric',<br>    month: '2-digit',<br>    day: '2-digit',<br>    hour: '2-digit',<br>    minute: '2-digit',<br>    ...options<br>  }).format(date);<br>};``` |

---

## 建议改进项

### 1. 搜索输入缺少 autocomplete

| 位置 | [TopNav.vue:23-34](file:///workspace/mgmt-cli-ebank/src/components/layout/TopNav.vue#L23-L34) |
|------|------|
| 建议 | 添加 `autocomplete="off"` 或 `autocomplete="search"` |

---

### 2. 模态框缺少 overscroll-behavior

| 位置 | [ModulePage.vue:55-75](file:///workspace/mgmt-cli-ebank/src/views/ModulePage.vue#L55-L75) |
|------|------|
| 建议 | 模态框内容添加 `overscroll-behavior: contain` 防止滚动穿透 |

---

### 3. 删除确认对话框缺少焦点管理

| 位置 | [ModulePage.vue:77-97](file:///workspace/mgmt-cli-ebank/src/views/ModulePage.vue#L77-L97) |
|------|------|
| 建议 | 删除操作前应自动聚焦确认按钮，或使用 `auto-focus` |

---

### 4. 日期格式化不一致

| 位置 | [FormComponent.vue:263](file:///workspace/mgmt-cli-ebank/src/components/form/FormComponent.vue#L263) |
|------|------|
| 证据 | `date.toLocaleString('zh-CN')` - 硬编码中文 |
| 建议 | 使用 `Intl.DateTimeFormat` 或 `Intl.DateTimeFormat` 并尊重用户语言偏好 |

---

### 5. 加载状态可添加 aria-live

| 位置 | [TableComponent.vue:42-48](file:///workspace/mgmt-cli-ebank/src/components/table/TableComponent.vue#L42-L48) |
|------|------|
| 建议 | 加载文本添加 `aria-live="polite"` 通知屏幕阅读器 |

---

### 6. 批量操作按钮可增强

| 位置 | [TableComponent.vue:5-20](file:///workspace/mgmt-cli-ebank/src/components/table/TableComponent.vue#L5-L20) |
|------|------|
| 建议 | 批量删除前考虑添加确认步骤或 undo 机制 |

---

## 符合度评分

| 类别 | 评分 | 说明 |
|------|------|------|
| **无障碍 (Accessibility)** | ⭐⭐⭐⭐☆ | 基础无障碍完善，icon 按钮有 aria-label，跳过链接存在 |
| **焦点状态 (Focus States)** | ⭐⭐⭐☆☆ | 有显式焦点样式，但部分按钮缺失 |
| **表单 (Forms)** | ⭐⭐⭐⭐☆ | 验证完善，但缺少 autocomplete |
| **动画 (Animation)** | ⭐⭐⭐⭐⭐ | 完美支持 prefers-reduced-motion |
| **排版 (Typography)** | ⭐⭐⭐⭐⭐ | 正确使用省略号和 tabular-nums |
| **图片 (Images)** | ⭐⭐⭐⭐☆ | 懒加载良好，但缺少显式尺寸 |
| **国际化 (i18n)** | ⭐⭐⭐☆☆ | 日期格式化需使用 Intl API |

---

## 优先改进建议

### P0 (立即改进)
1. **添加表单 autocomplete** - 直接提升用户体验
2. **添加图片宽高** - 提升 Core Web Vitals

### P1 (计划中)
3. **添加焦点 ring** - 提升键盘导航体验
4. **使用 Intl.DateTimeFormat** - 统一日期格式

### P2 (可选)
5. **添加 aria-live 到加载状态**
6. **处理模态框 overscroll-behavior**

---

## 总结

项目整体 UI 设计质量良好，遵循了大部分 Web Interface Guidelines。特别值得肯定的是：

- ✅ 完善的无障碍基础（跳过链接、aria-label、语义化 HTML）
- ✅ 出色的动画支持（prefers-reduced-motion）
- ✅ 良好的数字排版（tabular-nums）

主要改进空间在于表单增强（autocomplete）和图片优化（显式宽高）。

---

*报告生成时间: 2026-04-30*
