<script setup lang="ts">
import { VueMarkdown } from 'squirrel-x'
import { h } from 'vue'

import content from './markdown.md?raw'
</script>

<template>
  <VueMarkdown
    :content="content"
  />
</template>

<style module="Css" lang="less">

</style>
