<template>
    <div v-if="indexElement" class="md-index-element">
        <el-tooltip :disabled="!indexElementTooltip" placement="top" v-bind="$attrs">
            <div slot="content" v-html="indexElementTooltip"></div>
            <div class="element-body" :class="[{ down: up === false }]">
                <template v-if="hasUp">
                    <div class="triangle-percent-wrapper" :class="{ reverse }">
                        <div v-if="!['0', '0%', '-', '-%'].includes(String(indexElement)) || !zeroType " class="element-triangle"></div>
                        <div :class="[{ 'element-percent': true }, { 'element-percent-zero': ['0', '0%', '-', '-%'].includes(String(indexElement)) && zeroType }]">{{ indexElement }}</div>
                    </div>
                </template>
                <template v-else>
                    <div class="percent-pie">
                        <el-tooltip :disabled="!indexElementTooltip" placement="top">
                            <div slot="content" v-html="indexElementTooltip"></div>
                            <div v-if="indexElement" class="percent-body">
                                <img
                                    :src="`${$options.staticBaseUrl}/svg/bi-pie-16.svg`"
                                    alt=""
                                />
                                <span class="percent-percentage">{{ indexElement || '-' }}</span>
                            </div>
                        </el-tooltip>
                    </div>
                </template>
            </div>
        </el-tooltip>
    </div>
</template>

<script>
import { staticBaseUrl, } from '@/util';
export default {
    name: 'MdIndexElement',
    staticBaseUrl,
    props: {
        up: {},
        indexElementTooltip: {
            type: String,
            default: ''
        },
        // 是否翻转显示
        reverse: {
            type: Boolean,
            default: false
        },
        indexElement: {
            type: String,
            default: ''
        },
        zeroType: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        hasUp() {
            return [true, false, ''].includes(this.up);
        }
    },
};
</script>
