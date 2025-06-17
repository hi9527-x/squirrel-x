import { Alert } from 'squirrel-x'
import type { SlotsType, VNode } from 'vue'
import { defineComponent } from 'vue'

type Slots = {}
type Emits = {}

type Props = {}

const alertText = defineComponent<Props, Emits, string, SlotsType<Slots>>((props, ctx) => {
  return () => {
    return (
      <div>
        <div class="flex flex-col gap-4">
          <Alert />
          <Alert message="NOTE" description="Useful information that users should know, even when skimming content." />
          <Alert type='tip' message="TIP" description="Helpful advice for doing things better or more easily." />
          <Alert type='important' message="IMPORTANT" description="Key information users need to know to achieve their goal." />
          <Alert type='warning' message="WARNING" description="Urgent info that needs immediate user attention to avoid problems." />
          <Alert type='caution' message="CAUTION" description="Advises about risks or negative outcomes of certain actions." />

          <Alert
            
            showIcon={false}
            v-slots={{
              message: () => {
                return <div>插槽覆盖message</div>
              },
              description: () => {
                return <div>插槽覆盖description</div>
              }
            }}
          />
        </div>

      </div>
    )
  }
}, {
  props: [],
})

export default alertText
