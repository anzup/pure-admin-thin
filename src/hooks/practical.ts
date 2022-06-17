import to from 'await-to-js'
import { ref } from 'vue'
import { getPracticalTypesList, getPracticalGradesList } from '/@/api/practical'

export default function useList() {
  const practicalTypes = ref([])
  const practicalGradesList = ref([])
  /**
   * 考核类型
   */
  const getPracticalTypes = async () => {
    const [err, res] = await to(getPracticalTypesList({ size: 1000 }))
    if (err) return
    practicalTypes.value = res.data.content
  }
  /**
   * 成绩类型
   */
  const getPracticalGrades = async () => {
    const [err, res] = await to(getPracticalGradesList({ size: 1000 }))
    if (err) return
    practicalGradesList.value = res.data.content
  }

  return {
    getPracticalTypes,
    practicalTypes,
    practicalGradesList,
    getPracticalGrades,
  }
}
