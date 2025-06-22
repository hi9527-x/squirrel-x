# vue-markdown

## 使用

### VueMarkdown

<sx-code src="./demos/VueMarkdown.vue" showCode="./demos/VueMarkdown.vue" ></sx-code>

### VueMarkdownHook

上面使用的`VueMarkdown`，是同步渲染markdown组件，

有些**remark的异步插件**并不支持，例如`@shikijs/rehype`，并不支持，

就需要使用`VueMarkdownHook`支持异步加载remark插件

<sx-code src="./demos/VueMarkdownHook.vue" showCode="./demos/VueMarkdownHook.vue,./demos/code.md" ></sx-code>

#### slots
`VueMarkdownHook`和`VueMarkdownWorker`异步组件都有的插槽

`fallback` (`(error: Error) => VNode[]`) -- 解析报错的插槽


> [!WARNING] 注意
> 这里使用的`VueMarkdown`和`VueMarkdownHook`,均不带任何样式,只做了把markdown内容在vue上渲染出来
> 所以需要自行加载样式，例如
>
> ```js
> // npm add github-markdown-css or pnpm add > github-markdown-css
> import 'github-markdown-css'
> ```

或者使用开箱即用的[VueMarkdownPro](/markdown/vue-markdown-pro)组件

### API

markdown组件的入参

- `content` (`string`, 可选) -- 要渲染的markdown文本内容
- `rehypePlugins` (`Array<Plugin>`, 可选) -- [rehype的插件](https://github.com/rehypejs/rehype?tab=readme-ov-file#plugins)
- `remarkPlugins` (`Array<Plugin>`, 可选) -- [remark的插件](https://github.com/remarkjs/remark?tab=readme-ov-file#plugins)
- `remarkRehypeOptions`
  (`RemarkRehypeOptions`, 可选) -- [remark-rehype入参](https://github.com/remarkjs/remark-rehype?tab=readme-ov-file#options)
- allowedElements (`Array<string>`) -- 允许的element标签名



### slots

`components` (`(params: { tree: ElementContent, childrenRender: ChildrenRender }) => VNode[]`) -- 自定义组件渲染的插槽


## markdown语法自定义组件渲染

例如因**安全**需要，

- **链接**不能直接跳转，需要做一个中间弹窗，进行免责提醒

<sx-code src="./demos/CustomLink.vue" showCode="./demos/CustomLink.vue" ></sx-code>
