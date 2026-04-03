# FinanceNews Daily - Static AJAX Version

这是一个纯静态版本，使用 AJAX 轮询获取最新新闻，无需服务端渲染。

## 架构设计

```
┌─────────────────────────────────────────────────────────────┐
│                     Browser / Client                        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │ index.html  │  │ stocks.html │  │ article.html (SPA) │ │
│  │ (AJAX poll) │  │ (AJAX poll) │  │ (URL slug routing)  │ │
│  └──────┬──────┘  └──────┬──────┘  └──────────┬──────────┘ │
└─────────┼────────────────┼────────────────────┼────────────┘
          │                │                    │
          ▼                ▼                    ▼
┌─────────────────────────────────────────────────────────────┐
│                    Cloudflare Workers                        │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  URL Rewriting: /news/{slug}/ → /news/article/index.html│ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────┐
│                    Static Assets (_site)                     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │ index.html  │  │ */index.html│  │ news.json (data)    │ │
│  └─────────────┘  └─────────────┘  └─────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## 核心功能

### 1. 自动轮询更新
- **轮询间隔**: 60 秒
- **倒计时显示**: 显示下次刷新剩余时间
- **状态指示**: 绿色圆点动画表示自动刷新状态

### 2. 分类过滤
- All News / Stocks / Forex / Crypto / Economy
- 前端即时过滤，无需重新加载

### 3. 深色模式
- 自动检测系统偏好
- localStorage 持久化
- 太阳/月亮图标切换

### 4. 响应式设计
- 移动端适配
- 面包屑导航
- 侧边栏 Trending

## 构建步骤

### 1. 获取最新新闻数据
```bash
npm run fetch
```

### 2. 构建静态文件
```bash
npm run build:static
```

### 3. 部署到 Cloudflare Workers
```bash
# 安装 wrangler CLI
npm install -g wrangler

# 登录 Cloudflare
wrangler login

# 部署
wrangler deploy
```

## 文件结构

```
financenews-daily/
├── static-index.html        # 首页（带分类过滤）
├── static-stocks.html       # Stocks 分类页
├── static-forex.html        # Forex 分类页
├── static-crypto.html       # Crypto 分类页
├── static-economy.html      # Economy 分类页
├── static-article.html      # 文章详情页（SPA 路由）
├── workers.js               # Cloudflare Workers 路由
├── wrangler.toml            # Workers 配置
├── scripts/
│   ├── fetch-news.js        # 新闻抓取脚本
│   └── build-static.js      # 静态构建脚本
└── src/
    └── _data/
        └── news.json        # 新闻数据源
```

## API 数据源

新闻数据来自 Google News RSS feeds:
- Stocks: `https://news.google.com/rss/search?q=stocks+finance`
- Forex: `https://news.google.com/rss/search?q=forex+currency+market`
- Crypto: `https://news.google.com/rss/search?q=cryptocurrency+bitcoin+ethereum`
- Economy: `https://news.google.com/rss/search?q=economy+federal+reserve+inflation`

数据格式 (`news.json`):
```json
[
  {
    "title": "Article Title",
    "slug": "article-title-slug",
    "category": "stocks",
    "source": "Source Name",
    "link": "https://original-article-url.com",
    "pubDate": "2026-04-03T10:00:00Z",
    "summary": "Article summary text..."
  }
]
```

## 本地测试

使用任意 HTTP 服务器：

```bash
# Python 3
python -m http.server 8000

# Node.js (npx)
npx serve _site

# 然后访问 http://localhost:8000
```

## 与 SSR 版本对比

| 特性 | SSR (11ty) | Static AJAX |
|------|------------|-------------|
| 首屏加载 | 快（预渲染） | 中（需 AJAX） |
| 实时更新 | ❌ 需重新构建 | ✅ 60 秒轮询 |
| 服务器依赖 | 需要 Node.js | 纯静态 |
| CDN 友好 | 一般 | 优秀 |
| 文章路由 | 静态文件 | Workers 重写 |
| 构建时间 | ~3 秒 | <1 秒 |

## 自定义配置

### 修改轮询间隔
编辑 `static-index.html`，找到：
```javascript
const REFRESH_INTERVAL = 60000; // 60 秒
```

### 修改分类
在 `static-index.html` 中修改：
```html
<div class="category-filter">
  <button data-category="all">All News</button>
  <button data-category="stocks">Stocks</button>
  <!-- 添加/删除分类 -->
</div>
```

## 部署检查清单

- [ ] 运行 `npm run fetch` 获取最新新闻
- [ ] 运行 `npm run build:static` 生成静态文件
- [ ] 检查 `_site/news.json` 是否存在
- [ ] 部署到 Cloudflare Workers
- [ ] 验证文章路由是否正常工作
- [ ] 测试深色模式切换
- [ ] 验证移动端响应式布局

## 故障排除

**文章页面 404**
- 确保 Cloudflare Workers 路由规则正确配置
- 检查 `workers.js` 中的 URL 匹配正则

**AJAX 请求失败**
- 检查 `news.json` 路径是否正确（子目录使用 `../../` 前缀）
- 确保服务器允许跨域请求（本地测试时）

**轮询不工作**
- 打开浏览器控制台查看是否有 JavaScript 错误
- 检查网络请求是否被拦截
