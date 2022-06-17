import { ref } from 'vue'
// 接口
import { getResourcesGroup } from '/@/api/controlPanel'
import to from 'await-to-js'

export default function useAllResources() {
  const allResouceList = ref<Array<controlPanel.IResourcesTypeList>>([])
  const getAllResourcesList = async () => {
    const [err, { data }] = await to(getResourcesGroup())
    if (!err) allResouceList.value = data
  }
  return {
    allResouceList,
    getAllResourcesList,
  }
}
