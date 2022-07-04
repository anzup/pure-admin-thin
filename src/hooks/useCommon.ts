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
   * @param 账号状态 是否禁用
   */
  const accountStatus = ref([
    {
      name: t('state.enable'),
      id: false,
    },
    {
      name: t('state.disabled'),
      id: true,
    },
  ])

  return {
    booleanList,
    genderList,
    accountStatus,
  }
}
