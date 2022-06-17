import { ref, reactive } from 'vue'
import { getFacilityTypes, GetFacilityTypes, GetFacility, getFacility } from '/@/api/facilities'
import to from 'await-to-js'

export default function useFacility() {
  const facilityTypeList = ref([])
  const facilityList = ref([])
  const facilityTypeForm = reactive<GetFacilityTypes>({
    page: 1,
    size: 1000,
    total: 0,
  })
  const facilityForm = reactive<GetFacility>({
    page: 1,
    size: 1000,
    total: 0,
  })
  const getFacilityTypeList = async () => {
    const [err, res] = await to(getFacilityTypes(facilityTypeForm))
    if (err) return
    facilityTypeList.value = res.data.content
    facilityTypeForm.total = res.data.totalElements
  }
  const getFacilityList = async () => {
    const [err, res] = await to(getFacility(facilityForm))
    if (err) return
    facilityList.value = res.data.content
    facilityForm.total = res.data.totalElements
  }
  return {
    getFacilityTypeList,
    facilityTypeForm,
    facilityTypeList,
    getFacilityList,
    facilityForm,
    facilityList,
  }
}
