// Build static AJAX version
// Copy static HTML files and news.json to _site directory

const fs = require('fs');
const path = require('path');

const SRC_DIR = path.join(__dirname, '..');
const SITE_DIR = path.join(__dirname, '..', '_site');

// Mapping of static files to their output paths
const fileMappings = [
  { src: 'static-index.html', dest: 'index.html' },
  { src: 'static-stocks.html', dest: 'stocks/index.html' },
  { src: 'static-forex.html', dest: 'forex/index.html' },
  { src: 'static-crypto.html', dest: 'crypto/index.html' },
  { src: 'static-economy.html', dest: 'economy/index.html' },
  { src: 'static-article.html', dest: 'news/article/index.html' }
];

console.log('Building static AJAX version...');

// Ensure directories exist
fileMappings.forEach(mapping => {
  const destDir = path.dirname(path.join(SITE_DIR, mapping.dest));
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }
});

// Copy files
fileMappings.forEach(mapping => {
  const srcPath = path.join(SRC_DIR, mapping.src);
  const destPath = path.join(SITE_DIR, mapping.dest);

  if (fs.existsSync(srcPath)) {
    let content = fs.readFileSync(srcPath, 'utf8');

    // Fix news.json path for subdirectories
    if (mapping.dest !== 'index.html') {
      content = content.replace(/\/src\/_data\/news\.json/g, '../../src/_data/news.json');
    }

    fs.writeFileSync(destPath, content);
    console.log(`✓ Copied ${mapping.src} → ${mapping.dest}`);
  } else {
    console.log(`✗ Source not found: ${mapping.src}`);
  }
});

// Copy news.json to accessible location
const newsSrc = path.join(SRC_DIR, 'src', '_data', 'news.json');
const newsDest = path.join(SITE_DIR, 'src', '_data', 'news.json');

if (fs.existsSync(newsSrc)) {
  if (!fs.existsSync(path.dirname(newsDest))) {
    fs.mkdirSync(path.dirname(newsDest), { recursive: true });
  }
  fs.copyFileSync(newsSrc, newsDest);
  console.log('✓ Copied news.json');
} else {
  console.log('✗ news.json not found');
}

console.log('\nStatic AJAX build complete!');
console.log('\nNote: For article pages to work with dynamic slugs, you need server-side URL rewriting.');
console.log('For Cloudflare Workers, add a redirect rule: /news/:slug/* → /news/article/index.html');
