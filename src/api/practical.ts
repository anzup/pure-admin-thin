import request from '/@/utils/request'
const url = import.meta.env.VITE_BASE_API_CPM

/**
 * @param {
 * 类型列表
 * }
 */

export const getPracticalTypesList = function (params) {
  return request({
    url: url + `/practicalTypes`,
    method: 'get',
    params,
  })
}

/**
 * @param {
 * 类型详情
 * }
 */

export const getPracticalTypesDetail = function (params) {
  return request({
    url: url + `/practicalTypes/${params}`,
    method: 'get',
  })
}

/**
 * @param {
 * 类型新增
 * }
 */

export const postPracticalTypes = function (data) {
  return request({
    url: url + `/practicalTypes`,
    method: 'post',
    data,
  })
}

/**
 * @param {
 * 类型修改
 * }
 */

export const putPracticalTypesId = function (data) {
  return request({
    url: url + `/practicalTypes/${data.id}`,
    method: 'put',
    data,
  })
}

/**
 * @param {
 * 类型删除
 * }
 */

export const deletePracticalTypesId = function (data) {
  return request({
    url: url + `/practicalTypes/${data}`,
    method: 'delete',
  })
}

/**
 * @param {
 * 考核单-信息列表
 * }
 */

export const getPracticalPapersPapers = function (params) {
  return request({
    url: url + `/practicalPapers/papers`,
    method: 'get',
    params,
  })
}

/**
 * @param {
 * 考核单-列表
 * }
 */

export const getPracticalPapersBatch = function (params) {
  return request({
    url: url + `/practicalPapers/batch`,
    method: 'get',
    params,
  })
}

/**
 * @param {
 * 考核单-修改
 * }
 */

export const postPracticalPapersBatch = function (data) {
  return request({
    url: url + `/practicalPapers/batch`,
    method: 'post',
    data,
  })
}
/**
 * @param {
 * 考核单-打分
 * }
 */

export const postPracticalPapersScore = function (data) {
  return request({
    url: url + `/practicalPapers/${data.id}/score/${data.subItemId}`,
    method: 'post',
    data,
  })
}

/**
 * @param {
 * 考核单-设置号位
 * }
 */

export const putPracticalPapersNumber = function (data) {
  return request({
    url: url + `/practicalPapers/${data.id}/number/${data.number}`,
    method: 'put',
    data,
  })
}
/**
 * @param {
 * 考核单-签名
 * }
 */

export const postPracticalPapersSign = function (data) {
  return request({
    url: url + `/practicalPapers/sign`,
    method: 'post',
    data,
  })
}

/**
 * @param {
 * 考核单-签名-批量
 * }
 */
export const postPracticalPapersBatchSign = function (data) {
  return request({
    url: url + `/practicalPapers/batchSign`,
    method: 'post',
    data,
  })
}

/**
 * @param {
 * 考核单-实操配置-列表
 * }
 */

export const getPracticalConfigsList = function (params) {
  return request({
    url: url + `/practicalConfigs`,
    method: 'get',
    params,
  })
}

/**
 * @param {
 * 考核单-实操配置-详情
 * }
 */

export const getPracticalConfigsById = function (params) {
  return request({
    url: url + `/practicalConfigs/${params}`,
    method: 'get',
  })
}

/**
 * @param {
 * 考核单-实操配置-新增
 * }
 */

export const postPracticalConfigs = function (data) {
  return request({
    url: url + `/practicalConfigs`,
    method: 'post',
    data,
  })
}

/**
 * @param {
 * 考核单-实操配置-修改
 * }
 */

export const putPracticalConfigsId = function (data) {
  return request({
    url: url + `/practicalConfigs/${data.id}`,
    method: 'put',
    data,
  })
}

/**
 * @param {
 * 考核单-实操配置-删除
 * }
 */

export const deletePracticalConfigsId = function (data) {
  return request({
    url: url + `/practicalConfigs/${data}`,
    method: 'delete',
  })
}
/**
 * @param {
 * 考核单-实操配置-批量删除
 * }
 */

export const batchDeletePracticalConfigs = function (data) {
  return request({
    url: url + `/practicalConfigs/batchDelete`,
    method: 'post',
    data,
  })
}
// 条目
export interface ConfigItems {
  id?: number
  categoryName: string
  configId: number
  content: string
  score: number
}
/**
 * @param {
 * 考核单-配置扣分项-列表
 * }
 */

export const getPracticalConfigItemsList = function (params) {
  return request({
    url: url + `/practicalConfigItems`,
    method: 'get',
    params,
  })
}

/**
 * @param {
 * 考核单-配置扣分项-详情
 * }
 */

export const getPracticalConfigItemsById = function (params) {
  return request({
    url: url + `/practicalConfigItems/${params}`,
    method: 'get',
  })
}

/**
 * @param {
 * 考核单-配置扣分项-新增
 * }
 */

export const postPracticalConfigItems = function (data) {
  return request({
    url: url + `/practicalConfigItems`,
    method: 'post',
    data,
  })
}

/**
 * @param {
 * 考核单-配置扣分项-修改
 * }
 */

export const putPracticalConfigItemsId = function (data) {
  return request({
    url: url + `/practicalConfigItems/${data.id}`,
    method: 'put',
    data,
  })
}

/**
 * @param {
 * 考核单-配置扣分项-删除
 * }
 */

export const deletePracticalConfigItemsId = function (data) {
  return request({
    url: url + `/practicalConfigItems/${data}`,
    method: 'delete',
  })
}
/**
 * @param {
 * 考核单-配置扣分项-批量删除
 * }
 */

export const batchDeletePracticalConfigItems = function (data) {
  return request({
    url: url + `/practicalConfigItems/batchDelete`,
    method: 'post',
    data,
  })
}
/**
 * @param {
 * 考核单-配置扣分项 批量导入
 * }
 */
export const importPracticalConfigItems = function (data) {
  return request({
    url: url + `/practicalConfigItems/import/${data.itemId}`,
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    data: data.formData,
  })
}
/**
 * @param {
 * 考核单-配置扣分项 获取导入模板
 * }
 */
export const getTemplatePracticalConfigItems = function () {
  return request({
    url: url + `/practicalConfigItems/import`,
    method: 'get',
    responseType: 'blob',
    // data,
  })
}
/**
 * @param {
 * 考核单-成绩等级-列表
 * }
 */

export const getPracticalGradesList = function (params) {
  return request({
    url: url + `/practicalGrades`,
    method: 'get',
    params,
  })
}

/**
 * @param {
 * 考核单-成绩等级-详情
 * }
 */

export const getPracticalGradesById = function (params) {
  return request({
    url: url + `/practicalGrades/${params}`,
    method: 'get',
  })
}

/**
 * @param {
 * 考核单-成绩等级-新增
 * }
 */

export const postPracticalGrades = function (data) {
  return request({
    url: url + `/practicalGrades`,
    method: 'post',
    data,
  })
}

/**
 * @param {
 * 考核单-成绩等级-修改
 * }
 */

export const putPracticalGradesId = function (data) {
  return request({
    url: url + `/practicalGrades/${data.id}`,
    method: 'put',
    data,
  })
}

/**
 * @param {
 * 考核单-成绩等级-删除
 * }
 */

export const deletePracticalGradesId = function (data) {
  return request({
    url: url + `/practicalGrades/${data}`,
    method: 'delete',
  })
}
/**
 * @param {
 * 考核单-成绩等级-批量删除
 * }
 */

export const batchDeletePracticalGrades = function (data) {
  return request({
    url: url + `/practicalGrades/batchDelete`,
    method: 'post',
    data,
  })
}
