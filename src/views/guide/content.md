# 快速开始

## 安装

```plaintext
pnpm add squirrel-x
// or
npm add squirrel-x
```

## 使用markdown

```vue
<script setup lang="ts">
import 'squirrel-x/style.css'

import { Button, Markdown } from 'squirrel-x'
</script>

<template>
  <Markdown content="hello world">
    <template #customRender="{ ast, childrenRender }">
      <p v-if="ast.type === 'paragraph'">
        <component :is="childrenRender(ast.children)" />
        <Button
          color="primary"
          variant="link"
          size="small"
        >
          复制
        </Button>
      </p>
    </template>
  </Markdown>
</template>

```
