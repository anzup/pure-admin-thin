<!--<template>-->
<!--  <VxeTable-->
<!--    v-bind="gridOptions"-->
<!--    @action="btnClick"-->
<!--    @checkbox="checkboxAll"-->
<!--    @handle-page-change="handleCurrentChange"-->
<!--  >-->
<!--    <template #form>-->
<!--      <el-form inline size="medium">-->
<!--        <el-form-item :label="t('table.airlines')">-->
<!--          &lt;!&ndash; 航空公司 &ndash;&gt;-->
<!--          <el-select v-model="form.airlines" :placeholder="t('common.all')" clearable>-->
<!--            <el-option-->
<!--              v-for="(item, index) in form.airlinesArr"-->
<!--              :key="index"-->
<!--              :label="item.name"-->
<!--              :value="item.id"-->
<!--            />-->
<!--          </el-select>-->
<!--        </el-form-item>-->
<!--        <el-form-item :label="t('table.schoolYear')">-->
<!--          &lt;!&ndash; 学年 &ndash;&gt;-->
<!--          <el-date-picker-->
<!--            v-model="form.schoolYear"-->
<!--            type="year"-->
<!--            :placeholder="t('common.all')"-->
<!--            value-format="yyyy"-->
<!--            :editable="false"-->
<!--            :picker-options="pickerOptions"-->
<!--            @change="dateChange"-->
<!--            style="width: 150px"-->
<!--          />-->
<!--        </el-form-item>-->
<!--        <el-form-item :label="t('table.classNumber')">-->
<!--          &lt;!&ndash; 班级课号 &ndash;&gt;-->
<!--          <el-select v-model="form.className" :placeholder="t('common.all')" clearable>-->
<!--            <el-option-->
<!--              v-for="(item, index) in form.classNameArr"-->
<!--              :key="index"-->
<!--              :label="item.courseNumber"-->
<!--              :value="item.id"-->
<!--            />-->
<!--          </el-select>-->
<!--        </el-form-item>-->
<!--        &lt;!&ndash; 结业状态 &ndash;&gt;-->
<!--        &lt;!&ndash; <el-form-item :label="t('table.graduationStatus')">-->
<!--              <el-select v-model="form.graduation" :placeholder="t('common.all')" style="width: 120px" >-->
<!--                  <el-option v-for="(item, index) in form.graduationArr" :key="index" :label="item.label" :value="item.value" />-->
<!--              </el-select>-->
<!--          </el-form-item> &ndash;&gt;-->
<!--        <el-form-item>-->
<!--          &lt;!&ndash; 搜索框 &ndash;&gt;-->
<!--          <el-input-->
<!--            size="medium"-->
<!--            :placeholder="t('holder.pleaseEnterStudentName')"-->
<!--            suffix-icon="el-icon-search"-->
<!--            v-model.trim="form.searchKey"-->
<!--            style="width: 280px; margin-right: 10px"-->
<!--          />-->
<!--          <el-button size="medium" type="primary" @click="search">{{-->
<!--            t('button.query')-->
<!--          }}</el-button>-->
<!--        </el-form-item>-->
<!--      </el-form>-->
<!--    </template>-->
<!--    &lt;!&ndash; <template #right_tools>-->
<!--          <el-button-->
<!--              size="mini"-->
<!--              type="primary"-->
<!--              v-permission="menuName + ':BULK_DOWNLOAD'"-->
<!--              @click="handleExport"-->
<!--          >{{ t("button.bulkDownload") }}</el-button>-->
<!--      </template> &ndash;&gt;-->

<!--    <template #edit="{ row }">-->
<!--      &lt;!&ndash;详情&ndash;&gt;-->
<!--      <span-->
<!--        class="buttonEdit"-->
<!--        v-permission="menuName + ':DETAIL'"-->
<!--        @click="toPage(row, 'teachingCenterTabs')"-->
<!--        >{{ t('button.details') }}</span-->
<!--      >-->
<!--      &lt;!&ndash; <span class="buttonEdit" @click="toPage(row,'TrainingBasicRecords')">{{ t('button.basicInfo') }}</span> &ndash;&gt;-->
<!--      &lt;!&ndash;基本信息&ndash;&gt;-->
<!--    </template>-->
<!--  </VxeTable>-->
<!--</template>-->

<!--<script>-->
<!--  import { getStudents, airlinesMenu } from '@/api/ftm/teacher/studentTraining'-->
<!--  import { getClazzs } from '@/api/ftm/teacher/teachingPlan'-->
<!--  import XEUtils from 'xe-utils'-->
<!--  import { mapGetters } from 'vuex'-->
<!--  import moment from 'moment'-->
<!--  import { useI18n } from 'vue-i18n'-->
<!--  const { t } = useI18n()-->
<!--  export default {-->
<!--    data() {-->
<!--      return {-->
<!--        t,-->
<!--        menuName: 'MY_STUDENTS',-->
<!--        form: {-->
<!--          searchKey: '',-->
<!--          airlines: undefined,-->
<!--          airlinesArr: [],-->
<!--          schoolYear: undefined,-->
<!--          // schoolYears: [-->
<!--          //     { label: "2021", value: "2021" },-->
<!--          //     { label: "2020", value: "2020" },-->
<!--          //     { label: "2019", value: "2019" },-->
<!--          // ],-->
<!--          className: undefined,-->
<!--          classNameArr: [],-->
<!--          graduation: 'NOT_GRADUATED,NOT_STARTED',-->
<!--        },-->
<!--        tableData: [],-->
<!--        tableColumns: [],-->
<!--        tableLoading: false,-->
<!--        tableTools: null,-->
<!--        // {-->
<!--        //     perfect: true,-->
<!--        //     slots: {-->
<!--        //         tools: 'right_tools'-->
<!--        //     }-->
<!--        // }-->
<!--        pagination: {-->
<!--          // 表格分页信息-->
<!--          page: 1,-->
<!--          size: 10,-->
<!--          total: 0,-->
<!--        },-->
<!--        pickerOptions: {-->
<!--          disabledDate: this.disabledDate,-->
<!--        },-->
<!--        gridOptions: {-->
<!--          columns: [-->
<!--            { type: 'checkbox', width: 40 },-->
<!--            { type: 'seq', title: t('common.serialNumber'), width: 60 },-->
<!--            { field: 'student.name', title: t('table.name'), minWidth: 120 },-->
<!--            {-->
<!--              field: 'student.gender',-->
<!--              title: t('table.gender'),-->
<!--              minWidth: 90,-->
<!--              formatter: this.genderFormatter,-->
<!--            },-->
<!--            { field: 'student.phone', title: t('table.cellPhoneNumber'), minWidth: 120 },-->
<!--            { field: 'student.idNumber', title: t('table.idNumber'), minWidth: 150 },-->
<!--            { field: 'student.customer.name', title: t('table.airlines'), minWidth: 100 },-->
<!--            { field: 'clazz.year', title: t('table.schoolYear'), minWidth: 70 },-->
<!--            { field: 'clazz.courseNumber', title: t('table.classNumber'), minWidth: 120 },-->
<!--            { field: 'clazz.course.code', title: t('table.courseCode'), minWidth: 120 },-->
<!--            {-->
<!--              field: 'clazz.startTime',-->
<!--              title: t('table.trainingDate'),-->
<!--              minWidth: 180,-->
<!--              formatter: this.dateTimeFormatter,-->
<!--            },-->
<!--            {-->
<!--              field: 'status',-->
<!--              title: t('table.graduationStatus'),-->
<!--              minWidth: 150,-->
<!--              formatter: this.statusFormatter,-->
<!--            },-->
<!--            { title: t('table.tableEdit'), width: 140, slots: { default: 'edit' } },-->
<!--          ],-->
<!--          data: [],-->
<!--          toolbarConfig: {-->
<!--            // custom: true,-->
<!--            slots: {-->
<!--              buttons: 'toolbar_buttons',-->
<!--              tools: 'toolbar_tools',-->
<!--            },-->
<!--          },-->
<!--          loading: false,-->
<!--        },-->
<!--      }-->
<!--    },-->
<!--    computed: {-->
<!--      ...mapGetters(['userInfo']),-->
<!--    },-->
<!--    activated() {-->
<!--      airlinesMenu().then((res) => {-->
<!--        this.form.airlinesArr = res.data-->
<!--      })-->
<!--      // clazzsAll().then((res) => {-->
<!--      //     this.form.classNameArr = res.data;-->
<!--      // });-->
<!--      this.form.schoolYear = moment().format('YYYY')-->
<!--      this.getClazzs()-->
<!--      this.$refs.xTable.resetHeight()-->
<!--      if (this.$route.query.year) {-->
<!--        this.form.className = this.$route.query.courseNumber-->
<!--        this.form.schoolYear = this.$route.query.year-->
<!--      }-->
<!--      this.getData()-->
<!--    },-->
<!--    methods: {-->
<!--      dateChange() {-->
<!--        this.form.className = undefined-->
<!--        this.getClazzs()-->
<!--      },-->
<!--      getClazzs() {-->
<!--        getClazzs({-->
<!--          page: 1,-->
<!--          size: 1000,-->
<!--          year: this.form.schoolYear,-->
<!--          statusIN: 'TRAINING',-->
<!--          type: 'WET_LEASE',-->
<!--          teacherUserId: this.$store.getters.userId,-->
<!--        }).then((res) => {-->
<!--          this.form.classNameArr = res.data.content-->
<!--        })-->
<!--      },-->
<!--      disabledDate(val) {-->
<!--        return moment(val).valueOf() > moment().add(1, 'year').valueOf()-->
<!--      },-->
<!--      // 获取学员列表-->
<!--      getData() {-->
<!--        const param = {-->
<!--          page: this.pagination.page,-->
<!--          size: this.pagination.size,-->
<!--          clazzId: this.form.className,-->
<!--          searchKey: this.form.searchKey ? this.form.searchKey : undefined,-->
<!--          customerId: this.form.airlines,-->
<!--          statusIN: this.form.graduation,-->
<!--          year: this.form.schoolYear,-->
<!--          teacherUserId: this.userInfo.userId,-->
<!--          // flightTeacherUserId: this.userInfo.userId-->
<!--        }-->
<!--        this.tableLoading = true-->
<!--        getStudents(param)-->
<!--          .then((res) => {-->
<!--            let data = res.data-->
<!--            this.tableData = data.content-->
<!--            this.pagination.total = data.totalElements-->
<!--            this.tableLoading = false-->
<!--          })-->
<!--          .catch((e) => {-->
<!--            this.tableLoading = false-->
<!--          })-->
<!--      },-->
<!--      // 格式化日期-->
<!--      dateTimeFormatter({ cellValue }) {-->
<!--        return XEUtils.toDateString(cellValue, 'yyyy-MM-dd HH:mm:ss')-->
<!--      },-->
<!--      // 格式化性别-->
<!--      genderFormatter({ cellValue }) {-->
<!--        return cellValue == 'M' ? t('common.male') : t('common.female')-->
<!--      },-->
<!--      // 格式化结业状态-->
<!--      statusFormatter({ cellValue }) {-->
<!--        switch (cellValue) {-->
<!--          case 'GRADUATED':-->
<!--            return t('status.finishedStatus')-->
<!--          case 'NOT_GRADUATED':-->
<!--            return t('status.unfinishedStatus')-->
<!--          default:-->
<!--            return ''-->
<!--        }-->
<!--      },-->
<!--      handleCurrentChange({ page, size }) {-->
<!--        this.pagination.page = page-->
<!--        this.pagination.size = size-->
<!--        this.getData()-->
<!--      },-->
<!--      checkboxOne() {},-->
<!--      checkboxAll({ records }) {},-->
<!--      toPage(row, name) {-->
<!--        this.$router.push({-->
<!--          name,-->
<!--          params: {-->
<!--            recordId: row.id,-->
<!--          },-->
<!--        })-->
<!--      },-->
<!--      search() {-->
<!--        this.$set(this.pagination, 'page', 1)-->
<!--        this.getData()-->
<!--      },-->
<!--      // 导出-->
<!--      handleExport() {},-->
<!--    },-->
<!--  }-->
<!--</script>-->
