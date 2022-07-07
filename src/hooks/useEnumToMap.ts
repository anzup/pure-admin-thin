import { useI18n } from '/@/hooks/useI18n'
import { payMethodEnum } from '/@/enums/payMethodEnum'

export function usePayMethod() {
  const { t } = useI18n()
  const payMethodMap: Record<keyof typeof payMethodEnum, string> = {
    [payMethodEnum.COUNT]: t('state.frequency'),
    [payMethodEnum.BALANCE]: t('state.topUp'),
  }

  return {
    payMethodMap,
  }
}
