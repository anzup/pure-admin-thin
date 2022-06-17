/*
 * @Author: 冉茂廷 1012377328@qq.com
 * @Date: 2022-05-06 20:58:58
 * @LastEditors: 冉茂廷 1012377328@qq.com
 * @LastEditTime: 2022-05-20 09:45:03
 * @FilePath: \crew-web\src\hooks\customer.ts
 * @Description:
 *
 * Copyright (c) 2022 by 冉茂廷 1012377328@qq.com, All Rights Reserved.
 */
import to from "await-to-js";
import { reactive, ref } from "vue";
import { getCustomersList, Customers } from "/@/api/customer";
import { getNationalityList } from "/@/api/nationality";

export default function useCustomers() {
  const customerList = ref([]);
  const nationalityList = ref([]);

  const customersForm = reactive<Customers>({
    page: 1,
    size: 1000
  });
  /**
   * 客户
   */
  const getCustomers = async (cancel = false) => {
    const [err, res] = await to(getCustomersList(customersForm, cancel));
    if (err) return;
    customerList.value = res.data.content;
    customersForm.total = res.data.totalElements;
  };
  /**
   * 国籍
   */
  const getNationality = async () => {
    const [err, res] = await to(
      getNationalityList({
        size: 1000
      })
    );
    if (err) return;
    nationalityList.value = res.data.content;
  };

  return {
    customerList,
    nationalityList,
    getCustomers,
    getNationality,
    customersForm
  };
}
