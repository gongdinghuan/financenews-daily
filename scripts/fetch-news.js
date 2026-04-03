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
    'https://news.google.com/rss/search?q=stocks+finance&hl=en-US&gl=US&ceid=US:en'
  ],
  forex: [
    'https://news.google.com/rss/search?q=forex+currency+market&hl=en-US&gl=US&ceid=US:en'
  ],
  crypto: [
    'https://news.google.com/rss/search?q=cryptocurrency+bitcoin+ethereum&hl=en-US&gl=US&ceid=US:en'
  ],
  economy: [
    'https://news.google.com/rss/search?q=economy+federal+reserve+inflation&hl=en-US&gl=US&ceid=US:en'
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

function cleanSummary(content, title = '') {
  if (!content) return '';
  // Remove HTML tags
  let cleaned = content.replace(/<[^>]*>/g, '');
  // Remove extra whitespace
  cleaned = cleaned.replace(/\s+/g, ' ').trim();

  // If content is basically the same as title, generate a better summary
  const titleLower = title.toLowerCase().replace(/[^a-z0-9]/g, ' ');
  const cleanedLower = cleaned.toLowerCase();

  // Check if content is just title + source
  if (cleaned.length < 150 || cleanedLower.includes(titleLower) || titleLower.includes(cleanedLower.substring(0, 50))) {
    // Generate summary from title by expanding acronyms and adding context
    let generated = title;
    // Add engaging prefix based on category hints
    if (/market|stock|trading|invest/i.test(title)) {
      generated = `Market update: ${title}. Stay informed with real-time financial analysis and expert insights.`;
    } else if (/crypto|bitcoin|ethereum|blockchain/i.test(title)) {
      generated = `Cryptocurrency news: ${title}. Latest blockchain developments and digital asset market analysis.`;
    } else if (/forex|currency|dollar|fed|rate/i.test(title)) {
      generated = `Forex market: ${title}. Central bank policy updates and currency trading insights.`;
    } else if (/economy|inflation|gdp|employment/i.test(title)) {
      generated = `Economic news: ${title}. Expert analysis on monetary policy and market impact.`;
    } else {
      generated = `${title}. Comprehensive financial news coverage with real-time updates and professional analysis.`;
    }
    return generated;
  }

  // Remove title-like suffix (e.g., " - Yahoo Finance")
  const lastDashIndex = cleaned.lastIndexOf(' - ');
  if (lastDashIndex > cleaned.length - 50) {
    cleaned = cleaned.substring(0, lastDashIndex).trim();
  }

  // Return first 150-200 characters as summary
  if (cleaned.length <= 200) return cleaned;
  // Find sentence boundary near 180 chars
  let endPos = 180;
  const lastPeriod = cleaned.lastIndexOf('.', 180);
  const lastSpace = cleaned.lastIndexOf(' ', 180);
  if (lastPeriod > 150) endPos = lastPeriod + 1;
  else if (lastSpace > 150) endPos = lastSpace;
  return cleaned.substring(0, endPos) + '...';
}

async function fetchFeed(url, category) {
  try {
    console.log(`Fetching: ${url}`);
    const feed = await parser.parseURL(url);
    return feed.items.map(item => {
      // Google News title format: "Title - Source"
      let title = item.title || 'Untitled';
      let source = 'Google News';

      // Try to extract source from title
      const lastDashIndex = title.lastIndexOf(' - ');
      if (lastDashIndex > 0) {
        source = title.substring(lastDashIndex + 3).trim();
        title = title.substring(0, lastDashIndex).trim();
      }

      // Get summary - try multiple fields for Google News RSS
      const description = item.description || item.contentSnippet || item.content || '';
      const summary = cleanSummary(description, title);

      return {
        title: title,
        slug: slugify(title) + '-' + Date.now().toString(36) + Math.random().toString(36).substring(2, 7),
        summary: summary,
        link: item.link,
        pubDate: item.pubDate || item.isoDate || new Date().toISOString(),
        category: category,
        source: source,
        image: item.enclosure?.url || null
      };
    });
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
