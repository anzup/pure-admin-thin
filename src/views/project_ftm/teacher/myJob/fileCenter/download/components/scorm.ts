import { postCoursewaresIdPlayProgress } from '/@/api/ftm/teacher/courseware'
import { convertTotalSeconds } from '/@/utils/index'
/**
 *
 * 更新播放进度
 * @export
 * @param {String} CMIElement
 * @param {String} value
 */
export const setLMSValue = function (CMIElement, value) {
  console.log('CMIElement, value', CMIElement, value)
  // 1.2 2004
  if (CMIElement == 'cmi.completion_status' || CMIElement == 'cmi.core.lesson_status') {
    // 学习状态 完成
    if (value == 'completed') {
      // postCoursewaresIdPlayProgress({
      //   id: sessionStorage.getItem('scormId'),
      //   coursewareId: sessionStorage.getItem('scormId'),
      //   finished: true,
      //   duration: 0,
      //   progress: '',
      // })
    } else {
      // postCoursewaresIdPlayProgress({
      //   id: sessionStorage.getItem('scormId'),
      //   coursewareId: sessionStorage.getItem('scormId'),
      //   finished: false,
      //   duration: 0,
      //   progress: '',
      // })
    }
  } else if (CMIElement == 'cmi.session_time' || CMIElement == 'cmi.core.session_time') {
    // 学习时间  PT14M37.63S
    console.log('convertTotalSeconds', convertTotalSeconds(value))
    const p = new Promise((resolve, reject) => {
      if (sessionStorage.getItem('scormDuration')) {
        const scormDuration = sessionStorage.getItem('scormDuration')
        const duration = convertTotalSeconds(value) - Number(scormDuration)
        sessionStorage.setItem('scormDuration', duration)
      } else {
        sessionStorage.setItem('scormDuration', convertTotalSeconds(value))
      }
      resolve()
    })

    p.then(() => {
      const scormDuration1 = sessionStorage.getItem('scormDuration')
      // postCoursewaresIdPlayProgress({
      //   id: sessionStorage.getItem('scormId'),
      //   coursewareId: sessionStorage.getItem('scormId'),
      //   finished: false,
      //   duration: Number(scormDuration1),
      //   progress: '',
      // })
    })
  } else if (CMIElement == 'cmi.location' || CMIElement == 'cmi.core.lesson_location') {
    // I:11,15;C:0,0,1;0,1,1;11,14,0;11,1,1;
    // postCoursewaresIdPlayProgress({
    //   id: sessionStorage.getItem('scormId'),
    //   coursewareId: sessionStorage.getItem('scormId'),
    //   finished: false,
    //   duration: 0,
    //   progress: value,
    // })
  } else if (CMIElement == 'finish') {
    console.log('finish', 72)
    return false
  }
}
