/* eslint-disable no-console */

const path = require('path');
const fse = require('fs-extra');

module.exports = (dir, packageOptions = {}) => {
  if (!dir) return console.error('请输入 dir');

  async function copyFile(file) {
    const buildPath = path.resolve(__dirname, `../${dir}/`, path.basename(file));
    await fse.copy(file, buildPath);
    console.log(`Copied ${file} to ${buildPath}`);
  }

  async function createPackageFile() {
    const packageData = await fse.readFile(path.resolve(__dirname, '../package.json'), 'utf8');
    const {
      nyc, scripts, devDependencies, workspaces, ...packageDataOther
    } = JSON.parse(
      packageData,
    );
    const newPackageData = {
      ...packageDataOther,
      main: './index.js',
      private: false,
      ...packageOptions,
    };
    const buildPath = path.resolve(__dirname, `../${dir}/package.json`);

    await fse.writeFile(buildPath, JSON.stringify(newPackageData, null, 2), 'utf8');
    console.log(`Created package.json in ${buildPath}`);

    return newPackageData;
  }

  async function prepend(file, string) {
    const data = await fse.readFile(file, 'utf8');
    await fse.writeFile(file, string + data, 'utf8');
  }

  async function run() {
    await Promise.all(
      ['../README.md'].map((file) => {
        const filePath = path.resolve(__dirname, file);
        copyFile(filePath);
      }),
    );
    const packageData = await createPackageFile();
  }

  return run();
};
