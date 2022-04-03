const { DateTime } = require('luxon');
const yaml = require('js-yaml');
const metagen = require('eleventy-plugin-metagen');
const rss = require('@11ty/eleventy-plugin-rss');
const markdownIt = require('markdown-it');
const markdownItReplacements = require('markdown-it-replacements');
const markdownItAnchor = require('markdown-it-anchor');
const responsiveImages = require('eleventy-plugin-responsive-images');
const readingTime = require('eleventy-plugin-reading-time');
const embed = require('eleventy-plugin-embed-everything');
const heroicons = require('eleventy-plugin-heroicons');

module.exports = function (eleventyConfig) {
  // eleventy-plugin-metagen
  eleventyConfig.addPlugin(metagen);

  // eleventy-plugin-rss
  eleventyConfig.addPlugin(rss);

  // Configure MD replacements
  const replacements = [
    [/(^|[\s\p{P}])'(\S)/gu, '$1\u2018$2'],
    [/(\S)'([\s\p{P}]|$)/gu, '$1\u2019$2'],
    [/(^|[\s\p{P}])"(\S)/gu, '$1\u201c$2'],
    [/(\S)"([\s\p{P}]|$)/gu, '$1\u201d$2'],
  ];
  for (const r of replacements) {
    markdownItReplacements.replacements.push({
      name: r[1],
      re: r[0],
      sub: r[1],
      default: true,
    });
  }

  // Change default Markdown preprocessor to automatically add ids to headers + above replacements
  eleventyConfig.setLibrary(
    'md',
    markdownIt({
      html: true,
    })
      .use(markdownItReplacements, { ellipsis: false })
      .use(markdownItAnchor, {
        level: [2],
        tabindex: false,
        permalink: markdownItAnchor.permalink.ariaHidden({
          class: 'header-anchor ui',
          symbol:
            '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true" class="heroicon" data-heroicon-name="link" data-heroicon-style="outline"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>',
          space: false,
          placement: 'before',
        }),
      })
  );

  // eleventy-plugin-responsive-images & social-share-card-generator
  eleventyConfig.addPlugin(responsiveImages);
  eleventyConfig.cloudinaryCloudName = 'cosmogram';
  eleventyConfig.hostname = 'https://cosmogr.am';

  eleventyConfig.addShortcode('cloudimg', ({ ...options }) => {
    const sanitiseText = escape(encodeURIComponent(options.text));

    const setting = [
      'w_660',
      'h_600',
      'g_west',
      'x_500',
      'c_fit',
      'q_auto',
      'f_auto',
      'co_rgb:f9f9fb',
      'l_text:Inknut%20Antiqua_70_line_spacing_-70',
    ];

    const url = `https://res.cloudinary.com/${
      eleventyConfig.cloudinaryCloudName
    }/image/upload/${setting.join()}:${sanitiseText}/Blog_card`;

    return url;
  });

  // eleventy-plugin-reading-time
  eleventyConfig.addPlugin(readingTime);

  // eleventy-plugin-embed-everything
  eleventyConfig.addPlugin(embed, {
    youtube: {
      options: {
        embedClass: 'embed youtube',
        lite: true,
      },
    },
    twitter: {
      options: {
        embedClass: 'embed twitter',
        doNotTrack: true,
        theme: 'dark',
        align: 'center',
        width: 550,
      },
    },
  });

  // eleventy-plugin-heroicons
  eleventyConfig.addPlugin(heroicons, { className: 'heroicon' });

  // Disable automatic use of your .gitignore
  eleventyConfig.setUseGitIgnore(false);

  // Merge data instead of overriding
  eleventyConfig.setDataDeepMerge(true);

  // Human readable date
  eleventyConfig.addFilter('readableDate', dateObj => {
    return DateTime.fromJSDate(dateObj, { zone: 'utc' }).toFormat(
      'dd LLL yyyy'
    );
  });

  // Read yaml files from _data folder
  eleventyConfig.addDataExtension('yaml', contents => yaml.load(contents));

  // Copy admin config to /_site
  eleventyConfig.addPassthroughCopy({
    './src/pages/admin/config.yml': 'admin/config.yml',
  });

  // Copy assets to /_site
  eleventyConfig.addPassthroughCopy({ 'src/assets': 'assets/' });

  // Copy favicon to root of /_site
  eleventyConfig.addPassthroughCopy({ 'src/favicon.ico': 'favicon.ico' });

  // Create merged collection for homepage
  eleventyConfig.addCollection('home', api => {
    return api
      .getAllSorted()
      .filter(
        item =>
          item.data.tags &&
          item.data.tags.some(tag => ['post', 'experiment'].includes(tag))
      );
  });

  // Add CSS & JS output to watch target
  eleventyConfig.addWatchTarget('./src/build/');

  return {
    dir: {
      input: 'src',
      includes: 'includes',
    },
    // Let Eleventy transform HTML files as nunjucks
    // So that we can use .html instead of .njk
    htmlTemplateEngine: 'njk',
  };
};
