import to from 'await-to-js'
import { ref, reactive } from 'vue'
import { SchedulerItem } from '../views/trainingPlan/courseScheduling/types'
import { getSchedules, GetScheduler } from '/@/api/scheduler'
import { useI18n } from 'vue-i18n'
// 培训人员类型Map
export type TrainingTeacherRole =
  | 'KEYNOTE'
  | 'ASSISTANT'
  | 'INVIGILATOR'
  | 'EVALUATOR'
  | 'INTERNAL_TRAINING_TEACHER'
  | 'INTERNAL_TRAINING_STUDENT'
  | 'PRINCIPAL'
export default function useScheduler() {
  const { t } = useI18n()
  const schedulerList = ref<SchedulerItem[]>([])
  const schedulerForm = reactive<GetScheduler>({
    page: 1,
    size: 10,
    total: 0,
  })
  const getSchedulerList = async () => {
    const [err, res] = await to(getSchedules(schedulerForm))
    if (!err) {
      schedulerList.value = res.data.content
      schedulerForm.total = res.data.totalElements
    }
  }
  const schedulerStatusList = ref<DefaultAllListItem<string>[]>([
    {
      id: 'NOT_START',
      name: t('state.not_started'),
    },
    {
      id: 'STARTED',
      name: t('state.inProgress'),
    },
    {
      id: 'FINISHED',
      name: t('state.ended'),
    },
  ])

  const trainingTeacherRoleMap: Record<TrainingTeacherRole, string> = {
    KEYNOTE: t('state.keynot'),
    ASSISTANT: t('state.assistan'),
    INVIGILATOR: t('state.invigilaor'),
    EVALUATOR: t('state.evaluator'),
    INTERNAL_TRAINING_TEACHER: t('state.internalTrainingTeacher'),
    INTERNAL_TRAINING_STUDENT: t('state.internalTrainingStudent'),
    PRINCIPAL: t('state.principal'),
  }
  return {
    schedulerList,
    schedulerForm,
    getSchedulerList,
    schedulerStatusList,
    trainingTeacherRoleMap,
  }
}
