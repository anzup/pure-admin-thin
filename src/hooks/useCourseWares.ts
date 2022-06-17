import to from 'await-to-js'
import { reactive, ref } from 'vue'
import { getCoursewares, GetCoursewares, CourseWare } from '/@/api/coursewares'

export default function () {
  const courseWareForm = reactive<GetCoursewares>({
    page: 1,
    size: 1000,
    total: 0,
  })
  const courseWareList = ref<CourseWare[]>([])
  const getCourseWareList = async () => {
    const [err, res] = await to(getCoursewares(courseWareForm))
    if (err) return
    courseWareList.value = res.data.content
    courseWareForm.total = res.data.totalElements
  }
  return {
    courseWareForm,
    courseWareList,
    getCourseWareList,
  }
}
