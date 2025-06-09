import{B as u,aK as m}from"./index-DHAcTbtD.js";import{d as a,r as p,f as l,h as s,c as n,j as v,u as r,m as _,g as d,a as b}from"./index-ZgcHhE59.js";import{C as g}from"./index-C8qyELrn.js";import"./index--aZuBz3I.js";const f={class:""},C={class:"flex gap-4"},h={class:"mt-4"},w=`
console.log('hello world')
`,x=a({__name:"test1",setup(c){const o=p({toolbar:!0});return(t,e)=>(d(),l("div",f,[s("div",C,[n(r(u),{size:"small",variant:o.value.toolbar?"solid":"outlined",color:o.value.toolbar?"primary":"default",onClick:e[0]||(e[0]=i=>o.value.toolbar=!o.value.toolbar)},{default:v(()=>e[1]||(e[1]=[b(" 工具栏 ")])),_:1,__:[1]},8,["variant","color"])]),s("div",h,[n(r(m),_(o.value,{code:w,language:"js"}),null,16)])]))}}),P=`<script setup lang="ts">\r
import type { CodeProps } from 'squirrel-x'\r
import { Button, Code } from 'squirrel-x'\r
import { ref } from 'vue'\r
\r
const testCode = \`\r
console.log('hello world')\r
\`\r
\r
const codeParams = ref<CodeProps>({\r
  toolbar: true,\r
})\r
<\/script>\r
\r
<template>\r
  <div class="">\r
    <div class="flex gap-4">\r
      <Button\r
        size="small"\r
        :variant="codeParams.toolbar ? 'solid' : 'outlined'"\r
        :color="codeParams.toolbar ? 'primary' : 'default'"\r
        @click="codeParams.toolbar = !codeParams.toolbar"\r
      >\r
        工具栏\r
      </Button>\r
    </div>\r
    <div class="mt-4">\r
      <Code\r
        v-bind="codeParams"\r
        :code="testCode"\r
        language="js"\r
      />\r
    </div>\r
  </div>\r
</template>\r
\r
<style module="Css" lang="less">\r
\r
</style>\r
`,j=`## 代码高亮\r
\r
基于[highlightjs](https://highlightjs.org/),制作的vue3组件\r
\r
- 默认使用[jetbrains mono](https://www.jetbrains.com/zh-cn/lp/mono/)等宽字体，优化展示效果\r
- 支持高亮语法切换\r
- 支持代码复制\r
- 行号展示隐藏\r
- 代码全屏展示\r
\r
<sx-code src="./demos/test1.vue" showCode="./demos/test1.vue"></sx-code>\r
\r
## 属性\r
\r
| 属性名       | 类型              | 是否必填 | 默认值 | 描述             |\r
| ------------ | ----------------- | -------- | ------ | ---------------- |\r
| showLineNum  | boolean           | 否       | true   | 是否显示行号     |\r
| toolbar      | boolean \\| object | 否       | true   | 是否显示工具栏   |\r
| --copy       | boolean           | 否       | true   | 复制按钮         |\r
| --fullScreen | boolean           | 否       | true   | 全屏按钮         |\r
| --language   | boolean           | 否       | true   | 高亮语言选择     |\r
| --lineNum    | boolean           | 否       | true   | 行号显示按钮     |\r
| betterFont   | boolean           | 否       | true   | 加载渲染等宽字体 |\r
| class        | string            | 否       | ''     | code class       |\r
`,B={class:"p-4"},V=a({__name:"index",setup(c){const o=Object.assign({"./demos/test1.vue":x}),t=Object.assign({"./demos/test1.vue":P});return(e,i)=>(d(),l("div",B,[n(r(g),{markdown:r(j),modules:r(o),modulesCode:r(t)},null,8,["markdown","modules","modulesCode"])]))}});export{V as default};
