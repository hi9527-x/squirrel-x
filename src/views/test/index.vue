<script setup lang="ts">
import { CodeEditPro } from 'squirrel-x'
</script>

<template>
  <div class="h-full flex">
    <CodeEditPro
      :size="{ minHeight: '200px', maxHeight: '400px' }"
      class="w-0px flex-1"
      languages="json"
      value="var a = 1"
      placeholder="请输入"
      :lineNumber="true"
      :lineWrapping="true"
    />
  </div>
</template>

<style module="Css" lang="less">

</style>
