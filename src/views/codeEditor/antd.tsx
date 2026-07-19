import { CodeEditor } from "squirrel-x/CodeEditor";
import { defineComponent } from 'vue'

type Props = {}

const propsKeys: (keyof Props)[] = []

const antd = defineComponent((
  props: Props,
  // ctx: SetupContext<string[], SlotsType<Slots>>,
) => {
  return () => {
    return <div>
      
      <CodeEditor />
    </div>
  }
}, {
  name: 'antd',
  props: propsKeys,
})

export default antd