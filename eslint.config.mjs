// ESLint 10 flat config — code quality only. Prettier owns formatting
// (eslint-config-prettier, loaded LAST, disables any stylistic rules that would conflict).
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginVue from 'eslint-plugin-vue';
import eslintPluginAstro from 'eslint-plugin-astro';
import prettier from 'eslint-config-prettier';
import globals from 'globals';

export default tseslint.config(
  { ignores: ['dist/', '.astro/', 'node_modules/'] },

  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  ...eslintPluginAstro.configs.recommended,

  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
  },

  // Vue SFCs use the TS parser for <script lang="ts"> (vue-eslint-parser delegates to it).
  {
    files: ['**/*.vue'],
    languageOptions: {
      parserOptions: { parser: tseslint.parser },
    },
  },

  // Must come last: turn off rules that conflict with Prettier.
  prettier,
);
