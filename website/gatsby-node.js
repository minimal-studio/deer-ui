const path = require('path');

exports.onCreateWebpackConfig = ({ stage, actions }) => {
  actions.setWebpackConfig({
    resolve: {
      modules: [
        path.resolve(__dirname, "../node_modules"),
        "node_modules"
      ],
      alias: {
        '@deer-ui/core': path.resolve(__dirname, "../packages/core"),
        '@deer-ui/enhance-ui': path.resolve(__dirname, "../packages/enhance-ui"),
      }
    },
  });
};
