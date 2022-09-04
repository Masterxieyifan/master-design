/*
 * @Author: 陈建中
 * @Date: 2021-08-17 11:04:57
 * @LastEditTime: 2021-08-26 14:27:56
 * @LastEditors: 蔡远程
 * @Description: vuedraggable 组件默认拖拽效果配置
 */
export const draggableOptions = {
    props: {
        animation: {
            type: String,
            default: '200',
        },
        ghostClass: {
            type: String,
            default: 'draggable-ghost'
        }
    }
};
