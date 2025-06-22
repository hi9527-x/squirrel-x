## vue-mermaid组件

基于vue3制作的mermaid，文本渲染图表组件

## 使用

需要先安装mermaid

```bash
pnpm add Mermaid
```

<sx-code src="./demos/demo1.vue" showCode="./demos/demo1.vue" ></sx-code>

### 流式渲染

并且优化了在聊天窗里，sse接口的流式渲染

<sx-code src="./demos/demo2.vue" showCode="./demos/demo2.vue" ></sx-code>

### 属性

| 属性名 | 类型   | 是否必填 | 默认值 | 描述                    |
| ------ | ------ | -------- | ------ | ----------------------- |
| code   | String | 否       | ''     | 要展示的mermaid文本内容 |
