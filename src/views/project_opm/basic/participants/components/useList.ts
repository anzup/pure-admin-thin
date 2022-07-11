import { reactive } from 'vue'
import { getCustomersAll } from '/@/api/opm/customer'
import { useI18n } from 'vue-i18n'
export default function useList() {
  const { t } = useI18n()
  const state = reactive({
    clientsAllList: [],
    studentClassList: [
      {
        name: t('text.ordinary_students'),
        id: 'NORMAL',
      },
      {
        name: t('text.important_students'),
        id: 'VIP',
      },
    ],
  })
  const getCustomersAllList = async () => {
    await getCustomersAll().then((res) => {
      state.clientsAllList = res.data
    })
  }
  return {
    state,
    getCustomersAllList,
  }
}
