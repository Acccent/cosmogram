module.exports = {
  plugins: [
    require('postcss-easy-import'),
    require('postcss-each'),
    require('postcss-mixins'),
    require('postcss-custom-selectors'),
    require('postcss-custom-media'),
    require('postcss-color-mod-function'),
    require('postcss-nested'),
    require('autoprefixer'),
    ...(process.env.NODE_ENV === 'production'
      ? [
          require('cssnano')({
            preset: 'default',
          }),
        ]
      : []),
    // require('colorguard'),
  ],
};
