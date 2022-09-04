<!--
 * @Author: lingyong.zeng
 * @Date: 2021-07-23 11:37:40
 * @LastEditors: 蔡远程
 * @LastEditTime: 2021-08-26 14:27:49
 * @Description: 
-->
## StorageHash 操作存储

将操作存储至 urlHash，在页面加载或刷新时读取参数值并赋值到页面组件数据对象

* 配合高级搜索使用（统一处理表单组件变更时触发搜索、重置）
* 独立使用时仅做保存与回显参数使用
* type: query 时，匹配组件数据并自动设置 isQuery 属性，如 el.isQuery 实现 UI 样式

### 基础用法
:::demo

```html
<template>
    <md-storage-hash type="query" @search="handleSearch">
        <el-input 
            prop="name" 
            v-model="query.name"
            placeholder="请输入"
            searchable
            clearable
        >
        </el-input>
    </md-storage-hash>
</template>

<script>
    export default {
        data() {
            return {
                query: {
                    name: ''
                }
            }
        },
        methods: {
            handleSearch() {
                //...
            }
        }
    }
</script>
```
:::


### StorageHash Attributes
| 参数 | 说明 | 类型 |可选值| 默认值 |
|  ----  | ----  |---- | ---| ---- |
| inline | 行内布局 | boolean| - | false |
| prop | 操作类型 | String | query/tab/head |