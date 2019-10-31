const path = require('path');

exports.onCreateWebpackConfig = ({ stage, actions }) => {
  actions.setWebpackConfig({
    resolve: {
      modules: [
        path.resolve(__dirname, "../node_modules"),
        path.resolve(__dirname, "../packages"),
        "node_modules"
      ],
    },
  });
};
