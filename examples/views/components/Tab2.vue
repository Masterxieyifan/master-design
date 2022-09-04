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
            // 子组件2 配置
            pageConfig: {
                skeleton: true,
                padding: 20,
                pageHandbook: `
                    <h4>操作按钮说明：</h4>
                    <ol>
                        <li>哇巴哇巴哇巴哇巴哇巴哇巴2</li>
                        <li>哇巴哇巴哇巴哇巴哇巴哇巴2</li>
                    </ol>
                `,
            },
            tabs: [],
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
        }, 1500)
    },
    methods: {
        handle(item){
            console.log(item);
        },
        toQuery() {
            console.log('Tab2');
        },
    }
}
</script>
