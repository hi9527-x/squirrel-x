import{B as i,aK as v}from"./index-DHAcTbtD.js";import{M as l}from"./index-BLuLz2zy.js";import{d as a,f as u,c as r,u as o,g as m,r as p,h as x,j as _,a as f,F as b}from"./index-ZgcHhE59.js";import{C as g}from"./index-C8qyELrn.js";import"./index-BdLgkEAI.js";import"./index--aZuBz3I.js";const j=`
  xychart-beta
    title "Sales Revenue"
    x-axis [jan, feb, mar, apr, may, jun, jul, aug, sep, oct, nov, dec]
    y-axis "Revenue (in $)" 4000 --> 11000
    bar [5000, 6000, 7500, 8200, 9500, 10500, 11000, 10200, 9200, 8500, 7000, 6000]
    line [5000, 6000, 7500, 8200, 9500, 10500, 11000, 10200, 9200, 8500, 7000, 6000]
`,y=a({__name:"demo1",setup(s){return(e,d)=>(m(),u("div",null,[r(o(l),{code:j})]))}}),c=`
  xychart-beta
    title "Sales Revenue"
    x-axis [jan, feb, mar, apr, may, jun, jul, aug, sep, oct, nov, dec]
    y-axis "Revenue (in $)" 4000 --> 11000
    bar [5000, 6000, 7500, 8200, 9500, 10500, 11000, 10200, 9200, 8500, 7000, 6000]
    line [5000, 6000, 7500, 8200, 9500, 10500, 11000, 10200, 9200, 8500, 7000, 6000]
`,C=a({__name:"demo2",setup(s){const e=p(""),d=()=>{e.value="";let t=0;const n=setInterval(()=>{t<c.length?(e.value+=c[t],t++):clearInterval(n)},100)};return(t,n)=>(m(),u(b,null,[r(o(i),{variant:"outlined",onClick:d},{default:_(()=>n[0]||(n[0]=[f(" 开始流式 ")])),_:1,__:[0]}),r(o(l),{code:e.value},null,8,["code"]),n[1]||(n[1]=x("p",null,"当前流式输出",-1)),r(o(v),{code:e.value},null,8,["code"])],64))}}),I=`<script setup lang="ts">\r
import { Mermaid } from 'squirrel-x'\r
\r
const code = \`\r
  xychart-beta\r
    title "Sales Revenue"\r
    x-axis [jan, feb, mar, apr, may, jun, jul, aug, sep, oct, nov, dec]\r
    y-axis "Revenue (in $)" 4000 --> 11000\r
    bar [5000, 6000, 7500, 8200, 9500, 10500, 11000, 10200, 9200, 8500, 7000, 6000]\r
    line [5000, 6000, 7500, 8200, 9500, 10500, 11000, 10200, 9200, 8500, 7000, 6000]\r
\`\r
<\/script>\r
\r
<template>\r
  <div>\r
    <Mermaid\r
      :code="code"\r
    />\r
  </div>\r
</template>\r
`,h=`<script setup lang="ts">\r
import { Button, Code, Mermaid } from 'squirrel-x'\r
import { ref } from 'vue'\r
\r
const code = \`\r
  xychart-beta\r
    title "Sales Revenue"\r
    x-axis [jan, feb, mar, apr, may, jun, jul, aug, sep, oct, nov, dec]\r
    y-axis "Revenue (in $)" 4000 --> 11000\r
    bar [5000, 6000, 7500, 8200, 9500, 10500, 11000, 10200, 9200, 8500, 7000, 6000]\r
    line [5000, 6000, 7500, 8200, 9500, 10500, 11000, 10200, 9200, 8500, 7000, 6000]\r
\`\r
\r
const content = ref('')\r
\r
const handleStart = () => {\r
  content.value = ''\r
  let currentIndex = 0\r
  const intervalId = setInterval(() => {\r
    if (currentIndex < code.length) {\r
      content.value += code[currentIndex]\r
      currentIndex++\r
    }\r
    else {\r
      clearInterval(intervalId)\r
    }\r
  }, 100)\r
}\r
<\/script>\r
\r
<template>\r
  <Button\r
    variant="outlined"\r
    :onClick="handleStart"\r
  >\r
    开始流式\r
  </Button>\r
\r
  <Mermaid :code="content" />\r
\r
  <p>当前流式输出</p>\r
  <Code :code="content" />\r
</template>\r
\r
<style module="Css" lang="less">\r
\r
</style>\r
`,R=`## vue-mermaid组件\r
\r
### base\r
\r
基于vue3制作的mermaid，文本渲染图表组件\r
\r
<sx-code src="./demos/demo1.vue" showCode="./demos/demo1.vue" ></sx-code>\r
\r
### 流式渲染\r
\r
并且优化了在聊天窗里，sse接口的流式渲染\r
\r
<sx-code src="./demos/demo2.vue" showCode="./demos/demo2.vue" ></sx-code>\r
\r
### 属性\r
\r
| 属性名 | 类型   | 是否必填 | 默认值 | 描述                    |\r
| ------ | ------ | -------- | ------ | ----------------------- |\r
| code   | String | 否       | ''     | 要展示的mermaid文本内容 |\r
`,B=Object.assign({"./demos/demo1.vue":y,"./demos/demo2.vue":C}),S=Object.assign({"./demos/demo1.vue":I,"./demos/demo2.vue":h}),q=a((s,e)=>()=>r("div",{class:"p-4"},[r(g,{markdown:R,modules:B,modulesCode:S},null)]),{props:[]});export{q as default};
