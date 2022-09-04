/*
 * @Author: lingyong.zeng
 * @Date: 2021-10-28 16:01:28
 * @LastEditors: lingyong.zeng
 * @LastEditTime: 2021-11-01 10:06:34
 * @Description:
 * @FilePath: /vantop-ui/packages/detail-frame/src/jsxRender.js
 */
export default {
    props: {
        render: Function,
        required: true,
        default: () => null
    },
    render(h) {
        if (this.render) {
            return this.render(h);
        }
        return null;
    }
};