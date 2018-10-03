/* eslint-disable no-console */

import path from 'path';
import fse from 'fs-extra';

async function copyFile(file) {
  const buildPath = path.resolve(__dirname, '../build/', path.basename(file));
  await fse.copy(file, buildPath);
  console.log(`Copied ${file} to ${buildPath}`);
}

async function createPackageFile() {
  const packageData = await fse.readFile(path.resolve(__dirname, '../package.json'), 'utf8');
  const { version, nyc, scripts, devDependencies, workspaces, ...packageDataOther } = JSON.parse(
    packageData,
  );
  const newPackageData = {
    ...packageDataOther,
    version,
    main: './core/index.js',
    private: false,
  };
  const buildPkgFilePath = path.resolve(__dirname, '../build/package.json');
  const buildVersionPath = path.resolve(__dirname, '../build/version.json');

  await fse.writeFile(buildVersionPath, JSON.stringify({
    version
  }), 'utf8');

  await fse.writeFile(buildPkgFilePath, JSON.stringify(newPackageData, null, 2), 'utf8');
  console.log(`Created package.json in ${buildPkgFilePath}`);

  return newPackageData;
}

async function prepend(file, string) {
  const data = await fse.readFile(file, 'utf8');
  await fse.writeFile(file, string + data, 'utf8');
}

async function run() {
  await Promise.all(
    ['../README.md'].map(file => {
      let filePath = path.resolve(__dirname, file);
      copyFile(filePath);
    }),
  );
  const packageData = await createPackageFile();
}

run();
