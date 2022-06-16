import { AxiosPromise } from "axios";
import request from "/@/utils/request";

const url = import.meta.env.VITE_BASE_API_CPM;


/**
 * @function 货币信息
 */

export const getCurrency = function (): AxiosPromise<DefaultAllListItem[]> {
  return request({
    url: url + `/currency/all`,
    method: "get",

  });
};
