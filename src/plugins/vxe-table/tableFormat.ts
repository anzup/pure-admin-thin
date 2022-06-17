import dayjs from 'dayjs'
import { useI18n } from 'vue-i18n'

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
    return cellValue ? t('state.disable') : t('state.enable')
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
  // 格式化课程类型 训练/考试
  formatCoursewareType({ cellValue }) {
    const { t } = useI18n()
    switch (cellValue) {
      case 'COURSE_TYPE':
        return t('state.train')

      case 'EXAM_TYPE':
        return t('state.examination')

      default:
        return ''
    }
  },
  // 格式化学员类型
  formatStudentType({ cellValue }) {
    const { t } = useI18n()
    switch (cellValue) {
      case 'NORMAL':
        return t('state.pilot')

      case 'VIP':
        return t('state.first_vip')

      case 'VIP2':
        return t('state.secondary_vip')

      case 'VIP3':
        return t('state.third_vip')

      default:
        break
    }
  },
  // 格式化结业状态
  formatGraduateStatus({ cellValue }) {
    const { t } = useI18n()
    switch (cellValue) {
      case 'GRADUATED':
        return t('state.completed')
      case 'NOT_GRADUATED':
        return t('state.not_completed')
      case 'NOT_STARTED':
        return t('state.not_started')

      default:
        break
    }
  },
  formatTeacherType({ cellValue }) {
    const { t } = useI18n()
    switch (cellValue) {
      case 'FLIGHT_TEACHER':
        return t('state.flight_instructor')
      case 'THEORY_TEACHER':
        return t('state.theory_teacher')

      default:
        return ''
    }
  },
  formatType({ cellValue }) {
    const { t } = useI18n()

    switch (cellValue) {
      case 'WET_LEASE':
        return t('state.wet_lease')
      case 'DRY_LEASE':
        return t('state.dry_lease')
      default:
        break
    }
  },
  // 格式化训练内容
  formatSyllabusType({ cellValue }) {
    const { t } = useI18n()

    switch (cellValue) {
      case 'FLIGHT_PRACTICE':
        return t('state.simulator_training_content')
      case 'GROUND_THEORY':
        return t('state.theoretical_training_content')
      default:
        break
    }
  },
  // 分钟数转 时：分
  formatMinuteToHours({ cellValue }) {
    let Hours = Math.floor(cellValue / 60)
    let Minute = cellValue % 60

    return cellValue
      ? (Hours < 10 ? '0' + Hours : Hours) + ':' + (Minute < 10 ? '0' + Minute : Minute)
      : ''
  },
  formatProperty({ cellValue }) {
    const { t } = useI18n()
    switch (cellValue) {
      case 'NORMAL':
        return t('state.normal')
      case 'QUALIFICATION':
        return t('state.qualification')
      default:
        break
    }
  },
  formatSpeakerType({ cellValue }) {
    const { t } = useI18n()
    switch (cellValue) {
      case 'KEYNOTE':
        return t('state.speakers')
      case 'ASSISTANT':
        return t('state.uxiliarySpeakers')
      default:
        break
    }
  },
  // 评估状态
  formatEvaluationStatus({ cellValue }) {
    const { t } = useI18n()
    switch (cellValue) {
      case 'APPLIED':
        return t('state.applyed')
      case 'ARRANGED':
        return t('state.arranged')
      case 'EVALUATING':
        return t('state.evaluating')
      case 'EVALUATED':
        return t('state.evaluated')
      case 'CONFIRMED':
        return t('state.confirmed')
      case 'CANCELLED':
        return t('state.rejectedBack')
      case 'CANCEL':
        return t('state.cancelled')
      //
      case 'NOT_START':
        return t('state.not_started')
      case 'FINISHED':
        return t('state.finished')
      default:
        break
    }
  },
  // 评估结果
  formatEvaluationResult({ cellValue }) {
    const { t } = useI18n()
    switch (cellValue) {
      // case 'NOT_FINISHED':
      //   return t('state.not_finished')
      case 'PASSED':
        return t('state.pass')
      case 'FAILED':
        return t('state.filled')
      default:
        break
    }
  },
  // 面对学员、非面对学员
  formatMethod({ cellValue }) {
    const { t } = useI18n()
    switch (cellValue) {
      // case 'NOT_FINISHED':
      //   return t('state.not_finished')
      case 'FACE_STUDENT':
        return t('state.faceToStudent')
      case 'NOT_FACE_STUDENT':
        return t('state.notFaceToStudent')
      default:
        break
    }
  },
  formatClassStatus({ cellValue }) {
    const { t } = useI18n()
    switch (cellValue) {
      case 'NOT_STARTED':
        return t('state.not_started')
      case 'IN_PROGRESS':
        return t('state.inProgress')
      case 'FINISHED':
        return t('state.ended')
      default:
        break
    }
  },
  formatMorning({ cellValue }) {
    const { t } = useI18n()
    switch (cellValue) {
      case 'MORNING':
        return t('state.morning')
      case 'AFERNOON':
        return t('state.afternoon')
      case 'EVENING':
        return t('state.evening')
      default:
        break
    }
  },
  formatSyllabusScheme({ cellValue }) {
    const { t } = useI18n()
    switch (cellValue) {
      case 'POSITION':
        return t('state.post')
      case 'CUSTOMER':
        return t('state.airline_company')
      case 'STUDENT_COUNT':
        return t('state.number_of_trainees')
      default:
        break
    }
  },
  formatExamStatus({ cellValue }) {
    const { t } = useI18n()
    switch (cellValue) {
      case 'NOT_STARTED':
        return t('state.not_started')
      case 'EXAMING':
        return t('state.inProgress')
      case 'FINISHED':
        return t('state.ended')
      case 'MISSED':
        return t('state.missed')
      case 'ABORTED':
        return t('state.aborted')
      default:
        break
    }
  },
  // NOT_STARTED,READING,FINISHED_IN_TIME,FINISHED_DELAYED,DELETED
  formatReadStatus({ cellValue }) {
    const { t } = useI18n()
    switch (cellValue) {
      case 'NOT_STARTED':
        return t('state.not_started')
      case 'READING':
        return t('state.inProgress')
      case 'FINISHED_IN_TIME':
        return t('state.finishedInTime')
      case 'FINISHED_DELAYED':
        return t('state.finishedDelayed')
      default:
        break
    }
  },
  // 考试结果
  formatExamResult({ cellValue }) {
    const { t } = useI18n()
    switch (cellValue) {
      case 'PASS':
        return t('state.pass')
      case 'FAILED':
        return t('state.filled')
      default:
        break
    }
  },
}
