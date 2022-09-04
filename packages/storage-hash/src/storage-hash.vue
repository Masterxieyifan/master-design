<!--
 * @Author: lingyong.zeng
 * @Date: 2021-07-20 10:03:40
 * @LastEditors: lingyong.zeng
 * @LastEditTime: 2022-07-04 11:02:59
 * @Description:
-->

<template>
    <div
        class="vantop-operate-memory"
        :class="{'vantop-operate-memory__inline': inline}"
    >
        <slot></slot>
    </div>
</template>

<script>
import { isEmpty, isFunction } from '@master_vantop/vantop-util';

const URL_TRIGGER_COMPONENTS = [
    'ElInput',
    'ElSelect',
    'ElDatePicker',
    'ElTimeSelect',
    'ElTabs',
    'SelectInputNumber',
    'ElCascader',
    'MultiInput',
    'MdSelectDate',
    'MdSelectTree',
    'SelectInput',
    'SelectInputSelect',
    'ElAutocomplete'
];
export default {
    name: 'MdStorageHash',
    componentName: 'OperateStorageHash',
    props: {
        type: String,  // query/tab/head
        inline: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            pageParent: null,       // 父级页面组件
            waitToggleQuery: [],    // 待切换 isQuery 队列
        };
    },
    created() {
        this.$on('operate.storage.change', ({ vNode, prop, value, }) => {
            this.pageParent?.setUrlParams([
                {
                    type: this.type,
                    prop,
                    value
                }
            ]);
            if (this.type === 'query') {
                this.$emit('search');
                this.toggleIsQuery([vNode]);
            }
        });

        // 子组件有更新(v-if)等
        this.$on('operate.children.change', (vNode) => {
            if (this.type === 'query') {
                if (!this.pageParent) {
                // 本组件未挂载完成时先推入队列
                    this.waitToggleQuery.push(vNode);
                } else {
                // 已完成挂载且找到父级直接执行
                    this.toggleIsQuery([vNode]);
                }
            }
        });
    },
    mounted() {
        // 类型为查询时遍历组件添加 isQuery 标识
        this.getPageParent();
        if (this.type === 'query') {
            if (this.pageParent && this.waitToggleQuery.length) {
                this.$nextTick(() => {
                    this.toggleIsQuery(this.waitToggleQuery);
                    this.waitToggleQuery = [];
                });
            }
        }
    },
    beforeDestroy() {
        this.pageParent = null;
        this.$off();
    },
    methods: {
        // resetUrlParams() {
        //     this.pageParent?.resetUrlParams('query');
        //     this.toggleIsQuery(this.$children);
        // },
        // 找到父级页面组件
        getPageParent() {
            let parent = this.$parent || this.$root;
            let isPage = parent.$options.isPage;

            while (parent && !isPage) {
                parent = parent.$parent;
                if (parent) {
                    isPage = parent.$options.isPage;
                }
            }

            if (parent && isPage) {
                this.pageParent = parent;
            }
        },
        // 根据 urlHash 参数值切换 isQuery，样式切换
        toggleIsQuery(list = this.$children) {
            if (!this.pageParent) {
                return;
            }
            for (let item of list) {
                const name = item.$options?.name;
                if ( item.prop && URL_TRIGGER_COMPONENTS.includes(name)) {
                    if (isFunction(item.getIsQuery)) {
                        this.$nextTick(()=>{
                            item.isQuery = item.getIsQuery();
                        });
                        continue;
                    }
                    const value = this.pageParent?.query?.[item.prop];
                    if ((name.startsWith('Select') || name === 'MdSelectDate') && name.length > 6) {
                        // 下拉框 + 基础表单 (判断表单值是否有值)
                        if (isEmpty(value?.[1])) {
                            item.isQuery = false;
                        } else {
                            item.isQuery = true;
                        }
                    } else if (isEmpty(value)) {
                        item.isQuery = false;
                    } else {
                        item.isQuery = true;
                    }
                    continue;
                }
                if (item.$children) {
                    this.toggleIsQuery(item.$children);
                }
            }
        },
    },
};
</script>
<style lang="scss" scoped>
.vantop-operate-memory__inline {
    display: inline-block;
}
</style>