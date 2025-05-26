import { createGlobalState, watchDebounced } from '@vueuse/core'
import { debounce } from 'es-toolkit'
import { createMermaidRenderer } from 'mermaid-isomorphic'
import { Empty } from 'squirrel-x'
import type { SlotsType } from 'vue'
import { defineComponent, ref } from 'vue'

type ChartResult = { code: string } & ({
  state: 'loading'
} | {
  state: 'success'
  svg: string
  width: number
  height: number
} | {
  state: 'error'
})

const midRender = createMermaidRenderer()

const useChartStore = createGlobalState(() => {
  const code2svg = ref<Record<string, ChartResult>>({})
  const generateLoading = ref(false)

  const generateSvg = debounce(async () => {
    if (generateLoading.value) return
    const diagrams = Object.entries(code2svg.value).filter(([_, item]) => item.state === 'loading').map(([key]) => key)
    if (!diagrams.length) return
    try {
      generateLoading.value = true
      const result = await midRender(diagrams)
      result.forEach((it, idx) => {
        const code = diagrams[idx]
        if (it.status === 'rejected') {
          code2svg.value[code] = { state: 'error', code }
        }
        else if (it.status === 'fulfilled') {
          code2svg.value[code] = {
            code,
            state: 'success',
            width: it.value.width,
            height: it.value.height,
            svg: it.value.svg,

          }
        }
      })
    }
    catch (error) {
      console.error(error)
    }
    finally {
      generateLoading.value = false

      generateSvg()
    }
  }, 500)

  const createChartSvg = async (code: string) => {
    if (code2svg.value[code]) return

    code2svg.value[code] = {
      state: 'loading',
      code,
    }

    generateSvg()
  }

  return {
    createChartSvg,
    code2svg,
  }
})

type MermaidSlots = SlotsType<{}>
type MermaidEmits = {}

export type MermaidProps = {
  code?: string
}

const Mermaid = defineComponent<MermaidProps, MermaidEmits, string, MermaidSlots>((props) => {
  const chartStore = useChartStore()

  watchDebounced(() => props.code, (code) => {
    if (code) {
      chartStore.createChartSvg(code)
    }
  }, {
    immediate: true,
    debounce: 100,
    maxWait: 200,
  })

  const render = () => {
    try {
      if (!props.code) return <Empty description="生成中，请稍后" />
      const code2svg = chartStore.code2svg.value[props.code]
      if (!code2svg) return <Empty description="生成中，请稍后" />
      if (code2svg.state === 'loading') return <Empty description="生成中，请稍后" />
      if (code2svg.state === 'error') return <Empty description="生成失败" />
      if (code2svg.state === 'success' && code2svg.svg) {
        return (
          <div class="overflow-x-auto py-4">
            <div style={`width: ${code2svg.width}px; height: ${code2svg.height}px`} v-html={code2svg.svg} />
          </div>
        )
      }

      return <Empty description="生成失败" />
    }
    catch (error) {
      return <Empty description={error instanceof Error ? error.message : '生成失败'} />
    }
  }

  return () => {
    return (
      <div>
        {render()}
      </div>
    )
  }
}, {
  props: ['code'],
})

export default Mermaid
