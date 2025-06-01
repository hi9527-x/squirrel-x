import { createGlobalState, watchDebounced } from '@vueuse/core'
import { debounce } from 'es-toolkit'
import { findLastIndex } from 'es-toolkit/compat'
import { createMermaidRenderer } from 'mermaid-isomorphic'
import { Empty } from 'squirrel-x'
import type { SlotsType } from 'vue'
import { defineComponent, nextTick, onMounted, ref, shallowRef, watch } from 'vue'

type ChartResultSuccess = {
  state: 'success'
  svg: string
  width: number
  height: number
}

type ChartResult = { code: string } & ({
  state: 'loading'
} | ChartResultSuccess | {
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

const Mermaid = defineComponent<
  MermaidProps,
  MermaidEmits,
  string,
  MermaidSlots
>((props) => {
  const chartStore = useChartStore()
  const chart = ref<ChartResult | null>(null)

  watchDebounced(() => props.code, (code) => {
    if (code) {
      chartStore.createChartSvg(code)
    }
  }, {
    immediate: true,
    debounce: 100,
    maxWait: 120,
  })

  watch([chartStore.code2svg, () => props.code], ([code2svg, code]) => {
    if (!code) return
    const result = code2svg[code]
    if (result?.state === 'success') {
      chart.value = result
    }
  }, {
    immediate: true,
    deep: true
  })

  return () => {
    if (chart.value?.state === 'success') return <div class="overflow-x-auto py-4">
      <div style={`width: ${chart.value.width}px; height: ${chart.value.height}px`} v-html={chart.value.svg} />
    </div>
    return <Empty description="生成中，请稍后" />
  }
}, {
  props: ['code'],
})

export default Mermaid
