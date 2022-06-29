<template>
  <div
    ref="dynamicRef"
    :class="['scroll-item is-closable', linkIsActive, cardIsActive]"
    @click="change"
    @mouseenter.prevent="onMouseenter"
    @mouseleave.prevent="onMouseleave"
    @contextmenu.prevent="handleContext"
  >
    <span class="title">{{ getTitle }}</span>
    <span v-if="iconIsActive" class="el-icon-close" @click.stop="$emit('close', getPath)">
      <IconifyIconOffline icon="close-bold" />
    </span>
    <div v-if="showModel !== 'card'" ref="scheduleRef" :class="[scheduleIsActive]"></div>
  </div>
</template>

<script lang="ts" setup>
  import { computed } from 'vue'
  import { hasClass, toggleClass } from '/@/utils/operate'
  import { useI18n } from '/@/hooks/useI18n'

  interface Props {
    showModel: 'card' | 'smart'
    content: any
    activeKeyRef: string
  }

  // eslint-disable-next-line vue/no-setup-props-destructure
  const { showModel = 'card', content = {}, activeKeyRef } = defineProps<Props>()

  const emit = defineEmits<{
    (e: 'change', data: string): void
    (e: 'close', data: string): void
    (e: 'handleContext', data: Event): void
  }>()

  const scheduleRef = $ref<HTMLElement>()
  const dynamicRef = $ref<HTMLElement>()
  const getPath = computed<string>(() => (content.query ? content.fullPath : content.path))

  const change = () => {
    emit('change', getPath.value)
  }

  function handleContext(e: Event) {
    emit('handleContext', e)
  }

  const { t } = useI18n()

  const getTitle = computed(() => {
    const { meta = {} } = content
    return meta && t(meta.title as string)
  })

  let isHover = $ref<boolean>(false)

  // 鼠标移入
  function onMouseenter() {
    if (!(content && content.meta && content.meta.affix)) isHover = true
    if (showModel === 'smart') {
      if (hasClass(scheduleRef, 'schedule-active')) return
      toggleClass(true, 'schedule-in', scheduleRef)
      toggleClass(false, 'schedule-out', scheduleRef)
    } else {
      if (hasClass(dynamicRef, 'card-active')) return
      toggleClass(true, 'card-in', dynamicRef)
      toggleClass(false, 'card-out', dynamicRef)
    }
  }

  // 鼠标移出
  function onMouseleave() {
    isHover = false
    if (showModel === 'smart') {
      if (hasClass(scheduleRef, 'schedule-active')) return
      toggleClass(false, 'schedule-in', scheduleRef)
      toggleClass(true, 'schedule-out', scheduleRef)
    } else {
      if (hasClass(dynamicRef, 'card-active')) return
      toggleClass(false, 'card-in', dynamicRef)
      toggleClass(true, 'card-out', dynamicRef)
    }
  }

  const linkIsActive = computed(() => {
    if (!content.query) {
      if (activeKeyRef === content.path) {
        return 'is-active'
      } else {
        return ''
      }
    } else {
      if (content.fullPath === activeKeyRef) {
        return 'is-active'
      } else {
        return ''
      }
    }
  })

  const cardIsActive = computed(() => {
    if (showModel === 'card') {
      if (!content.query) {
        if (activeKeyRef === content.path) {
          return 'card-active'
        } else {
          return ''
        }
      } else {
        if (content.fullPath === activeKeyRef) {
          return 'card-active'
        } else {
          return ''
        }
      }
    } else {
      return ''
    }
  })

  const scheduleIsActive = computed(() => {
    if (!content.query) {
      if (activeKeyRef === content.path) {
        return 'schedule-active'
      } else {
        return ''
      }
    } else {
      if (content.fullPath === activeKeyRef) {
        return 'schedule-active'
      } else {
        return ''
      }
    }
  })

  const iconIsActive = computed(() => {
    return (
      (!(content && content.meta && content.meta.affix) && activeKeyRef === getPath.value) ||
      isHover
    )
  })
</script>

<style lang="scss" scoped>
  @keyframes scheduleInWidth {
    from {
      width: 0;
    }

    to {
      width: 100%;
    }
  }

  @keyframes scheduleOutWidth {
    from {
      width: 100%;
    }

    to {
      width: 0;
    }
  }

  @keyframes close {
    from {
      transform: translate(-50%, -50%);
    }

    to {
      transform: translate(0, -50%);
    }
  }

  .scroll-item {
    border-radius: 3px 3px 0 0;
    padding: 0 6px;
    box-shadow: 0 0 1px #888;
    position: relative;
    margin-right: 4px;
    height: 28px;
    display: inline-block;
    line-height: 28px;
    transition: all 0.4s;
    cursor: pointer;

    .el-icon-close {
      font-size: 10px;
      color: var(--el-color-primary);
      cursor: pointer;
      position: absolute;
      top: 50%;
      transform: translate(-50%, -50%);
      transition: font-size 0.2s;

      &:hover {
        border-radius: 50%;
        color: #fff;
        background: #b4bccc;
        font-size: 13px;
      }
    }

    &.is-closable:not(:first-child) {
      &:hover {
        padding-right: 18px;

        &:not(.is-active) {
          .el-icon-close {
            animation: close 200ms ease-in forwards;
          }
        }
      }
    }
  }

  .title {
    text-decoration: none;
    color: #666;
    padding: 0 4px;
  }

  .scroll-item.is-active {
    background-color: var(--el-color-primary-light-9);
    position: relative;
    color: #fff;

    &:not(:first-child) {
      padding-right: 18px;
    }

    .el-icon-close {
      transform: translate(0, -50%);
    }

    .title {
      color: var(--el-color-primary);
    }
  }

  /* 卡片模式下鼠标移入显示蓝色边框 */
  .card-in {
    color: var(--el-color-primary);

    .title {
      color: var(--el-color-primary);
    }
  }

  /* 卡片模式下鼠标移出隐藏蓝色边框 */
  .card-out {
    border: none;
    color: #666;

    .title {
      color: #666;
    }
  }

  /* 灵动模式 */
  .schedule-active {
    width: 100%;
    height: 2px;
    position: absolute;
    left: 0;
    bottom: 0;
    background: var(--el-color-primary);
  }

  /* 灵动模式下鼠标移入显示蓝色进度条 */
  .schedule-in {
    width: 100%;
    height: 2px;
    position: absolute;
    left: 0;
    bottom: 0;
    background: var(--el-color-primary);
    animation: scheduleInWidth 400ms ease-in;
  }

  /* 灵动模式下鼠标移出隐藏蓝色进度条 */
  .schedule-out {
    width: 0;
    height: 2px;
    position: absolute;
    left: 0;
    bottom: 0;
    background: var(--el-color-primary);
    animation: scheduleOutWidth 400ms ease-in;
  }
</style>
