import request from "/@/utils/request";
const url = import.meta.env.VITE_BASE_API_OPM;

export interface IScheduleBuild {
    month: string;
    order?: string;
    page?: number;
    size?: number;
    searchKey: string;
    sort?: string;
    total?: number;
    resourceId?: number;
    builtinResource?: string;
    courseType?: string;
}

/**
 *
 * @param {
 * 教员课表
 * }
 */

export interface IClazzSchedules extends IScheduleBuild {
    workType?: string;
    builtinRole?: string;
}

export const getScheduleBuildEmployee = function (params: IClazzSchedules) {
    return request({
        url: url + `/scheduleBuild/employee`,
        method: "get",
        params
    });
};

/**
 *
 * @param {
 * 学员课表
 * }
 */

export const getScheduleBuildStudent = function (params: IClazzSchedules) {
    return request({
        url: url + `/scheduleBuild/student`,
        method: "get",
        params
    });
};
/**
 *
 * @param {
 * 班级课表
 * }
 */
export const getScheduleBuildClazz = function (params: IScheduleBuild) {
    return request({
        url: url + `/scheduleBuild/clazz`,
        method: "get",
        params
    });
};
/**
 *
 * @param {
 * 设备课表
 * }
 */
export const getScheduleBuildFacilitie = function (params: IScheduleBuild) {
    return request({
        url: url + `/scheduleBuild​/facilitie`,
        method: "get",
        params
    });
};
