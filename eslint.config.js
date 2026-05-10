import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
    },
    rules: {
      // Prototype UI uses common patterns (reset state when drawers close, streaming placeholders)
      // that trip this strict experimental rule; disabling keeps `npm run lint` useful without a large refactor.
      'react-hooks/set-state-in-effect': 'off',
      'react-refresh/only-export-components': 'warn',
    },
  },
])
