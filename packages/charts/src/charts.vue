<!--
 * @Descripttion: 该组件主要由李朝政同学开发的。
 * @Author: 李朝政
 * @Date: 2022-03-21 16:35:41
 * @LastEditTime: 2022-06-28 14:14:24
 * @LastEditors: 蔡远程
-->
<template>
    <div class="md-charts">
        <div
            v-if="hasData"
            :ref="ref"
            :style="{ width, height }"
            class="chart"
        ></div>
        <div v-else :style="{ width, height }" class="empty-wrapper">
            <slot name="empty">
                <md-empty
                    title=""
                    description=""
                    :image="`${$options.staticBaseUrl}/saas/empty/empty-bi.svg`"
                    class="md-empty"
                />
            </slot>
        </div>
    </div>
</template>

<script>
import MdEmpty from '../../empty';
import echarts from './echarts';
import defaultOptions from './options';
import { staticBaseUrl, } from '@/util';

export default {
    name: 'MdCharts',
    components: {
        MdEmpty,
    },
    staticBaseUrl,
    props: {
        width: {
            type: String,
            default: '100%',
        },
        height: {
            type: String,
            default: '100%',
        },
        options: {
            type: Object,
            default: () => ({}),
        },
        id: {
            type: String,
            default: 'chart' + Date.now(),
        },
    },
    computed: {
        ref() {
            return this.id || 'chart' + Date.now();
        },
        // 判断 echarts 是否有数据
        hasData() {
            if (
                this.options &&
                this.options.series &&
                this.options.series[0] &&
                this.options.series[0].data &&
                this.options.series[0].data.length
            ) {
                return true;
            }
            this.destory();
            return false;
        },
        // 饼图的配置需要单独处理
        pie() {
            return this.options.series.some((v) => v.type === 'pie');
        },
    },
    watch: {
        options: {
            deep: true,
            handler() {
                this.init();
            },
        },
    },
    data() {
        return {
            chart: null,
            defaultOptions,
        };
    },
    mounted() {
        this.init();
    },
    methods: {
        init() {
            this.$nextTick(() => {
                if (!this.hasData) return;
                const chartRef = this.$refs[this.ref];
                if (!chartRef) return;
                const chartDom = echarts.getInstanceByDom(chartRef);
                if (!chartDom) {
                    this.chart = echarts.init(chartRef);
                }

                let options = null;
                options = {
                    ...this.defaultOptions,
                    ...this.options,
                };
                // 饼图的配置需要单独处理
                if (this.pie) {
                    options = this.options;
                }

                if (this.chart) {
                    this.chart.setOption(options, true);

                    // 初次渲染完成事件
                    this.chart.on('finished', () =>{
                        this.$emit('init', this.chart);
                        this.chart.off('finished');
                    });

                    this.chart.off('click');
                    this.chart.on('click', (params) => {
                        this.$emit('click', params);
                    });
                    this.resize();
                }
            });
        },
        resize() {
            this.observer = new ResizeObserver(() => {
                if (this.chart) this.chart.resize();
            });
            this.observer.observe(this.$el);
        },
        destory() {
            if (this.observer) {
                this.observer.disconnect();
                this.observer = null;
            }
            if (this.chart) {
                this.chart.off('click');
                this.chart.off('finished');
                this.chart.dispose();
                this.chart.clear();
                this.chart = null;
            }
        },
    },
    beforeDestroy() {
        this.destory();
    },
};
</script>
