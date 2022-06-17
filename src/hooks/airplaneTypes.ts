/**
 * 机型
 */
import to from 'await-to-js'
import { ref } from 'vue'
import { getAirplaneTypesList } from '/@/api/device'

export default function useAirplaneTypes() {
  const airplaneTypesAllList = ref([])

  const getAirplaneTypes = async () => {
    const [err, res] = await to(
      getAirplaneTypesList({
        size: 1000,
      }),
    )
    airplaneTypesAllList.value = res.data.content
  }

  return {
    airplaneTypesAllList,
    getAirplaneTypes,
  }
}
