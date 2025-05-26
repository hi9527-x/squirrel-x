<script setup lang="ts">
import { Markdown } from 'squirrel-x'
import { defineProps } from 'vue'

import EchartsTest from './EchartsTest.vue'

const props = defineProps<{ markdown: string }>()
</script>

<template>
  <div>
    <Markdown
      :content="props.markdown"
    >
      <template #customRender="{ ast }">
        <div v-if="ast.type === 'code' && ast.lang === 'x-echarts'">
          <EchartsTest :code="ast.value" />
        </div>
      </template>
    </Markdown>
  </div>
</template>

<style module="Css" lang="less">

</style>
