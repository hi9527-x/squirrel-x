<script setup lang="ts">
import { VueMarkdownPro } from 'squirrel-x'
import { provide, ref } from 'vue'

import content from './markdown.md?raw'

const language = ref('markdown')

provide('language', language)
</script>

<template>
  <div class="h-full flex">
    <VueMarkdownPro
      :content="content"
    />
  </div>
</template>

<style module="Css" lang="less">

</style>
