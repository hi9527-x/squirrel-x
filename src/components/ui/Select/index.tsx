import type { ButtonProps } from 'squirrel-x'
import { Button, Popover } from 'squirrel-x'
import type { SlotsType, VNode } from 'vue'
import { defineComponent, ref, watch } from 'vue'

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
  const curValue = ref(props.value || '')
  const open = ref(false)

  const handleOptionCheck = (val: string) => {
    ctx.emit('change', val)
    open.value = false
    if (!props.value) {
      curValue.value = val
    }
  }

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
                class={cn(
                  'flex flex-col gap-1',
                )}
              >

                {props.options?.map((it) => {
                  return (
                    <div
                      class={cn(
                        'cursor-pointer py-2 px-4 rounded',
                        'hover:bg-primary/10',
                        curValue.value === it.value ? 'bg-primary/10 font-bold' : '',
                      )}
                      onClick={() => { handleOptionCheck(it.value) }}
                    >
                      {it.label}
                    </div>
                  )
                })}
              </div>
            )
          },
        }}
      >
        <Button
          size={props.size}
          variant={bordered ? 'outlined' : 'text'}
          disabled={props.disabled}
        >
          <span>
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
