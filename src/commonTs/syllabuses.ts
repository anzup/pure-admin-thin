import { ref, reactive } from 'vue'
import { getSyllabusesAll } from '/@/api/opm/standard'
export default function usesyllabuses() {
  const syllabusesAllList = ref()
  const syllabusesForm = reactive({
    courseType: undefined,
    courseId: undefined,
  })
  const getSyllabusesAllList = () => {
    getSyllabusesAll(syllabusesForm).then((res) => {
      syllabusesAllList.value = res.data
    })
  }
  return {
    syllabusesAllList,
    syllabusesForm,
    getSyllabusesAllList,
  }
}
