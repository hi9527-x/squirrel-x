import"./index-RUa5IENv.js";import{K as s}from"./Katex-DZmxboPh.js";import{d as t,e as o,c as e,u as a,f as m}from"./index-1ZbwNkkv.js";import{C as c}from"./index-B4mH7bTd.js";import"./index-D_CZNAnK.js";const p="c = \\pm\\sqrt{a^2 + b^2}",d=t({__name:"test1",setup(r){return(n,_)=>(m(),o("div",null,[e(a(s),{tex:p})]))}}),i=`<script setup lang="ts">\r
import { Katex } from 'squirrel-x'\r
\r
const tex = 'c = \\\\pm\\\\sqrt{a^2 + b^2}'\r
<\/script>\r
\r
<template>\r
  <div>\r
    <Katex\r
      :tex="tex"\r
    />\r
  </div>\r
</template>\r
\r
<style module="Css" lang="less">\r
\r
</style>\r
`,l=`## katex公式组件\r
\r
基于vue和[katex](https://github.com/KaTeX/KaTeX)的公式展示组件\r
\r
默认输出的格式是\`mathml\`\r
\r
<sx-code src="./demos/test1.vue" showCode="./demos/test1.vue"></sx-code>\r
\r
### 属性\r
\r
| 属性名  | 类型   | 是否必填 | 默认值 | 描述                                                            |\r
| ------- | ------ | -------- | ------ | --------------------------------------------------------------- |\r
| tex     | String | 否       | ''     | 要展示的公式文本内容                                            |\r
| options | Object | 否       | {}     | 透传到katex的[KatexOptions](https://katex.org/docs/options)属性 |\r
`,u=Object.assign({"./demos/test1.vue":d}),x=Object.assign({"./demos/test1.vue":i}),h=t((r,n)=>()=>e("div",{class:"p-4"},[e(c,{markdown:l,modules:u,modulesCode:x},null)]),{props:[]});export{h as default};
