<!--
 * @Author: lingyong.zeng
 * @Date: 2021-10-28 09:37:30
 * @LastEditors: 蔡远程
 * @LastEditTime: 2022-05-18 15:28:55
 * @Description:
 * @FilePath: /vantop-ui/packages/detail-frame/src/detailFrame.vue
-->
<template>
    <div
        ref="__detail-wrapper"
        :class="[
            '__detail-wrapper',
            {'__bottom-set': hasBottomSet},
            pageConfig.type === 'view' ? 'view' : 'entry'
        ]"
        v-loading="pageConfig.loading"
    >
        <!-- 查看模式顶部导航动画层 -->
        <div
            v-if="pageConfig.type === 'view'"
            :style="{
                ...style,
                'top': top + 'px',
            }"
            class="__detail-nav-header-animation"
        >
            <el-page-header
                :content="pageConfig.tag"
                @back="jumbBack"
            />
            <div class="__detail-nav-header-animation-right">
                <jsx-render
                    :render="pageConfig.headRight"
                />
                <operation-btns
                    :operations="topOperation"
                    type="info"
                />
            </div>
        </div>
        <!-- 顶部导航 -->
        <div
            ref="detailNavHeader"
            :class="[
                '__detail-nav-header',
                { '__top-fixed': pageConfig.type !== 'view'},
                pageConfig.type,
            ]"
            :style="pageConfig.type === 'view' && { maxWidth: maxWidth }"
        >
            <el-page-header
                :content="pageConfig.tag"
                @back="jumbBack"
            />
            <jsx-render
                :render="pageConfig.headRight"
            />
        </div>
        <!-- 内容区域 -->
        <div class="__detail-content-wrapper">
            <div
                class="__detail-content"
                :style="{ maxWidth: maxWidth }"
            >
                <!-- 查看模式顶部操作栏(标题/按钮) -->
                <div v-if="hasTopSet"
                    :class="[
                        '__top-toolbar',
                        { '__top-toobar-hastab': pageConfig.hasTab }
                    ]"
                >
                    <div class="__top-title">
                        <jsx-render :render="pageConfig.head"/>
                    </div>
                    <operation-btns
                        class="__top-btns"
                        :operations="topOperation"
                    ></operation-btns>
                </div>
                <!-- 插槽内容 -->
                <slot></slot>
            </div>
        </div>
        <md-anchors
            v-if="!isEmpty(pageConfig.modules)"
            :anchor-list="pageConfig.modules"
        />
        <!-- 编辑模式底部操作栏 -->
        <md-sticky
            v-if="hasBottomSet"
            class="__detail-bottom-operation"
            :hasConfirm="false"
            :hasCancel="false"
        >
            <el-button
                v-for="btn in computedOperations"
                size="small"
                :key="btn.key"
                :loading="btn.loading && btn.loading()"
                :disabled="btn.disabled && btn.disabled()"
                :type="btn.type"
                @click="btn.click"
            >
                {{ btn.text }}
            </el-button>
        </md-sticky>
    </div>
</template>

<script>
import { isFunction, isEmpty, isBoolean } from '@master_vantop/vantop-util';
import JsxRender from './jsxRender';
import OperationBtns from './operation-btns.vue';

const MODIFY_TYPES = ['add', 'edit', 'copy'];

const MAX_WIDTH = new Map([
    [3, 1560],  // 三列宽度
    [2, 1280]    // 两列宽度
]);

export default {
    name: 'MdDetailFrame',
    components: {
        JsxRender,
        OperationBtns
    },
    props: {
        pageConfig: {
            type: Object,
            default: () => ({})
        },
    },
    data() {
        return {
            observeHeader: null,
            watchScroll: null,
            sideBarWidth: 0,
            top: 0,
        };
    },
    computed: {
        style() {
            return {
                left: '0px',
                width: this.sideBarWidth ? `calc(100% - ${this.sideBarWidth}px)` : null,
                transform: this.sideBarWidth ? `translate(${this.sideBarWidth}px)` : null
            };
        },
        computedOperations({ pageConfig: { operations } }) {
            if (isEmpty(operations)) {
                return [];
            }

            const result = operations.filter(
                ({ validator }) => !validator || (isFunction(validator) && validator())
            );
            return result;
        },
        jumbBack({ pageConfig: { back } }) {
            if (isFunction(back)) {
                return back;
            }
            return () => {
                //...
            };
        },
        hasTopSet({ pageConfig: { head, type, operationsLayout } } ) {
            return (
                operationsLayout === 'top'
                || type === 'view'
            ) && head;
        },
        hasBottomSet({ pageConfig: { type, operationsLayout }, computedOperations } ) {
            return (
                operationsLayout === 'bottom'
                || MODIFY_TYPES.includes(type)
            ) && computedOperations?.length;
        },
        maxWidth({ pageConfig: { col } }) {
            return (MAX_WIDTH.get(col) ?? MAX_WIDTH.get(3)) + 'px';
        },
        topOperation({ computedOperations, hasTopSet }) {
            let defaultShow = [], dropdownShow = [];
            if (hasTopSet && computedOperations.length) {
                // 拆分
                defaultShow = computedOperations.slice(0, 3);
                dropdownShow = computedOperations.slice(3);
            }
            return {
                defaultShow,
                dropdownShow
            };
        },
        topToolbarDOM({ hasTopSet }) {
            return hasTopSet ? this.$refs['topToolbar'] : null;
        }
    },
    mounted() {
        // 监听头部交互
        this.__observeNavHeader();

        // 同 md-sticky 监听左侧菜单
        const targetNode = document.querySelector('#sidebar--wrapper');
        if (targetNode) {
            this.sideBarWidth = targetNode.getAttribute('data-sidebar-width') || 0;
            // 观察器的配置（需要观察什么变动）
            const config = {
                attributes: true,
            };
            // 当观察到变动时执行的回调函数
            const callback = mutationsList => {
                // Use traditional 'for loops' for IE 11
                mutationsList.forEach(mutation => {
                    if (mutation.attributeName === 'data-sidebar-width' && mutation.type === 'attributes') {
                        const width = JSON.parse(mutation.target.getAttribute('data-sidebar-width'));
                        if (this.sideBarWidth !== width) this.sideBarWidth = width;
                    }
                });
            };
            // 创建一个观察器实例并传入回调函数
            this.observer = new MutationObserver(callback);
            // 以上述配置开始观察目标节点
            this.observer?.observe(targetNode, config);
        }

        // 针对详情页路由动态参数未匹配渲染组件的场景(统一跳转至dashboard)
        let childNodes = document.querySelector('.__detail-content').childNodes;
        if (childNodes.length === 1 && childNodes[0].nodeType === Node.COMMENT_NODE) {
            this.routerReplace('/dashboard');
        }
        childNodes = null;
    },
    beforeDestroy(){
        if (this.observeHeader) {
            this.observeHeader.disconnect();
            this.observeHeader = null;
        }
    },
    methods: {
        isEmpty,
        __isDisabledOrHidden(disabled){
            if (isEmpty(disabled)) return false;
            return isBoolean(disabled) ? disabled :
                isFunction(disabled) ? disabled() : false;
        },
        __observeNavHeader() {
            if (this.pageConfig.type !== 'view') {
                return;
            }

            this.observeHeader = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    // 在可视化区域内
                    this.top = 0;
                } else {
                    // 不在可视化区域内
                    this.top = 56;
                }
            }, {
                threshold: .2,
                // rootMargin: '0px 0px -32px 0px'
            });

            const dom = this.$refs['detailNavHeader'];
            this.observeHeader.observe(dom);
        }
    }
};
</script>
