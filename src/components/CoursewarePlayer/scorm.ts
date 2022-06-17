import dayjs from 'dayjs'
import { postCoursewaresIdPlayProgress } from '/@/api/coursewares'
// import {
//   convertTotalSeconds
// } from '@/utils/index'
/**
 *
 * 更新播放进度
 * @export
 * @param {String} CMIElement
 * @param {String} value
 */
export const setLMSValue = function (CMIElement, value, progress) {
  console.log('CMIElement, value', CMIElement, value)
  // 1.2 2004
  if (CMIElement == 'cmi.completion_status' || CMIElement == 'cmi.core.lesson_status') {
    // 学习状态 完成
    if (value == 'completed') {
      console.log('阅读完成')
      postCoursewaresIdPlayProgress({
        id: sessionStorage.getItem('scormId'),
        coursewareId: sessionStorage.getItem('scormId'),
        finished: true,
        duration: 0,
        progress: progress,
      })
    } else {
      postCoursewaresIdPlayProgress({
        id: sessionStorage.getItem('scormId'),
        coursewareId: sessionStorage.getItem('scormId'),
        finished: false,
        duration: 0,
        progress: progress,
      })
    }
  } else if (CMIElement == 'cmi.session_time' || CMIElement == 'cmi.core.session_time') {
    // 学习时间  PT14M37.63S
    let duration = 0
    let oldTime = sessionStorage.getItem('scormStartTime')
    if (oldTime && !Number.isNaN(new Date(oldTime).getTime())) {
      duration = Math.ceil((dayjs().valueOf() - dayjs(oldTime).valueOf()) / 1000)
    } else {
      duration = 0
    }

    console.log('readtime', duration)
    sessionStorage.setItem('scormStartTime', new Date().toISOString())
    // 若修改了系统时间，计算时长超过7s统一取7s
    if (duration > 7) {
      duration = 7
    }
    postCoursewaresIdPlayProgress({
      id: sessionStorage.getItem('scormId'),
      coursewareId: sessionStorage.getItem('scormId'),
      finished: false,
      duration,
      progress: progress,
    })
  } else if (CMIElement == 'cmi.location' || CMIElement == 'cmi.core.lesson_location') {
    // I:11,15;C:0,0,1;0,1,1;11,14,0;11,1,1;
    postCoursewaresIdPlayProgress({
      id: sessionStorage.getItem('scormId'),
      coursewareId: sessionStorage.getItem('scormId'),
      finished: false,
      duration: 0,
      progress: progress,
    })
  } else if (CMIElement == 'finish') {
    console.log('finish', 72)
    return false
  }
}
