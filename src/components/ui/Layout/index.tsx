import { useCssVar } from '@vueuse/core'
import type { SlotsType } from 'vue'
import { computed, defineComponent, h, ref } from 'vue'
import { RouterView, useRoute } from 'vue-router'

import { cn } from '@/utils'

import Sidebar from './Sidebar'

type Slots = {}
type Emits = {}
type Props = {}

export default defineComponent<Props, Emits, string, SlotsType<Slots>>((props, ctx) => {
  const refLayoutEle = ref<HTMLElement>()

  useCssVar('--sx-layout-max-width', refLayoutEle, { initialValue: '1536px' })
  useCssVar('--sx-sidebar-width', refLayoutEle, { initialValue: '200px' })
  useCssVar('--sx-content-gap', refLayoutEle, { initialValue: '16px' })

  // const menuKey = computed(() => {
  //   return route.matched.map(it => it.path)
  // })

  const route = useRoute()

  return () => {
    const hideMenu = route.meta?.hideMenu

    return (
      <div
        class={cn('flex')}
        ref={refLayoutEle}
      >
        {!hideMenu && (
          <div
            class={cn(
              'pos-fixed left-0px top-0px z-9999 overflow-y-auto',
              'bg-gray-50',
              'w-[var(--sx-sidebar-width)] h-100vh p-4',
              '2xl:pl-[max(16px,calc((100vw-var(--sx-layout-max-width)-var(--sx-content-gap)*2)/2))]',
              'max-md:hidden',
            )}
          >
            <Sidebar />
          </div>
        )}

        <div
          class={cn(
            '2xl:max-w-[var(--sx-layout-max-width)]',
            '2xl:pr-[calc((100vw-var(--sx-layout-max-width)-var(--sx-content-gap))/2)]',
            '2xl:pl-[calc((100vw-var(--sx-layout-max-width)-var(--sx-content-gap)*2)/2+var(--sx-sidebar-width)+var(--sx-content-gap)*2)]',
            'md:pl-[calc(var(--sx-sidebar-width)+var(--sx-content-gap)*2)]',
            'grow-1 shrink-1',
          )}
        >
          <div
            class={cn(
              'p-[var(--sx-content-gap)]',
            )}
          >

            <RouterView />
          </div>
        </div>
      </div>
    )
  }
})
