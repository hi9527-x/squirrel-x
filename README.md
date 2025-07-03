# squirrel-x

基于vue3的组件库，定位是**AI知识组件库**

不过倒现在暂时只有vue-markdown渲染，后续会推出code的markdown编辑器和富文本的提示词编辑器，尽情期待

## 安装

```plaintext
pnpm add squirrel-x
// or
npm add squirrel-x
```

## 使用

### markdown组件

原理是把markdown文本内容，通过`remark`转换为`Abstract Syntax Tree`，再渲染为vue组件

* 使用vue组件来渲染markdown语法，可以使用**vue组件渲染markdown的语法**，而不用再去找markdown-it的插件了
* `VueMarkdownPro`支持vue语法高亮,且**code高亮**渲染默认开始使用`JetBrains Mono`等宽字体，若电脑没有会自动安装，
  * **code高亮组件**也可以单独使用
* 支持[mermaid](https://mermaid.js.org/)渲染图表，组件单独提供，也可以给vue作为渲染mermaid组件使用
* 支持[katex](https://github.com/KaTeX/KaTeX)渲染公式，同上单独提供
* `VueMarkdownPro`的class隔离，不会污染项目其他样式，特别是**微应用**的项目，
  * 注意但不保证不会被项目全局或上层样式污染，
* *支持流式渲染*性能待考察，~后续会支持`Web Worker`来处理转换过程，提升效率~，web worker转换已上

#### VueMarkdown

VueMarkdown和[react-markdown](https://github.com/remarkjs/react-markdown?tab=readme-ov-file#use)保持一致，是同步渲染。

```vue
<script setup lang="ts">
import { VueMarkdown } from 'squirrel-x'
</script>

<template>
  <div>
    <VueMarkdown content="## hello world" />
  </div>
</template>
```

#### VueMarkdownHook

`VueMarkdown`，是同步渲染markdown组件，

然而有些**remark的异步插件**并不支持，例如`@shikijs/rehype`

就需要使用`VueMarkdownHook`支持异步加载remark插件

```vue
<script setup lang="ts">
import rehypeShiki from '@shikijs/rehype'
import { VueMarkdownHook } from 'squirrel-x'

import content from './code.md?raw'
</script>

<template>
  <VueMarkdownHook
    :content="content"
    :rehypePlugins="[[rehypeShiki, {
      themes: {
        light: 'vitesse-light',
        dark: 'vitesse-dark',
      },
    }]]"
  >
    <template #fallback="{ error }">
      <div>{{ error.message }}</div>
    </template>
  </VueMarkdownHook>
</template>
```

> [!WARNING] 注意
> 这里使用的`VueMarkdown`和`VueMarkdownHook`,均不带任何样式,只做了把markdown内容在vue上渲染出来
> 所以需要自行加载样式，例如
>
> ```js
> // npm add github-markdown-css or pnpm add > github-markdown-css
> import 'github-markdown-css'
> ```

或者使用开箱即用的[VueMarkdownPro](/markdown/vue-markdown-pro)组件



### 自定义组件渲染

通过传入**插槽**，可以自定义渲染markdown的语法，

例如给每个`a`标签添加一个安全提示[效果预览](http://squirrelx.hi9527.ren/markdown/vue-markdown)

> [!WARNING] 插槽的子渲染，需要传入`tree.children`,而不能传入`tree`本身

```vue
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

```


### VueMarkdownPro渲染Mermaid图表

自定义组件渲染，推荐使用`codeBlock`插槽，如下示例

```vue
<script setup lang="ts">
import { VueMarkdownPro } from 'squirrel-x'
import Mermaid from 'squirrel-x/Mermaid'

import markdown from './mermaid.md?raw'
</script>

<template>
  <VueMarkdownPro :content="markdown">
    <template #codeBlock="{ code, language }">
      <div v-if="language === 'mermaid'">
        <Mermaid :code="code" />
      </div>
    </template>
  </VueMarkdownPro>
</template>

```

```md
\`\`\`mermaid
flowchart LR
  A[Start]-->B[Do you have coffee beans?]
  B-->|Yes|C[Grind the coffee beans]
  B-->|No|D[Buy ground coffee beans]
  C-->E[Add coffee grounds to filter]
  D-->E
  E-->F[Add hot water to filter]
  F-->G[Enjoy!]
\`\`\`
```

> [!WARNING] 注意
> * 如果需要扩展markdown里面的html标签，需要开启`allowDangerousHtml`，默认已开启
> * markdown里面编写html标签，需要`<x-code src="xxx"></x-code>`，而不能`<x-code src="xxx" />`
> * html 的tagName，需要全小写


## 交流

打工牛马，文档有待补充，如有问题，进提[issues](https://github.com/hi9527-x/squirrel-x/issues)或者加群交流

![](http://squirrelx.hi9527.ren/wx-chat.png?x-oss-process=image/resize,w_360/format,webp)