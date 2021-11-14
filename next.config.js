const path = require('path');

module.exports = {
  reactStrictMode: true,
  /*
   * SCSS 사용
   * https://nextjs.org/docs/basic-features/built-in-css-support
   */
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
}