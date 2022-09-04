## Select Create使用教程
基于[el-select](https://element.eleme.cn/#/zh-CN/component/select)实现，添加create选项，请配合element-ui文档一起食用。


### 基础用法
:::demo

```html
<template>
   <div height="300px">
        <select-create v-model="selectVal" @create="handleCreate">
            <el-option value="1">1</el-option>
            <el-option value="2">2</el-option>
            <el-option value="3">3</el-option>
        </select-create>
   </div>
</template>
<script>
export default {
    data() {
        return {
            selectVal: '',
        };
    },
    methods: {
        handleCreate() {
            console.log('Clicked create button, val is: ', this.selectVal);
            this.$message.success(`Clicked create button, val is: ${this.selectVal}`, );
        }
    }
}
</script>
```
:::

### 事件列表

| 事件名称 | 说明               | 回调参数 |
| -------- | ------------------ | -------- |
| create      | 点击create行时触发 | -        |

