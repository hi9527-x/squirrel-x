<script setup lang="ts">
import { Button, Code } from 'squirrel-x'
import Mermaid from 'squirrel-x/Mermaid'
import { ref } from 'vue'

const code = `
  xychart-beta
    title "Sales Revenue"
    x-axis [jan, feb, mar, apr, may, jun, jul, aug, sep, oct, nov, dec]
    y-axis "Revenue (in $)" 4000 --> 11000
    bar [5000, 6000, 7500, 8200, 9500, 10500, 11000, 10200, 9200, 8500, 7000, 6000]
    line [5000, 6000, 7500, 8200, 9500, 10500, 11000, 10200, 9200, 8500, 7000, 6000]
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
