import{M as n}from"./index-RUa5IENv.js";import{d as e,c as r}from"./index-1ZbwNkkv.js";const t=`# squirrel-x\r
\r
基于vue3的组件库，定位是\`AI组件库\`\r
\r
暂时只有vue-markdown渲染，后续会推出纯文本的markdown编辑器，和富文本的提示词编辑器，尽情期待\r
\r
## 安装\r
\r
\`\`\`plaintext\r
pnpm add squirrel-x\r
// or\r
npm add squirrel-x\r
\`\`\`\r
\r
## 使用\r
\r
下文的示例代码可能不完整，请优先查看这里[squirrel-x](http://squirrelx.hi9527.ren/markdown),\r
上面squirrel-x整个页面，都是基于markdown来渲染的\r
\r
## markdown\r
\r
把markdown文本内容，通过\`remark\`转换为\`Abstract Syntax Tree\`，再渲染为vue组件\r
\r
* 使用vue组件来渲染markdown语法，所以你可以使用vue组件渲染markdown的语法，而不用再去找markdown-it的插件了\r
* 默认是安全的，没有使用v-html来渲染markdown（markdown的html标签，默认关闭）\r
* 支持vue语法高亮,且code渲染默认开始使用\`JetBrains Mono\`等宽字体，若电脑没有会自动安装。\r
* 支持[mermaid](https://mermaid.js.org/)渲染图表，组件单独提供，也可以给vue作为渲染mermaid组件使用\r
* 支持[katex](https://github.com/KaTeX/KaTeX)渲染公式，同上单独提供\r
* class隔离，不会污染项目其他样式，特别是\`微应用\`的项目，但不保证不会被项目全局或上层样式污染，\r
* *支持流式渲染*性能待考察，后续会支持\`Web Worker\`来处理转换过程，提升效率\r
\r
\r
\r
\r
### markdown渲染Mermaid图表\r
\r
自定义组件渲染，推荐使用\`codeBlock\`插槽，如下示例\r
\r
\`\`\`vue\r
<script setup lang="ts">\r
import { Markdown, Mermaid } from 'squirrel-x'\r
\r
import markdown from './mermaid.md?raw'\r
<\/script>\r
\r
<template>\r
  <Markdown :content="markdown">\r
    <template #codeBlock="{ code, language }">\r
      <div v-if="language === 'mermaid'">\r
        <Mermaid :code="code" />\r
      </div>\r
    </template>\r
  </Markdown>\r
</template>\r
\r
\`\`\`\r
\r
\`\`\`md\r
\\\`\\\`\\\`mermaid\r
flowchart LR\r
  A[Start]-->B[Do you have coffee beans?]\r
  B-->|Yes|C[Grind the coffee beans]\r
  B-->|No|D[Buy ground coffee beans]\r
  C-->E[Add coffee grounds to filter]\r
  D-->E\r
  E-->F[Add hot water to filter]\r
  F-->G[Enjoy!]\r
\\\`\\\`\\\`\r
\`\`\`\r
\r
\r
### markdown自定义vue组件渲染\r
\r
例如我们可以通过，markdown的围栏代码块语法来渲染我们自己的组件\r
\r
请自行处理流式输出的渲染性能优化\r
\r
\`\`\`vue\r
<script setup lang="ts">\r
import { Markdown } from 'squirrel-x'\r
\r
import markdown from './echarts.md?raw'\r
import EchartsTest from './EchartsTest.vue'\r
<\/script>\r
\r
<template>\r
  <div>\r
    <Markdown\r
      :content="markdown"\r
    >\r
      <template #codeBlock="{ language, code }">\r
        <EchartsTest\r
          v-if="language === 'x-echarts'"\r
          :code="code"\r
        />\r
      </template>\r
    </Markdown>\r
  </div>\r
</template>\r
\`\`\`\r
\r
EchartsTest\r
\r
\`\`\`vue\r
<script setup lang="ts">\r
import * as echarts from 'echarts'\r
import { isJSONObject } from 'es-toolkit'\r
import { onMounted, ref } from 'vue'\r
\r
const props = defineProps<{ code: string }>()\r
\r
const refEle = ref<HTMLElement>()\r
\r
onMounted(() => {\r
  try {\r
    if (!refEle.value) return\r
    const option = JSON.parse(props.code || '')\r
    if (!isJSONObject(option)) return\r
    const myChart = echarts.init(refEle.value)\r
    myChart.setOption(option)\r
  }\r
  catch (error) {\r
\r
  }\r
})\r
<\/script>\r
\r
<template>\r
  <div\r
    ref="refEle"\r
    class="h-100"\r
  />\r
</template>\r
\r
\`\`\`\r
\r
更多示例查看[地址](./markdown)，\r
\r
[github看这里](./src/views/markdown/base.md)\r
\r
## 属性\r
\r
| 属性名         | 类型              | 是否必填 | 默认值 | 描述                      |\r
|----------------|-------------------|---------|--------|---------------------------|\r
| content        | String            | 否       | ''     | 要展示的markdown文本内容  |\r
| allowDangerousHtml     | boolean           | 否       | false  | 是否渲染markdown html内容 |\r
| class          | string            | 否       | ''     | markdown 根dom 添加class  |\r
| codeProps      | object            | 否       | {}     | 透传到code高亮渲染组件    |\r
| --showLineNum  | boolean           | 否       | true   | 是否显示行号              |\r
| --toolbar      | boolean \\| object | 否       | true   | 是否显示工具栏            |\r
| ----copy       | boolean           | 否       | true   | 复制按钮                  |\r
| ----fullScreen | boolean           | 否       | true   | 全屏按钮                  |\r
| ----language   | boolean           | 否       | true   | 高亮语言选择              |\r
| ----lineNum    | boolean           | 否       | true   | 行号显示按钮              |\r
| --betterFont   | boolean           | 否       | true   | 加载渲染等宽字体          |\r
| --class        | string            | 否       | ''     | code class                |\r
\r
## 插槽\r
\r
优先推荐使用\`codeBlock\`来扩展自定义组件，参考上面的mermaid自定义渲染\r
\r
\`\`\` typescript\r
export type MdRenderSlots = SlotsType<{\r
  customRender?: (params: { ast: HElement, childrenRender: (ast: HAstContent) => VNode }) => VNode[]\r
  codeBlock?: (params: { language: string, code: string, display: CodeDisplay }) => VNode[]\r
}>\r
\`\`\`\r
\r
如果要使用\`customRender\`的方式，这个是基于hast里面的element扩展，需要先查看\`ast\`参数，请参考[hast element](https://github.com/syntax-tree/hast?tab=readme-ov-file#element)，\r
在查看[markdown](http://squirrelx.hi9527.ren/markdown)示例代码，\r
\r
注意，\r
* 如果需要扩展markdown里面的html标签，需要开启\`allowDangerousHtml\`\r
* markdown里面编写html标签，需要\`<x-code src="xxx"></x-code>\`，而不能\`<x-code src="xxx" />\`\r
* html 的tagName，需要全小写\r
\r
\r
## 交流\r
\r
打工牛马，文档有待补充，如有问题，进提[issues](https://github.com/hi9527-x/squirrel-x/issues)或者加群交流\r
\r
![](http://squirrelx.hi9527.ren/IMG_20250527_091058.png?x-oss-process=image/resize,w_360/format,webp)`,d=e((o,a)=>()=>r("div",{class:"min-w-240 flex justify-center p-5"},[r(n,{content:t,class:"flex-1"},null)]),{props:[]});export{d as default};
