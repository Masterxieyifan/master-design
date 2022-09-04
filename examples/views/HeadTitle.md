<!--
 * @Author: lingyong.zeng
 * @Date: 2021-07-23 11:37:40
 * @LastEditors: 蔡远程
 * @LastEditTime: 2021-08-26 14:27:43
 * @Description: 
-->
## HeadTitle 标题组件（详情页使用）

用于详情页记录页面标题锚点未知，并将操作存储至 urlHash，在页面加载进行页面定位

* 配合 Anchors 与 OperateStorageHash 组件使用

### 基础用法
:::demo

```html
<template>
    <md-head-title value="head-1" label="内容标题1"/>
    <md-head-title value="head-1" label="内容标题2"/>
    <md-head-title value="head-1" label="内容标题3"/>
</template>

<script>
export default {
    
}
</script>

```
:::


### HeadTitle Attributes
| 参数 | 说明 | 类型 |可选值| 默认值 |
|  ----  | ----  |---- | ---| ---- |
| value | 锚点标识(相当于ID)  | String | - | - |
| label | 标题文字 | String | - | - |


### HeadTitle Slots
| 参数名称 | 说明                    |
| -------- | ----------------------|