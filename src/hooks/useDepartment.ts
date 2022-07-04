import { ref } from 'vue'
import { Departments, getDepartmentsList as getDepartments } from '/@/api/departments'
import to from 'await-to-js'
import { DepartmentEnum } from '/@/enums/departmentEnum'

export default function useDepartment() {
  const departmentList = ref<DefaultAllListItem[]>([])
  const departmentForm = $ref<Departments>({
    page: 1,
    size: 1000,
    total: 0,
    // subsystem: DepartmentEnum.CPM,
  })
  const getDepartmentList = async () => {
    const [err, res] = await to(getDepartments(departmentForm))
    if (err) {
      departmentList.value = []
      departmentForm.total = 0
      return
    }
    departmentList.value = res.data.content
    departmentForm.total = res.data.totalElements
  }

  const subsystemMap: Record<keyof typeof DepartmentEnum, string> = {
    [DepartmentEnum.CPM]: 'CPM',
    [DepartmentEnum.FTM]: 'FTM',
  }
  return {
    departmentForm,
    departmentList,
    getDepartmentList,
    subsystemMap,
  }
}
