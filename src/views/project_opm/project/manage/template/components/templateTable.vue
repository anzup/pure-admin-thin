<template>
  <vxe-grid v-bind="(gridOptions as any)" :data="data" class="sortable-tree-demo" ref="xTable">
    <!--使用 bottom 插槽-->
    <template #bottom>
      <div class="bottom_message">
        <el-button
          @click="$emit('updateData', { type: 'edit', data: templateIndex })"
          type="primary"
          >{{ $t('message.modify') }}</el-button
        >
        <el-button @click="save" type="primary">{{ $t('message.hssave') }}</el-button>
      </div>
    </template>
    <template #deteTime="{ row }">
      <el-time-picker
        v-model="row.startTime"
        format="HH:mm"
        :placeholder="$t('text.please_select')"
        :clearable="false"
      />
    </template>
    <template #operate="data">
      <span>
        <span
          v-for="(item, index) in typeof buttons == 'function' ? buttons(data) : buttons"
          :key="index"
        >
          <vxe-button
            v-show="item && item.visible !== false"
            type="text"
            :status="getStatus(item)"
            :disabled="item.disabled"
            @click="btnClick(data, item.type)"
            >{{ item.name }}</vxe-button
          >
        </span>
      </span>
    </template>
  </vxe-grid>
</template>
<script lang="ts" setup>
  import { ref, reactive, computed, nextTick, onUnmounted } from 'vue'
  import { useI18n } from 'vue-i18n'
  import Sortable from 'sortablejs'
  const { t } = useI18n()
  interface TemplateItems {
    id: number
    period: number
    sortNumber: number
    startTime: string
    syllabusItemId: number
    syllabusItemName: string
    type: Syllabus.SyllabusType
  }
  const props = defineProps({
    modelValue: {
      type: Array as PropType<Array<TemplateItems>>,
      default: () => [],
    },
    templateIndex: Number,
  })

  const emit = defineEmits<{
    (e: 'update:modelValue', data: Array<TemplateItems>): void
    (
      e: 'updateData',
      data: {
        type: 'edit' | 'save'
        data: number
      },
    ): void
  }>()
  const data = computed({
    get: () => props.modelValue,
    set(val) {
      emit('update:modelValue', val)
    },
  })

  const gridOptions = reactive<VxeTableAllProps>({
    height: 'auto',

    columns: [
      { type: 'seq', width: 60, title: t('text.seq') },
      {
        field: 'syllabusItemName',
        title: t('text.training_content'),
        // sortable: true,
        minWidth: 100,
        className: 'sortable',
      },
      {
        field: 'type',
        title: t('text.classification'),
        // sortable: true,
        minWidth: 100,
        formatter: 'formatSyllabusType',
      },
      {
        field: 'period',
        title: t('text.class_hours'),
        // sortable: true,
        minWidth: 100,
      },
      {
        field: 'days',
        title: t('text.days'),
        // sortable: true,
        minWidth: 100,
        cellRender: {
          name: '$input',
          props: {
            type: 'integer',
            min: 1,
          },
        },
      },
      {
        field: 'startTime',
        title: t('text.training_period_'),
        // sortable: true,
        minWidth: 100,
        slots: {
          default: 'deteTime',
        },
      },

      {
        title: t('text.operation'),
        width: 150,
        slots: { default: 'operate' },
        field: 'operationTypes',
        // fixed:'right'
      },
    ],

    isTabs: true,
    highlightCurrentRow: true,
    editRules: {
      startTime: [{ required: true, message: t('text.start_time_is_required') }],
      days: [{ required: true, message: t('text.days_are_required') }],
    },
  })
  const buttons = ({ rowIndex }): ButtonArr => [
    {
      name: t('text.move_up'),
      type: 'up',
      disabled: rowIndex == 0,
    },
    {
      name: t('text.move_down'),
      type: 'down',
      disabled: rowIndex == data.value.length - 1,
    },
    {
      name: t('message.hsdelete'),
      status: 'danger',
      type: 'delete',
    },
  ]
  const arrChangePosition = (arr: any[], start: number, end: number): any[] => {
    let newArr: any[] = JSON.parse(JSON.stringify(arr))
    let item = JSON.parse(JSON.stringify(arr[start]))
    let item1 = JSON.parse(JSON.stringify(arr[end]))
    newArr.splice(end, 1, item)
    newArr.splice(start, 1, item1)
    return newArr
  }
  const btnClick = ({ row, rowIndex }, type) => {
    switch (type) {
      case 'up':
        data.value = arrChangePosition(data.value, rowIndex, --rowIndex)
        break
      case 'down':
        data.value = arrChangePosition(data.value, rowIndex, ++rowIndex)
        break

      default:
        data.value.splice(rowIndex, 1)
        data.value = [...data.value]
        break
    }
  }
  const xTable = ref()
  const getStatus = computed(() => {
    return ({ status, disabled }: any) => {
      return disabled ? '' : status || 'primary'
    }
  })

  const save = async () => {
    const $table = xTable.value
    const errMap = await $table.validate(true)
    if (!errMap) emit('updateData', { type: 'save', data: props.templateIndex })
  }
  let sortable1: any
  const rowDrop = () => {
    const $table = xTable.value
    sortable1 = Sortable.create($table.$el.querySelector('.body--wrapper>.vxe-table--body tbody'), {
      handle: '.sortable',
      onEnd: (sortableEvent) => {
        const newIndex = sortableEvent.newIndex as number
        const oldIndex = sortableEvent.oldIndex as number
        const currRow = data.value.splice(oldIndex, 1)[0]
        data.value.splice(newIndex, 0, currRow)
      },
    })
  }

  let initTime: any
  nextTick(() => {
    // 加载完成之后在绑定拖动事件
    initTime = setTimeout(() => {
      rowDrop()
    }, 500)
  })

  onUnmounted(() => {
    clearTimeout(initTime)
    if (sortable1) {
      sortable1.destroy()
    }
  })
</script>
<style lang="scss" scoped>
  .bottom_message {
    padding: 5px;
    // background-color: aqua;
    text-align: center;
  }
</style>
