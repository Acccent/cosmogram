module.exports = {
  plugins: [
    require('postcss-easy-import'),
    require('postcss-each'),
    require('postcss-mixins'),
    require('postcss-custom-selectors'),
    require('postcss-nested'),
    require('postcss-custom-media'),
    // require('colorguard'),
    require('postcss-color-mod-function'),
    require('autoprefixer'),
    ...(process.env.NODE_ENV === "production"
      ? [
          require('cssnano')({
            preset: "default",
          }),
        ]
      : []),
  ],
};
