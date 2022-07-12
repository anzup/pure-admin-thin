import request from '/@/utils/request/opm'
const url = import.meta.env.VITE_BASE_API_OPM

export const getDashboard = (params: { year: number; month: number }) =>
  request({
    url: url + `/dashboard/${params.year}/${params.month}`,
    method: 'get',
  })
