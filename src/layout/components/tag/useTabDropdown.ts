import type { TabContentProps } from './types'
import { MenuEventEnum } from './types'
import type { Ref } from 'vue'
import { computed, reactive, unref } from 'vue'
import { useMultipleTabStore } from '/@/store/modules/multipleTab'
import { RouteLocationNormalized, useRouter } from 'vue-router'
import { useTabs } from '/@/hooks/useTabs'
import { useI18n } from '/@/hooks/useI18n'
import closeIcon from '/@/assets/svg/close.svg?component'
import refreshIcon from '/@/assets/svg/refresh.svg?component'
import closeAllIcon from '/@/assets/svg/close_all.svg?component'
import closeLeftIcon from '/@/assets/svg/close_left.svg?component'
import closeOtherIcon from '/@/assets/svg/close_other.svg?component'
import closeRightIcon from '/@/assets/svg/close_right.svg?component'

export function useTabDropdown(tabContentProps: TabContentProps, getIsTabs: Ref<boolean>) {
  const state = reactive({
    current: null as Nullable<RouteLocationNormalized>,
    currentIndex: 0,
  })

  const { t } = useI18n()
  const tabStore = useMultipleTabStore()
  const { currentRoute } = useRouter()
  const { refreshPage, closeAll, close, closeLeft, closeOther, closeRight } = useTabs()

  const getTargetTab = computed((): RouteLocationNormalized => {
    return unref(getIsTabs) ? tabContentProps.tabItem : unref(currentRoute)
  })

  /**
   * @description: drop-down list
   */
  const getDropMenuList = computed(() => {
    if (!unref(getTargetTab)) {
      return
    }
    const { meta } = unref(getTargetTab)
    const { path } = unref(currentRoute)

    const curItem = state.current

    const isCurItem = curItem ? curItem.path === path : false

    // Refresh button
    const index = state.currentIndex
    const refreshDisabled = !isCurItem
    // Close left
    const closeLeftDisabled = index === 0 || !isCurItem

    const disabled = tabStore.getTabList.length === 1

    // Close right
    const closeRightDisabled =
      !isCurItem || (index === tabStore.getTabList.length - 1 && tabStore.getLastDragEndIndex >= 0)
    return [
      {
        icon: refreshIcon,
        event: MenuEventEnum.REFRESH_PAGE,
        text: t('buttons.hsReload'),
        disabled: refreshDisabled,
      },
      {
        icon: closeIcon,
        event: MenuEventEnum.CLOSE_CURRENT,
        text: t('buttons.closeCurrentTab'),
        disabled: !!meta?.affix || disabled,
        divider: true,
      },
      {
        icon: closeLeftIcon,
        event: MenuEventEnum.CLOSE_LEFT,
        text: t('buttons.closeLeftTabs'),
        disabled: closeLeftDisabled,
        divider: false,
      },
      {
        icon: closeRightIcon,
        event: MenuEventEnum.CLOSE_RIGHT,
        text: t('buttons.closeRightTabs'),
        disabled: closeRightDisabled,
        divider: true,
      },
      {
        icon: closeOtherIcon,
        event: MenuEventEnum.CLOSE_OTHER,
        text: t('buttons.closeOtherTabs'),
        disabled: disabled || !isCurItem,
      },
      {
        icon: closeAllIcon,
        event: MenuEventEnum.CLOSE_ALL,
        text: t('buttons.closeAllTabs'),
        disabled: disabled,
      },
    ]
  })

  function handleContextMenu(tabItem: RouteLocationNormalized) {
    return (e: Event) => {
      if (!tabItem) {
        return
      }
      e?.preventDefault()
      const index = tabStore.getTabList.findIndex((tab) => tab.path === tabItem.path)
      state.current = tabItem
      state.currentIndex = index
    }
  }

  // Handle right click event
  function handleMenuEvent(menu): void {
    const { event } = menu
    switch (event) {
      case MenuEventEnum.REFRESH_PAGE:
        // refresh page
        refreshPage()
        break
      // Close current
      case MenuEventEnum.CLOSE_CURRENT:
        close(tabContentProps.tabItem)
        break
      // Close left
      case MenuEventEnum.CLOSE_LEFT:
        closeLeft()
        break
      // Close right
      case MenuEventEnum.CLOSE_RIGHT:
        closeRight()
        break
      // Close other
      case MenuEventEnum.CLOSE_OTHER:
        closeOther()
        break
      // Close all
      case MenuEventEnum.CLOSE_ALL:
        closeAll()
        break
    }
  }

  return { getDropMenuList, handleMenuEvent, handleContextMenu }
}
