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
      <template #codeBlock="{ language, code }">
        <EchartsTest
          v-if="language === 'x-echarts'"
          :code="code"
        />
      </template>
    </Markdown>
  </div>
</template>

<style module="Css" lang="less">

</style>
