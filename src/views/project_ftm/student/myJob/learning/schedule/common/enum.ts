import { useI18n } from 'vue-i18n'
export function useWeek() {
  const { t } = useI18n()
  const WEEK_LIST = [
    t('common.Sun'),
    t('common.Mon'),
    t('common.Tue'),
    t('common.Wed'),
    t('common.Thu'),
    t('common.Fri'),
    t('common.Sat'),
  ]

  const WEEK_COLORS = ['#e9ab6c', '#6ba5d7', '#6fbc8a', '#c3aae7', '#6cd2bd', '#6cb9e9', '#a2cf6e']
  return {
    WEEK_LIST,
    WEEK_COLORS,
  }
}
