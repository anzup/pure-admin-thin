import { reactive, ref } from 'vue'
import type { MealTimes } from '/@/api/mealTimes'
import to from 'await-to-js'
import { getMealTimesList as getMealTimes } from '/@/api/mealTimes'

export default function useMealTimes() {
  const mealTimesList = ref<any[]>([])
  const mealTimesForm = reactive<MealTimes>({
    page: 1,
    size: 100,
    total: 0,
  })
  const getMealTimesList = async () => {
    const [err, res] = await to(getMealTimes(mealTimesForm))
    if (err) {
      mealTimesForm.total = 0
      mealTimesList.value = []
      return
    }
    mealTimesList.value = res.data.content
    mealTimesForm.total = res.data.totalElements
  }

  return {
    mealTimesList,
    mealTimesForm,
    getMealTimesList,
  }
}
