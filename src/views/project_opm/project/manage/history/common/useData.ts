import { ref } from 'vue'
import { getContractsAll } from '/@/api/opm/contract'
import { useI18n } from 'vue-i18n'
export default function useData() {
  const { t } = useI18n()
  const contractList = ref<any[]>([])
  const getTypeList = async () => {
    await getContractsAll().then((res) => {
      contractList.value = res.data
    })
  }
  const formatContracts = ({ cellValue }: { cellValue: number[] }) => {
    return contractList.value
      .filter((v) => cellValue?.some((i) => i == v.id))
      .map((v) => v.name)
      .join()
  }
  const formatType = ({ cellValue }) => {
    switch (cellValue) {
      case 'WET_LEASE':
        return t('text.wet_lease')
      case 'DRY_LEASE':
        return t('text.dry_lease')

      default:
        break
    }
  }
  return {
    contractList,
    getTypeList,
    formatContracts,
    formatType,
  }
}
