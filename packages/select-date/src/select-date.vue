<template>
    <div class="md-select-date">
        <el-select
            class="md-select-date__select-item"
            v-model="selectValue"
            :style="{'width': selectWidth}"
            @change="handleSelect">
            <el-option
                v-for="item in options"
                :value="item.value"
                :key="item.value"
                :label="item.label"
            />
        </el-select>
        <el-date-picker
            class="md-select-date__date-item"
            :class="{'is-query': isQuery}"
            v-model="dateValue"
            :style="{'width': dateWidth}"
            v-bind="$attrs"
            v-on="_listeners"
            @change="handleChange"
        />
    </div>
</template>

<script>
import { isArray, isEmpty } from '@master_vantop/vantop-util';
import emitter from 'element-ui/src/mixins/emitter';
export default {
    name: 'MdSelectDate',
    mixins: [emitter],
    model: {
        prop: 'value',
        event: 'input-bind'
    },
    props: {
        prop: String,
        value: {
            type: Array,
            default: ()=>[]
        },
        selectWidth: {
            type: String,
            default: ''
        },
        dateWidth: {
            type: String,
            default: ''
        },
        options: {
            type: Array,
            default: ()=>[]
        },
        dateReset: {
            type: Boolean,
            default: true
        }
    },
    watch: {
        value: {
            immediate: true,
            handler: function(val) {
                if (this.changing) {
                    this.changing = false;
                    return;
                }
                const newVal = val;
                if (isArray(newVal)) {
                    const [selectValue = null, ...dateValue] = newVal;
                    this.selectValue = selectValue;
                    this.dateValue = dateValue.length >= 2
                        ? dateValue
                        : dateValue?.[0] || null;
                }
            },
        }
    },
    data() {
        return {
            selectValue: null,
            dateValue: null,
            changing: null,
            isQuery: false,
        };
    },
    computed: {
        _listeners() {
            // eslint-disable-next-line
            const { change: _change, ...rest } = this.$listeners;
            return rest;
        },
    },
    methods: {
        handleSelect() {
            const { dateValue, selectValue, dateReset } = this;
            const isArrayDate = isArray(dateValue);
            const newDateValue = dateReset || isEmpty(dateValue)
                ? []
                : isArrayDate
                    ? dateValue
                    : [dateValue];
            const newVal = [selectValue, ...newDateValue];

            this.$emit('input-bind', newVal);
            this.$emit('change', newVal);

            if ((isArrayDate && dateValue[0]) || dateValue) {
                // 日期框原来有值时在 Select 更新才出发搜索
                this.prop && this.dispatchOperate(this.prop, newVal);
            }
        },
        handleChange() {
            const { dateValue, selectValue } = this;
            const newDateValue = isArray(dateValue)
                ? dateValue
                : isEmpty(dateValue)
                    ? []
                    : [dateValue];
            let newVal = [selectValue, ...newDateValue];
            this.changing = true;
            this.$emit('input-bind', newVal);
            this.$emit('change', newVal);
            if (this.prop) this.dispatchOperate(this.prop, newVal);
        },
    },
};
</script>
