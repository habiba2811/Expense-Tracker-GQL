import globals from 'globals';
import pluginJs from '@eslint/js';
import pluginReact from 'eslint-plugin-react';
import airbnbConfig from 'eslint-config-airbnb';

export default [
  {
    files: ['**/*.{js,mjs,cjs,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    env: {
      node: true,
      es2021: true,
    },
  },
  pluginJs.configs.recommended,
  pluginReact.configs.flat.recommended,
  airbnbConfig,
  {
    rules: {
      'no-undef': 'off',
    },
  },
];
