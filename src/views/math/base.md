## katex公式组件

基于vue和[katex](https://github.com/KaTeX/KaTeX)的公式展示组件

默认输出的格式是`mathml`

<sx-code src="./demos/test1.vue" showCode="./demos/test1.vue"></sx-code>

### 属性

| 属性名  | 类型   | 是否必填 | 默认值 | 描述                                                            |
| ------- | ------ | -------- | ------ | --------------------------------------------------------------- |
| tex     | String | 否       | ''     | 要展示的公式文本内容                                            |
| options | Object | 否       | {}     | 透传到katex的[KatexOptions](https://katex.org/docs/options)属性 |
