<!--
 * @Author: lingyong.zeng
 * @Date: 2021-09-01 11:13:30
 * @LastEditors: lingyong.zeng
 * @LastEditTime: 2021-09-27 14:48:01
 * @Description: 仅限高级搜索使用，封装至 select-input, 对 v-model 格式做特殊处理
 * @FilePath: /vantop-ui/packages/advanced-search/src/select-input.vue
-->

<template>
    <md-select-input
        :class="{'is-query': isQuery}"
        select
        ref="select-input"
        v-bind="$attrs"
        @input="(val) => inputVal = val"
        @select="handleSelect"
        @empty="handleEmpty"
        @clear="handleEmpty"
        @change="handleVal"
    >
    </md-select-input>
</template>

<script>
import emitter from 'element-ui/src/mixins/emitter';
import MdSelectInput from '../../select-input';
import { isObjDeepEqual } from '@master_vantop/vantop-util';

export default {
    name: 'SelectInput',
    inheritAttrs: true,
    mixins: [emitter],
    components: {
        MdSelectInput
    },
    props: {
        prop: String,
        value: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            inputVal: '',
            selVal: '',
            isQuery: false,
        };
    },
    watch: {
        value: {
            handler(val) {
                let selectInput = this.$refs['select-input'];
                if (selectInput) {
                    this.syncSelectInput(selectInput, val);
                } else {
                    this.$nextTick(() => {
                        selectInput = this.$refs['select-input'];
                        this.syncSelectInput(selectInput, val);
                    });
                }
            },
            immediate: true,
            deep: true
        }
    },
    methods: {
        syncSelectInput(selectInput, val) {
            const [selVal, inputVal] = val;
            this.selVal = selVal;
            this.inputVal = inputVal;
            const {
                selectVal: oldSelVal,
                val: oldInputVal
            } = selectInput || {};

            if (selVal !== undefined && selVal !== oldSelVal) {
                selectInput.setSelectVal(selVal);
            }

            if (inputVal !== undefined && inputVal !== oldInputVal) {
                selectInput.setInputVal(inputVal);
            }
        },
        handleEmpty() {
            this.inputVal = '';
        },
        handleSelect(val) {
            this.selVal = val;
            const { inputVal = '' } = this;
            this.inputVal = '';
            const newVal = [this.selVal, ''];
            this.$emit('input', newVal);

            if (inputVal.toString().trim().length > 0) {
                // 文本框原来有值时在 Select 更新才出发搜索
                this.dispatchOperate(this.prop, newVal);
            }
        },
        handleVal() {
            const value = [this.selVal, this.inputVal];
            if (isObjDeepEqual(value, this.value)) return;
            this.$emit('input', value);
            this.dispatchOperate(this.prop, value);
        }
    }
};
</script>