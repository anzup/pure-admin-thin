import to from 'await-to-js'
import { ref, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { getStandardCourses, GetStandardCourses, getStandardCourseTypesList } from '/@/api/standard'

export default function useList() {
  const { t } = useI18n()
  const standardCoursesForm = reactive<GetStandardCourses>({
    page: 1,
    size: 1000,
  })

  const standardCoursesList = ref([])
  const standardCourseTypesList = ref([])
  // 课程类型 实操、理论
  const courseTwoTypes = ref([
    {
      name: t('state.practice'),
      id: true,
    },
    {
      name: t('state.theory'),
      id: false,
    },
  ])

  /**
   * 标准课程列表
   */
  const getStandardCoursesList = async (param = {}) => {
    const [err, res] = await to(
      getStandardCourses({
        ...standardCoursesForm,
        ...param,
      }),
    )
    if (err) return
    standardCoursesList.value = res.data.content
  }
  /**
   * 标准课程分类 列表
   */
  const getStandardCourseTypes = async () => {
    const [err, res] = await to(getStandardCourseTypesList(standardCoursesForm))
    if (err) return
    standardCourseTypesList.value = res.data.content
  }
  return {
    standardCoursesList,
    getStandardCoursesList,
    standardCoursesForm,
    standardCourseTypesList,
    getStandardCourseTypes,
    courseTwoTypes,
  }
}
