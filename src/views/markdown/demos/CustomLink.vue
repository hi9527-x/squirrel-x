<script setup lang="ts">
import { Button, Markdown, Popover } from 'squirrel-x'

import IconArrowOutUpRight from '~icons/lucide/square-arrow-out-up-right'

const content = `
[百度](https://baidu.com)
![](/img/PCtm_d9c8750bed0b3c7d089fa7d55720d6cf.png)
`
</script>

<template>
  <Markdown
    :content="content"
  >
    <template #customRender="{ ast, childrenRender }">
      <Popover
        v-if="ast.type === 'link'"
        trigger="click"
        placement="bottom-start"
      >
        <template #content>
          <div class="flex items-center">
            <span>即将跳转到外部网站</span>
            <a
              target="_blank"
              :href="ast.url"
            >
              <Button variant="link">
                <IconArrowOutUpRight />
              </Button>
            </a>
          </div>
        </template>
        <Button
          variant="link"
          color="primary"
          size="small"
        >
          <component :is="childrenRender(ast.children)" />
        </Button>
      </Popover>

      <div
        v-else-if="ast.type === 'image'"
      >
        <img
          :src="`https://baidu.com/${ast.url}`"
        >
      </div>
    </template>
  </Markdown>
</template>
