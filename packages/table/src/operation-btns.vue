<template>
    <div
        class="operations--wrapper dpf"
        v-if="validatorOperations.length"
    >
        <a
            v-for="({
                icon,
                text,
                key,
                disabled,
                handler,
                href,
            }) in singleOpeartions"
            :href="href"
            :key="key"
            class="operations--wrapper__a"
            @click="handleBtnClick(handler, href, disabled, row, column, ...rest)"
            onclick="return false"
        >
            <el-button
                class="is-iconed"
                type="info"
                size="small"
                v-hint="text"
                :icon="icon"
                :disabled="disabled"
                @click.native.meta.exact="handleHrefClick(href, 'open')"
            />
        </a>
        <el-dropdown
            v-if="moreOperations.length"
            class="more-operation--wrapper"
            trigger="click"
            @visible-change="handleOperationsVisible"
            @command="command => handleDropdownClick(command,row,column,...rest)"
        >
            <el-button
                type="info"
                size="small"
                v-hint="'更多'"
                icon="md-icon-more-16"
                class="more-operations--btns is-iconed"
                @click="e => e.stopPropagation()"
            />
            <el-dropdown-menu
                ref="operationDropDown"
                class="vantop-table--operations__dropdown-menu"
                slot="dropdown"
            >
                <el-dropdown-item
                    v-for="({
                        icon,
                        text,
                        key,
                        disabled,
                        href,
                        type
                    }) in moreOperations"
                    :type="type"
                    :icon="icon"
                    :key="key"
                    :command="key || text"
                    :disabled="disabled"
                >
                    <a
                        :href="href"
                        :key="key"
                        onclick="return false"
                        @click.meta.exact="handleHrefClick(href, 'open')"
                    >{{text}}</a>
                </el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
    </div>
</template>

<script>
import { isEmpty, } from '@master_vantop/vantop-util';
const MAX_OPERATION_NO = 2;
export default {
    name: 'OperationBtns',
    inject: ['$table'],
    props: {
        row: {
            type: Object,
            default: () => ({})
        },
        column: {
            type: Object,
            default: () => ({})
        },
        rest: {
            type: Object,
            default: () => ({})
        },
        operations: {
            type: Array,
            default: () => ([])
        },
    },
    computed: {
        // 过滤掉没有权限的操作
        validatorOperations({ row, operations }) {
            return operations.filter(({ validator }) => !validator || validator(row));
        },
        // 重新拼装操作按钮数据
        computedOperations({ row, validatorOperations }) {
            return validatorOperations.map(item=>{
                const disabled = item?.disableHandler?.(row) || false;
                const href =
                    typeof item.href === 'function'
                        ? item.href(row)
                        : (item.href || null);
                return {
                    ...item,
                    disabled: disabled,
                    href: (disabled || item.handler) ? null : href,
                };
            });
        },
        // 单个按钮的展示逻辑
        singleOpeartions({ computedOperations }) {
            return computedOperations.length > MAX_OPERATION_NO
                ? computedOperations.slice(0, MAX_OPERATION_NO - 1)
                : computedOperations;
        },
        // 更多按钮的展示逻辑
        moreOperations({ computedOperations }) {
            return computedOperations.length > MAX_OPERATION_NO
                ? computedOperations.slice(MAX_OPERATION_NO - 1)
                : [];
        },
    },
    methods: {
        handleBtnClick(handler, href, disabled, row, ...rest) {
            event.stopPropagation();
            if (disabled) return;
            if (handler) {
                handler(row, ...rest);
            } else if (href) {
                this.handleHrefClick(href);
            }
        },
        handleDropdownClick(command, row, ...rest) {
            const findOne = this.operations.find(item => item.key === command);
            const { handler, href } = findOne;
            // if handler is function then call it
            if (handler) {
                typeof handler === 'function' && handler(row, ...rest);
            } else if (href) {
                this.handleHrefClick(href);
            }
        },
        handleHrefClick(href, type='push') {
            if (isEmpty(href)) return;
            if (type === 'open') {
                window.open(href);
                event.stopPropagation();
                event.preventDefault();
                return;
            }
            // 兼容微前端路由跳转
            if (window.__IS_QIANKUN_ENV__) {
                window.history.pushState({}, null, href);
            } else {
                this.$router.push(href);
            }
        },
        handleOperationsVisible(visible, instance) {
            this.$table.operationInstance = visible ? instance : null;
        },
    }
};
</script>
