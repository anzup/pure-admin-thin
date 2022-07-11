<template>
  <el-dialog
    :title="getTitle"
    v-model="dialogVisible"
    width="1000px"
    @close="close"
    @open="open"
    destroy-on-close
  >
    <VxeTable @checkbox="checkbox" :max-height="600" v-bind="gridOptions">
      <template #pager />
    </VxeTable>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">{{ $t('message.hscancel') }}</el-button>
        <el-button type="primary" @click="confirm">{{ $t('message.hsdefine') }}</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts">
  import { defineComponent, reactive, ref, computed, toRefs } from 'vue'

  import { VxeGridProps } from 'vxe-table'
  import VxeTable from '/@/components/Table/index.vue'
  import { getCoursesAirplaneTypeAll } from '/@/api/opm/standard'
  import { useI18n } from 'vue-i18n'
  export default defineComponent({
    name: 'AddProject',
    props: {
      isShow: Boolean,
      type: {
        type: String,
        default: 'add',
      },
      id: Number,
      oldData: {
        type: Array,
        default: () => [],
      },
    },
    emits: ['updateData', 'update:isShow'],
    components: {
      VxeTable,
    },
    setup(props, { emit }) {
      const { t } = useI18n()
      const dialogVisible = computed({
        get: (): boolean => props.isShow,
        set: (val: boolean) => emit('update:isShow', val),
      })
      const getTitle = computed(() => {
        return props.type == 'add' ? t('text.new_courses') : t('text.modify_course')
      })
      const state = reactive({
        gridOptions: {
          columns: [
            { type: 'checkbox', width: 50 },
            { type: 'seq', width: 60, title: t('text.seq') },
            {
              field: 'code',
              title: t('text.course_project_code'),
              // sortable: true,
              minWidth: 100,
            },
            {
              field: 'name',
              title: t('text.course_project_name'),
              // sortable: true,
              minWidth: 100,
            },
            {
              // sortable: true,
              field: 'airplaneType',
              title: t('text.model'),
              // width:300
              minWidth: 100,
            },
          ],

          data: [],
        } as VxeGridProps,
        isShow: false,
        selectList: [],
      })

      const open = () => {
        getCoursesAirplaneTypeAllList()
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
      const getCoursesAirplaneTypeAllList = () => {
        getCoursesAirplaneTypeAll().then((res) => {
          let arr = [...res.data].filter((x) =>
            [...props.oldData].every(
              (v: { courseId: number; airplaneType: string }) =>
                v.courseId !== x.id || v.airplaneType !== x.airplaneType,
            ),
          )
          state.gridOptions.data = arr
        })
      }
      const checkbox = ({ records }) => {
        state.selectList = records
      }
      return {
        dialogVisible,
        getTitle,
        ...toRefs(state),

        close,
        confirm,
        open,
        checkbox,
      }
    },
  })
</script>

<style scoped></style>
