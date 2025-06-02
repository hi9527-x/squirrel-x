import{aL as l,aK as o}from"./index-DCrC4jCS.js";import{d as r,c as e}from"./index-C1PMfBe1.js";const p=r((t,n)=>()=>e("div",null,[e(l,{size:"small",options:[{label:"选项1",value:"opt1"},{label:"选项2",value:"opt2"},{label:"选项3",value:"opt3"},{label:"选项4",value:"opt4"}]},null)]),{props:[]}),s=`import { Select } from 'squirrel-x'\r
import type { SlotsType, VNode } from 'vue'\r
import { defineComponent } from 'vue'\r
\r
type Slots = SlotsType<{\r
  default?: () => VNode\r
}>\r
type Emits = {}\r
\r
type Props = {}\r
\r
const SelectTest = defineComponent<Props, Emits, string, Slots>((props, ctx) => {\r
  return () => {\r
    return (\r
      <div>\r
        <Select\r
          size="small"\r
          options={[\r
            { label: '选项1', value: 'opt1' },\r
            { label: '选项2', value: 'opt2' },\r
            { label: '选项3', value: 'opt3' },\r
            { label: '选项4', value: 'opt4' },\r
          ]}\r
        />\r
      </div>\r
    )\r
  }\r
}, {\r
  props: [],\r
})\r
\r
export default SelectTest\r
`,d=r((t,n)=>()=>e("div",{class:"p4"},[e(p,null,null),e("div",{class:"mt-4 border b-gray rounded b-solid"},[e(o,{language:"typescript",code:s},null)])]),{props:[]});export{d as default};
