import to from 'await-to-js'
import { ref } from 'vue'
import { getCurrency } from '/@/api/currency'

export default function useCurrency() {
  const currencyList = ref<DefaultAllListItem[]>([])
  const getCurrencyList = async () => {
    const [err, res] = await to(getCurrency())
    if (err) return
    currencyList.value = res.data
  }
  return {
    currencyList,
    getCurrencyList,
  }
}
