<template>
  <div>
    <el-dialog
      :title="$t('text.sort')"
      v-model="dialogVisible"
      width="500px"
      @open="open"
      destroy-on-close
    >
      <vxe-grid class="mytable-scrollbar" ref="gridRef" v-bind="gridOptions" />

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">
            {{ $t('message.hscancel') }}
          </el-button>
          <el-button type="primary" @click="confirm">
            {{ $t('message.hsdefine') }}
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
  import { reactive, ref, computed, nextTick } from 'vue'
  import { getTemplatesSyllabusId } from '/@/api/opm/standard'
  import { putTemplatesSort } from '/@/api/opm/standard'
  import { ElMessage } from 'element-plus'
  import { useI18n } from 'vue-i18n'
  import { VxeTableInstance, VxeGridProps } from 'vxe-table'
  import Sortable from 'sortablejs'

  const props = defineProps({
    modelValue: Boolean,
    rowId: Number,
  })
  const emit = defineEmits(['updateData', 'update:modelValue'])
  const { t } = useI18n()

  const dialogVisible = computed({
    get: (): boolean => props.modelValue,
    set: (val: boolean) => emit('update:modelValue', val),
  })

  const gridOptions = reactive<VxeGridProps>({
    maxHeight: 400,
    data: [],
    columns: [
      {
        type: 'seq',
        width: 50,
        title: t('text.seq'),
      },
      {
        title: t('text.name'),
        field: 'name',
        className: 'sortable',
      },
    ],
    loading: false,
  })

  const gridRef = ref<VxeTableInstance>()
  let sortable1: any
  const rowDrop = () => {
    const $table = gridRef.value
    sortable1 = Sortable.create($table.$el.querySelector('.body--wrapper>.vxe-table--body tbody'), {
      handle: '.sortable',
      onEnd: (sortableEvent) => {
        const newIndex = sortableEvent.newIndex as number
        const oldIndex = sortableEvent.oldIndex as number
        const currRow = gridOptions.data.splice(oldIndex, 1)[0]
        gridOptions.data.splice(newIndex, 0, currRow)
      },
    })
  }

  let initTime: any

  const open = () => {
    gridOptions.data = []
    clearTimeout(initTime)
    if (sortable1) {
      sortable1.destroy()
    }
    nextTick(() => {
      // 加载完成之后在绑定拖动事件
      initTime = setTimeout(() => {
        rowDrop()
      }, 500)
    })
    gridOptions.loading = true
    getTemplatesSyllabusId(props.rowId).then((res) => {
      gridOptions.data = res.data
      gridOptions.loading = false
    })
  }
  const confirm = () => {
    putTemplatesSort({ ids: gridOptions.data.map((v) => v.id) }).then((res) => {
      ElMessage.success(t('message.save_succeeded'))
      dialogVisible.value = false
    })
  }
</script>

<style scoped></style>
