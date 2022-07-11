<template>
  <Table
    v-model:form="form"
    :data="userList"
    v-bind="gridOptions"
    @handlePageChange="handlePageChange"
  >
    <template #form>
      <el-form ref="headerFormRef" :model="form" class="header-form" inline>
        <el-form-item :label="$t('state.department')" prop="prohibited">
          <el-select
            v-model="form.prohibited"
            :placeholder="$t('tip.pleaseChoose')"
            class="width90"
            clearable
          >
            <el-option
              v-for="item in departmentList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
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
  </Table>
  <Dialog :id="rowId" v-model="isShow" @updateData="getList" />
</template>

<script lang="ts" setup>
  import { onMounted, reactive, ref } from 'vue'
  import type { FormInstance } from 'element-plus'

  import Table from '/@/components/Table/index.vue'
  import FormBtn from '/@/components/headerFormBtn/index.vue'
  import type { VxeGridProps, VxeTableDefines } from 'vxe-table'
  import { setPage } from '/@/utils/utils'
  import { useI18n } from '/@/hooks/useI18n'
  import useUser from '/@/hooks/useUser'
  import Dialog from './Dialog.vue'
  import { useGo } from '/@/hooks/usePage'

  interface Props {
    departmentList: any[]
    builtinRoles: string
    roleId: number
  }

  const { t } = useI18n()

  // eslint-disable-next-line vue/no-setup-props-destructure
  const { departmentList = [], builtinRoles, roleId } = defineProps<Props>()

  const isShow = ref(false)
  const rowId = ref<number>(0)

  const go = useGo()

  const gridOptions = reactive<VxeGridProps>({
    height: 'auto',
    columns: [
      { type: 'checkbox', width: 50 },
      { type: 'seq', width: 50, title: t('state.seq') },
      {
        field: 'name',
        title: t('state.fullName'),
        minWidth: 100,
      },
      {
        field: 'gender',
        title: t('state.gender'),
        width: 70,
        formatter: 'formatGender',
      },
      {
        field: 'department.name',
        title: t('state.department'),
        // formatter: ({ cellValue }) =>
        //   departmentList.value.find((v) => v.id === cellValue)?.name ?? '',
      },
      {
        field: 'phone',
        title: t('state.phoneNumber'),
        minWidth: 100,
      },
      // {
      //   field: 'trainingItem.name',
      //   title: t('state.trainingProgram'),
      //   minWidth: 100,
      // },
      // {
      //   field: 'courseNumber.name',
      //   title: t('state.trainingClass'),
      //   minWidth: 100,
      // },
      // {
      //   field: 'balances.amount',
      //   title: t('state.balance') + ' / ' + t('state.dollar'),
      //   minWidth: 100,
      // },
      {
        title: t('state.operation'),
        width: 120,
        field: 'operationTypes',
        cellRender: {
          name: 'buttons',
          props: {
            buttons: [
              {
                name: t('buttons.detail'),
                event: ({ row }) => {
                  go(`/meal/diningStaff_detail/${row.id}`)
                },
              },
              {
                name: t('buttons.recharge'),
                event: ({ row }) => {
                  rowId.value = row.id
                  isShow.value = true
                },
              },
            ] as ButtonArr,
          },
        },
      },
    ],
  })

  const { userList, userForm: form, getUsersList } = useUser()
  form.size = 10
  form.builtinRoles = builtinRoles
  form.roleId = roleId
  form.showBalance = true

  const headerFormRef = ref<FormInstance>()

  const submit = (val: string) => {
    if (val == 'reset') {
      headerFormRef.value.resetFields()
    }
    form.page = 1
    getList()
  }
  const handlePageChange = (val) => {
    if (val.type == 'size') {
      form.page = setPage(form.total, form)
    }
    getList()
  }
  let loaded = false
  const getList = async () => {
    gridOptions.loading = true
    await getUsersList()
    if (userList.value.length > 0 && userList.value[0].balances?.length > 0 && !loaded) {
      loaded = true
      const arr: VxeTableDefines.ColumnOptions[] = userList.value[0].balances.map((item, index) => {
        const { countConfig } = item
        return {
          field: `balances[${index}].amount`,
          title: !index ? t('state.balance') + ' / ' + t('state.dollar') : countConfig?.name,
          minWidth: 100,
        } as VxeTableDefines.ColumnOptions
      })
      gridOptions.columns.splice(6, 0, arr[0], {
        title: t('state.frequency'),
        children: arr.slice(1),
      } as VxeTableDefines.ColumnOptions)
      gridOptions.columns = [...gridOptions.columns]
    }
    gridOptions.loading = false
  }

  onMounted(async () => {
    await getList()
  })
</script>

<style scoped></style>
