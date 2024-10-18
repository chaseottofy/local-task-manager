const fs = require('node:fs');
const path = require('node:path');
const subsetFont = require('subset-font');

/*
inputPath = '../src/styles/geist-latin.woff2',
outputPath = '../dist/geist-latin-subset.woff2',
*/

const subsettedText = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?⌘⌫';

async function subsetFontFile(inputPath, outputPath, text) {
  try {
    const fontBuffer = fs.readFileSync(inputPath);
    const subsetBuffer = await subsetFont(fontBuffer, text);
    // output exists
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    // Write the subsetted font to output
    fs.writeFileSync(outputPath, subsetBuffer);
    console.log(`Subsetted font saved to: ${outputPath}`);
  } catch (error) {
    console.error('Error subsetting font:', error);
  }
}

// Main function to run the script
function main() {
  const args = process.argv.slice(2);
  if (args.length !== 2) {
    console.log('Usage: node subset-font.js <inputFontPath> <outputFontPath>');
    throw new Error('Invalid arguments')
  }
  subsetFontFile(...args, subsettedText);
}

main();
