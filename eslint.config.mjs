import antfu from '@antfu/eslint-config'
import simpleImportSort from 'eslint-plugin-simple-import-sort'

export default antfu({
  formatters: true,
  vue: true,
  unocss: true,
  rules: {
    // imports和exports排序
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',

    // if后一定要换行，关闭
    'antfu/if-newline': ['off'],
    // 顶层需要是function关闭
    'antfu/top-level-function': ['off'],

    // vue组件属性，每一个都需要换行
    'vue/max-attributes-per-line': ['error', {
      singleline: 1,
      multiline: 1,
    }],

    // 关闭vue属性连字符
    'vue/attribute-hyphenation': ['off'],

    'curly': ['error', 'multi-line'],

    // 使用了simple-import-sort，就不用这个了
    'perfectionist/sort-imports': ['off'],
    'import/order': ['off'],

    'ts/consistent-type-definitions': ['off'],
    // 未使用的变量，给出警告
    'unused-imports/no-unused-vars': ['warn'],
    'no-console': ['warn', { allow: ['warn', 'error'] }],

    // 运行使用空的对象{},
    'ts/no-empty-object-type': ['off'],

  },
  plugins: {
    'simple-import-sort': simpleImportSort,
  },
  ignores: [
    'dist',
    'node_modules',
    '*-lock.*',
    '*.md',
  ],
})
