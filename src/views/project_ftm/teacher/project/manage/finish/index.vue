<template>
  <div>
    <VxeTable
      ref="xTable"
      :data="tableData"
      :loading="loading"
      :columns="tableColumns"
      :buttons="tableButtons"
      v-model:form="pagination"
      :toolbarConfig="tableTools"
      @handlePageChange="handleCurrentChange"
    >
      <template #form>
        <el-form inline size="medium">
          <el-form-item :label="$t('table.classNumber')">
            <!-- 班级课号 -->
            <el-select v-model="form.classNumber" :placeholder="$t('common.all')" clearable>
              <el-option
                v-for="(item, index) in form.classList"
                :key="index"
                :label="item.courseNumber"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('table.filghtTeam')">
            <!-- 飞行小组 -->
            <el-select v-model="form.teamName" :placeholder="$t('common.all')" clearable>
              <el-option
                v-for="(item, index) in form.teamList"
                :key="index"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-input
              :placeholder="$t('holder.pleaseEnterStudentName')"
              v-model.trim="form.searchKey"
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
            <el-button type="primary" @click="search">{{ $t('button.query') }}</el-button
            ><!-- 查询 -->
          </el-form-item>
        </el-form>
      </template>
    </VxeTable>

    <qr-dialog v-if="qrDialogVisible" v-model="qrDialogVisible" :rowData="rowData" />
    <signTrainDialog
      v-if="dialogVisible"
      v-model:dialogVisible="dialogVisible"
      :id="rowData.id"
      @cancelDialog="cancelDialog"
      @complate="getTableData"
    />
  </div>
</template>

<script>
  import VxeTable from '/@/components/Table/index.vue'
  import qrDialog from './components/qrCodeDialog.vue'
  import signTrainDialog from './components/signTrainDialog.vue'
  import { Search } from '@element-plus/icons-vue'
  import Api from '/@/api/ftm/teacher/trainEva'
  import { groupAll, noFinishedClazzs } from '/@/api/ftm/teacher/studentTraining'
  import XEUtils from 'xe-utils'
  import { useRouter } from 'vue-router'
  import { useGo } from '/@/hooks/usePage'
  import { deleteEmptyParams } from '../../../../../../utils'
  export default {
    data() {
      return {
        menuName: 'FLIGHT_TEST',
        form: {
          classNumber: undefined,
          teamName: undefined,
          searchKey: '',
          classList: [],
          teamList: [],
        },
        loading: false,
        tableData: [],
        tableTools: {
          enabled: false,
          slots: {
            buttons: 'left_tools',
          },
        },
        tableColumns: [
          { type: 'seq', title: this.$t('common.serialNumber'), width: 60 },
          {
            field: 'studentTrainingRecord.student.name',
            title: this.$t('table.name'),
            minWidth: 120,
          },
          {
            field: 'studentTrainingRecord.student.gender',
            title: this.$t('table.gender'),
            width: 80,
            formatter: this.genderFormat,
          },
          // { field: "studentTrainingRecord.student.idNumber", title: this.$t('table.idNumber'), minWidth: 180 },
          {
            field: 'studentTrainingRecord.customer.name',
            title: this.$t('table.airlines'),
            minWidth: 100,
          },
          {
            field: 'studentTrainingRecord.clazz.courseNumber',
            title: this.$t('table.classNumber'),
            minWidth: 140,
          },
          {
            field: 'studentTrainingRecord.grouping.name',
            title: this.$t('table.filghtTeam'),
            minWidth: 120,
          },
          {
            field: 'studentTrainingRecord.grouping.teachers',
            title: this.$t('table.filghtTeacher'),
            minWidth: 120,
            formatter: this.teacherFormat,
          },
          // { field: "status", title: this.$t('table.writeStatus'), width: 90, formatter: this.statusFormat },
          // { field: "studentSignature", title: this.$t('table.studentSignStatus'), width: 120, formatter: this.signFormat },
          // { field: "type", title: this.$t('table.examType'), width: 90, formatter: this.typeFormat },
          {
            field: 'result',
            title: this.$t('table.examResults'),
            width: 90,
            formatter: this.resultFormat,
          },
          {
            field: 'result',
            title: this.$t('table.disposalSuggest'),
            width: 120,
            formatter: this.resultFormat2,
          },
          { title: this.$t('table.tableEdit'), width: 160, slots: { default: 'operate' } },
        ],
        qrDialogVisible: false,
        pagination: {
          // 表格分页信息
          page: 1,
          size: 10,
          total: 0,
        },
        rowData: {},
        dialogVisible: false,
      }
    },
    components: { qrDialog, signTrainDialog, VxeTable, Search },
    setup() {
      const router = useRouter()
      const routerGo = useGo(router)
      return {
        routerGo,
      }
    },
    created() {
      noFinishedClazzs().then((res) => {
        this.form.classList = res.data.content
      })
      groupAll().then((res) => {
        this.form.teamList = res.data
      })
      if (this.$route.query.id) {
        this.form.classNumber = Number(this.$route.query.id)
      }
      this.form.ids = this.$route.query.ids
      this.getTableData()
    },
    // 原缓存页面 执行activated
    mounted() {
      if (this.$route.query.id) {
        this.form.classNumber = Number(this.$route.query.id)
      }
      this.form.ids = this.$route.query.ids
      this.getTableData()
    },
    methods: {
      qrView(row) {
        this.qrDialogVisible = true
        this.rowData = row
      },
      handleCurrentChange({ page, size }) {
        this.pagination.page = page
        this.pagination.size = size
        this.getTableData()
      },
      // 获取列表
      getTableData() {
        this.loading = true
        let param = {
          page: this.pagination.page,
          size: this.pagination.size,
          searchKey: this.form.searchKey,
          clazzId: this.form.classNumber,
          groupingId: this.form.teamName,
          clazzStatusIN: 'NOT_STARTED,TRAINING',
          audited: false,
          signed: true,
          ids: this.form.ids,
        }
        Api.flyExam(param)
          .then(({ data }) => {
            this.loading = false
            this.tableData = data.content
            this.pagination.total = data.totalElements
          })
          .catch((e) => {
            this.loading = false
          })
      },
      // 签办
      setflyTrainAudit(row) {
        this.$confirm(this.$t('holder.pleaseEndOfTraining'), this.$t('tip.tip'), {
          type: 'warning',
          confirmButtonText: this.$t('button.confirm'),
          cancelButtonText: this.$t('button.cancel'),
          // inputPlaceholder: this.$t('common.pleaseEnterPinCode'),
          // inputType: 'password',
          // inputPattern: /^[\s\S]*.*[^\s][\s\S]*$/,
          // inputErrorMessage: this.$t('common.pleaseEnterPinCode')
        })
          .then(() => {
            let param = {
              id: row.id,
              auditType: 'NORMAL_GRADUATE',
              // pinCode: value
            }
            Api.setflyTrainAudit(param)
              .then(() => {
                this.$message({
                  type: 'success',
                  duration: 1500,
                  message: this.$t('tip.saveSuccessTip'),
                })
                this.getTableData()
              })
              .catch((e) => {
                this.loading = false
              })
          })
          .catch(() => {})
      },
      cancelDialog() {
        this.dialogVisible = false
      },
      toPage(uri, params) {
        let url = uri + '?'
        let query = deleteEmptyParams(params)
        for (let [key, value] of Object.entries(query)) {
          url += `${key}=${value}&`
        }
        url = url.substring(0, url.length - 1)
        this.routerGo(url)
      },
      // 格式化性别
      genderFormat({ cellValue }) {
        return cellValue == 'M' ? this.$t('common.male') : this.$t('common.female')
      },
      // 格式化教员
      teacherFormat({ cellValue }) {
        return cellValue instanceof Array ? cellValue.map((v) => v.name).join(',') : ''
      },
      // 格式化填写状态
      statusFormat({ cellValue }) {
        switch (cellValue) {
          case 'FILLED':
            return this.$t('status.fillOver')
          case 'NOT_FILLED':
            return this.$t('status.noFill')
          default:
            return ''
        }
      },
      // 格式化考试类型
      typeFormat({ cellValue }) {
        switch (cellValue) {
          case 'NORMAL':
            return this.$t('status.normalTest')
          case 'SUPPLEMENTARY':
            return this.$t('status.makeUpTest')
          default:
            return ''
        }
      },
      // 格式化考试结果
      resultFormat({ cellValue }) {
        switch (cellValue) {
          case 'PASS':
            return this.$t('status.qualified')
          case 'ABORT':
            return this.$t('status.unqualified')
          case 'ADD_ONE':
            return this.$t('status.unqualified')
          case 'ADD_TWO':
            return this.$t('status.unqualified')
          default:
            return ''
        }
      },
      // 格式化处置意见
      resultFormat2({ cellValue, row }) {
        if (cellValue == 'PASS') {
          return ''
        } else if (row.trainingResult && row.trainingResult.name) {
          return row.trainingResult.name
        } else {
          switch (cellValue) {
            case 'ABORT':
              return this.$t('status.abortTrain')
            case 'ADD_ONE':
              return this.$t('status.addOneForExam')
            case 'ADD_TWO':
              return this.$t('status.addTwoForExam')
            default:
              return ''
          }
        }
      },
      signFormat({ cellValue }) {
        if (cellValue) {
          return this.$t('status.signed')
        } else {
          return this.$t('status.notSign')
        }
      },
      search() {
        let { query, path } = this.$route
        if (this.form.ids) {
          let params = XEUtils.clone(query, true)
          delete params.ids
          delete this.form.ids
          this.$router.replace({
            path,
            query: params,
          })
        }
        this.pagination.page = 1
        this.getTableData()
      },
      setTrainEvent(row) {
        this.dialogVisible = true
        this.rowData = row
      },
      tableButtons({ row }) {
        return [
          {
            name: this.$t('button.endOfTraining'),
            visible: row.result == 'PASS',
            event: () => {
              this.setflyTrainAudit(row)
            },
          },
          {
            name: this.$t('table.signSetTrain'),
            visible: row.result != 'PASS',
            event: () => {
              this.setTrainEvent(row)
            },
          },
          {
            name: this.$t('button.details'),
            event: () => {
              this.toPage('finish/detail', { id: row.id, status: row.status })
            },
          },
        ]
      },
    },
  }
</script>
