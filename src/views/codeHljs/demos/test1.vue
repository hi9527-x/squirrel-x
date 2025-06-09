<script setup lang="ts">
import type { CodeProps } from 'squirrel-x'
import { Button, Code } from 'squirrel-x'
import { ref } from 'vue'

const testCode = `
console.log('hello world')
`

const codeParams = ref<CodeProps>({
  toolbar: true,
})
</script>

<template>
  <div class="">
    <div class="flex gap-4">
      <Button
        size="small"
        :variant="codeParams.toolbar ? 'solid' : 'outlined'"
        :color="codeParams.toolbar ? 'primary' : 'default'"
        @click="codeParams.toolbar = !codeParams.toolbar"
      >
        工具栏
      </Button>
    </div>
    <div class="mt-4">
      <Code
        v-bind="codeParams"
        :code="testCode"
        language="js"
      />
    </div>
  </div>
</template>

<style module="Css" lang="less">

</style>
