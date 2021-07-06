module.exports = {
  "root": true,
  env: {
    browser: true,
    node: true,
    es2021: true
  },
  extends: [
    'plugin:react/recommended',
    'plugin:prettier/recommended'
  ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module'
  },
  rules: {
    'prettier/prettier': 'warn',
    "react/jsx-uses-react": "off",
    "react/react-in-jsx-scope": 'off'
  }
}