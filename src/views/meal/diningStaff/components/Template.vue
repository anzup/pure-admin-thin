<template>
  <Table :data="userList" v-bind="gridOptions" @handlePageChange="handlePageChange">
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
</template>

<script lang="ts" setup>
  import { onMounted, reactive, ref } from 'vue'
  import type { FormInstance } from 'element-plus'

  import Table from '/@/components/Table/index.vue'
  import FormBtn from '/@/components/headerFormBtn/index.vue'
  import { VxeGridProps } from 'vxe-table'
  import { setPage } from '/@/utils/utils'
  import { useI18n } from '/@/hooks/useI18n'
  import useUser from '/@/hooks/useUser'

  interface Props {
    departmentList: any[]
    builtinRoles: string
    roleId: number
  }

  const { t } = useI18n()

  // eslint-disable-next-line vue/no-setup-props-destructure
  const { departmentList = [], builtinRoles, roleId } = defineProps<Props>()

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
        field: 'idNumber',
        title: t('state.idNumber'),
        minWidth: 100,
      },
      {
        field: 'department.name',
        title: t('state.department'),
        // formatter: ({ cellValue }) =>
        //   departmentList.value.find((v) => v.id === cellValue)?.name ?? '',
      },
      {
        field: 'phone',
        title: t('state.cellphoneNumber'),
        minWidth: 100,
      },
      {
        title: t('state.operation'),
        width: 230,
        field: 'operationTypes',
        cellRender: {
          name: 'buttons',
          props: {
            buttons: [
              {
                name: t('buttons.detail'),
                event: ({ row }) => {
                  console.log(row)
                },
              },
            ] as ButtonArr,
          },
        },
      },
    ],
  })

  const { userList, userForm: form, getUsersList: getList } = useUser()
  form.size = 10
  form.builtinRoles = builtinRoles
  form.roleId = roleId

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

  onMounted(async () => {
    gridOptions.loading = true
    await getList()
    gridOptions.loading = false
  })
</script>

<style scoped></style>
