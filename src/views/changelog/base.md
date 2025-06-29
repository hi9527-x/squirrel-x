# 更新日志

## version`0.1.3`

* 添加`VueMarkdown`,`VueMarkdownHook`,`VueMarkdownWorker`组件，只负责渲染markdown到vue上
* `VueMarkdownWorker`是子线程解析markdown内容，不阻塞交互，但也不支持添加rehype和remark的插件

## version`0.0.5`

### Mermaid图表

- 重构`Mermaid`组件
- 优化流式渲染，更好的实时更新渲染[查看这里](/mermaid)
- 添加**全屏**，**放大，缩小**，**拖拽移动**，**重置**功能

### code代码高亮

- 修改**全屏**功能，是基于浏览器视窗的全屏，而不是显示器全屏
- 修复等宽字体兜底逻辑

### Popover

- 修复溢出屏幕bug

# todo list

- 解析markdown放到web worker，优化性能
- 添加toc功能
  - 组件的toc功能应该比html的toc功能更加*灵活*和*自定义*，所以迟迟没有添加
