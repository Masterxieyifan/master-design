<template>
    <div class="md-select-input-number">
        <el-select
            v-if="hasSelect"
            class="md-select-input-number__select"
            v-model="selectVal"
            :style="{'width': selectWidth}"
            @change="handleSelect">
            <el-option
                v-for="item in options"
                :value="item.value"
                :key="item.value"
                :label="item.label"
            />
        </el-select>
        <md-input-number
            :class="{
                'md-select-input-number__input': true,
                'has--select': hasSelect
            }"
            :isQuery="isQuery"
            ref="input-number"
            v-model="inputVal"
            v-bind="$attrs"
            @change="handleChange"
        />
    </div>
</template>

<script>
import emitter from 'element-ui/src/mixins/emitter';
import MdInputNumber from '../../input-number';
import { isEmpty } from '@master_vantop/vantop-util';

export default {
    name: 'SelectInputNumber',
    inheritAttrs: true,
    mixins: [emitter],
    model: {
        prop: 'value',
        event: 'input-bind'
    },
    components: {
        MdInputNumber
    },
    props: {
        prop: String,
        value: [Array, String, Number],
        options: {
            type: Array,
            default: () => []
        },
        selectWidth: {
            type: String,
            default: ''
        },
    },
    data() {
        return {
            inputVal: null,
            selectVal: null,
            isQuery: false,
            changing: null,
        };
    },
    computed: {
        hasSelect() {
            return !isEmpty(this.options);
        },
        isRange() {
            return this.$attrs.type === 'range';
        }
    },
    watch: {
        value: {
            handler: function(val) {
                if (this.changing) {
                    this.changing = false;
                    return;
                }
                const newVal = JSON.parse(JSON.stringify(val));
                if (this.hasSelect) {
                    this.selectVal = newVal?.[0] || null;
                    if (this.isRange) {
                        this.inputVal = [];
                        if (!isEmpty(newVal?.[1])) this.inputVal[0] = newVal[1];
                        if (!isEmpty(newVal?.[2])) this.inputVal[1] = newVal[2];
                    } else {
                        this.inputVal = newVal?.[1] || null;
                    }
                } else {
                    this.inputVal = newVal;
                }
            },
            immediate: true,
            deep: true
        }
    },
    methods: {
        handleSelect() {
            const newVal = [this.selectVal];
            const { inputVal } = this;

            this.$emit('input-bind', newVal);
            this.$emit('change', newVal);

            let hasChange = false;
            if (this.isRange) { // 范围
                hasChange = !isEmpty(inputVal) && (inputVal[0] || inputVal[1]);
            } else {            // 非范围
                hasChange = !isEmpty(inputVal);
            }

            if (hasChange) {
                // 数值框原来有值时在 Select 更新才出发搜索
                this.prop && this.dispatchOperate(this.prop, newVal);
            }
        },
        handleChange() {
            let newVal = [];
            const inputVal = this.inputVal;
            if (this.hasSelect) {
                newVal[0] = this.selectVal;
                if (this.isRange) {
                    newVal[1] = inputVal[0];
                    newVal[2] = inputVal[1];
                } else {
                    newVal[1] = inputVal;
                }
            } else {
                if (this.isRange) {
                    newVal[0] = inputVal[0];
                    newVal[1] = inputVal[1];
                } else {
                    newVal = inputVal;
                }
            }
            this.changing = true;
            this.$emit('input-bind', newVal);
            this.$emit('change', newVal);
            if (this.prop) this.dispatchOperate(this.prop, newVal);
        },
    }
};
</script>