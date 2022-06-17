import to from 'await-to-js'
import { ref } from 'vue'
import { getTrainingTypeConfig } from '/@/api/standard'
import { getAttendances } from '/@/api/attendances'
import { getPracticalGradesList, getPracticalTypesList } from '/@/api/practical'

export default function useList() {
  const trainingTypeConfigsList = ref([])
  const attendancesList = ref([])
  const practicalGradesList = ref([])
  const practicalTypesList = ref([])
  /**
   * 培训类型
   */
  const getTrainingTypeConfigList = async (params = {}) => {
    const [err, res] = await to(getTrainingTypeConfig(params))
    if (err) return
    trainingTypeConfigsList.value = res.data.content
  }
  /**
   * 考勤列表
   */
  const getAttendancesList = async (params = {}) => {
    const [err, res] = await to(getAttendances(params))
    if (err) return
    attendancesList.value = res.data.content
  }
  /**
   * 实操成绩列表
   */
  const getPracticalGrades = async (params = {}) => {
    const [err, res] = await to(getPracticalGradesList(params))
    if (err) return
    practicalGradesList.value = res.data.content
  }
  /**
   * 实操考核类型列表
   */
  const getPracticalTypes = async (params = {}) => {
    const [err, res] = await to(getPracticalTypesList(params))
    if (err) return
    practicalTypesList.value = res.data.content
  }

  return {
    trainingTypeConfigsList,
    getTrainingTypeConfigList,
    getAttendancesList,
    attendancesList,
    practicalGradesList,
    getPracticalGrades,
    getPracticalTypes,
    practicalTypesList,
  }
}
