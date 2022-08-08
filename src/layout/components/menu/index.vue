<script lang="tsx">
  import type { CSSProperties } from 'vue'
  import { computed, defineComponent, toRef, unref } from 'vue'
  import { AppLogo } from '/@/components/Application'
  import { MenuModeEnum } from '/@/enums/menuEnum'
  import { useMenuSetting } from '/@/hooks/settings/useMenuSetting'
  import { useGo } from '/@/hooks/usePage'
  import { useSplitMenu } from './useLayoutMenu'
  import { openWindow } from '/@/utils'
  import { propTypes } from '/@/utils/propTypes'
  import { isUrl } from '/@/utils/is'
  import { useRootSetting } from '/@/hooks/setting/useRootSetting'
  import { useAppInject } from '/@/hooks/web/useAppInject'
  import { useDesign } from '/@/hooks/web/useDesign'

  export default defineComponent({
    name: 'LayoutMenu',
    props: {
      isHorizontal: propTypes.bool,
    },
    setup(props) {
      const go = useGo()

      const { getMenuType, getCollapsed, getAccordion, getIsHorizontal } = useMenuSetting()
      const { getShowLogo } = useRootSetting()

      const { prefixCls } = useDesign('layout-menu')

      const { menusRef } = useSplitMenu(toRef(props, 'splitType'))

      const { getIsMobile } = useAppInject()

      const getComputedMenuMode = computed(() =>
        unref(getIsMobile) ? MenuModeEnum.INLINE : props.menuMode || unref(getMenuMode),
      )

      const getComputedMenuTheme = computed(() => props.theme || unref(getMenuTheme))

      const getIsShowLogo = computed(() => unref(getShowLogo) && unref(getIsSidebarType))

      const getUseScroll = computed(() => {
        return (
          !unref(getIsHorizontal) &&
          (unref(getIsSidebarType) ||
            props.splitType === MenuSplitTyeEnum.LEFT ||
            props.splitType === MenuSplitTyeEnum.NONE)
        )
      })

      const getWrapperStyle = computed((): CSSProperties => {
        return {
          height: `calc(100% - ${unref(getIsShowLogo) ? '48px' : '0px'})`,
        }
      })

      const getLogoClass = computed(() => {
        return [
          `${prefixCls}-logo`,
          unref(getComputedMenuTheme),
          {
            [`${prefixCls}--mobile`]: unref(getIsMobile),
          },
        ]
      })

      const getCommonProps = computed(() => {
        const menus = unref(menusRef)
        // console.log(menus)
        return {
          menus,
          beforeClickFn: beforeMenuClickFn,
          items: menus,
          theme: unref(getComputedMenuTheme),
          accordion: unref(getAccordion),
          collapse: unref(getCollapsed),
          collapsedShowTitle: unref(getCollapsedShowTitle),
          onMenuClick: handleMenuClick,
        }
      })

      /**
       * click menu
       * @param menu
       */

      function handleMenuClick(path: string) {
        go(path)
      }

      /**
       * before click menu
       * @param menu
       */
      async function beforeMenuClickFn(path: string) {
        if (!isUrl(path)) {
          return true
        }
        openWindow(path)
        return false
      }

      function renderHeader() {
        if (!unref(getIsShowLogo) && !unref(getIsMobile)) return null

        return (
          <AppLogo
            showTitle={!unref(getCollapsed)}
            class={unref(getLogoClass)}
            theme={unref(getComputedMenuTheme)}
          />
        )
      }

      function renderMenu() {
        const { menus, ...menuProps } = unref(getCommonProps)
        console.log(menus)
        if (!menus || !menus.length) return null
        return !props.isHorizontal ? (
          <SimpleMenu {...menuProps} isSplitMenu={unref(getSplit)} items={menus} />
        ) : (
          <BasicMenu
            {...(menuProps as any)}
            isHorizontal={props.isHorizontal}
            type={unref(getMenuType)}
            showLogo={unref(getIsShowLogo)}
            mode={unref(getComputedMenuMode as any)}
            items={menus}
          />
        )
      }

      return () => {
        return (
          <>
            {renderHeader()}
            {unref(getUseScroll) ? (
              <ScrollContainer style={unref(getWrapperStyle)}>{() => renderMenu()}</ScrollContainer>
            ) : (
              renderMenu()
            )}
          </>
        )
      }
    },
  })
</script>
