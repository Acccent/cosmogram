const { DateTime } = require('luxon');
const yaml = require('js-yaml');
const load = require('eleventy-load');
const loadHtml = require('eleventy-load-html');
const loadJs = require('eleventy-load-js');
const loadFile = require('eleventy-load-file');
const metagen = require('eleventy-plugin-metagen');
const rss = require('@11ty/eleventy-plugin-rss');
const markdownIt = require('markdown-it');
const markdownItAnchor = require('markdown-it-anchor');
const responsiveImages = require('eleventy-plugin-responsive-images');
const readingTime = require('eleventy-plugin-reading-time');
const embedYouTube = require('eleventy-plugin-youtube-embed');
const heroicons = require('eleventy-plugin-heroicons');

module.exports = function (eleventyConfig) {
  // eleventy-plugin-metagen
  eleventyConfig.addPlugin(metagen);

  // eleventy-plugin-rss
  eleventyConfig.addPlugin(rss);

  // Change default Markdown preprocessor to automatically add ids to headers
  eleventyConfig.setLibrary('md',
    markdownIt({
      html: true,
    }).use(markdownItAnchor, {
      level: [2],
      tabindex: false,
      permalink: markdownItAnchor.permalink.ariaHidden({
        class: 'header-anchor ui',
        symbol: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true" class="heroicon" data-heroicon-name="link" data-heroicon-style="outline"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>',
        space: false,
        placement: 'before'
      }),
    })
  );

  // eleventy-plugin-responsive-images
  eleventyConfig.addPlugin(responsiveImages);
  eleventyConfig.cloudinaryCloudName = 'cosmogram';
  eleventyConfig.hostname = 'https://cosmogr.am';

  // eleventy-plugin-reading-time
  eleventyConfig.addPlugin(readingTime);

  // eleventy-plugin-youtube-embed
  eleventyConfig.addPlugin(embedYouTube, {
    embedClass: 'youtube-embed',
    lite: true,
  });

  // eleventy-plugin-heroicons
  eleventyConfig.addPlugin(heroicons, { className: 'heroicon', });

  // Disable automatic use of your .gitignore
  eleventyConfig.setUseGitIgnore(false);

  // Merge data instead of overriding
  eleventyConfig.setDataDeepMerge(true);

  // Human readable date
  eleventyConfig.addFilter('readableDate', (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: 'utc' }).toFormat(
      'dd LLL yyyy'
    );
  });

  // Read yaml files from _data folder
  eleventyConfig.addDataExtension('yaml', contents => yaml.load(contents));

  // Copy admin config to /_site
  eleventyConfig.addPassthroughCopy({
    './src/admin/config.yml': './admin/config.yml',
  });

  // Copy asset folders to /_site
  eleventyConfig.addPassthroughCopy('./src/static/img');
  eleventyConfig.addPassthroughCopy('./src/static/fonts');

  // Copy favicon to root of /_site
  eleventyConfig.addPassthroughCopy('./src/favicon.ico');

  // Create merged collection for homepage
  eleventyConfig.addCollection('home', api => {
    return api.getAllSorted().filter(item => item.data.tags && item.data.tags.some(tag => ['post', 'experiment'].includes(tag)));
  });

  // Minify HTML and JS
  const doMinimize = process.env.NODE_ENV !== 'production' ? false : {
    collapseWhitespace: true,
    removeComments: true,
    removeEmptyAttributes: true,
    removeScriptTypeAttributes: true,
    removeStyleLinkTypeAttributes: true,
    useShortDoctype: true,
  };

  eleventyConfig.addPlugin(load, {
    rules: [
      {
        test: /\.(html|md)$/,
        loaders: [
          {
            loader: loadHtml,
            options: {
              minimize: doMinimize,
            },
          },
        ],
      },
      {
        test: /\.js$/,
        loaders: [
          {
            loader: loadJs,
            options: {
              mode: process.env.NODE_ENV,
            },
          },
          {
            loader: loadFile,
            options: {
              name: '[name].[hash].[ext]',
              publicPath: 'static/js',
            },
          },
        ],
      },
    ],
  });

  // Add CSS output to watch target
  eleventyConfig.addWatchTarget('./src/static/');

  // Let Eleventy transform HTML files as nunjucks
  // So that we can use .html instead of .njk
  return {
    dir: {
      input: 'src',
    },
    htmlTemplateEngine: 'njk',
  };
};
