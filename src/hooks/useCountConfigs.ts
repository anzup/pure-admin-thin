import { reactive, ref } from 'vue'
import type { CountConfigs } from '/@/api/countConfigs'
import to from 'await-to-js'
import { getCountConfigsList as getCountConfigs } from '/@/api/countConfigs'

export default function useCountConfigs() {
  const countConfigsList = ref<any[]>([])
  const countConfigsForm = reactive<CountConfigs>({
    page: 1,
    size: 100,
    total: 0,
  })
  const getCountConfigsList = async () => {
    const [err, res] = await to(getCountConfigs(countConfigsForm))
    if (err) {
      countConfigsForm.total = 0
      countConfigsList.value = []
      return
    }
    countConfigsList.value = res.data.content
    countConfigsForm.total = res.data.totalElements
  }

  return {
    countConfigsList,
    countConfigsForm,
    getCountConfigsList,
  }
}
