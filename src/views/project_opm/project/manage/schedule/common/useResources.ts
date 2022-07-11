import { reactive, toRefs } from 'vue'
// 查询所有资源
import { getresourcesFacilities } from '/@/api/opm/device'
export default function useResources() {
  const state = reactive({
    facilities: [],
    resources: [],
    simulators: [],
  })
  const getResources = async () => {
    const { data } = await getresourcesFacilities()
    state.simulators = data.simulators
    state.resources = data.resources
    state.facilities = data.facilities
  }
  const formatResources = (facilityResourceId: number, facilityId: number) => {
    const facilityResourceType = state.resources.find(
      (v) => v.id == facilityResourceId,
    ).builtinResource
    if (['SIMULATOR', 'ADD_SIMULATOR'].includes(facilityResourceType)) {
      return state.simulators.find((v) => v.id == facilityId)?.name
    } else {
      return state.facilities.find((v) => v.id == facilityId)?.name
    }
  }
  function deduplication(arr: any[]) {
    const obj = {}
    let newArr = arr.filter((v) => !!v.groupName)
    newArr = newArr.reduce(function (item, next) {
      //next的数值分别是：arr[0], arr[1] ...。
      //去掉最后的参数[]以后， next的数据为 arr[1], arr[2]...。
      obj[next.groupName]
        ? ''
        : (obj[next.groupName] =
            true &&
            item.push({
              id: next.groupName,
              name: next.groupName,
            }))
      return item
    }, [])
    newArr.push({
      id: 0,
      name: '未分组',
    })
    // debugger
    return newArr //去重后返回的数组
  }
  return {
    ...toRefs(state),
    getResources,
    formatResources,
    deduplication,
  }
}
