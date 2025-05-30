<script setup lang="ts">
import { Markdown } from 'squirrel-x'

import content from './markdown.md?raw'
</script>

<template>
  <Markdown
    :content="content"
    :allowDangerousHtml="true"
  >
    <template #customRender="{ ast }">
      <div v-if="ast.tagName === 'code'">
        xxx
      </div>
    </template>
  </Markdown>
</template>

<style module="Css" lang="less">

</style>
