// 其他需要用到的通用数据
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
export default function useCommon() {
  const { t } = useI18n()
  const booleanList = ref([
    {
      id: true,
      name: t('text.yes'),
    },
    {
      id: false,
      name: t('text.no'),
    },
  ])
  return { booleanList }
}
