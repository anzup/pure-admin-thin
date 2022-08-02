<template>
  <VxeTable
    :loading="loading"
    :data="tableData"
    :columns="tableColumns"
    :toolbar-config="tableTools"
    :buttons="tableButtons"
  >
    <template #form>
      <el-form inline size="medium">
        <el-form-item>
          <el-input
            :placeholder="$t('holder.pleaseEnterQuestionnaireTemplate')"
            v-model="searchKey"
            style="width: 16em"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">{{ $t('button.query') }}</el-button>
        </el-form-item>
      </el-form>
    </template>
    <template #right_tools>
      <el-button
        size="mini"
        type="primary"
        v-if="containsPermissions(menuName + ':ADD')"
        @click="addTemplate"
        >{{ $t('button.add') }}</el-button
      >
    </template>
    <template #pager />
  </VxeTable>
</template>

<script>
  import { getTemplate, deleteTemplate } from '/@/api/ftm/teacher/education'
  import VxeTable from '/@/components/Table/index.vue'
  import XEUtils from 'xe-utils'
  import to from 'await-to-js'
  import { useRouter } from 'vue-router'
  import { useGo } from '/@/hooks/usePage'
  import { useFtmUserStore } from '/@/store/modules/ftmUser'
  const userStore = useFtmUserStore()
  export default {
    components: { VxeTable },
    data() {
      return {
        menuName: 'QUESTIONNAIRE_TEMPLATE',
        loading: false,
        searchKey: '',
        tableData: [],
        tableTools: {
          perfect: true,
          slots: {
            tools: 'right_tools',
          },
        },
        tableColumns: [
          { type: 'seq', width: 60, title: this.$t('common.serialNumber') },
          { field: 'name', title: this.$t('table.templateName'), minWidth: 280 },
          {
            field: 'createdDate',
            title: this.$t('table.questionnaireAddTime'),
            formatter: this.dateFormat,
            width: 200,
          },
          { field: 'usedCount', title: this.$t('table.useTime'), width: 130 },
          { field: 'questionCount', title: this.$t('table.questionNum'), width: 160 },
          { title: this.$t('table.tableEdit'), width: 260, slots: { default: 'operate' } },
        ],
        pagination: {
          page: 1,
          size: 1000,
          total: 0,
        },
      }
    },
    computed: {
      rolesId() {
        return this.$route.query.roles_id || 'Template'
      },
      totalAuthorities() {
        return userStore.totalAuthorities
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
      async getData() {
        let params = {
          page: this.pagination.page,
          size: this.pagination.size,
          searchKey: this.searchKey,
        }
        this.loading = true
        let { data } = await getTemplate(params).catch(() => {
          this.loading = false
        })
        this.loading = false
        this.tableData = data.content
        this.pagination.total = data.totalElements
      },
      // 删除模板
      async Delete(id) {
        let [err] = await to(deleteTemplate({ id }))
        if (!err) {
          this.getData()
          this.$message.success(this.$t('tip.delsuccessTip'))
        }
      },
      Detail(row) {
        this.routerGo(`questionnaire/details?t_id=${row.id}&id=${this.rolesId}`)
      },
      Edit(row) {
        this.routerGo(`questionnaire/infoTemplate?t_id=${row.id}&id=${this.rolesId}`)
      },
      delTemplate(row) {
        this.$confirm(this.$t('tip.areYouSureYouWantToDelete'), this.$t('button.delete'), {
          type: 'error',
        })
          .then(() => {
            this.Delete(row.id)
          })
          .catch()
      },
      // 格式化日期
      dateFormat({ cellValue }) {
        return XEUtils.toDateString(cellValue, 'yyyy-MM-dd HH:mm:ss')
      },
      search() {
        this.pagination.page = 1
        this.getData()
      },
      addTemplate() {
        this.routerGo(`questionnaire/addTemplate?id=${this.rolesId}`)
      },
      containsPermissions(key) {
        return userStore.ContainsPermissions(key)
      },
      tableButtons({ row }) {
        return [
          {
            name: this.$t('button.details'),
            // visible: this.totalAuthorities.includes(this.menuName + ':DETAIL'),
            event: () => {
              this.Detail(row)
            },
          },
          {
            name: this.$t('button.modify'),
            // visible: this.totalAuthorities.includes(this.menuName + ':UPDATE'),
            event: () => {
              this.Edit(row)
            },
          },
          {
            name: this.$t('button.delete'),
            status: 'danger',
            // visible: this.totalAuthorities.includes(this.menuName + ':DELETE'),
            event: () => {
              this.delTemplate(row)
            },
          },
        ]
      },
    },
  }
</script>
