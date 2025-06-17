<script setup lang="ts">
import { VueMarkdownPro } from 'squirrel-x'

import markdown from './echarts.md?raw'
import EchartsTest from './EchartsTest.vue'
</script>

<template>
  <div>
    <VueMarkdownPro
      :content="markdown"
    >
      <template #codeBlock="{ language, code }">
        <EchartsTest
          v-if="language === 'x-echarts'"
          :code="code"
        />
      </template>
    </VueMarkdownPro>
  </div>
</template>

<style module="Css" lang="less">

</style>
