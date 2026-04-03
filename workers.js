// Cloudflare Workers configuration for URL rewriting
// This enables clean URLs for article pages: /news/{slug}/ -> static-article.html

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;

    // Handle article pages: /news/{slug}/ or /news/{slug}/index.html
    if (path.match(/^\/news\/[^\/]+\/?$/) || path.match(/^\/news\/[^\/]+\/index\.html$/)) {
      // Rewrite to static-article.html
      const articleResponse = await env.ASSETS.fetch(new URL('/news/article/index.html', request.url));
      return articleResponse;
    }

    // Default: serve from _site
    return env.ASSETS.fetch(request);
  }
};
