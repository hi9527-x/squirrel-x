import{aO as l,B as i,aK as p}from"./index-DCrC4jCS.js";import{d as s,e as m,c as r,u as o,f as u,r as v,j as x,l as _,F as f,a as C}from"./index-C1PMfBe1.js";import{C as g}from"./index-hvKi_s8m.js";import"./index-Bcgae5lD.js";const B=`
  xychart-beta
    title "Sales Revenue"
    x-axis [jan, feb, mar, apr, may, jun, jul, aug, sep, oct, nov, dec]
    y-axis "Revenue (in $)" 4000 --> 11000
    bar [5000, 6000, 7500, 8200, 9500, 10500, 11000, 10200, 9200, 8500, 7000, 6000]
    line [5000, 6000, 7500, 8200, 9500, 10500, 11000, 10200, 9200, 8500, 7000, 6000]
`,I=s({__name:"demo1",setup(a){return(e,d)=>(u(),m("div",null,[r(o(l),{code:B})]))}}),c=`
  graph TD;
    A-->B;
    A-->C;
    B-->D;
    C-->D;
`,b=s({__name:"demo2",setup(a){const e=v(""),d=()=>{e.value="";let t=0;const n=setInterval(()=>{t<c.length?(e.value+=c[t],t++):clearInterval(n)},100)};return(t,n)=>(u(),m(f,null,[r(o(i),{variant:"outlined",onClick:d},{default:_(()=>n[0]||(n[0]=[C(" 开始流式 ")])),_:1,__:[0]}),r(o(l),{code:e.value},null,8,["code"]),n[1]||(n[1]=x("p",null,"当前流式输出",-1)),r(o(p),{code:e.value},null,8,["code"])],64))}}),h=`<script setup lang="ts">\r
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
`,j=`<script setup lang="ts">\r
import { Button, Code, Mermaid } from 'squirrel-x'\r
import { ref } from 'vue'\r
\r
const code = \`\r
  graph TD;\r
    A-->B;\r
    A-->C;\r
    B-->D;\r
    C-->D;\r
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
`,y=`## vue-mermaid组件\r
\r
基于vue3制作的mermaid，文本渲染图表组件\r
\r
<sx-code src="./demos/demo1.vue" showCode="./demos/demo1.vue" ></sx-code>\r
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
`,D=Object.assign({"./demos/demo1.vue":I,"./demos/demo2.vue":b}),M=Object.assign({"./demos/demo1.vue":h,"./demos/demo2.vue":j}),A=s((a,e)=>()=>r("div",{class:"p-4"},[r(g,{markdown:y,modules:D,modulesCode:M},null)]),{props:[]});export{A as default};
