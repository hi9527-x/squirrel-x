# squirrel-x

基于vue3的组件库，定位是`AI组件库`

暂时只有vue-markdown渲染，后续会推出纯文本的markdown编辑器，和富文本的提示词编辑器，尽情期待

## 安装

```plaintext
pnpm add squirrel-x
// or
npm add squirrel-x
```

## 使用

下文的示例代码可能不完整，请优先查看这里[squirrel-x](http://squirrelx.hi9527.ren/markdown),
上面squirrel-x整个页面，都是基于markdown来渲染的

## markdown

把markdown文本内容，通过`remark`转换为`Abstract Syntax Tree`，再渲染为vue组件

* 使用vue组件来渲染markdown语法，所以你可以使用vue组件渲染markdown的语法，而不用再去找markdown-it的插件了
* 默认是安全的，没有使用v-html来渲染markdown（markdown的html标签，默认关闭）
* 支持vue语法高亮,且code渲染默认开始使用`JetBrains Mono`等宽字体，若电脑没有会自动安装。
* 支持[mermaid](https://mermaid.js.org/)渲染图表，组件单独提供，也可以给vue作为渲染mermaid组件使用
* 支持[katex](https://github.com/KaTeX/KaTeX)渲染公式，同上单独提供
* class隔离，不会污染项目其他样式，特别是`微应用`的项目，但不保证不会被项目全局或上层样式污染，
* *支持流式渲染*性能待考察，后续会支持`Web Worker`来处理转换过程，提升效率




### markdown渲染Mermaid图表

自定义组件渲染，推荐使用`codeBlock`插槽，如下示例

```vue
<script setup lang="ts">
import { Markdown, Mermaid } from 'squirrel-x'

import markdown from './mermaid.md?raw'
</script>

<template>
  <Markdown :content="markdown">
    <template #codeBlock="{ code, language }">
      <div v-if="language === 'mermaid'">
        <Mermaid :code="code" />
      </div>
    </template>
  </Markdown>
</template>

```

```md
\`\`\`mermaid
flowchart LR
  A[Start]-->B[Do you have coffee beans?]
  B-->|Yes|C[Grind the coffee beans]
  B-->|No|D[Buy ground coffee beans]
  C-->E[Add coffee grounds to filter]
  D-->E
  E-->F[Add hot water to filter]
  F-->G[Enjoy!]
\`\`\`
```


### markdown自定义vue组件渲染

例如我们可以通过，markdown的围栏代码块语法来渲染我们自己的组件

请自行处理流式输出的渲染性能优化

```vue
<script setup lang="ts">
import { Markdown } from 'squirrel-x'

import markdown from './echarts.md?raw'
import EchartsTest from './EchartsTest.vue'
</script>

<template>
  <div>
    <Markdown
      :content="markdown"
    >
      <template #codeBlock="{ language, code }">
        <EchartsTest
          v-if="language === 'x-echarts'"
          :code="code"
        />
      </template>
    </Markdown>
  </div>
</template>
```

EchartsTest

```vue
<script setup lang="ts">
import * as echarts from 'echarts'
import { isJSONObject } from 'es-toolkit'
import { onMounted, ref } from 'vue'

const props = defineProps<{ code: string }>()

const refEle = ref<HTMLElement>()

onMounted(() => {
  try {
    if (!refEle.value) return
    const option = JSON.parse(props.code || '')
    if (!isJSONObject(option)) return
    const myChart = echarts.init(refEle.value)
    myChart.setOption(option)
  }
  catch (error) {

  }
})
</script>

<template>
  <div
    ref="refEle"
    class="h-100"
  />
</template>

```

更多示例查看[地址](./markdown)，

[github看这里](./src/views/markdown/base.md)

## 属性

| 属性名         | 类型              | 是否必填 | 默认值 | 描述                      |
|----------------|-------------------|---------|--------|---------------------------|
| content        | String            | 否       | ''     | 要展示的markdown文本内容  |
| allowDangerousHtml     | boolean           | 否       | false  | 是否渲染markdown html内容 |
| class          | string            | 否       | ''     | markdown 根dom 添加class  |
| codeProps      | object            | 否       | {}     | 透传到code高亮渲染组件    |
| --showLineNum  | boolean           | 否       | true   | 是否显示行号              |
| --toolbar      | boolean \| object | 否       | true   | 是否显示工具栏            |
| ----copy       | boolean           | 否       | true   | 复制按钮                  |
| ----fullScreen | boolean           | 否       | true   | 全屏按钮                  |
| ----language   | boolean           | 否       | true   | 高亮语言选择              |
| ----lineNum    | boolean           | 否       | true   | 行号显示按钮              |
| --betterFont   | boolean           | 否       | true   | 加载渲染等宽字体          |
| --class        | string            | 否       | ''     | code class                |

## 插槽

优先推荐使用`codeBlock`来扩展自定义组件，参考上面的mermaid自定义渲染

``` typescript
export type MdRenderSlots = SlotsType<{
  customRender?: (params: { ast: HElement, childrenRender: (ast: HAstContent) => VNode }) => VNode[]
  codeBlock?: (params: { language: string, code: string, display: CodeDisplay }) => VNode[]
}>
```

如果要使用`customRender`的方式，这个是基于hast里面的element扩展，需要先查看`ast`参数，请参考[hast element](https://github.com/syntax-tree/hast?tab=readme-ov-file#element)，
在查看[markdown](http://squirrelx.hi9527.ren/markdown)示例代码，

注意，
* 如果需要扩展markdown里面的html标签，需要开启`allowDangerousHtml`
* markdown里面编写html标签，需要`<x-code src="xxx"></x-code>`，而不能`<x-code src="xxx" />`
* html 的tagName，需要全小写


## 交流

打工牛马，文档有待补充，如有问题，进提[issues](https://github.com/hi9527-x/squirrel-x/issues)或者加群交流

![](http://squirrelx.hi9527.ren/IMG_20250527_091058.png?x-oss-process=image/resize,w_360/format,webp)