module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/static");

  // Date filter with format support
  eleventyConfig.addFilter("date", function(date, format) {
    if (!date) return '';
    const d = new Date(date);
    if (isNaN(d)) return date;

    if (format === 'YYYY-MM-DD') {
      return d.toISOString().split('T')[0];
    }
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  });

  // Slugify filter
  eleventyConfig.addFilter("slug", function(str) {
    if (!str) return '';
    return str.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  });

  // Filter array by key-value
  eleventyConfig.addFilter("filterBy", function(arr, key, value) {
    if (!Array.isArray(arr)) return [];
    return arr.filter(item => item && item[key] === value);
  });

  // Truncate text
  eleventyConfig.addFilter("truncate", function(str, length) {
    if (!str) return '';
    if (str.length <= length) return str;
    return str.substring(0, length).trim() + '...';
  });

  // Capitalize first letter
  eleventyConfig.addFilter("capitalize", function(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  });

  // Slice array
  eleventyConfig.addFilter("slice", function(arr, start, end) {
    if (!Array.isArray(arr)) return [];
    return arr.slice(start, end);
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
