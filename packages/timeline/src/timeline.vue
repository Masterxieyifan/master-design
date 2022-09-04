<template>
    <div class="md-timeline">
        <div
            v-if="$scopedSlots.search"
            class="md-timeline--search"
        >
            <slot name="search"></slot>
        </div>
        <el-timeline
            :style="{
                maxHeight: maxHeight ? `${maxHeight}px`: null,
                overflow: maxHeight ? 'auto' : null
            }"
            v-if="logList.length > 0">
            <template v-for="(item, index) in logList">
                <el-timeline-item
                    :key="index"
                    :hide-timestamp="true"
                    placement="top"
                >
                    <!-- 头部 -->
                    <div class="md-timeline-header">
                        <span class="md-timeline-header-time">{{formatTime(item[timeProps])}}</span>
                        <span
                            v-if="item[operatorProps]"
                            class="md-timeline-developer-name"
                        >操作人：{{ item[operatorProps] }}</span>
                        <span
                            class="md-timeline-developer-phone"
                            v-if="item[phoneProps]"
                        >({{ item[phoneProps] }})</span>
                        <el-tag
                            v-if="item[statusProps]"
                            type="info"
                        >{{ item[statusProps] }}</el-tag>
                    </div>

                    <!-- 内容 -->
                    <div
                        class="md-timeline-item"
                        v-if="item[contentProps] || (item[attributeListProps] && item[attributeListProps].length)"
                    >
                        <div
                            class="md-timeline-item__heade"
                            v-if="item[contentProps]"
                        >
                            <span>{{ item[contentProps] }}</span>
                        </div>
                        <div>
                            <template v-if="item[attributeListProps] &&item[attributeListProps].length">
                                <input
                                    v-if="item[attributeListProps].length > 5"
                                    :id="`md-timeline-load-more-${index}`"
                                    class="md-timeline-item__load-check" type="checkbox"
                                />
                                <div class="md-timeline-item__content">
                                    <el-divider direction="vertical"></el-divider>
                                    <div class="flex-1">
                                        <div
                                            class="md-timeline-item__content__list"
                                            v-for="(changList, index) in item[attributeListProps].slice(0, 5)"
                                            :key="`list${index}`"
                                        >
                                            <el-tag>{{ changList[attributeNameProps] }}</el-tag>
                                            <div>
                                                <span class="md-timeline-item__content__old">{{ changList[attributeOldProps] }}</span>
                                                <span class="md-timeline-item__content__text">变更为</span>
                                                <span class="md-timeline-item__content__new">{{ changList[attributeNewProps] }}</span>
                                            </div>
                                        </div>
                                        <div
                                            class="md-timeline-item__content__list md-timeline-item__content__list__more"
                                            v-for="(changList, index) in item[attributeListProps].slice(5)"
                                            :key="`more${index}`"
                                        >
                                            <el-tag>{{ changList[attributeNameProps] }}</el-tag>
                                            <div>
                                                <span class="md-timeline-item__content__old">{{ changList[attributeOldProps] }}</span>
                                                <span class="md-timeline-item__content__text">变更为</span>
                                                <span class="md-timeline-item__content__new">{{ changList[attributeNewProps] }}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <label
                                    v-if="item[attributeListProps].length > 5"
                                    class="md-timeline-item__load-more"
                                    :for="`md-timeline-load-more-${index}`"
                                >
                                    <el-link
                                        type="primary"
                                        :underline="false"
                                    >展开更多</el-link>
                                </label>
                            </template>

                        </div>
                    </div>
                </el-timeline-item>

            </template>
            <!-- 更多按钮 -->
            <el-timeline-item
                v-if="logList.length < __total"
                class="md-timeline-load-more"
            >
                <el-button
                    type="text"
                    :loading="loading"
                    @click="loadMore">
                    展开更多
                </el-button>
            </el-timeline-item>
        </el-timeline>
        <md-empty
            v-else
            title=""
            description="暂无日志"
            :image="`${$options.staticBaseUrl}/saas/empty/empty-log.svg`"
        />
    </div>
</template>

<script>
import { formatDate, isBoolean } from '@master_vantop/vantop-util';
import { staticBaseUrl, } from '@/util';
export default {
    name: 'MdTimeline',
    staticBaseUrl,
    props: {
        maxHeight: Number,
        lazy: {
            type: Boolean,
            default: false,
        },
        data: {
            type: Array,
            default:()=>[],
        },
        total: {
            type: Number,
            default: 10
        },
        size: {
            type: Number,
            default: 5
        },
        timeStamp: {
            type: [String, Boolean],
            default: 'YYYY-MM-DD hh:mm:ss'
        },
        props: {
            type: Object,
            default: ()=>({})
        }
    },
    data() {
        return {
            showLoadMoreBtn: true,
            activities: [],
            parendIndex: this.size,
            logList: [],
            current: 1,
            loading: false,
        };
    },
    computed: {
        __total() {
            return this.lazy
                ? this.total
                : this.data.length;
        },
        formatTime() {
            return function(val) {
                return isBoolean(this.timeStamp)
                    ? this.timeStamp
                        ? formatDate(val, 'YYYY-MM-DD hh:mm:ss')
                        : val
                    : val
                        ? formatDate(val, this.timeStamp)
                        : '';
            };
        },
        statusProps() {
            return this.props.status || 'status';
        },
        timeProps() {
            return this.props.time || 'time';
        },
        operatorProps() {
            return this.props.operator || 'operator';
        },
        phoneProps() {
            return this.props.phone || 'phone';
        },
        contentProps() {
            return this.props.content || 'content';
        },
        attributeListProps() {
            return this.props.attributeList || 'attributeList';
        },
        attributeNameProps() {
            return this.props.attributeName || 'attributeName';
        },
        attributeOldProps() {
            return this.props.oldValue || 'oldValue';
        },
        attributeNewProps() {
            return this.props.newValue || 'newValue';
        }
    },
    watch: {
        data: {
            handler(val) {
                if (!this.lazy) {
                    this.current = 1;
                    this.logList = val.slice(0, this.size);
                } else {
                    this.logList = val;
                }
            },
            immediate: true
        }
    },
    methods: {
        loadMore() {
            if (this.lazy) {
                this.loading = true;
                this.$emit('load', ()=>{
                    this.loading = false;
                });
            } else {
                const startIndex = this.size * this.current;
                const endIndex = startIndex + this.size;
                const newLog = this.data.slice(startIndex, endIndex);
                this.logList.push(...newLog);
                this.current++;
            }
        }
    }
};
</script>
