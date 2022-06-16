/*
 * @Author: 冉茂廷 1012377328@qq.com
 * @Date: 2022-05-05 17:24:28
 * @LastEditors: 冉茂廷 1012377328@qq.com
 * @LastEditTime: 2022-05-26 14:48:30
 * @FilePath: \crew-web\src\api\file.ts
 * @Description:
 *
 * Copyright (c) 2022 by 冉茂廷 1012377328@qq.com, All Rights Reserved.
 */
import {AxiosPromise} from "axios";
import request from "/@/utils/request";

const pubUrl = import.meta.env.VITE_BASE_API_PUB;
const url = import.meta.env.VITE_BASE_API_CPM;

// 开放接口下载文件
export const getOpenDownload = function (uuid: string) {
  // const url= '/quality/attachment/{attachmentId}/fileExists';
  return request({
    url: pubUrl + `/open/${uuid}/download`,
    method: "get",
    responseType: "blob"
  });
};

/**
 * 获取文件信息
 */
export function getfileInfo(uuid: string): AxiosPromise<ResponseFileType> {
  return request({
    url: pubUrl + "/files/" + uuid,
    method: "get"
  });
}

/**
 * 批量获取文件信息
 * @param {String} uuids 逗号分割
 */
export function getfileInfoList(params: {
  uuids: string;
}): AxiosPromise<ResponseFileType[]> {
  return request({
    url: pubUrl + "/files/list",
    method: "get",
    params
  });
}

/**
 * 文件上传
 */
export interface UploadFile {
  file: File;
  path: string;
  unzip: boolean;
}

export function postFileUpload(
  file: File,
  unzip?: boolean,
  P_repeatRequestCancel = false
) {
  const data = new FormData();
  data.append("file", file);
  if (unzip)
    data.append("unzip", String(file.type === "application/x-zip-compressed"));
  return request({
    url: pubUrl + `/files/upload`,
    method: "post",
    headers: { "Content-Type": "multipart/form-data" },
    data,
    P_repeatRequestCancel
  });
}

/**
 * 文件批量上传
 */

export function postFilesUpload(files: File[]) {
  const data = new FormData();
  for (const file of files) {
    data.append("files", file);
  }
  return request({
    url: pubUrl + `/files/uploads`,
    method: "post",
    headers: { "Content-Type": "multipart/form-data" },
    data
  });
}

/**
 * 预览文件（返回url）
 */
export function previewURL(uuid: string) {
  return import.meta.env.VITE_BASE_URL + `${pubUrl}/open/${uuid}/inline`;
}
/**
 * 预览文件（返回流）
 */
export function filePreview(uuid: string) {
  return request({
    url: pubUrl + `/files/${uuid}/download`,
    method: "get",
    responseType: "blob"
  });
}

export type AccessControls = {
  accesses?: string;
  type: string;
};

export interface FolderItem {
  accessControls: AccessControls[];
  id: number;
  name: string;
  path: string;
  uuid: string;
}

export interface Folder {
  folderListVOS: FolderItem[];
  parentId: number;
  parentUuid: string;
  path: string;
}

/**
 * 获取文件夹列表
 */
export function getFolders(folderType: string): AxiosPromise<Folder> {
  return request({
    url: url + `/folders`,
    method: "get",
    params: {
      folderType
    }
  });
}

export interface Resources extends Omit<FolderItem, "path"> {
  fileUuid: string;
  size: number;
  suffix: string;
}

export interface FolderDetail
  extends Omit<Folder, "folderListVOS">,
    DefaultAllListItem {
  accessControls: AccessControls[];
  folders: FolderItem[];
  resources: Resources[];
  uuid: string;
}

/**
 * 获取文件夹详情
 */
export function getFolderDetail(uuid: string): AxiosPromise<FolderDetail> {
  return request({
    url: url + `/folders/${uuid}`,
    method: "get"
  });
}

/**
 * 新建文件夹
 */

export interface PostFolder
  extends PartialOptional<Omit<FolderItem, "path" | "uuid">, "id"> {
  parentUuid: string;
}

export function postFolders(data: PostFolder) {
  return request({
    url: url + `/folders`,
    method: "post",
    data
  });
}

/**
 * @function 删除文件夹
 * */
export function deleteFolders(uuid: string) {
  return request({
    url: url + `/folders/${uuid}`,
    method: "delete"
  });
}

/**
 * @function 删除文件
 * */
export function deleteFileResources(uuid: string) {
  return request({
    url: url + `/fileResources/${uuid}`,
    method: "delete"
  });
}

/**
 * @function 修改文件夹
 * */
export type PutFolder = Omit<FolderItem, "path" | "id">;

export function putFolders(params: PutFolder) {
  const { uuid, ...data } = params;
  return request({
    url: url + `/folders/${uuid}`,
    method: "put",
    data
  });
}

/**
 * @function 修改文件
 * */
export function putFileResources(params: Omit<PutFolder, "accessControls">) {
  const { uuid, ...data } = params;
  return request({
    url: url + `/fileResources/${uuid}`,
    method: "put",
    data
  });
}

/**
 * 向文件夹里面添加资源
 */

export interface FileResources {
  fileUuid: string;
  folderUuid: string;
  name: string;
}

export function postFileResources(data: FileResources[]) {
  return request({
    url: url + `/fileResources/batchAdd`,
    method: "post",
    data
  });
}
