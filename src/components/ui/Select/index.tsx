import { useVirtualizer } from '@tanstack/vue-virtual'
import type { ButtonProps } from 'squirrel-x'
import { Button, Popover } from 'squirrel-x'
import type { SlotsType, VNode } from 'vue'
import { computed, defineComponent, ref, watch } from 'vue'

import { cn } from '@/utils'
import IconChevronDown from '~icons/lucide/chevron-down'

type SelectSlots = SlotsType<{
  default?: () => VNode[]
}>
type SelectEmits = {
  change: (val: string) => void
}

export type SelectProps = {
  options?: { label: string, value: string }[]
  placeholder?: string
  value?: string
  bordered?: boolean
  class?: string
} & Pick<ButtonProps, 'size' | 'disabled'>

const Select = defineComponent<SelectProps, SelectEmits, string, SelectSlots>((props, ctx) => {
  const refButton = ref<{ target: HTMLButtonElement }>()
  const curValue = ref(props.value || '')
  const open = ref(false)
  const childWidth = computed(() => refButton.value?.target?.clientWidth || 0)

  const handleOptionCheck = (val: string) => {
    ctx.emit('change', val)
    open.value = false
    if (!props.value) {
      curValue.value = val
    }
  }

  const parentRef = ref<Element | null>(null)
  const rowVirtualizer = useVirtualizer({
    count: props.options?.length ?? 0,
    getScrollElement: () => parentRef.value,
    estimateSize: () => 26,
  })

  watch(() => props.value, (val, oldVal) => {
    if (val && val !== oldVal && val !== curValue.value) {
      curValue.value = val
    }
  }, {
    immediate: true,
  })

  return () => {
    const label = curValue.value ? props.options?.find(it => it.value === curValue.value)?.label || '' : ''
    const bordered = props.bordered !== false

    return (
      <Popover
        trigger="click"
        placement="bottom-start"
        open={open.value}
        onUpdate:open={o => open.value = o}
        v-slots={{
          content: () => {
            return (
              <div
                style={{ width: `${childWidth.value}px` }}
                ref={parentRef}
                class={cn(
                  'h-full overflow-y-auto',
                )}
              >
                <div
                  class={cn(
                    'w-full pos-relative',
                  )}
                  style={{
                    height: `${rowVirtualizer.value.getTotalSize()}px`,
                  }}
                >

                  {rowVirtualizer.value.getVirtualItems()?.map((virtualItem) => {
                    const it = props.options![virtualItem.index]
                    return (
                      <div
                        style={{
                          height: `${virtualItem.size}px`,
                          transform: `translateY(${virtualItem.start}px)`,
                        }}
                        title={it.label}
                        class={cn(
                          'pos-absolute top-0px left-0px w-full',
                          'cursor-pointer p-1 rounded',
                          'hover:bg-primary/10',
                          'text-14px truncate',
                          'box-border',
                          curValue.value === it.value ? 'bg-primary/10 font-bold' : '',
                        )}
                        onClick={() => { handleOptionCheck(it.value) }}
                      >
                        {it.label}
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          },
        }}
      >
        <Button
          ref={refButton}
          size={props.size}
          variant={bordered ? 'outlined' : 'text'}
          disabled={props.disabled}
          class={cn(
            props.class,
          )}
        >
          <span
            class={cn(

              !label ? 'c-zinc' : '',
            )}
          >
            {label || props.placeholder || ''}
          </span>
          <IconChevronDown />
        </Button>
      </Popover>
    )
  }
}, {
  props: ['options', 'size', 'placeholder', 'value', 'disabled', 'bordered', 'class'],
  emits: ['change'],
  inheritAttrs: false,
})

export default Select
