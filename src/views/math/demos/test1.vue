<script setup lang="ts">
import { Katex } from 'squirrel-x'

const tex = 'c = \\pm\\sqrt{a^2 + b^2}'
</script>

<template>
  <div>
    <Katex
      :tex="tex"
    />
  </div>
</template>

<style module="Css" lang="less">

</style>
