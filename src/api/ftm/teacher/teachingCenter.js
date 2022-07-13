import http from '@/utils/http'

/**
 * 直播列表
 */
export function getLives(params){
    return http('/lives', params, 'get')
}

/**
 * 新增直播
 */
export function postLives(params){
    return http('/lives', params, 'post')
}

/**
 * 直播详情
 */
export function getpLives(params){
    return http('/lives/{id}', params, 'get_p')
}

/**
 * 修改直播
 */
export function putLives(params){
    return http('/lives/{id}', params, 'put')
}

/**
 * 删除直播
 */
export function delLives(params){
    return http('/lives/{id}', params, 'delete')
}

/**
 * 批量删除
 */
 export function delAllLives(params){
    return http('/lives/batchDelete', params, 'post')
}

/**
 * 发送聊天
 */
export function postLivesChat(params){
    return http('/lives/{id}/chat', params, 'post')
}

/**
 * 直播踢人
 */
export function postLivesOut(params){
    return http('/lives/{id}/kickOutUser', params, 'post')
}

/**
 * 强制静音
 */
export function postLivesMute(params){
    return http('/lives/{id}/mute', params, 'post')
}

/**
 * 开始录像
 */
export function postLivesStartRecord(params){
    return http('/lives/{id}/startRecord', params, 'post')
}

/**
 * 结束录像
 */
export function postLivesEndRecord(params){
    return http('/lives/{id}/stopRecord', params, 'post')
}

/**
 * 获取直播token
 */
export function getLivesToken(params){
    return http('/lives/{id}/token', params, 'get_p')
}

/**
 * 获取直播用户信息
 */
export function getLivesUserInfo(params){
    return http('/lives/{id}/userInfos', params, 'get_p')
}

/**
 * 老数据课表
 */
export function getOldScheduleClazz(params){
    return http('/oldSchedule/clazz', params, 'get')
}
export function getOldScheduleEmployee(params){
    return http('/oldSchedule/employee', params, 'get')
}
export function getOldScheduleStudent(params){
    return http('/oldSchedule/student', params, 'get')
}
export function getOldScheduleFacilitie(params){
    return http('/oldSchedule/facilitie', params, 'get')
}
/**
 * 训练结果配置
 */

export function trainingResults(params){
    return http('/trainingResults', params, 'get')
}
export function trainingResultsPost(params){
    return http('/trainingResults', params, 'post')
}
export function trainingResultsGetP(params){
    return http('/trainingResults/{id}', params, 'get_p')
}
export function trainingResultsPut(params){
    return http('/trainingResults/{id}', params, 'put')
}
export function trainingResultsDel(params){
    return http('/trainingResults/{id}', params, 'delete')
}

/**
 * 考勤管理
 */
export function getAttendances(params) {
    return http('/attendances', params, 'get');
}
export function getAttendancesId(params) {
    return http('/attendances/{id}', params, 'get_p');
}
export function postAttendancesId(params) {
    return http('/attendances/{id}/sign', params, 'post');
}
export function getAttendanceRecords(params) {
    return http('/attendances/attendanceRecords', params, 'get');
}

/**
 * 学员离队训练
 */
export function getStudentOutTrainRecords(params) {
    return http('/studentOutTrainingRecords', params, 'get')
}
export function getStudentOutTrainRecordsDetail(params) {
    return http('/studentOutTrainingRecords/{id}', params, 'get_p')
}
export function putStudentOutTrainRecords(params) {
    return http('/studentOutTrainingRecords/{id}', params, 'put')
}
export function postStudentOutTrainRecordsSign(params) {
    return http('/studentOutTrainingRecords/{id}/sign', params, 'post')
}
export function downloadStudentOutTrainRecords(params) {
    return http('/studentOutTrainingRecords/genPdfByRecords', params, "post", "json", params.download ? 1 : 'pdf' );
}

/**
 * 班级课程进度表
 */
export function getSchedulesStudents(params) {
    return http('/clazzTeachingSchedules/students/{id}', params, 'get_p');
}
export function postSchedulesStudentSign(params) {
    return http('/clazzTeachingSchedules/{id}/sign', params, 'post');
}
export function postSchedulesStudentsSign(params) {
    return http('/clazzTeachingSchedules/batchSign', params, 'post');
}
export function putSchedulesStudentSign(params) {
    return http('/clazzTeachingSchedules/{id}', params, 'put');
}
export function getStudentSchedules(params) {
    return http('/clazzTeachingSchedules/students', params, 'get')
}