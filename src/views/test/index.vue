<script setup lang="ts">
import 'github-markdown-css'

import { VueMarkdownPro, VueMarkdownWorker } from 'squirrel-x'

import content from './markdown.md?raw'
</script>

<template>
  <VueMarkdownWorker content="# 标题1" />
  <br>

  <VueMarkdownWorker content="# 标题22" />
</template>

<style module="Css" lang="less">

</style>
