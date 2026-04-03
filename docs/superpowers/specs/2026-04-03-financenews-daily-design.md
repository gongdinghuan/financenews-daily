# FinanceNews Daily - Design Specification

## Overview

A static financial news aggregation website targeting global English-speaking users. The site automatically aggregates news from RSS feeds, updates hourly via GitHub Actions, and deploys to Cloudflare Pages for free hosting with global CDN.

## Project Summary

| Item | Decision |
|------|----------|
| **Site Name** | FinanceNews Daily |
| **Language** | English (global audience) |
| **Content Type** | Comprehensive finance (Stocks/Forex/Crypto/Economy) |
| **Content Source** | RSS aggregation (legally compliant) |
| **Tech Stack** | Node.js + Eleventy |
| **Deployment** | Cloudflare Pages (free) |
| **Update Frequency** | Hourly auto-update |
| **Monetization** | Google AdSense + Affiliate marketing |
| **Contact Email** | gongdinghuan11@outlook.com |

## Site Structure

### Pages

```
Homepage (/)
├── Top Headlines (Top 5)
├── Category Navigation
│   ├── Stocks (/stocks)
│   ├── Forex (/forex)
│   ├── Crypto (/crypto)
│   └── Economy (/economy)
├── Latest News Feed
└── Sidebar: Trending + Affiliate Promos

Category Pages (/stocks, /forex, /crypto, /economy)
├── Category news list
└── Pagination

Article Page (/news/[slug])
├── Title + Source + Timestamp
├── Article summary
├── "Read Full Article" link (external)
├── AdSense ad slots
└── Related articles

About Page (/about)
├── Site introduction
└── Contact information
```

## Technical Architecture

```
GitHub Actions (Hourly Cron)
    ↓
RSS Fetch Module (scripts/fetch-news.js)
    ↓
Eleventy Static Site Generator
    ↓
Push to GitHub Repository
    ↓
Cloudflare Pages Auto-Deploy
```

### RSS Sources

| Category | Sources |
|----------|---------|
| Stocks | Reuters Business, CNBC Markets |
| Forex | FXStreet, DailyFX |
| Crypto | CoinDesk, Cointelegraph |
| Economy | Bloomberg Economy, Reuters Economy |

## SEO Strategy

### Meta Tags
- Title: Keyword | FinanceNews Daily
- Description: Article summary
- Open Graph tags for social sharing

### Schema.org Structured Data
```json
{
  "@type": "NewsArticle",
  "headline": "...",
  "datePublished": "...",
  "publisher": {
    "@type": "Organization",
    "name": "FinanceNews Daily"
  }
}
```

### URL Structure
```
/stocks/apple-stock-rises-5-percent.html
/crypto/bitcoin-hits-new-high.html
/forex/usd-eur-analysis.html
```

### Other SEO Measures
- Auto-generated sitemap.xml
- robots.txt configuration
- Semantic HTML5 tags
- Mobile responsive design
- Page load < 2 seconds

## Monetization Layout

### AdSense Ad Slots
- Top banner (728x90)
- In-article rectangle (300x250)
- Sidebar skyscraper (300x600)
- Bottom banner (728x90)

### Affiliate Programs
| Platform | Type | Commission |
|----------|------|------------|
| eToro | Forex/Stock trading | $200+/signup |
| Binance | Crypto exchange | 20% trading rebate |
| Interactive Brokers | Stock broker | $200+/signup |

Affiliate placements: Sidebar + Article bottom CTA

## Project File Structure

```
financenews-daily/
├── src/
│   ├── _includes/
│   │   ├── base.njk
│   │   ├── header.njk
│   │   ├── footer.njk
│   │   └── sidebar.njk
│   ├── _data/
│   │   ├── site.json
│   │   └── news.json
│   ├── index.njk
│   ├── stocks/index.njk
│   ├── forex/index.njk
│   ├── crypto/index.njk
│   ├── economy/index.njk
│   ├── news/[slug].njk
│   ├── about.njk
│   ├── static/css/style.css
│   ├── static/images/
│   └── robots.njk
├── scripts/
│   └── fetch-news.js
├── .github/workflows/
│   └── update-news.yml
├── eleventy.config.js
├── package.json
└── README.md
```

## GitHub Actions Workflow

```yaml
name: Update News

on:
  schedule:
    - cron: '0 * * * *'  # Hourly
  workflow_dispatch:

jobs:
  update:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: node scripts/fetch-news.js
      - run: npm run build
      - name: Commit changes
        run: |
          git config user.name "News Bot"
          git config user.email "bot@financenews.daily"
          git add .
          git diff --quiet && git diff --staged --quiet || git commit -m "📰 Update news $(date '+%Y-%m-%d %H:%M')"
          git push
```

## Cloudflare Pages Configuration

- Build command: `npm run build`
- Output directory: `_site`
- Auto-deploy on GitHub push

## Success Criteria

1. Site successfully deployed to Cloudflare Pages
2. News automatically updates every hour
3. All pages pass Google SEO best practices
4. Mobile responsive design
5. AdSense and affiliate slots properly placed
6. Page load time < 2 seconds
