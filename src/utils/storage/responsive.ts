// 响应式storage
import { App } from "vue";
import Storage from "responsive-storage";

export const injectResponsiveStorage = (app: App, config: ServerConfigs) => {
  const configObj = Object.assign(
    {
      // 国际化 默认中文zh
      locale: {
        type: Object,
        default: Storage.getData(import.meta.env.VITE_APPNAME, "locale") ?? {
          locale: config.Locale ?? "zh"
        }
      },
      // layout模式以及主题
      layout: {
        type: Object,
        default: Storage.getData(import.meta.env.VITE_APPNAME, "layout") ?? {
          layout: config.Layout ?? "vertical",
          theme: config.Theme ?? "default",
          darkMode: config.DarkMode ?? false,
          sidebarStatus: config.SidebarStatus ?? true,
          epThemeColor: config.EpThemeColor ?? "#409EFF"
        }
      },
      configure: {
        type: Object,
        default: Storage.getData(import.meta.env.VITE_APPNAME, "configure") ?? {
          grey: config.Grey ?? false,
          weak: config.Weak ?? false,
          hideTabs: config.HideTabs ?? false,
          showLogo: config.ShowLogo ?? true,
          showModel: config.ShowModel ?? "-smart",
          multiTagsCache: config.MultiTagsCache ?? false
        }
      }
    },
    config.MultiTagsCache
      ? {
        // 默认显示首页tag
        tags: {
          type: Array,
          default: Storage.getData(import.meta.env.VITE_APPNAME, "tags") ?? [
            {
              path: "/welcome",
              parentPath: "/",
              meta: {
                title: "menus.homePage",
                icon: "home-filled"
              }
            }
          ]
        }
      }
      : {}
  );

  app.use(Storage, import.meta.env.VITE_APPNAME, configObj);
};
