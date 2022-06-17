import to from 'await-to-js'
import { ref } from 'vue'
import { getEvaluationItemsList, getEvaluationTypesList } from '/@/api/evaluation'

export default function useList() {
  const evaluationItemsList = ref([])
  const evaluationTypes = ref([])
  /**
   * 项目类型
   */
  const getEvaluationItems = async () => {
    const [err, res] = await to(getEvaluationItemsList({ size: 1000 }))
    if (err) return
    evaluationItemsList.value = res.data.content
  }
  /**
   * 评估类型
   */
  const getEvaluationTypes = async () => {
    const [err, res] = await to(getEvaluationTypesList({ size: 1000 }))
    if (err) return
    evaluationTypes.value = res.data.content
  }

  return {
    evaluationItemsList,
    getEvaluationItems,
    getEvaluationTypes,
    evaluationTypes,
  }
}
