import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
export default function useTrain() {
  const { t } = useI18n()
  const leaseList = ref([
    {
      id: 'WET_LEASE',
      name: t('text.wet_rent_training'),
    },
    {
      id: 'DRY_LEASE',
      name: t('text.dry_rent_training'),
    },
  ])

  return {
    leaseList,
  }
}
