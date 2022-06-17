import { reactive, ref } from 'vue'
import {
  getPositions,
  GetPositions,
  GetTrainingCategorys,
  getTrainingCategorys,
  getTrainingItems,
  GetTrainingItems,
  GetTrainingTypes,
  getTrainingTypes,
} from '/@/api/standard'
import { CourseTypesList, getCourseTypesList as getCourseTypes } from '/@/api/courseTypes'
import to from 'await-to-js'

export default function useCourseClass() {
  const trainCategoryList = ref([])
  const trainCategoryForm = reactive<GetTrainingCategorys>({
    page: 1,
    size: 1000,
    total: 0,
  })
  /**
   * @function 培训项目分类分页列表
   */
  const getTrainCategoryList = async () => {
    const [err, res] = await to(getTrainingCategorys(trainCategoryForm))
    if (err) return
    trainCategoryList.value = res.data.content
    trainCategoryForm.total = res.data.totalElements
  }

  const trainingTypeList = ref([])
  const trainingTypeForm = reactive<GetTrainingTypes>({
    page: 1,
    size: 1000,
    total: 0,
  })

  /** @function 培训类型分类 */
  const getTrainingTypeList = async () => {
    const [err, res] = await to(getTrainingTypes(trainingTypeForm))
    if (err) return
    trainingTypeList.value = res.data.content
  }

  const trainProjectList = ref([])
  const trainProjectForm = reactive<GetTrainingItems>({
    page: 1,
    size: 100,
    order: 'asc',
  })
  /** @function 培训项目配置列表（培训项目分类的子项） */
  const getTrainProjectList = async (params = {}) => {
    const [err, res] = await to(
      getTrainingItems({
        ...trainProjectForm,
        ...params,
      }),
    )
    if (err) return
    trainProjectList.value = res.data.content
  }

  const courseTypeList = ref([])
  const courseTypeForm = reactive<CourseTypesList>({})
  const getCourseTypesList = async () => {
    const [err, res] = await to(getCourseTypes(courseTypeForm))
    if (err) return
    courseTypeList.value = res.data.content
  }

  const positionForm = reactive<GetPositions>({
    page: 1,
    size: 1000,
  })
  const positionList = ref([])

  const getPositionList = async () => {
    const [err, res] = await to(getPositions(positionForm))
    if (err) return
    return (positionList.value = res.data.content)
  }

  return {
    getTrainCategoryList,
    trainCategoryForm,
    trainCategoryList,
    trainingTypeList,
    trainingTypeForm,
    getTrainingTypeList,
    trainProjectList,
    trainProjectForm,
    getTrainProjectList,
    courseTypeList,
    courseTypeForm,
    getCourseTypesList,
    positionForm,
    positionList,
    getPositionList,
  }
}
