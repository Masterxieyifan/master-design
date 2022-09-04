<!--
 * @Author: lingyong.zeng
 * @Date: 2021-11-09 10:58:03
 * @LastEditors: lingyong.zeng
 * @LastEditTime: 2021-12-22 09:39:06
 * @Description:
 * @FilePath: /vantop-ui/packages/detail-frame/src/operation-btns.vue
-->
<template>
    <div>
        <!-- 默认展示(前三个) -->
        <template v-for="(btn, $index) in operations.defaultShow">
            <template v-if="__lower(btn.type) === 'render'">
                <jsx-render :key="btn.key || $index" :render="btn.render"></jsx-render>
            </template>
            <template v-else>
                <el-button
                    v-if="__btnValidator(btn.validator)"
                    :key="btn.key || $index"
                    :type="type ? type : btn.type"
                    :icon="btn.icon ? btn.icon : ''"
                    :loading="btn.loading && btn.loading()"
                    :disabled="btn.disabled && btn.disabled()"
                    @click.stop.prevent="btn.click"
                >{{ btn.text }}</el-button>
            </template>
        </template>
        <!-- 省略号弹窗显示 -->
        <el-dropdown
            v-if="operations.dropdownShow && operations.dropdownShow.length"
            trigger="click"
        >
            <el-button
                class="more-btns"
                icon="md-icon-more-16"
                :type="type ? type : 'default'"
            ></el-button>
            <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                    v-for="(btn, $index) in operations.dropdownShow"
                    :key="btn.key || $index"
                    class="__top-btns-dropdown"
                >
                    <template v-if="__lower(btn.type) === 'render'">
                        <jsx-render :render="btn.render"></jsx-render>
                    </template>
                    <template>
                        <el-button
                            v-if="__btnValidator(btn.validator)"
                            type="text"
                            :key="btn.key || $index"
                            :icon="btn.icon ? btn.icon : ''"
                            :loading="btn.loading && btn.loading()"
                            :disabled="btn.disabled && btn.disabled()"
                            @click.stop.prevent="btn.click"
                        >{{ btn.text }}</el-button>
                    </template>
                </el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
    </div>
</template>

<script>
import jsxRender from './jsxRender';
import { isString, isFunction } from '@master_vantop/vantop-util';

export default {
    components: {
        jsxRender
    },
    props: {
        operations: {   // 按钮源数据
            type: Object,
            default: () => ({})
        },
        type: {         // 强制按钮类型
            type: String,
            default: ''
        }
    },
    methods: {
        __lower(str) {
            if (isString(str)) {
                return str.toLocaleLowerCase();
            }
            return '';
        },
        __btnValidator(validator) {
            return (
                !validator || (
                    isFunction(validator) && validator()
                )
            );
        }
    }
};
</script>