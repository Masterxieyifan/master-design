<!--
 * @Author: lingyong.zeng
 * @Date: 2022-04-12 11:30:06
 * @LastEditors: lingyong.zeng
 * @LastEditTime: 2022-04-13 17:29:55
 * @Description: 
 * @FilePath: /vantop-ui/examples/views/Tour.md
-->
## Tour 用户指引

### 基础用法
:::demo

```html
<template>
    <div>
        <el-button id="tour-step-1" type="primary">创建</el-button>
        <el-button id="tour-step-2">导出</el-button>
        <el-button id="tour-step-3">授权</el-button>
        <md-tour
            v-if="tourVisible" 
            ref="myTour" 
            name="myTour" 
            :steps="steps"
            :callbacks="tourCallback"
        >
        </md-tour>
        <el-button type="text" @click="startTour">
            开始指引
        </el-button>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                tourVisible: true,
                tourCallback: {
                    onStart() {
                        console.log('开始');
                    },
                    onStop() {
                        console.log('结束了');
                    },
                    onNextStep: current => {
                        // 使用 this 时声明箭头函数
                        console.log('下一步');
                    },
                    onSkip() {      
                        console.log('跳过');
                    },
                    onFinish() {    
                        console.log('完成');
                    }
                },
                steps: [
                    {
                        id: "tour-step-1",
                        target: '#tour-step-1',
                        content: `点击此处进入「创建数据」!`,
                        params: {
                            placement: 'left',
                            enableScrolling: false,
                        }
                    },
                    {
                        id: "tour-step-2",
                        target: '#tour-step-2',
                        content: `点击此处进行「导出数据」!`,
                        params: {
                            placement: 'top',
                            enableScrolling: false,
                        }
                    },
                    {
                        id: "tour-step-3",
                        target: '#tour-step-3',
                        content: `点击此处进行「权限授予」!`,
                        params: {
                            placement: 'top',
                            enableScrolling: false,
                        }
                    },
                ]
            };
        },
        mounted() {
            // this.$refs['myTour'].start()
        },
        methods: {
            startTour() {
                this.$refs['myTour'].start()
            }
        }
    }
</script>
```
:::


### Tour Attributes
| 参数名称             | 描述             | 类型     |是否必须 |默认值  |
| --------------------| ----------------| --------| -------| ------|
| steps               | 指引步骤内容      | Array | 否      |[]  |


### Tour Methods
| 方法名称             | 说明             | 参数     |
| --------------------| ----------------| --------| 
| start               | 开始显示第几个指引（参数支持传入id或索引） | (start: Number/String） | 


