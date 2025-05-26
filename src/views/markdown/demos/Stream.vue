<script setup lang="ts">
import { Button, Markdown, Mermaid } from 'squirrel-x'
import { defineProps, ref } from 'vue'

const props = defineProps<{ markdown: string }>()

const displayMarkdown = ref(props.markdown)

const handleStart = () => {
  if (!props.markdown) return
  displayMarkdown.value = ''
  let currentIndex = 0
  const intervalId = setInterval(() => {
    if (currentIndex < props.markdown.length) {
      displayMarkdown.value += props.markdown[currentIndex]
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
    <template #customRender="{ ast }">
      <div v-if="ast.type === 'code' && ast.lang === 'mermaid'">
        <Mermaid :code="ast.value" />
      </div>
    </template>
  </Markdown>
</template>
