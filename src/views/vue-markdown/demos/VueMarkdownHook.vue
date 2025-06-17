<script setup lang="ts">
import rehypeShiki from '@shikijs/rehype'
import { VueMarkdownHook } from 'squirrel-x'

import content from './code.md?raw'
</script>

<template>
  <VueMarkdownHook
    :content="content"
    :rehypePlugins="[[rehypeShiki, {
      themes: {
        light: 'vitesse-light',
        dark: 'vitesse-dark',
      },
    }]]"
  >
    <template #fallback="{ error }">
      <div>{{ error.message }}</div>
    </template>
  </VueMarkdownHook>
</template>
