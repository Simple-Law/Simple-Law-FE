const path = require("path");

function defaultIndexTemplate(filePaths) {
  const exportEntries = filePaths.map(filePath => {
    function camelize(str) {
      return str[0].toUpperCase() + str.slice(1);
    }
    const basename = path.basename(filePath, path.extname(filePath));
    const exportName = /^\d/.test(basename) ? `Svg${basename}` : basename;
    return `export { default as ${camelize(exportName)}Icon } from './${basename}'`;
  });
  return exportEntries.join("\n");
}

module.exports = defaultIndexTemplate;
