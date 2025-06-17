<script setup lang="ts">
import CodePreview from '@/components/ui/CodePreview'

import markdown from './base.md?raw'

const modules = import.meta.glob('./demos/*.(vue|tsx)', { eager: true, import: 'default' })
const modulesCode: Record<string, string> = import.meta.glob('./demos/*.(vue|tsx|md)', { eager: true, query: '?raw', import: 'default' })
</script>

<template>
  <div class="p-4">
    <CodePreview
      :markdown="markdown"
      :modules="modules"
      :modulesCode="modulesCode"
    />
  </div>
</template>

<style module="Css" lang="less">

</style>
