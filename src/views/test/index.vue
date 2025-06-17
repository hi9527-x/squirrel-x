<script setup lang="ts">
import 'github-markdown-css'

import { Alert } from 'ant-design-vue'
import { VueMarkdownPro } from 'squirrel-x'

import content from './markdown.md?raw'
</script>

<template>
  <VueMarkdownPro
    class="p-4"
    :content="content"
  >
    <template #codeBlock="{ language, code }">
      <p>{{ language }}</p>
      <p>{{ code }}</p>
    </template>
  </VueMarkdownPro>
</template>

<style module="Css" lang="less">

</style>
