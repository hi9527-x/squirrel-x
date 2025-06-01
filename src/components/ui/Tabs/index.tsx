import type { SlotsType, VNode } from 'vue'
import { defineComponent, nextTick, onMounted, ref, watch } from 'vue'

import { cn, isArrayEmpty } from '@/utils'

type TabsSlots = SlotsType<{
  default?: () => VNode[]
}>
type TabsEmits = {
  'update:value': (val: string) => void
}

type TabItem = {
  label: string
  value: string
}

export type TabsProps = {
  defaultValue?: string
  items: TabItem[]
  class?: string
  type?: 'line' | 'card'
  value?: string
}

const Tabs = defineComponent<TabsProps, TabsEmits, string, TabsSlots>((props, ctx) => {
  const refSlider = ref<HTMLElement>()
  const refTabList = ref<HTMLElement>()
  const currentTab = ref(props.value || props.defaultValue || '')

  const handleSetCurrentTab = async (ele: unknown, tabKey: string) => {
    if (!props.value) {
      currentTab.value = tabKey
    }

    ctx.emit('update:value', tabKey)

    await nextTick()
    if (!(ele instanceof HTMLElement) || !tabKey || !refSlider.value) return

    const width = ele.offsetWidth

    const left = ele.offsetLeft
    refSlider.value.style.width = `${width}px`
    refSlider.value.style.transform = `translatex(${left}px)`
  }

  watch(() => props.value, (val, oldVal) => {
    if (val && val !== oldVal) {
      currentTab.value = val
    }
  }, {

  })

  onMounted(() => {
    if (isArrayEmpty(props.items) || !refTabList.value) return

    if (!currentTab.value) {
      handleSetCurrentTab(refTabList.value?.children?.[0], props.items[0].value)
    }
    else {
      const tabIdx = props.items.findIndex(it => it.value === currentTab.value)
      if (tabIdx === -1) return
      handleSetCurrentTab(refTabList.value?.children?.[tabIdx], props.items[tabIdx].value)
    }
  })

  return () => {
    const tabType = props.type === 'card' ? 'card' : 'line'

    return (
      <div
        class={cn(
          'relative flex flex-col w-full',
          tabType === 'line' ? 'border-b b-zinc-200' : 'bg-zinc-100',
          props.class,
        )}
      >

        <div class="flex flex-wrap gap-4 px-2 py-1" ref={refTabList}>
          {props.items.map((tab) => {
            return (
              <div
                onClick={(evt) => { evt.target && handleSetCurrentTab(evt.target, tab.value) }}
                class={cn(
                  'cursor-pointer text-sm select-none px-2 py-2 truncate relative z-2',
                  'max-w-25%',
                  // tabType === 'line' ? 'bg-white' : '',
                  currentTab.value === tab.value
                    ? cn(
                        'font-bold',
                        tabType === 'line' ? 'text-primary' : 'text-zinc-900',
                      )
                    : 'text-zinc-600',
                )}
                key={tab.value}
              >
                {tab.label}
              </div>
            )
          })}
        </div>
        <div
          class={cn(
            'pos-absolute  left-0 transition-transform',
            tabType === 'line' ? 'h2px bg-primary bottom-0' : 'bg-white z-1 bg-white h-[calc(100%-8px)] rounded-md bottom-1 shadow-sm',
          )}
          ref={refSlider}
        >
        </div>
      </div>
    )
  }
}, {
  props: ['defaultValue', 'type', 'items', 'class', 'value'],
  inheritAttrs: false,
})

export default Tabs
