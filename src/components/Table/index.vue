<template>
  <vxe-grid
    ref="xTable"
    :height="tableHeight"
    :seq-config="{
      startIndex: tablePageObj ? (tablePageObj.page - 1) * tablePageObj.size : 0,
    }"
    class="mytable-scrollbar"
    v-bind="{ ...$props, ...$attrs }"
    @checkbox-all="rangeEvent"
    @checkbox-change="rangeEvent"
    @checkbox-range-change="checkboxRange"
  >
    <template v-if="tablePageObj" #pager>
      <vxe-pager
        v-model:current-page="tablePageObj.page"
        v-model:page-size="tablePageObj.size"
        :layouts="[
          'Sizes',
          'PrevJump',
          'PrevPage',
          'JumpNumber',
          'NextPage',
          'NextJump',
          'FullJump',
          'Total',
        ]"
        :total="tablePageObj.total"
        background
        @page-change="handlePageChange"
      />
    </template>
    <template #operate="data">
      <span>
        <span
          v-for="(item, index) in typeof buttons == 'function' ? buttons(data) : buttons"
          :key="index"
          @click.stop
        >
          <vxe-button
            v-show="item && item.visible !== false"
            :disabled="item.disabled"
            :status="getStatus(item)"
            type="text"
            @click.self="btnClick(data, item)"
            >{{ item.name }}</vxe-button
          >
        </span>
      </span>
    </template>
    <template v-for="(_, name) in $slots" v-slot:[name]="scpename">
      <slot :name="name" v-bind="scpename" />
    </template>
  </vxe-grid>
</template>

<script lang="ts" setup>
  import { useAppStoreHook } from '/@/store/modules/app'
  import { computed, ref, useAttrs, watch } from 'vue'
  import { debounce } from 'lodash-es'

  interface Props extends VxeTableAllProps {
    buttons?: ButtonArr | ((data: any) => ButtonArr) | any[]
    form?: {
      page?: number
      size?: number
      total?: number
      [_: string]: any
    }
    height?: number | string
  }

  const props = withDefaults(defineProps<Props>(), {
    height: 'auto',
    border: true,
    autoResize: true,
    highlightCurrentColumn: true,
    highlightHoverRow: true,
    data: () => [],
  })
  const emit = defineEmits(['checkbox', 'action', 'handlePageChange', 'update:form'])

  const xTable = ref(null)

  const tablePageObj = computed({
    get: () => {
      return props.form
    },
    set: (val: any) => {
      emit('update:form', val)
    },
  })

  const tableHeight = computed(() => {
    return props.height
  })

  const getStatus = computed(() => {
    return ({ status, disabled }: any) => {
      return disabled ? '' : status || 'primary'
    }
  })

  const selectChangeEvent = ({ records, checked }) => {
    let obj = {
      checked,
      records,
      ids: records.length > 0 ? records.map((v) => v.id) : [],
    }
    emit('checkbox', obj)
  }
  const btnClick = (data: object, btnItem: TableButton) => {
    let obj: any = {}
    Object.assign(obj, data, { type: btnItem.type })
    if (btnItem.event) return btnItem.event(obj)
    emit('action', obj)
  }
  // 分页点击事件
  const handlePageChange = ({ currentPage, pageSize, type }) => {
    // emit("checkbox", {
    //     records: [],
    //     ids: []
    // });
    emit('handlePageChange', {
      page: currentPage,
      size: pageSize,
      type,
    })
  }
  const attrs = useAttrs()
  watch(
    () => attrs.data,
    (val) => {
      emit('checkbox', {
        records: [],
        ids: [],
      })
    },
    {
      immediate: true,
    },
  )

  const rangeEvent = debounce(selectChangeEvent, 200)
  const checkboxRange = (data) => {
    rangeEvent(data)
  }
  defineExpose({
    xTable,
  })
</script>

<style scoped></style>
