const im = require("imagemagick");
const colors = require("colors");
const fs = require("fs-extra");
const bluebird = require("bluebird");
const PromiseAll = bluebird.all;
const PromiseMap = bluebird.map;
const path = require("path");

function resizeAndConvert(srcPath, destDir, targetSize, density) {
  return new Promise((resolve, reject) => {
    density = density || 1;
    const realSize = targetSize * density;
    const densityLabel = density === 1 ? "" : `@${density}x`;

    const parsed = path.parse(srcPath);
    const destPath = path.join(destDir, `${parsed.name}-${targetSize}${densityLabel}${parsed.ext}`);

    im.identify(srcPath, function(err, features) {
      const sq = Math.min(features.width, features.height);
      im.convert([
        "-gravity", "center", "-extent", sq + "x" + sq,
        srcPath,
        "-resize", realSize + "x" + realSize,
        destPath,
      ], function(err, stdout, stderr){
        if (err) return reject(err);
        resolve(destPath);
      });
    });
  });
}

function createThumbnails(srcPath, destDir, targetSize) {
  fs.ensureDirSync(destDir);
  PromiseAll([
    resizeAndConvert(srcPath, destDir, targetSize, 1),
    resizeAndConvert(srcPath, destDir, targetSize, 2)
  ])
  .then(items => {
    console.log(items);
  })
  .catch(err => console.log(err));
}

function resizeAll(srcDir, destDir) {
  fs.ensureDirSync(destDir);
  const files = fs.readdirSync(srcDir).filter(filename => {
    const ext = path.extname(filename).toLowerCase();
    return ext === ".jpg";
  });
  PromiseMap(files, filename => {
    return new Promise((resolve, reject) => {
      const srcPath = path.resolve(srcDir, filename);
      const destPath = path.resolve(destDir, filename);
      const width = filename.match(/-square.jpg$/i) ? 500 : 1500;
      im.convert([
        srcPath,
        "-resize", width + "x" + width,
        destPath,
      ], function(err, stdout, stderr){
        if (err) return reject(err);
        resolve(destPath);
      });
    });
  })
  .then(data => {
    console.log(data);
  })
  .catch(err => console.log(err));
}

resizeAll(path.resolve(__dirname, "../_images"), path.resolve(__dirname, "../assets"));
