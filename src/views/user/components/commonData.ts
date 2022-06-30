import { ref } from 'vue'
import { useI18n } from '/@/hooks/useI18n'

export default function common() {
  const { t } = useI18n()
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
  return {
    genderList,
  }
}
