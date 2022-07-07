<template>
  <div class="h-full">
    <VxeTable v-model:form="form" v-bind="gridOptions" @handlePageChange="handlePageChange" />
  </div>
</template>

<script lang="ts" setup>
  import VxeTable from '/@/components/Table/index.vue'
  import { onMounted, reactive, ref } from 'vue'
  import { getConfigs, GetConfigs, putConfigsId } from '/@/api/configs'
  // import DiaLog from './components/Dialog.vue'
  import { setPage } from '/@/utils/utils'
  import { ElMessageBox } from 'element-plus'
  import { useI18n } from 'vue-i18n'

  const { t } = useI18n()

  const gridOptions = reactive<VxeTableAllProps>({
    height: 'auto',
    columns: [
      // { type: "checkbox", width: 50 },
      { type: 'seq', width: 60, title: t('state.seq') },
      {
        field: 'transName',
        title: t('state.functionName'),
        // sortable: true,
        minWidth: 100,
      },
      {
        field: 'value',
        title: t('state.value'),
        minWidth: 100,
      },
      {
        field: 'valueType',
        title: t('state.type'),
        minWidth: 100,
      },

      {
        title: t('state.operation'),
        width: 200,
        slots: { default: 'operate' },
        field: 'operationTypes',
        // fixed:'right'
      },
    ],

    data: [],
    buttons: [
      {
        name: t('buttons.edit'),
        type: 'edit',
        event: ({ row }) => {
          ElMessageBox.prompt(t('tip.pleaseEnter'), t('state.tip'), {
            inputPattern: /^-?\d+$/,
            inputErrorMessage: t('tip.pleaseEnterAnInteger'),
          })
            .then(({ value }) => {
              putConfigsId({ id: row.id, value })
            })
            .catch(() => {})
            .finally(() => {
              getList()
            })
        },
      },
    ],

    loading: false,
  })
  const form = reactive<GetConfigs>({
    page: 1,
    size: 10,
    total: 0,
  })
  const isShow = ref(false)
  onMounted(() => {
    getList()
  })

  const detailId = ref(undefined)
  const type = ref('')

  const getList = () => {
    gridOptions.loading = true
    getConfigs(form).then((res) => {
      const {
        data: { content, totalElements },
      } = res
      gridOptions.data = content
      form.total = totalElements
      gridOptions.loading = false
    })
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars,no-unused-vars
  const add = () => {
    isShow.value = true
    type.value = 'add'
    detailId.value = undefined
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars,no-unused-vars
  const updateData = () => {
    getList()
  }

  const handlePageChange = (val) => {
    if (val.type == 'size') {
      form.page = setPage(form.total, form)
    }
    getList()
  }
</script>

<style scoped></style>
