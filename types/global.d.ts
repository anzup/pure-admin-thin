import type {AppContext, ComponentRenderProxy, PropType as VuePropType, VNode} from "vue";
import {VxeButtonProps, VxeGridProps} from "vxe-table";
import {ElForm} from "element-plus";

// GlobalComponents for Volar
declare module "vue" {
  export interface GlobalComponents {
    IconifyIconOffline: typeof import("../src/components/ReIcon")["IconifyIconOffline"];
    IconifyIconOnline: typeof import("../src/components/ReIcon")["IconifyIconOnline"];
    FontIcon: typeof import("../src/components/ReIcon")["FontIcon"];
  }
}

declare global {
  const __APP_INFO__: {
    pkg: {
      name: string;
      version: string;
      dependencies: Recordable<string>;
      devDependencies: Recordable<string>;
    };
    lastBuildTime: string;
  };
  interface Window {
    // Global vue app instance
    __APP__: App<Element>;
    webkitCancelAnimationFrame: (handle: number) => void;
    mozCancelAnimationFrame: (handle: number) => void;
    oCancelAnimationFrame: (handle: number) => void;
    msCancelAnimationFrame: (handle: number) => void;
    webkitRequestAnimationFrame: (callback: FrameRequestCallback) => number;
    mozRequestAnimationFrame: (callback: FrameRequestCallback) => number;
    oRequestAnimationFrame: (callback: FrameRequestCallback) => number;
    msRequestAnimationFrame: (callback: FrameRequestCallback) => number;
  }

  // vue
  type PropType<T> = VuePropType<T>;

  type Writable<T> = {
    -readonly [P in keyof T]: T[P];
  };

  type Nullable<T> = T | null;
  type NonNullable<T> = T extends null | undefined ? never : T;
  type Recordable<T = any> = Record<string, T>;
  type ReadonlyRecordable<T = any> = {
    readonly [key: string]: T;
  };
  type Indexable<T = any> = {
    [key: string]: T;
  };
  type DeepPartial<T> = {
    [P in keyof T]?: DeepPartial<T[P]>;
  };
  type TimeoutHandle = ReturnType<typeof setTimeout>;
  type IntervalHandle = ReturnType<typeof setInterval>;

  interface ChangeEvent extends Event {
    target: HTMLInputElement;
  }

  interface WheelEvent {
    path?: EventTarget[];
  }
  interface ImportMetaEnv extends ViteEnv {
    __: unknown;
  }

  declare interface ViteEnv {
    VITE_PORT: number;
    VITE_PUBLIC_PATH: string;
    VITE_PROXY_DOMAIN: string;
    VITE_PROXY_DOMAIN_REAL: string;
    VITE_ROUTER_HISTORY: string;
    VITE_LEGACY: boolean;
  }

  declare interface ServerConfigs {
    Version?: string;
    Title?: string;
    FixedHeader?: boolean;
    HiddenSideBar?: boolean;
    MultiTagsCache?: boolean;
    KeepAlive?: boolean;
    Locale?: string;
    Layout?: string;
    Theme?: string;
    DarkMode?: boolean;
    Grey?: boolean;
    Weak?: boolean;
    HideTabs?: boolean;
    SidebarStatus?: boolean;
    EpThemeColor?: string;
    ShowLogo?: boolean;
    ShowModel?: string;
    MapConfigure?: {
      amapKey?: string;
      options: {
        resizeEnable?: boolean;
        center?: number[];
        zoom?: number;
      };
    };
  }

  function parseInt(s: string | number, radix?: number): number;

  function parseFloat(string: string | number): number;

  namespace JSX {
    // tslint:disable no-empty-interface
    type Element = VNode;
    // tslint:disable no-empty-interface
    type ElementClass = ComponentRenderProxy;
    interface ElementAttributesProperty {
      $props: any;
    }
    interface IntrinsicElements {
      [elem: string]: any;
    }
    interface IntrinsicAttributes {
      [elem: string]: any;
    }
  }

  declare interface TableButton extends VxeButtonProps {
    name: string;
    visible?: boolean;
    type?: string;
    disabled?: boolean;
    status?: "perfect" | "primary" | "success" | "info" | "warning" | "danger";
    event?: (params?: {
      row;
      rowIndex;
      $rowIndex;
      column;
      columnIndex;
      $columnIndex;
      _columnIndex;
    }) => void;
  }
  declare type ButtonArr = Array<TableButton>;
  declare interface VxeTableAllProps extends VxeGridProps {
    buttons?: ButtonArr | ((data: any) => ButtonArr);
    form?: {
      page?: number;
      size?: number;
      total?: number;
      [_: string]: any;
    };
  }
  declare type ElFormInstance = InstanceType<typeof ElForm>;
  declare type FormItemRule = ItemRules | ItemRules[];

  export type SFCWithInstall<T> = T & Plugin;

  export type SFCInstallWithContext<T> = SFCWithInstall<T> & {
    _context: AppContext | null;
  };
}
