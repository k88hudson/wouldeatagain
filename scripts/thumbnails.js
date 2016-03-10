const im = require("imagemagick");
const colors = require("colors");
const fs = require("fs-extra");

// fs.mkdirs("./images/dist");
// im.resize({
//   srcPath: "./images/bolognese.jpg",
//   dstPath: "./images/dist/bolognese-460.jpg",
//   width: 460
// }, (err, stdout, stderr) => {
//   if (err) console.log(colors.red(err));
//   console.log('done!');
// });

function createSquare(fileName, output cropSize, resizeSize) {
  im.convert([
    "-gravity", "center", "-extent", sq + "x" + sq,
    srcPath,
    "-resize", "460x460",
    outputPath,
  ], function(err, stdout, stderr){
    console.log('foo');
  });
}

function createThumbnails(fileName, size) {
  const srcPath = `./images/${fileName}.jpg`;
  const outputPath = `./images/dist/${fileName}-${size}.jpg`;
  im.identify(srcPath, function(err, features) {
    const sq = Math.min(features.width, features.height);
    im.convert([
      "-gravity", "center", "-extent", sq + "x" + sq,
      srcPath,
      "-resize", "460x460",
      outputPath,
    ], function(err, stdout, stderr){
      console.log('foo');
    });
  });
}

im.identify("./images/bolognese.jpg", function(err, features) {
  const sq = Math.min(features.width, features.height);
  im.convert([
    "-gravity", "center", "-extent", sq + "x" + sq,
    "./images/bolognese.jpg",
    "-resize", "460x460",
    "./images/dist/bolognese-460.jpg"
  ], function(err, stdout, stderr){
    console.log('foo');
  });
});

// im.convert({
//   srcPath: "./images/bolognese.jpg",
//   dstPath: './images/bolognese-cropped.jpg',
//   width: sq,
//   gravity: "Center"
// }, function(err, stdout, stderr){
//   console.log('foo');
// });


// im.crop({
//   srcPath: path,
//   dstPath: 'cropped.jpg',
//   width: 800,
//   height: 600,
//   quality: 1,
//   gravity: "North"
// }, function(err, stdout, stderr){
//   // foo
// });
