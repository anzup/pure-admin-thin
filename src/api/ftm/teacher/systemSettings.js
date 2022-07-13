import http from '@/utils/http'
export const putSettings = function (params) {
    const url= '/settings';
    return http(url, params, "put", );
  };
// 获取登陆日志
export const getJournals = function (params) {
  const url= '/journals';
  return http(url, params, "get", );
};
// 生成登录日志
export const postJournals = function(params) {
  return http('/journals', params, 'post');
}

/**
 * 功能设置
 */
// 分页列表
export function getConfigs(params){
  return http('/configs', params, 'get')
}
// 新增
export function postConfigs(params){
  return http('/configs', params, 'post')
}
// 批量删除
export function batchDeleteConfigs(params){
  return http('/configs/batchDelete', params, 'post')
}
// 详情
export function getConfigsDetail(params){
  return http('/configs/{id}', params, 'get_p')
}
// 修改
export function putConfigs(params){
  return http('/configs/{id}', params, 'put')
}
// 删除
export function deleteConfigs(params){
  return http('/configs/{id}', params, 'delete')
}