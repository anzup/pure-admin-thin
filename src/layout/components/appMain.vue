<script lang="ts" setup>
  import { h, ref, computed, Transition, defineComponent, getCurrentInstance } from 'vue'
  import BackTop from '/@/assets/svg/back_top.svg?component'
  import { usePermissionStoreHook } from '/@/store/modules/permission'

  const props = defineProps({
    fixedHeader: Boolean,
  })
  const keepAlive: Boolean = ref(
    getCurrentInstance().appContext.config.globalProperties.$config?.KeepAlive,
  )
  const instance = getCurrentInstance().appContext.app.config.globalProperties.$storage

  const transitions = computed(() => {
    return (route) => {
      return route.meta.transition
    }
  })

  const hideTabs = computed(() => {
    return instance?.configure.hideTabs
  })

  const layout = computed(() => {
    return instance?.layout.layout === 'vertical'
  })
  const getMainContentHeight = computed(() => {
    return [
      hideTabs.value && layout
        ? 'height: calc(100vh - 48px - 32px);min-height: calc(100vh - 48px - 32px);'
        : '',
      !hideTabs.value && layout
        ? 'height: calc(100vh - 85px - 32px);min-height: calc(100vh - 85px - 32px);'
        : '',
      hideTabs.value && !layout.value
        ? 'height: calc(100vh - 48px - 32px);min-height: calc(100vh - 48px - 32px);'
        : '',
      !hideTabs.value && !layout.value
        ? 'height: calc(100vh - 85px - 32px);min-height: calc(100vh - 85px - 32px);'
        : '',
      props.fixedHeader ? '' : 'height: calc(100vh - 32px);min-height: calc(100vh - 32px);',
    ]
  })
  const getSectionStyle = computed(() => {
    return [
      hideTabs.value && layout ? 'padding-top: 48px;' : '',
      !hideTabs.value && layout ? 'padding-top: 85px;' : '',
      hideTabs.value && !layout.value ? 'padding-top: 48px' : '',
      !hideTabs.value && !layout.value ? 'padding-top: 85px;' : '',
      props.fixedHeader ? '' : 'padding-top: 0;',
    ]
  })

  const TransitionMain = defineComponent({
    render() {
      return h(
        Transition,
        {
          name:
            transitions.value(this.route) && this.route.meta.transition.enterTransition
              ? 'pure-classes-transition'
              : (transitions.value(this.route) && this.route.meta.transition.name) ||
                'fade-transform',
          enterActiveClass:
            transitions.value(this.route) &&
            `animate__animated ${this.route.meta.transition.enterTransition}`,
          leaveActiveClass:
            transitions.value(this.route) &&
            `animate__animated ${this.route.meta.transition.leaveTransition}`,
          mode: 'out-in',
          appear: true,
        },
        {
          default: () => [this.$slots.default()],
        },
      )
    },
    props: {
      route: {
        type: undefined,
        required: true,
      },
    },
  })
</script>

<template>
  <section
    :class="[props.fixedHeader ? 'app-main' : 'app-main-nofixed-header']"
    :style="getSectionStyle"
  >
    <router-view>
      <template #default="{ Component, route }">
        <el-scrollbar v-if="props.fixedHeader">
          <!--<el-backtop target=".app-main .el-scrollbar__wrap" title="回到顶部">-->
          <!--  <BackTop />-->
          <!--</el-backtop>-->
          <TransitionMain :route="route">
            <keep-alive v-if="keepAlive" :include="usePermissionStoreHook().cachePageList">
              <component
                :is="Component"
                :key="route.fullPath"
                :style="getMainContentHeight"
                class="main-content"
              />
            </keep-alive>
            <component
              :is="Component"
              v-else
              :key="route.fullPath"
              :style="getMainContentHeight"
              class="main-content"
            />
          </TransitionMain>
        </el-scrollbar>
        <div v-else>
          <TransitionMain :route="route">
            <keep-alive v-if="keepAlive" :include="usePermissionStoreHook().cachePageList">
              <component
                :is="Component"
                :key="route.fullPath"
                :style="getMainContentHeight"
                class="main-content"
              />
            </keep-alive>
            <component
              :is="Component"
              v-else
              :key="route.fullPath"
              :style="getMainContentHeight"
              class="main-content"
            />
          </TransitionMain>
        </div>
      </template>
    </router-view>
  </section>
</template>

<style lang="scss" scoped>
  .app-main {
    width: 100%;
    height: 100vh;
    position: relative;
    overflow-x: hidden;

    & > :deep(.el-scrollbar) {
      padding: $padding;

      & > .el-scrollbar__bar.is-vertical {
        top: $margin16;
      }
    }
  }

  .app-main-nofixed-header {
    width: 100%;
    min-height: 100vh;
    position: relative;
  }

  .main-content {
    padding: $padding;
    background: #fff;
  }
</style>
