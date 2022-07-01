import { computed, unref } from 'vue'
import { useNav } from '/@/layout/hooks/nav'
import { MenuTypeEnum } from '/@/enums/menuEnum'

export function useMenuSetting() {
  const { pureApp, isCollapse } = useNav()
  const getMenuType = computed(() => pureApp.layout)
  const getIsMixSidebar = computed(() => unref(getMenuType) === MenuTypeEnum.MIX)
  return {
    getIsMixSidebar,
    getMenuType,
    getCollapsed: isCollapse,
  }
}
