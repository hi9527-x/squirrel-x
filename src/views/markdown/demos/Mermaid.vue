<script setup lang="ts">
import { Markdown, Mermaid } from 'squirrel-x'
import { defineProps } from 'vue'

const props = defineProps<{ markdown: string }>()
</script>

<template>
  <Markdown :content="props.markdown">
    <template #customRender="{ ast }">
      <div v-if="ast.type === 'code' && ast.lang === 'mermaid'">
        <Mermaid :code="ast.value" />
      </div>
    </template>
  </Markdown>
</template>

<style module="Css" lang="less">

</style>
