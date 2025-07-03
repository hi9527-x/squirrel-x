<script setup lang="ts">
import { VueMarkdownPro } from 'squirrel-x'
import Mermaid from 'squirrel-x/Mermaid'

import markdown from './mermaid.md?raw'
</script>

<template>
  <VueMarkdownPro :content="markdown">
    <template #codeBlock="{ code, language }">
      <div v-if="language === 'mermaid'">
        <Mermaid :code="code" />
      </div>
    </template>
  </VueMarkdownPro>
</template>

<style module="Css" lang="less">

</style>
