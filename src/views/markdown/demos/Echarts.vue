<script setup lang="ts">
import { Markdown } from 'squirrel-x'

import markdown from './echarts.md?raw'
import EchartsTest from './EchartsTest.vue'
</script>

<template>
  <div>
    <Markdown
      :content="markdown"
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
