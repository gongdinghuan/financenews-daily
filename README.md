# FinanceNews Daily

A static financial news aggregation website built with Eleventy.

## Features

- Auto-updates every hour via GitHub Actions
- RSS aggregation from top financial sources
- SEO optimized with sitemap and structured data
- Mobile responsive design
- AdSense and affiliate monetization ready
- Free deployment on Cloudflare Pages

## Tech Stack

- [Eleventy](https://www.11ty.dev/) - Static site generator
- [Nunjucks](https://mozilla.github.io/nunjucks/) - Templating
- [RSS Parser](https://www.npmjs.com/package/rss-parser) - Feed fetching

## Development

```bash
# Install dependencies
npm install

# Fetch latest news
npm run fetch

# Build site
npm run build

# Local development with live reload
npm run serve
```

## Project Structure

```
├── src/
│   ├── _includes/      # Layout templates
│   ├── _data/          # JSON data files
│   ├── static/css/     # Stylesheets
│   ├── news/           # Article pages
│   ├── stocks/         # Category pages
│   ├── forex/
│   ├── crypto/
│   ├── economy/
│   └── index.njk       # Homepage
├── scripts/
│   └── fetch-news.js   # RSS fetcher
├── .github/workflows/
│   └── update-news.yml # Auto-update
└── eleventy.config.js
```

## Deployment (Cloudflare Pages)

1. Push this repository to GitHub
2. Go to [Cloudflare Pages](https://pages.cloudflare.com/)
3. Connect your GitHub repository
4. Configure build settings:
   - **Build command:** `npm run build`
   - **Output directory:** `_site`
5. Deploy!

## Configuration

### AdSense

Replace `ca-pub-XXXXXXXX` in templates with your AdSense publisher ID.

### Affiliate Links

Update affiliate links in `src/_includes/sidebar.njk` and article templates.

### RSS Sources

Edit `scripts/fetch-news.js` to customize news sources.

## License

MIT
