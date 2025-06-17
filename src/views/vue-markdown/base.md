# vue-markdown

## 使用

### VueMarkdown

<sx-code src="./demos/VueMarkdown.vue" showCode="./demos/VueMarkdown.vue" ></sx-code>

### VueMarkdownHook

上面使用的`VueMarkdown`，是同步渲染markdown组件，

有些**remark的异步插件**并不支持，例如`@shikijs/rehype`，并不支持，

就需要使用`VueMarkdownHook`支持异步加载remark插件

<sx-code src="./demos/VueMarkdownHook.vue" showCode="./demos/VueMarkdownHook.vue,./demos/code.md" ></sx-code>

## 注意

这里使用的`VueMarkdown`和`VueMarkdownHook`,均不带任何样式,只做了把markdown内容在vue上渲染出来

所以需要自行加载样式，例如

```js
// npm add github-markdown-css or pnpm add github-markdown-css
import 'github-markdown-css'
```

或者使用开箱即用的[VueMarkdownPro](/markdown/vue-markdown-pro)组件


## markdown语法自定义组件渲染

例如因**安全**需要，

- **链接**不能直接跳转，需要做一个中间弹窗，进行免责提醒

<sx-code src="./demos/CustomLink.vue" showCode="./demos/CustomLink.vue" ></sx-code>