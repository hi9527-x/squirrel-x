import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'
import type { SlotsType, VNode } from 'vue'
import { defineComponent, ref } from 'vue'

import { cn } from '@/utils'

const buttonVariants = cva(
  cn(
    'inline-flex items-center justify-center gap-2',
    'cursor-pointer',
    'bg-transparent',
    'whitespace-nowrap text-sm font-medium ',
    'rounded-md',
    'transition-all ',
    'disabled:pointer-events-none disabled:opacity-50',
    '[&_svg]:pointer-events-none shrink-0 [&_svg]:shrink-0',
  ),
  {
    variants: {
      variant: {
        solid: cn(
          'text-zinc-50 b-none',
        ),
        outlined: cn(
          'border b-solid',
        ),
        dashed: cn(
          'border b-dashed',
        ),
        filled: cn('b-none'),
        text: cn('b-none'),
        link: cn('underline-offset-4 hover:underline b-none'),
      },
      color: {
        default: cn(),
        primary: cn(),
        danger: cn(),
      },
      size: {
        middle: 'h-9 px-4 py-2 has-[>svg]:px-3',
        small: 'h-8 rounded-md gap-1.5 px-2 has-[>svg]:px-2.5',
        large: 'h-10 rounded-md px-6 has-[>svg]:px-4',
      },
    },
    compoundVariants: [
      // primary
      {
        variant: 'solid',
        color: 'primary',
        class: cn(
          'bg-primary ',
        ),
      },

      {
        variant: 'outlined',
        color: 'primary',
        class: cn(
          'b-primary text-primary',
        ),
      },

      {
        variant: 'dashed',
        color: 'primary',
        class: cn(
          'b-primary text-primary',
        ),
      },

      {
        variant: 'filled',
        color: 'primary',
        class: cn(
          'bg-primary/10 text-primary/80',
        ),
      },

      {
        variant: 'text',
        color: 'primary',
        class: cn(
          'hover:bg-primary/10 text-primary/80',
        ),
      },

      {
        variant: 'link',
        color: 'primary',
        class: cn(
          ' text-primary/80 ',
        ),
      },

      //  default
      {
        variant: 'solid',
        color: 'default',
        class: cn(
          'bg-zinc-900',
        ),
      },

      {
        variant: 'outlined',
        color: 'default',
        class: cn(
          'b-zinc-200 hover:b-primary hover:text-primary',
        ),
      },

      {
        variant: 'dashed',
        color: 'default',
        class: cn(
          'b-zinc-400 hover:b-primary hover:text-primary',
        ),
      },

      {
        variant: 'filled',
        color: 'default',
        class: cn(
          'bg-zinc-400/10 ',
        ),
      },

      {
        variant: 'text',
        color: 'default',
        class: cn(
          'hover:bg-zinc-400/10 ',
        ),
      },

      {
        variant: 'link',
        color: 'default',
        class: cn(
          '',
        ),
      },

      // danger
      {
        variant: 'solid',
        color: 'danger',
        class: cn(
          'bg-red-500/90',
        ),
      },

      {
        variant: 'outlined',
        color: 'danger',
        class: cn(
          'b-red-500/90 text-red-500',
        ),
      },

      {
        variant: 'dashed',
        color: 'danger',
        class: cn(
          'b-red-500/90 text-red-500',
        ),
      },

      {
        variant: 'filled',
        color: 'danger',
        class: cn(
          'bg-red-500/10 text-red-500/80',
        ),
      },

      {
        variant: 'text',
        color: 'danger',
        class: cn(
          'hover:bg-red-500/10 text-red-500/80',
        ),
      },

      {
        variant: 'link',
        color: 'danger',
        class: cn(
          'text-red-500/80',
        ),
      },
    ],
    defaultVariants: {
      variant: 'solid',
      color: 'default',
      size: 'middle',
    },
  },
)

type ButtonVariants = VariantProps<typeof buttonVariants>

type ButtonSlots = SlotsType<{
  default?: () => VNode[]
}>
export type ButtonEmits = {
  click: (event: MouseEvent) => void
  mouseleave: (event: MouseEvent) => void
  mouseenter: (event: MouseEvent) => void

}

export type ButtonProps = {
  size?: ButtonVariants['size']
  variant?: ButtonVariants['variant']
  color?: ButtonVariants['color']
  class?: string
  disabled?: boolean
}

const Button = defineComponent<ButtonProps, ButtonEmits, string, ButtonSlots>((props, ctx) => {
  const targetElement = ref<HTMLButtonElement | null>(null)

  ctx.expose({
    targetElement,
  })
  return () => {
    return (
      <button
        onClick={(evt) => { ctx.emit('click', evt) }}
        onMouseleave={(evt) => { ctx.emit('mouseleave', evt) }}
        onMouseenter={(evt) => { ctx.emit('mouseenter', evt) }}
        disabled={props.disabled}
        ref={targetElement}
        class={cn(buttonVariants({ variant: props.variant, size: props.size, color: props.color }), props.class)}
      >
        {ctx.slots?.default?.()}
      </button>
    )
  }
}, {
  props: ['variant', 'color', 'size', 'disabled'],
  emits: ['click', 'mouseleave', 'mouseenter'],
  inheritAttrs: false,
})

export default Button
