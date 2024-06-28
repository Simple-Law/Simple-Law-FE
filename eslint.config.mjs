import globals from 'globals';
import pluginJs from '@eslint/js';
import pluginReactConfig from 'eslint-plugin-react/configs/recommended.js';

export default [
    { languageOptions: { globals: globals.browser } },
    pluginJs.configs.recommended,
    { files: ['**/*.jsx'], languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } } },
    {
        ...pluginReactConfig,
        rules: {
            ...pluginReactConfig.rules,
            semi: ['error', 'always'],
            'react/jsx-uses-react': 'off',
            'react/react-in-jsx-scope': 'off',
        },
    },
];
