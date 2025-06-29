import type { SlotsType, VNode } from 'vue'
import { defineComponent } from 'vue'
import type { RouteRecordRaw } from 'vue-router'
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router'

import SidebarView from './SidebarView'

type Slots = {}
type Emits = {}
// RouteRecordRaw
type Props = {}

const Sidebar = defineComponent<Props, Emits, string, SlotsType<Slots>>((props, ctx) => {
  const router = useRouter()
  const routes = router.options.routes ?? []

  return () => {
    return <SidebarView routes={routes} />
  }
}, {
  props: [],
})

export default Sidebar
