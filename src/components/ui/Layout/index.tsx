import type { ItemType } from 'ant-design-vue'
import { Layout, LayoutFooter, Menu } from 'ant-design-vue'
import type { SlotsType, VNode } from 'vue'
import { computed, defineComponent, h, ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'

const { Header: LayoutHeader, Content: LayoutContent, Sider: LayoutSider } = Layout

type Slots = SlotsType<{
  default?: () => VNode
}>
type Emits = {}

type Props = {}

export default defineComponent<Props, Emits, string, Slots>((props, ctx) => {
  const router = useRouter()
  const route = useRoute()

  const menuKey = computed(() => {
    return route.matched.map(it => it.path)
  })

  const hideMenu = computed(() => !!route.meta.hideMenu)

  const routes = router.options.routes ?? []

  const collapsed = ref(false)

  const getMenuItems = (data: typeof routes, path = ''): ItemType[] => {
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

  const menuItems = computed(() => {
    return getMenuItems(routes)
  })

  return () => {
    return (
      <Layout class="h-screen overflow-hidden">
        <LayoutHeader class="bg-white!">
          <div class="text-6 font-bold">squirrel-x</div>
        </LayoutHeader>

        <Layout class="from-gray-100 to-white bg-gradient-to-b">
          {!hideMenu.value && (
            <LayoutSider
              collapsed={collapsed.value}
              class="relative h-full"
            >
              <Menu
                items={menuItems.value}
                class="h-full overflow-y-auto bg-white"
                mode="inline"
                selectedKeys={menuKey.value}
                openKeys={menuKey.value}
              />
            </LayoutSider>
          )}
          <LayoutContent class="mb-0 flex flex-col justify-between gap-3">
            <div class="flex-1 overflow-auto rounded-t-md bg-white">
              {ctx.slots?.default?.()}
            </div>
          </LayoutContent>
        </Layout>

        <LayoutFooter class="bg-white!">
          <a href="https://github.com/hi9527-x/squirrel-x">github</a>
        </LayoutFooter>
      </Layout>
    )
  }
})
