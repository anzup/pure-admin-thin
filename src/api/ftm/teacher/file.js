import http from '@/utils/http'

// 文件详情
export const getFileDetail = function (params) {
  const url= process.env.VUE_APP_BASE_API_PUB+`/files/${params.uuid}`;
  return http(url, {}, "get","json",false,1);
};
// 文件下载
export const getFileDownload = function (params) {
  const url= process.env.VUE_APP_BASE_API_PUB+`/files/${params.uuid}/download`;
  return http(url, {}, "get","json",'1',1);
};
/**
 * 
 * @param {文件中心相关接口} params 
 * @returns 
 */
// 文件列表
export const getFileFolder = function (params) {
  const url= `/folders`;
  return http(url, params, "get","json");
};
// 新增
export const postFileFolder = function (params) {
  const url= `/folders`;
  return http(url, params, "post","json");
};
// 详情
export const getFileFolderId = function (params) {
  const url= `/folders/${params.uuid}`;
  return http(url, {}, "get","json");
};
// 修改
export const putFileFolder = function (params) {
  const url= `/folders/${params.uuid}`;
  return http(url, params, "put","json");
};
// 删除
export const putFileFolderDisable = function (params) {
  const url= `/folders/${params.uuid}`;
  return http(url, params, "delete","json");
};
// 上传文件
export const postUpload = function (params) {

  const url= process.env.VUE_APP_BASE_API_PUB+`/files/upload`;
  return http(url, params, "post","json",false,1);
};
// 资源新增
export const postResource = function (params) {

  const url= `/fileResources`;
  return http(url, params, "post","json");
};
// 资源修改
export const putResource = function (params) {
  const url= `/fileResources/${params.uuid}`;
  return http(url, params, "put","json");
};
// 资源详情
export const getResourceId = function (params) {

  const url= `/fileResources/${params.uuid}`;
  return http(url, {}, "get","json");
};
// 文件详情
export const getFilesId = function (params) {

  const url= process.env.VUE_APP_BASE_API_PUB+`/files/${params.uuid}`;
  return http(url, {}, "get","json",false,1);
};
// 资源删除
export const pustResourceDisAble = function (params) {

  const url= `/fileResources/${params.uuid}`;
  return http(url, {}, "delete","json");
};
/**
 * 预览文件（返回axios对象）
 */
 export function previewFile(uuid){
  // return `${baseURL}/open/${uuid}/inline`
  return http(`${process.env.VUE_APP_BASE_API_PUB}/files/${uuid}/inline`, false, 'get',false, 'arraybuffer', true)
}

// 判断文件是否存在
export function isHaveFile(params){
  return http(`${process.env.VUE_APP_BASE_API_PUB}/files/{uuid}/fileExists`, params, 'get_p', 'json', false, 1)
}

// 文件详情
export function getFiles(params){
  return http(`${process.env.VUE_APP_BASE_API_PUB}/files/{uuid}`, params, 'get_p', 'json', undefined, 1)
}