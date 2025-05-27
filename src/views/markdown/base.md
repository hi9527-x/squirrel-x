# vue markdown 组件渲染

用于在vue中，渲染markdown语法文本的组件

把markdown文本内容，通过`remark`转换为`Abstract Syntax Tree`，再渲染为vue组件。

## 代码演示

<code src="./demos/HelloWorld.vue" />

## markdown语法自定义组件渲染

例如因**安全**需要，

- **链接**不能直接跳转，需要做一个中间弹窗，进行免责提醒
- **图片**等静态资源，需要添加安全参数，或者域名才能正常访问

<code src="./demos/CustomLink.vue" />

## markdown自定义echarts渲染

<code
  src="./demos/Echarts.vue"
  markdown="./demos/echarts.md"
  showCode="EchartsTest.vue"
/>

## Mermaid渲染图表

<code
  src="./demos/Mermaid.vue"
  markdown="./demos/mermaid.md"
/>

## 流式预览

支持的markdown语法，通过聊天窗方式流式输入

<code src="./demos/Stream.vue" markdown="./demos/base.md" />
