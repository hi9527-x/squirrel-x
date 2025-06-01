<script setup lang="ts">
import { Katex, Markdown } from 'squirrel-x'

import content from './markdown.md?raw'
</script>

<template>
  <Markdown
    class="p-4"
    :content="content"
    :allowDangerousHtml="true"
  >
    <template #codeBlock="{ language, code, display }">
      <template v-if="language === 'math'">
        <Katex
          :options="{ displayMode: display === 'block' }"
          :tex="code"
        />
      </template>
    </template>
  </Markdown>
</template>

<style module="Css" lang="less">

</style>
