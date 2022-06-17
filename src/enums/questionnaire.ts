/**
 * @问卷题型
 */
export enum QuestionType {
  /** @单选题 */
  SINGLE_CHOICE = "SINGLE_SELECTION",
  /** @多选题  */
  MULTIPLE_CHOICE = "MULTIPLE_SELECTION",
  /** @问答题 */
  ESSAY_QUESTION = "FILL"
}

/**
 * @问卷类型
 */

export enum Classification {
  /** @防疫问卷  */
  EPIDEMIC = "EPIDEMIC_PREVENTION",
  /** @教学问卷  */
  TEACHING = "TEACHING",
}

/**
 * @问卷状态
 */

export enum Status {
  /**@未开始 */
  NOT_STARTED = "NOT_STARTED",
  /**@进行中 */
  IN_PROGRESS = "INPROGRESS",
  /** @已过期_已完成 */
  FINISHED = "FINISHED",
  /**@已中止 */
  TERMINATED = "TERMINATED"
}

/**
 * @问卷问题验证
 */

export enum Validation {
  /**@地区 */
  AREA = "PROVINCE",
  /**@手机号 */
  PHONE = "PHONE",
  /**@日期 */
  DATE = "DATE",
  /**@整数 */
  INTEGER = "INTEGER",
  /** @邮箱 */
  EMAIL = "EMAIL",
  /**@中文 */
  CHINESE = "CHINESE",
  /**@英文 */
  ENGLISH = "ENGLISH",
  /**@不限 */
  NO = "NO_VALID"
}

/**
 * @问卷选项设置
 */
export enum OptionSetting {
  /**@正确选项 */
  CORRECT = "CORRECT_OPTION",
  /**@中止选项 */
  TERMINATION = "TERMINATION_OPTIONS",
  /**@上传附件 */
  UPLOAD = "UPLOAD_ATTACHMENTS",
}

/**
 * @问卷记录状态
 */
export enum RecordStatus {
  /**@成功 */
  SUCCESS = "SUCCESS",
  /**@失败 */
  FAIL = "FAIL",
  /**@待发送 */
  WAIT_SEND = "WAIT_SEND",
  /**@已取消 */
  CANCEL = "CANCEL"
}

/**
 * @问卷所属分类
 */
export enum SourceType {
  /**@班级学员 */
  CLASS = "CLASS",
  /**@临时学员 */
  TEMPORARY = "ORGANIZE"
}

/**
 * @问卷记录审核状态
 */
export enum AuditStatus {
  /**@待审核 */
  WAITING = "WAITING_APPROVAL",
  /**@通过 */
  APPROVED = "APPROVED",
  /**@驳回 */
  REJECTED = "REJECTED"
}

/** * @问卷记录类型 */
export enum RecordType {
  /**@公共 */
  PUBLIC = "PUBLIC",
  /**@私有 */
  INTERNAL = "INTERNAL"
}

/**@选项附件文件类型 */
export enum FileType {
  /**@图片 */
  JPG = "JPG",
  /**@文件 */
  FILE = "FILE",
  /**@行程码 */
  CODE = "TRAVEL_CODE",
  /**@健康码 */
  HEALTH_CODE = "HEALTH_CODE"
}

/**@问卷基本设置项 */
export enum ClazzSetting {
  /**@开训前发送时间 */
  SEND_TIME = "QUESTIONNAIRE_SEND_TIME",
  /**@开训前提醒时间 */
  REMIND_TIME = "QUESTIONnAIRE_REMIND_TIME",
  /**@开训前负责人提醒时间 */
  LEADER_REMIND_TIME = "QUESTIONnAIRE_REMIND_LEADER_TIME",
  /**@发送短信开始时间 */
  SEND_MSG_START_TIME = "QUESTIONNAIRE_SEND_MSG_START_TIME",
  /**@发送短信结束时间 */
  SEND_MSG_END_TIME = "QUESTIONNAIRE_SEND_MSG_END_TIME"
}

/**@问卷属性 */
export enum Property {
  /**@临时 */
  TEMPORARY = "TEMPORARY",
  /**@训前 */
  BEFORE = "BEFORE_TRAINNING"
}
