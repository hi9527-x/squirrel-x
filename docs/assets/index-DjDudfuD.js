import{aK as c}from"./index-RUa5IENv.js";import{d as r,e as s,c as t,u as e,f as l}from"./index-1ZbwNkkv.js";import{C as d}from"./index-B4mH7bTd.js";import"./index-D_CZNAnK.js";const u=r({__name:"test1",setup(a){return(n,o)=>(l(),s("div",null,[t(e(c),{code:"console.log('hello world')",language:"js"})]))}}),m=`<script setup lang="ts">\r
import { Code } from 'squirrel-x'\r
<\/script>\r
\r
<template>\r
  <div>\r
    <Code\r
      code="console.log('hello world')"\r
      language="js"\r
    />\r
  </div>\r
</template>\r
\r
<style module="Css" lang="less">\r
\r
</style>\r
`,i=`## 代码高亮\r
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
`,p={class:"p-4"},w=r({__name:"index",setup(a){const n=Object.assign({"./demos/test1.vue":u}),o=Object.assign({"./demos/test1.vue":m});return(_,g)=>(l(),s("div",p,[t(e(d),{markdown:e(i),modules:e(n),modulesCode:e(o)},null,8,["markdown","modules","modulesCode"])]))}});export{w as default};
