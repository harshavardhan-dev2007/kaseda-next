const potrace = require('potrace');
const fs = require('fs');

const inputPath = '/Users/yathaharshavardhan/.gemini/antigravity-ide/brain/6b37491a-d16d-44f2-9479-0cef564d67b2/media__1782239116715.png';
const outputPath = './public/kaseda-logo.svg';

potrace.trace(inputPath, function(err, svg) {
  if (err) throw err;
  fs.writeFileSync(outputPath, svg);
  console.log("SVG generated at", outputPath);
});
