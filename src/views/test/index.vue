<script setup lang="ts">
import mdText from './markdown.md?raw'

const worker = new Worker(new URL('./mark.work.ts', import.meta.url), {
  type: 'module',
})

const handleStart = () => {
  worker.postMessage({
    markdown: mdText,
  })
}
</script>

<template>
  <p>
    <button @click="handleStart">
      开始
    </button>
  </p>
</template>

<style module="Css" lang="less">

</style>
