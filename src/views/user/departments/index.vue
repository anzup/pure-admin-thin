<template>
  <VxeTable
    v-model:form="form"
    :data="departmentList"
    v-bind="gridOptions"
    @action="btnClick"
    @handlePageChange="handlePageChange"
  >
    <template #form>
      <el-form ref="headerFormRef" :model="form" class="header-form" inline>
        <el-form-item :label="$t('state.owningSystem')" prop="subsystem">
          <el-select
            v-model="form.subsystem"
            :placeholder="$t('tip.pleaseChoose')"
            class="width90"
            clearable
          >
            <el-option
              v-for="(value, key) in subsystemMap"
              :key="key"
              :label="value"
              :value="key"
            />
          </el-select>
        </el-form-item>
        <el-form-item prop="searchKey">
          <el-input
            v-model="form.searchKey"
            :placeholder="$t('tip.keywordToSearch')"
            class="width180"
            clearable
            prefix-icon="Search"
          />
        </el-form-item>
        <el-form-item>
          <FormBtn @submit="submit" />
        </el-form-item>
      </el-form>
    </template>
    <!--自定义插槽 toolbar buttons 插槽-->
    <template #toolbar_tools>
      <div class="px-4">
        <el-button type="primary" @click="add">{{ $t('buttons.hsAdd') }}</el-button>
        <DiaLog :id="detailId" v-model:isShow="isShow" :type="type" @updateData="updateData" />
      </div>
    </template>
  </VxeTable>
</template>

<script lang="ts" setup>
  import VxeTable from '/@/components/Table/index.vue'
  import { onMounted, reactive, ref } from 'vue'
  import FormBtn from '/@/components/headerFormBtn/index.vue'
  import DiaLog from './components/Dialog.vue'
  import { judgePage, setPage } from '/@/utils/utils'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import { useI18n } from '/@/hooks/useI18n'
  import { useRouter } from 'vue-router'
  import useDepartment from '/@/hooks/useDepartment'
  import type { FormInstance } from 'element-plus'
  import { deleteDepartmentsId } from '/@/api/departments'

  const { t } = useI18n()

  const gridOptions = reactive<VxeTableAllProps>({
    height: 'auto',
    columns: [
      // { type: "checkbox", width: 50 },
      { type: 'seq', width: 60, title: t('state.seq') },
      {
        field: 'name',
        title: t('state.positionName'),
        // sortable: true,
        minWidth: 100,
      },
      {
        field: 'subsystem',
        title: t('state.owningSystem'),
        // sortable: true,
        minWidth: 100,
        formatter: ({ cellValue }) => subsystemMap[cellValue],
      },
      {
        title: t('state.operation'),
        width: 200,
        slots: { default: 'operate' },
        field: 'operationTypes',
        // fixed:'right'
      },
    ],
    buttons: ({ row }) => [
      {
        name: t('buttons.modify'),
        type: 'edit',
      },
      {
        name: t('buttons.hsDelete'),
        type: 'delete',
        status: 'danger',
        disabled: row.builtin,
      },
    ],
    toolbarConfig: {
      // custom: true,
      size: 'medium',
      perfect: true,
      slots: {
        tools: 'toolbar_tools',
      },
    },
    loading: false,
  })
  const isShow = ref(false)

  const router = useRouter()
  const detailId = ref(undefined)
  const type = ref('')
  const btnClick = ({ type: btnType, row }) => {
    switch (btnType) {
      case 'permission':
        break
      case 'edit':
        isShow.value = true
        type.value = btnType
        detailId.value = row.id
        break
      case 'competence':
        router.push({
          path: '/user/roles/competence',
          query: {
            id: row.id,
          },
        })
        break

      default:
        deleteData(row.id)
        break
    }
  }

  const { departmentList, departmentForm: form, getDepartmentList, subsystemMap } = useDepartment()
  const getList = async () => {
    gridOptions.loading = true
    await getDepartmentList()
    gridOptions.loading = false
  }
  const headerFormRef = ref<FormInstance>()
  const submit = (val: string) => {
    if (val == 'reset') {
      headerFormRef.value.resetFields()
    }
    form.page = 1
    getList()
  }
  const add = () => {
    isShow.value = true
    type.value = 'add'
    detailId.value = undefined
  }
  const updateData = () => {
    getList()
  }
  const deleteData = (id: number) => {
    ElMessageBox.confirm(t('tip.deleteTheSelectedData'), {
      type: 'warning',
    })
      .then(() => {
        deleteDepartmentsId(id).then(() => {
          form.page = judgePage(form.total, form)
          ElMessage.success(t('status.successfullyDeleted'))
          getList()
        })
      })
      .catch((_) => {})
  }
  const handlePageChange = (val) => {
    if (val.type == 'size') {
      form.page = setPage(form.total, form)
    }
    getList()
  }

  onMounted(() => {
    form.size = 10
    getList()
  })
</script>

<style scoped></style>
