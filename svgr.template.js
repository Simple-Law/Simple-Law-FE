const template = (variables, { tpl }) => {
  return tpl`
${variables.imports.slice(1)};
${variables.interfaces};
const ${variables.componentName} = (${variables.props}) => (
  ${variables.jsx}
);

${variables.exports};
`;
};

module.exports = template;
