**粗体**<span style="color: red">1<a>x*斜体*x</a>2</span>

```javascript
console.log('It works!')
```

## mermaid

```mermaid
flowchart LR
  A[Start]-->B[Do you have coffee beans?]
  B-->|Yes|C[Grind the coffee beans]
  B-->|No|D[Buy ground coffee beans]
  C-->E[Add coffee grounds to filter]
  D-->E
  E-->F[Add hot water to filter]
  F-->G[Enjoy!]
```

## 自定义echarts组件渲染

```x-echarts
{
  "xAxis": {
    "type": "category",
    "data": [
      "Mon",
      "Tue",
      "Wed",
      "Thu",
      "Fri",
      "Sat",
      "Sun"
    ]
  },
  "yAxis": {
    "type": "value"
  },
  "series": [
    {
      "data": [
        820,
        932,
        901,
        934,
        1290,
        1330,
        1320
      ],
      "type": "line",
      "smooth": true
    }
  ]
}
```
