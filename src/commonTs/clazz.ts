import { ref, reactive } from 'vue'
import { getClazzsList } from '/@/api/opm/train'
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
      name: t('text.wet_rent_class'),
    },
    {
      id: 'DRY_LEASE',
      name: t('text.dry_rent_class'),
    },
    {
      id: 'INTERNAL_TRAINING',
      name: t('text.internal_classes'),
    },
  ])

  return {
    clazzsAllList,
    getclazzsAllList,
    classTypeList,
  }
}
