import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
// import nextConfig from 'eslint-config-next';
import prettierConfig from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import simpleImportSortPlugin from 'eslint-plugin-simple-import-sort';
import globals from 'globals';

export default [
  {
    // Global settings.
    plugins: {
      '@typescript-eslint': tsPlugin,
      import: importPlugin,
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      'simple-import-sort': simpleImportSortPlugin,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 13,
        sourceType: 'module',
        tsconfigRootDir: '.',
        project: './tsconfig.json',
      },
      globals: {
        ...globals.browser,
      },
    },
  },
  // nextConfig,
  prettierConfig,
  {
    // Project and files settings.
    files: ['**/*.tsx', '**/*.ts', '**/*.js', '**/*.jsx', '**/*.mjs'],
    rules: {
      ...reactHooksPlugin.configs.recommended.rules,
      ...tsPlugin.configs.recommended.rules,
      ...tsPlugin.configs.strict.rules,
      ...tsPlugin.configs['stylistic-type-checked'].rules,
      ...importPlugin.configs.recommended.rules,
      ...importPlugin.configs.typescript.rules,

      'no-console': ['error', { allow: ['warn', 'error'] }],
      quotes: ['error', 'single', { avoidEscape: true }],
      semi: ['off'],
      'comma-dangle': ['error', 'always-multiline'],
      'comma-spacing': ['error', { before: false, after: true }],
      'constructor-super': 'error',
      'eol-last': ['error', 'always'],
      'key-spacing': ['error', { beforeColon: false, afterColon: true }],
      'keyword-spacing': ['error', { before: true, after: true }],
      'space-infix-ops': ['error', { int32Hint: false }],
      curly: ['error', 'all'],
      'object-curly-spacing': ['error', 'always'],
      'array-bracket-spacing': ['error', 'never'],
      'spaced-comment': ['error', 'always', { markers: ['/'] }],
      'no-trailing-spaces': 'error',
      'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 0, maxBOF: 0 }],
      'no-unused-vars': 'off',
      'no-underscore-dangle': 'off',
      'one-var': ['error', 'never'],
      eqeqeq: 'warn',

      'import/namespace': 'off',
      'simple-import-sort/imports': 'warn',
      'simple-import-sort/exports': 'warn',
      'sort-imports': 'off',
      'import/order': 'off',
      'import/no-default-export': 'error',
      'import/no-unresolved': 'off',
      'import/consistent-type-specifier-style': ['warn', 'prefer-inline'],
      '@typescript-eslint/consistent-type-imports': [
        'warn',
        {
          prefer: 'type-imports',
          fixStyle: 'inline-type-imports',
        },
      ],

      '@typescript-eslint/semi': ['error', 'always', { omitLastInOneLineBlock: true }],
      '@typescript-eslint/method-signature-style': 'warn',
      '@typescript-eslint/non-nullable-type-assertion-style': 'off',
      '@typescript-eslint/no-empty-interface': ['error', { allowSingleExtends: true }],
      '@typescript-eslint/no-non-null-assertion': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-misused-promises': ['error', { checksVoidReturn: false }],
      '@typescript-eslint/dot-notation': 'off',
      '@typescript-eslint/consistent-indexed-object-style': ['error', 'record'],
      '@typescript-eslint/member-delimiter-style': 'error',
      '@typescript-eslint/consistent-type-definitions': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          args: 'all',
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
    },
  },
  {
    // Testing files settings.
    files: ['*.test.ts', '*.test.tsx'],
    rules: {
      'no-console': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unnecessary-type-arguments': 'off',
    },
  },
  {
    // Page files settings.
    files: ['app/*.tsx', 'app/*.ts'],
    rules: {
      'import/no-default-export': 'off',
    },
  },
  {
    // Config files settings.
    files: ['*.config.js', '*.config.mjs', '*.config.cjs', '*.config.ts', '*.setup.ts'],
    rules: {
      'import/no-default-export': 'off',
    },
  },
  {
    // Ignored files settings.
    ignores: ['node_modules', 'build', 'public', '.next', '*.ico', '*.log', '*.lock', 'generated'],
  },
];
