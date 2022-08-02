<template>
  <VxeTable
    ref="xTable"
    :data="tableData"
    :columns="tableColmns"
    :buttons="tableButtons"
    v-model:form="tablePage"
    @checkbox="selectAllEvent"
    @handlePageChange="paginationEvent"
  />

  <!-- 新增模拟机训练 -->
  <el-dialog
    width="400px"
    :modal="false"
    :close-on-click-modal="false"
    v-model="syllabusItemsDialog"
    :title="dialogType == '1' ? $t('button.add') : $t('button.modify')"
    @close="cancelDialog"
    @closed="refreshDialog"
    center
    @open="open"
  >
    <el-form ref="addForm" label-width="110px" :model="dialogForm" :rules="dialogRules">
      <!-- 训练内容 -->
      <el-form-item :label="$t('table.trainingContent')" required prop="name">
        <el-input :placeholder="$t('holder.pleaseEnter')" v-model="dialogForm.name" />
      </el-form-item>
      <!-- 内容简称 -->
      <el-form-item :label="$t('table.contentAbbreviation')" prop="shortName">
        <el-input :placeholder="$t('holder.pleaseEnter')" v-model="dialogForm.shortName" />
      </el-form-item>
      <!-- 课程类型 -->
      <el-form-item :label="$t('table.courseType')" prop="courseType">
        <el-select v-model="dialogForm.courseType" style="width: 100%">
          <el-option v-for="item in typeArr" :key="item.name" :value="item.id" :label="item.name" />
        </el-select>
      </el-form-item>
      <!-- 授课时间 -->
      <el-form-item :label="$t('table.teachingHours')" required prop="period">
        <el-input
          :placeholder="$t('holder.pleaseEnter')"
          type="number"
          v-model="dialogForm.period"
        />
      </el-form-item>
      <!-- 授课设施 -->
      <el-form-item :label="$t('table.teachingFacilities')" prop="facilitiesId">
        <el-select :placeholder="$t('holder.pleaseSelect')" v-model="dialogForm.facilitiesId">
          <el-option
            v-for="item in facilitiesList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <!-- 授课教员 -->
      <el-form-item :label="$t('table.instructor')" prop="teacherId">
        <el-select :placeholder="$t('holder.pleaseSelect')" v-model="dialogForm.teacherId">
          <el-option
            v-for="item in teacherList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <!-- 是否推荐考试 -->
      <el-form-item
        :label="$t('table.isRecommendExam')"
        required
        v-if="dialogForm.courseType == 'COURSE_TYPE'"
      >
        <el-select v-model="dialogForm.exam" style="width: 100%">
          <el-option
            v-for="(item, index) in examArr"
            :key="index"
            :value="item.value"
            :label="item.label"
          />
        </el-select>
      </el-form-item>
      <!-- 参与总评计算 -->
      <el-form-item :label="$t('table.inGeneralEvaluationCalc')" prop="averageScore">
        <el-radio-group v-model="dialogForm.averageScore">
          <el-radio :label="true">{{ $t('common.yes') }}</el-radio>
          <el-radio :label="false">{{ $t('common.no') }}</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="cancelDialog" type="primary" plain size="medium">{{
        $t('button.cancel')
      }}</el-button>
      <el-button
        type="primary"
        size="medium"
        @click="dialogType == '1' ? addSyllabusItem() : editSyllabusItem()"
        >{{ $t('button.save') }}</el-button
      >
    </template>
  </el-dialog>
</template>

<script>
  import VxeTable from '/@/components/Table/index.vue'
  import selectedView from '/@/views/project_ftm/teacher/components/SelectedView/index.vue'
  import XEUtils from 'xe-utils'
  import to from 'await-to-js'
  import {
    getSyllabusItems,
    deleteSyllabusItemsId,
    postSyllabusItems,
    putSyllabusItemsId,
    getResources,
    getSyllabusItemsId,
  } from '/@/api/ftm/teacher/teachingPlan'
  export default {
    props: ['id'],
    data() {
      return {
        form: {
          sort: undefined,
          order: 'asc',
          syllabusId: undefined,
          type: 'FLIGHT_PRACTICE',
        },
        allAlign: null,
        records: [],
        tableData: [],
        tableColmns: [
          { type: 'checkbox', width: 40 },
          {
            type: 'seq',
            width: 60,
            title: this.$t('common.serialNumber'),
          },
          { field: 'name', title: this.$t('table.trainingContent'), width: 140 },
          { field: 'shortName', title: this.$t('table.contentAbbreviation'), width: 140 },
          {
            field: 'courseType',
            title: this.$t('table.courseType'),
            width: 140,
            formatter: this.formatType,
          },
          { field: 'period', title: this.$t('table.classHours'), width: 80 },
          {
            field: 'exam',
            title: this.$t('table.recommendedTestOrNot'),
            formatter: this.formatBoolean,
            width: 120,
          },
          { field: 'facilities.name', title: this.$t('table.teachingFacilities'), minWidth: 90 },
          { field: 'teacher.name', title: this.$t('table.instructor'), minWidth: 120 },
          {
            field: 'lastModifiedDate',
            title: this.$t('table.updateTime'),
            formatter: this.formatDate,
            width: 200,
          },
          {
            title: this.$t('table.tableEdit'),
            slots: { default: 'operate' },
            width: 160,
          },
        ],
        tablePage: {
          page: 1,
          size: 10,
          total: 0,
        },
        syllabusItemsDialog: false,
        syllabusItemsId: undefined,
        dialogForm: {
          averageScore: true,
          name: '',
          shortName: undefined,
          courseType: undefined,
          period: undefined,
          exam: false,
          facilitiesId: undefined,
          teacherId: undefined,
        },
        dialogRules: {
          name: [{ required: true, message: this.$t('holder.pleaseFillForm') }],
          shortName: [{ required: true, message: this.$t('holder.pleaseFillForm') }],
          period: [{ required: true, message: this.$t('holder.pleaseFillForm') }],
          courseType: [{ required: true, message: this.$t('holder.pleaseFillForm') }],
          facilitiesId: [{ required: true, message: this.$t('holder.pleaseFillForm') }],
          teacherId: [{ required: true, message: this.$t('holder.pleaseFillForm') }],
        },
        typeArr: [
          {
            id: 'COURSE_TYPE',
            name: this.$t('table.sourse'),
          },
          {
            id: 'EXAM_TYPE',
            name: this.$t('status.examination'),
          },
        ],
        examArr: [
          { label: this.$t('common.no'), value: false },
          { label: this.$t('common.yes'), value: true },
        ],
        dialogType: '', // 弹窗类型 #1 新增 #2 修改，
        teacherList: [],
        facilitiesList: [],
      }
    },
    components: {
      VxeTable,
      selectedView,
    },
    computed: {
      xTable() {
        return this.$refs.xTable?.$refs?.xTable
      },
    },
    created() {
      this.form.syllabusId = this.id
      this.getSyllabusItems()
    },
    methods: {
      open() {
        this.getResources()
      },
      getResources() {
        getResources({
          page: 1,
          size: 1000,
        }).then((res) => {
          const { data } = res
          // console.log(res.data);
          this.teacherList = data.content.filter(
            (v) => v.resourceType == 'TEACHER' && v.builtinResource != 'INSPECTOR',
          )
          this.facilitiesList = data.content.filter((v) => v.resourceType == 'FACILITIES')
        })
      },
      selectAllEvent({ checked, records }) {
        this.records = records.map((v) => v.id)
        this.$emit('selected', this.records)
      },
      getClearAll() {
        this.records = []
        this.xTable.clearSelectEvent()
        this.$emit('selected', this.records)
      },
      modify(row) {
        this.dialogType = '2'
        this.syllabusItemsDialog = true
        this.syllabusItemsId = row.id
        // this.dialogForm = {
        //     name: row.name,
        //     shortName: row.shortName,
        //     type: "COURSE_TYPE",
        //     period: row.period,
        //     exam: false,
        // };
        getSyllabusItemsId({ id: row.id }).then((res) => {
          res.data.facilitiesId = res.data.facilities ? res.data.facilities.id : undefined
          res.data.teacherId = res.data.teacher ? res.data.teacher.id : undefined
          res.data.superiorId = res.data.superior ? res.data.superior.id : undefined
          this.dialogForm = res.data
        })
      },
      // 删除数据
      deleteSyllabusItemsId(id) {
        this.$confirm(this.$t('common.deleteData'), this.$t('tip.tip'), {
          confirmButtonText: this.$t('button.confirm'),
          cancelButtonText: this.$t('button.cancel'),
          type: 'warning',
        }).then(() => {
          deleteSyllabusItemsId({ id: id }).then((res) => {
            if (res.status == 200) {
              if (
                parseInt(this.tablePage.total / this.tablePage.size) < this.tablePage.page &&
                this.tablePage.page !== 1
              ) {
                this.tablePage.page = parseInt(this.tablePage.total / this.tablePage.size)
              }
              this.$message.success(this.$t('tip.delsuccessTip'))
              this.getSyllabusItems()
            }
          })
        })
      },
      // 更新数据
      getSyllabusItems() {
        let params = { ...this.form, ...this.tablePage }
        delete params['total']
        getSyllabusItems(params).then((res) => {
          if (res.status == 200) {
            this.tableData = res.data.content
            this.tablePage.total = res.data.totalElements
            res.data.content.length !== 0 && this.$emit('getCourse', res.data.content[0].syllabus)
            this.getClearAll()
          }
        })
      },
      showDialog() {
        this.dialogType = '1'
        this.syllabusItemsDialog = true
      },
      cancelDialog() {
        this.syllabusItemsDialog = false
        this.syllabusItemsId = undefined
      },
      refreshDialog() {
        this.$refs.addForm.resetFields()
      },
      // 添加数据
      async addSyllabusItem() {
        //   console.log(this.dialogForm.facilitiesId);
        let params = {
          syllabusId: this.form.syllabusId,
          name: this.dialogForm.name,
          shortName: this.dialogForm.shortName,
          period: this.dialogForm.period,
          courseType: this.dialogForm.courseType,
          exam: this.dialogForm.exam,
          type: 'FLIGHT_PRACTICE',
          facilitiesId: this.dialogForm.facilitiesId,
          teacherId: this.dialogForm.teacherId,
          averageScore: this.dialogForm.averageScore,
        }
        params.courseType != 'COURSE_TYPE' && (params.exam = false)
        this.$refs.addForm.validate(async (bool) => {
          if (bool) {
            let [err] = await to(postSyllabusItems(params))
            if (!err) {
              this.$message.success(this.$t('tip.addsuccessTip'))
              this.cancelDialog()
              this.getSyllabusItems()
            }
          }
        })
      },
      // 修改数据
      async editSyllabusItem() {
        let params = {
          id: this.syllabusItemsId,
          syllabusId: this.form.syllabusId,
          name: this.dialogForm.name,
          shortName: this.dialogForm.shortName,
          period: this.dialogForm.period,
          courseType: this.dialogForm.courseType,
          exam: this.dialogForm.exam,
          type: 'FLIGHT_PRACTICE',
          facilitiesId: this.dialogForm.facilitiesId,
          teacherId: this.dialogForm.teacherId,
          averageScore: this.dialogForm.averageScore,
        }
        params.courseType != 'COURSE_TYPE' && (params.exam = false)
        this.$refs.addForm.validate(async (bool) => {
          if (!bool) return
          let [err] = await to(putSyllabusItemsId(params))
          if (!err) {
            this.cancelDialog()
            this.$message.success(this.$t('tip.editSuccessTip'))
            this.getSyllabusItems()
          }
        })
      },
      // 分页
      paginationEvent({ page, size }) {
        this.tablePage.page = page
        this.tablePage.size = size
        this.getSyllabusItems()
      },
      formatBoolean({ cellValue }) {
        return cellValue ? this.$t('common.yes') : this.$t('common.no')
      },
      formatDate({ cellValue }) {
        return XEUtils.toDateString(cellValue, 'yyyy-MM-dd HH:mm:ss')
      },
      formatType({ cellValue }) {
        switch (cellValue) {
          case 'COURSE_TYPE':
            return this.$t('table.flightTraining')
          case 'EXAM_TYPE':
            return this.$t('table.flightTest')
          default:
            return ''
        }
      },
      tableButtons({ row }) {
        return [
          {
            name: this.$t('button.modify'),
            event: () => {
              this.modify(row)
            },
          },
          {
            name: this.$t('button.delete'),
            status: 'danger',
            event: () => {
              this.deleteSyllabusItemsId(row.id)
            },
          },
        ]
      },
    },
  }
</script>
<style lang="scss" scoped>
  .el-select {
    width: 100%;
  }
</style>
