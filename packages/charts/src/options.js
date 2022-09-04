import theme from './theme';

const options = {
    color: theme.color,
    grid: {
        containLabel: true,
    },
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'shadow',
        },
    },
    xAxis: {
        splitLine: {
            lineStyle: {
                color: [theme.seccondLineColor],
            },
        },
        axisTick: {
            show: false,
        },
        axisLine: {
            lineStyle: {
                color: theme.mainLineColor,
            },
        },
        axisLabel: {
            color: theme.mainText,
        },
    },
    yAxis: {
        splitLine: {
            lineStyle: {
                color: [theme.seccondLineColor],
            },
        },
        axisTick: {
            show: false,
        },
        axisLine: {
            lineStyle: {
                color: theme.mainLineColor,
            },
        },
        axisLabel: {
            color: theme.mainText,
        },
    },
    legend: {
        // icon: 'rect',
        bottom: 0,
        textStyle: {
            color: theme.secondText,
        },
        data: [],
    },
};
export default options;
