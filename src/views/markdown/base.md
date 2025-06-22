# VueMarkdownPro组件渲染

开箱即用的markdown渲染组件

* `VueMarkdownPro`支持vue语法高亮,且**code高亮**渲染默认开始使用`JetBrains Mono`等宽字体，若电脑没有会自动安装，
  * **code高亮组件**也可以单独使用
* 支持[katex](https://github.com/KaTeX/KaTeX)渲染公式，同上单独提供
* `VueMarkdownPro`的class隔离，不会污染项目其他样式，特别是**微应用**的项目，
  * 注意但不保证不会被项目全局或上层样式污染，
* *支持流式渲染*性能待考察，在 `web worker`里解析markdown文本

## 使用

```vue
<script setup lang="ts">
import { VueMarkdownPro } from 'squirrel-x'
import 'squirrel-x/style.css'
</script>

<template>
  <VueMarkdownPro content="## hello world" />
</template>
```


## VueMarkdownPro自定义echarts渲染

<sx-code src="./demos/Echarts.vue" showCode="./demos/Echarts.vue,./demos/EchartsTest.vue,./demos/echarts.md" ></sx-code>

## Mermaid渲染图表

<sx-code src="./demos/Mermaid.vue" showCode="./demos/mermaid.md" ></sx-code>

## 流式预览

支持的markdown语法，通过聊天窗方式流式输入

<sx-code src="./demos/Stream.vue" showCode="./demos/base.md" ></sx-code>
