<template>
    <el-date-picker
        v-bind="$attrs"
        v-on="$listeners"
        :style="{
            width: width + 'px'
        }"
    />
</template>
<script>
import { isEmpty } from '@master_vantop/vantop-util';
const DATE_PICKER_WIDTH_CONFIG = {
    date: {
        normal: 240,
        empty: 240
    },
    datetime: {
        normal: 240,
        empty: 240
    },
    daterange: {
        normal: 280,
        empty: 240
    },
    datetimerange: {
        normal: 380,
        empty: 240,
    }
};
export default {
    name: 'DatePicker',
    computed: {
        width() {
            const { type, value, label } = this.$attrs;
            let width =  DATE_PICKER_WIDTH_CONFIG[type || 'date']?.[isEmpty(value) ? 'empty' : 'normal'] || 240;
            if (type === 'daterange' || type === 'datetimerange') {
                const labelDiff = (label?.length || 0) - 4;
                width += labelDiff > 0
                    ? labelDiff * 15
                    : 0;
            }
            return width;
        }
    }
};
</script>