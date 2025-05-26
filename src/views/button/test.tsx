import { Button } from 'squirrel-x'
import type { SlotsType, VNode } from 'vue'
import { defineComponent } from 'vue'

type Slots = SlotsType<{
  default?: () => VNode[]
}>
type Emits = {}

type Props = {}

const ButtonTest = defineComponent<Props, Emits, string, Slots>((props, ctx) => {
  return () => {
    return (
      <div>
        <div class="flex gap-2">
          <Button color="default" variant="solid">
            Solid
          </Button>
          <Button color="default" variant="outlined">
            Outlined
          </Button>
          <Button color="default" variant="dashed">
            Dashed
          </Button>
          <Button color="default" variant="filled">
            Filled
          </Button>
          <Button color="default" variant="text">
            Text
          </Button>
          <Button color="default" variant="link">
            Link
          </Button>
        </div>

        <div class="mt-4 flex gap-2">
          <Button color="primary" variant="solid">
            Solid
          </Button>
          <Button color="primary" variant="outlined">
            Outlined
          </Button>
          <Button color="primary" variant="dashed">
            Dashed
          </Button>
          <Button color="primary" variant="filled">
            Filled
          </Button>
          <Button color="primary" variant="text">
            Text
          </Button>
          <Button color="primary" variant="link">
            Link
          </Button>
        </div>

        <div class="mt-4 flex gap-2">
          <Button color="danger" variant="solid">
            Solid
          </Button>
          <Button color="danger" variant="outlined">
            Outlined
          </Button>
          <Button color="danger" variant="dashed">
            Dashed
          </Button>
          <Button color="danger" variant="filled">
            Filled
          </Button>
          <Button color="danger" variant="text">
            Text
          </Button>
          <Button color="danger" variant="link">
            Link
          </Button>
        </div>
      </div>
    )
  }
}, {
  props: [],
})

export default ButtonTest
