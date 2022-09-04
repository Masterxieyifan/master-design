<!--
 * @Author: lingyong.zeng
 * @Date: 2021-07-28 11:30:27
 * @LastEditors: 蔡远程
 * @LastEditTime: 2021-08-26 14:28:41
 * @Description:
-->

<template>
    <div
        :id="value"
        class="vantop-head-title"
        :class="{'actived': isActived}"
        @click="activeHead"
    >
        <template v-if="$slots.default">
            <slot></slot>
        </template>
        <template v-else>
            <h4> {{ label }} </h4>
        </template>
    </div>
</template>

<script>
import emitter from 'element-ui/src/mixins/emitter';

export default {
    name: 'MdHeadTitle',
    mixins: [emitter],
    inject: ['global'],
    props: {
        value: String,  // ID
        label: String   // 标签文字
    },
    computed: {
        isActived() {
            return this?.global?.urlHashParams?.head?.active === this.value;
        }
    },
    mounted() {
        if (this.value && this.label) {
            this?.global?.addAnchors(this.value, this.label);
        }
    },
    beforeDestroy() {
        this?.global?.removeAnchors(this.value);
    },
    methods: {
        activeHead() {
            this?.global?.$refs?.anchors?.to(this.value, this.label);
        }
    },
};
</script>