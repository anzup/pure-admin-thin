import to from 'await-to-js'
import { reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  GetClassifications,
  getClassifications,
  getClassificationsAll,
  SendType,
} from '/@/api/questionnaire'

export default function useQuestionnaire() {
  const { t } = useI18n()
  const classificationsForm = reactive<GetClassifications>({
    page: 1,
    size: 10,
  })
  const classificationsList = ref([])
  const getClassificationsList = async () => {
    const [err, res] = await to(getClassifications(classificationsForm))
    if (err) return
    classificationsList.value = res.data.content
    classificationsForm.total = res.data.totalElements
  }
  const classificationsAllList = ref<DefaultAllListItem[]>([])
  const getClassificationsAllList = async () => {
    const [err, res] = await to(getClassificationsAll())
    if (err) return
    classificationsAllList.value = res.data
  }
  const sendTypeMap: Record<SendType, string> = {
    SEND: t('state.send'),
    REMIND: t('state.remind'),
    LEADER_REMIND: t('state.leaderRemind'),
  }

  return {
    classificationsForm,
    classificationsList,
    getClassificationsList,
    classificationsAllList,
    getClassificationsAllList,
    sendTypeMap,
  }
}
