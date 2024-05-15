// icons/index.js
function importAll(r) {
  let icons = {};
  r.keys().map((item, index) => {
    icons[item.replace("./", "").replace(".svg", "")] = r(item);
  });
  return icons;
}

const iconFiles = require.context("assets/images/icons", true, /\.svg$/);
const icons = importAll(iconFiles);

export default icons;
