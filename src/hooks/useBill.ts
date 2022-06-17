import { useI18n } from 'vue-i18n'

export default function () {
  const { t } = useI18n()
  const feeTypeMap = {
    WET_LEASE: t('state.wet_lease'),
    DRY_LEASE: t('state.dry_lease'),
    VEHICLE: t('state.traffic'),
    DINNER: t('state.dining'),
    ACCOMMODATION: t('state.stay'),
    OTHER: t('state.other'),
  }
  return { feeTypeMap }
}
