const copyFile = require('../../scripts/copy-files');

copyFile({
  outdir: '../../dist/core',
  targetFiles: ['./README.md'],
  targetPackageJson: ['./package.json'],
  packageExtraOptions: {
    types: './index.d.ts'
  }
});
