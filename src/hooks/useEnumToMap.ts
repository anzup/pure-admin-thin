import { useI18n } from '/@/hooks/useI18n'
import { payMethodEnum } from '/@/enums/payMethodEnum'
import { transactionTypeEnum } from '/@/enums/transactionTypeEnum'

export function usePayMethod() {
  const { t } = useI18n()
  const payMethodMap: Record<keyof typeof payMethodEnum, string> = {
    [payMethodEnum.COUNT]: t('state.frequency'),
    [payMethodEnum.BALANCE]: t('state.balance'),
  }
  const transactionTypeMap: Record<keyof typeof transactionTypeEnum, string> = {
    [transactionTypeEnum.CONSUME]: t('state.consumption'),
    [transactionTypeEnum.CHARGE]: t('state.recharge'),
    [transactionTypeEnum.CHANGE_VALID_TIME]: t('state.changeTheTime'),
    [transactionTypeEnum.REVOKE]: t('state.revoke'),
  }

  return {
    payMethodMap,
    transactionTypeMap,
  }
}
