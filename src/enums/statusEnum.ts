// 课程状态
export enum CourseStatusEnum {
  /**@param 未开始*/
  NOT_STARTED = 'NOT_STARTED',
  /**@param 实训中*/
  TRAINING = 'TRAINING',
  /**@param 已结训*/
  FINISHED = 'FINISHED',
}

export type CourseStatus = 'NOT_STARTED' | 'TRAINING' | 'FINISHED'

// 考试状态
export enum ExamStatusEnum {
  /**@param 未开始*/
  NOT_STARTED = 'NOT_STARTED',
  /**@param 考试中*/
  EXAMING = 'EXAMING',
  /**@param 考试结束*/
  FINISHED = 'FINISHED',
}
export type ExamStatus = 'NOT_STARTED' | 'EXAMING' | 'FINISHED'
