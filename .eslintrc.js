const common = {
  env: { es2021: true },
  parserOptions: { ecmaVersion: 'latest' },
  rules: {
    'no-use-before-define': 'off',
    'semi': [2, 'always'],
    'semi': [2, 'always'],
    'max-len': [2, { 'code': 120 }],
    'operator-linebreak': ['error', 'after'],
    'no-unused-vars': ['error', { 'vars': 'all', 'args': 'all', 'ignoreRestSiblings': false }]
  }
};

module.exports = {
  root: true,
  extends: ['eslint:recommended'],
  env: {
    ...common.env,
    node: true
  },
  parserOptions: common.parserOptions,
  rules: common.rules,
  overrides: [
    {
      files: ['**/*.ts', '**/*.tsx'],
      env: {
       ...common.env,
        browser: true,
      },
      extends: [
        'standard-with-typescript',
        'plugin:react/recommended'
      ],
      parserOptions: {
        ...common.parserOptions,
        sourceType: 'module',
        project: ['tsconfig.json']
      },
      plugins: [
        'react',
        'react-hooks'
      ],
      rules: {
        ...common.rules,
        'react/react-in-jsx-scope': 'off',
        'react/jsx-boolean-value': ['error', 'always'],
        'jsx-quotes': ['error', 'prefer-double'],
        'react-hooks/rules-of-hooks': 'error',
        'react-hooks/exhaustive-deps': 'warn',
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
        '@typescript-eslint/prefer-optional-chain': 'off',
      },
      settings: {
        react: { version: 'detect' }
      }
    }
  ]
};
