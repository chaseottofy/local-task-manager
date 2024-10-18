const cheerio = require('cheerio');
const path = require('node:path');
const fs = require('node:fs');

module.exports = function(source) {
  const callback = this.async();
  const $ = cheerio.load(source);
  const svgs = $('svg');

  // Use the context's resourcePath to determine the relative output path
  const context = this.rootContext || this.context;
  const { resourcePath } = this;
  const relativePath = path.relative(context, path.dirname(resourcePath));
  const svgOutputPath = path.join(context, 'dist', relativePath, 'extracted-svgs');

  // Ensure the output directory exists
  if (!fs.existsSync(svgOutputPath)) {
    fs.mkdirSync(svgOutputPath, { recursive: true });
  }

  svgs.each((index, element) => {
    const svg = $(element);
    const width = svg.attr('width') || '16';
    const height = svg.attr('height') || '16';
    const svgContent = svg.toString();
    const filename = `svg-${index}-${Date.now()}.svg`;
    const outputPath = path.join(svgOutputPath, filename);

    // Write SVG to file
    fs.writeFileSync(outputPath, svgContent);

    // Replace inline SVG with img tag
    // Use a relative path from the HTML file to the SVG
    const relativeSvgPath = path.relative(path.dirname(resourcePath), outputPath).replaceAll('\\', '/');
    svg.replaceWith(`<img src="${relativeSvgPath}" alt="Extracted SVG ${index}" width="${width}" height="${height}">`);
  });

  callback(null, $.html());
};
