import type { SlotsType, VNode } from 'vue'
import { defineComponent, h } from 'vue'

import { cn, isEmptySlot } from '@/utils'
import IconCircleAlert from '~icons/lucide/circle-alert'
import IconInfo from '~icons/lucide/info'
import IconLightbulb from '~icons/lucide/lightbulb'
import IconMessageSquareWarning from '~icons/lucide/message-square-warning'
import IconTriangleAlert from '~icons/lucide/triangle-alert'

type AlertGhSlots = {
  description?: () => VNode[]
  message?: () => VNode[]
}
type AlertGhEmits = {}

export const alterKeys = ['note', 'tip', 'warning', 'important', 'caution'] as const
export type AlterKey = typeof alterKeys[number]

const alterStateMap: Record<AlterKey, { icon: VNode, class: string, classTitle: string }> = {
  note: {
    class: 'b-l-blue-600/90',
    classTitle: 'text-blue-600/90',
    icon: <IconInfo />,

  },
  tip: {
    class: 'b-l-green-700',
    classTitle: 'text-green-700',
    icon: <IconLightbulb />,
  },
  warning: {
    class: 'b-l-amber-800',
    classTitle: 'text-amber-800',
    icon: <IconTriangleAlert />,
  },
  important: {
    class: 'b-l-purple-600',
    classTitle: 'text-purple-600',
    icon: <IconMessageSquareWarning />,
  },
  caution: {
    class: 'b-l-red-600',
    classTitle: 'text-red-600',
    icon: <IconCircleAlert />,
  },
}

type AlertGhProps = {
  type?: AlterKey
  description?: string
  message?: string
  showIcon?: boolean
  class?: string
}

const AlertGh = defineComponent<AlertGhProps, AlertGhEmits, string, SlotsType<AlertGhSlots>>((props, ctx) => {
  return () => {
    const type = props.type && alterKeys.includes(props.type) ? props.type : 'note'
    const className = alterStateMap[type].class
    const classTitle = alterStateMap[type].classTitle
    const icon = alterStateMap[type].icon
    const showIcon = props.showIcon !== false

    const messageSlots = ctx.slots.message?.()

    return (
      <div class={cn(
        'py-2 px-4 b-l-0.25rem b-l-solid text-inherit',
        'text-4',
        'flex flex-col gap-4',
        className,
        props.class,
      )}
      >
        <div class={cn(
          'flex items-center',
          'fw-500  line-height-[1]',
          classTitle,
        )}
        >
          {showIcon && h(icon, { class: 'mr-2' })}
          {isEmptySlot(messageSlots) ? <span>{props.message || type.toUpperCase()}</span> : messageSlots}
        </div>

        {ctx.slots.description?.() ?? (props.description
          ? (
              <div>
                {props.description}
              </div>
            )
          : null)}
      </div>
    )
  }
}, {
  props: ['class', 'type', 'description', 'message', 'showIcon'],
  inheritAttrs: false,
})

export default AlertGh
