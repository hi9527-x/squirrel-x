<script setup lang="ts">
import { Button, Popover, VueMarkdownHook } from 'squirrel-x'

import IconArrowOutUpRight from '~icons/lucide/square-arrow-out-up-right'

const content = `
[百度](https://baidu.com)
`
</script>

<template>
  <VueMarkdownHook
    :content="content"
  >
    <template #components="{ tree, childrenRender }">
      <Popover
        v-if="tree.type === 'element' && tree.tagName === 'a'"
        trigger="click"
        placement="bottom-start"
      >
        <template #content>
          <div class="flex items-center">
            <span>即将跳转到外部网站</span>
            <a
              target="_blank"
              :href="tree.properties.href as string"
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
          <component :is="childrenRender(tree.children)" />
        </Button>
      </Popover>
    </template>
  </VueMarkdownHook>
</template>
