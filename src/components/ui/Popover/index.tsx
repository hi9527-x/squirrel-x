import type { Placement } from '@floating-ui/vue'
import { autoPlacement, autoUpdate, flip, offset, shift, size, useFloating } from '@floating-ui/vue'
import { onClickOutside } from '@vueuse/core'
import { isBoolean } from 'es-toolkit'
import type { SlotsType, VNode } from 'vue'
import { computed, defineComponent, h, onUnmounted, ref, Teleport, watch } from 'vue'

import { cn, isEmptyElement } from '@/utils'

type PopoverSlots = SlotsType<{
  default?: () => VNode[]
  content?: () => VNode[]
}>
type PopoverEmits = {
  'update:open': (val: boolean) => void
}

export type PopoverProps = {
  placement?: Placement
  trigger?: 'click' | 'hover'
  open?: boolean
}

const Popover = defineComponent<PopoverProps, PopoverEmits, string, PopoverSlots>((props, ctx) => {
  let closeTimer: ReturnType<typeof setTimeout> | null = null
  const trigger = computed(() => props.trigger || 'hover')
  const open = ref(false)
  const reference = ref(null)
  const floating = ref<HTMLElement | null>(null)
  const handleToggle = (val = !open.value) => {
    ctx.emit('update:open', val)
    open.value = val
  }
  onClickOutside(reference, (evt) => {
    const target = evt.target
    if (target instanceof Node && floating.value?.contains(target)) {
      return
    }
    handleToggle(false)
  })
  const { floatingStyles, isPositioned } = useFloating(reference, floating, {
    middleware: [
      offset(),
      shift(),
      flip({
        fallbackStrategy: 'initialPlacement',
      }),
      size({
        apply({ availableHeight, availableWidth, elements }) {
          Object.assign(elements.floating.style, {
            height: (availableHeight - 32) > elements.floating.scrollHeight ? '' : `${availableHeight - 32}px`,
          })
        },
      }),

    ],
    placement: props.placement,
    strategy: 'absolute',
    whileElementsMounted: (...args) => {
      try {
        const cleanup = autoUpdate(...args, { animationFrame: false })
        return cleanup
      }
      catch (error) {
        return () => undefined
      }
    },
    open,
  })

  watch(() => props.open, (o) => {
    if (isBoolean(o)) {
      open.value = o
    }
  }, {
    immediate: true,
  })

  const handleTargetEnter = () => {
    if (trigger.value === 'click') return
    if (closeTimer) {
      clearTimeout(closeTimer)
    }
    handleToggle(true)
  }

  const handleTargetLeave = () => {
    if (trigger.value === 'click') return
    closeTimer = setTimeout(() => {
      handleToggle(false)
    }, 100)
  }

  const handleTargetClick = () => {
    if (trigger.value !== 'click') return
    handleToggle()
  }

  onUnmounted(() => {
    if (closeTimer) {
      clearTimeout(closeTimer)
    }
  })

  return () => {
    const slotDefault = ctx.slots?.default?.()?.[0]
    const isSlotDefaultEmpty = !slotDefault || isEmptyElement(slotDefault)
    if (isSlotDefaultEmpty) return null

    return (
      <>
        {h(slotDefault, {
          ref: reference,
          onMouseenter: handleTargetEnter,
          onMouseleave: handleTargetLeave,
          onClick: handleTargetClick,
        })}

        <Teleport to={document.body} defer>
          <div
            onMouseenter={handleTargetEnter}
            onMouseleave={handleTargetLeave}
            class={cn(
              isPositioned.value ? 'block' : 'hidden',
              'shadow',
              'bg-white rounded',
              'text-3.5',
              'z-9527',
              'overflow-y-hidden',
            )}
            ref={floating}
            style={open.value ? floatingStyles.value : ''}
          >
            {ctx.slots.content?.()}
          </div>

        </Teleport>

      </>
    )
  }
}, {
  props: ['placement', 'trigger', 'open'],
  inheritAttrs: false,
})

export default Popover
