import{B as t,aK as e}from"./index-DCrC4jCS.js";import{d as o,c as r,a as n}from"./index-C1PMfBe1.js";const d=o((a,l)=>()=>r("div",null,[r("div",{class:"flex gap-2"},[r(t,{color:"default",variant:"solid"},{default:()=>[n("Solid")]}),r(t,{color:"default",variant:"outlined"},{default:()=>[n("Outlined")]}),r(t,{color:"default",variant:"dashed"},{default:()=>[n("Dashed")]}),r(t,{color:"default",variant:"filled"},{default:()=>[n("Filled")]}),r(t,{color:"default",variant:"text"},{default:()=>[n("Text")]}),r(t,{color:"default",variant:"link"},{default:()=>[n("Link")]})]),r("div",{class:"mt-4 flex gap-2"},[r(t,{color:"primary",variant:"solid"},{default:()=>[n("Solid")]}),r(t,{color:"primary",variant:"outlined"},{default:()=>[n("Outlined")]}),r(t,{color:"primary",variant:"dashed"},{default:()=>[n("Dashed")]}),r(t,{color:"primary",variant:"filled"},{default:()=>[n("Filled")]}),r(t,{color:"primary",variant:"text"},{default:()=>[n("Text")]}),r(t,{color:"primary",variant:"link"},{default:()=>[n("Link")]})]),r("div",{class:"mt-4 flex gap-2"},[r(t,{color:"danger",variant:"solid"},{default:()=>[n("Solid")]}),r(t,{color:"danger",variant:"outlined"},{default:()=>[n("Outlined")]}),r(t,{color:"danger",variant:"dashed"},{default:()=>[n("Dashed")]}),r(t,{color:"danger",variant:"filled"},{default:()=>[n("Filled")]}),r(t,{color:"danger",variant:"text"},{default:()=>[n("Text")]}),r(t,{color:"danger",variant:"link"},{default:()=>[n("Link")]})])]),{props:[]}),i=`import { Button } from 'squirrel-x'\r
import type { SlotsType, VNode } from 'vue'\r
import { defineComponent } from 'vue'\r
\r
type Slots = SlotsType<{\r
  default?: () => VNode[]\r
}>\r
type Emits = {}\r
\r
type Props = {}\r
\r
const ButtonTest = defineComponent<Props, Emits, string, Slots>((props, ctx) => {\r
  return () => {\r
    return (\r
      <div>\r
        <div class="flex gap-2">\r
          <Button color="default" variant="solid">\r
            Solid\r
          </Button>\r
          <Button color="default" variant="outlined">\r
            Outlined\r
          </Button>\r
          <Button color="default" variant="dashed">\r
            Dashed\r
          </Button>\r
          <Button color="default" variant="filled">\r
            Filled\r
          </Button>\r
          <Button color="default" variant="text">\r
            Text\r
          </Button>\r
          <Button color="default" variant="link">\r
            Link\r
          </Button>\r
        </div>\r
\r
        <div class="mt-4 flex gap-2">\r
          <Button color="primary" variant="solid">\r
            Solid\r
          </Button>\r
          <Button color="primary" variant="outlined">\r
            Outlined\r
          </Button>\r
          <Button color="primary" variant="dashed">\r
            Dashed\r
          </Button>\r
          <Button color="primary" variant="filled">\r
            Filled\r
          </Button>\r
          <Button color="primary" variant="text">\r
            Text\r
          </Button>\r
          <Button color="primary" variant="link">\r
            Link\r
          </Button>\r
        </div>\r
\r
        <div class="mt-4 flex gap-2">\r
          <Button color="danger" variant="solid">\r
            Solid\r
          </Button>\r
          <Button color="danger" variant="outlined">\r
            Outlined\r
          </Button>\r
          <Button color="danger" variant="dashed">\r
            Dashed\r
          </Button>\r
          <Button color="danger" variant="filled">\r
            Filled\r
          </Button>\r
          <Button color="danger" variant="text">\r
            Text\r
          </Button>\r
          <Button color="danger" variant="link">\r
            Link\r
          </Button>\r
        </div>\r
      </div>\r
    )\r
  }\r
}, {\r
  props: [],\r
})\r
\r
export default ButtonTest\r
`,c=o((a,l)=>()=>r("div",{class:"p-4"},[r(d,null,null),r("div",{class:"mt-4 border b-gray rounded b-solid"},[r(e,{language:"typescript",code:i},null)])]),{props:[]});export{c as default};
