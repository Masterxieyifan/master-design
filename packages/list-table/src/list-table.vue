<!--
 * @Author: lingyong.zeng
 * @Date: 2021-08-09 09:33:08
 * @LastEditors: 蔡远程
 * @LastEditTime: 2022-06-28 14:17:02
 * @Description:
-->

<template>
    <md-table
        :ref="tableRefKey"
        :columns="columns"
        :data="tableData"
        :checkboxConfig="checkboxConfig"
        :highlightCurrentRow="highlightCurrentRow"
        :stripe="stripe"
        :border="border"
        :_hasEmpty="hasEmpty"
        :syncRowHeight="syncRowHeight"
        height="auto"
        @size-change="handleSizeChange"
        @current-page-change="handleCurrentChange"
        @select="handleSelections"
        @column-change="handleColumnChange"
        :storage="storage"
        :storageKey="_storageKey"
        :storageColumnProps="storageColumnProps"
        @storage-columns-change="storageHandleColumns"
        @sort-change="handleSortChange"
        :total="total"
        :sort-config="_sortConfig"
        v-loading="loading"
        v-bind="$attrs"
        v-on="$listeners"
    >
        <slot v-bind:storageColumns="storageColumns">
            <template v-for="k in Object.keys(this.$slots)">
                <slot :slot="k" :name="k" v-bind:storageColumns="storageColumns"/>
            </template>
        </slot>
        <template v-slot:empty>
            <slot name="empty">
                <md-empty
                    title="未找到与您的搜索匹配的内容"
                    description="建议：检查输入字词有无错误、尝试其他查询词、改用较常见的字词或更换搜索范围，比如时间、状态等。"
                    :image="`${$options.staticBaseUrl}/saas/empty/empty-search.svg`" />
            </slot>
        </template>
    </md-table>
</template>

<script>
import MdTable from '../../table';
import { isFunction, isString, isBoolean } from '@master_vantop/vantop-util';
import { tableStorage } from '@/mixins';
import { staticBaseUrl, } from '@/util';

export default {
    name: 'MdListTable',
    staticBaseUrl,
    mixins: [tableStorage],
    inject: {
        rootPage: {
            default: () => ({ active: true })
        }
    },
    components: {
        MdTable
    },
    props: {
        columns: {
            type: Array,
            default: () => []
        },
        apiFn: {
            type: Function,
        },
        selections: {
            type: Array,
            default: () => []
        },
        storage: {
            type: Boolean,
            default: true
        },
        storageKey: {
            type: String,
            default: ''
        },
        border: {
            type: [String, Boolean],
            default: 'header'
        },
        stripe: {
            type: Boolean,
            default: true,
        },
        highlightCurrentRow: {
            type: Boolean,
            default: false,
        },
        checkboxConfig: {
            type: Object,
            default: ()=>({
                highlight: true,
                borderShow: true
            })
        },
        syncRowHeight:{
            type: Boolean,
            default: true,
        },
    },
    data() {
        return {
            isInit: false,              // 初始化完成标识
            storageColumns: [],
            hasEmpty: false,
            loading: true,
            tableData: [],
            total: 0,
            tableRefKey: new Date().valueOf(),
            pageParent: null,           // 页面父级
            reqNum: 0,                  // 请求计数
        };
    },
    computed: {
        _active() {
            const { active = false } = this.rootPage;
            return active;
        },
        // fix props default this.$route.path -> undefined
        _storageKey() {
            const { storageKey } = this;
            return storageKey ? storageKey : this.$route.path + '_table';
        },
        hasSelections() {
            return this.selections.length > 0;
        },
        hasNoSelections() {
            return !this.hasSelections;
        },
        _sortConfig() {
            let sortConfig = this.$attrs.sortConfig || this.$attrs['sort-config'] || {};
            sortConfig.remote = sortConfig.remote === false ? false : true;
            let field, order;
            if (this?.pageParent?.urlHashParams?.query) {
                ({
                    orderByField: field,
                    isAsc: order
                } = this.pageParent.urlHashParams.query);
            }

            if (isString(field) && isBoolean(order)) {
                sortConfig = {
                    ...sortConfig,
                    defaultSort: {
                        field,
                        order: order ? 'asc' : 'desc'
                    }
                };
            }
            return sortConfig;
        }
    },
    created() {
        const unwatch = this.$watch('loading', ()=>{
            this.hasEmpty = true;
            unwatch();
        });
    },
    mounted() {
        this.getPageParent();
    },
    beforeDestroy() {
        this.pageParent = null;
    },
    methods: {
        async init() {
            if (this.isInit) { // 已经完成初始化
                return;
            }
            await new Promise((resolve) => this.$nextTick(resolve));
            this.isInit = true;
        },
        // queryTable(params) {
        //     return new Promise((resolve) => {
        //         this.loading = true;

        //         const { apiFn, tableRefKey, reqNum } = this;
        //         this.reqNum = reqNum + 1;

        //         this.$refs[tableRefKey]?.$refs?.tableInstance?.clearScroll();
        //         if (this.$attrs.hasSelection !== false) {
        //             this.clearSelection();
        //         }

        //         if (!apiFn) {
        //             throw new Error('Must provide apiFn props');
        //         }

        //         const reqApiFn = apiFn;
        //         if (!isFunction(reqApiFn)) {
        //             throw new Error('apiFn can no transform function');
        //         }

        //         let tableData, total;
        //         // loading 响应关闭至少 >= 0.4s
        //         //（处理接口回调过快导致loading动画未执行完就关闭了，看不出loading)
        //         let reqCallBack = reqApiFn(params);
        //         setTimeout(async () => {
        //             try {
        //                 ({
        //                     records: tableData = [],
        //                     total
        //                 } = await reqCallBack);

        //             } finally {
        //                 this.tableData = Array.isArray(tableData) ? tableData : [];
        //                 this.total = total ? Number(total) : 0;
        //                 this.reqNum = this.reqNum - 1;
        //                 if (this.reqNum === 0) {
        //                     this.loading = false;
        //                 }
        //             }

        //             let { size, pageSize, pageNo, current, currentPage } = params;
        //             size = size || pageSize;
        //             current = current || pageNo || currentPage;

        //             let tableInstance = this.$refs[this.tableRefKey];
        //             if (tableInstance) {
        //                 this.$nextTick(() => {
        //                     size && tableInstance.setPaginationSize(size);
        //                     current && tableInstance.setPaginationCurrent(current);
        //                     tableInstance = null;
        //                 });
        //             }

        //             // 返回表格查询数据
        //             return resolve({
        //                 records: this.tableData,
        //                 total: this.total
        //             });
        //         }, 400);
        //     });
        // },
        async queryTable(params) {
            const { apiFn, tableRefKey, reqNum } = this;
            this.reqNum = reqNum + 1;

            this.$refs[tableRefKey]?.$refs?.tableInstance?.clearScroll();
            if (this.$attrs.hasSelection !== false) {
                this.clearSelection();
            }

            if (!apiFn) {
                throw new Error('Must provide apiFn props');
            }

            const reqApiFn = apiFn;
            if (!isFunction(reqApiFn)) {
                throw new Error('apiFn can no transform function');
            }

            this.loading = true;
            let tableData, total;
            try {
                await reqApiFn(params).then(result => {
                    tableData = result?.records;
                    total = result?.total;
                });
            } finally {
                this.tableData = Array.isArray(tableData) ? tableData : [];
                this.total = total ? Number(total) : 0;
                this.reqNum = this.reqNum - 1;
                if (this.reqNum === 0) {
                    this.loading = false;
                }
            }

            let { size, pageSize, pageNo, current, currentPage } = params;
            size = size || pageSize;
            current = current || pageNo || currentPage;

            let tableInstance = this.$refs[this.tableRefKey];
            if (tableInstance) {
                this.$nextTick(() => {
                    size && tableInstance.setPaginationSize(size);
                    current && tableInstance.setPaginationCurrent(current);
                    tableInstance = null;
                });
            }

            // 返回表格查询数据
            return {
                records: this.tableData,
                total: this.total
            };
        },
        // 每页条数变动
        handleSizeChange({ size }) {
            this.updateParams('size', { size });
        },
        // 页数变动
        handleCurrentChange({ current }) {
            this.updateParams('current', { current });
        },
        // 排序变动
        handleSortChange({ property: orderByField, order }) {
            const isAsc = order === 'desc' ? false : (order === 'asc' ? true : null);
            this.updateParams('order', {
                orderByField: isBoolean(isAsc) ? orderByField : '',
                isAsc
            });
        },
        // 表格头部发生变化时
        handleColumnChange(columns) {
            this.storageColumns = columns;
        },
        // 获取被选中元素
        handleSelections(selections) {
            this.$emit('update:selections', selections);
        },
        clearSelection() {
            this.$refs[this.tableRefKey].clearSelection();
            this.$emit('update:selections', []);
        },
        // 更新表格自身参数(存储hash｜触发查询)
        updateParams(type, params) {
            if (isFunction(this.pageParent?.setUrlParams)) {
                if (type === 'order') {
                    const { isAsc, orderByField } = params;
                    if (isBoolean(isAsc)) {
                        this.pageParent.setUrlParams([
                            {
                                type: 'query',
                                prop: 'orderByField',
                                value: orderByField
                            },
                            {
                                type: 'query',
                                prop: 'isAsc',
                                value: isAsc
                            }
                        ]);
                    } else {
                        this.pageParent.setUrlParams([
                            {
                                type: 'query',
                                prop: 'orderByField',
                                value: ''
                            },
                            {
                                type: 'query',
                                prop: 'isAsc',
                                value: null
                            }
                        ]);
                    }
                } else if (type === 'size' || type === 'current') {
                    this.pageParent.setUrlParams([{
                        type: 'query',
                        prop: type,
                        value: params[type]
                    }]);
                }
            }

            if (isFunction(this.pageParent?.toQuery)) {
                this.pageParent.toQuery(params);
            }
        },
        // 找到父级页面组件
        getPageParent() {
            let parent = this || this.$parent || this.$root;
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
    }
};
</script>
