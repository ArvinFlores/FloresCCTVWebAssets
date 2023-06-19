module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: [
    'standard-with-typescript',
    'plugin:react/recommended'
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['tsconfig.json']
  },
  plugins: [
    'react',
    'react-hooks'
  ],
  rules: {
    'react/react-in-jsx-scope': 'off',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'no-use-before-define': 'off',
    '@typescript-eslint/no-use-before-define': ['error'],
    '@typescript-eslint/semi': 'off',
    '@typescript-eslint/member-delimiter-style': [
      'error',
      {
        'multiline': {
          'delimiter': 'semi',
          'requireLast': true
        },
        'singleline': {
          'delimiter': 'semi',
          'requireLast': true
        }
      }
    ],
    '@typescript-eslint/strict-boolean-expressions': [
      2,
      { 'allowNullableBoolean': true }
    ],
    'semi': [2, 'always'],
    'max-len': [2, { 'code': 120 }],
    'jsx-quotes': ['error', 'prefer-double'],
    'react/jsx-boolean-value': ['error', 'always'],
    'operator-linebreak': ['error', 'after'],
    '@typescript-eslint/prefer-optional-chain': 'off',
    'no-unused-vars': ['error', { 'vars': 'all', 'args': 'all', 'ignoreRestSiblings': false }]
  },
  settings: {
    react: { version: 'detect' }
  }
};
