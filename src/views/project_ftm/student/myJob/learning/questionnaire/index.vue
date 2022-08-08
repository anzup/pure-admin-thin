<template>
  <VxeTable
    :data="tableData"
    :columns="tableColumns"
    :loading="loading"
    :buttons="tableButtons"
    v-model:form="pagination"
    @handlePageChange="handlePage"
  >
    <template #time="{ row }"
      >{{ XEUtils.toDateString(row.questionnaire.startTime, 'yyyy/MM/dd') }} -
      {{ XEUtils.toDateString(row.questionnaire.endTime, 'yyyy/MM/dd') }}</template
    >
  </VxeTable>
</template>

<script>
  import VxeTable from '/@/components/Table/index.vue'
  import { getQrecord } from '/@/api/ftm/student/teachingCenter'
  import XEUtils from 'xe-utils'
  import to from 'await-to-js'
  import { useRouter } from 'vue-router'
  import { useGo } from '/@/hooks/usePage'
  import { useUserStore } from '/@/store/modules/user'
  const userStore = useUserStore()
  export default {
    components: { VxeTable },
    data() {
      return {
        XEUtils,
        form: {
          filled: false,
          searchKey: undefined,
          userId: undefined,
        },
        loading: false,
        pagination: {
          page: 1,
          size: 10,
          total: 0,
        },
        tableData: [],
        tableColumns: [
          { type: 'seq', width: 60, title: this.$t('common.serialNumber') },
          { field: 'questionnaire.name', title: this.$t('table.title'), minWidth: 160 },
          {
            field: 'questionnaire.type',
            title: this.$t('table.questionnaireType'),
            width: 200,
            formatter: this.typeFormat,
          },
          {
            title: this.$t('table.questionnaireValidity'),
            minWidth: 200,
            slots: { default: 'time' },
          },
          { title: this.$t('table.tableEdit'), width: 100, slots: { default: 'operate' } },
        ],
      }
    },
    computed: {
      userInfo() {
        return userStore.userInfo
      },
    },
    created() {
      this.getData()
    },
    setup() {
      const router = useRouter()
      const routerGo = useGo(router)
      return {
        routerGo,
      }
    },
    methods: {
      // 获取列表
      async getData() {
        this.form.userId = this.userInfo.userId
        let params = {
          ...this.form,
          page: this.pagination.page,
          size: this.pagination.size,
        }
        this.loading = true
        let [err, res] = await to(getQrecord(params))
        this.loading = false
        if (!err) {
          this.tableData = res.data.content
          this.pagination.total = res.data.totalElements
        }
      },
      // 分页事件
      handlePage({ page, size }) {
        this.pagination.page = page
        this.pagination.size = size
        this.getData()
      },
      // 格式化问卷类型
      typeFormat({ cellValue }) {
        return cellValue == 'PUBLIC'
          ? this.$t('table.publicQuestionnaire')
          : this.$t('table.privateQuestionnaire')
      },
      toFillPage(row) {
        this.routerGo(`questionnaire/fillin?id=${row?.questionnaire?.id || ''}&recordId=${row.id}`)
      },
      tableButtons({ row }) {
        return [
          {
            name: this.$t('button.fillIn'),
            event: () => {
              this.toFillPage(row)
            },
          },
        ]
      },
    },
  }
</script>
