import type { SlotsType } from 'vue'
import { defineComponent, ref, watch } from 'vue'

import { cn } from '@/utils'

type Slots = {}
type Emits = {
  'update:value': (val: string) => void
}

export type Props = {
  value?: string
  defaultValue?: string
  class?: string
  size?: 'small' | 'large' | 'middle'
}

const Input = defineComponent<Props, Emits, string, SlotsType<Slots>>((props, ctx) => {
  const val = ref(props.defaultValue || props.value || '')

  const handleInput = (event: Event) => {
    const inputValue = (event.target as HTMLInputElement).value
    ctx.emit('update:value', inputValue)
  }

  watch(() => props.value, (value) => {
    if (typeof value === 'string' && val.value !== value) {
      val.value = value
    }
  })
  return () => {
    let sizeClass = 'py-1 rounded-md'

    if (props.size === 'small') {
      sizeClass = 'rounded'
    }

    return (
      <input
        value={val.value}
        onInput={handleInput}
        class={cn(
          'relative box-border',
          'w-full min-w-0 m-0 px-3 ',
          'text-black text-sm  inline-block  bg-white',
          'transition-all duration-200',
          ' border-zinc-300 border border-solid',
          'hover:border-primary/80',
          'outline-0',
          sizeClass,
          props.class,
        )}
      />
    )
  }
}, {
  props: ['value', 'defaultValue', 'class', 'size'],
  inheritAttrs: false,
})

export default Input
