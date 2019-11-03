/* eslint-disable no-console */

const path = require('path');
const fse = require('fs-extra');

module.exports = ({
  outdir,
  targetPackageJson,
  /** 需要 copy 的文件 */
  targetFiles = [],
  packageExtraOptions = {}
}) => {
  if (!outdir) return console.error('请输入 outdir');
  const buildPath = path.resolve(outdir, `package.json`);

  async function copyFile(file) {
    const buildPath = path.resolve(__dirname, outdir, path.basename(file));
    await fse.copy(file, buildPath);
    console.log(`Copied ${file} to ${buildPath}`);
  }

  async function createPackageFile() {
    fse.readJson(targetPackageJson, (err, packageData) => {
      if(err) console.log(err);
      const {
        nyc, scripts, devDependencies, workspaces, ...packageDataOther
      } = packageData;

      const newPackageData = {
        ...packageDataOther,
        private: false,
        ...packageExtraOptions,
      };
      const buildPath = path.resolve(outdir, `package.json`);
  
      fse.writeJson(buildPath, newPackageData, (err) => {
        if(err) {
          return console.log(err);
        }
        console.log(`Created package.json in ${buildPath}`);
      });
    });
  }

  async function run() {
    await Promise.all(
      targetFiles.map((file) => {
        const filePath = path.resolve(__dirname, file);
        copyFile(filePath);
      }),
    );
    createPackageFile();
  }

  return run();
};
