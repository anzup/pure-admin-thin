import request from '/@/utils/request/opm'
const url = import.meta.env.VITE_BASE_API_OPM

/**
 *
 * @param {
 * 模拟机列表
 * }
 */
export const getSimulatorList = (params: any) =>
  request({
    url: url + '/simulator',
    method: 'get',
    params,
  })
/**
 *
 * @param {
 * 模拟机类型
 * }
 */
export const getSimulatorDeviceType = () =>
  request({
    url: url + '/simulator​/deviceType',
    method: 'get',
  })
/**
 *
 * @param {
 * 模拟机详情
 * }
 */
export const getSimutatorDetail = (params: any) =>
  request({
    url: url + `/simulator/${params}`,
    method: 'get',
  })
/**
 *
 * @param {
 * 历史证书
 * }
 */

export const getCertificationInvalid = function () {
  return request({
    url: url + `/quality/certification/invalid`,
    method: 'get',
  })
}

/**
 *
 * @param {
 * 训练能力下拉
 * }
 */

export const getTrainingabilityAll = function () {
  return request({
    url: url + `/quality/trainingability/all`,
    method: 'get',
  })
}

/**
 *
 * @param {
 * 客户化机场下拉
 * }
 */

export const getCustomizedAirportAll = function () {
  return request({
    url: url + `/quality/customizedAirport/all`,
    method: 'get',
  })
}

/**
 *
 * @param {
 * 资源配置列表
 * }
 */

export const getFacilitiesList = function (params) {
  return request({
    url: url + `/facilities`,
    method: 'get',
    params,
  })
}

/**
 * @param {
 * 资源配置详情
 * }
 */

export const getFacilitiesDetail = function (params) {
  return request({
    url: url + `/facilities/${params}`,
    method: 'get',
  })
}

/**
 * @param {
 * 资源配置新增
 * }
 */

export const postFacilities = function (data) {
  return request({
    url: url + `/facilities`,
    method: 'post',
    data,
  })
}

/**
 * @param {
 * 资源配置修改
 * }
 */

export const putFacilitiesId = function (data) {
  return request({
    url: url + `/facilities/${data.id}`,
    method: 'put',
    data,
  })
}

/**
 * @param {
 * 资源配置删除
 * }
 */

export const deleteFacilitiesId = function (data) {
  return request({
    url: url + `/facilities/${data}`,
    method: 'delete',
  })
}

/**
 * @param {
 * 资源配置批量删除
 * }
 */

export const postFacilitiesBatchDelete = function () {
  return request({
    url: url + `/facilities/batchDelete`,
    method: 'post',
  })
}

/**
 * @param {
 * 下拉列表
 * }
 */

export const getFacilitiesAll = function (params: { resourceId?: number }) {
  return request({
    url: url + `/facilities/all`,
    method: 'get',
    params,
  })
}

/************ 机型 ***************/
/**
 *
 * @param {
 * 机型列表
 * }
 */

export const getAirplaneTypesList = function (params) {
  return request({
    url: url + `/airplaneTypes`,
    method: 'get',
    params,
  })
}
/**
 *
 * @param {
 * 机型下拉
 * }
 */

export const getAirplaneTypesAll = function () {
  return request({
    url: url + `/airplaneTypes/all`,
    method: 'get',
  })
}
/**
 *
 * @param {
 * 所有资源
 * }
 */

export const getresourcesFacilities = function () {
  return request({
    // eslint-disable-next-line no-irregular-whitespace
    url: url + `/resources​/facilities`,
    method: 'get',
  })
}
