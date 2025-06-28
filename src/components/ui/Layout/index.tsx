import type { SlotsType } from 'vue'
import { computed, defineComponent, h, ref } from 'vue'
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router'

import { cn } from '@/utils'

type Slots = {}
type Emits = {}
type Props = {}

export default defineComponent<Props, Emits, string, SlotsType<Slots>>((props, ctx) => {
  const router = useRouter()
  const route = useRoute()

  const menuKey = computed(() => {
    return route.matched.map(it => it.path)
  })

  const hideMenu = computed(() => !!route.meta.hideMenu)

  const routes = router.options.routes ?? []

  const collapsed = ref(false)

  const getMenuItems = (data: typeof routes, path = ''): any[] => {
    return data.filter(it => (!it.redirect || it.children?.length) && !it.meta?.hideInMenu).map((it) => {
      const fullPath = [path, it.path].filter(Boolean).map(it => it.replace('/', '')).join('/')

      const title = (it.meta?.title || it.name || '') as string
      const label = collapsed.value ? title.charAt(0) : title
      const children = getMenuItems(it.children ?? [], it.path)
      return {
        label: children.length ? label : h(RouterLink, { to: `/${fullPath}` }, () => label),
        title,
        key: `/${fullPath}`,
        children: children.length ? children : undefined,
      }
    })
  }

  return () => {
    const menuItems = getMenuItems(routes)

    return (
      <div class={cn(
        '',
      )}
      >
        <div class={cn(
          'pos-fixed left-0px top-0px',
          'w-270px h-100vh p-4',
          'bg-gray-50',
          '2xl:pl-[max(270px)]',
        )}
        >
          侧边栏
        </div>
        <div class={cn(
          '2xl:pl-[calc((100vw-1536px-16px)/2+270px)] 2xl:pr-[calc((100vw-1536px-16px)/2)]',
          '2xl:max-w-1536px',
        )}
        >
          <RouterView />
        </div>
      </div>
    )
  }
})
