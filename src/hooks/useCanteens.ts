import { reactive, ref } from 'vue'
import { Canteens } from '/@/api/canteens'
import to from 'await-to-js'
import { getCanteensList as getCanteens } from '/@/api/canteens'

export default function useCanteens() {
  const canteensList = ref<any[]>([])
  const canteensForm = reactive<Canteens>({
    page: 1,
    size: 100,
    total: 0,
  })
  const getCanteensList = async () => {
    const [err, res] = await to(getCanteens(canteensForm))
    if (err) {
      canteensForm.total = 0
      canteensList.value = []
      return
    }
    canteensList.value = res.data.content
    canteensForm.total = res.data.totalElements
  }

  return {
    canteensList,
    canteensForm,
    getCanteensList,
  }
}
