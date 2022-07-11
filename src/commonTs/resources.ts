import { ref, reactive } from 'vue'
import {
  getResourcesList as getResources,
  IResourcesList,
  getResourcesAll,
  getResourcesNormal,
  getResourcesoSchedule,
} from '/@/api/opm/contract'
import to from 'await-to-js'
export default function useResources() {
  const resourcesForm = reactive<IResourcesList>({
    resourceType: undefined,
    page: 1,
    size: 100,
    total: 0,
  })

  const resourcesList = ref<Array<resources.ResourcesItem> | Array<DefaultAllListItem>>([])
  const getResourcesList = async () => {
    const [err, { data }] = await to(getResources(resourcesForm))
    resourcesList.value = data.content
    resourcesForm.total = data.totalElements
  }

  const getResourcesAllList = async () => {
    const [err, res] = await to(getResourcesAll())
    resourcesList.value = res.data
  }
  const getResourcesNormalList = async () => {
    const [err, res] = await to(getResourcesNormal())
    resourcesList.value = res.data
  }
  const getResourcesoScheduleList = async (params?: { resourceType: 'FACILITIES' | 'TEACHER' }) => {
    const [err, res] = await to(getResourcesoSchedule(params))
    resourcesList.value = res.data as Array<resources.ResourcesItem>
  }

  return {
    getResourcesList,
    resourcesList,
    resourcesForm,
    getResourcesAllList,
    getResourcesNormalList,
    getResourcesoScheduleList,
  }
}
