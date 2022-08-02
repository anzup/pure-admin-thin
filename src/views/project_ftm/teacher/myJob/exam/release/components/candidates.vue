<template>
  <div class="flex-container">
    <div class="flex-content">
      <VxeTable
        ref="xTable"
        :data="tableData"
        :columns="tableColumns"
        :toolbarConfig="tableTools"
        :buttons="tableButtons"
      >
        <template #form>
          <el-form ref="form" :model="form" :inline="true" size="medium">
            <el-form-item>
              <el-input
                :placeholder="$t('holder.pleaseEnterTheNameOfTheStudent')"
                v-model="form.searchKey"
                clearable
                style="width: 200px"
              >
                <template #suffix>
                  <el-icon>
                    <Search />
                  </el-icon>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="query">{{ $t('button.query') }}</el-button>
            </el-form-item>
          </el-form>
        </template>
        <template #right_tools>
          <el-button size="mini" @click="addSystemExam" type="primary" :disabled="disabled">{{
            $t('button.addSystemExam')
          }}</el-button>
          <el-button size="mini" @click="addTemporaryExam" type="primary">{{
            $t('button.addTemporaryExam')
          }}</el-button>
          <el-button size="mini" @click="importTemporaryCandidates" type="primary">{{
            $t('button.importTemporaryCandidates')
          }}</el-button>
          <el-button size="mini" @click="listPrinting" type="primary">{{
            $t('button.listPrinting')
          }}</el-button>
        </template>
        <template #pager />
      </VxeTable>
    </div>
    <div class="footerBtn">
      <el-button @click="goBack" type="primary" plain>{{ $t('button.cancel') }}</el-button>
      <el-button
        v-if="examsInfo && examsInfo.status !== 'EXAMING'"
        type="primary"
        @click="lastStep"
        >{{ $t('button.lastStep') }}</el-button
      >
      <el-button type="primary" @click="handleSave" class="rightBtn" :loading="loading">{{
        $t('button.save')
      }}</el-button>
    </div>
  </div>

  <!-- 新增系统考生 -->
  <system-students-dialog
    v-model:systemStudentDialogVisible="systemStudentDialogVisible"
    :tableData="defaultData"
    @handleCancel="handleCancel"
    @getStudentData="getStudentData"
  />

  <!-- 新增临时考生 -->
  <add-tmporary-candidates
    ref="tmporary"
    v-model:temporaryExamDialogVisible="temporaryExamDialogVisible"
    @handleCancel="handleCancel"
    @geteTmporaryData="geteTmporaryData"
  />

  <!-- 导入临时考生 -->
  <import-tmporary-candidates
    v-model:importTemporaryDialogVisible="importTemporaryDialogVisible"
    @handleCancel="handleCancel"
    @getImportData="getImportData"
  />
</template>

<script>
  import VxeTable from '/@/components/Table/index.vue'
  import { Search } from '@element-plus/icons-vue'
  import XEUtils from 'xe-utils'
  import axios from 'axios'
  import selectedView from '/@/views/project_ftm/teacher/components/SelectedView/index.vue'
  import systemStudentsDialog from './systemStudentsDialog.vue'
  import addTmporaryCandidates from './addTmporaryCandidates.vue'
  import importTmporaryCandidates from './importTmporaryCandidates.vue'
  import { putExamsId } from '/@/api/ftm/teacher/examCenter'
  import { debounce, downLoadBlob } from '/@/utils/index'
  import { useFtmUserStore } from '/@/store/modules/ftmUser'
  import { useUserStore } from '/@/store/modules/user'
  import { useI18n } from 'vue-i18n'
  const accountStore = useUserStore()
  const userStore = useFtmUserStore()
  export default {
    props: ['examsInfo', 'type'],
    data() {
      return {
        allAlign: null,
        disabled: false,
        records: [],
        form: {
          page: 1,
          size: 10,
          sort: undefined,
          order: 'asc',
          name: undefined,
        },
        test: [],
        tableData: [],
        tableTools: {
          perfect: true,
          slots: {
            tools: 'right_tools',
          },
        },
        tableColumns: [
          { type: 'seq', width: 60, title: this.$t('common.serialNumber') },
          { field: 'name', title: this.$t('table.name'), minWidth: 100 },
          {
            field: 'gender',
            title: this.$t('table.gender'),
            formatter: this.formatGender,
            width: 80,
          },
          { field: 'phone', title: this.$t('table.cellPhoneNumber'), width: 120 },
          { field: 'idNumber', title: this.$t('table.idNumber'), minWidth: 180 },
          { field: 'courseNumber', title: this.$t('table.courseNumber'), minWidth: 120 },
          {
            field: 'type',
            title: this.$t('table.examIdentity'),
            formatter: this.formatType,
            width: 90,
          },
          { title: this.$t('table.tableEdit'), width: 120, slots: { default: 'operate' } },
        ],
        defaultData: [],
        total: 1,
        systemStudentDialogVisible: false,
        temporaryExamDialogVisible: false,
        importTemporaryDialogVisible: false,
        queryFlag: false,
        tableDataCopy: [],
        loading: false,
      }
    },
    computed: {
      userInfo() {
        return userStore.$state
      },
      xTable() {
        return this.$refs.xTable.$refs.xTable
      },
    },
    components: {
      selectedView,
      systemStudentsDialog,
      addTmporaryCandidates,
      importTmporaryCandidates,
      VxeTable,
      Search,
    },
    created() {
      if (sessionStorage.getItem('makeUpInfo')) {
        // 补考
        const makeUpInfo = JSON.parse(sessionStorage.getItem('makeUpInfo'))
        this.disabled = true
        if (makeUpInfo.students.length !== 0) {
          this.tableData = makeUpInfo.students.filter((v) => !v.pass)
        }
      } else if (this.examsInfo) {
        this.tableData = this.examsInfo.students
      }
    },
    mounted() {
      this.debouncedClickFn = debounce(this.handleSave, 0.5 * 1000)
    },
    setup() {
      const { locale } = useI18n()
      return { locale }
    },
    methods: {
      debouncedClickFn() {}, // 防抖
      addSystemExam() {
        // 系统考生
        this.defaultData = this.tableData.map((item) => ({
          ...item,
          userId_courseNumber: this.userInfo.teacherAdmin
            ? item.userId
            : `${item.userId}_${item.courseNumber}`,
        }))
        this.systemStudentDialogVisible = true
      },
      remove(id, index) {
        this.tableData.splice(index, 1)
        this.xTable.reloadData(this.tableData)
      },
      lastStep() {
        this.$emit('getActive', 2)
      },
      seqMethod(row) {
        return (this.form.page - 1) * this.form.size + row.seq
      },
      formatGender({ cellValue }) {
        return cellValue == 'M' ? this.$t('common.male') : this.$t('common.female')
      },
      formatType({ cellValue }) {
        return cellValue == 'SYSTEM'
          ? this.$t('status.systemCandidates')
          : this.$t('status.temporaryCandidates')
      },
      getStudentData(val) {
        // this.tableData.forEach(v => { v.studentId ? v.id = v.studentId : null })
        this.tableData = val.map((v) =>
          this.userInfo.teacherAdmin
            ? {
                userId_courseNumber: v.userId,
                gender: v.gender,
                idNumber: v.idNumber,
                name: v.name,
                phone: v.phone,
                userId: v.userId,
                type: v.type == 'TEMPORARY' ? v.type : 'SYSTEM',
              }
            : {
                userId_courseNumber: `${v.userId}_${
                  v.courseNumber || (v.clazz && v.clazz.courseNumber)
                }`,
                gender: v.gender,
                idNumber: v.idNumber,
                name: v.name,
                phone: v.phone,
                userId: v.userId,
                courseNumber: v.courseNumber || (v.clazz && v.clazz.courseNumber),
                type: v.type == 'TEMPORARY' ? v.type : 'SYSTEM',
              },
        )
        this.systemStudentDialogVisible = false
        this.defaultData = []
      },
      addTemporaryExam() {
        this.temporaryExamDialogVisible = true
      },
      geteTmporaryData(val) {
        // TEMPORARY
        this.tableData.push(val)
      },
      getImportData(val) {
        if (this.tableData.length == 0) {
          this.tableData = val
        } else {
          // 身份证不一样 过滤
          this.tableData = this.tableData.concat(val)
          this.importTemporaryDialogVisible = false
        }
      },
      handleCancel() {
        this.systemStudentDialogVisible = false
        this.temporaryExamDialogVisible = false
        this.importTemporaryDialogVisible = false
        this.defaultData = []
      },
      handleSave(type) {
        var data = {
          id: undefined,
          students: this.tableData,
        }
        if (this.examsInfo) {
          data.id = this.examsInfo.id
        } else {
          data.id = sessionStorage.getItem('examId')
        }
        this.loading = true
        putExamsId(data).then((res) => {
          this.loading = false
          if (res.status == 200) {
            if (type == 'print') {
              axios({
                url: import.meta.env.VITE_BASE_API_FTM + `/exams/${data.id}/studentExport/inline`,
                method: 'get',
                responseType: 'arraybuffer',
                headers: {
                  'Accept-Language': this.locale,
                  Authorization: 'Bearer ' + accountStore.token,
                },
              }).then((res) => {
                downLoadBlob(res.data)
              })
            } else {
              window.sessionStorage.removeItem('examId')
              this.$message.success(this.$t('tip.saveSuccessTip'))
              this.$router.back()
              // if (this.type == 'FORMAL' || (this.examsInfo && this.examsInfo.type == 'FORMAL')) {
              //   this.$router.push({
              //     path: '/exam/release',
              //   })
              // } else {
              //   this.$router.push({
              //     path: 'exam/mock',
              //   })
              // }
            }
          }
        })
      },
      goBack() {
        if (sessionStorage.getItem('examId')) {
          sessionStorage.removeItem('examId')
        }
        this.$router.go(-1)
      },
      importTemporaryCandidates() {
        this.importTemporaryDialogVisible = true
      },
      listPrinting() {
        // 打印前 先保存
        this.handleSave('print')
      },
      query() {
        let searchKey = this.myTrim(this.form.searchKey)
        if (!this.queryFlag) {
          this.tableDataCopy = XEUtils.clone(this.tableData, true)
        }
        if (
          String(searchKey) == '' ||
          String(searchKey) == 'undefined' ||
          String(searchKey) == 'null'
        ) {
          this.tableData = this.tableDataCopy
        } else {
          this.queryFlag = true
          this.tableData = this.tableDataCopy.filter(
            (item) => item.name.toLowerCase().indexOf(searchKey.toLowerCase()) !== -1,
          )
        }
      },
      myTrim(x) {
        if (x) {
          return x.replace(/^\s+|\s+$/gm, '')
        } else {
          return ''
        }
      },
      tableButtons({ row, rowIndex }) {
        return [
          {
            name: this.$t('button.remove'),
            event: () => {
              this.remove(row.id, rowIndex)
            },
          },
        ]
      },
    },
  }
</script>

<style scoped lang="scss">
  .flex-container {
    display: flex;
    height: 100%;
    flex-direction: column;
  }
  .flex-content {
    flex: 1;
  }
  .footerBtn {
    text-align: right;
    margin-top: 12px;
  }
</style>
