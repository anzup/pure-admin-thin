import request from "/@/utils/request";

const url = import.meta.env.VITE_BASE_API_CPM;

/**
 * @function 货币信息
 */

export const getBillsCustomers = (params: PageBase) => {
  return request<DefaultPagingData>({
    url: url + `/bills/customers`,
    method: "get",
    params
  });
};
export type BillPeriodType = "YEAR" | "MONTH" | "WEEK" | "DAY";
export interface BillPeriodSettings {
  num: number;
  billPeriodType: BillPeriodType;
  originalDate: Date;
}

/**
 * @function 结算周期信息
 */

export const getBillPeriodSettings = () => {
  return request<BillPeriodSettings>({
    url: url + `/billPeriodSettings`,
    method: "get"
  });
};
/**
 * @function 货币信息
 */

export const postBillPeriodSettings = (data: BillPeriodSettings) => {
  return request({
    url: url + `/billPeriodSettings`,
    method: "post",
    data
  });
};

/**
 * @function 结算周期信息
 */

export interface GetBills {
  year: number;
  positionId: number;
  customerId: number;
  searchKey?: string;
}

export const getBills = (params: GetBills) => {
  return request<DefaultAllListItem[]>({
    url: url + `/bills`,
    method: "get",
    params
  });
};
export interface GetBillItemsWetLease {
  startDate: Date;
  endDate: Date;
  positionId: number;
  customerId: number;
}
export const getBillItemsWetLease = (params: GetBillItemsWetLease) => {
  return request<any[]>({
    url: url + `/billItems/wetLease`,
    method: "get",
    params
  });
};
export const getBillItemsOther = (params: {
  billId: number;
  positionId: number;
}) => {
  return request<any[]>({
    url: url + `/billItems/other`,
    method: "get",
    params
  });
};
//  备注
export const putBillItem = (params: { remark: string; id: number }) => {
  const { id, ...data } = params;
  return request({
    url: url + `/billItems/${id}/remark`,
    method: "put",
    data
  });
};
/**
 * @function 添加其他费用
 * **/

export interface BillItemOther {
  id: number;
  feeType: string;
  billId: number;
  positionId: number;
  price: number;
  num: number;
  remark: string;
}
export const putBillItemOther = (data: BillItemOther[]) => {
  return request({
    url: url + `/billItems/batchUpdate`,
    method: "put",
    data
  });
};
