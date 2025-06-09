import { watchDebounced } from '@vueuse/core'
import interact from 'interactjs'
import mermaid from 'mermaid'
import { Button, Empty } from 'squirrel-x'
import { defineComponent, onMounted, onUnmounted, ref, watch } from 'vue'

import { cn } from '@/utils'
import IconExpand from '~icons/lucide/expand'
import IconRotateCcw from '~icons/lucide/rotate-ccw'
import IconZoomIn from '~icons/lucide/zoom-in'
import IconZoomOut from '~icons/lucide/zoom-out'

import { useViewFullscreen } from '../hook'

const midCache: Record<string, string> = {}

export type MermaidProps = {
  code?: string
  options?: {
    prefix?: string
  }
}
let count = 0
const Mermaid = defineComponent<MermaidProps>((props, ctx) => {
  const svtString = ref('')
  const refChartEle = ref<HTMLElement>()

  const container = document.createElement('div')
  container.ariaHidden = 'true'
  container.style.maxHeight = '0'
  container.style.opacity = '0'
  container.style.overflow = 'hidden'
  document.body.append(container)

  let isDrag = false
  const chartCss = {
    x: 0,
    y: 0,
    scale: 1,
  }

  const { isFullscreen, toggle, className } = useViewFullscreen()
  const handleChartCss = () => {
    if (!refChartEle.value) return
    refChartEle.value.style.transform = `scale(${chartCss.scale}) translate(${chartCss.x}px, ${chartCss.y}px)`
  }
  const handleZoomIn = () => {
    chartCss.scale += 0.1
    handleChartCss()
  }

  const handleZoomOut = () => {
    // if (chartCss.scale <= 1) return
    chartCss.scale -= 0.1
    handleChartCss()
  }

  const handleReset = () => {
    chartCss.scale = 1
    chartCss.x = 0
    chartCss.y = 0
    handleChartCss()
  }

  watch(isFullscreen, () => {
    handleReset()
  })

  watch((refChartEle), (ele) => {
    if (isDrag || !ele) return
    isDrag = true

    interact(ele)
      .draggable({
        inertia: true,
        modifiers: [

        ],

        listeners: {
          move: (event) => {
            const x = chartCss.x + event.dx
            const y = chartCss.y + event.dy
            chartCss.x = x
            chartCss.y = y
            handleChartCss()
          },
        },
      })
  }, {
    immediate: true,
  })

  watchDebounced([() => props.code], async ([code]) => {
    if (!code) return
    if (midCache[code]) {
      svtString.value = midCache[code]
      return
    }

    try {
      const chart = await mermaid.parse(code, { suppressErrors: false })
      if (!chart) return

      count += 1
      const id = `${props.options?.prefix ?? 'mermaid'}-${count}`

      const renderResult = await mermaid.render(id, code, container)

      midCache[code] = renderResult.svg
      svtString.value = renderResult.svg
    }
    catch (error) {
      // console.error(error)
    }
  }, {
    immediate: true,
    debounce: 100,
    maxWait: 120,
  })

  onUnmounted(() => {
    container.remove()
  })

  const handleFull = () => {
    toggle()
    handleReset()
  }

  return () => {
    if (!props.code) return null
    if (!svtString.value) return <Empty description="请稍后..." />
    return (
      <div class={cn('pos-relative bg-white', className.value)}>
        {svtString.value && (
          <div
            class={cn(
              'overflow-hidden h-full w-full',
              'flex items-center',
            )}

          >
            <span
              ref={refChartEle}
              class={cn(
                'inline-block w-full text-center',
                'cursor-grab select-none',
              )}
              v-html={svtString.value}
            >
            </span>
          </div>
        )}

        <div class={cn(
          'pos-absolute top-3 right-3',
          'flex items-center gap-2',
        )}
        >
          <IconZoomIn class="cursor-pointer" onClick={handleZoomIn} />
          <IconZoomOut class="cursor-pointer" onClick={handleZoomOut} />
          <IconRotateCcw class="cursor-pointer" onClick={handleReset} />
          <IconExpand class="cursor-pointer" onClick={handleFull} />
        </div>
      </div>
    )
  }
}, {
  props: ['code'],
})

export default Mermaid
