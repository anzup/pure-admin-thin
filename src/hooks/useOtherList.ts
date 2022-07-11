import { ref, reactive } from 'vue'
import {
  getCourseNumbersList as getCourseNumbers,
  getCustomersList as getCustomers,
  GetOtherList,
  getTrainingItemsList as getTrainingItems,
} from '/@/api/user'
import to from 'await-to-js'

export function useCustomers() {
  const customerList = ref<DefaultAllListItem[]>([])
  const customerForm = reactive<GetOtherList>({
    page: 1,
    size: 100,
  })
  const getCustomersList = async () => {
    const [err, res] = await to(getCustomers(customerForm))
    if (err) return (customerList.value = [])
    customerList.value = res.data.content
  }
  return {
    customerList,
    customerForm,
    getCustomersList,
  }
}

export function useCourseNumbers() {
  const courseNumbersList = ref<DefaultAllListItem[]>([])
  const courseNumbersForm = reactive<GetOtherList>({
    page: 1,
    size: 100,
  })
  const getCourseNumbersList = async () => {
    const [err, res] = await to(getCourseNumbers(courseNumbersForm))
    if (err) return (courseNumbersList.value = [])
    courseNumbersList.value = res.data.content
  }
  return {
    courseNumbersList,
    courseNumbersForm,
    getCourseNumbersList,
  }
}

export function useTrainingItems() {
  const trainingItemsList = ref<DefaultAllListItem[]>([])
  const trainingItemsForm = reactive<GetOtherList>({
    page: 1,
    size: 100,
  })
  const getTrainingItemsList = async () => {
    const [err, res] = await to(getTrainingItems(trainingItemsForm))
    if (err) return (trainingItemsList.value = [])
    trainingItemsList.value = res.data.content
  }
  return {
    trainingItemsList,
    trainingItemsForm,
    getTrainingItemsList,
  }
}
