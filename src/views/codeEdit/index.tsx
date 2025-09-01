import { Modal } from 'ant-design-vue'
import type { CodeEditProSlots } from 'squirrel-x'
import { Button, CodeEditPro } from 'squirrel-x'
import Mermaid from 'squirrel-x/Mermaid'
import type { SlotsType, VNode } from 'vue'
import { defineComponent, ref } from 'vue'

import content from './content.md?raw'

type Slots = {}
type Emits = {}
type Props = {}

type CodeBlokParams = Parameters<NonNullable<CodeEditProSlots['codeBlock']>>[0]

const CodeEditDemo = defineComponent<Props, Emits, string, SlotsType<Slots>>((props, ctx) => {
  const language = ref('markdown')
  const valCode = ref(content)
  const handlePreviewMermaid = (code?: string) => {
    Modal.confirm({
      maskClosable: true,
      width: 600,
      title: 'mermaid预览',
      content: (
        <div class="h-400px">
          <Mermaid
            code={code}
          />
        </div>
      ),
    })
  }

  return () => {
    return (
      <div>
        <CodeEditPro
          value={valCode}
          onLanguageChange={(l) => { language.value = l }}
          onChange={v => valCode.value = v}
          language={language.value}
          v-slots={{
            codeBlock: (params: CodeBlokParams) => {
              if (params.language === 'mermaid') {
                return (
                  <Button
                    class="ml-1"
                    size="small"
                    onClick={() => { handlePreviewMermaid(params.code) }}
                  >
                    预览
                  </Button>
                )
              }

              return null
            },
          }}
        />
      </div>
    )
  }
}, {
  props: [],
})

export default CodeEditDemo
