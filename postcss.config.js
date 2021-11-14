/**
 * Autoprefixer 사용을 위해 POST CSS 사용 설정
 * https://nextjs.org/docs/advanced-features/customizing-postcss-config
 */
module.exports = {
    plugins:
      process.env.NODE_ENV === 'production'
        ? [
            'postcss-flexbugs-fixes',
        [
              'postcss-preset-env',
            {
                autoprefixer: {
                  flexbox: 'no-2009',
                },
                stage: 3,
                features: {
                  'custom-properties': false,
                },
            },
        ],
    ]
        : [
        // No transformations in development
    ],
}