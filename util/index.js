import { isString, isNumber } from '@master_vantop/vantop-util';

export const staticBaseUrl = 'https://cdn-nextop-web-static.nextop.com/nextop-erp-micro';

export function addUnit(value) {
    if (isString(value)) {
        return value;
    } else if (isNumber(value)) {
        return `${value}px`;
    }
    return '';
}