import request from '/@/utils/request'

const url = import.meta.env.VITE_BASE_API_LOGISTICS

/**
 *
 * @description 消费时段列表
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
 * @description  消费时段详情
 */

export const getMealTimesDetail = function (id: number) {
  return request({
    url: url + `/mealTimes/${id}`,
    method: 'get',
  })
}

/**
 * @description  消费时段新增
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
 * @description  消费时段修改
 */

export const putMealTimesId = function (data) {
  return request({
    url: url + `/mealTimes/${data.id}`,
    method: 'put',
    data,
  })
}

/**
 * @description  消费时段删除

 */

export const deleteMealTimesId = function (data) {
  return request({
    url: url + `/mealTimes/${data}`,
    method: 'delete',
  })
}

/**
 * @description  消费时段批量删除
 */

export const postMealTimesBatchDelete = function () {
  return request({
    url: url + `/mealTimes/batchDelete`,
    method: 'post',
  })
}
