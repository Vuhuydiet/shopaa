import globals from 'globals';
import pluginJs from '@eslint/js';
import pluginReact from 'eslint-plugin-react';
import pluginReactHooks from 'eslint-plugin-react-hooks';
import pluginPrettier from 'eslint-plugin-prettier';
import prettier from 'eslint-config-prettier';
import pluginJson from 'eslint-plugin-json';

export default [
  { ignores: ['frontend/dist'] },
  {
    files: ['frontend/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
        parser: '@babel/eslint-parser',
        requireConfigFile: false,
      },
    },
    settings: { react: { version: 'detect' } },
    plugins: {
      react: pluginReact,
      'react-hooks': pluginReactHooks,
      prettier: pluginPrettier,
    },
    rules: {
      ...pluginJs.configs.recommended.rules,
      ...pluginReact.configs.recommended.rules,
      ...pluginReact.configs['jsx-runtime'].rules,
      ...pluginReactHooks.configs.recommended.rules,
      'react/jsx-no-target-blank': 'off',
      indent: ['error', 2], // Enforce 2-space indentation
      'prettier/prettier': 'error', // Enforce Prettier rules
      'no-unused-vars': 'off', // Disable no-unused-vars rule
      quotes: ['error', 'single'], // Enforce single quotes
      'no-restricted-syntax': [
        'error',
        {
          selector: 'CallExpression[callee.name="require"]',
          message: 'Use import instead of require',
        },
      ],
    },
  },
  {
    files: ['backend/**/*.{js}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.node,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: {
      js: pluginJs,
      prettier: pluginPrettier,
    },
    rules: {
      indent: ['error', 2], // Enforce 2-space indentation
      'prettier/prettier': 'error', // Enforce Prettier rules
      'no-unused-vars': 'off', // Disable no-unused-vars rule
      quotes: ['error', 'single'], // Enforce single quotes
      'no-restricted-syntax': [
        'error',
        {
          selector: 'CallExpression[callee.name="require"]',
          message: 'Use import instead of require',
        },
      ],
    },
  },
  {
    files: ['**/*.{json}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: { ...globals.node, ...globals.browser },
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: {
      prettier: pluginPrettier,
      json: pluginJson,
    },
    rules: {
      indent: ['error', 2], // Enforce 2-space indentation
      'prettier/prettier': 'error', // Enforce Prettier rules
    },
  },
  prettier,
];
