<script lang="tsx">
  import type { CSSProperties, PropType } from 'vue'
  import { computed, defineComponent, unref } from 'vue'
  import { BasicMenu } from '/@/components/Menu'
  // import { SimpleMenu } from '/@/components/SimpleMenu'
  import { AppLogo } from '/@/components/Application'

  import { MenuModeEnum } from '/@/enums/menuEnum'

  import { useMenuSetting } from '/@/hooks/settings/useMenuSetting'

  import { useGo } from '/@/hooks/usePage'
  import { useSplitMenu } from './useLayoutMenu'
  import { openWindow } from '/@/utils'
  import { propTypes } from '/@/utils/propTypes'
  import { isUrl } from '/@/utils/is'

  export default defineComponent({
    name: 'LayoutMenu',
    props: {
      isHorizontal: propTypes.bool,
      menuMode: {
        type: String as PropType<Nullable<MenuModeEnum>>,
        default: '',
      },
    },
    setup(props) {
      const go = useGo()

      const {
        getMenuType,
        getCollapsed,
        getAccordion,
        getIsHorizontal,
        getIsVertical,
        getIsMobile,
        getShowLogo,
      } = useMenuSetting()

      const { menusRef } = useSplitMenu()

      const getIsShowLogo = computed(() => unref(getShowLogo) && unref(getIsVertical))

      const getUseScroll = computed(() => {
        return !unref(getIsHorizontal)
      })

      const getWrapperStyle = computed((): CSSProperties => {
        return {
          height: `calc(100% - ${unref(getIsShowLogo) ? '48px' : '0px'})`,
        }
      })

      const getCommonProps = computed(() => {
        const menus = unref(menusRef)
        return {
          menus,
          beforeClickFn: beforeMenuClickFn,
          items: menus,
          accordion: unref(getAccordion),
          collapse: unref(getCollapsed),
          onMenuClick: handleMenuClick,
        }
      })

      /**
       * click menu
       * @param path
       */

      function handleMenuClick(path: string) {
        go(path)
      }

      /**
       * before click menu
       * @param path
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

        return <AppLogo showTitle={!unref(getCollapsed)} />
      }

      function renderMenu() {
        const { menus, ...menuProps } = unref(getCommonProps)
        // console.log(menus)
        if (!menus || !menus.length) return null
        return (
          <BasicMenu
            {...(menuProps as any)}
            isHorizontal={props.isHorizontal}
            type={unref(getMenuType)}
            showLogo={unref(getIsShowLogo)}
            items={menus}
          />
        )
      }

      return () => {
        return (
          <>
            {renderHeader()}
            {unref(getUseScroll) ? (
              <el-scrollbar style={getWrapperStyle}>{() => renderMenu()}</el-scrollbar>
            ) : (
              renderMenu()
            )}
          </>
        )
      }
    },
  })
</script>
