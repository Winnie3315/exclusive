import { Linter } from 'eslint';

const config: Linter.Config = {
  rules: {
    '@typescript-eslint/no-explicit-any': 'off', // Отключаем правило
  },
};

export default config;
