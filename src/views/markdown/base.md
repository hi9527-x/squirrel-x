# vue markdown 组件渲染

用于在vue中，渲染markdown语法文本的组件

把markdown文本内容，通过`remark`转换为`Abstract Syntax Tree`，再渲染为vue组件。

## 代码演示

<sx-code src="./demos/HelloWorld.vue" showCode="./demos/HelloWorld.vue"></sx-code>

## markdown语法自定义组件渲染

例如因**安全**需要，

- **链接**不能直接跳转，需要做一个中间弹窗，进行免责提醒

<sx-code src="./demos/CustomLink.vue" showCode="./demos/CustomLink.vue" ></sx-code>

## markdown自定义echarts渲染

<sx-code src="./demos/Echarts.vue" showCode="./demos/echarts.md,./demos/EchartsTest.vue" > </sx-code>

## Mermaid渲染图表

<sx-code src="./demos/Mermaid.vue" showCode="./demos/mermaid.md" ></sx-code>

## 流式预览

支持的markdown语法，通过聊天窗方式流式输入

<sx-code src="./demos/Stream.vue" showCode="./demos/base.md" ></sx-code>
