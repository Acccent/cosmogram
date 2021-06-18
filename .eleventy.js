const { DateTime } = require("luxon");
const metagen = require('eleventy-plugin-metagen');
const embedYouTube = require("eleventy-plugin-youtube-embed");
const responsiveImages = require("eleventy-plugin-responsive-images");
const pluginRss = require("@11ty/eleventy-plugin-rss");
const readingTime = require('eleventy-plugin-reading-time');
const load = require('eleventy-load');
const loadHtml = require('eleventy-load-html');
const loadJs = require('eleventy-load-js');
const loadFile = require('eleventy-load-file');

module.exports = function (eleventyConfig) {
  // eleventy-plugin-metagen
  eleventyConfig.addPlugin(metagen);

  // eleventy-plugin-youtube-embed
  eleventyConfig.addPlugin(embedYouTube, {
    embedClass: 'youtube-embed',
    lite: true
  });

  // eleventy-plugin-responsive-images
  eleventyConfig.addPlugin(responsiveImages);
  eleventyConfig.cloudinaryCloudName = "cosmogram";
  eleventyConfig.hostname = "https://cosmogr.am";

  // eleventy-plugin-rss
  eleventyConfig.addPlugin(pluginRss);

  // eleventy-plugin-reading-time
  eleventyConfig.addPlugin(readingTime);

  // Disable automatic use of your .gitignore
  eleventyConfig.setUseGitIgnore(false);

  // Merge data instead of overriding
  eleventyConfig.setDataDeepMerge(true);

  // Human readable date
  eleventyConfig.addFilter("readableDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat(
      "dd LLL yyyy"
    );
  });

  // Copy admin config to /_site
  eleventyConfig.addPassthroughCopy({
    "./src/admin/config.yml": "./admin/config.yml",
  });

  // Copy asset folders to /_site
  eleventyConfig.addPassthroughCopy("./src/static/img");
  eleventyConfig.addPassthroughCopy("./src/static/fonts");

  // Copy favicon to root of /_site
  eleventyConfig.addPassthroughCopy("./src/favicon.ico");

  const doMinimize = process.env.NODE_ENV !== "production" ? false : {
    collapseWhitespace: true,
    removeComments: true,
    removeEmptyAttributes: true,
    removeScriptTypeAttributes: true,
    removeStyleLinkTypeAttributes: true,
    useShortDoctype: true,
  };

  // Minify HTML and JS
  eleventyConfig.addPlugin(load, {
    rules: [
      {
        test: /\.(html|md)$/,
        loaders: [
          {
            loader: loadHtml,
            options: {
              minimize: doMinimize,
            }
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
  eleventyConfig.addWatchTarget("./src/static/");

  // Let Eleventy transform HTML files as nunjucks
  // So that we can use .html instead of .njk
  return {
    dir: {
      input: "src",
    },
    htmlTemplateEngine: "njk",
  };
};
