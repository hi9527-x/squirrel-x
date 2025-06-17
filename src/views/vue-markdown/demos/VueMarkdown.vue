<script setup lang="ts">
import 'github-markdown-css'

import { VueMarkdown } from 'squirrel-x'
</script>

<template>
  <div class="markdown-body">
    <VueMarkdown content="## hello world" />
  </div>
</template>
