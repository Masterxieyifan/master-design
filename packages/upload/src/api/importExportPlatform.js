import instance from '../http/request';
import { comonDownLoad } from '@/packages/upload/src/utils/download';

const prefix = '/importExportPlatform';
const filecenter = '/filecenter';

// ***** api 接口 *****
// 导入场景详情
export const importDetail = params =>
    instance.post(prefix + '/import/detail', params);

// 文件导出
export const download = params => {
    const url = '/filecenter/file/download';
    comonDownLoad('get', url, null, params);
};

// 单文件上传
export const importFileSingle = params =>
    instance.post(filecenter + '/file/import/single', params);

// 多文件上传
export const importFileList = params =>
    instance.post(filecenter + '/file/import/list', params);

// 导入功能按钮
export const importFile = params => instance.post(prefix + '/import', params);

// 导入任务状态查询
export const importResultGet = params =>
    instance.get(prefix + '/importTask/get', { params });

// 导出数量统计
export const exportCount = params =>
    instance.post(prefix + '/export/count', params);

// 导出功能按钮
export const exportData = params => instance.post(prefix + '/export', params);

// 导出任务状态查询
export const exportTaskGet = params =>
    instance.get(prefix + '/exportTask/get', { params });

// ***** api 接口 *****
