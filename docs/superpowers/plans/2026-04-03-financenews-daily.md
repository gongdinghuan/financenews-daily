# FinanceNews Daily Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a static financial news aggregation website with auto-update via GitHub Actions and deployment to Cloudflare Pages.

**Architecture:** Eleventy static site generator + RSS feed fetcher script + GitHub Actions hourly cron + Cloudflare Pages CDN deployment.

**Tech Stack:** Node.js 20, Eleventy, Nunjucks templates, vanilla CSS, RSS Parser

---

## Task 1: Project Initialization

**Files:**
- Create: `package.json`
- Create: `eleventy.config.js`
- Create: `.gitignore`

- [ ] **Step 1: Create package.json**

```json
{
  "name": "financenews-daily",
  "version": "1.0.0",
  "description": "Financial news aggregation website",
  "scripts": {
    "build": "eleventy",
    "serve": "eleventy --serve",
    "fetch": "node scripts/fetch-news.js"
  },
  "dependencies": {
    "@11ty/eleventy": "^2.0.1",
    "rss-parser": "^3.13.0"
  }
}
```

- [ ] **Step 2: Create eleventy.config.js**

```javascript
module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/static");

  eleventyConfig.addFilter("date", function(date) {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  });

  eleventyConfig.addFilter("slug", function(str) {
    return str.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data"
    },
    templateFormats: ["njk", "html", "md"],
    htmlTemplateEngine: "njk"
  };
};
```

- [ ] **Step 3: Create .gitignore**

```
node_modules/
_site/
.env
.DS_Store
```

- [ ] **Step 4: Install dependencies**

Run: `npm install`

- [ ] **Step 5: Commit**

```bash
git add . && git commit -m "chore: initialize project with eleventy config"
```

---

## Task 2: Base Layout Templates

**Files:**
- Create: `src/_includes/base.njk`
- Create: `src/_includes/header.njk`
- Create: `src/_includes/footer.njk`
- Create: `src/_includes/sidebar.njk`
- Create: `src/_data/site.json`

- [ ] **Step 1: Create site.json data file**

```json
{
  "name": "FinanceNews Daily",
  "description": "Your daily source for financial news",
  "url": "https://financenews-daily.com",
  "email": "gongdinghuan11@outlook.com",
  "categories": ["stocks", "forex", "crypto", "economy"]
}
```

- [ ] **Step 2: Create base.njk layout**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{ title }} | {{ site.name }}</title>
  <meta name="description" content="{{ description or site.description }}">
  <meta property="og:title" content="{{ title }}">
  <meta property="og:description" content="{{ description or site.description }}">
  <meta property="og:site_name" content="{{ site.name }}">
  <meta property="og:type" content="website">
  <link rel="stylesheet" href="/static/css/style.css">
  {% block head %}{% endblock %}
</head>
<body>
  {% include "header.njk" %}
  <main class="container">
    <div class="content">
      {% block content %}{% endblock %}
    </div>
    {% include "sidebar.njk" %}
  </main>
  {% include "footer.njk" %}
</body>
</html>
```

- [ ] **Step 3: Create header.njk**

```html
<header class="header">
  <div class="container">
    <a href="/" class="logo">{{ site.name }}</a>
    <nav class="nav">
      <a href="/">Home</a>
      <a href="/stocks/">Stocks</a>
      <a href="/forex/">Forex</a>
      <a href="/crypto/">Crypto</a>
      <a href="/economy/">Economy</a>
      <a href="/about/">About</a>
    </nav>
  </div>
</header>
```

- [ ] **Step 4: Create footer.njk**

```html
<footer class="footer">
  <div class="container">
    <p>&copy; {{ "now" | date }} {{ site.name }}. All rights reserved.</p>
    <p>Contact: <a href="mailto:{{ site.email }}">{{ site.email }}</a></p>
    <nav>
      <a href="/about/">About</a> |
      <a href="/privacy/">Privacy Policy</a>
    </nav>
  </div>
</footer>
```

- [ ] **Step 5: Create sidebar.njk**

```html
<aside class="sidebar">
  <div class="ad-slot sidebar-ad">
    <!-- AdSense 300x600 -->
    <ins class="adsbygoogle"
         style="display:block"
         data-ad-client="ca-pub-XXXXXXXX"
         data-ad-slot="XXXXXXXX"
         data-ad-format="vertical"></ins>
  </div>

  <div class="affiliate-promo">
    <h3>Recommended Platforms</h3>
    <ul>
      <li><a href="#" rel="nofollow sponsored">eToro - Trade Stocks & Forex</a></li>
      <li><a href="#" rel="nofollow sponsored">Binance - Crypto Exchange</a></li>
      <li><a href="#" rel="nofollow sponsored">Interactive Brokers</a></li>
    </ul>
  </div>

  <div class="trending">
    <h3>Trending</h3>
    <ul>
      {% for item in news | slice(0, 5) %}
      <li><a href="/news/{{ item.slug }}/">{{ item.title | truncate(50) }}</a></li>
      {% endfor %}
    </ul>
  </div>
</aside>
```

- [ ] **Step 6: Commit**

```bash
git add . && git commit -m "feat: add base layout templates"
```

---

## Task 3: CSS Styles

**Files:**
- Create: `src/static/css/style.css`

- [ ] **Step 1: Create responsive CSS**

```css
/* Reset & Base */
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
a { color: #0066cc; text-decoration: none; }
a:hover { text-decoration: underline; }

/* Container */
.container { max-width: 1200px; margin: 0 auto; padding: 0 20px; display: flex; gap: 30px; }
.content { flex: 1; min-width: 0; }

/* Header */
.header { background: #1a1a2e; color: #fff; padding: 15px 0; position: sticky; top: 0; z-index: 100; }
.header .container { display: flex; justify-content: space-between; align-items: center; }
.logo { font-size: 1.5rem; font-weight: bold; color: #fff; }
.nav a { color: #fff; margin-left: 25px; font-size: 0.95rem; }
.nav a:hover { color: #4fc3f7; }

/* Sidebar */
.sidebar { width: 300px; flex-shrink: 0; }
.sidebar-ad { min-height: 600px; background: #f5f5f5; margin-bottom: 20px; }
.affiliate-promo, .trending { background: #f9f9f9; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
.affiliate-promo h3, .trending h3 { margin-bottom: 10px; font-size: 1rem; }
.affiliate-promo ul, .trending ul { list-style: none; }
.affiliate-promo li, .trending li { padding: 8px 0; border-bottom: 1px solid #eee; }

/* News Cards */
.news-grid { display: grid; gap: 20px; }
.news-card { background: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); overflow: hidden; transition: transform 0.2s; }
.news-card:hover { transform: translateY(-3px); }
.news-card img { width: 100%; height: 180px; object-fit: cover; }
.news-card-content { padding: 15px; }
.news-card-meta { font-size: 0.85rem; color: #666; margin-bottom: 8px; }
.news-card h2 { font-size: 1.1rem; margin-bottom: 10px; }
.news-card p { color: #555; font-size: 0.95rem; }

/* Category Badge */
.category-badge { display: inline-block; padding: 3px 10px; border-radius: 20px; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; }
.category-badge.stocks { background: #e3f2fd; color: #1565c0; }
.category-badge.forex { background: #e8f5e9; color: #2e7d32; }
.category-badge.crypto { background: #fff3e0; color: #ef6c00; }
.category-badge.economy { background: #fce4ec; color: #c2185b; }

/* Ad Slots */
.ad-slot { background: #f5f5f5; display: flex; align-items: center; justify-content: center; min-height: 90px; margin: 20px 0; }
.top-banner { min-height: 90px; }
.in-article-ad { min-height: 250px; }

/* Footer */
.footer { background: #1a1a2e; color: #fff; padding: 30px 0; margin-top: 40px; text-align: center; }
.footer a { color: #4fc3f7; }

/* Article Page */
.article-header { margin-bottom: 25px; }
.article-header h1 { font-size: 1.8rem; margin-bottom: 10px; }
.article-meta { color: #666; font-size: 0.9rem; }
.article-body { font-size: 1.05rem; line-height: 1.8; }
.article-body p { margin-bottom: 20px; }
.read-full { display: inline-block; background: #0066cc; color: #fff; padding: 12px 25px; border-radius: 5px; margin: 20px 0; }
.read-full:hover { background: #0055aa; text-decoration: none; }

/* Mobile Responsive */
@media (max-width: 768px) {
  .container { flex-direction: column; }
  .sidebar { width: 100%; }
  .nav { display: none; }
  .header .container { flex-direction: column; gap: 10px; }
}
```

- [ ] **Step 2: Commit**

```bash
git add . && git commit -m "feat: add responsive CSS styles"
```

---

## Task 4: RSS Fetch Script

**Files:**
- Create: `scripts/fetch-news.js`
- Create: `src/_data/news.json` (auto-generated)

- [ ] **Step 1: Create fetch-news.js**

```javascript
const Parser = require('rss-parser');
const fs = require('fs');
const path = require('path');

const parser = new Parser();

const RSS_FEEDS = {
  stocks: [
    'https://www.reuters.com/business/finance/rss',
    'https://www.cnbc.com/id/10000664/device/rss/rss.html'
  ],
  forex: [
    'https://www.fxstreet.com/rss',
    'https://www.dailyfx.com/feeds/all'
  ],
  crypto: [
    'https://coindesk.com/arc/outboundfeeds/rss/',
    'https://cointelegraph.com/rss'
  ],
  economy: [
    'https://www.reuters.com/business/economy/rss',
    'https://www.bloomberg.com/feed/podcast/bloomberg-economics.xml'
  ]
};

function slugify(text) {
  return text.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .substring(0, 80);
}

async function fetchFeed(url, category) {
  try {
    const feed = await parser.parseURL(url);
    return feed.items.map(item => ({
      title: item.title,
      slug: slugify(item.title),
      summary: item.contentSnippet?.substring(0, 300) || '',
      link: item.link,
      pubDate: item.pubDate,
      category: category,
      source: feed.title,
      image: item.enclosure?.url || null
    }));
  } catch (error) {
    console.error(`Error fetching ${url}:`, error.message);
    return [];
  }
}

async function main() {
  const allNews = [];

  for (const [category, feeds] of Object.entries(RSS_FEEDS)) {
    for (const feed of feeds) {
      const items = await fetchFeed(feed, category);
      allNews.push(...items);
    }
  }

  // Sort by date, newest first
  allNews.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

  // Remove duplicates by slug
  const seen = new Set();
  const uniqueNews = allNews.filter(item => {
    if (seen.has(item.slug)) return false;
    seen.add(item.slug);
    return true;
  });

  // Keep latest 200 items
  const newsData = uniqueNews.slice(0, 200);

  const outputPath = path.join(__dirname, '..', 'src', '_data', 'news.json');
  fs.writeFileSync(outputPath, JSON.stringify(newsData, null, 2));

  console.log(`Fetched ${newsData.length} news items`);
}

main();
```

- [ ] **Step 2: Create empty news.json placeholder**

```json
[]
```

- [ ] **Step 3: Test fetch script**

Run: `node scripts/fetch-news.js`

- [ ] **Step 4: Commit**

```bash
git add . && git commit -m "feat: add RSS news fetcher script"
```

---

## Task 5: Homepage

**Files:**
- Create: `src/index.njk`

- [ ] **Step 1: Create homepage template**

```html
---
layout: base.njk
title: Latest Financial News
description: Your daily source for stocks, forex, crypto and economy news
---

<section class="hero">
  <h1>Today's Financial Headlines</h1>
  <p>Real-time news from top financial sources</p>
</section>

<div class="ad-slot top-banner">
  <!-- AdSense 728x90 -->
</div>

<section class="news-section">
  <h2>Top Stories</h2>
  <div class="news-grid">
    {% for item in news | slice(0, 5) %}
    <article class="news-card">
      {% if item.image %}
      <img src="{{ item.image }}" alt="{{ item.title }}" loading="lazy">
      {% endif %}
      <div class="news-card-content">
        <span class="category-badge {{ item.category }}">{{ item.category }}</span>
        <div class="news-card-meta">{{ item.source }} | {{ item.pubDate | date }}</div>
        <h2><a href="/news/{{ item.slug }}/">{{ item.title }}</a></h2>
        <p>{{ item.summary | truncate(150) }}</p>
      </div>
    </article>
    {% endfor %}
  </div>
</section>

<div class="ad-slot in-article-ad">
  <!-- AdSense 300x250 -->
</div>

{% for category in site.categories %}
<section class="news-section">
  <h2>{{ category | title }} News</h2>
  <div class="news-grid">
    {% for item in news | filterBy('category', category) | slice(0, 3) %}
    <article class="news-card">
      <div class="news-card-content">
        <span class="category-badge {{ item.category }}">{{ item.category }}</span>
        <div class="news-card-meta">{{ item.source }} | {{ item.pubDate | date }}</div>
        <h2><a href="/news/{{ item.slug }}/">{{ item.title }}</a></h2>
        <p>{{ item.summary | truncate(100) }}</p>
      </div>
    </article>
    {% endfor %}
  </div>
  <a href="/{{ category }}/" class="view-all">View all {{ category }} news →</a>
</section>
{% endfor %}
```

- [ ] **Step 2: Add filterBy filter to eleventy.config.js**

Add to eleventy.config.js:
```javascript
eleventyConfig.addFilter("filterBy", function(arr, key, value) {
  return arr.filter(item => item[key] === value);
});

eleventyConfig.addFilter("truncate", function(str, length) {
  if (!str) return '';
  return str.length > length ? str.substring(0, length) + '...' : str;
});
```

- [ ] **Step 3: Commit**

```bash
git add . && git commit -m "feat: add homepage with news grid"
```

---

## Task 6: Category Pages

**Files:**
- Create: `src/stocks/index.njk`
- Create: `src/forex/index.njk`
- Create: `src/crypto/index.njk`
- Create: `src/economy/index.njk`

- [ ] **Step 1: Create category page template (repeat for each category)**

`src/stocks/index.njk`:
```html
---
layout: base.njk
title: Stocks News
description: Latest stock market news and analysis
category: stocks
---

<h1>Stocks News</h1>
<p>Latest updates from the stock market</p>

<div class="ad-slot top-banner"></div>

<div class="news-grid">
  {% for item in news | filterBy('category', 'stocks') %}
  <article class="news-card">
    <div class="news-card-content">
      <div class="news-card-meta">{{ item.source }} | {{ item.pubDate | date }}</div>
      <h2><a href="/news/{{ item.slug }}/">{{ item.title }}</a></h2>
      <p>{{ item.summary | truncate(150) }}</p>
      <a href="/news/{{ item.slug }}/">Read more →</a>
    </div>
  </article>
  {% endfor %}
</div>
```

- [ ] **Step 2: Create forex, crypto, economy pages (same pattern)**

- [ ] **Step 3: Commit**

```bash
git add . && git commit -m "feat: add category pages"
```

---

## Task 7: Article Detail Page

**Files:**
- Create: `src/news/news.json` (collection data)
- Create: `src/news/[slug].njk`

- [ ] **Step 1: Create news collection in eleventy.config.js**

Add to eleventy.config.js:
```javascript
eleventyConfig.addCollection("newsItems", function(collectionApi) {
  const news = require('./src/_data/news.json');
  return news.map(item => ({
    ...item,
    date: new Date(item.pubDate)
  }));
});
```

- [ ] **Step 2: Create article page template**

`src/news/[slug].njk`:
```html
---
layout: base.njk
pagination:
  data: collections.newsItems
  size: 1
  alias: article
permalink: "news/{{ article.slug }}/index.html"
---

<article class="article">
  <header class="article-header">
    <span class="category-badge {{ article.category }}">{{ article.category }}</span>
    <h1>{{ article.title }}</h1>
    <div class="article-meta">
      Source: {{ article.source }} | {{ article.pubDate | date }}
    </div>
  </header>

  <div class="ad-slot top-banner"></div>

  <div class="article-body">
    <p>{{ article.summary }}</p>

    <div class="ad-slot in-article-ad"></div>

    <p>This article was originally published by <strong>{{ article.source }}</strong>.</p>

    <a href="{{ article.link }}" class="read-full" target="_blank" rel="noopener noreferrer">
      Read Full Article →
    </a>
  </div>

  <div class="affiliate-cta">
    <h3>Start Trading Today</h3>
    <p>Join millions of traders on these platforms:</p>
    <a href="#" class="affiliate-btn">Trade on eToro</a>
    <a href="#" class="affiliate-btn">Buy Crypto on Binance</a>
  </div>
</article>

<section class="related">
  <h2>Related News</h2>
  <div class="news-grid">
    {% for item in news | filterBy('category', article.category) | slice(0, 3) %}
    {% if item.slug !== article.slug %}
    <article class="news-card">
      <div class="news-card-content">
        <h2><a href="/news/{{ item.slug }}/">{{ item.title }}</a></h2>
        <p>{{ item.summary | truncate(100) }}</p>
      </div>
    </article>
    {% endif %}
    {% endfor %}
  </div>
</section>
```

- [ ] **Step 3: Commit**

```bash
git add . && git commit -m "feat: add article detail pages"
```

---

## Task 8: About Page

**Files:**
- Create: `src/about.njk`

- [ ] **Step 1: Create about page**

```html
---
layout: base.njk
title: About
description: About FinanceNews Daily
---

<article class="about">
  <h1>About FinanceNews Daily</h1>

  <p>Welcome to FinanceNews Daily, your trusted source for the latest financial news and market updates. We aggregate news from the world's leading financial publications to keep you informed about stocks, forex, cryptocurrency, and the global economy.</p>

  <h2>Our Mission</h2>
  <p>To provide timely, accurate, and comprehensive financial news to investors, traders, and anyone interested in the financial markets.</p>

  <h2>News Sources</h2>
  <ul>
    <li>Reuters</li>
    <li>CNBC</li>
    <li>Bloomberg</li>
    <li>CoinDesk</li>
    <li>FXStreet</li>
    <li>And more...</li>
  </ul>

  <h2>Contact Us</h2>
  <p>Have questions or feedback? Reach out to us at <a href="mailto:gongdinghuan11@outlook.com">gongdinghuan11@outlook.com</a></p>

  <h2>Disclaimer</h2>
  <p>The content on this website is for informational purposes only and should not be considered financial advice. Always do your own research before making investment decisions.</p>
</article>
```

- [ ] **Step 2: Commit**

```bash
git add . && git commit -m "feat: add about page"
```

---

## Task 9: SEO Files

**Files:**
- Create: `src/robots.njk`
- Create: `src/sitemap.njk`

- [ ] **Step 1: Create robots.txt**

`src/robots.njk`:
```html
---
permalink: robots.txt
excludeFromSitemap: true
---
User-agent: *
Allow: /

Sitemap: {{ site.url }}/sitemap.xml
```

- [ ] **Step 2: Create sitemap.xml**

`src/sitemap.njk`:
```html
---
permalink: sitemap.xml
excludeFromSitemap: true
---
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>{{ site.url }}/</loc>
    <changefreq>hourly</changefreq>
    <priority>1.0</priority>
  </url>
  {% for category in site.categories %}
  <url>
    <loc>{{ site.url }}/{{ category }}/</loc>
    <changefreq>hourly</changefreq>
    <priority>0.8</priority>
  </url>
  {% endfor %}
  {% for item in news | slice(0, 100) %}
  <url>
    <loc>{{ site.url }}/news/{{ item.slug }}/</loc>
    <lastmod>{{ item.pubDate | date('YYYY-MM-DD') }}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>
  {% endfor %}
</urlset>
```

- [ ] **Step 3: Add date filter format support to eleventy.config.js**

```javascript
eleventyConfig.addFilter("date", function(date, format) {
  const d = new Date(date);
  if (format === 'YYYY-MM-DD') {
    return d.toISOString().split('T')[0];
  }
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
});
```

- [ ] **Step 4: Commit**

```bash
git add . && git commit -m "feat: add robots.txt and sitemap.xml"
```

---

## Task 10: GitHub Actions Workflow

**Files:**
- Create: `.github/workflows/update-news.yml`

- [ ] **Step 1: Create workflow file**

```yaml
name: Update News

on:
  schedule:
    - cron: '0 * * * *'
  workflow_dispatch:

permissions:
  contents: write

jobs:
  update:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 1

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Fetch latest news
        run: node scripts/fetch-news.js

      - name: Build site
        run: npm run build

      - name: Commit and push changes
        run: |
          git config user.name "News Bot"
          git config user.email "bot@financenews.daily"
          git add .
          git diff --quiet && git diff --staged --quiet || git commit -m "📰 Update news $(date '+%Y-%m-%d %H:%M')"
          git push
```

- [ ] **Step 2: Commit**

```bash
git add . && git commit -m "feat: add GitHub Actions workflow for auto-update"
```

---

## Task 11: README Documentation

**Files:**
- Create: `README.md`

- [ ] **Step 1: Create README**

```markdown
# FinanceNews Daily

A static financial news aggregation website built with Eleventy.

## Features

- Auto-updates every hour via GitHub Actions
- RSS aggregation from top financial sources
- SEO optimized with sitemap and structured data
- Mobile responsive design
- AdSense and affiliate monetization ready
- Free deployment on Cloudflare Pages

## Development

```bash
# Install dependencies
npm install

# Fetch latest news
npm run fetch

# Build site
npm run build

# Local development
npm run serve
```

## Deployment

This site is designed for Cloudflare Pages:

1. Connect your GitHub repository to Cloudflare Pages
2. Set build command: `npm run build`
3. Set output directory: `_site`
4. Deploy!

## License

MIT
```

- [ ] **Step 2: Commit**

```bash
git add . && git commit -m "docs: add README"
```

---

## Task 12: Final Build Test

- [ ] **Step 1: Run full build**

Run: `npm run fetch && npm run build`

- [ ] **Step 2: Verify output**

Run: `ls _site/`

- [ ] **Step 3: Final commit**

```bash
git add . && git commit -m "chore: final build verification"
```
