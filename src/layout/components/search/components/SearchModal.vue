<script lang="ts" setup>
  import { useRouter } from 'vue-router'
  import SearchResultCmp from './SearchResult.vue'
  import SearchFooter from './SearchFooter.vue'
  import { deleteChildren } from '/@/utils/tree'
  import { transformI18n } from '/@/plugins/i18n'
  import { useDebounceFn, onKeyStroke } from '@vueuse/core'
  import { ref, watch, computed, nextTick, shallowRef, unref } from 'vue'
  import { usePermissionStoreHook } from '/@/store/modules/permission'
  import { Menu } from '/@/router/types'
  import { getMenus } from '/@/router/menus'
  import { cloneDeep, filter, forEach } from 'lodash-es'
  import { useI18n } from '/@/hooks/useI18n'

  export interface SearchResult {
    name: string
    path: string
    icon?: string
  }

  interface Props {
    /** 弹窗显隐 */
    value: boolean
  }

  interface Emits {
    (e: 'update:value', val: boolean): void
  }

  const emit = defineEmits<Emits>()
  const props = withDefaults(defineProps<Props>(), {})
  const router = useRouter()

  const keyword = ref('')
  const activePath = ref('')
  const inputRef = ref<HTMLInputElement | null>(null)
  const resultOptions = shallowRef([])
  const handleSearch = useDebounceFn(search, 300)

  const show = computed({
    get() {
      return props.value
    },
    set(val: boolean) {
      emit('update:value', val)
    },
  })

  watch(show, async (val) => {
    if (val) {
      /** 自动聚焦 */
      await nextTick()
      inputRef.value?.focus()
    }
  })

  const { t } = useI18n()

  let menuList: Menu[] = []
  const open = async () => {
    const list = await getMenus()
    menuList = cloneDeep(list)
    forEach(menuList, (item) => {
      item.name = t(item.name)
    })
  }

  // Translate special characters
  function transform(c: string) {
    const code: string[] = ['$', '(', ')', '*', '+', '.', '[', ']', '?', '\\', '^', '{', '}', '|']
    return code.includes(c) ? `\\${c}` : c
  }

  function createSearchReg(key: string) {
    const keys = [...key].map((item) => transform(item))
    const str = ['', ...keys, ''].join('.*')
    console.log(str)
    return new RegExp(str)
  }

  /** 查询 */
  function search() {
    if (!keyword.value) {
      resultOptions.value = []
      return
    }
    const reg = createSearchReg(unref(keyword))
    const filterMenu = filter(menuList, (item) => {
      return reg.test(item.name) && !item.hideMenu
    })
    resultOptions.value = handlerSearchResult(filterMenu, reg)
  }

  function handlerSearchResult(filterMenu: Menu[], reg: RegExp, parent?: Menu) {
    const ret: SearchResult[] = []
    filterMenu.forEach((item) => {
      const { name, path, icon, children, hideMenu, meta } = item
      if (!hideMenu && reg.test(name) && (!children?.length || meta?.hideChildrenInMenu)) {
        ret.push({
          name: parent?.name ? `${parent.name} > ${name}` : name,
          path,
          icon,
        })
      }
      if (!meta?.hideChildrenInMenu && Array.isArray(children) && children.length) {
        ret.push(...handlerSearchResult(children, reg, item))
      }
    })
    return ret
  }

  function handleClose() {
    show.value = false
    /** 延时处理防止用户看到某些操作 */
    setTimeout(() => {
      resultOptions.value = []
      keyword.value = ''
    }, 200)
  }

  /** key up */
  function handleUp() {
    const { length } = resultOptions.value
    if (length === 0) return
    const index = resultOptions.value.findIndex((item) => item.path === activePath.value)
    if (index === 0) {
      activePath.value = resultOptions.value[length - 1].path
    } else {
      activePath.value = resultOptions.value[index - 1].path
    }
  }

  /** key down */
  function handleDown() {
    const { length } = resultOptions.value
    if (length === 0) return
    const index = resultOptions.value.findIndex((item) => item.path === activePath.value)
    if (index + 1 === length) {
      activePath.value = resultOptions.value[0].path
    } else {
      activePath.value = resultOptions.value[index + 1].path
    }
  }

  /** key enter */
  function handleEnter() {
    const { length } = resultOptions.value
    if (length === 0 || activePath.value === '') return
    router.push(activePath.value)
    handleClose()
  }

  onKeyStroke('Enter', handleEnter)
  onKeyStroke('ArrowUp', handleUp)
  onKeyStroke('ArrowDown', handleDown)
</script>

<template>
  <el-dialog v-model="show" :before-close="handleClose" center title="搜索" top="5vh" @open="open">
    <el-input
      ref="inputRef"
      v-model="keyword"
      clearable
      placeholder="请输入关键词搜索"
      @input="handleSearch"
    >
      <template #prefix>
        <span class="el-input__icon">
          <IconifyIconOffline icon="search" />
        </span>
      </template>
    </el-input>
    <div class="search-result-container">
      <el-empty v-if="resultOptions.length === 0" description="暂无搜索结果" />
      <SearchResultCmp
        v-else
        v-model:value="activePath"
        :options="resultOptions"
        @click="handleEnter"
      />
    </div>
    <template #footer>
      <SearchFooter />
    </template>
  </el-dialog>
</template>
<style lang="scss" scoped>
  .search-result-container {
    margin-top: 20px;
  }
</style>
