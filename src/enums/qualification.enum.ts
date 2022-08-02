export default {
  /**@任务名 */
  task: {
    /**@运规申请 */
    PROVIDE_REQUEST_LOOK_UP: 'QUALIFICATION_PROVIDE_REQUEST_LOOK_UP',
    /**@运规提交 */
    SUBMISSION: 'QUALIFICATION_SUBMISSION',
    /**@资质 */
    REQUEST_LOOK_UP: 'QUALIFICATION_REQUEST_LOOK_UP',
  },
  default: {
    option: {
      file: [],
      inputValue: '',
      name: '',
      needAudit: false,
      showInput: false,
    },
    question: {
      file: [],
      fileRemark: '',
      isRequired: false,
      name: '',
      options: [],
      preCondition: '',
      showRiskArea: '',
      terminatedRemark: '',
      type: '',
    },
    classify: {
      name: '',
      questions: [],
    },
  },
  optionType: {
    /**@填空题 */
    input: 'FILL',
    /**@单选题 */
    radio: 'SINGLE_SELECTION',
    /**@多选题 */
    checkbox: 'MULTIPLE_SELECTION',
  },
  code: {
    /** @防疫问卷  */
    EPIDEMIC: 'EPIDEMIC_PREVENTION',
    /** @教学问卷  */
    TEACHING: 'TEACHING',
  },
}
