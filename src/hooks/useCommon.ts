// 其他需要用到的通用数据
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

export default function useCommon() {
  const { t } = useI18n()
  /**
   * @param boolean
   */
  const booleanList = ref([
    {
      id: true,
      name: t('state.yes'),
    },
    {
      id: false,
      name: t('state.no'),
    },
  ])
  /**
   * @param 性别
   */
  const genderList = ref([
    {
      name: t('state.male'),
      id: 'M',
    },
    {
      name: t('state.female'),
      id: 'F',
    },
  ])
  /**
   * @param 学员类型
   */
  const studentTypeList = ref([
    {
      name: t('state.ordinary_students'),
      id: 'NORMAL',
    },
    {
      name: t('state.important_students'),
      id: 'VIP',
    },
  ])
  /**
   * @param 账号状态 是否禁用
   */
  const accountStatus = ref([
    {
      name: t('state.enable'),
      id: false,
    },
    {
      name: t('state.disable'),
      id: true,
    },
  ])

  /**
   * 通过、未通过
   */
  const passList = ref([
    {
      name: t('state.pass'),
      id: true,
    },
    {
      name: t('state.filled'),
      id: false,
    },
  ])
  /**
   * 状态-通过、未通过
   */
  const passStatusList = ref([
    {
      name: t('state.pass'),
      id: 'PASSED',
    },
    {
      name: t('state.filled'),
      id: 'FAILED',
    },
  ])

  return {
    booleanList,
    genderList,
    studentTypeList,
    accountStatus,
    passList,
    passStatusList,
  }
}
