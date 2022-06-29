<script lang="ts" setup>
  import {
    ref,
    watch,
    unref,
    toRaw,
    reactive,
    nextTick,
    computed,
    CSSProperties,
    onBeforeMount,
    getCurrentInstance,
  } from 'vue'

  import { useI18n } from 'vue-i18n'
  import { emitter } from '/@/utils/mitt'
  import { storageLocal } from '/@/utils/storage'
  import { RouteLocationNormalized, RouteMeta, useRoute, useRouter } from 'vue-router'
  import { isEqual } from 'lodash-unified'

  import { useSettingStoreHook } from '/@/store/modules/settings'

  import { toggleClass, removeClass } from '/@/utils/operate'
  import { templateRef, useResizeObserver, useDebounceFn } from '@vueuse/core'
  import { useMultipleTabStoreHook } from '/@/store/modules/multipleTab'
  import { REDIRECT_NAME } from '/@/router/constant'
  import { listenerRouteChange } from '/@/utils/mitt/routeChange'
  import { useUserStoreHook } from '/@/store/modules/user'
  import { useGo } from '/@/hooks/usePage'
  import { initAffixTabs } from '/@/layout/components/tag/useMultipleTabs'

  import TagContent from './tagContent.vue'
  import { TabContentProps } from '/@/layout/components/tag/types'

  import { useTabDropdown } from '/@/layout/components/tag/useTabDropdown'

  const { t } = useI18n()
  const route = useRoute()
  const router = useRouter()
  const translateX = ref<number>(0)
  const activeIndex = ref<number>(-1)
  let refreshButton = 'refresh-button'
  const instance = getCurrentInstance()
  const pureSetting = useSettingStoreHook()
  const tabDom = templateRef<HTMLElement | null>('tabDom', null)
  const containerDom = templateRef<HTMLElement | null>('containerDom', null)
  const scrollbarDom = templateRef<HTMLElement | null>('scrollbarDom', null)
  const showTags = ref(storageLocal.getItem('-configure').hideTabs) ?? 'false'

  const tabStore = useMultipleTabStoreHook()
  const userStore = useUserStoreHook()
  const activeKeyRef = ref('')
  const go = useGo()
  //初始化固定路由
  initAffixTabs()
  const getTabsState = computed(() => {
    return tabStore.getTabList.filter((item) => !item.meta?.hideTab)
  })

  listenerRouteChange((route) => {
    const { name } = route
    if (name === REDIRECT_NAME || !route || !userStore.getToken) {
      return
    }

    const { path, fullPath, meta = {} } = route
    const { currentActiveMenu, hideTab } = meta as RouteMeta
    const isHide = !hideTab ? null : currentActiveMenu
    const p = isHide || fullPath || path
    if (activeKeyRef.value !== p) {
      activeKeyRef.value = p as string
    }

    if (isHide) {
      const findParentRoute = router.getRoutes().find((item) => item.path === currentActiveMenu)

      findParentRoute && tabStore.addTab(findParentRoute as unknown as RouteLocationNormalized)
    } else {
      tabStore.addTab(unref(route))
    }
  })

  const handleChange = (activeKey: any) => {
    activeKeyRef.value = activeKey
    go(activeKey, false)
  }
  const unClose = computed(() => unref(getTabsState).length === 1)

  // Close the current tab
  function handleEdit(targetKey: string) {
    // Added operation to hide, currently only use delete operation
    if (unref(unClose)) {
      return
    }

    tabStore.closeTabByKey(targetKey, router)
  }

  const dynamicTagView = () => {
    const index = getTabsState.value.findIndex((item) => {
      if (item?.query) {
        return isEqual(route?.query, item?.query)
      } else {
        return item.path === route.path
      }
    })
    moveToView(index)
  }

  watch([route], () => {
    activeIndex.value = -1
    dynamicTagView()
  })

  useResizeObserver(
    scrollbarDom,
    useDebounceFn(() => {
      dynamicTagView()
    }, 200),
  )

  const tabNavPadding = 10
  const moveToView = (index: number): void => {
    if (!instance.refs['dynamic' + index]) {
      return
    }
    const tabItemEl = instance.refs['dynamic' + index][0]
    const tabItemElOffsetLeft = (tabItemEl as HTMLElement)?.offsetLeft
    const tabItemOffsetWidth = (tabItemEl as HTMLElement)?.offsetWidth
    // 标签页导航栏可视长度（不包含溢出部分）
    const scrollbarDomWidth = scrollbarDom.value ? scrollbarDom.value?.offsetWidth : 0
    // 已有标签页总长度（包含溢出部分）
    const tabDomWidth = tabDom.value ? tabDom.value?.offsetWidth : 0

    if (tabDomWidth < scrollbarDomWidth || tabItemElOffsetLeft === 0) {
      translateX.value = 0
    } else if (tabItemElOffsetLeft < -translateX.value) {
      // 标签在可视区域左侧
      translateX.value = -tabItemElOffsetLeft + tabNavPadding
    } else if (
      tabItemElOffsetLeft > -translateX.value &&
      tabItemElOffsetLeft + tabItemOffsetWidth < -translateX.value + scrollbarDomWidth
    ) {
      // 标签在可视区域
      translateX.value = Math.min(
        0,
        scrollbarDomWidth - tabItemOffsetWidth - tabItemElOffsetLeft - tabNavPadding,
      )
    } else {
      // 标签在可视区域右侧
      translateX.value = -(
        tabItemElOffsetLeft -
        (scrollbarDomWidth - tabNavPadding - tabItemOffsetWidth)
      )
    }
  }

  const handleScroll = (offset: number): void => {
    const scrollbarDomWidth = scrollbarDom.value ? scrollbarDom.value?.offsetWidth : 0
    const tabDomWidth = tabDom.value ? tabDom.value.offsetWidth : 0
    if (offset > 0) {
      translateX.value = Math.min(0, translateX.value + offset)
    } else {
      if (scrollbarDomWidth < tabDomWidth) {
        if (translateX.value >= -(tabDomWidth - scrollbarDomWidth)) {
          translateX.value = Math.max(translateX.value + offset, scrollbarDomWidth - tabDomWidth)
        }
      } else {
        translateX.value = 0
      }
    }
  }

  // 显示模式，默认灵动模式显示
  const showModel = ref(storageLocal.getItem('-configure')?.showModel || 'smart')
  if (!showModel.value) {
    const configure = storageLocal.getItem('-configure')
    configure.showModel = 'card'
    storageLocal.setItem('-configure', configure)
  }

  let visible = ref(false)
  let buttonLeft = ref(0)
  let buttonTop = ref(0)

  // 重新加载
  function onFresh() {
    toggleClass(true, refreshButton, document.querySelector('.rotate'))
    const { fullPath, query } = unref(route)
    router.replace({
      path: '/redirect' + fullPath,
      query: query,
    })
    setTimeout(() => {
      removeClass(document.querySelector('.rotate'), refreshButton)
    }, 600)
  }

  function handleCommand(command: object) {
    console.log(command)
    // @ts-expect-error
    const { item } = command
    handleMenuEvent(item)
  }

  function closeMenu() {
    visible.value = false
  }

  watch(
    () => visible.value,
    (val) => {
      if (val) {
        document.body.addEventListener('click', closeMenu)
      } else {
        document.body.removeEventListener('click', closeMenu)
      }
    },
  )

  onBeforeMount(() => {
    if (!instance) return

    // 触发隐藏标签页
    emitter.on('tagViewsChange', (key) => {
      if (unref(showTags) === key) return
      showTags.value = key
    })

    // 改变标签风格
    emitter.on('tagViewsShowModel', (key) => {
      showModel.value = key
    })
  })

  const getTabStyle = computed((): CSSProperties => {
    return {
      transform: `translateX(${translateX.value}px)`,
    }
  })

  const getContextMenuStyle = computed((): CSSProperties => {
    return { left: buttonLeft.value + 'px', top: buttonTop.value + 'px' }
  })

  const getIsTabs = ref(true)
  const tabDropdownProps = reactive<TabContentProps>({
    tabItem: undefined,
  })
  const { getDropMenuList, handleMenuEvent, handleContextMenu } = useTabDropdown(
    tabDropdownProps,
    getIsTabs,
  )

  function openMenu(e) {
    closeMenu()

    const menuMinWidth = 105
    const offsetLeft = unref(containerDom).getBoundingClientRect().left
    const offsetWidth = unref(containerDom).offsetWidth
    const maxLeft = offsetWidth - menuMinWidth
    const left = e.clientX - offsetLeft + 5
    if (left > maxLeft) {
      buttonLeft.value = maxLeft
    } else {
      buttonLeft.value = left
    }
    pureSetting.hiddenSideBar ? (buttonTop.value = e.clientY) : (buttonTop.value = e.clientY - 40)
    nextTick(() => {
      visible.value = true
    })
  }

  const handleContext = (e: Event, tabItem: RouteLocationNormalized, whetherToExclude = false) => {
    tabDropdownProps.tabItem = tabItem
    getIsTabs.value = true
    handleContextMenu(tabItem)(e)
    if (!whetherToExclude) openMenu(e)
  }
</script>

<template>
  <div v-if="!showTags" ref="containerDom" class="tags-view">
    <div class="arrow-left">
      <IconifyIconOffline icon="arrow-left-s-line" @click="handleScroll(200)" />
    </div>
    <div ref="scrollbarDom" class="scroll-container">
      <div ref="tabDom" :style="getTabStyle" class="tab">
        <TagContent
          v-for="(item, index) in getTabsState"
          :key="index"
          :activeKeyRef="activeKeyRef"
          :content="item"
          :showModel="showModel"
          @change="handleChange"
          @close="handleEdit"
          @handleContext="(e) => handleContext(e, item)"
        />
      </div>
    </div>
    <span class="arrow-right">
      <IconifyIconOffline icon="arrow-right-s-line" @click="handleScroll(-200)" />
    </span>
    <!-- 右键菜单按钮 -->
    <transition name="el-zoom-in-top">
      <ul v-show="visible" :key="Math.random()" :style="getContextMenuStyle" class="contextmenu">
        <li
          v-for="(item, key) in getDropMenuList"
          :key="key"
          :class="[
            item.disabled ? 'grayscale text-gray-400 !cursor-not-allowed' : '',
            'select-none',
          ]"
        >
          <div class="flex items-center" @click="handleMenuEvent(item)">
            <component :is="item.icon" :key="key" />
            {{ item.text }}
          </div>
        </li>
      </ul>
    </transition>
    <!-- 右侧功能按钮 -->
    <ul class="right-button">
      <li>
        <span
          :title="t('buttons.refreshRoute')"
          class="el-icon-refresh-right rotate"
          @click="onFresh"
        >
          <IconifyIconOffline icon="refresh-right" />
        </span>
      </li>
      <li>
        <el-dropdown placement="bottom-end" trigger="click" @command="handleCommand">
          <div
            class="w-10 h-10 flex justify-center items-center"
            @click="handleContext($event, $route, true)"
          >
            <IconifyIconOffline icon="arrow-down" />
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item
                v-for="(item, key) in getDropMenuList"
                :key="key"
                :command="{ key, item }"
                :disabled="item.disabled"
                :divided="item.divider"
              >
                <component :is="toRaw(item.icon)" :key="key" style="margin-right: 6px" />
                {{ item.text }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </li>
      <li>
        <slot></slot>
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
  @import './index.scss';
</style>
