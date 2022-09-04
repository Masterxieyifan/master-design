<template>
    <span :class="classes">{{ date }}</span>
</template>
<script>
import { oneOf } from '../utils/assist';
import { formatDate, getTimeInterval, } from '@master_vantop/vantop-util';
const prefixCls = 'vantop-time';
export default {
    name: 'MdTime',
    props: {
        time: { //显示传入时间
            type: [Number, Date, String],
        },
        type: { //显示时间类型
            type: String,
            validator(value) {
                return oneOf(value, ['relative', 'date']);
            },
            default: 'relative'
        },
        interval: { //轮询显示间隔
            type: Number,
            default: 0
        },
        current: { //显示当前时间
            type: Boolean,
            default: false,
        },
        format: { //显示格式
            type: String,
            default: 'YYYY-MM-DD hh:mm:ss',
        },
        countdown: { //倒计时
            type: Boolean,
            default: false,
        }
    },
    data() {
        return {
            date: '',
            millisecond: '',
            timer: null,
        };
    },
    computed: {
        classes() {
            return [
                `${prefixCls}`
            ];
        }
    },
    mounted() {
        this.millisecond = this.current ? new Date() : this.transferTime();
        if (this.countdown) {
            this.countdownTime(this.millisecond);
            this.timer = setInterval(() => {
                this.countdownTime(this.millisecond);
            }, 1000 * this.interval);
        } else {
            this.setTime(this.millisecond);
            this.timer = setInterval(() => {
                if (this.current) this.millisecond =  new Date();
                this.setTime(this.millisecond);
            }, 1000 * this.interval);
        }
    },
    beforeDestroy() {
        if (this.timer) clearInterval(this.timer);
    },
    methods: {
        // 时间转换
        transferTime() {
            const type = typeof this.time;
            let time;
            switch (type) {
            case 'number': {
                const timestamp = this.time.toString().length > 10 ? this.time : this.time * 1000;
                time = (new Date(timestamp)).getTime();
                break;
            }
            case 'object':
                time = this.time.getTime();
                break;
            case 'string':
                time = (new Date(this.time)).getTime();
                break;
            }
            return time;
        },
        // 设置时间格式
        setTime(time) {
            this.date = this.type === 'relative' ? getTimeInterval(time) : formatDate(time, this.format);
        },
        // 倒计时
        countdownTime(time) {
            // 目标日期时间戳
            const end = time;
            // 当前时间戳
            const now = Date.parse(new Date());
            // 相差的毫秒数
            const msec = end - now;
            if (msec <= 0) {
                this.date = '0秒';
                clearInterval(this.timer);
                return;
            }
            // 计算时分秒数
            let day = parseInt(msec / 1000 / 60 / 60 / 24);
            let hr = parseInt(msec / 1000 / 60 / 60 % 24);
            let min = parseInt(msec / 1000 / 60 % 60);
            let sec = parseInt(msec / 1000 % 60);

            // // 个位数前补零 && 为0时处理
            day = day <= 0
                ? ''
                : `${day}天 `;

            hr = hr <= 0
                ? ''
                : hr > 9
                    ? `${hr}小时 `
                    : `0${hr}小时 `;

            min = min <= 0
                ? ''
                : min > 9
                    ? `${min}分钟 `
                    : `0${min}分钟 `;

            sec = sec <= 0
                ? ''
                : sec > 9
                    ? `${sec}秒 `
                    : `0${sec}秒 `;

            this.date = `${day}${hr}${min}${sec}`;
        },
    }
};
</script>