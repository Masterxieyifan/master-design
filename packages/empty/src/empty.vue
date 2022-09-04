<!--
 * @Author: 陈建中
 * @Date: 2021-07-15 14:34:47
 * @LastEditTime: 2022-06-28 14:10:15
 * @LastEditors: 蔡远程
 * @Description: 空状态
-->
<template>
    <div class="vantop-empty--wrapper" :class="{'vantop-empty--inline': inline}">
        <div class="vantop-empty__image" :style="imageStyle">
            <img v-if="image" :src="image" ondragstart="return false">
            <slot v-else name="image"></slot>
        </div>
        <div class="vantop-empty__content">
            <div class="vantop-empty__title">
                <slot v-if="$slots.title" name="title"></slot>
                <p v-else>{{ title }}</p>
            </div>
            <div class="vantop-empty__description">
                <slot v-if="$slots.description" name="description"></slot>
                <p v-else>{{description}}</p>
            </div>
            <div class="vantop-empty__bottom" v-if="$slots.default">
                <slot></slot>
            </div>
        </div>
    </div>
</template>
<script>
import { staticBaseUrl, } from '@/util';
export default {
    name: 'MdEmpty',
    props: {
        image: {
            type: String,
            default: staticBaseUrl + '/saas/empty/empty-list.svg',
        },
        imageSize: {
            type: Number,
            default: 200,
        },
        title: {
            type: String,
            default: '',
        },
        description: {
            type: String,
            default: '暂无数据',
        },
        inline: Boolean,
    },
    computed: {
        imageStyle() {
            return {
                width: this.imageSize ? `${this.imageSize}px` : ''
            };
        }
    },
};
</script>