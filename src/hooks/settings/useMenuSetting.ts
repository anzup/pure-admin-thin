import { useAppStoreHook } from '/@/store/modules/app'
import { computed, getCurrentInstance } from 'vue'
import { MenuModeEnum } from '/@/enums/menuEnum'
import { DeviceEnum } from '/@/enums/deviceEnum'

export function useMenuSetting() {
  const appStore = useAppStoreHook()
  const instance = computed(
    () => getCurrentInstance().appContext.app.config.globalProperties.$storage,
  )
  const getMenuType = computed<MenuModeEnum>(() => appStore.layout)
  const getIsMix = computed(() => getMenuType.value === MenuModeEnum.MIX)
  const getCollapsed = computed(() => appStore.sidebar.opened)
  const getAccordion = computed(() => true)
  const getIsHorizontal = computed(() => getMenuType.value === MenuModeEnum.HORIZONTAL)
  const getIsVertical = computed(() => getMenuType.value === MenuModeEnum.VERTICAL)
  const getIsMobile = computed(() => appStore.device === DeviceEnum.MOBILE)
  const getShowLogo = computed<boolean>(() => instance.value.configure.showLogo)
  return {
    getMenuType,
    getIsMix,
    getCollapsed,
    getAccordion,
    getIsHorizontal,
    getIsVertical,
    getIsMobile,
    getShowLogo,
  }
}
