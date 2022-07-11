import { ref } from 'vue'
import { getFtmRolesAll } from '/@/api/opm/roles'
export default function useEmployees() {
  const teacherTypeList = ref<{}>([])
  const getTeacherTypeList = () => {
    getFtmRolesAll().then((res) => {
      console.log(res.data)
    })
  }
  return {
    teacherTypeList,
    getTeacherTypeList,
  }
}
