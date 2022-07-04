import dayjs from 'dayjs'
import { useI18n } from '/@/hooks/useI18n'

export default {
  // 格式化时间
  formatDate({ cellValue }) {
    return cellValue ? dayjs(cellValue).format('YYYY-MM-DD') : ''
  },
  formatDateTime({ cellValue }) {
    return cellValue ? dayjs(cellValue).format('YYYY-MM-DD HH:mm:ss') : ''
  },
  formatStatus({ cellValue }) {
    const { t } = useI18n()
    return cellValue ? t('buttons.disable') : t('buttons.enable')
  },
  formatGender({ cellValue }) {
    const { t } = useI18n()
    return cellValue == 'M' ? t('state.male') : t('state.female')
  },
  formatBool({ cellValue }) {
    const { t } = useI18n()
    switch (cellValue) {
      case true:
        return t('state.yes')

      case false:
        return t('state.no')

      default:
        return ''
    }
  },
  // 分钟数转 时：分
  formatMinuteToHours({ cellValue }) {
    const Hours = Math.floor(cellValue / 60)
    const Minute = cellValue % 60

    return cellValue
      ? (Hours < 10 ? '0' + Hours : Hours) + ':' + (Minute < 10 ? '0' + Minute : Minute)
      : ''
  },
}
