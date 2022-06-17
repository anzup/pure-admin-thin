import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

export default function useTrainingRecords() {
  const { t } = useI18n()
  const trainingTypeList = ref<DefaultAllListItem<string>[]>([
    {
      id: 'TRAINING_RECORD',
      name: t('state.trainingRecords'),
    },

    {
      id: 'TIME_TABLE',
      name: t('state.timeTable'),
    },

    {
      id: 'ATTENDANCE',
      name: t('state.attendanceTable'),
    },

    {
      id: 'SELF_STUDY',
      name: t('state.selfStudyTask'),
    },

    {
      id: 'GRADE',
      name: t('state.schoolReport'),
    },

    {
      id: 'TEACHER_SIGN',
      name: t('state.signatureForm'),
    },

    {
      id: 'TRAINING_RESULT',
      name: t('state.trainingResults'),
    },
  ])
  return { trainingTypeList }
}
