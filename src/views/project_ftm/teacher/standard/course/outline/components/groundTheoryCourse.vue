<template>
  <VxeTable
    ref="xTable"
    :data="tableData"
    :columns="tableColmns"
    :tablePage="tablePage"
    @checkbox="selectAllEvent"
    @handlePageChange="paginationEvent"
  >
    <template #edit="{ row }">
      <div class="button-line">
        <span class="buttonEdit" @click="modify(row)">{{ $t('button.modify') }}</span>
        <span class="buttonDelete" @click="deleteSyllabusItemsId(row.id)">{{
          $t('button.delete')
        }}</span>
      </div>
    </template>
  </VxeTable>

  <!-- 新增地面理论 -->
  <el-dialog
    width="400px"
    center
    :modal="false"
    :close-on-click-modal="false"
    v-model="syllabusItemsDialog"
    :title="dialogType == '1' ? $t('button.add') : $t('button.modify')"
    @close="cancelDialog"
  >
    <el-form ref="addForm" :model="dialogForm" :rules="dialogRules" label-width="80px">
      <!-- 训练科目 -->
      <el-form-item :label="$t('table.trainingSubjects')" required prop="name">
        <el-input :placeholder="$t('holder.pleaseEnter')" v-model="dialogForm.name" />
      </el-form-item>
      <!-- 训练类型 -->
      <el-form-item :label="$t('table.trainingType')" prop="courseType">
        <el-select v-model="dialogForm.courseType" :placeholder="$t('holder.pleaseSelect')">
          <el-option
            v-for="item in coursewareTypeList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <!-- 授课学时 -->
      <el-form-item :label="$t('table.teachingHours')" required prop="time">
        <el-input :placeholder="$t('holder.pleaseEnter')" type="number" v-model="dialogForm.time" />
      </el-form-item>
      <!-- 简写名称 -->
      <el-form-item prop="shortName" :label="$t('table.contentAbbreviation')">
        <el-input :placeholder="$t('holder.pleaseEnter')" v-model="dialogForm.shortName" />
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
  import {
    getSyllabusItems,
    deleteSyllabusItemsId,
    postSyllabusItems,
    putSyllabusItemsId,
  } from '/@/api/ftm/teacher/teachingPlan'
  export default {
    props: ['id'],
    data() {
      return {
        form: {
          sort: undefined,
          order: 'asc',
          syllabusId: undefined,
          type: 'GROUND_THEORY',
          level: 0,
        },
        dialogForm: {
          name: '',
          courseType: undefined,
          time: '',
        },
        dialogRules: {
          name: [{ required: true, message: this.$t('holder.pleaseFillForm') }],
          courseType: [{ required: true, message: this.$t('holder.pleaseFillForm') }],
          time: [{ required: true, message: this.$t('holder.pleaseFillForm') }],
          shortName: [{ required: true, message: this.$t('holder.pleaseFillForm') }],
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
          { field: 'name', title: this.$t('status.train') },
          {
            field: 'courseType',
            title: this.$t('table.trainingType'),
            formatter: this.formatCoursewareType,
          },
          // { field: "coursewareType", title: this.$t('table.taskForShort'), width: 140 },
          { field: 'period', title: this.$t('table.classHours') },
          {
            field: 'lastModifiedDate',
            title: this.$t('table.updateTime'),
            formatter: this.formatDate,
            width: 200,
          },
          {
            title: this.$t('table.tableEdit'),
            slots: { default: 'operate' },
          },
        ],
        tablePage: {
          page: 1,
          size: 10,
          total: 0,
        },
        syllabusItemsDialog: false,
        syllabusItemsId: undefined,
        dialogType: '', // 弹窗类型 #1 新增 #2 修改
        coursewareTypeList: [
          {
            id: 'COURSE_TYPE',
            name: this.$t('table.sourse'),
          },
          {
            id: 'EXAM_TYPE',
            name: this.$t('status.examination'),
          },
        ],
      }
    },
    computed: {
      xTable() {
        return this.$refs.xTable?.$refs?.xTable
      },
    },
    components: {
      VxeTable,
      selectedView,
    },
    created() {
      this.form.syllabusId = this.id
      this.getSyllabusItems()
    },
    methods: {
      formatCoursewareType({ cellValue }) {
        let item = this.coursewareTypeList.find((v) => v.id == cellValue) || {}
        return item.name
      },
      selectAllEvent({ checked, records }) {
        this.records = records.map((v) => v.id)
        this.$emit('selected', this.records)
      },
      getClearAll() {
        this.records = []
        // this.xTable?.clearSelectEvent()
        this.$emit('selected', this.records)
      },
      add() {
        this.$router.push({
          path: 'syllabus/details',
        })
      },
      modify(row) {
        this.dialogType = '2'
        this.syllabusItemsDialog = true
        this.syllabusItemsId = row.id
        this.dialogForm.name = row.name
        this.dialogForm.courseType = row.courseType
        this.dialogForm.time = row.period
        this.dialogForm.shortName = row.shortName
      },
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
        this.dialogForm = {
          name: '',
          courseType: undefined,
          time: '',
        }
        this.$refs.addForm.resetFields()
      },
      // 添加数据
      async addSyllabusItem() {
        let params = {
          syllabusId: this.form.syllabusId,
          name: this.dialogForm.name,
          courseType: this.dialogForm.courseType,
          period: this.dialogForm.time,
          type: 'GROUND_THEORY',
          shortName: this.dialogForm.shortName,
        }
        this.$refs.addForm.validate(async (bool) => {
          if (bool) {
            let [err] = await to(postSyllabusItems(params))
            if (!err) {
              this.$message.success(this.$t('tip.addsuccessTip'))
              this.getSyllabusItems()
              this.cancelDialog()
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
          courseType: this.dialogForm.courseType,
          period: this.dialogForm.time,
          type: 'GROUND_THEORY',
        }
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
        return cellValue == 'FLIGHT_PRACTICE'
          ? this.$t('table.simulatorTrain')
          : this.$t('status.groundTheory')
      },
    },
  }
</script>
<style lang="scss" scoped>
  .el-select {
    width: 100%;
  }
</style>
