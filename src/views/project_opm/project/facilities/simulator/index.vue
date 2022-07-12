<template>
  <VxeTable
    v-if="loaded"
    v-bind="gridOptions"
    :form="form"
    @action="btnClick"
    @handlePageChange="handlePageChange"
  />
</template>

<script lang="ts">
  import VxeTable from '/@/components/Table/index.vue'
  import { defineComponent, reactive, onMounted, ref } from 'vue'
  import { VxeGridProps } from 'vxe-table'
  import { getSimulatorList } from '/@/api/opm/device'
  import { useRouter } from 'vue-router'
  import { useI18n } from 'vue-i18n'
  import { setPage } from '/@/utils/utils'
  import to from 'await-to-js'
  export default defineComponent({
    components: {
      VxeTable,
    },
    setup() {
      const { t } = useI18n()
      const router = useRouter()
      const gridOptions = reactive({
        columns: [
          // { type: "checkbox", width: 50 },
          { type: 'seq', width: 60, title: t('text.seq') },
          {
            field: 'name',
            title: t('text.simulator_name'),
            // sortable: true,
            minWidth: 100,
          },
          {
            // sortable: true,
            field: 'deviceTypeName',
            title: t('text.facilities_type'),
            // width:300
            minWidth: 100,
          },
          {
            // sortable: true,
            field: 'level',
            title: t('text.equipment_level'),
            minWidth: 100,
          },
          {
            // sortable: true,
            field: 'expiredDate',
            title: t('text.certificate_validity'),
            formatter: 'formatDate',
            minWidth: 100,
          },
          {
            field: 'principalName',
            title: t('text.person_in_charge'),
            minWidth: 100,
          },
          {
            // sortable: true,
            field: 'status',
            title: t('text.state'),
            formatter: formatStatus,
            minWidth: 100,
          },
          {
            title: t('text.operation'),
            width: 290,
            slots: { default: 'operate' },
            field: 'operationTypes',
            // fixed:'right'
          },
        ],

        data: [],
        buttons: [
          // {
          //     name: "证书",
          //     type: "certificate",
          // },
          // {
          //     name: "二维码",
          //     type: "qrcode",
          // },
          {
            name: t('message.hsDetail'),
            type: 'detail',
          },
        ],
        loading: false,
      } as VxeGridProps)
      const form = reactive({
        page: 1,
        size: 10,
        total: 0,
      })
      const loaded = ref(false)
      /** 生命周期 */
      onMounted(() => {
        loaded.value = true

        getList()
      })
      /**方法 */
      function formatStatus({ cellValue }) {
        switch (cellValue) {
          case 'OPERATIONAL':
            return t('text.available')

          case 'AOG':
            return t('text.not_available')
        }
      }
      const getList = async () => {
        gridOptions.loading = true

        const [err, res] = await to(getSimulatorList(form))
        gridOptions.loading = false
        if (!err && res.status === 200) {
          gridOptions.data = res.data.content
          form.total = res.data.totalElements
        }
      }
      const btnClick = ({ type, row }) => {
        switch (type) {
          case 'detail':
            router.push({
              path: `/device/simulator/${row.id}`,
            })
            break

          default:
            break
        }
      }
      const handlePageChange = (val) => {
        if (val.type == 'size') {
          form.page = setPage(form.total, form)
        }
        getList()
      }
      return {
        gridOptions,
        form,
        btnClick,
        handlePageChange,
        loaded,
      }
    },
  })
</script>
