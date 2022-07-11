import { ref } from 'vue'
import { getCustomersAll, getCustomersList } from '/@/api/opm/customer'
export default function useCustomers() {
  const customerAllList = ref([])
  const getCustomersAllList = async () => {
    const { data } = await getCustomersAll()
    customerAllList.value = data
  }

  const customerList = ref([])

  const getCustomers = async () => {
    const { data } = await getCustomersList({
      page: 1,
      size: 1000,
    })
    customerList.value = data.content
  }

  return {
    customerAllList,
    getCustomersAllList,
    getCustomers,
    customerList,
  }
}
