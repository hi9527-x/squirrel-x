import './App.css'
import '@unocss/reset/normalize.css'

import type { SlotsType, VNode } from 'vue'
import { defineComponent } from 'vue'
import { RouterView } from 'vue-router'

import Layout from '@/components/ui/Layout'

type Slots = SlotsType<{
  default?: () => VNode
}>
type Emits = {}

type Props = {}

const App = defineComponent<Props, Emits, string, Slots>((props, ctx) => {
  return () => {
    return (
      <Layout>
        <RouterView />
      </Layout>
    )
  }
}, {
  props: [],
})

export default App
