export enum DepartmentEnum {
  'CPM' = 0,
  'FTM',
}

export const departmentList: { id: DepartmentEnum; name: string }[] = [
  {
    id: DepartmentEnum.CPM,
    name: DepartmentEnum[0],
  },
  {
    id: DepartmentEnum.FTM,
    name: DepartmentEnum[1],
  },
]
