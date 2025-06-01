## 代码高亮

基于[highlightjs](https://highlightjs.org/),制作的vue3组件

- 默认使用[jetbrains mono](https://www.jetbrains.com/zh-cn/lp/mono/)等宽字体，优化展示效果
- 支持高亮语法切换
- 支持代码复制
- 行号展示隐藏
- 代码全屏展示

<sx-code src="./demos/test1.vue" showCode="./demos/test1.vue"></sx-code>

## 属性

| 属性名       | 类型              | 是否必填 | 默认值 | 描述             |
| ------------ | ----------------- | -------- | ------ | ---------------- |
| showLineNum  | boolean           | 否       | true   | 是否显示行号     |
| toolbar      | boolean \| object | 否       | true   | 是否显示工具栏   |
| --copy       | boolean           | 否       | true   | 复制按钮         |
| --fullScreen | boolean           | 否       | true   | 全屏按钮         |
| --language   | boolean           | 否       | true   | 高亮语言选择     |
| --lineNum    | boolean           | 否       | true   | 行号显示按钮     |
| betterFont   | boolean           | 否       | true   | 加载渲染等宽字体 |
| class        | string            | 否       | ''     | code class       |
