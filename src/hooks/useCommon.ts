// 其他需要用到的通用数据
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { SyllabusItemCourseTypeEnum } from "/@/enums";

export default function useCommon() {
  const { t } = useI18n();
  /**
   * @param boolean
   */
  const booleanList = ref([
    {
      id: true,
      name: t("state.yes")
    },
    {
      id: false,
      name: t("state.no")
    }
  ]);
  /**
   * @param 性别
   */
  const genderList = ref([
    {
      name: t("state.male"),
      id: "M"
    },
    {
      name: t("state.female"),
      id: "F"
    }
  ]);
  /**
   * @param 学员类型
   */
  const studentTypeList = ref([
    {
      name: t("state.ordinary_students"),
      id: "NORMAL"
    },
    {
      name: t("state.important_students"),
      id: "VIP"
    }
  ]);
  /**
   * @param 账号状态 是否禁用
   */
  const accountStatus = ref([
    {
      name: t("state.enable"),
      id: false
    },
    {
      name: t("state.disable"),
      id: true
    }
  ]);
  /**
   * @param 符号 √ × ○ △ ◇ □ ☆ ＜ ＞
   */
  const symbolList = ref([
    {
      name: "√",
      id: "√"
    },
    {
      name: "×",
      id: "×"
    },
    {
      name: "○",
      id: "○"
    },
    {
      name: "△",
      id: "△"
    },
    {
      name: "◇",
      id: "◇"
    },
    {
      name: "□",
      id: "□"
    },
    {
      name: "☆",
      id: "☆"
    },
    {
      name: "＜",
      id: "＜"
    },
    {
      name: "＞",
      id: "＞"
    }
  ]);

  /**@param  住宿需求 */
  const roomTypeList = ref<DefaultAllListItem<string>[]>([
    {
      name: t("state.empty"),
      id: "NONE"
    },
    {
      name: t("state.singleRoom"),
      id: "SINGLE"
    },
    {
      name: t("state.doubleRoom"),
      id: "DOUBLE"
    },
    {
      name: t("state.multiHuman"),
      id: "MULTIPLE"
    }
  ]);

  /** @param 吃饭需求 */
  const dinnerList = ref<DefaultAllListItem<string>[]>([
    {
      name: t("state.breakfast"),
      id: "BREAKFAST"
    },
    {
      name: t("state.lunch"),
      id: "LUNCH"
    },
    {
      name: t("state.dinner"),
      id: "DINNER"
    }
  ]);

  /** @param 结算方式 */
  const payTypeList = ref<DefaultAllListItem<string>[]>([
    {
      name: t("state.advanceCharge"),
      id: "PRE"
    },
    {
      name: t("state.postPayment"),
      id: "POST"
    }
  ]);
  /**
   * 属性
   */
  const propertyList = ref<DefaultAllListItem<string>[]>([
    {
      name: t("state.normal"),
      id: "NORMAL"
    },
    {
      name: t("state.qualification"),
      id: "QUALIFICATION"
    }
  ]);
  /**
   * 有效、无效
   */
  const effectiveList = ref([
    {
      name: t("state.effective"),
      id: true
    },
    {
      name: t("state.notEffective"),
      id: false
    }
  ]);
  /**
   * 主讲、辅讲
   */
  const speakerList = ref([
    {
      name: t("state.speakers"),
      id: "KEYNOTE"
    },
    {
      name: t("state.uxiliarySpeakers"),
      id: "ASSISTANT"
    }
  ]);
  /**
   * 通过、未通过
   */
  const passList = ref([
    {
      name: t("state.pass"),
      id: true
    },
    {
      name: t("state.filled"),
      id: false
    }
  ]);
  /**
   * 状态-通过、未通过
   */
  const passStatusList = ref([
    {
      name: t("state.pass"),
      id: "PASSED"
    },
    {
      name: t("state.filled"),
      id: "FAILED"
    }
  ]);
  /** @param syllabusItemCourseTypeMap 课程大纲类型数据映射 */

  const syllabusItemCourseTypeMap: {
    [key in SyllabusItemCourseTypeEnum]: string
  } = {
    [SyllabusItemCourseTypeEnum.THEORY_COURSE]: t("state.theoryCourse"),
    [SyllabusItemCourseTypeEnum.THEORY_EXAM]: t("state.theoryExam"),
    [SyllabusItemCourseTypeEnum.PRACTICE_COURSE]: t("state.practiceCourse"),
    [SyllabusItemCourseTypeEnum.PRACTICE_EXAM]: t("state.practiceExam")
  };
  /**
   * 面对学员、非面对学员
   */
  const methodList = ref([
    {
      name: t("state.faceToStudent"),
      id: "FACE_STUDENT"
    },
    {
      name: t("state.notFaceToStudent"),
      id: "NOT_FACE_STUDENT"
    }
  ]);
  /**
   * 评估管理-评估状态
   */
  const evaluateStatusList = ref([
    {
      name: t("state.applyed"),
      id: "APPLIED"
    },
    {
      name: t("state.arranged"),
      id: "ARRANGED"
    },
    {
      name: t("state.evaluating"),
      id: "EVALUATING"
    },
    {
      name: t("state.evaluated"),
      id: "EVALUATED"
    },
    {
      name: t("state.confirmed"),
      id: "CONFIRMED"
    },
    // {
    //   name: t('state.finished'),
    //   id: 'FINISHED'
    // },
    {
      name: t("state.rejectedBack"),
      id: "CANCELLED"
    }
  ]);
  /**
   * 评估-评估状态
   */
  const evaluatingStatusList = ref([
    {
      name: t("state.not_started"),
      id: "NOT_START"
    },
    {
      name: t("state.evaluating"),
      id: "EVALUATING"
    },
    {
      name: t("state.finished"),
      id: "FINISHED"
    }
  ]);
  /**
   * 申报状态
   */
  const declareStatusList = ref([
    {
      name: t("state.to_be_confirmed"),
      id: "WAITING_CONFIRM"
    },
    {
      name: t("state.confirmed"),
      id: "CONFIRMED"
    },
    {
      name: t("state.rejected"),
      id: "REJECTED"
    }
  ]);
  /**
   * 班级状态
   */
  const classStatusList = ref([
    {
      name: t("state.not_started"),
      id: "NOT_STARTED"
    },
    {
      name: t("state.inProgress"),
      id: "IN_PROGRESS"
    },
    {
      name: t("state.ended"),
      id: "FINISHED"
    }
  ]);
  /**
   * 题库来源
   */
  const sourceTypesList = ref([
    {
      name: t("state.center"),
      id: "CENTER"
    },
    {
      name: t("state.customer"),
      id: "CUSTOMER"
    }
  ]);
  /**
   * 题库来源
   */
  const examQuestionBanksTypesList = ref([
    {
      name: t("state.publicQuestionBanks"),
      id: "PUBLIC"
    },
    {
      name: t("state.customerQuestionBanks"),
      id: "CUSTOMER"
    }
    // {
    //   name: t('state.customer'),
    //   id: 'TEACHER'
    // }
  ]);
  // 题型列表
  const questionTypeList = ref([
    {
      id: "FILL_BLANK",
      name: t("state.completion")
    },
    {
      id: "INDEFINITE_CHOICES",
      name: t("state.uncertainOptions")
    },
    {
      id: "JUDEGE",
      name: t("state.judgmentQuestions")
    },
    {
      id: "MULTIPLE_CHOICES",
      name: t("state.multipleChoiceQuestions")
    },
    {
      id: "SINGLE_CHOICE",
      name: t("state.singleChoiceQuestions")
    },
    {
      id: "QA",
      name: t("state.questionAndAnswer")
    }
  ]);
  // 难度
  const difficultyList = ref([
    {
      id: "EASIEST",
      name: t("state.veryEasy")
    },
    {
      id: "EASY",
      name: t("state.simple")
    },
    {
      id: "NORMAL",
      name: t("state.isNormal")
    },
    {
      id: "HARD",
      name: t("state.hard")
    },
    {
      id: "HARDEST",
      name: t("state.hardest")
    }
  ]);
  /**
   * 考试状态
   */
  const examStatusList = ref([
    {
      name: t("state.not_started"),
      id: "NOT_STARTED"
    },
    {
      name: t("state.inProgress"),
      id: "EXAMING"
    },
    {
      name: t("state.ended"),
      id: "FINISHED"
    }
  ]);
  /**
   * 阅读状态
   */
  const readStatus = ref([
    {
      id: "NOT_STARTED",
      name: t("state.not_started")
    },
    {
      id: "READING",
      name: t("state.inProgress")
    },
    {
      id: "FINISHED_IN_TIME",
      name: t("state.finishedInTime")
    },
    {
      id: "FINISHED_DELAYED",
      name: t("state.finishedDelayed")
    }
  ]);
  /**
   * 评估管理-评估状态
   */
  const arrengeStatusList = ref([
    {
      name: t("state.notScheduled"),
      id: "NOT_ARRANGE"
    },
    {
      name: t("state.arranged"),
      id: "ARRANGED"
    },
    {
      name: t("state.finished"),
      id: "FINISHED"
    }
  ]);
  return {
    booleanList,
    genderList,
    studentTypeList,
    accountStatus,
    symbolList,
    roomTypeList,
    dinnerList,
    payTypeList,
    propertyList,
    effectiveList,
    speakerList,
    passList,
    passStatusList,
    syllabusItemCourseTypeMap,
    methodList,
    evaluateStatusList,
    evaluatingStatusList,
    declareStatusList,
    classStatusList,
    sourceTypesList,
    examQuestionBanksTypesList,
    questionTypeList,
    difficultyList,
    examStatusList,
    readStatus,
    arrengeStatusList
  };
}
