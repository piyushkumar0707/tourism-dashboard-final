module.exports = {
  style: {
    postcss: {
      plugins: [
        require('tailwindcss')('./tailwind.config.js'),
        require('autoprefixer'),
      ],
    },
  },
  webpack: {
    configure: (webpackConfig) => {
      // Ensure CSS is processed correctly
      return webpackConfig;
    },
  },
};
