const path = require('path');
const copyFile = require('../../scripts/copy-files');

copyFile({
  outdir: path.resolve('../../dist/enhance-ui'),
  targetFiles: [path.resolve('./README.md')],
  targetPackageJson: path.resolve('./package.json'),
  packageExtraOptions: {
    types: './index.d.ts'
  }
});
