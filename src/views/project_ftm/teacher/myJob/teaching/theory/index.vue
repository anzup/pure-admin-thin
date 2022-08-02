<template>
  <div>
    <VxeTable
      :loading="loading"
      :data="tableData"
      :columns="tableColumns"
      :toolbarConfig="tableTools"
      v-model:form="pagination"
      @handle-page-change="handleCurrentChange"
    >
      <template #form>
        <el-form inline size="medium">
          <!-- 课程名称 -->
          <el-form-item :label="$t('table.courseName')">
            <el-select v-model="form.courseid" @change="getClazzsEvent">
              <el-option
                v-for="item in form.courseArr"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <!-- 班级课号 -->
          <el-form-item :label="$t('table.classNumber')">
            <el-select
              v-model="form.groupId"
              :placeholder="$t('holder.pleaseSelect')"
              @change="handleClazz"
            >
              <el-option
                v-for="(item, index) in form.groupIdArr"
                :key="index"
                :label="item.courseNumber"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-form>
        <div class="detail-content-c">
          <div>{{ $t('table.sourse') }}：{{ detailes.course && detailes.course.name }}</div>
          <div>
            {{ $t('table.modelNumber') }}：{{
              (detailes.course &&
                detailes.course.airplaneTypes &&
                detailes.course.airplaneTypes instanceof Array &&
                detailes.course.airplaneTypes[0]) ||
              ''
            }}
          </div>
        </div>
      </template>
      <template #createdDate="{ row }">
        <span v-if="row.startTime && row.endTime"
          >{{ formatDate(row.startTime) }}-{{ formatDate(row.endTime) }}</span
        >
      </template>
      <template #signTeachers="{ row }">
        <div>
          <div
            class="inline-img"
            v-for="(item, index) in computeArray(row.signTeachers).slice(0, 2)"
            :key="index"
          >
            <img class="sign-img" :src="previewURL(item.signature)" alt="" />
          </div>
          <!-- <a
            href="javascript:void(0);"
            class="sign-link ml"
            @click="handleSign(row)"
            v-if="
              !row.signTeachers
                .map(item => item.userId)
                .includes(userInfo.userId)
            "
            >{{ $t("table.clickSign") }}</a
          > -->
          <div
            v-if="computeArray(row.signTeachers).length > 2"
            class="sign-btn-right-top"
            @click="showSignList(row.signTeachers)"
          >
            {{ $t('table.seeMore') }}
          </div>
          <div class="sign-btn-right-top" @click="handleSign(row)">{{ $t('table.clickSign') }}</div>
        </div>
      </template>
      <template #signStudents="{ row }">
        <div>
          <div
            class="inline-img"
            v-for="(item, index) in computeArray(row.signStudents).slice(0, 2)"
            :key="index"
          >
            <img class="sign-img" :src="previewURL(item.signature)" alt="" />
          </div>
          <!-- <span v-if="row.signStudents.length > 2" class="sign-link ml" @click="showSignList(row.signStudents)">{{ $t('table.more') }}</span> -->
          <div
            class="sign-btn-right-top"
            v-if="computeArray(row.signStudents).length > 2"
            @click="showSignList(row.signStudents)"
          >
            {{ $t('table.seeMore') }}
          </div>
        </div>
      </template>
      <template #pager />
    </VxeTable>
    <!-- 签名列表 -->
    <el-dialog
      center
      width="600px"
      :title="$t('table.sign')"
      v-model="showSignDialog"
      @closed="signList = []"
    >
      <span v-for="(item, index) in computeArray(signList)" :key="index" class="sign-item">
        <img class="sign-img" :src="previewURL(item.signature)" alt="" />
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import VxeTable from '/@/components/Table/index.vue'
  import { getNotice, delNotice } from '/@/api/ftm/teacher/education'
  import { getCoursesAll } from '/@/api/ftm/teacher/trainingPlan'
  import { previewURL } from '/@/api/ftm/teacher/personCenter'
  import {
    getClazzs,
    getClazzTeachingSchedules,
    postClazzTeachingSchedules,
    putClazzTeachingSchedules,
  } from '/@/api/ftm/teacher/teachingPlan'
  import XEUtils from 'xe-utils'
  import moment from 'moment'
  import to from 'await-to-js'
  import { useFtmUserStore } from '/@/store/modules/ftmUser'
  import { useRouter } from 'vue-router'
  import { useGo } from '../../../../../../hooks/usePage'
  const userStore = useFtmUserStore()

  export default {
    data() {
      return {
        previewURL,
        form: {
          courseid: undefined,
          groupId: undefined,
          groupIdArr: [],
          courseArr: [],
        },
        tableData: [],
        tableTools: {
          enabled: false,
          slots: {
            buttons: 'left_tools',
          },
        },
        tableColumns: [
          // { type: "checkbox", width: 60 },
          { type: 'seq', title: this.$t('common.serialNumber'), width: 60 },
          { field: 'name', title: this.$t('table.sourse'), minWidth: 80 },
          {
            field: 'createdDate',
            title: this.$t('table.courseDate'),
            minWidth: 100,
            slots: { default: 'createdDate' },
          },
          {
            field: 'signTeachers',
            title: this.$t('table.teacherSigning'),
            minWidth: 150,
            slots: { default: 'signTeachers' },
          },
          {
            field: 'signStudents',
            title: this.$t('table.studentSign'),
            minWidth: 130,
            slots: { default: 'signStudents' },
          },
          // { field: "remark", title: this.$t("table.comment"), minWidth: 100 }
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
        dateDialogVisible: false,
        // 签名
        id: '',
        signDialogVisible: false,
        loadingDialog: false,
        dialogForm: {
          startDate: '',
          endDate: '',
        },
        pinRules: {
          date: [{ required: true, validator: this.dateValidate, trigger: 'click' }],
          // remark: [{ required: true, message: this.$t("holder.pleaseEnter"), trigger: "click" }]
        },
        signList: [],
        showSignDialog: false,
      }
    },
    components: { VxeTable },
    computed: {
      userInfo() {
        return userStore.$state
      },
    },
    created() {
      this.getClazzsAll()
    },
    // TODO 原缓存页面执行activated
    mounted() {
      if (this.form.courseid && this.form.groupId) {
        this.getData()
      }
    },
    setup() {
      const router = useRouter()
      const routerGo = useGo(router)
      return { routerGo }
    },
    methods: {
      formatDate(cellValue) {
        return XEUtils.toDateString(cellValue, 'yyyy/MM/dd')
      },
      async getClazzsEvent() {
        await getClazzs({
          page: 1,
          size: 1000,
          statusIN: 'TRAINING',
          type: 'WET_LEASE',
          teacherId: this.userInfo.id,
          teacherUserId: this.userInfo.userId,
          courseId: this.form.courseid,
        }).then((res) => {
          this.form.groupIdArr = res.data.content
          if (res.data.content instanceof Array && res.data.content.length > 0) {
            this.form.groupId = this.form.groupIdArr[0].id
            this.handleClazz()
          } else {
            this.form.groupId = undefined
            this.tableData = []
            this.detailes = {}
          }
          if (this.$route.query.id && this.form.groupIdArr && this.form.groupIdArr.length) {
            this.form.groupId = this.$route.query.id
          }
        })
      },
      async getClazzsAll() {
        let [err, res] = await to(getCoursesAll())
        if (!err && res.status == 200) {
          this.form.courseArr = res.data
          if (res.data instanceof Array && res.data.length > 0) {
            this.form.courseid = res.data[0]?.id
            this.getClazzsEvent()
          }
        }
      },
      handleClazz() {
        this.detailes = this.form.groupIdArr.find((item) => item.id == this.form.groupId) || {}
        this.loading = true
        this.getData()
      },
      async getData() {
        let params = {
          page: this.pagination.page,
          size: this.pagination.size,
          courseid: this.form.courseid,
          clazzId: this.form.groupId,
          order: 'asc',
        }
        this.loading = true
        let [err, res] = await to(getClazzTeachingSchedules(params))
        this.loading = false
        if (!err) {
          let data = res.data
          this.tableData = data.content
          this.pagination.total = data.totalElements
        }
      },
      handleCurrentChange({ page, size }) {
        this.pagination.page = page
        this.pagination.size = size
        this.getData()
      },
      handleSign(row) {
        // this.signDialogVisible = true;
        // this.id = row.id;
        this.routerGo(`theory/list/${row.id}`)
      },
      // 取消按钮（签名码）
      handleDialogCancel() {
        this.$refs.pinForm.resetFields()
        this.dialogForm.startDate = ''
        this.dialogForm.endDate = ''
        this.signDialogVisible = false
        this.dateDialogVisible = false
      },
      // 重新刷新
      refreshSign() {
        this.$refs.pinForm.resetFields()
      },
      // 授课日期
      handDateDialogConfirm() {
        this.$refs.pinForm.validate((bool) => {
          if (bool) {
            this.loadingDialog = true
            putClazzTeachingSchedules({
              id: this.id,
              startTime: this.dialogForm.startDate,
              endTime: this.dialogForm.endDate,
            })
              .then((res) => {
                this.loadingDialog = false
                this.handleDialogCancel()
                this.getData()
              })
              .catch((err) => {
                this.loadingDialog = false
                try {
                  this.$message.error(
                    err.response.data.msg || err.response.data.message || err.response.data.error,
                  )
                } catch (e) {
                  console.log('不存在的错误')
                }
              })
          }
        })
      },
      // 查看签名列表
      showSignList(list) {
        this.signList = list
        this.showSignDialog = true
      },
      // 校验开始和结束时间
      dateValidate(rule, value, cb) {
        if (!this.dialogForm.startDate && !this.dialogForm.endDate) {
          cb(new Error(this.$t('tip.pleaseEnterDate')))
        } else if (!this.dialogForm.startDate) {
          cb(new Error(this.$t('tip.pleaseEnterStartDate')))
        } else if (!this.dialogForm.endDate) {
          cb(new Error(this.$t('tip.pleaseEnterEndDate')))
        } else {
          cb()
        }
      },
      computeArray(arr) {
        return arr instanceof Array ? arr.filter((item) => !!item && !!item.signature) : []
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
  .sign-item {
    display: inline-block;
    margin: 0 10px 10px 0;
    // overflow: hidden;
    border: 1px solid #e8eaec;
    border-radius: 4px;
  }
  .sign-link {
    color: #215ebe;
    cursor: pointer;
    white-space: nowrap;
  }
  .detail-content-c {
    padding: 20px 0;
    font-weight: 600;
    color: #606266;
    display: flex;
    justify-content: space-between;
  }
  .ml {
    margin-left: 10px;
  }
  .inline-img {
    text-align: center;
    display: inline-block;
    border: 1px solid #e8eaec;
    border-radius: 4px;
    margin: 15px 15px 15px 0;
    line-height: 0;
    overflow: hidden;
    background: #fff;
    div {
      color: #999;
      padding: 10px;
    }
  }
  .sign-btn-right-top {
    width: 66px;
    height: 24px;
    background: #215ebe;
    text-align: center;
    color: #ffffff;
    position: absolute;
    right: 0;
    top: 0;
    border-top-left-radius: 8px;
    border-bottom-right-radius: 8px;
    cursor: pointer;
    & + .sign-btn-right-top {
      right: 67px;
    }
  }
  .custome-picker {
    display: flex;
    align-items: center;
    > span {
      margin: 0 10px;
    }
    .inline-picker {
      flex: 1;
    }
  }
</style>
