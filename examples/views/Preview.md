## Preview 图片预览

### 基础用法
:::demo

```html
<template>
    <div style="margin-bottom: 10px">
        <md-preview url="https://nimg.ws.126.net/?url=http%3A%2F%2Fdingyue.ws.126.net%2F2021%2F0202%2F326d28e4j00qnvbqw0023c000hs00m7c.jpg&thumbnail=650x2147483647&quality=80&type=jpg"/>
    </div>
    <div>
        <md-preview size="large" url="https://nimg.ws.126.net/?url=http%3A%2F%2Fdingyue.ws.126.net%2F2021%2F0202%2F326d28e4j00qnvbqw0023c000hs00m7c.jpg&thumbnail=650x2147483647&quality=80&type=jpg"/>
    </div>
</template>
```
:::
### 空值/加载失败
:::demo

```html
<template>
    <md-preview size="large" url="sdajsldjlksaj.jpg"/>
</template>
```
:::


### Preview Attributes

| 参数名称 | 说明               |类型               | 默认值 |
| -------- | ------------------ | -------- |-------- |
| url      | 图片地址 | String        |null      |

