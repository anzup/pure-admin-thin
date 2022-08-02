<template>
  <div>
    <VxeTable
      :loading="loading"
      :data="tableData"
      :columns="tableColumns"
      v-model:form="pagination"
      @handlePageChange="handleCurrentChange"
    >
      <template #form>
        <div class="detail-content-c">
          <div v-if="Details.clazz">
            <!-- {{ $t('table.classNumber') }}：<span>{{ Details.clazz.courseNumber }}</span> -->
            <span style="margin-right: 12px">{{ $t('table.classNumber') }}</span>
            <el-select
              v-model="form.classId"
              :placeholder="$t('holder.pleaseSelect')"
              size="medium"
              @change="classChange"
            >
              <el-option
                v-for="item in classList"
                :key="item.clazz.id"
                :label="item.clazz.courseNumber"
                :value="item.clazz.id"
              />
            </el-select>
          </div>
          <div v-if="Details.clazz">
            {{ $t('table.sourse') }}：<span>{{ Details.clazz.course.name }}</span>
          </div>
          <div v-if="Details.clazz">
            {{ $t('table.modelNumber') }}：<span>{{ Details.clazz.airplaneType }}</span>
          </div>
        </div>
      </template>
      <template #createdDate="{ row }">
        <span v-if="row.startTime && row.lastModifiedDate"
          >{{ formatDate(row.startTime) }}-{{ formatDate(row.lastModifiedDate) }}</span
        >
      </template>
      <template #signTeachers="{ row }">
        <div class="inline-img" v-for="(item, index) in row.signTeachers || []" :key="index">
          <img class="sign-img" alt="" :src="previewURL(item.signature)" />
        </div>
      </template>
      <template #signStudents="{ row }">
        <div class="sign-btn-right-top" v-if="!row.studentSignature" @click="handleSign(row)">
          {{ $t('button.sign') }}
        </div>
        <div class="inline-img" v-if="row.studentSignature">
          <img class="sign-img" :src="previewURL(row.studentSignature)" alt="" />
        </div>
      </template>
      <template #remarks="{ row }">
        <div class="remark" v-for="(item, index) in row.signTeachers || []" :key="index">
          <span v-if="(row.signTeachers || []).length > 1">{{ item.userName }}:</span
          >{{ item.remark }}
        </div>
      </template>
      <template #pager />
    </VxeTable>

    <div class="print-box-hide">
      <div class="print-box" id="PrintTable">
        <PrintView :data="tableData" :clazz="printClazz" />
      </div>
    </div>

    <!-- 签名码 -->
    <el-dialog
      width="400px"
      top="30vh"
      :title="$t('table.sign')"
      v-model="signDialogVisible"
      :close-on-click-modal="false"
      center
    >
      <el-form
        :inline="true"
        ref="pinForm"
        label-width="100px"
        :rules="pinRules"
        :model="dialogForm"
      >
        <el-form-item :label="$t('table.pinCode')" prop="pinCode">
          <el-input
            type="password"
            v-model="dialogForm.pinCode"
            autocomplete="off"
            :placeholder="$t('holder.pleaseEnterSignPinCode')"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="handleDialogCancel" type="primary" plain size="medium">{{
          $t('button.cancel')
        }}</el-button>
        <el-button
          type="primary"
          size="medium"
          @click="handDialogConfirm"
          :loading="loadingDialog"
          >{{ $t('button.confirm') }}</el-button
        >
      </template>
    </el-dialog>
  </div>
</template>

<script>
  import VxeTable from '/@/components/Table/index.vue'
  import PrintView from './print.vue'
  import XEUtils from 'xe-utils'
  import to from 'await-to-js'
  import { getStudents, getStudentExamRecords } from '/@/api/ftm/student/studentTraining'
  import {
    postClazzTeachingSchedules,
    putClazzTeachingSchedules,
  } from '/@/api/ftm/student/teachingPlan'
  import { getStudentsId } from '/@/api/ftm/student/account'
  import { previewURL } from '/@/api/ftm/student/personCenter'
  import {
    getStudentTrainingFiles,
    putStudentTrainingFiles,
  } from '/@/api/ftm/student/studentTraining'
  import { postUpload } from '/@/api/ftm/student/file'
  import { dataURLtoFile } from '/@/utils/index'
  import { useFtmUserStore } from '/@/store/modules/ftmUser'
  const userStore = useFtmUserStore()
  export default {
    data() {
      return {
        previewURL,
        form: {
          clazzId: undefined,
        },
        tableData: [],
        tableColumns: [
          // { type: "checkbox", width: 60 },
          { type: 'seq', title: this.$t('common.serialNumber'), width: 60 },
          { field: 'syllabusName', title: this.$t('table.sourse'), minWidth: 100 },
          {
            field: 'createdDate',
            title: this.$t('table.courseDate'),
            width: 200,
            slots: { default: 'createdDate' },
          },
          {
            field: 'signTeachers',
            title: this.$t('table.teacherSign'),
            minWidth: 150,
            slots: { default: 'signTeachers' },
          },
          {
            field: 'signStudents',
            title: this.$t('table.studentSign'),
            minWidth: 150,
            slots: { default: 'signStudents' },
          },
          {
            field: 'remark',
            title: this.$t('table.remarks'),
            minWidth: 120,
            slots: { default: 'remarks' },
          },
        ],
        loading: false,
        pagination: {
          page: 1,
          size: 100,
          total: 1,
        },
        detailes: {
          course: {},
          syllabus: {},
        },
        // 授课日期
        dateRange: null,
        // 签名
        id: '',
        signDialogVisible: false,
        loadingDialog: false,
        dialogForm: {
          pinCode: '',
          remark: '',
          date: null,
        },
        pinRules: {
          pinCode: [
            {
              required: true,
              message: this.$t('holder.pleaseEnterSignPinCode'),
              trigger: 'click',
            },
          ],
          date: [
            {
              required: true,
              message: this.$t('holder.pleaseSelect'),
              trigger: 'click',
            },
          ],
          remark: [
            {
              required: true,
              message: this.$t('holder.pleaseEnter'),
              trigger: 'click',
            },
          ],
        },
        Details: {
          clazz: {
            course: {},
            syllabus: {},
          },
        },
        classList: [],
      }
    },
    components: { VxeTable, PrintView },
    computed: {
      userInfo() {
        return userStore.$state
      },
      printClazz() {
        let clazz = (this.classList.find((v) => v.clazz.id == this.form.classId) || {}).clazz || {}
        return {
          courseNumber: clazz.courseNumber,
          name:
            (this.Details.clazz && this.Details.clazz.course && this.Details.clazz.course.name) ||
            '',
          airplaneType: (this.Details.clazz && this.Details.clazz.airplaneType) || '',
        }
      },
    },
    // TODO 原缓存页面执行activated
    mounted() {
      this.getDetails()
    },
    methods: {
      async getStudents() {
        const param = {
          page: 1,
          size: 100,
          studentId: this.userInfo.id,
        }
        let [err, res] = await to(getStudents(param))
        if (!err && res.status == 200) {
          let data = res.data
          this.classList = data.content
          this.Details.clazz = data.content[0].clazz
          this.form.classId = data.content[0].clazz.id || ''
          this.getData()
        }
      },
      classChange(val) {
        this.Details = this.classList.filter((item) => item.clazz.id == val)[0]
        this.getData()
      },
      formatDate(cellValue) {
        return XEUtils.toDateString(cellValue, 'yyyy/MM/dd')
      },
      async getDetails() {
        let [err, res] = await to(getStudentsId({ id: this.userInfo.id }))
        if (!err) {
          this.Details = res.data
          this.loading = true
          // this.form.classId = this.Details.clazz.id
          this.getStudents()
        }
      },
      async getData() {
        let params = {
          page: this.pagination.page,
          size: this.pagination.size,
          clazzId: this.form.classId || this.Details.clazz.id,
          studentId: this.userInfo.id,
          order: 'asc',
        }
        this.loading = true
        let [err, res] = await to(getStudentExamRecords(params))
        this.loading = false
        if (!err && res.status == 200) {
          console.log(res.data)
          let data = res.data
          this.tableData = data || []
        }
      },
      handleCurrentChange({ page, size }) {
        this.pagination.page = page
        this.pagination.size = size
        this.getData()
      },
      handleSign(row) {
        this.id = row.id
        this.signDialogVisible = true
      },
      // 取消按钮（签名码）
      handleDialogCancel() {
        this.$refs.pinForm.resetFields()
        this.signDialogVisible = false
      },
      // 确定按钮（签名码）
      async handDialogConfirm() {
        this.$refs.pinForm.validate((bool) => {
          if (bool) {
            this.loadingDialog = true
            postClazzTeachingSchedules({
              id: this.id,
              pinCode: this.dialogForm.pinCode,
            })
              .then(async () => {
                this.loadingDialog = false
                this.handleDialogCancel()
                this.$message({
                  type: 'info',
                  message: this.$t('tip.pleaseWaitOfGeneratingPDF'),
                  duration: 60000,
                  iconClass: 'el-icon-loading',
                })
                let id = this.userInfo.id
                await this.getData()
                this.$nextTick(() => {
                  setTimeout(() => {
                    this.$getPdf(
                      document.querySelector('#PrintTable'),
                      'generated',
                      'datauristring',
                      (url) => {
                        let form = new FormData()
                        form.append('file', dataURLtoFile(url, 'generated.pdf'))

                        postUpload(form)
                          .then((res) => {
                            this.setPDF(res.data.uuid, id)
                          })
                          .catch((e) => {
                            this.$message.closeAll()
                            this.$message.error(this.$t('status.uploadFail'))
                          })
                      },
                      {
                        padding: 20,
                      },
                    )
                  }, 500)
                })
              })
              .catch(() => {
                this.loadingDialog = false
              })
          }
        })
      },
      // 关联pdf
      async setPDF(uuid, id) {
        let params = {
          generateFiles: [
            {
              fileUuid: uuid,
              sourceId: id,
            },
          ],
        }
        let [err1, res1] = await to(
          getStudentTrainingFiles({
            page: 1,
            size: 100,
            studentId: this.userInfo.id,
            clazzId: this.Details.clazz.id,
          }),
        )
        if (!err1) {
          let list = res1.data.content
          let item = list.find((v) => v.type == 'THEORY_PROGRESS_SHEET') || {}
          let [err] = await to(putStudentTrainingFiles({ id: item.id, ...params }))
          if (!err) {
            this.$message.closeAll()
            this.$message.success(this.$t('tip.saveSuccessTip'))
          }
        }
      },
      // 授课日期
      handDateDialogConfirm() {
        this.$refs.pinForm.validate((bool) => {
          if (bool) {
            this.loadingDialog = true
            putClazzTeachingSchedules({
              id: this.id,
              startTime: this.dialogForm.date ? this.dialogForm.date[0] : '',
              endTime: this.dialogForm.date ? this.dialogForm.date[1] : '',
              remark: this.dialogForm.remark,
            }).then((res) => {
              this.loadingDialog = false
              this.handleDialogCancel()
              this.getData()
            })
          }
        })
      },
    },
  }
</script>
<style lang="scss" scoped>
  .sign-img {
    width: 100px;
    height: 80px;
    object-fit: contain;
  }
  .sign-link {
    color: #215ebe;
    cursor: pointer;
  }
  .detail-content-c {
    padding: 10px 0 20px 0;
    line-height: 36px;
    font-weight: 600;
    color: #606266;
    display: flex;
    justify-content: space-between;
    span {
      display: inline-block;
      min-width: 4em;
    }
  }
  .inline-img {
    text-align: center;
    display: inline-block;
    border: 1px solid #e8eaec;
    border-radius: 4px;
    margin: 15px 15px 15px 0;
    overflow: hidden;
    line-height: 0;
    background: #fff;
    div {
      color: #999;
      padding: 10px;
    }
  }
  .remark {
    text-align: left;
  }
  .print-box-hide {
    position: absolute;
    width: 0;
    height: 0;
    overflow: hidden;
    .print-box {
      width: 1300px;
      background: #fff;
      :deep(.vxe-table--header),
      :deep(.vxe-table--body) {
        width: unset !important;
      }
      :deep(.body--wrapper) {
        height: unset !important;
      }
      :deep(.sign-link) {
        display: none;
      }
    }
  }
  .sign-btn-right-top {
    width: 66px;
    height: 26px;
    opacity: 1;
    background: #215ebe;
    font-weight: 400;
    text-align: center;
    color: #ffffff;
    position: absolute;
    right: 0;
    top: 0;
    border-top-left-radius: 8px;
    border-bottom-right-radius: 8px;
    cursor: pointer;
  }
</style>
