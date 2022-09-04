<!--
 * @Author: hongdong.liao
 * @Date: 2021-06-16 10:31:27
 * @LastEditors: lingyong.zeng
 * @LastEditTime: 2022-05-27 10:17:38
 * 1. 条件少于等于 3 个 默认全显示
-->
<template>
    <div class="advanced-search--wrapper">
        <md-storage-hash
            :inline="true"
            type="query"
            ref="operateMemory"
            @search="handleSearch"
        >
            <template v-if="isInit && showConditions.length">
                <template v-for="item in showConditions">
                    <Render
                        class="cond-input-item"
                        :render="item.render"
                        :key="item.prop"
                        :prop="item.prop"
                        :label="item.label"
                        :id="item.id"
                    />
                </template>
            </template>
            <md-custom-condition
                :customVisible="customVisible"
                ref="customCondition"
                v-bind="$attrs"
                v-on="$listeners"
                :resultClear="resultClear"
                :activeFields="activeFields"
                @confirm-cond="confirmCond"
                @reset-cond="resetCond"
            >
            </md-custom-condition>
        </md-storage-hash>
    </div>
</template>
<script>
import MdCustomCondition, { FILTER_MAX_LEN } from './custom-condition';
import Render from './panel-render';
import MdStorageHash from '@/packages/storage-hash';
import { isEmpty, isObject, isObjDeepEqual, filterEmptyAttrs, debounce } from '@master_vantop/vantop-util';
import { StorageService, } from '@master_vantop/nextop-http';

// 不使用远程存储时仅使用本地存储（登出即时效）
const KEY = 'ADVANCED_SEARCH';
function localSet(key, params) {
    if (!key || isEmpty(params)) {
        return;
    }
    let search = localStorage.getItem(KEY);
    search = search ? JSON.parse(search) : search;

    if (!isObject(search)) {
        search = {};
    }
    search[key] = params;
    localStorage.setItem(KEY, JSON.stringify(search));
}
function localGet(key) {
    let search = localStorage.getItem(KEY);
    search = search ? JSON.parse(search) : search;
    return search?.[key];
}

export default {
    name: 'MdAdvancedSearch',
    components: {
        MdCustomCondition,
        Render,
        MdStorageHash,
    },
    props: {
        storage: {                      // 是否启用远程存储
            type: Boolean,
            default: true
        },
        storageKey: {                   // 远程存储标识
            type: String,
            default: '',
        },
        query: {                        // 查询对象
            type: Object,
            default: () => ({})
        },
        origin: {                       // 原始值
            type: Object,
            default: () => ({})
        },
    },
    data() {
        return {
            pageParent: null,           // 页面父级
            isInit: false,              // 初始化完成标识
            activeFields: [],           // 可显示条件的字段名数组
            resultClear: false,         // 是否显示重置按钮
            queryParams: null,          // 查询参数（不同于页面的 query)
        };
    },
    watch: {
        'queryAndOrigin': {             // 监听 query 原始与实时值(仅作为高级搜索条件)，判定是否显示重置按钮
            handler(val) {
                this.debounceCheckResultClear(val);
            },
            deep: true,
        },
    },
    computed: {
        filterMaxLen() {
            const { filterMaxLen } = this.$attrs;
            return filterMaxLen ? filterMaxLen : FILTER_MAX_LEN;
        },
        configKey() {
            if (this.storageKey) {
                return this.storageKey;
            }
            return location.pathname + '_search';
        },
        queryAndOrigin() {
            const { query, origin, showCondProps, condProps: { all: allCondProps } } = this;
            return {
                query,
                origin,
                showCondProps,
                allCondProps
            };
        },
        // 所有/固定条件的 prop 数组
        condProps() {
            const all = [];
            let fixed = [];

            for (let { prop, status } of this.$attrs.data) {
                all.push(prop);
                status === 'fixed' && fixed.push(prop);
            }

            // 如果所有条件（少于或等于3个），则全为固定条件
            if (all.length <= 3) {
                fixed = all;
            }

            return {
                all,
                fixed
            };
        },
        // 可渲染的条件 prop 数组
        showCondProps() {
            return this.showConditions.map(({ prop }) => prop);
        },
        // 可渲染的条件
        showConditions() {
            const {
                $attrs: { data = [] },
                activeFields = []
            } = this;
            if (isEmpty(activeFields)) {
                return [];
            }
            // 先找出对应的项
            const list = data.filter(({ prop }) => activeFields.includes(prop));
            // 根据存储顺序排序
            return list.sort((a, b) => activeFields.indexOf(a.prop) - activeFields.indexOf(b.prop));
        },
        // 是否显示自定条件配置
        customVisible() {
            return this.condProps?.fixed.length !== this.condProps?.all.length;
        },
    },
    created() {
        this.$parent.renderMixin = this.renderMixin;
        this.debounceCheckResultClear = debounce(this.checkResultClear, 400);
    },
    methods: {
        // 初始化
        async init() {

            if (this.isInit) { // 已经完成初始化
                return this.queryParams;
            }

            this.pageParent = this.$refs['operateMemory'].pageParent;

            const {
                condProps: {
                    all,            // 所有条件的prop数组
                    fixed           // 固定条件的prop数组
                },
                filterMaxLen        // 最大显示条件数量
            } = this;

            let _storageFields;     // 已存条件
            let _activeFields;      // 启用条件（显示）

            // 固定条件等于全部条件时，则不需要走存储及排序，以代码顺序为准
            // 不全等时需获取存储，以存储顺序为准
            const isAllShow = all.length === fixed.length;

            if (isAllShow) {
                _activeFields = _storageFields = all;
            } else {
                try {
                    // 获取存储条件
                    _storageFields = await this.getStorage();
                } catch {
                    //...
                }
            }

            let needUpdateStorage = false;      // 是否需要更新存储

            if (!isAllShow) {                   // 非全显示逻辑处理
                if (Array.isArray(_storageFields)) {
                    // 有存储则把未存固定条件加入到末尾
                    _activeFields = Array.from(
                        new Set([..._storageFields, ...fixed])
                    );
                } else {
                    // 无存储时则默认全部
                    _storageFields = [];
                    _activeFields = all;
                    needUpdateStorage = true;
                }
            }

            // 显示数量超出限制逻辑处理
            if (_activeFields.length > filterMaxLen) {
                if (isEmpty(fixed)) {
                    // 无固定条件则直接截取
                    _activeFields = _activeFields.slice(0, filterMaxLen);
                } else {
                    // 有固定条件则优先保存固定条件，优先移除末尾非固定条件
                    let i = _activeFields.length - 1;
                    while (_activeFields.length > filterMaxLen && i > 0) {
                        if (!fixed.includes(_activeFields[i])) {
                            _activeFields.splice(i, 1);
                        }
                        i--;
                    }

                    // 整理过后如果还超出限制，则抛错误
                    if (_activeFields.length > filterMaxLen) {
                        throw new Error('搜索栏配置： 固定条件个数超出最大显示条件数！');
                    }
                }
            }

            if (!isAllShow && !needUpdateStorage) {
                // 比对存储跟启用条件是否一致，不一致则需更新
                if (!isObjDeepEqual(_storageFields, _activeFields)) {
                    needUpdateStorage = true;
                }
            }

            needUpdateStorage && this.setStorage(_activeFields);

            this.activeFields = _activeFields;
            this.isInit = true;

            this.emitSearch(true);

            return this.queryParams;
        },
        setStorage(data) {
            if (this.storage) {
                StorageService.setItem(this.configKey, data);
            } else {
                localSet(this.configKey, data);
            }
        },
        getStorage() {
            if (this.storage) {
                return StorageService.getItem(this.configKey);
            }
            return localGet(this.configKey);
        },
        // 确定条件
        confirmCond(activeFields) {
            this.activeFields = activeFields;
            this.setStorage(activeFields);
            this.emitSearch();
        },
        // 重置
        resetCond() {
            this.resultClear = false;
            const origin = JSON.parse(JSON.stringify(this.origin, this.condProps.all));
            // Object.assign(this.query, origin);
            for (let k of Object.keys(this.query)) {
                if (origin[k] !== undefined && origin[k] !== null) {
                    this.query[k] = origin[k];
                }
            }

            const urlParams = Object.keys(this.query).map(prop => ({
                type: 'query',
                prop,
                value: this.query[prop]
            }));

            this?.pageParent?.setUrlParams(urlParams);
            this.$refs.operateMemory.toggleIsQuery();
            this.emitSearch();
        },
        // 搜索
        handleSearch() {
            this.emitSearch();
        },
        // 清空不再作为可用条件的值并向外抛出事件及参数（会变更 data 对象的 query)
        emitSearch(initSearch = false) {
            const { activeFields, condProps: { all } } = this;

            let originQuery;
            // 有默认值则取默认值（同步异步）
            if (isEmpty(this.origin)) {
                originQuery = this.pageParent?.$options?.data()?.query;
            } else {
                originQuery = this.origin;
            }

            // 不再作为用户指定条件将不再参与接口查询
            // current 为表格特有，每次查询会重置页码为1，每页显示条数不变
            const params = {};
            Object.keys(this.query).forEach(prop => {
                // 仅约束作为高级搜索的条件，非高级搜索的条件取 query 值
                if (all.includes(prop)) {
                    if (activeFields.includes(prop)) {
                        params[prop] = this.query[prop];
                    }
                } else if (prop === 'current') {
                    if (initSearch) {
                        // 初始化搜索时取 urlHash 值或 query 值
                        params[prop] = this.query[prop];
                    } else {
                        // 取默认值值
                        params[prop] = originQuery[prop];
                        this.pageParent.setUrlParams([{
                            type: 'query',
                            prop: 'current',
                            value: originQuery[prop]
                        }]);
                    }
                }
            });

            this.queryParams = params;
            !initSearch && this.$emit('search', params);
        },
        // 检测是否高亮筛选
        toggleIsQuery() {
            this.$refs.operateMemory.toggleIsQuery();
        },
        // 判断是否显示重置条件
        checkResultClear({ query, origin, showCondProps }) {
            const queryStr = JSON.stringify(filterEmptyAttrs(query), showCondProps);
            const originStr = JSON.stringify(filterEmptyAttrs(origin), showCondProps);
            this.resultClear = queryStr !== originStr;
        },
    }
};
</script>
