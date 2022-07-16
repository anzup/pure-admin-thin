export interface Data {
  exam: boolean // 是否推荐考试
  status: string // 填写状态
  title: string // 飞行项目
  student: string // 学员姓名
  teacher: string // 教员
  airplaneModel: string // 飞机型号
  flyTime: string // 飞行时间
  course: string // 课程
  result: string // 结果
  trainingResultId: string // 结果
  trainingResultName: string
  evaluation: string // 评语 PD
  estimate: '' // PF
  score: string[] | number[] // 项目
  teacherUUID: string // 教员签名
  studentUUID: string // 学员签名
  auditorUUID: string
  courseNumber: number
  version: string
}
