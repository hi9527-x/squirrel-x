<script setup lang="ts">
import { Markdown, Mermaid } from 'squirrel-x'

import markdown from './mermaid.md?raw'
</script>

<template>
  <Markdown :content="markdown">
    <template #codeBlock="{ code, language }">
      <div v-if="language === 'mermaid'">
        <Mermaid :code="code" />
      </div>
    </template>
  </Markdown>
</template>

<style module="Css" lang="less">

</style>
