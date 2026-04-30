# mgmt-cli-ebank 安全审查报告

**审查日期:** 2026-04-30  
**项目类型:** Vue 3 + TypeScript + Vite 管理后台系统  
**审查依据:** Vue.js/TypeScript 前端安全最佳实践规范

---

## 执行摘要

本报告对 mgmt-cli-ebank 项目进行了全面的前端安全审查。审查发现 **3 个高危问题**、**3 个中危问题** 和 **5 个低危问题**。项目整体架构安全意识良好，但仍需针对特定风险点进行修复。

---

## 高危问题 (Critical/High)

### SEC-001: `new Function()` 动态代码执行

| 项目 | 详情 |
|------|------|
| **规则 ID** | VUE-XSS-002 / JS-XSS-003 |
| **严重性** | Critical |
| **位置** | [TableComponent.vue#L243-250](file:///workspace/mgmt-cli-ebank/src/components/table/TableComponent.vue#L243-L250) |
| **证据** | ```typescript<br>const fn = new Function(<br>  'row', 'column', 'cellValue', 'index',<br>  `return (${formatter})(row, column, cellValue, index)`<br>);<br>return fn(row, column, cellValue, index);``` |
| **影响** | 如果 `formatter` 字符串来自用户输入或配置文件中的恶意内容，可能导致任意 JavaScript 代码执行 |
| **修复建议** | ```typescript<br>if (typeof formatter === 'function') {<br>  return formatter(row, column, cellValue, index);<br>}<br>if (typeof formatter === 'string') {<br>  // 安全做法：仅允许预定义的格式化函数名<br>  const allowedFormatters: Record<string, Function> = {<br>    date: (v: any) => new Date(v).toLocaleDateString(),<br>    currency: (v: any) => `¥${Number(v).toFixed(2)}`,<br>    // 添加更多白名单函数...<br>  };<br>  if (allowedFormatters[formatter]) {<br>    return allowedFormatters[formatter](cellValue);<br>  }<br>}<br>return cellValue;``` |
| **缓解措施** | 启用严格 CSP 策略，阻止 eval 类函数执行 |
| **误报说明** | 如 `formatter` 仅来自可信的静态配置文件（非用户输入），风险可控 |

---

### SEC-002: Token 存储在 localStorage

| 项目 | 详情 |
|------|------|
| **规则 ID** | VUE-AUTH-001 / JS-STORAGE-001 |
| **严重性** | High |
| **位置** | [userStore.ts#L127](file:///workspace/mgmt-cli-ebank/src/stores/userStore.ts#L127), [request.ts#L104](file:///workspace/mgmt-cli-ebank/src/api/request.ts#L104) |
| **证据** | ```typescript<br>// userStore.ts<br>persist: {<br>  key: 'user-store',<br>  storage: localStorage,  // ← token 存储于此<br>  paths: ['token', 'user', 'isAuthenticated'],<br>}<br><br>// request.ts<br>const token = localStorage.getItem('token');<br>if (token) {<br>  config.headers.Authorization = `Bearer ${token}`;<br>``` |
| **影响** | localStorage 可被任何 XSS 攻击窃取，导致令牌泄露。建议使用 HttpOnly Cookie 由后端管理会话 |
| **修复建议** | 1. 后端设置 HttpOnly Secure SameSite=Strict Cookie 存储 session<br>2. 前端移除 localStorage 中的 token 存储<br>3. 请求自动携带 Cookie（无需前端处理 token）<br>4. 如必须使用 Bearer Token，使用内存存储 + 短期过期 |
| **缓解措施** | 1. 部署严格 CSP 防止 XSS<br>2. 使用 X-Frame-Options 防止点击劫持<br>3. 监控 Token 异常使用 |

---

### SEC-003: localStorage 中的敏感数据持久化

| 项目 | 详情 |
|------|------|
| **规则 ID** | VUE-AUTH-001 / JS-STORAGE-001 |
| **严重性** | High |
| **位置** | [userStore.ts#L128](file:///workspace/mgmt-cli-ebank/src/stores/userStore.ts#L128), [menuStore.ts#L91](file:///workspace/mgmt-cli-ebank/src/stores/menuStore.ts#L91), [cacheStore.ts#L28](file:///workspace/mgmt-cli-ebank/src/stores/cacheStore.ts#L28) |
| **证据** | ```typescript<br>persist: {<br>  paths: ['token', 'user', 'isAuthenticated'],  // ← 敏感数据<br>}<br>// 多处使用 localStorage 存储用户信息和配置``` |
| **影响** | 存储的 `token`、`user` 包含认证信息，泄露后可用于会话劫持 |
| **修复建议** | 1. 仅将非敏感配置（如 UI 偏好、语言设置）存储在 localStorage<br>2. 敏感认证信息使用内存存储<br>3. 会话超时后自动清理内存数据 |
| **误报说明** | `menuStore`、`cacheStore` 中的非敏感配置存储风险较低 |

---

## 中危问题 (Medium)

### SEC-004: 宽松的 CSP 策略

| 项目 | 详情 |
|------|------|
| **规则 ID** | JS-CSP-001 / JS-CSP-002 |
| **严重性** | Medium |
| **位置** | [index.html#L10-20](file:///workspace/mgmt-cli-ebank/index.html#L10-L20) |
| **证据** | ```html<br><meta http-equiv="Content-Security-Policy" content="<br>  default-src 'self';<br>  script-src 'self' 'unsafe-inline' 'unsafe-eval';  ← 不安全<br>  ..."><br>``` |
| **影响** | `'unsafe-inline'` 和 `'unsafe-eval'` 大幅削弱 CSP 对 XSS 的防护能力 |
| **修复建议** | ```html<br><meta http-equiv="Content-Security-Policy" content="<br>  default-src 'self';<br>  script-src 'self';<br>  style-src 'self' 'unsafe-inline';  <!-- 如需内联样式可保留 --><br>  img-src 'self' data: https: blob:;<br>  connect-src 'self';<br>  frame-ancestors 'none';<br>  base-uri 'self';<br>">``` |
| **缓解措施** | 1. 移除所有内联脚本，改用外部 JS 文件<br>2. 移除 `new Function`、`eval` 等动态代码执行<br>3. 部署 nonce-based CSP |

---

### SEC-005: 缺少 CSRF 防护

| 项目 | 详情 |
|------|------|
| **规则 ID** | VUE-CSRF-001 |
| **严重性** | Medium |
| **位置** | [request.ts](file:///workspace/mgmt-cli-ebank/src/api/request.ts) |
| **证据** | Axios 配置中未发现 CSRF Token 处理逻辑 |
| **影响** | 如使用 Cookie 认证，攻击者可利用 CSRF 发起跨站请求 |
| **修复建议** | 1. 后端生成 CSRF Token 并设置到 Cookie（HttpOnly=False 可读）<br>2. 前端从 Cookie 读取 Token 并添加到请求头<br>3. 后端验证请求头中的 Token 与 Cookie 一致 |
| **缓解措施** | 使用 Bearer Token 认证（Header 方式），避免 Cookie 认证 |
| **误报说明** | 如 API 仅使用 Authorization Header 而非 Cookie，则 CSRF 不是问题 |

---

### SEC-006: 外部字体加载缺少 SRI

| 项目 | 详情 |
|------|------|
| **规则 ID** | JS-SRI-001 / VUE-SRI-001 |
| **严重性** | Medium |
| **位置** | [index.html#L28-32](file:///workspace/mgmt-cli-ebank/index.html#L28-L32) |
| **证据** | ```html<br><link href="https://fonts.googleapis.com/css2?family=Inter..." rel="stylesheet" /><br>``` |
| **影响** | Google Fonts CDN 被恶意篡改时可能加载恶意资源 |
| **修复建议** | ```html<br><link rel="preconnect" href="https://fonts.googleapis.com"><br><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><br><link rel="stylesheet"<br>  href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"<br>  integrity="sha256-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"<br>  crossorigin="anonymous"><br>``` |
| **缓解措施** | 1. 自托管字体文件<br>2. 使用国内 CDN 镜像（需评估镜像安全性） |

---

## 低危问题 (Low)

### SEC-007: form/table 草稿功能使用 localStorage

| 项目 | 详情 |
|------|------|
| **规则 ID** | JS-STORAGE-001 |
| **严重性** | Low |
| **位置** | [FormComponent.vue#L269,285,305](file:///workspace/mgmt-cli-ebank/src/components/form/FormComponent.vue#L269-L305), [TableComponent.vue#L313,323](file:///workspace/mgmt-cli-ebank/src/components/table/TableComponent.vue#L313-L323) |
| **证据** | ```typescript<br>localStorage.setItem(draftKey.value, JSON.stringify(formData));<br>const saved = localStorage.getItem(draftKey.value);``` |
| **影响** | 表单草稿和列设置存储在本地，攻击者可通过 XSS 读取 |
| **修复建议** | 这些数据风险较低，可保持现状。如需提升安全性：<br>1. 限制草稿数据的生命周期<br>2. 定期清理过期草稿 |
| **误报说明** | 草稿数据不包含敏感信息，风险较低 |

---

### SEC-008: `expressionParser.ts` 安全防护设计合理

| 项目 | 详情 |
|------|------|
| **规则 ID** | VUE-XSS-002 |
| **严重性** | Low (已防护) |
| **位置** | [expressionParser.ts#L123-143](file:///workspace/mgmt-cli-ebank/src/utils/expressionParser.ts#L123-L143) |
| **证据** | ```typescript<br>const forbiddenPatterns = [<br>  /function\\s*\\(/i, /=>\//, /eval\\s*\\(/i, /Function\\s*\\(/i,<br>  /window\\./i, /document\\./i, /console\\./i, /import\\s+/i,<br>  /require\\s*\\(/i, /setTimeout/i, /setInterval/i, /new\\s+/i,<br>];<br>``` |
| **评估** | ✅ 表达式解析器已实现黑名单过滤，防止恶意代码注入 |
| **建议** | 可考虑改用白名单方式（仅允许特定操作符和字段访问模式）以增强安全性 |

---

### SEC-009: SSL 证书在代码库中

| 项目 | 详情 |
|------|------|
| **规则 ID** | VUE-SECRETS-001 |
| **严重性** | Low |
| **位置** | [ssl/localhost.key](file:///workspace/mgmt-cli-ebank/ssl/localhost.key) |
| **证据** | `-----BEGIN PRIVATE KEY----- ... -----END PRIVATE KEY-----` |
| **影响** | 私有密钥意外泄露（当前仅为本地开发证书） |
| **修复建议** | 1. 将 ssl/ 目录添加到 .gitignore<br>2. 生产环境使用正式的 SSL 证书 |
| **误报说明** | 仅用于本地开发，不影响生产环境安全 |

---

### SEC-010: 外部图片链接使用占位符服务

| 项目 | 详情 |
|------|------|
| **规则 ID** | JS-URL-002 |
| **严重性** | Low |
| **位置** | [mock/modules/*.ts](file:///workspace/mgmt-cli-ebank/src/mock/modules/) |
| **证据** | ```typescript<br>image: 'https://via.placeholder.com/800x300'``` |
| **影响** | 依赖第三方占位符服务可用性 |
| **修复建议** | 1. 使用本地图片或 base64 内嵌<br>2. 使用稳定可靠的 CDN |
| **误报说明** | 仅为 Mock 数据，不影响生产 |

---

### SEC-011: 缺少 `X-Content-Type-Options` 和 `Referrer-Policy` 头

| 项目 | 详情 |
|------|------|
| **规则 ID** | VUE-HEADERS-001 |
| **严重性** | Low |
| **位置** | [index.html](file:///workspace/mgmt-cli-ebank/index.html) |
| **影响** | 缺少额外的安全响应头 |
| **修复建议** | 添加以下 Meta 标签：<br>```html<br><meta http-equiv="X-Content-Type-Options" content="nosniff"><br><meta name="referrer" content="strict-origin-when-cross-origin"><br>``` |
| **缓解措施** | 在服务器/CDN 层面配置这些安全头（更推荐） |

---

## 安全最佳实践符合度

| 类别 | 评分 | 说明 |
|------|------|------|
| 机密管理 | ⭐⭐⭐☆☆ | .env 文件使用得当，但 token 存储方式需改进 |
| XSS 防护 | ⭐⭐⭐⭐☆ | 无 v-html/innerHTML，expressionParser 有防护，但 new Function 需修复 |
| 认证与会话 | ⭐⭐⭐☆☆ | 实现基本认证，但 localStorage 存储 token 存在风险 |
| 路由安全 | ⭐⭐⭐⭐⭐ | 路由守卫实现规范，无开放重定向漏洞 |
| CSP 配置 | ⭐⭐☆☆☆ | 已配置但使用了 unsafe-inline/eval，需收紧 |
| 第三方资源 | ⭐⭐⭐⭐☆ | 依赖管理规范，但字体缺少 SRI |

---

## 优先修复建议

### P0 (立即修复)
1. **移除 TableComponent 中的 `new Function`** → 改用白名单格式化函数
2. **评估 localStorage token 存储** → 如可能，迁移到 HttpOnly Cookie

### P1 (近期修复)
3. **收紧 CSP 策略** → 移除 unsafe-inline 和 unsafe-eval
4. **实现 CSRF 防护** → 添加 CSRF Token 处理

### P2 (计划中)
5. **添加字体 SRI** → 为 Google Fonts 添加 integrity 属性
6. **添加安全响应头** → X-Content-Type-Options, Referrer-Policy

---

## 总结

项目整体安全意识良好，代码结构清晰，主要风险集中在：
1. **动态代码执行** (`new Function`) - 最严重风险
2. **Token 存储方式** - 需要架构层面的改进
3. **CSP 配置过于宽松** - 影响纵深防御效果

建议优先处理 P0 和 P1 级别问题，P2 级别可在后续迭代中逐步完善。

---

*报告生成时间: 2026-04-30*
