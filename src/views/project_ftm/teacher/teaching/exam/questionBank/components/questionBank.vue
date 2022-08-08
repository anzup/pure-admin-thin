<template>
  <VxeTable
    ref="xTable"
    :data="tableData"
    :columns="tableColumns"
    v-model:form="form"
    :toolbar-config="tableTool"
    :loading="loading"
    :buttons="tableButtons"
    @checkbox="selectChangeEvent"
    @handlePageChange="handlePageChange"
  >
    <template #form>
      <el-form ref="form" :model="form" :inline="true" size="medium">
        <el-form-item :label="$t('table.itemBankProperties')" v-if="id == 1">
          <el-select
            v-model="form.confidentialType"
            :placeholder="$t('holder.pleaseSelect')"
            style="width: 140px"
            clearable
          >
            <el-option
              :label="item.name"
              :value="item.id"
              v-for="item in properties"
              :key="item.index"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.teachingModel')">
          <el-select
            v-model="form.airplaneType"
            :placeholder="$t('holder.pleaseSelect')"
            style="width: 160px"
            clearable
          >
            <el-option
              :label="item"
              :value="item"
              v-for="item in airplaneTypesAll"
              :key="item.index"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input
            class=""
            :placeholder="$t('holder.pleaseEnterBankNameOrCreator')"
            v-model="form.searchKey"
            style="width: 280px"
          >
            <template #suffix>
              <el-icon>
                <Search />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">{{ $t('button.query') }}</el-button>
        </el-form-item>
      </el-form>
    </template>
    <template #right_tools>
      <div class="btnBox" v-if="id == 1">
        <!-- <el-button type="primary" @click="modifyExamQuestionNature">{{$t('button.modifyExamQuestionNature')}}
          </el-button> -->
        <el-button
          v-if="containsPermissions('QUESTION_BANK_PUBLIC:ADD')"
          size="mini"
          @click="add"
          type="primary"
          >{{ $t('button.add') }}</el-button
        >
        <el-button
          v-if="containsPermissions('QUESTION_BANK_PUBLIC:BULK_DELETION')"
          size="mini"
          type="danger"
          :disabled="records.length == 0"
          @click="postQuestionBanksBatchDelete"
          >{{ $t('button.batchDeletion') }}</el-button
        >
      </div>
      <div class="btnBox" v-if="id == 2">
        <el-button
          v-if="containsPermissions('QUESTION_BANK_TEACHER:CHANGE_PROPERTY')"
          size="mini"
          type="primary"
          :disabled="records.length < 1"
          :loading="loadingChange"
          @click="changeProperties"
          >{{ $t('button.changeProperties') }}</el-button
        >
        <el-button
          v-if="containsPermissions('QUESTION_BANK_TEACHER:ADD')"
          size="mini"
          @click="add"
          type="primary"
          >{{ $t('button.add') }}</el-button
        >
        <el-button
          v-if="containsPermissions('QUESTION_BANK_TEACHER:BULK_DELETION')"
          size="mini"
          type="danger"
          :disabled="records.length == 0"
          @click="postQuestionBanksBatchDelete"
          >{{ $t('button.batchDeletion') }}</el-button
        >
      </div>
    </template>

    <template #airType="{ row }">
      <div class="button-line">
        <span v-for="(item, index) in row.airplaneTypes" :key="index">{{ item }}</span>
      </div>
    </template>
  </VxeTable>
</template>

<script>
  import VxeTable from '/@/components/Table/index.vue'
  import { Search } from '@element-plus/icons-vue'
  import XEUtils from 'xe-utils'
  import selectedView from '/@/views/project_ftm/teacher/components/SelectedView/index.vue'
  import { getAirplaneTypesAll } from '/@/api/ftm/teacher/trainingPlan'
  import {
    getQuestionBanks,
    deleteQuestionBanksId,
    postQuestionBanksBatchDelete,
    getQuestionBanksMove,
    exportQuestionBanks,
  } from '/@/api/ftm/teacher/examCenter'
  import to from 'await-to-js'
  import { useRouter } from 'vue-router'
  import { useGo } from '/@/hooks/usePage'
  import { useUserStore } from '/@/store/modules/user'
  const userStore = useUserStore()
  export default {
    props: ['id'],
    data() {
      return {
        allAlign: null,
        loading: false,
        loadingChange: false,
        records: [],
        airplaneTypesAll: [],
        form: {
          page: 1,
          size: 10,
          total: 0,
          sort: undefined,
          order: 'asc',
          name: undefined,
          propertyId: undefined,
          airplaneType: undefined,
          type: 'PUBLIC',
          confidentialType: undefined,
          searchKey: undefined,
        },
        trainingAdminFlag: false,
        tableData: [],
        tableHeight: 0,
        tableTool: {
          perfect: true,
          slots: {
            tools: 'right_tools',
          },
        },
        properties: [
          {
            id: 'PUBLIC',
            name: this.$t('status.open'),
          },
          {
            id: 'CONFIDENTIAL',
            name: this.$t('status.confidential'),
          },
        ],
      }
    },
    components: {
      VxeTable,
      selectedView,
      Search,
    },
    watch: {
      id(val) {
        val == 1 ? (this.form.type = 'PUBLIC') : (this.form.type = 'TEACHER')
        this.getQuestionBanks()
      },
    },
    computed: {
      userInfo() {
        return userStore.userInfo
      },
      builtinRole() {
        return this.userInfo.builtinRole
      },
      totalAuthorities() {
        return this.userInfo.totalAuthorities
      },
      tableColumns() {
        return [
          { type: 'checkbox', width: '40' },
          { type: 'seq', width: '60', title: this.$t('common.serialNumber') },
          { field: 'name', title: this.$t('table.questionBankName'), minWidth: 160 },
          { field: 'creator.name', title: this.$t('table.creator'), minWidth: 120 },
          this.id == 1
            ? {
                field: 'confidentialType',
                title: this.$t('table.questionBankProperties'),
                formatter: this.formatType,
                width: 200,
              }
            : false,
          {
            field: 'airplaneTypes',
            title: this.$t('table.modelNumber'),
            minWidth: 100,
            slot: { default: 'airType' },
          },
          { field: 'questionCount', title: this.$t('table.numberOfTestQuestions'), width: 90 },
          { field: 'examCount', title: this.$t('table.testPaperGenerationTimes'), width: 90 },
          {
            field: 'createdDate',
            title: this.$t('table.creatorTime'),
            formatter: this.formatDate,
            width: 160,
          },
          { title: this.$t('table.tableEdit'), width: 280, slots: { default: 'operate' } },
        ].filter((item) => item)
      },
      xTable() {
        return this.$refs.xTable?.$refs?.xTable
      },
    },
    created() {
      this.getAirplaneTypesAll()
      if (sessionStorage.getItem('builtinRole') == 'TRAINING_ADMIN') {
        this.trainingAdminFlag = true
      }
    },
    mounted() {
      this.getQuestionBanks()
    },
    setup() {
      const router = useRouter()
      const routerGo = useGo(router)
      return {
        routerGo,
      }
    },
    methods: {
      // 选择表格列
      selectChangeEvent({ records }) {
        this.records = XEUtils.map(records, (item) => item.id)
      },
      getClearAll() {
        this.xTable?.clearSelectEvent()
        this.records = []
      },
      handlePageChange({ page, size }) {
        this.form.page = page
        this.form.size = size
        this.getQuestionBanks()
      },
      add() {
        this.routerGo(`questionBank/add?id=${this.id}&status=add`)
      },
      modify(id) {
        this.routerGo(`questionBank/add?id=${this.id}&status=modify&questionBankId=${id}`)
      },
      details(id) {
        this.routerGo(`questionBank/details?id=${id}`)
      },
      async getQuestionBanks() {
        this.tableData = []
        this.loading = true
        let params = XEUtils.clone(this.form, true)
        params.airplaneType = params.airplaneType ? params.airplaneType : undefined
        params.confidentialType = params.confidentialType ? params.confidentialType : undefined
        let [err, res] = await to(getQuestionBanks(params))
        this.loading = false
        if (!err && res.status == 200) {
          this.tableData = res.data.content
          this.form.total = res.data.totalElements
          this.getClearAll()
        }
      },
      deleteQuestionBanksId(id) {
        this.$confirm(this.$t('common.deleteData'), this.$t('tip.tip'), {
          confirmButtonText: this.$t('button.confirm'),
          cancelButtonText: this.$t('button.cancel'),
          type: 'warning',
        }).then(() => {
          deleteQuestionBanksId({
            id: id,
          }).then((res) => {
            if (res.status == 200) {
              if (
                parseInt(this.form.total / this.form.size) < this.form.page &&
                this.form.page !== 1
              ) {
                this.form.page = parseInt(this.form.total / this.form.size)
              }
              this.getQuestionBanks()
              this.$message.success(this.$t('tip.delsuccessTip'))
            }
          })
        })
      },
      postQuestionBanksBatchDelete() {
        this.$confirm(this.$t('common.deleteData'), this.$t('tip.tip'), {
          confirmButtonText: this.$t('button.confirm'),
          cancelButtonText: this.$t('button.cancel'),
          type: 'warning',
        }).then(() => {
          postQuestionBanksBatchDelete({
            ids: this.records,
          }).then((res) => {
            if (res.status == 200) {
              this.getQuestionBanks()
              this.$message.success(this.$t('tip.delsuccessTip'))
            }
          })
        })
      },
      getAirplaneTypesAll() {
        getAirplaneTypesAll().then((res) => {
          if (res.status == 200) {
            this.airplaneTypesAll = res.data
          }
        })
      },
      modifyExamQuestionNature() {},
      // 更改题目属性
      async changeProperties() {
        this.$confirm(this.$t('tip.thisOperationWillChangeProperties'), this.$t('tip.tip'), {
          type: 'warning',
        })
          .then(async () => {
            this.loadingChange = true
            let [err] = await to(getQuestionBanksMove({ ids: this.records }))
            this.loadingChange = false
            if (!err) {
              this.getClearAll()
              this.getQuestionBanks()
            }
          })
          .catch()
      },
      formatDate({ cellValue }) {
        return XEUtils.toDateString(cellValue, 'yyyy-MM-dd HH:mm:ss')
      },
      formatType({ cellValue }) {
        return cellValue == 'PUBLIC' ? this.$t('status.open') : this.$t('status.confidential')
      },
      // 导出试题
      async handleExport(id) {
        let loading = this.$loading({
          target: document.querySelector('.componentsContent'),
          text: this.$t('status.downloading'),
        })
        await to(exportQuestionBanks({ id }))
        loading.close()
      },
      search() {
        this.form.page = 1
        this.form.total = 0
        this.getQuestionBanks()
      },
      tableButtons({ row }) {
        switch (+this.id) {
          case 1: // 公共题库
            return [
              {
                name: this.$t('button.ExportQuestions'),
                visible:
                  this.totalAuthorities.includes('QUESTION_BANK_PUBLIC:EXPORT') &&
                  this.builtinRole == 'TRAINING_ADMIN',
                event: () => {
                  this.handleExport(row.id)
                },
              },
              {
                name: this.$t('button.details'),
                visible: this.totalAuthorities.includes('QUESTION_BANK_PUBLIC:DETAIL'),
                event: () => {
                  this.details(row.id)
                },
              },
              {
                name: this.$t('button.modify'),
                visible: this.totalAuthorities.includes('QUESTION_BANK_PUBLIC:UPDATE'),
                event: () => {
                  this.modify(row.id)
                },
              },
              {
                name: this.$t('button.delete'),
                status: 'danger',
                visible: this.totalAuthorities.includes('QUESTION_BANK_PUBLIC:DELETE'),
                event: () => {
                  this.deleteQuestionBanksId(row.id)
                },
              },
            ]
          case 2: // 教员题库
            return [
              {
                name: this.$t('button.ExportQuestions'),
                visible: this.totalAuthorities.includes('QUESTION_BANK_TEACHER:EXPORT'),
                event: () => {
                  this.handleExport(row.id)
                },
              },
              {
                name: this.$t('button.details'),
                visible: this.totalAuthorities.includes('QUESTION_BANK_TEACHER:DETAIL'),
                event: () => {
                  this.details(row.id)
                },
              },
              {
                name: this.$t('button.modify'),
                visible: this.totalAuthorities.includes('QUESTION_BANK_TEACHER:UPDATE'),
                event: () => {
                  this.modify(row.id)
                },
              },
              {
                name: this.$t('button.delete'),
                status: 'danger',
                visible: this.totalAuthorities.includes('QUESTION_BANK_TEACHER:DELETE'),
                event: () => {
                  this.deleteQuestionBanksId(row.id)
                },
              },
            ]
        }
      },
      containsPermissions(key) {
        return userStore.ContainsPermissions(key)
      },
    },
  }
</script>

<style lang="scss">
  .table-cell-class,
  .table-header-cell-class {
    height: 30px !important;
  }
</style>
