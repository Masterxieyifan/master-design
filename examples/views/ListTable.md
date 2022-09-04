<!--
 * @Author: lingyong.zeng
 * @Date: 2021-08-06 15:37:00
 * @LastEditors: 蔡远程
 * @LastEditTime: 2021-08-26 14:27:46
 * @Description: 
-->
## ListTable 列表页面表格（基于 VantopTable 二次封装）


### 基础用法 （列表页面完整功能: nextop-web-business/web-main-business master 分支进行查看）


:::demo

```html
<template>
    <md-list-table
        ref="pageListTable"
        apiFn="getTableList"
        :storage="false"
        :selections.sync="selections"
        :columns="columns"
        :operations="operations"
        :operationWidth="120"
    >
    </md-list-table>
</template>

<script>
export default {
    isPage: true,                   // 有引用 operateStorage mixin 时不需要指定该属性
    data() {
        return {
            selections: [],         // '表格选中项'
            columns: [              
                    {
                    prop: 'name',
                    label: '名称',
                },
                {
                    prop: 'age',
                    label: '年龄',
                },
                {
                    prop: 'sex',
                    label: '性别',
                },
            ],
            operations: [
                {
                    text: '查看',
                    key: 'view',
                    handler: row => this.handleRow('view', row),
                },
                {
                    text: '修改',
                    key: 'eidt',
                    handler: row => this.handleRow('edit', row),
                },
                {
                    text: '通过',
                    key: 'pass',
                    handler: row => this.handleRow('pass', row),
                },
                {
                    text: '作废',
                    key: 'cancel',
                    handler: row => this.handleRow('cancel', row),
                },
            ],
        };
    },
    mounted() {
        this.toQuery({current: 1, size: 20})
    },
    methods: {
        toQuery(params) {
            this.$refs.pageListTable.queryTable(params)
        },
        handleRow(type, row) {
            //...
        }
    }
}
</script>
```
:::

### ListTable Attributes

| 参数                   | 说明                    | 类型           | 是否必须 | 默认值 |
| -- | -- | -- | -- | -- |
| apiFn                 | 接口函数(this.$api['apiFn']) | String    | 是     | -- |          
| storage               | 是否采用远程存储记录用户列行为  | Boolean    | 否                   | $route.path+'_table'  |
| storageKey            | 存储在远程仓库的键值，租户唯一  | String     | 是(当storage为true时) | -      |
| operations            | 行的操作列表                       | Array            | 否                    | []     |
| operationWidth        | 操作列的宽度                       | [String, Number] | 否                    | 140    |

### operations/columns 配置沿用 vantop-table

