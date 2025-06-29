import type { SlotsType, VNode } from 'vue'
import { defineComponent, ref, Transition } from 'vue'
import type { RouteRecordRaw } from 'vue-router'
import { RouterLink } from 'vue-router'

import { cn } from '@/utils'
import IconChevronRight from '~icons/lucide/chevron-right'

type Slots = {}
type Emits = {}
type Props = {
  routes?: readonly RouteRecordRaw[]
  path?: string
}

const SidebarView = defineComponent<Props, Emits, string, SlotsType<Slots>>((props, ctx) => {
  const collapsed = ref<Record<string, boolean>>({})

  return () => {
    if (!props.routes?.length) return null
    const path = props.path || ''
    const vNode = props.routes.filter((route) => {
      return (!route.redirect || route.children?.length) && !route.meta?.hideInMenu
    }).map((route, index) => {
      const label = (route.meta?.title || route.name || '') as string
      if (Array.isArray(route.children) && route.children.length) {
        return (
          <div class={cn(
            'py-12px my-12px',
            'b-t-1px b-t-solid b-t-zinc-200',
          )}
          >
            <div
              class={cn(
                'flex justify-between items-center',
                'py-4px',
                'cursor-pointer',
              )}
              onClick={() => { collapsed.value[index] = !collapsed.value[index] }}
            >
              <span
                class={cn(
                  'text-14px line-height-24px text-zinc-700 fw-bold',
                  'select-none',
                )}
              >
                {label}
              </span>
              <span class={cn(
                collapsed.value[index] ? '' : 'rotate-90',
              )}
              >
                <IconChevronRight />
              </span>

            </div>
            <div class={cn(
              'pl-8px',
              collapsed.value[index] ? 'hidden' : 'block',
            )}
            >
              <SidebarView routes={route.children} path={route.path} />
            </div>
          </div>
        )
      }

      const fullPath = [path, route.path].filter(Boolean).map(it => it.replace('/', '')).join('/')

      return (
        <div class={cn(
          'py-4px',
        )}
        >
          <RouterLink to={`/${fullPath}`} class="c-zinc-500 no-underline">
            <span>{label}</span>
          </RouterLink>
        </div>
      )
    })
    return vNode
  }
}, {
  props: ['routes', 'path'],
  inheritAttrs: false,
})

export default SidebarView
