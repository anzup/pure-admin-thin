<template>
  <div class="w-full h-full" v-loading="loading">
    <VxeTable v-bind="gridOptions" @action="btnClick" @checkbox="check">
      <!--自定义插槽 toolbar buttons 插槽-->
      <template #toolbar_tools>
        <el-button type="primary" @click="add" v-show="isWetLease">{{
          $t('text.new_students')
        }}</el-button>
        <el-button type="primary" @click="showSelect = true">{{
          $t('text.select_students')
        }}</el-button>
        <el-button type="primary" @click="leadingIn = true" v-show="isWetLease">{{
          $t('text.import_students')
        }}</el-button>
        <el-button
          type="warning"
          :disabled="!canSelect"
          @click="graduate('endTraining')"
          v-show="isWetLease"
          >{{ $t('text.batch_completion') }}</el-button
        >
        <el-button type="danger" :disabled="!canSelect" @click="deleteData(selectList)">{{
          $t('text.batch_delete')
        }}</el-button>
        <el-button
          type="warning"
          :disabled="waitFocusList.length == 0"
          @click="focusFn('focus', waitFocusList)"
          v-show="isWetLease"
          >{{ $t('text.batch_attention') }}</el-button
        >
        <!-- <el-button
                    type="warning"
                    :disabled="focusedList.length == 0"
                    @click="focusFn('cancelFocus', focusedList)"
                    v-show="isWetLease"
                >{{ $t("text.batch_cancellation") }}</el-button> -->
      </template>
      <template #pager />
    </VxeTable>

    <DiaLog v-model:isShow="isShow" :type="type" :clazzId="+clazzId" @updateData="updateData" />
    <SelectDialog
      v-model:isShow="showSelect"
      :excludeIds="excludeIds"
      @updateData="updateData"
      :type="isWetLease"
    />
    <LeadingInDialog v-model="leadingIn" @updateData="updateData" :clazzId="+clazzId" />
    <Graduation v-model="ShowGraduation" :ids="selectList" @updateData="updateData" />
  </div>
</template>

<script lang="ts" setup>
  import { VxeGridProps } from 'vxe-table'
  import VxeTable from '/@/components/Table/index.vue'
  import { ref, reactive, onMounted, toRefs, inject, computed } from 'vue'
  import DiaLog from '/@/views/project_opm/basic/participants/components/diaLog.vue'
  import SelectDialog from './selectDialog.vue'
  import { ElMessageBox, ElMessage } from 'element-plus'
  import {
    postClazzsAddStudent,
    postClazzsDeleteStudent,
    getClazzsStudents,
    putClazzFocus,
  } from '/@/api/opm/train'
  // 引入参训人员的导入
  import LeadingInDialog from '/@/views/project_opm/basic/participants/components/leadingInDialog.vue'
  import Graduation from './graduation.vue'
  import { useI18n } from 'vue-i18n'
  import { postStudentsGraduate } from '/@/api/opm/roles'

  const props = defineProps({
    type: String as PropType<courseType>,
  })
  const { t } = useI18n()
  const clazzId = inject<string>('clazzId')
  const isWetLease = computed(() => props.type == 'WET_LEASE' || props.type == 'DRY_LEASE')
  const state = reactive({
    gridOptions: {
      columns: [
        { type: 'checkbox', width: 50 },
        { type: 'seq', width: 60, title: t('text.seq') },
        {
          field: 'name',
          title: t('text.full_name'),
          // sortable: true,
          minWidth: 100,
        },
        {
          field: 'gender',
          title: t('text.gender'),
          // sortable: true,
          minWidth: 100,
          formatter: 'formatGender',
        },
        {
          field: 'idNumber',
          title: t('text.identification_number'),
          // sortable: true,
          minWidth: 100,
        },
        {
          field: 'phone',
          title: t('text.contact_number'),
          // sortable: true,
          minWidth: 100,
        },
        {
          field: 'grouping.name',
          title: t('text.affiliated_group'),
          // sortable: true,
          minWidth: 100,
          visible: props.type == 'WET_LEASE',
        },
        {
          field: 'customer.name',
          title: t('text.airline_company'),
          // sortable: true,
          minWidth: 100,
          visible: isWetLease.value,
        },
        {
          field: 'type',
          title: t('text.student_type'),
          // sortable: true,
          minWidth: 100,
          formatter: 'formatStudentType',
          visible: isWetLease.value,
        },
        {
          field: 'status',
          title: t('text.cultivate_status'),
          // sortable: true,
          minWidth: 100,
          formatter: 'formatGraduateStatus',
          visible: isWetLease.value,
        },
        {
          title: t('text.operation'),
          width: 200,
          slots: { default: 'operate' },
          field: 'operationTypes',
          // fixed:'right'
        },
      ],

      data: [],
      buttons: ({ row }) =>
        [
          {
            name: t('text.end_training'),
            type: 'endTraining',
            visible:
              props.type == 'WET_LEASE' && ['NOT_GRADUATED', 'NOT_STARTED'].includes(row.status),
          },
          {
            name: t('text.begin_training'),
            type: 'startTraining',
            visible: props.type == 'WET_LEASE' && row.status == 'GRADUATED',
          },

          {
            name: t('message.hsdelete'),
            type: 'delete',
            status: 'danger',
          },
          {
            visible: !row.focus && isWetLease.value,
            name: t('text.special_attention'),
            type: 'focus',
          },
          {
            visible: row.focus && isWetLease.value,
            name: t('text.cancel_attention'),
            type: 'cancelFocus',
          },
        ] as ButtonArr,
      toolbarConfig: {
        // custom: true,
        size: 'medium',
        perfect: true,
        slots: {
          tools: 'toolbar_tools',
        },
      },
    } as VxeGridProps,

    isShow: false,
    loading: false,

    type: 'add',
    showSelect: false,
    excludeIds: [],
    selectList: [] as number[],
    leadingIn: false,
  })
  const { gridOptions, isShow, loading, type, showSelect, excludeIds, selectList, leadingIn } =
    toRefs(state)

  const canSelect = computed(() => {
    return state.selectList.length > 0
  })

  const getList = () => {
    state.loading = true
    getClazzsStudents({
      id: clazzId,
    }).then((res) => {
      state.loading = false
      const { data } = res
      state.gridOptions.data = data
      state.excludeIds = data.map((v) => v.id)
    })
  }
  const add = () => {
    state.isShow = true
  }
  const updateData = async (val: number) => {
    state.selectList = []
    if (val) {
      await postClazzsAddStudent({
        id: clazzId,
        data: {
          ids: [val],
        },
      })
    }
    getList()
  }
  const deleteData = (ids: number[]) => {
    ElMessageBox.confirm(t('tip.this_operation_will_delete_the_selected_data'), {
      type: 'warning',
    })
      .then(() => {
        postClazzsDeleteStudent({
          id: clazzId,
          data: {
            ids,
          },
        }).then(() => {
          ElMessage.success(t('message.delete_succeeded'))
          getList()
        })
      })
      .catch((_) => {})
  }

  const ShowGraduation = ref(false)

  const graduate = (type: 'endTraining' | 'startTraining') => {
    postStudentsGraduate(
      type == 'endTraining'
        ? {
            clazzId,
            ids: state.selectList,
            graduate: true,
            ignoreNotFinished: false,
            graduateRemark: 'ABNORMAL',
            graduateType: 'ABNORMAL',
          }
        : {
            clazzId,
            ids: state.selectList,
            graduate: false,
            ignoreNotFinished: false,
          },
    ).then(() => {
      ElMessage.success(t('message.operation_succeeded'))
      getList()
    })
  }
  const btnClick = ({ type: btnType, row }) => {
    switch (btnType) {
      case 'endTraining':
      case 'startTraining':
        state.selectList = [row.id]
        graduate(btnType)
        break
      case 'delete':
        deleteData([row.id])
        break
      case 'focus':
      case 'cancelFocus':
        focusFn(btnType, [row.id])
        break
      default:
        break
    }
  }

  const focusFn = (type: 'focus' | 'cancelFocus', ids: number[]) => {
    putClazzFocus({ id: +clazzId, focus: type == 'focus', studentIds: ids }).then((res) => {
      focusedList.value = []
      waitFocusList.value = []
      ElMessage.success(t('message.operation_succeeded'))
      getList()
    })
  }
  const focusedList = ref([]),
    waitFocusList = ref([])
  const check = ({ ids, records }) => {
    state.selectList = ids
    let arr = []
    let waitArr = []
    for (let index = 0; index < records.length; index++) {
      const element = records[index]
      if (element.focus == true) {
        arr.push(element.id)
      } else {
        waitArr.push(element.id)
      }
    }
    focusedList.value = arr
    waitFocusList.value = waitArr
  }
  onMounted(() => {
    getList()
  })
</script>

<style scoped></style>
