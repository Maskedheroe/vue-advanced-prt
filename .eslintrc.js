module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/vue3-essential',
    '@vue/standard'
  ],
  parserOptions: {
    parser: 'babel-eslint'
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    "no-spaced-func": 'off',//函数调用时 函数名与()之间不能有空格
    "indent": ["off"],//缩进风格
    'no-trailing-spaces': 0,
    "space-before-function-paren": 0
  }
}
