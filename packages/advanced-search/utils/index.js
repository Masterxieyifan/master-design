/*
 * @Author: lingyong.zeng
 * @Date: 2021-08-11 11:43:13
 * @LastEditors: 蔡远程
 * @LastEditTime: 2021-08-26 14:28:27
 * @Description:
 */

import { isFunction } from '@master_vantop/vantop-util';

// 返回值（应对属性传函数场景）
export function $g(attr) {
    if (isFunction(attr)) {
        return attr();
    }
    return attr;
}