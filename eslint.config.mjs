import globals from 'globals';
import tseslint from 'typescript-eslint';

export default [
  {
    ignores: ['.angular', 'dist'],
  },
  { languageOptions: { globals: globals.browser } },
  ...tseslint.configs.recommended,
];
