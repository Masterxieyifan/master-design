<template>
    <el-skeleton
        class="page-wrap"
        :id="pageListId"
        :loading="__pageConfig.skeleton"
        :throttle="0"
        animated
    >
        <!-- 骨架屏 -->
        <template slot="template">
            <aside class="page-aside" v-if="$slots.aside" :style="{paddingLeft: __pagePadding}">
                <el-row class="page-aside-content" :style="{width: __pageAsideWidth}">
                    <el-col :span="12" class="page-skeleton-item" style="margin-bottom: 16px;">
                        <el-skeleton-item variant="h1"/>
                    </el-col>
                    <template v-for="it in [1,2,3,4]">
                       <el-col :span="24" class="page-skeleton-item" :key="it * Math.random()" :style="it !== 1 && 'margin-top:46px;'">
                            <el-skeleton-item variant="h1"/>
                        </el-col>
                        <el-col :span="24" class="page-skeleton-item" :key="it * Math.random()" >
                            <el-skeleton-item variant="h1"/>
                        </el-col>
                        <el-col :span="16" class="page-skeleton-item" :key="it * Math.random()" >
                            <el-skeleton-item variant="h1"/>
                        </el-col>
                    </template>
                </el-row>
            </aside>
            <main class="page-main" :style="{
                paddingLeft: __pagePadding,
                paddingRight: __pagePadding,
            }">
                <!-- header  title or tabs -->
                <el-row
                    v-if="
                        __hasTitleOrTabs ||
                        __pageUpdateTime ||
                        $slots.header
                    "
                    style="margin-bottom: 16px;margin-top: 12px;"
                >
                    <el-col :span="3" v-if="__hasTitleOrTab">
                        <el-skeleton-item variant="h1"/>
                    </el-col>
                    <!-- <el-col :span="5" :offset="16"
                        v-if="
                            __pageUpdateTime ||
                            (searchSlotDisplay && filterStatusDisplay || !__hasBtn)
                        "
                    > -->
                    <el-col :span="5" :offset="16">
                        <el-skeleton-item variant="h1"/>
                    </el-col>
                </el-row>
                <!-- search / filter-status and operation-btns -->
                <el-row :gutter="16" type="flex" style="flex-wrap: wrap">
                    <!-- search -->
                    <template v-if="searchSlotDisplay">
                        <el-col :span="4"><el-skeleton-item variant="h1" class="page-skeleton-item"/></el-col>
                        <el-col :span="4"><el-skeleton-item variant="h1" class="page-skeleton-item"/></el-col>
                        <el-col :span="4"><el-skeleton-item variant="h1" class="page-skeleton-item"/></el-col>
                        <el-col :span="2"><el-skeleton-item variant="h1" class="page-skeleton-item"/></el-col>
                    </template>
                    <!-- 空白占位，将 filterStatus 挤掉落到另一行 -->
                    <el-col v-if="filterStatusDisplay" :span="10"></el-col>
                    <!-- filterStatus -->
                    <el-col v-if="filterStatusDisplay" :span="6">
                        <el-skeleton-item class="page-skeleton-item" variant="h1" />
                    </el-col>
                    <!-- operationBtns -->
                    <el-col :span="4"
                        v-if="__hasBtn"
                        :offset="(searchSlotDisplay && !filterStatusDisplay && __pageConfig.operationBtnsLayout === 'inline') || isNestSearch
                            ? 6 : filterStatusDisplay
                            ? 14 : 20"
                    >
                        <el-skeleton-item variant="h1" class="page-skeleton-item"/>
                    </el-col>
                </el-row>
                <!-- table -->
                <el-row class="page-main-table" v-if="$slots.table">
                    <el-col :span="24" class="page-skeleton-item">
                        <el-skeleton-item variant="h1"/>
                    </el-col>
                    <el-col :span="24" class="page-main-table-content">
                        <el-skeleton-item class="page-skeleton-item" variant="image" style="width:120px;height:120px;margin-bottom:24px;"/>
                        <el-skeleton-item class="page-skeleton-item" variant="h1" style="width:16.66667%;"/>
                        <el-skeleton-item class="page-skeleton-item" variant="h1" style="width:33.3333%;"/>
                    </el-col>
                    <el-col :span="24">
                        <el-row class="page-skeleton-item">
                            <el-col :span="2"><el-skeleton-item variant="h1"/></el-col>
                            <el-col :span="6" :offset="16"><el-skeleton-item variant="h1"/></el-col>
                        </el-row>
                    </el-col>
                </el-row>
                <slot></slot>
            </main>
        </template>
        <template>
            <!-- aside -->
            <aside class="page-aside" v-if="$slots.aside">
                <div class="page-aside-content" :style="{width: __pageAsideWidth}">
                    <slot name="aside"></slot>
                </div>
                <div class="collapse-line" @click.stop.prevent="__togglerAside"></div>
            </aside>
            <!-- main -->
            <main class="page-main">
                <!-- header  title or tabs skeleton -->
                <el-row
                    v-if="
                        (__hasTitleOrTabs ||
                        __pageUpdateTime ||
                        $slots.header) && __isNestShowHeader
                    "
                    style="margin-bottom: 16px;margin-top: 12px;"
                     :style="{
                        paddingLeft: __pagePadding,
                        paddingRight: __pagePadding
                    }"
                >
                    <el-col :span="3" v-if="__hasTitleOrTab">
                        <el-skeleton animated>
                            <template slot="template">
                                <el-skeleton-item variant="h1" style="width: 100%;"/>
                            </template>
                        </el-skeleton>
                    </el-col>
                    <!-- <el-col :span="5" :offset="16"
                        v-if="
                            __pageUpdateTime ||
                            (searchSlotDisplay && (filterStatusDisplay || !__hasBtn))
                        "
                    > -->
                    <el-col :span="5" :offset="16">
                        <el-skeleton animated>
                            <template slot="template">
                                <el-skeleton-item variant="h1"/>
                            </template>
                        </el-skeleton>
                    </el-col>
                </el-row>
                <!-- header  title or tabs -->
                <section
                    class="page-main-header"
                    v-if="
                        (__hasTitleOrTabs ||
                        __pageUpdateTime ||
                        $slots.header) && !__isNestShowHeader
                    "
                    :class="[
                        { 'right': !__pageTitle && !__hasTab },
                        { 'has-tab': __hasTabs }
                    ]"
                    :style="{
                        paddingLeft: __pagePadding,
                        paddingRight: __pagePadding,
                    }"
                >
                    <div class="page-main-header-div" v-if="__hasTitleOrTab" >
                        <h2 class="page-main-header-title" v-if="__pageTitle" v-html="__pageTitle"></h2>
                        <el-divider v-if="$slots.pageTab" direction="vertical"></el-divider>
                        <slot name="pageTab">
                            <div class="page-main-header-tabs" v-if="__hasTabs">
                                <el-tabs
                                    :prop="__pageTab.prop || 'pageTab'"
                                    v-model="pageTabActiveName"
                                    @tab-click="__handleTabClick"
                                >
                                    <el-tab-pane
                                        v-for="(item, idx) in __pageTab.tabs || []"
                                        :key="idx"
                                        :label="item.label"
                                        :name="item.value + ''"
                                        :disabled="__isDisabledOrHidden(item.disabled)"
                                    ></el-tab-pane>
                                </el-tabs>
                            </div>
                        </slot>
                    </div>
                    <div class="page-main-header-slot">
                        <span v-if="__pageUpdateTime">更新时间：{{__pageUpdateTime}}</span>
                        <el-divider v-if="$slots.header && __pageUpdateTime" direction="vertical"></el-divider>
                        <slot name="header"></slot>
                        <el-divider direction="vertical"></el-divider>
                        <el-popover
                            v-if="pageHandbook"
                            popper-class="page-list-popover__help"
                            placement="bottom-end"
                            trigger="hover"
                        >
                            <div v-html="pageHandbook"></div>
                            <el-button slot="reference" iconed tooltipDisabled type="info" size="small" icon="md-icon-help-16" hint="说明" style="margin-right: 6px;"></el-button>
                        </el-popover>
                        <el-button v-if="__pageConfig.pageHelp !== false" iconed type="info" size="small" icon="md-icon-instructions-16" hint="帮助" style="margin-right:-4px;" @click="__handleJumpHelpCenter"></el-button>
                        <el-button v-if="__pageConfig.pageRefresh !== false" iconed type="info" size="small" icon="md-icon-refresh-16" hint="刷新" @click="__handleRefresh"></el-button>
                        <template
                            v-if="
                                searchSlotDisplay &&
                                (filterStatusDisplay || !__hasBtn || __pageConfig.operationBtnsLayout !== 'inline') ||
                                isNestSearch
                            "
                        >
                            <el-tooltip
                                :disabled="disabledTips"
                                :content="isUnfoldFilter ? '隐藏筛选' : '显示筛选'"
                                placement="left"
                                :enterable="false"
                            >
                                <el-button
                                    type="text"
                                    class="page-main-header-filter"
                                    :class="[ isUnfoldFilter ? 'unfold': 'fold']"
                                    @click="__toggleFilter"
                                >
                                    <svg v-if="isUnfoldFilter" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                                        <g fill="none" fill-rule="evenodd">
                                            <path fill="#FFF" d="M13 2a1 1 0 0 1 .8 1.6l-3.574 4.133a1 1 0 0 0-.143.267h-4.12a1 1 0 0 0-.144-.267L2.2 3.6A1 1 0 0 1 3 2h10z"/>
                                            <path fill="#FFF" d="M10.026 10v4.156a1 1 0 0 1-1.287.958l-2.007-.9a1 1 0 0 1-.713-.958V10h4.007z" opacity=".4"/>
                                            <path d="M0 0h16v16H0z"/>
                                        </g>
                                    </svg>
                                    <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                                        <g fill="none" fill-rule="evenodd">
                                            <path fill="#4B5563" d="M13 2a1 1 0 0 1 .8 1.6l-3.574 4.133a1 1 0 0 0-.143.267h-4.12a1 1 0 0 0-.144-.267L2.2 3.6A1 1 0 0 1 3 2h10z"/>
                                            <path fill="#4B5563" d="M10.026 10v4.156a1 1 0 0 1-1.287.958l-2.007-.9a1 1 0 0 1-.713-.958V10h4.007z" opacity=".4"/>
                                            <path d="M0 0h16v16H0z"/>
                                        </g>
                                    </svg>
                                </el-button>
                            </el-tooltip>
                        </template>
                    </div>
                </section>
                <!-- search / filter-status and operation-btns -->
                <section
                    v-if="searchSlotDisplay || filterStatusDisplay || __hasBtn"
                    :style="{
                        marginLeft: __pagePadding,
                        marginRight: __pagePadding,
                    }"
                    :class="{
                        'page-main-layout-column': (filterStatusDisplay || !__hasBtn) && !isNest,
                        'page-main-layout-start': (!filterStatusDisplay && __hasBtn && __pageConfig.operationBtnsLayout === 'inline') && !isNest,
                        'page-main-layout-end': !$slots.search && (!filterStatusDisplay && __hasBtn) && !isNest
                    }"
                >
                    <!-- search -->
                    <div
                        v-if="searchSlotDisplay"
                        class="page-main-search"
                        :class="{'page-main-search-fold' : !isUnfoldFilter}"
                    >
                        <div class="page-main-search-div">
                            <slot name="search"></slot>
                        </div>
                    </div>
                    <!-- filter-status and operation-btns -->
                    <div class="page-main-operation"
                        v-if="filterStatusDisplay || __hasBtn"
                        :class="{
                            'right': (!$slots.search || __pageConfig.operationBtnsLayout !== 'inline') && !filterStatusDisplay
                        }"
                    >
                        <div class="page-main-operation-status" v-if="filterStatusDisplay">
                            <el-tabs
                                v-if="__hasFilterTab"
                                type="button"
                                :prop="__filterStatus.prop || 'status'"
                                v-model="filterStatusActiveName"
                                @tab-click="__handleFilterStatus"
                            >
                                <!-- :name，value为空时容错处理 -->
                                <el-tab-pane
                                    v-for="(item, idx) in __filterStatus.tabs || []"
                                    :key="idx"
                                    :id="item.id"
                                    :label="item.label"
                                    :name="item.value !== '' ? item.value + '' : '__self'"
                                    :disabled="__isDisabledOrHidden(item.disabled)"
                                >
                                    <span slot="label">{{item.label}}<span style=" color: #6B7280;">{{(item.num ? ` (${item.num})` : '')}}</span></span>
                                </el-tab-pane>
                            </el-tabs>
                            <slot name="filterStatus"></slot>
                        </div>
                        <div v-if="__hasBtn" class="page-main-operation-btns" :class="[
                            { 'show-more': showBtnsNum > 3 && isBtnsAnimated },
                            { 'hide-more': showBtnsNum <= 3 && isBtnsAnimated }
                        ]">
                            <template v-for="(item, idx) in __operationBtns.slice(0, 3)">
                                <el-tooltip
                                    :key="item.key || idx"
                                    :disabled="__isDisabledOrHidden(item.disabled) ? false : true"
                                    :content="item.tooltip || '请至少选择一条数据'"
                                    placement="top"
                                    :enterable="false"
                                >
                                    <div v-if="item.type === 'Render'" :style="item.style">
                                        <render :render="item.render" :item="item" :btns="__operationBtns"/>
                                    </div>
                                    <template v-else>
                                        <el-button
                                            :key="item.key || idx"
                                            :id="item.id"
                                            :icon="item.icon ? item.icon : ''"
                                            :type="item.type || (idx === 0 ? 'primary' : '')"
                                            :plain="idx !== 0"
                                            :class="{'is-disabled': __isDisabledOrHidden(item.disabled)}"
                                            :style="item.style"
                                            :loading="item.loading && item.loading()"
                                            @click.stop.prevent="e => __handleButtonClick(e, item)"
                                        >{{item.text}}</el-button>
                                    </template>
                                </el-tooltip>
                            </template>
                            <template v-if="showBtnsNum > 3">
                                <template v-for="(item, idx) in __operationBtns.slice(3, 5)">
                                    <el-tooltip
                                        :key="item.key || idx"
                                        :disabled="__isDisabledOrHidden(item.disabled) ? false : true"
                                        :content="item.tooltip || '请至少选择一条数据'"
                                        placement="top"
                                        :enterable="false"
                                    >
                                        <div v-if="item.type === 'Render'" :style="item.style">
                                            <render :render="item.render" :item="item" :btns="__operationBtns"/>
                                        </div>
                                        <template v-else>
                                            <el-button
                                                :key="item.key || 'more-oper-btn-' + idx"
                                                :id="item.id"
                                                :icon="item.icon ? item.icon : ''"
                                                :type="item.type"
                                                plain
                                                :class="{'is-disabled': __isDisabledOrHidden(item.disabled)}"
                                                :style="item.style"
                                                :loading="item.loading && item.loading()"
                                                @click.stop.prevent="e => __handleButtonClick(e, item)"
                                            >{{item.text}}</el-button>
                                        </template>
                                    </el-tooltip>
                                </template>
                            </template>
                            <el-dropdown ref="moreBtns" trigger="click" v-if="__moreOperationBtns.length">
                                <el-button class="more-btns" icon="md-icon-more-16"></el-button>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item
                                        v-for="(item, idx) in __moreOperationBtns"
                                        :key="item.key || idx"
                                        :divided="item.divided && __moreOperationBtns.length > 1"
                                        class="page-list__dropdown"
                                    >
                                        <template v-if="item.type === 'Render'">
                                            <render :style="item.style" :render="item.render" :item="item" :btns="__moreOperationBtns"/>
                                        </template>
                                        <template v-else>
                                            <el-button
                                                :id="item.id"
                                                type="text"
                                                :icon="item.icon ? item.icon : ''"
                                                :class="[__isDisabledOrHidden(item.disabled) ? 'is-disabled': '']"
                                                :style="item.style"
                                                @click="item.click && !__isDisabledOrHidden(item.disabled) && item.click(item)"
                                            >{{item.text}}</el-button>
                                        </template>
                                    </el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </div>
                    </div>
                </section>
                <!-- table -->
                <section
                    v-if="$slots.table"
                    :style="{
                        marginLeft: __pagePadding,
                        marginRight: __pagePadding,
                    }"
                    class="page-main-table"
                >
                    <slot name="table"></slot>
                </section>
                <!-- 默认插槽 -->
                <slot></slot>
            </main>
        </template>
    </el-skeleton>
</template>
<script>
import { LocalStorage } from '@master_vantop/nextop-core';
import { isEmpty, isObject, isBoolean, isFunction, debounce, } from '@master_vantop/vantop-util';
import { Base64, } from 'js-base64';

export default {
    name: 'MdPageList',
    components: {
        render: {
            props: {
                render: '',
                item: '',
                btns: '',
            },
            render(h) {
                const params = this.item;
                const parent = this.btns;
                return this.render(h, parent, params );
            },
        },
    },
    props: {
        // 页面配置 所有参数
        pageConfig: {
            type: Object,
            default: () => ({
                // skeleton: false, // 骨架屏
                // asideWidth: 240, // 侧边栏 宽度
                // padding: 20, // 页面 padding
                // pageTitle: '', // 页面标题
                // pageHandbook: '', // 页面 操作手册
                // pageHelp: () => {}, // 页面跳转帮助中心
                // pageRefresh: () => {}, // 页面 刷新
                // pageTab: {
                //     prop: '',
                //     tabs: [
                //         {
                //             label: '',
                //             value: 1,
                //             disabled: true,
                //             hidden: false, // tab权限
                //         }
                //     ],
                //     tabClick: Function.prototype,
                // },
                // pageUpdateTime: '',
                // filterStatus: {
                //     prop: '',
                //     tabs: [
                //         {
                //             label: '',
                //             value: 1,
                //             disabled: () => false,
                //             hidden: () => false, // 状态权限
                //         }
                //     ],
                //     tabClick: Function.prototype,
                // },
                // operationBtnsLayout: 'block', // inline 表示一行
                // operationBtns: [
                //     {
                //         type: 'Render', // JSX
                //         divided: true, // 分割线
                //         render: () => (
                //             <span>-</span>
                //         ),
                //     },
                //     {
                //         icon: 'el-icon-close',
                //         text: '作废',
                //         key: 'discard',
                //         disabled: () => false,
                //         loading: () => this.loading,
                //         hidden: () => false, // 按钮权限控制
                //         tooltip: '请至少选择一条数据',
                //         click: item => this.handle(item),
                //     },
                // ]
            }),
        }
    },
    data(){
        return {
            pageListId: '__page-list-' + Date.now() + Math.floor(Math.random() * 1000), // 组件唯一 id
            pageListDOM: null, // 页面模版 DOM

            asideStatus: true, // 侧边栏 状态，默认 展开
            disabledTips: false, // 是否隐藏 侧边栏/过滤按钮 tooltip
            isUnfoldFilter: true, // 是否展开 搜索栏

            pageTabActiveName: '', // pageTab 当前激活
            filterStatusActiveName: '', // 页面 filterStatus 当前激活
            showBtnsNum: 3, // 页面 操作 按钮 显示个数，默认显示 3 个
            isBtnsAnimated: false, // 是否启动 按钮动画，默认不开启，屏幕宽度改变时才开启

            searchSlotDisplay: true, // 搜索 slot插槽内容 是否显示
            filterStatusDisplay: true, // filterStatus 是否显示
            isNest: false, // 组件是否 嵌套使用
            isNestSearch: false, // 嵌套使用 search slot 并且slot插槽内容显示时，父级组件 过滤按钮 是否显示
            componentInstance: null, // 嵌套使用时，当前渲染的子组件实例
            pageHandbook: null,
        };
    },
    computed: {
        __pageUpdateTime() {
            return this.__pageConfig?.pageUpdateTime;
        },
        __pageAsideWidth() {
            return (parseInt(this.__pageConfig.asideWidth || 0) || 240) + 'px';
        },
        __pagePadding() {
            return parseInt(this.__pageConfig.padding || 0) + 'px';
        },
        __hasTitleOrTab() {
            return this.__pageTitle || this.__hasTab;
        },
        __hasTitleOrTabs() {
            return this.__pageTitle || this.__hasTabs;
        },
        __hasTab() {
            const { __pageTab: { tabs: pageTabs } } = this;
            return Array.isArray(pageTabs) && pageTabs.length;
        },
        __hasTabs() {
            return this.__hasTab > 1;
        },
        __hasFilterTab() {
            const { __filterStatus: { tabs: filterTabs } } = this;
            return Array.isArray(filterTabs) && filterTabs.length;
        },
        __hasBtn() {
            const { __operationBtns } = this;
            return Array.isArray(__operationBtns) && __operationBtns.length;
        },
        // 当前 页面配置
        __pageConfig({ pageConfig, }){
            return {
                skeleton: true, // 默认显示骨架屏
                asideWidth: 240, // 侧边栏 宽度
                padding: 16, // 页面 padding
                operationBtnsLayout: 'block', // 页面 操作按钮 布局
                ...pageConfig,
            };
        },
        // 是否 嵌套 显示 header 骨架屏
        __isNestShowHeader({ pageConfig: { skeleton, }, isNest, $children, }){
            let bool = skeleton;
            if (isNest){
                $children[0].$children.forEach(item => {
                    // 直接嵌套
                    const {
                        $vnode: { componentOptions: { tag, } = {}, } = {},
                        $children = [],
                        pageConfig = {},
                    } = item;
                    // 直接嵌套
                    if (tag === 'md-page-list'){
                        bool = pageConfig.skeleton;
                    }
                    // 间接嵌套（包含动态组件）
                    if ($children.length){
                        $children.forEach(({
                            $vnode: {
                                elm: { style: { display, } = {} } = {},
                                componentOptions: { tag, } = {},
                            } = {},
                            pageConfig = {},
                        }) => {
                            if (display !== 'none' && display !== undefined && tag === 'md-page-list'){
                                bool = pageConfig.skeleton;
                            }
                        });
                    }
                });
            }
            return bool;
        },
        // 当前 页面标题
        __pageTitle({ __pageConfig: { pageTitle, }, __pageTab = {} }){
            const { tabs = [], } = __pageTab;
            if (tabs.length === 1){
                return pageTitle ? `${pageTitle}-${tabs[0].label}` : tabs[0].label;
            }
            return pageTitle;
        },
        // 当前 页面Tab
        __pageTab({ __pageConfig: { pageTab = {}, }, }){
            const { tabs, ...rest } = pageTab;
            const pageTabs = isFunction(tabs) ? tabs() : Array.isArray(tabs) ? tabs : [];
            const authTabs = pageTabs.filter(it => !this.__isDisabledOrHidden(it.hidden));
            return authTabs.length ? {
                tabs: authTabs,
                ...rest,
            } : {};
        },
        // 当前 页面filterStatus
        __filterStatus({ __pageConfig: { filterStatus = {}, }, }){
            const { tabs, ...rest } = filterStatus;
            const filterTabs = isFunction(tabs) ? tabs() : Array.isArray(tabs) ? tabs : [];
            const authTabs = filterTabs.filter(it => !this.__isDisabledOrHidden(it.hidden));
            return authTabs.length ? {
                tabs: authTabs,
                ...rest,
            } : {};
        },
        // operationBtns 前 3或者5 个
        __operationBtns({ pageConfig: { operationBtns = [], }, showBtnsNum, }){
            const authBtns = operationBtns.filter(it => !this.__isDisabledOrHidden(it.hidden));
            if (authBtns.length > showBtnsNum){
                return authBtns.slice(0, showBtnsNum);
            }
            return authBtns;
        },
        // 更多 操作 按钮
        __moreOperationBtns({ pageConfig: { operationBtns = [], }, showBtnsNum, }){
            const authBtns = operationBtns.filter(it => !this.__isDisabledOrHidden(it.hidden));
            if (authBtns.length > showBtnsNum){
                return authBtns.slice(showBtnsNum);
            }
            return [];
        },
    },
    created() {
        this.debounceCalcPageMainWidth = debounce(this.__calcPageMainWidth, 150);
    },
    mounted() {
        // 获取 search 插槽内容 显示/隐藏 状态
        this.searchSlotDisplay = this.__checkSearchSlotDisplay(this.$slots.search);
        // 获取 filterStatus 显示/隐藏 状态
        this.filterStatusDisplay = this.__checkFilterStatusDisplay();

        this.pageHandbook = this.__pageConfig.pageHandbook;
        // 判断是否 嵌套使用
        if (this.$slots.default){
            this.__findNestComponent(this.$slots.default, () => {
                // 组件 有嵌套使用
                this.isNest = true;
                // 初始化 显示 当前渲染的子组件 的 操作手册
                this.pageHandbook = this.componentInstance?.$parent?.pageConfig?.pageHandbook;
            });
        }

        const { pageTab, filterStatus, displayBtnsNum, } = this.__pageConfig;
        // pageTab 默认选中
        isObject(pageTab) && this.__handleDefaultActive(pageTab, 'tab', 'pageTabActiveName');
        // filterStatus 默认选中
        isObject(filterStatus) && this.__handleDefaultActive(filterStatus, 'query', 'filterStatusActiveName');

        // 初始化 显示按钮个数
        this.pageListDOM = document.getElementById(this.pageListId);
        let pageMain = this.pageListDOM?.querySelector('.page-main');
        if (pageMain?.clientWidth >= 1400){
            this.showBtnsNum = 5;
        } else if (pageMain?.clientWidth > 1200 && pageMain?.clientWidth < 1400){
            this.showBtnsNum = displayBtnsNum || 5;
        } else {
            this.showBtnsNum = displayBtnsNum || 3;
        }
        pageMain = null;

        // 监听 窗口尺寸 变化
        window.addEventListener('resize', this.debounceCalcPageMainWidth);

        // 搜索栏 显示/隐藏 状态回显
        let pageListFilterStatus = JSON.parse(sessionStorage.getItem('PAGE_LIST_FILTER_STATUS') || '{}');
        const currentFilterStatus = pageListFilterStatus['PAGE_' + window.location.pathname];
        this.isUnfoldFilter = isBoolean(currentFilterStatus) ? currentFilterStatus : true;
    },
    beforeDestroy() {
        this.pageListDOM = null;
        this.componentInstance = null;
        window.removeEventListener('resize', this.debounceCalcPageMainWidth);
    },
    methods: {
        // 处理 pageTab、filterStatus 默认赋值
        __handleDefaultActive({ prop }, type, activeName){
            const { tabs = [], } = type === 'tab' ? this.__pageTab : this.__filterStatus;
            if (!tabs.length) { return; }
            const value = prop && this.$parent && this.$parent[type] && this.$parent[type][prop];
            if (!isEmpty(value)){
                const active = tabs.find(it => String(it.value) === String(value));
                this[activeName] = (active?.value || tabs[0]?.value) + '';
            } else {
                this[activeName] = tabs[0]?.value + (type === 'query' ? '__self' : '');
            }
        },
        // 判断 按钮状态 是否可点击，按钮权限 显示｜隐藏
        __isDisabledOrHidden(disabled){
            if (isEmpty(disabled)) return false;
            return isBoolean(disabled) ? disabled :
                isFunction(disabled) ? disabled() : false;
        },
        // 计算 .page-main DOM 宽度，根据宽度，显示不同数量按钮
        __calcPageMainWidth(){
            let pageMain = this.pageListDOM?.querySelector('.page-main');
            let pageMainWidth = pageMain?.clientWidth;
            if (pageMainWidth >= 1400){
                if (this.showBtnsNum <= 3 && this.__pageConfig?.operationBtns?.length > 3) {
                    // 开启 按钮动画
                    this.isBtnsAnimated = true;
                    this.showBtnsNum = 5;
                }
            } else if (pageMainWidth > 1200 && pageMainWidth < 1400){
                if (this.showBtnsNum <= 3 && this.__pageConfig?.operationBtns?.length > 3) {
                    // 开启 按钮动画
                    this.isBtnsAnimated = true;
                    this.showBtnsNum = this.__pageConfig.displayBtnsNum || 5;
                }
            } else {
                if (this.showBtnsNum === 5) {
                    // 开启 按钮动画
                    this.isBtnsAnimated = true;
                    this.showBtnsNum = this.__pageConfig.displayBtnsNum || 3;
                }
            }
            pageMain = null;
        },
        // 检测 search 插槽内容 是否显示
        __checkSearchSlotDisplay(searchSlot = []){
            if (!searchSlot.length) return false;
            const { data: { staticStyle: { display, } = {}, directives = [], } = {}, } = searchSlot[0] || {};
            const { rawName, value, } = directives[0] || {};
            if (display === 'none' || ( rawName === 'v-show' && !value )){
                return false;
            }
            return true;
        },
        // 检测 filterStatus 内容 是否显示
        __checkFilterStatusDisplay(){
            if (!this.__hasFilterTab && !this.$slots.filterStatus){
                return false;
            }
            return true;
        },
        // 显示 ｜ 隐藏 aside
        __togglerAside(){
            let pageAside = this.pageListDOM.querySelector('.page-aside-content');
            if (pageAside.clientWidth){
                pageAside.style.width = 0;
            } else {
                pageAside.style.width = this.__pageAsideWidth;
            }

            this.disabledTips = true;
            setTimeout(() => {
                this.asideStatus = !this.asideStatus;
                this.disabledTips = false;
                this.__calcPageMainWidth();
            }, 300);

            pageAside = null;
        },
        // 搜索栏 显示/隐藏
        __toggleFilter(){
            // 嵌套使用 搜索
            if (this.isNestSearch){
                this.componentInstance.isUnfoldFilter = !this.componentInstance?.isUnfoldFilter;
            } else {
                this.isUnfoldFilter = !this.isUnfoldFilter;
            }

            this.disabledTips = true;
            setTimeout(() => {
                this.disabledTips = false;
            }, 300);

            // 搜索栏 显示/隐藏 状态记录到sessionStorage
            let pageListFilterStatus = JSON.parse(sessionStorage.getItem('PAGE_LIST_FILTER_STATUS') || '{}');
            pageListFilterStatus['PAGE_' + window.location.pathname] = this.isUnfoldFilter;
            sessionStorage.setItem('PAGE_LIST_FILTER_STATUS', JSON.stringify(pageListFilterStatus));
        },
        // 切换 page tab
        async __handleTabClick(tab, event){
            // 关闭 按钮动画
            this.isBtnsAnimated = false;
            // 点击 当前激活 tab，阻止 click 事件
            const { name, } = tab;

            const { pageTab: { prop, tabClick }, } = this.__pageConfig;

            // 修改URL的HASH
            if (this.$parent.$options.enableHash !== false) {
                location.hash = `#tab=${Base64.encodeURI(JSON.stringify({ [prop || 'pageTab']: name }))}`;
            }

            if (prop && String(this.$parent?.tab[prop]) === String(name)) return;

            tabClick && tabClick(tab, event);

            await this.$nextTick();

            // 处理 嵌套使用
            if (this.isNest){
                this.__findNestComponent(this.$slots.default, () => {
                    // 嵌套使用，切换tab时，更新 当前渲染的子组件 的 操作手册
                    this.pageHandbook = this.componentInstance?.$parent?.pageConfig?.pageHandbook;
                    // 直接清除 显示/隐藏 状态
                    this.isUnfoldFilter = true;
                    let pageListFilterStatus = JSON.parse(sessionStorage.getItem('PAGE_LIST_FILTER_STATUS') || '{}');
                    pageListFilterStatus['PAGE_' + window.location.pathname] = this.isUnfoldFilter;
                    sessionStorage.setItem('PAGE_LIST_FILTER_STATUS', JSON.stringify(pageListFilterStatus));
                });
            }
        },
        // 嵌套使用，遍历查找 当前渲染的 子组件
        __findNestComponent(slots = [], callback){
            slots.forEach(item => {
                const {
                    elm: { style: { display, } = {} } = {},
                    componentOptions: { tag, } = {},
                    componentInstance = {},
                } = item;

                const { $children = [], } = componentInstance;

                if (display !== 'none' && display !== undefined) {
                    // 直接嵌套
                    if (tag === 'md-page-list'){
                        // 判断 过滤按钮 状态，以及 重置 搜索栏 状态
                        this.__judgeSearchFilterBtn(componentInstance);

                        // 暂存 当前渲染的子组件 的实例
                        this.componentInstance = componentInstance;
                        callback && callback();
                    }
                    // 间接嵌套（包含动态组件）
                    else if (($children[0] && $children[0].$vnode.componentOptions.tag === 'md-page-list')){
                        const { $vnode: { componentInstance = {}, } = {}, } = $children[0];
                        // 判断 过滤按钮 状态，以及 重置 搜索栏 状态
                        this.__judgeSearchFilterBtn(componentInstance);

                        // 暂存 当前渲染的子组件 的实例
                        this.componentInstance = componentInstance;
                        callback && callback();
                    }
                }
            });
        },
        // 嵌套使用，判断 过滤按钮 状态，以及 重置 搜索栏 状态
        __judgeSearchFilterBtn(componentInstance){
            const {
                $slots: { search = [], },
                pageConfig: { operationBtns = [], operationBtnsLayout = 'block' } = {},
            } = componentInstance;
            const searchSlot = search[0] ? this.__checkSearchSlotDisplay(search) : false;

            // 是否 显示 过滤按钮
            const authBtns = operationBtns.filter(it => !this.__isDisabledOrHidden(it.hidden));
            this.isNestSearch = searchSlot && (!authBtns.length || (authBtns.length && operationBtnsLayout !== 'inline'));

            // 直接显示 搜索栏
            componentInstance.isUnfoldFilter = true;
            // 重置 关闭 按钮动画
            componentInstance.isBtnsAnimated = false;
        },
        // 切换 status
        __handleFilterStatus(tab, event){
            // 点击 当前激活 tab，阻止 click 事件
            let { name, ...rest } = tab;
            name = name === '__self' ? '' : name;

            const { filterStatus: { prop, tabClick }, } = this.__pageConfig;
            if (prop && String(this.$parent?.query[prop]) === String(name)) return;

            // 调用 父级 toQuery 查询方法
            if (prop && isFunction(this?.$parent?.toQuery)){
                this.$parent.toQuery({
                    [prop]: name,
                    current: 1,
                });
            }
            // 调用 父级 setUrlParams 方法
            if (isFunction(this?.$parent?.setUrlParams)){
                const urlParams = [];
                urlParams.push({
                    type: 'query',
                    prop: 'current',
                    value: 1,
                });

                if (prop) {
                    urlParams.push({
                        type: 'query',
                        prop,
                        value: name,
                    });
                }
                this.$parent.setUrlParams(urlParams);
            }
            tabClick && tabClick({
                name,
                ...rest
            }, event);
        },
        // 按钮点击事件后，主动失焦
        __handleButtonClick(e, item){
            item.click && !this.__isDisabledOrHidden(item.disabled) && item.click(item);
            e.currentTarget.blur();
        },
        // 跳转 帮助中心
        __handleJumpHelpCenter() {
            if (isFunction(this.__pageConfig?.pageHelp)) {
                return this.__pageConfig?.pageHelp();
            }
            const { pathname } = location;
            if (pathname) {
                const { urls: leafMenuUrls, menus: leafMenus } = LocalStorage.getFlatLastMenuUrl();
                const leafIdx = leafMenuUrls.indexOf(pathname);
                if (leafIdx > -1) {
                    const { manualId } = leafMenus[leafIdx] || {};
                    if (+manualId) {
                        return window.open(`${location.origin}/help-center?menuId=${manualId}`);
                    }
                }
            }
            window.open(location.origin + '/help-center');
        },
        // 刷新 页面
        __handleRefresh() {
            if (isFunction(this.__pageConfig?.pageRefresh)) {
                this.__pageConfig.pageRefresh();
            }
            else if (isFunction(this?.$parent?.toQuery)) {
                this.$parent.toQuery();
            }
            // 如果嵌套使用
            else if (this.isNest && isFunction(this.componentInstance?.$parent?.toQuery)) {
                this.componentInstance?.$parent?.toQuery();
            }
        },
        // 对外暴露的 方法，修改 filterStatus 的默认选中
        updateFilterStatusDefault(){
            const { filterStatus, } = this.__pageConfig;
            isObject(filterStatus) && this.__handleDefaultActive(filterStatus, 'query', 'filterStatusActiveName');
        },
        // 对外暴露的 方法，修改 filterStatus.tabs 数组里目标对象的 num
        updateFilterStatusNum(index, value){
            const { filterStatus: { tabs, } } = this.__pageConfig;
            const filterTabs = isFunction(tabs) ? tabs() : Array.isArray(tabs) ? tabs : [];
            let target = filterTabs.find((it, idx) => idx === index);
            target.num = value;
        },
        checkInMoreBtn(target) {
            return new Promise((resolve) => {
                if (!target) {
                    return resolve();
                }

                let moreBtnsDom = this.$refs['moreBtns'];

                if (!moreBtnsDom) {
                    return resolve();
                }

                if (moreBtnsDom.$el.querySelector(target)) {
                    this.$refs['moreBtns']?.show();
                    moreBtnsDom = null;
                    return setTimeout(resolve, 250);
                }

                return resolve();
            });
        }
    },
};
</script>
