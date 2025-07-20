import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import json from '@eslint/json'
import css from '@eslint/css'
import { defineConfig } from 'eslint/config'
import eslintConfigPrettier from 'eslint-config-prettier'
import turboPlugin from 'eslint-plugin-turbo'
import onlyWarn from 'eslint-plugin-only-warn'
import pluginNext from '@next/eslint-plugin-next'
import pluginReactHooks from 'eslint-plugin-react-hooks'
import pluginReact from 'eslint-plugin-react'
import eslintPluginPrettier from 'eslint-plugin-prettier'

export default defineConfig([
  // language 和 globals 统一放顶层
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },

  ...js.configs.recommended,
  ...tseslint.configs.recommended, // 保留一次

  {
    ignores: ['dist/**'],
  },

  {
    plugins: {
      turbo: turboPlugin,
    },
    rules: {
      'turbo/no-undeclared-env-vars': 'warn',
    },
  },

  {
    plugins: {
      onlyWarn,
    },
  },

  {
    plugins: {
      '@next/next': pluginNext,
    },
    rules: {
      ...pluginNext.configs.recommended.rules,
      ...pluginNext.configs['core-web-vitals'].rules,
    },
  },

  {
    plugins: {
      'react-hooks': pluginReactHooks,
      react: pluginReact,
    },
    settings: { react: { version: 'detect' } },
    rules: {
      ...pluginReactHooks.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',
    },
  },

  {
    files: ['**/*.json'],
    plugins: { json },
    language: 'json/json',
    extends: ['json/recommended'],
  },
  {
    files: ['**/*.jsonc'],
    plugins: { json },
    language: 'json/jsonc',
    extends: ['json/recommended'],
  },
  {
    files: ['**/*.json5'],
    plugins: { json },
    language: 'json/json5',
    extends: ['json/recommended'],
  },
  {
    files: ['**/*.css'],
    plugins: { css },
    language: 'css/css',
    extends: ['css/recommended'],
  },
  eslintConfigPrettier,
  eslintPluginPrettier,
])
