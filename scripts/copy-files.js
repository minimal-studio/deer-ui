/* eslint-disable no-console */

const path = require('path');
const fse = require('fs-extra');

const rootPackageJson = path.resolve(__dirname, '../package.json');

module.exports = ({
  outdir,
  targetPackageJson,
  /** 需要 copy 的文件 */
  targetFiles = [],
  packageExtraOptions = {}
}) => {
  if (!outdir) return console.error('请输入 outdir');

  async function copyFile(file) {
    const buildPath = path.resolve(__dirname, outdir, path.basename(file));
    await fse.copy(file, buildPath);
    console.log(`Copied ${file} to ${buildPath}`);
  }

  async function createPackageFile() {
    fse.readJson(targetPackageJson, (err, packageData) => {
      if (err) console.log(err);
      fse.readJson(rootPackageJson, (_err, rootPackageData) => {
        const {
          nyc, scripts, devDependencies,
          workspaces, peerDependencies = {}, ...packageDataOther
        } = packageData;

        const newPackageData = {
          ...packageDataOther,
          private: false,
          license: rootPackageData.license,
          author: rootPackageData.author,
          keywords: rootPackageData.keywords,
          repository: rootPackageData.repository,
          dependencies: rootPackageData.dependencies,
          peerDependencies: {
            ...rootPackageData.dependencies,
            ...peerDependencies
          },
          ...packageExtraOptions,
        };
        const buildPath = path.resolve(outdir, `package.json`);

        fse.writeJson(buildPath, newPackageData, (err) => {
          if (err) {
            return console.log(err);
          }
          console.log(`Created package.json in ${buildPath}`);
        });
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
