<!--
 * @Author: hongdong.liao
 * @Date: 2021-02-24 14:25:59
 * @LastEditors: lingyong.zeng
 * @LastEditTime: 2022-06-16 16:20:40
-->
<template>
    <span
        v-if="!url || imgError"
        class="img-previewer--empty"
        :class="`is--${size}`"
    >
        <i
            class="md-icon-preview-empty"
            referrerPolicy="no-referrer"
        />
    </span>
    <div
        v-else
        :class="['img-previewer--wrapper', `is--${size}`]"
        :data-url="url"
    >
        <img
            class="img-previewer--reference"
            v-lazy="url"
            @error="handleImgLoadError"
        />
    </div>
</template>

<script>
import Vue from 'vue';
import PreviewSingletonTpl from './PreviewSingletonTpl.vue';
import ImageViewerTpl from './ImageViewerSingletonTpl.vue';
import { debounce } from '@master_vantop/vantop-util';
import __SINGLETON__ from '@/util/singleton.js';

// 以下 _KEY 变量会集成进 window.__SINGLETON__ 全局变量
// MdPreview 使用计数，如果页面无 MdPreview 使用，则要移除单例监听事件
const COUNT_KEY = '__MD_PREVIEW_SINGLETON_COUNT__';
// MdPreview 单例使用判断开关
const PREVIEW_KEY = '__MD_PREVIEW_SINGLETON__';
// ImageViewer 单例使用判断开关
const IMAGE_VIEWER_KEY = '__MD_IMAGE_VIEWER_SINGLETON__';

function PreviewSingleton(propsData) {
    const Popover = Vue.extend(PreviewSingletonTpl);
    const popover = new Popover({
        propsData
    });
    popover.$mount();
    return popover;
}

function ImageViewerSingleton(propsData) {
    const ImageViewer = Vue.extend(ImageViewerTpl);
    const imageViewer = new ImageViewer({
        propsData
    });
    imageViewer.$mount();
    return imageViewer;
}

const debounceShowPreivew = debounce(function(e) {
    // 判断是否 reference 鼠标事件触发
    const reference = e.target.closest('.img-previewer--wrapper');

    if (!reference) {
        return;
    }

    const el = __SINGLETON__[PREVIEW_KEY];
    const { url } = reference.dataset;
    url && (el.url = url);

    el.showProp = false;
    el.reference = reference;

    // 因无this故使用Promise模拟$nextTick
    Promise.resolve().then(() => {
        el.showProp = true;
        Promise.resolve().then(() => {
            el.$refs.pop.doShow();
        });
    });
}, 400);

const showViewer = function(e) {
    // 判断是否 reference 鼠标事件触发
    const reference = e.target.closest('.img-previewer--wrapper');

    if (!reference) {
        return;
    }

    const el = __SINGLETON__[IMAGE_VIEWER_KEY];
    const { url } = reference.dataset;
    url && (el.url = url);

    el.showViewer();
};

export default {
    name: 'MdPreview',
    props: {
        url: {
            type: String,
            default: null,
        },
        size: {
            type: String,
            default: 'small',
        },
    },
    data() {
        return {
            imgError: null,
            showViewer: false,
        };
    },
    methods: {
        handleImgLoadError() {
            this.imgError = true;
        },
    },
    mounted() {
        __SINGLETON__[COUNT_KEY] = (__SINGLETON__[COUNT_KEY] || 0) + 1;
        if (!__SINGLETON__[PREVIEW_KEY]) {  // 单例监听事件绑定
            document.body.addEventListener('mouseover', debounceShowPreivew);
            document.body.addEventListener('click', showViewer);

            __SINGLETON__[IMAGE_VIEWER_KEY] = new ImageViewerSingleton({
                zIndex: 2000,
                initialIndex: 0,
            });

            __SINGLETON__[PREVIEW_KEY] = new PreviewSingleton({
                showProp: false,
                reference: {},
            });
        }
    },
    beforeDestroy() {
        --__SINGLETON__[COUNT_KEY];
        if (!__SINGLETON__[COUNT_KEY]) {
            __SINGLETON__[PREVIEW_KEY].$destroy();
            __SINGLETON__[IMAGE_VIEWER_KEY].$destroy();
            __SINGLETON__[IMAGE_VIEWER_KEY] = null;
            __SINGLETON__[PREVIEW_KEY] = null;
            document.body.removeEventListener('mouseover', debounceShowPreivew);
            document.body.removeEventListener('click', showViewer);
        }
    },
};
</script>