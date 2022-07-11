import request from "/@/utils/request";
const url = import.meta.env.VITE_BASE_API_DMM;
const pubUrl = import.meta.env.VITE_BASE_API_PUB;
/**
 *
 * @param {
 * 模拟机列表
 * }
 */
export const getSimulatorList = (params: any) =>
    request({
        url: url + "/simulator",
        method: "get",
        params
    });
// 查看文件是否存在
export const getAttachmentIdFileExists = function (params) {
    // const url= '/quality/attachment/{attachmentId}/fileExists';
    return request({
        url: url + `/public/file/${params.attachmentId}/fileExists`,
        method: "get"
    });
};
// 开放接口下载文件
export const getOpenDownload = function (uuid: string) {
    // const url= '/quality/attachment/{attachmentId}/fileExists';
    return request({
        url: pubUrl + `/open/${uuid}/download`,
        method: "get",
        responseType: "blob"
    });
};
/**
 * 获取文件信息
 */
export function getfileInfo(uuid) {
    return request({
        url: pubUrl + "/files/" + uuid,
        method: "get"
    });
}
/**
 * 文件上传
 */
export function postFileUpload(file: File) {
    const data = new FormData();
    data.append("file", file);
    return request({
        url: pubUrl + `/files/upload`,
        method: "post",
        headers: { "Content-Type": "multipart/form-data" },
        data
    });
}
/**
 * 预览文件（返回url）
 */
export function previewURL(uuid: string) {
    return import.meta.env.VITE_BASE_URL+`${pubUrl}/open/${uuid}/inline`
}