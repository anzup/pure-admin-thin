import { ref } from 'vue'
import { getStudentTypeAll } from '/@/api/opm/roles'
export default function useStudentsType() {
  const studentTypeList = ref([])
  const getStudentsType = () => {
    getStudentTypeAll().then((res) => {
      studentTypeList.value = res.data
    })
  }
  return {
    studentTypeList,
    getStudentsType,
  }
}
