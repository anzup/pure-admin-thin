import request from "/@/utils/request";
import { AxiosRequestConfig } from "axios";

const url = import.meta.env.VITE_BASE_API_CPM;

/**
 * @function 岗位设置分页列表
 */

export type TrainingRecordType =
  | "TRAINING_RECORD"
  | "TIME_TABLE"
  | "ATTENDANCE"
  | "SELF_STUDY"
  | "GRADE"
  | "TEACHER_SIGN"
  | "TRAINING_RESULT";
export const getTrainingRecords = function (type: TrainingRecordType) {
  return request<string>({
    url: url + `/trainingRecords/templates/${type}`,
    method: "get"
  });
};
export const getTrainingRecordDetail = function (
  groupId: number,
  type: TrainingRecordType
) {
  return request<string[]>({
    url: url + `/trainingRecords/${groupId}/${type}/html`,
    method: "get"
  });
};
export interface RecordsProperties {
  name: string;
  property: string;
}

export const getTrainingRecordsProperties = function (
  type: TrainingRecordType
) {
  return request<RecordsProperties[]>({
    url: url + `/trainingRecords/templates/${type}/properties`,
    method: "get"
  });
};
export const putTrainingRecords = function (params: {
  type: TrainingRecordType;
  name: string;
}) {
  const { type, ...data } = params;
  return request({
    url: url + `/trainingRecords/templates/${type}`,
    method: "put",
    data
  });
};
/**
 * @function 获取课件-pdf
 * */

export const getTrainingRecordsPdf = (
  groupId: number,
  type: string,
  portrait: boolean = false
) => {
  return url + `/trainingRecords/${groupId}/${type}/pdf?portrait=${portrait}`;
};
/**
 * @function 获取课件-zip
 * */

export const getTrainingRecordsZip = (
  groupIds: number[],
  types: TrainingRecordType[]
): AxiosRequestConfig => {
  return {
    url: url + `/trainingRecords/pdfs/download`,
    data: {
      groupIds,
      types
    },
    method: "post"
  };
};
