import { ref } from 'vue'
import { getTeacherTypesList } from '/@/api/teacherTypes'
import { getTeacherTeamsList } from '/@/api/teacherTeams'

export default function useTeachers() {
  const teacherTypesList = ref([])
  const teacherTeamsList = ref([])

  const getTeacherTypes = () => {
    getTeacherTypesList({
      size: 1000,
    }).then((res) => {
      teacherTypesList.value = res.data.content
    })
  }
  const getTeacherTeams = () => {
    getTeacherTeamsList({
      size: 1000,
      order: 'asc',
    }).then((res) => {
      teacherTeamsList.value = res.data.content
    })
  }
  return {
    teacherTypesList,
    teacherTeamsList,
    getTeacherTypes,
    getTeacherTeams,
  }
}
