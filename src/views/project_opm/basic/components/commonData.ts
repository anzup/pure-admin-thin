import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
export default function useCommonData() {
  const { t } = useI18n()
  /**
   * @param 性别
   */
  const genderList = ref([
    {
      name: t('text.male'),
      id: 'M',
    },
    {
      name: t('text.female'),
      id: 'F',
    },
  ])
  return {
    genderList,
  }
}
