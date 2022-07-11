/**
 * 机型
 */

import { ref } from 'vue'
import { getAirplaneTypesAll } from '/@/api/opm/device'
export default function useAirplaneTypes() {
  const airplaneTypesAllList = ref([])

  const getAirplaneTypesAllList = async () => {
    const { data } = await getAirplaneTypesAll()
    airplaneTypesAllList.value = data
  }

  return {
    airplaneTypesAllList,
    getAirplaneTypesAllList,
  }
}
