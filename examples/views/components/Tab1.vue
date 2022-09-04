<template>
    <md-page-list :pageConfig="pageConfig">
        <!-- 页面模版 搜索 插槽 -->
        <template #search>
            <md-select-input/>
        </template>
        <!-- 页面模版 table 插槽 -->
        <template #table>
            <md-table
                :columns="columns"
                :data="data"
            >
            </md-table>
        </template>
    </md-page-list>
</template>
<script>
export default {
    data(){
        return {
            // 子组件1 配置
            pageConfig: {
                skeleton: true,
                padding: 20,
                operationBtnsLayout: 'inline',
                pageHandbook: `
                    <h4>操作按钮说明：</h4>
                    <ol>
                        <li>哇巴哇巴哇巴哇巴哇巴哇巴1</li>
                        <li>哇巴哇巴哇巴哇巴哇巴哇巴1</li>
                    </ol>
                `,
                // 页面 操作 按钮
                operationBtns: [
                    {
                        icon: 'van-add-new-16',
                        text: '新增',
                        key: 'add',
                        click: item => this.handle(item),
                    },
                ],
            },
            // table
            columns: [
                { prop: 'name', label: '名称', },
                { prop: 'age', label: '年龄', },
                { prop: 'sex', label: '性别', },
            ],
            data: [
                { name: '123', age: 12, sex: 1, },
            ],
        }
    },
    mounted(){
        setTimeout(() => {
            // 手动 修改子组件骨架屏 状态
            this.pageConfig.skeleton = false;
        }, 6000)
    },
    methods: {
        handle(item){
            console.log(item);
        },
        toQuery() {
            console.log('Tab1');
        },
    }
}
</script>
