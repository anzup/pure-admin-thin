<template>
  <el-dialog
    :title="t('text.select_training_resources')"
    v-model="dialogVisible"
    width="500px"
    @close="close"
    @open="open"
    destroy-on-close
  >
    <VxeTable @checkbox="checkbox" :max-height="600" v-bind="state.gridOptions" :data="reckonList">
      <template #pager />
    </VxeTable>
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
</template>

<script lang="ts" setup>
  import { reactive, computed } from 'vue'

  import { VxeGridProps } from 'vxe-table'
  import VxeTable from '/@/components/Table/index.vue'
  import useResources from '/@/commonTs/resources'
  import { useI18n } from 'vue-i18n'

  const props = defineProps({
    isShow: Boolean,
    type: {
      type: String,
      default: 'add',
    },
    id: Number,
    oldData: {
      type: Array as PropType<any[]>,
      default: () => [],
    },
  })
  const emit = defineEmits(['updateData', 'update:isShow'])

  const { t } = useI18n()
  const dialogVisible = computed({
    get: (): boolean => props.isShow,
    set: (val: boolean) => emit('update:isShow', val),
  })
  const state = reactive({
    gridOptions: {
      columns: [
        { type: 'checkbox', width: 50 },
        { type: 'seq', width: 60, title: t('text.seq') },
        {
          field: 'name',
          title: t('text.resource_name'),
          // sortable: true,
          minWidth: 100,
        },
      ],

      // data: []
    } as VxeGridProps,
    selectList: [],
  })
  const { getResourcesAllList, resourcesList } = useResources()

  const reckonList = computed(() => {
    return resourcesList.value.filter((v) =>
      props.oldData.every(
        (i) =>
          v.id !== i.resourceId ||
          ['ADD_SIMULATOR', 'SIMULATOR', 'MFTD'].includes(v.builtinResource),
      ),
    )
  })
  const open = () => {
    getResourcesAllList()
    if (props.type == 'edit') {
    }
  }
  const close = () => {
    dialogVisible.value = false
  }
  const confirm = () => {
    emit('updateData', state.selectList)
    close()
  }
  const checkbox = ({ records }) => {
    state.selectList = records
  }
</script>

<style scoped></style>
