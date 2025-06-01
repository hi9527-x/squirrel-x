<script setup lang="ts">
import { Button, Katex, Markdown, Mermaid } from 'squirrel-x'
import { ref } from 'vue'

import markdown from './base.md?raw'

const displayMarkdown = ref(markdown)

const handleStart = () => {
  if (!markdown) return
  displayMarkdown.value = ''
  let currentIndex = 0
  const intervalId = setInterval(() => {
    if (currentIndex < markdown.length) {
      displayMarkdown.value += markdown[currentIndex]
      currentIndex++
    }
    else {
      clearInterval(intervalId)
    }
  }, 100)
}
</script>

<template>
  <Button
    variant="outlined"
    @click="handleStart"
  >
    开始
  </Button>
  <Markdown
    :content="displayMarkdown"
    :htmlRender="true"
    :codeProps="{ toolbar: false, showLineNum: false }"
  >
    <template #codeBlock="{ code, language, display }">
      <div v-if="language === 'mermaid'">
        <Mermaid :code="code" />
      </div>

      <template v-else-if="language === 'math'">
        <Katex
          :options="{ displayMode: display === 'block' }"
          :tex="code"
        />
      </template>
    </template>
  </Markdown>
</template>
