import { useI18n } from 'vue-i18n'
export default function useTeacher() {
  const { t } = useI18n()
  /**
   * 教员类型
   */
  const ETeacherType = {
    FLIGHT_TEACHER: t('text.flight_instructor'),
    THEORY_TEACHER: t('text.theory_teacher'),
  }
  /**
   * 工作属性
   */
  const EWorkType = {
    FULL_TIME: t('text.full_time_teacher'),
    PART_TIME: t('text.external_faculty'),
  }
  return {
    ETeacherType,
    EWorkType,
  }
}
