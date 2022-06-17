import { ref } from 'vue'
import { getStudentTypesList } from '/@/api/roles'

export default function useUsersType() {
  const studentTypeList = ref([])
  const getUsersType = () => {
    getStudentTypesList({
      size: 1000,
    }).then((res) => {
      studentTypeList.value = res.data.content
    })
  }
  return {
    studentTypeList,
    getUsersType,
  }
}
