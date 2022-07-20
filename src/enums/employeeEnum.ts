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
   * }
   *
   */
  builtinRole = [
    'THEORY_TEACHER', // 地面理论教员
    'FLIGHT_TEACHER', // 模拟机教员
    'TRAINING_ADMIN', // 教务员
    'PLANNER', // 计划员
  ],
}
