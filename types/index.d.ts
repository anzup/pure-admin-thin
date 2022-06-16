declare interface Fn<T = any, R = T> {
  (...arg: T[]): R;
}

declare interface PromiseFn<T = any, R = T> {
  (...arg: T[]): Promise<R>;
}

declare type RefType<T> = T | null;

declare type LabelValueOptions = {
  label: string;
  value: any;
}[];

declare type EmitType = (event: string, ...args: any[]) => void;

declare type TargetContext = "_self" | "_blank";

declare interface ComponentElRef<T extends HTMLElement = HTMLDivElement> {
  $el: T;
}

declare type ComponentRef<T extends HTMLElement = HTMLDivElement> =
  ComponentElRef<T> | null;

declare type ElRef<T extends HTMLElement = HTMLDivElement> = Nullable<T>;

declare type ForDataType<T> = {
  [P in T]?: ForDataType<T[P]>;
};

declare type AnyFunction<T> = (...args: any[]) => T;

/**
 * @param PageBase 基础分页接口
 */
declare interface PageBase {
  page?: number;
  size?: number;
  order?: string;
  sort?: string;
  total?: number;
  searchKey?: string;
  ids?: string;
  enabled?: boolean;
}
/**
 * @param DefaultPagingData 默认分页返回格式
 */
declare interface DefaultPagingData<T = any[]> {
  content: T;
  totalElements: number;
  totalPages: number;
}
/**
 * @param DefaultReturn 默认接口返回格式
 */
declare interface DefaultReturn<T = DefaultPagingData> {
  data?: T;
  code?: string;
  msg?: string;
  infos?: string;
}
/**
 * @param DefaultAllListItem 默认下拉格式
 */
declare interface DefaultAllListItem<T = number> {
  id: T;
  name: string;
}

declare interface CurrentUserInfo {
  // 用户id
  id: number;
  roles: {
    builtin: boolean;
    builtinRole:
      | "ADMIN"
      | "PLANNER"
      | "TEACHER"
      | "STUDENT"
      | "CUSTOMER_CONTACTER";
    id: number;
    name: string;
  }[];
  subsystems: ["ACC", "OPM", "FTM", "DMM", "CPM", "CTM", "CSM"];
  username: string;
  customer?: {
    id: number;
    name: string;
  };
  signatureFileUuid: string;
  phone: string;
}

/**@interface 文件类型_后端返回格式 */
declare interface ResponseFileType {
  id: number;
  name: string;
  size: number;
  suffix: string;
  url: string;
  uuid: string;
  playFilePath: string;
  fileType: string;
}
declare type FileType =
  | "JPG"
  | "JPEG"
  | "PNG"
  | "XML"
  | "PDF"
  | "EXCEL"
  | "EXCELX"
  | "DOC"
  | "DOCX"
  | "PPT"
  | "PPTX"
  | "SCORM"
  | "H5"
  | "ZIP"
  | "RAR"
  | "MOV"
  | "AVI"
  | "WMV"
  | "MP4"
  | "RMVB"
  | "MP3"
  | "WAV"
  | "UNKNOWN";
