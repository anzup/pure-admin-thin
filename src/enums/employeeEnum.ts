export enum EmployeeEnum {
  /** @param  运行公司  */
  company = 'OPERATING_COMPANY',
  /** @param 教员等级  */
  level = 'EMPLOYEE_LEVEL',
  /** @param 教员来源 */
  source = 'EMPLOYEE_SOURCE',
  /** @param 是否显示单机型 */
  airplaneType = 'QUALIFICATION_AIRPLANE_TYPE_ONE',
  /**
   * @params {
   *  array[0] 地面理论教员
   *  array[1] 模拟机教员
   *  array[2] 教务员
   *  array[3] 计划员
   *  array[4] 学员
   * }
   *
   */
  builtinRole = [
    'THEORY_TEACHER', // 地面理论教员
    'FLIGHT_TEACHER', // 模拟机教员
    'TRAINING_ADMIN', // 教务员
    'PLANNER', // 计划员
    'CUSTOMER_CONTACTOR', // 客户联络员
    'AVIATION_INSPECTOR', // 民航局监察员
    'INSPECTOR', // 检查员
  ],
}

export type AccountType = 'EMPLOYEE' | 'STUDENT'
export type EmployeeRole =
  | 'THEORY_TEACHER'
  | 'FLIGHT_TEACHER'
  | 'TRAINING_ADMIN'
  | 'PLANNER'
  | 'CUSTOMER_CONTACTOR'
  | 'AVIATION_INSPECTOR'
  | 'INSPECTOR'
