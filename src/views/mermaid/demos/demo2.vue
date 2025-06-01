<script setup lang="ts">
import { Button, Code, Mermaid } from 'squirrel-x'
import { ref } from 'vue'

const code = `
  graph TD;
    A-->B;
    A-->C;
    B-->D;
    C-->D;
`

const content = ref('')

const handleStart = () => {
  content.value = ''
  let currentIndex = 0
  const intervalId = setInterval(() => {
    if (currentIndex < code.length) {
      content.value += code[currentIndex]
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
    :onClick="handleStart"
  >
    开始流式
  </Button>

  <Mermaid :code="content" />

  <p>当前流式输出</p>
  <Code :code="content" />
</template>

<style module="Css" lang="less">

</style>
