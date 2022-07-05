import request from '/@/utils/request'

const url = import.meta.env.VITE_BASE_API_LOGISTICS

/**
 *
 * @description 餐厅列表
 */

export type MealTimes = PageBase

export const getMealTimesList = function (params: MealTimes) {
  return request<DefaultPagingData>({
    url: url + `/mealTimes`,
    method: 'get',
    params,
  })
}

/**
 * @description  餐厅详情
 */

export const getMealTimesDetail = function (id: number) {
  return request({
    url: url + `/mealTimes/${id}`,
    method: 'get',
  })
}

/**
 * @description  餐厅新增
 */

export interface PostMealTime {
  name: string
  startMinute: number
  endMinute: number
}

export const postMealTimes = function (data: PostMealTime) {
  return request({
    url: url + `/mealTimes`,
    method: 'post',
    data,
  })
}

/**
 * @description  餐厅修改
 */

export const putMealTimesId = function (data) {
  return request({
    url: url + `/mealTimes/${data.id}`,
    method: 'put',
    data,
  })
}

/**
 * @description  餐厅删除

 */

export const deleteMealTimesId = function (data) {
  return request({
    url: url + `/mealTimes/${data}`,
    method: 'delete',
  })
}

/**
 * @description  餐厅批量删除
 */

export const postMealTimesBatchDelete = function () {
  return request({
    url: url + `/mealTimes/batchDelete`,
    method: 'post',
  })
}
