import globals from 'globals';
import pluginJs from '@eslint/js';
import pluginReact from 'eslint-plugin-react';
import pluginReactHooks from 'eslint-plugin-react-hooks';
import pluginPrettier from 'eslint-plugin-prettier';
import prettier from 'eslint-config-prettier';
import pluginJson from 'eslint-plugin-json';
import pluginNode from 'eslint-plugin-node';
import pluginImport from 'eslint-plugin-import';
import pluginTypescript from '@typescript-eslint/eslint-plugin';
import parserTypescript from '@typescript-eslint/parser';

export default [
  { ignores: ['frontend/dist', 'node_modules'] },
  {
    files: ['frontend/**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      parser: parserTypescript,
      globals: globals.browser,
    },
    plugins: {
      react: pluginReact,
      'react-hooks': pluginReactHooks,
      prettier: pluginPrettier,
      import: pluginImport,
      '@typescript-eslint': pluginTypescript,
    },
    rules: {
      ...pluginJs.configs.recommended.rules,
      ...pluginReact.configs.recommended.rules,
      ...pluginReactHooks.configs.recommended.rules,
      ...pluginTypescript.configs.recommended.rules,
      ...pluginPrettier.configs.recommended.rules,
      'prettier/prettier': 'error', // Enforce Prettier rules
      'react/react-in-jsx-scope': 'off', // Not needed with React 17+
      'react/prop-types': 'off', // Disable prop-types as we use TypeScript
      '@typescript-eslint/no-unused-vars': 'off', // Disable no-unused-vars rule
      quotes: ['error', 'single'], // Enforce single quotes
      indent: ['error', 2], // Enforce 2-space indentation
      'no-restricted-syntax': [
        'error',
        {
          selector: 'CallExpression[callee.name="require"]',
          message: 'Use import instead of require',
        },
      ],
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  {
    files: ['backend/**/*.{ts}'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      parser: parserTypescript,
      globals: globals.node,
    },
    plugins: {
      node: pluginNode,
      prettier: pluginPrettier,
      import: pluginImport,
      '@typescript-eslint': pluginTypescript,
    },
    rules: {
      ...pluginJs.configs.recommended.rules,
      ...pluginNode.configs.recommended.rules,
      ...pluginTypescript.configs.recommended.rules,
      ...pluginPrettier.configs.recommended.rules,
      'prettier/prettier': 'error', // Enforce Prettier rules
      '@typescript-eslint/no-unused-vars': 'off', // Disable no-unused-vars rule
      quotes: ['error', 'single'], // Enforce single quotes
      indent: ['error', 2], // Enforce 2-space indentation
      'no-restricted-syntax': [
        'error',
        {
          selector: 'CallExpression[callee.name="require"]',
          message: 'Use import instead of require',
        },
      ],
      'node/no-unsupported-features/es-syntax': 'off', // Allow modern ECMAScript features
    },
  },
  {
    files: ['**/*.json'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: { ...globals.node, ...globals.browser },
      parser: '@babel/eslint-parser',
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
