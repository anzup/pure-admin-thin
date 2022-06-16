import { AxiosPromise } from "axios";
import { TeacherGroups } from "../views/trainingPlan/courseScheduling/types";
import request from "/@/utils/request";

const url = import.meta.env.VITE_BASE_API_CPM;

/**
 *
 * @function 新增班级
 */

export const postClass = function (data) {
  return request({
    url: url + `/schedules/clazzes/${data}`,
    method: "post"
  });
};
/**
 *
 * @function 获取班级课程
 */

export const getSchedulerClass = function (params?: {
  startDate: string;
  endDate: string;
}) {
  return request({
    url: url + `/schedules/clazzes`,
    method: "get",
    params,
    P_repeatRequestCancel: false
  });
};
/**
 *
 * @function 获取班级课程
 */

export const getClassSchedules = function (id: number) {
  return request({
    url: url + `/schedules/clazzes/${id}/schedules`,
    method: "get"
  });
};
/**
 *
 * @function 获取教员课程
 */

export const getTeachersSchedules = function (params: Schedulers) {
  return request({
    url: url + `/schedules/teachers/schedules`,
    method: "get",
    params
  });
};

/**
 *
 * @function 获取设施课程
 */

export interface Schedulers<T = Date> {
  startDate: T;
  endDate: T;
}

export const getFacilitiesSchedules = function (params: Schedulers) {
  return request({
    url: url + `/schedules/facilities/schedules`,
    method: "get",
    params
  });
};

/**
 *
 * @function 分页列表
 */

export interface GetScheduler extends PageBase {
  startDate?: string;
  endDate?: string;
  freeQuery?: string;
  scheduleType?:
    | "WET_LEASE"
    | "EVALUATION"
    | "INTERNAL_TRAINING"
    | "DRY_LEASE"
    | "DISPATCH"
    | "TEACHER_SCHEDULE";
  customerId?: number;
  status?: "NOT_START" | "STARTED" | "FINISHED";
}

export const getSchedules = function (
  params: GetScheduler
): AxiosPromise<DefaultPagingData> {
  return request({
    url: url + `/schedules`,
    method: "get",
    params
  });
};

/**
 *
 * @function 添加班级课程
 */

interface Teachers extends Omit<TeacherGroups, "teachers"> {
  teachers: {
    sourceId?: number;
    trainingTeacherSource?: "SCHEDULE" | "EVALUATION";
    userId: number;
    trainingTeacherRole?:
      | "KEYNOTE"
      | "ASSISTANT"
      | "INVIGILATOR"
      | "EVALUATOR"
      | "INTERNAL_TRAINING_TEACHER"
      | "INTERNAL_TRAINING_STUDENT"
      | "PRINCIPAL";
  }[];
}

export interface PostSchedulers {
  // 改人的时候不需要这个东西
  dragType?: "NORMAL" | "REPLACE" | "COMBINE";
  // 新增时才需要
  scheduleSyllabusItemId?: number;
  endDate?: string;
  startDate?: string;
  teacherGroups?: Teachers[];
  id?: number;
  // 替换或者合并才需要,目标id
  scheduleId?: number;
  facilityIds?: number[];
  teacherScheduleTypeId?: number;
  scheduleType?:
    | "WET_LEASE"
    | "EVALUATION"
    | "INTERNAL_TRAINING"
    | "DRY_LEASE"
    | "DISPATCH"
    | "TEACHER_SCHEDULE";
  name?: string;
  remark?: string;
  courseTypeId?: number;
  customerId?: number;
  duration?: number;
  facilityTypeIds?: number[];
}

export const postSchedulers = function (data: PostSchedulers) {
  return request({
    url: url + `/schedules`,
    method: "post",
    data
  });
};

/**
 *
 * @function 修改课程
 */

export interface PutSchedulers
  extends Omit<PostSchedulers, "scheduleSyllabusItemId"> {
  id: number;
}

export const putSchedulers = function (params: PutSchedulers) {
  const { id, ...data } = params;
  return request({
    url: url + `/schedules/${id}`,
    method: "put",
    data
  });
};
/**
 *
 * @function 删除课程
 */

export const deleteSchedulers = function (id: number) {
  return request({
    url: url + `/schedules/${id}`,
    method: "delete"
  });
};

/**
 *
 * @function 修改课程时间
 */
export interface PutSchedulerDate {
  id: number;
  startDate: Date;
  endDate: Date;
}

export const putSchedulersDate = function (params: PutSchedulerDate) {
  const { id, ...data } = params;
  return request({
    url: url + `/schedules/${id}/date`,
    method: "put",
    data
  });
};

/**
 *
 * @function 删除班级模式下的色块
 */
export const deleteSchedulerCalss = function (id: number) {
  return request({
    url: url + `/schedules/${id}`,
    method: "delete"
  });
};
/**
 *
 * @function 替换设施
 */
export const putSchedulerFacility = function (
  id: number,
  oldId: number,
  newId: number
) {
  return request({
    url: url + `/schedules/${id}/facility/${oldId}/${newId}`,
    method: "put"
  });
};
/**
 *
 * @function 替换教员
 */
export const putSchedulerTeacher = function (
  id: number,
  oldId: number,
  newId: number
) {
  return request({
    url: url + `/schedules/${id}/teacher/${oldId}/${newId}`,
    method: "put"
  });
};

/**
 *
 * @function 获取教员
 */
export interface GetSchedulerTeacher extends PageBase {
  id: number;
  teachingType: string; //'KEYNOTE' | 'ASSISTANT'
}

export const getSchedulerTeacher = function (data: GetSchedulerTeacher) {
  const { id, ...params } = data;
  return request<DefaultAllListItem[]>({
    url: url + `/schedules/${id}/teachers`,
    method: "get",
    params
  });
};
/**
 *
 * @function 发布教员
 */
export const postSchedulerTimeTable = function (data: { ids: number[] }) {
  return request({
    url: url + `/schedules/timeTable`,
    method: "post",
    data
  });
};
/**
 *
 * @function 教员日程列表
 */
export const getTeacherScheduleTypes = function (
  params: PageBase
): AxiosPromise<DefaultPagingData> {
  return request({
    url: url + `/teacherScheduleTypes`,
    method: "get",
    params
  });
};
/**
 *
 * @function  教员日程新增
 */
export const postTeacherScheduleTypes = function (data: { name: string }) {
  return request({
    url: url + `/teacherScheduleTypes`,
    method: "post",
    data
  });
};
/**
 *
 * @function  教员日程修改
 */
export const putTeacherScheduleTypes = function (param: DefaultAllListItem) {
  const { id, ...data } = param;
  return request({
    url: url + `/teacherScheduleTypes/${id}`,
    method: "put",
    data
  });
};
/**
 *
 * @function  教员日程删除
 */
export const deleteTeacherScheduleTypes = function (id: number) {
  return request({
    url: url + `/teacherScheduleTypes/${id}`,
    method: "delete"
  });
};

/**
 *
 * @function  内训列表
 */

export interface InternalSelfStudis extends PageBase {
  name?: string;
  users?: string;
  deadline?: Date;
  remark?: string;
  finished?: boolean;
}

export const getInternalTrainingSelfstudies = function (
  params: InternalSelfStudis
) {
  return request<DefaultPagingData>({
    url: url + `/internalTrainingSelfstudies`,
    method: "get",
    params
  });
};
export const getInternalSelfstudieDetail = function (id: number | string) {
  return request({
    url: url + `/internalTrainingSelfstudies/${id}`,
    method: "get"
  });
};

export interface InternalTrainingSelfstudyItems {
  coursewareId: number;
  duration: number;
}

export interface PostInternalSelf
  extends Omit<InternalSelfStudis, keyof PageBase | "users"> {
  userIds: number[];
  internalTrainingSelfstudyItems: InternalTrainingSelfstudyItems[];
}

export const postInternalTrainingSelfStudies = (data: PostInternalSelf) => {
  return request({
    url: url + "/internalTrainingSelfstudies",
    method: "post",
    data
  });
};
export const putInternalTrainingSelfStudies = (
  params: PostInternalSelf & { id: number }
) => {
  const { id, ...data } = params;
  return request({
    url: url + "/internalTrainingSelfstudies/" + id,
    method: "put",
    data
  });
};
export const deleteInternalTrainingSelfStudies = (id: number) => {
  return request({
    url: url + "/internalTrainingSelfstudies/" + id,
    method: "delete"
  });
};
