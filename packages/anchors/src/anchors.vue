<!--
 * @Author: lingyong.zeng
 * @Date: 2021-07-23 11:32:43
 * @LastEditors: lingyong.zeng
 * @LastEditTime: 2021-11-17 14:10:20
 * @Description:
-->
<template>
    <div class="anchors">
        <div
            v-for="{ id, label } in anchorList"
            @click="to(id)"
            :key="id"
            :class="['anchor-item', { isActive: isActive === id }]"
        >
            <div class="step">
                <div class="line"></div>
                <div class="circle"></div>
            </div>
            <span class="title">{{ label }}</span>
        </div>
    </div>
</template>
<script>
import emitter from 'element-ui/src/mixins/emitter';
import { debounce, } from '@master_vantop/vantop-util';

export default {
    name: 'MdAnchors',
    mixins: [emitter],
    props: {
        anchorList: {
            type: Array,
            required: true,
            default: () => { []; },
        },
        offsetTop: {
            type: Number,
            default: 0
        }
    },
    data() {
        return {
            isActive: '',
            isClick: false,
            scrollTop: 0,
            scroller: null,
        };
    },
    mounted() {
        this.isActive = this.anchorList.length && this.anchorList[0].id;
        window.addEventListener('scroll', this.scroll, true);
    },
    methods: {
        to(id) {
            this.isClick = true;
            document.getElementById(id).scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'nearest',
            });
            this.isActive = id;
            this.dispatchOperate('active', this.isActive);
        },
        findScroller(element) {
            const list = Array.from(element.children);
            if (this.scroller) {
                this.scrollTop = this.scroller.scrollTop;
                return;
            }
            for (let i = 0; i < list.length; i++) {
                const ele = list[i];
                if (ele.scrollTop) {
                    this.scrollTop = ele.scrollTop;
                    this.scroller = ele;
                    break;
                }
                this.findScroller(ele);
            }
        },
        scroll: debounce(function(){
            if (this.isClick) {
                this.isClick = false;
                return;
            }
            this.findScroller(document.body);
            const scrollTop = document.documentElement.scrollTop || document.body.scrollTop || window.pageYOffset || this.scrollTop;
            let isActive;
            for (let index = this.anchorList.length - 1; index >= 0; index--) {
                const ele = document.getElementById(this.anchorList[index].id);
                if (index === 0) {
                    const nextEle = this.anchorList[index + 1];
                    if (nextEle) {
                        if (scrollTop < document.getElementById(nextEle.id).offsetTop - 10 - this.offsetTop) {
                            isActive = ele.id;
                        }
                    } else {
                        isActive = ele.id;
                    }
                } else {
                    if (scrollTop >= ele.offsetTop - 10  - this.offsetTop) {
                        isActive = ele.id;
                        break;
                    }
                }
            }
            this.isActive = isActive;
        }, 300)
    },
    beforeDestroy() {
        window.removeEventListener('scroll', this.scroll, true);
    },
};
</script>