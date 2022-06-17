import { ref, reactive } from 'vue'
import { getClazzsList } from '/@/api/class'
import { useI18n } from 'vue-i18n'

export interface IClassForm {
  type?: 'DRY_LEASE' | ' WET_LEASE'
  page: number
  size: number
  searchKey: string
  statusIN?: 'NOT_STARTED' | 'TRAINING' | 'FINISHED'
  month?: string
  isStartSchedule?: boolean
  occupied?: boolean

  [prop: string]: any
}

export default function useclazzs() {
  const clazzsAllList = ref([])
  const { t } = useI18n()
  const getclazzsAllList = async (form?: IClassForm) => {
    const res = await getClazzsList(form || { page: 1, size: 1000 })
    clazzsAllList.value = res.data.content
    return Promise.resolve(res)
  }
  const classTypeList = ref([
    {
      id: 'WET_LEASE',
      name: t('state.wet_rent_class'),
    },
    {
      id: 'DRY_LEASE',
      name: t('state.dry_rent_class'),
    },
  ])

  return {
    clazzsAllList,
    getclazzsAllList,
    classTypeList,
  }
}
