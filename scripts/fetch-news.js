const Parser = require('rss-parser');
const fs = require('fs');
const path = require('path');

const parser = new Parser({
  timeout: 10000,
  headers: {
    'User-Agent': 'FinanceNews-Daily/1.0'
  }
});

const RSS_FEEDS = {
  stocks: [
    'https://www.investing.com/rss/news.rss',
    'https://feeds.finance.yahoo.com/rss/2.0/headline?s=AAPL&region=US&lang=en-US'
  ],
  forex: [
    'https://www.dailyfx.com/feeds/all',
    'https://www.forexlive.com/feed'
  ],
  crypto: [
    'https://coindesk.com/arc/outboundfeeds/rss/',
    'https://cointelegraph.com/rss'
  ],
  economy: [
    'https://www.reuters.com/business/economy/rss',
    'https://feeds.finance.yahoo.com/rss/2.0/headline?s=^GSPC&region=US&lang=en-US'
  ]
};

function slugify(text) {
  if (!text) return '';
  return text.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/(^-|-$)/g, '')
    .substring(0, 80);
}

function cleanSummary(content) {
  if (!content) return '';
  // Remove HTML tags
  const cleaned = content.replace(/<[^>]*>/g, '');
  // Remove extra whitespace
  return cleaned.replace(/\s+/g, ' ').trim().substring(0, 300);
}

async function fetchFeed(url, category) {
  try {
    console.log(`Fetching: ${url}`);
    const feed = await parser.parseURL(url);
    return feed.items.map(item => ({
      title: item.title || 'Untitled',
      slug: slugify(item.title) + '-' + Date.now().toString(36),
      summary: cleanSummary(item.contentSnippet || item.content || item.description),
      link: item.link,
      pubDate: item.pubDate || item.isoDate || new Date().toISOString(),
      category: category,
      source: feed.title || 'Unknown Source',
      image: item.enclosure?.url || null
    }));
  } catch (error) {
    console.error(`Error fetching ${url}:`, error.message);
    return [];
  }
}

async function main() {
  console.log('Starting news fetch...');
  const allNews = [];

  for (const [category, feeds] of Object.entries(RSS_FEEDS)) {
    for (const feed of feeds) {
      const items = await fetchFeed(feed, category);
      allNews.push(...items);
    }
  }

  // Sort by date, newest first
  allNews.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

  // Remove duplicates by title similarity
  const seen = new Set();
  const uniqueNews = allNews.filter(item => {
    const key = item.title.toLowerCase().substring(0, 50);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  // Keep latest 200 items
  const newsData = uniqueNews.slice(0, 200);

  const outputPath = path.join(__dirname, '..', 'src', '_data', 'news.json');
  fs.writeFileSync(outputPath, JSON.stringify(newsData, null, 2));

  console.log(`✓ Fetched ${newsData.length} unique news items`);
  console.log(`✓ Saved to ${outputPath}`);
}

main().catch(console.error);
